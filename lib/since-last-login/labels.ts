import type { Translator } from "@/lib/i18n/translate";
import type { SinceLastLoginSummaryLabels } from "@/components/shared/since-last-login/SinceLastLoginSummaryPanel";

export function buildCustomerSinceLastLoginLabels(t: Translator): SinceLastLoginSummaryLabels {
  return {
    title: t("customerApp.briefing.sinceLastLoginEngine.title"),
    criticalHeader: t("customerApp.briefing.sinceLastLoginEngine.criticalHeader"),
    emptyTitle: t("customerApp.briefing.sinceLastLoginEngine.emptyTitle"),
    emptyBody: t("customerApp.briefing.sinceLastLoginEngine.emptyBody"),
    reviewNow: t("customerApp.briefing.sinceLastLoginEngine.reviewNow"),
    loading: t("customerApp.briefing.sinceLastLoginEngine.loading"),
    loadError: t("customerApp.briefing.sinceLastLoginEngine.loadError"),
  };
}

export function buildSinceLastLoginLabels(t: Translator): SinceLastLoginSummaryLabels {
  return {
    title: t("platform.sinceLastLogin.title"),
    criticalHeader: t("platform.sinceLastLogin.criticalHeader"),
    emptyTitle: t("platform.sinceLastLogin.emptyTitle"),
    emptyBody: t("platform.sinceLastLogin.emptyBody"),
    reviewNow: t("platform.sinceLastLogin.reviewNow"),
    loading: t("platform.sinceLastLogin.loading"),
    loadError: t("platform.sinceLastLogin.loadError"),
  };
}
