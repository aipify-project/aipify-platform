/**
 * D2H — Static contract for disposable-DB dry-run artifacts.
 * Does not connect to any database.
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  CUSTOMER_CREATE_ENVIRONMENT_TYPE_RPC_CONNECTED,
  CUSTOMER_CREATE_INTERNAL_ENVIRONMENT_AUTHORIZED,
  CUSTOMER_CREATE_INTERNAL_ENV_EXECUTABLE_SQL_V1_SUPERSEDED_PATH,
  CUSTOMER_CREATE_INTERNAL_ENV_EXECUTABLE_SQL_V1_SUPERSEDED_SHA256,
} from "./customer-environment-type-contract";

// D2H validated the superseded D2G v1 bytes — keep that historical identity.
const sqlPath = CUSTOMER_CREATE_INTERNAL_ENV_EXECUTABLE_SQL_V1_SUPERSEDED_PATH;
const sql = readFileSync(sqlPath, "utf8");
const sha = createHash("sha256").update(sql).digest("hex");
assert.equal(sha, CUSTOMER_CREATE_INTERNAL_ENV_EXECUTABLE_SQL_V1_SUPERSEDED_SHA256);
assert.equal(
  sha,
  "83056fb8fbf9c80293da68237ef8a4045ddfae96257669c8de7e5a4b6890733b",
);
assert.equal(CUSTOMER_CREATE_ENVIRONMENT_TYPE_RPC_CONNECTED, false);
assert.equal(CUSTOMER_CREATE_INTERNAL_ENVIRONMENT_AUTHORIZED, false);

const fixture = readFileSync(
  "docs/platform/d2h_disposable_db_fixture_baseline_v1.sql",
  "utf8",
);
assert.match(fixture, /LOCAL ONLY|disposable/i);
assert.match(fixture, /_ppsf258_require_platform_access/);
assert.doesNotMatch(fixture, /937978960/);
assert.doesNotMatch(fixture, /aipify-internal-bedrift-demo/);
assert.doesNotMatch(fixture, /admin@aipify\.ai/);

const matrix = readFileSync(
  "docs/platform/d2h_disposable_db_test_matrix_v1.sql",
  "utf8",
);
assert.match(matrix, /INTERNAL_ENVIRONMENT_SUPER_ADMIN_REQUIRED/);
assert.match(matrix, /INTERNAL_ENVIRONMENT_NOT_AUTHORIZED/);
assert.match(matrix, /INTERNAL_CUSTOMER_EXTERNAL_EXPOSURE_FORBIDDEN/);
assert.match(matrix, /LOCAL FIXTURE ONLY/);

const result = readFileSync(
  "AIPIFY_KOMPIS_BEDRIFT_D2H_INTERNAL_ENV_DISPOSABLE_DB_DRYRUN_V1_RESULT.md",
  "utf8",
);
assert.match(result, /READY FOR OWNER APPLY DECISION/);
assert.match(result, /127\.0\.0\.1:55432/);
assert.match(result, /NOT performed|NOT RUN/);
assert.doesNotMatch(result, /applied to Production/i);

const manifest = JSON.parse(
  readFileSync(
    "docs/integrations/website-kompis-public-chain-frozen-manifest.json",
    "utf8",
  ),
) as { protectedRuntimeFiles: Array<{ path: string; sha256: string }> };
let frozenOk = 0;
for (const row of manifest.protectedRuntimeFiles) {
  const h = createHash("sha256")
    .update(readFileSync(path.join(process.cwd(), row.path)))
    .digest("hex");
  assert.equal(h, row.sha256, row.path);
  frozenOk += 1;
}
assert.equal(frozenOk, 46);

console.log(
  JSON.stringify(
    {
      static_d2h_contract: "PASS",
      sql_sha256: sha,
      frozen: `${frozenOk}/46`,
      db_connection_in_this_test: "NONE",
    },
    null,
    2,
  ),
);
