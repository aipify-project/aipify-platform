import { WonderEngineDashboardPanel } from "@/components/app/wonder-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function WonderEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "wonderEngine");
  const t = createTranslator(dict);
  const p = "customerApp.wonderEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <WonderEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          distinctionNote: t(`${p}.distinctionNote`),
          summary: t(`${p}.summary`),
          momentCount: t(`${p}.momentCount`),
          unacknowledgedMoments: t(`${p}.unacknowledgedMoments`),
          pendingReflections: t(`${p}.pendingReflections`),
          celebrationCadence: t(`${p}.celebrationCadence`),
          momentsOfWonder: t(`${p}.momentsOfWonder`),
          reflectionPrompts: t(`${p}.reflectionPrompts`),
          recentMoments: t(`${p}.recentMoments`),
          pendingReflectionsTitle: t(`${p}.pendingReflectionsTitle`),
          acknowledged: t(`${p}.acknowledged`),
          acknowledgeMoment: t(`${p}.acknowledgeMoment`),
          acknowledge: t(`${p}.acknowledge`),
          dismiss: t(`${p}.dismiss`),
          selfLoveNote: t(`${p}.selfLoveNote`),
          impactNote: t(`${p}.impactNote`),
          legacyNote: t(`${p}.legacyNote`),
          companionNote: t(`${p}.companionNote`),
          boundaries: t(`${p}.boundaries`),
          wonderSettings: t(`${p}.wonderSettings`),
          wonderMomentsToggle: t(`${p}.wonderMomentsToggle`),
          reflectionPromptsToggle: t(`${p}.reflectionPromptsToggle`),
          authenticityGuardrails: t(`${p}.authenticityGuardrails`),
          cadenceLow: t(`${p}.cadenceLow`),
          cadenceNormal: t(`${p}.cadenceNormal`),
          saveSettings: t(`${p}.saveSettings`),
          saving: t(`${p}.saving`),
          settingsFailed: t(`${p}.settingsFailed`),
          actionFailed: t(`${p}.actionFailed`),
          integrationLinks: t(`${p}.integrationLinks`),
          exportReport: t(`${p}.exportReport`),
          exporting: t(`${p}.exporting`),
          exportFailed: t(`${p}.exportFailed`),
        }}
      />
    </div>
  );
}
