/**
 * Global Ecosystem Marketplace Engine helpers (Phase 148).
 * Authoritative enforcement lives in Supabase RPCs (_gseme_*).
 */

import type { RpcClient } from "./rpc-client";

export const GLOBAL_ECOSYSTEM_MARKETPLACE_PARTICIPATION_STATUSES = [
  "disabled",
  "viewer",
  "publisher",
] as const;
export type GlobalEcosystemMarketplaceParticipationStatus =
  (typeof GLOBAL_ECOSYSTEM_MARKETPLACE_PARTICIPATION_STATUSES)[number];

export const GLOBAL_SOLUTION_LISTING_CATEGORIES = [
  "executive_playbooks",
  "support_frameworks",
  "commerce_packages",
  "companion_skills",
  "knowledge_libraries",
  "transformation_programs",
  "governance_templates",
  "workflow_automations",
  "industry_packs",
  "gp_service_offerings",
] as const;
export type GlobalSolutionListingCategory = (typeof GLOBAL_SOLUTION_LISTING_CATEGORIES)[number];

export const GLOBAL_SOLUTION_VALIDATION_STATUSES = [
  "pending",
  "in_review",
  "approved",
  "rejected",
  "archived",
] as const;
export type GlobalSolutionValidationStatus = (typeof GLOBAL_SOLUTION_VALIDATION_STATUSES)[number];

export async function getGlobalEcosystemMarketplaceEngineDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_global_ecosystem_marketplace_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getGlobalEcosystemMarketplaceEngineCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_global_ecosystem_marketplace_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createGlobalEcosystemMarketplaceAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {},
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
