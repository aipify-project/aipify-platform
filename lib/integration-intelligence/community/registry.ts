import { COMMUNITY_PROVIDER_MANIFESTS } from "./manifests";
import type { CommunityProviderManifest } from "./types";

const registry = new Map<string, CommunityProviderManifest>(
  COMMUNITY_PROVIDER_MANIFESTS.map((manifest) => [manifest.provider_key, manifest]),
);

export function listCommunityProviderManifests(): readonly CommunityProviderManifest[] {
  return COMMUNITY_PROVIDER_MANIFESTS;
}

export function getCommunityProviderManifest(providerKey: string): CommunityProviderManifest | null {
  return registry.get(providerKey) ?? null;
}

export function registerCommunityProviderManifest(
  manifest: CommunityProviderManifest,
): CommunityProviderManifest {
  registry.set(manifest.provider_key, manifest);
  return manifest;
}

export function listCommunityProviderKeys(): readonly string[] {
  return [...registry.keys()];
}

export function communityProviderHasCapability(
  manifest: CommunityProviderManifest,
  capabilityKey: string,
  operation: "read" | "write",
): boolean {
  return manifest.capabilities.some(
    (capability) =>
      capability.capability_key === capabilityKey && capability.operation === operation,
  );
}
