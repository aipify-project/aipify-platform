import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  authorizeProductOperation,
  authorizeSalesPartnerOperation,
  buildFreeAccessEntitlement,
  buildLicenseCapacityView,
  buildSalesPartnerLicenseSnapshotFromCoreRow,
  buildSnapshotsForOwnerTenant,
  decideSeatActivationForOwner,
  detectDependencyCycle,
  listSellerProgramAccess,
  readSalesPartnerLicenseSnapshots,
  resolveEffectiveEntitlement,
  resolveEffectiveLicenseStatus,
  computeGraceUntil,
  type EntitlementRecord,
} from "./index";
import { NOW, T_A, T_B } from "./test-fixtures";
import { AIPIFY_INTERNAL_PROGRAM_OWNER_TENANT_KEY, simulateConcurrentSeatActivations } from "@/lib/sales-partner-commercial-license";
import type { SalesPartnerLicenseSnapshot } from "@/lib/sales-partner-commercial-license";

const root = process.cwd();

function row(over: Record<string, unknown> = {}) {
  return {
    program_id: "prog_a",
    owner_tenant_id: T_A,
    kind: "tenant_commercial",
    status: "active",
    source: "paid_subscription",
    license_level_key: "level_x",
    max_active_sellers: 3,
    active_seller_count: 1,
    expires_at: "2027-06-01T00:00:00.000Z",
    ...over,
  };
}

function snap(over: Partial<SalesPartnerLicenseSnapshot> = {}): SalesPartnerLicenseSnapshot {
  const built = buildSalesPartnerLicenseSnapshotFromCoreRow(row(), NOW);
  assert.equal(built.ok, true);
  if (!built.ok) throw new Error("fixture");
  return { ...built.snapshot, ...over };
}

// ----------------------------------------------------------------- A. license snapshot

test("A: snapshot from Core row — null seat cap stays null, explicit 0 stays 0", () => {
  const unset = buildSalesPartnerLicenseSnapshotFromCoreRow(row({ max_active_sellers: null }), NOW);
  const zero = buildSalesPartnerLicenseSnapshotFromCoreRow(row({ max_active_sellers: 0 }), NOW);
  assert.ok(unset.ok && unset.snapshot.maxActiveSellers === null);
  assert.ok(zero.ok && zero.snapshot.maxActiveSellers === 0);
});

test("A: invalid rows are rejected, never coerced", () => {
  const bad = (over: Record<string, unknown>) => buildSalesPartnerLicenseSnapshotFromCoreRow(row(over), NOW);
  assert.deepEqual(bad({ max_active_sellers: "5" }), { ok: false, reason: "max_active_sellers_invalid" });
  assert.deepEqual(bad({ max_active_sellers: -1 }), { ok: false, reason: "max_active_sellers_invalid" });
  assert.deepEqual(bad({ max_active_sellers: 1.5 }), { ok: false, reason: "max_active_sellers_invalid" });
  assert.deepEqual(bad({ active_seller_count: -1 }), { ok: false, reason: "active_seller_count_invalid" });
  assert.deepEqual(bad({ kind: "bogus" }), { ok: false, reason: "kind_invalid" });
  assert.deepEqual(bad({ status: "bogus" }), { ok: false, reason: "status_invalid" });
  assert.deepEqual(bad({ source: "bogus" }), { ok: false, reason: "source_invalid" });
  assert.deepEqual(bad({ program_id: "" }), { ok: false, reason: "program_id_required" });
  assert.deepEqual(bad({ owner_tenant_id: null }), { ok: false, reason: "owner_tenant_required" });
  assert.deepEqual(bad({ expires_at: "not-a-date" }), { ok: false, reason: "expires_at_invalid" });
  assert.deepEqual(buildSalesPartnerLicenseSnapshotFromCoreRow(null, NOW), { ok: false, reason: "row_invalid" });
});

