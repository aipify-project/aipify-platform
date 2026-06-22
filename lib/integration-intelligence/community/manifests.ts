import type { CommunityProviderManifest } from "./types";

const COMMUNITY_PACK = "community_pack";
const COMMUNITY_VIEW = "customer_community.view";
const COMMUNITY_MANAGE = "customer_community.manage";
const MODERATION_VIEW = "moderation.view";
const MODERATION_REVIEW = "moderation.review";
const MODERATION_MANAGE = "moderation.manage";
const CUSTOMERS_VIEW = "customers.view";
const CUSTOMERS_MANAGE = "customers.manage";

function readCapability(
  capability_key: CommunityProviderManifest["capabilities"][number]["capability_key"],
  entity: string,
  permission: string | null = COMMUNITY_VIEW,
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
  capability_key: CommunityProviderManifest["capabilities"][number]["capability_key"],
  entity: string,
  permission: string | null = COMMUNITY_MANAGE,
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

/** Community / Membership Business Pack manifests — capability IDs originate here, not in Core orchestrator. */
export const COMMUNITY_PROVIDER_MANIFESTS: readonly CommunityProviderManifest[] = [
  {
    provider_key: "community_network_center",
    display_name_key:
      "customerApp.companionPlatformKnowledge.community.providers.community_network_center",
    source_engine: "community_network_center",
    implementation_status: "connected",
    business_pack_key: COMMUNITY_PACK,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.community.searchTerms.community_network_center",
    capabilities: [
      readCapability("member.read", "member", COMMUNITY_VIEW, true),
      readCapability("membership.read", "membership", COMMUNITY_VIEW),
      readCapability("activity.read", "activity", COMMUNITY_VIEW),
      readCapability("engagement.read", "engagement", COMMUNITY_VIEW),
      readCapability("listing.read", "listing", COMMUNITY_VIEW),
    ],
  },
  {
    provider_key: "moderation_engine",
    display_name_key:
      "customerApp.companionPlatformKnowledge.community.providers.moderation_engine",
    source_engine: "moderation_engine",
    implementation_status: "connected",
    business_pack_key: COMMUNITY_PACK,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.community.searchTerms.moderation_engine",
    capabilities: [
      readCapability("moderation_queue.read", "moderation_queue", MODERATION_VIEW),
      readCapability("report.read", "report", MODERATION_VIEW, true),
      writeCapability("moderation.assign", "moderation_assignment", MODERATION_REVIEW),
      writeCapability("moderation.update", "moderation_update", MODERATION_MANAGE),
    ],
  },
  {
    provider_key: "client_relationship_loyalty",
    display_name_key:
      "customerApp.companionPlatformKnowledge.community.providers.client_relationship_loyalty",
    source_engine: "client_relationship_loyalty",
    implementation_status: "partial",
    business_pack_key: "membership_pack",
    search_terms_key:
      "customerApp.companionPlatformKnowledge.community.searchTerms.client_relationship_loyalty",
    capabilities: [
      readCapability("reward.read", "reward", CUSTOMERS_VIEW),
      readCapability("referral.read", "referral", CUSTOMERS_VIEW),
      readCapability("membership.read", "service_membership", CUSTOMERS_VIEW),
      writeCapability("reward.adjust", "reward_adjustment", CUSTOMERS_MANAGE),
    ],
  },
  {
    provider_key: "community_collective_intelligence",
    display_name_key:
      "customerApp.companionPlatformKnowledge.community.providers.community_collective_intelligence",
    source_engine: "community_collective_intelligence",
    implementation_status: "partial",
    business_pack_key: COMMUNITY_PACK,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.community.searchTerms.community_collective_intelligence",
    capabilities: [
      readCapability("activity.read", "collective_activity", COMMUNITY_VIEW),
      readCapability("engagement.read", "collective_engagement", COMMUNITY_VIEW),
      readCapability("report.read", "contribution_report", COMMUNITY_VIEW, true),
    ],
  },
  {
    provider_key: "community_engagement_services",
    display_name_key:
      "customerApp.companionPlatformKnowledge.community.providers.community_engagement_services",
    source_engine: "community_engagement_services",
    implementation_status: "specification_only",
    business_pack_key: "engagement_pack",
    search_terms_key:
      "customerApp.companionPlatformKnowledge.community.searchTerms.community_engagement_services",
    capabilities: [
      readCapability("leaderboard.read", "leaderboard", null),
      readCapability("birthday.read", "birthday", null, true),
      readCapability("gift.read", "gift", null),
    ],
  },
  {
    provider_key: "community_pack_adapter",
    display_name_key:
      "customerApp.companionPlatformKnowledge.community.providers.community_pack_adapter",
    source_engine: "community_pack_adapter",
    implementation_status: "specification_only",
    business_pack_key: null,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.community.searchTerms.community_pack_adapter",
    capabilities: [
      readCapability("member.read", "external_member", null, true),
      readCapability("listing.read", "external_listing", null),
    ],
  },
];
