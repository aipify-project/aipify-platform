/**
 * Change Management Engine helpers (Phase A.47).
 * Authoritative enforcement lives in Supabase RPCs.
 */

import type { RpcClient } from "./rpc-client";

export const CHANGE_TYPES = [
  "new_module_activation",
  "workflow_changes",
  "governance_updates",
  "role_changes",
  "process_improvements",
  "deployment_initiatives",
] as const;

export type ChangeType = (typeof CHANGE_TYPES)[number];

export const CHANGE_STATUSES = [
  "planning",
  "in_progress",
  "completed",
  "paused",
  "cancelled",
] as const;

export type ChangeStatus = (typeof CHANGE_STATUSES)[number];

export const COMMUNICATION_TYPES = [
  "stakeholder_announcement",
  "rollout_message",
  "reminder",
  "completion_update",
] as const;

export type CommunicationType = (typeof COMMUNICATION_TYPES)[number];

export const ADOPTION_METRIC_TYPES = [
  "engagement",
  "workflow_utilization",
  "training_completion",
  "recommendation_acceptance",
  "outcome",
] as const;

export type AdoptionMetricType = (typeof ADOPTION_METRIC_TYPES)[number];

export async function getChangeManagementEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_change_management_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getChangeManagementEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_change_management_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function createChangeInitiative(
  supabase: RpcClient,
  params: {
    initiative_name: string;
    change_type: ChangeType;
    description?: string;
    owner_user_id?: string;
    target_date?: string;
  }
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("create_change_initiative", {
    p_initiative_name: params.initiative_name,
    p_change_type: params.change_type,
    p_description: params.description ?? null,
    p_owner_user_id: params.owner_user_id ?? null,
    p_target_date: params.target_date ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createChangeManagementAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
