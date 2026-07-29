import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  formatCommercialAmount,
  mapCommercialPlanRpcError,
  parsePlatformPortalCommercialPlan,
  parsePlatformPortalCommercialPlansPayload,
  parsePlatformPortalCustomerCommercialPlanResult,
  parseSetCommercialPlanInput,
} from "./commercial-plan";
import { parsePlatformPortalCustomerDetail } from "./parse";

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`ok ${name}`);
  } catch (error) {
    console.error(`fail ${name}`);
    throw error;
  }
}

const CUSTOMER = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
const PLAN = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb";

test("parses commercial plan catalog item", () => {
  const plan = parsePlatformPortalCommercialPlan({
    id: PLAN,
    key: "business",
    name: "Business",
    description: "Full suite",
    plan_type: "business",
    billing_cycle: "monthly",
    amount_minor: 699900,
    currency: "NOK",
    trial_days: null,
    active: true,
    supports_lifetime: false,
    supports_recurring: true,
    supports_trial: false,
  });
  assert.ok(plan);
  assert.equal(plan.amountMinor, 699900);
  assert.equal(plan.supportsTrial, false);
});

test("formats amount with two decimals and hides zero/null", () => {
  assert.equal(formatCommercialAmount(null, "NOK", "en"), null);
  assert.equal(formatCommercialAmount(0, "NOK", "en"), null);
  const formatted = formatCommercialAmount(699900, "NOK", "en");
  assert.ok(formatted);
  assert.match(formatted, /6,?999/);
});

test("rejects trial start mode and unknown fields", () => {
  const trial = parseSetCommercialPlanInput(CUSTOMER, {
    planId: PLAN,
    mode: "recurring",
    startMode: "trial",
    internalReason: "manual activation",
    idempotencyKey: "12345678-key",
  });
  assert.equal(trial.ok, false);

  const unknown = parseSetCommercialPlanInput(CUSTOMER, {
    planId: PLAN,
    mode: "recurring",
    startMode: "now",
    internalReason: "manual activation",
    idempotencyKey: "12345678-key",
    price: 100,
  });
  assert.equal(unknown.ok, false);
});

test("accepts valid write input", () => {
  const parsed = parseSetCommercialPlanInput(CUSTOMER, {
    planId: PLAN,
    mode: "lifetime",
    startMode: "now",
    trialDays: null,
    internalReason: "Platform operator assignment",
    idempotencyKey: "idem-key-123456",
  });
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.equal(parsed.value.mode, "lifetime");
});

test("parses write result", () => {
  const parsed = parsePlatformPortalCustomerCommercialPlanResult({
    customer_id: CUSTOMER,
    subscription: {
      id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
      plan_id: PLAN,
      plan_key: "business",
      plan_name: "Business",
      mode: "recurring",
      status: "active",
      trial_starts_at: null,
      trial_ends_at: null,
      current_period_starts_at: "2026-07-01T00:00:00.000Z",
      current_period_ends_at: "2026-08-01T00:00:00.000Z",
      created_at: "2026-07-01T00:00:00.000Z",
      updated_at: "2026-07-01T00:00:00.000Z",
    },
    created: true,
    replaced_subscription_id: null,
    idempotent_replay: false,
  });
  assert.ok(parsed);
  assert.equal(parsed.created, true);
  assert.equal(parsed.subscription.mode, "recurring");
});

test("maps RPC conflicts and auth errors", () => {
  assert.deepEqual(mapCommercialPlanRpcError("ACTIVE_PLAN_CONFLICT"), {
    status: 409,
    code: "active_plan_conflict",
  });
  assert.deepEqual(mapCommercialPlanRpcError("IDEMPOTENCY_CONFLICT"), {
    status: 409,
    code: "idempotency_conflict",
  });
  assert.deepEqual(mapCommercialPlanRpcError("TRIAL_NOT_SUPPORTED"), {
    status: 422,
    code: "trial_not_supported",
  });
  assert.deepEqual(mapCommercialPlanRpcError("Platform portal access denied"), {
    status: 403,
    code: "forbidden",
  });
});

test("migration defines plan listing and write RPC without payment side effects", () => {
  const sql = readFileSync(
    join(
      process.cwd(),
      "supabase/migrations/20261934100000_platform_portal_customer_commercial_plan.sql",
    ),
    "utf8",
  );
  assert.match(sql, /get_platform_portal_commercial_plans/);
  assert.match(sql, /set_platform_portal_customer_commercial_plan/);
  assert.match(sql, /ACTIVE_PLAN_CONFLICT/);
  assert.match(sql, /IDEMPOTENCY_CONFLICT/);
  assert.match(sql, /TRIAL_NOT_SUPPORTED/);
  assert.match(sql, /UNIQUE customer_id|for update/i);
  assert.doesNotMatch(sql, /stripe\.com|create_stripe|stripe_customer/i);
  assert.doesNotMatch(sql, /fiken\.|create_fiken/i);
  assert.doesNotMatch(sql, /ensure_aipify_app_subscription_license/);
  assert.doesNotMatch(sql, /insert into public\.licenses/i);
});

