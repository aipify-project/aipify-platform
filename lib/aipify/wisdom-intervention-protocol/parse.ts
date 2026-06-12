import type {
  InterventionAppliesItem,
  InterventionBoundaries,
  ResponseStyleExample,
  SelfLoveRosePhrase,
  SleepOnItExample,
  WisdomInterventionCard,
  WisdomInterventionDashboard,
  WisdomInterventionExport,
  WisdomInterventionPrompt,
  WisdomInterventionSettings,
  WisdomInterventionSignal,
  RecentSummary,
  WisdomInterventionOutcome,
  WisdomInterventionSuggestion,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseStringList(data: unknown): string[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data.filter((item): item is string => typeof item === "string");
}

function parseSettings(data: unknown): WisdomInterventionSettings | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as WisdomInterventionSettings;
}

function parseBoundaries(data: unknown): InterventionBoundaries | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as InterventionBoundaries;
}

function parseRecentSummary(data: unknown): RecentSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as RecentSummary;
}

export function parseWisdomInterventionCard(data: unknown): WisdomInterventionCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as WisdomInterventionCard;
}

export function parseWisdomInterventionDashboard(data: unknown): WisdomInterventionDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    vision: typeof d.vision === "string" ? d.vision : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    when_to_intervene: parseRecordList<InterventionAppliesItem>(d.when_to_intervene),
    response_style_examples: parseRecordList<ResponseStyleExample>(d.response_style_examples),
    sleep_on_it_examples: parseRecordList<SleepOnItExample>(d.sleep_on_it_examples),
    self_love_note: typeof d.self_love_note === "string" ? d.self_love_note : undefined,
    wisdom_engine_note: typeof d.wisdom_engine_note === "string" ? d.wisdom_engine_note : undefined,
    boundaries: parseBoundaries(d.boundaries),
    trust_note: typeof d.trust_note === "string" ? d.trust_note : undefined,
    pause_reflection_philosophy:
      typeof d.pause_reflection_philosophy === "string" ? d.pause_reflection_philosophy : undefined,
    human_moment_note: typeof d.human_moment_note === "string" ? d.human_moment_note : undefined,
    pause_communication_examples: parseRecordList<ResponseStyleExample>(d.pause_communication_examples),
    self_love_rose_phrases: parseRecordList<SelfLoveRosePhrase>(d.self_love_rose_phrases),
    pause_abos_principle: typeof d.pause_abos_principle === "string" ? d.pause_abos_principle : undefined,
    combined_protocol_note:
      typeof d.combined_protocol_note === "string" ? d.combined_protocol_note : undefined,
    settings: parseSettings(d.settings),
    active_prompts: parseRecordList<WisdomInterventionPrompt>(d.active_prompts),
    recent_signals: parseRecordList<WisdomInterventionSignal>(d.recent_signals),
    recent_summary: parseRecentSummary(d.recent_summary),
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
  } as WisdomInterventionDashboard;
}

export function parseWisdomInterventionExport(data: unknown): WisdomInterventionExport {
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
    when_to_intervene: parseRecordList<InterventionAppliesItem>(d.when_to_intervene),
    response_style_examples: parseRecordList<ResponseStyleExample>(d.response_style_examples),
    sleep_on_it_examples: parseRecordList<SleepOnItExample>(d.sleep_on_it_examples),
    self_love_note: typeof d.self_love_note === "string" ? d.self_love_note : undefined,
    wisdom_engine_note: typeof d.wisdom_engine_note === "string" ? d.wisdom_engine_note : undefined,
    boundaries: parseBoundaries(d.boundaries),
    trust_note: typeof d.trust_note === "string" ? d.trust_note : undefined,
    pause_reflection_philosophy:
      typeof d.pause_reflection_philosophy === "string" ? d.pause_reflection_philosophy : undefined,
    human_moment_note: typeof d.human_moment_note === "string" ? d.human_moment_note : undefined,
    pause_communication_examples: parseRecordList<ResponseStyleExample>(d.pause_communication_examples),
    self_love_rose_phrases: parseRecordList<SelfLoveRosePhrase>(d.self_love_rose_phrases),
    pause_abos_principle: typeof d.pause_abos_principle === "string" ? d.pause_abos_principle : undefined,
    combined_protocol_note:
      typeof d.combined_protocol_note === "string" ? d.combined_protocol_note : undefined,
    settings: parseSettings(d.settings),
    recent_signals: parseRecordList<WisdomInterventionSignal>(d.recent_signals),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    permissions:
      typeof d.permissions === "object" && d.permissions
        ? (d.permissions as Record<string, unknown>)
        : undefined,
    ...d,
  } as WisdomInterventionExport;
}

export { parseStringList };

export function parseWisdomInterventionOutcome(data: unknown): WisdomInterventionOutcome {
  const d = (data ?? {}) as Record<string, unknown>;
  return d as WisdomInterventionOutcome;
}

export function parseWisdomInterventionSuggestion(data: unknown): WisdomInterventionSuggestion {
  const d = (data ?? {}) as Record<string, unknown>;
  return d as WisdomInterventionSuggestion;
}
