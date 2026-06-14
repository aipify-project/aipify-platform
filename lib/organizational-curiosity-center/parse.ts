import type {
  OrganizationalCuriosityCenter,
  QuestionPrompt,
  DiscoveryHighlight,
  CuriosityInitiative,
  CuriosityInsight,
  CuriosityMilestone,
  CuriosityRecommendation,
  CuriosityReview,
  CuriositySession,
  CuriositySignal,
  CuriositySnapshot,
  CuriosityTimelineEvent,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseOrganizationalCuriosityCenter(raw: unknown): OrganizationalCuriosityCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const exec = asRecord(row.executive_view);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            curiosity_score: Number(dash.curiosity_score ?? 0),
            curiosity_health_label: String(dash.curiosity_health_label ?? "healthy"),
            learning_engagement_pct: Number(dash.learning_engagement_pct ?? 0),
            exploration_initiatives_pct: Number(dash.exploration_initiatives_pct ?? 0),
            innovation_opportunities_pct: Number(dash.innovation_opportunities_pct ?? 0),
            initiatives_in_progress: Number(dash.initiatives_in_progress ?? 0),
            learning_participation_pct: Number(dash.learning_participation_pct ?? 0),
            reflection_engagement_pct: Number(dash.reflection_engagement_pct ?? 0),
            cross_functional_exploration_pct: Number(dash.cross_functional_exploration_pct ?? 0),
            knowledge_sharing_pct: Number(dash.knowledge_sharing_pct ?? 0),
            innovation_discipline_pct: Number(dash.innovation_discipline_pct ?? 0),
            reviews_completed: Number(dash.reviews_completed ?? 0),
          }
        : null,
    curiosity_signals: Array.isArray(row.curiosity_signals)
      ? row.curiosity_signals.map((c) => {
          const item = asRecord(c);
          return {
            signal_key: String(item.signal_key ?? ""),
            domain: String(item.domain ?? ""),
            signal_type: String(item.signal_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            signal_tone: String(item.signal_tone ?? "neutral"),
          } satisfies CuriositySignal;
        })
      : [],
    question_prompts: Array.isArray(row.question_prompts)
      ? row.question_prompts.map((g) => {
          const item = asRecord(g);
          return {
            question_key: String(item.question_key ?? ""),
            question_type: String(item.question_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
          } satisfies QuestionPrompt;
        })
      : [],
    discovery_highlights: Array.isArray(row.discovery_highlights)
      ? row.discovery_highlights.map((d) => {
          const item = asRecord(d);
          return {
            discovery_key: String(item.discovery_key ?? ""),
            discovery_type: String(item.discovery_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
          } satisfies DiscoveryHighlight;
        })
      : [],
    curiosity_initiatives: Array.isArray(row.curiosity_initiatives)
      ? row.curiosity_initiatives.map((i) => {
          const item = asRecord(i);
          return {
            initiative_key: String(item.initiative_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            status: String(item.status ?? "planned"),
          } satisfies CuriosityInitiative;
        })
      : [],
    curiosity_reviews: Array.isArray(row.curiosity_reviews)
      ? row.curiosity_reviews.map((r) => {
          const item = asRecord(r);
          return {
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies CuriosityReview;
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
          } satisfies CuriosityTimelineEvent;
        })
      : [],
    curiosity_milestones: Array.isArray(row.curiosity_milestones)
      ? row.curiosity_milestones.map((m) => {
          const item = asRecord(m);
          return {
            milestone_key: String(item.milestone_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            archived_at: item.archived_at ? String(item.archived_at) : null,
          } satisfies CuriosityMilestone;
        })
      : [],
    snapshots: Array.isArray(row.snapshots)
      ? row.snapshots.map((s) => {
          const item = asRecord(s);
          return {
            snapshot_key: String(item.snapshot_key ?? ""),
            period_label: String(item.period_label ?? ""),
            curiosity_score: Number(item.curiosity_score ?? 0),
            summary: String(item.summary ?? ""),
            captured_at: item.captured_at ? String(item.captured_at) : null,
          } satisfies CuriositySnapshot;
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies CuriosityInsight;
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies CuriosityRecommendation;
        })
      : [],
    curiosity_sessions: Array.isArray(row.curiosity_sessions)
      ? row.curiosity_sessions.map((s) => {
          const item = asRecord(s);
          return {
            session_key: String(item.session_key ?? ""),
            session_type: String(item.session_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies CuriositySession;
        })
      : [],
    executive_view:
      Object.keys(exec).length > 0
        ? {
            leadership_learning: String(exec.leadership_learning ?? ""),
            exploration_trends: String(exec.exploration_trends ?? ""),
            innovation_opportunities: String(exec.innovation_opportunities ?? ""),
            organizational_inquiry: String(exec.organizational_inquiry ?? ""),
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
