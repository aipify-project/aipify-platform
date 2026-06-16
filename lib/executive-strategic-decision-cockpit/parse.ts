import type {
  ConfidenceLevel,
  CrossOrganizationalInsights,
  DecisionHistoryEntry,
  DecisionQueueItem,
  DecisionUrgency,
  ExecutiveAlert,
  ExecutiveBriefing,
  ExecutiveBriefingDetail,
  ExecutiveOverview,
  ExecutiveStrategicDecisionCockpit,
  HealthIndicator,
  LearningInsights,
  MeetingMode,
  OrgHealthStatus,
  OpportunityType,
  StrategicOpportunity,
} from "./types";

const URGENCIES = new Set<DecisionUrgency>(["critical", "high_priority", "medium_priority", "informational"]);
const HEALTH = new Set<OrgHealthStatus>(["excellent", "healthy", "monitor_closely", "needs_attention", "critical"]);
const CONFIDENCE = new Set<ConfidenceLevel>(["very_low", "low", "moderate", "high", "very_high"]);
const OPP_TYPES = new Set<OpportunityType>(["revenue", "cost_optimization", "partnership", "process_improvement", "expansion", "innovation"]);

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function num(v: unknown, fb = 0): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fb;
}

function bool(v: unknown): boolean {
  return v === true;
}

function parseDecisionItem(raw: unknown): DecisionQueueItem | null {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;
  const u = str(d.urgency, "medium_priority");
  return {
    id: str(d.id),
    title: str(d.title),
    description: str(d.description),
    urgency: URGENCIES.has(u as DecisionUrgency) ? (u as DecisionUrgency) : "medium_priority",
    owner: str(d.owner),
    required_approvers: Array.isArray(d.required_approvers) ? d.required_approvers.map((a) => str(a)) : [],
    strategic_impact: str(d.strategic_impact),
    risk_level: str(d.risk_level, "low") as DecisionQueueItem["risk_level"],
    status: str(d.status),
    deadline: str(d.deadline),
    recommended_next_step: str(d.recommended_next_step),
    confidence_score: num(d.confidence_score),
    category: str(d.category),
  };
}

function parseDecisions(raw: unknown): DecisionQueueItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(parseDecisionItem).filter((x): x is DecisionQueueItem => x !== null && Boolean(x.id));
}

function parseHealthIndicator(raw: unknown): HealthIndicator {
  if (!raw || typeof raw !== "object") return { score: 75, status: "healthy" };
  const d = raw as Record<string, unknown>;
  const st = str(d.status, "healthy");
  return {
    score: num(d.score, 75),
    status: HEALTH.has(st as OrgHealthStatus) ? (st as OrgHealthStatus) : "healthy",
  };
}

