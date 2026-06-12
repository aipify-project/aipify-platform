import type {
  RelationshipCategoryInfo,
  RelationshipInsight,
  RelationshipIntelligenceEngineCard,
  RelationshipIntelligenceEngineDashboard,
  RelationshipIntelligenceExport,
  RelationshipIntelligenceSettings,
  RelationshipInteraction,
  RelationshipProfile,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseSettings(data: unknown): RelationshipIntelligenceSettings | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as RelationshipIntelligenceSettings;
}

export function parseRelationshipIntelligenceEngineCard(
  data: unknown
): RelationshipIntelligenceEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as RelationshipIntelligenceEngineCard;
}

export function parseRelationshipIntelligenceEngineDashboard(
  data: unknown
): RelationshipIntelligenceEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    self_love_note: typeof d.self_love_note === "string" ? d.self_love_note : undefined,
    relationship_categories: parseRecordList<RelationshipCategoryInfo>(d.relationship_categories),
    ethical_boundaries: Array.isArray(d.ethical_boundaries)
      ? (d.ethical_boundaries as string[])
      : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    settings: parseSettings(d.settings),
    profiles: parseRecordList<RelationshipProfile>(d.profiles),
    sample_insights: parseRecordList<RelationshipInsight>(d.sample_insights),
    recent_interactions: parseRecordList<RelationshipInteraction>(d.recent_interactions),
    integration_links:
      typeof d.integration_links === "object" && d.integration_links
        ? (d.integration_links as Record<string, Record<string, unknown>>)
        : undefined,
    ...d,
  } as RelationshipIntelligenceEngineDashboard;
}

export function parseRelationshipIntelligenceExport(
  data: unknown
): RelationshipIntelligenceExport {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    exported_at: typeof d.exported_at === "string" ? d.exported_at : undefined,
    manifest_type: typeof d.manifest_type === "string" ? d.manifest_type : undefined,
    format: typeof d.format === "string" ? d.format : undefined,
    settings: parseSettings(d.settings),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    profiles: parseRecordList<RelationshipProfile>(d.profiles),
    insights: parseRecordList<RelationshipInsight>(d.insights),
    integration_links:
      typeof d.integration_links === "object" && d.integration_links
        ? (d.integration_links as Record<string, Record<string, unknown>>)
        : undefined,
    ethical_boundaries: Array.isArray(d.ethical_boundaries)
      ? (d.ethical_boundaries as string[])
      : undefined,
    ...d,
  } as RelationshipIntelligenceExport;
}
