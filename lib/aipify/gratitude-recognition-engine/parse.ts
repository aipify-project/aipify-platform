import type {
  BoundaryPhrases,
  DigitalRoseResult,
  GratitudeMoment,
  GratitudeMomentTypeInfo,
  GratitudeRecognitionCard,
  GratitudeRecognitionDashboard,
  GratitudeRecognitionExport,
  GratitudeRecognitionSettings,
  RedRoseMoment,
  RecentRosesSummary,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseSettings(data: unknown): GratitudeRecognitionSettings | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as GratitudeRecognitionSettings;
}

function parseRedRoseMoment(data: unknown): RedRoseMoment | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as RedRoseMoment;
}

function parseBoundaryPhrases(data: unknown): BoundaryPhrases | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as BoundaryPhrases;
}

function parseRecentRoses(data: unknown): RecentRosesSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as RecentRosesSummary;
}

export function parseGratitudeRecognitionCard(data: unknown): GratitudeRecognitionCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as GratitudeRecognitionCard;
}

export function parseGratitudeRecognitionDashboard(data: unknown): GratitudeRecognitionDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    vision: typeof d.vision === "string" ? d.vision : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    gratitude_moment_types: parseRecordList<GratitudeMomentTypeInfo>(d.gratitude_moment_types),
    red_rose_moment: parseRedRoseMoment(d.red_rose_moment),
    boundary_phrases: parseBoundaryPhrases(d.boundary_phrases),
    self_love_note: typeof d.self_love_note === "string" ? d.self_love_note : undefined,
    trust_note: typeof d.trust_note === "string" ? d.trust_note : undefined,
    settings: parseSettings(d.settings),
    recent_moments: parseRecordList<GratitudeMoment>(d.recent_moments),
    recent_roses: parseRecentRoses(d.recent_roses),
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
  } as GratitudeRecognitionDashboard;
}

export function parseGratitudeRecognitionExport(data: unknown): GratitudeRecognitionExport {
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
    gratitude_moment_types: parseRecordList<GratitudeMomentTypeInfo>(d.gratitude_moment_types),
    red_rose_moment: parseRedRoseMoment(d.red_rose_moment),
    boundary_phrases: parseBoundaryPhrases(d.boundary_phrases),
    self_love_note: typeof d.self_love_note === "string" ? d.self_love_note : undefined,
    trust_note: typeof d.trust_note === "string" ? d.trust_note : undefined,
    settings: parseSettings(d.settings),
    recent_moments: parseRecordList<GratitudeMoment>(d.recent_moments),
    recent_roses: parseRecentRoses(d.recent_roses),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    permissions:
      typeof d.permissions === "object" && d.permissions
        ? (d.permissions as Record<string, unknown>)
        : undefined,
    ...d,
  } as GratitudeRecognitionExport;
}

export function parseDigitalRoseResult(data: unknown): DigitalRoseResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return d as DigitalRoseResult;
}