export function parseExecutiveStrategicDecisionCockpit(data: unknown): ExecutiveStrategicDecisionCockpit {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  if (!bool(d.found)) return { found: false };

  const ov = d.overview as Record<string, unknown> | undefined;
  const dq = d.decision_queue as Record<string, unknown> | undefined;
  const oh = d.organization_health as Record<string, unknown> | undefined;
  const mm = d.meeting_mode as Record<string, unknown> | undefined;
  const co = d.cross_organizational as Record<string, unknown> | undefined;
  const li = d.learning_insights as Record<string, unknown> | undefined;

  const orgStatus = str(ov?.organization_health_status, "healthy");

  const overview: ExecutiveOverview | undefined = ov
    ? {
        initiatives_on_track: num(ov.initiatives_on_track),
        initiatives_at_risk: num(ov.initiatives_at_risk),
        critical_decisions_pending: num(ov.critical_decisions_pending),
        high_impact_opportunities: num(ov.high_impact_opportunities),
        escalated_approvals: num(ov.escalated_approvals),
        organization_health_score: num(ov.organization_health_score, 85),
        organization_health_status: HEALTH.has(orgStatus as OrgHealthStatus)
          ? (orgStatus as OrgHealthStatus)
          : "healthy",
        executive_action_queue_count: num(ov.executive_action_queue_count),
      }
    : undefined;

  const meeting_mode: MeetingMode | undefined = mm
    ? {
        topics_for_discussion: Array.isArray(mm.topics_for_discussion)
          ? mm.topics_for_discussion.map((t) => {
              const row = t as Record<string, unknown>;
              return { title: str(row.title), reason: str(row.reason) };
            })
          : [],
        pending_approvals: Array.isArray(mm.pending_approvals)
          ? mm.pending_approvals.map((t) => {
              const row = t as Record<string, unknown>;
              return { id: str(row.id), title: str(row.title) };
            })
          : [],
        blocked_initiatives: Array.isArray(mm.blocked_initiatives)
          ? mm.blocked_initiatives.map((t) => {
              const row = t as Record<string, unknown>;
              return { id: str(row.id), title: str(row.title) };
            })
          : [],
        recent_achievements: Array.isArray(mm.recent_achievements)
          ? mm.recent_achievements.map((t) => {
              const row = t as Record<string, unknown>;
              return { id: str(row.id), title: str(row.title), completed_at: str(row.completed_at) };
            })
          : [],
        critical_risks: Array.isArray(mm.critical_risks)
          ? mm.critical_risks.map((t) => {
              const row = t as Record<string, unknown>;
              return { title: str(row.title), risk_level: str(row.risk_level) };
            })
          : [],
        suggested_agenda: Array.isArray(mm.suggested_agenda) ? mm.suggested_agenda.map((a) => str(a)) : [],
        follow_ups: Array.isArray(mm.follow_ups)
          ? mm.follow_ups.map((t) => {
              const row = t as Record<string, unknown>;
              return { title: str(row.title), created_at: str(row.created_at) };
            })
          : [],
      }
    : undefined;

  const cross_organizational: CrossOrganizationalInsights | undefined = co
    ? {
        departments: Array.isArray(co.departments)
          ? co.departments.map((dep) => {
              const row = dep as Record<string, unknown>;
              return {
                department: str(row.department),
                active_count: num(row.active_count),
                at_risk_count: num(row.at_risk_count),
              };
            })
          : [],
        strategic_initiatives: {
          on_track: num((co.strategic_initiatives as Record<string, unknown>)?.on_track),
          at_risk: num((co.strategic_initiatives as Record<string, unknown>)?.at_risk),
        },
        trends: Array.isArray(co.trends)
          ? co.trends.map((t) => {
              const row = t as Record<string, unknown>;
              return { label: str(row.label), direction: str(row.direction) };
            })
          : [],
        emerging_issues: Array.isArray(co.emerging_issues)
          ? co.emerging_issues.map((t) => {
              const row = t as Record<string, unknown>;
              return { title: str(row.title), issue: str(row.issue) };
            })
          : [],
      }
    : undefined;

  return {
    found: true,
    has_access: d.has_access !== undefined ? bool(d.has_access) : undefined,
    upgrade_required: bool(d.upgrade_required),
    overview,
    decision_queue: dq
      ? {
          critical: parseDecisions(dq.critical),
          high_priority: parseDecisions(dq.high_priority),
          medium_priority: parseDecisions(dq.medium_priority),
          informational: parseDecisions(dq.informational),
        }
      : undefined,
    organization_health: oh
      ? {
          operational_efficiency: parseHealthIndicator(oh.operational_efficiency),
          employee_engagement: parseHealthIndicator(oh.employee_engagement),
          customer_satisfaction: parseHealthIndicator(oh.customer_satisfaction),
          revenue_momentum: parseHealthIndicator(oh.revenue_momentum),
          risk_exposure: parseHealthIndicator(oh.risk_exposure),
          compliance_status: parseHealthIndicator(oh.compliance_status),
          strategic_execution: parseHealthIndicator(oh.strategic_execution),
        }
      : undefined,
    executive_alerts: Array.isArray(d.executive_alerts)
      ? d.executive_alerts.map((a) => {
          const row = a as Record<string, unknown>;
          return {
            id: str(row.id),
            type: str(row.type),
            title: str(row.title),
            message: str(row.message),
            priority: str(row.priority),
            action_id: str(row.action_id),
          };
        })
      : [],
    opportunities: Array.isArray(d.opportunities)
      ? d.opportunities.map((o) => {
          const row = o as Record<string, unknown>;
          const tp = str(row.type, "innovation");
          const cl = str(row.confidence_level, "moderate");
          return {
            id: str(row.id),
            title: str(row.title),
            type: OPP_TYPES.has(tp as OpportunityType) ? (tp as OpportunityType) : "innovation",
            expected_benefit: str(row.expected_benefit),
            estimated_effort: str(row.estimated_effort),
            risk_assessment: str(row.risk_assessment),
            confidence_level: CONFIDENCE.has(cl as ConfidenceLevel) ? (cl as ConfidenceLevel) : "moderate",
            confidence_score: num(row.confidence_score),
          };
        })
      : [],
    meeting_mode,
    cross_organizational,
    decision_history: Array.isArray(d.decision_history)
      ? d.decision_history.map((h) => {
          const row = h as Record<string, unknown>;
          return {
            id: str(row.id),
            action_id: str(row.action_id),
            event_type: str(row.event_type),
            description: str(row.description),
            performed_by: str(row.performed_by),
            created_at: str(row.created_at),
            outcome: str(row.outcome),
          };
        })
      : [],
    learning_insights: li
      ? {
          decision_accuracy_estimate: num(li.decision_accuracy_estimate, 80),
          bottleneck_patterns: Array.isArray(li.bottleneck_patterns) ? li.bottleneck_patterns.map((b) => str(b)) : [],
          intervention_effectiveness: str(li.intervention_effectiveness),
          success_patterns: Array.isArray(li.success_patterns) ? li.success_patterns.map((s) => str(s)) : [],
        }
      : undefined,
    principle: str(d.principle),
  };
}

export function parseExecutiveBriefingDetail(data: unknown): ExecutiveBriefingDetail {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  if (!bool(d.found)) return { found: false };

  const b = d.briefing as Record<string, unknown> | undefined;
  const urg = str(b?.decision_urgency, "medium_priority");
  const cl = str(b?.confidence_level, "moderate");

  const briefing: ExecutiveBriefing | undefined = b
    ? {
        situation: str(b.situation),
        context: str(b.context),
        recommendation: str(b.recommendation),
        benefits: str(b.benefits),
        risks: str(b.risks),
        alternatives: Array.isArray(b.alternatives) ? b.alternatives.map((a) => str(a)) : [],
        recommended_actions: Array.isArray(b.recommended_actions) ? b.recommended_actions.map((a) => str(a)) : [],
        confidence_score: num(b.confidence_score, 75),
        confidence_level: CONFIDENCE.has(cl as ConfidenceLevel) ? (cl as ConfidenceLevel) : "moderate",
        decision_urgency: URGENCIES.has(urg as DecisionUrgency) ? (urg as DecisionUrgency) : "medium_priority",
      }
    : undefined;

  return {
    found: true,
    action_id: str(d.action_id),
    title: str(d.title),
    briefing,
    principle: str(d.principle),
  };
}
