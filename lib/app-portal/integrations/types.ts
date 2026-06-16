export type AppPortalIntegrationProvider = {
  provider_key: string;
  display_name: string;
  category: string;
  setup_type: "oauth" | "manual" | "both";
  oauth_available: boolean;
  default_permission_level: "read_only" | "read_write";
  recommended_scopes: string[];
};

export type AppPortalIntegrationConnection = {
  id: string;
  provider_key: string;
  setup_type: "oauth" | "manual";
  status: string;
  permission_level: string;
  approved_scopes: string[];
  masked_credential_hint: string | null;
  last_test_success_at: string | null;
  last_test_failed_at: string | null;
  last_test_error: string | null;
};

export type AppPortalIntegrationsHub = {
  read_only_principle: string;
  can_manage: boolean;
  setup_flow_steps: string[];
  providers: AppPortalIntegrationProvider[];
  connections: AppPortalIntegrationConnection[];
  privacy_note: string;
};

export type AppPortalIntegrationSetup = {
  provider_key: string;
  display_name: string;
  setup_type: string;
  oauth_available: boolean;
  default_permission_level: string;
  recommended_scopes: string[];
  connection: {
    id: string;
    status: string;
    permission_level: string;
    approved_scopes: string[];
    masked_credential_hint: string | null;
    last_test_success_at: string | null;
    last_test_failed_at: string | null;
  } | null;
  manual_steps: string[];
  oauth_steps: string[];
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
  };
  setup: {
    title: string;
    loading: string;
    back: string;
    stepLabels: Record<string, string>;
    manualStepLabels: Record<string, string>;
    oauthStepLabels: Record<string, string>;
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
};
