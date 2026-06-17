/** Phase 325 — Companion Personalization Engine vocabulary. */

export const COMPANION_PERSONALIZATION_PRINCIPLE =
  "Adapt to the user. Preserve trust. Aipify identity remains consistent.";

export const COMPANION_PERSONALIZATION_PRIVACY_NOTE =
  "Personalization changes presentation and interaction style, not permissions or security controls.";

export const COMPANION_PERSONALIZATION_EXAMPLES = [
  "Aipify noticed you prefer concise executive briefings. Future summaries will use this format.",
  "You often review reports on Mondays. Would you like Aipify to prepare them automatically?",
  "You prefer task-oriented recommendations over detailed analysis.",
] as const;

export function getCompanionPersonalizationPrinciple(): string {
  return COMPANION_PERSONALIZATION_PRINCIPLE;
}
