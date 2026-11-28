import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import test from "node:test";
import {
  AIPIFY_INTERNAL_PROGRAM_OWNER_TENANT_KEY,
  assertLedgerPlanesIsolated,
  assertNotificationContractNeverPurchasable,
  assertSameTenantPrograms,
  buildAipifyInternalSystemLicenseSnapshot,
  buildCapacityLimitReachedNotification,
  decideSellerSeatActivation,
  detectMembershipCollision,
  freeAipifyPartnerAccessContract,
  isAipifyInternalSystemLicense,
  isSeatCapacityConfigured,
  membershipKey,
  normalizeLicenseLevelConfig,
  resolveCommercialLicenseOperationalAccess,
  SALES_PARTNER_COMMERCIAL_LICENSE_FOUNDATION,
  simulateConcurrentSeatActivations,
  type SalesPartnerLicenseSnapshot,
} from "./index";

const root = process.cwd();

function commercialSnapshot(
  partial: Partial<SalesPartnerLicenseSnapshot> &
    Pick<SalesPartnerLicenseSnapshot, "status" | "maxActiveSellers" | "activeSellerCount">,
): SalesPartnerLicenseSnapshot {
  return {
    program: {
      programId: "prog_1",
      ownerTenantId: "tenant_a",
      kind: "tenant_commercial",
    },
    source: "paid_subscription",
    licenseLevelKey: "level_custom",
    expiresAt: null,
    ...partial,
  };
}

test("foundation contract: no hardcoded seats/prices; purchase UI forbidden; SQL prepared-only", () => {
  const c = SALES_PARTNER_COMMERCIAL_LICENSE_FOUNDATION;
  assert.equal(c.tenantCommercialProgram.hardcodedSeatLimitsForbidden, true);
  assert.equal(c.tenantCommercialProgram.hardcodedPricesForbidden, true);
  assert.equal(c.purchaseUi.mayClaimPurchasableBeforePaymentIntegration, false);
  assert.equal(c.sqlCandidate.applyStatus, "PREPARED_ONLY");
  assert.equal(c.sqlCandidate.runtimeDependencyForFoundationTs, false);
  assert.equal(c.preservedAppRoutePrefix, "/app/sales-partner");
  assert.equal(c.aipifyCertifiedFreeProgram.purchaseRequired, false);
});

test("free Aipify Partner regression: partner_identity, no commercial SKU", () => {
  const free = freeAipifyPartnerAccessContract();
  assert.equal(free.purchaseRequired, false);
  assert.equal(free.commercialSkuRequired, false);
  assert.equal(free.accessPolicy, "partner_identity");
  assert.ok(free.preservedStatuses.includes("approved"));

  const internal = buildAipifyInternalSystemLicenseSnapshot({});
  assert.equal(isAipifyInternalSystemLicense(internal), true);
  assert.equal(internal.program.ownerTenantId, AIPIFY_INTERNAL_PROGRAM_OWNER_TENANT_KEY);
  assert.equal(internal.status, "internal_system");
});

test("license status fail-closed: missing / expired / suspended", () => {
  for (const status of ["missing", "expired", "suspended"] as const) {
    const access = resolveCommercialLicenseOperationalAccess(
      commercialSnapshot({ status, maxActiveSellers: 5, activeSellerCount: 0 }),
    );
    assert.equal(access.mayOperateProgram, false);
    assert.equal(access.mayActivateSellerSeat, false);
  }
});

test("grace allows operate visibility contract but blocks new seat activation", () => {
  const access = resolveCommercialLicenseOperationalAccess(
    commercialSnapshot({ status: "grace_period", maxActiveSellers: 3, activeSellerCount: 1 }),
  );
  assert.equal(access.mayOperateProgram, true);
  assert.equal(access.mayActivateSellerSeat, false);
  const decision = decideSellerSeatActivation({
    license: commercialSnapshot({
      status: "grace_period",
      maxActiveSellers: 3,
      activeSellerCount: 1,
    }),
    membership: null,
    callerOwnerTenantId: "tenant_a",
  });
  assert.equal(decision.ok, false);
  if (!decision.ok) assert.equal(decision.reason, "license_paused_grace_blocks_activation");
});

test("null capacity ≠ 0; explicit 0 is valid configured cap", () => {
  assert.equal(isSeatCapacityConfigured(null), false);
  assert.equal(isSeatCapacityConfigured(0), true);
  const unset = decideSellerSeatActivation({
    license: commercialSnapshot({ status: "active", maxActiveSellers: null, activeSellerCount: 0 }),
    membership: null,
    callerOwnerTenantId: "tenant_a",
  });
  assert.equal(unset.ok, false);
  if (!unset.ok) assert.equal(unset.reason, "capacity_not_configured");

  const zero = decideSellerSeatActivation({
    license: commercialSnapshot({ status: "active", maxActiveSellers: 0, activeSellerCount: 0 }),
    membership: null,
    callerOwnerTenantId: "tenant_a",
  });
  assert.equal(zero.ok, false);
  if (!zero.ok) assert.equal(zero.reason, "capacity_exhausted");
});

