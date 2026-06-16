/**
 * Aipify Moderation — Image Approval & Content Review Engine.
 * Authoritative enforcement lives in Supabase RPCs (_amod_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyModerationDashboard(
  supabase: RpcClient,
  tab = "needs_review"
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_moderation_dashboard", { p_tab: tab });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function submitModerationImage(
  supabase: RpcClient,
  payload: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("submit_moderation_image", { p_payload: payload });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function reviewModerationResult(
  supabase: RpcClient,
  resultId: string,
  finalDecision: string,
  reason = "",
  overrideAi = false
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("review_moderation_result", {
    p_result_id: resultId,
    p_final_decision: finalDecision,
    p_reason: reason,
    p_override_ai: overrideAi,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function canReviewModeration(role: string): boolean {
  return role === "owner" || role === "administrator" || role === "admin";
}
