import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const sqlPath = join(
  root,
  "docs/platform/sql-candidates/csp_product_locale_media_foundation_v1.sql",
);
const storagePath = join(
  root,
  "docs/platform/sql-candidates/NOT_APPLIED_csp_product_media_storage_v1.sql",
);
const sql = readFileSync(sqlPath, "utf8");
const storage = readFileSync(storagePath, "utf8");
const sha256 = createHash("sha256").update(sql).digest("hex");
const storageSha = createHash("sha256").update(storage).digest("hex");

assert.match(sql, /PREPARED_ONLY/);
assert.match(sql, /DO NOT APPLY without exact owner YES/);
assert.doesNotMatch(sql, /\binsert into public\.csp_sales_products\b/i);
// Channel filters may read publish_app is true; forbid assignment flips.
assert.doesNotMatch(sql, /\bset\s+publish_app\s*=/i);
assert.doesNotMatch(sql, /\bupdate\s+public\.csp_sales_products\b[\s\S]{0,240}\bpublish_(?:app|sale)\s*=/i);
assert.match(sql, /csp_upsert_product_locale_copy/);
assert.match(sql, /csp_list_product_locale_copy/);
assert.match(sql, /csp_get_approved_product_content/);
assert.match(sql, /csp_list_approved_product_content/);
assert.match(sql, /csp_set_product_media_paths/);
assert.match(sql, /benefits/);
assert.match(sql, /approved/);
assert.match(sql, /logo_path/);
assert.match(sql, /hero_path/);
assert.match(sql, /revoke all on function public\.csp_upsert_product_locale_copy/);
assert.match(sql, /grant execute on function public\.csp_get_approved_product_content/);
assert.doesNotMatch(sql, /grant execute[\s\S]{0,80}service_role/);
assert.doesNotMatch(sql, /fixed_commission_amount/);
assert.match(sql, /content_contract',\s*'media_paths_v1'/);
assert.match(sql, /media_path_must_not_be_absolute_url/);

assert.match(storage, /NOT_APPLIED/);
assert.match(storage, /csp-product-media/);
assert.match(storage, /SEPARATE STORAGE-POLICY APPROVAL/);

console.log(
  JSON.stringify(
    {
      sql: "docs/platform/sql-candidates/csp_product_locale_media_foundation_v1.sql",
      sha256,
      storage: "docs/platform/sql-candidates/NOT_APPLIED_csp_product_media_storage_v1.sql",
      storage_sha256: storageSha,
      status: "APPROVAL_READY",
    },
    null,
    2,
  ),
);
console.log("locale-media-sql-contract.test.ts: ok");
