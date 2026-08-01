import { CORE_PROVIDER_ONBOARDING_CONTRACT_VERSION } from "./parse";
import type { CoreProviderOnboardingContract } from "./types";

const docs = {
  gettingStarted: { url: "https://docs.aipify.ai/integrations/getting-started" }, installation: { url: "https://docs.aipify.ai/integrations/install" },
  credentialSetup: { url: "https://docs.aipify.ai/integrations/credentials" }, permissions: { url: "https://docs.aipify.ai/integrations/permissions" },
  testing: { url: "https://docs.aipify.ai/integrations/testing" }, troubleshooting: { url: "https://docs.aipify.ai/integrations/troubleshooting" },
  upgrade: { url: "https://docs.aipify.ai/integrations/upgrade" }, uninstall: { url: "https://docs.aipify.ai/integrations/uninstall" },
  security: { url: "https://docs.aipify.ai/security" }, privacy: { url: "https://docs.aipify.ai/privacy" }, support: { url: "https://docs.aipify.ai/support" },
} as const;
const policy = { labelKey: "customerApp.portalStructure.integrations.onboarding.policy.standard", requiresApproval: true };
const base = (providerKey: string): Omit<CoreProviderOnboardingContract, "providerKey" | "onboardingMode" | "implementationOwner" | "distributionChannel" | "credentialType" | "installTarget" | "packageMetadata" | "marketplaceMetadata" | "oauthMetadata" | "hostedConnectorMetadata" | "customImplementationMetadata" | "apiKeyMetadata"> => ({
  version: CORE_PROVIDER_ONBOARDING_CONTRACT_VERSION,
  requiresExternalLogin: true, requiresCustomerInstallation: false, requiresCustomerDeveloper: false, requiresAipifyApproval: false, requiresProviderApproval: false,
  supportsAutomaticProvisioning: false, supportsManualProvisioning: true, supportsOAuth: false, supportsApiKey: false, supportsConnectorPackage: false, supportsHostedConnector: false, supportsCustomImplementation: false,
  supportsHealthCheck: true, supportsStatusReadback: true, supportsUpgrade: true, supportsRollback: true, supportsUninstall: true, supportsRotation: true, supportsRevoke: true, supportsOneTimeReveal: true,
  callbackPolicy: { allowedHosts: ["app.aipify.ai"], allowSubdomains: true }, redirectPolicy: { allowedHosts: ["app.aipify.ai"], allowSubdomains: true },
  requiredScopes: ["metadata.read"], optionalScopes: [], requiredEnvironmentVariables: [], requiredNetworkAccess: ["https"], requiredPorts: [443], requiredDomains: ["api.customer.example"], requiredWebhookEndpoints: [], requiredPermissions: ["read"],
  setupSteps: [{ key: "begin", labelKey: `customerApp.portalStructure.integrations.onboarding.${providerKey}.begin`, actor: "customer" }],
  verificationSteps: [{ key: "verify", labelKey: `customerApp.portalStructure.integrations.onboarding.${providerKey}.verify`, actor: "aipify" }],
  customerResponsibilities: [{ key: "approve", labelKey: "customerApp.portalStructure.integrations.onboarding.responsibilities.customerApprove" }],
  aipifyResponsibilities: [{ key: "verify", labelKey: "customerApp.portalStructure.integrations.onboarding.responsibilities.aipifyVerify" }],
  providerResponsibilities: [], partnerResponsibilities: [], supportLevel: "guided", readinessLevel: "production_ready", docs,
  versionPolicy: policy, compatibilityPolicy: policy, activationPolicy: policy, deactivationPolicy: policy, uninstallPolicy: policy, failurePolicy: policy, auditPolicy: policy,
});

