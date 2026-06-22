import { UNONIGHT_PROVIDER_KEY } from "@/lib/unonight/connection/constants";

/** Community-layer provider manifest key — distinct from integration intelligence provider key. */
export const UNONIGHT_COMMUNITY_ADAPTER_PROVIDER_KEY = "unonight_community_adapter";

export const UNONIGHT_COMMUNITY_ADAPTER_INTEGRATION_KEY = UNONIGHT_PROVIDER_KEY;

/** V1 read-only capabilities backed by tenant RPC sources when activation gate passes. */
export const UNONIGHT_PROVIDER_ADAPTER_V1_CAPABILITIES = [
  "member.read",
  "activity.read",
  "moderation_queue.read",
  "report.read",
  "verification_status.read",
  "listing.read",
] as const;

export type UnonightProviderAdapterV1Capability =
  (typeof UNONIGHT_PROVIDER_ADAPTER_V1_CAPABILITIES)[number];

export const UNONIGHT_PROVIDER_ADAPTER_BUSINESS_PACK = "community_pack";
