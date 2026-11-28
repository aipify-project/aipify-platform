/**
 * APP CX Integrated Master V2 — contract fixtures (local; not signed-in E2E).
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { isKompisWebOperationalPath } from "@/lib/core/access-control-plane/tenant-module-lookup";
import {
  APP_CUSTOMER_JOURNEY_OWNERS,
  APP_SOFTWARE_STORE_ROUTE,
  APP_SUBSCRIPTION_ROUTE,
  appSoftwareDetailHref,
  exploreProductIdToSoftwareKey,
} from "@/lib/product-catalog/app-customer-journey";
import { resolveAppCheckoutCta } from "@/lib/product-catalog/checkout-readiness";
import { resolveProductMediaUploadGate } from "@/lib/product-catalog/product-media-upload-gate";
import { APP_CONTENT_MAX_WIDTH_PX, AppLayoutClasses } from "@/lib/design/app-layout";
import type { UnifiedCatalogProduct } from "@/lib/product-catalog/types";

const root = process.cwd();
const read = (rel: string) => readFileSync(join(root, rel), "utf8");

assert.equal(APP_CONTENT_MAX_WIDTH_PX, 1560);
assert.match(AppLayoutClasses.pageWidth, /1560/);

assert.equal(isKompisWebOperationalPath("/app/software"), false);
assert.equal(isKompisWebOperationalPath("/app/software/kompis_web"), false);
assert.equal(isKompisWebOperationalPath("/app/website-kompis/faq"), true);

assert.equal(exploreProductIdToSoftwareKey("website_kompis"), "kompis_web");
assert.equal(appSoftwareDetailHref("kompis_web"), `${APP_SOFTWARE_STORE_ROUTE}/kompis_web`);

const showcase = read("components/app/software/SoftwareProductShowcase.tsx");
assert.match(showcase, /detailsHref=\{appSoftwareDetailHref/);

const explore = read("components/app/catalog/CustomerProductCatalog.tsx");
assert.match(explore, /appSoftwareDetailHref/);
assert.match(explore, /exploreProductIdToSoftwareKey/);

const appearance = read("app/app/website-kompis/appearance/page.tsx");
assert.doesNotMatch(appearance, /DomainLicenseCenterPanel/);
assert.match(appearance, /appearanceHonestNote/);
assert.match(appearance, /AppLayoutClasses\.pageWidth/);

const bedriftDash = read("app/app/kompis-bedrift/page.tsx");
assert.match(bedriftDash, /kompisBedriftConnection/);

const bedriftConn = read("app/app/kompis-bedrift/connection/page.tsx");
assert.match(bedriftConn, /supportTickets/);
assert.match(bedriftConn, /accountSubscription/);
assert.match(bedriftConn, /AppLayoutClasses\.pageWidth/);

const softwarePage = read("app/app/software/page.tsx");
assert.match(softwarePage, /account\/subscription/);
assert.match(softwarePage, /parseSoftwareCatalogScope/);
assert.match(softwarePage, /params\.set\("scope", "licensed"\)/);
assert.doesNotMatch(softwarePage, /settings\/billing\/packages/);

const activation = read("lib/product-catalog/product-activation-journey.ts");
assert.match(activation, /PRODUCT_ACTIVATION_FREE_ACCOUNT_RULES/);
assert.match(activation, /resolveProductActivationNextSteps/);

assert.equal(APP_CUSTOMER_JOURNEY_OWNERS.variantCommissionWriters.includes("Agent 1"), true);
assert.equal(APP_CUSTOMER_JOURNEY_OWNERS.supportWebsite.includes("Agent 3"), true);

const product: UnifiedCatalogProduct = {
  productKey: "kompis_web",
  sku: "KW",
  category: "kompis",
  storeCategoryId: "kompis",
  productType: "main",
  dependsOnProductKeys: [],
  title: "Buddy Web",
  tagline: "",
  description: "",
  localeApproved: true,
  logoSrc: null,
  heroImagePath: null,
  accent: "violet",
  letter: "K",
  openHref: "/app/website-kompis",
  moduleKey: null,
  app: { status: "published", visibleInStore: true, source: "core" },
  sale: { status: "published", visibleInStore: true, source: "core" },
  customerPrice: { currency: "NOK", fromMonthly: null, fromYearly: null, status: "unavailable" },
  variants: [],
  commission: { kind: "fixed", amount: 500, currency: "NOK" },
  coreProductId: null,
  purchaseReadiness: "checkout_ready",
  entitlementActive: false,
  updatedAt: null,
};
const cta = resolveAppCheckoutCta({ product, variant: null, interval: "month" });
assert.equal(cta.kind, "buy");
if (cta.kind === "buy") assert.equal(cta.enabled, false);

const prodGate = resolveProductMediaUploadGate({
  PRODUCT_MEDIA_UPLOAD_ACTIVATION: "staging",
  VERCEL_ENV: "production",
  AIPIFY_CORE_ENV: "production",
});
assert.equal(prodGate.uploadEnabled, false);

assert.equal(APP_SUBSCRIPTION_ROUTE, "/app/account/subscription");

for (const locale of ["en", "no", "sv", "da", "pl", "uk", "es"] as const) {
  const portal = JSON.parse(read(`locales/${locale}/customer-app/portalStructure.json`)) as {
    portalStructure: {
      productHubs: {
        web: Record<string, string>;
        bedrift: Record<string, string>;
        common: Record<string, string>;
      };
      webHub: { appearanceDescription: string };
    };
  };
  assert.ok(portal.portalStructure.productHubs.common);
  assert.ok(portal.portalStructure.productHubs.web.appearanceHonestNote);
  assert.ok(portal.portalStructure.productHubs.bedrift.connectionCard);
  assert.ok(portal.portalStructure.productHubs.bedrift.dashboardTitle);
  assert.ok(portal.portalStructure.webHub.appearanceDescription);
  if (locale === "no" || locale === "sv" || locale === "da") {
    assert.match(portal.portalStructure.productHubs.bedrift.connectionCard, /Kompis/);
    assert.doesNotMatch(portal.portalStructure.productHubs.bedrift.connectionCard, /Buddy/);
  }
}

console.log("app-cx-integrated-master-v2.test.ts: ok");
