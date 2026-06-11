import type {
  IndustryInsightRecord,
  IndustryInsightsExportPayload,
  IndustryIntelligenceFoundationEngineCard,
  IndustryIntelligenceFoundationEngineDashboard,
  IndustryProfileRecord,
} from "./types";

function parseInsightList(data: unknown): IndustryInsightRecord[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as IndustryInsightRecord[];
}

function parseObjectList(data: unknown): Array<Record<string, unknown>> | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as Array<Record<string, unknown>>;
}

export function parseIndustryIntelligenceFoundationEngineCard(data: unknown): IndustryIntelligenceFoundationEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as IndustryIntelligenceFoundationEngineCard;
}

export function parseIndustryIntelligenceFoundationEngineDashboard(data: unknown): IndustryIntelligenceFoundationEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    assigned_profile:
      typeof d.assigned_profile === "object" && d.assigned_profile
        ? (d.assigned_profile as IndustryProfileRecord)
        : undefined,
    settings: typeof d.settings === "object" && d.settings ? (d.settings as Record<string, unknown>) : undefined,
    benchmarks: parseObjectList(d.benchmarks),
    recommended_improvements: parseInsightList(d.recommended_improvements),
    common_risks: parseObjectList(d.common_risks),
    strategic_opportunities: parseInsightList(d.strategic_opportunities),
    insights: parseInsightList(d.insights),
    terminology: parseObjectList(d.terminology),
    workflow_recommendations: parseObjectList(d.workflow_recommendations),
    kpi_suggestions: parseObjectList(d.kpi_suggestions),
    best_practices: parseObjectList(d.best_practices),
    business_pack_alignment: parseObjectList(d.business_pack_alignment),
    integration_summaries:
      typeof d.integration_summaries === "object" && d.integration_summaries
        ? (d.integration_summaries as Record<string, unknown>)
        : undefined,
    future_hooks:
      typeof d.future_hooks === "object" && d.future_hooks ? (d.future_hooks as Record<string, unknown>) : undefined,
    available_profiles: parseObjectList(d.available_profiles),
    ...d,
  } as IndustryIntelligenceFoundationEngineDashboard;
}

export function parseIndustryInsightsExportPayload(data: unknown): IndustryInsightsExportPayload {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    exported_at: typeof d.exported_at === "string" ? d.exported_at : undefined,
    industry_key: typeof d.industry_key === "string" ? d.industry_key : d.industry_key === null ? null : undefined,
    insights: parseInsightList(d.insights),
    metadata_only: typeof d.metadata_only === "boolean" ? d.metadata_only : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    ...d,
  } as IndustryInsightsExportPayload;
}
