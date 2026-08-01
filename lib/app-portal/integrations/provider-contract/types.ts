/**
 * Core APP dynamic provider integration contract (V1).
 * Authoritative presentation + capability data for shared APP wizard.
 * Source of truth: Core registry (`app_portal_integration_providers.presentation_contract`).
 */

export const CORE_APP_INTEGRATION_PROVIDER_CONTRACT_VERSION = 1 as const;

export type CoreAppIntegrationCredentialType = "api_key" | "oauth" | "bearer" | "custom";

export type CoreAppIntegrationSetupStepActionType =
  | "open_admin"
  | "external_login"
  | "navigate"
  | "create_credential"
  | "confirm_scopes"
  | "copy_credential"
  | "return_to_app"
  | "save_credential"
  | "test_connection"
  | "info";

export type CoreAppIntegrationSetupStep = {
  key: string;
  actionType: CoreAppIntegrationSetupStepActionType;
  /** When true, renderer may show external-login instruction for this step. */
  requiresExternalLogin?: boolean;
  /** Optional locale template key under integrations.setup.contractSteps.* */
  labelKey?: string;
  /** Structured label data for interpolation (never hardcodes a provider name in UI). */
  labelParams?: Record<string, string>;
};

export type CoreAppIntegrationHelpSection = {
  key: string;
  titleKey?: string;
  body: string;
};

export type CoreAppIntegrationScopePresentation = {
  scope: string;
  label: string;
  description: string;
};

export type CoreAppIntegrationProviderCapabilities = {
  canIssueCredential: boolean;
  supportsOneTimeReveal: boolean;
  supportsRotation: boolean;
  supportsRevoke: boolean;
  supportsReturnToApp: boolean;
  supportsServerExchange: boolean;
  requiresManualCopyPaste: boolean;
  supportsConnectionTest: boolean;
  requiresScopeReview: boolean;
  /** When false/undefined, UI must not show “log in to admin” as a default step. */
  requiresExternalLogin: boolean;
  collectsBaseUrl: boolean;
  collectsConnectionName: boolean;
};

export type CoreAppIntegrationReturnPolicy = {
  supportsReturnToApp: boolean;
  allowedReturnHosts: string[];
};

export type CoreAppIntegrationTestPolicy = {
  requiredBeforeActivation: boolean;
  supportsConnectionTest: boolean;
};

export type CoreAppIntegrationActivationPolicy = {
  requiresVerifiedTest: boolean;
  requiresScopeApproval: boolean;
};

export type CoreAppIntegrationRotationPolicy = {
  supportsRotation: boolean;
  requiresNewCredential: boolean;
};

export type CoreAppIntegrationRevokePolicy = {
  supportsRevoke: boolean;
  revokeInProviderAdmin: boolean;
};

export type CoreAppIntegrationStatusPresentation = {
  pending: string;
  connected: string;
  failed: string;
  rotationRequired: string;
  active: string;
  inactive: string;
};

/**
 * Canonical typed contract returned to APP (safe DTO — no secrets).
 */
export type CoreAppIntegrationProviderContract = {
  version: typeof CORE_APP_INTEGRATION_PROVIDER_CONTRACT_VERSION;
  providerKey: string;
  displayName: string;
  adminDisplayName: string;
  credentialDisplayName: string;
  credentialType: CoreAppIntegrationCredentialType;
  adminBaseUrl: string;
  adminIntegrationPath: string;
  adminIntegrationUrl: string;
  allowedAdminHosts: string[];
  connectionTestLabel: string;
  requiredScopes: string[];
  optionalScopes: string[];
  scopeLabels: Record<string, string>;
  scopeDescriptions: Record<string, string>;
  setupSteps: CoreAppIntegrationSetupStep[];
  helpSections: CoreAppIntegrationHelpSection[];
  capabilities: CoreAppIntegrationProviderCapabilities;
  returnPolicy: CoreAppIntegrationReturnPolicy;
  testPolicy: CoreAppIntegrationTestPolicy;
  activationPolicy: CoreAppIntegrationActivationPolicy;
  rotationPolicy: CoreAppIntegrationRotationPolicy;
  revokePolicy: CoreAppIntegrationRevokePolicy;
  statusPresentation: CoreAppIntegrationStatusPresentation;
  externalLoginInstruction: string | null;
  adminOpenInstruction: string;
  localeFallback: string;
};

export type CoreAppIntegrationProviderContractParseFailure =
  | "missing_contract"
  | "unsupported_version"
  | "missing_provider_key"
  | "missing_display_name"
  | "missing_admin_destination"
  | "missing_credential_type"
  | "missing_required_scopes"
  | "invalid_admin_url"
  | "host_not_allowlisted"
  | "provider_mismatch"
  | "malformed_contract";

export type CoreAppIntegrationProviderContractParseResult =
  | { ok: true; contract: CoreAppIntegrationProviderContract }
  | { ok: false; code: CoreAppIntegrationProviderContractParseFailure; detail?: string };
