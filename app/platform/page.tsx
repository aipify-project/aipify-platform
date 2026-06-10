import PlatformOverviewPanel from "@/components/platform/PlatformOverviewPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformOverviewPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform", "branding"]);
  const t = createTranslator(dict);

  return (
    <PlatformOverviewPanel
      labels={{
        title: t("platform.overview.title"),
        subtitle: t("platform.overview.subtitle"),
        note: t("platform.overview.note"),
        loading: t("platform.overview.loading"),
        pulseLabel: t("branding.pulseLabel"),
        briefing: {
          title: t("platform.overview.briefing.title"),
          greetingMorning: t("platform.overview.briefing.greetingMorning"),
          greetingAfternoon: t("platform.overview.briefing.greetingAfternoon"),
          greetingEvening: t("platform.overview.briefing.greetingEvening"),
          sinceVisit: t("platform.overview.briefing.sinceVisit"),
          newCustomers: t("platform.overview.briefing.newCustomers"),
          trialsEnding: t("platform.overview.briefing.trialsEnding"),
          supportResolved: t("platform.overview.briefing.supportResolved"),
          followUp: t("platform.overview.briefing.followUp"),
          noIncidents: t("platform.overview.briefing.noIncidents"),
          incidents: t("platform.overview.briefing.incidents"),
        },
        sinceLogin: {
          title: t("platform.overview.sinceLogin.title"),
          markRead: t("platform.overview.sinceLogin.markRead"),
          markedRead: t("platform.overview.sinceLogin.markedRead"),
          newCustomers: t("platform.overview.sinceLogin.newCustomers"),
          newInstallations: t("platform.overview.sinceLogin.newInstallations"),
          supportResolved: t("platform.overview.sinceLogin.supportResolved"),
          escalated: t("platform.overview.sinceLogin.escalated"),
          trialsEnding: t("platform.overview.sinceLogin.trialsEnding"),
          billingEvents: t("platform.overview.sinceLogin.billingEvents"),
          systemIncidents: t("platform.overview.sinceLogin.systemIncidents"),
          aiRecommendations: t("platform.overview.sinceLogin.aiRecommendations"),
          recommendationHint: t("platform.overview.sinceLogin.recommendationHint"),
          empty: t("platform.overview.sinceLogin.empty"),
        },
      }}
    />
  );
}
