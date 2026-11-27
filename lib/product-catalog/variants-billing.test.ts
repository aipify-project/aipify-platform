import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  buildUnifiedCatalog,
  isVariantIntervalPurchasable,
  priceForInterval,
  qualifyFixedCommission,
  qualifyPercentCommission,
  resolveAppCheckoutCta,
  variantsForProduct,
} from "./index";

const webVariants = variantsForProduct("kompis_web");
assert.equal(webVariants.length, 3);
assert.deepEqual(
  webVariants.map((v) => v.quotaValue),
  [150, 2500, 10000],
  "Kompis Web quotas are data-driven (150/2500/10000 — not a hardcoded 6000)",
);

const standard = webVariants.find((v) => v.adminName === "standard");
assert.ok(standard);
assert.equal(standard?.recommended, true);
assert.equal(standard?.annualRenewsQuotaMonthly, true);
assert.equal(standard?.monthlyPrice?.amountMajor, 599);
assert.equal(standard?.yearlyPrice?.amountMajor, 5990);
assert.notEqual(
  (standard?.monthlyPrice?.amountMajor ?? 0) * 12,
  standard?.yearlyPrice?.amountMajor,
  "yearly price is independent — not 12× monthly",
);
assert.equal(standard?.monthlyPrice?.purchasable, false);
assert.equal(standard?.monthlyPrice?.providerPriceId, null);

assert.equal(variantsForProduct("aipify_voice").length, 0);

const catalog = buildUnifiedCatalog({ locale: "no", coreProducts: [] });
const web = catalog.find((p) => p.productKey === "kompis_web");
assert.ok(web);
assert.equal(web?.variants.length, 3);
assert.equal(web?.customerPrice.fromYearly, 5990);
assert.equal(priceForInterval(web!.variants[1]!, "month")?.amountMajor, 599);
assert.equal(priceForInterval(web!.variants[1]!, "year")?.amountMajor, 5990);

assert.equal(isVariantIntervalPurchasable(standard!, "month"), false);

const cta = resolveAppCheckoutCta({
  product: web!,
  variant: standard!,
  interval: "month",
});
assert.ok(cta.kind === "contact" || cta.kind === "info_only" || cta.kind === "not_for_purchase" || (cta.kind === "buy" && cta.enabled === false));

assert.deepEqual(
  qualifyFixedCommission({
    interval: "month",
    event: "first_confirmed_payment",
    paymentCaptured: true,
  }),
  {
    action: "register_pending",
    model: "fixed_one_time",
    reason: "monthly_first_payment_awaits_second_period",
  },
);
assert.equal(
  qualifyFixedCommission({
    interval: "month",
    event: "second_confirmed_paid_period",
    paymentCaptured: true,
  }).action,
  "accrue",
);
assert.equal(
  qualifyFixedCommission({
    interval: "year",
    event: "first_confirmed_payment",
    paymentCaptured: true,
  }).action,
  "accrue",
);
assert.equal(
  qualifyFixedCommission({
    interval: "month",
    event: "renewal",
    paymentCaptured: true,
  }).action,
  "no_commission",
);
assert.equal(qualifyPercentCommission().reason, "percent_core_blocked");

const sql = readFileSync(
  join(process.cwd(), "docs/platform/sql-candidates/csp_product_variants_billing_v1.sql"),
  "utf8",
);
assert.match(sql, /PREPARED_ONLY/);
assert.match(sql, /csp_product_variants/);
assert.match(sql, /csp_product_variant_prices/);
assert.match(sql, /purchasable_requires_provider_price_id/);
assert.match(sql, /APPLY_BLOCKED_UNTIL_OWNER_YES/);
assert.doesNotMatch(sql, /stripe\.com/i);
assert.doesNotMatch(sql, /insert into public\.csp_product_variants[\s\S]*kompis_web/i);

console.log("variants-billing.test.ts: ok");
