/**
 * End-to-end contract: Product Center commercial editor ↔ APP / SALE catalogs.
 * Local fixtures only — no Production writes.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { applyAuthoritativeCorePricing } from "@/lib/product-catalog/authoritative-pricing";
import { parseVariantsJsonInput } from "@/lib/product-catalog/variant-commission-core";
import { normalizeVariantCommissionRule, VARIANT_COMMISSION_PERCENT_BASIS } from "@/lib/product-catalog/variant-commission";
import { qualifyFixedCommission, qualifyPercentCommission } from "@/lib/product-catalog/commission-rules";
import type { UnifiedCatalogProduct } from "@/lib/product-catalog/types";
import type { ProductVariantDefinition } from "@/lib/product-catalog/variants";

const root = process.cwd();
const read = (rel: string) => readFileSync(join(root, rel), "utf8");

test("editor UI keeps commission next to configured prices and unique radio groups", () => {
  const builder = read("components/platform/sellers/ProductVariantBuilder.tsx");
  const fields = read("components/platform/sellers/VariantCommissionFields.tsx");
  assert.match(builder, /isConfiguredBillingPeriodPrice/);
  assert.match(builder, /fieldId=\{`\$\{variant\.variantKey/);
  assert.match(builder, /commission: amount == null \? null/);
  assert.match(fields, /fieldId/);
  assert.match(fields, /radioName/);
  assert.match(fields, /percentBasis/);
});

test("privileged variants API validates then persists; never false success", () => {
  const api = read("app/api/platform/sellers/products/variants/route.ts");
  assert.match(api, /guardPrivilegedPlatformApi/);
  assert.match(api, /parseVariantsJsonInput/);
  assert.match(api, /persistProductVariantsToCore/);
  assert.match(api, /settlement_activated: false/);
  assert.doesNotMatch(api, /settlement_activated:\s*true/);
});

test("qualification contract: monthly 2nd period; annual/one-time first; no renewals; percent settlement blocked", () => {
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
      interval: "one_time",
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
  assert.equal(qualifyPercentCommission().action, "no_commission");
  assert.equal(VARIANT_COMMISSION_PERCENT_BASIS, "net_ex_vat_after_discount");
});

test("APP strips commission; SALE keeps configured commission; #525 overlay preserved", () => {
  const software = read("app/app/software/page.tsx");
  const partner = read("lib/product-catalog/partner-storefront-view-model.ts");
  assert.match(software, /applyAuthoritativeCorePricing/);
  assert.match(software, /stripCommission: true/);
  assert.match(partner, /applyAuthoritativeCorePricing/);
  assert.match(partner, /stripCommission: false/);

  const variant: ProductVariantDefinition = {
    variantKey: "std",
    productKey: "kompis_web",
    adminName: "std",
    customerLabel: "Standard",
    sortOrder: 0,
    active: true,
    recommended: false,
    quotaValue: 2500,
    quotaUnit: "answers",
    quotaKind: "monthly_renewing",
    annualRenewsQuotaMonthly: true,
    monthlyPrice: {
      currency: "NOK",
      amountMajor: 599,
      amountMinor: 59900,
      interval: "month",
      vatLabel: "exclusive",
      providerPriceId: null,
      purchasable: false,
      commission: normalizeVariantCommissionRule({ model: "fixed", amountMajor: 150 }),
    },
    yearlyPrice: null,
    oneTimePrice: null,
    features: [],
  };
  const product = {
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
    accent: "violet",
    letter: "K",
    openHref: null,
    moduleKey: null,
    app: { status: "published", visibleInStore: true, source: "core" },
    sale: { status: "published", visibleInStore: true, source: "core" },
    customerPrice: {
      currency: "NOK",
      fromMonthly: 599,
      fromYearly: null,
      status: "planned_not_stripe_live",
    },
    variants: [],
    commission: { kind: "fixed", amount: 150, currency: "NOK" },
    coreProductId: "id",
    purchaseReadiness: "contact",
    entitlementActive: false,
    updatedAt: null,
  } as UnifiedCatalogProduct;

  const app = applyAuthoritativeCorePricing({
    products: [product],
    coreVariantsByKey: { kompis_web: [variant] },
    coreVariantsResolved: true,
    stripCommission: true,
  });
  assert.equal(app[0]?.customerPrice.fromMonthly, 599);
  assert.equal(app[0]?.variants[0]?.monthlyPrice?.commission, null);
  assert.equal(app[0]?.commission.kind, "unknown");

  const sale = applyAuthoritativeCorePricing({
    products: [product],
    coreVariantsByKey: { kompis_web: [variant] },
    coreVariantsResolved: true,
    stripCommission: false,
  });
  assert.equal(sale[0]?.variants[0]?.monthlyPrice?.commission?.amountMajor, 150);
  assert.equal(sale[0]?.commission.kind, "fixed");
});

test("failed validation never looks like persist success", () => {
  const bad = parseVariantsJsonInput([
    {
      variantKey: "x",
      monthlyPrice: {
        currency: "NOK",
        amountMajor: null,
        interval: "month",
        commission: { model: "fixed", amountMajor: 1 },
      },
    },
  ]);
  assert.equal(bad.ok, false);
});

console.log("commission-editor-complete-contract.test.ts: ok");
