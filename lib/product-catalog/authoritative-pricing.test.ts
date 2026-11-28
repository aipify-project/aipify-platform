import assert from "node:assert/strict";
import test from "node:test";
import {
  applyAuthoritativeCorePricing,
  deriveCustomerPriceFromCoreVariants,
  isExplicitZeroAmount,
  isMissingAmount,
  stripVariantCommission,
} from "./authoritative-pricing";
import type { UnifiedCatalogProduct } from "./types";
import type { ProductVariantDefinition } from "./variants";
import { VARIANT_COMMISSION_PERCENT_BASIS } from "./variant-commission";

function variant(partial: Partial<ProductVariantDefinition> & { variantKey: string }): ProductVariantDefinition {
  return {
    productKey: "kompis_web",
    adminName: partial.variantKey,
    customerLabel: partial.variantKey,
    sortOrder: 0,
    active: true,
    recommended: false,
    quotaValue: 2500,
    quotaUnit: "answers",
    quotaKind: "monthly_renewing",
    annualRenewsQuotaMonthly: true,
    monthlyPrice: null,
    yearlyPrice: null,
    oneTimePrice: null,
    features: [],
    ...partial,
  };
}

const baseProduct = {
  productKey: "kompis_web",
  sku: "kompis_web",
  category: "kompis",
  storeCategoryId: "kompis",
  productType: null,
  dependsOnProductKeys: [],
  title: "Buddy Web",
  tagline: "",
  description: "",
  localeApproved: true,
  logoSrc: null,
  heroImagePath: null,
  accent: "purple",
  letter: "K",
  openHref: null,
  moduleKey: null,
  app: { status: "published", visibleInStore: true, source: "core" },
  sale: { status: "published", visibleInStore: true, source: "core" },
  customerPrice: {
    currency: "NOK",
    fromMonthly: 599,
    fromYearly: 5990,
    status: "planned_not_stripe_live",
  },
  variants: [
    variant({
      variantKey: "planned",
      monthlyPrice: {
        currency: "NOK",
        amountMajor: 599,
        amountMinor: 59900,
        interval: "month",
        vatLabel: "exclusive",
        providerPriceId: null,
        purchasable: false,
        commission: null,
      },
    }),
  ],
  commission: { kind: "fixed", amount: 1500, currency: "NOK" },
  coreProductId: "id",
  purchaseReadiness: "contact",
  entitlementActive: false,
  updatedAt: null,
} as UnifiedCatalogProduct;

test("null vs explicit 0 helpers", () => {
  assert.equal(isMissingAmount(null), true);
  assert.equal(isMissingAmount(undefined), true);
  assert.equal(isMissingAmount(0), false);
  assert.equal(isExplicitZeroAmount(0), true);
  assert.equal(isExplicitZeroAmount(10), false);
});

test("deriveCustomerPrice: missing Core amounts → unavailable; 0 kept", () => {
  assert.equal(deriveCustomerPriceFromCoreVariants([]).status, "unavailable");
  const free = deriveCustomerPriceFromCoreVariants([
    variant({
      variantKey: "free",
      monthlyPrice: {
        currency: "NOK",
        amountMajor: 0,
        amountMinor: 0,
        interval: "month",
        vatLabel: "exclusive",
        providerPriceId: null,
        purchasable: false,
        commission: null,
      },
    }),
  ]);
  assert.equal(free.fromMonthly, 0);
  assert.equal(free.status, "planned_not_stripe_live");
});

test("when Core resolved with empty variants, planned prices are cleared", () => {
  const out = applyAuthoritativeCorePricing({
    products: [baseProduct],
    coreVariantsByKey: { kompis_web: [] },
    coreVariantsResolved: true,
    stripCommission: true,
  });
  assert.equal(out[0]?.variants.length, 0);
  assert.equal(out[0]?.customerPrice.status, "unavailable");
  assert.equal(out[0]?.customerPrice.fromMonthly, null);
  assert.equal(out[0]?.commission.kind, "unknown");
});

test("APP stripCommission removes commission; SALE keeps it", () => {
  const withCommission = [
    variant({
      variantKey: "standard",
      monthlyPrice: {
        currency: "NOK",
        amountMajor: 990,
        amountMinor: 99000,
        interval: "month",
        vatLabel: "exclusive",
        providerPriceId: null,
        purchasable: false,
        commission: {
          active: true,
          model: "fixed",
          amountMajor: 100,
          ratePct: null,
          currency: "NOK",
          percentBasis: VARIANT_COMMISSION_PERCENT_BASIS,
        },
      },
    }),
  ];
  const app = applyAuthoritativeCorePricing({
    products: [baseProduct],
    coreVariantsByKey: { kompis_web: withCommission },
    coreVariantsResolved: true,
    stripCommission: true,
  });
  assert.equal(app[0]?.variants[0]?.monthlyPrice?.amountMajor, 990);
  assert.equal(app[0]?.variants[0]?.monthlyPrice?.commission, null);
  assert.equal(app[0]?.commission.kind, "unknown");

  const sale = applyAuthoritativeCorePricing({
    products: [baseProduct],
    coreVariantsByKey: { kompis_web: withCommission },
    coreVariantsResolved: true,
    stripCommission: false,
  });
  assert.equal(sale[0]?.variants[0]?.monthlyPrice?.commission?.amountMajor, 100);
  assert.equal(sale[0]?.commission.kind, "fixed");
});

test("unresolved Core leaves planned catalog untouched", () => {
  const out = applyAuthoritativeCorePricing({
    products: [baseProduct],
    coreVariantsByKey: null,
    coreVariantsResolved: false,
    stripCommission: true,
  });
  assert.equal(out[0]?.customerPrice.fromMonthly, 599);
  assert.equal(out[0]?.variants.length, 1);
});

test("stripVariantCommission is idempotent on null commission", () => {
  const stripped = stripVariantCommission([
    variant({
      variantKey: "x",
      monthlyPrice: {
        currency: "NOK",
        amountMajor: 10,
        amountMinor: 1000,
        interval: "month",
        vatLabel: "exclusive",
        providerPriceId: null,
        purchasable: false,
        commission: null,
      },
    }),
  ]);
  assert.equal(stripped[0]?.monthlyPrice?.commission, null);
  assert.equal(stripped[0]?.monthlyPrice?.amountMajor, 10);
});

console.log("authoritative-pricing.test.ts: ok");
