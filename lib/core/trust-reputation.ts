/**
 * Trust & Reputation Engine helpers (Phase A.72).
 * Authoritative enforcement lives in Supabase RPCs.
 */

import type { RpcClient } from "./rpc-client";

export const TRUST_ENTITY_TYPES = [
  "workflow",
  "automation",
  "approval",
  "knowledge",
  "support",
  "governance",
] as const;
export type TrustEntityType = (typeof TRUST_ENTITY_TYPES)[number];

export const TRUST_LEVELS = ["emerging", "established", "trusted", "highly_trusted"] as const;
export type TrustLevel = (typeof TRUST_LEVELS)[number];

export const TRUST_PROFILE_STATUSES = ["active", "under_review", "revoked", "archived"] as const;
export type TrustProfileStatus = (typeof TRUST_PROFILE_STATUSES)[number];

export const TRUST_SIGNAL_TYPES = [
  "approval_accuracy",
  "task_completion",
  "support_quality",
  "knowledge_contribution",
  "policy_adherence",
  "positive_audit",
] as const;
export type TrustSignalType = (typeof TRUST_SIGNAL_TYPES)[number];

export const TRUST_OUTCOME_TYPES = [
  "success_pattern",
  "revocation",
  "lesson",
  "expansion_approved",
  "expansion_rejected",
] as const;
export type TrustOutcomeType = (typeof TRUST_OUTCOME_TYPES)[number];

export async function getTrustReputationEngineDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_trust_reputation_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getTrustReputationEngineCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_trust_reputation_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getExecutiveTrustSummary(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_executive_trust_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createTrustReputationAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
