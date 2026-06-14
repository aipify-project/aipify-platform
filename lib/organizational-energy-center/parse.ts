import type {
  OrganizationalEnergyCenter,
  BalancePrompt,
  EnergyInitiative,
  EnergyInsight,
  EnergyMilestone,
  EnergyRecommendation,
  EnergyReview,
  EnergySession,
  EnergySignal,
  EnergySnapshot,
  EnergyTimelineEvent,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseOrganizationalEnergyCenter(raw: unknown): OrganizationalEnergyCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const exec = asRecord(row.executive_view);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            energy_score: Number(dash.energy_score ?? 0),
            energy_health_label: String(dash.energy_health_label ?? "balanced"),
            momentum_indicators_pct: Number(dash.momentum_indicators_pct ?? 0),
            recovery_awareness_pct: Number(dash.recovery_awareness_pct ?? 0),
            engagement_trends_pct: Number(dash.engagement_trends_pct ?? 0),
            sustainable_pacing_pct: Number(dash.sustainable_pacing_pct ?? 0),
            collaboration_quality_pct: Number(dash.collaboration_quality_pct ?? 0),
            leadership_consistency_pct: Number(dash.leadership_consistency_pct ?? 0),
            operational_friction_pct: Number(dash.operational_friction_pct ?? 0),
            recovery_effectiveness_pct: Number(dash.recovery_effectiveness_pct ?? 0),
            initiatives_in_progress: Number(dash.initiatives_in_progress ?? 0),
            reviews_completed: Number(dash.reviews_completed ?? 0),
          }
        : null,
    energy_signals: Array.isArray(row.energy_signals)
      ? row.energy_signals.map((c) => {
          const item = asRecord(c);
          return {
            signal_key: String(item.signal_key ?? ""),
            domain: String(item.domain ?? ""),
            signal_type: String(item.signal_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            signal_tone: String(item.signal_tone ?? "neutral"),
          } satisfies EnergySignal;
        })
      : [],
    balance_prompts: Array.isArray(row.balance_prompts)
      ? row.balance_prompts.map((g) => {
          const item = asRecord(g);
          return {
            question_key: String(item.question_key ?? ""),
            question_type: String(item.question_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
          } satisfies BalancePrompt;
        })
      : [],
    energy_initiatives: Array.isArray(row.energy_initiatives)
      ? row.energy_initiatives.map((i) => {
          const item = asRecord(i);
          return {
            initiative_key: String(item.initiative_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            status: String(item.status ?? "planned"),
          } satisfies EnergyInitiative;
        })
      : [],
    energy_reviews: Array.isArray(row.energy_reviews)
      ? row.energy_reviews.map((r) => {
          const item = asRecord(r);
          return {
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies EnergyReview;
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
          } satisfies EnergyTimelineEvent;
        })
      : [],
    energy_milestones: Array.isArray(row.energy_milestones)
      ? row.energy_milestones.map((m) => {
          const item = asRecord(m);
          return {
            milestone_key: String(item.milestone_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            archived_at: item.archived_at ? String(item.archived_at) : null,
          } satisfies EnergyMilestone;
        })
      : [],
    snapshots: Array.isArray(row.snapshots)
      ? row.snapshots.map((s) => {
          const item = asRecord(s);
          return {
            snapshot_key: String(item.snapshot_key ?? ""),
            period_label: String(item.period_label ?? ""),
            energy_score: Number(item.energy_score ?? 0),
            summary: String(item.summary ?? ""),
            captured_at: item.captured_at ? String(item.captured_at) : null,
          } satisfies EnergySnapshot;
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies EnergyInsight;
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies EnergyRecommendation;
        })
      : [],
    energy_sessions: Array.isArray(row.energy_sessions)
      ? row.energy_sessions.map((s) => {
          const item = asRecord(s);
          return {
            session_key: String(item.session_key ?? ""),
            session_type: String(item.session_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies EnergySession;
        })
      : [],
    executive_view:
      Object.keys(exec).length > 0
        ? {
            organizational_momentum: String(exec.organizational_momentum ?? ""),
            leadership_sustainability: String(exec.leadership_sustainability ?? ""),
            collaboration_effectiveness: String(exec.collaboration_effectiveness ?? ""),
            capacity_preservation_opportunities: String(exec.capacity_preservation_opportunities ?? ""),
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
