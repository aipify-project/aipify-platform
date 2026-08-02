import type { InstallationSupportMode, InstallationWizardState } from "./enums";

/**
 * Presentation-only waiting party for customer-visible copy.
 * Does not mutate session, handoff, or lifecycle.
 */
export type InstallationWaitingCopyParty =
  | "aipify"
  | "aipify_guided"
  | "customer_it"
  | "partner"
  | "unknown";

/**
 * Resolve who the waiting card should name.
 * Authority order: assigned_party_type → support_mode → session lifecycle → unknown.
 */
export function resolveInstallationWaitingCopyParty(opts: {
  assignedPartyType?: string | null;
  supportMode?: InstallationSupportMode | null;
  sessionState?: InstallationWizardState | null;
}): InstallationWaitingCopyParty {
  const assigned = (opts.assignedPartyType ?? "").trim().toLowerCase();
  const mode = opts.supportMode ?? null;
  const state = opts.sessionState ?? null;

  if (assigned === "aipify") {
    return mode === "guided" ? "aipify_guided" : "aipify";
  }
  if (assigned === "customer_it") return "customer_it";
  if (assigned === "partner") return "partner";

  if (mode === "aipify_managed") return "aipify";
  if (mode === "guided") return "aipify_guided";
  if (mode === "customer_it_managed") return "customer_it";
  if (mode === "partner_managed") return "partner";

  if (state === "awaiting_customer_it") return "customer_it";
  if (state === "awaiting_partner") return "partner";
  // Guided already returned above via support_mode; remaining awaiting_aipify → Aipify.
  if (state === "awaiting_aipify") return "aipify";

  return "unknown";
}

const RAW_KEY_PREFIX = "customerApp.";

/** True when a translator returned an unresolved i18n key (or empty). */
export function isUnresolvedInstallationI18nValue(value: string, key: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;
  if (trimmed === key) return true;
  if (trimmed.startsWith(RAW_KEY_PREFIX)) return true;
  return false;
}

/**
 * Resolve waiting-card copy for a responsible party.
 * Order: party key → generic waiting key → English customer-safe last resort.
 * Never returns a raw i18n key.
 */
export function resolveInstallationWaitingCopyText(opts: {
  translate: (key: string) => string;
  partyKey: string;
  waitingKey: string;
  /** English customer-safe last resort when catalog/dictionary both miss. */
  englishGenericFallback?: string;
}): string {
  const englishGeneric =
    opts.englishGenericFallback?.trim() || "Waiting on the responsible party";
  const primary = opts.translate(opts.partyKey);
  if (!isUnresolvedInstallationI18nValue(primary, opts.partyKey)) {
    return primary.trim();
  }
  const waiting = opts.translate(opts.waitingKey);
  if (!isUnresolvedInstallationI18nValue(waiting, opts.waitingKey)) {
    return waiting.trim();
  }
  return englishGeneric;
}
