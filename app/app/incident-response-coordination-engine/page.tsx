import { IncidentResponseCoordinationEngineDashboardPanel } from "@/components/app/incident-response-coordination-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function IncidentResponseCoordinationEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "incidentResponseCoordinationEngine");
  const t = createTranslator(dict);
  const p = "customerApp.incidentResponseCoordinationEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <IncidentResponseCoordinationEngineDashboardPanel labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          summary: t(`${p}.summary`),
          principles: t(`${p}.principles`),
          incidents: t(`${p}.incidents`),
          timeline: t(`${p}.timeline`),
          communications: t(`${p}.communications`),
          executiveSummary: t(`${p}.executiveSummary`),
          integrationSummaries: t(`${p}.integrationSummaries`),
          severity: t(`${p}.severity`),
          startInvestigation: t(`${p}.startInvestigation`),
          escalate: t(`${p}.escalate`),
          resolve: t(`${p}.resolve`),
          investigating: t(`${p}.investigating`),
          escalating: t(`${p}.escalating`),
          resolving: t(`${p}.resolving`),
          updateFailed: t(`${p}.updateFailed`),
          escalateFailed: t(`${p}.escalateFailed`),
          resolveFailed: t(`${p}.resolveFailed`),
        }} />
    </div>
  );
}
