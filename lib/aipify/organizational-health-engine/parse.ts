import type {
  OrganizationalHealthEngineCard,
  OrganizationalHealthEngineDashboard,
  OrganizationalHealthIntervention,
  OrganizationalHealthReportExport,
  OrganizationalHealthScore,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

export function parseOrganizationalHealthEngineCard(data: unknown): OrganizationalHealthEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as OrganizationalHealthEngineCard;
}

export function parseOrganizationalHealthEngineDashboard(
  data: unknown
): OrganizationalHealthEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    scores: parseRecordList<OrganizationalHealthScore>(d.scores),
    interventions: parseRecordList<OrganizationalHealthIntervention>(d.interventions),
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
    settings:
      typeof d.settings === "object" && d.settings
        ? (d.settings as Record<string, unknown>)
        : undefined,
    ...d,
  } as OrganizationalHealthEngineDashboard;
}

export function parseOrganizationalHealthReportExport(data: unknown): OrganizationalHealthReportExport {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    exported_at: typeof d.exported_at === "string" ? d.exported_at : undefined,
    report_type: typeof d.report_type === "string" ? d.report_type : undefined,
    scores: parseRecordList<OrganizationalHealthScore>(d.scores),
    interventions: parseRecordList<OrganizationalHealthIntervention>(d.interventions),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    ...d,
  } as OrganizationalHealthReportExport;
}
