/**
 * Wisdom Intervention Protocol helpers (Phase A.94).
 * Authoritative enforcement lives in Supabase RPCs.
 */

import type { RpcClient } from "./rpc-client";

export const WISDOM_SIGNAL_TYPES = [
  "caps",
  "aggression_pattern",
  "late_night",
  "high_risk_comm",
  "emotional_charge",
] as const;
export type WisdomSignalType = (typeof WISDOM_SIGNAL_TYPES)[number];

export const WISDOM_USER_ACTIONS = ["proceeded", "revised", "postponed", "dismissed"] as const;
export type WisdomUserAction = (typeof WISDOM_USER_ACTIONS)[number];

export const WISDOM_INTERVENTION_PERMISSION_KEYS = [
  "wisdom_intervention.view",
  "wisdom_intervention.manage",
  "wisdom_intervention.export",
] as const;
export type WisdomInterventionPermissionKey = (typeof WISDOM_INTERVENTION_PERMISSION_KEYS)[number];

export const WISDOM_INTERVENTION_MODULE_KEY = "wisdom_intervention_protocol" as const;

export async function getWisdomInterventionProtocolDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_wisdom_intervention_protocol_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getWisdomInterventionProtocolCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_wisdom_intervention_protocol_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function suggestWisdomIntervention(
  supabase: RpcClient,
  signalType?: WisdomSignalType
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("suggest_wisdom_intervention", {
    p_signal_type: signalType ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createWisdomInterventionAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
