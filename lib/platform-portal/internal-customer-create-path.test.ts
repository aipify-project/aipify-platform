import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { LOCALES } from "@/lib/i18n/config";
import { CUSTOMER_CREATE_INTERNAL_ENVIRONMENT_AUTHORIZED } from "./customer-environment-type-contract";
import { CUSTOMER_CREATE_EXECUTE_ENABLED } from "./create-customer-prepare";
import {
  INTERNAL_DEMO_BEDRIFT_ENTITLEMENT_SQL_PATH,
  INTERNAL_DEMO_BEDRIFT_ENTITLEMENT_SQL_SHA256,
} from "./internal-sandbox-enablement-contract";
import {
  INTERNAL_CUSTOMER_CREATE_ACTOR_ALLOWLIST,
  INTERNAL_CUSTOMER_CREATE_HELPER_ALLOWLIST_SQL_PATH,
  INTERNAL_CUSTOMER_CREATE_HELPER_ALLOWLIST_SQL_SHA256,
  INTERNAL_CUSTOMER_CREATE_INTENDED_ADMIN_EMAIL,
  INTERNAL_CUSTOMER_CREATE_INTENDED_SLUG,
  INTERNAL_CUSTOMER_CREATE_PATH_CONTRACT_ID,
  INTERNAL_CUSTOMER_CREATE_PATH_EXECUTE_ENABLED,
  assertInternalCustomerCreatePathClosed,
  buildInternalCustomerCreatePathPacket,
  selectCustomerCreateEnvironmentTypeForRpc,
} from "./internal-customer-create-path";

assert.ok(assertInternalCustomerCreatePathClosed());
assert.equal(INTERNAL_CUSTOMER_CREATE_PATH_EXECUTE_ENABLED, false);
assert.equal(CUSTOMER_CREATE_INTERNAL_ENVIRONMENT_AUTHORIZED, false);
assert.equal(CUSTOMER_CREATE_EXECUTE_ENABLED, false);
assert.equal(INTERNAL_CUSTOMER_CREATE_ACTOR_ALLOWLIST.size, 0);
assert.equal(
  INTERNAL_CUSTOMER_CREATE_INTENDED_ADMIN_EMAIL,
  "admin@aipify.ai",
);
assert.equal(
  INTERNAL_CUSTOMER_CREATE_INTENDED_SLUG,
  "aipify-internal-bedrift-demo",
);

// Ordinary production create — unchanged.
const ordinary = selectCustomerCreateEnvironmentTypeForRpc({
  actorRole: "platform_support",
  actorAuthUserId: "00000000-0000-4000-8000-000000000001",
  authorizedInternalCreateIntent: false,
});
assert.equal(ordinary.path, "ordinary_production");
assert.equal(ordinary.p_environment_type, "production");
assert.equal(ordinary.denialCode, null);
assert.equal(ordinary.gates.coreHelperExpectedToday, false);

// Client-forged internal denied (even for super_admin).
const forged = selectCustomerCreateEnvironmentTypeForRpc({
  actorRole: "super_admin",
  actorAuthUserId: "00000000-0000-4000-8000-000000000002",
  authorizedInternalCreateIntent: false,
  clientEnvironmentType: "internal",
});
assert.equal(forged.path, "denied");
assert.equal(forged.denialCode, "client_forged_internal_environment");
assert.equal(forged.p_environment_type, "production");
assert.equal(forged.clientForgeryAttempt, true);

// platform_support explicitly denied when internal intent is set.
const support = selectCustomerCreateEnvironmentTypeForRpc({
  actorRole: "platform_support",
  actorAuthUserId: "00000000-0000-4000-8000-000000000003",
  authorizedInternalCreateIntent: true,
});
assert.equal(support.path, "denied");
assert.ok(
  support.denialCode === "internal_create_path_execute_disabled" ||
    support.denialCode === "platform_internal_environment_not_authorized" ||
    support.denialCode === "platform_create_execute_disabled" ||
    support.denialCode === "actor_not_super_admin",
);
assert.equal(support.p_environment_type, "production");

// super_admin still denied while gates closed / helper false expected.
const superDenied = selectCustomerCreateEnvironmentTypeForRpc({
  actorRole: "super_admin",
  actorAuthUserId: "00000000-0000-4000-8000-000000000004",
  authorizedInternalCreateIntent: true,
});
assert.equal(superDenied.path, "denied");
assert.equal(superDenied.p_environment_type, "production");
assert.equal(superDenied.gates.coreHelperExpectedToday, false);

