import { describe, expect, it } from "vitest";
import { unonightApiKeyOnboarding, fixtureInstallableWordpressLike } from "./fixtures";
import { parseCoreProviderOnboardingContract } from "./parse";
import { validateHttpsAllowlistedUrl } from "./url-allowlist";

describe("onboarding security gates", () => {
  it("rejects open redirects and secret query params", () => {
    expect(
      validateHttpsAllowlistedUrl("https://docs.aipify.ai/x?redirect=https://evil.example", [
        "docs.aipify.ai",
      ]).ok
    ).toBe(false);
    expect(
      validateHttpsAllowlistedUrl("https://docs.aipify.ai/x?api_key=abc", ["docs.aipify.ai"]).ok
    ).toBe(false);
    expect(
      validateHttpsAllowlistedUrl("https://evil.example/docs", ["docs.aipify.ai"]).ok
    ).toBe(false);
  });

  it("rejects secrets in metadata and invalid package downloads", () => {
    const withSecret = {
      ...unonightApiKeyOnboarding,
      docs: {
        ...unonightApiKeyOnboarding.docs,
        support: { url: "https://docs.aipify.ai/support?token=abc" },
      },
    };
    expect(parseCoreProviderOnboardingContract(withSecret).ok).toBe(false);

    const badPackage = {
      ...fixtureInstallableWordpressLike,
      packageMetadata: {
        ...fixtureInstallableWordpressLike.packageMetadata!,
        downloadUrl: "https://evil.example/plugin.zip",
      },
    };
    expect(parseCoreProviderOnboardingContract(badPackage).ok).toBe(false);
  });

  it("rejects provider key mismatch (tenant/provider exact)", () => {
    const result = parseCoreProviderOnboardingContract(unonightApiKeyOnboarding, {
      expectedProviderKey: "other_provider",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("provider_mismatch");
  });
});
