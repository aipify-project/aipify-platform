import { ANALYTICS_PROVIDER_MANIFESTS } from "./manifests";
import type { AnalyticsProviderManifest } from "./types";

const manifestByKey = new Map<string, AnalyticsProviderManifest>(
  ANALYTICS_PROVIDER_MANIFESTS.map((manifest) => [manifest.provider_key, manifest]),
);

export function listAnalyticsProviderManifests(): readonly AnalyticsProviderManifest[] {
  return ANALYTICS_PROVIDER_MANIFESTS;
}

export function getAnalyticsProviderManifest(providerKey: string): AnalyticsProviderManifest | null {
  return manifestByKey.get(providerKey) ?? null;
}
