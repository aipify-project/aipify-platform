import { FINANCE_PROVIDER_MANIFESTS } from "./manifests";
import type { FinanceProviderManifest } from "./types";

const registry = new Map<string, FinanceProviderManifest>(
  FINANCE_PROVIDER_MANIFESTS.map((manifest) => [manifest.provider_key, manifest]),
);

export function listFinanceProviderManifests(): readonly FinanceProviderManifest[] {
  return FINANCE_PROVIDER_MANIFESTS;
}

export function getFinanceProviderManifest(providerKey: string): FinanceProviderManifest | null {
  return registry.get(providerKey) ?? null;
}

export function registerFinanceProviderManifest(
  manifest: FinanceProviderManifest,
): FinanceProviderManifest {
  registry.set(manifest.provider_key, manifest);
  return manifest;
}

export function listFinanceProviderKeys(): readonly string[] {
  return [...registry.keys()];
}

export function financeProviderHasCapability(
  manifest: FinanceProviderManifest,
  capabilityKey: string,
  operation: "read" | "write",
): boolean {
  return manifest.capabilities.some(
    (capability) =>
      capability.capability_key === capabilityKey && capability.operation === operation,
  );
}
