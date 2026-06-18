import { HospitalityAccommodationPackDashboardPanel } from "@/components/app/hospitality-accommodation-pack";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function HospitalityPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "hospitalityAccommodationPack");
  const t = createTranslator(dict);
  const p = "customerApp.hospitalityAccommodationPack";

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    loadFailed: t(`${p}.loadFailed`),
    accessRequiredTitle: t(`${p}.accessRequiredTitle`),
    accessRequiredBody: t(`${p}.accessRequiredBody`),
    overviewTitle: t(`${p}.overviewTitle`),
    operationsTitle: t(`${p}.operationsTitle`),
    propertiesTitle: t(`${p}.propertiesTitle`),
    reservationsTitle: t(`${p}.reservationsTitle`),
    advisorTitle: t(`${p}.advisorTitle`),
    channelsTitle: t(`${p}.channelsTitle`),
    metricProperties: t(`${p}.metricProperties`),
    metricReservations: t(`${p}.metricReservations`),
    metricOccupancy: t(`${p}.metricOccupancy`),
    metricCheckIns: t(`${p}.metricCheckIns`),
    metricCheckOuts: t(`${p}.metricCheckOuts`),
    metricRevenue: t(`${p}.metricRevenue`),
    metricSatisfaction: t(`${p}.metricSatisfaction`),
    metricHealth: t(`${p}.metricHealth`),
    noProperties: t(`${p}.noProperties`),
    noReservations: t(`${p}.noReservations`),
    health: t(`${p}.health`),
    recommendation: t(`${p}.recommendation`),
    propertyNamePlaceholder: t(`${p}.propertyNamePlaceholder`),
    typeApartment: t(`${p}.typeApartment`),
    typeHouse: t(`${p}.typeHouse`),
    typeCabin: t(`${p}.typeCabin`),
    typeVilla: t(`${p}.typeVilla`),
    typeHotelRoom: t(`${p}.typeHotelRoom`),
    typeBoutiqueHotel: t(`${p}.typeBoutiqueHotel`),
    addProperty: t(`${p}.addProperty`),
    creating: t(`${p}.creating`),
    createFailed: t(`${p}.createFailed`),
    openCleaning: t(`${p}.openCleaning`),
    openMaintenance: t(`${p}.openMaintenance`),
    openCheckIn: t(`${p}.openCheckIn`),
    openBookings: t(`${p}.openBookings`),
    openExecutive: t(`${p}.openExecutive`),
    hostsCrossLink: t(`${p}.hostsCrossLink`),
    hostsLink: t(`${p}.hostsLink`),
    industryPacksLink: t(`${p}.industryPacksLink`),
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <HospitalityAccommodationPackDashboardPanel labels={labels} />
    </div>
  );
}
