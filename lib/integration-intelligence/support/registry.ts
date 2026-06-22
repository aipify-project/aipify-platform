import { SUPPORT_PROVIDER_MANIFESTS } from "./manifests";
import type { SupportProviderManifest } from "./types";

const registry = new Map<string, SupportProviderManifest>(
  SUPPORT_PROVIDER_MANIFESTS.map((manifest) => [manifest.provider_key, manifest]),
);

export function listSupportProviderManifests(): readonly SupportProviderManifest[] {
  return SUPPORT_PROVIDER_MANIFESTS;
}

export function getSupportProviderManifest(providerKey: string): SupportProviderManifest | null {
  return registry.get(providerKey) ?? null;
}

export function registerSupportProviderManifest(
  manifest: SupportProviderManifest,
): SupportProviderManifest {
  registry.set(manifest.provider_key, manifest);
  return manifest;
}

export function listSupportProviderKeys(): readonly string[] {
  return [...registry.keys()];
}

export function supportProviderHasCapability(
  manifest: SupportProviderManifest,
  capabilityKey: string,
  operation: "read" | "write",
): boolean {
  return manifest.capabilities.some(
    (capability) => capability.capability_key === capabilityKey && capability.operation === operation,
  );
}
