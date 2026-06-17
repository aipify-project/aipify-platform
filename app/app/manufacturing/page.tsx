import { ManufacturingProductionIndustrialOperationsPackDashboardPanel } from "@/components/app/manufacturing-production-industrial-operations-pack";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ManufacturingPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.manufacturingProductionIndustrialOperationsPack";

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    loadFailed: t(`${p}.loadFailed`),
    accessRequiredTitle: t(`${p}.accessRequiredTitle`),
    accessRequiredBody: t(`${p}.accessRequiredBody`),
    overviewTitle: t(`${p}.overviewTitle`),
    operationsTitle: t(`${p}.operationsTitle`),
    workOrdersTitle: t(`${p}.workOrdersTitle`),
    productionLinesTitle: t(`${p}.productionLinesTitle`),
    advisorTitle: t(`${p}.advisorTitle`),
    metricOrders: t(`${p}.metricOrders`),
    metricOutput: t(`${p}.metricOutput`),
    metricCapacity: t(`${p}.metricCapacity`),
    metricMaterialAvailability: t(`${p}.metricMaterialAvailability`),
    metricQuality: t(`${p}.metricQuality`),
    metricEquipment: t(`${p}.metricEquipment`),
    metricUtilization: t(`${p}.metricUtilization`),
    metricHealth: t(`${p}.metricHealth`),
    noWorkOrders: t(`${p}.noWorkOrders`),
    noProductionLines: t(`${p}.noProductionLines`),
    recommendation: t(`${p}.recommendation`),
    productNamePlaceholder: t(`${p}.productNamePlaceholder`),
    quantityPlaceholder: t(`${p}.quantityPlaceholder`),
    priorityLow: t(`${p}.priorityLow`),
    priorityNormal: t(`${p}.priorityNormal`),
    priorityHigh: t(`${p}.priorityHigh`),
    priorityCritical: t(`${p}.priorityCritical`),
    addWorkOrder: t(`${p}.addWorkOrder`),
    creating: t(`${p}.creating`),
    createFailed: t(`${p}.createFailed`),
    openPlanning: t(`${p}.openPlanning`),
    openWorkOrders: t(`${p}.openWorkOrders`),
    openMaterials: t(`${p}.openMaterials`),
    openQuality: t(`${p}.openQuality`),
    openEquipment: t(`${p}.openEquipment`),
    openExecutive: t(`${p}.openExecutive`),
    industryPacksLink: t(`${p}.industryPacksLink`),
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <ManufacturingProductionIndustrialOperationsPackDashboardPanel labels={labels} />
    </div>
  );
}