test("atomic seat activation and concurrency: last seat accepts once", () => {
  const license = commercialSnapshot({
    status: "active",
    maxActiveSellers: 2,
    activeSellerCount: 1,
  });
  const first = decideSellerSeatActivation({
    license,
    membership: null,
    callerOwnerTenantId: "tenant_a",
  });
  assert.equal(first.ok, true);
  if (first.ok) {
    assert.equal(first.nextActiveCount, 2);
    assert.equal(first.capacityReachedAfter, true);
  }

  const race = simulateConcurrentSeatActivations({
    license,
    callerOwnerTenantId: "tenant_a",
    attempts: 3,
  });
  assert.equal(race.accepted, 1);
  assert.equal(race.rejected, 2);
  assert.equal(race.finalActiveCount, 2);
});

test("cross-tenant activation forbidden; already-active seller rejected", () => {
  const cross = decideSellerSeatActivation({
    license: commercialSnapshot({ status: "active", maxActiveSellers: 5, activeSellerCount: 0 }),
    membership: null,
    callerOwnerTenantId: "tenant_other",
  });
  assert.equal(cross.ok, false);
  if (!cross.ok) assert.equal(cross.reason, "cross_tenant_forbidden");

  const already = decideSellerSeatActivation({
    license: commercialSnapshot({ status: "active", maxActiveSellers: 5, activeSellerCount: 1 }),
    membership: {
      membershipId: "m1",
      programId: "prog_1",
      sellerUserId: "u1",
      role: "seller",
      status: "active",
    },
    callerOwnerTenantId: "tenant_a",
  });
  assert.equal(already.ok, false);
  if (!already.ok) assert.equal(already.reason, "seller_already_active");
});

test("tenant isolation and multiple memberships without collision", () => {
  const same = assertSameTenantPrograms(
    { programId: "p1", ownerTenantId: "t1", kind: "tenant_commercial" },
    { programId: "p2", ownerTenantId: "t1", kind: "tenant_commercial" },
  );
  assert.equal(same.ok, true);
  const cross = assertSameTenantPrograms(
    { programId: "p1", ownerTenantId: "t1", kind: "tenant_commercial" },
    { programId: "p2", ownerTenantId: "t2", kind: "tenant_commercial" },
  );
  assert.equal(cross.ok, false);

  const mix = assertLedgerPlanesIsolated({
    programKind: "tenant_commercial",
    ledgerPlane: "csp_aipify",
  });
  assert.equal(mix.ok, false);

  const keys = [
    membershipKey("prog_a", "seller_1"),
    membershipKey("prog_b", "seller_1"),
    membershipKey("prog_a", "seller_2"),
  ];
  assert.equal(detectMembershipCollision(keys).collision, false);
  assert.equal(
    detectMembershipCollision([...keys, membershipKey("prog_a", "seller_1")]).collision,
    true,
  );
});

test("capacity notification contract: no delivery, no purchase CTA", () => {
  const atLimit = commercialSnapshot({
    status: "active",
    maxActiveSellers: 2,
    activeSellerCount: 2,
  });
  const payload = buildCapacityLimitReachedNotification(atLimit);
  assert.ok(payload);
  assert.equal(payload!.deliveryImplemented, false);
  assert.equal(assertNotificationContractNeverPurchasable(payload!), true);

  const under = buildCapacityLimitReachedNotification(
    commercialSnapshot({ status: "active", maxActiveSellers: 5, activeSellerCount: 1 }),
  );
  assert.equal(under, null);
});

test("normalizeLicenseLevelConfig never invents seat defaults", () => {
  const level = normalizeLicenseLevelConfig({ licenseLevelKey: "custom_a", label: "Custom A" });
  assert.ok(!("ok" in level && level.ok === false));
  if (!("ok" in level)) {
    assert.equal(level.maxActiveSellers, null);
    assert.equal(level.priceAmountMajor, null);
  }
  const bad = normalizeLicenseLevelConfig({
    licenseLevelKey: "x",
    maxActiveSellers: -1,
  });
  assert.equal("ok" in bad && bad.ok === false, true);
});

test("SQL candidate exists, PREPARED_ONLY, SHA-256 matches sidecar", () => {
  const rel = "docs/platform/sql-candidates/sales_partner_commercial_license_foundation_v1.sql";
  const shaRel = `${rel}.sha256`;
  assert.equal(existsSync(join(root, rel)), true);
  assert.equal(existsSync(join(root, shaRel)), true);
  const sql = readFileSync(join(root, rel), "utf8");
  assert.match(sql, /PREPARED_ONLY/);
  assert.match(sql, /APPLY_BLOCKED_UNTIL_OWNER_YES/);
  assert.match(sql, /assert_sales_partner_seller_capacity/);
  assert.match(sql, /activate_sales_partner_seller_seat/);
  assert.match(sql, /Does NOT create Stripe products/);
  assert.match(sql, /Does NOT enable purchase UI/);
  assert.doesNotMatch(sql, /insert into public\.csp_/i);
  const digest = createHash("sha256").update(sql).digest("hex");
  const sidecar = readFileSync(join(root, shaRel), "utf8").trim().split(/\s+/)[0];
  assert.equal(digest, sidecar);
});

test("phase-b license architecture points at this foundation", () => {
  const phaseB = readFileSync(
    join(root, "lib/sales-partner-app-migration/phase-b-license-contract.ts"),
    "utf8",
  );
  assert.match(phaseB, /sales-partner-commercial-license/);
  assert.match(phaseB, /SALES_PARTNER_COMMERCIAL_LICENSE_FOUNDATION/);
});

console.log("sales-partner-commercial-license foundation.test.ts: ok");
