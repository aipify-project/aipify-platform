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
          engineTitle: t(`${p}.engineTitle`),
          blueprintPhase: t(`${p}.blueprintPhase`),
          engagementSummary: t(`${p}.engagementSummary`),
          scenariosTotal: t(`${p}.scenariosTotal`),
          scenariosReady: t(`${p}.scenariosReady`),
          simulationRuns: t(`${p}.simulationRuns`),
          runsLast30d: t(`${p}.runsLast30d`),
          comparisonsTotal: t(`${p}.comparisonsTotal`),
          categoriesUsed: t(`${p}.categoriesUsed`),
          productionIsolation: t(`${p}.productionIsolation`),
          isolationNote: t(`${p}.isolationNote`),
          simulationObjectives: t(`${p}.simulationObjectives`),
          simulationExamples: t(`${p}.simulationExamples`),
          decisionComparisonFramework: t(`${p}.decisionComparisonFramework`),
          companionExamples: t(`${p}.companionExamples`),
          successCriteria: t(`${p}.successCriteria`),
          selfLoveConnection: t(`${p}.selfLoveConnection`),
          openSelfLove: t(`${p}.openSelfLove`),
          trustConnection: t(`${p}.trustConnection`),
          dogfooding: t(`${p}.dogfooding`),
          aipifyGroup: t(`${p}.aipifyGroup`),
          unonightPilot: t(`${p}.unonightPilot`),
          visionPhrases: t(`${p}.visionPhrases`),
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
