import { AppPortalDashboardPanel } from "@/components/app/app-portal";
import { buildAppPortalLabels, buildAppPortalNavLabels } from "@/lib/app-portal/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AppPortalHomePage() {
  const dict = await getCustomerAppDictionaryForSplits(await getLocale(), ["dashboard"]);
  const t = createTranslator(dict);
  const labels = buildAppPortalLabels(t);
  const navLabels = buildAppPortalNavLabels(t);

  return <AppPortalDashboardPanel labels={labels.dashboard} navLabels={navLabels} />;
}
