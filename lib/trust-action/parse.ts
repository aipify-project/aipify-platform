import type {
  ActionAuditEntry,
  ActionRequest,
  SkillTrustScore,
  TrustActionsCenterBundle,
} from "./types";

export function parseActionRequest(raw: unknown): ActionRequest | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.id !== "string") return null;
  return {
    id: r.id,
    skill_id: typeof r.skill_id === "string" ? r.skill_id : null,
    skill_name: typeof r.skill_name === "string" ? r.skill_name : null,
    skill_key: typeof r.skill_key === "string" ? r.skill_key : null,
    action_name: String(r.action_name ?? ""),
    description: String(r.description ?? ""),
    risk_level: Number(r.risk_level ?? 1) as ActionRequest["risk_level"],
    resource_type: typeof r.resource_type === "string" ? r.resource_type : null,
    resource_id: typeof r.resource_id === "string" ? r.resource_id : null,
    status: String(r.status ?? "pending") as ActionRequest["status"],
    requested_by: typeof r.requested_by === "string" ? r.requested_by : null,
    approved_by: typeof r.approved_by === "string" ? r.approved_by : null,
    approved_at: typeof r.approved_at === "string" ? r.approved_at : null,
    executed_at: typeof r.executed_at === "string" ? r.executed_at : null,
    created_at: String(r.created_at ?? ""),
    explanation: typeof r.explanation === "string" ? r.explanation : null,
    confidence_score:
      typeof r.confidence_score === "number" ? r.confidence_score : null,
    undo_available: Boolean(r.undo_available),
    approver_role_required:
      typeof r.approver_role_required === "string" ? r.approver_role_required : null,
  };
}

export function parseActionRequests(data: unknown): ActionRequest[] {
  if (!Array.isArray(data)) return [];
  return data.map(parseActionRequest).filter((item): item is ActionRequest => item !== null);
}

export function parseTrustActionsCenter(data: unknown): TrustActionsCenterBundle {
  const raw = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(raw.has_customer),
    emergency_state: typeof raw.emergency_state === "string"
      ? (raw.emergency_state as TrustActionsCenterBundle["emergency_state"])
      : undefined,
    pending_approvals: parseActionRequests(raw.pending_approvals),
    executed_today: Number(raw.executed_today ?? 0),
    rejected_today: Number(raw.rejected_today ?? 0),
    highest_risk_pending: parseActionRequests(raw.highest_risk_pending),
    trust_scores: Array.isArray(raw.trust_scores)
      ? (raw.trust_scores as SkillTrustScore[])
      : [],
    recent_activity: Array.isArray(raw.recent_activity)
      ? (raw.recent_activity as ActionAuditEntry[])
      : [],
  };
}
