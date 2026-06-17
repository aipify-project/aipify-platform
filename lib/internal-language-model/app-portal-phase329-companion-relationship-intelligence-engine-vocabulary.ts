/** Phase 329 — Companion Relationship Intelligence Engine vocabulary. */

export const COMPANION_RELATIONSHIP_INTELLIGENCE_PRINCIPLE =
  "People first. Relationships matter. Aipify assists — never replaces human connection.";

export const COMPANION_RELATIONSHIP_INTELLIGENCE_PRIVACY_NOTE =
  "Relationship intelligence is advisory only. Humans remain responsible for relationship management.";

export const COMPANION_RELATIONSHIP_INTELLIGENCE_EXAMPLES = [
  "Your relationship with this customer may benefit from a check-in.",
  "This Growth Partner has not received communication in over 45 days.",
  "You have not spoken with this advisor since the last strategic review.",
  "This employee's work anniversary is next week.",
] as const;

export function getCompanionRelationshipIntelligencePrinciple(): string {
  return COMPANION_RELATIONSHIP_INTELLIGENCE_PRINCIPLE;
}
