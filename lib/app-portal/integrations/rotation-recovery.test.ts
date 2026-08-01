import assert from "node:assert/strict";
import { INTEGRATION_WIZARD_STEPS } from "@/lib/install/integration-setup";
import {
  enterCredentialStepIndex,
  resolveIntegrationWizardResumeStepIndex,
  shouldShowIntegrationCompletionSummary,
} from "./rotation-recovery";
import type { AppPortalIntegrationSetup } from "./types";

const enterIdx = INTEGRATION_WIZARD_STEPS.indexOf("enter_credential");
const testIdx = INTEGRATION_WIZARD_STEPS.indexOf("test_connection");

assert.equal(enterCredentialStepIndex(), enterIdx);

const rotationSetup: AppPortalIntegrationSetup = {
  provider_key: "unonight",
  display_name: "Unonight",
  setup_type: "manual",
  oauth_available: false,
  default_permission_level: "read_only",
  recommended_scopes: ["metadata.read"],
  connection: {
    id: "conn-1",
    provider_key: "unonight",
    setup_type: "manual",
    status: "rotation_required",
    permission_level: "read_only",
    approved_scopes: ["metadata.read"],
    masked_credential_hint: "vault••••",
    credentials_reference: "vault-1",
    last_test_success_at: "2026-07-06T12:00:00Z",
    last_test_failed_at: "2026-08-01T12:00:00Z",
    last_test_error: "rotation_required",
    activated_at: "2026-07-06T13:00:00Z",
  },
  manual_steps: [],
  oauth_steps: [],
};

assert.equal(resolveIntegrationWizardResumeStepIndex(rotationSetup), enterIdx);
assert.equal(shouldShowIntegrationCompletionSummary("active", "rotation_required"), false);
assert.equal(shouldShowIntegrationCompletionSummary("verified", "verification_failed"), false);
assert.equal(shouldShowIntegrationCompletionSummary("active", "active"), true);

const failedSetup: AppPortalIntegrationSetup = {
  ...rotationSetup,
  connection: {
    ...rotationSetup.connection!,
    status: "failed",
    last_test_error: "organization_mismatch",
    activated_at: null,
  },
};
assert.equal(resolveIntegrationWizardResumeStepIndex(failedSetup), testIdx);

console.log("rotation-recovery.test.ts: all assertions passed");
