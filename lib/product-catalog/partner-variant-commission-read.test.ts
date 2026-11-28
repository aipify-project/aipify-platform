import assert from "node:assert/strict";
import test from "node:test";
import {
  extractPartnerCommissionSlots,
  indexPartnerCommissionSlots,
  partnerCommissionLookupKey,
  resolvePartnerSaleCommissionText,
  slotFromIntervalRule,
} from "./partner-variant-commission-read";
import type { ProductVariantDefinition } from "./variants";
import { VARIANT_COMMISSION_PERCENT_BASIS } from "./variant-commission";

const labels = {
  commissionNone: "No commission on this free plan",
  commissionNotConfigured: "Not configured",
  commissionZero: "{amount}",
  commissionFixed: "{amount} per qualified sale",
  commissionPercent: "{rate}% of net after discount (ex VAT)",
  commissionEstimate: "Product estimate (not variant rate): {amount}",
  commissionPending: "Commission after Platform publish",
};

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
    monthlyPrice: {
      currency: "NOK",
      amountMajor: 990,
      amountMinor: 99000,
      interval: "month",
      vatLabel: "exclusive",
      providerPriceId: null,
      purchasable: false,
      commission: null,
    },
    yearlyPrice: {
      currency: "NOK",
      amountMajor: 9900,
      amountMinor: 990000,
      interval: "year",
      vatLabel: "exclusive",
      providerPriceId: null,
      purchasable: false,
      commission: null,
    },
    oneTimePrice: null,
    features: [],
    ...partial,
  };
}

test("null rule = not_configured; amount 0 = explicit_zero; never confuse", () => {
  const missing = slotFromIntervalRule({
    productKey: "kompis_web",
    variantKey: "standard",
    billingInterval: "month",
    rule: null,
  });
  assert.equal(missing.status, "not_configured");

  const zero = slotFromIntervalRule({
    productKey: "kompis_web",
    variantKey: "standard",
    billingInterval: "month",
    rule: {
      active: true,
      model: "fixed",
      amountMajor: 0,
      ratePct: null,
      currency: "NOK",
      percentBasis: VARIANT_COMMISSION_PERCENT_BASIS,
    },
  });
  assert.equal(zero.status, "explicit_zero");
  assert.equal(zero.amountMajor, 0);
});

test("resolve: free variant never inherits product-level estimate as automatic rate", () => {
  const free = variant({
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
    yearlyPrice: null,
  });
  const text = resolvePartnerSaleCommissionText({
    variant: free,
    interval: "month",
    slot: null,
    productLevelEstimate: { amount: 1500, currency: "NOK" },
    locale: "en",
    labels,
  });
  assert.equal(text, labels.commissionNone);
  assert.doesNotMatch(text, /1500|estimate/i);
});

test("resolve: not_configured may append marked product estimate only", () => {
  const paid = variant({ variantKey: "standard" });
  const text = resolvePartnerSaleCommissionText({
    variant: paid,
    interval: "month",
    slot: { productKey: "kompis_web", variantKey: "standard", billingInterval: "month", status: "not_configured", amountMajor: null, ratePct: null, currency: null },
    productLevelEstimate: { amount: 1500, currency: "NOK" },
    locale: "en",
    labels,
  });
  assert.match(text, /Not configured/);
  assert.match(text, /Product estimate \(not variant rate\)/);
});

test("resolve: fixed and percent from variant slot", () => {
  const paid = variant({ variantKey: "standard" });
  const fixed = resolvePartnerSaleCommissionText({
    variant: paid,
    interval: "month",
    slot: {
      productKey: "kompis_web",
      variantKey: "standard",
      billingInterval: "month",
      status: "fixed",
      amountMajor: 250,
      ratePct: null,
      currency: "NOK",
    },
    productLevelEstimate: null,
    locale: "en",
    labels,
  });
  assert.match(fixed, /250/);

  const percent = resolvePartnerSaleCommissionText({
    variant: paid,
    interval: "year",
    slot: {
      productKey: "kompis_web",
      variantKey: "standard",
      billingInterval: "year",
      status: "percent",
      amountMajor: null,
      ratePct: 12.5,
      currency: "NOK",
    },
    productLevelEstimate: { amount: 9999, currency: "NOK" },
    locale: "en",
    labels,
  });
  assert.match(percent, /12\.5%/);
  assert.doesNotMatch(percent, /9999/);
});

test("extract + index slots from variant commission on prices", () => {
  const v = variant({
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
  });
  const slots = extractPartnerCommissionSlots("kompis_web", [v]);
  const index = indexPartnerCommissionSlots(slots);
  const month = index.get(partnerCommissionLookupKey("kompis_web", "standard", "month"));
  assert.equal(month?.status, "fixed");
  assert.equal(month?.amountMajor, 100);
  const year = index.get(partnerCommissionLookupKey("kompis_web", "standard", "year"));
  assert.equal(year?.status, "not_configured");
});

console.log("partner-variant-commission-read.test.ts: ok");
