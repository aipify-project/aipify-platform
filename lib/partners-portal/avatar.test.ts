import assert from "node:assert/strict";
import {
  PARTNERS_AVATAR_MAX_BYTES,
  buildPartnersAvatarPointer,
  buildPartnersAvatarStoragePath,
  detectPartnersAvatarMime,
  resolvePartnersAvatarPointer,
  validatePartnersAvatarBytes,
} from "./avatar";
import { isAppScopedPath, isPartnersAppScopedPath } from "../i18n/app-scoped-path";

const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0]);
const webp = new Uint8Array([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50]);
const svg = new TextEncoder().encode("<svg xmlns='http://www.w3.org/2000/svg'></svg>");

assert.equal(detectPartnersAvatarMime(png), "image/png");
assert.equal(detectPartnersAvatarMime(jpeg), "image/jpeg");
assert.equal(detectPartnersAvatarMime(webp), "image/webp");
assert.equal(detectPartnersAvatarMime(svg), null);

assert.deepEqual(validatePartnersAvatarBytes(png, "image/png"), { ok: true, mime: "image/png", byteSize: png.length });
assert.deepEqual(validatePartnersAvatarBytes(png, "image/jpeg"), { ok: false, code: "unsupported_type" });
assert.deepEqual(validatePartnersAvatarBytes(svg, "image/svg+xml"), { ok: false, code: "unsupported_type" });
assert.deepEqual(validatePartnersAvatarBytes(new Uint8Array(0), "image/png"), { ok: false, code: "empty" });
const big = new Uint8Array(PARTNERS_AVATAR_MAX_BYTES + 1);
big.set(png);
assert.deepEqual(validatePartnersAvatarBytes(big, "image/png"), { ok: false, code: "too_large" });

assert.equal(buildPartnersAvatarStoragePath("abc"), "partner-avatars/abc/avatar");
assert.equal(resolvePartnersAvatarPointer(buildPartnersAvatarPointer(123)), "/api/partners/profile/avatar?v=123");
assert.equal(resolvePartnersAvatarPointer("https://evil.example/x.png"), null);
assert.equal(resolvePartnersAvatarPointer("data:image/png;base64,AAAA"), null);
assert.equal(resolvePartnersAvatarPointer(null), null);

assert.equal(isPartnersAppScopedPath("/partners"), true);
assert.equal(isPartnersAppScopedPath("/partners/account/profile"), true);
assert.equal(isPartnersAppScopedPath("/partners/academy/verify/abc"), false);
assert.equal(isPartnersAppScopedPath("/partnership"), false);
assert.equal(isAppScopedPath("/app/settings"), true);
assert.equal(isAppScopedPath("/"), false);

console.log("partners-portal avatar + locale scope tests passed");
