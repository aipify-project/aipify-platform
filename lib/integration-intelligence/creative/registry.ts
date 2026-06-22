import { CREATIVE_PROVIDER_MANIFESTS } from "./manifests";
import type { CreativeProviderManifest } from "./types";

const registry = new Map<string, CreativeProviderManifest>(
  CREATIVE_PROVIDER_MANIFESTS.map((manifest) => [manifest.provider_key, manifest]),
);

export function listCreativeProviderManifests(): readonly CreativeProviderManifest[] {
  return CREATIVE_PROVIDER_MANIFESTS;
}

export function getCreativeProviderManifest(providerKey: string): CreativeProviderManifest | null {
  return registry.get(providerKey) ?? null;
}

export function registerCreativeProviderManifest(
  manifest: CreativeProviderManifest,
): CreativeProviderManifest {
  registry.set(manifest.provider_key, manifest);
  return manifest;
}

export function listCreativeProviderKeys(): readonly string[] {
  return [...registry.keys()];
}

export function creativeProviderHasCapability(
  manifest: CreativeProviderManifest,
  capabilityKey: string,
  operation: "read" | "write",
): boolean {
  return manifest.capabilities.some(
    (capability) => capability.capability_key === capabilityKey && capability.operation === operation,
  );
}
