import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { sanitizeSupportIntakePayload } from "@/lib/support-intake/sanitize";
import { getSupportIntakeGateState } from "@/lib/support-intake/submit";
import {
  SUPPORT_EMAIL_TRANSPORT_ENABLED,
  SUPPORT_INTAKE_FEATURE_GATE,
  SUPPORT_INTAKE_RPC_CONNECTED,
} from "@/lib/support-intake/types";

const root = process.cwd();
const KEYS = [
  "title",
  "subtitle",
  "name",
  "email",
  "subject",
  "message",
  "submit",
  "privacy",
  "privacyInactive",
  "nameRequired",
  "emailInvalid",
  "subjectTooShort",
  "messageTooShort",
  "referenceLabel",
  "successCorePending",
  "successSubmitted",
  "mailtoLabel",
] as const;

function read(rel: string): string {
  return readFileSync(join(root, rel), "utf8");
}

const form = read("components/marketing/SupportIntakeForm.tsx");
const page = read("app/(kompis-sales)/contact/support/page.tsx");
const api = read("app/api/support-intake/web/route.ts");
const appContact = read("app/app/support/contact/page.tsx");

assert.equal(SUPPORT_INTAKE_RPC_CONNECTED, false);
assert.equal(SUPPORT_INTAKE_FEATURE_GATE, false);
assert.equal(SUPPORT_EMAIL_TRANSPORT_ENABLED, false);
assert.equal(getSupportIntakeGateState().live, false);
assert.equal(getSupportIntakeGateState().emailTransportEnabled, false);

assert.match(page, /getSupportIntakeGateState\(\)\.live/);
assert.match(page, /privacyInactive/);
assert.doesNotMatch(page, /ticketNumber\s*[:=]\s*["']SUP-/);
assert.match(form, /support@aipify\.ai/);
assert.match(form, /intakeLive/);
assert.match(form, /disabled=\{!intakeLive/);
assert.match(form, /TICKET_NUMBER_RE/);
assert.match(form, /labels\.privacy/);
assert.match(form, /PublicFormHoneypot/);
assert.doesNotMatch(form, /createClient|supabase\.from|ticket_id:\s*crypto|SUP-\$\{/);
assert.doesNotMatch(api, /resend|nodemailer|sendMail|sendEmail/);
assert.match(api, /createServiceRoleClient/);
assert.match(api, /partner_id|tenant_id|company_id/);
assert.match(appContact, /renderAppPortalFoundationPage\("contactSupport"\)/);
assert.doesNotMatch(appContact, /SupportIntakeForm|support-intake\/web/);

const missingEmail = sanitizeSupportIntakePayload(
  { subject: "Emne", message: "Dette er en testmelding.", contactName: "Ada" },
  "web",
);
assert.equal(missingEmail.ok, false);
if (!missingEmail.ok) assert.equal(missingEmail.field, "email");

const shortSubject = sanitizeSupportIntakePayload(
  {
    subject: "Ok",
    message: "Dette er en testmelding.",
    contactName: "Ada",
    contactEmail: "ada@example.com",
  },
  "web",
);
assert.equal(shortSubject.ok, false);
if (!shortSubject.ok) assert.equal(shortSubject.field, "subject");

for (const locale of ["en", "no", "sv", "da", "pl", "uk"] as const) {
  const marketing = JSON.parse(read(`locales/${locale}/marketing.json`)) as {
    supportIntake?: Record<string, string>;
  };
  const block = marketing.supportIntake ?? {};
  for (const key of KEYS) {
    assert.equal(typeof block[key], "string", `${locale}.${key}`);
    assert.ok(block[key].trim().length > 0, `${locale}.${key} empty`);
  }
  assert.match(block.mailtoLabel, /support@aipify\.ai/);
  assert.doesNotMatch(block.successSubmitted, /SUP-/);
  assert.doesNotMatch(block.successCorePending, /SUP-/);
}

const en = JSON.parse(read("locales/en/marketing.json")).supportIntake.title as string;
const no = JSON.parse(read("locales/no/marketing.json")).supportIntake.title as string;
const pl = JSON.parse(read("locales/pl/marketing.json")).supportIntake.title as string;
const uk = JSON.parse(read("locales/uk/marketing.json")).supportIntake.title as string;
assert.notEqual(no, en);
assert.notEqual(pl, en);
assert.notEqual(uk, en);

console.log("public-support-contact-form.test.ts: ok");
