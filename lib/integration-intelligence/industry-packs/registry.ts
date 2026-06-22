import { INDUSTRY_PACK_PROVIDER_MANIFESTS } from "./manifests";
import type { IndustryPackProviderManifest } from "./types";

const registry = new Map<string, IndustryPackProviderManifest>(
  INDUSTRY_PACK_PROVIDER_MANIFESTS.map((manifest) => [manifest.provider_key, manifest]),
);

export function listIndustryPackProviderManifests(): readonly IndustryPackProviderManifest[] {
  return INDUSTRY_PACK_PROVIDER_MANIFESTS;
}

export function getIndustryPackProviderManifest(
  providerKey: string,
): IndustryPackProviderManifest | null {
  return registry.get(providerKey) ?? null;
}

export function registerIndustryPackProviderManifest(
  manifest: IndustryPackProviderManifest,
): IndustryPackProviderManifest {
  registry.set(manifest.provider_key, manifest);
  return manifest;
}

export function listIndustryPackProviderKeys(): readonly string[] {
  return [...registry.keys()];
}

export function industryPackProviderHasCapability(
  manifest: IndustryPackProviderManifest,
  capabilityKey: string,
  operation: "read" | "write",
): boolean {
  return manifest.capabilities.some(
    (capability) => capability.capability_key === capabilityKey && capability.operation === operation,
  );
}

export function listIndustryPackManifestsForBusinessPack(
  packKey: string,
): IndustryPackProviderManifest[] {
  return INDUSTRY_PACK_PROVIDER_MANIFESTS.filter(
    (manifest) => !manifest.business_pack_key || manifest.business_pack_key === packKey,
  );
}
