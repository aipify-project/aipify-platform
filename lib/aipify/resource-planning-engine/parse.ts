import type {
  OrganizationResourceAllocation,
  OrganizationResourcePlan,
  OrganizationResourceScenario,
  ResourcePlanningExport,
  ResourcePlanningEngineCard,
  ResourcePlanningEngineDashboard,
  ResourcePlanningRecommendation,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseSections(data: unknown): ResourcePlanningEngineDashboard["sections"] {
  if (typeof data !== "object" || !data) return undefined;
  const s = data as Record<string, unknown>;
  return {
    resource_availability: parseRecordList<Record<string, unknown>>(s.resource_availability),
    allocation_summaries: parseRecordList<OrganizationResourceAllocation>(s.allocation_summaries),
    utilization_trends: parseRecordList<Record<string, unknown>>(s.utilization_trends),
    planning_gaps: parseRecordList<OrganizationResourceAllocation>(s.planning_gaps),
    optimization_opportunities: parseRecordList<ResourcePlanningRecommendation>(
      s.optimization_opportunities
    ),
  };
}

export function parseResourcePlanningEngineCard(data: unknown): ResourcePlanningEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as ResourcePlanningEngineCard;
}

export function parseResourcePlanningEngineDashboard(data: unknown): ResourcePlanningEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    sections: parseSections(d.sections),
    plans: parseRecordList<OrganizationResourcePlan>(d.plans),
    scenarios: parseRecordList<OrganizationResourceScenario>(d.scenarios),
    settings: typeof d.settings === "object" && d.settings ? (d.settings as Record<string, unknown>) : undefined,
    executive_summary:
      typeof d.executive_summary === "object" && d.executive_summary
        ? (d.executive_summary as Record<string, unknown>)
        : undefined,
    recommendations: parseRecordList<ResourcePlanningRecommendation>(d.recommendations),
    integration_notes:
      typeof d.integration_notes === "object" && d.integration_notes
        ? (d.integration_notes as Record<string, string>)
        : undefined,
    integration_summaries:
      typeof d.integration_summaries === "object" && d.integration_summaries
        ? (d.integration_summaries as Record<string, unknown>)
        : undefined,
    ...d,
  } as ResourcePlanningEngineDashboard;
}

export function parseResourcePlanningExport(data: unknown): ResourcePlanningExport {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    exported_at: typeof d.exported_at === "string" ? d.exported_at : undefined,
    manifest_type: typeof d.manifest_type === "string" ? d.manifest_type : undefined,
    plans: parseRecordList<OrganizationResourcePlan>(d.plans),
    allocations: parseRecordList<OrganizationResourceAllocation>(d.allocations),
    scenarios: parseRecordList<OrganizationResourceScenario>(d.scenarios),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    ...d,
  } as ResourcePlanningExport;
}
