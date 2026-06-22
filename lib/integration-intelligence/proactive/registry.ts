import { PROACTIVE_PROVIDER_MANIFESTS } from "./manifests";
import type { ProactiveProviderManifest } from "./types";

const registry = new Map<string, ProactiveProviderManifest>(
  PROACTIVE_PROVIDER_MANIFESTS.map((manifest) => [manifest.provider_key, manifest]),
);

export function listProactiveProviderManifests(): readonly ProactiveProviderManifest[] {
  return PROACTIVE_PROVIDER_MANIFESTS;
}

export function getProactiveProviderManifest(
  providerKey: string,
): ProactiveProviderManifest | null {
  return registry.get(providerKey) ?? null;
}

export function registerProactiveProviderManifest(
  manifest: ProactiveProviderManifest,
): ProactiveProviderManifest {
  registry.set(manifest.provider_key, manifest);
  return manifest;
}

export function listProactiveProviderKeys(): readonly string[] {
  return [...registry.keys()];
}

export function proactiveProviderHasCapability(
  manifest: ProactiveProviderManifest,
  capabilityKey: string,
  operation: "read",
): boolean {
  return manifest.capabilities.some(
    (capability) =>
      capability.capability_key === capabilityKey && capability.operation === operation,
  );
}
