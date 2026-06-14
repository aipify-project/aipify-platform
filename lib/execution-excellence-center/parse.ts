import type {
  ExecutionDependency,
  ExecutionExcellenceCenter,
  ExecutionInitiative,
  ExecutionInsight,
  ExecutionMilestone,
  ExecutionRecommendation,
  ExecutionReview,
  ExecutionRisk,
  WorkflowStage,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseExecutionExcellenceCenter(raw: unknown): ExecutionExcellenceCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const exec = asRecord(row.executive_view);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            initiatives_in_progress: Number(dash.initiatives_in_progress ?? 0),
            objectives_at_risk: Number(dash.objectives_at_risk ?? 0),
            execution_momentum_pct: Number(dash.execution_momentum_pct ?? 0),
            momentum_initiatives: Number(dash.momentum_initiatives ?? 0),
            milestones_achieved: Number(dash.milestones_achieved ?? 0),
            dependency_count: Number(dash.dependency_count ?? 0),
            execution_health_score: Number(dash.execution_health_score ?? 0),
            execution_health_label: String(dash.execution_health_label ?? "stable"),
            completion_trend_pct: Number(dash.completion_trend_pct ?? 0),
            review_consistency_pct: Number(dash.review_consistency_pct ?? 0),
            leadership_confidence: Number(dash.leadership_confidence ?? 0),
          }
        : null,
    initiatives: Array.isArray(row.initiatives)
      ? row.initiatives.map((i) => {
          const item = asRecord(i);
          return {
            initiative_key: String(item.initiative_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            owner_label: String(item.owner_label ?? ""),
            sponsor_label: String(item.sponsor_label ?? ""),
            workflow_stage: String(item.workflow_stage ?? ""),
            progress_pct: Number(item.progress_pct ?? 0),
            risk_status: String(item.risk_status ?? "stable"),
          } satisfies ExecutionInitiative;
        })
      : [],
    dependencies: Array.isArray(row.dependencies)
      ? row.dependencies.map((d) => {
          const item = asRecord(d);
          return {
            dependency_key: String(item.dependency_key ?? ""),
            initiative_key: String(item.initiative_key ?? ""),
            dependency_type: String(item.dependency_type ?? ""),
            message: String(item.message ?? ""),
            status: String(item.status ?? "open"),
          } satisfies ExecutionDependency;
        })
      : [],
    milestones: Array.isArray(row.milestones)
      ? row.milestones.map((m) => {
          const item = asRecord(m);
          return {
            milestone_key: String(item.milestone_key ?? ""),
            initiative_key: String(item.initiative_key ?? ""),
            label: String(item.label ?? ""),
            milestone_status: String(item.milestone_status ?? "planned"),
            due_at: item.due_at ? String(item.due_at) : null,
          } satisfies ExecutionMilestone;
        })
      : [],
    execution_risks: Array.isArray(row.execution_risks)
      ? row.execution_risks.map((r) => {
          const item = asRecord(r);
          return {
            risk_key: String(item.risk_key ?? ""),
            risk_type: String(item.risk_type ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies ExecutionRisk;
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies ExecutionInsight;
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies ExecutionRecommendation;
        })
      : [],
    execution_reviews: Array.isArray(row.execution_reviews)
      ? row.execution_reviews.map((r) => {
          const item = asRecord(r);
          return {
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies ExecutionReview;
        })
      : [],
    executive_view:
      Object.keys(exec).length > 0
        ? {
            execution_capacity: String(exec.execution_capacity ?? ""),
            strategic_progress: String(exec.strategic_progress ?? ""),
            initiative_confidence: String(exec.initiative_confidence ?? ""),
            leadership_focus: String(exec.leadership_focus ?? ""),
          }
        : null,
    execution_workflow: Array.isArray(row.execution_workflow)
      ? row.execution_workflow.map((s) => {
          const item = asRecord(s);
          return {
            stage: String(item.stage ?? ""),
            label: String(item.label ?? ""),
          } satisfies WorkflowStage;
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
