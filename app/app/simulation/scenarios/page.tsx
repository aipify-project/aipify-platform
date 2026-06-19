import { SimulationOperationsPanel } from "@/components/app/simulation-operations";
import { buildSimulationOperationsLabels } from "@/lib/simulation-operations/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SimulationScenariosPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const labels = buildSimulationOperationsLabels(createTranslator(dict));
  return (
    <SimulationOperationsPanel
      labels={labels}
      initialTab="scenarios"
      titleOverride={labels.scenariosTitle}
      subtitleOverride={labels.scenariosSubtitle}
      visibleTabs={["scenarios", "forecasts", "experiments", "comparisons", "executive"]}
    />
  );
}
