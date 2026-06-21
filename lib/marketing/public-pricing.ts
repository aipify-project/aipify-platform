/**
 * Canonical public pricing catalog for /pricing — single source for limits and published prices.
 * Amounts must stay aligned with `public.plans.price_amount` for new checkout flows.
 *
 * BILLING NOTE: Updating these amounts does not change Stripe/Klarna product IDs or existing
 * subscription rows. After changing published prices, apply a forward migration to
 * `public.plans` and create new payment-provider price objects in each environment before
 * routing live checkout to the new amounts. Never auto-reprice active subscriptions.
 */
import { PRODUCT_PACKAGES, type ProductPackage } from "@/lib/core/plans";
import type { PlanType } from "@/lib/platform/types";
import type { Locale } from "@/lib/i18n/config";
import {
  MARKETING_BUSINESS_PACK_REGISTRY,
  type MarketingBusinessPackCommercialType,
  type PublicMarketingPlanKey,
} from "@/lib/marketing/business-packs/registry";

export type { PublicMarketingPlanKey } from "@/lib/marketing/business-packs/registry";

const PLAN_TO_CORE: Record<PublicMarketingPlanKey, PlanType> = {
  starter: "starter",
  professional: "growth",
  business: "business",
  enterprise: "enterprise",
};

/** Published monthly prices from Core plans seed — enterprise uses custom pricing. */
export const PUBLIC_PLAN_PRICES: Record<
  Exclude<PublicMarketingPlanKey, "enterprise">,
  { amount: number; currency: "NOK"; period: "monthly" }
> = {
  starter: { amount: 799, currency: "NOK", period: "monthly" },
  professional: { amount: 2500, currency: "NOK", period: "monthly" },
  business: { amount: 6999, currency: "NOK", period: "monthly" },
};

export type BusinessPackPricingModel =
  | "included"
  | "addon"
  | "custom"
  | "pilot"
  | "contact";

export type PublicBusinessPackCatalogItem = {
  id: string;
  slug: string;
  name: string;
  audience: string;
  value: string;
  pricingStatus: BusinessPackPricingModel;
  commercialType: MarketingBusinessPackCommercialType;
  planRequirement: PublicMarketingPlanKey;
  detailHref: string;
};

/** Pricing card catalog — content keys resolved from `businessPackDetailPages` + `pricingPage.businessPacks.catalog`. */
export const PUBLIC_BUSINESS_PACK_CATALOG: PublicBusinessPackCatalogItem[] =
  MARKETING_BUSINESS_PACK_REGISTRY.map((entry) => ({
    id: entry.slug,
    slug: entry.slug,
    name: entry.slug,
    audience: entry.slug,
    value: entry.slug,
    pricingStatus: entry.pricingStatus,
    commercialType: entry.commercialType,
    planRequirement: entry.minPlan,
    detailHref: entry.detailHref,
  }));

export type PublicPlanCatalogEntry = {
  key: PublicMarketingPlanKey;
  corePlan: PlanType;
  limits: Pick<ProductPackage, "users" | "domains" | "installations">;
  price:
    | { type: "published"; amount: number; currency: "NOK"; period: "monthly" }
    | { type: "custom" };
  businessPacks: {
    availability: "none" | "addon" | "multiple" | "custom";
    includedCount: number | "custom" | null;
    note: string;
  };
  supportLevel: "standard" | "priority" | "dedicated";
};

export function getPublicPlanCatalog(): PublicPlanCatalogEntry[] {
  const keys: PublicMarketingPlanKey[] = ["starter", "professional", "business", "enterprise"];

  return keys.map((key) => {
    const corePlan = PLAN_TO_CORE[key];
    const pkg = PRODUCT_PACKAGES[corePlan];

    const price: PublicPlanCatalogEntry["price"] =
      key === "enterprise"
        ? { type: "custom" }
        : {
            type: "published",
            ...PUBLIC_PLAN_PRICES[key],
          };

    const businessPacks: PublicPlanCatalogEntry["businessPacks"] =
      key === "starter"
        ? {
            availability: "none",
            includedCount: 0,
            note: "Upgrade to Professional or Business to add Business Packs.",
          }
        : key === "professional"
          ? {
              availability: "addon",
              includedCount: null,
              note: "Business Packs purchased separately as add-ons.",
            }
          : key === "business"
            ? {
                availability: "multiple",
                includedCount: null,
                note: "Multiple Business Packs supported as add-ons with capacity-based pricing.",
              }
            : {
                availability: "custom",
                includedCount: "custom",
                note: "Custom Business Pack configurations through enterprise agreement.",
              };

    const supportLevel: PublicPlanCatalogEntry["supportLevel"] =
      key === "enterprise" ? "dedicated" : key === "business" || key === "professional" ? "priority" : "standard";

    return {
      key,
      corePlan,
      limits: {
        users: pkg.users,
        domains: pkg.domains,
        installations: pkg.installations,
      },
      price,
      businessPacks,
      supportLevel,
    };
  });
}

export type PublicPlanPriceFormatLabels = {
  custom: string;
  perMonth: string;
  perMonthShort?: string;
};

export function formatPublicPlanPrice(
  price: PublicPlanCatalogEntry["price"],
  locale: Locale | string,
  labels: PublicPlanPriceFormatLabels,
): string {
  if (price.type === "custom") return labels.custom;

  const { amount } = price;
  const monthLabel = labels.perMonthShort ?? labels.perMonth;

  if (locale === "no") {
    const formatted = new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 0 }).format(amount).replace(/\u00a0/g, " ");
    return `${formatted},- / ${monthLabel}`;
  }

  if (locale === "sv") {
    const formatted = new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(amount).replace(/\u00a0/g, " ");
    return `${formatted} kr / ${monthLabel}`;
  }

  if (locale === "da") {
    const formatted = new Intl.NumberFormat("da-DK", { maximumFractionDigits: 0 }).format(amount).replace(/\u00a0/g, " ");
    return `${formatted} kr / ${monthLabel}`;
  }

  const formatted = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(amount);
  return `NOK ${formatted} / ${labels.perMonth}`;
}

export function formatPublicPlanComparisonPrices(
  locale: Locale | string,
  labels: PublicPlanPriceFormatLabels,
): Record<PublicMarketingPlanKey, string> {
  const catalog = getPublicPlanCatalog();
  return Object.fromEntries(
    catalog.map((entry) => [entry.key, formatPublicPlanPrice(entry.price, locale, labels)]),
  ) as Record<PublicMarketingPlanKey, string>;
}

export function formatLimitValue(value: number | "custom", labels: { custom: string }): string {
  return value === "custom" ? labels.custom : String(value);
}

/** Annual billing is schema-supported but no verified public annual prices are published. */
export const PUBLIC_BILLING_PERIODS_AVAILABLE = ["monthly"] as const;
