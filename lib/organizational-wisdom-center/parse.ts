import type {
  HistoricalPattern,
  OrganizationalWisdomCenter,
  ReflectionPrompt,
  ValuesAlignmentItem,
  WisdomInsight,
  WisdomLesson,
  WisdomRecommendation,
  WisdomReview,
  WisdomSnapshot,
  WisdomSynthesisSource,
  WisdomTimelineEvent,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseOrganizationalWisdomCenter(raw: unknown): OrganizationalWisdomCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const exec = asRecord(row.executive_view);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            wisdom_score: Number(dash.wisdom_score ?? 0),
            wisdom_health_label: String(dash.wisdom_health_label ?? "maturing"),
            insights_generated: Number(dash.insights_generated ?? 0),
            lessons_integrated: Number(dash.lessons_integrated ?? 0),
            reflection_participation_pct: Number(dash.reflection_participation_pct ?? 0),
            historical_patterns: Number(dash.historical_patterns ?? 0),
            executive_learning_trend_pct: Number(dash.executive_learning_trend_pct ?? 0),
            decision_quality_satisfaction: Number(dash.decision_quality_satisfaction ?? 0),
            leadership_confidence: Number(dash.leadership_confidence ?? 0),
          }
        : null,
    lessons: Array.isArray(row.lessons)
      ? row.lessons.map((l) => {
          const item = asRecord(l);
          return {
            lesson_key: String(item.lesson_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            integrated_at: item.integrated_at ? String(item.integrated_at) : null,
          } satisfies WisdomLesson;
        })
      : [],
    reflection_prompts: Array.isArray(row.reflection_prompts)
      ? row.reflection_prompts.map((r) => {
          const item = asRecord(r);
          return {
            reflection_key: String(item.reflection_key ?? ""),
            prompt: String(item.prompt ?? ""),
            domain: String(item.domain ?? ""),
          } satisfies ReflectionPrompt;
        })
      : [],
    values_alignment: Array.isArray(row.values_alignment)
      ? row.values_alignment.map((v) => {
          const item = asRecord(v);
          return {
            value_key: String(item.value_key ?? ""),
            label: String(item.label ?? ""),
            guidance: String(item.guidance ?? ""),
          } satisfies ValuesAlignmentItem;
        })
      : [],
    historical_patterns: Array.isArray(row.historical_patterns)
      ? row.historical_patterns.map((p) => {
          const item = asRecord(p);
          return {
            pattern_key: String(item.pattern_key ?? ""),
            domain: String(item.domain ?? ""),
            label: String(item.label ?? ""),
            summary: String(item.summary ?? ""),
          } satisfies HistoricalPattern;
        })
      : [],
    wisdom_synthesis: Array.isArray(row.wisdom_synthesis)
      ? row.wisdom_synthesis.map((s) => {
          const item = asRecord(s);
          return {
            source_key: String(item.source_key ?? ""),
            source_label: String(item.source_label ?? ""),
            route_path: String(item.route_path ?? ""),
            summary: String(item.summary ?? ""),
          } satisfies WisdomSynthesisSource;
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
          } satisfies WisdomTimelineEvent;
        })
      : [],
    snapshots: Array.isArray(row.snapshots)
      ? row.snapshots.map((s) => {
          const item = asRecord(s);
          return {
            snapshot_key: String(item.snapshot_key ?? ""),
            period_label: String(item.period_label ?? ""),
            wisdom_score: Number(item.wisdom_score ?? 0),
            summary: String(item.summary ?? ""),
            captured_at: item.captured_at ? String(item.captured_at) : null,
          } satisfies WisdomSnapshot;
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            domain: String(item.domain ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies WisdomInsight;
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies WisdomRecommendation;
        })
      : [],
    wisdom_reviews: Array.isArray(row.wisdom_reviews)
      ? row.wisdom_reviews.map((r) => {
          const item = asRecord(r);
          return {
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies WisdomReview;
        })
      : [],
    executive_view:
      Object.keys(exec).length > 0
        ? {
            emerging_themes: String(exec.emerging_themes ?? ""),
            learning_patterns: String(exec.learning_patterns ?? ""),
            lessons_revisited: String(exec.lessons_revisited ?? ""),
            wisdom_indicators: String(exec.wisdom_indicators ?? ""),
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
