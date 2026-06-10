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

export type Installation = {
  id: string;
  company_id: string;
  system_type: SystemType;
  status: InstallationStatus;
  installed_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
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
