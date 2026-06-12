import type {
  BoundaryPhrases,
  ComfortMomentResult,
  ComfortRoseExample,
  ComfortRoseMoment,
  PresenceComfortCard,
  PresenceComfortDashboard,
  PresenceComfortExport,
  PresenceComfortSettings,
  ProtocolAppliesItem,
  RecentSummary,
  SelfLoveExample,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseStringList(data: unknown): string[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data.filter((item): item is string => typeof item === "string");
}

function parseSettings(data: unknown): PresenceComfortSettings | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as PresenceComfortSettings;
}

function parseBoundaryPhrases(data: unknown): BoundaryPhrases | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as BoundaryPhrases;
}

function parseRecentSummary(data: unknown): RecentSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as RecentSummary;
}

export function parsePresenceComfortCard(data: unknown): PresenceComfortCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as PresenceComfortCard;
}

export function parsePresenceComfortDashboard(data: unknown): PresenceComfortDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    vision: typeof d.vision === "string" ? d.vision : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    when_protocol_applies: parseRecordList<ProtocolAppliesItem>(d.when_protocol_applies),
    communication_principles: parseStringList(d.communication_principles),
    comfort_rose_examples: parseRecordList<ComfortRoseExample>(d.comfort_rose_examples),
    boundary_phrases: parseBoundaryPhrases(d.boundary_phrases),
    self_love_examples: parseRecordList<SelfLoveExample>(d.self_love_examples),
    human_connection_prompts: parseStringList(d.human_connection_prompts),
    gratitude_recognition_note:
      typeof d.gratitude_recognition_note === "string" ? d.gratitude_recognition_note : undefined,
    trust_note: typeof d.trust_note === "string" ? d.trust_note : undefined,
    settings: parseSettings(d.settings),
    recent_moments: parseRecordList<ComfortRoseMoment>(d.recent_moments),
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
  } as PresenceComfortDashboard;
}

export function parsePresenceComfortExport(data: unknown): PresenceComfortExport {
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
    when_protocol_applies: parseRecordList<ProtocolAppliesItem>(d.when_protocol_applies),
    communication_principles: parseStringList(d.communication_principles),
    comfort_rose_examples: parseRecordList<ComfortRoseExample>(d.comfort_rose_examples),
    boundary_phrases: parseBoundaryPhrases(d.boundary_phrases),
    self_love_examples: parseRecordList<SelfLoveExample>(d.self_love_examples),
    human_connection_prompts: parseStringList(d.human_connection_prompts),
    gratitude_recognition_note:
      typeof d.gratitude_recognition_note === "string" ? d.gratitude_recognition_note : undefined,
    trust_note: typeof d.trust_note === "string" ? d.trust_note : undefined,
    settings: parseSettings(d.settings),
    recent_moments: parseRecordList<ComfortRoseMoment>(d.recent_moments),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    permissions:
      typeof d.permissions === "object" && d.permissions
        ? (d.permissions as Record<string, unknown>)
        : undefined,
    ...d,
  } as PresenceComfortExport;
}

export function parseComfortMomentResult(data: unknown): ComfortMomentResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return d as ComfortMomentResult;
}
