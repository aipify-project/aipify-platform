/**
 * Document Intelligence & Enterprise Document Engine helpers (Phase 230).
 * Authoritative enforcement lives in Supabase RPCs (_adiede_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyDocumentIntelligenceEnterpriseDocumentEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_document_intelligence_enterprise_document_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyDocumentIntelligenceEnterpriseDocumentEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_document_intelligence_enterprise_document_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyDocumentIntelligenceEnterpriseDocumentEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
