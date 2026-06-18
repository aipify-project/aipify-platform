import { PresenceComfortProtocolDashboardPanel } from "@/components/app/presence-comfort-protocol";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PresenceComfortProtocolPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "presenceComfortProtocol");
  const t = createTranslator(dict);
  const p = "customerApp.presenceComfortProtocol";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <PresenceComfortProtocolDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          distinctionNote: t(`${p}.distinctionNote`),
          summary: t(`${p}.summary`),
          momentCount: t(`${p}.momentCount`),
          protocolEventCount: t(`${p}.protocolEventCount`),
          comfortRosesUsed: t(`${p}.comfortRosesUsed`),
          protocolSensitivity: t(`${p}.protocolSensitivity`),
          whenProtocolApplies: t(`${p}.whenProtocolApplies`),
          communicationPrinciples: t(`${p}.communicationPrinciples`),
          comfortRoseExamples: t(`${p}.comfortRoseExamples`),
          comfortRoseHint: t(`${p}.comfortRoseHint`),
          comfortRose: t(`${p}.comfortRose`),
          boundaryPhrases: t(`${p}.boundaryPhrases`),
          avoidPhrases: t(`${p}.avoidPhrases`),
          preferPhrases: t(`${p}.preferPhrases`),
          selfLoveExamples: t(`${p}.selfLoveExamples`),
          humanConnectionPrompts: t(`${p}.humanConnectionPrompts`),
          gratitudeRecognitionNote: t(`${p}.gratitudeRecognitionNote`),
          recentMoments: t(`${p}.recentMoments`),
          recentActivity: t(`${p}.recentActivity`),
          eventsLast30Days: t(`${p}.eventsLast30Days`),
          humanConnectionRedirects: t(`${p}.humanConnectionRedirects`),
          trustNote: t(`${p}.trustNote`),
          protocolSettings: t(`${p}.protocolSettings`),
          comfortRosesToggle: t(`${p}.comfortRosesToggle`),
          encourageHumanConnectionToggle: t(`${p}.encourageHumanConnectionToggle`),
          sensitivityBalanced: t(`${p}.sensitivityBalanced`),
          sensitivityGentle: t(`${p}.sensitivityGentle`),
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
