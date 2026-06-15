import { GrowthPartnerForecastPanel } from "@/components/growth-partner-forecast";
import { buildGrowthPartnerForecastLabels } from "@/lib/growth-partner-forecast";
import { SUPER_ADMIN_HOME_ROUTE } from "@/lib/super-admin/nav-config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SuperAdminGrowthPartnerForecastingPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["superAdmin"]);
  const t = createTranslator(dict);

  return (
    <GrowthPartnerForecastPanel
      surface="super"
      backHref={SUPER_ADMIN_HOME_ROUTE}
      labels={buildGrowthPartnerForecastLabels(t, "superAdmin.growthPartnerForecast")}
    />
  );
}
