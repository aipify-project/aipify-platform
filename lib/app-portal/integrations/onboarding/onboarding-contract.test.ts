import assert from "node:assert/strict";
import {
  CORE_PROVIDER_ONBOARDING_FIXTURES,
  fixtureInstallableWordpressLike,
  fixtureOauthShopifyLike,
  parseCoreProviderOnboardingContract,
  unonightApiKeyOnboarding,
} from "./index";

assert.equal(
  new Set(CORE_PROVIDER_ONBOARDING_FIXTURES.map((fixture) => fixture.onboardingMode)).size,
  5
);
for (const fixture of CORE_PROVIDER_ONBOARDING_FIXTURES) {
  assert.equal(
    parseCoreProviderOnboardingContract(fixture, { expectedProviderKey: fixture.providerKey }).ok,
    true
  );
}

assert.equal(
  parseCoreProviderOnboardingContract({ ...unonightApiKeyOnboarding, onboardingMode: "unknown" }).ok,
  false
);
assert.equal(
  parseCoreProviderOnboardingContract({ ...unonightApiKeyOnboarding, requiredScopes: undefined }).ok,
  false
);
assert.equal(
  parseCoreProviderOnboardingContract({
    ...unonightApiKeyOnboarding,
    docs: { ...unonightApiKeyOnboarding.docs, support: { url: "http://evil.example" } },
  }).ok,
  false
);

assert.equal(
  parseCoreProviderOnboardingContract({
    ...fixtureInstallableWordpressLike,
    packageMetadata: { ...fixtureInstallableWordpressLike.packageMetadata!, checksum: "" },
  }).ok,
  false
);
assert.equal(
  parseCoreProviderOnboardingContract({
    ...fixtureOauthShopifyLike,
    oauthMetadata: {
      ...fixtureOauthShopifyLike.oauthMetadata!,
      tokenUrl: "javascript:alert(1)",
    },
  }).ok,
  false
);

assert.equal(
  parseCoreProviderOnboardingContract({ ...unonightApiKeyOnboarding, supportsApiKey: false }).ok,
  false
);
assert.equal(
  parseCoreProviderOnboardingContract({
    ...unonightApiKeyOnboarding,
    apiKeyMetadata: {
      ...unonightApiKeyOnboarding.apiKeyMetadata!,
      formatHint: "api_key=private-value",
    },
  }).ok,
  false
);

console.log("onboarding-contract.test.ts: ok");
