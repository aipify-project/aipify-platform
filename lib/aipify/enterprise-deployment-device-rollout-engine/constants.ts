/**
 * Silent install parameters for enterprise Desktop Command Center rollout (Phase A.39).
 * Used by MDM/Intune/Jamf packaging — values supplied at install time, never stored in plaintext server-side.
 */

export const SILENT_INSTALL_PARAMS = {
  AIPIFY_TENANT_SLUG: "AIPIFY_TENANT_SLUG",
  AIPIFY_REGION: "AIPIFY_REGION",
  AIPIFY_ENROLLMENT_TOKEN: "AIPIFY_ENROLLMENT_TOKEN",
  AIPIFY_AUTO_START: "AIPIFY_AUTO_START",
  AIPIFY_SSO_REQUIRED: "AIPIFY_SSO_REQUIRED",
} as const;

export type SilentInstallParamKey = keyof typeof SILENT_INSTALL_PARAMS;

export const SILENT_INSTALL_DEFAULTS = {
  [SILENT_INSTALL_PARAMS.AIPIFY_AUTO_START]: "true",
  [SILENT_INSTALL_PARAMS.AIPIFY_SSO_REQUIRED]: "false",
} as const;

export const DEPLOYMENT_METHODS = [
  "email_invite",
  "license_key",
  "enrollment_token",
  "sso_readiness",
  "managed_enterprise",
  "hybrid_connector",
  "silent_install",
] as const;

export type DeploymentMethodFromConstants = (typeof DEPLOYMENT_METHODS)[number];

export const DEVICE_TYPES = ["desktop", "laptop", "tablet", "mobile", "vm", "other"] as const;

export const ENROLLMENT_METHODS = [
  "email_invite",
  "license_key",
  "enrollment_token",
  "sso_readiness",
  "managed_enterprise",
  "hybrid_connector",
  "silent_install",
] as const;

export const LICENSE_TYPES = ["starter", "business", "enterprise", "trial", "internal"] as const;

export const SSO_PROVIDERS = [
  "okta",
  "azure_ad",
  "google_workspace",
  "onelogin",
  "custom_saml",
  "custom_oidc",
] as const;

/** Privacy — never collect keystroke or screen monitoring data. */
export const DEPLOYMENT_PRIVACY_RULES = {
  keystroke_monitoring: false,
  screen_monitoring: false,
  metadata_only: true,
} as const;

export const ENTERPRISE_INSTALLER_REQUIREMENTS = {
  macos: {
    min_os: "13.0",
    package_type: "dmg",
    silent_flags: ["--silent", `--${SILENT_INSTALL_PARAMS.AIPIFY_ENROLLMENT_TOKEN}=<token>`],
    code_signing_required: true,
  },
  windows: {
    min_os: "Windows 10 21H2",
    package_type: "msi",
    silent_flags: ["/quiet", `/PARAM:${SILENT_INSTALL_PARAMS.AIPIFY_ENROLLMENT_TOKEN}=<token>`],
    code_signing_required: true,
  },
  linux: {
    min_os: "Ubuntu 22.04 LTS",
    package_type: "deb",
    silent_flags: ["DEBIAN_FRONTEND=noninteractive"],
    code_signing_required: false,
  },
} as const;

export const HYBRID_CONNECTOR_SCaffold = {
  status: "preparation",
  description:
    "Hybrid connector allows on-prem metadata sync without storing customer operational records in Aipify cloud.",
  endpoints: {
    health: "/api/aipify/enterprise/connectors/health",
    sync_metadata: "/api/aipify/enterprise/connectors/sync",
  },
  documentation_ref: "kc://enterprise-deployment-device-rollout-engine/faq",
} as const;
