import assert from "node:assert/strict";
import {
  assertChannelIsolation,
  buildUnifiedCatalog,
  filterAppStoreProducts,
  filterSalesCatalogProducts,
} from "./merge";
import { CANONICAL_PRODUCT_REGISTRY } from "./registry";

assert.ok(CANONICAL_PRODUCT_REGISTRY.some((p) => p.sku === "AIP-KOMPIS-WEB"));
assert.ok(CANONICAL_PRODUCT_REGISTRY.every((p) => p.copy.en && p.copy.no));

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
assert.ok(app.some((p) => p.productKey === "kompis_web"));
assert.ok(!app.some((p) => p.productKey === "aipify_voice"), "SALE-only voice must not appear in APP store");
assert.ok(sale.some((p) => p.productKey === "aipify_voice"));

const isolation = assertChannelIsolation(both);
assert.ok(isolation.saleOnlyKeys.includes("aipify_voice"));

const web = both.find((p) => p.productKey === "kompis_web");
assert.equal(web?.purchaseReadiness, "active_open");
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
assert.ok(filterAppStoreProducts(saleOnlyDraft).some((p) => p.productKey === "kompis_web"));

const missingLocale = buildUnifiedCatalog({ locale: "es", coreProducts: [] });
assert.ok(missingLocale.every((p) => p.localeApproved === true || p.copy !== undefined));

console.log("unified-catalog.test.ts: ok");
