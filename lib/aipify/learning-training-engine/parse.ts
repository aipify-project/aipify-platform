import type {
  LearningTrainingEngineCard,
  LearningTrainingEngineDashboard,
  LearningTrainingSummary,
  TrainingAssessment,
  TrainingPath,
} from "./types";

function asRecordList(value: unknown): Array<Record<string, unknown>> {
  return Array.isArray(value) ? (value as Array<Record<string, unknown>>) : [];
}

export function parseLearningTrainingEngineCard(data: unknown): LearningTrainingEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    assigned_paths: typeof d.assigned_paths === "number" ? d.assigned_paths : undefined,
    completed_paths: typeof d.completed_paths === "number" ? d.completed_paths : undefined,
    overdue_paths: typeof d.overdue_paths === "number" ? d.overdue_paths : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    ...d,
  };
}

export function parseLearningTrainingEngineDashboard(
  data: unknown
): LearningTrainingEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  const summary =
    typeof d.summary === "object" && d.summary ? (d.summary as LearningTrainingSummary) : undefined;

  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary,
    assigned_paths: asRecordList(d.assigned_paths),
    recommended_paths: asRecordList(d.recommended_paths),
    overdue_training: asRecordList(d.overdue_training),
    recommended_modules: asRecordList(d.recommended_modules),
    learning_paths: asRecordList(d.learning_paths),
    team_readiness:
      typeof d.team_readiness === "object" && d.team_readiness
        ? (d.team_readiness as Record<string, unknown>)
        : undefined,
    onboarding_integration:
      typeof d.onboarding_integration === "object" && d.onboarding_integration
        ? (d.onboarding_integration as Record<string, unknown>)
        : undefined,
    settings:
      typeof d.settings === "object" && d.settings ? (d.settings as Record<string, unknown>) : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    ...d,
  };
}

export function parseTrainingPaths(data: unknown): TrainingPath[] {
  return Array.isArray(data) ? (data as TrainingPath[]) : [];
}

export function parseTrainingAssessments(data: unknown): TrainingAssessment[] {
  return Array.isArray(data) ? (data as TrainingAssessment[]) : [];
}
