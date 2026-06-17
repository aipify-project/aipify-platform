import type {
  BusinessPackAdoptionInsights,
  BusinessPackCard,
  BusinessPackHighlight,
  BusinessPackMilestone,
  BusinessPackOnboardingItem,
  BusinessPackRecommendation,
  BusinessPackSuccessDetail,
  BusinessPackSuccessOverview,
  BusinessPackTimelineEvent,
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

function parseRecommendations(raw: unknown): BusinessPackRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return {
      id: str(d.id),
      key: str(d.key),
      priority: str(d.priority),
      pack_key: str(d.pack_key) || null,
      type: str(d.type) || undefined,
    };
  });
}

function parseMilestones(raw: unknown): BusinessPackMilestone[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return {
      key: str(d.key),
      title: str(d.title),
      pack_key: str(d.pack_key) || undefined,
      achieved_at: str(d.achieved_at),
    };
  });
}

function parseOnboarding(raw: unknown): BusinessPackOnboardingItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return { key: str(d.key), title: str(d.title), category: str(d.category) };
  });
}

function parsePackCard(raw: unknown): BusinessPackCard | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    id: str(d.id || d.pack_key),
    pack_key: str(d.pack_key),
    name: str(d.name),
    status: str(d.status),
    adoption_score: num(d.adoption_score),
    usage_trend: str(d.usage_trend, "stable"),
    users_assigned: num(d.users_assigned),
    features_activated: num(d.features_activated),
    last_activity: str(d.last_activity) || null,
    milestones: parseMilestones(d.milestones),
    recommended_actions: parseRecommendations(d.recommended_actions),
    onboarding_checklist: parseOnboarding(d.onboarding_checklist),
  };
}

function parseHighlights(raw: unknown): BusinessPackHighlight[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return { pack_key: str(d.pack_key), name: str(d.name), score: num(d.score) };
  });
}

function parseInsights(raw: unknown): BusinessPackAdoptionInsights | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    features_frequently_used: parseStringArray(d.features_frequently_used),
    features_rarely_used: parseStringArray(d.features_rarely_used),
    users_actively_engaging: parseStringArray(d.users_actively_engaging),
    areas_requiring_onboarding: parseStringArray(d.areas_requiring_onboarding),
    learning_opportunities: parseStringArray(d.learning_opportunities),
    recommended_configurations: parseStringArray(d.recommended_configurations),
  };
}

function parseTimeline(raw: unknown): BusinessPackTimelineEvent[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return {
      id: str(d.id),
      event_type: str(d.event_type),
      description: str(d.description),
      pack_key: str(d.pack_key) || null,
      created_at: str(d.created_at),
    };
  });
}

export function parseBusinessPackSuccessOverview(data: unknown): BusinessPackSuccessOverview {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  const packs = Array.isArray(d.installed_packs)
    ? d.installed_packs.map((p) => parsePackCard(p)).filter(Boolean) as BusinessPackCard[]
    : [];

  return {
    found: d.found === true,
    can_full: d.can_full === true,
    can_manage: d.can_manage === true,
    can_view: d.can_view === true,
    journey_started: d.journey_started === true,
    has_installed_packs: d.has_installed_packs === true,
    overall_adoption_score: num(d.overall_adoption_score),
    installed_packs: packs,
    most_active_packs: parseHighlights(d.most_active_packs),
    underutilized_packs: parseHighlights(d.underutilized_packs),
    milestones_achieved: parseMilestones(d.milestones_achieved),
    recommendations: parseRecommendations(d.recommendations),
    adoption_insights: parseInsights(d.adoption_insights),
    learning_opportunities: parseStringArray(d.learning_opportunities),
    timeline: parseTimeline(d.timeline),
    principle: str(d.principle),
  };
}

export function parseBusinessPackSuccessDetail(data: unknown): BusinessPackSuccessDetail {
  if (!data || typeof data !== "object") return { found: false, id: "", pack_key: "", name: "", status: "", adoption_score: 0, usage_trend: "stable", users_assigned: 0, features_activated: 0 };
  const d = data as Record<string, unknown>;
  const card = parsePackCard(d);
  return {
    found: d.found === true,
    ...(card ?? {
      id: str(d.pack_key),
      pack_key: str(d.pack_key),
      name: str(d.name),
      status: str(d.status),
      adoption_score: num(d.adoption_score),
      usage_trend: str(d.usage_trend, "stable"),
      users_assigned: num(d.users_assigned),
      features_activated: num(d.features_activated),
    }),
    adoption_insights: parseInsights(d.adoption_insights),
    timeline: parseTimeline(d.timeline),
    recommendations: parseRecommendations(d.recommendations),
  };
}

export function parseBusinessPackRecommendations(data: unknown): BusinessPackRecommendation[] {
  if (!data || typeof data !== "object") return [];
  return parseRecommendations((data as Record<string, unknown>).recommendations);
}
