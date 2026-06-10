export const USER_ROLES = ["owner", "admin", "support", "staff"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const SYSTEM_TYPES = ["wordpress", "shopify", "custom", "other"] as const;

export type SystemType = (typeof SYSTEM_TYPES)[number];

export const INSTALLATION_STATUSES = [
  "pending",
  "active",
  "paused",
  "revoked",
] as const;

export type InstallationStatus = (typeof INSTALLATION_STATUSES)[number];

export const MODULE_KEYS = [
  "support_ai",
  "analytics_ai",
  "assistant",
  "commerce_ai",
  "notifications",
  "install_ai",
] as const;

export type ModuleKey = (typeof MODULE_KEYS)[number];

export const INTEGRATION_KEYS = [
  "supabase",
  "shopify",
  "resend",
  "wordpress",
  "stripe",
  "openai",
] as const;

export type IntegrationKey = (typeof INTEGRATION_KEYS)[number];

export const INTEGRATION_STATUSES = [
  "connected",
  "pending",
  "error",
  "disconnected",
] as const;

export type IntegrationStatus = (typeof INTEGRATION_STATUSES)[number];

export const AIPIFY_PERMISSIONS = ["read", "write", "admin", "none"] as const;

export type AipifyPermission = (typeof AIPIFY_PERMISSIONS)[number];

export type Company = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type AppUser = {
  id: string;
  auth_user_id: string;
  company_id: string;
  full_name: string;
  role: UserRole;
  created_at: string;
};

export type InstallationModule = {
  module_key: ModuleKey;
  enabled: boolean;
};

export type InstallationIntegration = {
  integration_key: IntegrationKey;
  status: IntegrationStatus;
  last_synced_at: string | null;
};

export type Installation = {
  id: string;
  company_id: string;
  name: string | null;
  site_url: string | null;
  system_type: SystemType;
  status: InstallationStatus;
  installed_at: string | null;
  last_synced_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  company?: Pick<Company, "name"> | null;
  modules?: InstallationModule[];
  integrations?: InstallationIntegration[];
};

export type InstallationRoleMapping = {
  id: string;
  installation_id: string;
  external_role: string;
  aipify_permission: AipifyPermission;
  created_at: string;
};

export type DashboardProfile = {
  user: AppUser;
  company: Company;
};

export type InstallationContext = {
  installation: Installation;
  company: Company;
};
