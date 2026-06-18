import { SimulationLabDashboardPanel } from "@/components/app/simulation-lab";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SimulationsPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "simulationLab");
  const t = createTranslator(dict);
  const p = "customerApp.simulationLab";
  const bp76 = `${p}.blueprint.phase76`;
  const bp78 = `${p}.blueprint.phase78`;
  const bp84 = `${p}.blueprint.phase84`;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
        <p className="mt-2 text-sm text-teal-700">{t(`${p}.philosophy`)}</p>
      </div>
      <SimulationLabDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          blueprintPhase: t(`${p}.blueprintPhase`),
          engagementSummary: t(`${p}.engagementSummary`),
          scenariosTotal: t(`${p}.scenariosTotal`),
          scenariosReady: t(`${p}.scenariosReady`),
          simulationRuns: t(`${p}.simulationRuns`),
          runsLast30d: t(`${p}.runsLast30d`),
          comparisonsTotal: t(`${p}.comparisonsTotal`),
          categoriesUsed: t(`${p}.categoriesUsed`),
          productionIsolation: t(`${p}.productionIsolation`),
          isolationNote: t(`${p}.isolationNote`),
          simulationObjectives: t(`${p}.simulationObjectives`),
          simulationExamples: t(`${p}.simulationExamples`),
          decisionComparisonFramework: t(`${p}.decisionComparisonFramework`),
          companionExamples: t(`${p}.companionExamples`),
          successCriteria: t(`${p}.successCriteria`),
          selfLoveConnection: t(`${p}.selfLoveConnection`),
          openSelfLove: t(`${p}.openSelfLove`),
          trustConnection: t(`${p}.trustConnection`),
          dogfooding: t(`${p}.dogfooding`),
          aipifyGroup: t(`${p}.aipifyGroup`),
          unonightPilot: t(`${p}.unonightPilot`),
          visionPhrases: t(`${p}.visionPhrases`),
          scenariosSection: t(`${p}.scenariosSection`),
          compareSelected: t(`${p}.compareSelected`),
          runSimulation: t(`${p}.runSimulation`),
          running: t(`${p}.running`),
          estimatedValue: t(`${p}.estimatedValue`),
          comparisonResults: t(`${p}.comparisonResults`),
          value: t(`${p}.value`),
          risk: t(`${p}.risk`),
          time: t(`${p}.time`),
          noRunYet: t(`${p}.noRunYet`),
          recentRuns: t(`${p}.recentRuns`),
          integrations: t(`${p}.integrations`),
          safetyNote: t(`${p}.safetyNote`),
          phase76SectionTitle: t(`${bp76}.sectionTitle`),
          phase76EngagementSummary: t(`${bp76}.engagementSummary`),
          phase76Objectives: t(`${bp76}.objectives`),
          phase76ScenarioTypes: t(`${bp76}.scenarioTypes`),
          phase76SimulationQuestions: t(`${bp76}.simulationQuestions`),
          phase76MultipleFutures: t(`${bp76}.multipleFutures`),
          phase76CompanionGuidance: t(`${bp76}.companionGuidance`),
          phase76CollaborativeSimulation: t(`${bp76}.collaborativeSimulation`),
          phase76LeadershipInsights: t(`${bp76}.leadershipInsights`),
          phase76LimitationPrinciples: t(`${bp76}.limitationPrinciples`),
          phase76SuccessCriteria: t(`${bp76}.successCriteria`),
          phase76SelfLoveConnection: t(`${bp76}.selfLoveConnection`),
          phase76TrustConnection: t(`${bp76}.trustConnection`),
          phase76Dogfooding: t(`${bp76}.dogfooding`),
          phase76VisionPhrases: t(`${bp76}.visionPhrases`),
          phase78SectionTitle: t(`${bp78}.sectionTitle`),
          phase78EngagementSummary: t(`${bp78}.engagementSummary`),
          phase78Objectives: t(`${bp78}.objectives`),
          phase78DecisionLabEnvironment: t(`${bp78}.decisionLabEnvironment`),
          phase78SimulationInputs: t(`${bp78}.simulationInputs`),
          phase78ScenarioComparison: t(`${bp78}.scenarioComparison`),
          phase78CompanionGuidance: t(`${bp78}.companionGuidance`),
          phase78CollaborativeDecisionMaking: t(`${bp78}.collaborativeDecisionMaking`),
          phase78LearningThroughSimulation: t(`${bp78}.learningThroughSimulation`),
          phase78LeadershipInsights: t(`${bp78}.leadershipInsights`),
          phase78LimitationPrinciples: t(`${bp78}.limitationPrinciples`),
          phase78SuccessCriteria: t(`${bp78}.successCriteria`),
          phase78SelfLoveConnection: t(`${bp78}.selfLoveConnection`),
          phase78TrustConnection: t(`${bp78}.trustConnection`),
          phase78Dogfooding: t(`${bp78}.dogfooding`),
          phase78VisionPhrases: t(`${bp78}.visionPhrases`),
          phase84SectionTitle: t(`${bp84}.sectionTitle`),
          phase84EngagementSummary: t(`${bp84}.engagementSummary`),
          phase84Objectives: t(`${bp84}.objectives`),
          phase84EcosystemComponents: t(`${bp84}.ecosystemComponents`),
          phase84ScenarioQuestions: t(`${bp84}.scenarioQuestions`),
          phase84ExternalDependencyAwareness: t(`${bp84}.externalDependencyAwareness`),
          phase84PartnershipResilience: t(`${bp84}.partnershipResilience`),
          phase84OpportunityExploration: t(`${bp84}.opportunityExploration`),
          phase84CompanionGuidance: t(`${bp84}.companionGuidance`),
          phase84LeadershipInsights: t(`${bp84}.leadershipInsights`),
          phase84LimitationPrinciples: t(`${bp84}.limitationPrinciples`),
          phase84SuccessCriteria: t(`${bp84}.successCriteria`),
          phase84SelfLoveConnection: t(`${bp84}.selfLoveConnection`),
          phase84TrustConnection: t(`${bp84}.trustConnection`),
          phase84Dogfooding: t(`${bp84}.dogfooding`),
          phase84VisionPhrases: t(`${bp84}.visionPhrases`),
        }}
      />
    </div>
  );
}
