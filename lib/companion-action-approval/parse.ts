import type { CompanionActionCenter, CompanionActionRequest } from "./types";

export type ApprovalActionSource = "trust" | "companion";

export function resolveApprovalPostRequest(
  source: ApprovalActionSource,
  actionId: string,
  decision: "approve" | "reject",
): { url: string; init: RequestInit } {
  if (source === "companion") {
    return {
      url: "/api/companion/actions/action",
      init: {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: decision, action_id: actionId }),
      },
    };
  }

  if (decision === "reject") {
    return {
      url: `/api/actions/${actionId}/reject`,
      init: {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      },
    };
  }

  return {
    url: `/api/actions/${actionId}/approve`,
    init: { method: "POST" },
  };
}

export function dedupeCompanionPendingById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const id = item.id.trim();
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

export type CompanionPendingDisplayFields = {
  id: string;
  title: string;
  description: string;
  status: string;
  expiresAt: string;
  category: string;
};

const COMPANION_DISPLAY_FIELD_KEYS = [
  "id",
  "title",
  "description",
  "status",
  "expiresAt",
  "category",
] as const;

export function buildCompanionPendingDisplayFields(
  action: CompanionActionRequest,
): CompanionPendingDisplayFields {
  return {
    id: action.id,
    title: action.title,
    description: action.description || action.reason,
    status: action.approval_status || action.lifecycle_status,
    expiresAt: action.expires_at,
    category: action.category,
  };
}

export function companionDisplayFieldsExcludeSensitivePayload(
  display: CompanionPendingDisplayFields,
): boolean {
  const serialized = JSON.stringify(display);
  const forbidden = [
    "metadata",
    "payload",
    "payload_hash",
    "case_id",
    "assignee_user_id",
    "idempotency_key",
    "support_write",
  ];
  if (forbidden.some((token) => serialized.includes(token))) {
    return false;
  }
  return COMPANION_DISPLAY_FIELD_KEYS.every((key) => key in display);
}

export type TrustApprovalsLoadOutcome = {
  kind: "success" | "error";
  error: string | null;
};

export type CompanionActionsLoadOutcome = {
  kind: "success" | "error" | "no_access";
  error: string | null;
  actions: CompanionActionRequest[];
  emergencyStop: boolean;
};

export function resolveTrustApprovalsLoadOutcome(input: {
  responseOk: boolean;
  payload: Record<string, unknown> & { error?: string };
  fallbackError: string;
}): TrustApprovalsLoadOutcome {
  if (!input.responseOk) {
    return {
      kind: "error",
      error:
        typeof input.payload.error === "string" ? input.payload.error : input.fallbackError,
    };
  }
  return { kind: "success", error: null };
}

export function resolveCompanionActionsLoadOutcome(input: {
  responseOk: boolean;
  payload: unknown;
  fallbackError: string;
}): CompanionActionsLoadOutcome {
  if (!input.responseOk) {
    const row =
      input.payload && typeof input.payload === "object"
        ? (input.payload as Record<string, unknown>)
        : {};
    return {
      kind: "error",
      error: typeof row.error === "string" ? row.error : input.fallbackError,
      actions: [],
      emergencyStop: false,
    };
  }

  const center = parseCompanionActionCenter(input.payload);
  if (!center?.has_access) {
    return {
      kind: "no_access",
      error: null,
      actions: [],
      emergencyStop: false,
    };
  }

  return {
    kind: "success",
    error: null,
    actions: dedupeCompanionPendingById(center.pending_actions),
    emergencyStop: center.emergency_stop_active,
  };
}

export function shouldShowApprovalsEmptyState(params: {
  loading: boolean;
  error: string | null;
  itemCount: number;
}): boolean {
  return !params.loading && params.error === null && params.itemCount === 0;
}

export async function runIndependentApprovalLoads(loaders: {
  trust: () => Promise<void>;
  companion: () => Promise<void>;
}): Promise<[PromiseSettledResult<void>, PromiseSettledResult<void>]> {
  return Promise.allSettled([loaders.trust(), loaders.companion()]);
}

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function num(value: unknown, fallback = 0): number {
  return typeof value === "number" ? value : Number(value ?? fallback) || fallback;
}

