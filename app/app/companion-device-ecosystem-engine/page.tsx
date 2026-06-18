import { CompanionDeviceEcosystemDashboardPanel } from "@/components/app/companion-device-ecosystem-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CompanionDeviceEcosystemEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "companionDeviceEcosystemEngine");
  const t = createTranslator(dict);
  const p = "customerApp.companionDeviceEcosystemEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <CompanionDeviceEcosystemDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          connectedDevices: t(`${p}.connectedDevices`),
          onlineDevices: t(`${p}.onlineDevices`),
          continuityEnabled: t(`${p}.continuityEnabled`),
          mobileReady: t(`${p}.mobileReady`),
          enabled: t(`${p}.enabled`),
          disabled: t(`${p}.disabled`),
          objectives: t(`${p}.objectives`),
          deviceRoadmap: t(`${p}.deviceRoadmap`),
          phase: t(`${p}.phase`),
          companionContinuity: t(`${p}.companionContinuity`),
          voiceCompanion: t(`${p}.voiceCompanion`),
          wearableExperiences: t(`${p}.wearableExperiences`),
          futureScaffold: t(`${p}.futureScaffold`),
          examplePhrases: t(`${p}.examplePhrases`),
          selfLoveConnection: t(`${p}.selfLoveConnection`),
          trustConnection: t(`${p}.trustConnection`),
          successCriteria: t(`${p}.successCriteria`),
          visionPhrases: t(`${p}.visionPhrases`),
          integrationLinks: t(`${p}.integrationLinks`),
          status_active: t(`${p}.statusActive`),
          status_mobile_ready: t(`${p}.statusMobileReady`),
          status_scaffold: t(`${p}.statusScaffold`),
          status_future: t(`${p}.statusFuture`),
          status_future_scaffold: t(`${p}.statusFutureScaffold`),
        }}
      />
    </div>
  );
}
