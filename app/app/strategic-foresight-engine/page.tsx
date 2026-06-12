import { StrategicForesightDashboardPanel } from "@/components/app/strategic-foresight-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function StrategicForesightEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.strategicForesight";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <StrategicForesightDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          preparednessScore: t(`${p}.preparednessScore`),
          activeTrends: t(`${p}.activeTrends`),
          activeScenarios: t(`${p}.activeScenarios`),
          readinessSnapshots: t(`${p}.readinessSnapshots`),
          intelligenceCapabilities: t(`${p}.intelligenceCapabilities`),
          blueprintObjectives: t(`${p}.blueprintObjectives`),
          strategicIntelligenceCenter: t(`${p}.strategicIntelligenceCenter`),
          monitoredTrends: t(`${p}.monitoredTrends`),
          trendIntelligenceEngine: t(`${p}.trendIntelligenceEngine`),
          foresightFramework: t(`${p}.foresightFramework`),
          scenarioScaffolds: t(`${p}.scenarioScaffolds`),
          scenarioPlanningEngine: t(`${p}.scenarioPlanningEngine`),
          opportunityIntelligence: t(`${p}.opportunityIntelligence`),
          riskLandscapeEngine: t(`${p}.riskLandscapeEngine`),
          futureReadinessAssessments: t(`${p}.futureReadinessAssessments`),
          futureReadinessDimensions: t(`${p}.futureReadinessDimensions`),
          executiveForesightCompanion: t(`${p}.executiveForesightCompanion`),
          companionAdaptation: t(`${p}.companionAdaptation`),
          companionLimitations: t(`${p}.companionLimitations`),
          selfLoveInForesight: t(`${p}.selfLoveInForesight`),
          strategicKnowledgeLibrary: t(`${p}.strategicKnowledgeLibrary`),
          integrationLinks: t(`${p}.integrationLinks`),
          limitationPrinciples: t(`${p}.limitationPrinciples`),
          successMetrics: t(`${p}.successMetrics`),
          successCriteria: t(`${p}.successCriteria`),
          criterionMet: t(`${p}.criterionMet`),
          criterionPending: t(`${p}.criterionPending`),
          strategicIntelligenceFoundation: t(`${p}.strategicIntelligenceFoundation`),
          executiveIntelligence: t(`${p}.executiveIntelligence`),
          simulationLab: t(`${p}.simulationLab`),
          predictiveInsights: t(`${p}.predictiveInsights`),
          strategicAlignment: t(`${p}.strategicAlignment`),
          selfLove: t(`${p}.selfLove`),
        }}
      />
    </div>
  );
}
