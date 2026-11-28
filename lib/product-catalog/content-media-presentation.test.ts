import assert from "node:assert/strict";
import {
  enrichUnifiedCatalogProduct,
  isPublicCatalogAsset,
  overlayApprovedProductPresentation,
} from "./content-media-presentation";
import { parseApprovedProductContent } from "./locale-media-core";
import { resolveProductMediaUploadGate } from "./product-media-upload-gate";
import { validateProductMediaBytes } from "./product-media-bytes";
import type { UnifiedCatalogProduct } from "./types";

assert.equal(isPublicCatalogAsset("/brand/mark.svg"), true);
assert.equal(isPublicCatalogAsset("https://cdn.example/logo.png"), true);
assert.equal(isPublicCatalogAsset("products/kompis_web/logo/abc.png"), false);
assert.equal(
  isPublicCatalogAsset("products/kompis_web/logo/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee.png"),
  false,
);

const approved = parseApprovedProductContent({
  found: true,
  channel: "app",
  product_key: "kompis_web",
  content_missing: false,
  requested_locale: "en",
  locale: "en",
  title: "Buddy Web",
  tagline: "Clear answers",
  description: "Visitor help",
  benefits: ["FAQ"],
  logo_path: "products/kompis_web/logo/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee.png",
  hero_path: null,
  fallback: null,
});
assert.ok(approved);

const overlay = overlayApprovedProductPresentation({
  title: "Registry",
  tagline: "Tag",
  description: "Body",
  logoSrc: "/brand/mark.svg",
  heroImagePath: "/brand/hero.png",
  approved,
});
assert.equal(overlay.title, "Buddy Web");
assert.equal(overlay.logoSrc, "/brand/mark.svg");
assert.equal(overlay.logoPath, approved?.logoPath);
assert.equal(overlay.contentSource, "core");

const baseProduct: UnifiedCatalogProduct = {
  productKey: "kompis_web",
  sku: "KW",
  category: "kompis",
  storeCategoryId: "kompis",
  productType: "main",
  dependsOnProductKeys: [],
  title: "Registry",
  tagline: "Tag",
  description: "Body",
  localeApproved: false,
  logoSrc: "/brand/mark.svg",
  heroImagePath: "/brand/hero.png",
  accent: "violet",
  letter: "K",
  openHref: null,
  moduleKey: null,
  app: { status: "published", visibleInStore: true, source: "core" },
  sale: { status: "published", visibleInStore: true, source: "core" },
  customerPrice: { currency: "NOK", fromMonthly: 499, fromYearly: null, status: "planned_not_stripe_live" },
  commission: { kind: "fixed", amount: 500, currency: "NOK" },
  purchaseReadiness: "info_only",
  entitlementActive: false,
  variants: [],
  coreProductId: "uuid",
  updatedAt: null,
};

const withSigned = enrichUnifiedCatalogProduct({
  product: baseProduct,
  approved,
  signedLogoUrl: "https://signed.example/logo",
  signedHeroUrl: null,
});
assert.equal(withSigned.title, "Buddy Web");
assert.equal(withSigned.logoSrc, "https://signed.example/logo");
assert.equal(withSigned.heroImagePath, null);
assert.deepEqual(withSigned.benefits, ["FAQ"]);
assert.equal(withSigned.contentSource, "core");
// Price/commission untouched by content overlay.
assert.equal(withSigned.customerPrice.fromMonthly, 499);
assert.equal(withSigned.commission.kind, "fixed");

const missingApproved = parseApprovedProductContent({
  found: true,
  channel: "app",
  product_key: "kompis_web",
  content_missing: true,
  requested_locale: "es",
  logo_path: null,
  hero_path: null,
  fallback: "registry",
});
const fallback = enrichUnifiedCatalogProduct({
  product: baseProduct,
  approved: missingApproved,
});
assert.equal(fallback.title, "Registry");
assert.equal(fallback.logoSrc, "/brand/mark.svg");
assert.equal(fallback.contentSource, "registry_fallback");
assert.deepEqual(fallback.benefits, []);

// Negative media bytes: SVG / spoofed MIME
const svg = new TextEncoder().encode("<svg xmlns='http://www.w3.org/2000/svg'></svg>");
assert.equal(validateProductMediaBytes(svg, "image/svg+xml").ok, false);
const pngMagic = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
assert.equal(validateProductMediaBytes(pngMagic, "image/jpeg").ok, false);

// Production fail-closed even if activation mis-set
const prodGate = resolveProductMediaUploadGate({
  PRODUCT_MEDIA_UPLOAD_ACTIVATION: "staging",
  VERCEL_ENV: "production",
  AIPIFY_CORE_ENV: "production",
});
assert.equal(prodGate.uploadEnabled, false);
assert.equal(prodGate.reason, "production_closed");

console.log("content-media-presentation.test.ts: ok");
