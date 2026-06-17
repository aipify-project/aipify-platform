/** Phase 321 — Companion Context Engine vocabulary. */

export const COMPANION_CONTEXT_ENGINE_PRINCIPLE =
  "Context before recommendations. Permission-first access. Privacy by design.";

export const COMPANION_CONTEXT_PRIVACY_NOTE =
  "Aipify only uses metadata from approved, authorized context sources — never information outside granted permissions.";

export const COMPANION_CONTEXT_USAGE_EXAMPLES = [
  "Good morning. You have items requiring attention. A customer onboarding task may be overdue. Your calendar shows a strategic planning meeting tomorrow.",
  "Aipify noticed that several support requests relate to the same topic. Would you like a summary prepared for review?",
] as const;

export function getCompanionContextEnginePrinciple(): string {
  return COMPANION_CONTEXT_ENGINE_PRINCIPLE;
}
