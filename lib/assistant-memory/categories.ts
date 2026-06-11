/** PAME memory types — separate from Learning Engine. */
export const PAME_MEMORY_TYPES = [
  "important_people",
  "events",
  "tasks",
  "habits",
  "goals",
] as const;

export type PameMemoryType = (typeof PAME_MEMORY_TYPES)[number];

export const PAME_MEMORY_STATUSES = [
  "active",
  "completed",
  "archived",
  "deleted",
  "paused",
] as const;

export type PameMemoryStatus = (typeof PAME_MEMORY_STATUSES)[number];

/** @deprecated Use PameMemoryType — kept for migration compatibility */
export const MEMORY_CATEGORIES = PAME_MEMORY_TYPES;
export type MemoryCategory = PameMemoryType;

export function isPameMemoryType(value: string): value is PameMemoryType {
  return (PAME_MEMORY_TYPES as readonly string[]).includes(value);
}

export function isMemoryCategory(value: string): value is PameMemoryType {
  return isPameMemoryType(value);
}

export function defaultCategoryToggles(): Record<PameMemoryType, boolean> {
  return {
    important_people: true,
    events: true,
    tasks: true,
    habits: true,
    goals: true,
  };
}
