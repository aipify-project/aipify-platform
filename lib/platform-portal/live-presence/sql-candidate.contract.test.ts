import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const sqlPath = join(
  process.cwd(),
  "docs/platform/sql-candidates/platform_admin_global_live_status_presence_snapshot_v1.sql",
);
const shaPath = `${sqlPath}.sha256`;
const sql = readFileSync(sqlPath, "utf8");
const recorded = readFileSync(shaPath, "utf8").trim();
const digest = createHash("sha256").update(sql).digest("hex");

assert.equal(digest, recorded, "SQL candidate SHA-256 must match sibling .sha256 file");
assert.match(sql, /PREPARED_ONLY/);
assert.match(sql, /platform_live_presence_heartbeats/);
assert.match(sql, /upsert_platform_live_presence_heartbeat/);
assert.match(sql, /get_platform_admin_live_status_presence_snapshot/);
assert.match(sql, /freshness_window_seconds/);
assert.match(sql, /signed_in_users/);
assert.match(sql, /is_platform_admin\(\)/);
assert.doesNotMatch(sql, /grant execute[\s\S]*service_role/i);
assert.match(sql, /No PII|Aggregates only/i);

console.log("live-presence/sql-candidate.contract.test.ts: ok");
console.log(`sha256=${digest}`);
