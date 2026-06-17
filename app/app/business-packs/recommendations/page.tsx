import { BusinessPackRecommendationsPanel } from "@/components/app/app-portal/BusinessPackRecommendationsPanel";
import { buildPackRecommendationLabels } from "@/lib/app-portal/business-pack-recommendations";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function BusinessPackRecommendationsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <BusinessPackRecommendationsPanel labels={buildPackRecommendationLabels(t)} />
    </div>
  );
}
