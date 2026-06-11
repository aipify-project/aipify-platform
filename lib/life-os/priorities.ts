export const LIFE_PRIORITIES = [
  "critical",
  "important",
  "routine",
  "optional",
] as const;

export type LifePriority = (typeof LIFE_PRIORITIES)[number];

export const PRIORITY_ORDER: Record<LifePriority, number> = {
  critical: 0,
  important: 1,
  routine: 2,
  optional: 3,
};

export function isLifePriority(value: string): value is LifePriority {
  return (LIFE_PRIORITIES as readonly string[]).includes(value);
}

export function sortByPriority<T extends { priority: LifePriority }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
  );
}
