import type {
  ContinuousImprovementCenter,
  ImprovementInitiative,
  ImprovementOpportunity,
  LessonLearned,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function parseOpportunity(raw: unknown): ImprovementOpportunity {
  const row = asRecord(raw);
  return {
    opportunity_key: String(row.opportunity_key ?? ""),
    domain: String(row.domain ?? ""),
    title: String(row.title ?? ""),
    summary: String(row.summary ?? ""),
    priority_matrix: String(row.priority_matrix ?? "monitor"),
    impact: String(row.impact ?? "medium"),
    effort: String(row.effort ?? "medium"),
    frequency: String(row.frequency ?? "frequent"),
    status: String(row.status ?? "open"),
    created_at: row.created_at ? String(row.created_at) : null,
  };
}

function parseInitiative(raw: unknown): ImprovementInitiative {
  const row = asRecord(raw);
  return {
    initiative_key: String(row.initiative_key ?? ""),
    title: String(row.title ?? ""),
    summary: String(row.summary ?? ""),
    domain: String(row.domain ?? ""),
    owner_label: row.owner_label ? String(row.owner_label) : null,
    participating_teams: row.participating_teams ? String(row.participating_teams) : null,
    status: String(row.status ?? "proposed"),
    impact_estimate_hours: Number(row.impact_estimate_hours ?? 0),
    review_schedule: row.review_schedule ? String(row.review_schedule) : null,
    success_measurement: row.success_measurement ? String(row.success_measurement) : null,
    created_at: row.created_at ? String(row.created_at) : null,
    updated_at: row.updated_at ? String(row.updated_at) : null,
  };
}

export function parseContinuousImprovementCenter(raw: unknown): ContinuousImprovementCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            opportunities_identified: Number(dash.opportunities_identified ?? 0),
            improvements_implemented: Number(dash.improvements_implemented ?? 0),
            impact_estimate_hours: Number(dash.impact_estimate_hours ?? 0),
            department_participation: Number(dash.department_participation ?? 0),
            improvement_trend: String(dash.improvement_trend ?? "stable"),
            recommendations_open: Number(dash.recommendations_open ?? 0),
            initiatives_active: Number(dash.initiatives_active ?? 0),
            employee_satisfaction: Number(dash.employee_satisfaction ?? 0),
            executive_trust_score: Number(dash.executive_trust_score ?? 0),
          }
        : null,
    opportunities: Array.isArray(row.opportunities) ? row.opportunities.map(parseOpportunity) : [],
    initiatives: Array.isArray(row.initiatives) ? row.initiatives.map(parseInitiative) : [],
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
    lessons_learned: Array.isArray(row.lessons_learned)
      ? row.lessons_learned.map((l) => {
          const item = asRecord(l);
          return {
            lesson_key: String(item.lesson_key ?? ""),
            initiative_key: item.initiative_key ? String(item.initiative_key) : null,
            title: String(item.title ?? ""),
            content: String(item.content ?? ""),
            outcome_type: String(item.outcome_type ?? "improved"),
            created_at: item.created_at ? String(item.created_at) : null,
          } satisfies LessonLearned;
        })
      : [],
    links: row.links
      ? Object.fromEntries(Object.entries(asRecord(row.links)).map(([k, v]) => [k, String(v)]))
      : null,
    can_manage: Boolean(row.can_manage),
    can_contribute: Boolean(row.can_contribute),
    privacy_note: row.privacy_note ? String(row.privacy_note) : null,
  };
}
