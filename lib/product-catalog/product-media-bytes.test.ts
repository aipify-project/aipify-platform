import assert from "node:assert/strict";
import { detectProductMediaMime, validateProductMediaBytes } from "./product-media-bytes";
import { resolveProductMediaUploadGate } from "./product-media-upload-gate";

const png = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 1, 2, 3]);
assert.equal(detectProductMediaMime(png), "image/png");
assert.equal(validateProductMediaBytes(png, "image/png").ok, true);
assert.equal(validateProductMediaBytes(png, "image/jpeg").ok, false);
assert.equal(validateProductMediaBytes(new Uint8Array(), "image/png").ok, false);

const svg = new TextEncoder().encode("<svg xmlns='http://www.w3.org/2000/svg'></svg>");
assert.equal(detectProductMediaMime(svg), null);
assert.equal(validateProductMediaBytes(svg, "image/svg+xml").ok, false);

const closed = resolveProductMediaUploadGate({
  PRODUCT_MEDIA_UPLOAD_ACTIVATION: "staging",
  VERCEL_ENV: "production",
});
assert.equal(closed.uploadEnabled, false);
assert.equal(closed.reason, "production_closed");

const staging = resolveProductMediaUploadGate({
  PRODUCT_MEDIA_UPLOAD_ACTIVATION: "staging",
  VERCEL_ENV: "preview",
  AIPIFY_CORE_ENV: "staging",
});
assert.equal(staging.uploadEnabled, true);

const unset = resolveProductMediaUploadGate({
  VERCEL_ENV: "development",
});
assert.equal(unset.uploadEnabled, false);
assert.equal(unset.reason, "activation_required");

console.log("product-media-bytes.test.ts: ok");
