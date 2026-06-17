import type {
  EcosystemInsightItem,
  EcosystemOverview,
  EcosystemPackCard,
  EcosystemRecommendation,
  EcosystemRelationship,
  EcosystemRelationships,
  EcosystemTimelineEvent,
} from "./types";

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function num(v: unknown, fb = 0): number {
  return typeof v === "number" ? v : typeof v === "string" ? Number(v) || fb : fb;
}

function parseInsightItems(raw: unknown): EcosystemInsightItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return { id: str(d.id), key: str(d.key), pack_key: str(d.pack_key) || undefined };
  });
}

function parseRecommendations(raw: unknown): EcosystemRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return { id: str(d.id), key: str(d.key), pack_key: str(d.pack_key) || undefined, priority_level: str(d.priority_level) };
  });
}

function parsePackCards(raw: unknown): EcosystemPackCard[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return {
      pack_key: str(d.pack_key),
      name: str(d.name),
      adoption_score: num(d.adoption_score),
      cross_utilization_score: num(d.cross_utilization_score),
      coverage_category: str(d.coverage_category),
      coverage_status: str(d.coverage_status),
    };
  });
}

function parseRelationships(raw: unknown): EcosystemRelationship[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return {
      id: str(d.id),
      source_pack_key: str(d.source_pack_key),
      target_pack_key: str(d.target_pack_key),
      label: str(d.label),
      strength: str(d.strength),
    };
  });
}

function parseTimeline(raw: unknown): EcosystemTimelineEvent[] {
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

export function parseEcosystemOverview(data: unknown): EcosystemOverview {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  const coverage = d.coverage_overview;
  return {
    found: d.found === true,
    can_full: d.can_full === true,
    can_manage: d.can_manage === true,
    can_view: d.can_view === true,
    has_ecosystem_data: d.has_ecosystem_data === true,
    health_score: num(d.health_score),
    ecosystem_status: str(d.ecosystem_status),
    cross_utilization_score: num(d.cross_utilization_score),
    coverage_overview: coverage && typeof coverage === "object" ? (coverage as Record<string, number>) : {},
    packs: parsePackCards(d.packs),
    opportunities: parseInsightItems(d.opportunities),
    risks: parseInsightItems(d.risks),
    recommendations: parseRecommendations(d.recommendations),
    executive_summary: str(d.executive_summary),
    principle: str(d.principle),
  };
}

export function parseEcosystemRelationships(data: unknown): EcosystemRelationships {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  return { found: d.found === true, relationships: parseRelationships(d.relationships) };
}

export function parseEcosystemRecommendations(data: unknown): EcosystemRecommendation[] {
  if (!data || typeof data !== "object") return [];
  const d = data as Record<string, unknown>;
  return parseRecommendations(d.recommendations);
}

export function parseEcosystemTimeline(data: unknown): EcosystemTimelineEvent[] {
  if (!data || typeof data !== "object") return [];
  const d = data as Record<string, unknown>;
  return parseTimeline(d.events);
}
