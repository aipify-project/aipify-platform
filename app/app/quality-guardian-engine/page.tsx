import { QualityGuardianEngineDashboardPanel } from "@/components/app/quality-guardian-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function QualityGuardianEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "qualityGuardianEngine");
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
          governancePolicy: t(`${p}.governancePolicy`),
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
          governanceSummary: t(`${p}.governanceSummary`),
          configureGovernance: t(`${p}.configureGovernance`),
          activePolicies: t(`${p}.activePolicies`),
          openViolations: t(`${p}.openViolations`),
          pendingApprovals: t(`${p}.pendingApprovals`),
          autonomyLevel: t(`${p}.autonomyLevel`),
          reviewCadence: t(`${p}.reviewCadence`),
          days: t(`${p}.days`),
          companionQualityPrinciples: t(`${p}.companionQualityPrinciples`),
          successCriteria: t(`${p}.successCriteria`),
          trustConnection: t(`${p}.trustConnection`),
          dogfooding: t(`${p}.dogfooding`),
        }}
      />
    </div>
  );
}
