import assert from "node:assert/strict";
import {
  assertExternalApplicationActionMayProceed,
  buildBlockedExternalApplicationActionResult,
  finalizeExternalApplicationActionResult,
} from "./action-guard";

const blocked = assertExternalApplicationActionMayProceed({
  handoff: {
    application_key: "microsoft_word",
    status: "adapter_missing",
    requires_explicit_consent: true,
    message_key: "externalApplications.handoff.adapterMissing",
  },
});
assert.ok(blocked);
assert.equal(blocked?.reported_as_executed, false);

const finalizedFailure = finalizeExternalApplicationActionResult(
  buildBlockedExternalApplicationActionResult({
    application_key: "microsoft_word",
    operation: "handoff",
    capability_status: "adapter_missing",
    failure_code: "adapter_missing",
  }),
);
assert.equal(finalizedFailure.ok, false);
assert.equal(finalizedFailure.reported_as_executed, false);

const finalizedSuccess = finalizeExternalApplicationActionResult({
  ok: true,
  reported_as_executed: true,
  capability_status: "connected",
  application_key: "canva",
  operation: "handoff",
  external_reference: "asset-1",
  open_url: "https://www.canva.com/asset/asset-1",
  edit_url: null,
  failure_code: null,
  audited: false,
});
assert.equal(finalizedSuccess.reported_as_executed, true);

const fakeSuccess = finalizeExternalApplicationActionResult({
  ok: true,
  reported_as_executed: true,
  capability_status: "connected",
  application_key: "canva",
  operation: "handoff",
  external_reference: null,
  open_url: null,
  edit_url: null,
  failure_code: null,
  audited: false,
});
assert.equal(fakeSuccess.ok, false);
assert.equal(fakeSuccess.reported_as_executed, false);

console.log("external-application-orchestration/action-guard.test.ts: all assertions passed");
