import { HR_PROVIDER_MANIFESTS } from "./manifests";
import type { HrProviderManifest } from "./types";

const registry = new Map<string, HrProviderManifest>(
  HR_PROVIDER_MANIFESTS.map((manifest) => [manifest.provider_key, manifest]),
);

export function listHrProviderManifests(): readonly HrProviderManifest[] {
  return HR_PROVIDER_MANIFESTS;
}

export function getHrProviderManifest(providerKey: string): HrProviderManifest | null {
  return registry.get(providerKey) ?? null;
}

export function registerHrProviderManifest(manifest: HrProviderManifest): HrProviderManifest {
  registry.set(manifest.provider_key, manifest);
  return manifest;
}

export function listHrProviderKeys(): readonly string[] {
  return [...registry.keys()];
}

export function hrProviderHasCapability(
  manifest: HrProviderManifest,
  capabilityKey: string,
  operation: "read" | "write",
): boolean {
  return manifest.capabilities.some(
    (capability) => capability.capability_key === capabilityKey && capability.operation === operation,
  );
}
