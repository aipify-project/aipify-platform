import assert from "node:assert/strict";
import {
  assertTransition,
  canTransition,
  isActivationAllowed,
  mapSecretStreamStatusToInstallationState,
} from "./index";

assert.equal(canTransition("credential_stored", "connection_test_required"), true);
assert.equal(canTransition("credential_stored", "active"), false);
assert.throws(
  () => assertTransition("credential_stored", "active"),
  /Invalid provider installation transition/
);

assert.equal(isActivationAllowed("verified", "production_ready", "guided"), true);
assert.equal(isActivationAllowed("credential_stored", "production_ready", "guided"), false);
assert.equal(isActivationAllowed("verified", "blocked", "guided"), false);
assert.equal(isActivationAllowed("verified", "production_ready", "unsupported"), false);

assert.equal(mapSecretStreamStatusToInstallationState("rotation_required"), "revoke_required");
assert.equal(mapSecretStreamStatusToInstallationState("not-a-status"), "blocked");

console.log("state-machine.test.ts: ok");
