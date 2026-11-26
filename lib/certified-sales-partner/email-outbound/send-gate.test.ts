import assert from "node:assert/strict";
import test from "node:test";
import { evaluateCspMarketingSendGate, validateCspMarketingRecipient } from "./send-gate";

test("recipient validation rejects malformed addresses", () => {
  assert.equal(validateCspMarketingRecipient("not-an-email"), false);
  assert.equal(validateCspMarketingRecipient("ok@example.com"), true);
});

test("send gate fails closed without consent", () => {
  const base = {
    partnerActive: true,
    productCertified: true,
    templateOk: true,
    recipient: "ok@example.com",
    consentVerified: false,
  };
  assert.equal(evaluateCspMarketingSendGate(base).reason, "consent_not_verified");
  assert.equal(
    evaluateCspMarketingSendGate({ ...base, consentVerified: true }).reason,
    "transport_not_configured",
  );
});

test("suspended partner and missing cert are blocked", () => {
  assert.equal(
    evaluateCspMarketingSendGate({
      partnerActive: false,
      productCertified: true,
      templateOk: true,
      recipient: "ok@example.com",
      consentVerified: true,
    }).reason,
    "suspended_partner",
  );
  assert.equal(
    evaluateCspMarketingSendGate({
      partnerActive: true,
      productCertified: false,
      templateOk: true,
      recipient: "ok@example.com",
      consentVerified: true,
    }).reason,
    "certification_required",
  );
});
