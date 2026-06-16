import type {
  AttentionQueueItem,
  ConfidenceLevel,
  EscalationRule,
  HealthForecast,
  OrganizationalEarlyWarningCenter,
  PositiveOpportunity,
  PredictiveTrend,
  SignalBriefing,
  SignalBriefingDetail,
  WarningCategory,
  WarningSeverity,
  WarningSignal,
} from "./types";

const CATEGORIES = new Set<WarningCategory>([
  "operational_risk", "financial_risk", "customer_risk", "employee_risk",
  "compliance_risk", "strategic_execution_risk", "partner_risk", "capacity_risk",
]);
const SEVERITIES = new Set<WarningSeverity>([
  "informational", "monitor", "elevated_concern", "high_risk", "critical_attention_required",
]);
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

function parseWarning(raw: unknown): WarningSignal | null {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;
  const cat = str(d.category, "operational_risk");
  const sev = str(d.severity, "monitor");
  const cl = str(d.confidence_level, "moderate");
  return {
    id: str(d.id),
    title: str(d.title),
    description: str(d.description),
    signal_type: str(d.signal_type),
    category: CATEGORIES.has(cat as WarningCategory) ? (cat as WarningCategory) : "operational_risk",
    severity: SEVERITIES.has(sev as WarningSeverity) ? (sev as WarningSeverity) : "monitor",
    severity_explanation: str(d.severity_explanation),
    reasoning: str(d.reasoning),
    suggested_actions: Array.isArray(d.suggested_actions) ? d.suggested_actions.map((a) => str(a)) : [],
    confidence_score: num(d.confidence_score, 60),
    confidence_level: CONFIDENCE.has(cl as ConfidenceLevel) ? (cl as ConfidenceLevel) : "moderate",
    risk_level: str(d.risk_level),
    status: str(d.status),
    created_at: str(d.created_at),
  };
}

export function parseOrganizationalEarlyWarningCenter(data: unknown): OrganizationalEarlyWarningCenter {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  if (!bool(d.found)) return { found: false };

  const dash = d.dashboard as Record<string, unknown> | undefined;
  const fc = d.forecasts as Record<string, unknown> | undefined;
  const li = d.learning_insights as Record<string, unknown> | undefined;

  return {
    found: true,
    has_access: d.has_access !== undefined ? bool(d.has_access) : undefined,
    upgrade_required: bool(d.upgrade_required),
    dashboard: dash
      ? {
          emerging_risks: num(dash.emerging_risks),
          escalating_bottlenecks: num(dash.escalating_bottlenecks),
          losing_momentum: num(dash.losing_momentum),
          team_overload_signals: num(dash.team_overload_signals),
          customer_deterioration_signals: num(dash.customer_deterioration_signals),
          compliance_warnings: num(dash.compliance_warnings),
          revenue_trend_warnings: num(dash.revenue_trend_warnings),
        }
      : undefined,
    warnings: Array.isArray(d.warnings)
      ? d.warnings.map(parseWarning).filter((x): x is WarningSignal => x !== null && Boolean(x.id))
      : [],
    predictive_trends: Array.isArray(d.predictive_trends)
      ? d.predictive_trends.map((t) => {
          const row = t as Record<string, unknown>;
          return {
            trend: str(row.trend),
            detected: bool(row.detected),
            count: num(row.count),
            direction: str(row.direction),
          } satisfies PredictiveTrend;
        })
      : [],
    forecasts: fc
      ? {
          disclaimer: str(fc.disclaimer),
          periods: Array.isArray(fc.periods)
            ? fc.periods.map((p) => {
                const row = p as Record<string, unknown>;
                return {
                  days: num(row.days),
                  health_score_estimate: num(row.health_score_estimate),
                  risk_level: str(row.risk_level),
                } satisfies HealthForecast;
              })
            : [],
          factors: Array.isArray(fc.factors) ? fc.factors.map((f) => str(f)) : [],
        }
      : undefined,
    opportunities: Array.isArray(d.opportunities)
      ? d.opportunities.map((o) => {
          const row = o as Record<string, unknown>;
          return {
            id: str(row.id),
            title: str(row.title),
            type: str(row.type),
            description: str(row.description),
            confidence_score: num(row.confidence_score),
          } satisfies PositiveOpportunity;
        })
      : [],
    escalation_rules: Array.isArray(d.escalation_rules)
      ? d.escalation_rules.map((r) => {
          const row = r as Record<string, unknown>;
          return {
            rule: str(row.rule),
            threshold: num(row.threshold),
            enabled: bool(row.enabled),
            description: str(row.description),
          } satisfies EscalationRule;
        })
      : [],
    attention_queue: Array.isArray(d.attention_queue)
      ? d.attention_queue.map((q) => {
          const row = q as Record<string, unknown>;
          return {
            id: str(row.id),
            title: str(row.title),
            urgency: str(row.urgency),
            impact: str(row.impact),
            confidence_score: num(row.confidence_score),
            confidence_level: str(row.confidence_level),
            review_timeline: str(row.review_timeline),
            stakeholder: str(row.stakeholder),
          } satisfies AttentionQueueItem;
        })
      : [],
    learning_insights: li
      ? {
          accuracy_estimate: num(li.accuracy_estimate, 75),
          false_positive_rate_estimate: num(li.false_positive_rate_estimate),
          response_effectiveness: str(li.response_effectiveness),
          forecast_reliability: str(li.forecast_reliability),
        }
      : undefined,
    principle: str(d.principle),
  };
}

export function parseSignalBriefingDetail(data: unknown): SignalBriefingDetail {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  if (!bool(d.found)) return { found: false };

  const b = d.briefing as Record<string, unknown> | undefined;
  const cl = str(b?.confidence_level, "moderate");

  const briefing: SignalBriefing | undefined = b
    ? {
        what_changed: str(b.what_changed),
        why_important: str(b.why_important),
        what_may_happen_next: str(b.what_may_happen_next),
        response_options: Array.isArray(b.response_options) ? b.response_options.map((o) => str(o)) : [],
        urgency_level: str(b.urgency_level),
        confidence_score: num(b.confidence_score, 65),
        confidence_level: CONFIDENCE.has(cl as ConfidenceLevel) ? (cl as ConfidenceLevel) : "moderate",
      }
    : undefined;

  return {
    found: true,
    signal_id: str(d.signal_id),
    title: str(d.title),
    briefing,
    principle: str(d.principle),
  };
}
