import { SALES_PROVIDER_MANIFESTS } from "./manifests";
import type { SalesProviderManifest } from "./types";

const registry = new Map<string, SalesProviderManifest>(
  SALES_PROVIDER_MANIFESTS.map((manifest) => [manifest.provider_key, manifest]),
);

export function listSalesProviderManifests(): readonly SalesProviderManifest[] {
  return SALES_PROVIDER_MANIFESTS;
}

export function getSalesProviderManifest(providerKey: string): SalesProviderManifest | null {
  return registry.get(providerKey) ?? null;
}

export function registerSalesProviderManifest(manifest: SalesProviderManifest): SalesProviderManifest {
  registry.set(manifest.provider_key, manifest);
  return manifest;
}

export function listSalesProviderKeys(): readonly string[] {
  return [...registry.keys()];
}

export function salesProviderHasCapability(
  manifest: SalesProviderManifest,
  capabilityKey: string,
  operation: "read" | "write",
): boolean {
  return manifest.capabilities.some(
    (capability) =>
      capability.capability_key === capabilityKey && capability.operation === operation,
  );
}
