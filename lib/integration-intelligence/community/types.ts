export type CommunityProviderImplementationStatus =
  | "connected"
  | "implemented_disconnected"
  | "partial"
  | "specification_only"
  | "placeholder";

export type CommunityCapabilityOperation = "read" | "write";

export type CommunityCapabilityKey =
  | "member.read"
  | "membership.read"
  | "activity.read"
  | "engagement.read"
  | "reward.read"
  | "leaderboard.read"
  | "referral.read"
  | "birthday.read"
  | "gift.read"
  | "listing.read"
  | "verification_status.read"
  | "moderation_queue.read"
  | "report.read"
  | "moderation.assign"
  | "moderation.update"
  | "reward.adjust";

/** Blocked in Companion runtime Phase 26 — never expose as enabled capabilities. */
export const COMMUNITY_BLOCKED_CAPABILITY_KEYS = [
  "member.delete",
  "user.delete",
  "ban.permanent",
  "verification.auto_approve",
  "points.irreversible",
  "reward.irreversible",
  "financial.transaction",
  "content.publish.auto",
  "moderation.irreversible",
] as const;

export type CommunityBlockedCapabilityKey = (typeof COMMUNITY_BLOCKED_CAPABILITY_KEYS)[number];

export type CommunityCapabilityManifest = {
  capability_key: CommunityCapabilityKey;
  operation: CommunityCapabilityOperation;
  adapter_available: boolean;
  approval_required: boolean;
  reversible: boolean;
  risk_level: 1 | 2 | 3;
  entity: string;
  required_permission: string | null;
  privacy_sensitive: boolean;
};

export type CommunityProviderSourceEngine =
  | "community_network_center"
  | "moderation_engine"
  | "client_relationship_loyalty"
  | "community_collective_intelligence"
  | "community_engagement_services"
  | "community_pack_adapter";

export type CommunityProviderManifest = {
  provider_key: string;
  display_name_key: string;
  source_engine: CommunityProviderSourceEngine;
  implementation_status: CommunityProviderImplementationStatus;
  capabilities: readonly CommunityCapabilityManifest[];
  search_terms_key: string;
  business_pack_key: string | null;
};

export const COMMUNITY_BUSINESS_PACK_KEYS = [
  "community_pack",
  "engagement_pack",
  "membership_pack",
] as const;

export function isCommunityBusinessPackActive(activeBusinessPacks: readonly string[]): boolean {
  return activeBusinessPacks.some((pack) =>
    (COMMUNITY_BUSINESS_PACK_KEYS as readonly string[]).includes(pack),
  );
}

export function buildCommunityCapabilityId(
  providerKey: string,
  capabilityKey: CommunityCapabilityKey,
  operation: CommunityCapabilityOperation,
): string {
  return `${providerKey}.${capabilityKey}.${operation}`;
}

export function isCommunityCapabilityBlocked(capabilityKey: string): boolean {
  return (COMMUNITY_BLOCKED_CAPABILITY_KEYS as readonly string[]).includes(capabilityKey);
}
