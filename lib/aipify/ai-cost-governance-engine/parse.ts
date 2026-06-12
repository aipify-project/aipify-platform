import type {
  AiBudget,
  AiBudgetAlert,
  AiCostGovernanceEngineCard,
  AiCostGovernanceEngineDashboard,
  AiCostGovernanceExport,
  AiCostGovernanceSettings,
  AiCostOptimizationRecommendation,
  AiUsageEvent,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseSettings(data: unknown): AiCostGovernanceSettings | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as AiCostGovernanceSettings;
}

function parseSections(data: unknown): AiCostGovernanceEngineDashboard["sections"] {
  if (typeof data !== "object" || !data) return undefined;
  const s = data as Record<string, unknown>;
  return {
    by_module: parseRecordList<Record<string, unknown>>(s.by_module),
    by_user: parseRecordList<Record<string, unknown>>(s.by_user),
    by_task_tier: parseRecordList<Record<string, unknown>>(s.by_task_tier),
    budgets: parseRecordList<AiBudget>(s.budgets),
    alerts: parseRecordList<AiBudgetAlert>(s.alerts),
    blocked_requests: parseRecordList<AiUsageEvent>(s.blocked_requests),
    optimization_recommendations: parseRecordList<AiCostOptimizationRecommendation>(
      s.optimization_recommendations
    ),
  };
}

export function parseAiCostGovernanceEngineCard(data: unknown): AiCostGovernanceEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as AiCostGovernanceEngineCard;
}

export function parseAiCostGovernanceEngineDashboard(data: unknown): AiCostGovernanceEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    settings: parseSettings(d.settings),
    sections: parseSections(d.sections),
    recent_usage: parseRecordList<AiUsageEvent>(d.recent_usage),
    integration_notes:
      typeof d.integration_notes === "object" && d.integration_notes
        ? (d.integration_notes as Record<string, string>)
        : undefined,
    integration_summaries:
      typeof d.integration_summaries === "object" && d.integration_summaries
        ? (d.integration_summaries as Record<string, unknown>)
        : undefined,
    ...d,
  } as AiCostGovernanceEngineDashboard;
}

export function parseAiCostGovernanceExport(data: unknown): AiCostGovernanceExport {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    exported_at: typeof d.exported_at === "string" ? d.exported_at : undefined,
    manifest_type: typeof d.manifest_type === "string" ? d.manifest_type : undefined,
    format: typeof d.format === "string" ? d.format : undefined,
    settings: parseSettings(d.settings),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    budgets: parseRecordList<AiBudget>(d.budgets),
    usage_events: parseRecordList<AiUsageEvent>(d.usage_events),
    alerts: parseRecordList<AiBudgetAlert>(d.alerts),
    recommendations: parseRecordList<AiCostOptimizationRecommendation>(d.recommendations),
    integration_summaries:
      typeof d.integration_summaries === "object" && d.integration_summaries
        ? (d.integration_summaries as Record<string, unknown>)
        : undefined,
    ...d,
  } as AiCostGovernanceExport;
}
