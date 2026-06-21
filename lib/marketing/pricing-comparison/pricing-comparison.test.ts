import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MARKETING_PRIMARY_CTA_HREFS } from "@/lib/marketing/primary-ctas";
import {
  PUBLIC_PLAN_PRICES,
  formatPublicPlanPrice,
  getPublicPlanCatalog,
} from "@/lib/marketing/public-pricing";
import { PRICING_COMPARISON_REGISTRY } from "@/lib/marketing/pricing-comparison/registry";
import {
  collectResolvedCellLabels,
  resolvePricingComparison,
} from "@/lib/marketing/pricing-comparison/resolve";
import type { PricingComparisonLabels } from "@/lib/marketing/pricing-comparison/types";
import { loadMarketingDictionary } from "@/lib/marketing/validate-marketing-locale-completeness";

const root = path.dirname(path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url)))));

function getPlanComparisonLabels(locale: "en" | "no" | "sv" | "da"): PricingComparisonLabels {
  const marketing = loadMarketingDictionary(root, locale);
  const pricingPage = marketing.pricingPage as { planComparison: PricingComparisonLabels };
  return pricingPage.planComparison;
}

function getPricingLabels(locale: "en" | "no" | "sv" | "da") {
  const marketing = loadMarketingDictionary(root, locale);
  const pricingPage = marketing.pricingPage as {
    pricingLabels: {
      custom: string;
      perMonth: string;
      supportLevels: Record<"standard" | "priority" | "dedicated", string>;
    };
    packages: {
      items: Array<{
        key: "starter" | "professional" | "business" | "enterprise";
        name: string;
        audience: string;
        cta: string;
        ctaHref: string;
        statusKey?: "available" | "popular" | "enterprise";
      }>;
    };
  };
  return pricingPage;
}

const ALLOWED_PLAN_HREFS = new Set(["/early-access", "/contact", "/book-demo"]);

// 1. Registry drives comparison structure.
assert.ok(PRICING_COMPARISON_REGISTRY.length >= 8);
assert.equal(PRICING_COMPARISON_REGISTRY[0]?.id, "pricing");

// 2–5. Approved public prices match catalog formatting.
const enPricing = getPricingLabels("en");
const enComparison = resolvePricingComparison(
  "en",
  getPlanComparisonLabels("en"),
  enPricing.pricingLabels,
  enPricing.pricingLabels.supportLevels,
  enPricing.packages.items,
);

const starterEntry = getPublicPlanCatalog().find((e) => e.key === "starter")!;
assert.equal(
  formatPublicPlanPrice(starterEntry.price, "en", enPricing.pricingLabels),
  `${PUBLIC_PLAN_PRICES.starter.amount.toLocaleString("en-US")} kr / month`,
);
assert.equal(enComparison.plans.find((p) => p.key === "starter")?.price, "799 kr / month");
assert.equal(enComparison.plans.find((p) => p.key === "professional")?.price, "2,500 kr / month");
assert.equal(enComparison.plans.find((p) => p.key === "business")?.price, "6,999 kr / month");

// 6. Norwegian price format uses kr / måned (not ,- / mnd.).
const noPricing = getPricingLabels("no");
const noStarterPrice = formatPublicPlanPrice(starterEntry.price, "no", noPricing.pricingLabels);
assert.match(noStarterPrice, /799 kr \/ måned/);
assert.doesNotMatch(noStarterPrice, /,-/);
assert.doesNotMatch(noStarterPrice, /mnd\./);

// 7. Mobile and desktop share the same resolved source.
const noComparison = resolvePricingComparison(
  "no",
  getPlanComparisonLabels("no"),
  noPricing.pricingLabels,
  noPricing.pricingLabels.supportLevels,
  noPricing.packages.items,
);
assert.equal(noComparison.categories.length, enComparison.categories.length);
assert.equal(
  noComparison.categories[1]?.capabilities[0]?.cells.starter.label,
  enComparison.categories[1]?.capabilities[0]?.cells.starter.label,
);

// 8–11. Plan CTA hrefs are valid marketing destinations.
for (const plan of enComparison.plans) {
  assert.ok(
    ALLOWED_PLAN_HREFS.has(plan.ctaHref) || plan.ctaHref.startsWith("/early-access"),
    `invalid plan href: ${plan.ctaHref}`,
  );
}
assert.equal(enComparison.finalCta.primaryHref, MARKETING_PRIMARY_CTA_HREFS.earlyAccess);
assert.equal(enComparison.header.bookDemoHref, MARKETING_PRIMARY_CTA_HREFS.bookDemo);

// 12. No raw canonical registry tokens in resolved labels.
const rawTokens = [
  "monthly_price",
  "catalog_quantity",
  "not_included",
  "custom_assessment",
  "catalog_support",
];
for (const label of collectResolvedCellLabels(enComparison)) {
  for (const token of rawTokens) {
    assert.notEqual(label, token, `raw canonical token leaked: ${token}`);
  }
  assert.doesNotMatch(label, /^pricingPage\.planComparison\./);
}

// 13. Anchor id for /pricing#compare.
assert.equal(enComparison.anchorId, "compare");

// 14–16. Core locales have localized comparison headers (not English fallback).
const EN_COMPARE_TITLE = "Compare plans side by side";
for (const locale of ["no", "sv", "da"] as const) {
  const labels = getPlanComparisonLabels(locale);
  assert.notEqual(labels.header.title, EN_COMPARE_TITLE, `${locale} comparison title still English`);
  assert.ok(labels.categories.pricing.length > 0);
  assert.ok(labels.cellStates.included.length > 0);
}

console.log("pricing-comparison.test.ts: all assertions passed");
