import assert from "node:assert/strict";
import { classifyExternalApplicationHandoff } from "../external-application-orchestration/handoff-classification";

const partial = classifyExternalApplicationHandoff({
  application_key: "canva",
  adapter_registered: true,
  readiness: "partial",
  consent_granted: false,
  permission_granted: true,
  connection_connected: false,
});
assert.equal(partial.status, "partial");

const missing = classifyExternalApplicationHandoff({
  application_key: "design-tool",
  adapter_registered: false,
  readiness: "adapter_missing",
  consent_granted: true,
  permission_granted: true,
});
assert.equal(missing.status, "adapter_missing");

const denied = classifyExternalApplicationHandoff({
  application_key: "canva",
  adapter_registered: true,
  readiness: "partial",
  consent_granted: true,
  permission_granted: false,
  connection_connected: true,
});
assert.equal(denied.status, "permission_denied");

console.log("artifact-context/external-handoff.test.ts: all assertions passed");
