export const ACTION_LEVELS = [0, 1, 2, 3, 4] as const;

export type ActionLevel = (typeof ACTION_LEVELS)[number];

export const ACTION_LEVEL_LABELS: Record<ActionLevel, string> = {
  0: "information",
  1: "draft",
  2: "reversible",
  3: "sensitive",
  4: "critical",
};

export const EMERGENCY_STATES = [
  "normal",
  "restricted",
  "paused",
  "emergency_shutdown",
] as const;

export type EmergencyState = (typeof EMERGENCY_STATES)[number];

export const ACTION_REQUEST_STATUSES = [
  "pending",
  "approved",
  "rejected",
  "executing",
  "completed",
  "cancelled",
  "failed",
  "expired",
] as const;

export type ActionRequestStatus = (typeof ACTION_REQUEST_STATUSES)[number];

export function isActionLevel(value: number): value is ActionLevel {
  return (ACTION_LEVELS as readonly number[]).includes(value);
}

export function aiExecutionProhibited(level: ActionLevel): boolean {
  return level >= 4;
}

export function approvalRequiredForLevel(level: ActionLevel): boolean {
  return level >= 1;
}

export function approverRoleForLevel(level: ActionLevel): string | null {
  if (level <= 0) return null;
  if (level === 1) return "staff";
  if (level === 2) return "admin";
  if (level === 3) return "owner";
  return null;
}
