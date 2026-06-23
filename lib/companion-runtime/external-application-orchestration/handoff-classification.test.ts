import assert from "node:assert/strict";
import { classifyExternalApplicationHandoff } from "./handoff-classification";

const partial = classifyExternalApplicationHandoff({
  application_key: "canva",
  adapter_registered: true,
  readiness: "partial",
  consent_granted: false,
  permission_granted: true,
  connection_connected: false,
});
assert.equal(partial.status, "partial");

const consent = classifyExternalApplicationHandoff({
  application_key: "canva",
  adapter_registered: true,
  readiness: "production_ready_candidate",
  consent_granted: false,
  permission_granted: true,
  connection_connected: true,
});
assert.equal(consent.status, "consent_required");

const ready = classifyExternalApplicationHandoff({
  application_key: "canva",
  adapter_registered: true,
  readiness: "production_ready_candidate",
  consent_granted: true,
  permission_granted: true,
  connection_connected: true,
});
assert.equal(ready.status, "adapter_available");

const missing = classifyExternalApplicationHandoff({
  application_key: "microsoft_word",
  adapter_registered: false,
  readiness: "adapter_missing",
  consent_granted: true,
  permission_granted: true,
});
assert.equal(missing.status, "adapter_missing");

console.log("external-application-orchestration/handoff-classification.test.ts: all assertions passed");
