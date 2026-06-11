export const APP_CATEGORIES = [
  "skill",
  "agent_extension",
  "industry_blueprint",
  "knowledge_pack",
  "workflow_pack",
  "automation_pack",
  "desktop_extension",
  "dashboard_module",
  "integration",
  "analytics_module",
  "developer_utility",
] as const;

export const APP_RISK_LEVELS = ["low", "medium", "high", "restricted"] as const;

export const PARTNER_TIERS = [
  "internal",
  "verified_developer",
  "agency_partner",
  "enterprise_partner",
] as const;

export const APP_INSTALL_STATUSES = [
  "pending_approval",
  "installed",
  "active",
  "disabled",
  "update_available",
  "failed",
  "uninstalled",
] as const;

export type EcosystemApp = {
  id: string;
  app_key: string;
  name: string;
  description?: string | null;
  category: string;
  author: string;
  author_tier: string;
  version: string;
  status: string;
  risk_level: string;
  permissions: string[];
  deployment_modes?: string[];
  required_modules?: string[];
  minimum_aipify_version?: string;
  support_contact?: string | null;
  sandbox_required?: boolean;
  install_count?: number;
  rating?: number;
  installed?: boolean;
};

export type AppInstall = {
  install_id: string;
  app_key: string;
  name: string;
  category: string;
  version: string;
  latest_version?: string;
  status: string;
  risk_level: string;
  permissions: string[];
  update_available?: boolean;
  installed_at?: string;
};

export type AppReview = {
  app_key?: string;
  rating: number;
  review?: string | null;
  created_at?: string;
};

export type AppMetric = {
  metric_key: string;
  metric_value: number;
  created_at?: string;
};

export type AppVersion = {
  version: string;
  release_notes?: string | null;
  permissions_changed?: boolean;
  created_at?: string;
};

export type EcosystemAppsCard = {
  has_customer: boolean;
  installed_apps?: number;
  updates_available?: number;
  philosophy?: string;
  privacy_note?: string;
};

export type EcosystemAppsDashboard = {
  has_customer: boolean;
  catalog: EcosystemApp[];
  installed: AppInstall[];
  recent_reviews: AppReview[];
  installed_count?: number;
  updates_available?: number;
};

export type EcosystemAppDetail = {
  app: EcosystemApp;
  install?: {
    install_id: string;
    version: string;
    status: string;
    installed_at?: string;
  } | null;
  versions: AppVersion[];
  reviews: AppReview[];
  metrics: AppMetric[];
  manifest?: Record<string, unknown>;
};

export type ManifestValidation = {
  valid: boolean;
  errors?: string[];
  sandbox_required?: boolean;
};

export type AppInstallPrecheck = {
  allowed: boolean;
  reason?: string;
  app?: EcosystemApp;
  requires_approval?: boolean;
  requires_governance?: boolean;
  policy?: Record<string, unknown>;
  permissions?: string[];
  sandbox_required?: boolean;
  risk_level?: string;
};

export type AppInstallResult = {
  status: string;
  install_id?: string;
  precheck?: AppInstallPrecheck;
  version?: string;
};

export type DeveloperPortalInfo = {
  sdk_version: string;
  manifest_spec_url: string;
  sandbox_restrictions: string[];
  partner_tiers: string[];
  publishing_steps: string[];
};
