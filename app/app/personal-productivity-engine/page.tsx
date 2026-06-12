import { PersonalProductivityEngineDashboardPanel } from "@/components/app/personal-productivity-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PersonalProductivityEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.personalProductivityEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <PersonalProductivityEngineDashboardPanel labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          distinctionNote: t(`${p}.distinctionNote`),
          summary: t(`${p}.summary`),
          principles: t(`${p}.principles`),
          dailyBriefing: t(`${p}.dailyBriefing`),
          briefingReady: t(`${p}.briefingReady`),
          generateBriefing: t(`${p}.generateBriefing`),
          generatingBriefing: t(`${p}.generatingBriefing`),
          briefingFailed: t(`${p}.briefingFailed`),
          todaysPriorities: t(`${p}.todaysPriorities`),
          upcomingCommitmentsSection: t(`${p}.upcomingCommitmentsSection`),
          overdueWork: t(`${p}.overdueWork`),
          focusRecommendations: t(`${p}.focusRecommendations`),
          reminders: t(`${p}.reminders`),
          integrationSummaries: t(`${p}.integrationSummaries`),
          openPriorities: t(`${p}.openPriorities`),
          overdueItems: t(`${p}.overdueItems`),
          upcomingCommitments: t(`${p}.upcomingCommitments`),
          scheduledReminders: t(`${p}.scheduledReminders`),
          pendingApprovals: t(`${p}.pendingApprovals`),
          exportManifest: t(`${p}.exportManifest`),
          exporting: t(`${p}.exporting`),
          exportFailed: t(`${p}.exportFailed`),
          dismissReminder: t(`${p}.dismissReminder`),
          actionFailed: t(`${p}.actionFailed`),
        }} />
    </div>
  );
}
