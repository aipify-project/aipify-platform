/** Phase 330 — Executive Companion Layer vocabulary. */

export const COMPANION_EXECUTIVE_LAYER_PRINCIPLE =
  "One place for executive visibility. High signal, low noise. Human decisions remain required.";

export const COMPANION_EXECUTIVE_LAYER_GOLDEN_RULE =
  "Observation → Explanation → Impact → Recommendation → Effort → Value";

export const COMPANION_EXECUTIVE_LAYER_PRIVACY_NOTE =
  "Aipify provides context and recommendations. Leadership remains responsible for decisions.";

export const COMPANION_EXECUTIVE_LAYER_EXAMPLES = [
  "You have one approval blocking multiple initiatives. Estimated review time: 10 minutes. Potential impact: High.",
  "Customer engagement has improved significantly. Recommended action: Schedule an executive check-in.",
  "Your organization is approaching a major milestone. Would you like Aipify to prepare a summary?",
] as const;

export function getCompanionExecutiveLayerPrinciple(): string {
  return COMPANION_EXECUTIVE_LAYER_PRINCIPLE;
}
