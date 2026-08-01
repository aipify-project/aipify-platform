import { describe, expect, it } from "vitest";
import {
  CORE_PROVIDER_ONBOARDING_FIXTURES, fixtureInstallableWordpressLike, fixtureOauthShopifyLike,
  parseCoreProviderOnboardingContract, unonightApiKeyOnboarding,
} from "./index";

describe("Core provider onboarding contract", () => {
  it("accepts every onboarding mode", () => {
    expect(new Set(CORE_PROVIDER_ONBOARDING_FIXTURES.map((fixture) => fixture.onboardingMode)).size).toBe(5);
    for (const fixture of CORE_PROVIDER_ONBOARDING_FIXTURES) {
      expect(parseCoreProviderOnboardingContract(fixture, { expectedProviderKey: fixture.providerKey }).ok).toBe(true);
    }
  });
  it("fails closed for invalid or incomplete fields", () => {
    expect(parseCoreProviderOnboardingContract({ ...unonightApiKeyOnboarding, onboardingMode: "unknown" }).ok).toBe(false);
    expect(parseCoreProviderOnboardingContract({ ...unonightApiKeyOnboarding, requiredScopes: undefined }).ok).toBe(false);
    expect(parseCoreProviderOnboardingContract({ ...unonightApiKeyOnboarding, docs: { ...unonightApiKeyOnboarding.docs, support: { url: "http://evil.example" } } }).ok).toBe(false);
  });
  it("rejects invalid package and OAuth metadata", () => {
    expect(parseCoreProviderOnboardingContract({ ...fixtureInstallableWordpressLike, packageMetadata: { ...fixtureInstallableWordpressLike.packageMetadata!, checksum: "" } }).ok).toBe(false);
    expect(parseCoreProviderOnboardingContract({ ...fixtureOauthShopifyLike, oauthMetadata: { ...fixtureOauthShopifyLike.oauthMetadata!, tokenUrl: "javascript:alert(1)" } }).ok).toBe(false);
  });
  it("rejects incompatible modes and secret metadata", () => {
    expect(parseCoreProviderOnboardingContract({ ...unonightApiKeyOnboarding, supportsApiKey: false }).ok).toBe(false);
    expect(parseCoreProviderOnboardingContract({ ...unonightApiKeyOnboarding, apiKeyMetadata: { ...unonightApiKeyOnboarding.apiKeyMetadata!, formatHint: "api_key=private-value" } }).ok).toBe(false);
  });
});
