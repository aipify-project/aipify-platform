import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  PRODUCT_MEDIA_ALLOWED_MIME,
  PRODUCT_MEDIA_CONTROL_OWNERSHIP,
  PRODUCT_MEDIA_MAX_BYTES,
  PRODUCT_MEDIA_STORAGE_BUCKET,
  PRODUCT_MEDIA_UPLOAD_API_CONTRACT,
  buildProductMediaObjectPath,
  isProductMediaPath,
} from "./product-media-storage-contract";

const root = process.cwd();
const sqlPath = join(
  root,
  "docs/platform/sql-candidates/csp_product_media_storage_executable_v1.sql",
);
const stubPath = join(
  root,
  "docs/platform/sql-candidates/NOT_APPLIED_csp_product_media_storage_v1.sql",
);
const sql = readFileSync(sqlPath, "utf8");
const sha256 = createHash("sha256").update(sql).digest("hex");

assert.equal(PRODUCT_MEDIA_STORAGE_BUCKET, "csp-product-media");
assert.equal(PRODUCT_MEDIA_MAX_BYTES, 2097152);
assert.deepEqual([...PRODUCT_MEDIA_ALLOWED_MIME], [
  "image/png",
  "image/jpeg",
  "image/webp",
]);
assert.equal(PRODUCT_MEDIA_UPLOAD_API_CONTRACT.productionUploadActivated, false);
assert.ok(PRODUCT_MEDIA_CONTROL_OWNERSHIP.uploadApiRequired.length >= 4);

const path = buildProductMediaObjectPath({
  productKey: "kompis_web",
  kind: "logo",
  objectId: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
  mime: "image/png",
});
assert.equal(
  path,
  "products/kompis_web/logo/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee.png",
);
assert.equal(isProductMediaPath(path), true);
assert.equal(isProductMediaPath("products/kompis_web/logo/x.svg"), false);

assert.match(sql, /PREPARED_ONLY/);
assert.match(sql, /DO NOT APPLY without exact owner YES/);
assert.match(sql, /csp-product-media/);
assert.match(sql, /2097152/);
assert.match(sql, /image\/png/);
assert.match(sql, /image\/jpeg/);
assert.match(sql, /image\/webp/);
assert.doesNotMatch(sql, /image\/svg\+xml/);
assert.match(sql, /is_platform_admin/);
assert.match(sql, /csp_product_media_insert_admin/);
assert.match(sql, /csp_product_media_select_channel_registered/);
assert.doesNotMatch(sql, /for delete/i);
assert.doesNotMatch(sql, /to anon/);
assert.match(sql, /_csp_product_media_path_ok/);
assert.match(sql, /_csp_product_media_object_readable/);

// Documentation stub must remain untouched when present on branch.
try {
  const stub = readFileSync(stubPath, "utf8");
  const stubSha = createHash("sha256").update(stub).digest("hex");
  assert.match(stub, /NOT_APPLIED/);
  assert.equal(
    stubSha,
    "ebbaa026094dfe8f3e48ede50df8a00afc1d6ddbce18944184a8134969eb673a",
  );
  assert.notEqual(sha256, stubSha);
} catch (err) {
  const code = (err as NodeJS.ErrnoException).code;
  if (code !== "ENOENT") throw err;
  // Stub lives on PR #526 until merged; absence on main-only branch is OK.
}

console.log(
  JSON.stringify(
    {
      sql: "docs/platform/sql-candidates/csp_product_media_storage_executable_v1.sql",
      sha256,
      status: "APPROVAL_READY",
      bucket: PRODUCT_MEDIA_STORAGE_BUCKET,
    },
    null,
    2,
  ),
);
console.log("product-media-storage-contract.test.ts: ok");
