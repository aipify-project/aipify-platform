/**
 * CSP "My profile" field contract.
 *
 * Writable only when a partner-scoped Core write already exists:
 * - avatar: `/api/partners/profile/avatar` (auth user metadata pointer)
 * - bank details: `csp_save_partner_bank_profile` (encrypted; fail-closed without the key)
 *
 * `csp_register_partner_application` does not update an existing partner row.
 * `update_partner_portal_profile` belongs to Growth Partner and must not be used here.
 * There is no partner RPC that changes display name, phone, company identity, or certification.
 */

export type CspProfileFieldMode = "writable" | "read_only" | "core_blocked";

export const CSP_PROFILE_FIELD_MODE = {
  displayName: "read_only",
  email: "read_only",
  country: "read_only",
  phone: "core_blocked",
  legalBusinessName: "core_blocked",
  businessRegistrationNumber: "core_blocked",
  companyContact: "core_blocked",
  address: "core_blocked",
  website: "core_blocked",
  avatar: "writable",
  bankDetails: "writable",
} as const satisfies Record<string, CspProfileFieldMode>;

export type CspProfileFieldId = keyof typeof CSP_PROFILE_FIELD_MODE;

export type BankDraft = {
  accountHolder: string;
  country: string;
  currency: string;
  iban: string;
  swiftBic: string;
};

export function bankDraftIsDirty(
  saved: Pick<BankDraft, "accountHolder" | "country" | "currency">,
  draft: BankDraft,
): boolean {
  return (
    draft.accountHolder !== saved.accountHolder ||
    draft.country !== saved.country ||
    draft.currency !== saved.currency ||
    draft.iban.trim() !== "" ||
    draft.swiftBic.trim() !== ""
  );
}

/** Save/error copy is label text only — never the account identifier. */
export function bankSaveStatusMessage(
  kind: "saved" | "error" | "unavailable",
  labels: { saved: string; error: string; unavailable: string },
): string {
  if (kind === "saved") return labels.saved;
  if (kind === "unavailable") return labels.unavailable;
  return labels.error;
}
