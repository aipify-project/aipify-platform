export type AppPortalIntegrationProvider = {
  provider_key: string;
  display_name: string;
  category: string;
  setup_type: "oauth" | "manual" | "both";
  oauth_available: boolean;
  default_permission_level: "read_only" | "read_write";
  recommended_scopes: string[];
};

export type IntegrationVerificationMetadata = {
  organization_id?: string | null;
  organization_name?: string | null;
  access_mode?: string | null;
  scopes?: string[];
  api_version?: string | null;
  connected?: boolean;
  provider?: string | null;
};

export type AppPortalIntegrationConnection = {
  id: string;
  provider_key: string;
  setup_type: "oauth" | "manual";
  status: string;
  canonical_status?: string | null;
  permission_level: string;
  approved_scopes: string[];
  masked_credential_hint: string | null;
  last_test_success_at: string | null;
  last_test_failed_at: string | null;
  last_test_error: string | null;
  activated_at?: string | null;
  deactivated_at?: string | null;
  removed_at?: string | null;
  updated_at?: string | null;
  access_summary?: Record<string, unknown>;
  last_verification?: IntegrationVerificationMetadata | null;
  last_verified_at?: string | null;
  connection_name?: string | null;
};

export type IntegrationDuplicateWarning = {
  normalized_base_url: string;
  connection_ids: string[];
  provider_keys: string[];
  preferred_provider_key: string;
};

export type AppPortalIntegrationsHub = {
  read_only_principle: string;
  can_manage: boolean;
  setup_flow_steps: string[];
  providers: AppPortalIntegrationProvider[];
  connections: AppPortalIntegrationConnection[];
  duplicate_warnings: IntegrationDuplicateWarning[];
  privacy_note: string;
};

export type AppPortalIntegrationSetup = {
  provider_key: string;
  display_name: string;
  setup_type: string;
  oauth_available: boolean;
  default_permission_level: string;
  recommended_scopes: string[];
  connection: AppPortalIntegrationConnection | null;
  manual_steps: string[];
  oauth_steps: string[];
};

export type IntegrationPlainLanguageLabels = {
  apiKey: string;
  accessScope: string;
  readOnly: string;
  connectionTest: string;
  secureConnectionKey: string;
};

export type IntegrationStatusLabels = {
  pending: string;
  missingInfo: string;
  needsReview: string;
  connected: string;
  failed: string;
  readOnly: string;
  credentialSaved: string;
  verifiedReadOnly: string;
  active: string;
  inactive: string;
  revoked: string;
  removed: string;
  notConfigured: string;
  awaitingVerification: string;
};

export type IntegrationScopeDescriptionLabels = Record<string, string>;

export type IntegrationCompletionLabels = {
  verifiedHeading: string;
  credentialSavedHeading: string;
  statusActive: string;
  statusReadOnly: string;
  statusAwaitingVerification: string;
  statusVerified: string;
  statusInactive: string;
  deactivateCta: string;
  organizationLabel: string;
  accessTypeLabel: string;
  permissionsLabel: string;
  lastVerifiedLabel: string;
  apiVersionLabel: string;
  technicalDetailsLabel: string;
  technicalScopeLabel: string;
  verifiedBody: string;
  credentialSavedBody: string;
  primaryIntegrations: string;
  secondaryRetest: string;
  tertiaryOverview: string;
  primaryTest: string;
  secondaryIntegrations: string;
  activateCta: string;
  activating: string;
  overviewHref: string;
};

export type IntegrationRemoveDialogLabels = {
  title: string;
  titleNamed: string;
  body: string;
  bodyFailed: string;
  disconnectWhat: string;
  syncStops: string;
  credentialsRemoved: string;
  auditRemains: string;
  confirm: string;
  confirmDisconnect: string;
  cancel: string;
};

export type IntegrationHubDialogLabels = {
  title: string;
  body: string;
};

export type IntegrationHubActionLabels = {
  manage: string;
  retryTest: string;
  disconnect: string;
  retry: string;
  editSetup: string;
  removeIntegration: string;
  continueSetup: string;
};

export type IntegrationHubFeedbackLabels = {
  removeFailed: string;
  testFailed: string;
};

export type IntegrationAuthHelpProviderLabels = Record<string, string> & {
  step1?: string;
  step2?: string;
  step3?: string;
  step4?: string;
  step5?: string;
  technicalDetails?: string;
};

