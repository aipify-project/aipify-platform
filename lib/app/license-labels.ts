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
    poweredBy: t("license.sidebar.poweredBy"),
    licensedTo: t("license.sidebar.licensedTo"),
    subscription: t("license.sidebar.subscription"),
    status: t("license.sidebar.status"),
    version: t("license.sidebar.version"),
    copyright: t("license.sidebar.copyright"),
    statusActive: t("license.sidebar.statusActive"),
    statusGrace: t("license.sidebar.statusGrace"),
    statusPaused: t("license.sidebar.statusPaused"),
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
    },
  };
}
