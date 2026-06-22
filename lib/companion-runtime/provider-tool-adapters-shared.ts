import type { IntegrationCapabilityKey } from "@/lib/integration-intelligence/types";
import {
  integrationProviderHasReadAdapter,
  listIntegrationProviderReadAdapterCapabilities,
  listIntegrationProvidersWithReadAdapters,
} from "@/lib/integration-intelligence/provider-read-adapter-registry";

/** Adapter capability registry — Core delegates tenant wiring to Integration Intelligence. */
export function listProviderReadAdapterCapabilities(
  providerKey: string,
): readonly IntegrationCapabilityKey[] {
  return listIntegrationProviderReadAdapterCapabilities(providerKey);
}

export function providerHasReadAdapter(
  providerKey: string,
  capabilityKey: IntegrationCapabilityKey,
): boolean {
  return integrationProviderHasReadAdapter(providerKey, capabilityKey);
}

export function listProvidersWithReadAdapters(): string[] {
  return listIntegrationProvidersWithReadAdapters();
}

export function isRegisteredLiveProvider(providerKey: string | null | undefined): boolean {
  if (!providerKey) return false;
  return listProviderReadAdapterCapabilities(providerKey).length > 0;
}
