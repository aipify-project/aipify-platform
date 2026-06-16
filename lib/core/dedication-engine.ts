/**
 * Dedication Engine helpers (Phase A.91).
 * Authoritative enforcement lives in Supabase RPCs.
 */

import type { RpcClient } from "./rpc-client";

export const DEDICATION_SIGNAL_TYPES = [
  "solution_retry",
  "clarification_requested",
  "alternative_offered",
  "task_persistence",
  "progress_acknowledged",
] as const;
export type DedicationSignalType = (typeof DEDICATION_SIGNAL_TYPES)[number];

export const DEDICATION_COMMITMENT_TYPES = [
  "solution_follow_through",
  "complex_task_support",
  "continued_exploration",
  "patient_assistance",
  "progress_commitment",
] as const;
export type DedicationCommitmentType = (typeof DEDICATION_COMMITMENT_TYPES)[number];

export const DEDICATION_COMMITMENT_STATUSES = ["active", "completed", "paused"] as const;
export type DedicationCommitmentStatus = (typeof DEDICATION_COMMITMENT_STATUSES)[number];

export const DEDICATION_ENGINE_PERMISSION_KEYS = [
  "dedication_engine.view",
  "dedication_engine.manage",
  "dedication_engine.export",
] as const;
export type DedicationEnginePermissionKey = (typeof DEDICATION_ENGINE_PERMISSION_KEYS)[number];

export const DEDICATION_ENGINE_MODULE_KEY = "dedication_engine" as const;

export async function getDedicationEngineDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_dedication_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getDedicationEngineCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_dedication_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createDedicationEngineAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
