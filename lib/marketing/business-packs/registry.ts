/** Canonical public marketing plan keys for Business Pack gating. */
export type PublicMarketingPlanKey = "starter" | "professional" | "business" | "enterprise";

/** Canonical public marketing Business Pack slugs — Phase 620. */
export const MARKETING_BUSINESS_PACK_SLUGS = [
  "hosts",
  "support",
  "warehouse",
  "commerce",
  "services",
  "projects",
  "finance",
] as const;

export type MarketingBusinessPackSlug = (typeof MARKETING_BUSINESS_PACK_SLUGS)[number];

export type MarketingBusinessPackCommercialType = "addon" | "tailored_addon";

export type MarketingBusinessPackRegistrationMode = "early_access" | "contact";

export type MarketingBusinessPackRegistryEntry = {
  slug: MarketingBusinessPackSlug;
  minPlan: PublicMarketingPlanKey;
  commercialType: MarketingBusinessPackCommercialType;
  registrationMode: MarketingBusinessPackRegistrationMode;
  relatedSlugs: MarketingBusinessPackSlug[];
  /** Legacy pricing card status key — maps to pricingPage.businessPacks.pricingStatus */
  pricingStatus: "addon" | "contact";
  detailHref: string;
};

export const MARKETING_BUSINESS_PACK_REGISTRY: MarketingBusinessPackRegistryEntry[] = [
  {
    slug: "hosts",
    minPlan: "business",
    commercialType: "addon",
    registrationMode: "early_access",
    relatedSlugs: ["support", "commerce"],
    pricingStatus: "addon",
    detailHref: "/business-packs/hosts",
  },
  {
    slug: "support",
    minPlan: "professional",
    commercialType: "addon",
    registrationMode: "early_access",
    relatedSlugs: ["warehouse", "commerce"],
    pricingStatus: "addon",
    detailHref: "/business-packs/support",
  },
  {
    slug: "warehouse",
    minPlan: "professional",
    commercialType: "addon",
    registrationMode: "early_access",
    relatedSlugs: ["support", "commerce"],
    pricingStatus: "addon",
    detailHref: "/business-packs/warehouse",
  },
  {
    slug: "commerce",
    minPlan: "professional",
    commercialType: "addon",
    registrationMode: "early_access",
    relatedSlugs: ["support", "finance"],
    pricingStatus: "addon",
    detailHref: "/business-packs/commerce",
  },
  {
    slug: "services",
    minPlan: "professional",
    commercialType: "addon",
    registrationMode: "early_access",
    relatedSlugs: ["support", "projects"],
    pricingStatus: "addon",
    detailHref: "/business-packs/services",
  },
  {
    slug: "projects",
    minPlan: "business",
    commercialType: "tailored_addon",
    registrationMode: "contact",
    relatedSlugs: ["services", "finance"],
    pricingStatus: "contact",
    detailHref: "/business-packs/projects",
  },
  {
    slug: "finance",
    minPlan: "business",
    commercialType: "addon",
    registrationMode: "early_access",
    relatedSlugs: ["commerce", "projects"],
    pricingStatus: "addon",
    detailHref: "/business-packs/finance",
  },
];

export function isMarketingBusinessPackSlug(value: string): value is MarketingBusinessPackSlug {
  return (MARKETING_BUSINESS_PACK_SLUGS as readonly string[]).includes(value);
}

export function getMarketingBusinessPackRegistryEntry(
  slug: string,
): MarketingBusinessPackRegistryEntry | undefined {
  return MARKETING_BUSINESS_PACK_REGISTRY.find((entry) => entry.slug === slug);
}

export function getMarketingBusinessPackDetailHref(slug: MarketingBusinessPackSlug): string {
  return `/business-packs/${slug}`;
}
