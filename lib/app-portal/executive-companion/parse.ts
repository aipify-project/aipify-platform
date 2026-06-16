import type {
  ExecutiveCompanionOverview,
  ExecutiveDailyBriefing,
  ExecutiveHealthSnapshot,
  ExecutiveMeetingPrep,
  ExecutiveMemoryItem,
  ExecutivePriority,
  ExecutiveRecommendation,
  ExecutiveTimelineEvent,
} from "./types";

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function num(v: unknown, fb = 0): number {
  return typeof v === "number" ? v : fb;
}

function parseStringArray(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((x) => String(x));
}

function parseBriefing(raw: unknown): ExecutiveDailyBriefing | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  const lines = Array.isArray(d.lines)
    ? d.lines.map((item) => {
        const row = item as Record<string, unknown>;
        return { key: str(row.key), count: typeof row.count === "number" ? row.count : undefined };
      })
    : [];
  return {
    greeting_key: str(d.greeting_key, "goodMorning"),
    lines,
    momentum_summary_key: str(d.momentum_summary_key, "momentumStable"),
    momentum_score: num(d.momentum_score),
  };
}

function parsePriorities(raw: unknown): ExecutivePriority[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return {
      id: str(d.id),
      title: str(d.title),
      category: str(d.category),
      priority: str(d.priority),
      due_date: str(d.due_date) || null,
    };
  });
}

function parseMeetings(raw: unknown): ExecutiveMeetingPrep[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return {
      id: str(d.id),
      title: str(d.title),
      scheduled_at: str(d.scheduled_at),
      related_commitments: parseStringArray(d.related_commitments),
      related_decisions: parseStringArray(d.related_decisions),
      related_follow_ups: parseStringArray(d.related_follow_ups),
      previous_summary: str(d.previous_summary),
      preparation_topics: parseStringArray(d.preparation_topics),
    };
  });
}

function parseHealth(raw: unknown): ExecutiveHealthSnapshot | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    strategy_status: str(d.strategy_status),
    momentum_status: str(d.momentum_status),
    resilience_status: str(d.resilience_status),
    capacity_indicator: str(d.capacity_indicator),
    risk_indicator: str(d.risk_indicator),
    success_indicator: str(d.success_indicator),
    momentum_score: num(d.momentum_score),
    resilience_score: num(d.resilience_score),
  };
}

function parseMemory(raw: unknown): ExecutiveMemoryItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return { id: str(d.id), type: str(d.type), title: str(d.title), recorded_at: str(d.recorded_at) };
  });
}

function parseRecommendations(raw: unknown): ExecutiveRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return { id: str(d.id), key: str(d.key), priority: str(d.priority) };
  });
}

export function parseExecutiveCompanionOverview(data: unknown): ExecutiveCompanionOverview {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  const strategic = d.strategic_progress as Record<string, unknown> | undefined;

  return {
    found: d.found === true,
    can_full: d.can_full === true,
    can_limited: d.can_limited === true,
    briefing_started: d.briefing_started === true,
    daily_briefing: parseBriefing(d.daily_briefing),
    todays_priorities: parsePriorities(d.todays_priorities),
    items_requiring_attention: parsePriorities(d.items_requiring_attention),
    upcoming_responsibilities: parsePriorities(d.upcoming_responsibilities),
    strategic_progress: strategic
      ? { active_initiatives: num(strategic.active_initiatives), delayed_initiatives: num(strategic.delayed_initiatives) }
      : undefined,
    organizational_health: parseHealth(d.organizational_health),
    meeting_preparation: parseMeetings(d.meeting_preparation),
    executive_memory: parseMemory(d.executive_memory),
    recommendations: parseRecommendations(d.recommendations),
    positive_indicators: parseStringArray(d.positive_indicators),
    principle: str(d.principle),
  };
}

export function parseExecutiveCompanionTimeline(data: unknown): ExecutiveTimelineEvent[] {
  if (!data || typeof data !== "object") return [];
  const d = data as Record<string, unknown>;
  if (!Array.isArray(d.timeline)) return [];
  return d.timeline.map((item) => {
    const row = item as Record<string, unknown>;
    return {
      id: str(row.id),
      event_type: str(row.event_type),
      description: str(row.description),
      created_at: str(row.created_at),
    };
  });
}

export function parseExecutiveCompanionRecommendations(data: unknown): ExecutiveRecommendation[] {
  if (!data || typeof data !== "object") return [];
  return parseRecommendations((data as Record<string, unknown>).recommendations);
}

export function parseExecutiveCompanionBriefing(data: unknown): ExecutiveDailyBriefing | undefined {
  if (!data || typeof data !== "object") return undefined;
  return parseBriefing((data as Record<string, unknown>).briefing);
}
