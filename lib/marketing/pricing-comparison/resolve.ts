import type { Locale } from "@/lib/i18n/config";
import { MARKETING_PRIMARY_CTA_HREFS } from "@/lib/marketing/primary-ctas";
import {
  formatLimitValue,
  formatPublicPlanPrice,
  getPublicPlanCatalog,
  type PublicMarketingPlanKey,
  type PublicPlanPriceFormatLabels,
} from "@/lib/marketing/public-pricing";
import { PRICING_COMPARISON_REGISTRY } from "./registry";
import type {
  CanonicalCellValue,
  PricingComparisonLabels,
  ResolvedComparisonCell,
  ResolvedPricingComparison,
} from "./types";

const PLAN_ORDER: PublicMarketingPlanKey[] = ["starter", "professional", "business", "enterprise"];

export type PricingComparisonPackageInput = {
  key: PublicMarketingPlanKey;
  name: string;
  audience: string;
  cta: string;
  ctaHref: string;
  statusKey?: "available" | "popular" | "enterprise";
};

export function resolvePricingComparison(
  locale: Locale,
  labels: PricingComparisonLabels,
  priceLabels: PublicPlanPriceFormatLabels,
  supportLevelLabels: Record<"standard" | "priority" | "dedicated", string>,
  packages: PricingComparisonPackageInput[],
): ResolvedPricingComparison {
  const catalog = getPublicPlanCatalog();
  const catalogByKey = Object.fromEntries(catalog.map((entry) => [entry.key, entry])) as Record<
    PublicMarketingPlanKey,
    (typeof catalog)[number]
  >;

  const categories = PRICING_COMPARISON_REGISTRY.map((category) => ({
    id: category.id,
    label: labels.categories[category.id],
    icon: category.icon,
    capabilities: category.capabilities.map((capability) => ({
      id: capability.id,
      label: labels.capabilities[capability.id],
      cells: Object.fromEntries(
        PLAN_ORDER.map((planKey) => [
          planKey,
          resolveCell(
            capability.values[planKey],
            planKey,
            catalogByKey[planKey],
            locale,
            labels,
            priceLabels,
            supportLevelLabels,
          ),
        ]),
      ) as Record<PublicMarketingPlanKey, ResolvedComparisonCell>,
    })),
  }));

  const packageByKey = Object.fromEntries(packages.map((pkg) => [pkg.key, pkg])) as Record<
    PublicMarketingPlanKey,
    PricingComparisonPackageInput
  >;

  const plans: ResolvedPricingComparison["plans"] = PLAN_ORDER.map((key) => {
    const pkg = packageByKey[key];
    const entry = catalogByKey[key];
    return {
      key,
      name: pkg.name,
      price: formatPublicPlanPrice(entry.price, locale, priceLabels),
      audience: labels.planAudience[key] ?? pkg.audience,
      cta: pkg.cta,
      ctaHref: pkg.ctaHref,
      isPopular: pkg.statusKey === "popular",
    };
  });

  return {
    anchorId: "compare",
    categories,
    plans,
    header: {
      ...labels.header,
      bookDemoHref: MARKETING_PRIMARY_CTA_HREFS.bookDemo,
    },
    finalCta: {
      ...labels.finalCta,
      primaryHref: MARKETING_PRIMARY_CTA_HREFS.earlyAccess,
      secondaryHref: "/contact",
    },
  supportingText: labels.supportingText,
  mobile: labels.mobile,
  popularBadge: labels.popularBadge,
};
}

function resolveCell(
  value: CanonicalCellValue,
  planKey: PublicMarketingPlanKey,
  catalogEntry: ReturnType<typeof getPublicPlanCatalog>[number],
  locale: Locale,
  labels: PricingComparisonLabels,
  priceLabels: PublicPlanPriceFormatLabels,
  supportLevelLabels: Record<"standard" | "priority" | "dedicated", string>,
): ResolvedComparisonCell {
  switch (value.type) {
    case "monthly_price":
      return {
        visual: "text",
        label: formatPublicPlanPrice(catalogEntry.price, locale, priceLabels),
      };
    case "included":
      return { visual: "included", label: labels.cellStates.included };
    case "not_included":
      return { visual: "not_included", label: labels.cellStates.notIncluded };
    case "addon":
      return { visual: "badge", badgeVariant: "addon", label: labels.cellStates.addon };
    case "custom":
      return { visual: "badge", badgeVariant: "custom", label: labels.cellStates.custom };
    case "contact":
      return { visual: "badge", badgeVariant: "contact", label: labels.cellStates.contact };
    case "upgrade":
      return { visual: "badge", badgeVariant: "upgrade", label: labels.cellStates.upgrade };
    case "catalog_quantity":
      return {
        visual: "text",
        label: formatLimitValue(catalogEntry.limits[value.field], { custom: labels.cellStates.custom }),
      };
    case "catalog_support":
      return {
        visual: "text",
        label: supportLevelLabels[catalogEntry.supportLevel],
      };
    case "level":
      return {
        visual: "text",
        label: labels.levels[value.level],
      };
    case "early_access":
      return { visual: "text", label: labels.earlyAccess };
    case "consultation":
      return { visual: "text", label: labels.consultation };
    case "custom_assessment":
      return { visual: "text", label: labels.customAssessment };
    default: {
      const _exhaustive: never = value;
      return _exhaustive;
    }
  }
}

/** Flatten all resolved cell labels — used in tests to ensure no raw canonical tokens leak. */
export function collectResolvedCellLabels(comparison: ResolvedPricingComparison): string[] {
  const out: string[] = [];
  for (const category of comparison.categories) {
    for (const capability of category.capabilities) {
      for (const plan of comparison.plans) {
        out.push(capability.cells[plan.key].label);
      }
    }
  }
  return out;
}
