import type { PackageKey } from "./types";

export const PRODUCT_SUITES = [
  { key: "aipify_core", label: "Aipify Core" },
  { key: "support_suite", label: "Support Suite" },
  { key: "operations_suite", label: "Operations Suite" },
  { key: "knowledge_suite", label: "Knowledge Suite" },
  { key: "insights_suite", label: "Insights Suite" },
  { key: "enterprise_intelligence_suite", label: "Enterprise Intelligence Suite" },
] as const;

export const OPTIONAL_ADDONS = [
  { key: "language_packs", label: "Additional Language Packs" },
  { key: "white_label", label: "White Label" },
  { key: "ai_credits", label: "Additional AI Credits" },
  { key: "additional_tenants", label: "Additional Tenants" },
  { key: "dedicated_onboarding", label: "Dedicated Onboarding" },
  { key: "advanced_integrations", label: "Advanced Integrations" },
] as const;

export const PACKAGE_LABELS: Record<PackageKey, string> = {
  starter: "Aipify Starter",
  professional: "Aipify Professional",
  business: "Aipify Business",
  insights: "Aipify Insights",
  enterprise: "Aipify Enterprise",
};

export const UPGRADE_PATH: PackageKey[] = [
  "starter",
  "professional",
  "business",
  "insights",
  "enterprise",
];
