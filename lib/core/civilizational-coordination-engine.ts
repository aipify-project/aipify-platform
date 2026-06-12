/**
 * Civilizational Coordination & Shared Action Engine helpers (Phase 166).
 * Authoritative enforcement lives in Supabase RPCs (_ccae_*).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export const COORDINATION_MODES = ["voluntary", "governed", "executive_sponsored"] as const;
export type CoordinationMode = (typeof COORDINATION_MODES)[number];

export const SHARED_ACTION_PROGRAM_TYPES = [
  "cross_organization_program",
  "shared_action_framework",
  "leadership_coordination_session",
  "ecosystem_initiative_dashboard",
  "companion_coordination_support",
  "preparedness_network",
  "knowledge_exchange_program",
  "outcome_reflection_review",
] as const;
export type SharedActionProgramType = (typeof SHARED_ACTION_PROGRAM_TYPES)[number];

export const COORDINATION_PARTNERSHIP_TYPES = [
  "organization",
  "growth_partner",
  "educational_institution",
  "professional_community",
  "knowledge_network",
  "industry_group",
  "community_initiative",
] as const;
export type CoordinationPartnershipType = (typeof COORDINATION_PARTNERSHIP_TYPES)[number];

export const COORDINATION_MILESTONE_TYPES = [
  "objective_alignment",
  "role_clarity",
  "participation_checkpoint",
  "governance_review",
  "communication_scaffold",
  "outcome_reflection",
] as const;
export type CoordinationMilestoneType = (typeof COORDINATION_MILESTONE_TYPES)[number];

export async function getCivilizationalCoordinationEngineDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_civilizational_coordination_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCivilizationalCoordinationEngineCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_civilizational_coordination_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createCivilizationalCoordinationAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {},
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
