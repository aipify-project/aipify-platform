import type {
  InclusionHumanityEngineCard,
  InclusionHumanityEngineDashboard,
  InclusionHumanityExport,
  InclusionHumanitySettings,
  InclusionPrinciple,
  InclusionReflection,
  InappropriateBehaviorGuidance,
  IncidentsSummary,
  KcFaqTopic,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseSettings(data: unknown): InclusionHumanitySettings | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as InclusionHumanitySettings;
}

function parseIncidentsSummary(data: unknown): IncidentsSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as IncidentsSummary;
}

export function parseInclusionHumanityEngineCard(data: unknown): InclusionHumanityEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as InclusionHumanityEngineCard;
}

export function parseInclusionHumanityEngineDashboard(data: unknown): InclusionHumanityEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    vision: typeof d.vision === "string" ? d.vision : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    communication_principles: Array.isArray(d.communication_principles)
      ? (d.communication_principles as string[])
      : undefined,
    inclusion_principles: parseRecordList<InclusionPrinciple>(d.inclusion_principles),
    inappropriate_behavior_guidance: parseRecordList<InappropriateBehaviorGuidance>(
      d.inappropriate_behavior_guidance
    ),
    boundary_principles: Array.isArray(d.boundary_principles)
      ? (d.boundary_principles as string[])
      : undefined,
    self_love_note: typeof d.self_love_note === "string" ? d.self_love_note : undefined,
    trust_engine_note: typeof d.trust_engine_note === "string" ? d.trust_engine_note : undefined,
    purpose_values_note: typeof d.purpose_values_note === "string" ? d.purpose_values_note : undefined,
    kc_faq_topics: parseRecordList<KcFaqTopic>(d.kc_faq_topics),
    settings: parseSettings(d.settings),
    stated_principles: parseRecordList<InclusionPrinciple>(d.stated_principles),
    recent_incidents_summary: parseIncidentsSummary(d.recent_incidents_summary),
    pending_reflections: parseRecordList<InclusionReflection>(d.pending_reflections),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    integration_links:
      typeof d.integration_links === "object" && d.integration_links
        ? (d.integration_links as Record<string, unknown>)
        : undefined,
    permissions:
      typeof d.permissions === "object" && d.permissions
        ? (d.permissions as Record<string, unknown>)
        : undefined,
    ...d,
  } as InclusionHumanityEngineDashboard;
}

export function parseInclusionHumanityExport(data: unknown): InclusionHumanityExport {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    exported_at: typeof d.exported_at === "string" ? d.exported_at : undefined,
    manifest_type: typeof d.manifest_type === "string" ? d.manifest_type : undefined,
    format: typeof d.format === "string" ? d.format : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    settings: parseSettings(d.settings),
    communication_principles: Array.isArray(d.communication_principles)
      ? (d.communication_principles as string[])
      : undefined,
    inclusion_principles: parseRecordList<InclusionPrinciple>(d.inclusion_principles),
    boundary_principles: Array.isArray(d.boundary_principles)
      ? (d.boundary_principles as string[])
      : undefined,
    stated_principles: parseRecordList<InclusionPrinciple>(d.stated_principles),
    recent_incidents_summary: parseIncidentsSummary(d.recent_incidents_summary),
    pending_reflections: parseRecordList<InclusionReflection>(d.pending_reflections),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    permissions:
      typeof d.permissions === "object" && d.permissions
        ? (d.permissions as Record<string, unknown>)
        : undefined,
    ...d,
  } as InclusionHumanityExport;
}
