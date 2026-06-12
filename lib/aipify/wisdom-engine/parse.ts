import type {
  ThoughtfulGuidanceExample,
  WisdomEngineCard,
  WisdomEngineDashboard,
  WisdomEngineExport,
  WisdomEngineSettings,
  WisdomGuidancePrompt,
  WisdomInsight,
  WisdomSourceInfo,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseStringList(data: unknown): string[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data.filter((item): item is string => typeof item === "string");
}

function parseSettings(data: unknown): WisdomEngineSettings | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as WisdomEngineSettings;
}

export function parseWisdomEngineCard(data: unknown): WisdomEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as WisdomEngineCard;
}

export function parseWisdomEngineDashboard(data: unknown): WisdomEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    vision: typeof d.vision === "string" ? d.vision : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    wisdom_sources: parseRecordList<WisdomSourceInfo>(d.wisdom_sources),
    wisdom_principles: parseStringList(d.wisdom_principles),
    thoughtful_guidance_examples: parseRecordList<ThoughtfulGuidanceExample>(
      d.thoughtful_guidance_examples
    ),
    humility_examples: parseStringList(d.humility_examples),
    self_love_note: typeof d.self_love_note === "string" ? d.self_love_note : undefined,
    trust_note: typeof d.trust_note === "string" ? d.trust_note : undefined,
    growth_note: typeof d.growth_note === "string" ? d.growth_note : undefined,
    settings: parseSettings(d.settings),
    recent_insights: parseRecordList<WisdomInsight>(d.recent_insights),
    pending_prompts: parseRecordList<WisdomGuidancePrompt>(d.pending_prompts),
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
  } as WisdomEngineDashboard;
}

export function parseWisdomEngineExport(data: unknown): WisdomEngineExport {
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
    wisdom_sources: parseRecordList<WisdomSourceInfo>(d.wisdom_sources),
    wisdom_principles: parseStringList(d.wisdom_principles),
    thoughtful_guidance_examples: parseRecordList<ThoughtfulGuidanceExample>(
      d.thoughtful_guidance_examples
    ),
    humility_examples: parseStringList(d.humility_examples),
    self_love_note: typeof d.self_love_note === "string" ? d.self_love_note : undefined,
    trust_note: typeof d.trust_note === "string" ? d.trust_note : undefined,
    growth_note: typeof d.growth_note === "string" ? d.growth_note : undefined,
    settings: parseSettings(d.settings),
    recent_insights: parseRecordList<WisdomInsight>(d.recent_insights),
    pending_prompts: parseRecordList<WisdomGuidancePrompt>(d.pending_prompts),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    permissions:
      typeof d.permissions === "object" && d.permissions
        ? (d.permissions as Record<string, unknown>)
        : undefined,
    ...d,
  } as WisdomEngineExport;
}
