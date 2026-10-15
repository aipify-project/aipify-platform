import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import {
  CUSTOMER_CREATE_CORE_HARDCODED_ENVIRONMENT_TYPE,
  CUSTOMER_CREATE_ENVIRONMENT_TYPE_RPC_CONNECTED,
  CUSTOMER_CREATE_INTERNAL_ENVIRONMENT_AUTHORIZED,
  CUSTOMER_CREATE_INTERNAL_ENV_EXECUTABLE_SQL_PATH,
  CUSTOMER_CREATE_INTERNAL_ENV_EXECUTABLE_SQL_SHA256,
  CUSTOMER_CREATE_INTERNAL_ENV_EXECUTABLE_SQL_V1_SUPERSEDED_PATH,
  CUSTOMER_CREATE_INTERNAL_ENV_EXECUTABLE_SQL_V1_SUPERSEDED_SHA256,
  CUSTOMERS_ENVIRONMENT_TYPE_SCHEMA_VALUES,
  D2F_OWNER_STATED_SANDBOX_IDENTITY,
  PLATFORM_CUSTOMER_CREATE_ENVIRONMENT_TYPES,
  assertEnvironmentTypeContractIsPrepareOnly,
  buildCustomerCreateEnvironmentTypePreparePacket,
  isCustomersEnvironmentTypeSchemaValue,
  isPlatformCustomerCreateEnvironmentType,
  listInternalEnvironmentInvariants,
  resolveCustomerCreateEnvironmentType,
} from "./customer-environment-type-contract";

assert.deepEqual(PLATFORM_CUSTOMER_CREATE_ENVIRONMENT_TYPES, [
  "production",
  "internal",
]);
assert.ok(CUSTOMERS_ENVIRONMENT_TYPE_SCHEMA_VALUES.includes("production"));
assert.ok(CUSTOMERS_ENVIRONMENT_TYPE_SCHEMA_VALUES.includes("internal"));
assert.ok(CUSTOMERS_ENVIRONMENT_TYPE_SCHEMA_VALUES.includes("staging"));
assert.equal(CUSTOMER_CREATE_ENVIRONMENT_TYPE_RPC_CONNECTED, false);
assert.equal(CUSTOMER_CREATE_INTERNAL_ENVIRONMENT_AUTHORIZED, false);
assert.equal(CUSTOMER_CREATE_CORE_HARDCODED_ENVIRONMENT_TYPE, "production");
assert.ok(assertEnvironmentTypeContractIsPrepareOnly());

assert.equal(isPlatformCustomerCreateEnvironmentType("production"), true);
assert.equal(isPlatformCustomerCreateEnvironmentType("internal"), true);
assert.equal(isPlatformCustomerCreateEnvironmentType("staging"), false);
assert.equal(isCustomersEnvironmentTypeSchemaValue("staging"), true);

const defaulted = resolveCustomerCreateEnvironmentType({ requested: null });
assert.equal(defaulted.ok, true);
if (defaulted.ok) {
  assert.equal(defaulted.value.resolved, "production");
  assert.equal(defaulted.value.defaultApplied, true);
  assert.equal(defaulted.value.coreWouldPersistToday, "production");
  assert.equal(defaulted.value.enforcementStatus, "not_enforced");
}

const forged = resolveCustomerCreateEnvironmentType({
  requested: "internal",
  serverInternalAuthorized: false,
});
assert.equal(forged.ok, false);
if (!forged.ok) {
  assert.equal(forged.code, "internal_environment_not_authorized");
}

const invalid = resolveCustomerCreateEnvironmentType({
  requested: "staging",
});
assert.equal(invalid.ok, false);
if (!invalid.ok) {
  assert.equal(invalid.code, "invalid_environment_type");
}

const authorizedInternal = resolveCustomerCreateEnvironmentType({
  requested: "internal",
  serverInternalAuthorized: true,
});
assert.equal(authorizedInternal.ok, true);
if (authorizedInternal.ok) {
  assert.equal(authorizedInternal.value.resolved, "internal");
  assert.equal(authorizedInternal.value.coreWouldPersistToday, "production");
  assert.equal(authorizedInternal.value.enforcementStatus, "prepare_only");
}

