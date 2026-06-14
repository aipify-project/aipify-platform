import { OrganizationalLegacyCenterPanel } from "@/components/app/organizational-legacy-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalLegacyCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalLegacyCenter";

  return (
    <OrganizationalLegacyCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalIdentityLink: t(`${p}.organizationalIdentityLink`),
        organizationalStewardshipLink: t(`${p}.organizationalStewardshipLink`),
        organizationalWisdomLink: t(`${p}.organizationalWisdomLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        signalsTitle: t(`${p}.signalsTitle`),
        legacyQuestionsTitle: t(`${p}.legacyQuestionsTitle`),
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
        archiveMilestoneDefaultTitle: t(`${p}.archiveMilestoneDefaultTitle`),
        archiveMilestoneDefaultSummary: t(`${p}.archiveMilestoneDefaultSummary`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        legacyScore: t(`${p}.legacyScore`),
        positiveImpact: t(`${p}.positiveImpact`),
        domains: {
          customer: t(`${p}.domains.customer`),
          employee: t(`${p}.domains.employee`),
          leadership: t(`${p}.domains.leadership`),
          cultural: t(`${p}.domains.cultural`),
          community: t(`${p}.domains.community`),
          organizational: t(`${p}.domains.organizational`),
          founding: t(`${p}.domains.founding`),
        },
        signalTypes: {
          positive_long_term_patterns: t(`${p}.signalTypes.positive_long_term_patterns`),
          stewardship_strengths: t(`${p}.signalTypes.stewardship_strengths`),
          knowledge_preservation_opportunities: t(`${p}.signalTypes.knowledge_preservation_opportunities`),
          legacy_risks: t(`${p}.signalTypes.legacy_risks`),
          high_impact_contributions: t(`${p}.signalTypes.high_impact_contributions`),
        },
        signalTones: {
          positive: t(`${p}.signalTones.positive`),
          neutral: t(`${p}.signalTones.neutral`),
          attention: t(`${p}.signalTones.attention`),
        },
        legacyQuestionTypes: {
          beyond_immediate_results: t(`${p}.legacyQuestionTypes.beyond_immediate_results`),
          customer_remember: t(`${p}.legacyQuestionTypes.customer_remember`),
          knowledge_preserve: t(`${p}.legacyQuestionTypes.knowledge_preserve`),
          traditions_continue: t(`${p}.legacyQuestionTypes.traditions_continue`),
          impact_leave_behind: t(`${p}.legacyQuestionTypes.impact_leave_behind`),
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
          legacy_reinforcement_recommended: t(`${p}.healthLabels.legacy_reinforcement_recommended`),
          maturing: t(`${p}.healthLabels.maturing`),
          emerging: t(`${p}.healthLabels.emerging`),
        },
        timelineTypes: {
          foundational_milestone: t(`${p}.timelineTypes.foundational_milestone`),
          leadership_transition: t(`${p}.timelineTypes.leadership_transition`),
          significant_achievement: t(`${p}.timelineTypes.significant_achievement`),
          cultural_development: t(`${p}.timelineTypes.cultural_development`),
          community_contribution: t(`${p}.timelineTypes.community_contribution`),
          founding_event: t(`${p}.timelineTypes.founding_event`),
          growth_milestone: t(`${p}.timelineTypes.growth_milestone`),
          major_achievement: t(`${p}.timelineTypes.major_achievement`),
          org_transition: t(`${p}.timelineTypes.org_transition`),
          significant_lesson: t(`${p}.timelineTypes.significant_lesson`),
          cultural_moment: t(`${p}.timelineTypes.cultural_moment`),
        },
        reviewTypes: {
          annual_legacy: t(`${p}.reviewTypes.annual_legacy`),
          leadership_reflection: t(`${p}.reviewTypes.leadership_reflection`),
          succession_planning: t(`${p}.reviewTypes.succession_planning`),
          purpose_stewardship: t(`${p}.reviewTypes.purpose_stewardship`),
        },
        sessionTypes: {
          reflection_session: t(`${p}.sessionTypes.reflection_session`),
          stewardship_session: t(`${p}.sessionTypes.stewardship_session`),
          leadership_discussion: t(`${p}.sessionTypes.leadership_discussion`),
          succession_discussion: t(`${p}.sessionTypes.succession_discussion`),
          leadership_reflection: t(`${p}.sessionTypes.leadership_reflection`),
          stewardship_review: t(`${p}.sessionTypes.stewardship_review`),
          legacy_planning: t(`${p}.sessionTypes.legacy_planning`),
        },
        metrics: {
          stewardshipQuality: t(`${p}.metrics.stewardshipQuality`),
          knowledgePreservation: t(`${p}.metrics.knowledgePreservation`),
          leadershipSuccession: t(`${p}.metrics.leadershipSuccession`),
          customerTrust: t(`${p}.metrics.customerTrust`),
          culturalResilience: t(`${p}.metrics.culturalResilience`),
          valuesConsistency: t(`${p}.metrics.valuesConsistency`),
          initiatives: t(`${p}.metrics.initiatives`),
          reviews: t(`${p}.metrics.reviews`),
        },
        executiveFields: {
          stewardshipIndicators: t(`${p}.executiveFields.stewardshipIndicators`),
          leadershipContinuity: t(`${p}.executiveFields.leadershipContinuity`),
          knowledgePreservation: t(`${p}.executiveFields.knowledgePreservation`),
          contributionOpportunities: t(`${p}.executiveFields.contributionOpportunities`),
        },
      }}
    />
  );
}
