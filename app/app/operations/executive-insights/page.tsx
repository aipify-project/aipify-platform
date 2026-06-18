import { AppPortalExecutiveInsightsPanel } from "@/components/app/app-portal/AppPortalExecutiveInsightsPanel";
import { buildAppPortalExecutiveInsightsLabels } from "@/lib/app-portal/executive-insights";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ExecutiveInsightsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <AppPortalExecutiveInsightsPanel labels={buildAppPortalExecutiveInsightsLabels(t)} />
    </div>
  );
}
