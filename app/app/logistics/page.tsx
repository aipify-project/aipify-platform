import { LogisticsTransportationFleetOperationsPackDashboardPanel } from "@/components/app/logistics-transportation-fleet-operations-pack";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function LogisticsPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.logisticsTransportationFleetOperationsPack";

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    loadFailed: t(`${p}.loadFailed`),
    accessRequiredTitle: t(`${p}.accessRequiredTitle`),
    accessRequiredBody: t(`${p}.accessRequiredBody`),
    overviewTitle: t(`${p}.overviewTitle`),
    operationsTitle: t(`${p}.operationsTitle`),
    fleetTitle: t(`${p}.fleetTitle`),
    shipmentsTitle: t(`${p}.shipmentsTitle`),
    advisorTitle: t(`${p}.advisorTitle`),
    metricShipments: t(`${p}.metricShipments`),
    metricFleet: t(`${p}.metricFleet`),
    metricDrivers: t(`${p}.metricDrivers`),
    metricRoutes: t(`${p}.metricRoutes`),
    metricCenters: t(`${p}.metricCenters`),
    metricOnTime: t(`${p}.metricOnTime`),
    metricCosts: t(`${p}.metricCosts`),
    metricHealth: t(`${p}.metricHealth`),
    noVehicles: t(`${p}.noVehicles`),
    noShipments: t(`${p}.noShipments`),
    recommendation: t(`${p}.recommendation`),
    vehicleNamePlaceholder: t(`${p}.vehicleNamePlaceholder`),
    typeTruck: t(`${p}.typeTruck`),
    typeVan: t(`${p}.typeVan`),
    typeTrailer: t(`${p}.typeTrailer`),
    typeSpecial: t(`${p}.typeSpecial`),
    addVehicle: t(`${p}.addVehicle`),
    creating: t(`${p}.creating`),
    createFailed: t(`${p}.createFailed`),
    openFleet: t(`${p}.openFleet`),
    openDrivers: t(`${p}.openDrivers`),
    openRoutes: t(`${p}.openRoutes`),
    openShipments: t(`${p}.openShipments`),
    openCenters: t(`${p}.openCenters`),
    openWarehouse: t(`${p}.openWarehouse`),
    openExecutive: t(`${p}.openExecutive`),
    warehouseCrossLink: t(`${p}.warehouseCrossLink`),
    warehouseLink: t(`${p}.warehouseLink`),
    industryPacksLink: t(`${p}.industryPacksLink`),
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <LogisticsTransportationFleetOperationsPackDashboardPanel labels={labels} />
    </div>
  );
}
