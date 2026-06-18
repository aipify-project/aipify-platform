import { ScenarioPlanningPanel } from "@/components/app/app-portal/ScenarioPlanningPanel";
import { buildScenarioPlanningLabels } from "@/lib/app-portal/scenario-planning";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ScenarioPlanningPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <ScenarioPlanningPanel labels={buildScenarioPlanningLabels(t)} />
    </div>
  );
}
