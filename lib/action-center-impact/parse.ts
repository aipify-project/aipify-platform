import type {
  ActionApprovalChain,
  ActionAuditPreview,
  ActionBusinessImpact,
  ActionConfidence,
  ActionImpactAnalysis,
  ActionImpactCategory,
  ActionImpactSummary,
  ActionPostExecution,
  ActionRelatedActions,
  ActionRiskAnalysis,
  ActionRollback,
  ActionTimelineStage,
  TimelineStageKey,
  TimelineStageStatus,
} from "./types";
import type { AipifyAction, RiskLevel } from "@/lib/aipify/execution/types";

const CATEGORIES = new Set<ActionImpactCategory>([
  "support",
  "automation",
  "billing",
  "installation",
  "governance",
  "customer",
  "growth_partner",
  "workflow_recovery",
]);

const TIMELINE_KEYS = new Set<TimelineStageKey>([
  "review",
  "approve",
  "execute",
  "verify",
  "monitor",
  "close",
]);

const TIMELINE_STATUS = new Set<TimelineStageStatus>([
  "pending",
  "current",
  "complete",
  "blocked",
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

function parseAction(raw: unknown): AipifyAction | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    id: str(d.id),
    action_type: str(d.action_type),
    title: str(d.title),
    description: str(d.description),
    preview_text: str(d.preview_text),
    payload_json: (d.payload_json as Record<string, unknown>) ?? {},
    risk_level: str(d.risk_level, "low") as RiskLevel,
    execution_level: str(d.execution_level, "assistant") as AipifyAction["execution_level"],
    status: str(d.status, "pending_approval") as AipifyAction["status"],
    requires_approval: bool(d.requires_approval),
    required_approvals: num(d.required_approvals, 1),
    approval_count: num(d.approval_count),
    estimated_impact: str(d.estimated_impact),
    created_by_module: str(d.created_by_module),
    scheduled_for: str(d.scheduled_for),
    executed_at: str(d.executed_at),
    failure_reason: str(d.failure_reason),
    rollback_available: bool(d.rollback_available),
    created_at: str(d.created_at),
  };
}

function parseSummary(raw: unknown): ActionImpactSummary | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  const category = str(d.category, "automation");
  return {
    title: str(d.title),
    status: str(d.status),
    recommended_by: str(d.recommended_by, "Aipify"),
    priority: str(d.priority, "medium"),
    category: CATEGORIES.has(category as ActionImpactCategory)
      ? (category as ActionImpactCategory)
      : "automation",
  };
}

function parseBusinessImpact(raw: unknown): ActionBusinessImpact | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    expected_benefits: str(d.expected_benefits),
    estimated_time_savings: str(d.estimated_time_savings),
    affected_teams: str(d.affected_teams),
    customer_impact: str(d.customer_impact),
  };
}

function parseRisk(raw: unknown): ActionRiskAnalysis | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    risk_level: str(d.risk_level, "low") as RiskLevel,
    potential_side_effects: str(d.potential_side_effects),
    mitigation_strategy: str(d.mitigation_strategy),
  };
}

function parseConfidence(raw: unknown): ActionConfidence | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    score: num(d.score, 85),
    reasoning_key: str(d.reasoning_key, "operating_conditions"),
  };
}

function parseRollback(raw: unknown): ActionRollback | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    available: bool(d.available),
    estimated_recovery_time: str(d.estimated_recovery_time),
    steps: str(d.steps),
  };
}

function parseApprovalChain(raw: unknown): ActionApprovalChain | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    requested_by: str(d.requested_by),
    requires_approval_from: str(d.requires_approval_from),
    escalation_path: str(d.escalation_path),
  };
}

function parseAuditPreview(raw: unknown): ActionAuditPreview | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    generates_records: bool(d.generates_records),
    records: Array.isArray(d.records) ? d.records.map((r) => str(r)) : [],
  };
}

function parseRelated(raw: unknown): ActionRelatedActions | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    similar_count: num(d.similar_count),
    similar_success_count: num(d.similar_success_count),
    average_success_rate: num(d.average_success_rate, 96),
  };
}

function parseTimeline(raw: unknown): ActionTimelineStage[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    const key = str(d.key, "review") as TimelineStageKey;
    const status = str(d.status, "pending") as TimelineStageStatus;
    return {
      key: TIMELINE_KEYS.has(key) ? key : "review",
      status: TIMELINE_STATUS.has(status) ? status : "pending",
    };
  });
}

function parsePostExecution(raw: unknown): ActionPostExecution | null {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;
  return {
    execution_result: str(d.execution_result),
    execution_time_seconds: num(d.execution_time_seconds, 18),
    unexpected_events: str(d.unexpected_events, "None"),
    business_outcome: str(d.business_outcome),
  };
}

export function parseActionImpactAnalysis(data: unknown): ActionImpactAnalysis | null {
  if (!data || typeof data !== "object") return null;
  const raw = data as Record<string, unknown>;
  if (!bool(raw.found)) return { found: false };

  const safetyRaw = raw.safety as Record<string, unknown> | undefined;

  return {
    found: true,
    action: parseAction(raw.action),
    summary: parseSummary(raw.summary),
    business_impact: parseBusinessImpact(raw.business_impact),
    risk_analysis: parseRisk(raw.risk_analysis),
    confidence: parseConfidence(raw.confidence),
    rollback: parseRollback(raw.rollback),
    affected_systems: Array.isArray(raw.affected_systems)
      ? raw.affected_systems.map((s) => str(s))
      : [],
    approval_chain: parseApprovalChain(raw.approval_chain),
    audit_preview: parseAuditPreview(raw.audit_preview),
    related_actions: parseRelated(raw.related_actions),
    execution_timeline: parseTimeline(raw.execution_timeline),
    post_execution: parsePostExecution(raw.post_execution),
    safety: safetyRaw
      ? {
          safe: bool(safetyRaw.safe),
          blocked: bool(safetyRaw.blocked),
          reason: safetyRaw.reason != null ? str(safetyRaw.reason) : null,
        }
      : undefined,
    logs: Array.isArray(raw.logs)
      ? raw.logs.map((log) => {
          const d = log as Record<string, unknown>;
          return {
            id: str(d.id),
            event_type: str(d.event_type),
            event_description: str(d.event_description),
            performed_by: str(d.performed_by),
            created_at: str(d.created_at),
          };
        })
      : [],
    principle: str(raw.principle),
  };
}
