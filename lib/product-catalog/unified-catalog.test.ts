import assert from "node:assert/strict";
import {
  assertChannelIsolation,
  blockedPercentCommission,
  buildUnifiedCatalog,
  filterAppStoreProducts,
  filterSalesCatalogProducts,
} from "./merge";
import { PRODUCT_CATALOG_FIELD_OWNERSHIP } from "./field-ownership";
import {
  isPercentCommissionActivatable,
  PERCENT_COMMISSION_STATUS,
} from "./percent-commission-contract";
import { CANONICAL_PRODUCT_REGISTRY } from "./registry";

assert.ok(CANONICAL_PRODUCT_REGISTRY.some((p) => p.sku === "AIP-KOMPIS-WEB"));
assert.ok(CANONICAL_PRODUCT_REGISTRY.every((p) => p.copy.en && p.copy.no));
assert.equal(PRODUCT_CATALOG_FIELD_OWNERSHIP.publishApp, "core_csp_sales_products");
assert.equal(PRODUCT_CATALOG_FIELD_OWNERSHIP.publishSale, "core_csp_sales_products");
assert.equal(PRODUCT_CATALOG_FIELD_OWNERSHIP.percentCommission, "blocked_needs_owner_contract");
assert.equal(PERCENT_COMMISSION_STATUS, "core_blocked");
assert.equal(isPercentCommissionActivatable(), false);
assert.equal(blockedPercentCommission().blockedReason, "needs_core_contract");

const both = buildUnifiedCatalog({
  locale: "no",
  coreProducts: [
    {
      id: "uuid-web",
      productKey: "kompis_web",
      currency: "NOK",
      fixedCommissionAmount: 500,
      published: true,
    },
    {
      id: "uuid-voice",
      productKey: "aipify_voice",
      currency: "NOK",
      fixedCommissionAmount: 300,
      published: true,
    },
  ],
  entitlements: [{ productKey: "kompis_web", active: true }],
});

const app = filterAppStoreProducts(both);
const sale = filterSalesCatalogProducts(both);

assert.ok(app.every((p) => p.app.visibleInStore));
assert.ok(sale.every((p) => p.sale.visibleInStore));
assert.ok(!app.some((p) => p.productKey === "kompis_web"), "Core row without publish_app must not invent APP listing");
assert.ok(!app.some((p) => p.productKey === "aipify_voice"), "SALE-only voice must not appear in APP store");
assert.ok(sale.some((p) => p.productKey === "aipify_voice"));
assert.ok(sale.some((p) => p.productKey === "kompis_web"));

const isolation = assertChannelIsolation(both);
assert.ok(isolation.saleOnlyKeys.includes("aipify_voice"));
// Core rows without publish_app must not invent APP listing via registry.
assert.ok(!isolation.registryFallbackAppKeys.includes("kompis_web"));
assert.ok(!isolation.registryFallbackAppKeys.includes("aipify_voice"));

const web = both.find((p) => p.productKey === "kompis_web");
assert.equal(web?.purchaseReadiness, "active_open");
assert.equal(web?.app.source, "none");
assert.equal(web?.app.status, "blocked_needs_sql");
assert.equal(web?.app.visibleInStore, false);
assert.equal(web?.sale.source, "core");
assert.equal(web?.commission.kind, "fixed");
if (web?.commission.kind === "fixed") {
  assert.equal(web.commission.amount, 500);
}
assert.equal(web?.customerPrice.status, "planned_not_stripe_live");
assert.match(web?.description ?? "", /Aipify /);

const saleOnlyDraft = buildUnifiedCatalog({
  locale: "en",
  coreProducts: [
    {
      id: "uuid-web",
      productKey: "kompis_web",
      currency: "NOK",
      fixedCommissionAmount: 500,
      published: false,
    },
  ],
});
assert.equal(filterSalesCatalogProducts(saleOnlyDraft).length, 0);
assert.ok(!filterAppStoreProducts(saleOnlyDraft).some((p) => p.productKey === "kompis_web"));

// No Core rows → controlled registry fallback for default APP products only.
const registryOnly = buildUnifiedCatalog({ locale: "en", coreProducts: [] });
assert.ok(
  assertChannelIsolation(registryOnly).registryFallbackAppKeys.includes("kompis_web"),
);
assert.ok(filterAppStoreProducts(registryOnly).some((p) => p.productKey === "kompis_web"));

const withCoreApp = buildUnifiedCatalog({
  locale: "en",
  coreProducts: [
    {
      id: "uuid-web",
      productKey: "kompis_web",
      currency: "NOK",
      fixedCommissionAmount: 500,
      published: true,
      publishApp: false,
      publishSale: true,
    },
    {
      id: "uuid-voice",
      productKey: "aipify_voice",
      currency: "NOK",
      fixedCommissionAmount: 300,
      published: true,
      publishApp: true,
      publishSale: true,
    },
  ],
});
const coreApp = withCoreApp.find((p) => p.productKey === "kompis_web");
assert.equal(coreApp?.app.source, "core");
assert.equal(coreApp?.app.visibleInStore, false);
assert.ok(!filterAppStoreProducts(withCoreApp).some((p) => p.productKey === "kompis_web"));
assert.ok(filterAppStoreProducts(withCoreApp).some((p) => p.productKey === "aipify_voice"));
assert.ok(filterSalesCatalogProducts(withCoreApp).some((p) => p.productKey === "kompis_web"));

const spanish = buildUnifiedCatalog({ locale: "es", coreProducts: [] });
assert.ok(
  spanish.every(
    (p) =>
      typeof p.title === "string" &&
      p.title.length > 0 &&
      p.localeApproved === true,
  ),
);

const skus = CANONICAL_PRODUCT_REGISTRY.map((p) => p.sku);
assert.equal(new Set(skus).size, skus.length, "SKU uniqueness");
const keys = CANONICAL_PRODUCT_REGISTRY.map((p) => p.productKey);
assert.equal(new Set(keys).size, keys.length, "productKey uniqueness");

console.log("unified-catalog.test.ts: ok");
