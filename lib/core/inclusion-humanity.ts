/**
 * Inclusion & Humanity Engine helpers (Phase A.83).
 * Authoritative enforcement lives in Supabase RPCs.
 */

import type { RpcClient } from "./rpc-client";

export const INCIDENT_TYPES = [
  "offensive_language",
  "frustration",
  "provocation",
  "disrespect",
  "other",
] as const;
export type IncidentType = (typeof INCIDENT_TYPES)[number];

export const INCLUSION_INCIDENT_STATUSES = ["logged", "redirected", "de_escalated", "closed"] as const;
export type InclusionIncidentStatus = (typeof INCLUSION_INCIDENT_STATUSES)[number];

export const BOUNDARY_FIRMNESS_LEVELS = ["gentle", "balanced", "firm"] as const;
export type BoundaryFirmness = (typeof BOUNDARY_FIRMNESS_LEVELS)[number];

export const INCLUSION_REFLECTION_STATUSES = ["pending", "acknowledged", "dismissed"] as const;
export type InclusionReflectionStatus = (typeof INCLUSION_REFLECTION_STATUSES)[number];

export const INCLUSION_HUMANITY_PERMISSION_KEYS = [
  "inclusion_humanity.view",
  "inclusion_humanity.manage",
  "inclusion_humanity.settings.manage",
  "inclusion_humanity.export",
] as const;
export type InclusionHumanityPermissionKey = (typeof INCLUSION_HUMANITY_PERMISSION_KEYS)[number];

export const INCLUSION_HUMANITY_MODULE_KEY = "inclusion_humanity_engine" as const;

export async function getInclusionHumanityEngineDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_inclusion_humanity_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getInclusionHumanityEngineCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_inclusion_humanity_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createInclusionHumanityAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
