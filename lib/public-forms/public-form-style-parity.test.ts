import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { AipifyPublicFormClasses } from "./public-form-ui";
import {
  SUPPORT_EMAIL_TRANSPORT_ENABLED,
  SUPPORT_INTAKE_FEATURE_GATE,
  SUPPORT_INTAKE_RPC_CONNECTED,
} from "@/lib/support-intake/types";
import { getSupportIntakeGateState } from "@/lib/support-intake/submit";

const support = readFileSync("components/marketing/SupportIntakeForm.tsx", "utf8");
const partner = readFileSync(
  "components/marketing/CertifiedSalesPartnerRegistrationForm.tsx",
  "utf8",
);

assert.equal(SUPPORT_INTAKE_RPC_CONNECTED, true);
assert.equal(SUPPORT_INTAKE_FEATURE_GATE, true);
assert.equal(SUPPORT_EMAIL_TRANSPORT_ENABLED, false);
assert.equal(getSupportIntakeGateState().live, true);

assert.ok(AipifyPublicFormClasses.panel.includes("rounded-2xl"));
assert.ok(AipifyPublicFormClasses.panel.includes("sm:p-8"));
assert.ok(AipifyPublicFormClasses.input.includes("rounded-xl"));
assert.ok(AipifyPublicFormClasses.submit.includes("companion-purple"));

for (const source of [support, partner]) {
  assert.match(source, /AipifyPublicFormClasses\.panel|AipifyPublicFormClasses/);
  assert.match(source, /AipifyHumanVerification/);
  assert.match(source, /PublicFormHoneypot/);
  assert.match(source, /variant="light"/);
  assert.match(source, /compact/);
  assert.match(source, /PublicFormInfoNotice/);
}

assert.match(support, /disabled=\{!intakeLive/);
assert.doesNotMatch(support, /intakeLive \?\s*\n?\s*<AipifyHumanVerification/);
assert.match(support, /support-intake-closed/);
assert.doesNotMatch(support, /SUPPORT_INTAKE_RPC_CONNECTED\s*=\s*true/);

assert.match(partner, /data-testid="csp-process-info"|testId="csp-process-info"/);

console.log("public-form-style-parity.test.ts: ok");
