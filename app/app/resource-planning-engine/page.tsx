import { ResourcePlanningEngineDashboardPanel } from "@/components/app/resource-planning-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ResourcePlanningEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "resourcePlanningEngine");
  const t = createTranslator(dict);
  const p = "customerApp.resourcePlanningEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <ResourcePlanningEngineDashboardPanel labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          distinctionNote: t(`${p}.distinctionNote`),
          summary: t(`${p}.summary`),
          principles: t(`${p}.principles`),
          recommendations: t(`${p}.recommendations`),
          plans: t(`${p}.plans`),
          allocations: t(`${p}.allocations`),
          integrationSummaries: t(`${p}.integrationSummaries`),
          activePlans: t(`${p}.activePlans`),
          overUtilized: t(`${p}.overUtilized`),
          planningGaps: t(`${p}.planningGaps`),
          avgUtilization: t(`${p}.avgUtilization`),
          plansUnderReview: t(`${p}.plansUnderReview`),
          scenariosAvailable: t(`${p}.scenariosAvailable`),
          createPlan: t(`${p}.createPlan`),
          creating: t(`${p}.creating`),
          exportManifest: t(`${p}.exportManifest`),
          exporting: t(`${p}.exporting`),
          exportFailed: t(`${p}.exportFailed`),
          approvePlan: t(`${p}.approvePlan`),
          compareScenarios: t(`${p}.compareScenarios`),
          actionFailed: t(`${p}.actionFailed`),
          allocated: t(`${p}.allocated`),
          utilized: t(`${p}.utilized`),
          variance: t(`${p}.variance`),
          defaultPlanName: t(`${p}.defaultPlanName`),
          defaultPlanningPeriod: t(`${p}.defaultPlanningPeriod`),
        }} />
    </div>
  );
}
