import type {
  PackCommandCard,
  PackCommandInsightItem,
  PackCommandInsights,
  PackCommandOverview,
  PackCommandRecommendation,
  PackCommandTimelineEvent,
} from "./types";

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function num(v: unknown, fb = 0): number {
  return typeof v === "number" ? v : typeof v === "string" ? Number(v) || fb : fb;
}

function parseRecommendations(raw: unknown): PackCommandRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return { id: str(d.id), key: str(d.key), pack_key: str(d.pack_key), priority_level: str(d.priority_level) };
  });
}

function parseInsightItems(raw: unknown): PackCommandInsightItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return {
      pack_key: str(d.pack_key),
      name: str(d.name),
      value_score: num(d.value_score) || undefined,
      adoption_score: num(d.adoption_score) || undefined,
      usage_trend: str(d.usage_trend) || undefined,
      health_status: str(d.health_status) || undefined,
    };
  });
}

function parsePackCard(raw: unknown): PackCommandCard | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    id: str(d.id || d.pack_key),
    pack_key: str(d.pack_key),
    name: str(d.name),
    health_status: str(d.health_status),
    adoption_score: num(d.adoption_score),
    value_score: num(d.value_score),
    usage_trend: str(d.usage_trend),
    last_activity_at: str(d.last_activity_at) || null,
    assigned_owner: str(d.assigned_owner),
    recommended_action: str(d.recommended_action),
    priority_level: str(d.priority_level),
    value_category: str(d.value_category) || undefined,
    is_active: d.is_active === true,
  };
}

function parseTimeline(raw: unknown): PackCommandTimelineEvent[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return {
      id: str(d.id),
      pack_key: str(d.pack_key) || undefined,
      event_type: str(d.event_type),
      description: str(d.description),
      created_at: str(d.created_at),
    };
  });
}

export function parsePackCommandOverview(data: unknown): PackCommandOverview {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  const adoption = d.adoption_overview as Record<string, unknown> | undefined;
  const value = d.value_overview as Record<string, unknown> | undefined;
  return {
    found: d.found === true,
    can_full: d.can_full === true,
    can_manage: d.can_manage === true,
    can_view: d.can_view === true,
    has_command_data: d.has_command_data === true,
    total_installed: num(d.total_installed),
    active_packs: num(d.active_packs),
    ecosystem_status: str(d.ecosystem_status),
    adoption_overview: adoption ? { average_score: num(adoption.average_score), pack_count: num(adoption.pack_count) } : undefined,
    value_overview: value ? { average_score: num(value.average_score), pack_count: num(value.pack_count) } : undefined,
    packs_requiring_attention: num(d.packs_requiring_attention),
    optimization_opportunities: num(d.optimization_opportunities),
    executive_summary: str(d.executive_summary),
    packs: Array.isArray(d.packs) ? d.packs.map((p) => parsePackCard(p)).filter(Boolean) as PackCommandCard[] : [],
    recommendations: parseRecommendations(d.recommendations),
    principle: str(d.principle),
  };
}

export function parsePackCommandInsights(data: unknown): PackCommandInsights {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  const gov = d.governance_observations;
  return {
    found: d.found === true,
    most_valuable: parseInsightItems(d.most_valuable),
    least_adopted: parseInsightItems(d.least_adopted),
    fastest_growing: parseInsightItems(d.fastest_growing),
    requiring_review: parseInsightItems(d.requiring_review),
    training_opportunities: parseInsightItems(d.training_opportunities),
    governance_observations: Array.isArray(gov) ? gov.map(String) : [],
  };
}

export function parsePackCommandRecommendations(data: unknown): PackCommandRecommendation[] {
  if (!data || typeof data !== "object") return [];
  const d = data as Record<string, unknown>;
  return parseRecommendations(d.recommendations);
}

export function parsePackCommandTimeline(data: unknown): PackCommandTimelineEvent[] {
  if (!data || typeof data !== "object") return [];
  const d = data as Record<string, unknown>;
  return parseTimeline(d.events);
}
