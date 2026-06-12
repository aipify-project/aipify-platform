/**
 * Global Governance & Digital Diplomacy Engine helpers (Phase 144).
 * Authoritative enforcement lives in Supabase RPCs (_ggde_*).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export const PARTNERSHIP_CHARTER_STATUSES = [
  "draft",
  "in_review",
  "active",
  "under_review",
  "archived",
] as const;
export type PartnershipCharterStatus = (typeof PARTNERSHIP_CHARTER_STATUSES)[number];

export const DIPLOMACY_ENGAGEMENT_TYPES = [
  "partnership_prep",
  "stakeholder_mapping",
  "cultural_guidance",
  "communication_review",
  "expectation_alignment",
  "conflict_prevention",
  "relationship_health",
] as const;
export type DiplomacyEngagementType = (typeof DIPLOMACY_ENGAGEMENT_TYPES)[number];

export const DIPLOMACY_ENGAGEMENT_STATUSES = [
  "planned",
  "in_progress",
  "completed",
  "paused",
  "archived",
] as const;
export type DiplomacyEngagementStatus = (typeof DIPLOMACY_ENGAGEMENT_STATUSES)[number];

export const POLICY_LIBRARY_CATEGORIES = [
  "governance_template",
  "partnership_charter",
  "executive_playbook",
  "collaboration_framework",
  "ethical_guidance",
  "diplomacy_practice",
] as const;
export type PolicyLibraryCategory = (typeof POLICY_LIBRARY_CATEGORIES)[number];

export async function getGlobalGovernanceDiplomacyEngineDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_global_governance_diplomacy_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getGlobalGovernanceDiplomacyEngineCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_global_governance_diplomacy_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createGlobalGovernanceDiplomacyAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {},
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
