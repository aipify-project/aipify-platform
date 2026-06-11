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
