import type {
  AlignmentItem,
  CoherenceInsight,
  CoherenceMilestone,
  CoherenceRecommendation,
  CoherenceReview,
  CoherenceSession,
  CoherenceSnapshot,
  CoherenceTimelineEvent,
  FragmentationSignal,
  OrganizationalCoherenceCenter,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseOrganizationalCoherenceCenter(raw: unknown): OrganizationalCoherenceCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const exec = asRecord(row.executive_view);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            coherence_score: Number(dash.coherence_score ?? 0),
            coherence_health_label: String(dash.coherence_health_label ?? "stable"),
            strategic_consistency_pct: Number(dash.strategic_consistency_pct ?? 0),
            alignment_trend_pct: Number(dash.alignment_trend_pct ?? 0),
            vision_alignment_pct: Number(dash.vision_alignment_pct ?? 0),
            values_consistency_pct: Number(dash.values_consistency_pct ?? 0),
            governance_integrity_pct: Number(dash.governance_integrity_pct ?? 0),
            initiative_coordination_pct: Number(dash.initiative_coordination_pct ?? 0),
            leadership_synchronization_pct: Number(dash.leadership_synchronization_pct ?? 0),
            fragmentation_risks: Number(dash.fragmentation_risks ?? 0),
            leadership_confidence: Number(dash.leadership_confidence ?? 0),
            reviews_completed: Number(dash.reviews_completed ?? 0),
          }
        : null,
    fragmentation_signals: Array.isArray(row.fragmentation_signals)
      ? row.fragmentation_signals.map((s) => {
          const item = asRecord(s);
          return {
            signal_key: String(item.signal_key ?? ""),
            domain: String(item.domain ?? ""),
            signal_type: String(item.signal_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            signal_tone: String(item.signal_tone ?? "neutral"),
            status: String(item.status ?? "open"),
          } satisfies FragmentationSignal;
        })
      : [],
    alignment_items: Array.isArray(row.alignment_items)
      ? row.alignment_items.map((a) => {
          const item = asRecord(a);
          return {
            alignment_key: String(item.alignment_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            alignment_status: String(item.alignment_status ?? "aligned"),
          } satisfies AlignmentItem;
        })
      : [],
    coherence_reviews: Array.isArray(row.coherence_reviews)
      ? row.coherence_reviews.map((r) => {
          const item = asRecord(r);
          return {
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies CoherenceReview;
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
          } satisfies CoherenceTimelineEvent;
        })
      : [],
    coherence_milestones: Array.isArray(row.coherence_milestones)
      ? row.coherence_milestones.map((m) => {
          const item = asRecord(m);
          return {
            milestone_key: String(item.milestone_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            archived_at: item.archived_at ? String(item.archived_at) : null,
          } satisfies CoherenceMilestone;
        })
      : [],
    snapshots: Array.isArray(row.snapshots)
      ? row.snapshots.map((s) => {
          const item = asRecord(s);
          return {
            snapshot_key: String(item.snapshot_key ?? ""),
            period_label: String(item.period_label ?? ""),
            coherence_score: Number(item.coherence_score ?? 0),
            summary: String(item.summary ?? ""),
            captured_at: item.captured_at ? String(item.captured_at) : null,
          } satisfies CoherenceSnapshot;
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies CoherenceInsight;
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies CoherenceRecommendation;
        })
      : [],
    coherence_sessions: Array.isArray(row.coherence_sessions)
      ? row.coherence_sessions.map((s) => {
          const item = asRecord(s);
          return {
            session_key: String(item.session_key ?? ""),
            session_type: String(item.session_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies CoherenceSession;
        })
      : [],
    executive_view:
      Object.keys(exec).length > 0
        ? {
            leadership_alignment: String(exec.leadership_alignment ?? ""),
            strategic_consistency: String(exec.strategic_consistency ?? ""),
            organizational_integrity: String(exec.organizational_integrity ?? ""),
            coherence_opportunities: String(exec.coherence_opportunities ?? ""),
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
