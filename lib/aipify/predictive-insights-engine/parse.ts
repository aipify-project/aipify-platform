import type {
  OrganizationPredictiveInsight,
  PredictiveInsightsEngineCard,
  PredictiveInsightsEngineDashboard,
  PredictiveInsightsExport,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseSections(data: unknown): PredictiveInsightsEngineDashboard["sections"] {
  if (typeof data !== "object" || !data) return undefined;
  const s = data as Record<string, unknown>;
  return {
    active_insights: parseRecordList<OrganizationPredictiveInsight>(s.active_insights),
    by_prediction_type: parseRecordList<Record<string, unknown>>(s.by_prediction_type),
    by_risk_level: parseRecordList<Record<string, unknown>>(s.by_risk_level),
  };
}

export function parsePredictiveInsightsEngineCard(data: unknown): PredictiveInsightsEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as PredictiveInsightsEngineCard;
}

export function parsePredictiveInsightsEngineDashboard(
  data: unknown
): PredictiveInsightsEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    sections: parseSections(d.sections),
    settings: typeof d.settings === "object" && d.settings ? (d.settings as Record<string, unknown>) : undefined,
    executive_summary:
      typeof d.executive_summary === "object" && d.executive_summary
        ? (d.executive_summary as Record<string, unknown>)
        : undefined,
    integration_notes:
      typeof d.integration_notes === "object" && d.integration_notes
        ? (d.integration_notes as Record<string, string>)
        : undefined,
    integration_summaries:
      typeof d.integration_summaries === "object" && d.integration_summaries
        ? (d.integration_summaries as Record<string, unknown>)
        : undefined,
    ...d,
  } as PredictiveInsightsEngineDashboard;
}

export function parsePredictiveInsightsExport(data: unknown): PredictiveInsightsExport {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    exported_at: typeof d.exported_at === "string" ? d.exported_at : undefined,
    manifest_type: typeof d.manifest_type === "string" ? d.manifest_type : undefined,
    insights: parseRecordList<OrganizationPredictiveInsight>(d.insights),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    integration_summaries:
      typeof d.integration_summaries === "object" && d.integration_summaries
        ? (d.integration_summaries as Record<string, unknown>)
        : undefined,
    ...d,
  } as PredictiveInsightsExport;
}
