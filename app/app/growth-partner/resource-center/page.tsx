import { GrowthPartnerContentRequestPanel } from "@/components/growth-partner-content-requests";
import { buildGrowthPartnerContentRequestLabels } from "@/lib/growth-partner-content-requests";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function GrowthPartnerResourceCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  return (
    <GrowthPartnerContentRequestPanel
      surface="partner"
      backHref="/app/growth-partner-operations"
      labels={buildGrowthPartnerContentRequestLabels(t, "customerApp.growthPartnerContentRequests")}
    />
  );
}
