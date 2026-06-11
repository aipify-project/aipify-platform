import { UnonightPilotOperationsDashboardPanel } from "@/components/app/unonight-pilot-operations-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function UnonightPilotOperationsEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.unonightPilotOperationsEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <UnonightPilotOperationsDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          notPilotOrg: t(`${p}.notPilotOrg`),
          unonightPilot: t(`${p}.unonightPilot`),
          unonightNote: t(`${p}.unonightNote`),
          supportAi: t(`${p}.supportAi`),
          adminAssistant: t(`${p}.adminAssistant`),
          knowledgeCenter: t(`${p}.knowledgeCenter`),
          integrationEngine: t(`${p}.integrationEngine`),
          operationsDashboard: t(`${p}.operationsDashboard`),
          qualityGuardian: t(`${p}.qualityGuardian`),
          pilotHealth: t(`${p}.pilotHealth`),
          openSupportCases: t(`${p}.openSupportCases`),
          aiAcceptanceRate: t(`${p}.aiAcceptanceRate`),
          milestonesProgress: t(`${p}.milestonesProgress`),
          adminSatisfaction: t(`${p}.adminSatisfaction`),
          unonightIntegration: t(`${p}.unonightIntegration`),
          unonightConnected: t(`${p}.unonightConnected`),
          unonightNotConnected: t(`${p}.unonightNotConnected`),
          lastSync: t(`${p}.lastSync`),
          supportImprovements: t(`${p}.supportImprovements`),
          resolved30d: t(`${p}.resolved30d`),
          escalations30d: t(`${p}.escalations30d`),
          avgResponseHours: t(`${p}.avgResponseHours`),
          unresolvedIssues: t(`${p}.unresolvedIssues`),
          noUnresolvedIssues: t(`${p}.noUnresolvedIssues`),
          pilotMilestones: t(`${p}.pilotMilestones`),
          markComplete: t(`${p}.markComplete`),
          submitFeedback: t(`${p}.submitFeedback`),
          rating: t(`${p}.rating`),
          feedbackPlaceholder: t(`${p}.feedbackPlaceholder`),
          recentFeedback: t(`${p}.recentFeedback`),
          noComment: t(`${p}.noComment`),
          principles: t(`${p}.principles`),
          unknown: t(`${p}.unknown`),
        }}
      />
    </div>
  );
}
