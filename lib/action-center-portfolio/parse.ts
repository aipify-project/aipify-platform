import type {
  ConfidenceLevel,
  InitiativeCategory,
  InitiativeDetail,
  InitiativeItem,
  InitiativePriority,
  PortfolioHealth,
  StrategicInitiativePortfolio,
} from "./types";
import type { RiskLevel } from "@/lib/aipify/execution/types";

const CATEGORIES = new Set<InitiativeCategory>([
  "revenue_growth", "customer_experience", "operational_efficiency", "compliance",
  "risk_reduction", "product_development", "employee_experience", "market_expansion",
  "cost_optimization", "innovation",
]);

const HEALTH = new Set<PortfolioHealth>(["on_track", "at_risk", "blocked", "overdue", "completed"]);
const PRIORITIES = new Set<InitiativePriority>(["critical", "high", "medium", "low", "optional"]);
const CONFIDENCE = new Set<ConfidenceLevel>(["very_low", "low", "moderate", "high", "very_high"]);

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function num(v: unknown, fb = 0): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fb;
}

function bool(v: unknown): boolean {
  return v === true;
}

function parseItem(raw: unknown): InitiativeItem | null {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;
  const cat = str(d.category, "operational_efficiency");
  const health = str(d.portfolio_health, "on_track");
  const pri = str(d.priority, "medium");
  const conf = str(d.confidence_level, "moderate");
  return {
    id: str(d.id),
    title: str(d.title),
    description: str(d.description),
    category: CATEGORIES.has(cat as InitiativeCategory) ? (cat as InitiativeCategory) : "operational_efficiency",
    status: str(d.status),
    portfolio_health: HEALTH.has(health as PortfolioHealth) ? (health as PortfolioHealth) : "on_track",
    lifecycle_stage: str(d.lifecycle_stage),
    priority: PRIORITIES.has(pri as InitiativePriority) ? (pri as InitiativePriority) : "medium",
    risk_level: str(d.risk_level, "low") as RiskLevel,
    alignment_score: num(d.alignment_score),
    confidence_score: num(d.confidence_score),
    confidence_level: CONFIDENCE.has(conf as ConfidenceLevel) ? (conf as ConfidenceLevel) : "moderate",
    expected_strategic_value: str(d.expected_strategic_value),
    owner: str(d.owner),
    executive_sponsor: d.executive_sponsor != null ? str(d.executive_sponsor) : null,
    department: str(d.department),
    business_goal: str(d.business_goal),
    created_at: str(d.created_at),
    scheduled_for: str(d.scheduled_for),
    executed_at: str(d.executed_at),
    requires_executive_decision: bool(d.requires_executive_decision),
  };
}

function parseItems(raw: unknown): InitiativeItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(parseItem).filter((x): x is InitiativeItem => x !== null && Boolean(x.id));
}

export function parseStrategicInitiativePortfolio(data: unknown): StrategicInitiativePortfolio {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  if (!bool(d.found)) return { found: false };

  const hs = d.portfolio_health_summary as Record<string, unknown> | undefined;
  const ep = d.executive_priority as Record<string, unknown> | undefined;
  const ra = d.risk_analysis as Record<string, unknown> | undefined;

  return {
    found: true,
    has_access: d.has_access !== undefined ? bool(d.has_access) : undefined,
    upgrade_required: bool(d.upgrade_required),
    portfolio_health_summary: hs
      ? {
          on_track: num(hs.on_track),
          at_risk: num(hs.at_risk),
          blocked: num(hs.blocked),
          overdue: num(hs.overdue),
          completed: num(hs.completed),
        }
      : undefined,
    executive_priority: ep
      ? {
          top_strategic: parseItems(ep.top_strategic),
          highest_risk: parseItems(ep.highest_risk),
          highest_value: parseItems(ep.highest_value),
          most_delayed: parseItems(ep.most_delayed),
          executive_decisions: parseItems(ep.executive_decisions),
        }
      : undefined,
    risk_analysis: ra
      ? {
          high_risk_concentration: num(ra.high_risk_concentration),
          unresolved_blockers: num(ra.unresolved_blockers),
          missing_owners: num(ra.missing_owners),
          unclear_outcomes: num(ra.unclear_outcomes),
          low_confidence: num(ra.low_confidence),
        }
      : undefined,
    active: parseItems(d.active),
    awaiting_approval: parseItems(d.awaiting_approval),
    in_execution: parseItems(d.in_execution),
    blocked: parseItems(d.blocked),
    completed: parseItems(d.completed),
    cancelled: parseItems(d.cancelled),
    executive_priority_list: parseItems(d.executive_priority_list),
    principle: str(d.principle),
  };
}

