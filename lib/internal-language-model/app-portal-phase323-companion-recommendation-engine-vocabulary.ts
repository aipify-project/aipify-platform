/** Phase 323 — Companion Recommendation Engine vocabulary. */

export const COMPANION_RECOMMENDATION_ENGINE_PRINCIPLE =
  "Explain every recommendation. Humans remain in control. Transparency before automation.";

export const COMPANION_RECOMMENDATION_PRIVACY_NOTE =
  "Recommendations are suggestions only. Final decisions always remain with users and leadership.";

export const COMPANION_RECOMMENDATION_EXAMPLES = [
  "You have several overdue follow-ups. Would you like Aipify to prepare a review task?",
  "Your organization may benefit from a readiness review before expansion.",
  "Support demand has increased this month.",
  "Several employees have requested training in the same area.",
] as const;

export function getCompanionRecommendationEnginePrinciple(): string {
  return COMPANION_RECOMMENDATION_ENGINE_PRINCIPLE;
}