test("A: entitlement expiry — stale 'active' row past expires_at is expired; internal system never expires", () => {
  assert.equal(resolveEffectiveLicenseStatus("active", "2026-11-01T00:00:00.000Z", NOW), "expired");
  assert.equal(resolveEffectiveLicenseStatus("active", "2027-01-01T00:00:00.000Z", NOW), "active");
  assert.equal(resolveEffectiveLicenseStatus("internal_system", "2020-01-01T00:00:00.000Z", NOW), "internal_system");
  assert.equal(resolveEffectiveLicenseStatus("suspended", "2030-01-01T00:00:00.000Z", NOW), "suspended");
  const b = buildSalesPartnerLicenseSnapshotFromCoreRow(row({ expires_at: "2026-11-01T00:00:00.000Z" }), NOW);
  assert.ok(b.ok && b.snapshot.status === "expired");
});

test("A: tenant A/B isolation — foreign tenant rows are dropped and reported", () => {
  const rows = [row(), row({ program_id: "prog_b", owner_tenant_id: T_B })];
  const r = buildSnapshotsForOwnerTenant(rows, T_A, NOW);
  assert.equal(r.snapshots.length, 1);
  assert.equal(r.snapshots[0].program.ownerTenantId, T_A);
  assert.deepEqual(r.rejected, [{ index: 1, reason: "cross_tenant_forbidden" }]);
});

test("A: free approved Aipify Partner never requires a paid license", () => {
  for (const status of ["approved", "active", "certified", "in_academy"]) {
    assert.deepEqual(authorizeSalesPartnerOperation({ kind: "aipify_certified_free", cspPartnerStatus: status }), {
      allowed: true,
      basis: "partner_identity",
    });
  }
  for (const status of [null, undefined, "pending", "rejected", "suspended", "under_review"]) {
    const d = authorizeSalesPartnerOperation({ kind: "aipify_certified_free", cspPartnerStatus: status as string | null });
    assert.equal(d.allowed, false);
  }
});

test("A: free partner statuses stay identical to the CSP portal gate (regression)", () => {
  const src = readFileSync(join(root, "lib/certified-sales-partner/partner-access.ts"), "utf8");
  const m = src.match(/CSP_PARTNER_PORTAL_ALLOWED_STATUSES = \[([\s\S]*?)\] as const/);
  assert.ok(m);
  const statuses = [...m![1].matchAll(/"([a-z_]+)"/g)].map((x) => x[1]).sort();
  for (const s of statuses) {
    assert.equal(authorizeSalesPartnerOperation({ kind: "aipify_certified_free", cspPartnerStatus: s }).allowed, true);
  }
  assert.equal(statuses.length, 4);
});

test("A: commercial program — paid license required; missing/expired/suspended/cross-tenant closed", () => {
  const ok = authorizeSalesPartnerOperation({ kind: "tenant_commercial", callerTenantId: T_A, license: snap() });
  assert.deepEqual(ok, { allowed: true, basis: "commercial_license" });
  assert.deepEqual(authorizeSalesPartnerOperation({ kind: "tenant_commercial", callerTenantId: T_A, license: null }), {
    allowed: false,
    reason: "license_snapshot_missing",
  });
  assert.deepEqual(authorizeSalesPartnerOperation({ kind: "tenant_commercial", callerTenantId: T_B, license: snap() }), {
    allowed: false,
    reason: "cross_tenant_forbidden",
  });
  for (const [status, reason] of [
    ["missing", "license_missing"],
    ["expired", "license_expired"],
    ["suspended", "license_suspended"],
  ] as const) {
    assert.deepEqual(
      authorizeSalesPartnerOperation({ kind: "tenant_commercial", callerTenantId: T_A, license: snap({ status }) }),
      { allowed: false, reason },
    );
  }
});

test("A: capacity view — null ≠ 0, notification at limit, never a purchase CTA", () => {
  const unset = buildLicenseCapacityView(snap({ maxActiveSellers: null }));
  assert.equal(unset.capacityConfigured, false);
  assert.equal(unset.seatsRemaining, null);
  assert.equal(unset.notification, null);

  const zero = buildLicenseCapacityView(snap({ maxActiveSellers: 0, activeSellerCount: 0 }));
  assert.equal(zero.capacityConfigured, true);
  assert.equal(zero.seatsRemaining, 0);
  assert.equal(zero.capacityReached, true);

  const full = buildLicenseCapacityView(snap({ maxActiveSellers: 3, activeSellerCount: 3 }));
  assert.equal(full.capacityReached, true);
  assert.equal(full.notification?.deliveryImplemented, false);
  assert.equal(full.notification?.purchaseCtaAllowed, false);
  assert.equal(full.notification?.ownerTenantId, T_A);
});

