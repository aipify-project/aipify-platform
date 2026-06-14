import type {
  BiasAwarenessItem,
  DecisionInsight,
  DecisionMilestone,
  DecisionRecommendation,
  DecisionReflection,
  DecisionReview,
  DecisionSession,
  DecisionSnapshot,
  DecisionTimelineEvent,
  MajorDecision,
  OrganizationalDecisionQualityCenter,
  WorkflowStep,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseOrganizationalDecisionQualityCenter(
  raw: unknown,
): OrganizationalDecisionQualityCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const exec = asRecord(row.executive_view);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            decision_quality_score: Number(dash.decision_quality_score ?? 0),
            decision_health_label: String(dash.decision_health_label ?? "healthy"),
            decisions_under_review: Number(dash.decisions_under_review ?? 0),
            reflection_participation_pct: Number(dash.reflection_participation_pct ?? 0),
            context_consideration_pct: Number(dash.context_consideration_pct ?? 0),
            stakeholder_involvement_pct: Number(dash.stakeholder_involvement_pct ?? 0),
            learning_utilization_pct: Number(dash.learning_utilization_pct ?? 0),
            governance_alignment_pct: Number(dash.governance_alignment_pct ?? 0),
            executive_confidence: Number(dash.executive_confidence ?? 0),
            reviews_completed: Number(dash.reviews_completed ?? 0),
            decisions_documented: Number(dash.decisions_documented ?? 0),
          }
        : null,
    reflection_questions: Array.isArray(row.reflection_questions)
      ? row.reflection_questions.map((r) => {
          const item = asRecord(r);
          return {
            reflection_key: String(item.reflection_key ?? ""),
            question: String(item.question ?? ""),
            status: String(item.status ?? "open"),
          } satisfies DecisionReflection;
        })
      : [],
    major_decisions: Array.isArray(row.major_decisions)
      ? row.major_decisions.map((d) => {
          const item = asRecord(d);
          return {
            decision_key: String(item.decision_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            workflow_status: String(item.workflow_status ?? "recorded"),
          } satisfies MajorDecision;
        })
      : [],
    bias_awareness: Array.isArray(row.bias_awareness)
      ? row.bias_awareness.map((b) => {
          const item = asRecord(b);
          return {
            bias_key: String(item.bias_key ?? ""),
            bias_type: String(item.bias_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
          } satisfies BiasAwarenessItem;
        })
      : [],
    decision_reviews: Array.isArray(row.decision_reviews)
      ? row.decision_reviews.map((r) => {
          const item = asRecord(r);
          return {
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies DecisionReview;
        })
      : [],
    timeline: Array.isArray(row.timeline)
      ? row.timeline.map((t) => {
          const item = asRecord(t);
          return {
            timeline_key: String(item.timeline_key ?? ""),
            event_type: String(item.event_type ?? ""),
            domain: String(item.domain ?? ""),
            label: String(item.label ?? ""),
            summary: String(item.summary ?? ""),
            recorded_at: item.recorded_at ? String(item.recorded_at) : null,
          } satisfies DecisionTimelineEvent;
        })
      : [],
    decision_milestones: Array.isArray(row.decision_milestones)
      ? row.decision_milestones.map((m) => {
          const item = asRecord(m);
          return {
            milestone_key: String(item.milestone_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            archived_at: item.archived_at ? String(item.archived_at) : null,
          } satisfies DecisionMilestone;
        })
      : [],
    snapshots: Array.isArray(row.snapshots)
      ? row.snapshots.map((s) => {
          const item = asRecord(s);
          return {
            snapshot_key: String(item.snapshot_key ?? ""),
            period_label: String(item.period_label ?? ""),
            decision_quality_score: Number(item.decision_quality_score ?? 0),
            summary: String(item.summary ?? ""),
            captured_at: item.captured_at ? String(item.captured_at) : null,
          } satisfies DecisionSnapshot;
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies DecisionInsight;
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies DecisionRecommendation;
        })
      : [],
    decision_sessions: Array.isArray(row.decision_sessions)
      ? row.decision_sessions.map((s) => {
          const item = asRecord(s);
          return {
            session_key: String(item.session_key ?? ""),
            session_type: String(item.session_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies DecisionSession;
        })
      : [],
    workflow_steps: Array.isArray(row.workflow_steps)
      ? row.workflow_steps.map((w) => {
          const item = asRecord(w);
          return {
            key: String(item.key ?? ""),
            label: String(item.label ?? ""),
          } satisfies WorkflowStep;
        })
      : [],
    executive_view:
      Object.keys(exec).length > 0
        ? {
            strategic_trends: String(exec.strategic_trends ?? ""),
            reflection_participation: String(exec.reflection_participation ?? ""),
            learning_integration: String(exec.learning_integration ?? ""),
            quality_opportunities: String(exec.quality_opportunities ?? ""),
          }
        : null,
    links: row.links
      ? Object.fromEntries(Object.entries(asRecord(row.links)).map(([k, v]) => [k, String(v)]))
      : null,
    can_manage: Boolean(row.can_manage),
    can_contribute: Boolean(row.can_contribute),
    privacy_note: row.privacy_note ? String(row.privacy_note) : null,
  };
}
