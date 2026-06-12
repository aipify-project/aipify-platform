/**
 * Companion Presence Indicator constants (Phase A.67).
 * System presence only — not employee surveillance.
 */

export const COMPANION_PRESENCE_STATES = [
  "idle",
  "working",
  "attention_needed",
  "critical_alert",
  "disconnected",
  "quiet_mode",
] as const;

export type CompanionPresenceState = (typeof COMPANION_PRESENCE_STATES)[number];

export const COMPANION_CONNECTION_STATUSES = ["online", "idle", "disconnected"] as const;
export type CompanionConnectionStatus = (typeof COMPANION_CONNECTION_STATUSES)[number];

export const COMPANION_PRESENCE_DEFAULT_HEARTBEAT_SECONDS = 60;

export type CompanionPresenceCounts = {
  open_tasks: number;
  pending_approvals: number;
  unread_notifications: number;
};

export type CompanionPresenceUserPreferences = {
  indicator_collapsed: boolean;
  quiet_mode_enabled: boolean;
  quiet_mode_until: string | null;
  reduced_motion_preferred: boolean;
};

export type CompanionPresenceOrgSettings = {
  indicator_enabled: boolean;
  heartbeat_interval_seconds: number;
  show_since_last_login: boolean;
  show_task_counts: boolean;
  show_approval_counts: boolean;
  show_notification_counts: boolean;
  critical_alert_requires_ack: boolean;
};

export type CompanionPresenceBundle = {
  has_organization: boolean;
  philosophy?: string;
  privacy_note?: string;
  indicator_enabled?: boolean;
  current_state?: CompanionPresenceState;
  connection_status?: CompanionConnectionStatus;
  heartbeat_interval_seconds?: number;
  user_preferences?: CompanionPresenceUserPreferences;
  org_settings?: CompanionPresenceOrgSettings;
  since_last_login?: Record<string, unknown>;
  counts?: CompanionPresenceCounts;
  links?: {
    ask_aipify?: string;
    approvals?: string;
    command_center?: string;
    settings?: string;
  };
};

export const COMPANION_STATE_ANIMATION: Record<
  CompanionPresenceState,
  { ring: string; core: string; animation: string }
> = {
  idle: {
    ring: "from-cyan-400/40 to-blue-500/40",
    core: "from-indigo-500 via-violet-500 to-violet-400",
    animation: "animate-aipify-orb-breathe",
  },
  working: {
    ring: "from-blue-400/40 to-violet-500/40",
    core: "from-blue-500 via-violet-500 to-indigo-500",
    animation: "animate-presence-working",
  },
  attention_needed: {
    ring: "from-amber-400/40 to-orange-500/40",
    core: "from-amber-400 to-orange-500",
    animation: "animate-presence-approval",
  },
  critical_alert: {
    ring: "from-red-400/40 to-rose-500/40",
    core: "from-red-400 to-rose-500",
    animation: "animate-presence-critical",
  },
  disconnected: {
    ring: "from-slate-500/30 to-slate-600/30",
    core: "from-slate-500 to-slate-600",
    animation: "",
  },
  quiet_mode: {
    ring: "from-violet-400/30 to-indigo-500/30",
    core: "from-violet-400 to-indigo-500",
    animation: "animate-presence-standby",
  },
};

export function resolveCompanionDeviceId(): string {
  if (typeof window === "undefined") return "web-default";
  const key = "aipify_companion_device_id";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `web-${Date.now()}`;
  window.localStorage.setItem(key, id);
  return id;
}
