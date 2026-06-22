import type { HrProviderImplementationStatus } from "@/lib/integration-intelligence/hr/types";
import type { HrProviderManifest } from "@/lib/integration-intelligence/hr/types";
import {
  buildHrCapabilityId,
  isHrCapabilityBlocked,
} from "@/lib/integration-intelligence/hr/types";

export type HrProviderRuntimeStatus = {
  provider_key: string;
  implementation_status: HrProviderImplementationStatus;
  employee_management_enabled: boolean;
  employee_lifecycle_enabled: boolean;
  people_operations_enabled: boolean;
  team_center_enabled: boolean;
  workforce_scheduling_enabled: boolean;
  absence_coverage_enabled: boolean;
  employee_knowledge_enabled: boolean;
  verified: boolean;
  adapter_available: boolean;
  entitlement_active: boolean;
  business_pack_active: boolean;
};

export type HrCapabilityRuntimeRef = {
  capability_id: string;
  provider_key: string;
  capability_key: string;
  operation: "read" | "write";
  entity: string;
  adapter_available: boolean;
  approval_required: boolean;
  reversible: boolean;
  risk_level: number;
  required_permission: string | null;
  runtime_status: HrProviderImplementationStatus;
  privacy_sensitive: boolean;
  enabled: boolean;
};

export type HrCommandBriefSignal = {
  signal_key: string;
  count: number | null;
};

export type CompanionHrContext = {
  employee_management_enabled: boolean;
  employee_lifecycle_enabled: boolean;
  people_operations_enabled: boolean;
  team_center_enabled: boolean;
  workforce_scheduling_enabled: boolean;
  absence_coverage_enabled: boolean;
  employee_knowledge_enabled: boolean;
  human_oversight_required: boolean;
  salary_change_blocked: boolean;
  termination_blocked: boolean;
  health_data_blocked: boolean;
  legal_decision_blocked: boolean;
  irreversible_access_change_blocked: boolean;
  role_filter_active: boolean;
  department_scope_active: boolean;
  least_privilege_enforced: boolean;
  vacation_mode_active: boolean;
  onboarding_in_progress_count: number | null;
  absence_attention_count: number | null;
  expiring_certifications_count: number | null;
  pending_tasks_count: number | null;
  command_brief_signals: HrCommandBriefSignal[];
  command_brief_events_linked: boolean;
  providers: HrProviderRuntimeStatus[];
  capabilities: HrCapabilityRuntimeRef[];
  permission_denied: boolean;
  app_entitlement_blocked: boolean;
  privacy_filtered: boolean;
  cross_link_employees: string;
  cross_link_people: string;
  cross_link_onboarding: string;
  cross_link_scheduling: string;
  cross_link_absence: string;
  cross_link_team: string;
};

export function createEmptyCompanionHrContext(
  overrides?: Partial<CompanionHrContext>,
): CompanionHrContext {
  return {
    employee_management_enabled: false,
    employee_lifecycle_enabled: false,
    people_operations_enabled: false,
    team_center_enabled: false,
    workforce_scheduling_enabled: false,
    absence_coverage_enabled: false,
    employee_knowledge_enabled: false,
    human_oversight_required: true,
    salary_change_blocked: true,
    termination_blocked: true,
    health_data_blocked: true,
    legal_decision_blocked: true,
    irreversible_access_change_blocked: true,
    role_filter_active: true,
    department_scope_active: true,
    least_privilege_enforced: true,
    vacation_mode_active: false,
    onboarding_in_progress_count: null,
    absence_attention_count: null,
    expiring_certifications_count: null,
    pending_tasks_count: null,
    command_brief_signals: [],
    command_brief_events_linked: false,
    providers: [],
    capabilities: [],
    permission_denied: false,
    app_entitlement_blocked: false,
    privacy_filtered: false,
    cross_link_employees: "/app/employees",
    cross_link_people: "/app/people",
    cross_link_onboarding: "/app/employees/onboarding",
    cross_link_scheduling: "/app/workforce-scheduling",
    cross_link_absence: "/app/absence",
    cross_link_team: "/app/team",
    ...overrides,
  };
}

function engineEnabledForProvider(
  manifest: HrProviderManifest,
  providerStatus: HrProviderRuntimeStatus,
): boolean {
  switch (manifest.source_engine) {
    case "employee_management":
      return providerStatus.employee_management_enabled;
    case "employee_lifecycle":
      return providerStatus.employee_lifecycle_enabled;
    case "people_operations":
      return providerStatus.people_operations_enabled;
    case "team_center":
      return providerStatus.team_center_enabled;
    case "workforce_scheduling":
      return providerStatus.workforce_scheduling_enabled;
    case "absence_coverage":
      return providerStatus.absence_coverage_enabled;
    case "employee_knowledge":
      return providerStatus.employee_knowledge_enabled;
    case "hr_pack_adapter":
      return false;
    default:
      return false;
  }
}

export function buildHrCapabilityRuntimeRef(input: {
  manifest: HrProviderManifest;
  providerStatus: HrProviderRuntimeStatus;
  capability: HrProviderManifest["capabilities"][number];
  hasPermission: boolean;
}): HrCapabilityRuntimeRef | null {
  if (isHrCapabilityBlocked(input.capability.capability_key)) {
    return null;
  }

  const capabilityId = buildHrCapabilityId(
    input.manifest.provider_key,
    input.capability.capability_key,
    input.capability.operation,
  );

  const engineEnabled = engineEnabledForProvider(input.manifest, input.providerStatus);
  const packOk =
    !input.manifest.business_pack_key ||
    input.providerStatus.business_pack_active ||
    input.manifest.business_pack_key === null;

  const enabled =
    engineEnabled &&
    packOk &&
    input.providerStatus.entitlement_active &&
    input.hasPermission &&
    input.providerStatus.implementation_status !== "placeholder" &&
    (input.capability.operation === "read"
      ? true
      : input.capability.approval_required &&
        input.capability.reversible &&
        input.capability.risk_level <= 2);

  return {
    capability_id: capabilityId,
    provider_key: input.manifest.provider_key,
    capability_key: input.capability.capability_key,
    operation: input.capability.operation,
    entity: input.capability.entity,
    adapter_available: input.capability.adapter_available && input.providerStatus.adapter_available,
    approval_required: input.capability.approval_required,
    reversible: input.capability.reversible,
    risk_level: input.capability.risk_level,
    required_permission: input.capability.required_permission,
    runtime_status: input.providerStatus.implementation_status,
    privacy_sensitive: input.capability.privacy_sensitive,
    enabled: enabled && input.providerStatus.entitlement_active,
  };
}

export function filterHrCapabilitiesForPrivacy(
  context: CompanionHrContext,
): HrCapabilityRuntimeRef[] {
  if (context.permission_denied || context.app_entitlement_blocked) {
    return [];
  }

  return context.capabilities.filter((capability) => {
    if (!capability.privacy_sensitive) return true;
    return capability.enabled && capability.operation === "read";
  });
}

export function listEnabledHrCapabilities(
  context: CompanionHrContext,
): HrCapabilityRuntimeRef[] {
  return filterHrCapabilitiesForPrivacy(context).filter((capability) => capability.enabled);
}

export function findHrProviderStatus(
  context: CompanionHrContext,
  providerKey: string,
): HrProviderRuntimeStatus | null {
  return context.providers.find((provider) => provider.provider_key === providerKey) ?? null;
}
