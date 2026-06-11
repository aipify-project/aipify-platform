import { SimulationLabDashboardPanel } from "@/components/app/simulation-lab";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SimulationsPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.simulationLab";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
        <p className="mt-2 text-sm text-teal-700">{t(`${p}.philosophy`)}</p>
      </div>
      <SimulationLabDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          productionIsolation: t(`${p}.productionIsolation`),
          isolationNote: t(`${p}.isolationNote`),
          scenariosSection: t(`${p}.scenariosSection`),
          compareSelected: t(`${p}.compareSelected`),
          runSimulation: t(`${p}.runSimulation`),
          running: t(`${p}.running`),
          estimatedValue: t(`${p}.estimatedValue`),
          comparisonResults: t(`${p}.comparisonResults`),
          value: t(`${p}.value`),
          risk: t(`${p}.risk`),
          time: t(`${p}.time`),
          noRunYet: t(`${p}.noRunYet`),
          recentRuns: t(`${p}.recentRuns`),
          integrations: t(`${p}.integrations`),
          safetyNote: t(`${p}.safetyNote`),
        }}
      />
    </div>
  );
}
