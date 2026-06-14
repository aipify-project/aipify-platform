import { OrganizationalPresenceCenterPanel } from "@/components/app/organizational-presence-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalPresenceCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalPresenceCenter";

  return (
    <OrganizationalPresenceCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalBalanceLink: t(`${p}.organizationalBalanceLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        signalsTitle: t(`${p}.signalsTitle`),
        attentivenessTitle: t(`${p}.attentivenessTitle`),
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
        presenceScore: t(`${p}.presenceScore`),
        engagementIndicators: t(`${p}.engagementIndicators`),
        domains: {
          leadership: t(`${p}.domains.leadership`),
          team: t(`${p}.domains.team`),
          customer: t(`${p}.domains.customer`),
          strategic: t(`${p}.domains.strategic`),
          cultural: t(`${p}.domains.cultural`),
          community: t(`${p}.domains.community`),
        },
        signalTypes: {
          strong_engagement_practices: t(`${p}.signalTypes.strong_engagement_practices`),
          meaningful_interactions: t(`${p}.signalTypes.meaningful_interactions`),
          deeper_connection_opportunities: t(`${p}.signalTypes.deeper_connection_opportunities`),
          responsiveness_improvements: t(`${p}.signalTypes.responsiveness_improvements`),
          reflection_participation: t(`${p}.signalTypes.reflection_participation`),
        },
        signalTones: {
          positive: t(`${p}.signalTones.positive`),
          neutral: t(`${p}.signalTones.neutral`),
          attention: t(`${p}.signalTones.attention`),
        },
        attentivenessTypes: {
          truly_listening: t(`${p}.attentivenessTypes.truly_listening`),
          customers_supported: t(`${p}.attentivenessTypes.customers_supported`),
          people_valued: t(`${p}.attentivenessTypes.people_valued`),
          conversation_attention: t(`${p}.attentivenessTypes.conversation_attention`),
          engaging_intentionally: t(`${p}.attentivenessTypes.engaging_intentionally`),
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
          presence_reinforcement_recommended: t(`${p}.healthLabels.presence_reinforcement_recommended`),
        },
        timelineTypes: {
          recognition_milestone: t(`${p}.timelineTypes.recognition_milestone`),
          leadership_reflection: t(`${p}.timelineTypes.leadership_reflection`),
          customer_relationship_achievement: t(`${p}.timelineTypes.customer_relationship_achievement`),
          communication_development: t(`${p}.timelineTypes.communication_development`),
          cultural_celebration: t(`${p}.timelineTypes.cultural_celebration`),
        },
        reviewTypes: {
          quarterly_presence: t(`${p}.reviewTypes.quarterly_presence`),
          leadership_reflection: t(`${p}.reviewTypes.leadership_reflection`),
          communication_assessment: t(`${p}.reviewTypes.communication_assessment`),
          annual_organizational_evaluation: t(`${p}.reviewTypes.annual_organizational_evaluation`),
        },
        sessionTypes: {
          reflection_session: t(`${p}.sessionTypes.reflection_session`),
          communication_assessment: t(`${p}.sessionTypes.communication_assessment`),
          leadership_discussion: t(`${p}.sessionTypes.leadership_discussion`),
        },
        metrics: {
          engagementIndicators: t(`${p}.metrics.engagementIndicators`),
          leadershipAttentiveness: t(`${p}.metrics.leadershipAttentiveness`),
          customerResponsiveness: t(`${p}.metrics.customerResponsiveness`),
          communicationQuality: t(`${p}.metrics.communicationQuality`),
          leadershipParticipation: t(`${p}.metrics.leadershipParticipation`),
          initiatives: t(`${p}.metrics.initiatives`),
          reviews: t(`${p}.metrics.reviews`),
        },
        executiveFields: {
          leadershipEngagement: t(`${p}.executiveFields.leadershipEngagement`),
          communicationEffectiveness: t(`${p}.executiveFields.communicationEffectiveness`),
          relationshipQuality: t(`${p}.executiveFields.relationshipQuality`),
          connectionOpportunities: t(`${p}.executiveFields.connectionOpportunities`),
        },
      }}
    />
  );
}
