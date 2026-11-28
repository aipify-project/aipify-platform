import assert from "node:assert/strict";
import test from "node:test";
import {
  buildPartnerStorefrontViewModel,
  matchesPartnerStorefrontFilter,
  overviewProductsToCoreRows,
  productLevelCommissionEstimate,
  PARTNER_STOREFRONT_REUSE_CONTRACT,
} from "./partner-storefront-view-model";
import type { UnifiedCatalogProduct } from "./types";

test("partner storefront: Core empty is authoritative empty — no registry seed", () => {
  const vm = buildPartnerStorefrontViewModel({
    locale: "en",
    overviewProducts: [],
    coreReady: true,
  });
  assert.equal(vm.coreChannelApplied, true);
  assert.equal(vm.authoritativeEmpty, true);
  assert.equal(vm.empty, true);
  assert.equal(vm.products.length, 0);
});

test("partner storefront: not ready never pretends empty success catalog", () => {
  const vm = buildPartnerStorefrontViewModel({
    locale: "en",
    overviewProducts: [
      {
        id: "p1",
        productKey: "kompis_web",
        fixedCommissionAmount: 500,
        currency: "NOK",
        certificationStatus: "passed",
      },
    ],
    coreReady: false,
  });
  assert.equal(vm.coreChannelApplied, false);
  assert.equal(vm.products.length, 0);
  assert.equal(vm.authoritativeEmpty, false);
});

test("partner storefront: published Core SALE product appears with sale.source=core", () => {
  const vm = buildPartnerStorefrontViewModel({
    locale: "no",
    overviewProducts: [
      {
        id: "uuid-1",
        productKey: "kompis_web",
        fixedCommissionAmount: 1500,
        currency: "NOK",
        certificationStatus: "passed",
      },
    ],
    coreReady: true,
  });
  assert.equal(vm.empty, false);
  assert.equal(vm.products.length, 1);
  assert.equal(vm.products[0]?.productKey, "kompis_web");
  assert.equal(vm.products[0]?.sale.visibleInStore, true);
  assert.equal(vm.products[0]?.sale.source, "core");
  assert.ok(vm.products[0]!.variants.length > 0);
});

test("partner storefront: category filter voice excludes kompis", () => {
  const vm = buildPartnerStorefrontViewModel({
    locale: "en",
    overviewProducts: [
      {
        id: "1",
        productKey: "kompis_web",
        fixedCommissionAmount: null,
        currency: "NOK",
        certificationStatus: null,
      },
    ],
    coreReady: true,
    categoryFilter: "voice",
  });
  assert.equal(vm.products.length, 0);
  assert.equal(vm.empty, true);
});

test("overviewProductsToCoreRows skips missing keys and forces publishSale", () => {
  const rows = overviewProductsToCoreRows([
    {
      id: null,
      productKey: null,
      fixedCommissionAmount: 1,
      currency: "NOK",
      certificationStatus: null,
    },
    {
      id: "x",
      productKey: "kompis_web",
      fixedCommissionAmount: 0,
      currency: "NOK",
      certificationStatus: "passed",
    },
  ]);
  assert.equal(rows.length, 1);
  assert.equal(rows[0]?.publishSale, true);
  assert.equal(rows[0]?.fixedCommissionAmount, 0);
});

test("productLevelCommissionEstimate only for fixed kind", () => {
  const fixed = {
    commission: { kind: "fixed", amount: 100, currency: "NOK" },
  } as UnifiedCatalogProduct;
  const unknown = {
    commission: { kind: "unknown" },
  } as UnifiedCatalogProduct;
  assert.deepEqual(productLevelCommissionEstimate(fixed), { amount: 100, currency: "NOK" });
  assert.equal(productLevelCommissionEstimate(unknown), null);
});

test("matchesPartnerStorefrontFilter kompis / all", () => {
  const product = { category: "kompis", storeCategoryId: "kompis", productKey: "kompis_web" } as UnifiedCatalogProduct;
  assert.equal(matchesPartnerStorefrontFilter(product, "all"), true);
  assert.equal(matchesPartnerStorefrontFilter(product, "kompis"), true);
  assert.equal(matchesPartnerStorefrontFilter(product, "voice"), false);
});

test("PARTNER_STOREFRONT_REUSE_CONTRACT stays sale-safe", () => {
  assert.equal(PARTNER_STOREFRONT_REUSE_CONTRACT.noSellerBuyButton, true);
  assert.equal(PARTNER_STOREFRONT_REUSE_CONTRACT.partnerModeAllowsCommission, true);
  assert.equal(PARTNER_STOREFRONT_REUSE_CONTRACT.appModeStripsCommission, true);
});

console.log("partner-storefront-view-model.test.ts: ok");
