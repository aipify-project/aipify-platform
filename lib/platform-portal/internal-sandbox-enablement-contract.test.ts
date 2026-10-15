import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { LOCALES } from "@/lib/i18n/config";
import {
  CUSTOMER_CREATE_ENVIRONMENT_TYPE_RPC_CONNECTED,
  CUSTOMER_CREATE_INTERNAL_ENVIRONMENT_AUTHORIZED,
  resolveCustomerCreateEnvironmentType,
} from "./customer-environment-type-contract";
import { CUSTOMER_CREATE_EXECUTE_ENABLED } from "./create-customer-prepare";
import { KOMPIS_BEDRIFT_ACTIVATE_OWNER_ALLOWLIST } from "./kompis-bedrift-activation";
import {
  FORBIDDEN_SANDBOX_COLLISION_SLUGS,
  INTERNAL_CUSTOMER_CREATE_HELPER_FLIP_AUTHORIZED,
  INTERNAL_DEMO_BEDRIFT_ENTITLEMENT_HELPER_FLIP_AUTHORIZED,
  INTERNAL_DEMO_BEDRIFT_ENTITLEMENT_RPC_CONNECTED,
  INTERNAL_DEMO_BEDRIFT_ENTITLEMENT_SQL_PATH,
  INTERNAL_DEMO_BEDRIFT_ENTITLEMENT_SQL_SHA256,
  INTERNAL_SANDBOX_ENABLEMENT_EXECUTE_ENABLED,
  assertInternalSandboxEnablementIsFailClosed,
  buildInternalSandboxEnablementPacket,
  evaluateSandboxOrganizationNumberSafety,
} from "./internal-sandbox-enablement-contract";

assert.ok(assertInternalSandboxEnablementIsFailClosed());
assert.equal(INTERNAL_SANDBOX_ENABLEMENT_EXECUTE_ENABLED, false);
assert.equal(INTERNAL_DEMO_BEDRIFT_ENTITLEMENT_RPC_CONNECTED, false);
assert.equal(INTERNAL_CUSTOMER_CREATE_HELPER_FLIP_AUTHORIZED, false);
assert.equal(INTERNAL_DEMO_BEDRIFT_ENTITLEMENT_HELPER_FLIP_AUTHORIZED, false);
assert.equal(CUSTOMER_CREATE_INTERNAL_ENVIRONMENT_AUTHORIZED, false);
assert.equal(CUSTOMER_CREATE_EXECUTE_ENABLED, false);
assert.equal(CUSTOMER_CREATE_ENVIRONMENT_TYPE_RPC_CONNECTED, true);
assert.equal(KOMPIS_BEDRIFT_ACTIVATE_OWNER_ALLOWLIST.size, 0);

const forged = resolveCustomerCreateEnvironmentType({
  requested: "internal",
  serverInternalAuthorized: false,
});
assert.equal(forged.ok, false);
if (!forged.ok) {
  assert.equal(forged.code, "internal_environment_not_authorized");
}

const production = resolveCustomerCreateEnvironmentType({ requested: null });
assert.equal(production.ok, true);
if (production.ok) {
  assert.equal(production.value.resolved, "production");
  assert.equal(production.value.coreWouldPersistToday, "production");
  assert.equal(production.value.enforcementStatus, "enforced");
}

const unonightCollision = evaluateSandboxOrganizationNumberSafety({
  ownerStatedOrganizationNumber: "937978960",
  organizationNumberVerified: false,
  collision: {
    organizationNumber: "937978960",
    matchingCustomerId: "32d748eb-9a66-4174-a416-18a813610d3e",
    matchingSlug: "unonight",
    matchingEnvironmentType: "pilot",
  },
});
assert.ok(
  unonightCollision.some(
    (g) =>
      g.code === "organization_number_collides_unonight" && g.satisfied === false,
  ),
);
assert.ok(FORBIDDEN_SANDBOX_COLLISION_SLUGS.includes("unonight"));

