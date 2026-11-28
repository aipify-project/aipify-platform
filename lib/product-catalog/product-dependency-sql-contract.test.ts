import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const LEGACY = "docs/platform/sql-candidates/app_store_product_category_type_dependency_v1.sql";
const CANDIDATE = "docs/platform/sql-candidates/app_store_product_dependency_core_foundation_v1.sql";

const legacy = readFileSync(resolve(process.cwd(), LEGACY), "utf8");
const sql = readFileSync(resolve(process.cwd(), CANDIDATE), "utf8");
const sha = createHash("sha256").update(sql).digest("hex");
const legacySha = createHash("sha256").update(legacy).digest("hex");

assert.equal(legacySha, "dfe390bf5a07f0e33e9f2360043f6ee04fe3e7a7ca9bab5ef4f62885cbe5c83c");
assert.match(legacy, /PREPARED_ONLY/);

assert.match(sql, /AUTHORING COMPLETE/);
assert.match(sql, /public\.csp_sales_products/);
assert.match(sql, /add column if not exists product_type/);
assert.match(sql, /add column if not exists depends_on_product_keys/);
assert.match(sql, /add column if not exists category_id/);
assert.match(sql, /DEPENDENCY SEMANTICS = ALL/);
assert.match(sql, /create or replace function public\.csp_list_app_store_products/);
assert.match(sql, /depends_on_product_keys/);
assert.match(sql, /dependency_semantics', 'all'/);
assert.match(sql, /create or replace function public\.csp_set_app_store_product_taxonomy/);
assert.match(sql, /_csp_product_dependency_has_cycle/);
assert.match(sql, /revoke all on function public\.csp_list_app_store_products/);
assert.match(sql, /grant execute on function public\.csp_list_app_store_products\(\) to authenticated/);
assert.match(sql, /is_platform_admin/);
assert.doesNotMatch(sql, /grant .* on table public\.csp_sales_products to (anon|authenticated)/i);

const executable = sql
  .split("\n")
  .filter((line) => !line.trim().startsWith("--"))
  .join("\n");
assert.doesNotMatch(executable, /stripe/i);
assert.doesNotMatch(executable, /insert into public\.csp_sales_products/i);
// List filter `where p.publish_app = true` is allowed; forbid mutation / backfill flips.
assert.doesNotMatch(executable, /set\s+publish_app\s*=/i);
assert.doesNotMatch(executable, /publish_app\s*=\s*true(?!\s*\n\s*and\s+p\.master_active)/i);
assert.doesNotMatch(sql, /csp_product_variants/);
assert.doesNotMatch(sql, /csp_variant_commission/);

// Pin SHA for owner approval wording (update this assertion when intentionally revising).
assert.equal(
  sha,
  readFileSync(resolve(process.cwd(), `${CANDIDATE}.sha256`), "utf8").trim().split(/\s+/)[0],
  `foundation candidate SHA drifted — rebuild .sha256. got=${sha}`,
);

console.log("product-dependency-sql-contract.test.ts: PASS", sha);
