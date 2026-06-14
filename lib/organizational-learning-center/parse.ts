import type {
  BestPractice,
  DomainMetric,
  LearningInsight,
  LearningLesson,
  LearningPattern,
  LearningRecommendation,
  LearningReview,
  OrganizationalLearningCenter,
  ValidationStage,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function parseLesson(raw: unknown): LearningLesson {
  const row = asRecord(raw);
  return {
    lesson_key: String(row.lesson_key ?? ""),
    domain: String(row.domain ?? ""),
    title: String(row.title ?? ""),
    what_happened: String(row.what_happened ?? ""),
    what_worked: String(row.what_worked ?? ""),
    what_did_not_work: String(row.what_did_not_work ?? ""),
    what_should_change: String(row.what_should_change ?? ""),
    what_should_remain: String(row.what_should_remain ?? ""),
    validation_stage: String(row.validation_stage ?? "captured"),
  };
}

export function parseOrganizationalLearningCenter(raw: unknown): OrganizationalLearningCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const exec = asRecord(row.executive_view);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            lessons_captured: Number(dash.lessons_captured ?? 0),
            lessons_published: Number(dash.lessons_published ?? 0),
            validation_completion_pct: Number(dash.validation_completion_pct ?? 0),
            knowledge_utilization_pct: Number(dash.knowledge_utilization_pct ?? 0),
            improvement_adoption_pct: Number(dash.improvement_adoption_pct ?? 0),
            learning_health_score: Number(dash.learning_health_score ?? 0),
            learning_health_label: String(dash.learning_health_label ?? "developing"),
            participation_satisfaction: Number(dash.participation_satisfaction ?? 0),
            executive_trust_indicator: Number(dash.executive_trust_indicator ?? 0),
          }
        : null,
    domain_metrics: Array.isArray(row.domain_metrics)
      ? row.domain_metrics.map((m) => {
          const item = asRecord(m);
          return {
            metric_key: String(item.metric_key ?? ""),
            domain: String(item.domain ?? ""),
            label: String(item.label ?? ""),
            value_label: String(item.value_label ?? ""),
            trend: String(item.trend ?? "stable"),
          } satisfies DomainMetric;
        })
      : [],
    lessons: Array.isArray(row.lessons) ? row.lessons.map(parseLesson) : [],
    patterns: Array.isArray(row.patterns)
      ? row.patterns.map((p) => {
          const item = asRecord(p);
          return {
            pattern_key: String(item.pattern_key ?? ""),
            pattern_type: String(item.pattern_type ?? ""),
            message: String(item.message ?? ""),
            occurrence_count: Number(item.occurrence_count ?? 0),
          } satisfies LearningPattern;
        })
      : [],
    best_practices: Array.isArray(row.best_practices)
      ? row.best_practices.map((b) => {
          const item = asRecord(b);
          return {
            practice_key: String(item.practice_key ?? ""),
            practice_type: String(item.practice_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            validation_status: String(item.validation_status ?? "draft"),
          } satisfies BestPractice;
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies LearningInsight;
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies LearningRecommendation;
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
          } satisfies LearningReview;
        })
      : [],
    executive_view:
      Object.keys(exec).length > 0
        ? {
            strategic_lessons: String(exec.strategic_lessons ?? ""),
            maturity_trends: String(exec.maturity_trends ?? ""),
            high_value_opportunities: String(exec.high_value_opportunities ?? ""),
            improvement_momentum: String(exec.improvement_momentum ?? ""),
          }
        : null,
    validation_workflow: Array.isArray(row.validation_workflow)
      ? row.validation_workflow.map((s) => {
          const item = asRecord(s);
          return {
            stage: String(item.stage ?? ""),
            label: String(item.label ?? ""),
          } satisfies ValidationStage;
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
