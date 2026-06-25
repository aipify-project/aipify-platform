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

function buildIntegrationMessageCatalog(t: Translator): Record<string, string> {
  const keys = [
    ...listIntegrationErrorTranslationKeys(),
    ...listUnonightFailureTranslationKeys(),
  ];
  return Object.fromEntries(keys.map((key) => [key, t(key)]));
}

export function buildAppPortalIntegrationsLabels(t: Translator): AppPortalIntegrationsLabels {
  const h = `${base}.hub`;
  const s = `${base}.setup`;
  const g = `${base}.guidance`;
  const pl = `${base}.plainLanguage`;
  const sd = `${base}.scopeDescriptions`;
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
      unonight: {
        baseUrlLabel: t(`${base}.unonightConnection.baseUrlLabel`),
        baseUrlHint: t(`${base}.unonightConnection.baseUrlHint`),
        baseUrlPlaceholder: t(`${base}.unonightConnection.baseUrlPlaceholder`),
        connectionNameLabel: t(`${base}.unonightConnection.connectionNameLabel`),
        connectionNamePlaceholder: t(`${base}.unonightConnection.connectionNamePlaceholder`),
      },
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
