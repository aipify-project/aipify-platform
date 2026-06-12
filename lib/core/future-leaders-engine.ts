/**
 * Future Leaders Engine helpers (Phase 151).
 * Authoritative enforcement lives in Supabase RPCs (_ifle_*).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export const FUTURE_LEADERS_DEVELOPMENT_MODES = ["guided", "self_directed", "executive_sponsored"] as const;
export type FutureLeadersDevelopmentMode = (typeof FUTURE_LEADERS_DEVELOPMENT_MODES)[number];

export const FUTURE_LEADERS_PATHWAY_TYPES = [
  "first_time_managers",
  "team_leaders",
  "department_leaders",
  "executive_candidates",
  "gp_leaders",
  "knowledge_stewards",
] as const;
export type FutureLeadersPathwayType = (typeof FUTURE_LEADERS_PATHWAY_TYPES)[number];

export const FUTURE_LEADERS_MENTORSHIP_TYPES = [
  "formal_mentorship",
  "peer_mentorship",
  "executive_shadowing",
  "knowledge_stewardship",
  "gp_leadership",
  "cross_generational_exchange",
] as const;
export type FutureLeadersMentorshipType = (typeof FUTURE_LEADERS_MENTORSHIP_TYPES)[number];

export const FUTURE_LEADERS_MEMORY_TYPES = [
  "lesson_learned",
  "leadership_story",
  "decision_reflection",
  "transformation_experience",
  "governance_insight",
  "cultural_narrative",
] as const;
export type FutureLeadersMemoryType = (typeof FUTURE_LEADERS_MEMORY_TYPES)[number];

export async function getFutureLeadersEngineDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_future_leaders_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getFutureLeadersEngineCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_future_leaders_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createFutureLeadersAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {},
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
