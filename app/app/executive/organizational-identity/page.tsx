import { OrganizationalIdentityCenterPanel } from "@/components/app/organizational-identity-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalIdentityCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalIdentityCenter";

  return (
    <OrganizationalIdentityCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalBalanceLink: t(`${p}.organizationalBalanceLink`),
        organizationalPresenceLink: t(`${p}.organizationalPresenceLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        signalsTitle: t(`${p}.signalsTitle`),
        purposeAlignmentTitle: t(`${p}.purposeAlignmentTitle`),
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
        identityScore: t(`${p}.identityScore`),
        valuesAlignment: t(`${p}.valuesAlignment`),
        domains: {
          purpose: t(`${p}.domains.purpose`),
          values: t(`${p}.domains.values`),
          cultural: t(`${p}.domains.cultural`),
          customer: t(`${p}.domains.customer`),
          leadership: t(`${p}.domains.leadership`),
          legacy: t(`${p}.domains.legacy`),
        },
        signalTypes: {
          strengthening_identity_signals: t(`${p}.signalTypes.strengthening_identity_signals`),
          cultural_consistency: t(`${p}.signalTypes.cultural_consistency`),
          clarification_opportunities: t(`${p}.signalTypes.clarification_opportunities`),
          identity_tensions: t(`${p}.signalTypes.identity_tensions`),
          legacy_preservation_needs: t(`${p}.signalTypes.legacy_preservation_needs`),
        },
        signalTones: {
          positive: t(`${p}.signalTones.positive`),
          neutral: t(`${p}.signalTones.neutral`),
          attention: t(`${p}.signalTones.attention`),
        },
        purposeAlignmentTypes: {
          why_exist: t(`${p}.purposeAlignmentTypes.why_exist`),
          values_guide_decisions: t(`${p}.purposeAlignmentTypes.values_guide_decisions`),
          never_change: t(`${p}.purposeAlignmentTypes.never_change`),
          should_evolve: t(`${p}.purposeAlignmentTypes.should_evolve`),
          actions_consistent: t(`${p}.purposeAlignmentTypes.actions_consistent`),
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
          identity_reinforcement_recommended: t(`${p}.healthLabels.identity_reinforcement_recommended`),
        },
        timelineTypes: {
          founding_milestone: t(`${p}.timelineTypes.founding_milestone`),
          strategic_evolution: t(`${p}.timelineTypes.strategic_evolution`),
          cultural_development: t(`${p}.timelineTypes.cultural_development`),
          leadership_reflection: t(`${p}.timelineTypes.leadership_reflection`),
          legacy_achievement: t(`${p}.timelineTypes.legacy_achievement`),
        },
        reviewTypes: {
          quarterly_identity: t(`${p}.reviewTypes.quarterly_identity`),
          annual_purpose_reflection: t(`${p}.reviewTypes.annual_purpose_reflection`),
          leadership_stewardship: t(`${p}.reviewTypes.leadership_stewardship`),
          legacy_preservation: t(`${p}.reviewTypes.legacy_preservation`),
        },
        sessionTypes: {
          reflection_session: t(`${p}.sessionTypes.reflection_session`),
          stewardship_session: t(`${p}.sessionTypes.stewardship_session`),
          leadership_discussion: t(`${p}.sessionTypes.leadership_discussion`),
        },
        metrics: {
          valuesAlignment: t(`${p}.metrics.valuesAlignment`),
          culturalConsistency: t(`${p}.metrics.culturalConsistency`),
          leadershipParticipation: t(`${p}.metrics.leadershipParticipation`),
          legacyPreservation: t(`${p}.metrics.legacyPreservation`),
          purposeClarity: t(`${p}.metrics.purposeClarity`),
          initiatives: t(`${p}.metrics.initiatives`),
          reviews: t(`${p}.metrics.reviews`),
        },
        executiveFields: {
          purposeAlignment: t(`${p}.executiveFields.purposeAlignment`),
          leadershipConsistency: t(`${p}.executiveFields.leadershipConsistency`),
          valuesReinforcement: t(`${p}.executiveFields.valuesReinforcement`),
          stewardshipOpportunities: t(`${p}.executiveFields.stewardshipOpportunities`),
        },
      }}
    />
  );
}
