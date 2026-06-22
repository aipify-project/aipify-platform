import { COMMERCE_PROVIDER_MANIFESTS } from "./manifests";
import type { CommerceProviderManifest } from "./types";

const registry = new Map<string, CommerceProviderManifest>(
  COMMERCE_PROVIDER_MANIFESTS.map((manifest) => [manifest.provider_key, manifest]),
);

export function listCommerceProviderManifests(): readonly CommerceProviderManifest[] {
  return COMMERCE_PROVIDER_MANIFESTS;
}

export function getCommerceProviderManifest(
  providerKey: string,
): CommerceProviderManifest | null {
  return registry.get(providerKey) ?? null;
}

export function registerCommerceProviderManifest(
  manifest: CommerceProviderManifest,
): CommerceProviderManifest {
  registry.set(manifest.provider_key, manifest);
  return manifest;
}

export function listCommerceProviderKeys(): readonly string[] {
  return [...registry.keys()];
}

export function commerceProviderHasCapability(
  manifest: CommerceProviderManifest,
  capabilityKey: string,
  operation: "read" | "write",
): boolean {
  return manifest.capabilities.some(
    (capability) => capability.capability_key === capabilityKey && capability.operation === operation,
  );
}