export type IntegrationAuthHelpLabels = {
  sectionTitles: Record<string, string>;
  stepsTitle: string;
  technicalDetailsTitle: string;
  technicalDetailsToggleShow: string;
  technicalDetailsToggleHide: string;
  provider: Record<string, IntegrationAuthHelpProviderLabels>;
};

export type IntegrationSecurityWarningLabels = {
  readOnlyDefault: string;
  noWriteWithoutApproval: string;
  credentialsEncrypted: string;
  revokeAnytime: string;
};

export type IntegrationKcLinkLabels = {
  setupGuide: string;
  setupGuideHref: string;
  faq: string;
  faqHref: string;
  findApiKey: string;
  findApiKeyHref: string;
};

export type IntegrationCompanionPromptLabels = {
  whereFindKey: string;
  whichProject: string;
  isAccessSafe: string;
  whyConnectionFails: string;
  checkMySetup: string;
};

export type IntegrationErrorGuidanceLabels = {
  actions: {
    retry: string;
    findKey: string;
    contactSupport: string;
  };
  findKeyHref: string;
  contactSupportHref: string;
};

export type AppPortalIntegrationsLabels = {
  hub: {
    title: string;
    subtitle: string;
    loading: string;
    readOnlyPrinciple: string;
    privacyNote: string;
    canManageNote: string;
    viewOnlyNote: string;
    connectedTitle: string;
    noConnections: string;
    providersTitle: string;
    connectCta: string;
    manageCta: string;
    lastTestSuccess: string;
    lastTestFailed: string;
    permissionReadOnly: string;
    permissionReadWrite: string;
    helpTitle: string;
    actionsMenuLabel: string;
    actions: IntegrationHubActionLabels;
    removeDialog: IntegrationHubDialogLabels;
    disconnectDialog: IntegrationHubDialogLabels;
    feedback: IntegrationHubFeedbackLabels;
    duplicateWarningTitle: string;
    duplicateWarningBody: string;
    duplicateWarningPreferred: string;
    duplicateWarningCleanup: string;
    activateIntegration: string;
    deactivateIntegration: string;
  };
  providerNames: Record<string, string>;
  setup: {
    title: string;
    loading: string;
    back: string;
    stepLabels: Record<string, string>;
    wizard7StepLabels: Record<string, string>;
    manualStepLabels: Record<string, string>;
    oauthStepLabels: Record<string, string>;
    plainLanguage: IntegrationPlainLanguageLabels;
    statuses: IntegrationStatusLabels;
    authHelp: IntegrationAuthHelpLabels;
    securityWarnings: IntegrationSecurityWarningLabels;
    kcLinks: IntegrationKcLinkLabels;
    companionPrompts: IntegrationCompanionPromptLabels;
    errorGuidance: IntegrationErrorGuidanceLabels;
    selectSetupType: string;
    oauthOption: string;
    manualOption: string;
    permissionPreview: string;
    approveScopes: string;
    approveScopesRequired: string;
    apiKeyLabel: string;
    apiKeyPlaceholder: string;
    apiKeyMaskedNote: string;
    accessSummaryTitle: string;
    whatAipifyReads: string;
    whatAipifyCannotDo: string;
    credentialStorage: string;
    revokeAccess: string;
    rotateKey: string;
    connectionFailed: string;
    save: string;
    test: string;
    remove: string;
    replace: string;
    connectOAuth: string;
    saving: string;
    testing: string;
    successTitle: string;
    successBody: string;
    whyAccess: string;
    whatNotToEnable: string;
    backStep: string;
    continueStep: string;
    confirmActivation: string;
    confirmActivationBody: string;
    connectionStatusLabel: string;
    unonight?: {
      baseUrlLabel: string;
      baseUrlHint: string;
      baseUrlPlaceholder: string;
      connectionNameLabel: string;
      connectionNamePlaceholder: string;
    };
    authHelpAsideTitle: string;
    testFailedTitle: string;
    activateCta: string;
    activating: string;
    loadErrorTitle: string;
    loadErrorBody: string;
    retryLoad: string;
    backToIntegrations: string;
    /** Pre-resolved i18n strings for client-side error panels (no server functions in client). */
    messageCatalog: Record<string, string>;
    completion: IntegrationCompletionLabels;
    removeDialog: IntegrationRemoveDialogLabels;
    manageIntegration: string;
    scopeDescriptions: IntegrationScopeDescriptionLabels;
  };
  guidance: {
    whyAccess: string;
    whatCanRead: string;
    whatCannotDo: string;
    howStored: string;
    howRevoke: string;
    howRotate: string;
    ifFails: string;
  };
  faq: Record<string, string>;
};
