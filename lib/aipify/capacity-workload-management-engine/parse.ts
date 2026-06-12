import type {
  CapacityRebalancingRecommendation,
  CapacityWorkloadExport,
  CapacityWorkloadManagementEngineCard,
  CapacityWorkloadManagementEngineDashboard,
  OrganizationCapacityProfile,
  OrganizationWorkloadItem,
  OrganizationWorkloadWarning,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseSections(data: unknown): CapacityWorkloadManagementEngineDashboard["sections"] {
  if (typeof data !== "object" || !data) return undefined;
  const s = data as Record<string, unknown>;
  return {
    user_workload: parseRecordList<Record<string, unknown>>(s.user_workload),
    team_workload: parseRecordList<Record<string, unknown>>(s.team_workload),
    overloaded_users: parseRecordList<OrganizationCapacityProfile>(s.overloaded_users),
    upcoming_capacity_risks: parseRecordList<OrganizationWorkloadItem>(s.upcoming_capacity_risks),
    unassigned_work: parseRecordList<OrganizationWorkloadItem>(s.unassigned_work),
    workload_trends: parseRecordList<Record<string, unknown>>(s.workload_trends),
  };
}

export function parseCapacityWorkloadManagementEngineCard(
  data: unknown
): CapacityWorkloadManagementEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as CapacityWorkloadManagementEngineCard;
}

export function parseCapacityWorkloadManagementEngineDashboard(
  data: unknown
): CapacityWorkloadManagementEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    sections: parseSections(d.sections),
    my_workload_items: parseRecordList<OrganizationWorkloadItem>(d.my_workload_items),
    warnings: parseRecordList<OrganizationWorkloadWarning>(d.warnings),
    recommendations: parseRecordList<CapacityRebalancingRecommendation>(d.recommendations),
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
  } as CapacityWorkloadManagementEngineDashboard;
}

export function parseCapacityWorkloadExport(data: unknown): CapacityWorkloadExport {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    exported_at: typeof d.exported_at === "string" ? d.exported_at : undefined,
    manifest_type: typeof d.manifest_type === "string" ? d.manifest_type : undefined,
    profiles: parseRecordList<OrganizationCapacityProfile>(d.profiles),
    workload_items: parseRecordList<OrganizationWorkloadItem>(d.workload_items),
    warnings: parseRecordList<OrganizationWorkloadWarning>(d.warnings),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    recommendations: parseRecordList<CapacityRebalancingRecommendation>(d.recommendations),
    ...d,
  } as CapacityWorkloadExport;
}
