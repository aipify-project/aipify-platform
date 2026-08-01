import assert from "node:assert/strict";
import {
  fixtureHostedConnector,
  fixtureInstallableWordpressLike,
  resolveOnboardingSafeActions,
  unonightApiKeyOnboarding,
} from "./index";

assert.equal(
  resolveOnboardingSafeActions(unonightApiKeyOnboarding, "credential_required").showApiKeyFields,
  true
);
assert.equal(
  resolveOnboardingSafeActions(unonightApiKeyOnboarding, "blocked").showApiKeyFields,
  false
);
assert.equal(
  resolveOnboardingSafeActions(fixtureInstallableWordpressLike, "not_started").showConnectorDownload,
  true
);
assert.equal(
  resolveOnboardingSafeActions(fixtureHostedConnector, "not_started").showHostedActivate,
  true
);

assert.equal(
  resolveOnboardingSafeActions(unonightApiKeyOnboarding, "credential_stored").showActivate,
  false
);
assert.equal(
  resolveOnboardingSafeActions(unonightApiKeyOnboarding, "verified").showActivate,
  true
);

console.log("capabilities.test.ts: ok");
