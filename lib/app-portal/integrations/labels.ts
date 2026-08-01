import type { Translator } from "@/lib/i18n/translate";
import {
  INTEGRATION_AUTH_HELP_PROVIDERS,
  INTEGRATION_WIZARD_STEPS,
  authHelpFieldKey,
  authHelpStepKey,
  authHelpTechnicalDetailsKey,
  getAuthHelpFieldKeys,
  getAuthHelpStepCount,
  listIntegrationErrorTranslationKeys,
} from "@/lib/install/integration-setup";
import { listUnonightFailureTranslationKeys } from "@/lib/unonight/connection/failures";
import { listProviderConnectionFailureTranslationKeys } from "./provider-contract";
import type { AppPortalIntegrationsLabels } from "./types";
import { APP_PORTAL_HOME_ROUTE } from "@/lib/app-portal/nav-config";

const base = "customerApp.portalStructure.integrations";

function buildAuthHelpProviderLabels(
  t: Translator,
  provider: (typeof INTEGRATION_AUTH_HELP_PROVIDERS)[number]
) {
  const fields = getAuthHelpFieldKeys(provider);
  const stepCount = getAuthHelpStepCount(provider);
  const entries: Record<string, string> = {};

  for (const field of fields) {
    entries[field] = t(authHelpFieldKey(provider, field));
  }
  for (let i = 0; i < stepCount; i++) {
    entries[`step${i + 1}`] = t(authHelpStepKey(provider, i));
  }
  entries.technicalDetails = t(authHelpTechnicalDetailsKey(provider));

  return entries;
}


/** Serializable onboarding copy for Client Components — never pass translator functions across the RSC boundary. */
export function buildOnboardingMessageCatalog(t: Translator): Record<string, string> {
  const root = "customerApp.portalStructure.integrations.onboarding";
  // Enumerate known leaves so missing locale keys fail closed to translator fallback.
  const keys = [
    "title", "subtitle", "noServerAccessNotice", "connectProvider", "installConnector", "openAdmin",
    "authorizeAccess", "customerActionRequired", "aipifyActionRequired", "providerActionRequired",
    "connectorVersion", "compatibleWith", "updateAvailable", "technicalImplementationRequired",
    "responsibilitiesTitle", "customerRole", "aipifyRole", "providerRole", "partnerRole", "docsTitle",
    "packageTitle", "checksum", "signature", "releaseChannel", "marketplace", "download", "installGuide",
    "upgradeGuide", "uninstallGuide", "healthCheck", "displayOnlyCommand", "apiKey", "install", "provision",
    "customEffort", "policy.standard",
    "fields.implementationOwner", "fields.distributionChannel", "fields.installTarget", "fields.provider",
    "fields.onboardingMode", "fields.readiness", "fields.support", "fields.installationState",
    "modes.oauth", "modes.api_key_existing_provider", "modes.installable_connector",
    "modes.aipify_hosted_connector", "modes.custom_provider_implementation",
    "channels.provider_marketplace", "channels.direct_download", "channels.package_registry",
    "channels.container_image", "channels.customer_developer", "channels.aipify_managed", "channels.not_applicable",
    "owners.provider", "owners.customer", "owners.aipify", "owners.shared",
    "readiness.reference_only", "readiness.development", "readiness.preview", "readiness.production_ready",
    "readiness.deprecated", "readiness.blocked", "readiness.unsupported",
    "support.self_service", "support.guided", "support.aipify_managed", "support.partner_managed",
    "support.customer_managed", "support.unsupported",
    "installTargets.none", "installTargets.provider_saas", "installTargets.customer_server",
    "installTargets.customer_cms", "installTargets.customer_ecommerce", "installTargets.customer_cloud",
    "installTargets.customer_container_platform", "installTargets.aipify_cloud",
    "installTargets.customer_custom_system",
    "states.not_started", "states.requirements_pending", "states.awaiting_customer_action",
    "states.awaiting_provider_action", "states.awaiting_aipify_action", "states.installation_in_progress",
    "states.credential_required", "states.credential_stored", "states.connection_test_required",
    "states.connection_test_failed", "states.verified", "states.activation_required", "states.active",
    "states.update_available", "states.upgrade_in_progress", "states.degraded", "states.suspended",
    "states.revoke_required", "states.uninstall_pending", "states.removed", "states.blocked", "states.unsupported",
    "responsibilities.customerApprove", "responsibilities.aipifyVerify", "responsibilities.customerInstall",
    "responsibilities.customerCredential", "responsibilities.customerScopes", "responsibilities.customerNetwork",
    "responsibilities.aipifyContract", "responsibilities.aipifyMonitor", "responsibilities.providerIssue",
    "responsibilities.providerLimits", "responsibilities.partnerAssist",
    "docs.gettingStarted", "docs.installation", "docs.credentialSetup", "docs.permissions", "docs.testing",
    "docs.troubleshooting", "docs.upgrade", "docs.uninstall", "docs.security", "docs.privacy", "docs.support",
    "unonight.begin", "unonight.verify", "commerce_provider.begin", "commerce_provider.verify",
    "cms_provider.begin", "cms_provider.verify", "hosted_connector.begin", "hosted_connector.verify",
    "custom_erp.begin", "custom_erp.verify",
  ].map((suffix) => `${root}.${suffix}`);
  return Object.fromEntries(keys.map((key) => [key, t(key)]));
}

