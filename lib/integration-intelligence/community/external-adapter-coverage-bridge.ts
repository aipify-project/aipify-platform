import { UNONIGHT_COMMUNITY_ADAPTER_MANIFEST } from "@/lib/unonight/provider-adapter/manifest";
import type { CommercialCapabilityEntry } from "@/lib/companion-runtime/v1-commercial-capability-matrix";

/** Generic Core provider key — tenant adapters map their source to this capability surface. */
export const COMMUNITY_EXTERNAL_ADAPTER_PROVIDER_KEY = "community_external_adapter";

/**
 * Merges external community adapter manifest capabilities into the commercial matrix
 * under a customer-neutral provider key. Adapter implementations remain outside Core.
 */
export function mergeCommunityExternalAdapterIntoCommercial(
  commercial: CommercialCapabilityEntry[],
): CommercialCapabilityEntry[] {
  const existingKeys = new Set(commercial.map((entry) => entry.capability_id));
  const extra: CommercialCapabilityEntry[] = [];

  for (const capability of UNONIGHT_COMMUNITY_ADAPTER_MANIFEST.capabilities) {
    const capability_id = `${COMMUNITY_EXTERNAL_ADAPTER_PROVIDER_KEY}.${capability.capability_key}.${capability.operation}`;
    if (existingKeys.has(capability_id)) continue;
    extra.push({
      capability_id,
      provider_key: COMMUNITY_EXTERNAL_ADAPTER_PROVIDER_KEY,
      capability_key: capability.capability_key,
      operation: capability.operation,
      tier: "provider",
      status: capability.adapter_available ? "connected_but_partial" : "adapter_missing",
      implementation_status: UNONIGHT_COMMUNITY_ADAPTER_MANIFEST.implementation_status,
      adapter_available: capability.adapter_available,
      business_pack_key: UNONIGHT_COMMUNITY_ADAPTER_MANIFEST.business_pack_key ?? null,
    });
  }

  return [...commercial, ...extra];
}
