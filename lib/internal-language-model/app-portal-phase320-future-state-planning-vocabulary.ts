/** Phase 320 — Strategic Future-State Planning Center vocabulary. */

export const FUTURE_STATE_PLANNING_PRINCIPLE =
  "Vision before execution. Strategy before tactics. Leadership defines goals — Aipify assists planning.";

export const FUTURE_STATE_PLANNING_ADVISORY =
  "Future-state plans are organizational assets. Aipify provides structure and visibility — leadership owns strategy.";

export const FUTURE_STATE_EXECUTIVE_SUMMARIES = [
  "The organization has defined a clear future-state vision with strong alignment across departments.",
  "Several initiatives are progressing toward long-term objectives.",
  "Future-state planning would benefit from additional leadership ownership.",
] as const;

export const FUTURE_STATE_RECOMMENDATION_KEYS = [
  "defineExecutiveOwnership",
  "clarifyStrategicPriorities",
  "improveDepartmentAlignment",
  "createMilestoneReviews",
  "strengthenGovernance",
  "establishMeasurementFrameworks",
] as const;

export function getFutureStatePlanningPrinciple(): string {
  return FUTURE_STATE_PLANNING_PRINCIPLE;
}
