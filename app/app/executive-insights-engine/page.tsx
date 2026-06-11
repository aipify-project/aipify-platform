import { ExecutiveInsightsEngineDashboardPanel } from "@/components/app/executive-insights-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ExecutiveInsightsEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.executiveInsightsEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <ExecutiveInsightsEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          analytics: t(`${p}.analytics`),
          operations: t(`${p}.operations`),
          customerSuccess: t(`${p}.customerSuccess`),
          strategicIntelligence: t(`${p}.strategicIntelligence`),
          executiveDashboard: t(`${p}.executiveDashboard`),
          organizationHealth: t(`${p}.organizationHealth`),
          operationalRisks: t(`${p}.operationalRisks`),
          strategicOpportunities: t(`${p}.strategicOpportunities`),
          actionsRequiringAttention: t(`${p}.actionsRequiringAttention`),
          majorAchievements: t(`${p}.majorAchievements`),
          customerTrends: t(`${p}.customerTrends`),
          recommendedActions: t(`${p}.recommendedActions`),
          expectedOutcome: t(`${p}.expectedOutcome`),
          estimatedEffort: t(`${p}.estimatedEffort`),
          openModule: t(`${p}.openModule`),
          recentReports: t(`${p}.recentReports`),
          generateWeekly: t(`${p}.generateWeekly`),
          generateMonthly: t(`${p}.generateMonthly`),
          generating: t(`${p}.generating`),
          noItems: t(`${p}.noItems`),
          principles: t(`${p}.principles`),
        }}
      />
    </div>
  );
}
