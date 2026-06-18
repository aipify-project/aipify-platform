import { DedicationEngineDashboardPanel } from "@/components/app/dedication-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function DedicationEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "dedicationEngine");
  const t = createTranslator(dict);
  const p = "customerApp.dedicationEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <DedicationEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          distinctionNote: t(`${p}.distinctionNote`),
          summary: t(`${p}.summary`),
          signalCount: t(`${p}.signalCount`),
          commitmentCount: t(`${p}.commitmentCount`),
          activeCommitments: t(`${p}.activeCommitments`),
          maxRetryExplorations: t(`${p}.maxRetryExplorations`),
          dedicationPrinciples: t(`${p}.dedicationPrinciples`),
          examplePhrases: t(`${p}.examplePhrases`),
          signalTypes: t(`${p}.signalTypes`),
          boundaryPhrases: t(`${p}.boundaryPhrases`),
          avoidPhrases: t(`${p}.avoidPhrases`),
          preferPhrases: t(`${p}.preferPhrases`),
          recentSignals: t(`${p}.recentSignals`),
          activeCommitmentsTitle: t(`${p}.activeCommitmentsTitle`),
          hardWorkBalanceNote: t(`${p}.hardWorkBalanceNote`),
          selfLoveNote: t(`${p}.selfLoveNote`),
          proactiveCompanionNote: t(`${p}.proactiveCompanionNote`),
          trustNote: t(`${p}.trustNote`),
          dedicationSettings: t(`${p}.dedicationSettings`),
          persistenceMessagingToggle: t(`${p}.persistenceMessagingToggle`),
          balanceWithSelfLoveToggle: t(`${p}.balanceWithSelfLoveToggle`),
          saveSettings: t(`${p}.saveSettings`),
          saving: t(`${p}.saving`),
          settingsFailed: t(`${p}.settingsFailed`),
          integrationLinks: t(`${p}.integrationLinks`),
          exportReport: t(`${p}.exportReport`),
          exporting: t(`${p}.exporting`),
          exportFailed: t(`${p}.exportFailed`),
        }}
      />
    </div>
  );
}