export const unonightApiKeyOnboarding: CoreProviderOnboardingContract = {
  ...base("unonight"), providerKey: "unonight", onboardingMode: "api_key_existing_provider", implementationOwner: "provider", distributionChannel: "not_applicable", credentialType: "api_key", installTarget: "provider_saas",
  supportsApiKey: true, apiKeyMetadata: { labelKey: "customerApp.portalStructure.integrations.onboarding.apiKey", oneTimeReveal: true },
  packageMetadata: null, marketplaceMetadata: null, oauthMetadata: null, hostedConnectorMetadata: null, customImplementationMetadata: null,
};
export const fixtureOauthShopifyLike: CoreProviderOnboardingContract = {
  ...base("commerce_provider"), providerKey: "commerce_provider", onboardingMode: "oauth", implementationOwner: "provider", distributionChannel: "provider_marketplace", credentialType: "oauth", installTarget: "provider_saas",
  supportsOAuth: true, marketplaceMetadata: { listingUrl: "https://apps.shopify.com/example-connector", listingId: "example-connector", publisher: "NETTSTED_NAVN", installLabelKey: "customerApp.portalStructure.integrations.onboarding.install" },
  oauthMetadata: { authorizationUrl: "https://github.com/example/oauth-authorize", tokenUrl: "https://github.com/example/oauth-token", callbackUrls: ["https://app.aipify.ai/api/oauth/callback"], pkceRequired: true, supportsRefreshTokens: true },
  packageMetadata: null, hostedConnectorMetadata: null, customImplementationMetadata: null, apiKeyMetadata: null,
};
export const fixtureInstallableWordpressLike: CoreProviderOnboardingContract = {
  ...base("cms_provider"), providerKey: "cms_provider", onboardingMode: "installable_connector", implementationOwner: "shared", distributionChannel: "provider_marketplace", credentialType: "custom", installTarget: "customer_cms",
  requiresCustomerInstallation: true, supportsConnectorPackage: true, marketplaceMetadata: { listingUrl: "https://wordpress.org/plugins/example-connector/", listingId: "example-connector", publisher: "NETTSTED_NAVN", installLabelKey: "customerApp.portalStructure.integrations.onboarding.install" },
  packageMetadata: { packageType: "wordpress_plugin", name: "example-connector", version: "1.0.0", downloadUrl: "https://wordpress.org/plugins/example-connector/", checksumAlgorithm: "sha256", checksum: "a".repeat(64), signatureAlgorithm: "sigstore", signature: "signed-artifact", signatureUrl: "https://github.com/example/example-connector/releases", installCommand: null, supportedPlatforms: ["wordpress"] },
  oauthMetadata: null, hostedConnectorMetadata: null, customImplementationMetadata: null, apiKeyMetadata: null,
};
export const fixtureHostedConnector: CoreProviderOnboardingContract = {
  ...base("hosted_connector"), providerKey: "hosted_connector", onboardingMode: "aipify_hosted_connector", implementationOwner: "aipify", distributionChannel: "aipify_managed", credentialType: "bearer", installTarget: "aipify_cloud",
  supportsAutomaticProvisioning: true, supportsHostedConnector: true, hostedConnectorMetadata: { serviceUrl: "https://docs.aipify.ai/hosted-connectors", provisioningLabelKey: "customerApp.portalStructure.integrations.onboarding.provision", requiresCustomerConfiguration: false },
  packageMetadata: null, marketplaceMetadata: null, oauthMetadata: null, customImplementationMetadata: null, apiKeyMetadata: null,
};
export const fixtureCustomErp: CoreProviderOnboardingContract = {
  ...base("custom_erp"), providerKey: "custom_erp", onboardingMode: "custom_provider_implementation", implementationOwner: "customer", distributionChannel: "customer_developer", credentialType: "custom", installTarget: "customer_custom_system",
  requiresCustomerDeveloper: true, supportsCustomImplementation: true, readinessLevel: "reference_only",
  customImplementationMetadata: { implementationState: "requirements_pending", specificationUrl: "https://github.com/example/custom-connector-specification", deliveryModel: "customer_developer", acceptanceCriteria: ["metadata-readback"], estimatedEffortLabelKey: "customerApp.portalStructure.integrations.onboarding.customEffort" },
  packageMetadata: null, marketplaceMetadata: null, oauthMetadata: null, hostedConnectorMetadata: null, apiKeyMetadata: null,
};
export const CORE_PROVIDER_ONBOARDING_FIXTURES = [unonightApiKeyOnboarding, fixtureOauthShopifyLike, fixtureInstallableWordpressLike, fixtureHostedConnector, fixtureCustomErp] as const;
