import type {
  OrganizationalWisdomTransferCenter,
  TransferPrompt,
  WisdomTransferInitiative,
  WisdomTransferInsight,
  WisdomTransferMilestone,
  WisdomTransferRecommendation,
  WisdomTransferReview,
  WisdomTransferSession,
  WisdomTransferSignal,
  WisdomTransferSnapshot,
  WisdomTransferTimelineEvent,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseOrganizationalWisdomTransferCenter(raw: unknown): OrganizationalWisdomTransferCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const exec = asRecord(row.executive_view);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            wisdom_transfer_score: Number(dash.wisdom_transfer_score ?? 0),
            wisdom_transfer_health_label: String(dash.wisdom_transfer_health_label ?? "healthy"),
            knowledge_preservation_pct: Number(dash.knowledge_preservation_pct ?? 0),
            mentorship_participation_pct: Number(dash.mentorship_participation_pct ?? 0),
            lessons_documented_pct: Number(dash.lessons_documented_pct ?? 0),
            initiatives_in_progress: Number(dash.initiatives_in_progress ?? 0),
            experience_sharing_pct: Number(dash.experience_sharing_pct ?? 0),
            judgment_transfer_pct: Number(dash.judgment_transfer_pct ?? 0),
            institutional_memory_pct: Number(dash.institutional_memory_pct ?? 0),
            learning_integration_pct: Number(dash.learning_integration_pct ?? 0),
            wisdom_stewardship_pct: Number(dash.wisdom_stewardship_pct ?? 0),
            reviews_completed: Number(dash.reviews_completed ?? 0),
          }
        : null,
    wisdom_transfer_signals: Array.isArray(row.wisdom_transfer_signals)
      ? row.wisdom_transfer_signals.map((c) => {
          const item = asRecord(c);
          return {
            signal_key: String(item.signal_key ?? ""),
            domain: String(item.domain ?? ""),
            signal_type: String(item.signal_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            signal_tone: String(item.signal_tone ?? "neutral"),
          } satisfies WisdomTransferSignal;
        })
      : [],
    transfer_prompts: Array.isArray(row.transfer_prompts)
      ? row.transfer_prompts.map((g) => {
          const item = asRecord(g);
          return {
            transfer_key: String(item.transfer_key ?? ""),
            transfer_type: String(item.transfer_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
          } satisfies TransferPrompt;
        })
      : [],
    wisdom_transfer_initiatives: Array.isArray(row.wisdom_transfer_initiatives)
      ? row.wisdom_transfer_initiatives.map((i) => {
          const item = asRecord(i);
          return {
            initiative_key: String(item.initiative_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            status: String(item.status ?? "planned"),
          } satisfies WisdomTransferInitiative;
        })
      : [],
    wisdom_transfer_reviews: Array.isArray(row.wisdom_transfer_reviews)
      ? row.wisdom_transfer_reviews.map((r) => {
          const item = asRecord(r);
          return {
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies WisdomTransferReview;
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
          } satisfies WisdomTransferTimelineEvent;
        })
      : [],
    wisdom_transfer_milestones: Array.isArray(row.wisdom_transfer_milestones)
      ? row.wisdom_transfer_milestones.map((m) => {
          const item = asRecord(m);
          return {
            milestone_key: String(item.milestone_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            archived_at: item.archived_at ? String(item.archived_at) : null,
          } satisfies WisdomTransferMilestone;
        })
      : [],
    snapshots: Array.isArray(row.snapshots)
      ? row.snapshots.map((s) => {
          const item = asRecord(s);
          return {
            snapshot_key: String(item.snapshot_key ?? ""),
            period_label: String(item.period_label ?? ""),
            wisdom_transfer_score: Number(item.wisdom_transfer_score ?? 0),
            summary: String(item.summary ?? ""),
            captured_at: item.captured_at ? String(item.captured_at) : null,
          } satisfies WisdomTransferSnapshot;
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies WisdomTransferInsight;
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies WisdomTransferRecommendation;
        })
      : [],
    wisdom_transfer_sessions: Array.isArray(row.wisdom_transfer_sessions)
      ? row.wisdom_transfer_sessions.map((s) => {
          const item = asRecord(s);
          return {
            session_key: String(item.session_key ?? ""),
            session_type: String(item.session_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies WisdomTransferSession;
        })
      : [],
    executive_view:
      Object.keys(exec).length > 0
        ? {
            leadership_stewardship: String(exec.leadership_stewardship ?? ""),
            institutional_memory_strength: String(exec.institutional_memory_strength ?? ""),
            knowledge_transfer_trends: String(exec.knowledge_transfer_trends ?? ""),
            succession_readiness: String(exec.succession_readiness ?? ""),
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
