import type { CommunityProviderManifest } from "@/lib/integration-intelligence/community/types";
import {
  UNONIGHT_COMMUNITY_ADAPTER_PROVIDER_KEY,
  UNONIGHT_PROVIDER_ADAPTER_BUSINESS_PACK,
  UNONIGHT_PROVIDER_ADAPTER_V1_CAPABILITIES,
} from "./constants";
import { unonightSemanticDescriptorForCapability } from "./semantic-descriptors";

const COMMUNITY_VIEW = "customer_community.view";
const MODERATION_VIEW = "moderation.view";

function readCapability(
  capability_key: (typeof UNONIGHT_PROVIDER_ADAPTER_V1_CAPABILITIES)[number],
  entity: string,
  permission: string | null,
  privacy_sensitive = false,
) {
  const semantic = unonightSemanticDescriptorForCapability(capability_key);
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
    semantic: semantic
      ? {
          entity: semantic.entity,
          domain: semantic.domain,
          metrics: semantic.metrics,
          operations: semantic.operations,
          time_scopes: semantic.time_scopes,
          entity_aliases: semantic.entity_aliases,
          metric_mappings: semantic.metric_mappings,
        }
      : undefined,
  };
}

/** Unonight community provider adapter manifest — registered in community registry at module load. */
export const UNONIGHT_COMMUNITY_ADAPTER_MANIFEST: CommunityProviderManifest = {
  provider_key: UNONIGHT_COMMUNITY_ADAPTER_PROVIDER_KEY,
  display_name_key:
    "customerApp.companionPlatformKnowledge.communityProviderAdapter.providerDisplayName",
  source_engine: "community_pack_adapter",
  implementation_status: "partial",
  business_pack_key: UNONIGHT_PROVIDER_ADAPTER_BUSINESS_PACK,
  search_terms_key:
    "customerApp.companionPlatformKnowledge.communityProviderAdapter.searchTerms",
  capabilities: [
    readCapability("member.read", "member", COMMUNITY_VIEW, true),
    readCapability("activity.read", "activity", COMMUNITY_VIEW),
    readCapability("moderation_queue.read", "moderation_queue", MODERATION_VIEW),
    readCapability("report.read", "report", MODERATION_VIEW, true),
    readCapability("verification_status.read", "verification_status", COMMUNITY_VIEW),
    readCapability("verification_queue.read", "verification_queue", "verification.view", true),
    readCapability("verification_case.read", "verification_case", "verification.view", true),
    readCapability("listing.read", "listing", COMMUNITY_VIEW),
  ],
};
