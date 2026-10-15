/**
 * D2G — Static security contract for the executable NOT_APPLIED Core SQL.
 * Distinguishes STATIC PASS from DB integration (NOT RUN without local DB apply).
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import {
  CUSTOMER_CREATE_ENVIRONMENT_TYPE_RPC_CONNECTED,
  CUSTOMER_CREATE_INTERNAL_ENVIRONMENT_AUTHORIZED,
  CUSTOMER_CREATE_INTERNAL_ENV_EXECUTABLE_SQL_PATH,
  CUSTOMER_CREATE_INTERNAL_ENV_EXECUTABLE_SQL_SHA256,
  CUSTOMER_CREATE_INTERNAL_ENV_EXECUTABLE_SQL_V1_SUPERSEDED_PATH,
  CUSTOMER_CREATE_INTERNAL_ENV_EXECUTABLE_SQL_V1_SUPERSEDED_SHA256,
  assertEnvironmentTypeContractIsPrepareOnly,
} from "./customer-environment-type-contract";

const sqlPath = CUSTOMER_CREATE_INTERNAL_ENV_EXECUTABLE_SQL_PATH;
const sql = readFileSync(sqlPath, "utf8");
const sha = createHash("sha256").update(sql).digest("hex");

assert.equal(sha, CUSTOMER_CREATE_INTERNAL_ENV_EXECUTABLE_SQL_SHA256);
assert.match(sqlPath, /v1_1_service_role_grant\.sql$/);
assert.match(sqlPath, /^docs\/platform\//);
assert.doesNotMatch(sqlPath, /supabase\/migrations\//);
assert.match(sql, /NOT_APPLIED/);
assert.match(sql, /DO NOT AUTO-DEPLOY|DO NOT EXECUTE/i);
assert.match(sql, /SUPERSEDES/);
assert.match(sql, /service_role/);

const nonCommentLines = sql
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line.length > 0 && !line.startsWith("--"));
assert.ok(
  nonCommentLines.length >= 200,
  `expected executable draft body, got ${nonCommentLines.length} non-comment lines`,
);

assert.match(
  sql,
  /p_environment_type text default 'production'/,
);
assert.match(sql, /INTERNAL_ENVIRONMENT_SUPER_ADMIN_REQUIRED/);
assert.match(sql, /INTERNAL_ENVIRONMENT_NOT_AUTHORIZED/);
assert.match(sql, /INTERNAL_CUSTOMER_EXTERNAL_EXPOSURE_FORBIDDEN/);
assert.match(sql, /ENVIRONMENT_TYPE_IMMUTABLE/);
assert.match(sql, /_platform_portal_is_active_super_admin/);
assert.match(sql, /_platform_portal_internal_customer_create_authorized/);
assert.match(sql, /select false/i);
assert.match(sql, /pa\.role = 'super_admin'/);
assert.match(
  sql,
  /drop function if exists public\.create_platform_portal_customer\(text, text, text, text, text\)/i,
);
assert.match(
  sql,
  /grant execute on function public\.create_platform_portal_customer\(\s*text, text, text, text, text, text\s*\)\s*to authenticated/i,
);
assert.match(
  sql,
  /grant execute on function public\.create_platform_portal_customer\(\s*text, text, text, text, text, text\s*\)\s*to service_role/i,
);
assert.match(sql, /trg_block_internal_customer_subscriptions/);
assert.match(sql, /trg_block_internal_customer_installations/);
assert.match(sql, /'environment_type', v_environment_type/);

// Superseded D2G v1 must remain byte-stable and must NOT be the apply candidate.
const v1 = readFileSync(
  CUSTOMER_CREATE_INTERNAL_ENV_EXECUTABLE_SQL_V1_SUPERSEDED_PATH,
  "utf8",
);
const v1Sha = createHash("sha256").update(v1).digest("hex");
assert.equal(
  v1Sha,
  CUSTOMER_CREATE_INTERNAL_ENV_EXECUTABLE_SQL_V1_SUPERSEDED_SHA256,
);
assert.notEqual(v1Sha, sha);
assert.doesNotMatch(
  v1,
  /grant execute on function public\.create_platform_portal_customer\(\s*text, text, text, text, text, text\s*\)\s*to service_role/i,
);

// Fail-closed Platform authorize/execute gates remain off (RPC may be connected post-D2L).
assert.equal(CUSTOMER_CREATE_ENVIRONMENT_TYPE_RPC_CONNECTED, true);
assert.equal(CUSTOMER_CREATE_INTERNAL_ENVIRONMENT_AUTHORIZED, false);
assert.ok(assertEnvironmentTypeContractIsPrepareOnly());

// Must not seed the planned sandbox identity.
for (const forbidden of [
  "937978960",
  "aipify-internal-bedrift-demo",
  "admin@aipify.ai",
  "Aipify Group AS",
]) {
  assert.equal(
    sql.includes(forbidden),
    false,
    `executable SQL must not hardcode ${forbidden}`,
  );
}

// Must not appear under supabase/migrations/
const migrationsDir = "supabase/migrations";
const migrationFiles = existsSync(migrationsDir)
  ? readdirSync(migrationsDir)
  : [];
assert.equal(
  migrationFiles.some((name) =>
    name.includes("internal_environment_enforcement"),
  ),
  false,
);

// Prior comment-only sketch must remain untouched as a separate file.
const commentOnly =
  "docs/platform/NOT_APPLIED_platform_customer_create_environment_type_contract_v1.sql";
const commentSql = readFileSync(commentOnly, "utf8");
const commentSha = createHash("sha256").update(commentSql).digest("hex");
assert.equal(
  commentSha,
  "91eb68b5511c5d940abd6d00d949831a1ab295ca6d6277cea198b622e36f7c5f",
);
const commentExec = commentSql
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line.length > 0 && !line.startsWith("--"));
assert.equal(commentExec.length, 0);

// Ordinary Platform create passes production only (never client-controlled internal).
const createRoute = readFileSync(
  "app/api/platform-portal/customers/route.ts",
  "utf8",
);
assert.match(createRoute, /selectCustomerCreateEnvironmentTypeForRpc/);
assert.match(createRoute, /authorizedInternalCreateIntent:\s*false/);
assert.match(createRoute, /p_environment_type:\s*envSelection\.p_environment_type/);
assert.doesNotMatch(createRoute, /p_environment_type:\s*["']internal["']/);

// Apply plan present with matching SHA (v1.1).
const applyPlan = readFileSync(
  "docs/platform/NOT_APPLIED_platform_customer_create_internal_environment_enforcement_v1_1_APPLY_PLAN.md",
  "utf8",
);
assert.match(applyPlan, /NOT AUTHORIZED TO APPLY/);
assert.match(applyPlan, new RegExp(CUSTOMER_CREATE_INTERNAL_ENV_EXECUTABLE_SQL_SHA256));
assert.match(applyPlan, /service_role/);
assert.match(
  applyPlan,
  new RegExp(CUSTOMER_CREATE_INTERNAL_ENV_EXECUTABLE_SQL_V1_SUPERSEDED_SHA256),
);

// Frozen Website Kompis public chain 46/46
const manifest = JSON.parse(
  readFileSync(
    "docs/integrations/website-kompis-public-chain-frozen-manifest.json",
    "utf8",
  ),
) as {
  protectedRuntimeFiles: Array<{ path: string; sha256: string }>;
};
let frozenOk = 0;
for (const row of manifest.protectedRuntimeFiles) {
  const bytes = readFileSync(path.join(process.cwd(), row.path));
  const h = createHash("sha256").update(bytes).digest("hex");
  assert.equal(h, row.sha256, `frozen mismatch: ${row.path}`);
  frozenOk += 1;
}
assert.equal(frozenOk, 46);

console.log(
  JSON.stringify(
    {
      static_sql_contract: "PASS",
      sha256: sha,
      non_comment_lines: nonCommentLines.length,
      db_integration_tests: "NOT_RUN",
      reason_db_not_run:
        "Author-only job forbids applying SQL to local/live Core; no disposable DB apply in this packet",
      frozen: `${frozenOk}/46`,
      rpc_connected_flag: CUSTOMER_CREATE_ENVIRONMENT_TYPE_RPC_CONNECTED,
      internal_authorized_flag: CUSTOMER_CREATE_INTERNAL_ENVIRONMENT_AUTHORIZED,
    },
    null,
    2,
  ),
);
