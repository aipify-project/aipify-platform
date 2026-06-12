import { ContinuousImprovementEngineDashboardPanel } from "@/components/app/continuous-improvement-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ContinuousImprovementEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.continuousImprovementEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <ContinuousImprovementEngineDashboardPanel labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          summary: t(`${p}.summary`),
          principles: t(`${p}.principles`),
          initiatives: t(`${p}.initiatives`),
          trends: t(`${p}.trends`),
          recommendations: t(`${p}.recommendations`),
          memoryIntegration: t(`${p}.memoryIntegration`),
          successMeasurements: t(`${p}.successMeasurements`),
          approveInitiative: t(`${p}.approveInitiative`),
          startInitiative: t(`${p}.startInitiative`),
          reviewing: t(`${p}.reviewing`),
          actionFailed: t(`${p}.actionFailed`),
          blueprintTitle: t(`${p}.organizationalEvolution.blueprintTitle`),
          blueprintPhase90: t(`${p}.organizationalEvolution.blueprintPhase90`),
          objectives: t(`${p}.organizationalEvolution.objectives`),
          improvementQuestions: t(`${p}.organizationalEvolution.improvementQuestions`),
          learningCycles: t(`${p}.organizationalEvolution.learningCycles`),
          experimentationPrinciples: t(`${p}.organizationalEvolution.experimentationPrinciples`),
          organizationalEvolution: t(`${p}.organizationalEvolution.organizationalEvolution`),
          companionGuidance: t(`${p}.organizationalEvolution.companionGuidance`),
          companionGuidanceHint: t(`${p}.organizationalEvolution.companionGuidanceHint`),
          improvementSources: t(`${p}.organizationalEvolution.improvementSources`),
          selfLoveConnection: t(`${p}.organizationalEvolution.selfLoveConnection`),
          leadershipInsights: t(`${p}.organizationalEvolution.leadershipInsights`),
          limitationPrinciples: t(`${p}.organizationalEvolution.limitationPrinciples`),
          trustConnection: t(`${p}.organizationalEvolution.trustConnection`),
          dogfooding: t(`${p}.organizationalEvolution.dogfooding`),
          integrationLinks: t(`${p}.organizationalEvolution.integrationLinks`),
          successCriteria: t(`${p}.organizationalEvolution.successCriteria`),
          engagementSummary: t(`${p}.organizationalEvolution.engagementSummary`),
          initiativesActive: t(`${p}.organizationalEvolution.initiativesActive`),
          initiativesCompleted: t(`${p}.organizationalEvolution.initiativesCompleted`),
          feedbackCount: t(`${p}.organizationalEvolution.feedbackCount`),
          reviewCyclesCompleted: t(`${p}.organizationalEvolution.reviewCyclesCompleted`),
          avgImprovementPct: t(`${p}.organizationalEvolution.avgImprovementPct`),
          phase134BlueprintTitle: t(`${p}.phase134.blueprintTitle`),
          phase134BlueprintLabel: t(`${p}.phase134.blueprintLabel`),
          phase134Objectives: t(`${p}.phase134.objectives`),
          phase134LearningLoops: t(`${p}.phase134.learningLoops`),
          phase134AdaptiveCenter: t(`${p}.phase134.adaptiveCenter`),
          phase134Experimentation: t(`${p}.phase134.experimentation`),
          phase134AdaptationInsights: t(`${p}.phase134.adaptationInsights`),
          phase134OptimizationCompanion: t(`${p}.phase134.optimizationCompanion`),
          phase134OptimizationCompanionHint: t(`${p}.phase134.optimizationCompanionHint`),
          phase134ChangeFatigue: t(`${p}.phase134.changeFatigue`),
          phase134ImprovementPortfolio: t(`${p}.phase134.improvementPortfolio`),
          phase134CompanionLimitations: t(`${p}.phase134.companionLimitations`),
          phase134SecurityRequirements: t(`${p}.phase134.securityRequirements`),
          phase134EraCrossLinks: t(`${p}.phase134.eraCrossLinks`),
          phase134SuccessCriteria: t(`${p}.phase134.successCriteria`),
          phase134EngagementSummary: t(`${p}.phase134.engagementSummary`),
          phase134ActiveExperiments: t(`${p}.phase134.activeExperiments`),
          phase134PortfolioCurrent: t(`${p}.phase134.portfolioCurrent`),
          phase134ElevatedFatigue: t(`${p}.phase134.elevatedFatigue`),
          phase134Experiments: t(`${p}.phase134.experiments`),
          phase134PortfolioItems: t(`${p}.phase134.portfolioItems`),
          phase134FatigueSignals: t(`${p}.phase134.fatigueSignals`),
          phase134FatigueSignalsHint: t(`${p}.phase134.fatigueSignalsHint`),
        }} />
    </div>
  );
}
