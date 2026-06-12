/**
 * Companion Presence RPC helpers (Phase A.67).
 * Authoritative enforcement lives in Supabase RPCs (_cpie_*).
 */

import type {
  CompanionPresenceBundle,
  CompanionPresenceState,
} from "@/lib/presence/companion-presence";

type CompanionRpcClient = {
  rpc: (
    fn: string,
    params?: Record<string, unknown>
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export async function getCompanionPresenceBundle(
  supabase: CompanionRpcClient
): Promise<CompanionPresenceBundle> {
  const { data, error } = await supabase.rpc("get_companion_presence_bundle");
  if (error) throw new Error(error.message);
  return (data as CompanionPresenceBundle) ?? { has_organization: false };
}

export async function recordCompanionHeartbeat(
  supabase: CompanionRpcClient,
  params: {
    device_id: string;
    connection_status?: string;
    current_activity?: string;
    metadata?: Record<string, unknown>;
  }
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("record_companion_heartbeat", {
    p_device_id: params.device_id,
    p_connection_status: params.connection_status ?? "online",
    p_current_activity: params.current_activity ?? null,
    p_metadata: params.metadata ?? {},
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function updateCompanionPresenceState(
  supabase: CompanionRpcClient,
  params: {
    state?: CompanionPresenceState;
    quiet_mode_enabled?: boolean;
    quiet_mode_until?: string | null;
    indicator_collapsed?: boolean;
    acknowledge_critical?: boolean;
    org_settings?: Record<string, unknown>;
  }
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("update_companion_presence_state", {
    p_state: params.state ?? null,
    p_quiet_mode_enabled: params.quiet_mode_enabled ?? null,
    p_quiet_mode_until: params.quiet_mode_until ?? null,
    p_indicator_collapsed: params.indicator_collapsed ?? null,
    p_acknowledge_critical: params.acknowledge_critical ?? false,
    p_org_settings: params.org_settings ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
