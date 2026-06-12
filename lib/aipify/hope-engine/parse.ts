import type {
  HopeBoundaryPhrases,
  HopeContextInfo,
  HopeEngineCard,
  HopeEngineDashboard,
  HopeEngineExport,
  HopeEngineSettings,
  HopeExamplePhrase,
  HopeReflection,
  HopeSignal,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseSettings(data: unknown): HopeEngineSettings | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as HopeEngineSettings;
}

function parseBoundaryPhrases(data: unknown): HopeBoundaryPhrases | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as HopeBoundaryPhrases;
}

export function parseHopeEngineCard(data: unknown): HopeEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as HopeEngineCard;
}

export function parseHopeEngineDashboard(data: unknown): HopeEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    vision: typeof d.vision === "string" ? d.vision : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    when_hope_matters: parseRecordList<HopeContextInfo>(d.when_hope_matters),
    communication_principles: Array.isArray(d.communication_principles)
      ? (d.communication_principles as string[])
      : undefined,
    example_phrases: parseRecordList<HopeExamplePhrase>(d.example_phrases),
    self_love_note: typeof d.self_love_note === "string" ? d.self_love_note : undefined,
    dedication_note: typeof d.dedication_note === "string" ? d.dedication_note : undefined,
    impact_note: typeof d.impact_note === "string" ? d.impact_note : undefined,
    boundary_phrases: parseBoundaryPhrases(d.boundary_phrases),
    settings: parseSettings(d.settings),
    recent_signals: parseRecordList<HopeSignal>(d.recent_signals),
    pending_reflections: parseRecordList<HopeReflection>(d.pending_reflections),
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
  } as HopeEngineDashboard;
}

export function parseHopeEngineExport(data: unknown): HopeEngineExport {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    exported_at: typeof d.exported_at === "string" ? d.exported_at : undefined,
    manifest_type: typeof d.manifest_type === "string" ? d.manifest_type : undefined,
    format: typeof d.format === "string" ? d.format : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    vision: typeof d.vision === "string" ? d.vision : undefined,
    when_hope_matters: parseRecordList<HopeContextInfo>(d.when_hope_matters),
    communication_principles: Array.isArray(d.communication_principles)
      ? (d.communication_principles as string[])
      : undefined,
    example_phrases: parseRecordList<HopeExamplePhrase>(d.example_phrases),
    self_love_note: typeof d.self_love_note === "string" ? d.self_love_note : undefined,
    dedication_note: typeof d.dedication_note === "string" ? d.dedication_note : undefined,
    impact_note: typeof d.impact_note === "string" ? d.impact_note : undefined,
    boundary_phrases: parseBoundaryPhrases(d.boundary_phrases),
    settings: parseSettings(d.settings),
    recent_signals: parseRecordList<HopeSignal>(d.recent_signals),
    pending_reflections: parseRecordList<HopeReflection>(d.pending_reflections),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    permissions:
      typeof d.permissions === "object" && d.permissions
        ? (d.permissions as Record<string, unknown>)
        : undefined,
    ...d,
  } as HopeEngineExport;
}
