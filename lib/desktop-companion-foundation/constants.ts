export const DESKTOP_COMPANION_HOME = "/app/desktop";

export const DESKTOP_COMPANION_NAV = [
  { id: "home", href: "/app/desktop", labelKey: "nav.home" },
  { id: "briefings", href: "/app/desktop/briefings", labelKey: "nav.briefings" },
  { id: "tasks", href: "/app/desktop/tasks", labelKey: "nav.tasks" },
  { id: "calendar", href: "/app/desktop/calendar", labelKey: "nav.calendar" },
  { id: "companion", href: "/app/desktop/companion", labelKey: "nav.companion" },
  { id: "knowledge", href: "/app/desktop/knowledge", labelKey: "nav.knowledge" },
  { id: "files", href: "/app/desktop/files", labelKey: "nav.files" },
  { id: "notifications", href: "/app/desktop/notifications", labelKey: "nav.notifications" },
  { id: "integrations", href: "/app/desktop/integrations", labelKey: "nav.integrations" },
  { id: "actions", href: "/app/desktop/actions", labelKey: "nav.actions" },
  { id: "settings", href: "/app/desktop/settings", labelKey: "nav.settings" },
] as const;

export const QUICK_ACTION_IDS = [
  "create_note",
  "create_task",
  "create_reminder",
  "open_calendar",
  "open_file",
  "start_focus",
  "ask_aipify",
] as const;

export const DEFAULT_HOTKEYS = {
  macos: "Command+Space",
  windows: "Control+Space",
  linux: "Control+Space",
} as const;

export const DESKTOP_COMPANION_LOADING_KEY = "desktopCompanion.loading";
