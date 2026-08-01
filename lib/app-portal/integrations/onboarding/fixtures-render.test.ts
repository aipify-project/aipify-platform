import assert from "node:assert/strict";
import {
  CORE_PROVIDER_ONBOARDING_FIXTURES,
  parseCoreProviderOnboardingContract,
  resolveOnboardingSafeActions,
} from "./index";

const actionShapes = new Set<string>();
for (const fixture of CORE_PROVIDER_ONBOARDING_FIXTURES) {
  const parsed = parseCoreProviderOnboardingContract(fixture, {
    expectedProviderKey: fixture.providerKey,
  });
  assert.equal(parsed.ok, true);
  if (parsed.ok) {
    actionShapes.add(
      JSON.stringify(resolveOnboardingSafeActions(parsed.contract, "credential_required"))
    );
  }
}
assert.ok(actionShapes.size > 1);

console.log("fixtures-render.test.ts: ok");
