import assert from "node:assert/strict";
import { classifyExternalProviderHandoff } from "./external-handoff";

const canvaPartial = classifyExternalProviderHandoff({
  provider_key: "canva",
  consent_granted: false,
  permission_granted: true,
  connection_connected: false,
});
assert.equal(canvaPartial.status, "partial");

const canvaConsent = classifyExternalProviderHandoff({
  provider_key: "canva",
  consent_granted: false,
  permission_granted: true,
  connection_connected: true,
});
assert.equal(canvaConsent.status, "consent_required");

const canvaReady = classifyExternalProviderHandoff({
  provider_key: "canva",
  consent_granted: true,
  permission_granted: true,
  connection_connected: true,
});
assert.equal(canvaReady.status, "adapter_available");

const unknownProvider = classifyExternalProviderHandoff({
  provider_key: "design-tool",
  consent_granted: true,
  permission_granted: true,
});
assert.equal(unknownProvider.status, "adapter_missing");

const denied = classifyExternalProviderHandoff({
  provider_key: "canva",
  consent_granted: true,
  permission_granted: false,
  connection_connected: true,
});
assert.equal(denied.status, "permission_denied");

console.log("artifact-context/external-handoff.test.ts: all assertions passed");
