/**
 * Global Knowledge Exchange Engine helpers (Phase 141).
 * Authoritative enforcement lives in Supabase RPCs (_gkee_*).
 */

import type { RpcClient } from "./rpc-client";

export const GLOBAL_KNOWLEDGE_EXCHANGE_PARTICIPATION_STATUSES = [
  "disabled",
  "viewer",
  "contributor",
] as const;
export type GlobalKnowledgeExchangeParticipationStatus =
  (typeof GLOBAL_KNOWLEDGE_EXCHANGE_PARTICIPATION_STATUSES)[number];

export const GLOBAL_KNOWLEDGE_EXCHANGE_CONTRIBUTION_TYPES = [
  "lessons_learned",
  "best_practice",
  "transformation_experience",
  "support_excellence",
  "companion_adoption",
  "governance_framework",
  "implementation_playbook",
  "training_insight",
  "case_study_summary",
  "operational_pattern",
] as const;
export type GlobalKnowledgeExchangeContributionType =
  (typeof GLOBAL_KNOWLEDGE_EXCHANGE_CONTRIBUTION_TYPES)[number];

export const GLOBAL_KNOWLEDGE_EXCHANGE_CONTRIBUTION_STATUSES = [
  "pending",
  "approved",
  "rejected",
] as const;
export type GlobalKnowledgeExchangeContributionStatus =
  (typeof GLOBAL_KNOWLEDGE_EXCHANGE_CONTRIBUTION_STATUSES)[number];

export const GLOBAL_KNOWLEDGE_EXCHANGE_ANONYMIZATION_LEVELS = ["standard", "enhanced"] as const;
export type GlobalKnowledgeExchangeAnonymizationLevel =
  (typeof GLOBAL_KNOWLEDGE_EXCHANGE_ANONYMIZATION_LEVELS)[number];

export async function getGlobalKnowledgeExchangeEngineDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_global_knowledge_exchange_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getGlobalKnowledgeExchangeEngineCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_global_knowledge_exchange_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAnonymizedBenchmarkSummary(
  supabase: RpcClient,
  tenantId?: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc(
    "get_anonymized_benchmark_summary",
    tenantId ? { p_tenant_id: tenantId } : {},
  );
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createGlobalKnowledgeExchangeAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {},
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
