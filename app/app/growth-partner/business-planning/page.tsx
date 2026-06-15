import { GrowthPartnerForecastPanel } from "@/components/growth-partner-forecast";
import { buildGrowthPartnerForecastLabels } from "@/lib/growth-partner-forecast";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function GrowthPartnerBusinessPlanningPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  return (
    <GrowthPartnerForecastPanel
      surface="partner"
      backHref="/app/growth-partner-operations"
      labels={buildGrowthPartnerForecastLabels(t, "customerApp.growthPartnerForecast")}
    />
  );
}
