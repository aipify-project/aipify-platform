import { GratitudeRecognitionEngineDashboardPanel } from "@/components/app/gratitude-recognition-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function GratitudeRecognitionEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "gratitudeRecognitionEngine");
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
          successCriteria: t(`${p}.successCriteria`),
          recognitionCategories: t(`${p}.recognitionCategories`),
          bellMoments: t(`${p}.bellMoments`),
          recognitionRoses: t(`${p}.recognitionRoses`),
          selfRecognition: t(`${p}.selfRecognition`),
          selfLoveConnection: t(`${p}.selfLoveConnection`),
          trustConnection: t(`${p}.trustConnection`),
          orgConfiguration: t(`${p}.orgConfiguration`),
          visionPhrases: t(`${p}.visionPhrases`),
          humanMomentsTitle: t(`${p}.humanMomentsTitle`),
          humanMomentsObjectives: t(`${p}.humanMomentsObjectives`),
          birthdayExperiences: t(`${p}.birthdayExperiences`),
          professionalAnniversaries: t(`${p}.professionalAnniversaries`),
          certificationCelebrations: t(`${p}.certificationCelebrations`),
          communityContributions: t(`${p}.communityContributions`),
          companionPrinciples: t(`${p}.companionPrinciples`),
          privacyPrinciples: t(`${p}.privacyPrinciples`),
          humanMomentsSummary: t(`${p}.humanMomentsSummary`),
          humanMomentsPreferences: t(`${p}.humanMomentsPreferences`),
          birthdayVisible: t(`${p}.birthdayVisible`),
          anniversaryVisible: t(`${p}.anniversaryVisible`),
          displayPreference: t(`${p}.displayPreference`),
          humanMomentsSelfLove: t(`${p}.humanMomentsSelfLove`),
          humanMomentsSuccessCriteria: t(`${p}.humanMomentsSuccessCriteria`),
          humanMomentsVisionPhrases: t(`${p}.humanMomentsVisionPhrases`),
          humanMomentsIntegrationLinks: t(`${p}.humanMomentsIntegrationLinks`),
          organizationalRecognitionTitle: t(`${p}.organizationalRecognition.title`),
          organizationalRecognitionObjectives: t(`${p}.organizationalRecognition.objectives`),
          recognitionMoments: t(`${p}.organizationalRecognition.recognitionMoments`),
          companionRecognitionPrompts: t(`${p}.organizationalRecognition.companionPrompts`),
          peerRecognition: t(`${p}.organizationalRecognition.peerRecognition`),
          leadershipRecognition: t(`${p}.organizationalRecognition.leadershipRecognition`),
          customerAppreciation: t(`${p}.organizationalRecognition.customerAppreciation`),
          salesExpertRecognition: t(`${p}.organizationalRecognition.salesExpertRecognition`),
          organizationalSelfLove: t(`${p}.organizationalRecognition.selfLove`),
          leadershipInsights: t(`${p}.organizationalRecognition.leadershipInsights`),
          organizationalTrustConnection: t(`${p}.organizationalRecognition.trustConnection`),
          organizationalPrivacyPrinciples: t(`${p}.organizationalRecognition.privacyPrinciples`),
          organizationalRecognitionSummary: t(`${p}.organizationalRecognition.summary`),
          organizationalRecognitionSuccessCriteria: t(`${p}.organizationalRecognition.successCriteria`),
          organizationalRecognitionVisionPhrases: t(`${p}.organizationalRecognition.visionPhrases`),
          organizationalRecognitionIntegrationLinks: t(`${p}.organizationalRecognition.integrationLinks`),
          usersShouldSee: t(`${p}.organizationalRecognition.usersShouldSee`),
          operatorsShouldUnderstand: t(`${p}.organizationalRecognition.operatorsShouldUnderstand`),
          mustAvoid: t(`${p}.organizationalRecognition.mustAvoid`),
          required: t(`${p}.organizationalRecognition.required`),
        }}
      />
    </div>
  );
}
