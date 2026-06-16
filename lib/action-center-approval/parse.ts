import type {
  ApprovalDelegationCenter,
  ApprovalDetail,
  ApprovalActionItem,
  ApprovalWorkflowType,
  DelegateRecommendation,
  SlaStatus,
} from "./types";
import type { AipifyAction, RiskLevel } from "@/lib/aipify/execution/types";

const WORKFLOW_TYPES = new Set<ApprovalWorkflowType>([
  "none",
  "single",
  "multi_step",
  "parallel",
  "executive",
]);

const SLA_STATUSES = new Set<SlaStatus>([
  "on_track",
  "approaching_deadline",
  "overdue",
  "escalated",
]);

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function num(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function bool(value: unknown): boolean {
  return value === true;
}

function parseActionItem(raw: unknown): ApprovalActionItem | null {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;
  const wf = str(d.workflow_type, "single");
  const sla = str(d.sla_status, "on_track");
  return {
    id: str(d.id),
    title: str(d.title),
    action_type: str(d.action_type),
    risk_level: str(d.risk_level, "low") as RiskLevel,
    status: str(d.status),
    preview_text: str(d.preview_text),
    estimated_impact: str(d.estimated_impact),
    created_at: str(d.created_at),
    required_approvals: num(d.required_approvals, 1),
    approval_count: num(d.approval_count),
    workflow_type: WORKFLOW_TYPES.has(wf as ApprovalWorkflowType)
      ? (wf as ApprovalWorkflowType)
      : "single",
    sla_status: SLA_STATUSES.has(sla as SlaStatus) ? (sla as SlaStatus) : "on_track",
    current_owner: str(d.current_owner),
    approved_at: str(d.approved_at),
    approved_by: str(d.approved_by),
    rejected_at: str(d.rejected_at),
    rejected_by: str(d.rejected_by),
    rejection_reason: str(d.rejection_reason),
  };
}

function parseItems(raw: unknown): ApprovalActionItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(parseActionItem).filter((x): x is ApprovalActionItem => x !== null && Boolean(x.id));
}

export function parseApprovalDelegationCenter(data: unknown): ApprovalDelegationCenter {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  if (!bool(d.found)) return { found: false };

  const execRaw = d.executive_summary as Record<string, unknown> | undefined;

  return {
    found: true,
    has_access: d.has_access !== undefined ? bool(d.has_access) : undefined,
    upgrade_required: bool(d.upgrade_required),
    user_role: str(d.user_role),
    settings: d.settings as ApprovalDelegationCenter["settings"],
    executive_summary: execRaw
      ? {
          approval_health_score: num(execRaw.approval_health_score, 85),
          critical_blocked: num(execRaw.critical_blocked),
          high_risk_awaiting: num(execRaw.high_risk_awaiting),
          avg_cycle_hours: num(execRaw.avg_cycle_hours),
          delegation_events_30d: num(execRaw.delegation_events_30d),
        }
      : undefined,
    pending_approvals: parseItems(d.pending_approvals),
    awaiting_my_review: parseItems(d.awaiting_my_review),
    recently_approved: parseItems(d.recently_approved),
    rejected: parseItems(d.rejected),
    escalated: parseItems(d.escalated),
    executive_decisions: parseItems(d.executive_decisions),
    permissions: Array.isArray(d.permissions)
      ? (d.permissions as Array<Record<string, unknown>>).map((p) => ({
          role_name: str(p.role_name),
          can_approve_actions: bool(p.can_approve_actions),
          max_risk_level: str(p.max_risk_level, "low"),
        }))
      : [],
    principle: str(d.principle),
  };
}

function parseAction(raw: unknown): AipifyAction | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    id: str(d.id),
    action_type: str(d.action_type),
    title: str(d.title),
    description: str(d.description),
    preview_text: str(d.preview_text),
    risk_level: str(d.risk_level, "low") as RiskLevel,
    execution_level: str(d.execution_level, "assistant") as AipifyAction["execution_level"],
    status: str(d.status, "pending_approval") as AipifyAction["status"],
    requires_approval: bool(d.requires_approval),
    required_approvals: num(d.required_approvals, 1),
    approval_count: num(d.approval_count),
    estimated_impact: str(d.estimated_impact),
    created_by_module: str(d.created_by_module),
    created_at: str(d.created_at),
    approved_by: str(d.approved_by),
    approved_at: str(d.approved_at),
    rejected_by: str(d.rejected_by),
    rejection_reason: str(d.rejection_reason),
  } as AipifyAction & { approved_by?: string; approved_at?: string; rejected_by?: string; rejection_reason?: string };
}

