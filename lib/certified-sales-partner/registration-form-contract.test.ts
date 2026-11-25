import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { buildCspRegistrationFormLabels } from "@/lib/partners-portal/csp-workspace-labels";
import type { Translator } from "@/lib/i18n/translate";
import { classifyCspRegistrationResponse, parseCspSupportRef } from "./registration-outcome";
import { collectCspRegistrationErrors, CSP_FIELD_BY_ERROR_CODE, validateCspRegistration } from "./registration";

const valid = {
  fullName: "Test Partner",
  email: "partner@example.com",
  country: "PL",
  legalBusinessName: "Example Sp. z o.o.",
  businessRegistrationNumber: "0000000000",
  registeredBusinessConfirmed: true,
  termsAccepted: true,
  certificationUnderstood: true,
  infoAccurateConfirmed: true,
};

const GUARD_CODES = ["submission_blocked", "rate_limited", "form_too_fast", "verification_required", "duplicate_recent"];
const NEW_ERROR_CODES = ["invalid_phone", ...GUARD_CODES];
const NEW_KEYS = [
  "phoneDial",
  "phoneNational",
  "phoneHint",
  "companyPersistenceNote",
  "processTitle",
  "processBody",
  "successUnverifiedAddon",
  "successEmailAcceptedAddon",
  "successEmailNotConfiguredAddon",
  "errorSummaryTitle",
  "supportRefLabel",
];
const CORE_LOCALES = ["en", "no", "sv", "da", "pl", "uk", "es"];

test("verification_required (400) is classified as an invalid outcome with its stable code, not a generic error", () => {
  const outcome = classifyCspRegistrationResponse(400, { error: "verification_required", code: "verification_required" });
  assert.deepEqual(outcome, { kind: "invalid", code: "verification_required", supportRef: undefined });
  // Backward compat: an English-only legacy body still classifies as invalid (UI falls back to errorGeneric).
  assert.equal(
    classifyCspRegistrationResponse(400, { error: "Verification required. Complete the security check and try again." }).kind,
    "invalid",
  );
});

test("guard codes at 429 are surfaced as error outcomes with their code", () => {
  for (const code of ["rate_limited", "duplicate_recent"]) {
    assert.deepEqual(classifyCspRegistrationResponse(429, { error: code, code }), {
      kind: "error",
      code,
      supportRef: undefined,
    });
  }
});

test("support_ref is passed through only in a display-safe shape", () => {
  assert.equal(parseCspSupportRef({ support_ref: "CSP-1A2B3C4D" }), "CSP-1A2B3C4D");
  assert.equal(parseCspSupportRef({ support_ref: "<script>alert(1)</script>" }), undefined);
  assert.equal(parseCspSupportRef({ support_ref: 42 }), undefined);
  assert.equal(parseCspSupportRef(null), undefined);
  const outcome = classifyCspRegistrationResponse(500, {
    error: "registration_failed",
    code: "registration_failed",
    support_ref: "CSP-1A2B3C4D",
  });
  assert.deepEqual(outcome, { kind: "error", code: "registration_failed", supportRef: "CSP-1A2B3C4D" });
});

test("validation still requires every confirmation, now with a valid optional phone", () => {
  const withPhone = { ...valid, phoneDial: "+48", phoneNational: "600 123 456" };
  const ok = validateCspRegistration(withPhone);
  assert.ok(ok.ok);
  assert.equal(ok.ok && ok.payload.phone, "+48600123456");
  for (const [field, code] of [
    ["registeredBusinessConfirmed", "registered_business_confirmation_required"],
    ["termsAccepted", "terms_acceptance_required"],
    ["certificationUnderstood", "certification_acknowledgement_required"],
    ["infoAccurateConfirmed", "accuracy_confirmation_required"],
  ] as const) {
    const bad = validateCspRegistration({ ...withPhone, [field]: false });
    assert.ok(!bad.ok);
    assert.equal(!bad.ok && bad.error, code);
    assert.equal(!bad.ok && bad.field, field);
  }
});

test("phone: optional → null; combined E.164 accepted; invalid → invalid_phone", () => {
  const none = validateCspRegistration(valid);
  assert.ok(none.ok);
  assert.equal(none.ok && none.payload.phone, null);

  const combined = validateCspRegistration({ ...valid, phone: "+47 912 34 567" });
  assert.ok(combined.ok);
  assert.equal(combined.ok && combined.payload.phone, "+4791234567");

  for (const input of [
    { phoneDial: "+47", phoneNational: "91234abc" },
    { phoneDial: "", phoneNational: "91234567" },
    { phone: "91234567" },
    { phone: "+47 12" },
  ]) {
    const bad = validateCspRegistration({ ...valid, ...input });
    assert.ok(!bad.ok, JSON.stringify(input));
    assert.equal(!bad.ok && bad.error, "invalid_phone");
    assert.equal(!bad.ok && bad.field, "phone");
  }
});

