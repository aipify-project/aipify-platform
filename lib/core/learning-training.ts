/**
 * Learning & Training Engine helpers (Phase A.36).
 * Authoritative enforcement lives in Supabase RPCs (_lte_*).
 * User education only — distinct from Phase 29 Learning Engine (customer_learning_memory).
 */

export const TRAINING_CATEGORIES = [
  "onboarding",
  "administrator",
  "support_ai",
  "governance",
  "security_awareness",
  "integration_setup",
  "module_specific",
] as const;

export const TRAINING_CONTENT_TYPES = [
  "article",
  "checklist",
  "video",
  "walkthrough",
  "assessment",
] as const;

export const TRAINING_PROGRESS_STATUSES = [
  "not_started",
  "in_progress",
  "completed",
  "expired",
] as const;

export type TrainingCategory = (typeof TRAINING_CATEGORIES)[number];
export type TrainingContentType = (typeof TRAINING_CONTENT_TYPES)[number];
export type TrainingProgressStatus = (typeof TRAINING_PROGRESS_STATUSES)[number];

type LearningTrainingRpcClient = {
  rpc: (
    fn: string,
    params?: Record<string, unknown>
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export function canViewTraining(role: string): boolean {
  return ["owner", "administrator", "manager", "support_agent", "viewer"].includes(role);
}

export function canAssignTraining(role: string): boolean {
  return role === "owner" || role === "administrator";
}

export function canManageTraining(role: string): boolean {
  return role === "owner" || role === "administrator";
}

export function canReviewTraining(role: string): boolean {
  return role === "owner" || role === "administrator" || role === "manager";
}

export async function getLearningTrainingEngineDashboard(
  supabase: LearningTrainingRpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_learning_training_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function assignTrainingPath(
  supabase: LearningTrainingRpcClient,
  userId: string,
  learningPathId: string,
  dueAt?: string | null
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("assign_training_path", {
    p_user_id: userId,
    p_learning_path_id: learningPathId,
    p_due_at: dueAt ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function recordTrainingProgress(
  supabase: LearningTrainingRpcClient,
  learningPathId: string,
  moduleId?: string | null,
  completionPercentage?: number | null
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("record_training_progress", {
    p_learning_path_id: learningPathId,
    p_module_id: moduleId ?? null,
    p_completion_percentage: completionPercentage ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function submitTrainingAssessment(
  supabase: LearningTrainingRpcClient,
  assessmentId: string,
  score: number,
  passed?: boolean | null
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("submit_training_assessment", {
    p_assessment_id: assessmentId,
    p_score: score,
    p_passed: passed ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createLearningTrainingAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
