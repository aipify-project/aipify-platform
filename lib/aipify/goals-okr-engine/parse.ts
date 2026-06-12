import type {
  GoalsOkrEngineCard,
  GoalsOkrEngineDashboard,
  GoalsOkrExport,
  OkrIntervention,
  OrganizationKeyResult,
  OrganizationObjective,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseSections(data: unknown): GoalsOkrEngineDashboard["sections"] {
  if (typeof data !== "object" || !data) return undefined;
  const s = data as Record<string, unknown>;
  return {
    active_objectives: parseRecordList<OrganizationObjective>(s.active_objectives),
    progress_by_department: parseRecordList<Record<string, unknown>>(s.progress_by_department),
    at_risk_key_results: parseRecordList<OrganizationKeyResult>(s.at_risk_key_results),
    completion_forecasts: parseRecordList<Record<string, unknown>>(s.completion_forecasts),
    strategic_focus_areas: parseRecordList<OrganizationObjective>(s.strategic_focus_areas),
  };
}

export function parseGoalsOkrEngineCard(data: unknown): GoalsOkrEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as GoalsOkrEngineCard;
}

export function parseGoalsOkrEngineDashboard(data: unknown): GoalsOkrEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    sections: parseSections(d.sections),
    hierarchy: parseRecordList<Record<string, unknown>>(d.hierarchy),
    key_results: parseRecordList<OrganizationKeyResult>(d.key_results),
    settings: typeof d.settings === "object" && d.settings ? (d.settings as Record<string, unknown>) : undefined,
    executive_summary:
      typeof d.executive_summary === "object" && d.executive_summary
        ? (d.executive_summary as Record<string, unknown>)
        : undefined,
    interventions: parseRecordList<OkrIntervention>(d.interventions),
    integration_notes:
      typeof d.integration_notes === "object" && d.integration_notes
        ? (d.integration_notes as Record<string, string>)
        : undefined,
    integration_summaries:
      typeof d.integration_summaries === "object" && d.integration_summaries
        ? (d.integration_summaries as Record<string, unknown>)
        : undefined,
    ...d,
  } as GoalsOkrEngineDashboard;
}

export function parseGoalsOkrExport(data: unknown): GoalsOkrExport {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    exported_at: typeof d.exported_at === "string" ? d.exported_at : undefined,
    manifest_type: typeof d.manifest_type === "string" ? d.manifest_type : undefined,
    objectives: parseRecordList<OrganizationObjective>(d.objectives),
    key_results: parseRecordList<OrganizationKeyResult>(d.key_results),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    interventions: parseRecordList<OkrIntervention>(d.interventions),
    ...d,
  } as GoalsOkrExport;
}
