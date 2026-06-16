/**
 * Service Level & Commitment Engine helpers (Phase A.52).
 * Authoritative enforcement lives in Supabase RPCs.
 */

import type { RpcClient } from "./rpc-client";

export const COMMITMENT_TYPES = [
  "support_response",
  "incident_response",
  "resolution_target",
  "onboarding_commitment",
  "approval_turnaround",
] as const;

export type CommitmentType = (typeof COMMITMENT_TYPES)[number];

export const MEASUREMENT_UNITS = ["minutes", "hours", "business_days", "percentage"] as const;
export type MeasurementUnit = (typeof MEASUREMENT_UNITS)[number];

export const COMMITMENT_STATUSES = ["active", "paused", "retired"] as const;
export type CommitmentStatus = (typeof COMMITMENT_STATUSES)[number];

export const COMMITMENT_SEVERITY_SCOPES = ["low", "medium", "high", "critical"] as const;
export type CommitmentSeverityScope = (typeof COMMITMENT_SEVERITY_SCOPES)[number];

export const COMMITMENT_ALERT_TYPES = ["threshold_warning", "breach", "escalation"] as const;
export type CommitmentAlertType = (typeof COMMITMENT_ALERT_TYPES)[number];

export const COMMITMENT_ALERT_STATUSES = ["open", "acknowledged", "resolved"] as const;
export type CommitmentAlertStatus = (typeof COMMITMENT_ALERT_STATUSES)[number];

export async function getServiceLevelCommitmentEngineDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_service_level_commitment_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getServiceLevelCommitmentEngineCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_service_level_commitment_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getExecutiveCommitmentSummary(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_executive_commitment_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCommitmentComplianceSummary(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_commitment_compliance_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createServiceLevelCommitmentAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
