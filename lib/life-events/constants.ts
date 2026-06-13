export const LIFE_EVENTS_ROUTE = "/app/companion/life-events";

export const LIFE_EVENT_CATEGORIES = [
  "personal_events",
  "professional_events",
  "health_wellbeing_events",
] as const;

export const IMPORTANCE_LEVELS = [
  "optional",
  "important",
  "very_important",
  "never_forget",
] as const;

export const REMINDER_TIMING_OPTIONS = [
  "same_day",
  "1_day_before",
  "3_days_before",
  "1_week_before",
  "2_weeks_before",
  "custom",
] as const;

export const LIFE_EVENTS_CORE_PRINCIPLE =
  "People rarely remember technology. People remember how technology helped them care about what matters.";

export const LIFE_EVENTS_VISION =
  "The goal is not for Aipify to remember everything. The goal is to help people show up for the moments that matter.";

export const USER_CONTROL_PRINCIPLE =
  "Users choose which categories Aipify may manage, how proactive Aipify should be, and which actions Aipify may suggest or execute.";