function buildInstallationWizardMessageCatalog(t: Translator): Record<string, string> {
  const root = `${base}.installationWizard`;
  const suffixes = [
    "reassurance",
    "technicalRequired",
    "progress",
    "estimatedTime",
    "emptyFallback",
    "comingLater",
    "invitePlaceholder",
    "loading",
    "waiting",
    "blocked",
    "error",
    "completed",
    "activateGate",
    "pauseSaved",
    "resume",
    "staleContract",
    "primaryContinue",
    "primaryBack",
    "supportModes.selfService",
    "supportModes.guided",
    "supportModes.aipifyManaged",
    "supportModes.partnerManaged",
    "supportModes.customerItManaged",
    "states.notStarted",
    "states.supportSelection",
    "states.awaitingCustomer",
    "states.awaitingAipify",
    "states.awaitingPartner",
    "states.awaitingProvider",
    "states.awaitingCustomerIt",
    "states.inProgress",
    "states.credentialsRequired",
    "states.configurationRequired",
    "states.readyForTest",
    "states.testing",
    "states.testFailed",
    "states.verified",
    "states.readyForActivation",
    "states.active",
    "states.paused",
    "states.blocked",
    "states.unsupported",
    "states.cancelled",
    "states.completed",
    "test.testing",
    "test.ok",
    "test.needInfo",
    "test.followUp",
    "test.failed",
    "test.retry",
    "test.askHelp",
    "actions.askAipifyHelp",
    "actions.askAipifyHelpDescription",
    "actions.requestGuided",
    "actions.aipifyManaged",
    "actions.inviteProvider",
    "actions.inviteIt",
    "actions.invitePartner",
    "actions.selfService",
    "actions.changeMethod",
    "actions.contactSupport",
    "actions.continueLater",
    "responsibleParties.customer",
    "responsibleParties.aipify",
    "responsibleParties.partner",
    "responsibleParties.provider",
    "responsibleParties.customer_it",
    "fields.apiKey",
    "fields.baseUrl",
    "fields.itRecipient",
    "help.customer",
    "help.internal",
    "steps.introduction.title",
    "steps.introduction.description",
    "steps.chooseSupport.title",
    "steps.chooseSupport.description",
    "steps.test.title",
    "steps.test.description",
    "steps.test.internalTitle",
    "steps.test.internalDescription",
    "steps.review.title",
    "steps.review.description",
    "steps.activate.title",
    "steps.activate.description",
    "steps.completion.title",
    "steps.completion.description",
    "steps.oauth.title",
    "steps.oauth.description",
    "steps.oauth.internalTitle",
    "steps.oauth.internalDescription",
    "steps.waitingAipify.title",
    "steps.waitingAipify.description",
    "steps.installConnector.title",
    "steps.installConnector.description",
    "steps.installConnector.internalTitle",
    "steps.installConnector.internalDescription",
    "steps.inviteIt.title",
    "steps.inviteIt.description",
    "steps.hostedWaiting.title",
    "steps.hostedWaiting.description",
    "steps.hostedWaiting.internalTitle",
    "steps.hostedWaiting.internalDescription",
    "steps.customConfig.title",
    "steps.customConfig.description",
    "steps.customConfig.internalTitle",
    "steps.customConfig.internalDescription",
    "steps.unsupported.title",
    "steps.unsupported.description",
    "steps.credentials.title",
    "steps.credentials.description",
    "steps.credentials.internalTitle",
    "steps.credentials.internalDescription",
  ];
  return Object.fromEntries(suffixes.map((suffix) => [`${root}.${suffix}`, t(`${root}.${suffix}`)]));
}

