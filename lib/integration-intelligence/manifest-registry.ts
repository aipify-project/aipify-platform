import type { IntegrationProviderManifest } from "./types";
import { DEMO_BOOKING_PROVIDER_MANIFEST } from "./providers/demo-booking/manifest";
import { UNONIGHT_INTEGRATION_MANIFEST } from "./providers/unonight/manifest";

const MANIFESTS: Record<string, IntegrationProviderManifest> = {
  [UNONIGHT_INTEGRATION_MANIFEST.provider]: UNONIGHT_INTEGRATION_MANIFEST,
  [DEMO_BOOKING_PROVIDER_MANIFEST.provider]: DEMO_BOOKING_PROVIDER_MANIFEST,
};

export function getIntegrationProviderManifest(providerKey: string): IntegrationProviderManifest | null {
  return MANIFESTS[providerKey] ?? null;
}

export function listRegisteredIntegrationProviders(): readonly string[] {
  return Object.keys(MANIFESTS);
}

export function registerIntegrationProviderManifest(
  manifest: IntegrationProviderManifest,
): IntegrationProviderManifest {
  MANIFESTS[manifest.provider] = manifest;
  return manifest;
}

export function providerHasCapability(
  manifest: IntegrationProviderManifest,
  capability: IntegrationProviderManifest["capabilities"][number]["key"],
): boolean {
  return manifest.capabilities.some((entry) => entry.key === capability);
}
