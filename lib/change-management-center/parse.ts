import type {
  AdoptionMetric,
  ChangeCommunication,
  ChangeFeedback,
  ChangeInitiative,
  ChangeManagementCenter,
  ExecutiveChangeView,
  StakeholderEntry,
  TrainingAssignment,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function parseInitiative(raw: unknown): ChangeInitiative {
  const row = asRecord(raw);
  return {
    initiative_key: String(row.initiative_key ?? ""),
    title: String(row.title ?? ""),
    summary: String(row.summary ?? ""),
    category: String(row.category ?? ""),
    workflow_stage: String(row.workflow_stage ?? ""),
    status: String(row.status ?? "active"),
    readiness_band: String(row.readiness_band ?? "mostly_ready"),
    readiness_score: Number(row.readiness_score ?? 0),
    adoption_pct: Number(row.adoption_pct ?? 0),
    sponsor: String(row.sponsor ?? ""),
    owner: String(row.owner ?? ""),
    created_at: row.created_at ? String(row.created_at) : null,
  };
}

function parseStakeholder(raw: unknown): StakeholderEntry {
  const row = asRecord(raw);
  return {
    stakeholder_key: String(row.stakeholder_key ?? ""),
    initiative_key: String(row.initiative_key ?? ""),
    role_type: String(row.role_type ?? ""),
    label: String(row.label ?? ""),
    engagement_level: String(row.engagement_level ?? "moderate"),
  };
}

function parseCommunication(raw: unknown): ChangeCommunication {
  const row = asRecord(raw);
  return {
    communication_key: String(row.communication_key ?? ""),
    initiative_key: String(row.initiative_key ?? ""),
    audience: String(row.audience ?? ""),
    title: String(row.title ?? ""),
    content: String(row.content ?? ""),
    status: String(row.status ?? "draft"),
    created_at: row.created_at ? String(row.created_at) : null,
  };
}

function parseTraining(raw: unknown): TrainingAssignment {
  const row = asRecord(raw);
  return {
    training_key: String(row.training_key ?? ""),
    initiative_key: String(row.initiative_key ?? ""),
    label: String(row.label ?? ""),
    role_target: String(row.role_target ?? ""),
    completion_pct: Number(row.completion_pct ?? 0),
    status: String(row.status ?? "pending"),
  };
}

function parseAdoptionMetric(raw: unknown): AdoptionMetric {
  const row = asRecord(raw);
  return {
    metric_key: String(row.metric_key ?? ""),
    initiative_key: String(row.initiative_key ?? ""),
    label: String(row.label ?? ""),
    value_label: String(row.value_label ?? ""),
    trend: String(row.trend ?? "stable"),
  };
}

function parseFeedback(raw: unknown): ChangeFeedback {
  const row = asRecord(raw);
  return {
    feedback_key: String(row.feedback_key ?? ""),
    initiative_key: row.initiative_key ? String(row.initiative_key) : null,
    feedback_type: String(row.feedback_type ?? ""),
    message: String(row.message ?? ""),
    status: String(row.status ?? "open"),
    created_at: row.created_at ? String(row.created_at) : null,
  };
}

function parseExecutiveView(raw: unknown): ExecutiveChangeView | null {
  const row = asRecord(raw);
  if (Object.keys(row).length === 0) return null;
  return {
    strategic_initiatives: Number(row.strategic_initiatives ?? 0),
    adoption_confidence: String(row.adoption_confidence ?? ""),
    stakeholder_sentiment: String(row.stakeholder_sentiment ?? ""),
    leadership_actions: String(row.leadership_actions ?? ""),
  };
}

export function parseChangeManagementCenter(raw: unknown): ChangeManagementCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            active_initiatives: Number(dash.active_initiatives ?? 0),
            average_adoption_pct: Number(dash.average_adoption_pct ?? 0),
            average_readiness_score: Number(dash.average_readiness_score ?? 0),
            initiatives_needing_attention: Number(dash.initiatives_needing_attention ?? 0),
            training_completion_pct: Number(dash.training_completion_pct ?? 0),
            communications_sent: Number(dash.communications_sent ?? 0),
            communication_effectiveness: Number(dash.communication_effectiveness ?? 0),
            stakeholder_engagement_score: Number(dash.stakeholder_engagement_score ?? 0),
            employee_confidence_score: Number(dash.employee_confidence_score ?? 0),
            leadership_satisfaction: Number(dash.leadership_satisfaction ?? 0),
            initiative_success_rate: Number(dash.initiative_success_rate ?? 0),
            companion_usefulness_rating: Number(dash.companion_usefulness_rating ?? 0),
          }
        : null,
    initiatives: Array.isArray(row.initiatives) ? row.initiatives.map(parseInitiative) : [],
    stakeholders: Array.isArray(row.stakeholders) ? row.stakeholders.map(parseStakeholder) : [],
    communications: Array.isArray(row.communications)
      ? row.communications.map(parseCommunication)
      : [],
    training: Array.isArray(row.training) ? row.training.map(parseTraining) : [],
    adoption_metrics: Array.isArray(row.adoption_metrics)
      ? row.adoption_metrics.map(parseAdoptionMetric)
      : [],
    feedback: Array.isArray(row.feedback) ? row.feedback.map(parseFeedback) : [],
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
            initiative_key: item.initiative_key ? String(item.initiative_key) : null,
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
