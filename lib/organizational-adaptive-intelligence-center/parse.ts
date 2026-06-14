import type {
  OrganizationalAdaptiveIntelligenceCenter,
  LearningApplicationPrompt,
  AdaptiveIntelligenceInitiative,
  AdaptiveIntelligenceInsight,
  AdaptiveIntelligenceMilestone,
  AdaptiveIntelligenceRecommendation,
  AdaptiveIntelligenceReview,
  AdaptiveIntelligenceSession,
  AdaptiveIntelligenceSignal,
  AdaptiveIntelligenceSnapshot,
  AdaptiveIntelligenceTimelineEvent,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseOrganizationalAdaptiveIntelligenceCenter(raw: unknown): OrganizationalAdaptiveIntelligenceCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const exec = asRecord(row.executive_view);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            adaptive_intelligence_score: Number(dash.adaptive_intelligence_score ?? 0),
            adaptive_intelligence_health_label: String(dash.adaptive_intelligence_health_label ?? "healthy"),
            capability_evolution_pct: Number(dash.capability_evolution_pct ?? 0),
            learning_integration_pct: Number(dash.learning_integration_pct ?? 0),
            responsiveness_trends_pct: Number(dash.responsiveness_trends_pct ?? 0),
            future_readiness_pct: Number(dash.future_readiness_pct ?? 0),
            initiatives_in_progress: Number(dash.initiatives_in_progress ?? 0),
            learning_effectiveness_pct: Number(dash.learning_effectiveness_pct ?? 0),
            reflection_participation_pct: Number(dash.reflection_participation_pct ?? 0),
            strategic_responsiveness_pct: Number(dash.strategic_responsiveness_pct ?? 0),
            decision_adaptability_pct: Number(dash.decision_adaptability_pct ?? 0),
            reviews_completed: Number(dash.reviews_completed ?? 0),
          }
        : null,
    adaptive_intelligence_signals: Array.isArray(row.adaptive_intelligence_signals)
      ? row.adaptive_intelligence_signals.map((c) => {
          const item = asRecord(c);
          return {
            signal_key: String(item.signal_key ?? ""),
            domain: String(item.domain ?? ""),
            signal_type: String(item.signal_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            signal_tone: String(item.signal_tone ?? "neutral"),
          } satisfies AdaptiveIntelligenceSignal;
        })
      : [],
    learning_application_prompts: Array.isArray(row.learning_application_prompts)
      ? row.learning_application_prompts.map((g) => {
          const item = asRecord(g);
          return {
            application_key: String(item.application_key ?? ""),
            application_type: String(item.application_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
          } satisfies LearningApplicationPrompt;
        })
      : [],
    adaptive_intelligence_initiatives: Array.isArray(row.adaptive_intelligence_initiatives)
      ? row.adaptive_intelligence_initiatives.map((i) => {
          const item = asRecord(i);
          return {
            initiative_key: String(item.initiative_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            status: String(item.status ?? "planned"),
          } satisfies AdaptiveIntelligenceInitiative;
        })
      : [],
    adaptive_intelligence_reviews: Array.isArray(row.adaptive_intelligence_reviews)
      ? row.adaptive_intelligence_reviews.map((r) => {
          const item = asRecord(r);
          return {
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies AdaptiveIntelligenceReview;
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
          } satisfies AdaptiveIntelligenceTimelineEvent;
        })
      : [],
    adaptive_intelligence_milestones: Array.isArray(row.adaptive_intelligence_milestones)
      ? row.adaptive_intelligence_milestones.map((m) => {
          const item = asRecord(m);
          return {
            milestone_key: String(item.milestone_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            archived_at: item.archived_at ? String(item.archived_at) : null,
          } satisfies AdaptiveIntelligenceMilestone;
        })
      : [],
    snapshots: Array.isArray(row.snapshots)
      ? row.snapshots.map((s) => {
          const item = asRecord(s);
          return {
            snapshot_key: String(item.snapshot_key ?? ""),
            period_label: String(item.period_label ?? ""),
            adaptive_intelligence_score: Number(item.adaptive_intelligence_score ?? 0),
            summary: String(item.summary ?? ""),
            captured_at: item.captured_at ? String(item.captured_at) : null,
          } satisfies AdaptiveIntelligenceSnapshot;
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies AdaptiveIntelligenceInsight;
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies AdaptiveIntelligenceRecommendation;
        })
      : [],
    adaptive_intelligence_sessions: Array.isArray(row.adaptive_intelligence_sessions)
      ? row.adaptive_intelligence_sessions.map((s) => {
          const item = asRecord(s);
          return {
            session_key: String(item.session_key ?? ""),
            session_type: String(item.session_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies AdaptiveIntelligenceSession;
        })
      : [],
    executive_view:
      Object.keys(exec).length > 0
        ? {
            leadership_learning: String(exec.leadership_learning ?? ""),
            strategic_responsiveness: String(exec.strategic_responsiveness ?? ""),
            capability_evolution: String(exec.capability_evolution ?? ""),
            future_readiness: String(exec.future_readiness ?? ""),
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