test("API routes are protected and RPC-only", () => {
  const list = readFileSync(
    join(process.cwd(), "app/api/platform-portal/commercial-plans/route.ts"),
    "utf8",
  );
  const write = readFileSync(
    join(
      process.cwd(),
      "app/api/platform-portal/customers/[id]/commercial-plan/route.ts",
    ),
    "utf8",
  );
  assert.match(list, /get_platform_portal_commercial_plans/);
  assert.match(list, /Unauthorized/);
  assert.match(write, /set_platform_portal_customer_commercial_plan/);
  assert.match(write, /idempotentReplay|\? 200 : 201/);
  assert.doesNotMatch(write, /\.from\(/);
});

test("UI panel has submit lock and conflict handling", () => {
  const panel = readFileSync(
    join(
      process.cwd(),
      "components/platform/platform-portal/PlatformPortalCommercialPlanPanel.tsx",
    ),
    "utf8",
  );
  assert.match(panel, /activePlanConflict/);
  assert.match(panel, /disabled=\{/);
  assert.match(panel, /submitting/);
  assert.match(panel, /confirmRequired/);
  assert.match(panel, /internalReason/);
});

test("locale parity for commercial plan namespace", () => {
  const locales = ["en", "no", "da", "sv", "pl", "uk"] as const;
  const en = JSON.parse(
    readFileSync(join(process.cwd(), "locales/en/platform.json"), "utf8"),
  ) as {
    customers: {
      commercialPlan: Record<string, unknown>;
      detail: { managePlan: string };
    };
  };
  for (const locale of locales) {
    const json = JSON.parse(
      readFileSync(join(process.cwd(), `locales/${locale}/platform.json`), "utf8"),
    ) as {
      customers: {
        commercialPlan: Record<string, unknown>;
        detail: { managePlan: string };
      };
    };
    assert.ok(json.customers.detail.managePlan);
    assert.deepEqual(
      Object.keys(json.customers.commercialPlan).sort(),
      Object.keys(en.customers.commercialPlan).sort(),
      `${locale} commercialPlan key mismatch`,
    );
  }
  assert.equal(
    (
      JSON.parse(readFileSync(join(process.cwd(), "locales/no/platform.json"), "utf8")) as {
        customers: { commercialPlan: { managePlan: string; activate: string } };
      }
    ).customers.commercialPlan.managePlan,
    "Administrer avtale",
  );
});

test("Customer Detail parser still accepts baseline payload", () => {
  const detail = parsePlatformPortalCustomerDetail({
    customer: {
      id: CUSTOMER,
      company_id: "dddddddd-dddd-dddd-dddd-dddddddddddd",
      name: "Example",
      legal_name: "Example AS",
      slug: "example",
      organization_number: "999999999",
      status: "active",
      created_at: "2024-01-01T00:00:00.000Z",
      updated_at: "2024-01-01T00:00:00.000Z",
      requires_attention: false,
    },
    commercial: {
      lifetime: false,
      subscription_status: "active",
      plan_name: "Business",
      trial_starts_at: null,
      trial_ends_at: null,
      current_period_starts_at: "2024-01-01T00:00:00.000Z",
      current_period_ends_at: "2024-02-01T00:00:00.000Z",
      partner_attributed: false,
      partner_name: null,
    },
    usage: {
      member_count: 1,
      active_license_count: 0,
      total_license_count: 0,
      domain_count: 0,
      installation_count: 0,
      open_support_count: 0,
    },
    licenses: [],
    domains: [],
    entitlements: [],
    metadata: { generated_at: "2024-01-01T00:00:00.000Z" },
  });
  assert.ok(detail);
  assert.equal(detail.commercial.planName, "Business");
});

test("Detail panel integrates manage plan action", () => {
  const panel = readFileSync(
    join(
      process.cwd(),
      "components/platform/platform-portal/PlatformPortalCustomerDetailPanel.tsx",
    ),
    "utf8",
  );
  assert.match(panel, /PlatformPortalCommercialPlanPanel/);
  assert.match(panel, /labels\.managePlan/);
  assert.match(panel, /commercialPlanLabels/);
});

test("plans payload parser normalizes array", () => {
  const payload = parsePlatformPortalCommercialPlansPayload({
    plans: [
      {
        id: PLAN,
        key: "lifetime",
        name: "Lifetime",
        plan_type: "lifetime",
        billing_cycle: "lifetime",
        amount_minor: null,
        currency: "NOK",
        active: true,
        supports_lifetime: true,
        supports_recurring: false,
        supports_trial: false,
      },
    ],
    generated_at: "2026-07-01T00:00:00.000Z",
  });
  assert.equal(payload.plans.length, 1);
  assert.equal(payload.plans[0].supportsLifetime, true);
});

console.log("all commercial-plan tests passed");