const packet = buildInternalCustomerCreatePathPacket();
assert.equal(packet.contractId, INTERNAL_CUSTOMER_CREATE_PATH_CONTRACT_ID);
assert.equal(packet.executeEnabled, false);
assert.equal(packet.intendedIdentity.createAuthorizedInThisJob, false);
assert.equal(packet.namedGatesClosed.coreHelperReturnsFalse, true);
assert.equal(packet.entitlementPathSeparate.sqlApplied, false);
assert.equal(packet.entitlementPathSeparate.billable, false);
assert.equal(
  packet.entitlementPathSeparate.sqlPath,
  INTERNAL_DEMO_BEDRIFT_ENTITLEMENT_SQL_PATH,
);
assert.equal(
  packet.entitlementPathSeparate.sqlSha256,
  INTERNAL_DEMO_BEDRIFT_ENTITLEMENT_SQL_SHA256,
);
assert.match(packet.dependenciesBlockedForFirstCreate.note, /D3/);
assert.equal(packet.sideEffects.createsCustomer, false);
assert.equal(packet.sideEffects.grantsKompisBedrift, false);
assert.equal(packet.sideEffects.mutatesUnoNight, false);
assert.equal(packet.sideEffects.appliesSql, false);

// Helper allowlist SQL draft present, hashed, NOT under migrations.
assert.ok(existsSync(INTERNAL_CUSTOMER_CREATE_HELPER_ALLOWLIST_SQL_PATH));
const helperSql = readFileSync(
  INTERNAL_CUSTOMER_CREATE_HELPER_ALLOWLIST_SQL_PATH,
  "utf8",
);
const helperSha = createHash("sha256").update(helperSql).digest("hex");
assert.equal(helperSha, INTERNAL_CUSTOMER_CREATE_HELPER_ALLOWLIST_SQL_SHA256);
assert.match(helperSql, /NOT_APPLIED/);
assert.match(helperSql, /platform_internal_customer_create_grants/);
assert.match(
  helperSql,
  /_platform_portal_internal_customer_create_authorized/,
);
assert.doesNotMatch(
  INTERNAL_CUSTOMER_CREATE_HELPER_ALLOWLIST_SQL_PATH,
  /supabase\/migrations\//,
);
assert.doesNotMatch(helperSql, /insert into public\.customers/i);
assert.doesNotMatch(helperSql, /tenant_modules/i);
assert.doesNotMatch(
  helperSql,
  /activate_platform_portal_customer_kompis_bedrift/i,
);

// D2M entitlement SQL still NOT_APPLIED and unchanged.
assert.ok(existsSync(INTERNAL_DEMO_BEDRIFT_ENTITLEMENT_SQL_PATH));
const demoSql = readFileSync(INTERNAL_DEMO_BEDRIFT_ENTITLEMENT_SQL_PATH, "utf8");
assert.equal(
  createHash("sha256").update(demoSql).digest("hex"),
  INTERNAL_DEMO_BEDRIFT_ENTITLEMENT_SQL_SHA256,
);

// Create route uses selector and keeps production default.
const createRoute = readFileSync(
  "app/api/platform-portal/customers/route.ts",
  "utf8",
);
assert.match(createRoute, /selectCustomerCreateEnvironmentTypeForRpc/);
assert.match(createRoute, /authorizedInternalCreateIntent:\s*false/);
assert.match(createRoute, /p_environment_type:\s*envSelection\.p_environment_type/);

// Locale keys for all active locales.
for (const locale of LOCALES) {
  const platform = JSON.parse(
    readFileSync(`locales/${locale}/platform.json`, "utf8"),
  );
  const createPath = platform.customers?.internalCustomerCreatePath;
  assert.ok(createPath, `missing create-path keys in ${locale}`);
  for (const key of [
    "title",
    "summary",
    "notAuthorized",
    "ordinaryProductionOnly",
    "nextGateHelperAllowlistSql",
  ]) {
    assert.equal(typeof createPath[key], "string", `${locale}.${key}`);
    assert.ok(createPath[key].length > 0, `${locale}.${key} empty`);
  }
}

console.log("internal-customer-create-path: all tests passed");
