import type { IntegrationCapabilityKey } from "./types";
import { UNONIGHT_INTEGRATION_MANIFEST } from "./providers/unonight/manifest";

/** Tenant integration read adapters — registered outside Companion Core. */
const INTEGRATION_PROVIDER_READ_ADAPTER_CAPABILITIES: Record<
  string,
  readonly IntegrationCapabilityKey[]
> = {
  [UNONIGHT_INTEGRATION_MANIFEST.provider]: ["platform_snapshot", "connection_status"],
};

export function listIntegrationProviderReadAdapterCapabilities(
  providerKey: string,
): readonly IntegrationCapabilityKey[] {
  return INTEGRATION_PROVIDER_READ_ADAPTER_CAPABILITIES[providerKey] ?? [];
}

export function integrationProviderHasReadAdapter(
  providerKey: string,
  capabilityKey: IntegrationCapabilityKey,
): boolean {
  return listIntegrationProviderReadAdapterCapabilities(providerKey).includes(capabilityKey);
}

export function listIntegrationProvidersWithReadAdapters(): string[] {
  return Object.keys(INTEGRATION_PROVIDER_READ_ADAPTER_CAPABILITIES);
}
