import { ServiceLevelCommitmentEngineDashboardPanel } from "@/components/app/service-level-commitment-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ServiceLevelCommitmentEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "serviceLevelCommitmentEngine");
  const t = createTranslator(dict);
  const p = "customerApp.serviceLevelCommitmentEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <ServiceLevelCommitmentEngineDashboardPanel labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          summary: t(`${p}.summary`),
          principles: t(`${p}.principles`),
          commitments: t(`${p}.commitments`),
          performance: t(`${p}.performance`),
          alerts: t(`${p}.alerts`),
          executiveSummary: t(`${p}.executiveSummary`),
          integrationSummaries: t(`${p}.integrationSummaries`),
          target: t(`${p}.target`),
          pause: t(`${p}.pause`),
          pausing: t(`${p}.pausing`),
          pauseFailed: t(`${p}.pauseFailed`),
          acknowledge: t(`${p}.acknowledge`),
          acknowledging: t(`${p}.acknowledging`),
          acknowledgeFailed: t(`${p}.acknowledgeFailed`),
          exportReport: t(`${p}.exportReport`),
          exporting: t(`${p}.exporting`),
          exportFailed: t(`${p}.exportFailed`),
        }} />
    </div>
  );
}
