/**
 * Context Intelligence Engine helpers (Phase A.77).
 * Organizational ABOS context intelligence — distinct from Phase 35 Context Engine (calendars/UCL).
 * Authoritative enforcement lives in Supabase RPCs (_cie_*).
 */

import {
  CONTEXT_DIMENSIONS,
  type ContextDimension,
} from "@/lib/aipify/context-intelligence-engine";

export { CONTEXT_DIMENSIONS, type ContextDimension };

import type { RpcClient } from "./rpc-client";

export async function getContextIntelligenceEngineDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_context_intelligence_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getContextIntelligenceEngineCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_context_intelligence_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function listOrganizationContextGaps(
  supabase: RpcClient,
  status = "open",
  limit = 50
): Promise<unknown[]> {
  const { data, error } = await supabase.rpc("list_organization_context_gaps", {
    p_status: status,
    p_limit: limit,
  });
  if (error) throw new Error(error.message);
  return Array.isArray(data) ? data : [];
}

export async function resolveOrganizationContextGap(
  supabase: RpcClient,
  gapId: string,
  resolutionNote?: string,
  status = "resolved"
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("resolve_organization_context_gap", {
    p_gap_id: gapId,
    p_resolution_note: resolutionNote ?? null,
    p_status: status,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function exportContextIntelligenceSummary(
  supabase: RpcClient,
  format = "json"
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("export_context_intelligence_summary", {
    p_format: format,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createContextIntelligenceAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
