export type PackageType = "core" | "suite" | "addon" | "enterprise";

export type ModuleStatus =
  | "enabled"
  | "disabled"
  | "trial"
  | "beta"
  | "deprecated"
  | "enterprise_only";

export type PackageKey =
  | "starter"
  | "professional"
  | "business"
  | "insights"
  | "enterprise";

export type EnterprisePricingPhilosophy = {
  doc?: string;
  principle?: string;
  value_based_avoid?: string[];
  value_based_price_on?: string[];
  customer_segments?: Array<Record<string, unknown>>;
  plan_pricing_guidance?: Array<Record<string, unknown>>;
  enterprise_implementation?: Record<string, unknown>;
  sales_expert_examples?: Array<Record<string, unknown>>;
  revenue_model?: Record<string, unknown>;
  positioning_comparisons?: Array<{ avoid?: string; prefer?: string }>;
  pricing_signal_expectations?: string[];
  abos_principle?: string;
  vision?: string[];
  guidance_note?: string;
};

export type BillingCenter = {
  has_customer: boolean;
  current_package?: {
    package_key: string;
    package_name: string;
    description: string;
    features: string[];
  };
  enabled_modules?: Array<Record<string, unknown>>;
  usage?: Record<string, unknown>;
  tenant_limits?: Record<string, unknown>;
  upgrade_options?: Array<Record<string, unknown>>;
  addon_marketplace?: Array<Record<string, unknown>>;
  upgrade_recommendations?: Array<Record<string, unknown>>;
  billing_history?: Array<Record<string, unknown>>;
  suites?: Array<{ key: string; label: string }>;
  privacy_note?: string;
  positioning?: string;
  enterprise_pricing_philosophy?: EnterprisePricingPhilosophy;
};

export type ModulesCenter = {
  has_customer: boolean;
  current_package?: string;
  installed_modules?: Array<Record<string, unknown>>;
  available_modules?: Array<Record<string, unknown>>;
  trial_modules?: Array<Record<string, unknown>>;
  upgrade_recommendations?: Array<Record<string, unknown>>;
  feature_flag_states?: string[];
  packages?: Array<Record<string, unknown>>;
  documentation_note?: string;
  integrations?: Record<string, string>;
};