const packet = buildInternalSandboxEnablementPacket({
  collision: {
    organizationNumber: "937978960",
    matchingCustomerId: "32d748eb-9a66-4174-a416-18a813610d3e",
    matchingSlug: "unonight",
    matchingEnvironmentType: "pilot",
  },
});
assert.equal(packet.mode, "prepare");
assert.equal(packet.dryRun, true);
assert.equal(packet.executeEnabled, false);
assert.equal(packet.sideEffects.appliesSql, false);
assert.equal(packet.sideEffects.createsCustomer, false);
assert.equal(packet.sideEffects.grantsKompisBedrift, false);
assert.equal(packet.sideEffects.mutatesUnoNight, false);
assert.equal(packet.proposedEntitlement.billable, false);
assert.equal(packet.proposedEntitlement.usesCommercialSubscription, false);
assert.equal(packet.proposedEntitlement.sqlApplied, false);
assert.equal(
  packet.nextOwnerDecision.id,
  "d2m_apply_internal_demo_bedrift_entitlement_sql",
);
assert.ok(
  packet.gates.some(
    (g) =>
      g.code === "organization_number_collides_unonight" && !g.satisfied,
  ),
);
assert.ok(
  packet.gates.some(
    (g) =>
      g.code === "exposure_triggers_block_commercial_subscription_path",
  ),
);

assert.ok(existsSync(INTERNAL_DEMO_BEDRIFT_ENTITLEMENT_SQL_PATH));
const sql = readFileSync(INTERNAL_DEMO_BEDRIFT_ENTITLEMENT_SQL_PATH, "utf8");
const sha = createHash("sha256").update(sql).digest("hex");
assert.equal(sha, INTERNAL_DEMO_BEDRIFT_ENTITLEMENT_SQL_SHA256);
assert.match(sql, /NOT_APPLIED/);
assert.match(sql, /DO NOT EXECUTE/i);
assert.match(
  sql,
  /_platform_portal_internal_demo_bedrift_entitlement_authorized/,
);
assert.match(sql, /internal_demo_entitlement_exception/);
assert.match(sql, /select false/i);
assert.doesNotMatch(sql, /unonight/i);
assert.doesNotMatch(sql, /UnoNight/);
assert.doesNotMatch(sql, /937978960/);
assert.doesNotMatch(sql, /aipify-internal-bedrift-demo/);
assert.doesNotMatch(INTERNAL_DEMO_BEDRIFT_ENTITLEMENT_SQL_PATH, /supabase\/migrations\//);

const createRoute = readFileSync(
  "app/api/platform-portal/customers/route.ts",
  "utf8",
);
assert.match(createRoute, /selectCustomerCreateEnvironmentTypeForRpc/);
assert.match(createRoute, /authorizedInternalCreateIntent:\s*false/);
assert.match(createRoute, /p_environment_type:\s*envSelection\.p_environment_type/);
assert.doesNotMatch(createRoute, /p_environment_type:\s*["']internal["']/);

for (const locale of LOCALES) {
  const platform = JSON.parse(
    readFileSync(`locales/${locale}/platform.json`, "utf8"),
  );
  const enablement = platform.customers?.internalSandboxEnablement;
  assert.ok(enablement, `missing enablement keys in ${locale}`);
  for (const key of [
    "title",
    "summary",
    "notLive",
    "orgnrCollisionUnoNight",
    "entitlementExceptionPending",
    "nextGateSqlOnly",
  ]) {
    assert.equal(typeof enablement[key], "string", `${locale}.${key}`);
    assert.ok(enablement[key].length > 0, `${locale}.${key} empty`);
  }
  const reasons = platform.customers?.kompisBedrift?.reasons;
  assert.equal(
    typeof reasons?.internalDemoEntitlementExceptionOk,
    "string",
    locale,
  );
  assert.equal(
    typeof reasons?.internalDemoEntitlementExceptionMissing,
    "string",
    locale,
  );
}

const frozen = JSON.parse(
  readFileSync(
    "docs/integrations/website-kompis-public-chain-frozen-manifest.json",
    "utf8",
  ),
);
let ok = 0;
for (const row of frozen.protectedRuntimeFiles) {
  const h = createHash("sha256").update(readFileSync(row.path)).digest("hex");
  if (h === row.sha256) ok += 1;
}
assert.equal(ok, frozen.protectedRuntimeFiles.length);

console.log("internal-sandbox-enablement-contract: all tests passed");
