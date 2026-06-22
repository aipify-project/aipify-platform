import { WAREHOUSE_PROVIDER_MANIFESTS } from "./manifests";
import type { WarehouseProviderManifest } from "./types";

const registry = new Map<string, WarehouseProviderManifest>(
  WAREHOUSE_PROVIDER_MANIFESTS.map((manifest) => [manifest.provider_key, manifest]),
);

export function listWarehouseProviderManifests(): readonly WarehouseProviderManifest[] {
  return WAREHOUSE_PROVIDER_MANIFESTS;
}

export function getWarehouseProviderManifest(
  providerKey: string,
): WarehouseProviderManifest | null {
  return registry.get(providerKey) ?? null;
}

export function registerWarehouseProviderManifest(
  manifest: WarehouseProviderManifest,
): WarehouseProviderManifest {
  registry.set(manifest.provider_key, manifest);
  return manifest;
}

export function listWarehouseProviderKeys(): readonly string[] {
  return [...registry.keys()];
}

export function warehouseProviderHasCapability(
  manifest: WarehouseProviderManifest,
  capabilityKey: string,
  operation: "read" | "write",
): boolean {
  return manifest.capabilities.some(
    (capability) =>
      capability.capability_key === capabilityKey && capability.operation === operation,
  );
}
