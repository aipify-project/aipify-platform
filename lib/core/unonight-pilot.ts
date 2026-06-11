/**
 * Unonight Pilot Operations Engine helpers (Phase A.15).
 * Authoritative enforcement lives in Supabase RPCs (_upo_*).
 */

export const PILOT_HEALTH_STATUSES = ["excellent", "healthy", "needs_attention", "critical"] as const;
export type PilotHealthStatus = (typeof PILOT_HEALTH_STATUSES)[number];

export const PILOT_MILESTONE_STATUSES = ["pending", "in_progress", "completed", "blocked"] as const;
export type PilotMilestoneStatus = (typeof PILOT_MILESTONE_STATUSES)[number];

export const PILOT_FEEDBACK_TYPES = [
  "support_quality",
  "admin_assistant",
  "knowledge_center",
  "approval_workflow",
  "integration_stability",
  "overall_satisfaction",
  "recommendation_outcome",
] as const;
export type PilotFeedbackType = (typeof PILOT_FEEDBACK_TYPES)[number];

export const PILOT_METRIC_KEYS = [
  "support_open_cases",
  "support_resolved_30d",
  "support_avg_response_hours",
  "ai_recommendation_acceptance_pct",
  "kc_published_articles",
  "pending_approvals",
  "admin_recommendations_accepted_30d",
] as const;
export type PilotMetricKey = (typeof PILOT_METRIC_KEYS)[number];

export const UNONIGHT_PILOT_MODULE_FLAGS = [
  "admin_assistant",
  "support_ai",
  "knowledge_center",
  "audit_log",
  "operations_dashboard",
  "governance_engine",
  "quality_guardian",
  "integration_engine",
] as const;

type PilotRpcClient = {
  rpc: (
    fn: string,
    params?: Record<string, unknown>
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export function isPilotHealthCritical(status?: string): boolean {
  return status === "critical" || status === "needs_attention";
}

export function canConfigurePilot(role: string): boolean {
  return role === "owner" || role === "administrator";
}

export function canManagePilotMilestones(role: string): boolean {
  return role === "owner" || role === "administrator" || role === "manager";
}

export async function provisionUnonightPilot(
  supabase: PilotRpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("provision_unonight_pilot");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function recordPilotMetric(
  supabase: PilotRpcClient,
  params: { metric_key: string; metric_value: number; measurement_period?: string }
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("record_pilot_metric", {
    p_metric_key: params.metric_key,
    p_metric_value: params.metric_value,
    p_measurement_period: params.measurement_period ?? "30d",
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function submitPilotFeedback(
  supabase: PilotRpcClient,
  params: {
    feedback_type: PilotFeedbackType;
    source?: string;
    rating?: number;
    comment_summary?: string;
  }
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("submit_pilot_feedback", {
    p_feedback_type: params.feedback_type,
    p_source: params.source ?? "dashboard",
    p_rating: params.rating ?? null,
    p_comment_summary: params.comment_summary ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function updatePilotMilestone(
  supabase: PilotRpcClient,
  milestoneKey: string,
  status: PilotMilestoneStatus = "completed"
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("update_pilot_milestone", {
    p_milestone_key: milestoneKey,
    p_status: status,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getPilotHealth(
  supabase: PilotRpcClient,
  organizationId?: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_pilot_health", {
    p_organization_id: organizationId ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createPilotAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
