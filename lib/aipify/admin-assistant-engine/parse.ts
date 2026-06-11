import type { AdminAssistantEngineCard, AdminAssistantEngineDashboard } from "./types";

export function parseAdminAssistantEngineCard(data: unknown): AdminAssistantEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    open_tasks: Number(d.open_tasks ?? 0),
    pending_recommendations: Number(d.pending_recommendations ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
  };
}

export function parseAdminAssistantEngineDashboard(data: unknown): AdminAssistantEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    since_last_login:
      typeof d.since_last_login === "object" && d.since_last_login
        ? (d.since_last_login as AdminAssistantEngineDashboard["since_last_login"])
        : undefined,
    daily_briefing:
      typeof d.daily_briefing === "object" && d.daily_briefing
        ? (d.daily_briefing as AdminAssistantEngineDashboard["daily_briefing"])
        : undefined,
    pending_tasks: Array.isArray(d.pending_tasks)
      ? (d.pending_tasks as AdminAssistantEngineDashboard["pending_tasks"])
      : [],
    pending_approvals: Array.isArray(d.pending_approvals)
      ? (d.pending_approvals as AdminAssistantEngineDashboard["pending_approvals"])
      : [],
    support_overview:
      typeof d.support_overview === "object" && d.support_overview
        ? (d.support_overview as AdminAssistantEngineDashboard["support_overview"])
        : undefined,
    recommended_actions: Array.isArray(d.recommended_actions)
      ? (d.recommended_actions as AdminAssistantEngineDashboard["recommended_actions"])
      : [],
    recent_notifications: Array.isArray(d.recent_notifications)
      ? (d.recent_notifications as AdminAssistantEngineDashboard["recent_notifications"])
      : [],
    knowledge_suggestions:
      typeof d.knowledge_suggestions === "object" && d.knowledge_suggestions
        ? (d.knowledge_suggestions as Record<string, unknown>)
        : undefined,
    task_counts:
      typeof d.task_counts === "object" && d.task_counts
        ? (d.task_counts as AdminAssistantEngineDashboard["task_counts"])
        : undefined,
    unread_notifications: Number(d.unread_notifications ?? 0),
  };
}
