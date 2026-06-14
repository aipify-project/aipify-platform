import type {
  DomainMetric,
  EventCorrelation,
  ExecutiveObservabilityView,
  Investigation,
  ObservabilityAlert,
  ObservabilityFeed,
  PlatformObservabilityCenter,
  ServiceSignal,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function parseDomainMetric(raw: unknown): DomainMetric {
  const row = asRecord(raw);
  return {
    metric_key: String(row.metric_key ?? ""),
    domain: String(row.domain ?? ""),
    label: String(row.label ?? ""),
    value_label: String(row.value_label ?? ""),
    trend: String(row.trend ?? "stable"),
    status: String(row.status ?? "healthy"),
  };
}

function parseServiceSignal(raw: unknown): ServiceSignal {
  const row = asRecord(raw);
  return {
    signal_key: String(row.signal_key ?? ""),
    service_name: String(row.service_name ?? ""),
    signal_type: String(row.signal_type ?? ""),
    availability_pct: Number(row.availability_pct ?? 0),
    status: String(row.status ?? "unknown"),
    last_checked_at: row.last_checked_at ? String(row.last_checked_at) : null,
  };
}

function parseAlert(raw: unknown): ObservabilityAlert {
  const row = asRecord(raw);
  return {
    alert_key: String(row.alert_key ?? ""),
    title: String(row.title ?? ""),
    message: String(row.message ?? ""),
    severity: String(row.severity ?? "informational"),
    status: String(row.status ?? "open"),
    domain: row.domain ? String(row.domain) : null,
    created_at: row.created_at ? String(row.created_at) : null,
  };
}

function parseCorrelation(raw: unknown): EventCorrelation {
  const row = asRecord(raw);
  return {
    correlation_key: String(row.correlation_key ?? ""),
    summary: String(row.summary ?? ""),
    confidence: String(row.confidence ?? "moderate"),
    systems_involved: Array.isArray(row.systems_involved)
      ? row.systems_involved.map(String)
      : [],
    status: String(row.status ?? "open"),
  };
}

function parseInvestigation(raw: unknown): Investigation {
  const row = asRecord(raw);
  return {
    investigation_key: String(row.investigation_key ?? ""),
    title: String(row.title ?? ""),
    impact_assessment: String(row.impact_assessment ?? ""),
    timeline_summary: String(row.timeline_summary ?? ""),
    recovery_recommendation: String(row.recovery_recommendation ?? ""),
    status: String(row.status ?? "open"),
  };
}

function parseFeed(raw: unknown): ObservabilityFeed {
  const row = asRecord(raw);
  return {
    feed_key: String(row.feed_key ?? ""),
    feed_type: String(row.feed_type ?? ""),
    message: String(row.message ?? ""),
    occurred_at: row.occurred_at ? String(row.occurred_at) : null,
  };
}

function parseExecutiveView(raw: unknown): ExecutiveObservabilityView | null {
  const row = asRecord(raw);
  if (Object.keys(row).length === 0) return null;
  return {
    organizational_impact: String(row.organizational_impact ?? ""),
    service_reliability: String(row.service_reliability ?? ""),
    operational_maturity: String(row.operational_maturity ?? ""),
    customer_experience_trend: String(row.customer_experience_trend ?? ""),
    strategic_implication: String(row.strategic_implication ?? ""),
  };
}

export function parsePlatformObservabilityCenter(raw: unknown): PlatformObservabilityCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            platform_health_score: Number(dash.platform_health_score ?? 0),
            platform_health_band: String(dash.platform_health_band ?? "healthy"),
            critical_alerts: Number(dash.critical_alerts ?? 0),
            open_alerts: Number(dash.open_alerts ?? 0),
            service_availability_pct: Number(dash.service_availability_pct ?? 0),
            degraded_services: Number(dash.degraded_services ?? 0),
            self_healing_events: Number(dash.self_healing_events ?? 0),
            mean_time_to_understanding_minutes: Number(dash.mean_time_to_understanding_minutes ?? 0),
            incident_detection_speed_minutes: Number(dash.incident_detection_speed_minutes ?? 0),
            alert_usefulness_score: Number(dash.alert_usefulness_score ?? 0),
            operational_confidence: Number(dash.operational_confidence ?? 0),
            executive_trust_score: Number(dash.executive_trust_score ?? 0),
          }
        : null,
    domain_metrics: Array.isArray(row.domain_metrics)
      ? row.domain_metrics.map(parseDomainMetric)
      : [],
    service_signals: Array.isArray(row.service_signals)
      ? row.service_signals.map(parseServiceSignal)
      : [],
    alerts: Array.isArray(row.alerts) ? row.alerts.map(parseAlert) : [],
    correlations: Array.isArray(row.correlations)
      ? row.correlations.map(parseCorrelation)
      : [],
    investigations: Array.isArray(row.investigations)
      ? row.investigations.map(parseInvestigation)
      : [],
    feeds: Array.isArray(row.feeds) ? row.feeds.map(parseFeed) : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          };
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          };
        })
      : [],
    governance_reviews: Array.isArray(row.governance_reviews)
      ? row.governance_reviews.map((r) => {
          const item = asRecord(r);
          return {
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          };
        })
      : [],
    executive_view: parseExecutiveView(row.executive_view),
    links: row.links && typeof row.links === "object" ? (row.links as Record<string, string>) : null,
    can_manage: Boolean(row.can_manage),
    can_contribute: Boolean(row.can_contribute),
    privacy_note: row.privacy_note ? String(row.privacy_note) : null,
  };
}
