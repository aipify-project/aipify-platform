import { OpportunityDiscoveryCenterPanel } from "@/components/app/opportunity-discovery-center";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OpportunityDiscoveryCenterPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["core"]);
  const t = createTranslator(dict);
  const p = "customerApp.opportunityDiscoveryCenter";

  return (
    <OpportunityDiscoveryCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        decisionSupportLink: t(`${p}.decisionSupportLink`),
        strategicIntelligenceLink: t(`${p}.strategicIntelligenceLink`),
        continuousImprovementLink: t(`${p}.continuousImprovementLink`),
        organizationalResilienceLink: t(`${p}.organizationalResilienceLink`),
        innovationLabLink: t(`${p}.innovationLabLink`),
        recommendationsLink: t(`${p}.recommendationsLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        opportunitiesTitle: t(`${p}.opportunitiesTitle`),
        signalsTitle: t(`${p}.signalsTitle`),
        insightsTitle: t(`${p}.insightsTitle`),
        recommendationsTitle: t(`${p}.recommendationsTitle`),
        executiveReviewsTitle: t(`${p}.executiveReviewsTitle`),
        learningSectionTitle: t(`${p}.learningSectionTitle`),
        workflowTitle: t(`${p}.workflowTitle`),
        emptySection: t(`${p}.emptySection`),
        domain: t(`${p}.domain`),
        alignment: t(`${p}.alignment`),
        impact: t(`${p}.impact`),
        effort: t(`${p}.effort`),
        workflowStatus: t(`${p}.workflowStatus`),
        dismiss: t(`${p}.dismiss`),
        accept: t(`${p}.accept`),
        advance: t(`${p}.advance`),
        decline: t(`${p}.decline`),
        archive: t(`${p}.archive`),
        completeReview: t(`${p}.completeReview`),
        captureLearning: t(`${p}.captureLearning`),
        learningFormTitle: t(`${p}.learningFormTitle`),
        learningContent: t(`${p}.learningContent`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        domains: {
          revenue: t(`${p}.domains.revenue`),
          customer: t(`${p}.domains.customer`),
          operational: t(`${p}.domains.operational`),
          workforce: t(`${p}.domains.workforce`),
          market: t(`${p}.domains.market`),
          innovation: t(`${p}.domains.innovation`),
        },
        scoreLevels: {
          exceptional: t(`${p}.scoreLevels.exceptional`),
          strong: t(`${p}.scoreLevels.strong`),
          monitor: t(`${p}.scoreLevels.monitor`),
          low_priority: t(`${p}.scoreLevels.low_priority`),
        },
        workflowStatuses: {
          identified: t(`${p}.workflowStatuses.identified`),
          strategic_review: t(`${p}.workflowStatuses.strategic_review`),
          impact_assessment: t(`${p}.workflowStatuses.impact_assessment`),
          resource_evaluation: t(`${p}.workflowStatuses.resource_evaluation`),
          executive_decision: t(`${p}.workflowStatuses.executive_decision`),
          implementation_planning: t(`${p}.workflowStatuses.implementation_planning`),
          outcome_measurement: t(`${p}.workflowStatuses.outcome_measurement`),
          declined: t(`${p}.workflowStatuses.declined`),
          archived: t(`${p}.workflowStatuses.archived`),
        },
        reviewTypes: {
          monthly: t(`${p}.reviewTypes.monthly`),
          quarterly_growth: t(`${p}.reviewTypes.quarterly_growth`),
          innovation_workshop: t(`${p}.reviewTypes.innovation_workshop`),
          strategic_prioritization: t(`${p}.reviewTypes.strategic_prioritization`),
        },
        metrics: {
          identified: t(`${p}.metrics.identified`),
          underReview: t(`${p}.metrics.underReview`),
          highValue: t(`${p}.metrics.highValue`),
          alignment: t(`${p}.metrics.alignment`),
          satisfaction: t(`${p}.metrics.satisfaction`),
          usefulness: t(`${p}.metrics.usefulness`),
        },
      }}
    />
  );
}