export function buildDelegateRecommendations(
  detail: ApprovalDetail,
  permissions: ApprovalDelegationCenter["permissions"]
): DelegateRecommendation[] {
  if (!detail.action) return [];
  const category = detail.action.action_type;
  const risk = detail.action.risk_level;
  const recs: DelegateRecommendation[] = [];

  const approvers = (permissions ?? []).filter((p) => p.can_approve_actions);
  for (const perm of approvers.slice(0, 3)) {
    let reason_key = "role_permissions";
    if (perm.role_name === "owner" || perm.role_name === "admin") reason_key = "department_responsibility";
    if (risk === "high" || risk === "critical") reason_key = "subject_matter_expertise";
    recs.push({ role_name: perm.role_name, reason_key, optional: true });
  }

  if (category.includes("support")) {
    recs.push({ role_name: "support", reason_key: "historical_ownership", optional: true });
  }
  if (recs.length === 0) {
    recs.push({ role_name: "admin", reason_key: "workload_balancing", optional: true });
  }

  const seen = new Set<string>();
  return recs.filter((r) => {
    if (seen.has(r.role_name)) return false;
    seen.add(r.role_name);
    return true;
  }).slice(0, 4);
}

export function enrichApprovalDetail(
  detail: ApprovalDetail,
  permissions?: ApprovalDelegationCenter["permissions"]
): ApprovalDetail {
  if (!detail.found) return detail;
  return {
    ...detail,
    delegate_recommendations: buildDelegateRecommendations(detail, permissions),
  };
}

export function parseApprovalDetail(data: unknown): ApprovalDetail {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  if (!bool(d.found)) return { found: false };

  const wfRaw = d.workflow as Record<string, unknown> | undefined;
  const delRaw = d.delegation as Record<string, unknown> | undefined;
  const slaRaw = d.sla as Record<string, unknown> | undefined;
  const wfType = str(wfRaw?.type, "single");

  const base: ApprovalDetail = {
    found: true,
    action: parseAction(d.action),
    workflow: wfRaw
      ? {
          type: WORKFLOW_TYPES.has(wfType as ApprovalWorkflowType)
            ? (wfType as ApprovalWorkflowType)
            : "single",
          steps_completed: num(wfRaw.steps_completed),
          steps_required: num(wfRaw.steps_required, 1),
          rules: Array.isArray(wfRaw.rules)
            ? wfRaw.rules.map((r) => {
                const row = r as Record<string, unknown>;
                return { key: str(row.key), label: str(row.label) };
              })
            : [],
        }
      : undefined,
    delegation: delRaw
      ? {
          current_owner: str(delRaw.current_owner, "Unassigned"),
          previous_owners: Array.isArray(delRaw.previous_owners)
            ? delRaw.previous_owners.map((o) => {
                const row = o as Record<string, unknown>;
                return {
                  owner: str(row.owner),
                  from_owner: str(row.from_owner),
                  performed_by: str(row.performed_by),
                  created_at: str(row.created_at),
                };
              })
            : [],
          history: Array.isArray(delRaw.history)
            ? delRaw.history.map((h) => {
                const row = h as Record<string, unknown>;
                return {
                  event_type: str(row.event_type),
                  description: str(row.description),
                  performed_by: str(row.performed_by),
                  metadata: row.metadata as Record<string, unknown> | undefined,
                  created_at: str(row.created_at),
                };
              })
            : [],
        }
      : undefined,
    sla: slaRaw
      ? {
          status: SLA_STATUSES.has(str(slaRaw.status) as SlaStatus)
            ? (str(slaRaw.status) as SlaStatus)
            : "on_track",
          hours_waiting: num(slaRaw.hours_waiting),
          escalated: bool(slaRaw.escalated),
          deadline_hours: num(slaRaw.deadline_hours, 72),
        }
      : undefined,
    audit_trail: Array.isArray(d.audit_trail)
      ? d.audit_trail.map((log) => {
          const row = log as Record<string, unknown>;
          return {
            id: str(row.id),
            event_type: str(row.event_type),
            event_description: str(row.event_description),
            performed_by: str(row.performed_by),
            metadata: row.metadata as Record<string, unknown> | undefined,
            created_at: str(row.created_at),
          };
        })
      : [],
    approvals: Array.isArray(d.approvals)
      ? d.approvals.map((a) => {
          const row = a as Record<string, unknown>;
          return { approved_by: str(row.approved_by), approved_at: str(row.approved_at) };
        })
      : [],
    principle: str(d.principle),
  };

  return base;
}
