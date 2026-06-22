import type { SupportProviderManifest } from "./types";

const SUPPORT_VIEW = "support.view";
const SUPPORT_REPLY = "support.reply";
const SUPPORT_ASSIGN = "support.assign";
const SUPPORT_ESCALATE = "support.escalate";
const SUPPORT_METRICS = "support.view_metrics";
const SELF_SUPPORT_VIEW = "self_support.view";

function readCapability(
  capability_key: SupportProviderManifest["capabilities"][number]["capability_key"],
  entity: string,
  permission: string | null = SUPPORT_VIEW,
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
  capability_key: SupportProviderManifest["capabilities"][number]["capability_key"],
  entity: string,
  permission: string | null = SUPPORT_REPLY,
  options?: { irreversible?: boolean; privacy_sensitive?: boolean },
) {
  const irreversible = options?.irreversible ?? false;
  return {
    capability_key,
    operation: "write" as const,
    adapter_available: false,
    approval_required: true,
    reversible: !irreversible,
    risk_level: (irreversible ? 3 : 2) as 2 | 3,
    entity,
    required_permission: permission,
    privacy_sensitive: options?.privacy_sensitive ?? false,
  };
}

/** Support Business Pack manifests — capability IDs originate here, not in Core orchestrator. */
export const SUPPORT_PROVIDER_MANIFESTS: readonly SupportProviderManifest[] = [
  {
    provider_key: "support_ai_engine",
    display_name_key:
      "customerApp.companionPlatformKnowledge.support.providers.support_ai_engine",
    source_engine: "support_ai_engine",
    implementation_status: "partial",
    business_pack_key: "support_operations",
    search_terms_key:
      "customerApp.companionPlatformKnowledge.support.searchTerms.support_ai_engine",
    capabilities: [
      readCapability("support_case.read", "support_case"),
      readCapability("support_case.search", "support_case"),
      readCapability("conversation.read", "conversation", SUPPORT_VIEW, true),
      readCapability("sla.read", "sla", SUPPORT_METRICS),
      readCapability("customer_context.read", "customer", SUPPORT_VIEW, true),
      readCapability("support_insight.read", "insight"),
      writeCapability("support_case.create", "support_case", SUPPORT_VIEW),
      writeCapability("support_case.assign", "support_case", SUPPORT_ASSIGN),
      writeCapability("support_case.update", "support_case", SUPPORT_REPLY),
      writeCapability("response.draft", "response", SUPPORT_REPLY),
      writeCapability("escalation.create", "escalation", SUPPORT_ESCALATE),
    ],
  },
  {
    provider_key: "autonomous_support_operations",
    display_name_key:
      "customerApp.companionPlatformKnowledge.support.providers.autonomous_support_operations",
    source_engine: "autonomous_support_operations",
    implementation_status: "partial",
    business_pack_key: "support_operations",
    search_terms_key:
      "customerApp.companionPlatformKnowledge.support.searchTerms.autonomous_support_operations",
    capabilities: [
      readCapability("support_case.read", "support_case", null),
      readCapability("support_insight.read", "insight", null),
      writeCapability("response.draft", "response", null),
      writeCapability("escalation.create", "escalation", null),
    ],
  },
  {
    provider_key: "self_support_engine",
    display_name_key:
      "customerApp.companionPlatformKnowledge.support.providers.self_support_engine",
    source_engine: "self_support_engine",
    implementation_status: "partial",
    business_pack_key: null,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.support.searchTerms.self_support_engine",
    capabilities: [
      readCapability("conversation.read", "conversation", SELF_SUPPORT_VIEW, true),
      readCapability("support_insight.read", "insight", SELF_SUPPORT_VIEW),
      writeCapability("escalation.create", "escalation", SELF_SUPPORT_VIEW),
    ],
  },
  {
    provider_key: "app_portal_support",
    display_name_key:
      "customerApp.companionPlatformKnowledge.support.providers.app_portal_support",
    source_engine: "app_portal_support",
    implementation_status: "partial",
    business_pack_key: null,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.support.searchTerms.app_portal_support",
    capabilities: [
      readCapability("support_case.read", "support_case", null),
      readCapability("support_case.search", "support_case", null),
      readCapability("conversation.read", "conversation", null, true),
    ],
  },
  {
    provider_key: "proactive_organization_support",
    display_name_key:
      "customerApp.companionPlatformKnowledge.support.providers.proactive_organization_support",
    source_engine: "proactive_organization_support",
    implementation_status: "partial",
    business_pack_key: null,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.support.searchTerms.proactive_organization_support",
    capabilities: [readCapability("support_insight.read", "insight", null)],
  },
  {
    provider_key: "business_dna_knowledge",
    display_name_key:
      "customerApp.companionPlatformKnowledge.support.providers.business_dna_knowledge",
    source_engine: "business_dna_knowledge",
    implementation_status: "partial",
    business_pack_key: null,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.support.searchTerms.business_dna_knowledge",
    capabilities: [
      readCapability("support_insight.read", "knowledge", null),
      writeCapability("response.draft", "response", null),
    ],
  },
  {
    provider_key: "support_adapter",
    display_name_key:
      "customerApp.companionPlatformKnowledge.support.providers.support_adapter",
    source_engine: "support_adapter",
    implementation_status: "specification_only",
    business_pack_key: null,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.support.searchTerms.support_adapter",
    capabilities: [
      readCapability("support_case.read", "support_case"),
      readCapability("conversation.read", "conversation", SUPPORT_VIEW, true),
      readCapability("customer_context.read", "customer", SUPPORT_VIEW, true),
    ],
  },
];
