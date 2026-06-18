import { CapabilityMaturityEngineDashboardPanel } from "@/components/app/capability-maturity-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CapabilityMaturityEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "capabilityMaturityEngine");
  const t = createTranslator(dict);
  const p = "customerApp.capabilityMaturityEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <CapabilityMaturityEngineDashboardPanel labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          summary: t(`${p}.summary`),
          principles: t(`${p}.principles`),
          assessments: t(`${p}.assessments`),
          roadmaps: t(`${p}.roadmaps`),
          executiveSummary: t(`${p}.executiveSummary`),
          integrationSummaries: t(`${p}.integrationSummaries`),
          level: t(`${p}.level`),
          advanceMaturity: t(`${p}.advanceMaturity`),
          advancing: t(`${p}.advancing`),
          advanceFailed: t(`${p}.advanceFailed`),
          generateRoadmaps: t(`${p}.generateRoadmaps`),
          generating: t(`${p}.generating`),
          roadmapFailed: t(`${p}.roadmapFailed`),
          exportReport: t(`${p}.exportReport`),
          exporting: t(`${p}.exporting`),
          exportFailed: t(`${p}.exportFailed`),
        }} />
    </div>
  );
}