export function parseInitiativeDetail(data: unknown): InitiativeDetail {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  if (!bool(d.found)) return { found: false };

  const sa = d.strategic_alignment as Record<string, unknown> | undefined;
  const tl = d.timeline as Record<string, unknown> | undefined;
  const ra = d.resource_awareness as Record<string, unknown> | undefined;
  const ds = d.decision_support as Record<string, unknown> | undefined;
  const pr = d.portfolio_risk as Record<string, unknown> | undefined;
  const health = str(d.portfolio_health, "on_track");

  const confLevel = str(sa?.confidence_level, "moderate");

  return {
    found: true,
    initiative: parseItem(d.initiative) ?? undefined,
    portfolio_health: HEALTH.has(health as PortfolioHealth) ? (health as PortfolioHealth) : "on_track",
    strategic_alignment: sa
      ? {
          business_goal: str(sa.business_goal),
          department: str(sa.department),
          executive_sponsor: sa.executive_sponsor != null ? str(sa.executive_sponsor) : null,
          alignment_score: num(sa.alignment_score),
          expected_strategic_value: str(sa.expected_strategic_value),
          confidence_level: CONFIDENCE.has(confLevel as ConfidenceLevel)
            ? (confLevel as ConfidenceLevel)
            : "moderate",
          confidence_score: num(sa.confidence_score, 75),
        }
      : undefined,
    timeline: tl
      ? {
          planned_start: str(tl.planned_start),
          actual_start: str(tl.actual_start),
          estimated_completion: str(tl.estimated_completion),
          actual_completion: str(tl.actual_completion),
          schedule_deviation_hours: num(tl.schedule_deviation_hours),
        }
      : undefined,
    expected_outcome: str(d.expected_outcome),
    actual_outcome: d.actual_outcome != null ? str(d.actual_outcome) : null,
    linked_actions: Array.isArray(d.linked_actions)
      ? d.linked_actions.map((a) => {
          const row = a as Record<string, unknown>;
          return {
            id: str(row.id),
            title: str(row.title),
            status: str(row.status),
            relationship: str(row.relationship, "primary"),
          };
        })
      : [],
    linked_approvals: Array.isArray(d.linked_approvals) ? (d.linked_approvals as Array<Record<string, unknown>>) : [],
    linked_risks: Array.isArray(d.linked_risks)
      ? d.linked_risks.map((r) => {
          const row = r as Record<string, unknown>;
          return { key: str(row.key), label: str(row.label), level: str(row.level) };
        })
      : [],
    linked_dependencies: Array.isArray(d.linked_dependencies)
      ? d.linked_dependencies.map((dep) => {
          const row = dep as Record<string, unknown>;
          return {
            id: str(row.id),
            type: str(row.type, "action"),
            label: str(row.label),
            status: str(row.status),
            resolved: bool(row.resolved),
          };
        })
      : [],
    resource_awareness: ra
      ? {
          required_teams: Array.isArray(ra.required_teams) ? ra.required_teams.map((t) => str(t)) : [],
          required_roles: Array.isArray(ra.required_roles) ? ra.required_roles.map((r) => str(r)) : [],
          estimated_workload: str(ra.estimated_workload, "moderate"),
          capacity_concerns: Array.isArray(ra.capacity_concerns) ? ra.capacity_concerns.map((c) => str(c)) : [],
          overloaded_owners: Array.isArray(ra.overloaded_owners) ? ra.overloaded_owners.map((o) => str(o)) : [],
        }
      : undefined,
    decision_support: ds
      ? {
          why_it_matters: str(ds.why_it_matters),
          if_succeeds: str(ds.if_succeeds),
          if_fails: str(ds.if_fails),
          if_delayed: str(ds.if_delayed),
          who_involved: Array.isArray(ds.who_involved) ? ds.who_involved.map((w) => str(w)).filter(Boolean) : [],
          decision_needed_now: str(ds.decision_needed_now),
        }
      : undefined,
    portfolio_risk: pr
      ? {
          has_unresolved_blockers: bool(pr.has_unresolved_blockers),
          missing_owner: bool(pr.missing_owner),
          unclear_outcome: bool(pr.unclear_outcome),
          low_confidence: bool(pr.low_confidence),
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
            created_at: str(row.created_at),
          };
        })
      : [],
    principle: str(d.principle),
  };
}
