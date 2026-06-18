import { OrgForecastingPanel } from "@/components/app/app-portal/OrgForecastingPanel";
import { buildOrgForecastingLabels } from "@/lib/app-portal/organizational-forecasting";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrgForecastingPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <OrgForecastingPanel labels={buildOrgForecastingLabels(t)} />
    </div>
  );
}
