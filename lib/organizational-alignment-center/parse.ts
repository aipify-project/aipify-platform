import type {
  AlignmentIndicator,
  AlignmentInsight,
  AlignmentPriority,
  AlignmentRecommendation,
  AlignmentReview,
  AlignmentSnapshot,
  MisalignmentItem,
  OrganizationalAlignmentCenter,
  TimelineEvent,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseOrganizationalAlignmentCenter(raw: unknown): OrganizationalAlignmentCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const exec = asRecord(row.executive_view);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            alignment_score: Number(dash.alignment_score ?? 0),
            alignment_health_label: String(dash.alignment_health_label ?? "stable"),
            strong_alignment_count: Number(dash.strong_alignment_count ?? 0),
            alignment_opportunities: Number(dash.alignment_opportunities ?? 0),
            misalignment_open: Number(dash.misalignment_open ?? 0),
            cross_functional_trend_pct: Number(dash.cross_functional_trend_pct ?? 0),
            goal_consistency_pct: Number(dash.goal_consistency_pct ?? 0),
            initiative_overlap_count: Number(dash.initiative_overlap_count ?? 0),
            leadership_confidence: Number(dash.leadership_confidence ?? 0),
          }
        : null,
    indicators: Array.isArray(row.indicators)
      ? row.indicators.map((i) => {
          const item = asRecord(i);
          return {
            indicator_key: String(item.indicator_key ?? ""),
            domain: String(item.domain ?? ""),
            label: String(item.label ?? ""),
            value_label: String(item.value_label ?? ""),
            trend: String(item.trend ?? "stable"),
          } satisfies AlignmentIndicator;
        })
      : [],
    priorities: Array.isArray(row.priorities)
      ? row.priorities.map((p) => {
          const item = asRecord(p);
          return {
            priority_key: String(item.priority_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            owner_label: String(item.owner_label ?? ""),
            summary: String(item.summary ?? ""),
            alignment_score: Number(item.alignment_score ?? 0),
          } satisfies AlignmentPriority;
        })
      : [],
    misalignments: Array.isArray(row.misalignments)
      ? row.misalignments.map((m) => {
          const item = asRecord(m);
          return {
            misalignment_key: String(item.misalignment_key ?? ""),
            misalignment_type: String(item.misalignment_type ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
            status: String(item.status ?? "open"),
          } satisfies MisalignmentItem;
        })
      : [],
    timeline: Array.isArray(row.timeline)
      ? row.timeline.map((t) => {
          const item = asRecord(t);
          return {
            timeline_key: String(item.timeline_key ?? ""),
            event_type: String(item.event_type ?? ""),
            label: String(item.label ?? ""),
            summary: String(item.summary ?? ""),
            recorded_at: item.recorded_at ? String(item.recorded_at) : null,
          } satisfies TimelineEvent;
        })
      : [],
    snapshots: Array.isArray(row.snapshots)
      ? row.snapshots.map((s) => {
          const item = asRecord(s);
          return {
            snapshot_key: String(item.snapshot_key ?? ""),
            department_label: String(item.department_label ?? ""),
            alignment_score: Number(item.alignment_score ?? 0),
            summary: String(item.summary ?? ""),
            captured_at: item.captured_at ? String(item.captured_at) : null,
          } satisfies AlignmentSnapshot;
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies AlignmentInsight;
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies AlignmentRecommendation;
        })
      : [],
    alignment_reviews: Array.isArray(row.alignment_reviews)
      ? row.alignment_reviews.map((r) => {
          const item = asRecord(r);
          return {
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies AlignmentReview;
        })
      : [],
    executive_view:
      Object.keys(exec).length > 0
        ? {
            vision_clarity: String(exec.vision_clarity ?? ""),
            strategic_consistency: String(exec.strategic_consistency ?? ""),
            collaboration_trends: String(exec.collaboration_trends ?? ""),
            focus_areas: String(exec.focus_areas ?? ""),
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
