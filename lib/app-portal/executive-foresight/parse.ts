import type {
  ExecutiveForesightActionResult,
  ExecutiveForesightDetail,
  ExecutiveForesightOverview,
  ExecutiveNote,
  ExecutiveQuestion,
  ForesightInsightItem,
  ForesightObservation,
  ForesightRecommendation,
  ForesightReview,
  ForesightTimelineEvent,
  RecommendedConversation,
} from "./types";

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function num(v: unknown): number | undefined {
  return typeof v === "number" ? v : undefined;
}

function parseInsightItems(raw: unknown): ForesightInsightItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return { id: str(d.id), title: str(d.title) };
  });
}

function parseConversations(raw: unknown): RecommendedConversation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return { id: str(d.id), topic: str(d.topic) };
  });
}

function parseQuestions(raw: unknown): ExecutiveQuestion[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return { key: str(d.key), question: str(d.question) };
  });
}

function parseRecommendations(raw: unknown): ForesightRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return { id: str(d.id), key: str(d.key) };
  });
}

function parseObservation(raw: unknown): ForesightObservation | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    id: str(d.id),
    observation_key: str(d.observation_key),
    title: str(d.title),
    category: str(d.category),
    insight_type: str(d.insight_type),
    summary: str(d.summary),
    strategic_priority: str(d.strategic_priority),
    time_horizon: str(d.time_horizon),
    organizational_area: str(d.organizational_area),
    executive_owner: str(d.executive_owner),
    review_status: str(d.review_status),
    momentum_direction: str(d.momentum_direction),
    last_reviewed_at: str(d.last_reviewed_at) || null,
    updated_at: str(d.updated_at) || undefined,
  };
}

function parseTimeline(raw: unknown): ForesightTimelineEvent[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return {
      id: str(d.id),
      observation_id: str(d.observation_id) || undefined,
      event_type: str(d.event_type),
      description: str(d.description),
      created_at: str(d.created_at),
    };
  });
}

export function parseExecutiveForesightOverview(data: unknown): ExecutiveForesightOverview {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    can_full: d.can_full === true,
    can_view: d.can_view === true,
    can_review: d.can_review === true,
    can_note: d.can_note === true,
    has_foresight_data: d.has_foresight_data === true,
    executive_outlook_score: num(d.executive_outlook_score),
    executive_summary: str(d.executive_summary),
    emerging_opportunities: parseInsightItems(d.emerging_opportunities),
    emerging_risks: parseInsightItems(d.emerging_risks),
    strategic_topics_requiring_attention: parseInsightItems(d.strategic_topics_requiring_attention),
    long_term_focus_areas: parseInsightItems(d.long_term_focus_areas),
    areas_gaining_momentum: parseInsightItems(d.areas_gaining_momentum),
    areas_losing_momentum: parseInsightItems(d.areas_losing_momentum),
    recommended_conversations: parseConversations(d.recommended_conversations),
    executive_questions: parseQuestions(d.executive_questions),
    foresight_advisory_note: str(d.foresight_advisory_note),
    observations: Array.isArray(d.observations)
      ? d.observations.map((x) => parseObservation(x)).filter(Boolean) as ForesightObservation[]
      : [],
    recommendations: parseRecommendations(d.recommendations),
    principle: str(d.principle),
  };
}

export function parseExecutiveForesightDetail(data: unknown): ExecutiveForesightDetail {
  if (!data || typeof data !== "object") {
    return {
      found: false, id: "", observation_key: "", title: "", category: "",
      insight_type: "opportunity", summary: "", strategic_priority: "moderate",
      time_horizon: "12_months", organizational_area: "", executive_owner: "",
      review_status: "pending", momentum_direction: "stable",
    };
  }
  const d = data as Record<string, unknown>;
  const obs = parseObservation(d);
  const reviews = Array.isArray(d.reviews)
    ? d.reviews.map((item) => {
        const r = item as Record<string, unknown>;
        return {
          id: str(r.id),
          review_type: str(r.review_type),
          review_notes: str(r.review_notes),
          reviewed_at: str(r.reviewed_at) || undefined,
        } satisfies ForesightReview;
      })
    : [];
  const notes = Array.isArray(d.notes)
    ? d.notes.map((item) => {
        const n = item as Record<string, unknown>;
        return {
          id: str(n.id),
          note_text: str(n.note_text),
          created_at: str(n.created_at) || undefined,
        } satisfies ExecutiveNote;
      })
    : [];
  return {
    found: d.found === true,
    ...(obs ?? {
      id: str(d.id), observation_key: str(d.observation_key), title: str(d.title),
      category: str(d.category), insight_type: str(d.insight_type), summary: str(d.summary),
      strategic_priority: str(d.strategic_priority), time_horizon: str(d.time_horizon),
      organizational_area: str(d.organizational_area), executive_owner: str(d.executive_owner),
      review_status: str(d.review_status), momentum_direction: str(d.momentum_direction),
    }),
    can_review: d.can_review === true,
    can_note: d.can_note === true,
    reviews,
    notes,
    advisory_note: str(d.advisory_note),
  };
}

export function parseExecutiveForesightTimeline(data: unknown): ForesightTimelineEvent[] {
  if (!data || typeof data !== "object") return [];
  const d = data as Record<string, unknown>;
  return parseTimeline(d.events);
}

export function parseExecutiveForesightActionResult(data: unknown): ExecutiveForesightActionResult {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    message: str(d.message) || undefined,
    review_id: str(d.review_id) || undefined,
    note_id: str(d.note_id) || undefined,
  };
}
