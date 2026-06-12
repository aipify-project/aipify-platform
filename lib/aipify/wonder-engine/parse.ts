import type {
  WonderBoundaries,
  WonderEngineCard,
  WonderEngineDashboard,
  WonderEngineExport,
  WonderEngineSettings,
  WonderMoment,
  WonderMomentTypeInfo,
  WonderReflection,
  WonderReflectionPromptExample,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseSettings(data: unknown): WonderEngineSettings | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as WonderEngineSettings;
}

function parseBoundaries(data: unknown): WonderBoundaries | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as WonderBoundaries;
}

export function parseWonderEngineCard(data: unknown): WonderEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as WonderEngineCard;
}

export function parseWonderEngineDashboard(data: unknown): WonderEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    vision: typeof d.vision === "string" ? d.vision : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    moments_of_wonder_types: parseRecordList<WonderMomentTypeInfo>(d.moments_of_wonder_types),
    reflection_prompt_examples: parseRecordList<WonderReflectionPromptExample>(
      d.reflection_prompt_examples
    ),
    self_love_note: typeof d.self_love_note === "string" ? d.self_love_note : undefined,
    impact_note: typeof d.impact_note === "string" ? d.impact_note : undefined,
    legacy_note: typeof d.legacy_note === "string" ? d.legacy_note : undefined,
    companion_note: typeof d.companion_note === "string" ? d.companion_note : undefined,
    boundaries: parseBoundaries(d.boundaries),
    settings: parseSettings(d.settings),
    recent_moments: parseRecordList<WonderMoment>(d.recent_moments),
    pending_reflections: parseRecordList<WonderReflection>(d.pending_reflections),
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
  } as WonderEngineDashboard;
}

export function parseWonderEngineExport(data: unknown): WonderEngineExport {
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
    moments_of_wonder_types: parseRecordList<WonderMomentTypeInfo>(d.moments_of_wonder_types),
    reflection_prompt_examples: parseRecordList<WonderReflectionPromptExample>(
      d.reflection_prompt_examples
    ),
    self_love_note: typeof d.self_love_note === "string" ? d.self_love_note : undefined,
    impact_note: typeof d.impact_note === "string" ? d.impact_note : undefined,
    legacy_note: typeof d.legacy_note === "string" ? d.legacy_note : undefined,
    companion_note: typeof d.companion_note === "string" ? d.companion_note : undefined,
    boundaries: parseBoundaries(d.boundaries),
    settings: parseSettings(d.settings),
    recent_moments: parseRecordList<WonderMoment>(d.recent_moments),
    pending_reflections: parseRecordList<WonderReflection>(d.pending_reflections),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    permissions:
      typeof d.permissions === "object" && d.permissions
        ? (d.permissions as Record<string, unknown>)
        : undefined,
    ...d,
  } as WonderEngineExport;
}
