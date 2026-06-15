import { AipifyHostsCompanionDashboardPanel } from "@/components/app/aipify-hosts-companion";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyHostsCompanionPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.aipifyHostsCompanion";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyHostsCompanionDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          errorTitle: t(`${p}.errorTitle`),
          errorMessage: t(`${p}.errorMessage`),
          retry: t(`${p}.retry`),
          commandCenter: t(`${p}.commandCenter`),
          arrivalsToday: t(`${p}.arrivalsToday`),
          departuresToday: t(`${p}.departuresToday`),
          pendingApprovals: t(`${p}.pendingApprovals`),
          occupancyForecast: t(`${p}.occupancyForecast`),
          revenueSnapshot: t(`${p}.revenueSnapshot`),
          propertyHealth: t(`${p}.propertyHealth`),
          guestAlerts: t(`${p}.guestAlerts`),
          maintenanceTasks: t(`${p}.maintenanceTasks`),
          morningBriefing: t(`${p}.morningBriefing`),
          eveningBriefing: t(`${p}.eveningBriefing`),
          todaysOverview: t(`${p}.todaysOverview`),
          todaysPerformance: t(`${p}.todaysPerformance`),
          recommendedActions: t(`${p}.recommendedActions`),
          sinceLastLogin: t(`${p}.sinceLastLogin`),
          approvalHub: t(`${p}.approvalHub`),
          reviewApproval: t(`${p}.reviewApproval`),
          recommendations: t(`${p}.recommendations`),
          impact: t(`${p}.impact`),
          effort: t(`${p}.effort`),
          companionChat: t(`${p}.companionChat`),
          companionMemory: t(`${p}.companionMemory`),
          memoryNote: t(`${p}.memoryNote`),
          performanceInsights: t(`${p}.performanceInsights`),
          responseSpeed: t(`${p}.responseSpeed`),
          approvalEfficiency: t(`${p}.approvalEfficiency`),
          operationalConsistency: t(`${p}.operationalConsistency`),
          guestSatisfaction: t(`${p}.guestSatisfaction`),
          executiveQuestions: t(`${p}.executiveQuestions`),
          modules: t(`${p}.modules`),
          included: t(`${p}.included`),
          upgradeRequired: t(`${p}.upgradeRequired`),
          notificationCategories: t(`${p}.notificationCategories`),
          successMetrics: t(`${p}.successMetrics`),
          backToHosts: t(`${p}.backToHosts`),
          openCompanion: t(`${p}.openCompanion`),
          exploreKnowledge: t(`${p}.exploreKnowledge`),
        }}
      />
    </div>
  );
}
