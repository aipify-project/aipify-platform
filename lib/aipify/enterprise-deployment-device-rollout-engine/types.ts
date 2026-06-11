export type DeploymentMethod =
  | "email_invite"
  | "license_key"
  | "enrollment_token"
  | "sso_readiness"
  | "managed_enterprise"
  | "hybrid_connector"
  | "silent_install";

export type DeviceStatus = "pending" | "active" | "stale" | "failed" | "revoked";

export type EnterpriseDeploymentDeviceRolloutEngineCard = {
  has_organization: boolean;
  active_licenses?: number;
  active_seats?: number;
  registered_devices?: number;
  stale_devices?: number;
  philosophy?: string;
  [key: string]: unknown;
};

export type EnterpriseDeploymentSummary = {
  active_licenses?: number;
  total_seats?: number;
  active_seats?: number;
  registered_devices?: number;
  stale_or_failed_devices?: number;
  active_enrollment_tokens?: number;
  verified_domains?: number;
  sso_providers_ready?: number;
};

export type EnterpriseDeploymentDeviceRolloutEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  privacy_note?: string;
  summary?: EnterpriseDeploymentSummary;
  licenses: Array<Record<string, unknown>>;
  devices: Array<Record<string, unknown>>;
  enrollment_tokens: Array<Record<string, unknown>>;
  domains: Array<Record<string, unknown>>;
  sso_configs: Array<Record<string, unknown>>;
  scim_readiness?: Record<string, unknown>;
  stale_enrollments: Array<Record<string, unknown>>;
  pending_invites?: number;
  settings?: Record<string, unknown>;
  installer_downloads?: unknown;
  deployment_methods?: unknown;
  enterprise_readiness_link?: string;
  command_center_link?: string;
  subscription_link?: string;
  [key: string]: unknown;
};

export type OrganizationLicense = {
  id?: string;
  license_type?: string;
  seat_limit?: number;
  active_seats?: number;
  status?: string;
  issued_at?: string;
  expires_at?: string;
  [key: string]: unknown;
};

export type RegisteredDevice = {
  id?: string;
  device_name?: string;
  device_type?: string;
  os?: string;
  companion_version?: string;
  enrollment_method?: DeploymentMethod;
  status?: DeviceStatus;
  last_seen_at?: string;
  [key: string]: unknown;
};

export type DeploymentEnrollmentToken = {
  id?: string;
  token_name?: string;
  max_uses?: number;
  used_count?: number;
  expires_at?: string;
  status?: string;
  [key: string]: unknown;
};
