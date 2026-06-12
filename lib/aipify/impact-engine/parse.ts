import type {
  ImpactCelebrationExample,
  ImpactDimensionInfo,
  ImpactEngineCard,
  ImpactEngineDashboard,
  ImpactEngineExport,
  ImpactEngineSettings,
  ImpactReport,
  ImpactReportingExample,
  ImpactSignal,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseSettings(data: unknown): ImpactEngineSettings | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ImpactEngineSettings;
}

function parseReport(data: unknown): ImpactReport | null | undefined {
  if (data === null) return null;
  if (typeof data !== "object" || !data) return undefined;
  return data as ImpactReport;
}

export function parseImpactEngineCard(data: unknown): ImpactEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as ImpactEngineCard;
}

export function parseImpactEngineDashboard(data: unknown): ImpactEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    vision: typeof d.vision === "string" ? d.vision : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    impact_dimensions: parseRecordList<ImpactDimensionInfo>(d.impact_dimensions),
    reporting_examples: parseRecordList<ImpactReportingExample>(d.reporting_examples),
    celebration_examples: parseRecordList<ImpactCelebrationExample>(d.celebration_examples),
    self_love_note: typeof d.self_love_note === "string" ? d.self_love_note : undefined,
    trust_note: typeof d.trust_note === "string" ? d.trust_note : undefined,
    settings: parseSettings(d.settings),
    recent_signals: parseRecordList<ImpactSignal>(d.recent_signals),
    latest_report: parseReport(d.latest_report),
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
  } as ImpactEngineDashboard;
}

export function parseImpactEngineExport(data: unknown): ImpactEngineExport {
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
    impact_dimensions: parseRecordList<ImpactDimensionInfo>(d.impact_dimensions),
    reporting_examples: parseRecordList<ImpactReportingExample>(d.reporting_examples),
    trust_note: typeof d.trust_note === "string" ? d.trust_note : undefined,
    self_love_note: typeof d.self_love_note === "string" ? d.self_love_note : undefined,
    settings: parseSettings(d.settings),
    recent_signals: parseRecordList<ImpactSignal>(d.recent_signals),
    latest_report: parseReport(d.latest_report),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    permissions:
      typeof d.permissions === "object" && d.permissions
        ? (d.permissions as Record<string, unknown>)
        : undefined,
    ...d,
  } as ImpactEngineExport;
}
