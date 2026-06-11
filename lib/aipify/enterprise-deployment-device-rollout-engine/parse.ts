import type {
  EnterpriseDeploymentDeviceRolloutEngineCard,
  EnterpriseDeploymentDeviceRolloutEngineDashboard,
  EnterpriseDeploymentSummary,
  DeploymentEnrollmentToken,
  OrganizationLicense,
  RegisteredDevice,
} from "./types";

function asRecordList(value: unknown): Array<Record<string, unknown>> {
  return Array.isArray(value) ? (value as Array<Record<string, unknown>>) : [];
}

export function parseEnterpriseDeploymentDeviceRolloutEngineCard(
  data: unknown
): EnterpriseDeploymentDeviceRolloutEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    active_licenses: typeof d.active_licenses === "number" ? d.active_licenses : undefined,
    active_seats: typeof d.active_seats === "number" ? d.active_seats : undefined,
    registered_devices: typeof d.registered_devices === "number" ? d.registered_devices : undefined,
    stale_devices: typeof d.stale_devices === "number" ? d.stale_devices : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    ...d,
  };
}

export function parseEnterpriseDeploymentDeviceRolloutEngineDashboard(
  data: unknown
): EnterpriseDeploymentDeviceRolloutEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  const summary =
    typeof d.summary === "object" && d.summary
      ? (d.summary as EnterpriseDeploymentSummary)
      : undefined;

  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    summary,
    licenses: asRecordList(d.licenses),
    devices: asRecordList(d.devices),
    enrollment_tokens: asRecordList(d.enrollment_tokens),
    domains: asRecordList(d.domains),
    sso_configs: asRecordList(d.sso_configs),
    scim_readiness:
      typeof d.scim_readiness === "object" && d.scim_readiness
        ? (d.scim_readiness as Record<string, unknown>)
        : undefined,
    stale_enrollments: asRecordList(d.stale_enrollments),
    pending_invites: typeof d.pending_invites === "number" ? d.pending_invites : undefined,
    settings:
      typeof d.settings === "object" && d.settings ? (d.settings as Record<string, unknown>) : undefined,
    installer_downloads: d.installer_downloads,
    deployment_methods: d.deployment_methods,
    enterprise_readiness_link:
      typeof d.enterprise_readiness_link === "string" ? d.enterprise_readiness_link : undefined,
    command_center_link: typeof d.command_center_link === "string" ? d.command_center_link : undefined,
    subscription_link: typeof d.subscription_link === "string" ? d.subscription_link : undefined,
    ...d,
  };
}

export function parseOrganizationLicenses(data: unknown): OrganizationLicense[] {
  return Array.isArray(data) ? (data as OrganizationLicense[]) : [];
}

export function parseRegisteredDevices(data: unknown): RegisteredDevice[] {
  return Array.isArray(data) ? (data as RegisteredDevice[]) : [];
}

export function parseDeploymentEnrollmentTokens(data: unknown): DeploymentEnrollmentToken[] {
  return Array.isArray(data) ? (data as DeploymentEnrollmentToken[]) : [];
}
