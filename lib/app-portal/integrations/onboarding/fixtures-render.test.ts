import { describe, expect, it } from "vitest";
import { CORE_PROVIDER_ONBOARDING_FIXTURES, parseCoreProviderOnboardingContract, resolveOnboardingSafeActions } from "./index";

describe("provider-neutral onboarding fixtures", () => {
  it("parses all fixtures and produces mode-specific safe actions", () => {
    const actionShapes = new Set<string>();
    for (const fixture of CORE_PROVIDER_ONBOARDING_FIXTURES) {
      const parsed = parseCoreProviderOnboardingContract(fixture, { expectedProviderKey: fixture.providerKey });
      expect(parsed.ok).toBe(true);
      if (parsed.ok) actionShapes.add(JSON.stringify(resolveOnboardingSafeActions(parsed.contract, "credential_required")));
    }
    expect(actionShapes.size).toBeGreaterThan(1);
  });
});
