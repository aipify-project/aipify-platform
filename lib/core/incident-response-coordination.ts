/**
 * Incident Response Coordination Engine helpers (Phase A.51).
 * Authoritative enforcement lives in Supabase RPCs.
 */

import type { RpcClient } from "./rpc-client";

export const IRCE_INCIDENT_TYPES = [
  "support_incident",
  "system_outage",
  "integration_failure",
  "security_incident",
  "operational_disruption",
  "customer_impacting",
] as const;

export type IrceIncidentType = (typeof IRCE_INCIDENT_TYPES)[number];

export const IRCE_INCIDENT_SEVERITIES = ["low", "medium", "high", "critical"] as const;
export type IrceIncidentSeverity = (typeof IRCE_INCIDENT_SEVERITIES)[number];

export const IRCE_INCIDENT_STATUSES = [
  "identified",
  "investigating",
  "mitigated",
  "resolved",
  "closed",
] as const;

export type IrceIncidentStatus = (typeof IRCE_INCIDENT_STATUSES)[number];

export const IRCE_COMMUNICATION_TYPES = [
  "stakeholder",
  "executive",
  "resolution",
  "escalation",
] as const;

export type IrceCommunicationType = (typeof IRCE_COMMUNICATION_TYPES)[number];

export async function getIncidentResponseCoordinationEngineDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_incident_response_coordination_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getIncidentResponseCoordinationEngineCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_incident_response_coordination_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getIncidentExecutiveSummary(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_incident_executive_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createIncidentResponseCoordinationAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
