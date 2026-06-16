/**
 * Business Packs Foundation helpers (Phase A.43).
 * Authoritative enforcement lives in Supabase RPCs.
 */

import type { RpcClient } from "./rpc-client";

export async function getBusinessPacksFoundationEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_business_packs_foundation_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getBusinessPackReview(supabase: RpcClient, packKey: string): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_business_pack_review", { p_pack_key: packKey });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function activateOrganizationBusinessPack(supabase: RpcClient, packKey: string): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("activate_organization_business_pack", { p_pack_key: packKey });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function customizeOrganizationBusinessPack(
  supabase: RpcClient,
  packKey: string,
  customizations: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("customize_organization_business_pack", {
    p_pack_key: packKey,
    p_customizations: customizations,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createBusinessPacksFoundationAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
