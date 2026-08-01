import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  CORE_PROVIDER_ONBOARDING_FIXTURES,
  parseCoreProviderOnboardingContract,
  resolveOnboardingSafeActions,
} from "./index";

const overview = readFileSync(
  join(process.cwd(), "components/app/app-portal/ProviderOnboardingOverview.tsx"),
  "utf8"
);
const panel = readFileSync(
  join(process.cwd(), "components/app/app-portal/AppPortalIntegrationSetupPanel.tsx"),
  "utf8"
);

assert.match(overview, /ProviderOnboardingOverview/);
assert.doesNotMatch(overview, /if\s*\(\s*provider(?:Key)?\s*===/);
assert.doesNotMatch(overview, /switch\s*\(\s*["']unonight["']/i);
assert.match(panel, /ProviderOnboardingOverview/);
assert.doesNotMatch(panel, /if\s*\(\s*providerKey\s*===\s*["']unonight["']/);

for (const fixture of CORE_PROVIDER_ONBOARDING_FIXTURES) {
  const parsed = parseCoreProviderOnboardingContract(fixture);
  assert.equal(parsed.ok, true);
  if (!parsed.ok) continue;
  const actions = resolveOnboardingSafeActions(parsed.contract, "awaiting_customer_action");
  assert.equal(actions.showOAuthConnect, fixture.onboardingMode === "oauth");
  assert.equal(
    actions.showApiKeyFields,
    fixture.onboardingMode === "api_key_existing_provider"
  );
  assert.equal(
    actions.showConnectorDownload,
    fixture.onboardingMode === "installable_connector"
  );
  assert.equal(actions.showHostedActivate, false);
  assert.equal(
    actions.showCustomSteps,
    fixture.onboardingMode === "custom_provider_implementation"
  );
}

console.log("overview-render.test.ts: ok");
