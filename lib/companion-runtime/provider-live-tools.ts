import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { IntegrationStatusToolResult } from "@/lib/companion-platform-knowledge/integration-status-tool";
import type { PlatformSnapshotToolResult } from "@/lib/companion-platform-knowledge/platform-snapshot-tool";
import {
  getIntegrationProviderManifest,
  providerHasCapability,
} from "@/lib/integration-intelligence/manifest-registry";
import { buildIntegrationProviderReadToolInvokers } from "@/lib/integration-intelligence/provider-live-tool-invokers";
import type { IntegrationCapabilityKey } from "@/lib/integration-intelligence/types";
import { providerHasReadAdapter } from "./provider-tool-adapters-shared";

export { isRegisteredLiveProvider } from "./provider-tool-adapters-shared";

type ReadToolInvoker = (
  supabase: SupabaseClient,
  options: { providerKey: string; refresh?: boolean },
) => Promise<PlatformSnapshotToolResult | IntegrationStatusToolResult | null>;

const READ_TOOL_INVOKERS = buildIntegrationProviderReadToolInvokers();

export function resolveProviderReadToolInvoker(
  providerKey: string,
  capabilityKey: IntegrationCapabilityKey,
): ReadToolInvoker | null {
  if (!providerHasReadAdapter(providerKey, capabilityKey)) return null;
  return READ_TOOL_INVOKERS[providerKey]?.[capabilityKey] ?? null;
}

export async function invokeProviderPlatformSnapshot(
  supabase: SupabaseClient,
  providerKey: string,
  options?: { refresh?: boolean },
): Promise<PlatformSnapshotToolResult | null> {
  const manifest = getIntegrationProviderManifest(providerKey);
  if (!manifest || !providerHasCapability(manifest, "platform_snapshot")) {
    return null;
  }

  const adapter = resolveProviderReadToolInvoker(providerKey, "platform_snapshot");
  if (!adapter) return null;

  return adapter(supabase, { providerKey, refresh: options?.refresh }) as Promise<
    PlatformSnapshotToolResult | null
  >;
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

  const adapter = resolveProviderReadToolInvoker(providerKey, "connection_status");
  if (!adapter) return null;

  return adapter(supabase, { providerKey, refresh: options?.refresh }) as Promise<
    IntegrationStatusToolResult | null
  >;
}
