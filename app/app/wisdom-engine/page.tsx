import { WisdomEngineDashboardPanel } from "@/components/app/wisdom-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function WisdomEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "wisdomEngine");
  const t = createTranslator(dict);
  const p = "customerApp.wisdomEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <WisdomEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          distinctionNote: t(`${p}.distinctionNote`),
          philosophy: t(`${p}.philosophy`),
          mission: t(`${p}.mission`),
          abosPrinciple: t(`${p}.abosPrinciple`),
          vision: t(`${p}.vision`),
          summary: t(`${p}.summary`),
          insightCount: t(`${p}.insightCount`),
          pendingPrompts: t(`${p}.pendingPrompts`),
          humilityMode: t(`${p}.humilityMode`),
          pauseBeforeDecisions: t(`${p}.pauseBeforeDecisions`),
          enabled: t(`${p}.enabled`),
          disabled: t(`${p}.disabled`),
          wisdomSources: t(`${p}.wisdomSources`),
          wisdomPrinciples: t(`${p}.wisdomPrinciples`),
          guidanceExamples: t(`${p}.guidanceExamples`),
          tradeOff: t(`${p}.tradeOff`),
          humilityExamples: t(`${p}.humilityExamples`),
          notes: t(`${p}.notes`),
          selfLoveNote: t(`${p}.selfLoveNote`),
          growthNote: t(`${p}.growthNote`),
          trustNote: t(`${p}.trustNote`),
          pendingGuidancePrompts: t(`${p}.pendingGuidancePrompts`),
          recentInsights: t(`${p}.recentInsights`),
          markReviewed: t(`${p}.markReviewed`),
          dismiss: t(`${p}.dismiss`),
          engineSettings: t(`${p}.engineSettings`),
          humilityModeToggle: t(`${p}.humilityModeToggle`),
          tradeOffPromptsToggle: t(`${p}.tradeOffPromptsToggle`),
          pauseBeforeDecisionsToggle: t(`${p}.pauseBeforeDecisionsToggle`),
          saveSettings: t(`${p}.saveSettings`),
          saving: t(`${p}.saving`),
          settingsFailed: t(`${p}.settingsFailed`),
          guidanceReviewFailed: t(`${p}.guidanceReviewFailed`),
          integrationLinks: t(`${p}.integrationLinks`),
          exportReport: t(`${p}.exportReport`),
          exporting: t(`${p}.exporting`),
          exportFailed: t(`${p}.exportFailed`),
        }}
      />
    </div>
  );
}
