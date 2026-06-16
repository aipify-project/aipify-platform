/**
 * Aipify Executive Operating System & Founder's Cockpit Engine helpers (Phase 200).
 * Authoritative enforcement lives in Supabase RPCs (_aeosfce_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyExecutiveOperatingSystemFoundersCockpitEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_executive_operating_system_founders_cockpit_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyExecutiveOperatingSystemFoundersCockpitEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_executive_operating_system_founders_cockpit_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyExecutiveOperatingSystemFoundersCockpitEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
