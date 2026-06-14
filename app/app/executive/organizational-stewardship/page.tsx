import { OrganizationalStewardshipCenterPanel } from "@/components/app/organizational-stewardship-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalStewardshipCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalStewardshipCenter";

  return (
    <OrganizationalStewardshipCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalLegacyLink: t(`${p}.organizationalLegacyLink`),
        organizationalIdentityLink: t(`${p}.organizationalIdentityLink`),
        organizationalWisdomLink: t(`${p}.organizationalWisdomLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        signalsTitle: t(`${p}.signalsTitle`),
        responsibilityTitle: t(`${p}.responsibilityTitle`),
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
        stewardshipScore: t(`${p}.stewardshipScore`),
        leadershipStewardship: t(`${p}.leadershipStewardship`),
        domains: {
          people: t(`${p}.domains.people`),
          knowledge: t(`${p}.domains.knowledge`),
          resource: t(`${p}.domains.resource`),
          customer: t(`${p}.domains.customer`),
          cultural: t(`${p}.domains.cultural`),
          strategic: t(`${p}.domains.strategic`),
          technology: t(`${p}.domains.technology`),
          community: t(`${p}.domains.community`),
        },
        signalTypes: {
          positive_stewardship_behaviors: t(`${p}.signalTypes.positive_stewardship_behaviors`),
          long_term_investment_patterns: t(`${p}.signalTypes.long_term_investment_patterns`),
          knowledge_preservation_opportunities: t(`${p}.signalTypes.knowledge_preservation_opportunities`),
          trust_strengthening_initiatives: t(`${p}.signalTypes.trust_strengthening_initiatives`),
          resource_sustainability_improvements: t(`${p}.signalTypes.resource_sustainability_improvements`),
        },
        signalTones: {
          positive: t(`${p}.signalTones.positive`),
          neutral: t(`${p}.signalTones.neutral`),
          attention: t(`${p}.signalTones.attention`),
        },
        responsibilityTypes: {
          entrusted_to_us: t(`${p}.responsibilityTypes.entrusted_to_us`),
          protecting_future_opportunities: t(`${p}.responsibilityTypes.protecting_future_opportunities`),
          investing_in_people: t(`${p}.responsibilityTypes.investing_in_people`),
          preserving_knowledge: t(`${p}.responsibilityTypes.preserving_knowledge`),
          strengthening_trust: t(`${p}.responsibilityTypes.strengthening_trust`),
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
          stewardship_reinforcement_recommended: t(`${p}.healthLabels.stewardship_reinforcement_recommended`),
          needs_attention: t(`${p}.healthLabels.needs_attention`),
          reactive: t(`${p}.healthLabels.reactive`),
        },
        timelineTypes: {
          leadership_initiative: t(`${p}.timelineTypes.leadership_initiative`),
          knowledge_preservation_milestone: t(`${p}.timelineTypes.knowledge_preservation_milestone`),
          customer_trust_achievement: t(`${p}.timelineTypes.customer_trust_achievement`),
          cultural_development: t(`${p}.timelineTypes.cultural_development`),
          strategic_investment: t(`${p}.timelineTypes.strategic_investment`),
        },
        reviewTypes: {
          quarterly_stewardship: t(`${p}.reviewTypes.quarterly_stewardship`),
          leadership_reflection: t(`${p}.reviewTypes.leadership_reflection`),
          knowledge_continuity: t(`${p}.reviewTypes.knowledge_continuity`),
          annual_assessment: t(`${p}.reviewTypes.annual_assessment`),
          annual_leadership: t(`${p}.reviewTypes.annual_leadership`),
          succession_preparedness: t(`${p}.reviewTypes.succession_preparedness`),
          long_term_planning: t(`${p}.reviewTypes.long_term_planning`),
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
          trustPreservation: t(`${p}.metrics.trustPreservation`),
          knowledgeContinuity: t(`${p}.metrics.knowledgeContinuity`),
          resourceSustainability: t(`${p}.metrics.resourceSustainability`),
          strategicConsistency: t(`${p}.metrics.strategicConsistency`),
          leadershipResponsibility: t(`${p}.metrics.leadershipResponsibility`),
          customerTrust: t(`${p}.metrics.customerTrust`),
          initiatives: t(`${p}.metrics.initiatives`),
          reviews: t(`${p}.metrics.reviews`),
        },
        executiveFields: {
          leadershipResponsibility: t(`${p}.executiveFields.leadershipResponsibility`),
          trustPreservation: t(`${p}.executiveFields.trustPreservation`),
          knowledgeContinuity: t(`${p}.executiveFields.knowledgeContinuity`),
          futureInvestmentOpportunities: t(`${p}.executiveFields.futureInvestmentOpportunities`),
        },
      }}
    />
  );
}
