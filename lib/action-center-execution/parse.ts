import type {
  ConfidenceLevel,
  ExecutionActionItem,
  ExecutionBlocker,
  ExecutionCoordinationCenter,
  ExecutionDependency,
  ExecutionDetail,
  ExecutionLifecycleStage,
  ExecutionPriority,
  LifecycleStepStatus,
  BlockerCategory,
  DependencyStatus,
} from "./types";
import type { AipifyAction, RiskLevel } from "@/lib/aipify/execution/types";

const LIFECYCLE_STAGES = new Set<ExecutionLifecycleStage>([
  "recommended", "under_review", "approved", "assigned", "in_progress",
  "waiting", "blocked", "completed", "cancelled",
]);

const PRIORITIES = new Set<ExecutionPriority>(["critical", "high", "medium", "low", "optional"]);

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function num(v: unknown, fb = 0): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fb;
}

function bool(v: unknown): boolean {
  return v === true;
}

function scoreToLevel(score: number): ConfidenceLevel {
  if (score >= 90) return "very_high";
  if (score >= 75) return "high";
  if (score >= 60) return "moderate";
  if (score >= 45) return "low";
  return "very_low";
}

function parseItem(raw: unknown): ExecutionActionItem | null {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;
  const pri = str(d.priority, "medium");
  const stage = str(d.lifecycle_stage, "approved");
  return {
    id: str(d.id),
    title: str(d.title),
    risk_level: str(d.risk_level, "low") as RiskLevel,
    status: str(d.status),
    lifecycle_stage: LIFECYCLE_STAGES.has(stage as ExecutionLifecycleStage)
      ? (stage as ExecutionLifecycleStage)
      : "approved",
    priority: PRIORITIES.has(pri as ExecutionPriority) ? (pri as ExecutionPriority) : "medium",
    scheduled_for: str(d.scheduled_for),
    created_at: str(d.created_at),
    executed_at: str(d.executed_at),
    failure_reason: str(d.failure_reason),
  };
}

function parseItems(raw: unknown): ExecutionActionItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(parseItem).filter((x): x is ExecutionActionItem => x !== null && Boolean(x.id));
}

export function parseExecutionCoordinationCenter(data: unknown): ExecutionCoordinationCenter {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  if (!bool(d.found)) return { found: false };
  const ex = d.executive_summary as Record<string, unknown> | undefined;
  return {
    found: true,
    has_access: d.has_access !== undefined ? bool(d.has_access) : undefined,
    upgrade_required: bool(d.upgrade_required),
    executive_summary: ex
      ? {
          execution_health_score: num(ex.execution_health_score, 85),
          completion_rate: num(ex.completion_rate),
          blocked_count: num(ex.blocked_count),
          overdue_count: num(ex.overdue_count),
          strategic_in_progress: num(ex.strategic_in_progress),
        }
      : undefined,
    starting_today: parseItems(d.starting_today),
    in_progress: parseItems(d.in_progress),
    blocked: parseItems(d.blocked),
    awaiting_dependencies: parseItems(d.awaiting_dependencies),
    upcoming_deadlines: parseItems(d.upcoming_deadlines),
    completed: parseItems(d.completed),
    executive_priority: parseItems(d.executive_priority),
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
    risk_level: str(d.risk_level, "low") as RiskLevel,
    status: str(d.status, "approved") as AipifyAction["status"],
    estimated_impact: str(d.estimated_impact),
    created_by_module: str(d.created_by_module),
    created_at: str(d.created_at),
    scheduled_for: str(d.scheduled_for),
    executed_at: str(d.executed_at),
    approved_at: str(d.approved_at),
  } as AipifyAction & { approved_at?: string };
}

export function enrichExecutionDetail(detail: ExecutionDetail): ExecutionDetail {
  if (!detail.found || !detail.confidence) return detail;
  return {
    ...detail,
    confidence: {
      ...detail.confidence,
      level: scoreToLevel(detail.confidence.score),
    },
  };
}

