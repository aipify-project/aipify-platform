import { SERVICES_PROVIDER_MANIFESTS } from "./manifests";
import type { ServicesProviderManifest } from "./types";

const registry = new Map<string, ServicesProviderManifest>(
  SERVICES_PROVIDER_MANIFESTS.map((manifest) => [manifest.provider_key, manifest]),
);

export function listServicesProviderManifests(): readonly ServicesProviderManifest[] {
  return SERVICES_PROVIDER_MANIFESTS;
}

export function getServicesProviderManifest(
  providerKey: string,
): ServicesProviderManifest | null {
  return registry.get(providerKey) ?? null;
}

export function registerServicesProviderManifest(
  manifest: ServicesProviderManifest,
): ServicesProviderManifest {
  registry.set(manifest.provider_key, manifest);
  return manifest;
}

export function listServicesProviderKeys(): readonly string[] {
  return [...registry.keys()];
}

export function servicesProviderHasCapability(
  manifest: ServicesProviderManifest,
  capabilityKey: string,
  operation: "read" | "write",
): boolean {
  return manifest.capabilities.some(
    (capability) => capability.capability_key === capabilityKey && capability.operation === operation,
  );
}
