import assert from "node:assert/strict";
import {
  fixtureInstallableWordpressLike,
  parseCoreProviderOnboardingContract,
  unonightApiKeyOnboarding,
  validateHttpsAllowlistedUrl,
} from "./index";

assert.equal(
  validateHttpsAllowlistedUrl("https://docs.aipify.ai/x?redirect=https://evil.example", [
    "docs.aipify.ai",
  ]).ok,
  false
);
assert.equal(
  validateHttpsAllowlistedUrl("https://docs.aipify.ai/x?api_key=abc", ["docs.aipify.ai"]).ok,
  false
);
assert.equal(
  validateHttpsAllowlistedUrl("https://evil.example/docs", ["docs.aipify.ai"]).ok,
  false
);

const withSecret = {
  ...unonightApiKeyOnboarding,
  docs: {
    ...unonightApiKeyOnboarding.docs,
    support: { url: "https://docs.aipify.ai/support?token=abc" },
  },
};
assert.equal(parseCoreProviderOnboardingContract(withSecret).ok, false);

const badPackage = {
  ...fixtureInstallableWordpressLike,
  packageMetadata: {
    ...fixtureInstallableWordpressLike.packageMetadata!,
    downloadUrl: "https://evil.example/plugin.zip",
  },
};
assert.equal(parseCoreProviderOnboardingContract(badPackage).ok, false);

const mismatch = parseCoreProviderOnboardingContract(unonightApiKeyOnboarding, {
  expectedProviderKey: "other_provider",
});
assert.equal(mismatch.ok, false);
if (!mismatch.ok) assert.equal(mismatch.code, "provider_mismatch");

console.log("security.test.ts: ok");
