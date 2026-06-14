import type {
  OrganizationalPresenceCenter,
  AttentivenessPrompt,
  PresenceInitiative,
  PresenceInsight,
  PresenceMilestone,
  PresenceRecommendation,
  PresenceReview,
  PresenceSession,
  PresenceSignal,
  PresenceSnapshot,
  PresenceTimelineEvent,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseOrganizationalPresenceCenter(raw: unknown): OrganizationalPresenceCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const exec = asRecord(row.executive_view);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            presence_score: Number(dash.presence_score ?? 0),
            presence_health_label: String(dash.presence_health_label ?? "healthy"),
            initiatives_in_progress: Number(dash.initiatives_in_progress ?? 0),
            engagement_indicators_pct: Number(dash.engagement_indicators_pct ?? 0),
            leadership_attentiveness_pct: Number(dash.leadership_attentiveness_pct ?? 0),
            customer_responsiveness_pct: Number(dash.customer_responsiveness_pct ?? 0),
            communication_quality_pct: Number(dash.communication_quality_pct ?? 0),
            leadership_participation_pct: Number(dash.leadership_participation_pct ?? 0),
            responsiveness_consistency_pct: Number(dash.responsiveness_consistency_pct ?? 0),
            reflection_engagement_pct: Number(dash.reflection_engagement_pct ?? 0),
            relationship_investment_pct: Number(dash.relationship_investment_pct ?? 0),
            reviews_completed: Number(dash.reviews_completed ?? 0),
          }
        : null,
    presence_signals: Array.isArray(row.presence_signals)
      ? row.presence_signals.map((c) => {
          const item = asRecord(c);
          return {
            signal_key: String(item.signal_key ?? ""),
            domain: String(item.domain ?? ""),
            signal_type: String(item.signal_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            signal_tone: String(item.signal_tone ?? "neutral"),
          } satisfies PresenceSignal;
        })
      : [],
    attentiveness_prompts: Array.isArray(row.attentiveness_prompts)
      ? row.attentiveness_prompts.map((g) => {
          const item = asRecord(g);
          return {
            application_key: String(item.application_key ?? ""),
            application_type: String(item.application_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
          } satisfies AttentivenessPrompt;
        })
      : [],
    presence_initiatives: Array.isArray(row.presence_initiatives)
      ? row.presence_initiatives.map((i) => {
          const item = asRecord(i);
          return {
            initiative_key: String(item.initiative_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            status: String(item.status ?? "planned"),
          } satisfies PresenceInitiative;
        })
      : [],
    presence_reviews: Array.isArray(row.presence_reviews)
      ? row.presence_reviews.map((r) => {
          const item = asRecord(r);
          return {
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies PresenceReview;
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
          } satisfies PresenceTimelineEvent;
        })
      : [],
    presence_milestones: Array.isArray(row.presence_milestones)
      ? row.presence_milestones.map((m) => {
          const item = asRecord(m);
          return {
            milestone_key: String(item.milestone_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            archived_at: item.archived_at ? String(item.archived_at) : null,
          } satisfies PresenceMilestone;
        })
      : [],
    snapshots: Array.isArray(row.snapshots)
      ? row.snapshots.map((s) => {
          const item = asRecord(s);
          return {
            snapshot_key: String(item.snapshot_key ?? ""),
            period_label: String(item.period_label ?? ""),
            presence_score: Number(item.presence_score ?? 0),
            summary: String(item.summary ?? ""),
            captured_at: item.captured_at ? String(item.captured_at) : null,
          } satisfies PresenceSnapshot;
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies PresenceInsight;
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies PresenceRecommendation;
        })
      : [],
    presence_sessions: Array.isArray(row.presence_sessions)
      ? row.presence_sessions.map((s) => {
          const item = asRecord(s);
          return {
            session_key: String(item.session_key ?? ""),
            session_type: String(item.session_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies PresenceSession;
        })
      : [],
    executive_view:
      Object.keys(exec).length > 0
        ? {
            leadership_engagement: String(exec.leadership_engagement ?? ""),
            communication_effectiveness: String(exec.communication_effectiveness ?? ""),
            relationship_quality: String(exec.relationship_quality ?? ""),
            connection_opportunities: String(exec.connection_opportunities ?? ""),
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
