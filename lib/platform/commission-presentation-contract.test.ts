import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const read = (rel: string) => readFileSync(join(root, rel), "utf8");

test("product editor shows commission only for configured billing periods", () => {
  const builder = read("components/platform/sellers/ProductVariantBuilder.tsx");
  assert.match(builder, /isConfiguredBillingPeriodPrice/);
  assert.match(builder, /compactVat/);
  assert.doesNotMatch(builder, /labels\.vatExclusive[\s\S]*labels\.vatExclusive[\s\S]*labels\.vatExclusive/);
});

test("Provisjonspriser uses per-product presentation with historical rates", () => {
  const panel = read("components/platform/sellers/CertifiedSellersOpsPanel.tsx");
  assert.match(panel, /CommissionRatesPresentationPanel/);
  assert.match(panel, /buildCommissionRatesPresentation/);
  assert.match(panel, /ratesHistoricalTitle/);
  assert.doesNotMatch(panel, /CommissionRatesVariantDraft/);
});

test("variants commission API returns price hints without inventing amounts", () => {
  const route = read("app/api/platform/sellers/commission-rates/variants/route.ts");
  assert.match(route, /price_hints/);
  assert.match(route, /buildCustomerPriceHints/);
  assert.match(route, /loadProductVariantsBundle/);
});

console.log("commission-presentation-contract.test.ts: ok");