test("collectCspRegistrationErrors returns every failing field and maps codes back to fields", () => {
  const errors = collectCspRegistrationErrors({ phoneDial: "+47", phoneNational: "abc" });
  const fields = errors.map((e) => e.field);
  for (const field of [
    "fullName",
    "email",
    "country",
    "legalBusinessName",
    "businessRegistrationNumber",
    "phone",
    "registeredBusinessConfirmed",
    "termsAccepted",
    "certificationUnderstood",
    "infoAccurateConfirmed",
  ]) {
    assert.ok(fields.includes(field), field);
  }
  for (const { field, error } of errors) assert.equal(CSP_FIELD_BY_ERROR_CODE[error], field);
  assert.deepEqual(collectCspRegistrationErrors(valid), []);
});

test("form labels expose every new error code and field label", () => {
  const t: Translator = (key: string) => `«${key}»`;
  const labels = buildCspRegistrationFormLabels(t);
  for (const code of NEW_ERROR_CODES) {
    assert.equal(labels.errors[code], `«marketing.certifiedSalesPartner.registration.errors.${code}»`, code);
  }
  for (const key of NEW_KEYS) {
    assert.equal(
      (labels as unknown as Record<string, string>)[key],
      `«marketing.certifiedSalesPartner.registration.${key}»`,
      key,
    );
  }
});

test("all core locales translate the new keys and error codes (no English fallback copy)", () => {
  const read = (locale: string) =>
    JSON.parse(readFileSync(path.join(process.cwd(), "locales", locale, "marketing.json"), "utf8")).certifiedSalesPartner
      .registration as Record<string, unknown> & { errors: Record<string, string> };
  const en = read("en");
  for (const locale of CORE_LOCALES) {
    const reg = read(locale);
    for (const key of NEW_KEYS) {
      assert.equal(typeof reg[key], "string", `${locale}.${key}`);
      assert.ok((reg[key] as string).length > 0, `${locale}.${key}`);
      if (locale !== "en") assert.notEqual(reg[key], en[key], `${locale}.${key} is untranslated`);
    }
    for (const code of NEW_ERROR_CODES) {
      assert.ok(reg.errors[code]?.length > 0, `${locale}.errors.${code}`);
      if (locale !== "en") assert.notEqual(reg.errors[code], en.errors[code], `${locale}.errors.${code} is untranslated`);
    }
  }
});

test("customer copy uses business language in every core locale (no Core / Platform / migration jargon)", () => {
  const JARGON = /\bCore\b|\bPlatform\b|migra|backend|fail-closed|\bISO\b|CSP/i;
  const KEYS = [
    "processTitle",
    "processBody",
    "successTitle",
    "successBody",
    "successUnverifiedAddon",
    "successEmailAcceptedAddon",
    "successEmailNotConfiguredAddon",
    "pendingBody",
    "companyPersistenceNote",
    "backendClosedTitle",
    "backendClosedBody",
    "countryHint",
    "phoneHint",
  ];
  for (const locale of CORE_LOCALES) {
    const copy = JSON.parse(
      readFileSync(path.join(process.cwd(), "locales", locale, "marketing.json"), "utf8"),
    ).certifiedSalesPartner as { registration: Record<string, string>; howItWorks: { honesty: string } };
    for (const key of KEYS) {
      assert.ok(copy.registration[key]?.length > 0, `${locale}.${key}`);
      assert.ok(!JARGON.test(copy.registration[key]!), `${locale}.${key} contains technical jargon`);
    }
    assert.ok(!JARGON.test(copy.howItWorks.honesty), `${locale}.howItWorks.honesty contains technical jargon`);
  }
});

test("Norwegian customer copy matches the job baseline", () => {
  const no = JSON.parse(readFileSync(path.join(process.cwd(), "locales/no/marketing.json"), "utf8"))
    .certifiedSalesPartner.registration as Record<string, string>;
  assert.equal(no.processTitle, "Slik behandler vi søknaden din");
  assert.equal(
    no.processBody,
    "Aipify Group AS gjennomgår søknaden og kontrollerer virksomhetsopplysningene. Du får beskjed på e-post når vurderingen er fullført.",
  );
  assert.equal(no.successTitle, "Søknaden din er mottatt");
  assert.equal(
    no.successBody,
    "Takk for interessen for å bli Certified Aipify Sales Partner. Vi gjennomgår nå søknaden din. Du får informasjon om veien videre når behandlingen er ferdig.",
  );
  assert.equal(
    no.pendingBody,
    "Søknaden din er under behandling. Vi gir deg beskjed på e-post når vi har en oppdatering.",
  );
});

test("registration form uses the process box and stays closed after a confirmed success", () => {
  const form = readFileSync(
    path.join(process.cwd(), "components/marketing/CertifiedSalesPartnerRegistrationForm.tsx"),
    "utf8",
  );
  assert.ok(/labels\.processTitle/.test(form) && /labels\.processBody/.test(form));
  assert.ok(/successUnverifiedAddon/.test(form) && /email_verified/.test(form));
  assert.ok(/disabled=\{pending \|\| submitted\}/.test(form));
  assert.ok(!/localStorage|sessionStorage/.test(form));
  assert.ok(!/Date\.now\(\)\s*-\s*3000/.test(form));
  assert.ok(/requireVerification\(\)/.test(form) && /guardFields\(/.test(form) && /PublicFormHoneypot/.test(form));
});
