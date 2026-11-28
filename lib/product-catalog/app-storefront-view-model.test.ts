import assert from "node:assert/strict";
import {
  buildAppStorefrontViewModel,
  PARTNER_STOREFRONT_REUSE_CONTRACT,
  toAppStorefrontProduct,
} from "./app-storefront-view-model";
import { buildUnifiedCatalog, filterAppStoreProducts } from "./merge";
import { resolveAppCheckoutCta } from "./checkout-readiness";

const emptyCore = buildUnifiedCatalog({
  locale: "en",
  coreProducts: [],
  coreChannelApplied: true,
});
assert.equal(filterAppStoreProducts(emptyCore).length, 0);
const emptyVm = buildAppStorefrontViewModel({
  products: filterAppStoreProducts(emptyCore),
  coreChannelApplied: true,
});
assert.equal(emptyVm.empty, true);
assert.equal(emptyVm.products.length, 0);
assert.equal(emptyVm.dependencySemantics, "all");

const catalog = buildUnifiedCatalog({
  locale: "en",
  coreChannelApplied: true,
  coreProducts: [
    {
      id: "uuid-web",
      productKey: "kompis_web",
      currency: "NOK",
      fixedCommissionAmount: 500,
      published: true,
      publishApp: true,
      publishSale: true,
      productType: "main",
      categoryId: "kompis",
      dependsOnProductKeys: [],
    },
    {
      id: "uuid-addon",
      productKey: "aipify_voice",
      currency: "NOK",
      fixedCommissionAmount: 300,
      published: true,
      publishApp: true,
      publishSale: false,
      productType: "addon",
      categoryId: "voice",
      dependsOnProductKeys: ["kompis_web"],
    },
  ],
  entitlements: [{ productKey: "kompis_web", active: true }],
});

const app = filterAppStoreProducts(catalog);
assert.equal(app.length, 2);

const vm = buildAppStorefrontViewModel({
  products: app,
  coreChannelApplied: true,
});
assert.equal(vm.empty, false);
assert.ok(vm.categories.includes("all"));
assert.ok(vm.categories.includes("kompis"));
assert.ok(vm.categories.includes("voice"));

const voice = vm.products.find((p) => p.productKey === "aipify_voice");
assert.ok(voice);
assert.deepEqual(voice?.dependsOnProductKeys, ["kompis_web"]);
assert.equal(voice?.productType, "addon");
assert.equal(voice?.dependencySemantics, "all");

const web = app.find((p) => p.productKey === "kompis_web");
assert.ok(web);
assert.equal(web?.commission.kind, "fixed");
const storefront = toAppStorefrontProduct(web!);
assert.equal(storefront.entitlementActive, true);
assert.ok(!("commission" in storefront));
assert.ok(
  storefront.checkoutCta.kind === "open" ||
    storefront.checkoutCta.kind === "contact" ||
    storefront.checkoutCta.kind === "info_only" ||
    storefront.checkoutCta.kind === "not_for_purchase" ||
    (storefront.checkoutCta.kind === "buy" && storefront.checkoutCta.enabled === false) ||
    (storefront.checkoutCta.kind === "upgrade" && storefront.checkoutCta.enabled === false),
);

const buyClosed = resolveAppCheckoutCta({
  product: { ...web!, purchaseReadiness: "checkout_ready" },
  variant: web!.variants[1] ?? null,
  interval: "month",
});
assert.equal(buyClosed.kind, "buy");
if (buyClosed.kind === "buy") {
  assert.equal(buyClosed.enabled, false);
  assert.equal(buyClosed.reason, "checkout_not_live");
}

const filtered = buildAppStorefrontViewModel({
  products: app,
  coreChannelApplied: true,
  categoryFilter: "voice",
});
assert.equal(filtered.products.length, 1);
assert.equal(filtered.products[0]?.productKey, "aipify_voice");

assert.equal(PARTNER_STOREFRONT_REUSE_CONTRACT.appModeStripsCommission, true);
assert.equal(PARTNER_STOREFRONT_REUSE_CONTRACT.noSellerBuyButton, true);
assert.equal(PARTNER_STOREFRONT_REUSE_CONTRACT.dependencySemantics, "all");

console.log("app-storefront-view-model.test.ts: ok");