test("A: atomic capacity — concurrent activations never exceed the cap; grace blocks new seats", () => {
  const license = snap({ maxActiveSellers: 3, activeSellerCount: 1 });
  const sim = simulateConcurrentSeatActivations({ license, callerOwnerTenantId: T_A, attempts: 10 });
  assert.deepEqual(sim, { accepted: 2, rejected: 8, finalActiveCount: 3 });

  const grace = decideSeatActivationForOwner({ license: snap({ status: "grace_period" }), membership: null, callerOwnerTenantId: T_A });
  assert.equal(grace.ok, false);
  const cross = decideSeatActivationForOwner({ license, membership: null, callerOwnerTenantId: T_B });
  assert.deepEqual(cross, { ok: false, reason: "cross_tenant_forbidden" });
  const unconfigured = decideSeatActivationForOwner({ license: snap({ maxActiveSellers: null }), membership: null, callerOwnerTenantId: T_A });
  assert.deepEqual(unconfigured, { ok: false, reason: "capacity_not_configured" });
});

test("A: multi-program membership stays program-scoped; membership without readable license is not operational", () => {
  const a = snap();
  const b = snap({ program: { programId: "prog_b", ownerTenantId: T_B, kind: "tenant_commercial" }, status: "expired" });
  const out = listSellerProgramAccess({
    snapshots: [a, b],
    sellerUserId: "seller_1",
    memberships: [
      { membershipId: "m1", programId: "prog_a", sellerUserId: "seller_1", role: "seller", status: "active" },
      { membershipId: "m2", programId: "prog_b", sellerUserId: "seller_1", role: "seller", status: "active" },
      { membershipId: "m3", programId: "prog_unknown", sellerUserId: "seller_1", role: "seller", status: "active" },
      { membershipId: "m4", programId: "prog_a", sellerUserId: "seller_2", role: "seller", status: "active" },
      { membershipId: "m5", programId: "prog_a", sellerUserId: "seller_1", role: "seller", status: "removed" },
    ],
  });
  assert.equal(out.length, 2);
  assert.equal(out.find((x) => x.programId === "prog_a")?.mayOperate, true);
  assert.equal(out.find((x) => x.programId === "prog_b")?.mayOperate, false);
  assert.ok(!out.some((x) => x.programId === "prog_unknown"));
});

test("A: internal Aipify program key stays reserved and distinct", () => {
  assert.equal(AIPIFY_INTERNAL_PROGRAM_OWNER_TENANT_KEY, "aipify_group_internal");
});

// --------------------------------------------------------------- A. APP thin read helper

function rpcClient(result: { data?: unknown; error?: { code?: string; message?: string } | null }, calls: Array<{ name: string; args: unknown }> = []) {
  return {
    rpc: async (name: string, args?: Record<string, unknown>) => {
      calls.push({ name, args });
      return { data: result.data ?? null, error: result.error ?? null };
    },
  };
}

test("A: APP read helper — RPC missing is fail-closed with no purchase CTA", async () => {
  const r = await readSalesPartnerLicenseSnapshots(
    rpcClient({ error: { code: "PGRST202", message: "Could not find the function public.get_sales_partner_program_license_snapshot" } }),
    { organizationId: T_A, now: NOW },
  );
  assert.equal(r.ready, false);
  assert.equal(r.purchaseCtaAllowed, false);
  if (!r.ready) {
    assert.equal(r.failClosed, true);
    assert.equal(r.reason, "rpc_missing");
  }
});

test("A: APP read helper — tenant required, error payloads and malformed payloads close", async () => {
  assert.equal((await readSalesPartnerLicenseSnapshots(rpcClient({}), { organizationId: "" })).ready, false);
  const notFound = await readSalesPartnerLicenseSnapshots(rpcClient({ data: { ok: false, error: "program_not_found" } }), { organizationId: T_A });
  assert.ok(!notFound.ready && notFound.reason === "program_not_found");
  const bad = await readSalesPartnerLicenseSnapshots(rpcClient({ data: [1, 2] }), { organizationId: T_A });
  assert.ok(!bad.ready && bad.reason === "payload_invalid");
  const badRow = await readSalesPartnerLicenseSnapshots(
    rpcClient({ data: { ok: true, owner_tenant_id: T_A, program_id: "p", program_kind: "tenant_commercial", status: "weird", source: "none" } }),
    { organizationId: T_A },
  );
  assert.ok(!badRow.ready);
});

