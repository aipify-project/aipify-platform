import assert from "node:assert/strict";
import test from "node:test";
import {
  buildCommissionRatesPresentation,
  buildCustomerPriceHints,
  customerPriceLookupKey,
  isConfiguredBillingPeriodPrice,
} from "./commission-rates-presentation";
import type { VariantCommissionListRow } from "./variant-commission-core";
import type { ProductVariantDefinition } from "./variants";

function rate(partial: Partial<VariantCommissionListRow> & Pick<VariantCommissionListRow, "id" | "variantKey" | "billingInterval">): VariantCommissionListRow {
  return {
    productId: "pid",
    productKey: "kompis_web",
    model: "fixed",
    amount: 100,
    ratePct: null,
    currency: "NOK",
    percentBasis: null,
    active: true,
    effectiveFrom: "2026-01-01T00:00:00Z",
    createdAt: null,
    vatLabel: "exclusive",
    ...partial,
  };
}

test("null price amount is not a configured billing period; 0 is", () => {
  assert.equal(isConfiguredBillingPeriodPrice(null), false);
  assert.equal(isConfiguredBillingPeriodPrice(undefined), false);
  assert.equal(isConfiguredBillingPeriodPrice(0), true);
  assert.equal(isConfiguredBillingPeriodPrice(990), true);
});

test("presentation groups by product and marks historical versions", () => {
  const sections = buildCommissionRatesPresentation({
    locale: "en",
    rows: [
      rate({ id: "old", variantKey: "standard", billingInterval: "month", amount: 50, effectiveFrom: "2025-01-01T00:00:00Z" }),
      rate({ id: "new", variantKey: "standard", billingInterval: "month", amount: 0, effectiveFrom: "2026-06-01T00:00:00Z" }),
      rate({ id: "yr", variantKey: "standard", billingInterval: "year", amount: 200, effectiveFrom: "2026-06-01T00:00:00Z" }),
    ],
  });
  assert.equal(sections.length, 1);
  assert.equal(sections[0]?.productKey, "kompis_web");
  assert.match(sections[0]?.productTitle ?? "", /Buddy Web|Kompis Web/);
  assert.equal(sections[0]?.currentRows.length, 2);
  const zero = sections[0]?.currentRows.find((r) => r.id === "new");
  assert.equal(zero?.status, "explicit_zero");
  assert.equal(zero?.amountMajor, 0);
  assert.equal(sections[0]?.historicalRows.length, 1);
  assert.equal(sections[0]?.historicalRows[0]?.id, "old");
});

test("percent estimate only when customer price known — never invent", () => {
  const withoutPrice = buildCommissionRatesPresentation({
    rows: [
      rate({
        id: "p1",
        variantKey: "standard",
        billingInterval: "month",
        model: "percent",
        amount: null,
        ratePct: 10,
      }),
    ],
  });
  assert.equal(withoutPrice[0]?.currentRows[0]?.estimatedAmountMajor, null);
  assert.equal(withoutPrice[0]?.currentRows[0]?.customerPriceKnown, false);

  const hints = {
    [customerPriceLookupKey("kompis_web", "standard", "month")]: {
      amountMajor: 1000,
      currency: "NOK",
      variantLabel: "2500",
    },
  };
  const withPrice = buildCommissionRatesPresentation({
    rows: [
      rate({
        id: "p1",
        variantKey: "standard",
        billingInterval: "month",
        model: "percent",
        amount: null,
        ratePct: 10,
      }),
    ],
    priceHints: hints,
  });
  assert.equal(withPrice[0]?.currentRows[0]?.customerPriceKnown, true);
  assert.equal(withPrice[0]?.currentRows[0]?.estimatedAmountMajor, 100);
  assert.equal(withPrice[0]?.currentRows[0]?.variantLabel, "2500");
});

test("buildCustomerPriceHints never invents amounts", () => {
  const variant: ProductVariantDefinition = {
    variantKey: "free",
    productKey: "kompis_web",
    adminName: "free",
    customerLabel: "150",
    sortOrder: 0,
    active: true,
    recommended: false,
    quotaValue: 150,
    quotaUnit: "answers",
    quotaKind: "lifetime_total",
    annualRenewsQuotaMonthly: false,
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
    yearlyPrice: null,
    oneTimePrice: null,
    features: [],
  };
  const hints = buildCustomerPriceHints("kompis_web", [variant]);
  assert.equal(hints[customerPriceLookupKey("kompis_web", "free", "month")]?.amountMajor, 0);
  assert.equal(hints[customerPriceLookupKey("kompis_web", "free", "year")]?.amountMajor, null);
});

test("no legacy product-level fallback in presentation builder", () => {
  const empty = buildCommissionRatesPresentation({ rows: [] });
  assert.equal(empty.length, 0);
});

console.log("commission-rates-presentation.test.ts: ok");
