import { QualityGuardianEngineDashboardPanel } from "@/components/app/quality-guardian-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function QualityGuardianEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.qualityGuardianEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <QualityGuardianEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          qualityGuardian: t(`${p}.qualityGuardian`),
          supportAi: t(`${p}.supportAi`),
          knowledgeCenter: t(`${p}.knowledgeCenter`),
          operationsDashboard: t(`${p}.operationsDashboard`),
          secureAiActions: t(`${p}.secureAiActions`),
          runScan: t(`${p}.runScan`),
          openChecks: t(`${p}.openChecks`),
          criticalOpen: t(`${p}.criticalOpen`),
          resolvedWeek: t(`${p}.resolvedWeek`),
          pendingRecommendations: t(`${p}.pendingRecommendations`),
          highRiskAreas: t(`${p}.highRiskAreas`),
          openIssues: t(`${p}.openIssues`),
          activeAlerts: t(`${p}.activeAlerts`),
          resolve: t(`${p}.resolve`),
          ignore: t(`${p}.ignore`),
          recommendations: t(`${p}.recommendations`),
          confidence: t(`${p}.confidence`),
          accept: t(`${p}.accept`),
          reject: t(`${p}.reject`),
          recentlyResolved: t(`${p}.recentlyResolved`),
          principles: t(`${p}.principles`),
        }}
      />
    </div>
  );
}
