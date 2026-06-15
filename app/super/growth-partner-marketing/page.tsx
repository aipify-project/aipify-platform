import { GrowthPartnerMarketingPanel } from "@/components/growth-partner-marketing";
import { buildGrowthPartnerMarketingLabels } from "@/lib/growth-partner-marketing";
import { SUPER_ADMIN_HOME_ROUTE } from "@/lib/super-admin/nav-config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SuperAdminGrowthPartnerMarketingPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["superAdmin"]);
  const t = createTranslator(dict);

  return (
    <GrowthPartnerMarketingPanel
      surface="super"
      backHref={SUPER_ADMIN_HOME_ROUTE}
      labels={buildGrowthPartnerMarketingLabels(t, "superAdmin.growthPartnerMarketing")}
    />
  );
}
