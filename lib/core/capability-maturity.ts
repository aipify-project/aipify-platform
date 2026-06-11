/**
 * Capability Maturity Engine helpers (Phase A.57).
 * Authoritative enforcement lives in Supabase RPCs.
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export const MATURITY_DOMAINS = [
  "support_operations",
  "governance",
  "knowledge_management",
  "workflow_automation",
  "change_management",
  "strategic_execution",
] as const;

export type MaturityDomain = (typeof MATURITY_DOMAINS)[number];

export const MATURITY_LEVELS = [1, 2, 3, 4, 5] as const;
export type MaturityLevel = (typeof MATURITY_LEVELS)[number];

export const MATURITY_LEVEL_LABELS = [
  "initial",
  "developing",
  "established",
  "advanced",
  "optimized",
] as const;

export type MaturityLevelLabel = (typeof MATURITY_LEVEL_LABELS)[number];

export const MATURITY_ROADMAP_STATUSES = ["draft", "active", "completed", "archived"] as const;
export type MaturityRoadmapStatus = (typeof MATURITY_ROADMAP_STATUSES)[number];

export const MATURITY_REPORT_TYPES = [
  "domain_summary",
  "executive_overview",
  "roadmap_export",
  "assessment_history",
] as const;

export type MaturityReportType = (typeof MATURITY_REPORT_TYPES)[number];

export async function getCapabilityMaturityEngineDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_capability_maturity_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCapabilityMaturityEngineCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_capability_maturity_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getExecutiveMaturitySummary(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_executive_maturity_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createCapabilityMaturityAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
