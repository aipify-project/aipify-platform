import { OrganizationalResilienceEngineDashboardPanel } from "@/components/app/organizational-resilience-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalResilienceEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalResilienceEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <OrganizationalResilienceEngineDashboardPanel labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          summary: t(`${p}.summary`),
          principles: t(`${p}.principles`),
          plans: t(`${p}.plans`),
          simulations: t(`${p}.simulations`),
          vulnerabilities: t(`${p}.vulnerabilities`),
          executiveSummary: t(`${p}.executiveSummary`),
          integrationSummaries: t(`${p}.integrationSummaries`),
          reviewFrequency: t(`${p}.reviewFrequency`),
          submitReview: t(`${p}.submitReview`),
          approvePlan: t(`${p}.approvePlan`),
          recordSimulation: t(`${p}.recordSimulation`),
          resolve: t(`${p}.resolve`),
          updating: t(`${p}.updating`),
          approving: t(`${p}.approving`),
          recording: t(`${p}.recording`),
          resolving: t(`${p}.resolving`),
          updateFailed: t(`${p}.updateFailed`),
          approveFailed: t(`${p}.approveFailed`),
          simulationFailed: t(`${p}.simulationFailed`),
          resolveFailed: t(`${p}.resolveFailed`),
        }} />
    </div>
  );
}
