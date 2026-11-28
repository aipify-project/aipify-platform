import assert from "node:assert/strict";
import {
  APP_CUSTOMER_JOURNEY_OWNERS,
  APP_SOFTWARE_STORE_ROUTE,
  appSoftwareDetailHref,
  isValidAppProductKeyParam,
  resolveAppProductAccessState,
  resolveAppProductPrimaryAction,
} from "./app-customer-journey";
import { resolveAppCheckoutCta } from "./checkout-readiness";
import type { UnifiedCatalogProduct } from "./types";

assert.equal(APP_CUSTOMER_JOURNEY_OWNERS.checkoutStripe, "blocked_needs_owner_contract");
assert.equal(APP_CUSTOMER_JOURNEY_OWNERS.productionMediaUpload, "fail_closed_until_exact_YES");
assert.equal(appSoftwareDetailHref("Kompis_Web"), `${APP_SOFTWARE_STORE_ROUTE}/kompis_web`);
assert.equal(isValidAppProductKeyParam("kompis_web"), true);
assert.equal(isValidAppProductKeyParam("../evil"), false);
assert.equal(isValidAppProductKeyParam("a".repeat(65)), false);

function product(partial: Partial<UnifiedCatalogProduct>): UnifiedCatalogProduct {
  return {
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
    customerPrice: {
      currency: "NOK",
      fromMonthly: null,
      fromYearly: null,
      status: "unavailable",
    },
    variants: [],
    commission: { kind: "unknown" },
    coreProductId: "uuid",
    purchaseReadiness: "contact",
    entitlementActive: false,
    updatedAt: null,
    ...partial,
  };
}

const active = product({ entitlementActive: true, purchaseReadiness: "active_open" });
assert.equal(resolveAppProductAccessState({ product: active }), "active");
const open = resolveAppProductPrimaryAction({
  product: active,
  variant: null,
  interval: "month",
  accessState: "active",
});
assert.equal(open.kind, "open");
if (open.kind === "open") assert.equal(open.href, "/app/website-kompis");

const addon = product({
  productKey: "aipify_voice",
  dependsOnProductKeys: ["kompis_web"],
  entitlementActive: false,
  purchaseReadiness: "info_only",
  openHref: null,
});
assert.equal(
  resolveAppProductAccessState({ product: addon, activeProductKeys: [] }),
  "dependency_blocked",
);
assert.equal(
  resolveAppProductAccessState({
    product: addon,
    activeProductKeys: ["kompis_web"],
  }),
  "not_purchased",
);

const cta = resolveAppCheckoutCta({
  product: product({ purchaseReadiness: "checkout_ready" }),
  variant: null,
  interval: "month",
});
assert.equal(cta.kind, "buy");
if (cta.kind === "buy") {
  assert.equal(cta.enabled, false);
  assert.equal(cta.reason, "checkout_not_live");
}

// Negative: no commission on APP primary action resolution
assert.ok(!("commission" in open));

console.log("app-customer-journey.test.ts: ok");