function bool(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

export function parseCompanionActionCenter(data: unknown): CompanionActionCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (!row.has_access) return null;

  const limits = (row.limits ?? {}) as Record<string, unknown>;
  const safety = (row.safety_center ?? {}) as Record<string, unknown>;

  return {
    has_access: true,
    positioning: str(row.positioning),
    execution_enabled: bool(row.execution_enabled, true),
    emergency_stop_active: bool(row.emergency_stop_active),
    automation_disabled: bool(row.automation_disabled),
    limits: {
      daily_action_limit: num(limits.daily_action_limit, 100),
      max_risk_level: str(limits.max_risk_level, "high"),
      business_hours_only: bool(limits.business_hours_only),
      approval_threshold: str(limits.approval_threshold, "medium"),
    },
    pending_actions: Array.isArray(row.pending_actions)
      ? (row.pending_actions as Record<string, unknown>[]).map((item) => ({
          id: str(item.id),
          title: str(item.title),
          description: str(item.description),
          reason: str(item.reason),
          risk_level: str(item.risk_level),
          category: str(item.category),
          requested_for: str(item.requested_for),
          approval_status: str(item.approval_status),
          lifecycle_status: str(item.lifecycle_status),
          expires_at: str(item.expires_at),
          expected_outcome: str(item.expected_outcome),
        }))
      : [],
    execution_queue: Array.isArray(row.execution_queue)
      ? (row.execution_queue as Record<string, unknown>[]).map((item) => ({
          id: str(item.id),
          action_request_id: str(item.action_request_id),
          queue_status: str(item.queue_status),
          title: str(item.title),
          queued_at: str(item.queued_at),
        }))
      : [],
    action_history: Array.isArray(row.action_history)
      ? (row.action_history as Record<string, unknown>[]).map((item) => ({
          id: str(item.id),
          title: str(item.title),
          risk_level: str(item.risk_level),
          category: str(item.category),
          lifecycle_status: str(item.lifecycle_status),
          execution_status: str(item.execution_status),
          created_at: str(item.created_at),
        }))
      : [],
    policies: Array.isArray(row.policies)
      ? (row.policies as Record<string, unknown>[]).map((item) => ({
          id: str(item.id),
          policy_key: str(item.policy_key),
          policy_label: str(item.policy_label),
          category: str(item.category),
          allowed: bool(item.allowed, true),
          requires_approval: bool(item.requires_approval, true),
          prohibited: bool(item.prohibited),
          auto_approve_low_risk: bool(item.auto_approve_low_risk),
          workflow_type: str(item.workflow_type, "single"),
        }))
      : [],
    safety_center: {
      blocked_actions: Array.isArray(safety.blocked_actions)
        ? (safety.blocked_actions as Record<string, unknown>[]).map((item) => ({
            title: str(item.title),
            reason: str(item.reason),
          }))
        : [],
      failed_actions: Array.isArray(safety.failed_actions)
        ? (safety.failed_actions as Record<string, unknown>[]).map((item) => ({
            id: str(item.id),
            title: str(item.title),
          }))
        : [],
      risk_alerts: Array.isArray(safety.risk_alerts)
        ? (safety.risk_alerts as Record<string, unknown>[]).map((item) => ({
            title: str(item.title),
            risk_level: str(item.risk_level),
          }))
        : [],
    },
    receipts: Array.isArray(row.receipts)
      ? (row.receipts as Record<string, unknown>[]).map((item) => ({
          id: str(item.id),
          action_request_id: str(item.action_request_id),
          result_summary: str(item.result_summary),
          duration_ms: num(item.duration_ms),
          audit_reference: str(item.audit_reference),
          created_at: str(item.created_at),
          title: str(item.title),
        }))
      : [],
    audit_logs: Array.isArray(row.audit_logs)
      ? (row.audit_logs as Record<string, unknown>[]).map((item) => ({
          id: str(item.id),
          event_type: str(item.event_type),
          summary: str(item.summary),
          created_at: str(item.created_at),
        }))
      : [],
    cross_link_trust_approvals: str(row.cross_link_trust_approvals, "/app/approvals"),
    confirmation_examples: Array.isArray(row.confirmation_examples)
      ? row.confirmation_examples.map(String)
      : [],
  };
}

export function riskBadgeClass(level: string): string {
  const map: Record<string, string> = {
    low: "bg-emerald-100 text-emerald-900",
    medium: "bg-amber-100 text-amber-900",
    high: "bg-orange-100 text-orange-900",
    critical: "bg-rose-100 text-rose-900",
  };
  return map[level] ?? "bg-slate-100 text-slate-700";
}
