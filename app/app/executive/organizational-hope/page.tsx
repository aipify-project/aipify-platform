import { OrganizationalHopeCenterPanel } from "@/components/app/organizational-hope-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalHopeCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalHopeCenter";

  return (
    <OrganizationalHopeCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalCourageLink: t(`${p}.organizationalCourageLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        signalsTitle: t(`${p}.signalsTitle`),
        progressTitle: t(`${p}.progressTitle`),
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
        hopeScore: t(`${p}.hopeScore`),
        progressIndicators: t(`${p}.progressIndicators`),
        domains: {
          leadership: t(`${p}.domains.leadership`),
          workforce: t(`${p}.domains.workforce`),
          customer: t(`${p}.domains.customer`),
          strategic: t(`${p}.domains.strategic`),
          organizational: t(`${p}.domains.organizational`),
          community: t(`${p}.domains.community`),
        },
        signalTypes: {
          positive_momentum: t(`${p}.signalTypes.positive_momentum`),
          future_confidence: t(`${p}.signalTypes.future_confidence`),
          leadership_encouragement: t(`${p}.signalTypes.leadership_encouragement`),
          resilience_development: t(`${p}.signalTypes.resilience_development`),
          meaningful_progress: t(`${p}.signalTypes.meaningful_progress`),
        },
        signalTones: {
          positive: t(`${p}.signalTones.positive`),
          neutral: t(`${p}.signalTones.neutral`),
          attention: t(`${p}.signalTones.attention`),
        },
        progressTypes: {
          progress_made: t(`${p}.progressTypes.progress_made`),
          strengths_emerged: t(`${p}.progressTypes.strengths_emerged`),
          opportunities_available: t(`${p}.progressTypes.opportunities_available`),
          confidence_forward: t(`${p}.progressTypes.confidence_forward`),
          reinforce_resilience: t(`${p}.progressTypes.reinforce_resilience`),
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
          hope_reinforcement_recommended: t(`${p}.healthLabels.hope_reinforcement_recommended`),
        },
        timelineTypes: {
          organizational_breakthrough: t(`${p}.timelineTypes.organizational_breakthrough`),
          recovery_milestone: t(`${p}.timelineTypes.recovery_milestone`),
          leadership_reflection: t(`${p}.timelineTypes.leadership_reflection`),
          strategic_achievement: t(`${p}.timelineTypes.strategic_achievement`),
          cultural_development: t(`${p}.timelineTypes.cultural_development`),
        },
        reviewTypes: {
          quarterly_hope: t(`${p}.reviewTypes.quarterly_hope`),
          leadership_reflection: t(`${p}.reviewTypes.leadership_reflection`),
          purpose_discussion: t(`${p}.reviewTypes.purpose_discussion`),
          annual_organizational_assessment: t(`${p}.reviewTypes.annual_organizational_assessment`),
        },
        sessionTypes: {
          reflection_session: t(`${p}.sessionTypes.reflection_session`),
          purpose_discussion: t(`${p}.sessionTypes.purpose_discussion`),
          leadership_discussion: t(`${p}.sessionTypes.leadership_discussion`),
        },
        metrics: {
          progressRecognitionMetric: t(`${p}.metrics.progressRecognitionMetric`),
          leadershipCommunication: t(`${p}.metrics.leadershipCommunication`),
          purposeAlignment: t(`${p}.metrics.purposeAlignment`),
          learningParticipation: t(`${p}.metrics.learningParticipation`),
          organizationalResilienceMetric: t(`${p}.metrics.organizationalResilienceMetric`),
          futureConfidence: t(`${p}.metrics.futureConfidence`),
          initiatives: t(`${p}.metrics.initiatives`),
          reviews: t(`${p}.metrics.reviews`),
        },
        executiveFields: {
          leadershipConfidence: t(`${p}.executiveFields.leadershipConfidence`),
          organizationalResilience: t(`${p}.executiveFields.organizationalResilience`),
          progressRecognition: t(`${p}.executiveFields.progressRecognition`),
          futureOpportunity: t(`${p}.executiveFields.futureOpportunity`),
        },
      }}
    />
  );
}
