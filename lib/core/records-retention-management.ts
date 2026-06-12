/**
 * Records & Retention Management Engine helpers (Phase A.60).
 * Authoritative enforcement lives in Supabase RPCs.
 * Extends Security & Trust (A.18), Compliance (A.29), Organizational Memory (A.34), Document Output (A.59).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export const RECORD_CATEGORIES = [
  "executive_report",
  "support_report",
  "incident_report",
  "certificate",
  "governance_document",
  "audit_log",
  "knowledge_export",
  "workflow_output",
] as const;
export type RecordCategory = (typeof RECORD_CATEGORIES)[number];

export const RETENTION_PERIOD_UNITS = ["days", "months", "years", "indefinite"] as const;
export type RetentionPeriodUnit = (typeof RETENTION_PERIOD_UNITS)[number];

export const RETENTION_POLICY_STATUSES = ["active", "draft", "retired"] as const;
export type RetentionPolicyStatus = (typeof RETENTION_POLICY_STATUSES)[number];

export const DISPOSAL_METHODS = [
  "secure_delete",
  "anonymize",
  "transfer_to_archive",
  "legal_hold",
] as const;
export type DisposalMethod = (typeof DISPOSAL_METHODS)[number];

export const DISPOSAL_REQUEST_STATUSES = ["pending", "approved", "completed", "rejected"] as const;
export type DisposalRequestStatus = (typeof DISPOSAL_REQUEST_STATUSES)[number];

export async function getRecordsRetentionManagementEngineDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_records_retention_management_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getRecordsRetentionManagementEngineCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_records_retention_management_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getRetentionComplianceSummary(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_retention_compliance_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getUpcomingExpirations(
  supabase: RpcClient,
  daysAhead = 90
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_upcoming_expirations", { p_days_ahead: daysAhead });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createRecordsRetentionAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
