import { MeetingCollaborationIntelligenceEngineDashboardPanel } from "@/components/app/meeting-collaboration-intelligence-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function MeetingCollaborationIntelligenceEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "meetingCollaborationIntelligenceEngine");
  const t = createTranslator(dict);
  const p = "customerApp.meetingCollaborationIntelligenceEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <MeetingCollaborationIntelligenceEngineDashboardPanel labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          distinctionNote: t(`${p}.distinctionNote`),
          summary: t(`${p}.summary`),
          principles: t(`${p}.principles`),
          meetings: t(`${p}.meetings`),
          actionItems: t(`${p}.actionItems`),
          decisions: t(`${p}.decisions`),
          integrationSummaries: t(`${p}.integrationSummaries`),
          scheduledMeetings: t(`${p}.scheduledMeetings`),
          openActions: t(`${p}.openActions`),
          completedMeetings30d: t(`${p}.completedMeetings30d`),
          createMeeting: t(`${p}.createMeeting`),
          creating: t(`${p}.creating`),
          createFailed: t(`${p}.createFailed`),
          exportManifest: t(`${p}.exportManifest`),
          exporting: t(`${p}.exporting`),
          exportFailed: t(`${p}.exportFailed`),
          generateAgenda: t(`${p}.generateAgenda`),
          captureSummary: t(`${p}.captureSummary`),
          extractActions: t(`${p}.extractActions`),
          captureDecision: t(`${p}.captureDecision`),
          startMeeting: t(`${p}.startMeeting`),
          completeMeeting: t(`${p}.completeMeeting`),
          completeAction: t(`${p}.completeAction`),
          actionFailed: t(`${p}.actionFailed`),
          defaultMeetingTitle: t(`${p}.defaultMeetingTitle`),
          defaultDecisionText: t(`${p}.defaultDecisionText`),
          blueprintObjectives: t(`${p}.blueprint.phase72.objectives`),
          supportedPlatforms: t(`${p}.blueprint.phase72.supportedPlatforms`),
          decisionTracking: t(`${p}.blueprint.phase72.decisionTracking`),
          companionInsights: t(`${p}.blueprint.phase72.companionInsights`),
          meetingContinuity: t(`${p}.blueprint.phase72.meetingContinuity`),
          collaborationHealth: t(`${p}.blueprint.phase72.collaborationHealth`),
          selfLoveConnection: t(`${p}.blueprint.phase72.selfLoveConnection`),
          engagementSummary: t(`${p}.blueprint.phase72.engagementSummary`),
          decisionsLogged30d: t(`${p}.blueprint.phase72.decisionsLogged30d`),
          overdueActions: t(`${p}.blueprint.phase72.overdueActions`),
          supportedPlatformsCount: t(`${p}.blueprint.phase72.supportedPlatformsCount`),
          blueprintSuccessCriteria: t(`${p}.blueprint.phase72.successCriteria`),
          criterionMet: t(`${p}.blueprint.phase72.criterionMet`),
          criterionPending: t(`${p}.blueprint.phase72.criterionPending`),
          visionPhrases: t(`${p}.blueprint.phase72.visionPhrases`),
          teamsPrivacyTitle: t(`${p}.teamsPrivacy.title`),
          teamsPrivacyDistinction: t(`${p}.teamsPrivacy.distinction`),
          teamsPrivacyJoinExperience: t(`${p}.teamsPrivacy.joinExperience`),
          teamsPrivacyJoinOptions: t(`${p}.teamsPrivacy.joinOptions`),
          teamsPrivacyPermitted: t(`${p}.teamsPrivacy.permitted`),
          teamsPrivacyProhibited: t(`${p}.teamsPrivacy.prohibited`),
          teamsPrivacySavePreferences: t(`${p}.teamsPrivacy.savePreferences`),
          teamsPrivacyPostMeeting: t(`${p}.teamsPrivacy.postMeeting`),
          teamsPrivacyFaq: t(`${p}.teamsPrivacy.faq`),
          teamsPrivacyConsentSummary: t(`${p}.teamsPrivacy.consentSummary`),
          teamsPrivacyTotalMeetings: t(`${p}.teamsPrivacy.totalMeetings`),
          teamsPrivacyWithSummary: t(`${p}.teamsPrivacy.withSummary`),
        }} />
    </div>
  );
}
