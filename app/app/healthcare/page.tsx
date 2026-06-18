import { HealthcareClinicPatientOperationsPackDashboardPanel } from "@/components/app/healthcare-clinic-patient-operations-pack";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function HealthcarePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "healthcareClinicPatientOperationsPack");
  const t = createTranslator(dict);
  const p = "customerApp.healthcareClinicPatientOperationsPack";

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    loadFailed: t(`${p}.loadFailed`),
    accessRequiredTitle: t(`${p}.accessRequiredTitle`),
    accessRequiredBody: t(`${p}.accessRequiredBody`),
    overviewTitle: t(`${p}.overviewTitle`),
    operationsTitle: t(`${p}.operationsTitle`),
    patientsTitle: t(`${p}.patientsTitle`),
    appointmentsTitle: t(`${p}.appointmentsTitle`),
    advisorTitle: t(`${p}.advisorTitle`),
    metricPatients: t(`${p}.metricPatients`),
    metricAppointments: t(`${p}.metricAppointments`),
    metricProviders: t(`${p}.metricProviders`),
    metricCarePlans: t(`${p}.metricCarePlans`),
    metricCapacity: t(`${p}.metricCapacity`),
    metricCompliance: t(`${p}.metricCompliance`),
    metricSatisfaction: t(`${p}.metricSatisfaction`),
    metricHealth: t(`${p}.metricHealth`),
    noPatients: t(`${p}.noPatients`),
    noAppointments: t(`${p}.noAppointments`),
    recommendation: t(`${p}.recommendation`),
    patientNamePlaceholder: t(`${p}.patientNamePlaceholder`),
    statusNew: t(`${p}.statusNew`),
    statusActive: t(`${p}.statusActive`),
    statusUnderCare: t(`${p}.statusUnderCare`),
    consentOnFile: t(`${p}.consentOnFile`),
    addPatient: t(`${p}.addPatient`),
    creating: t(`${p}.creating`),
    createFailed: t(`${p}.createFailed`),
    openPatients: t(`${p}.openPatients`),
    openAppointments: t(`${p}.openAppointments`),
    openProviders: t(`${p}.openProviders`),
    openCare: t(`${p}.openCare`),
    openDocumentation: t(`${p}.openDocumentation`),
    openCompliance: t(`${p}.openCompliance`),
    openExecutive: t(`${p}.openExecutive`),
    industryPacksLink: t(`${p}.industryPacksLink`),
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <HealthcareClinicPatientOperationsPackDashboardPanel labels={labels} />
    </div>
  );
}
