import { OrganizationalHarmonyCenterPanel } from "@/components/app/organizational-harmony-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalHarmonyCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalHarmonyCenter";

  return (
    <OrganizationalHarmonyCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalAwarenessLink: t(`${p}.organizationalAwarenessLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        signalsTitle: t(`${p}.signalsTitle`),
        dialogueTitle: t(`${p}.dialogueTitle`),
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
        completeInitiative: t(`${p}.completeInitiative`),
        generateReport: t(`${p}.generateReport`),
        printSummary: t(`${p}.printSummary`),
        exportSnapshot: t(`${p}.exportSnapshot`),
        coordinateReview: t(`${p}.coordinateReview`),
        archiveMilestone: t(`${p}.archiveMilestone`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        harmonyScore: t(`${p}.harmonyScore`),
        collaborationIndicators: t(`${p}.collaborationIndicators`),
        domains: {
          team: t(`${p}.domains.team`),
          leadership: t(`${p}.domains.leadership`),
          cross_functional: t(`${p}.domains.cross_functional`),
          customer: t(`${p}.domains.customer`),
          cultural: t(`${p}.domains.cultural`),
          operational: t(`${p}.domains.operational`),
        },
        signalTypes: {
          collaboration_strength: t(`${p}.signalTypes.collaboration_strength`),
          cross_functional_friction: t(`${p}.signalTypes.cross_functional_friction`),
          communication_breakdown: t(`${p}.signalTypes.communication_breakdown`),
          shared_success_opportunity: t(`${p}.signalTypes.shared_success_opportunity`),
          relationship_development: t(`${p}.signalTypes.relationship_development`),
        },
        signalTones: {
          positive: t(`${p}.signalTones.positive`),
          neutral: t(`${p}.signalTones.neutral`),
          attention: t(`${p}.signalTones.attention`),
        },
        dialogueTypes: {
          diverse_perspectives: t(`${p}.dialogueTypes.diverse_perspectives`),
          respectful_disagreement: t(`${p}.dialogueTypes.respectful_disagreement`),
          shared_goals_alignment: t(`${p}.dialogueTypes.shared_goals_alignment`),
          communication_effectiveness: t(`${p}.dialogueTypes.communication_effectiveness`),
          relationship_support: t(`${p}.dialogueTypes.relationship_support`),
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
          harmony_improvement_recommended: t(`${p}.healthLabels.harmony_improvement_recommended`),
        },
        timelineTypes: {
          collaboration_milestone: t(`${p}.timelineTypes.collaboration_milestone`),
          leadership_reflection: t(`${p}.timelineTypes.leadership_reflection`),
          cross_functional_achievement: t(`${p}.timelineTypes.cross_functional_achievement`),
          cultural_development: t(`${p}.timelineTypes.cultural_development`),
          organizational_breakthrough: t(`${p}.timelineTypes.organizational_breakthrough`),
        },
        reviewTypes: {
          quarterly_harmony: t(`${p}.reviewTypes.quarterly_harmony`),
          leadership_reflection: t(`${p}.reviewTypes.leadership_reflection`),
          cross_functional_discussion: t(`${p}.reviewTypes.cross_functional_discussion`),
          annual_organizational_assessment: t(`${p}.reviewTypes.annual_organizational_assessment`),
        },
        sessionTypes: {
          collaboration_workshop: t(`${p}.sessionTypes.collaboration_workshop`),
          leadership_discussion: t(`${p}.sessionTypes.leadership_discussion`),
          organizational_assessment: t(`${p}.sessionTypes.organizational_assessment`),
        },
        metrics: {
          collaborationEffectiveness: t(`${p}.metrics.collaborationEffectiveness`),
          leadershipConsistency: t(`${p}.metrics.leadershipConsistency`),
          crossFunctionalCooperation: t(`${p}.metrics.crossFunctionalCooperation`),
          communicationQuality: t(`${p}.metrics.communicationQuality`),
          sharedOwnership: t(`${p}.metrics.sharedOwnership`),
          crossFunctionalAlignment: t(`${p}.metrics.crossFunctionalAlignment`),
          initiatives: t(`${p}.metrics.initiatives`),
          reviews: t(`${p}.metrics.reviews`),
        },
        executiveFields: {
          leadershipAlignment: t(`${p}.executiveFields.leadershipAlignment`),
          collaborationEffectiveness: t(`${p}.executiveFields.collaborationEffectiveness`),
          crossFunctionalRelationships: t(`${p}.executiveFields.crossFunctionalRelationships`),
          cohesionOpportunities: t(`${p}.executiveFields.cohesionOpportunities`),
        },
      }}
    />
  );
}
