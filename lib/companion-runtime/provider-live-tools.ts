import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { getConnectedIntegrationStatus } from "@/lib/companion-platform-knowledge/integration-status-tool";
import type { IntegrationStatusToolResult } from "@/lib/companion-platform-knowledge/integration-status-tool";
import { getUnonightPlatformSnapshot } from "@/lib/companion-platform-knowledge/platform-snapshot-tool";
import type { PlatformSnapshotToolResult } from "@/lib/companion-platform-knowledge/platform-snapshot-tool";
import {
  getIntegrationProviderManifest,
  providerHasCapability,
} from "@/lib/integration-intelligence/manifest-registry";

export { isRegisteredLiveProvider } from "./provider-live-tools-shared";

type ProviderAdapter = {
  platformSnapshot?: (
    supabase: SupabaseClient,
    options: { providerKey: string; refresh?: boolean },
  ) => Promise<PlatformSnapshotToolResult>;
  connectionStatus?: (
    supabase: SupabaseClient,
    options: { providerKey: string; refresh?: boolean },
  ) => Promise<IntegrationStatusToolResult>;
};

const PROVIDER_ADAPTERS: Record<string, ProviderAdapter> = {
  unonight: {
    platformSnapshot: (supabase, options) =>
      getUnonightPlatformSnapshot(supabase, {
        providerKey: "unonight",
        refresh: options.refresh,
      }),
    connectionStatus: (supabase, options) =>
      getConnectedIntegrationStatus(supabase, {
        providerKey: "unonight",
        refresh: options.refresh,
      }),
  },
};

export async function invokeProviderPlatformSnapshot(
  supabase: SupabaseClient,
  providerKey: string,
  options?: { refresh?: boolean },
): Promise<PlatformSnapshotToolResult | null> {
  const manifest = getIntegrationProviderManifest(providerKey);
  if (!manifest || !providerHasCapability(manifest, "platform_snapshot")) {
    return null;
  }

  const adapter = PROVIDER_ADAPTERS[providerKey]?.platformSnapshot;
  if (!adapter) return null;

  return adapter(supabase, { providerKey, refresh: options?.refresh });
}

export async function invokeProviderConnectionStatus(
  supabase: SupabaseClient,
  providerKey: string,
  options?: { refresh?: boolean },
): Promise<IntegrationStatusToolResult | null> {
  const manifest = getIntegrationProviderManifest(providerKey);
  if (!manifest || !providerHasCapability(manifest, "connection_status")) {
    return null;
  }

  const adapter = PROVIDER_ADAPTERS[providerKey]?.connectionStatus;
  if (!adapter) return null;

  return adapter(supabase, { providerKey, refresh: options?.refresh });
}
