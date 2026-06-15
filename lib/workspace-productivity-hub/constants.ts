export const TASK_PRIORITIES = ["low", "medium", "high", "critical"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const TASK_STATUSES = [
  "not_started",
  "in_progress",
  "waiting",
  "completed",
  "cancelled",
] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const REMINDER_TYPES = ["one_time", "recurring", "due_date"] as const;
export type ReminderType = (typeof REMINDER_TYPES)[number];

export const NOTE_TYPES = ["personal", "team", "meeting"] as const;
export type NoteType = (typeof NOTE_TYPES)[number];

export const FOCUS_TRENDS = ["building", "steady", "strong"] as const;
export type FocusTrend = (typeof FOCUS_TRENDS)[number];

export const PRIORITY_BADGES: Record<TaskPriority, string> = {
  low: "bg-slate-100 text-slate-700 ring-slate-200",
  medium: "bg-blue-50 text-blue-800 ring-blue-200",
  high: "bg-amber-50 text-amber-900 ring-amber-200",
  critical: "bg-red-50 text-red-800 ring-red-200",
};

export const STATUS_BADGES: Record<TaskStatus, string> = {
  not_started: "bg-gray-100 text-gray-800 ring-gray-200",
  in_progress: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  waiting: "bg-amber-50 text-amber-900 ring-amber-200",
  completed: "bg-green-50 text-green-800 ring-green-200",
  cancelled: "bg-slate-100 text-slate-600 ring-slate-200",
};
