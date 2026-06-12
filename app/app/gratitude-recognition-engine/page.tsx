import { GratitudeRecognitionEngineDashboardPanel } from "@/components/app/gratitude-recognition-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function GratitudeRecognitionEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.gratitudeRecognitionEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <GratitudeRecognitionEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          distinctionNote: t(`${p}.distinctionNote`),
          summary: t(`${p}.summary`),
          momentCount: t(`${p}.momentCount`),
          roseCount: t(`${p}.roseCount`),
          digitalRoseEnabled: t(`${p}.digitalRoseEnabled`),
          gratitudeMomentsEnabled: t(`${p}.gratitudeMomentsEnabled`),
          yes: t(`${p}.yes`),
          no: t(`${p}.no`),
          gratitudeMomentTypes: t(`${p}.gratitudeMomentTypes`),
          redRoseMoment: t(`${p}.redRoseMoment`),
          boundaryPhrases: t(`${p}.boundaryPhrases`),
          avoidPhrases: t(`${p}.avoidPhrases`),
          preferPhrases: t(`${p}.preferPhrases`),
          recentMoments: t(`${p}.recentMoments`),
          selfLoveNote: t(`${p}.selfLoveNote`),
          trustNote: t(`${p}.trustNote`),
          sendDigitalRose: t(`${p}.sendDigitalRose`),
          sendDigitalRoseHint: t(`${p}.sendDigitalRoseHint`),
          recipientLabel: t(`${p}.recipientLabel`),
          recipientPlaceholder: t(`${p}.recipientPlaceholder`),
          messageSummary: t(`${p}.messageSummary`),
          messagePlaceholder: t(`${p}.messagePlaceholder`),
          sendRose: t(`${p}.sendRose`),
          sendingRose: t(`${p}.sendingRose`),
          roseSent: t(`${p}.roseSent`),
          roseFailed: t(`${p}.roseFailed`),
          gratitudeSettings: t(`${p}.gratitudeSettings`),
          digitalRoseToggle: t(`${p}.digitalRoseToggle`),
          gratitudeMomentsToggle: t(`${p}.gratitudeMomentsToggle`),
          redirectRomanticToggle: t(`${p}.redirectRomanticToggle`),
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
