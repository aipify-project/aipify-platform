import { WisdomInterventionProtocolDashboardPanel } from "@/components/app/wisdom-intervention-protocol";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function WisdomInterventionProtocolPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "wisdomInterventionProtocol");
  const t = createTranslator(dict);
  const p = "customerApp.wisdomInterventionProtocol";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <WisdomInterventionProtocolDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          distinctionNote: t(`${p}.distinctionNote`),
          pauseReflectionSection: t(`${p}.pauseReflectionSection`),
          humanMoment: t(`${p}.humanMoment`),
          pauseCommunicationExamples: t(`${p}.pauseCommunicationExamples`),
          selfLoveRosePhrases: t(`${p}.selfLoveRosePhrases`),
          signalCount: t(`${p}.signalCount`),
          signalsLast30Days: t(`${p}.signalsLast30Days`),
          postponedOrRevised: t(`${p}.postponedOrRevised`),
          activePromptCount: t(`${p}.activePromptCount`),
          whenToIntervene: t(`${p}.whenToIntervene`),
          responseStyleExamples: t(`${p}.responseStyleExamples`),
          sleepOnItExamples: t(`${p}.sleepOnItExamples`),
          boundaries: t(`${p}.boundaries`),
          mayDo: t(`${p}.mayDo`),
          mayNotDo: t(`${p}.mayNotDo`),
          recentSignals: t(`${p}.recentSignals`),
          activePrompts: t(`${p}.activePrompts`),
          sleepOnItBadge: t(`${p}.sleepOnItBadge`),
          protocolSettings: t(`${p}.protocolSettings`),
          sleepOnItToggle: t(`${p}.sleepOnItToggle`),
          lateNightToggle: t(`${p}.lateNightToggle`),
          capsDetectionToggle: t(`${p}.capsDetectionToggle`),
          saveSettings: t(`${p}.saveSettings`),
          saving: t(`${p}.saving`),
          settingsFailed: t(`${p}.settingsFailed`),
          integrationLinks: t(`${p}.integrationLinks`),
          exportReport: t(`${p}.exportReport`),
          exporting: t(`${p}.exporting`),
          exportFailed: t(`${p}.exportFailed`),
          successCriteria: t(`${p}.successCriteria`),
          interventionPrinciples: t(`${p}.interventionPrinciples`),
          interventionScenarios: t(`${p}.interventionScenarios`),
          communicationExamples: t(`${p}.communicationExamples`),
          sleepOnItPrinciple: t(`${p}.sleepOnItPrinciple`),
          trustConnection: t(`${p}.trustConnection`),
          visionPhrases: t(`${p}.visionPhrases`),
          dogfooding: t(`${p}.dogfooding`),
        }}
      />
    </div>
  );
}
