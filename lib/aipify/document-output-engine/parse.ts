import type {
  DocumentOutputEngineCard,
  DocumentOutputEngineDashboard,
  GenerateDocumentOutputResult,
  OutputDelivery,
  OutputGeneration,
  OutputManifestExport,
  OutputSchedule,
  OutputTemplate,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

export function parseDocumentOutputEngineCard(data: unknown): DocumentOutputEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as DocumentOutputEngineCard;
}

export function parseDocumentOutputEngineDashboard(data: unknown): DocumentOutputEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    templates: parseRecordList<OutputTemplate>(d.templates),
    generations: parseRecordList<OutputGeneration>(d.generations),
    schedules: parseRecordList<OutputSchedule>(d.schedules),
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
  } as DocumentOutputEngineDashboard;
}

export function parseOutputManifestExport(data: unknown): OutputManifestExport {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    exported_at: typeof d.exported_at === "string" ? d.exported_at : undefined,
    report_type_filter: typeof d.report_type_filter === "string" ? d.report_type_filter : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    generations: parseRecordList<OutputGeneration>(d.generations),
    deliveries: parseRecordList<OutputDelivery>(d.deliveries),
    metadata_only: Boolean(d.metadata_only),
    ...d,
  } as OutputManifestExport;
}

export function parseGenerateDocumentOutputResult(data: unknown): GenerateDocumentOutputResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    generation:
      typeof d.generation === "object" && d.generation
        ? (d.generation as OutputGeneration)
        : undefined,
    file_metadata:
      typeof d.file_metadata === "object" && d.file_metadata
        ? (d.file_metadata as Record<string, unknown>)
        : undefined,
    workflow_hook:
      typeof d.workflow_hook === "object" && d.workflow_hook
        ? (d.workflow_hook as Record<string, unknown>)
        : undefined,
    ...d,
  } as GenerateDocumentOutputResult;
}
