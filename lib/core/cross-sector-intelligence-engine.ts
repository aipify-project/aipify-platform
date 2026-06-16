/**
 * Cross-Sector Intelligence & Societal Resilience Engine helpers (Phase 162).
 * Authoritative enforcement lives in Supabase RPCs (_csie_*).
 */

import type { RpcClient } from "./rpc-client";

export const CROSS_SECTOR_PARTICIPATION_STATUSES = ["disabled", "viewer", "contributor"] as const;
export type CrossSectorParticipationStatus = (typeof CROSS_SECTOR_PARTICIPATION_STATUSES)[number];

export const CROSS_SECTOR_PREPAREDNESS_LEVELS = [
  "exploring",
  "developing",
  "practiced",
  "reviewed",
] as const;
export type CrossSectorPreparednessLevel = (typeof CROSS_SECTOR_PREPAREDNESS_LEVELS)[number];

export const CROSS_SECTOR_REVIEW_TYPES = [
  "disruption_reflection",
  "partner_preparedness",
  "knowledge_dependency",
  "leadership_readiness",
  "collaboration_opportunity",
  "scenario_reflection",
  "ecosystem_health",
  "mutual_support",
] as const;
export type CrossSectorReviewType = (typeof CROSS_SECTOR_REVIEW_TYPES)[number];

export const CROSS_SECTOR_NETWORK_TYPES = [
  "knowledge_sharing",
  "leadership_forum",
  "professional_support",
  "educational_partnership",
  "gp_coordination",
  "preparedness_exercise",
  "mutual_learning",
  "community_bridge",
] as const;
export type CrossSectorNetworkType = (typeof CROSS_SECTOR_NETWORK_TYPES)[number];

export async function getCrossSectorIntelligenceEngineDashboard(
  supabase: RpcClient,
  orgId?: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc(
    "get_cross_sector_intelligence_engine_dashboard",
    orgId ? { p_org_id: orgId } : {},
  );
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCrossSectorIntelligenceEngineCard(
  supabase: RpcClient,
  orgId?: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc(
    "get_cross_sector_intelligence_engine_card",
    orgId ? { p_org_id: orgId } : {},
  );
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createCrossSectorIntelligenceAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {},
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
