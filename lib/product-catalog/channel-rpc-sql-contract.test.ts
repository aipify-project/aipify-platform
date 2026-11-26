import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const REL = "docs/platform/sql-candidates/unified_product_catalog_channel_rpc_v1.sql";
const sqlPath = resolve(process.cwd(), REL);
const sql = readFileSync(sqlPath, "utf8");
const sha = createHash("sha256").update(sql).digest("hex");

assert.match(sql, /publish_sale is SALE channel truth/i);
assert.match(sql, /create or replace function public\._csp_sync_sale_publish_flags/);
assert.match(sql, /create or replace function public\.csp_upsert_sales_product/);
assert.match(sql, /create or replace function public\.csp_get_platform_overview/);
assert.match(sql, /create or replace function public\.csp_set_product_channel_flags/);
assert.match(sql, /create or replace function public\.csp_list_app_store_products/);
assert.match(sql, /publish_sale/);
assert.match(sql, /publish_app/);
assert.doesNotMatch(sql, /percent_rate\s*=/);
// Stripe may appear only as out-of-scope commentary — never as executable DDL/DML.
const executable = sql
  .split("\n")
  .filter((line) => !line.trim().startsWith("--"))
  .join("\n");
assert.doesNotMatch(executable, /stripe/i);
assert.match(sql, /Out of scope:.*Stripe/i);
assert.match(sql, /revoke all on function public\.csp_list_app_store_products/i);
assert.match(sql, /grant execute on function public\.csp_list_app_store_products/i);
assert.match(sql, /channel_schema_missing/);
assert.ok(!sql.includes("grant execute") || sql.includes("service_role") || sql.includes("authenticated"));

// Pin expected SHA for owner Staging approval wording.
assert.equal(
  sha,
  "1a4cf73ea426119dd913564e9fc0d5215b921018530553f17f13f72d9f8dee24",
  `RPC candidate SHA drifted — update approval doc. got=${sha}`,
);

console.log("channel-rpc-sql-contract.test.ts: ok", sha);
