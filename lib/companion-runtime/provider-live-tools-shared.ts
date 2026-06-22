import {
  getIntegrationProviderManifest,
  providerHasCapability,
} from "@/lib/integration-intelligence/manifest-registry";

export function isRegisteredLiveProvider(providerKey: string | null | undefined): boolean {
  if (!providerKey) return false;
  const manifest = getIntegrationProviderManifest(providerKey);
  if (!manifest) return false;
  return (
    providerHasCapability(manifest, "platform_snapshot") ||
    providerHasCapability(manifest, "connection_status")
  );
}
