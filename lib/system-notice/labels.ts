import type { Translator } from "@/lib/i18n/translate";
import type { HumanVerificationLabels, SystemNoticeLabels, SystemNoticeStatus } from "./types";

export function buildSystemNoticeLabels(t: Translator): SystemNoticeLabels {
  const p = "common.systemNotice";
  const preset = (status: SystemNoticeStatus) => ({
    title: t(`${p}.presets.${status}.title`),
    message: t(`${p}.presets.${status}.message`),
    primaryLabel: t(`${p}.presets.${status}.primaryLabel`),
    secondaryLabel: t(`${p}.presets.${status}.secondaryLabel`),
  });

  return {
    backToAipify: t(`${p}.backToAipify`),
    goToLogin: t(`${p}.goToLogin`),
    goToHome: t(`${p}.goToHome`),
    knowledgeCenter: t(`${p}.knowledgeCenter`),
    contactSupport: t(`${p}.contactSupport`),
    becomeGrowthPartner: t(`${p}.becomeGrowthPartner`),
    renewSubscription: t(`${p}.renewSubscription`),
    billing: t(`${p}.billing`),
    invoices: t(`${p}.invoices`),
    verificationRequired: t(`${p}.verificationRequired`),
    presets: {
      forbidden: preset("forbidden"),
      not_found: preset("not_found"),
      unauthorized_panel: preset("unauthorized_panel"),
      growth_partner_required: preset("growth_partner_required"),
      platform_required: preset("platform_required"),
      super_admin_required: preset("super_admin_required"),
      app_required: preset("app_required"),
      subscription_required: preset("subscription_required"),
      suspended_account: preset("suspended_account"),
      cancelled_account: preset("cancelled_account"),
    },
  };
}

export function buildHumanVerificationLabels(t: Translator): HumanVerificationLabels {
  const p = "common.humanVerification";
  return {
    title: t(`${p}.title`),
    description: t(`${p}.description`),
    prompt: t(`${p}.prompt`),
    selectMatching: t(`${p}.selectMatching`),
    verified: t(`${p}.verified`),
    failed: t(`${p}.failed`),
    required: t(`${p}.required`),
    refresh: t(`${p}.refresh`),
  };
}
