import type {
  BoundaryPhrases,
  DedicationCommitment,
  DedicationEngineCard,
  DedicationEngineDashboard,
  DedicationEngineExport,
  DedicationPrinciple,
  DedicationSettings,
  DedicationSignal,
  SignalTypeInfo,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseStringList(data: unknown): string[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data.filter((item): item is string => typeof item === "string");
}

function parseSettings(data: unknown): DedicationSettings | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as DedicationSettings;
}

function parseBoundaryPhrases(data: unknown): BoundaryPhrases | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as BoundaryPhrases;
}

export function parseDedicationEngineCard(data: unknown): DedicationEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as DedicationEngineCard;
}

export function parseDedicationEngineDashboard(data: unknown): DedicationEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    vision: typeof d.vision === "string" ? d.vision : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    dedication_principles: parseRecordList<DedicationPrinciple>(d.dedication_principles),
    example_phrases: parseStringList(d.example_phrases),
    signal_types: parseRecordList<SignalTypeInfo>(d.signal_types),
    hard_work_balance_note:
      typeof d.hard_work_balance_note === "string" ? d.hard_work_balance_note : undefined,
    self_love_note: typeof d.self_love_note === "string" ? d.self_love_note : undefined,
    proactive_companion_note:
      typeof d.proactive_companion_note === "string" ? d.proactive_companion_note : undefined,
    trust_note: typeof d.trust_note === "string" ? d.trust_note : undefined,
    boundary_phrases: parseBoundaryPhrases(d.boundary_phrases),
    settings: parseSettings(d.settings),
    recent_signals: parseRecordList<DedicationSignal>(d.recent_signals),
    active_commitments: parseRecordList<DedicationCommitment>(d.active_commitments),
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
  } as DedicationEngineDashboard;
}

export function parseDedicationEngineExport(data: unknown): DedicationEngineExport {
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
    dedication_principles: parseRecordList<DedicationPrinciple>(d.dedication_principles),
    example_phrases: parseStringList(d.example_phrases),
    signal_types: parseRecordList<SignalTypeInfo>(d.signal_types),
    hard_work_balance_note:
      typeof d.hard_work_balance_note === "string" ? d.hard_work_balance_note : undefined,
    self_love_note: typeof d.self_love_note === "string" ? d.self_love_note : undefined,
    proactive_companion_note:
      typeof d.proactive_companion_note === "string" ? d.proactive_companion_note : undefined,
    trust_note: typeof d.trust_note === "string" ? d.trust_note : undefined,
    boundary_phrases: parseBoundaryPhrases(d.boundary_phrases),
    settings: parseSettings(d.settings),
    recent_signals: parseRecordList<DedicationSignal>(d.recent_signals),
    active_commitments: parseRecordList<DedicationCommitment>(d.active_commitments),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    permissions:
      typeof d.permissions === "object" && d.permissions
        ? (d.permissions as Record<string, unknown>)
        : undefined,
    ...d,
  } as DedicationEngineExport;
}
