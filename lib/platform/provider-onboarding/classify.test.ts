import assert from "node:assert/strict";
import { unonightApiKeyOnboarding } from "@/lib/app-portal/integrations/onboarding";
import {
  actionableContractIssues,
  classifyProviderList,
  classifyProviderListRow,
} from "./classify";

const unonight = classifyProviderListRow(
  {
    provider_key: "unonight",
    display_name: "Unonight",
    is_available: true,
    category: "integrations",
    has_onboarding_contract: true,
    onboarding_mode: "api_key_existing_provider",
    readiness_level: "production_ready",
    support_level: "guided",
  },
  unonightApiKeyOnboarding
);
assert.equal(unonight.kind, "production");
assert.equal(unonight.status, "production_ready");
assert.equal(unonight.isContractValid, true);

const shopify = classifyProviderListRow({
  provider_key: "shopify",
  display_name: "Shopify",
  is_available: true,
  category: "commerce",
  has_onboarding_contract: false,
});
assert.equal(shopify.kind, "placeholder");
assert.equal(shopify.status, "contract_required");
assert.notEqual(shopify.status, "contract_invalid");

const reference = classifyProviderListRow(
  {
    provider_key: "commerce_provider",
    display_name: "Commerce provider (reference)",
    is_available: false,
    category: "reference",
    has_onboarding_contract: true,
    onboarding_mode: "oauth",
    readiness_level: "production_ready",
  },
  {
    ...unonightApiKeyOnboarding,
    providerKey: "commerce_provider",
    onboardingMode: "oauth",
    supportsOAuth: true,
    supportsApiKey: false,
    credentialType: "oauth",
    apiKeyMetadata: null,
    oauthMetadata: {
      authorizationUrl: "https://github.com/example/oauth-authorize",
      tokenUrl: "https://github.com/example/oauth-token",
      callbackUrls: ["https://app.aipify.ai/api/oauth/callback"],
      pkceRequired: true,
      supportsRefreshTokens: true,
    },
  }
);
assert.equal(reference.kind, "reference");
assert.equal(reference.status, "reference_only");

const malformed = classifyProviderListRow(
  {
    provider_key: "broken",
    display_name: "Broken",
    is_available: true,
    has_onboarding_contract: true,
  },
  { version: 1, providerKey: "broken", onboardingMode: "not-a-mode" }
);
assert.equal(malformed.status, "contract_invalid");

const list = classifyProviderList([
  {
    provider_key: "shopify",
    display_name: "Shopify",
    is_available: true,
    has_onboarding_contract: false,
  },
  {
    provider_key: "unonight",
    display_name: "Unonight",
    is_available: true,
    has_onboarding_contract: true,
    readiness_level: "production_ready",
  },
]);
assert.equal(actionableContractIssues(list).length, 1);
assert.equal(actionableContractIssues(list)[0]?.row.provider_key, "shopify");

console.log("classify.test.ts: ok");
