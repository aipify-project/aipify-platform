import type { Dictionary } from "@/lib/i18n/translate";
import { createTranslator } from "@/lib/i18n/translate";

type Translator = ReturnType<typeof createTranslator>;

function getLicenseSections(dict: Dictionary) {
  const sections = (dict.license as { center?: { sections?: Record<string, { title: string; body: string[] }> } })
    ?.center?.sections;

  if (!sections) return {};

  return Object.fromEntries(
    Object.entries(sections).map(([key, value]) => [
      key,
      { title: value.title, body: value.body },
    ])
  );
}

export function buildLicensePanelLabels(t: Translator) {
  return {
    workspace: t("license.sidebar.workspace"),
    licensedTo: t("license.sidebar.licensedTo"),
    plan: t("license.sidebar.plan"),
    status: t("license.sidebar.status"),
    version: t("license.sidebar.version"),
    poweredBy: t("license.sidebar.poweredBy"),
    copyright: t("license.sidebar.copyright"),
    statusActive: t("license.sidebar.statusActive"),
    statusGrace: t("license.sidebar.statusGrace"),
    statusPaused: t("license.sidebar.statusPaused"),
    statusUnknown: t("license.sidebar.statusUnknown"),
    notConfigured: t("license.sidebar.notConfigured"),
    notAssigned: t("license.sidebar.notAssigned"),
    organizationMissing: t("shell.licenseSidebar.organizationMissing"),
    contextLoading: t("shell.licenseSidebar.contextLoading"),
    contextUnavailable: t("shell.licenseSidebar.contextUnavailable"),
    pulseLabel: t("branding.pulseLabel"),
  };
}

export function buildLicenseCenterLabels(dict: Dictionary) {
  const t = createTranslator(dict);

  return {
    title: t("license.center.title"),
    subtitle: t("license.center.subtitle"),
    loading: t("license.center.loading"),
    backToApp: t("license.center.backToApp"),
    graceBanner: t("license.center.graceBanner"),
    pausedBanner: t("license.center.pausedBanner"),
    billingCta: t("license.center.billingCta"),
    sections: getLicenseSections(dict),
    subscription: {
      currentPlan: t("license.center.subscription.currentPlan"),
      renewalDate: t("license.center.subscription.renewalDate"),
      licenseStatus: t("license.center.subscription.licenseStatus"),
      installations: t("license.center.subscription.installations"),
      domains: t("license.center.subscription.domains"),
      users: t("license.center.subscription.users"),
      paymentStatus: t("license.center.subscription.paymentStatus"),
      agreementName: t("license.center.subscription.agreementName"),
      productPlanHint: t("license.center.subscription.productPlanHint"),
      lifetimeAgreement: t("license.center.subscription.lifetimeAgreement"),
      paymentActive: t("license.center.subscription.paymentActive"),
      paymentPendingSetup: t("license.center.subscription.paymentPendingSetup"),
      paymentPaused: t("license.center.subscription.paymentPaused"),
      paymentUnknown: t("license.center.subscription.paymentUnknown"),
      licenseActive: t("license.center.subscription.licenseActive"),
      licenseLifetime: t("license.center.subscription.licenseLifetime"),
      licensePaused: t("license.center.subscription.licensePaused"),
      licenseGrace: t("license.center.subscription.licenseGrace"),
      licenseUnknown: t("license.center.subscription.licenseUnknown"),
      usersUnknown: t("license.center.subscription.usersUnknown"),
    },
    licenseCode: {
      title: t("license.center.licenseCode.title"),
      description: t("license.center.licenseCode.description"),
      reveal: t("license.center.licenseCode.reveal"),
      hide: t("license.center.licenseCode.hide"),
      copy: t("license.center.licenseCode.copy"),
      copied: t("license.center.licenseCode.copied"),
      unavailable: t("license.center.licenseCode.unavailable"),
      revealError: t("license.center.licenseCode.revealError"),
      status: t("license.center.licenseCode.status"),
    },
  };
}
