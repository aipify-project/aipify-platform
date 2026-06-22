import type {
  SecurityProviderImplementationStatus,
  SecurityProviderManifest,
} from "@/lib/integration-intelligence/security/types";
import {
  buildSecurityCapabilityId,
  isSecurityCapabilityBlocked,
} from "@/lib/integration-intelligence/security/types";

export type SecurityProviderRuntimeStatus = {
  provider_key: string;
  implementation_status: SecurityProviderImplementationStatus;
  trust_center_verification_enabled: boolean;
  identity_access_enabled: boolean;
  security_compliance_enabled: boolean;
  audit_accountability_enabled: boolean;
  governance_management_enabled: boolean;
  verified: boolean;
  adapter_available: boolean;
  entitlement_active: boolean;
  business_pack_active: boolean;
};

export type SecurityCapabilityRuntimeRef = {
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
  runtime_status: SecurityProviderImplementationStatus;
  privacy_sensitive: boolean;
  enabled: boolean;
};

export type SecurityCommandBriefSignal = {
  signal_key: string;
  count: number | null;
};

export type CompanionSecurityContext = {
  trust_center_verification_enabled: boolean;
  identity_access_enabled: boolean;
  security_compliance_enabled: boolean;
  audit_accountability_enabled: boolean;
  governance_management_enabled: boolean;
  identity_auto_approve_blocked: boolean;
  permanent_access_revocation_blocked: boolean;
  audit_log_deletion_blocked: boolean;
  tfa_disable_blocked: boolean;
  sensitive_account_change_blocked: boolean;
  compliance_decision_blocked: boolean;
  irreversible_security_action_blocked: boolean;
  role_based_access_active: boolean;
  sensitive_documents_masked: boolean;
  secrets_and_auth_data_filtered: boolean;
  least_privilege_enforced: boolean;
  pending_verifications_count: number | null;
  access_reviews_required_count: number | null;
  open_incidents_count: number | null;
  open_risks_count: number | null;
  secrets_expiring_count: number | null;
  compliance_attention_count: number | null;
  command_brief_signals: SecurityCommandBriefSignal[];
  command_brief_events_linked: boolean;
  providers: SecurityProviderRuntimeStatus[];
  capabilities: SecurityCapabilityRuntimeRef[];
  permission_denied: boolean;
  app_entitlement_blocked: boolean;
  privacy_filtered: boolean;
  cross_link_trust: string;
  cross_link_security: string;
  cross_link_compliance: string;
  cross_link_governance: string;
  cross_link_identity_access: string;
  cross_link_audit: string;
};

export function createEmptyCompanionSecurityContext(
  overrides?: Partial<CompanionSecurityContext>,
): CompanionSecurityContext {
  return {
    trust_center_verification_enabled: false,
    identity_access_enabled: false,
    security_compliance_enabled: false,
    audit_accountability_enabled: false,
    governance_management_enabled: false,
    identity_auto_approve_blocked: true,
    permanent_access_revocation_blocked: true,
    audit_log_deletion_blocked: true,
    tfa_disable_blocked: true,
    sensitive_account_change_blocked: true,
    compliance_decision_blocked: true,
    irreversible_security_action_blocked: true,
    role_based_access_active: true,
    sensitive_documents_masked: true,
    secrets_and_auth_data_filtered: true,
    least_privilege_enforced: true,
    pending_verifications_count: null,
    access_reviews_required_count: null,
    open_incidents_count: null,
    open_risks_count: null,
    secrets_expiring_count: null,
    compliance_attention_count: null,
    command_brief_signals: [],
    command_brief_events_linked: false,
    providers: [],
    capabilities: [],
    permission_denied: false,
    app_entitlement_blocked: false,
    privacy_filtered: false,
    cross_link_trust: "/app/trust",
    cross_link_security: "/app/security",
    cross_link_compliance: "/app/compliance",
    cross_link_governance: "/app/governance",
    cross_link_identity_access: "/app/identity-access",
    cross_link_audit: "/app/audit-accountability",
    ...overrides,
  };
}

function engineEnabledForProvider(
  manifest: SecurityProviderManifest,
  providerStatus: SecurityProviderRuntimeStatus,
): boolean {
  switch (manifest.source_engine) {
    case "trust_center_verification":
      return providerStatus.trust_center_verification_enabled;
    case "identity_access":
      return providerStatus.identity_access_enabled;
    case "security_compliance":
      return providerStatus.security_compliance_enabled;
    case "audit_accountability":
      return providerStatus.audit_accountability_enabled;
    case "governance_management":
      return providerStatus.governance_management_enabled;
    case "security_pack_adapter":
      return false;
    default:
      return false;
  }
}

export function buildSecurityCapabilityRuntimeRef(input: {
  manifest: SecurityProviderManifest;
  providerStatus: SecurityProviderRuntimeStatus;
  capability: SecurityProviderManifest["capabilities"][number];
  hasPermission: boolean;
}): SecurityCapabilityRuntimeRef | null {
  if (isSecurityCapabilityBlocked(input.capability.capability_key)) {
    return null;
  }

  const capabilityId = buildSecurityCapabilityId(
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

export function filterSecurityCapabilitiesForPrivacy(
  context: CompanionSecurityContext,
): SecurityCapabilityRuntimeRef[] {
  if (context.permission_denied || context.app_entitlement_blocked) {
    return [];
  }

  return context.capabilities.filter((capability) => {
    if (!capability.privacy_sensitive) return true;
    return capability.enabled && capability.operation === "read";
  });
}

export function listEnabledSecurityCapabilities(
  context: CompanionSecurityContext,
): SecurityCapabilityRuntimeRef[] {
  return filterSecurityCapabilitiesForPrivacy(context).filter((capability) => capability.enabled);
}

export function findSecurityProviderStatus(
  context: CompanionSecurityContext,
  providerKey: string,
): SecurityProviderRuntimeStatus | null {
  return context.providers.find((provider) => provider.provider_key === providerKey) ?? null;
}
