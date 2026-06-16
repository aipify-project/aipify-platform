/**
 * Organizational Health Engine helpers (Phase A.56).
 * Authoritative enforcement lives in Supabase RPCs.
 * Distinct from Observability Platform Health at /app/observability-platform-health-engine.
 */

import type { RpcClient } from "./rpc-client";

export const ORGANIZATIONAL_HEALTH_CATEGORIES = [
  "operational",
  "support",
  "adoption",
  "learning_readiness",
  "change_readiness",
  "strategic_alignment",
] as const;
export type OrganizationalHealthCategory = (typeof ORGANIZATIONAL_HEALTH_CATEGORIES)[number];

export const ORGANIZATIONAL_HEALTH_STATUSES = [
  "healthy",
  "stable",
  "attention_required",
  "critical",
] as const;
export type OrganizationalHealthStatus = (typeof ORGANIZATIONAL_HEALTH_STATUSES)[number];

export const ORGANIZATIONAL_HEALTH_INTERVENTION_STATUSES = [
  "pending",
  "approved",
  "dismissed",
  "implemented",
] as const;
export type OrganizationalHealthInterventionStatus =
  (typeof ORGANIZATIONAL_HEALTH_INTERVENTION_STATUSES)[number];

export async function getOrganizationalHealthEngineDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_organizational_health_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getOrganizationalHealthEngineCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_organizational_health_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getExecutiveHealthSummary(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_executive_health_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createOrganizationalHealthAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
