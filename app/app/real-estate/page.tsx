import { RealEstatePortfolioOperationsPackDashboardPanel } from "@/components/app/real-estate-portfolio-operations-pack";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function RealEstatePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.realEstatePortfolioOperationsPack";

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    loadFailed: t(`${p}.loadFailed`),
    accessRequiredTitle: t(`${p}.accessRequiredTitle`),
    accessRequiredBody: t(`${p}.accessRequiredBody`),
    overviewTitle: t(`${p}.overviewTitle`),
    operationsTitle: t(`${p}.operationsTitle`),
    propertiesTitle: t(`${p}.propertiesTitle`),
    leasesTitle: t(`${p}.leasesTitle`),
    advisorTitle: t(`${p}.advisorTitle`),
    metricProperties: t(`${p}.metricProperties`),
    metricUnits: t(`${p}.metricUnits`),
    metricTenants: t(`${p}.metricTenants`),
    metricOccupancy: t(`${p}.metricOccupancy`),
    metricRevenue: t(`${p}.metricRevenue`),
    metricExpenses: t(`${p}.metricExpenses`),
    metricPortfolioValue: t(`${p}.metricPortfolioValue`),
    metricHealth: t(`${p}.metricHealth`),
    noProperties: t(`${p}.noProperties`),
    noLeases: t(`${p}.noLeases`),
    recommendation: t(`${p}.recommendation`),
    propertyNamePlaceholder: t(`${p}.propertyNamePlaceholder`),
    typeResidential: t(`${p}.typeResidential`),
    typeApartmentBuilding: t(`${p}.typeApartmentBuilding`),
    typeCommercialBuilding: t(`${p}.typeCommercialBuilding`),
    typeOfficeBuilding: t(`${p}.typeOfficeBuilding`),
    typeRetailProperty: t(`${p}.typeRetailProperty`),
    typeMixedUse: t(`${p}.typeMixedUse`),
    addProperty: t(`${p}.addProperty`),
    creating: t(`${p}.creating`),
    createFailed: t(`${p}.createFailed`),
    openMaintenance: t(`${p}.openMaintenance`),
    openLeases: t(`${p}.openLeases`),
    openFinancials: t(`${p}.openFinancials`),
    openVendors: t(`${p}.openVendors`),
    openExecutive: t(`${p}.openExecutive`),
    hospitalityCrossLink: t(`${p}.hospitalityCrossLink`),
    hospitalityLink: t(`${p}.hospitalityLink`),
    industryPacksLink: t(`${p}.industryPacksLink`),
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <RealEstatePortfolioOperationsPackDashboardPanel labels={labels} />
    </div>
  );
}