test("A: APP read helper — success maps the flat Core row; wrong tenant in payload is a leak and closes", async () => {
  const calls: Array<{ name: string; args: unknown }> = [];
  const payload = {
    ok: true,
    program_id: "prog_a",
    owner_tenant_id: T_A,
    program_kind: "tenant_commercial",
    status: "active",
    source: "paid_subscription",
    license_level_key: "level_x",
    max_active_sellers: 5,
    active_seller_count: 2,
    expires_at: "2027-06-01T00:00:00Z",
  };
  const ok = await readSalesPartnerLicenseSnapshots(rpcClient({ data: payload }, calls), { organizationId: T_A, now: NOW });
  assert.ok(ok.ready);
  if (ok.ready) {
    assert.equal(ok.snapshots.length, 1);
    assert.equal(ok.snapshots[0].maxActiveSellers, 5);
    assert.equal(ok.purchaseCtaAllowed, false);
  }
  assert.equal(calls[0].name, "get_sales_partner_program_license_snapshot");
  assert.deepEqual(calls[0].args, { p_owner_tenant_id: T_A });

  const leak = await readSalesPartnerLicenseSnapshots(rpcClient({ data: { ...payload, owner_tenant_id: T_B } }), { organizationId: T_A });
  assert.ok(!leak.ready && leak.reason === "cross_tenant_forbidden");
});

// ------------------------------------------------------------------- B. entitlement

function paid(over: Partial<EntitlementRecord> = {}): EntitlementRecord {
  return {
    entitlementId: "e1",
    tenantId: T_A,
    productKey: "kompis_web",
    variantKey: "standard",
    interval: "month",
    state: "active",
    source: "paid",
    validFrom: "2026-11-18T00:00:00.000Z",
    validUntil: "2026-12-18T00:00:00.000Z",
    graceUntil: null,
    ...over,
  };
}

test("B: catalog browse never needs a license or even a tenant", () => {
  assert.deepEqual(
    authorizeProductOperation({ callerTenantId: null, operation: "browse_catalog", productKey: "kompis_web", entitlements: [], now: NOW }),
    { allowed: true, reason: "catalog_browse_open" },
  );
});

test("B: operating requires an active entitlement for the caller's tenant", () => {
  const base = { operation: "operate" as const, productKey: "kompis_web", now: NOW };
  assert.deepEqual(authorizeProductOperation({ ...base, callerTenantId: T_A, entitlements: [] }), {
    allowed: false,
    reason: "entitlement_missing",
    detail: "kompis_web",
  });
  assert.equal(authorizeProductOperation({ ...base, callerTenantId: "", entitlements: [paid()] }).allowed, false);
  assert.equal(authorizeProductOperation({ ...base, callerTenantId: T_A, entitlements: [paid()] }).allowed, true);
  // Tenant B only sees tenant A's record => hard cross-tenant refusal, never a grant.
  assert.deepEqual(authorizeProductOperation({ ...base, callerTenantId: T_B, entitlements: [paid()] }), {
    allowed: false,
    reason: "cross_tenant_forbidden",
    detail: "kompis_web",
  });
});

test("B: absence of an entitlement is not free access; explicit free access is", () => {
  assert.equal(
    authorizeProductOperation({ callerTenantId: T_A, operation: "operate", productKey: "free_tool", entitlements: [], now: NOW }).allowed,
    false,
  );
  const free = buildFreeAccessEntitlement({ tenantId: T_A, productKey: "free_tool", grantedAt: NOW.toISOString() });
  assert.equal(authorizeProductOperation({ callerTenantId: T_A, operation: "operate", productKey: "free_tool", entitlements: [free], now: NOW }).allowed, true);
  assert.equal(authorizeProductOperation({ callerTenantId: T_B, operation: "operate", productKey: "free_tool", entitlements: [free], now: NOW }).allowed, false);
});

test("B: states and validity — pending, suspended, revoked, canceled, expired never operate", () => {
  for (const state of ["pending_payment", "suspended", "revoked", "canceled", "expired"] as const) {
    assert.equal(resolveEffectiveEntitlement(paid({ state }), NOW).mayOperate, false, state);
  }
  assert.equal(resolveEffectiveEntitlement(null, NOW).mayOperate, false);
});

