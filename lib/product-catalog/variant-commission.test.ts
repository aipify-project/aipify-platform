import assert from "node:assert/strict";
import test from "node:test";
import {
  LEGACY_PRODUCT_COMMISSION_RATES_NEEDING_VARIANT_MAPPING,
  VARIANT_COMMISSION_PERSISTENCE,
  VARIANT_COMMISSION_PERCENT_BASIS,
  canPersistVariantCommissionRules,
  emptyVariantCommissionRule,
  isConfiguredVariantCommissionRule,
  normalizeVariantCommissionRule,
  previewVariantCommissionExVat,
} from "./variant-commission";
import { VARIANT_COMMISSION_PRODUCTION_PERSIST_ACTIVATION } from "./variant-commission-core-gate";
import { qualifyFixedCommission, qualifyPercentCommission } from "./commission-rules";

test("variant commission persistence is enabled on Production when activation flag is true", () => {
  const previous = process.env.NEXT_PUBLIC_SUPABASE_URL;
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://qbcqoixhrvhnuwphefvw.supabase.co";
  assert.equal(VARIANT_COMMISSION_PRODUCTION_PERSIST_ACTIVATION, true);
  assert.equal(VARIANT_COMMISSION_PERSISTENCE.canPersist, true);
  assert.equal(canPersistVariantCommissionRules(), true);
  assert.equal(VARIANT_COMMISSION_PERSISTENCE.status, "production_core_enabled");
  if (previous === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  else process.env.NEXT_PUBLIC_SUPABASE_URL = previous;
});

test("null commission is not configured; explicit 0 is configured free", () => {
  assert.equal(isConfiguredVariantCommissionRule(null), false);
  assert.equal(isConfiguredVariantCommissionRule(undefined), false);
  const zero = normalizeVariantCommissionRule({ model: "fixed", amountMajor: 0 });
  assert.equal(isConfiguredVariantCommissionRule(zero), true);
  assert.equal(zero.amountMajor, 0);
});

test("normalize fixed and percent rules; free variant allows 0", () => {
  const fixed = normalizeVariantCommissionRule({ model: "fixed", amountMajor: 0 });
  assert.equal(fixed.model, "fixed");
  assert.equal(fixed.amountMajor, 0);
  assert.equal(fixed.ratePct, null);

  const percent = normalizeVariantCommissionRule({ model: "percent", ratePct: 12.5 });
  assert.equal(percent.model, "percent");
  assert.equal(percent.ratePct, 12.5);
  assert.equal(percent.amountMajor, null);
  assert.equal(percent.percentBasis, VARIANT_COMMISSION_PERCENT_BASIS);
});

test("preview fixed and percent commission exclusive of VAT", () => {
  const fixedPreview = previewVariantCommissionExVat({
    rule: emptyVariantCommissionRule("NOK"),
    priceAmountMajor: 599,
  });
  assert.equal(fixedPreview.amountMajor, 0);
  assert.equal(fixedPreview.inactive, false);

  const activeFixed = previewVariantCommissionExVat({
    rule: normalizeVariantCommissionRule({ model: "fixed", amountMajor: 500 }),
    priceAmountMajor: 5990,
  });
  assert.equal(activeFixed.amountMajor, 500);

  const pct = previewVariantCommissionExVat({
    rule: normalizeVariantCommissionRule({ model: "percent", ratePct: 10 }),
    priceAmountMajor: 5990,
  });
  assert.equal(pct.amountMajor, 599);

  const inactive = previewVariantCommissionExVat({
    rule: normalizeVariantCommissionRule({ active: false, model: "fixed", amountMajor: 800 }),
    priceAmountMajor: 1000,
  });
  assert.equal(inactive.inactive, true);
  assert.equal(inactive.amountMajor, 0);
});

test("legacy product rates are documented for explicit variant mapping", () => {
  const keys = LEGACY_PRODUCT_COMMISSION_RATES_NEEDING_VARIANT_MAPPING.map((r) => r.productKey);
  assert.deepEqual(keys.sort(), ["aipify_voice", "kompis_bedrift", "kompis_web"]);
  for (const row of LEGACY_PRODUCT_COMMISSION_RATES_NEEDING_VARIANT_MAPPING) {
    assert.equal(row.mappingStatus, "requires_explicit_variant_mapping_before_backfill");
  }
});

test("contract: interval qualification helpers remain available (UI job does not change Core earn path)", () => {
  assert.equal(
    qualifyFixedCommission({
      interval: "month",
      event: "first_confirmed_payment",
      paymentCaptured: true,
    }).action,
    "register_pending",
  );
  assert.equal(
    qualifyFixedCommission({
      interval: "year",
      event: "first_confirmed_payment",
      paymentCaptured: true,
    }).action,
    "accrue",
  );
  assert.equal(qualifyPercentCommission().action, "no_commission");
});
