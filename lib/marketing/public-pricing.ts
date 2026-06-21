/**
 * Canonical public pricing catalog for /pricing — single source for limits and published prices.
 * Prices align with `public.plans` seed (NOK, monthly). Do not duplicate amounts in components.
 */
import { PRODUCT_PACKAGES, type ProductPackage } from "@/lib/core/plans";
import type { PlanType } from "@/lib/platform/types";

export type PublicMarketingPlanKey = "starter" | "professional" | "business" | "enterprise";

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
  starter: { amount: 490, currency: "NOK", period: "monthly" },
  professional: { amount: 1490, currency: "NOK", period: "monthly" },
  business: { amount: 3990, currency: "NOK", period: "monthly" },
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
  planRequirement: PublicMarketingPlanKey;
  detailHref: string;
};

export const PUBLIC_BUSINESS_PACK_CATALOG: PublicBusinessPackCatalogItem[] = [
  {
    id: "hosts",
    slug: "hosts",
    name: "Aipify Hosts",
    audience: "Hospitality and property operators",
    value: "Guest operations, property workflows, and occupancy visibility.",
    pricingStatus: "addon",
    planRequirement: "business",
    detailHref: "/business-packs/hosts",
  },
  {
    id: "support",
    slug: "support",
    name: "Aipify Support",
    audience: "Customer service and support teams",
    value: "Governed triage, knowledge-backed responses, and escalation.",
    pricingStatus: "addon",
    planRequirement: "professional",
    detailHref: "/business-packs/support",
  },
  {
    id: "commerce",
    slug: "commerce",
    name: "Aipify Commerce",
    audience: "Retail and e-commerce operations",
    value: "Order visibility, inventory coordination, and customer touchpoints.",
    pricingStatus: "addon",
    planRequirement: "professional",
    detailHref: "/pricing#business-packs",
  },
  {
    id: "services",
    slug: "services",
    name: "Aipify Services",
    audience: "Professional services organizations",
    value: "Client delivery, knowledge retention, and executive visibility.",
    pricingStatus: "addon",
    planRequirement: "professional",
    detailHref: "/pricing#business-packs",
  },
  {
    id: "projects",
    slug: "projects",
    name: "Aipify Projects",
    audience: "Project-driven teams",
    value: "Delivery coordination, approvals, and operational handoffs.",
    pricingStatus: "contact",
    planRequirement: "business",
    detailHref: "/pricing#business-packs",
  },
  {
    id: "finance",
    slug: "finance",
    name: "Aipify Finance",
    audience: "Finance and operations leaders",
    value: "Operational finance visibility with governance controls.",
    pricingStatus: "addon",
    planRequirement: "business",
    detailHref: "/business-packs/finance",
  },
];

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

export function formatPublicPlanPrice(
  price: PublicPlanCatalogEntry["price"],
  labels: { custom: string; perMonth: string; currencySuffix: string },
): string {
  if (price.type === "custom") return labels.custom;
  const formatted = new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: price.currency,
    maximumFractionDigits: 0,
  }).format(price.amount);
  return `${formatted}${labels.currencySuffix} ${labels.perMonth}`;
}

export function formatLimitValue(value: number | "custom", labels: { custom: string }): string {
  return value === "custom" ? labels.custom : String(value);
}

/** Annual billing is schema-supported but no verified public annual prices are published. */
export const PUBLIC_BILLING_PERIODS_AVAILABLE = ["monthly"] as const;
