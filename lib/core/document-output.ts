/**
 * Document & Output Engine helpers (Phase A.59 — CRITICAL V1).
 * Authoritative enforcement lives in Supabase RPCs.
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export const OUTPUT_REPORT_TYPES = [
  "executive",
  "support",
  "incident",
  "governance",
  "security",
  "training",
  "certification",
  "value_realization",
  "org_health",
  "strategic_alignment",
  "benchmarking",
] as const;

export type OutputReportType = (typeof OUTPUT_REPORT_TYPES)[number];

export const OUTPUT_TEMPLATE_STATUSES = ["active", "draft", "archived"] as const;
export type OutputTemplateStatus = (typeof OUTPUT_TEMPLATE_STATUSES)[number];

export const OUTPUT_CADENCES = ["daily", "weekly", "monthly", "quarterly", "annual"] as const;
export type OutputCadence = (typeof OUTPUT_CADENCES)[number];

export const OUTPUT_DELIVERY_METHODS = [
  "download",
  "email",
  "kc_publish",
  "executive",
  "workflow_attachment",
] as const;

export type OutputDeliveryMethod = (typeof OUTPUT_DELIVERY_METHODS)[number];

export const OUTPUT_APPROVAL_STATUSES = ["pending", "approved", "rejected", "not_required"] as const;
export type OutputApprovalStatus = (typeof OUTPUT_APPROVAL_STATUSES)[number];

export const OUTPUT_DELIVERY_STATUSES = ["pending", "delivered", "failed", "cancelled"] as const;
export type OutputDeliveryStatus = (typeof OUTPUT_DELIVERY_STATUSES)[number];

export async function getDocumentOutputEngineDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_document_output_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getDocumentOutputEngineCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_document_output_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getExecutiveOutputSummary(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_executive_output_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createDocumentOutputAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
