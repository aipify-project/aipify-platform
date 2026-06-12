import { FutureTechnologiesDashboardPanel } from "@/components/app/future-technologies";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function FutureTechnologiesPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.futureTechnologies";
  const b = `${p}.blueprint`;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <FutureTechnologiesDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          futureReadiness: t(`${p}.futureReadiness`),
          generateBriefing: t(`${p}.generateBriefing`),
          activeInitiatives: t(`${p}.activeInitiatives`),
          pilotOpportunities: t(`${p}.pilotOpportunities`),
          techRelevance: t(`${p}.techRelevance`),
          observations: t(`${p}.observations`),
          emergingInterfaces: t(`${p}.emergingInterfaces`),
          technologyObservatory: t(`${p}.technologyObservatory`),
          relevance: t(`${p}.relevance`),
          trendReports: t(`${p}.trendReports`),
          impact: t(`${p}.impact`),
          emergingInitiatives: t(`${p}.emergingInitiatives`),
          businessValue: t(`${p}.businessValue`),
          governanceCompatible: t(`${p}.governanceCompatible`),
          advanceInitiative: t(`${p}.advanceInitiative`),
          pilotOpportunitiesSection: t(`${p}.pilotOpportunitiesSection`),
          readinessAssessments: t(`${p}.readinessAssessments`),
          scenarioPlanning: t(`${p}.scenarioPlanning`),
          recommendations: t(`${p}.recommendations`),
          dismiss: t(`${p}.dismiss`),
          responsibleAdoption: t(`${p}.responsibleAdoption`),
          recentBriefings: t(`${p}.recentBriefings`),
          innovationLab: t(`${p}.innovationLab`),
          strategy: t(`${p}.strategy`),
          governance: t(`${p}.governance`),
          knowledgeCenter: t(`${p}.knowledgeCenter`),
          blueprintTitle: t(`${b}.title`),
          blueprintObjectives: t(`${b}.objectives`),
          futureExploration: t(`${b}.futureExploration`),
          emergingThemes: t(`${b}.emergingThemes`),
          scenarioPreparedness: t(`${b}.scenarioPreparedness`),
          organizationalResilience: t(`${b}.organizationalResilience`),
          companionGuidance: t(`${b}.companionGuidance`),
          selfLoveConnection: t(`${b}.selfLoveConnection`),
          leadershipInsights: t(`${b}.leadershipInsights`),
          trustConnection: t(`${b}.trustConnection`),
          dogfooding: t(`${b}.dogfooding`),
          successCriteria: t(`${b}.successCriteria`),
          engagementSummary: t(`${b}.engagementSummary`),
          readinessAssessmentsCount: t(`${b}.readinessAssessmentsCount`),
          scenarioPlansCount: t(`${b}.scenarioPlansCount`),
          activeScenarioPlans: t(`${b}.activeScenarioPlans`),
          criterionMet: t(`${b}.criterionMet`),
          criterionPending: t(`${b}.criterionPending`),
          visionPhrases: t(`${b}.visionPhrases`),
        }}
      />
    </div>
  );
}
