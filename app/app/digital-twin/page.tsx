import { DigitalTwinDashboardPanel } from "@/components/app/digital-twin";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function DigitalTwinPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "digitalTwin");
  const t = createTranslator(dict);
  const p = "customerApp.digitalTwin";
  const bp = `${p}.blueprint.phase77`;
  const bp124 = `${p}.blueprint.phase124`;
  const bp159 = `${p}.blueprint.phase159`;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
        <p className="mt-2 text-sm text-slate-600">{t(`${p}.philosophy`)}</p>
      </div>
      <DigitalTwinDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          twinHealth: t(`${p}.twinHealth`),
          processCoverage: t(`${p}.processCoverage`),
          knowledgeOwners: t(`${p}.knowledgeOwners`),
          lowConfidence: t(`${p}.lowConfidence`),
          roles: t(`${p}.roles`),
          rolesSection: t(`${p}.rolesSection`),
          processesSection: t(`${p}.processesSection`),
          knowledgeRouting: t(`${p}.knowledgeRouting`),
          insightsSection: t(`${p}.insightsSection`),
          reviewRecommended: t(`${p}.reviewRecommended`),
          integrations: t(`${p}.integrations`),
          safetyNote: t(`${p}.safetyNote`),
          blueprintSection: t(`${bp}.sectionTitle`),
          objectives: t(`${bp}.objectives`),
          twinDefinition: t(`${bp}.twinDefinition`),
          organizationalMapping: t(`${bp}.organizationalMapping`),
          companionObservations: t(`${bp}.companionObservations`),
          simulationConnection: t(`${bp}.simulationConnection`),
          openSimulations: t(`${bp}.openSimulations`),
          learningConnection: t(`${bp}.learningConnection`),
          selfLoveConnection: t(`${bp}.selfLoveConnection`),
          leadershipInsights: t(`${bp}.leadershipInsights`),
          privacyPrinciples: t(`${bp}.privacyPrinciples`),
          successCriteria: t(`${bp}.successCriteria`),
          visionPhrases: t(`${bp}.visionPhrases`),
          activeRoles: t(`${bp}.activeRoles`),
          activeProcesses: t(`${bp}.activeProcesses`),
          openInsights: t(`${bp}.openInsights`),
          criterionMet: t(`${bp}.criterionMet`),
          criterionPending: t(`${bp}.criterionPending`),
          phase124Section: t(`${bp124}.sectionTitle`),
          phase124Era: t(`${bp124}.era`),
          phase124Objectives: t(`${bp124}.objectives`),
          phase124TwinReflects: t(`${bp124}.twinReflects`),
          phase124TwinCenter: t(`${bp124}.twinCenter`),
          phase124MapEngine: t(`${bp124}.mapEngine`),
          phase124DependencyIntelligence: t(`${bp124}.dependencyIntelligence`),
          phase124SimulationWorkspace: t(`${bp124}.simulationWorkspace`),
          phase124TransformationImpact: t(`${bp124}.transformationImpact`),
          phase124KnowledgeNetwork: t(`${bp124}.knowledgeNetwork`),
          phase124ResilienceVisualization: t(`${bp124}.resilienceVisualization`),
          phase124ExecutiveCompanion: t(`${bp124}.executiveCompanion`),
          phase124CompanionLimitations: t(`${bp124}.companionLimitations`),
          phase124SelfLoveConnection: t(`${bp124}.selfLoveConnection`),
          phase124MemoryEngine: t(`${bp124}.memoryEngine`),
          phase124OpenOrgMemory: t(`${bp124}.openOrgMemory`),
          phase124TwinCenterCount: t(`${bp124}.twinCenterCount`),
          phase124DependencySignals: t(`${bp124}.dependencySignals`),
          phase124SimulationScenarios: t(`${bp124}.simulationScenarios`),
          phase124SuccessCriteria: t(`${bp124}.successCriteria`),
          phase124SuccessMetrics: t(`${bp124}.successMetrics`),
          phase124CompanionAdaptation: t(`${bp124}.companionAdaptation`),
          phase159Section: t(`${bp159}.sectionTitle`),
          phase159Era: t(`${bp159}.era`),
          phase159Objectives: t(`${bp159}.objectives`),
          phase159AwarenessCenter: t(`${bp159}.awarenessCenter`),
          phase159InterdependencyEngine: t(`${bp159}.interdependencyEngine`),
          phase159ConsequenceFramework: t(`${bp159}.consequenceFramework`),
          phase159ExecutiveReviews: t(`${bp159}.executiveReviews`),
          phase159SystemicCompanion: t(`${bp159}.systemicCompanion`),
          phase159OrgHealthThemes: t(`${bp159}.orgHealthThemes`),
          phase159OpenOrgHealth: t(`${bp159}.openOrgHealth`),
          phase159SystemicLearning: t(`${bp159}.systemicLearning`),
          phase159AwarenessMemory: t(`${bp159}.awarenessMemory`),
          phase159CompanionLimitations: t(`${bp159}.companionLimitations`),
          phase159SelfLoveConnection: t(`${bp159}.selfLoveConnection`),
          phase159DependencyMaps: t(`${bp159}.dependencyMaps`),
          phase159SystemicReviews: t(`${bp159}.systemicReviews`),
          phase159AwarenessCenterCount: t(`${bp159}.awarenessCenterCount`),
          phase159SuccessCriteria: t(`${bp159}.successCriteria`),
          phase159SuccessMetrics: t(`${bp159}.successMetrics`),
          phase159VisionPhrases: t(`${bp159}.visionPhrases`),
        }}
      />
    </div>
  );
}
