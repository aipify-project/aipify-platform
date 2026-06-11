import type {
  ValueBaselineRecord,
  ValueMetricRecord,
  ValueMilestoneRecord,
  ValueRealizationEngineCard,
  ValueRealizationEngineDashboard,
  ValueReportExportPayload,
  ValueImprovementSuggestion,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

export function parseValueRealizationEngineCard(data: unknown): ValueRealizationEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as ValueRealizationEngineCard;
}

export function parseValueRealizationEngineDashboard(data: unknown): ValueRealizationEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    metrics: parseRecordList<ValueMetricRecord>(d.metrics),
    baselines: parseRecordList<ValueBaselineRecord>(d.baselines),
    milestones: parseRecordList<ValueMilestoneRecord>(d.milestones),
    settings: typeof d.settings === "object" && d.settings ? (d.settings as ValueRealizationEngineDashboard["settings"]) : undefined,
    integration_notes:
      typeof d.integration_notes === "object" && d.integration_notes
        ? (d.integration_notes as Record<string, string>)
        : undefined,
    integration_summaries:
      typeof d.integration_summaries === "object" && d.integration_summaries
        ? (d.integration_summaries as Record<string, unknown>)
        : undefined,
    ...d,
  } as ValueRealizationEngineDashboard;
}

export function parseValueReportExportPayload(data: unknown): ValueReportExportPayload {
  return (data ?? {}) as ValueReportExportPayload;
}

export function parseValueImprovementSuggestions(data: unknown): { suggestions?: ValueImprovementSuggestion[]; scaffold?: boolean } {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    suggestions: parseRecordList<ValueImprovementSuggestion>(d.suggestions),
    scaffold: Boolean(d.scaffold),
  };
}
