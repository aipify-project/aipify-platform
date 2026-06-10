/** Activity timeline event categories (Phase 27). */

export const ACTIVITY_TIMELINE_CATEGORIES = [
  "support",
  "skill",
  "automation",
  "approval",
  "update",
  "presence",
  "health",
] as const;

export type ActivityTimelineCategory = (typeof ACTIVITY_TIMELINE_CATEGORIES)[number];

export type ActivityTimelineEntry = {
  id: string;
  category: ActivityTimelineCategory | string;
  title: string;
  created_at: string;
};
