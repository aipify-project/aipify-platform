import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { EKE_CENTER_SHARED_LOAD_SQL_APPROVAL } from "./controlled-sql-approval-request";

const ROOT = process.cwd();
const MIGRATION_REL =
  "supabase/migrations/20261938300000_employee_knowledge_center_rpc_volatile.sql";

assert.equal(
  EKE_CENTER_SHARED_LOAD_SQL_APPROVAL.targetProject.ref,
  "qbcqoixhrvhnuwphefvw"
);
assert.equal(EKE_CENTER_SHARED_LOAD_SQL_APPROVAL.migrationFile, MIGRATION_REL);
assert.equal(
  EKE_CENTER_SHARED_LOAD_SQL_APPROVAL.status,
  "PRODUCTION_APPLIED_2026_10_14"
);

const sql = readFileSync(join(ROOT, MIGRATION_REL), "utf8");
assert.match(
  sql,
  /alter function public\.get_customer_employee_knowledge_center\(\)\s+volatile;/
);
assert.ok(!sql.toLowerCase().includes("drop table"));
assert.ok(!sql.toLowerCase().includes("disable row level security"));
assert.ok(!sql.toLowerCase().includes("create or replace function"));
assert.match(sql, /Does not touch Website Kompis Public Chain/);

const body = EKE_CENTER_SHARED_LOAD_SQL_APPROVAL.exactSql.replace(/\s+/g, " ").trim();
assert.ok(sql.replace(/\s+/g, " ").includes(body));

const sha256 = createHash("sha256").update(sql).digest("hex");
assert.equal(
  sha256,
  "505ba90585507368dd2afb1711784eb97d254083e14909f855fd1808e423aa81",
  "migration SHA256 must match RESULT gate hash; update both if SQL changes"
);

console.log("center-rpc-volatility-contract.test.ts: PASS");
console.log("migration_sha256=", sha256);
