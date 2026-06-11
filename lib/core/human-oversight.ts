/**
 * Human Oversight Engine helpers (Phase A.40).
 * Authoritative enforcement lives in Supabase RPCs.
 */

import { type RiskLevel, isManualOnly, requiresHumanApproval } from "./risk";

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export const OVERSIGHT_LEVELS = [
  "advisory_only",
  "approval_required",
  "limited_automation",
  "organization_defined",
] as const;

export type OversightLevel = (typeof OVERSIGHT_LEVELS)[number];

export async function getHumanOversightEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_human_oversight_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function isAiProhibitedForRisk(risk: RiskLevel, aiInitiated = true): boolean {
  return aiInitiated && isManualOnly(risk);
}

export function oversightRequiresApproval(risk: RiskLevel, level: OversightLevel = "approval_required"): boolean {
  if (level === "advisory_only") return false;
  if (level === "limited_automation" && risk === "low") return false;
  return requiresHumanApproval(risk) || risk === "medium";
}

export function createHumanOversightAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
