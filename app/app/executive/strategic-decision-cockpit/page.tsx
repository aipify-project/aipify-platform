import { StrategicDecisionCockpitPanel } from "@/components/app/executive/StrategicDecisionCockpitPanel";
import { buildExecutiveStrategicDecisionCockpitLabels } from "@/lib/executive-strategic-decision-cockpit";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ExecutiveStrategicDecisionCockpitPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  return <StrategicDecisionCockpitPanel labels={buildExecutiveStrategicDecisionCockpitLabels(t)} />;
}
