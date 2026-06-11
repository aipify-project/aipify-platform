export const MEMORY_CATEGORIES = [
  "strategic_decision",
  "project",
  "operational",
  "customer",
  "improvement",
] as const;

export type MemoryCategory = (typeof MEMORY_CATEGORIES)[number];

export const MEMORY_VISIBILITY_LEVELS = [
  "personal",
  "tenant",
  "department",
  "executive",
] as const;

export type MemoryVisibilityLevel = (typeof MEMORY_VISIBILITY_LEVELS)[number];

export const OME_CORE_PRINCIPLE_TEXT =
  "Knowledge captured becomes wisdom. Wisdom preserved improves future decisions. Humans create experience. Aipify helps retain it.";
