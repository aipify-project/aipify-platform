import { ExecutiveInsightsEngineDashboardPanel } from "@/components/app/executive-insights-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ExecutiveInsightsEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "executiveInsightsEngine");
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
          sinceLastTime: t(`${p}.sinceLastTime`),
          supportResolved: t(`${p}.supportResolved`),
          kcUpdated: t(`${p}.kcUpdated`),
          tasksCompleted: t(`${p}.tasksCompleted`),
          bottlenecks: t(`${p}.bottlenecks`),
          bellMoments: t(`${p}.bellMoments`),
          insightCategories: t(`${p}.insightCategories`),
          successCriteria: t(`${p}.successCriteria`),
          criterionMet: t(`${p}.criterionMet`),
          criterionPending: t(`${p}.criterionPending`),
          trustConnection: t(`${p}.trustConnection`),
          dataSources: t(`${p}.dataSources`),
          strategicEngagement: t(`${p}.phase59.strategicEngagement`),
          strategicObjectives: t(`${p}.phase59.strategicObjectives`),
          activeOkrs: t(`${p}.phase59.activeOkrs`),
          openOpportunities: t(`${p}.phase59.openOpportunities`),
          pendingDecisions: t(`${p}.phase59.pendingDecisions`),
          strategicObjectivesTitle: t(`${p}.phase59.strategicObjectivesTitle`),
          strategicConversations: t(`${p}.phase59.strategicConversations`),
          priorityAlignment: t(`${p}.phase59.priorityAlignment`),
          opportunityExploration: t(`${p}.phase59.opportunityExploration`),
          strategicReviewSessions: t(`${p}.phase59.strategicReviewSessions`),
          executiveBriefings: t(`${p}.phase59.executiveBriefings`),
          strategicTrust: t(`${p}.phase59.strategicTrust`),
          verifiedData: t(`${p}.phase59.verifiedData`),
          hypotheses: t(`${p}.phase59.hypotheses`),
          strategicSelfLove: t(`${p}.phase59.strategicSelfLove`),
          strategicSuccessCriteria: t(`${p}.phase59.strategicSuccessCriteria`),
          companionEngagement: t(`${p}.phase66.companionEngagement`),
          companionHealthScore: t(`${p}.phase66.companionHealthScore`),
          companionReports: t(`${p}.phase66.companionReports`),
          companionRisks: t(`${p}.phase66.companionRisks`),
          companionActions: t(`${p}.phase66.companionActions`),
          companionObjectivesTitle: t(`${p}.phase66.companionObjectivesTitle`),
          companionDailyBriefings: t(`${p}.phase66.companionDailyBriefings`),
          leadershipPreparation: t(`${p}.phase66.leadershipPreparation`),
          executiveReflection: t(`${p}.phase66.executiveReflection`),
          companionPriorityAlignment: t(`${p}.phase66.companionPriorityAlignment`),
          organizationalVisibility: t(`${p}.phase66.organizationalVisibility`),
          executiveDecisionSupport: t(`${p}.phase66.executiveDecisionSupport`),
          companionTrust: t(`${p}.phase66.companionTrust`),
          whatInformsObservations: t(`${p}.phase66.whatInformsObservations`),
          uncertaintyAreas: t(`${p}.phase66.uncertaintyAreas`),
          companionSelfLove: t(`${p}.phase66.companionSelfLove`),
          companionSuccessCriteria: t(`${p}.phase66.companionSuccessCriteria`),
          phase82Title: t(`${p}.blueprint.phase82.phase82Title`),
          reflectionEngagement: t(`${p}.blueprint.phase82.reflectionEngagement`),
          reflectionHealthScore: t(`${p}.blueprint.phase82.reflectionHealthScore`),
          reflectionReports: t(`${p}.blueprint.phase82.reflectionReports`),
          reflectionPromptsAvailable: t(`${p}.blueprint.phase82.reflectionPromptsAvailable`),
          reflectionObjectivesTitle: t(`${p}.blueprint.phase82.reflectionObjectivesTitle`),
          reflectionPromptsTitle: t(`${p}.blueprint.phase82.reflectionPrompts`),
          decisionLearning: t(`${p}.blueprint.phase82.decisionLearning`),
          leadershipGrowth: t(`${p}.blueprint.phase82.leadershipGrowth`),
          reflectionCompanionGuidance: t(`${p}.blueprint.phase82.reflectionCompanionGuidance`),
          reflectionTrust: t(`${p}.blueprint.phase82.reflectionTrust`),
          whatContributes: t(`${p}.blueprint.phase82.whatContributes`),
          whatRemainsPrivate: t(`${p}.blueprint.phase82.whatRemainsPrivate`),
          reflectionSelfLove: t(`${p}.blueprint.phase82.reflectionSelfLove`),
          recognitionConnection: t(`${p}.blueprint.phase82.recognitionConnection`),
          privacyPrinciples: t(`${p}.blueprint.phase82.privacyPrinciples`),
          reflectionSuccessCriteria: t(`${p}.blueprint.phase82.reflectionSuccessCriteria`),
          reflectionVisionPhrases: t(`${p}.blueprint.phase82.reflectionVisionPhrases`),
          reflectionIntegrationLinks: t(`${p}.blueprint.phase82.integrationLinks`),
        }}
      />
    </div>
  );
}
