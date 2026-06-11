import type {
  CapabilityMaturityEngineCard,
  CapabilityMaturityEngineDashboard,
  MaturityAssessment,
  MaturityReport,
  MaturityReportExport,
  MaturityRoadmap,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

export function parseCapabilityMaturityEngineCard(data: unknown): CapabilityMaturityEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as CapabilityMaturityEngineCard;
}

export function parseCapabilityMaturityEngineDashboard(
  data: unknown
): CapabilityMaturityEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    assessments: parseRecordList<MaturityAssessment>(d.assessments),
    roadmaps: parseRecordList<MaturityRoadmap>(d.roadmaps),
    reports: parseRecordList<MaturityReport>(d.reports),
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
    maturity_labels:
      typeof d.maturity_labels === "object" && d.maturity_labels
        ? (d.maturity_labels as Record<string, string>)
        : undefined,
    ...d,
  } as CapabilityMaturityEngineDashboard;
}

export function parseMaturityReportExport(data: unknown): MaturityReportExport {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    exported_at: typeof d.exported_at === "string" ? d.exported_at : undefined,
    report_type: typeof d.report_type === "string" ? d.report_type : undefined,
    assessments: parseRecordList<MaturityAssessment>(d.assessments),
    roadmaps: parseRecordList<MaturityRoadmap>(d.roadmaps),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    metadata: typeof d.metadata === "object" && d.metadata ? (d.metadata as Record<string, unknown>) : undefined,
    ...d,
  } as MaturityReportExport;
}
