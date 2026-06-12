import { MeetingCollaborationIntelligenceEngineDashboardPanel } from "@/components/app/meeting-collaboration-intelligence-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function MeetingCollaborationIntelligenceEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
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
        }} />
    </div>
  );
}
