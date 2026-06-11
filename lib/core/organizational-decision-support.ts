/**
 * Organizational Decision Support Engine helpers (Phase A.54).
 * Authoritative enforcement lives in Supabase RPCs.
 * Distinct from Assistant DSE at lib/decision-support-engine/ (/app/assistant/decisions).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export const ORGANIZATIONAL_DECISION_CATEGORIES = [
  "operational",
  "staffing",
  "support_prioritization",
  "workflow_optimization",
  "strategic_planning",
  "resource_allocation",
] as const;

export type OrganizationalDecisionCategory = (typeof ORGANIZATIONAL_DECISION_CATEGORIES)[number];

export const ORGANIZATIONAL_DECISION_CONFIDENCE_LEVELS = ["low", "medium", "high"] as const;
export type OrganizationalDecisionConfidenceLevel = (typeof ORGANIZATIONAL_DECISION_CONFIDENCE_LEVELS)[number];

export const ORGANIZATIONAL_DECISION_STATUSES = [
  "proposed",
  "under_review",
  "approved",
  "rejected",
  "implemented",
] as const;

export type OrganizationalDecisionStatus = (typeof ORGANIZATIONAL_DECISION_STATUSES)[number];

export async function getOrganizationalDecisionSupportEngineDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_organizational_decision_support_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getOrganizationalDecisionSupportEngineCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_organizational_decision_support_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getExecutiveDecisionSummary(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_executive_decision_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createOrganizationalDecisionSupportAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
