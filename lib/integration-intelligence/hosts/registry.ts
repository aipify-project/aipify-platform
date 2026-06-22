import { HOSTS_PROVIDER_MANIFESTS } from "./manifests";
import type { HostsProviderManifest } from "./types";

const registry = new Map<string, HostsProviderManifest>(
  HOSTS_PROVIDER_MANIFESTS.map((manifest) => [manifest.provider_key, manifest]),
);

export function listHostsProviderManifests(): readonly HostsProviderManifest[] {
  return HOSTS_PROVIDER_MANIFESTS;
}

export function getHostsProviderManifest(providerKey: string): HostsProviderManifest | null {
  return registry.get(providerKey) ?? null;
}

export function registerHostsProviderManifest(manifest: HostsProviderManifest): HostsProviderManifest {
  registry.set(manifest.provider_key, manifest);
  return manifest;
}

export function listHostsProviderKeys(): readonly string[] {
  return [...registry.keys()];
}

export function hostsProviderHasCapability(
  manifest: HostsProviderManifest,
  capabilityKey: string,
  operation: "read" | "write",
): boolean {
  return manifest.capabilities.some(
    (capability) => capability.capability_key === capabilityKey && capability.operation === operation,
  );
}
