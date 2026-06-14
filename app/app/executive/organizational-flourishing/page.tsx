import { OrganizationalFlourishingCenterPanel } from "@/components/app/organizational-flourishing-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalFlourishingCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalFlourishingCenter";

  return (
    <OrganizationalFlourishingCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalPurposeLink: t(`${p}.organizationalPurposeLink`),
        organizationalConfidenceLink: t(`${p}.organizationalConfidenceLink`),
        organizationalLearningLink: t(`${p}.organizationalLearningLink`),
        organizationalEnergyLink: t(`${p}.organizationalEnergyLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        conditionsTitle: t(`${p}.conditionsTitle`),
        meaningTitle: t(`${p}.meaningTitle`),
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
        flourishingScore: t(`${p}.flourishingScore`),
        positiveMomentum: t(`${p}.positiveMomentum`),
        domains: {
          individual: t(`${p}.domains.individual`),
          team: t(`${p}.domains.team`),
          leadership: t(`${p}.domains.leadership`),
          customer: t(`${p}.domains.customer`),
          organizational: t(`${p}.domains.organizational`),
        },
        conditionTypes: {
          sustainable_success: t(`${p}.conditionTypes.sustainable_success`),
          long_term_engagement: t(`${p}.conditionTypes.long_term_engagement`),
          meaningful_contribution: t(`${p}.conditionTypes.meaningful_contribution`),
          organizational_resilience: t(`${p}.conditionTypes.organizational_resilience`),
          shared_progress: t(`${p}.conditionTypes.shared_progress`),
        },
        conditionTones: {
          positive: t(`${p}.conditionTones.positive`),
          neutral: t(`${p}.conditionTones.neutral`),
          attention: t(`${p}.conditionTones.attention`),
        },
        meaningTypes: {
          work_contribution: t(`${p}.meaningTypes.work_contribution`),
          purpose_understanding: t(`${p}.meaningTypes.purpose_understanding`),
          success_celebration: t(`${p}.meaningTypes.success_celebration`),
          growth_opportunity: t(`${p}.meaningTypes.growth_opportunity`),
        },
        initiativeStatuses: {
          planned: t(`${p}.initiativeStatuses.planned`),
          in_progress: t(`${p}.initiativeStatuses.in_progress`),
          completed: t(`${p}.initiativeStatuses.completed`),
        },
        healthLabels: {
          thriving: t(`${p}.healthLabels.thriving`),
          healthy: t(`${p}.healthLabels.healthy`),
          developing: t(`${p}.healthLabels.developing`),
          strained: t(`${p}.healthLabels.strained`),
          support_recommended: t(`${p}.healthLabels.support_recommended`),
        },
        timelineTypes: {
          growth_milestone: t(`${p}.timelineTypes.growth_milestone`),
          learning_achievement: t(`${p}.timelineTypes.learning_achievement`),
          cultural_development: t(`${p}.timelineTypes.cultural_development`),
          leadership_reflection: t(`${p}.timelineTypes.leadership_reflection`),
          organizational_breakthrough: t(`${p}.timelineTypes.organizational_breakthrough`),
        },
        reviewTypes: {
          quarterly_flourishing: t(`${p}.reviewTypes.quarterly_flourishing`),
          leadership_reflection: t(`${p}.reviewTypes.leadership_reflection`),
          annual_assessment: t(`${p}.reviewTypes.annual_assessment`),
          purpose_discussion: t(`${p}.reviewTypes.purpose_discussion`),
        },
        sessionTypes: {
          reflection_session: t(`${p}.sessionTypes.reflection_session`),
          purpose_workshop: t(`${p}.sessionTypes.purpose_workshop`),
        },
        metrics: {
          learning: t(`${p}.metrics.learning`),
          collaboration: t(`${p}.metrics.collaboration`),
          leadership: t(`${p}.metrics.leadership`),
          resilience: t(`${p}.metrics.resilience`),
          purpose: t(`${p}.metrics.purpose`),
          sustainability: t(`${p}.metrics.sustainability`),
          initiatives: t(`${p}.metrics.initiatives`),
          reviews: t(`${p}.metrics.reviews`),
        },
        executiveFields: {
          sustainability: t(`${p}.executiveFields.sustainability`),
          resilience: t(`${p}.executiveFields.resilience`),
          leadership: t(`${p}.executiveFields.leadership`),
          opportunities: t(`${p}.executiveFields.opportunities`),
        },
      }}
    />
  );
}
