import type { IntegrationCapabilityKey } from "@/lib/integration-intelligence/types";

/** Adapter capability registry — providers register implemented read drivers here. */
const PROVIDER_READ_ADAPTER_CAPABILITIES: Record<string, readonly IntegrationCapabilityKey[]> = {
  unonight: ["platform_snapshot", "connection_status"],
};

export function listProviderReadAdapterCapabilities(
  providerKey: string,
): readonly IntegrationCapabilityKey[] {
  return PROVIDER_READ_ADAPTER_CAPABILITIES[providerKey] ?? [];
}

export function providerHasReadAdapter(
  providerKey: string,
  capabilityKey: IntegrationCapabilityKey,
): boolean {
  return listProviderReadAdapterCapabilities(providerKey).includes(capabilityKey);
}

export function listProvidersWithReadAdapters(): string[] {
  return Object.keys(PROVIDER_READ_ADAPTER_CAPABILITIES);
}

export function isRegisteredLiveProvider(providerKey: string | null | undefined): boolean {
  if (!providerKey) return false;
  return listProviderReadAdapterCapabilities(providerKey).length > 0;
}
