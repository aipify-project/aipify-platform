import { describe, expect, it } from "vitest";
import { fixtureHostedConnector, fixtureInstallableWordpressLike, resolveOnboardingSafeActions, unonightApiKeyOnboarding } from "./index";

describe("provider onboarding safe actions", () => {
  it("gates action presentation by capability and state", () => {
    expect(resolveOnboardingSafeActions(unonightApiKeyOnboarding, "credential_required").showApiKeyFields).toBe(true);
    expect(resolveOnboardingSafeActions(unonightApiKeyOnboarding, "blocked").showApiKeyFields).toBe(false);
    expect(resolveOnboardingSafeActions(fixtureInstallableWordpressLike, "not_started").showConnectorDownload).toBe(true);
    expect(resolveOnboardingSafeActions(fixtureHostedConnector, "not_started").showHostedActivate).toBe(true);
  });
  it("does not show activation before verification", () => {
    expect(resolveOnboardingSafeActions(unonightApiKeyOnboarding, "credential_stored").showActivate).toBe(false);
    expect(resolveOnboardingSafeActions(unonightApiKeyOnboarding, "verified").showActivate).toBe(true);
  });
});
