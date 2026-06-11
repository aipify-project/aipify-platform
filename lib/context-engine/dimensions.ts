export const CONTEXT_MODES = [
  "auto",
  "work",
  "personal",
  "family",
  "vacation",
  "focus",
  "recovery",
  "planning",
] as const;

export type ContextMode = (typeof CONTEXT_MODES)[number];

export const CALENDAR_PROVIDERS = [
  "aipify_internal",
  "apple",
  "google",
  "outlook",
  "microsoft365",
  "samsung",
  "yahoo",
  "fastmail",
  "nextcloud",
  "exchange",
  "caldav",
] as const;

export type CalendarProvider = (typeof CALENDAR_PROVIDERS)[number];

export const CALENDAR_PURPOSES = [
  "work",
  "personal",
  "family",
  "travel",
  "health",
  "education",
  "custom",
] as const;

export type CalendarPurpose = (typeof CALENDAR_PURPOSES)[number];

export const EVENT_TYPES = [
  "appointment",
  "reminder",
  "task",
  "recurring_event",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export const PROACTIVE_ASSISTANCE_LEVELS = ["minimal", "balanced", "proactive"] as const;

export const CONNECTION_STATUSES = [
  "connected",
  "pending",
  "disconnected",
  "error",
] as const;

export const OAUTH_PROVIDERS: CalendarProvider[] = [
  "apple",
  "google",
  "outlook",
  "microsoft365",
  "yahoo",
  "fastmail",
  "nextcloud",
  "exchange",
  "caldav",
];

export function defaultPurposeForProvider(provider: CalendarProvider): CalendarPurpose {
  if (provider === "aipify_internal") return "personal";
  if (["outlook", "microsoft365", "exchange"].includes(provider)) return "work";
  if (provider === "google") return "personal";
  return "personal";
}
