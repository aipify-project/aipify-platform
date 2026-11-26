import assert from "node:assert/strict";
import test from "node:test";
import {
  listCspAttributionLinks,
  listCspAuditEvents,
  listCspCommissionRates,
  listCspLeadsAndSales,
  listCspSellerRanking,
  type CspAdminClient,
} from "./platform-sellers-lists";
import {
  buildPlatformListBody,
  matchesSearch,
  parseOpsRows,
  parsePartnerQueryParam,
  partnerDeepLink,
  sanitizeAuditDetail,
  saleStatusKind,
} from "./platform-sellers-ops-view";

type Row = Record<string, unknown>;
type TableData = Record<string, { rows?: Row[]; error?: string }>;

/** Minimal thenable stand-in for the Supabase query builder. Filters are ignored on purpose. */
function mockAdmin(tables: TableData): CspAdminClient {
  const from = (table: string) => {
    const entry = tables[table] ?? { rows: [] };
    const result = entry.error
      ? { data: null, error: { message: entry.error } }
      : { data: entry.rows ?? [], error: null };
    const builder: Record<string, unknown> = {};
    for (const m of ["select", "order", "limit", "in", "eq"]) builder[m] = () => builder;
    builder.then = (resolve: (v: unknown) => unknown) => Promise.resolve(result).then(resolve);
    return builder;
  };
  const auth = { admin: { getUserById: async () => ({ data: { user: null } }) } };
  return { from, auth } as unknown as CspAdminClient;
}

test("attribution: counts clicks, unique visits and registrations per link", async () => {
  const admin = mockAdmin({
    csp_attribution_links: {
      rows: [{ id: "l1", partner_id: "p1", code: "ABC", channel_origin: "email", active: true, created_at: "2026-01-01T00:00:00Z" }],
    },
    csp_partner_profiles: { rows: [{ id: "p1", display_name: "Partner One", country: "NO", status: "approved", auth_user_id: null }] },
    csp_attribution_events: {
      rows: [
        { link_id: "l1", event_type: "click" },
        { link_id: "l1", event_type: "click" },
        { link_id: "l1", event_type: "unique_visit" },
      ],
    },
    csp_attributed_registrations: { rows: [{ link_id: "l1" }] },
  });
  const result = await listCspAttributionLinks(admin);
  assert.equal(result.kind, "ok");
  if (result.kind !== "ok") return;
  assert.equal(result.rows.length, 1);
  assert.equal(result.rows[0].clickCount, 2);
  assert.equal(result.rows[0].uniqueVisits, 1);
  assert.equal(result.rows[0].registrationCount, 1);
  assert.equal(result.rows[0].partnerName, "Partner One");
});

test("attribution: rows without id/partner/code are dropped, never invented", async () => {
  const admin = mockAdmin({ csp_attribution_links: { rows: [{ id: "l1", partner_id: null, code: "X" }, { id: "l2" }] } });
  const result = await listCspAttributionLinks(admin);
  assert.deepEqual(result, { kind: "ok", rows: [] });
});

test("list loaders fail closed with the Core error message", async () => {
  const admin = mockAdmin({
    csp_attribution_links: { error: 'relation "csp_attribution_links" does not exist' },
    csp_qualified_sales: { error: "boom" },
    csp_audit_events: { error: "boom" },
    csp_commission_rate_versions: { error: "boom" },
    csp_partner_profiles: { error: "boom" },
  });
  for (const result of [
    await listCspAttributionLinks(admin),
    await listCspLeadsAndSales(admin),
    await listCspAuditEvents(50, admin),
    await listCspCommissionRates(admin),
    await listCspSellerRanking(admin),
  ]) {
    assert.equal(result.kind, "error");
  }
});

test("missing service-role config returns an error result instead of throwing", async () => {
  const prevUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const prevKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  try {
    const result = await listCspAuditEvents();
    assert.equal(result.kind, "error");
  } finally {
    if (prevUrl !== undefined) process.env.NEXT_PUBLIC_SUPABASE_URL = prevUrl;
    if (prevKey !== undefined) process.env.SUPABASE_SERVICE_ROLE_KEY = prevKey;
  }
});

test("leads & sales: merges registrations and qualified sales, newest first, amounts only from Core", async () => {
  const admin = mockAdmin({
    csp_qualified_sales: {
      rows: [
        { id: "s1", partner_id: "p1", product_id: "prod1", status: "earned", attributed_at: "2026-03-01T00:00:00Z", snapshot_amount: "500", snapshot_currency: "NOK", paid_periods_count: 2 },
      ],
    },
    csp_attributed_registrations: { rows: [{ id: "r1", partner_id: "p1", attributed_at: "2026-04-01T00:00:00Z" }] },
    csp_sales_products: { rows: [{ id: "prod1", product_key: "kompis_web" }] },
    csp_partner_profiles: { rows: [{ id: "p1", display_name: "Partner One", country: "NO", status: "approved", auth_user_id: null }] },
  });
  const result = await listCspLeadsAndSales(admin);
  assert.equal(result.kind, "ok");
  if (result.kind !== "ok") return;
  assert.deepEqual(result.rows.map((r) => r.kind), ["registration", "qualified_sale"]);
  assert.equal(result.rows[0].amount, null, "registrations never carry an amount");
  assert.equal(result.rows[1].amount, 500);
  assert.equal(result.rows[1].productKey, "kompis_web");
});

