import assert from "node:assert/strict";
import { classifyExternalProviderHandoff } from "./external-handoff";

const missing = classifyExternalProviderHandoff({
  provider_key: "canva",
  consent_granted: true,
  permission_granted: true,
});
assert.equal(missing.status, "adapter_missing");

const consentBlocked = classifyExternalProviderHandoff({
  provider_key: "design-tool",
  consent_granted: false,
  permission_granted: true,
});
assert.equal(consentBlocked.status, "adapter_missing");

const denied = classifyExternalProviderHandoff({
  provider_key: "design-tool",
  consent_granted: true,
  permission_granted: false,
});
assert.equal(denied.status, "permission_denied");

console.log("artifact-context/external-handoff.test.ts: all assertions passed");
