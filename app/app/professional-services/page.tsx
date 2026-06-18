import { ProfessionalServicesConsultingClientDeliveryPackDashboardPanel } from "@/components/app/professional-services-consulting-client-delivery-pack";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ProfessionalServicesPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.professionalServicesConsultingClientDeliveryPack";

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    loadFailed: t(`${p}.loadFailed`),
    accessRequiredTitle: t(`${p}.accessRequiredTitle`),
    accessRequiredBody: t(`${p}.accessRequiredBody`),
    overviewTitle: t(`${p}.overviewTitle`),
    operationsTitle: t(`${p}.operationsTitle`),
    projectsTitle: t(`${p}.projectsTitle`),
    clientsTitle: t(`${p}.clientsTitle`),
    advisorTitle: t(`${p}.advisorTitle`),
    metricClients: t(`${p}.metricClients`),
    metricProjects: t(`${p}.metricProjects`),
    metricConsultants: t(`${p}.metricConsultants`),
    metricRevenue: t(`${p}.metricRevenue`),
    metricProfitability: t(`${p}.metricProfitability`),
    metricUtilization: t(`${p}.metricUtilization`),
    metricSatisfaction: t(`${p}.metricSatisfaction`),
    metricHealth: t(`${p}.metricHealth`),
    noProjects: t(`${p}.noProjects`),
    noClients: t(`${p}.noClients`),
    recommendation: t(`${p}.recommendation`),
    projectNamePlaceholder: t(`${p}.projectNamePlaceholder`),
    statusPlanned: t(`${p}.statusPlanned`),
    statusApproved: t(`${p}.statusApproved`),
    statusInProgress: t(`${p}.statusInProgress`),
    addProject: t(`${p}.addProject`),
    creating: t(`${p}.creating`),
    createFailed: t(`${p}.createFailed`),
    openClients: t(`${p}.openClients`),
    openProjects: t(`${p}.openProjects`),
    openConsultants: t(`${p}.openConsultants`),
    openDelivery: t(`${p}.openDelivery`),
    openProfitability: t(`${p}.openProfitability`),
    openClientSuccess: t(`${p}.openClientSuccess`),
    openExecutive: t(`${p}.openExecutive`),
    industryPacksLink: t(`${p}.industryPacksLink`),
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <ProfessionalServicesConsultingClientDeliveryPackDashboardPanel labels={labels} />
    </div>
  );
}
