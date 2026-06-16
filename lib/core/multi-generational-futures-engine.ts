/**
 * Multi-Generational Futures Engine helpers (Phase 171).
 * Authoritative enforcement lives in Supabase RPCs (_mgfe_*).
 */

import type { RpcClient } from "./rpc-client";

export const MULTI_GENERATIONAL_FUTURES_STEWARDSHIP_MODES = [
  "guided",
  "executive_sponsored",
  "stewardship_council",
] as const;
export type MultiGenerationalFuturesStewardshipMode =
  (typeof MULTI_GENERATIONAL_FUTURES_STEWARDSHIP_MODES)[number];

export const EXECUTIVE_FUTURES_REVIEW_TYPES = [
  "organizational_futures_readiness",
  "intergenerational_impact",
  "legacy_responsibility",
  "long_horizon_stewardship",
  "future_leaders_preparation",
] as const;
export type ExecutiveFuturesReviewType = (typeof EXECUTIVE_FUTURES_REVIEW_TYPES)[number];

export const LONG_HORIZON_REFLECTION_TYPES = [
  "five_year_perspective",
  "twenty_year_responsibility",
  "fifty_year_stewardship",
  "intergenerational_equity",
  "legacy_continuity_themes",
  "knowledge_stewardship_horizons",
  "leadership_succession_futures",
  "cosmic_stewardship_reflection",
] as const;
export type LongHorizonReflectionType = (typeof LONG_HORIZON_REFLECTION_TYPES)[number];

export async function getMultiGenerationalFuturesEngineDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_multi_generational_futures_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getMultiGenerationalFuturesEngineCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_multi_generational_futures_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createMultiGenerationalFuturesAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {},
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
