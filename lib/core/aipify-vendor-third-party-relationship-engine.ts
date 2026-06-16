/**
 * Aipify Vendor & Third-Party Relationship Engine helpers (Phase 228).
 * Authoritative enforcement lives in Supabase RPCs (_avtpre_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyVendorThirdPartyRelationshipEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_vendor_third_party_relationship_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyVendorThirdPartyRelationshipEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_vendor_third_party_relationship_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyVendorThirdPartyRelationshipEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
