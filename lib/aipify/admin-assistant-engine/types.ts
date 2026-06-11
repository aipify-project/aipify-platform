import type { AdminTask, AssistantRecommendation } from "@/lib/core/admin-assistant";

export type SinceLastLoginSummary = {
  since?: string;
  new_support_cases?: number;
  unresolved_approvals?: number;
  new_users?: number;
  failed_integrations?: number;
  knowledge_updates?: Record<string, unknown>[];
  ai_recommendations?: Record<string, unknown>[];
  open_support_cases?: number;
};

export type SupportOverview = {
  open_cases?: number;
  recent_cases?: { id: string; subject?: string; status?: string; created_at?: string }[];
};

export type AssistantNotification = {
  id: string;
  notification_type: string;
  title: string;
  body?: string | null;
  read_at?: string | null;
  created_at?: string;
};

export type DailyBriefing = {
  generated_at?: string;
  operational_summary?: string;
  key_metrics?: Record<string, unknown>;
  urgent_items?: Record<string, unknown>[];
  recommendations?: Record<string, unknown>[];
  reminders?: (string | null)[];
};

export type AdminAssistantEngineCard = {
  has_organization: boolean;
  open_tasks?: number;
  pending_recommendations?: number;
  philosophy?: string;
};

export type AdminAssistantEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  safety_note?: string;
  principles?: string[];
  since_last_login?: SinceLastLoginSummary;
  daily_briefing?: DailyBriefing;
  pending_tasks: AdminTask[];
  pending_approvals: Record<string, unknown>[];
  support_overview?: SupportOverview;
  recommended_actions: AssistantRecommendation[];
  recent_notifications: AssistantNotification[];
  knowledge_suggestions?: Record<string, unknown>;
  task_counts?: { open?: number; in_progress?: number; overdue?: number };
  unread_notifications?: number;
};
