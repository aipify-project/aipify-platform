import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { IntegrationStatusToolResult } from "@/lib/companion-platform-knowledge/integration-status-tool";
import { getConnectedIntegrationStatus } from "@/lib/companion-platform-knowledge/integration-status-tool";
import type { PlatformSnapshotToolResult } from "@/lib/companion-platform-knowledge/platform-snapshot-tool";
import { getUnonightPlatformSnapshot } from "@/lib/companion-platform-knowledge/platform-snapshot-tool";
import type { IntegrationCapabilityKey } from "./types";
import { UNONIGHT_INTEGRATION_MANIFEST } from "./providers/unonight/manifest";

export type IntegrationProviderReadToolInvoker = (
  supabase: SupabaseClient,
  options: { providerKey: string; refresh?: boolean },
) => Promise<PlatformSnapshotToolResult | IntegrationStatusToolResult | null>;

/** Tenant-specific read tool invokers — organization adapters register here, not in Core. */
export function buildIntegrationProviderReadToolInvokers(): Partial<
  Record<string, Partial<Record<IntegrationCapabilityKey, IntegrationProviderReadToolInvoker>>>
> {
  const integrationProviderKey = UNONIGHT_INTEGRATION_MANIFEST.provider;

  return {
    [integrationProviderKey]: {
      platform_snapshot: (supabase, options) =>
        getUnonightPlatformSnapshot(supabase, {
          providerKey: integrationProviderKey as "unonight",
          refresh: options.refresh,
        }),
      connection_status: (supabase, options) =>
        getConnectedIntegrationStatus(supabase, {
          providerKey: integrationProviderKey as "unonight",
          refresh: options.refresh,
        }),
    },
  };
}
