/** Phase 322 — Companion Memory Expansion Engine vocabulary. */

export const COMPANION_MEMORY_ENGINE_PRINCIPLE =
  "Memory must be transparent. Users remain in control. Trust before automation.";

export const COMPANION_MEMORY_PRIVACY_NOTE =
  "Aipify never treats low-confidence memories as facts. Memory remains transparent and manageable.";

export const COMPANION_MEMORY_USAGE_EXAMPLES = [
  "Aipify remembers that your organization prefers weekly executive briefings.",
  "Aipify noticed this process repeats every month. Would you like to remember it?",
  "You previously approved this workflow. Would you like to reuse it?",
] as const;

export function getCompanionMemoryEnginePrinciple(): string {
  return COMPANION_MEMORY_ENGINE_PRINCIPLE;
}
