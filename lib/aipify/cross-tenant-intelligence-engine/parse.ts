import type {
  CrossTenantGlobalInsight,
  CrossTenantIntelligenceEngineCard,
  CrossTenantIntelligenceEngineDashboard,
  CrossTenantIntelligenceExport,
  CrossTenantParticipationSettings,
  CrossTenantPendingRecommendation,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseSections(data: unknown): CrossTenantIntelligenceEngineDashboard["sections"] {
  if (typeof data !== "object" || !data) return undefined;
  const s = data as Record<string, unknown>;
  return {
    industry_trends: parseRecordList<CrossTenantGlobalInsight>(s.industry_trends),
    opportunities: parseRecordList<CrossTenantGlobalInsight>(s.opportunities),
    improvement_areas: parseRecordList<CrossTenantGlobalInsight>(s.improvement_areas),
    pending_recommendations: parseRecordList<CrossTenantPendingRecommendation>(s.pending_recommendations),
  };
}

function parseSettings(data: unknown): CrossTenantParticipationSettings | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CrossTenantParticipationSettings;
}

export function parseCrossTenantIntelligenceEngineCard(
  data: unknown
): CrossTenantIntelligenceEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as CrossTenantIntelligenceEngineCard;
}

export function parseCrossTenantIntelligenceEngineDashboard(
  data: unknown
): CrossTenantIntelligenceEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    settings: parseSettings(d.settings),
    sections: parseSections(d.sections),
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
  } as CrossTenantIntelligenceEngineDashboard;
}

export function parseCrossTenantIntelligenceExport(data: unknown): CrossTenantIntelligenceExport {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    exported_at: typeof d.exported_at === "string" ? d.exported_at : undefined,
    manifest_type: typeof d.manifest_type === "string" ? d.manifest_type : undefined,
    participation: parseSettings(d.participation),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    insights: parseRecordList<Record<string, unknown>>(d.insights),
    integration_summaries:
      typeof d.integration_summaries === "object" && d.integration_summaries
        ? (d.integration_summaries as Record<string, unknown>)
        : undefined,
    ...d,
  } as CrossTenantIntelligenceExport;
}
