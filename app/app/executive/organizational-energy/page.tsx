import { OrganizationalEnergyCenterPanel } from "@/components/app/organizational-energy-center";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalEnergyCenterPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalEnergyCenter";

  return (
    <OrganizationalEnergyCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalFocusLink: t(`${p}.organizationalFocusLink`),
        organizationalHealthLink: t(`${p}.organizationalHealthLink`),
        organizationalResilienceLink: t(`${p}.organizationalResilienceLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        signalsTitle: t(`${p}.signalsTitle`),
        balanceTitle: t(`${p}.balanceTitle`),
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
        energyScore: t(`${p}.energyScore`),
        momentumIndicators: t(`${p}.momentumIndicators`),
        domains: {
          individual: t(`${p}.domains.individual`),
          team: t(`${p}.domains.team`),
          leadership: t(`${p}.domains.leadership`),
          customer: t(`${p}.domains.customer`),
          operational: t(`${p}.domains.operational`),
          organizational: t(`${p}.domains.organizational`),
        },
        signalTypes: {
          energy_sources: t(`${p}.signalTypes.energy_sources`),
          energy_drains: t(`${p}.signalTypes.energy_drains`),
          sustainable_momentum_patterns: t(`${p}.signalTypes.sustainable_momentum_patterns`),
          friction_points: t(`${p}.signalTypes.friction_points`),
          recovery_opportunities: t(`${p}.signalTypes.recovery_opportunities`),
        },
        signalTones: {
          positive: t(`${p}.signalTones.positive`),
          neutral: t(`${p}.signalTones.neutral`),
          attention: t(`${p}.signalTones.attention`),
        },
        balanceTypes: {
          current_energizers: t(`${p}.balanceTypes.current_energizers`),
          unnecessary_drains: t(`${p}.balanceTypes.unnecessary_drains`),
          sustainable_pacing: t(`${p}.balanceTypes.sustainable_pacing`),
          systems_supporting_people: t(`${p}.balanceTypes.systems_supporting_people`),
          strengthen_momentum: t(`${p}.balanceTypes.strengthen_momentum`),
        },
        initiativeStatuses: {
          planned: t(`${p}.initiativeStatuses.planned`),
          in_progress: t(`${p}.initiativeStatuses.in_progress`),
          completed: t(`${p}.initiativeStatuses.completed`),
        },
        healthLabels: {
          thriving: t(`${p}.healthLabels.thriving`),
          healthy: t(`${p}.healthLabels.healthy`),
          balanced: t(`${p}.healthLabels.balanced`),
          strained: t(`${p}.healthLabels.strained`),
          energy_reinforcement_recommended: t(`${p}.healthLabels.energy_reinforcement_recommended`),
        },
        timelineTypes: {
          recovery_milestone: t(`${p}.timelineTypes.recovery_milestone`),
          momentum_breakthrough: t(`${p}.timelineTypes.momentum_breakthrough`),
          leadership_reflection: t(`${p}.timelineTypes.leadership_reflection`),
          collaboration_achievement: t(`${p}.timelineTypes.collaboration_achievement`),
          sustainability_initiative: t(`${p}.timelineTypes.sustainability_initiative`),
        },
        reviewTypes: {
          monthly_energy: t(`${p}.reviewTypes.monthly_energy`),
          quarterly_leadership_reflection: t(`${p}.reviewTypes.quarterly_leadership_reflection`),
          team_sustainability: t(`${p}.reviewTypes.team_sustainability`),
          annual_assessment: t(`${p}.reviewTypes.annual_assessment`),
        },
        sessionTypes: {
          reflection_session: t(`${p}.sessionTypes.reflection_session`),
          stewardship_session: t(`${p}.sessionTypes.stewardship_session`),
          leadership_discussion: t(`${p}.sessionTypes.leadership_discussion`),
        },
        metrics: {
          momentumIndicators: t(`${p}.metrics.momentumIndicators`),
          recoveryAwareness: t(`${p}.metrics.recoveryAwareness`),
          engagementTrends: t(`${p}.metrics.engagementTrends`),
          sustainablePacing: t(`${p}.metrics.sustainablePacing`),
          collaborationQuality: t(`${p}.metrics.collaborationQuality`),
          leadershipConsistency: t(`${p}.metrics.leadershipConsistency`),
          operationalFriction: t(`${p}.metrics.operationalFriction`),
          recoveryEffectiveness: t(`${p}.metrics.recoveryEffectiveness`),
          initiatives: t(`${p}.metrics.initiatives`),
          reviews: t(`${p}.metrics.reviews`),
        },
        executiveFields: {
          organizationalMomentum: t(`${p}.executiveFields.organizationalMomentum`),
          leadershipSustainability: t(`${p}.executiveFields.leadershipSustainability`),
          collaborationEffectiveness: t(`${p}.executiveFields.collaborationEffectiveness`),
          capacityPreservationOpportunities: t(`${p}.executiveFields.capacityPreservationOpportunities`),
        },
      }}
    />
  );
}
