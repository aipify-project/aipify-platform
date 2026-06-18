import { OrganizationalBalanceCenterPanel } from "@/components/app/organizational-balance-center";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalBalanceCenterPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalBalanceCenter";

  return (
    <OrganizationalBalanceCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalAdaptiveIntelligenceLink: t(`${p}.organizationalAdaptiveIntelligenceLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        signalsTitle: t(`${p}.signalsTitle`),
        recalibrationTitle: t(`${p}.recalibrationTitle`),
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
        scheduleReflection: t(`${p}.scheduleReflection`),
        completeInitiative: t(`${p}.completeInitiative`),
        generateReport: t(`${p}.generateReport`),
        printSummary: t(`${p}.printSummary`),
        exportSnapshot: t(`${p}.exportSnapshot`),
        coordinateDiscussion: t(`${p}.coordinateDiscussion`),
        archiveMilestone: t(`${p}.archiveMilestone`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        balanceScore: t(`${p}.balanceScore`),
        sustainabilityIndicators: t(`${p}.sustainabilityIndicators`),
        domains: {
          growth_stability: t(`${p}.domains.growth_stability`),
          innovation_discipline: t(`${p}.domains.innovation_discipline`),
          people_performance: t(`${p}.domains.people_performance`),
          short_long_term: t(`${p}.domains.short_long_term`),
          autonomy_alignment: t(`${p}.domains.autonomy_alignment`),
          optimism_realism: t(`${p}.domains.optimism_realism`),
        },
        signalTypes: {
          emerging_imbalances: t(`${p}.signalTypes.emerging_imbalances`),
          recalibration_areas: t(`${p}.signalTypes.recalibration_areas`),
          healthy_tensions: t(`${p}.signalTypes.healthy_tensions`),
          equilibrium_trends: t(`${p}.signalTypes.equilibrium_trends`),
          sustainable_adjustments: t(`${p}.signalTypes.sustainable_adjustments`),
        },
        signalTones: {
          positive: t(`${p}.signalTones.positive`),
          neutral: t(`${p}.signalTones.neutral`),
          attention: t(`${p}.signalTones.attention`),
        },
        recalibrationTypes: {
          responsible_growth: t(`${p}.recalibrationTypes.responsible_growth`),
          people_support: t(`${p}.recalibrationTypes.people_support`),
          long_term_priorities: t(`${p}.recalibrationTypes.long_term_priorities`),
          governance_proportion: t(`${p}.recalibrationTypes.governance_proportion`),
          tensions_attention: t(`${p}.recalibrationTypes.tensions_attention`),
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
          rebalancing_recommended: t(`${p}.healthLabels.rebalancing_recommended`),
        },
        timelineTypes: {
          strategic_recalibration: t(`${p}.timelineTypes.strategic_recalibration`),
          leadership_reflection: t(`${p}.timelineTypes.leadership_reflection`),
          growth_milestone: t(`${p}.timelineTypes.growth_milestone`),
          governance_development: t(`${p}.timelineTypes.governance_development`),
          organizational_learning: t(`${p}.timelineTypes.organizational_learning`),
        },
        reviewTypes: {
          quarterly_balance: t(`${p}.reviewTypes.quarterly_balance`),
          leadership_reflection: t(`${p}.reviewTypes.leadership_reflection`),
          strategic_pacing_discussion: t(`${p}.reviewTypes.strategic_pacing_discussion`),
          annual_sustainability_assessment: t(`${p}.reviewTypes.annual_sustainability_assessment`),
        },
        sessionTypes: {
          reflection_session: t(`${p}.sessionTypes.reflection_session`),
          strategic_pacing_discussion: t(`${p}.sessionTypes.strategic_pacing_discussion`),
          leadership_discussion: t(`${p}.sessionTypes.leadership_discussion`),
        },
        metrics: {
          sustainabilityIndicators: t(`${p}.metrics.sustainabilityIndicators`),
          strategicPacing: t(`${p}.metrics.strategicPacing`),
          leadershipConsistency: t(`${p}.metrics.leadershipConsistency`),
          workforceResilience: t(`${p}.metrics.workforceResilience`),
          governanceEffectiveness: t(`${p}.metrics.governanceEffectiveness`),
          initiatives: t(`${p}.metrics.initiatives`),
          reviews: t(`${p}.metrics.reviews`),
        },
        executiveFields: {
          sustainabilityIndicators: t(`${p}.executiveFields.sustainabilityIndicators`),
          strategicPacing: t(`${p}.executiveFields.strategicPacing`),
          leadershipConsistency: t(`${p}.executiveFields.leadershipConsistency`),
          equilibriumOpportunities: t(`${p}.executiveFields.equilibriumOpportunities`),
        },
      }}
    />
  );
}