const invariants = listInternalEnvironmentInvariants();
assert.ok(invariants.length >= 6);
assert.ok(
  invariants.some(
    (row) =>
      row.key === "persisted_environment_type_internal" &&
      row.enforcedToday === false &&
      row.enforcedAfterExecutableSqlApply === true,
  ),
);
assert.ok(
  invariants.some(
    (row) => row.key === "no_automatic_license_grant" && row.enforcedToday,
  ),
);
assert.ok(
  invariants.some(
    (row) =>
      row.key === "super_admin_only_internal_create" &&
      row.enforcedToday === false &&
      row.enforcedAfterExecutableSqlApply === true,
  ),
);
assert.equal(
  CUSTOMER_CREATE_INTERNAL_ENV_EXECUTABLE_SQL_PATH,
  "docs/platform/NOT_APPLIED_platform_customer_create_internal_environment_enforcement_v1_1_service_role_grant.sql",
);
assert.equal(
  CUSTOMER_CREATE_INTERNAL_ENV_EXECUTABLE_SQL_SHA256,
  "546c60b949f85097479207de8ad9e1a8bbe313e25e0def7d0f2732db70f78584",
);
assert.equal(
  CUSTOMER_CREATE_INTERNAL_ENV_EXECUTABLE_SQL_V1_SUPERSEDED_PATH,
  "docs/platform/NOT_APPLIED_platform_customer_create_internal_environment_enforcement_v1.sql",
);
assert.equal(
  CUSTOMER_CREATE_INTERNAL_ENV_EXECUTABLE_SQL_V1_SUPERSEDED_SHA256,
  "83056fb8fbf9c80293da68237ef8a4045ddfae96257669c8de7e5a4b6890733b",
);
assert.equal(CUSTOMER_CREATE_INTERNAL_ENV_EXECUTABLE_SQL_SHA256.length, 64);

const packet = buildCustomerCreateEnvironmentTypePreparePacket({
  requested: "internal",
  serverInternalAuthorized: false,
});
assert.equal(packet.mode, "prepare");
assert.equal(packet.dryRun, true);
assert.equal(packet.sideEffects.appliesSql, false);
assert.equal(packet.sideEffects.createsCustomer, false);
assert.deepEqual(packet.resolution, {
  error: "internal_environment_not_authorized",
});
assert.equal(packet.ownerStatedSandboxIdentity.legalName, "Aipify Group AS");
assert.equal(
  packet.ownerStatedSandboxIdentity.organizationNumberOwnerStated,
  "937978960",
);
assert.equal(
  packet.ownerStatedSandboxIdentity.organizationNumberVerified,
  false,
);
assert.equal(
  packet.ownerStatedSandboxIdentity.plannedSlug,
  "aipify-internal-bedrift-demo",
);
assert.equal(packet.ownerStatedSandboxIdentity.adminEmail, "admin@aipify.ai");
assert.equal(packet.ownerStatedSandboxIdentity.adminAuthVerified, false);
assert.equal(D2F_OWNER_STATED_SANDBOX_IDENTITY.desiredEnvironmentType, "internal");

const migration = readFileSync(
  "supabase/migrations/20261934400000_platform_portal_customer_creation_global_identity.sql",
  "utf8",
);
assert.match(migration, /environment_type/);
assert.match(migration, /'production'/);
assert.doesNotMatch(
  migration,
  /p_environment_type/,
);

const notAppliedPath =
  "docs/platform/NOT_APPLIED_platform_customer_create_environment_type_contract_v1.sql";
const notApplied = readFileSync(notAppliedPath, "utf8");
assert.match(notApplied, /NOT_APPLIED/);
assert.match(notApplied, /DO NOT EXECUTE/i);
assert.match(notApplied, /p_environment_type/);
assert.match(notApplied, /INTERNAL_ENVIRONMENT_NOT_AUTHORIZED/);
assert.match(notApplied, /It is NOT in supabase\/migrations\//);
assert.doesNotMatch(notAppliedPath, /supabase\/migrations\//);
const sha = createHash("sha256").update(notApplied).digest("hex");
assert.equal(sha.length, 64);
console.log("not_applied_sha256=", sha);

const prepareRoute = readFileSync(
  "app/api/platform-portal/customers/prepare/route.ts",
  "utf8",
);
assert.match(prepareRoute, /environmentResolution/);
assert.match(prepareRoute, /create_execute_not_enabled/);
assert.doesNotMatch(
  prepareRoute,
  /rpc\(\s*["']create_platform_portal_customer["']/,
);

const createRoute = readFileSync(
  "app/api/platform-portal/customers/route.ts",
  "utf8",
);
assert.match(createRoute, /create_platform_portal_customer/);
assert.doesNotMatch(createRoute, /p_environment_type/);

console.log("customer-environment-type-contract: all tests passed");
