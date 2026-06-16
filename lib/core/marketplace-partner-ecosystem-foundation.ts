/**
 * Marketplace & Partner Ecosystem Foundation helpers (Phase A.45).
 * Authoritative enforcement lives in Supabase RPCs.
 */

import type { RpcClient } from "./rpc-client";

export async function getMarketplacePartnerEcosystemFoundationEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_marketplace_partner_ecosystem_foundation_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getMarketplacePartnerEcosystemFoundationEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_marketplace_partner_ecosystem_foundation_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function submitPartnerForReview(
  supabase: RpcClient,
  partnerName: string,
  partnerType?: string,
  website?: string,
  offering?: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("submit_partner_for_review", {
    p_partner_name: partnerName,
    p_partner_type: partnerType,
    p_website: website,
    p_offering: offering,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function reviewPartnerApplication(
  supabase: RpcClient,
  partnerId: string,
  reviewNotes?: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("review_partner_application", {
    p_partner_id: partnerId,
    p_review_notes: reviewNotes,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function approvePartner(
  supabase: RpcClient,
  partnerId: string,
  certificationLevel?: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("approve_partner", {
    p_partner_id: partnerId,
    p_certification_level: certificationLevel,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function suspendPartner(
  supabase: RpcClient,
  partnerId: string,
  reason?: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("suspend_partner", {
    p_partner_id: partnerId,
    p_reason: reason,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function recertifyPartner(
  supabase: RpcClient,
  partnerId: string,
  certificationLevel?: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("recertify_partner", {
    p_partner_id: partnerId,
    p_certification_level: certificationLevel,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createMarketplacePartnerEcosystemFoundationAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
