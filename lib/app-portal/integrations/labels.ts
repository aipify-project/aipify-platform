import type { Translator } from "@/lib/i18n/translate";
import type { AppPortalIntegrationsLabels } from "./types";

const base = "customerApp.portalStructure.integrations";

export function buildAppPortalIntegrationsLabels(t: Translator): AppPortalIntegrationsLabels {
  const h = `${base}.hub`;
  const s = `${base}.setup`;
  const g = `${base}.guidance`;

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
    },
    setup: {
      title: t(`${s}.title`),
      loading: t(`${s}.loading`),
      back: t(`${s}.back`),
      stepLabels: Object.fromEntries(stepKeys.map((key) => [key, t(`${s}.steps.${key}`)])),
      manualStepLabels: Object.fromEntries(manualKeys.map((key) => [key, t(`${s}.manualSteps.${key}`)])),
      oauthStepLabels: Object.fromEntries(oauthKeys.map((key) => [key, t(`${s}.oauthSteps.${key}`)])),
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
  ] as const;

  return Object.fromEntries(
    slugs.map((slug) => [
      `customerApp.portalStructure.integrations.faqAnswers.${slug}`,
      t(`customerApp.portalStructure.integrations.faqAnswers.${slug}`),
    ])
  );
}
