import type { SecurityProviderManifest } from "./types";

const GOVERNANCE_PACK = "governance_pack";
const TRUST_VIEW = "trust_center.view";
const TRUST_MANAGE = "trust_center.manage";
const SECURITY_VIEW = "security.view";
const SECURITY_MANAGE = "security.manage";
const COMPLIANCE_VIEW = "compliance.view";
const COMPLIANCE_MANAGE = "compliance.manage";
const AUDIT_VIEW = "audit.view";
const GOVERNANCE_VIEW = "governance.view";
const GOVERNANCE_MANAGE = "governance.manage";

function readCapability(
  capability_key: SecurityProviderManifest["capabilities"][number]["capability_key"],
  entity: string,
  permission: string | null = SECURITY_VIEW,
  privacy_sensitive = false,
) {
  return {
    capability_key,
    operation: "read" as const,
    adapter_available: false,
    approval_required: false,
    reversible: true,
    risk_level: 1 as const,
    entity,
    required_permission: permission,
    privacy_sensitive,
  };
}

function writeCapability(
  capability_key: SecurityProviderManifest["capabilities"][number]["capability_key"],
  entity: string,
  permission: string | null = SECURITY_MANAGE,
) {
  return {
    capability_key,
    operation: "write" as const,
    adapter_available: false,
    approval_required: true,
    reversible: true,
    risk_level: 2 as const,
    entity,
    required_permission: permission,
    privacy_sensitive: false,
  };
}

/** Security / Verification Business Pack manifests — capability IDs originate here, not in Core orchestrator. */
export const SECURITY_PROVIDER_MANIFESTS: readonly SecurityProviderManifest[] = [
  {
    provider_key: "trust_center_verification",
    display_name_key:
      "customerApp.companionPlatformKnowledge.security.providers.trust_center_verification",
    source_engine: "trust_center_verification",
    implementation_status: "connected",
    business_pack_key: "trust_center",
    search_terms_key:
      "customerApp.companionPlatformKnowledge.security.searchTerms.trust_center_verification",
    capabilities: [
      readCapability("verification.read", "verification", TRUST_VIEW, true),
      readCapability("verification_status.read", "verification_status", TRUST_VIEW),
      readCapability("security_event.read", "security_event", TRUST_VIEW),
      writeCapability("verification.request", "verification_request", TRUST_MANAGE),
    ],
  },
  {
    provider_key: "identity_access_management",
    display_name_key:
      "customerApp.companionPlatformKnowledge.security.providers.identity_access_management",
    source_engine: "identity_access",
    implementation_status: "connected",
    business_pack_key: GOVERNANCE_PACK,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.security.searchTerms.identity_access_management",
    capabilities: [
      readCapability("access.read", "access", null),
      readCapability("role.read", "role", null),
      readCapability("permission.read", "permission", null),
    ],
  },
  {
    provider_key: "security_compliance_center",
    display_name_key:
      "customerApp.companionPlatformKnowledge.security.providers.security_compliance_center",
    source_engine: "security_compliance",
    implementation_status: "connected",
    business_pack_key: "security_pack",
    search_terms_key:
      "customerApp.companionPlatformKnowledge.security.searchTerms.security_compliance_center",
    capabilities: [
      readCapability("security_event.read", "security_event", SECURITY_VIEW),
      readCapability("compliance_status.read", "compliance_status", COMPLIANCE_VIEW),
      readCapability("incident.read", "incident", SECURITY_VIEW),
    ],
  },
  {
    provider_key: "audit_accountability",
    display_name_key:
      "customerApp.companionPlatformKnowledge.security.providers.audit_accountability",
    source_engine: "audit_accountability",
    implementation_status: "connected",
    business_pack_key: GOVERNANCE_PACK,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.security.searchTerms.audit_accountability",
    capabilities: [readCapability("audit_log.read", "audit_log", AUDIT_VIEW)],
  },
  {
    provider_key: "governance_management",
    display_name_key:
      "customerApp.companionPlatformKnowledge.security.providers.governance_management",
    source_engine: "governance_management",
    implementation_status: "partial",
    business_pack_key: GOVERNANCE_PACK,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.security.searchTerms.governance_management",
    capabilities: [
      readCapability("policy_violation.read", "policy_violation", GOVERNANCE_VIEW),
      readCapability("risk_signal.read", "risk_signal", GOVERNANCE_VIEW),
      readCapability("access_review.read", "access_review", GOVERNANCE_VIEW),
      writeCapability("access_review.create", "access_review", GOVERNANCE_MANAGE),
    ],
  },
  {
    provider_key: "security_pack_adapter",
    display_name_key:
      "customerApp.companionPlatformKnowledge.security.providers.security_pack_adapter",
    source_engine: "security_pack_adapter",
    implementation_status: "specification_only",
    business_pack_key: null,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.security.searchTerms.security_pack_adapter",
    capabilities: [
      readCapability("verification.read", "external_verification", null, true),
      readCapability("audit_log.read", "external_audit_log", null),
    ],
  },
];
