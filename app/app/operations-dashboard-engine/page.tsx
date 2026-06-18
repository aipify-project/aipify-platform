import { OperationsDashboardEngineDashboardPanel } from "@/components/app/operations-dashboard-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OperationsDashboardEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "operationsDashboardEngine");
  const t = createTranslator(dict);
  const p = "customerApp.operationsDashboardEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <OperationsDashboardEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          operationsDashboard: t(`${p}.operationsDashboard`),
          adminAssistant: t(`${p}.adminAssistant`),
          supportAi: t(`${p}.supportAi`),
          customerOnboarding: t(`${p}.customerOnboarding`),
          organizationHealth: t(`${p}.organizationHealth`),
          activeAlerts: t(`${p}.activeAlerts`),
          userRole: t(`${p}.userRole`),
          visibleWidgets: t(`${p}.visibleWidgets`),
          sinceLastLogin: t(`${p}.sinceLastLogin`),
          pendingTasks: t(`${p}.pendingTasks`),
          pendingApprovals: t(`${p}.pendingApprovals`),
          supportOverview: t(`${p}.supportOverview`),
          recentNotifications: t(`${p}.recentNotifications`),
          aiRecommendations: t(`${p}.aiRecommendations`),
          integrationHealth: t(`${p}.integrationHealth`),
          knowledgeCenterStatus: t(`${p}.knowledgeCenterStatus`),
          auditActivity: t(`${p}.auditActivity`),
          acknowledge: t(`${p}.acknowledge`),
          dismiss: t(`${p}.dismiss`),
          principles: t(`${p}.principles`),
          unknown: t(`${p}.unknown`),
        }}
      />
    </div>
  );
}