function buildIntegrationMessageCatalog(t: Translator): Record<string, string> {
  const keys = [
    ...listIntegrationErrorTranslationKeys(),
    ...listProviderConnectionFailureTranslationKeys(),
    // Adapter failure keys remain for server-side message mapping (Class A).
    ...listUnonightFailureTranslationKeys(),
  ];
  return {
    ...Object.fromEntries(keys.map((key) => [key, t(key)])),
    ...buildOnboardingMessageCatalog(t),
    ...buildInstallationWizardMessageCatalog(t),
  };
}

export function buildAppPortalIntegrationsLabels(t: Translator): AppPortalIntegrationsLabels {
  const h = `${base}.hub`;
  const s = `${base}.setup`;
  const g = `${base}.guidance`;
  const pl = `${base}.plainLanguage`;
  const st = `${base}.statuses`;
  const ah = `${base}.authHelp`;
  const sw = `${base}.securityWarnings`;
  const kc = `${base}.kcLinks`;
  const cp = `${base}.companionPrompts`;
  const eg = `${base}.errorGuidance`;
  const sc = `${base}.scopeDescriptions`;
  const comp = `${s}.completion`;
  const rd = `${s}.removeDialog`;
  const hd = `${h}.removeDialog`;
  const hdd = `${h}.disconnectDialog`;
  const ha = `${h}.actions`;
  const hf = `${h}.feedback`;
  const pn = `${base}.providerNames`;

  const scopeKeys = [
    "metadata.read",
    "organization.read",
    "integration.status.read",
    "platform.metadata.read",
    "read_products",
    "read_orders",
    "read_customers",
  ] as const;

  const stepKeys = [
    "select_platform",
    "explain_needs",
    "find_api_key",
    "choose_permissions",
    "validate_connection",
    "access_summary",
    "save_securely",
    "log_action",
  ] as const;

  const manualKeys = [
    "login",
    "open_menu",
    "locate_keys",
    "choose_permissions",
    "avoid_permissions",
    "copy_key",
    "paste_in_aipify",
    "test_connection",
  ] as const;

  const oauthKeys = [
    "connect_button",
    "permission_preview",
    "provider_redirect",
    "success_confirmation",
    "connected_summary",
  ] as const;

  const faqSlugs = [
    "connectExternalPlatform",
    "whatIsReadOnlyAccess",
    "whyApiAccess",
    "whereFindApiKey",
    "whichPermissionsToChoose",
    "canAipifyChangeData",
    "removeIntegration",
    "rotateApiKey",
    "integrationFails",
    "oauthVsApiKeys",
    "isItSafeToConnect",
    "whatIsSecureConnectionKey",
    "howToTestConnection",
    "canChangePermissionsLater",
    "whoCanManageIntegrations",
  ] as const;

  const authHelpSectionFields = [
    "what",
    "why",
    "where",
    "project",
    "permissions",
    "canChange",
    "revoke",
  ] as const;

  return {
    hub: {
      title: t(`${h}.title`),
      subtitle: t(`${h}.subtitle`),
      loading: t(`${h}.loading`),
      readOnlyPrinciple: t(`${h}.readOnlyPrinciple`),
      privacyNote: t(`${h}.privacyNote`),
      canManageNote: t(`${h}.canManageNote`),
      viewOnlyNote: t(`${h}.viewOnlyNote`),
      connectedTitle: t(`${h}.connectedTitle`),
      noConnections: t(`${h}.noConnections`),
      providersTitle: t(`${h}.providersTitle`),
      connectCta: t(`${h}.connectCta`),
      manageCta: t(`${h}.manageCta`),
      lastTestSuccess: t(`${h}.lastTestSuccess`),
      lastTestFailed: t(`${h}.lastTestFailed`),
      permissionReadOnly: t(`${h}.permissionReadOnly`),
      permissionReadWrite: t(`${h}.permissionReadWrite`),
      helpTitle: t(`${h}.helpTitle`),
      actionsMenuLabel: t(`${h}.actionsMenuLabel`),
      actions: {
        manage: t(`${ha}.manage`),
        retryTest: t(`${ha}.retryTest`),
        disconnect: t(`${ha}.disconnect`),
        retry: t(`${ha}.retry`),
        editSetup: t(`${ha}.editSetup`),
        removeIntegration: t(`${ha}.removeIntegration`),
        continueSetup: t(`${ha}.continueSetup`),
      },
      removeDialog: {
        title: t(`${hd}.title`),
        body: t(`${hd}.body`),
      },
      disconnectDialog: {
        title: t(`${hdd}.title`),
        body: t(`${hdd}.body`),
      },
      feedback: {
        removeFailed: t(`${hf}.removeFailed`),
        testFailed: t(`${hf}.testFailed`),
        activateFailed: t(`${hf}.activateFailed`),
        deactivateFailed: t(`${hf}.deactivateFailed`),
      },
      duplicateWarningTitle: t(`${h}.duplicateWarningTitle`),
      duplicateWarningBody: t(`${h}.duplicateWarningBody`),
      duplicateWarningPreferred: t(`${h}.duplicateWarningPreferred`),
      duplicateWarningCleanup: t(`${h}.duplicateWarningCleanup`),
      activateIntegration: t(`${h}.activateIntegration`),
      deactivateIntegration: t(`${h}.deactivateIntegration`),
    },
    providerNames: {
      custom_api: t(`${pn}.custom_api`),
      unonight: t(`${pn}.unonight`),
      shopify: t(`${pn}.shopify`),
      wordpress: t(`${pn}.wordpress`),
      stripe: t(`${pn}.stripe`),
      woocommerce: t(`${pn}.woocommerce`),
    },
    setup: {
      title: t(`${s}.title`),
      loading: t(`${s}.loading`),
      back: t(`${s}.back`),
      stepLabels: Object.fromEntries(stepKeys.map((key) => [key, t(`${s}.steps.${key}`)])),
      wizard7StepLabels: Object.fromEntries(
        INTEGRATION_WIZARD_STEPS.map((key) => [key, t(`${base}.wizard7Steps.${key}`)])
      ),
      manualStepLabels: Object.fromEntries(manualKeys.map((key) => [key, t(`${s}.manualSteps.${key}`)])),
      oauthStepLabels: Object.fromEntries(oauthKeys.map((key) => [key, t(`${s}.oauthSteps.${key}`)])),
      plainLanguage: {
        apiKey: t(`${pl}.apiKey`),
        accessScope: t(`${pl}.accessScope`),
        readOnly: t(`${pl}.readOnly`),
        connectionTest: t(`${pl}.connectionTest`),
        secureConnectionKey: t(`${pl}.secureConnectionKey`),
      },
      statuses: {
        pending: t(`${st}.pending`),
        missingInfo: t(`${st}.missingInfo`),
        needsReview: t(`${st}.needsReview`),
        connected: t(`${st}.connected`),
        failed: t(`${st}.failed`),
        readOnly: t(`${st}.readOnly`),
        credentialSaved: t(`${st}.credentialSaved`),
        verifiedReadOnly: t(`${st}.verifiedReadOnly`),
        active: t(`${st}.active`),
        inactive: t(`${st}.inactive`),
        revoked: t(`${st}.revoked`),
        removed: t(`${st}.removed`),
        notConfigured: t(`${st}.notConfigured`),
        awaitingVerification: t(`${st}.awaitingVerification`),
        rotationRequired: t(`${st}.rotationRequired`),
      },
      authHelp: {
        sectionTitles: Object.fromEntries(
          authHelpSectionFields.map((field) => [field, t(`${ah}.sectionTitles.${field}`)])
        ),
        stepsTitle: t(`${ah}.stepsTitle`),
        technicalDetailsTitle: t(`${ah}.technicalDetailsTitle`),
        technicalDetailsToggleShow: t(`${ah}.technicalDetailsToggleShow`),
        technicalDetailsToggleHide: t(`${ah}.technicalDetailsToggleHide`),
        provider: Object.fromEntries(
          INTEGRATION_AUTH_HELP_PROVIDERS.map((provider) => [
            provider,
            buildAuthHelpProviderLabels(t, provider),
          ])
        ),
      },
      securityWarnings: {
        readOnlyDefault: t(`${sw}.readOnlyDefault`),
        noWriteWithoutApproval: t(`${sw}.noWriteWithoutApproval`),
        credentialsEncrypted: t(`${sw}.credentialsEncrypted`),
        revokeAnytime: t(`${sw}.revokeAnytime`),
      },
      kcLinks: {
        setupGuide: t(`${kc}.setupGuide`),
        setupGuideHref: t(`${kc}.setupGuideHref`),
        faq: t(`${kc}.faq`),
        faqHref: t(`${kc}.faqHref`),
        findApiKey: t(`${kc}.findApiKey`),
        findApiKeyHref: t(`${kc}.findApiKeyHref`),
      },
      companionPrompts: {
        whereFindKey: t(`${cp}.whereFindKey`),
        whichProject: t(`${cp}.whichProject`),
        isAccessSafe: t(`${cp}.isAccessSafe`),
        whyConnectionFails: t(`${cp}.whyConnectionFails`),
        checkMySetup: t(`${cp}.checkMySetup`),
      },
      errorGuidance: {
        actions: {
          retry: t(`${eg}.actions.retry`),
          findKey: t(`${eg}.actions.findKey`),
          contactSupport: t(`${eg}.actions.contactSupport`),
        },
        findKeyHref: t(`${eg}.findKeyHref`),
        contactSupportHref: t(`${eg}.contactSupportHref`),
      },
      selectSetupType: t(`${s}.selectSetupType`),
      oauthOption: t(`${s}.oauthOption`),
      manualOption: t(`${s}.manualOption`),
      permissionPreview: t(`${s}.permissionPreview`),
      approveScopes: t(`${s}.approveScopes`),
      approveScopesRequired: t(`${s}.approveScopesRequired`),
      apiKeyLabel: t(`${s}.apiKeyLabel`),
      apiKeyPlaceholder: t(`${s}.apiKeyPlaceholder`),
      apiKeyMaskedNote: t(`${s}.apiKeyMaskedNote`),
      accessSummaryTitle: t(`${s}.accessSummaryTitle`),
      whatAipifyReads: t(`${s}.whatAipifyReads`),
      whatAipifyCannotDo: t(`${s}.whatAipifyCannotDo`),
      credentialStorage: t(`${s}.credentialStorage`),
      revokeAccess: t(`${s}.revokeAccess`),
      rotateKey: t(`${s}.rotateKey`),
      connectionFailed: t(`${s}.connectionFailed`),
      save: t(`${s}.save`),
      test: t(`${s}.test`),
      remove: t(`${s}.remove`),
      replace: t(`${s}.replace`),
      connectOAuth: t(`${s}.connectOAuth`),
      saving: t(`${s}.saving`),
      testing: t(`${s}.testing`),
      successTitle: t(`${s}.successTitle`),
      successBody: t(`${s}.successBody`),
      whyAccess: t(`${s}.whyAccess`),
      whatNotToEnable: t(`${s}.whatNotToEnable`),
      backStep: t(`${s}.backStep`),
      continueStep: t(`${s}.continueStep`),
      confirmActivation: t(`${s}.confirmActivation`),
      confirmActivationBody: t(`${s}.confirmActivationBody`),
      connectionStatusLabel: t(`${s}.connectionStatusLabel`),
      credentialFields: {
        connectionNameLabel: t(`${base}.credentialFields.connectionNameLabel`),
        connectionNamePlaceholder: t(`${base}.credentialFields.connectionNamePlaceholder`),
        baseUrlLabel: t(`${base}.credentialFields.baseUrlLabel`),
        baseUrlHint: t(`${base}.credentialFields.baseUrlHint`),
        baseUrlPlaceholder: t(`${base}.credentialFields.baseUrlPlaceholder`),
      },
      contractError: {
        title: t(`${base}.connectionFailures.contractIncompleteTitle`),
        body: t(`${base}.connectionFailures.contractIncompleteBody`),
      },
      openAdmin: t(`${base}.connectionFailures.actions.openAdmin`),
      connectTitle: t(`${s}.connectTitle`),
      authHelpAsideTitle: t(`${s}.authHelpAsideTitle`),
      testFailedTitle: t(`${s}.testFailedTitle`),
      activateCta: t(`${s}.activateCta`),
      activating: t(`${s}.activating`),
      loadErrorTitle: t(`${s}.loadErrorTitle`),
      loadErrorBody: t(`${s}.loadErrorBody`),
      retryLoad: t(`${s}.retryLoad`),
      backToIntegrations: t(`${s}.backToIntegrations`),
      messageCatalog: buildIntegrationMessageCatalog(t),
      completion: {
        verifiedHeading: t(`${comp}.verifiedHeading`),
        credentialSavedHeading: t(`${comp}.credentialSavedHeading`),
        statusActive: t(`${comp}.statusActive`),
        statusReadOnly: t(`${comp}.statusReadOnly`),
        statusAwaitingVerification: t(`${comp}.statusAwaitingVerification`),
        statusVerified: t(`${comp}.statusVerified`),
        statusInactive: t(`${comp}.statusInactive`),
        deactivateCta: t(`${comp}.deactivateCta`),
        organizationLabel: t(`${comp}.organizationLabel`),
        accessTypeLabel: t(`${comp}.accessTypeLabel`),
        permissionsLabel: t(`${comp}.permissionsLabel`),
        lastVerifiedLabel: t(`${comp}.lastVerifiedLabel`),
        apiVersionLabel: t(`${comp}.apiVersionLabel`),
        technicalDetailsLabel: t(`${comp}.technicalDetailsLabel`),
        technicalScopeLabel: t(`${comp}.technicalScopeLabel`),
        verifiedBody: t(`${comp}.verifiedBody`),
        credentialSavedBody: t(`${comp}.credentialSavedBody`),
        primaryIntegrations: t(`${comp}.primaryIntegrations`),
        secondaryRetest: t(`${comp}.secondaryRetest`),
        tertiaryOverview: t(`${comp}.tertiaryOverview`),
        primaryTest: t(`${comp}.primaryTest`),
        secondaryIntegrations: t(`${comp}.secondaryIntegrations`),
        activateCta: t(`${comp}.activateCta`),
        activating: t(`${comp}.activating`),
        overviewHref: APP_PORTAL_HOME_ROUTE,
      },
      removeDialog: {
        title: t(`${rd}.title`),
        titleNamed: t(`${rd}.titleNamed`),
        body: t(`${rd}.body`),
        bodyFailed: t(`${rd}.bodyFailed`),
        disconnectWhat: t(`${rd}.disconnectWhat`),
        syncStops: t(`${rd}.syncStops`),
        credentialsRemoved: t(`${rd}.credentialsRemoved`),
        auditRemains: t(`${rd}.auditRemains`),
        confirm: t(`${rd}.confirm`),
        confirmDisconnect: t(`${rd}.confirmDisconnect`),
        cancel: t(`${rd}.cancel`),
      },
      manageIntegration: t(`${s}.manageIntegration`),
      scopeDescriptions: Object.fromEntries(
        scopeKeys.map((key) => [key, t(`${sc}.${key.replace(/\./g, "_")}`)])
      ),
      scopeUnknownFallback: t(`${base}.scopeUnknownFallback`),
    },
    guidance: {
      whyAccess: t(`${g}.whyAccess`),
      whatCanRead: t(`${g}.whatCanRead`),
      whatCannotDo: t(`${g}.whatCannotDo`),
      howStored: t(`${g}.howStored`),
      howRevoke: t(`${g}.howRevoke`),
      howRotate: t(`${g}.howRotate`),
      ifFails: t(`${g}.ifFails`),
    },
    faq: Object.fromEntries(faqSlugs.map((slug) => [slug, t(`${base}.faq.${slug}`)])),
  };
}

export function buildAppPortalIntegrationsFaqAnswerLabels(t: Translator): Record<string, string> {
  const slugs = [
    "connect-external-platform",
    "what-is-read-only-access",
    "why-api-access",
    "where-find-api-key",
    "which-permissions-to-choose",
    "can-aipify-change-data",
    "remove-integration",
    "rotate-api-key",
    "integration-fails",
    "oauth-vs-api-keys",
    "is-it-safe-to-connect",
    "what-is-secure-connection-key",
    "how-to-test-connection",
    "can-change-permissions-later",
    "who-can-manage-integrations",
  ] as const;

  return Object.fromEntries(
    slugs.map((slug) => [
      `customerApp.portalStructure.integrations.faqAnswers.${slug}`,
      t(`customerApp.portalStructure.integrations.faqAnswers.${slug}`),
    ])
  );
}
