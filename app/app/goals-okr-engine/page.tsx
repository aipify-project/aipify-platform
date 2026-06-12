import { GoalsOkrEngineDashboardPanel } from "@/components/app/goals-okr-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function GoalsOkrEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.goalsOkrEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <GoalsOkrEngineDashboardPanel labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          distinctionNote: t(`${p}.distinctionNote`),
          summary: t(`${p}.summary`),
          principles: t(`${p}.principles`),
          interventions: t(`${p}.interventions`),
          activeObjectivesSection: t(`${p}.activeObjectivesSection`),
          atRiskKeyResultsSection: t(`${p}.atRiskKeyResultsSection`),
          keyResults: t(`${p}.keyResults`),
          integrationSummaries: t(`${p}.integrationSummaries`),
          activeObjectives: t(`${p}.activeObjectives`),
          atRiskObjectives: t(`${p}.atRiskObjectives`),
          atRiskKeyResults: t(`${p}.atRiskKeyResults`),
          completedObjectives: t(`${p}.completedObjectives`),
          avgProgress: t(`${p}.avgProgress`),
          strategicObjectives: t(`${p}.strategicObjectives`),
          progress: t(`${p}.progress`),
          exportManifest: t(`${p}.exportManifest`),
          exporting: t(`${p}.exporting`),
          exportFailed: t(`${p}.exportFailed`),
          activateObjective: t(`${p}.activateObjective`),
          approveCompletion: t(`${p}.approveCompletion`),
          actionFailed: t(`${p}.actionFailed`),
        }} />
    </div>
  );
}
