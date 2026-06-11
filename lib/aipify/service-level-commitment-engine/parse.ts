import type {
  ServiceCommitmentAlertRecord,
  ServiceCommitmentPerformanceRecord,
  ServiceCommitmentRecord,
  ServiceCommitmentReportExportPayload,
  ServiceLevelCommitmentEngineCard,
  ServiceLevelCommitmentEngineDashboard,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

export function parseServiceLevelCommitmentEngineCard(
  data: unknown
): ServiceLevelCommitmentEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as ServiceLevelCommitmentEngineCard;
}

export function parseServiceLevelCommitmentEngineDashboard(
  data: unknown
): ServiceLevelCommitmentEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    commitments: parseRecordList<ServiceCommitmentRecord>(d.commitments),
    performance: parseRecordList<ServiceCommitmentPerformanceRecord>(d.performance),
    alerts: parseRecordList<ServiceCommitmentAlertRecord>(d.alerts),
    compliance_summary:
      typeof d.compliance_summary === "object" && d.compliance_summary
        ? (d.compliance_summary as Record<string, unknown>)
        : undefined,
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
  } as ServiceLevelCommitmentEngineDashboard;
}

export function parseServiceCommitmentReportExportPayload(
  data: unknown
): ServiceCommitmentReportExportPayload {
  const d = (data ?? {}) as Record<string, unknown>;
  return d as ServiceCommitmentReportExportPayload;
}
