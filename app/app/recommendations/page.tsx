import { RecommendationsCenterPanel } from "@/components/app/recommendations/RecommendationsCenterPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function RecommendationsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp", "branding"]);
  const t = createTranslator(dict);

  return (
    <RecommendationsCenterPanel
      locale={locale}
      labels={{
        title: t("customerApp.recommendations.title"),
        subtitle: t("customerApp.recommendations.subtitle"),
        loading: t("customerApp.recommendations.loading"),
        empty: t("customerApp.recommendations.empty"),
        pulseLabel: t("branding.pulseLabel"),
        approve: t("customerApp.recommendations.approve"),
        dismiss: t("customerApp.recommendations.dismiss"),
        learnMore: t("customerApp.recommendations.learnMore"),
        fields: {
          reason: t("customerApp.recommendations.fields.reason"),
          impact: t("customerApp.recommendations.fields.impact"),
          risk: t("customerApp.recommendations.fields.risk"),
          action: t("customerApp.recommendations.fields.action"),
        },
      }}
    />
  );
}
