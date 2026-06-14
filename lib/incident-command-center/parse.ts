import type {
  ExecutiveIncidentView,
  IncidentCommandCenter,
  IncidentCommunication,
  IncidentEntry,
  RecoveryAction,
  SelfHealingEvent,
  TimelineEvent,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function parseIncident(raw: unknown): IncidentEntry {
  const row = asRecord(raw);
  return {
    incident_key: String(row.incident_key ?? ""),
    title: String(row.title ?? ""),
    summary: String(row.summary ?? ""),
    category: String(row.category ?? ""),
    severity: String(row.severity ?? "sev3"),
    status: String(row.status ?? "investigating"),
    workflow_stage: String(row.workflow_stage ?? "detected"),
    owner: String(row.owner ?? ""),
    impact_summary: String(row.impact_summary ?? ""),
    systems_involved: Array.isArray(row.systems_involved) ? row.systems_involved.map(String) : [],
    stakeholders_affected: Array.isArray(row.stakeholders_affected)
      ? row.stakeholders_affected.map(String)
      : [],
    detected_at: row.detected_at ? String(row.detected_at) : null,
    resolved_at: row.resolved_at ? String(row.resolved_at) : null,
  };
}

function parseTimeline(raw: unknown): TimelineEvent {
  const row = asRecord(raw);
  return {
    timeline_key: String(row.timeline_key ?? ""),
    incident_key: String(row.incident_key ?? ""),
    event_label: String(row.event_label ?? ""),
    event_summary: String(row.event_summary ?? ""),
    occurred_at: row.occurred_at ? String(row.occurred_at) : null,
  };
}

function parseCommunication(raw: unknown): IncidentCommunication {
  const row = asRecord(raw);
  return {
    communication_key: String(row.communication_key ?? ""),
    incident_key: String(row.incident_key ?? ""),
    audience: String(row.audience ?? ""),
    title: String(row.title ?? ""),
    content: String(row.content ?? ""),
    status: String(row.status ?? "draft"),
    created_at: row.created_at ? String(row.created_at) : null,
  };
}

function parseRecoveryAction(raw: unknown): RecoveryAction {
  const row = asRecord(raw);
  return {
    action_key: String(row.action_key ?? ""),
    incident_key: String(row.incident_key ?? ""),
    label: String(row.label ?? ""),
    status: String(row.status ?? "pending"),
  };
}

function parseSelfHealing(raw: unknown): SelfHealingEvent {
  const row = asRecord(raw);
  return {
    healing_key: String(row.healing_key ?? ""),
    incident_key: row.incident_key ? String(row.incident_key) : null,
    message: String(row.message ?? ""),
    outcome: String(row.outcome ?? ""),
    created_at: row.created_at ? String(row.created_at) : null,
  };
}

function parseExecutiveView(raw: unknown): ExecutiveIncidentView | null {
  const row = asRecord(raw);
  if (Object.keys(row).length === 0) return null;
  return {
    active_major_incidents: Number(row.active_major_incidents ?? 0),
    business_impact_summary: String(row.business_impact_summary ?? ""),
    recovery_confidence: String(row.recovery_confidence ?? ""),
    strategic_implication: String(row.strategic_implication ?? ""),
  };
}

export function parseIncidentCommandCenter(raw: unknown): IncidentCommandCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const sevDist = asRecord(dash.severity_distribution);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            active_incidents: Number(dash.active_incidents ?? 0),
            major_incidents: Number(dash.major_incidents ?? 0),
            severity_distribution: {
              sev1: Number(sevDist.sev1 ?? 0),
              sev2: Number(sevDist.sev2 ?? 0),
              sev3: Number(sevDist.sev3 ?? 0),
            },
            mean_time_to_recovery_minutes: Number(dash.mean_time_to_recovery_minutes ?? 0),
            mean_time_to_detection_minutes: Number(dash.mean_time_to_detection_minutes ?? 0),
            mean_time_to_acknowledgment_minutes: Number(dash.mean_time_to_acknowledgment_minutes ?? 0),
            self_healing_interventions: Number(dash.self_healing_interventions ?? 0),
            self_healing_success_rate: Number(dash.self_healing_success_rate ?? 0),
            recovery_progress_pct: Number(dash.recovery_progress_pct ?? 0),
            communication_responsiveness_score: Number(dash.communication_responsiveness_score ?? 0),
            executive_confidence: Number(dash.executive_confidence ?? 0),
            operational_resilience_score: Number(dash.operational_resilience_score ?? 0),
          }
        : null,
    incidents: Array.isArray(row.incidents) ? row.incidents.map(parseIncident) : [],
    timeline: Array.isArray(row.timeline) ? row.timeline.map(parseTimeline) : [],
    communications: Array.isArray(row.communications)
      ? row.communications.map(parseCommunication)
      : [],
    recovery_actions: Array.isArray(row.recovery_actions)
      ? row.recovery_actions.map(parseRecoveryAction)
      : [],
    self_healing: Array.isArray(row.self_healing)
      ? row.self_healing.map(parseSelfHealing)
      : [],
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
    post_reviews: Array.isArray(row.post_reviews)
      ? row.post_reviews.map((r) => {
          const item = asRecord(r);
          return {
            review_key: String(item.review_key ?? ""),
            incident_key: String(item.incident_key ?? ""),
            what_happened: String(item.what_happened ?? ""),
            root_causes: String(item.root_causes ?? ""),
            recovery_effectiveness: String(item.recovery_effectiveness ?? ""),
            lessons_learned: String(item.lessons_learned ?? ""),
            improvements_required: String(item.improvements_required ?? ""),
            status: String(item.status ?? "pending"),
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
