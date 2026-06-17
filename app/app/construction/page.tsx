import { ConstructionProjectFieldOperationsPackDashboardPanel } from "@/components/app/construction-project-field-operations-pack";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ConstructionPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.constructionProjectFieldOperationsPack";

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    loadFailed: t(`${p}.loadFailed`),
    accessRequiredTitle: t(`${p}.accessRequiredTitle`),
    accessRequiredBody: t(`${p}.accessRequiredBody`),
    overviewTitle: t(`${p}.overviewTitle`),
    operationsTitle: t(`${p}.operationsTitle`),
    projectsTitle: t(`${p}.projectsTitle`),
    advisorTitle: t(`${p}.advisorTitle`),
    metricProjects: t(`${p}.metricProjects`),
    metricProjectValue: t(`${p}.metricProjectValue`),
    metricWorkforce: t(`${p}.metricWorkforce`),
    metricSites: t(`${p}.metricSites`),
    metricEquipmentUtil: t(`${p}.metricEquipmentUtil`),
    metricProgress: t(`${p}.metricProgress`),
    metricSafety: t(`${p}.metricSafety`),
    metricHealth: t(`${p}.metricHealth`),
    noProjects: t(`${p}.noProjects`),
    recommendation: t(`${p}.recommendation`),
    projectNamePlaceholder: t(`${p}.projectNamePlaceholder`),
    typeResidential: t(`${p}.typeResidential`),
    typeCommercial: t(`${p}.typeCommercial`),
    typeIndustrial: t(`${p}.typeIndustrial`),
    typeInfrastructure: t(`${p}.typeInfrastructure`),
    typeRenovation: t(`${p}.typeRenovation`),
    typeCivilEngineering: t(`${p}.typeCivilEngineering`),
    addProject: t(`${p}.addProject`),
    creating: t(`${p}.creating`),
    createFailed: t(`${p}.createFailed`),
    openSites: t(`${p}.openSites`),
    openWorkforce: t(`${p}.openWorkforce`),
    openMaterials: t(`${p}.openMaterials`),
    openEquipment: t(`${p}.openEquipment`),
    openSafety: t(`${p}.openSafety`),
    openExecutive: t(`${p}.openExecutive`),
    industryPacksLink: t(`${p}.industryPacksLink`),
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <ConstructionProjectFieldOperationsPackDashboardPanel labels={labels} />
    </div>
  );
}
