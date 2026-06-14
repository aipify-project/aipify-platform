import { OrganizationalExcellenceCenterPanel } from "@/components/app/organizational-excellence-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalExcellenceCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalExcellenceCenter";

  return (
    <OrganizationalExcellenceCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalContinuityLink: t(`${p}.organizationalContinuityLink`),
        organizationalCoherenceLink: t(`${p}.organizationalCoherenceLink`),
        organizationalFuturesLink: t(`${p}.organizationalFuturesLink`),
        organizationalMomentumLink: t(`${p}.organizationalMomentumLink`),
        organizationalTrustLink: t(`${p}.organizationalTrustLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        signalsTitle: t(`${p}.signalsTitle`),
        bestPracticesTitle: t(`${p}.bestPracticesTitle`),
        initiativesTitle: t(`${p}.initiativesTitle`),
        reviewsTitle: t(`${p}.reviewsTitle`),
        timelineTitle: t(`${p}.timelineTitle`),
        milestonesTitle: t(`${p}.milestonesTitle`),
        snapshotsTitle: t(`${p}.snapshotsTitle`),
        insightsTitle: t(`${p}.insightsTitle`),
        recommendationsTitle: t(`${p}.recommendationsTitle`),
        executiveTitle: t(`${p}.executiveTitle`),
        sessionsTitle: t(`${p}.sessionsTitle`),
        emptySection: t(`${p}.emptySection`),
        dismiss: t(`${p}.dismiss`),
        accept: t(`${p}.accept`),
        completeReview: t(`${p}.completeReview`),
        completeSession: t(`${p}.completeSession`),
        scheduleWorkshop: t(`${p}.scheduleWorkshop`),
        scalePractice: t(`${p}.scalePractice`),
        completeInitiative: t(`${p}.completeInitiative`),
        generateReport: t(`${p}.generateReport`),
        printSummary: t(`${p}.printSummary`),
        exportSnapshot: t(`${p}.exportSnapshot`),
        coordinateReview: t(`${p}.coordinateReview`),
        archiveMilestone: t(`${p}.archiveMilestone`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        excellenceScore: t(`${p}.excellenceScore`),
        improvementMomentum: t(`${p}.improvementMomentum`),
        domains: {
          customer: t(`${p}.domains.customer`),
          operational: t(`${p}.domains.operational`),
          leadership: t(`${p}.domains.leadership`),
          workforce: t(`${p}.domains.workforce`),
          governance: t(`${p}.domains.governance`),
          innovation: t(`${p}.domains.innovation`),
        },
        signalTypes: {
          high_performing_practice: t(`${p}.signalTypes.high_performing_practice`),
          improvement_opportunity: t(`${p}.signalTypes.improvement_opportunity`),
          excellence_trend: t(`${p}.signalTypes.excellence_trend`),
          sustainable_success: t(`${p}.signalTypes.sustainable_success`),
          cross_functional_strength: t(`${p}.signalTypes.cross_functional_strength`),
        },
        signalTones: {
          positive: t(`${p}.signalTones.positive`),
          neutral: t(`${p}.signalTones.neutral`),
          attention: t(`${p}.signalTones.attention`),
        },
        practiceTypes: {
          successful_initiative: t(`${p}.practiceTypes.successful_initiative`),
          leadership_approach: t(`${p}.practiceTypes.leadership_approach`),
          customer_practice: t(`${p}.practiceTypes.customer_practice`),
          cross_functional_achievement: t(`${p}.practiceTypes.cross_functional_achievement`),
          sustainable_performance: t(`${p}.practiceTypes.sustainable_performance`),
        },
        practiceStatuses: {
          highlighted: t(`${p}.practiceStatuses.highlighted`),
          scaling: t(`${p}.practiceStatuses.scaling`),
          archived: t(`${p}.practiceStatuses.archived`),
        },
        initiativeStatuses: {
          planned: t(`${p}.initiativeStatuses.planned`),
          in_progress: t(`${p}.initiativeStatuses.in_progress`),
          completed: t(`${p}.initiativeStatuses.completed`),
        },
        healthLabels: {
          exceptional: t(`${p}.healthLabels.exceptional`),
          strong: t(`${p}.healthLabels.strong`),
          healthy: t(`${p}.healthLabels.healthy`),
          developing: t(`${p}.healthLabels.developing`),
          improvement_recommended: t(`${p}.healthLabels.improvement_recommended`),
        },
        timelineTypes: {
          major_achievement: t(`${p}.timelineTypes.major_achievement`),
          capability_milestone: t(`${p}.timelineTypes.capability_milestone`),
          improvement_breakthrough: t(`${p}.timelineTypes.improvement_breakthrough`),
          leadership_initiative: t(`${p}.timelineTypes.leadership_initiative`),
          customer_success: t(`${p}.timelineTypes.customer_success`),
        },
        reviewTypes: {
          monthly_improvement: t(`${p}.reviewTypes.monthly_improvement`),
          quarterly_excellence: t(`${p}.reviewTypes.quarterly_excellence`),
          annual_assessment: t(`${p}.reviewTypes.annual_assessment`),
          executive_reflection: t(`${p}.reviewTypes.executive_reflection`),
        },
        sessionTypes: {
          improvement_workshop: t(`${p}.sessionTypes.improvement_workshop`),
          executive_reflection: t(`${p}.sessionTypes.executive_reflection`),
          cross_functional_review: t(`${p}.sessionTypes.cross_functional_review`),
        },
        metrics: {
          continuousImprovement: t(`${p}.metrics.continuousImprovement`),
          execution: t(`${p}.metrics.execution`),
          leadership: t(`${p}.metrics.leadership`),
          customer: t(`${p}.metrics.customer`),
          learning: t(`${p}.metrics.learning`),
          initiatives: t(`${p}.metrics.initiatives`),
          strengths: t(`${p}.metrics.strengths`),
          confidence: t(`${p}.metrics.confidence`),
        },
        executiveFields: {
          strengths: t(`${p}.executiveFields.strengths`),
          momentum: t(`${p}.executiveFields.momentum`),
          leadership: t(`${p}.executiveFields.leadership`),
          opportunities: t(`${p}.executiveFields.opportunities`),
        },
      }}
    />
  );
}
