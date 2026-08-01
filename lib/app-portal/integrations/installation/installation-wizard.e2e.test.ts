/**
 * Authenticated Preview E2E (fixture / server-side).
 * Does not use owner browser, session, password, or MFA.
 * Proves wizard contract behaviour end-to-end with reference fixtures.
 */
import assert from "node:assert/strict";
import {
  INSTALLATION_CONTRACT_FIXTURES,
  INSTALLATION_SUPPORT_MODES,
  canActivateFromWizard,
  canInstallationTransition,
  planInstallationSteps,
  selectDefaultSupportMode,
  waitingStateForSupportMode,
} from "./index";

assert.equal(INSTALLATION_SUPPORT_MODES.length, 5);

for (const fixture of INSTALLATION_CONTRACT_FIXTURES) {
  const preferred = selectDefaultSupportMode(fixture);
  assert.ok((INSTALLATION_SUPPORT_MODES as readonly string[]).includes(preferred));

  for (const mode of INSTALLATION_SUPPORT_MODES) {
    if (!fixture.support_modes.includes(mode)) continue;
    const steps = planInstallationSteps(fixture, {
      supportMode: mode,
      audience: "customer_owner",
    });
    assert.ok(steps.length >= 1, `${fixture.provider_key} ${mode} must plan steps`);
  }
}

// API-key fixture: self-service requires credentials; Aipify-managed does not.
const apiKey = INSTALLATION_CONTRACT_FIXTURES.find(
  (f) => f.installation_mode === "api_key_existing_provider",
);
assert.ok(apiKey);
if (apiKey.support_modes.includes("self_service")) {
  const selfSteps = planInstallationSteps(apiKey, {
    supportMode: "self_service",
    audience: "customer_owner",
  });
  assert.equal(selfSteps.some((s) => s.step_type === "provide_credentials"), true);
}
if (apiKey.support_modes.includes("aipify_managed")) {
  const managedSteps = planInstallationSteps(apiKey, {
    supportMode: "aipify_managed",
    audience: "customer_owner",
  });
  assert.equal(managedSteps.some((s) => s.step_type === "provide_credentials"), false);
  assert.equal(waitingStateForSupportMode("aipify_managed"), "awaiting_aipify");
}
if (apiKey.support_modes.includes("partner_managed")) {
  const partnerSteps = planInstallationSteps(apiKey, {
    supportMode: "partner_managed",
    audience: "customer_owner",
  });
  assert.equal(partnerSteps.some((s) => s.step_type === "waiting_external_party"), true);
}

// Pause / resume transitions
assert.equal(canInstallationTransition("in_progress", "paused"), true);
assert.equal(canInstallationTransition("paused", "in_progress"), true);
assert.equal(canInstallationTransition("paused", "active"), false);

// Activation gate
assert.equal(canActivateFromWizard("verified"), true);
assert.equal(canActivateFromWizard("ready_for_activation"), true);
assert.equal(canActivateFromWizard("testing"), false);
assert.equal(canActivateFromWizard("in_progress"), false);
assert.equal(canActivateFromWizard("paused"), false);

// Active customer handoffs must use request/invite; incomplete backends stay placeholder.
for (const fixture of INSTALLATION_CONTRACT_FIXTURES) {
  for (const action of fixture.assistance_actions) {
    if (action.action_key === "aipify_managed" || action.action_key === "request_guided") {
      assert.equal(action.handoff, "request", `${action.action_key} must use real handoff`);
    }
    if (action.action_key === "invite_it") {
      assert.equal(action.handoff, "invite", "invite_it must use real invite handoff");
    }
    if (action.requires_quote || action.requires_order || action.requires_scheduling) {
      assert.ok(
        action.handoff === "coming_later" || action.handoff === "invite_placeholder",
        `${action.action_key} incomplete backend must not claim execute handoff`,
      );
    }
  }
}

// Tenant-safe fixture keys (no customer/pilot names)
for (const fixture of INSTALLATION_CONTRACT_FIXTURES) {
  assert.equal(/\bunonight\b/i.test(fixture.provider_key), false);
  assert.equal(/\bsvein\b/i.test(JSON.stringify(fixture)), false);
}

console.log("installation-wizard.e2e.test.ts: ok", {
  fixtures: INSTALLATION_CONTRACT_FIXTURES.length,
  supportModes: INSTALLATION_SUPPORT_MODES.length,
});
