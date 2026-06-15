import { GrowthPartnerContentRequestPanel } from "@/components/growth-partner-content-requests";
import { buildGrowthPartnerContentRequestLabels } from "@/lib/growth-partner-content-requests";
import { SUPER_ADMIN_HOME_ROUTE } from "@/lib/super-admin/nav-config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SuperAdminContentRequestsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["superAdmin"]);
  const t = createTranslator(dict);

  return (
    <GrowthPartnerContentRequestPanel
      surface="super"
      backHref={SUPER_ADMIN_HOME_ROUTE}
      labels={buildGrowthPartnerContentRequestLabels(t, "superAdmin.growthPartnerContentRequests")}
    />
  );
}
