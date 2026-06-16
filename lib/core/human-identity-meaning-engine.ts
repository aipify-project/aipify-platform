/**
 * Human Identity & Meaning Preservation Engine helpers (Phase 173).
 * Authoritative enforcement lives in Supabase RPCs (_himp_*).
 */

import type { RpcClient } from "./rpc-client";

export const HUMAN_IDENTITY_MEANING_DISCOVERY_MODES = [
  "guided",
  "community_led",
  "executive_sponsored",
] as const;
export type HumanIdentityMeaningDiscoveryMode =
  (typeof HUMAN_IDENTITY_MEANING_DISCOVERY_MODES)[number];

export const EXECUTIVE_HUMANITY_REVIEW_TYPES = [
  "dignity_preservation",
  "meaning_discovery_support",
  "belonging_cultivation",
  "agency_respect",
  "identity_humility",
] as const;
export type ExecutiveHumanityReviewType = (typeof EXECUTIVE_HUMANITY_REVIEW_TYPES)[number];

export const MEANING_REFLECTION_TYPES = [
  "purpose_exploration",
  "belonging_themes",
  "values_alignment",
  "identity_discovery",
  "meaning_journey",
  "community_belonging",
  "cultural_heritage",
  "legacy_reflection",
] as const;
export type MeaningReflectionType = (typeof MEANING_REFLECTION_TYPES)[number];

export const AGENCY_NOTE_TYPES = [
  "autonomy_preservation",
  "choice_respect",
  "responsibility_honoring",
  "creative_contribution",
  "critical_thinking",
  "leadership_development",
  "agency_dignity",
  "self_direction",
] as const;
export type AgencyNoteType = (typeof AGENCY_NOTE_TYPES)[number];

export async function getHumanIdentityMeaningEngineDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_human_identity_meaning_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getHumanIdentityMeaningEngineCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_human_identity_meaning_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createHumanIdentityMeaningAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {},
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
