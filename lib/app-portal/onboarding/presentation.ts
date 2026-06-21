import type {
  AdoptionInsights,
  OnboardingMilestone,
  OnboardingOverview,
  OnboardingRecommendation,
  OnboardingStatus,
  OnboardingTask,
  OverviewStatus,
  WorkflowPresentationState,
} from "./types";
import {
  ADOPTION_FEATURE_KEYS,
  ONBOARDING_RECOMMENDATION_LINKS,
  ONBOARDING_RECOMMENDATION_PRIORITY_ORDER,
  ONBOARDING_TASK_LINKS,
} from "./config";

export type TaskPriority = "required" | "recommended" | "optional";

export function mapOnboardingWorkflowState(state: string): WorkflowPresentationState {
  const normalized = String(state ?? "")
    .trim()
    .toLowerCase()
    .replace(/-/g, "_");
  if (normalized === "completed") return "completed";
  if (normalized === "blocked") return "blocked";
  if (normalized === "requires_attention" || normalized === "overdue") return "requires_attention";
  if (normalized === "in_progress" || normalized === "optional") return "in_progress";
  return "not_started";
}

export function mapWorkflowStateForSemantic(state: WorkflowPresentationState): string {
  switch (state) {
    case "completed":
      return "completed";
    case "blocked":
      return "blocked";
    case "requires_attention":
      return "overdue";
    case "in_progress":
      return "in_progress";
    default:
      return "pending";
  }
}

export function resolveTaskPriority(task: OnboardingTask): TaskPriority {
  if (task.optional) return "optional";
  if (task.key === "team_permissions" || task.key === "pack_review" || task.key === "integration_health") {
    return "recommended";
  }
  return "required";
}

export function isApplicableTask(task: OnboardingTask): boolean {
  return !task.optional;
}

export function computeApplicableProgress(checklist: OnboardingTask[]): {
  progress_percent: number;
  completed: number;
  total: number;
} {
  const applicable = checklist.filter(isApplicableTask);
  const total = applicable.length;
  const completed = applicable.filter((t) => t.status === "completed").length;
  const progress_percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { progress_percent, completed, total };
}

export function resolveOverviewWorkflowState(
  overview: OnboardingOverview | undefined,
  checklist: OnboardingTask[]
): WorkflowPresentationState {
  if (!overview) return "not_started";
  if (overview.status === "completed") return "completed";
  const blocked = checklist.some((t) => isApplicableTask(t) && t.status === "blocked");
  if (blocked) return "blocked";
  const needsAttention = checklist.some(
    (t) =>
      isApplicableTask(t) &&
      t.status !== "completed" &&
      (t.key === "integration_connect" || t.key === "security_2fa")
  );
  if (needsAttention && overview.status === "in_progress") return "requires_attention";
  if (overview.status === "in_progress") return "in_progress";
  return "not_started";
}

export function partitionRemainingTasks(checklist: OnboardingTask[]): OnboardingTask[] {
  const priorityRank: Record<TaskPriority, number> = { required: 0, recommended: 1, optional: 2 };
  return checklist
    .filter((t) => t.status !== "completed")
    .sort((a, b) => {
      const pa = priorityRank[resolveTaskPriority(a)];
      const pb = priorityRank[resolveTaskPriority(b)];
      if (pa !== pb) return pa - pb;
      return a.key.localeCompare(b.key);
    });
}

export function partitionCompletedTasks(checklist: OnboardingTask[]): OnboardingTask[] {
  return checklist
    .filter((t) => t.status === "completed")
    .sort((a, b) => (b.completed_at ?? "").localeCompare(a.completed_at ?? ""));
}

export function resolveNextIncompleteTask(checklist: OnboardingTask[]): OnboardingTask | null {
  const remaining = partitionRemainingTasks(checklist);
  const inProgress = remaining.find(
    (t) => t.status === "in_progress" && resolveTaskPriority(t) !== "optional"
  );
  if (inProgress) return inProgress;
  return remaining.find((t) => resolveTaskPriority(t) !== "optional") ?? remaining[0] ?? null;
}

export function sortOnboardingRecommendations(
  recommendations: OnboardingRecommendation[],
): OnboardingRecommendation[] {
  return [...recommendations].sort((a, b) => {
    const pa = ONBOARDING_RECOMMENDATION_PRIORITY_ORDER[a.priority] ?? 9;
    const pb = ONBOARDING_RECOMMENDATION_PRIORITY_ORDER[b.priority] ?? 9;
    if (pa !== pb) return pa - pb;
    return a.key.localeCompare(b.key);
  });
}

export function resolveTaskHref(key: string): string | undefined {
  return ONBOARDING_TASK_LINKS[key];
}

export function resolveOnboardingRecommendationHref(key: string): string | undefined {
  return ONBOARDING_RECOMMENDATION_LINKS[key];
}

export function filterValidMilestones(
  milestones: OnboardingMilestone[],
  connectedIntegrations: number
): OnboardingMilestone[] {
  return milestones.filter((m) => {
    if (m.key === "first_integration") return connectedIntegrations > 0;
    return true;
  });
}

export function partitionAdoptionFeatures(
  checklist: OnboardingTask[],
  adoption?: AdoptionInsights
): {
  explored: OnboardingTask[];
  recommended: OnboardingTask[];
} {
  const explored = checklist.filter(
    (t) => ADOPTION_FEATURE_KEYS.includes(t.key as typeof ADOPTION_FEATURE_KEYS[number]) && t.status === "completed"
  );
  const recommendedKeys = new Set(
    adoption?.features_not_discovered?.length
      ? adoption.features_not_discovered
      : checklist
          .filter(
            (t) =>
              ADOPTION_FEATURE_KEYS.includes(t.key as typeof ADOPTION_FEATURE_KEYS[number]) &&
              t.status !== "completed"
          )
          .map((t) => t.key)
  );
  const recommended = checklist.filter((t) => recommendedKeys.has(t.key) && t.status !== "completed");
  return { explored, recommended };
}

export function reconcileIntegrationTask(
  checklist: OnboardingTask[],
  connectedIntegrations: number
): OnboardingTask[] {
  if (connectedIntegrations <= 0) {
    return checklist.map((t) => {
      if (t.key === "integration_connect" && t.status === "completed" && !t.auto_detected) {
        return { ...t, status: "not_started" as OnboardingStatus };
      }
      if (t.key === "integration_connect" && t.auto_detected && t.status === "completed") {
        return { ...t, status: "not_started" as OnboardingStatus, auto_detected: true };
      }
      return t;
    });
  }
  return checklist.map((t) => {
    if (t.key === "integration_connect" && t.status !== "completed") {
      return { ...t, status: "completed" as OnboardingStatus, auto_detected: true };
    }
    return t;
  });
}

export function deriveOverviewStatus(
  progress: { completed: number; total: number },
  started: boolean
): OverviewStatus {
  if (!started) return "not_started";
  if (progress.total > 0 && progress.completed >= progress.total) return "completed";
  return "in_progress";
}
