import type {
  OrganizationalDecisionItem,
  OrganizationalDecisionOutcome,
  OrganizationalDecisionReportExport,
  OrganizationalDecisionSupportEngineCard,
  OrganizationalDecisionSupportEngineDashboard,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

export function parseOrganizationalDecisionSupportEngineCard(
  data: unknown
): OrganizationalDecisionSupportEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as OrganizationalDecisionSupportEngineCard;
}

export function parseOrganizationalDecisionSupportEngineDashboard(
  data: unknown
): OrganizationalDecisionSupportEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    decisions: parseRecordList<OrganizationalDecisionItem>(d.decisions),
    outcomes: parseRecordList<OrganizationalDecisionOutcome>(d.outcomes),
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
  } as OrganizationalDecisionSupportEngineDashboard;
}

export function parseOrganizationalDecisionReportExport(data: unknown): OrganizationalDecisionReportExport {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    exported_at: typeof d.exported_at === "string" ? d.exported_at : undefined,
    decision:
      typeof d.decision === "object" && d.decision
        ? (d.decision as OrganizationalDecisionItem)
        : undefined,
    outcomes: parseRecordList<OrganizationalDecisionOutcome>(d.outcomes),
    decisions: parseRecordList<OrganizationalDecisionItem>(d.decisions),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    ...d,
  } as OrganizationalDecisionReportExport;
}
