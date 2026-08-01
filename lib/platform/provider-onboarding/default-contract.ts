import {
  CORE_PROVIDER_ONBOARDING_CONTRACT_VERSION,
  type CoreProviderOnboardingContract,
  type CoreProviderOnboardingMode,
} from "@/lib/app-portal/integrations/onboarding";

const DOC_URL = "https://docs.aipify.ai/integrations/getting-started";
const docs = {
  gettingStarted: { url: DOC_URL },
  installation: { url: "https://docs.aipify.ai/integrations/install" },
  credentialSetup: { url: "https://docs.aipify.ai/integrations/credentials" },
  permissions: { url: "https://docs.aipify.ai/integrations/permissions" },
  testing: { url: "https://docs.aipify.ai/integrations/testing" },
  troubleshooting: { url: "https://docs.aipify.ai/integrations/troubleshooting" },
  upgrade: { url: "https://docs.aipify.ai/integrations/upgrade" },
  uninstall: { url: "https://docs.aipify.ai/integrations/uninstall" },
  security: { url: "https://docs.aipify.ai/security" },
  privacy: { url: "https://docs.aipify.ai/privacy" },
  support: { url: "https://docs.aipify.ai/support" },
} as const;

const policy = {
  labelKey: "customerApp.portalStructure.integrations.onboarding.policy.standard",
  requiresApproval: true,
};

function modeFromSetupType(setupType?: string | null): CoreProviderOnboardingMode {
  const value = (setupType ?? "").toLowerCase();
  if (value === "oauth" || value === "both") return "oauth";
  return "api_key_existing_provider";
}

/** Draft-only template for providers that have not authored an onboarding contract yet. */
export function buildDefaultOnboardingContractDraft(input: {
  providerKey: string;
  setupType?: string | null;
}): CoreProviderOnboardingContract {
  const mode = modeFromSetupType(input.setupType);
  const isOauth = mode === "oauth";

  return {
    version: CORE_PROVIDER_ONBOARDING_CONTRACT_VERSION,
    providerKey: input.providerKey,
    onboardingMode: mode,
    implementationOwner: "provider",
    distributionChannel: isOauth ? "provider_marketplace" : "not_applicable",
    credentialType: isOauth ? "oauth" : "api_key",
    requiresExternalLogin: true,
    requiresCustomerInstallation: false,
    requiresCustomerDeveloper: false,
    requiresAipifyApproval: false,
    requiresProviderApproval: false,
    supportsAutomaticProvisioning: false,
    supportsManualProvisioning: true,
    supportsOAuth: isOauth,
    supportsApiKey: !isOauth,
    supportsConnectorPackage: false,
    supportsHostedConnector: false,
    supportsCustomImplementation: false,
    supportsHealthCheck: true,
    supportsStatusReadback: true,
    supportsUpgrade: true,
    supportsRollback: true,
    supportsUninstall: true,
    supportsRotation: true,
    supportsRevoke: true,
    supportsOneTimeReveal: true,
    installTarget: "provider_saas",
    packageMetadata: null,
    marketplaceMetadata: null,
    oauthMetadata: isOauth
      ? {
          authorizationUrl: "https://docs.aipify.ai/integrations/oauth-authorize",
          tokenUrl: "https://docs.aipify.ai/integrations/oauth-token",
          callbackUrls: ["https://app.aipify.ai/api/oauth/callback"],
          pkceRequired: true,
          supportsRefreshTokens: true,
        }
      : null,
    hostedConnectorMetadata: null,
    customImplementationMetadata: null,
    apiKeyMetadata: isOauth
      ? null
      : {
          labelKey: "customerApp.portalStructure.integrations.onboarding.apiKey",
          oneTimeReveal: true,
        },
    callbackPolicy: { allowedHosts: ["app.aipify.ai"], allowSubdomains: true },
    redirectPolicy: { allowedHosts: ["app.aipify.ai"], allowSubdomains: true },
    requiredScopes: ["metadata.read"],
    optionalScopes: [],
    requiredEnvironmentVariables: [],
    requiredNetworkAccess: ["https"],
    requiredPorts: [443],
    requiredDomains: [],
    requiredWebhookEndpoints: [],
    requiredPermissions: ["read"],
    setupSteps: [
      {
        key: "begin",
        labelKey: "customerApp.portalStructure.integrations.onboarding.responsibilities.customerApprove",
        actor: "customer",
      },
    ],
    verificationSteps: [
      {
        key: "verify",
        labelKey: "customerApp.portalStructure.integrations.onboarding.responsibilities.aipifyVerify",
        actor: "aipify",
      },
    ],
    customerResponsibilities: [
      {
        key: "approve",
        labelKey:
          "customerApp.portalStructure.integrations.onboarding.responsibilities.customerApprove",
      },
    ],
    aipifyResponsibilities: [
      {
        key: "verify",
        labelKey:
          "customerApp.portalStructure.integrations.onboarding.responsibilities.aipifyVerify",
      },
    ],
    providerResponsibilities: [
      {
        key: "issue",
        labelKey:
          "customerApp.portalStructure.integrations.onboarding.responsibilities.providerIssue",
      },
    ],
    partnerResponsibilities: [],
    supportLevel: "guided",
    readinessLevel: "development",
    docs,
    versionPolicy: policy,
    compatibilityPolicy: policy,
    activationPolicy: policy,
    deactivationPolicy: policy,
    uninstallPolicy: policy,
    failurePolicy: policy,
    auditPolicy: policy,
  };
}
