/**
 * Admin Assistant helpers (Phase A.6).
 * Authoritative enforcement lives in Supabase RPCs (_aae_*).
 */

export const TASK_PRIORITIES = ["low", "medium", "high", "critical"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const TASK_STATUSES = ["open", "in_progress", "waiting", "completed", "cancelled"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const RECOMMENDATION_URGENCIES = ["low", "medium", "high", "critical"] as const;
export type RecommendationUrgency = (typeof RECOMMENDATION_URGENCIES)[number];

export const NOTIFICATION_TYPES = [
  "support_alert",
  "ai_recommendation",
  "approval_request",
  "integration_issue",
  "task_assignment",
  "reminder",
] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export type AdminTask = {
  id: string;
  title: string;
  description?: string | null;
  priority?: TaskPriority;
  status?: TaskStatus;
  due_date?: string | null;
  ai_generated?: boolean;
};

export type AssistantRecommendation = {
  id: string;
  summary: string;
  reason?: string | null;
  expected_outcome?: string | null;
  urgency?: RecommendationUrgency;
  suggested_next_step?: string | null;
  category?: string;
  status?: string;
};

type AssistantRpcClient = {
  rpc: (
    fn: string,
    params?: Record<string, unknown>
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export function priorityRank(priority?: string): number {
  switch (priority) {
    case "critical":
      return 1;
    case "high":
      return 2;
    case "medium":
      return 3;
    default:
      return 4;
  }
}

export function isUrgentTask(task: AdminTask): boolean {
  return task.priority === "critical" || task.priority === "high";
}

export async function getSinceLastLoginSummary(
  supabase: AssistantRpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_since_last_login_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function createAdminTask(
  supabase: AssistantRpcClient,
  params: {
    title: string;
    description?: string;
    priority?: TaskPriority;
    assigned_to?: string;
    due_date?: string;
    ai_generated?: boolean;
  }
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("create_admin_task", {
    p_title: params.title,
    p_description: params.description ?? null,
    p_priority: params.priority ?? "medium",
    p_assigned_to: params.assigned_to ?? null,
    p_due_date: params.due_date ?? null,
    p_ai_generated: params.ai_generated ?? false,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function updateAdminTask(
  supabase: AssistantRpcClient,
  taskId: string,
  params: { status?: TaskStatus; priority?: TaskPriority; assigned_to?: string }
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("update_admin_task", {
    p_task_id: taskId,
    p_status: params.status ?? null,
    p_priority: params.priority ?? null,
    p_assigned_to: params.assigned_to ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function acceptRecommendation(
  supabase: AssistantRpcClient,
  recommendationId: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("accept_assistant_recommendation", {
    p_recommendation_id: recommendationId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function rejectRecommendation(
  supabase: AssistantRpcClient,
  recommendationId: string,
  reason?: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("reject_assistant_recommendation", {
    p_recommendation_id: recommendationId,
    p_reason: reason ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function generateDailyBriefing(
  supabase: AssistantRpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("generate_admin_daily_briefing");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getKnowledgeSuggestions(
  supabase: AssistantRpcClient,
  query = "admin operations"
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_assistant_knowledge_suggestions", {
    p_query: query,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
