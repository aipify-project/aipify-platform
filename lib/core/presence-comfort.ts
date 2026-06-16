/**
 * Presence & Comfort Protocol helpers (Phase A.90).
 * Authoritative enforcement lives in Supabase RPCs.
 */

import type { RpcClient } from "./rpc-client";

export const COMFORT_MOMENT_TYPES = [
  "loneliness",
  "exhaustion",
  "discouragement",
  "gratitude",
  "achievement",
  "vulnerability",
  "other",
] as const;
export type ComfortMomentType = (typeof COMFORT_MOMENT_TYPES)[number];

export const COMFORT_MOMENT_STATUSES = ["pending", "acknowledged", "supported", "archived"] as const;
export type ComfortMomentStatus = (typeof COMFORT_MOMENT_STATUSES)[number];

export const PROTOCOL_TRIGGER_CATEGORIES = [
  "loneliness",
  "exhaustion",
  "discouragement",
  "gratitude",
  "disappointment",
  "reassurance_request",
  "achievement",
  "vulnerability",
  "other",
] as const;
export type ProtocolTriggerCategory = (typeof PROTOCOL_TRIGGER_CATEGORIES)[number];

export const PROTOCOL_OUTCOMES = ["supported", "redirected", "escalation_recommended"] as const;
export type ProtocolOutcome = (typeof PROTOCOL_OUTCOMES)[number];

export const PROTOCOL_SENSITIVITY_LEVELS = ["balanced", "gentle"] as const;
export type ProtocolSensitivity = (typeof PROTOCOL_SENSITIVITY_LEVELS)[number];

export const PRESENCE_COMFORT_PERMISSION_KEYS = [
  "presence_comfort.view",
  "presence_comfort.manage",
  "presence_comfort.export",
] as const;
export type PresenceComfortPermissionKey = (typeof PRESENCE_COMFORT_PERMISSION_KEYS)[number];

export const PRESENCE_COMFORT_MODULE_KEY = "presence_comfort_protocol" as const;

export async function getPresenceComfortProtocolDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_presence_comfort_protocol_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getPresenceComfortProtocolCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_presence_comfort_protocol_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createPresenceComfortAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
