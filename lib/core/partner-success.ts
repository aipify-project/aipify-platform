/**
 * Partner Success Engine helpers (Phase A.73).
 * Authoritative enforcement lives in Supabase RPCs.
 */

import type { RpcClient } from "./rpc-client";

export const PARTNER_TYPES = [
  "implementation_partner",
  "consultant",
  "reseller",
  "msp",
  "onboarding_specialist",
  "enterprise_advisor",
] as const;
export type PartnerType = (typeof PARTNER_TYPES)[number];

export const PARTNER_STATUSES = ["prospect", "active", "suspended", "archived"] as const;
export type PartnerStatus = (typeof PARTNER_STATUSES)[number];

export const PARTNER_ENGAGEMENT_TYPES = [
  "implementation",
  "onboarding",
  "advisory",
  "enablement",
  "renewal",
] as const;
export type PartnerEngagementType = (typeof PARTNER_ENGAGEMENT_TYPES)[number];

export const PARTNER_ONBOARDING_STATUSES = [
  "not_started",
  "in_progress",
  "completed",
  "stalled",
] as const;
export type PartnerOnboardingStatus = (typeof PARTNER_ONBOARDING_STATUSES)[number];

export const PARTNER_RENEWAL_READINESS = ["low", "medium", "high", "critical"] as const;
export type PartnerRenewalReadiness = (typeof PARTNER_RENEWAL_READINESS)[number];

export const PARTNER_OUTCOME_TYPES = [
  "implementation_pattern",
  "barrier",
  "best_practice",
  "lesson",
] as const;
export type PartnerOutcomeType = (typeof PARTNER_OUTCOME_TYPES)[number];

export async function getPartnerSuccessEngineDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_partner_success_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getPartnerSuccessEngineCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_partner_success_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getExecutivePartnerPortfolioSummary(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_executive_partner_portfolio_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createPartnerSuccessAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