test("commission rates: falls back to current product amounts only when no versions exist", async () => {
  const admin = mockAdmin({
    csp_commission_rate_versions: { rows: [] },
    csp_sales_products: { rows: [{ id: "prod1", product_key: "kompis_web", fixed_commission_amount: 750, currency: "NOK", updated_at: "2026-02-01T00:00:00Z" }] },
  });
  const result = await listCspCommissionRates(admin);
  assert.equal(result.kind, "ok");
  if (result.kind !== "ok") return;
  assert.equal(result.rows[0].amount, 750);
  assert.equal(result.rows[0].id, "current-prod1");
});

test("ranking: orders by clicks, then registrations, then qualified sales", async () => {
  const admin = mockAdmin({
    csp_partner_profiles: {
      rows: [
        { id: "a", display_name: "A", country: "NO", status: "approved", auth_user_id: null },
        { id: "b", display_name: "B", country: "SE", status: "approved", auth_user_id: null },
      ],
    },
    csp_attribution_links: { rows: [{ id: "l1", partner_id: "a" }, { id: "l2", partner_id: "b" }] },
    csp_attribution_events: { rows: [{ link_id: "l2", event_type: "click" }, { link_id: "l2", event_type: "click" }, { link_id: "l1", event_type: "click" }] },
    csp_attributed_registrations: { rows: [] },
    csp_qualified_sales: { rows: [] },
  });
  const result = await listCspSellerRanking(admin);
  assert.equal(result.kind, "ok");
  if (result.kind !== "ok") return;
  assert.deepEqual(result.rows.map((r) => r.partnerId), ["b", "a"]);
});

test("API envelope: ok → found rows; table missing → 503 not ready; other errors → 500 without detail", () => {
  assert.deepEqual(buildPlatformListBody({ kind: "ok", rows: [{ id: 1 }] }), {
    status: 200,
    body: { found: true, rows: [{ id: 1 }] },
  });
  const notApplied = buildPlatformListBody({ kind: "error", detail: 'relation "x" does not exist' });
  assert.equal(notApplied.status, 503);
  assert.equal(notApplied.body.found, false);
  assert.equal(notApplied.body.backend_ready, false);
  const failed = buildPlatformListBody({ kind: "error", detail: "connection reset by peer" });
  assert.equal(failed.status, 500);
  assert.equal(JSON.stringify(failed.body).includes("connection"), false);
});

test("parseOpsRows only accepts a found:true rows envelope", () => {
  assert.equal(parseOpsRows({ found: false, error: "x" }), null);
  assert.equal(parseOpsRows({ found: true }), null);
  assert.equal(parseOpsRows(null), null);
  assert.deepEqual(parseOpsRows<{ a: number }>({ found: true, rows: [{ a: 1 }, 3, null] }), [{ a: 1 }]);
});

test("audit detail sanitizer drops sensitive keys, nested values and e-mail-like values", () => {
  const entries = sanitizeAuditDetail({
    reason: "needs documents",
    new_status: "approved",
    email: "x@example.com",
    bank_account: "123",
    note: "contact me at a@b.example",
    nested: { a: 1 },
    attempt: 3,
  });
  assert.deepEqual(
    entries.map((e) => e.key),
    ["reason", "new_status", "attempt"],
  );
  assert.deepEqual(sanitizeAuditDetail(null), []);
});

test("search, status kinds and partner deep-link helpers", () => {
  assert.equal(matchesSearch(["Partner One", "kompis web"], "one web"), true);
  assert.equal(matchesSearch(["Partner One"], "zzz"), false);
  assert.equal(matchesSearch([], "   "), true);
  assert.equal(saleStatusKind("paid"), "completed");
  assert.equal(saleStatusKind("reversed"), "not_allowed");
  assert.equal(saleStatusKind("registered_awaiting_second_payment"), "waiting");
  assert.equal(partnerDeepLink("abc-123"), "/platform/sellers/partners?partner=abc-123");
  assert.equal(parsePartnerQueryParam("abc-123-def456"), "abc-123-def456");
  assert.equal(parsePartnerQueryParam("<script>"), null);
  assert.equal(parsePartnerQueryParam(undefined), null);
});

console.log("platform-sellers-lists: all tests passed");
