import assert from "node:assert/strict";
import { displayBankHint } from "./bank-profile";
import { parsePartnerOverview } from "./partner-overview";
import {
  CSP_PROFILE_FIELD_MODE,
  bankDraftIsDirty,
  bankSaveStatusMessage,
} from "./csp-profile-form";

const FULL_IBAN = "DE89370400440532013000";

assert.equal(CSP_PROFILE_FIELD_MODE.avatar, "writable");
assert.equal(CSP_PROFILE_FIELD_MODE.bankDetails, "writable");
assert.equal(CSP_PROFILE_FIELD_MODE.displayName, "read_only");
assert.equal(CSP_PROFILE_FIELD_MODE.email, "read_only");
assert.equal(CSP_PROFILE_FIELD_MODE.country, "read_only");
for (const id of ["phone", "legalBusinessName", "businessRegistrationNumber", "companyContact", "address", "website"] as const) {
  assert.equal(CSP_PROFILE_FIELD_MODE[id], "core_blocked");
}

assert.equal(
  parsePartnerOverview({ partner: { country: "no", display_name: "Example Partner" } }).country,
  "NO",
);
assert.equal(parsePartnerOverview({ partner: { display_name: "Example Partner" } }).country, null);
assert.equal(parsePartnerOverview({ partner: { legal_business_name: "  " } }).legalBusinessName, null);
assert.equal(parsePartnerOverview({ partner: { country: "NOR" } }).country, null);

const saved = { accountHolder: "Example Partner", country: "NO", currency: "NOK" };
assert.equal(
  bankDraftIsDirty(saved, { ...saved, iban: "", swiftBic: "" }),
  false,
);
assert.equal(
  bankDraftIsDirty(saved, { ...saved, iban: "  ", swiftBic: "" }),
  false,
);
assert.equal(
  bankDraftIsDirty(saved, { ...saved, accountHolder: "Other", iban: "", swiftBic: "" }),
  true,
);
assert.equal(
  bankDraftIsDirty(saved, { ...saved, iban: FULL_IBAN, swiftBic: "" }),
  true,
);

const labels = {
  saved: "Bank details saved. Only a masked reference is shown afterwards.",
  error: "Bank details could not be saved.",
  unavailable: "Secure bank storage is not available. Nothing was stored.",
};
for (const kind of ["saved", "error", "unavailable"] as const) {
  const message = bankSaveStatusMessage(kind, labels);
  assert.equal(message.includes(FULL_IBAN), false);
  assert.equal(/\d{8,}/.test(message), false);
}

const hint = displayBankHint(FULL_IBAN);
assert.ok(hint);
assert.equal(hint.includes(FULL_IBAN), false);
assert.equal(hint.endsWith("3000"), true);
assert.equal(displayBankHint("****3000"), "****3000");
assert.equal(displayBankHint("   "), null);

console.log("csp profile form contract tests passed");
