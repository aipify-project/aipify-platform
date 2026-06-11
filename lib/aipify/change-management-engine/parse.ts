import type {
  ChangeAdoptionMetricRecord,
  ChangeCommunicationPlanRecord,
  ChangeImpactAssessmentRecord,
  ChangeInitiativeRecord,
  ChangeManagementEngineCard,
  ChangeManagementEngineDashboard,
  ChangeMilestoneRecord,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

export function parseChangeManagementEngineCard(data: unknown): ChangeManagementEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as ChangeManagementEngineCard;
}

export function parseChangeManagementEngineDashboard(data: unknown): ChangeManagementEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    initiatives: parseRecordList<ChangeInitiativeRecord>(d.initiatives),
    impact_assessments: parseRecordList<ChangeImpactAssessmentRecord>(d.impact_assessments),
    communication_plans: parseRecordList<ChangeCommunicationPlanRecord>(d.communication_plans),
    adoption_metrics: parseRecordList<ChangeAdoptionMetricRecord>(d.adoption_metrics),
    milestones: parseRecordList<ChangeMilestoneRecord>(d.milestones),
    integration_notes:
      typeof d.integration_notes === "object" && d.integration_notes
        ? (d.integration_notes as Record<string, string>)
        : undefined,
    integration_summaries:
      typeof d.integration_summaries === "object" && d.integration_summaries
        ? (d.integration_summaries as Record<string, unknown>)
        : undefined,
    ...d,
  } as ChangeManagementEngineDashboard;
}
