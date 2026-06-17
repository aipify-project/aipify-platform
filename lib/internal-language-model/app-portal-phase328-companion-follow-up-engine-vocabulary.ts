/** Phase 328 — Companion Follow-Up Engine vocabulary. */

export const COMPANION_FOLLOW_UP_PRINCIPLE =
  "Help users keep commitments. Improve accountability. Support trust and reliability.";

export const COMPANION_FOLLOW_UP_PRIVACY_NOTE =
  "Aipify assists with follow-up recommendations. Users remain responsible for decisions and communication.";

export const COMPANION_FOLLOW_UP_EXAMPLES = [
  "You mentioned following up with this customer but no activity has been recorded.",
  "This approval remains unresolved after seven days.",
  "Three meeting action items remain open.",
] as const;

export function getCompanionFollowUpPrinciple(): string {
  return COMPANION_FOLLOW_UP_PRINCIPLE;
}