export function parseExecutionDetail(data: unknown): ExecutionDetail {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  if (!bool(d.found)) return { found: false };

  const lc = d.lifecycle as Record<string, unknown> | undefined;
  const own = d.ownership as Record<string, unknown> | undefined;
  const tl = d.timeline as Record<string, unknown> | undefined;
  const conf = d.confidence as Record<string, unknown> | undefined;
  const pri = d.priority as Record<string, unknown> | undefined;
  const stage = str(lc?.current_stage, "approved");

  const base: ExecutionDetail = {
    found: true,
    action: parseAction(d.action),
    lifecycle: lc
      ? {
          current_stage: LIFECYCLE_STAGES.has(stage as ExecutionLifecycleStage)
            ? (stage as ExecutionLifecycleStage)
            : "approved",
          stages: Array.isArray(lc.stages)
            ? lc.stages.map((s) => {
                const row = s as Record<string, unknown>;
                const key = str(row.key, "approved") as ExecutionLifecycleStage;
                const st = str(row.status, "pending") as LifecycleStepStatus;
                return {
                  key: LIFECYCLE_STAGES.has(key) ? key : "approved",
                  status: st,
                };
              })
            : [],
        }
      : undefined,
    ownership: own
      ? {
          primary_owner: str(own.primary_owner, "Operations Lead"),
          secondary_owner: str(own.secondary_owner),
          contributors: Array.isArray(own.contributors) ? own.contributors.map((c) => str(c)) : [],
          executive_sponsor: own.executive_sponsor != null ? str(own.executive_sponsor) : null,
          history: Array.isArray(own.history) ? (own.history as Array<Record<string, unknown>>) : [],
        }
      : undefined,
    dependencies: Array.isArray(d.dependencies)
      ? d.dependencies.map((dep) => {
          const row = dep as Record<string, unknown>;
          return {
            id: str(row.id),
            type: str(row.type, "action"),
            label: str(row.label),
            status: str(row.status, "waiting_for_dependency") as DependencyStatus,
            resolved: bool(row.resolved),
          };
        })
      : [],
    blockers: Array.isArray(d.blockers)
      ? d.blockers.map((b) => {
          const row = b as Record<string, unknown>;
          const cat = str(row.category, "missing_information");
          return {
            id: str(row.id),
            category: cat as BlockerCategory,
            description: str(row.description),
            severity: str(row.severity, "medium"),
            owner: str(row.owner),
            resolution_plan: str(row.resolution_plan),
            target_date: str(row.target_date),
            resolved: bool(row.resolved),
            created_at: str(row.created_at),
          };
        })
      : [],
    priority: pri
      ? {
          level: PRIORITIES.has(str(pri.level) as ExecutionPriority)
            ? (str(pri.level) as ExecutionPriority)
            : "medium",
          factors: Array.isArray(pri.factors) ? pri.factors.map((f) => str(f)) : [],
        }
      : undefined,
    timeline: tl
      ? {
          planned_start: str(tl.planned_start),
          actual_start: str(tl.actual_start),
          estimated_completion: str(tl.estimated_completion),
          actual_completion: str(tl.actual_completion),
          milestones: Array.isArray(tl.milestones)
            ? tl.milestones.map((m) => {
                const row = m as Record<string, unknown>;
                return {
                  label: str(row.label),
                  achieved_at: str(row.achieved_at),
                  event_type: str(row.event_type),
                };
              })
            : [],
          schedule_deviation_hours: num(tl.schedule_deviation_hours),
        }
      : undefined,
    confidence: conf
      ? {
          score: num(conf.score, 75),
          level: "moderate",
          factors: Array.isArray(conf.factors) ? conf.factors.map((f) => str(f)) : [],
        }
      : undefined,
    collaboration_log: Array.isArray(d.collaboration_log)
      ? d.collaboration_log.map((log) => {
          const row = log as Record<string, unknown>;
          return {
            id: str(row.id),
            event_type: str(row.event_type),
            description: str(row.description),
            performed_by: str(row.performed_by),
            created_at: str(row.created_at),
          };
        })
      : [],
    audit_trail: Array.isArray(d.audit_trail)
      ? d.audit_trail.map((log) => {
          const row = log as Record<string, unknown>;
          return {
            id: str(row.id),
            event_type: str(row.event_type),
            event_description: str(row.event_description),
            performed_by: str(row.performed_by),
            created_at: str(row.created_at),
          };
        })
      : [],
    principle: str(d.principle),
  };

  return enrichExecutionDetail(base);
}
