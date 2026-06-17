export const DESKTOP_COMPANION_PLATFORMS = ["macos", "windows", "linux"] as const;
export type DesktopCompanionPlatform = (typeof DESKTOP_COMPANION_PLATFORMS)[number];

export const NOTIFICATION_LEVELS = ["critical", "important", "normal", "silent"] as const;
export type NotificationLevel = (typeof NOTIFICATION_LEVELS)[number];

export const COMPANION_STYLES = ["calm", "balanced", "proactive"] as const;
export type CompanionStyle = (typeof COMPANION_STYLES)[number];

export const PERMISSION_KEYS = [
  "calendar",
  "email",
  "files",
  "integrations",
  "notifications",
  "workspace",
] as const;
export type PermissionKey = (typeof PERMISSION_KEYS)[number];

export type DesktopCompanionPermission = {
  permission_key: string;
  granted: boolean;
  granted_at?: string | null;
  explanation?: string;
};

export type DesktopCompanionProfilePayload = {
  has_customer: boolean;
  positioning?: string;
  profile?: {
    locale: string;
    timezone: string;
    working_hours: Record<string, unknown>;
    companion_style: string;
    first_run_complete: boolean;
    first_run_intro_seen: boolean;
    hotkey_config: Record<string, string>;
    offline_mode_enabled: boolean;
    workspace_detection_enabled: boolean;
  };
  preferences?: Record<string, unknown>;
  notification_settings?: Record<string, unknown>;
  state?: {
    focus_mode_active: boolean;
    focus_priority: string;
    focus_task_id: string;
    focus_time_estimate_minutes?: number | null;
    focus_suggested_next: string;
    active_project_key?: string;
  };
  permissions?: DesktopCompanionPermission[];
  privacy_note?: string;
};

export type DesktopCompanionBriefing = {
  has_customer: boolean;
  greeting?: string;
  headline?: string;
  summary?: string;
  bullets?: unknown[];
  calendar_hints?: unknown[];
  likely_next_task?: string;
  recent_work_summary?: string;
};

export type DesktopCompanionTaskItem = {
  id?: string;
  title?: string;
  due_at?: string | null;
  status?: string;
  source?: string;
};

export type DesktopCompanionTasks = {
  has_customer: boolean;
  items: DesktopCompanionTaskItem[];
  reminders?: DesktopCompanionTaskItem[];
  context_tasks?: unknown[];
};

export type DesktopCompanionNotificationItem = {
  id: string;
  title: string;
  body?: string | null;
  severity?: string;
  level?: string;
  status?: string;
  category?: string;
  created_at?: string;
};

export type DesktopCompanionNotifications = {
  has_customer: boolean;
  items: DesktopCompanionNotificationItem[];
};

export type DesktopCompanionHome = {
  has_customer: boolean;
  greeting?: string;
  todays_focus?: string;
  profile?: DesktopCompanionProfilePayload;
  daily_briefing?: DesktopCompanionBriefing;
  tasks?: DesktopCompanionTasks;
  calendar?: unknown[];
  companion_insights?: Record<string, unknown>;
  recommended_actions?: unknown[];
  recent_activity?: Array<{ id?: string; label?: string; created_at?: string }>;
  quick_actions?: Array<{ id: string; label: string }>;
  notifications?: DesktopCompanionNotifications;
  positioning?: string;
};

export type DesktopCompanionSearchResult = {
  type: string;
  title: string;
  id?: string;
};

export type DesktopCompanionSearch = {
  has_customer: boolean;
  query?: string;
  results: DesktopCompanionSearchResult[];
};
