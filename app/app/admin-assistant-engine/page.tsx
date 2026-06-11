import { AdminAssistantEngineDashboardPanel } from "@/components/app/admin-assistant-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AdminAssistantEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.adminAssistantEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AdminAssistantEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          aipifyCore: t(`${p}.aipifyCore`),
          knowledgeCenter: t(`${p}.knowledgeCenter`),
          secureAiActions: t(`${p}.secureAiActions`),
          assistantEngine: t(`${p}.assistantEngine`),
          openTasks: t(`${p}.openTasks`),
          pendingApprovals: t(`${p}.pendingApprovals`),
          openSupport: t(`${p}.openSupport`),
          unreadNotifications: t(`${p}.unreadNotifications`),
          sinceLastLogin: t(`${p}.sinceLastLogin`),
          newSupportCases: t(`${p}.newSupportCases`),
          unresolvedApprovals: t(`${p}.unresolvedApprovals`),
          newUsers: t(`${p}.newUsers`),
          failedIntegrations: t(`${p}.failedIntegrations`),
          knowledgeUpdates: t(`${p}.knowledgeUpdates`),
          aiRecommendations: t(`${p}.aiRecommendations`),
          dailyBriefing: t(`${p}.dailyBriefing`),
          pendingTasks: t(`${p}.pendingTasks`),
          recommendedActions: t(`${p}.recommendedActions`),
          supportOverview: t(`${p}.supportOverview`),
          recentNotifications: t(`${p}.recentNotifications`),
          knowledgeSuggestions: t(`${p}.knowledgeSuggestions`),
          principles: t(`${p}.principles`),
          noTasks: t(`${p}.noTasks`),
          noRecommendations: t(`${p}.noRecommendations`),
          noSupportCases: t(`${p}.noSupportCases`),
          noNotifications: t(`${p}.noNotifications`),
          accept: t(`${p}.accept`),
          reject: t(`${p}.reject`),
        }}
      />
    </div>
  );
}
