/**
 * Civilizational Foresight & Long-Horizon Intelligence Engine helpers (Phase 165).
 * Authoritative enforcement lives in Supabase RPCs (_cfie_*).
 */

import type { RpcClient } from "./rpc-client";

export const FORESIGHT_HORIZON_FOCUS = [
  "five_year",
  "ten_year",
  "twenty_year",
  "multi_horizon",
] as const;
export type ForesightHorizonFocus = (typeof FORESIGHT_HORIZON_FOCUS)[number];

export const SCENARIO_TYPES = [
  "technological_shifts",
  "demographic_changes",
  "workforce_evolution",
  "industry_transformation",
  "knowledge_ecosystem",
  "leadership_transitions",
  "global_interdependencies",
] as const;
export type ScenarioType = (typeof SCENARIO_TYPES)[number];

export const EXECUTIVE_FORESIGHT_REVIEW_TYPES = [
  "plausible_futures",
  "reactive_patterns",
  "capabilities_to_strengthen",
  "relationship_investment",
  "responsibilities_of_influence",
] as const;
export type ExecutiveForesightReviewType = (typeof EXECUTIVE_FORESIGHT_REVIEW_TYPES)[number];

export const FORESIGHT_MEMORY_TYPES = [
  "scenario_exercise",
  "leadership_reflection",
  "future_review",
  "knowledge_contribution",
  "preparedness_lesson",
  "institutional_narrative",
] as const;
export type ForesightMemoryType = (typeof FORESIGHT_MEMORY_TYPES)[number];

export async function getCivilizationalForesightEngineDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_civilizational_foresight_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCivilizationalForesightEngineCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_civilizational_foresight_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createCivilizationalForesightAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {},
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
