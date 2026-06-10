import type { LearningCenterBundle } from "./types";
import { resolveLearningMode } from "./modes";

export function parseLearningCenterBundle(data: unknown): LearningCenterBundle {
  if (!data || typeof data !== "object") {
    return { has_customer: false };
  }

  const row = data as Record<string, unknown>;
  if (!row.has_customer) {
    return { has_customer: false };
  }

  return {
    has_customer: true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    learning_mode: resolveLearningMode(
      typeof row.learning_mode === "string" ? row.learning_mode : null
    ),
    adaptive_consent: row.adaptive_consent === true,
    adaptive_allowed: row.adaptive_allowed === true,
    recent_learnings: Array.isArray(row.recent_learnings)
      ? (row.recent_learnings as LearningCenterBundle["recent_learnings"])
      : [],
    suggested_improvements: Array.isArray(row.suggested_improvements)
      ? (row.suggested_improvements as LearningCenterBundle["suggested_improvements"])
      : [],
    approval_history: Array.isArray(row.approval_history)
      ? (row.approval_history as LearningCenterBundle["approval_history"])
      : [],
    governance:
      row.governance && typeof row.governance === "object"
        ? (row.governance as LearningCenterBundle["governance"])
        : undefined,
  };
}
