import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { CORE_PROVIDER_ONBOARDING_FIXTURES } from "./fixtures";
import { parseCoreProviderOnboardingContract } from "./parse";
import { resolveOnboardingSafeActions } from "./capabilities";

const OVERVIEW = join(
  process.cwd(),
  "components/app/app-portal/ProviderOnboardingOverview.tsx"
);
const PANEL = join(
  process.cwd(),
  "components/app/app-portal/AppPortalIntegrationSetupPanel.tsx"
);

describe("generic onboarding overview", () => {
  it("renders all five modes through the same generic shell without provider switches", () => {
    const overview = readFileSync(OVERVIEW, "utf8");
    const panel = readFileSync(PANEL, "utf8");

    expect(overview).toContain("ProviderOnboardingOverview");
    expect(overview).not.toMatch(/if\s*\(\s*provider(?:Key)?\s*===/);
    expect(overview).not.toMatch(/switch\s*\(\s*["']unonight["']/i);
    expect(panel).toContain("ProviderOnboardingOverview");
    expect(panel).not.toMatch(/if\s*\(\s*providerKey\s*===\s*["']unonight["']/);

    for (const fixture of CORE_PROVIDER_ONBOARDING_FIXTURES) {
      const parsed = parseCoreProviderOnboardingContract(fixture);
      expect(parsed.ok).toBe(true);
      if (!parsed.ok) continue;
      const actions = resolveOnboardingSafeActions(parsed.contract, "awaiting_customer_action");
      expect(actions.showOAuthConnect).toBe(fixture.onboardingMode === "oauth");
      expect(actions.showApiKeyFields).toBe(fixture.onboardingMode === "api_key_existing_provider");
      expect(actions.showConnectorDownload).toBe(fixture.onboardingMode === "installable_connector");
      expect(actions.showHostedActivate).toBe(false);
      expect(actions.showCustomSteps).toBe(
        fixture.onboardingMode === "custom_provider_implementation"
      );
    }
  });
});
