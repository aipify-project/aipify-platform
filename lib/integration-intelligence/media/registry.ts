import { MEDIA_PROVIDER_MANIFESTS } from "./manifests";
import type { MediaProviderManifest } from "./types";

const registry = new Map<string, MediaProviderManifest>(
  MEDIA_PROVIDER_MANIFESTS.map((manifest) => [manifest.provider_key, manifest]),
);

export function listMediaProviderManifests(): readonly MediaProviderManifest[] {
  return MEDIA_PROVIDER_MANIFESTS;
}

export function getMediaProviderManifest(providerKey: string): MediaProviderManifest | null {
  return registry.get(providerKey) ?? null;
}

export function registerMediaProviderManifest(manifest: MediaProviderManifest): MediaProviderManifest {
  registry.set(manifest.provider_key, manifest);
  return manifest;
}

export function listMediaProviderKeys(): readonly string[] {
  return [...registry.keys()];
}

export function mediaProviderHasCapability(
  manifest: MediaProviderManifest,
  capabilityKey: string,
  operation: "read" | "write",
): boolean {
  return manifest.capabilities.some(
    (capability) => capability.capability_key === capabilityKey && capability.operation === operation,
  );
}
