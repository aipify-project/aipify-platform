import assert from "node:assert/strict";
import test from "node:test";
import {
  LEGACY_PRODUCT_COMMISSION_RATES_NEEDING_VARIANT_MAPPING,
  VARIANT_COMMISSION_PERSISTENCE,
  VARIANT_COMMISSION_PERCENT_BASIS,
  canPersistVariantCommissionRules,
  emptyVariantCommissionRule,
  normalizeVariantCommissionRule,
  previewVariantCommissionExVat,
} from "./variant-commission";
import { qualifyFixedCommission, qualifyPercentCommission } from "./commission-rules";

test("variant commission persistence is fail-closed until Core RPC", () => {
  assert.equal(VARIANT_COMMISSION_PERSISTENCE.canPersist, false);
  assert.equal(canPersistVariantCommissionRules(), false);
  assert.equal(VARIANT_COMMISSION_PERSISTENCE.status, "blocked_needs_core_rpc");
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
