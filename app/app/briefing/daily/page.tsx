import { BriefingPanel } from "@/components/app/briefing";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function DailyBriefPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  return (
    <BriefingPanel
      mode="daily"
      labels={{
        title: t("customerApp.briefing.dailyTitle"),
        subtitle: t("customerApp.briefing.dailySubtitle"),
        loading: t("customerApp.briefing.loading"),
        empty: t("customerApp.briefing.empty"),
        summary: t("customerApp.briefing.summary"),
        priorities: t("customerApp.briefing.priorities"),
        recommendedStep: t("customerApp.briefing.recommendedStep"),
        refresh: t("customerApp.briefing.refresh"),
        settings: t("customerApp.briefing.settings"),
        open: t("customerApp.briefing.open"),
        archive: t("customerApp.briefing.archive"),
        privacy: t("customerApp.briefing.privacy"),
      }}
    />
  );
}
