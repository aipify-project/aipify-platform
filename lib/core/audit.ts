/**
 * Audit log & accountability helpers (Phase A.4).
 * Authoritative storage and enforcement live in Supabase RPCs (_ala_*).
 */

export const AUDIT_ACTOR_TYPES = ["user", "ai", "system"] as const;
export type AuditActorType = (typeof AUDIT_ACTOR_TYPES)[number];

export const AUDIT_APPROVAL_STATUSES = [
  "not_required",
  "pending",
  "approved",
  "rejected",
] as const;
export type AuditApprovalStatus = (typeof AUDIT_APPROVAL_STATUSES)[number];

export const AUDIT_EXPORT_FORMATS = ["csv", "xlsx", "pdf"] as const;
export type AuditExportFormat = (typeof AUDIT_EXPORT_FORMATS)[number];

export type AuditLogEntry = {
  id: string;
  actor_type: AuditActorType;
  actor_role?: string | null;
  action_type: string;
  entity_type?: string | null;
  entity_id?: string | null;
  action_summary?: string | null;
  ai_involved?: boolean;
  approval_status?: AuditApprovalStatus;
  metadata?: Record<string, unknown>;
  created_at?: string;
};

export type AuditSearchFilters = {
  action_type?: string;
  entity_type?: string;
  actor_type?: AuditActorType;
  approval_status?: AuditApprovalStatus;
  ai_involved?: boolean;
  from_date?: string;
  to_date?: string;
  limit?: number;
};

const SENSITIVE_KEYS = ["password", "secret", "token", "credentials", "api_key"];

/** Client-side metadata redaction preview — server `_ala_redact_metadata` is authoritative. */
export function redactSensitiveMetadata(metadata: Record<string, unknown>): Record<string, unknown> {
  const result = { ...metadata };
  for (const key of SENSITIVE_KEYS) {
    if (key in result) delete result[key];
  }
  return result;
}

export function buildAuditSummary(actionType: string, fallback?: string): string {
  if (fallback) return fallback;
  return actionType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function isSecurityEvent(actionType: string): boolean {
  return [
    "login",
    "failed_login",
    "logout",
    "permission_granted",
    "permission_removed",
    "role_changed",
  ].includes(actionType);
}

export function isAiAuditEvent(actionType: string, aiInvolved = false): boolean {
  return aiInvolved || actionType.startsWith("ai_");
}

export function formatExportFilename(format: AuditExportFormat, orgSlug?: string): string {
  const date = new Date().toISOString().slice(0, 10);
  const prefix = orgSlug ? `${orgSlug}-` : "";
  return `${prefix}audit-log-${date}.${format}`;
}

type AuditRpcClient = {
  rpc: (
    fn: string,
    params?: Record<string, unknown>
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export type CreateAuditLogParams = {
  action_type: string;
  entity_type?: string | null;
  entity_id?: string | null;
  actor_type?: AuditActorType;
  ai_involved?: boolean;
  approval_required?: boolean;
  approval_status?: AuditApprovalStatus;
  action_summary?: string | null;
  metadata?: Record<string, unknown>;
};

/** Write a tenant-scoped audit entry when the action type requires auditing. */
export async function createAuditLog(
  supabase: AuditRpcClient,
  params: CreateAuditLogParams
): Promise<string | null> {
  const { data, error } = await supabase.rpc("create_audit_log", {
    p_action_type: params.action_type,
    p_entity_type: params.entity_type ?? null,
    p_entity_id: params.entity_id ?? null,
    p_actor_type: params.actor_type ?? "user",
    p_ai_involved: params.ai_involved ?? false,
    p_approval_required: params.approval_required ?? false,
    p_approval_status: params.approval_status ?? "not_required",
    p_action_summary: params.action_summary ?? null,
    p_metadata: redactSensitiveMetadata(params.metadata ?? {}),
  });
  if (error) throw new Error(error.message);
  return (data as string | null) ?? null;
}

/** Record AI recommendation, execution, or rejection events. */
export async function recordAIActivity(
  supabase: AuditRpcClient,
  actionType: "ai_action_suggested" | "ai_action_executed" | "ai_action_rejected" | string,
  options: Omit<CreateAuditLogParams, "action_type" | "ai_involved" | "actor_type"> = {}
): Promise<string | null> {
  return createAuditLog(supabase, {
    ...options,
    action_type: actionType,
    actor_type: "ai",
    ai_involved: true,
  });
}

export async function searchAuditLogs(
  supabase: AuditRpcClient,
  filters: AuditSearchFilters = {}
): Promise<AuditLogEntry[]> {
  const { data, error } = await supabase.rpc("search_audit_logs", { p_filters: filters });
  if (error) throw new Error(error.message);
  return (data as AuditLogEntry[] | null) ?? [];
}

export async function getRecentEvents(
  supabase: AuditRpcClient,
  limit = 15
): Promise<AuditLogEntry[]> {
  return searchAuditLogs(supabase, { limit });
}

export type AuditTimeline = {
  recent_activity: AuditLogEntry[];
  ai_activity_timeline: AuditLogEntry[];
  security_events: AuditLogEntry[];
  failed_actions: AuditLogEntry[];
  pending_approvals: number;
};

export async function getAuditTimeline(supabase: AuditRpcClient): Promise<AuditTimeline> {
  const { data, error } = await supabase.rpc("get_audit_accountability_dashboard");
  if (error) throw new Error(error.message);
  const dashboard = data as Record<string, unknown>;
  return {
    recent_activity: (dashboard.recent_activity as AuditLogEntry[]) ?? [],
    ai_activity_timeline: (dashboard.ai_activity_timeline as AuditLogEntry[]) ?? [],
    security_events: (dashboard.security_events as AuditLogEntry[]) ?? [],
    failed_actions: (dashboard.failed_actions as AuditLogEntry[]) ?? [],
    pending_approvals: (dashboard.pending_approvals as number) ?? 0,
  };
}

export async function exportAuditLogs(
  supabase: AuditRpcClient,
  format: AuditExportFormat,
  filters: AuditSearchFilters = {}
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("export_audit_logs", {
    p_format: format,
    p_filters: filters,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
