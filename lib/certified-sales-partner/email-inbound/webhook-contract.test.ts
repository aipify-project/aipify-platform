import assert from "node:assert/strict";
import test from "node:test";
import { createHmac } from "node:crypto";
import {
  decideCspInboundDisposition,
  isLikelyNonHumanInbound,
  verifyCspInboundWebhookSignature,
} from "./webhook-contract";

test("inbound signature verification is timing-safe", () => {
  const secret = "test-secret";
  const body = '{"id":"evt_1"}';
  const sig = createHmac("sha256", secret).update(body, "utf8").digest("hex");
  assert.equal(
    verifyCspInboundWebhookSignature({ rawBody: body, signatureHeader: `sha256=${sig}`, secret }),
    true,
  );
  assert.equal(
    verifyCspInboundWebhookSignature({ rawBody: body, signatureHeader: "sha256=deadbeef", secret }),
    false,
  );
});

test("autoreplies are transport-only, spoofed tokens quarantine", () => {
  assert.equal(isLikelyNonHumanInbound({ "Auto-Submitted": "auto-replied" }), true);
  assert.equal(
    decideCspInboundDisposition({
      signatureOk: false,
      correlationFound: false,
      partnerActive: true,
      nonHuman: false,
      duplicateEvent: false,
    }),
    "quarantine_manual_review",
  );
  assert.equal(
    decideCspInboundDisposition({
      signatureOk: true,
      correlationFound: true,
      partnerActive: true,
      nonHuman: true,
      duplicateEvent: false,
    }),
    "transport_event_only",
  );
  assert.equal(
    decideCspInboundDisposition({
      signatureOk: true,
      correlationFound: true,
      partnerActive: true,
      nonHuman: false,
      duplicateEvent: false,
    }),
    "create_or_attach_lead",
  );
});
