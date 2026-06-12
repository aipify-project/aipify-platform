import { ChangeManagementEngineDashboardPanel } from "@/components/app/change-management-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ChangeManagementEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.changeManagementEngine";
  const b = `${p}.blueprint`;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <ChangeManagementEngineDashboardPanel labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          distinctionNote: t(`${p}.distinctionNote`),
          summary: t(`${p}.summary`),
          principles: t(`${p}.principles`),
          initiatives: t(`${p}.initiatives`),
          milestones: t(`${p}.milestones`),
          communications: t(`${p}.communications`),
          integrationSummaries: t(`${p}.integrationSummaries`),
          startInitiative: t(`${p}.startInitiative`),
          updating: t(`${p}.updating`),
          updateFailed: t(`${p}.updateFailed`),
          completeMilestone: t(`${p}.completeMilestone`),
          completing: t(`${p}.completing`),
          milestoneFailed: t(`${p}.milestoneFailed`),
          releaseCommunication: t(`${p}.releaseCommunication`),
          releasing: t(`${p}.releasing`),
          releaseFailed: t(`${p}.releaseFailed`),
          blueprintObjectives: t(`${b}.objectives`),
          changeTypes: t(`${b}.changeTypes`),
          readinessAssessment: t(`${b}.readinessAssessment`),
          companionGuidance: t(`${b}.companionGuidance`),
          communicationSupport: t(`${b}.communicationSupport`),
          adoptionSupport: t(`${b}.adoptionSupport`),
          resistanceAwareness: t(`${b}.resistanceAwareness`),
          selfLoveConnection: t(`${b}.selfLoveConnection`),
          leadershipInsights: t(`${b}.leadershipInsights`),
          trustConnection: t(`${b}.trustConnection`),
          engagementSummary: t(`${b}.engagementSummary`),
          totalInitiatives: t(`${b}.totalInitiatives`),
          activeInitiatives: t(`${b}.activeInitiatives`),
          completedInitiatives: t(`${b}.completedInitiatives`),
          pendingMilestones: t(`${b}.pendingMilestones`),
          completedMilestones: t(`${b}.completedMilestones`),
          pendingCommunications: t(`${b}.pendingCommunications`),
          adoptionMetrics90d: t(`${b}.adoptionMetrics90d`),
          successCriteria: t(`${b}.successCriteria`),
          criterionMet: t(`${b}.criterionMet`),
          criterionPending: t(`${b}.criterionPending`),
          visionPhrases: t(`${b}.visionPhrases`),
        }} />
    </div>
  );
}