test("B: expiry is time-driven — active past validUntil becomes expired, or grace when configured", () => {
  const later = new Date("2026-12-19T00:00:00.000Z");
  assert.equal(resolveEffectiveEntitlement(paid(), later).state, "expired");
  const withGrace = paid({ graceUntil: computeGraceUntil("2026-12-18T00:00:00.000Z") });
  const inGrace = resolveEffectiveEntitlement(withGrace, later);
  assert.equal(inGrace.state, "grace_period");
  assert.equal(inGrace.mayOperate, true);
  assert.equal(inGrace.mayExpand, false);
  assert.equal(resolveEffectiveEntitlement(withGrace, new Date("2026-12-22T00:00:00.000Z")).state, "expired");
});

test("B: grace allows operating but blocks expansion; cancel_scheduled runs until period end", () => {
  const g = paid({ state: "grace_period", graceUntil: "2026-12-01T00:00:00.000Z" });
  assert.equal(authorizeProductOperation({ callerTenantId: T_A, operation: "operate", productKey: "kompis_web", entitlements: [g], now: NOW }).allowed, true);
  assert.deepEqual(authorizeProductOperation({ callerTenantId: T_A, operation: "expand_capacity", productKey: "kompis_web", entitlements: [g], now: NOW }), {
    allowed: false,
    reason: "expansion_blocked",
    detail: "grace_period",
  });
  const c = paid({ state: "cancel_scheduled" });
  assert.equal(resolveEffectiveEntitlement(c, NOW).mayOperate, true);
  assert.equal(resolveEffectiveEntitlement(c, new Date("2027-01-01T00:00:00.000Z")).mayOperate, false);
});

test("B: invalid validity fails closed (paid recurring without validUntil, garbage dates)", () => {
  assert.equal(resolveEffectiveEntitlement(paid({ validUntil: null }), NOW).state, "invalid_validity");
  assert.equal(resolveEffectiveEntitlement(paid({ validUntil: "nope" }), NOW).state, "invalid_validity");
  assert.equal(resolveEffectiveEntitlement(paid({ validFrom: "nope" }), NOW).state, "invalid_validity");
  // one-time lifetime purchase may lack validUntil
  assert.equal(resolveEffectiveEntitlement(paid({ interval: "one_time", validUntil: null }), NOW).state, "active");
});

test("B: billing / recovery stays reachable when expired; foreign tenants are never exempt from tenant_required", () => {
  assert.deepEqual(
    authorizeProductOperation({ callerTenantId: T_A, operation: "manage_billing", productKey: "kompis_web", entitlements: [paid({ state: "expired" })], now: NOW }),
    { allowed: true, reason: "billing_recovery_open" },
  );
  assert.equal(authorizeProductOperation({ callerTenantId: null, operation: "manage_billing", productKey: "kompis_web", entitlements: [], now: NOW }).allowed, false);
});

test("B: dependencies must be operational for the same tenant", () => {
  const deps = { kompis_bedrift: ["kompis_web"] };
  const bedrift = paid({ productKey: "kompis_bedrift", entitlementId: "e2" });
  const args = { callerTenantId: T_A, operation: "operate" as const, productKey: "kompis_bedrift", dependencies: deps, now: NOW };
  assert.deepEqual(authorizeProductOperation({ ...args, entitlements: [bedrift] }), { allowed: false, reason: "dependency_missing", detail: "kompis_web" });
  assert.equal(authorizeProductOperation({ ...args, entitlements: [bedrift, paid()] }).allowed, true);
  assert.deepEqual(
    authorizeProductOperation({ ...args, entitlements: [bedrift, paid({ state: "suspended" })] }),
    { allowed: false, reason: "dependency_not_operational", detail: "kompis_web" },
  );
  // Dependency owned by ANOTHER tenant never satisfies this tenant.
  assert.equal(authorizeProductOperation({ ...args, entitlements: [bedrift, paid({ tenantId: T_B })] }).allowed, false);
  assert.deepEqual(detectDependencyCycle({ a: ["b"], b: ["a"] }), ["a", "b", "a"]);
  assert.equal(detectDependencyCycle(deps), null);
});
