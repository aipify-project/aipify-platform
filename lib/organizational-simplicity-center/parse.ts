import type {
  ComplexityDetection,
  OrganizationalSimplicityCenter,
  SimplicityInsight,
  SimplicityMilestone,
  SimplicityRecommendation,
  SimplicityReview,
  SimplicitySession,
  SimplicitySnapshot,
  SimplicityTimelineEvent,
  SimplificationOpportunity,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseOrganizationalSimplicityCenter(raw: unknown): OrganizationalSimplicityCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const exec = asRecord(row.executive_view);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            simplicity_score: Number(dash.simplicity_score ?? 0),
            simplicity_health_label: String(dash.simplicity_health_label ?? "manageable"),
            complexity_indicators: Number(dash.complexity_indicators ?? 0),
            simplification_opportunities: Number(dash.simplification_opportunities ?? 0),
            improvement_momentum_pct: Number(dash.improvement_momentum_pct ?? 0),
            process_complexity_pct: Number(dash.process_complexity_pct ?? 0),
            approval_layers_avg: Number(dash.approval_layers_avg ?? 0),
            workflow_efficiency_pct: Number(dash.workflow_efficiency_pct ?? 0),
            information_overload_pct: Number(dash.information_overload_pct ?? 0),
            organizational_clarity_pct: Number(dash.organizational_clarity_pct ?? 0),
            executive_focus_pct: Number(dash.executive_focus_pct ?? 0),
            leadership_confidence: Number(dash.leadership_confidence ?? 0),
            reviews_completed: Number(dash.reviews_completed ?? 0),
          }
        : null,
    complexity_detection: Array.isArray(row.complexity_detection)
      ? row.complexity_detection.map((c) => {
          const item = asRecord(c);
          return {
            complexity_key: String(item.complexity_key ?? ""),
            domain: String(item.domain ?? ""),
            detection_type: String(item.detection_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            severity: String(item.severity ?? "medium"),
          } satisfies ComplexityDetection;
        })
      : [],
    simplification_opportunities: Array.isArray(row.simplification_opportunities)
      ? row.simplification_opportunities.map((o) => {
          const item = asRecord(o);
          return {
            opportunity_key: String(item.opportunity_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            impact_score: Number(item.impact_score ?? 0),
          } satisfies SimplificationOpportunity;
        })
      : [],
    simplicity_reviews: Array.isArray(row.simplicity_reviews)
      ? row.simplicity_reviews.map((r) => {
          const item = asRecord(r);
          return {
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies SimplicityReview;
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
          } satisfies SimplicityTimelineEvent;
        })
      : [],
    simplicity_milestones: Array.isArray(row.simplicity_milestones)
      ? row.simplicity_milestones.map((m) => {
          const item = asRecord(m);
          return {
            milestone_key: String(item.milestone_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            archived_at: item.archived_at ? String(item.archived_at) : null,
          } satisfies SimplicityMilestone;
        })
      : [],
    snapshots: Array.isArray(row.snapshots)
      ? row.snapshots.map((s) => {
          const item = asRecord(s);
          return {
            snapshot_key: String(item.snapshot_key ?? ""),
            period_label: String(item.period_label ?? ""),
            simplicity_score: Number(item.simplicity_score ?? 0),
            summary: String(item.summary ?? ""),
            captured_at: item.captured_at ? String(item.captured_at) : null,
          } satisfies SimplicitySnapshot;
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies SimplicityInsight;
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies SimplicityRecommendation;
        })
      : [],
    simplicity_sessions: Array.isArray(row.simplicity_sessions)
      ? row.simplicity_sessions.map((s) => {
          const item = asRecord(s);
          return {
            session_key: String(item.session_key ?? ""),
            session_type: String(item.session_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies SimplicitySession;
        })
      : [],
    executive_view:
      Object.keys(exec).length > 0
        ? {
            complexity_trends: String(exec.complexity_trends ?? ""),
            executive_focus: String(exec.executive_focus ?? ""),
            governance_efficiency: String(exec.governance_efficiency ?? ""),
            simplification_opportunities: String(exec.simplification_opportunities ?? ""),
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
