import type { PublicMarketingPlanKey } from "@/lib/marketing/public-pricing";

export type ComparisonCategoryId =
  | "pricing"
  | "organization"
  | "business_packs"
  | "operations"
  | "companion"
  | "governance"
  | "support"
  | "deployment";

export type ComparisonCapabilityId =
  | "monthly_price"
  | "annual_price"
  | "trial_pilot"
  | "included_users"
  | "additional_users"
  | "included_domains"
  | "additional_domains"
  | "pack_availability"
  | "included_packs"
  | "workflows_approvals"
  | "reporting"
  | "companion_context"
  | "policy_controls"
  | "support_level"
  | "cloud_deployment"
  | "hybrid_deployment";

export type ComparisonLevelId =
  | "foundation"
  | "essential"
  | "basic"
  | "included"
  | "expanded"
  | "advanced"
  | "approvals"
  | "enterprise";

/** Canonical cell value — resolved to localized display via `resolvePricingComparison`. */
export type CanonicalCellValue =
  | { type: "monthly_price" }
  | { type: "included" }
  | { type: "not_included" }
  | { type: "addon" }
  | { type: "custom" }
  | { type: "contact" }
  | { type: "upgrade" }
  | { type: "catalog_quantity"; field: "users" | "domains" }
  | { type: "catalog_support" }
  | { type: "level"; level: ComparisonLevelId }
  | { type: "early_access" }
  | { type: "consultation" }
  | { type: "custom_assessment" };

export type ComparisonCategoryDefinition = {
  id: ComparisonCategoryId;
  icon: "credit-card" | "building" | "package" | "settings" | "sparkles" | "scale" | "life-buoy" | "cloud";
  capabilities: ComparisonCapabilityDefinition[];
};

export type ComparisonCapabilityDefinition = {
  id: ComparisonCapabilityId;
  values: Record<PublicMarketingPlanKey, CanonicalCellValue>;
};

export type ResolvedCellVisual = "included" | "not_included" | "badge" | "text";

export type ResolvedComparisonCell = {
  visual: ResolvedCellVisual;
  label: string;
  badgeVariant?: "addon" | "custom" | "upgrade" | "contact";
};

export type ResolvedComparisonCapability = {
  id: ComparisonCapabilityId;
  label: string;
  cells: Record<PublicMarketingPlanKey, ResolvedComparisonCell>;
};

export type ResolvedComparisonCategory = {
  id: ComparisonCategoryId;
  label: string;
  icon: ComparisonCategoryDefinition["icon"];
  capabilities: ResolvedComparisonCapability[];
};

export type ResolvedComparisonPlan = {
  key: PublicMarketingPlanKey;
  name: string;
  price: string;
  audience: string;
  cta: string;
  ctaHref: string;
  isPopular?: boolean;
};

export type PricingComparisonLabels = {
  categories: Record<ComparisonCategoryId, string>;
  capabilities: Record<ComparisonCapabilityId, string>;
  cellStates: {
    included: string;
    notIncluded: string;
    addon: string;
    custom: string;
    upgrade: string;
    contact: string;
  };
  levels: Record<ComparisonLevelId, string>;
  earlyAccess: string;
  consultation: string;
  customAssessment: string;
  planAudience: Record<PublicMarketingPlanKey, string>;
  mobile: {
    selectPlan: string;
    capabilityColumn: string;
  };
  popularBadge: string;
  header: {
    eyebrow: string;
    title: string;
    description: string;
    helpChoosing: string;
    bookDemo: string;
  };
  finalCta: {
    headline: string;
    primary: string;
    secondary: string;
  };
  supportingText: string;
};

export type ResolvedPricingComparison = {
  anchorId: "compare";
  categories: ResolvedComparisonCategory[];
  plans: ResolvedComparisonPlan[];
  header: PricingComparisonLabels["header"] & { bookDemoHref: string };
  finalCta: PricingComparisonLabels["finalCta"] & {
    primaryHref: string;
    secondaryHref: string;
  };
  supportingText: string;
  mobile: PricingComparisonLabels["mobile"];
  popularBadge: string;
};
