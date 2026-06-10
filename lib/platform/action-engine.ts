export type ActionRiskLevel = "low" | "medium" | "high" | "critical";

export type ActionStatus =
  | "pending_approval"
  | "approved"
  | "executing"
  | "success"
  | "partial_success"
  | "failed"
  | "rolled_back"
  | "verification_pending"
  | "rejected"
  | "cancelled";

export type PlatformAction = {
  id: string;
  action_key: string;
  title: string;
  reason_generated: string;
  recommended_by: string;
  environment_type: string;
  tenant_id: string | null;
  customer_name: string | null;
  risk_level: ActionRiskLevel;
  status: ActionStatus;
  approval_status: string;
  prepared_steps: string[];
  preview_changes: string[];
  expected_outcome: string | null;
  expected_impact: string | null;
  estimated_execution_ms: number;
  rollback_available: boolean;
  rollback_state: Record<string, unknown> | null;
  rollback_instructions: string | null;
  approved_by: string | null;
  approved_at: string | null;
  executed_by: string | null;
  executed_at: string | null;
  verification_result: string | null;
  execution_duration_ms: number | null;
  created_at: string;
  updated_at: string;
};

export type ActionTemplate = {
  id: string;
  template_key: string;
  title: string;
  description: string | null;
  category: string;
  default_risk_level: ActionRiskLevel;
  prepared_steps: string[];
  expected_outcome: string | null;
  rollback_available: boolean;
};

export type ApprovalPolicy = {
  id: string;
  tenant_id: string | null;
  tenant_name: string;
  risk_level: ActionRiskLevel;
  policy_rule: string;
  auto_approve: boolean;
  approver_role: string | null;
  manual_only: boolean;
};

export type ActionExecutionLog = {
  id: string;
  action_id: string;
  action_title: string;
  event_type: string;
  actor_email: string | null;
  approver_email: string | null;
  executor_email: string | null;
  result: string | null;
  duration_ms: number | null;
  rollback_state: string | null;
  environment_type: string | null;
  tenant_id: string | null;
  created_at: string;
};

export type ActionCenterDashboard = {
  metrics: {
    pending: number;
    approved: number;
    executed: number;
    failed: number;
    executed_total: number;
    approvals_granted: number;
    rollbacks: number;
    hours_saved: number;
  };
  lifecycle: string[];
};

const RISK_STYLES: Record<ActionRiskLevel, string> = {
  low: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  medium: "bg-amber-50 text-amber-800 ring-amber-100",
  high: "bg-rose-50 text-rose-700 ring-rose-100",
  critical: "bg-red-950 text-red-100 ring-red-900",
};

const STATUS_STYLES: Record<string, string> = {
  pending_approval: "bg-amber-50 text-amber-700",
  approved: "bg-blue-50 text-blue-700",
  executing: "bg-violet-50 text-violet-700",
  success: "bg-emerald-50 text-emerald-700",
  partial_success: "bg-sky-50 text-sky-700",
  failed: "bg-rose-50 text-rose-700",
  rolled_back: "bg-gray-50 text-gray-700",
  verification_pending: "bg-violet-50 text-violet-700",
  rejected: "bg-gray-50 text-gray-600",
};

function parseStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

function parseAction(raw: Record<string, unknown>): PlatformAction {
  return {
    id: String(raw.id),
    action_key: String(raw.action_key ?? ""),
    title: String(raw.title ?? ""),
    reason_generated: String(raw.reason_generated ?? ""),
    recommended_by: String(raw.recommended_by ?? ""),
    environment_type: String(raw.environment_type ?? "internal"),
    tenant_id: raw.tenant_id != null ? String(raw.tenant_id) : null,
    customer_name: raw.customer_name != null ? String(raw.customer_name) : null,
    risk_level: (raw.risk_level as ActionRiskLevel) ?? "medium",
    status: (raw.status as ActionStatus) ?? "pending_approval",
    approval_status: String(raw.approval_status ?? "pending"),
    prepared_steps: parseStringArray(raw.prepared_steps),
    preview_changes: parseStringArray(raw.preview_changes),
    expected_outcome: raw.expected_outcome != null ? String(raw.expected_outcome) : null,
    expected_impact: raw.expected_impact != null ? String(raw.expected_impact) : null,
    estimated_execution_ms: Number(raw.estimated_execution_ms ?? 0),
    rollback_available: Boolean(raw.rollback_available),
    rollback_state:
      raw.rollback_state && typeof raw.rollback_state === "object"
        ? (raw.rollback_state as Record<string, unknown>)
        : null,
    rollback_instructions:
      raw.rollback_instructions != null ? String(raw.rollback_instructions) : null,
    approved_by: raw.approved_by != null ? String(raw.approved_by) : null,
    approved_at: raw.approved_at != null ? String(raw.approved_at) : null,
    executed_by: raw.executed_by != null ? String(raw.executed_by) : null,
    executed_at: raw.executed_at != null ? String(raw.executed_at) : null,
    verification_result:
      raw.verification_result != null ? String(raw.verification_result) : null,
    execution_duration_ms:
      raw.execution_duration_ms != null ? Number(raw.execution_duration_ms) : null,
    created_at: String(raw.created_at ?? ""),
    updated_at: String(raw.updated_at ?? ""),
  };
}

export function getActionRiskStyle(level: ActionRiskLevel): string {
  return RISK_STYLES[level] ?? RISK_STYLES.medium;
}

export function getActionStatusStyle(status: string): string {
  return STATUS_STYLES[status] ?? STATUS_STYLES.pending_approval;
}

export function parseActionCenterDashboard(data: unknown): ActionCenterDashboard {
  const raw = (data ?? {}) as Record<string, unknown>;
  const metrics = (raw.metrics ?? {}) as Record<string, number>;
  return {
    metrics: {
      pending: metrics.pending ?? 0,
      approved: metrics.approved ?? 0,
      executed: metrics.executed ?? 0,
      failed: metrics.failed ?? 0,
      executed_total: metrics.executed_total ?? 0,
      approvals_granted: metrics.approvals_granted ?? 0,
      rollbacks: metrics.rollbacks ?? 0,
      hours_saved: Number(metrics.hours_saved ?? 0),
    },
    lifecycle: Array.isArray(raw.lifecycle) ? (raw.lifecycle as string[]) : [],
  };
}

export function parsePlatformActions(data: unknown): PlatformAction[] {
  if (!Array.isArray(data)) return [];
  return data.map((item) => parseAction(item as Record<string, unknown>));
}

export function parseActionTemplates(data: unknown): ActionTemplate[] {
  if (!Array.isArray(data)) return [];
  return data.map((item) => {
    const raw = item as Record<string, unknown>;
    return {
      id: String(raw.id),
      template_key: String(raw.template_key ?? ""),
      title: String(raw.title ?? ""),
      description: raw.description != null ? String(raw.description) : null,
      category: String(raw.category ?? ""),
      default_risk_level: (raw.default_risk_level as ActionRiskLevel) ?? "low",
      prepared_steps: parseStringArray(raw.prepared_steps),
      expected_outcome: raw.expected_outcome != null ? String(raw.expected_outcome) : null,
      rollback_available: Boolean(raw.rollback_available),
    };
  });
}

export function parseApprovalPolicies(data: unknown): ApprovalPolicy[] {
  if (!Array.isArray(data)) return [];
  return data as ApprovalPolicy[];
}

export function parseActionExecutionLogs(data: unknown): ActionExecutionLog[] {
  if (!Array.isArray(data)) return [];
  return data as ActionExecutionLog[];
}

export function formatExecutionTime(ms: number): string {
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(1)} s`;
}
