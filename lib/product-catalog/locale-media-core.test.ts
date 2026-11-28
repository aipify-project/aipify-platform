import assert from "node:assert/strict";
import {
  applyApprovedContentToPresentation,
  parseApprovedProductContent,
  PARTNER_CONTENT_REUSE_NOTES,
  PRODUCT_LOCALE_MEDIA_RPCS,
  isProductContentLocale,
} from "./locale-media-core";
import { PRODUCT_CATALOG_FIELD_OWNERSHIP } from "./field-ownership";

assert.equal(PRODUCT_LOCALE_MEDIA_RPCS.getApproved, "csp_get_approved_product_content");
assert.equal(PARTNER_CONTENT_REUSE_NOTES.appStripsCommission, true);
assert.equal(PARTNER_CONTENT_REUSE_NOTES.checkoutFailClosed, true);
assert.ok(isProductContentLocale("no"));
assert.ok(isProductContentLocale("es"));
assert.equal(isProductContentLocale("fr"), false);

const missing = parseApprovedProductContent({
  found: true,
  channel: "app",
  product_key: "kompis_web",
  content_missing: true,
  requested_locale: "en",
  logo_path: null,
  hero_path: null,
  fallback: "registry",
  commission: null,
});
assert.ok(missing);
assert.equal(missing.contentMissing, true);
assert.equal(missing.fallback, "registry");

const present = parseApprovedProductContent({
  found: true,
  channel: "app",
  product_key: "kompis_web",
  content_missing: false,
  requested_locale: "en",
  locale: "en",
  title: "Buddy Web",
  tagline: "Clear answers",
  description: "Visitor help",
  benefits: ["FAQ", "Knowledge", 3, ""],
  logo_path: "products/kompis_web/logo.png",
  hero_path: null,
  fallback: null,
  commission: null,
});
assert.ok(present);
assert.equal(present.title, "Buddy Web");
assert.deepEqual(present.benefits, ["FAQ", "Knowledge"]);
assert.equal(present.logoPath, "products/kompis_web/logo.png");

const mergedMissing = applyApprovedContentToPresentation({
  title: "Registry title",
  tagline: "Registry tag",
  description: "Registry body",
  logoSrc: "/brand/mark.svg",
  heroImagePath: null,
  content: missing,
});
assert.equal(mergedMissing.contentSource, "registry_fallback");
assert.equal(mergedMissing.title, "Registry title");
assert.equal(mergedMissing.logoSrc, "/brand/mark.svg");

const mergedCore = applyApprovedContentToPresentation({
  title: "Registry title",
  tagline: "Registry tag",
  description: "Registry body",
  logoSrc: "/brand/mark.svg",
  heroImagePath: null,
  content: present,
});
assert.equal(mergedCore.contentSource, "core");
assert.equal(mergedCore.title, "Buddy Web");
assert.equal(mergedCore.logoSrc, "products/kompis_web/logo.png");
assert.deepEqual(mergedCore.benefits, ["FAQ", "Knowledge"]);

assert.equal(
  PRODUCT_CATALOG_FIELD_OWNERSHIP.localeCopyApproved,
  "core_channel_sql_pending",
);
assert.equal(
  PRODUCT_CATALOG_FIELD_OWNERSHIP.mediaPathsPersisted,
  "core_channel_sql_pending",
);

assert.equal(parseApprovedProductContent({ found: false, error: "forbidden" }), null);

console.log("locale-media-core.test.ts: ok");
