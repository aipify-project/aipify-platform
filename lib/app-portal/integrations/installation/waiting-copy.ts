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
