import assert from "node:assert/strict";
import test from "node:test";
import { localizeQuotaUnit, variantHasPaidCustomerPrice } from "./quota-labels";
import { formatVariantQuotaLabel } from "./variants";
import { variantsForProduct } from "./merge";

test("quota unit: answers localizes for core locales", () => {
  assert.equal(localizeQuotaUnit("answers", "en"), "answers");
  assert.equal(localizeQuotaUnit("answers", "no"), "svar");
  assert.equal(localizeQuotaUnit("answers", "sv"), "svar");
  assert.equal(localizeQuotaUnit("answers", "da"), "svar");
  assert.equal(localizeQuotaUnit("answers", "pl"), "odpowiedzi");
  assert.equal(localizeQuotaUnit("answers", "uk"), "відповідей");
});

test("formatVariantQuotaLabel: Norwegian shows svar not answers", () => {
  const free = variantsForProduct("kompis_web").find((v) => v.adminName === "free");
  assert.ok(free);
  const label = formatVariantQuotaLabel(free!, "no");
  assert.match(label, /150/);
  assert.match(label, /svar/);
  assert.equal(label.includes("answers"), false);
});

test("free variant has no paid customer price", () => {
  const variants = variantsForProduct("kompis_web");
  const free = variants.find((v) => v.adminName === "free")!;
  const standard = variants.find((v) => v.adminName === "standard")!;
  assert.equal(variantHasPaidCustomerPrice(free), false);
  assert.equal(variantHasPaidCustomerPrice(standard), true);
});
