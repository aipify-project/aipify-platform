import { StrategicOpportunitiesPanel } from "@/components/app/app-portal/StrategicOpportunitiesPanel";
import { buildStrategicOpportunitiesLabels } from "@/lib/app-portal/strategic-opportunities";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function StrategicOpportunitiesPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <StrategicOpportunitiesPanel labels={buildStrategicOpportunitiesLabels(t)} />
    </div>
  );
}
