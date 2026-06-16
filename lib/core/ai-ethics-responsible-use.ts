/**
 * AI Ethics & Responsible Use helpers (Phase A.46).
 * Authoritative enforcement lives in Supabase RPCs.
 */

import type { RpcClient } from "./rpc-client";

export async function getAiEthicsResponsibleUseEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_ai_ethics_responsible_use_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAiEthicsResponsibleUseEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_ai_ethics_responsible_use_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function proposeAiUseCase(
  supabase: RpcClient,
  useCaseName: string,
  category?: string,
  riskLevel?: string,
  oversightRequired?: boolean
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("propose_ai_use_case", {
    p_use_case_name: useCaseName,
    p_category: category,
    p_risk_level: riskLevel,
    p_oversight_required: oversightRequired,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function reviewAiUseCase(
  supabase: RpcClient,
  useCaseId: string,
  reviewNotes?: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("review_ai_use_case", {
    p_use_case_id: useCaseId,
    p_review_notes: reviewNotes,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function approveAiUseCase(supabase: RpcClient, useCaseId: string): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("approve_ai_use_case", { p_use_case_id: useCaseId });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function restrictAiUseCase(
  supabase: RpcClient,
  useCaseId: string,
  reason?: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("restrict_ai_use_case", {
    p_use_case_id: useCaseId,
    p_reason: reason,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function overrideEthicsPolicyException(
  supabase: RpcClient,
  useCaseId: string,
  justification: string,
  durationDays?: number
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("override_ethics_policy_exception", {
    p_use_case_id: useCaseId,
    p_justification: justification,
    p_exception_duration_days: durationDays,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAiEthicsResponsibleUseAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
