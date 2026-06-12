/**
 * Organizational Sensemaking Engine helpers (Phase 158).
 * Authoritative enforcement lives in Supabase RPCs (_ocsme_*).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export const ORGANIZATIONAL_SENSEMAKING_MODES = ["guided", "collaborative", "executive_sponsored"] as const;
export type OrganizationalSensemakingMode = (typeof ORGANIZATIONAL_SENSEMAKING_MODES)[number];

export const ORGANIZATIONAL_SENSEMAKING_SIGNAL_TYPES = [
  "employee_themes_aggregate",
  "customer_trends",
  "support_patterns",
  "operational_friction",
  "knowledge_gaps",
  "leadership_blind_spot_themes",
  "gp_feedback_themes",
] as const;
export type OrganizationalSensemakingSignalType =
  (typeof ORGANIZATIONAL_SENSEMAKING_SIGNAL_TYPES)[number];

export const ORGANIZATIONAL_SENSEMAKING_SYNTHESIS_TYPES = [
  "theme_extraction",
  "narrative_development",
  "stakeholder_summary",
  "executive_briefing",
  "learning_integration",
  "historical_comparison",
] as const;
export type OrganizationalSensemakingSynthesisType =
  (typeof ORGANIZATIONAL_SENSEMAKING_SYNTHESIS_TYPES)[number];

export const ORGANIZATIONAL_SENSEMAKING_REVIEW_TYPES = [
  "emerging_patterns",
  "overlooked_areas",
  "diverging_perspectives",
  "opportunities",
  "concerns",
] as const;
export type OrganizationalSensemakingReviewType =
  (typeof ORGANIZATIONAL_SENSEMAKING_REVIEW_TYPES)[number];

export async function getOrganizationalSensemakingEngineDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_organizational_sensemaking_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getOrganizationalSensemakingEngineCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_organizational_sensemaking_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createOrganizationalSensemakingAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {},
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
