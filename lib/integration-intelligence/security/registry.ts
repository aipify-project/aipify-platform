import { SECURITY_PROVIDER_MANIFESTS } from "./manifests";
import type { SecurityProviderManifest } from "./types";

const registry = new Map<string, SecurityProviderManifest>(
  SECURITY_PROVIDER_MANIFESTS.map((manifest) => [manifest.provider_key, manifest]),
);

export function listSecurityProviderManifests(): readonly SecurityProviderManifest[] {
  return SECURITY_PROVIDER_MANIFESTS;
}

export function getSecurityProviderManifest(providerKey: string): SecurityProviderManifest | null {
  return registry.get(providerKey) ?? null;
}

export function registerSecurityProviderManifest(
  manifest: SecurityProviderManifest,
): SecurityProviderManifest {
  registry.set(manifest.provider_key, manifest);
  return manifest;
}

export function listSecurityProviderKeys(): readonly string[] {
  return [...registry.keys()];
}

export function securityProviderHasCapability(
  manifest: SecurityProviderManifest,
  capabilityKey: string,
  operation: "read" | "write",
): boolean {
  return manifest.capabilities.some(
    (capability) =>
      capability.capability_key === capabilityKey && capability.operation === operation,
  );
}
