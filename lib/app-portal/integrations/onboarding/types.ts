import type { CoreAppIntegrationCredentialType } from "../provider-contract";
import type {
  CoreConnectorPackageType, CoreProviderDistributionChannel, CoreProviderImplementationOwner,
  CoreProviderInstallTarget, CoreProviderOnboardingMode, CoreProviderReadinessLevel, CoreProviderSupportLevel,
} from "./enums";

export type CoreProviderActor = "customer" | "aipify" | "provider" | "partner";
export type CoreProviderContractStep = { key: string; labelKey: string; actor: CoreProviderActor };
export type CoreProviderResponsibility = { key: string; labelKey: string };
export type CoreProviderDocumentationLink = { url: string; locale?: string; version?: string };
export type CoreProviderUrlPolicy = { allowedHosts: string[]; allowSubdomains: boolean };
export type CoreProviderPolicy = { labelKey: string; requiresApproval: boolean; details?: string[] };

/** Package data is informational. `installCommand` is never executable application input. */
export type CoreConnectorPackageMetadata = {
  packageType: CoreConnectorPackageType; name: string; version: string; downloadUrl: string;
  checksumAlgorithm: "sha256" | "sha384" | "sha512"; checksum: string;
  signatureAlgorithm: "pgp" | "cosign" | "sigstore" | "x509"; signature: string; signatureUrl?: string;
  installCommand: string | null; minimumRuntimeVersion?: string; supportedPlatforms: string[];
};
export type CoreProviderMarketplaceMetadata = {
  listingUrl: string; listingId: string; publisher: string; installLabelKey: string;
};
export type CoreProviderOAuthMetadata = {
  authorizationUrl: string; tokenUrl: string; clientRegistrationUrl?: string;
  callbackUrls: string[]; pkceRequired: boolean; supportsRefreshTokens: boolean;
};
export type CoreProviderHostedConnectorMetadata = {
  serviceUrl: string; region?: string; provisioningLabelKey: string; requiresCustomerConfiguration: boolean;
};
export type CoreProviderCustomImplementationMetadata = {
  implementationState: import("./enums").CoreCustomImplementationState;
  specificationUrl: string; deliveryModel: "customer_developer" | "partner" | "aipify_professional_services";
  acceptanceCriteria: string[]; estimatedEffortLabelKey: string;
};
export type CoreProviderApiKeyMetadata = {
  labelKey: string; formatHint?: string; oneTimeReveal: boolean; rotationInstructionsUrl?: string;
};

export type CoreProviderOnboardingContract = {
  version: 1; providerKey: string;
  onboardingMode: CoreProviderOnboardingMode; implementationOwner: CoreProviderImplementationOwner;
  distributionChannel: CoreProviderDistributionChannel; credentialType: CoreAppIntegrationCredentialType;
  requiresExternalLogin: boolean; requiresCustomerInstallation: boolean; requiresCustomerDeveloper: boolean;
  requiresAipifyApproval: boolean; requiresProviderApproval: boolean; supportsAutomaticProvisioning: boolean;
  supportsManualProvisioning: boolean; supportsOAuth: boolean; supportsApiKey: boolean;
  supportsConnectorPackage: boolean; supportsHostedConnector: boolean; supportsCustomImplementation: boolean;
  supportsHealthCheck: boolean; supportsStatusReadback: boolean; supportsUpgrade: boolean; supportsRollback: boolean;
  supportsUninstall: boolean; supportsRotation: boolean; supportsRevoke: boolean; supportsOneTimeReveal: boolean;
  installTarget: CoreProviderInstallTarget;
  packageMetadata: CoreConnectorPackageMetadata | null; marketplaceMetadata: CoreProviderMarketplaceMetadata | null;
  oauthMetadata: CoreProviderOAuthMetadata | null; hostedConnectorMetadata: CoreProviderHostedConnectorMetadata | null;
  customImplementationMetadata: CoreProviderCustomImplementationMetadata | null; apiKeyMetadata: CoreProviderApiKeyMetadata | null;
  callbackPolicy: CoreProviderUrlPolicy; redirectPolicy: CoreProviderUrlPolicy;
  requiredScopes: string[]; optionalScopes: string[]; requiredEnvironmentVariables: string[];
  requiredNetworkAccess: string[]; requiredPorts: number[]; requiredDomains: string[];
  requiredWebhookEndpoints: string[]; requiredPermissions: string[];
  setupSteps: CoreProviderContractStep[]; verificationSteps: CoreProviderContractStep[];
  customerResponsibilities: CoreProviderResponsibility[]; aipifyResponsibilities: CoreProviderResponsibility[];
  providerResponsibilities: CoreProviderResponsibility[]; partnerResponsibilities: CoreProviderResponsibility[];
  supportLevel: CoreProviderSupportLevel; readinessLevel: CoreProviderReadinessLevel;
  docs: {
    gettingStarted: CoreProviderDocumentationLink | null; installation: CoreProviderDocumentationLink | null;
    credentialSetup: CoreProviderDocumentationLink | null; permissions: CoreProviderDocumentationLink | null;
    testing: CoreProviderDocumentationLink | null; troubleshooting: CoreProviderDocumentationLink | null;
    upgrade: CoreProviderDocumentationLink | null; uninstall: CoreProviderDocumentationLink | null;
    security: CoreProviderDocumentationLink | null; privacy: CoreProviderDocumentationLink | null;
    support: CoreProviderDocumentationLink | null;
  };
  versionPolicy: CoreProviderPolicy; compatibilityPolicy: CoreProviderPolicy; activationPolicy: CoreProviderPolicy;
  deactivationPolicy: CoreProviderPolicy; uninstallPolicy: CoreProviderPolicy; failurePolicy: CoreProviderPolicy;
  auditPolicy: CoreProviderPolicy;
};

export type CoreProviderOnboardingParseFailure =
  | "missing_contract" | "malformed_contract" | "unsupported_version" | "missing_provider_key"
  | "provider_mismatch" | "invalid_enum" | "invalid_field" | "invalid_url" | "secret_detected"
  | "mode_capability_mismatch" | "invalid_package_metadata" | "invalid_oauth_metadata";
export type CoreProviderOnboardingParseResult =
  | { ok: true; contract: CoreProviderOnboardingContract }
  | { ok: false; code: CoreProviderOnboardingParseFailure; detail?: string };
