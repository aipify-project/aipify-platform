import { OrganizationalWisdomTransferCenterPanel } from "@/components/app/organizational-wisdom-transfer-center";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalWisdomTransferCenterPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalWisdomTransferCenter";

  return (
    <OrganizationalWisdomTransferCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalHopeLink: t(`${p}.organizationalHopeLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        signalsTitle: t(`${p}.signalsTitle`),
        transferTitle: t(`${p}.transferTitle`),
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
        wisdomTransferScore: t(`${p}.wisdomTransferScore`),
        knowledgePreservation: t(`${p}.knowledgePreservation`),
        domains: {
          leadership: t(`${p}.domains.leadership`),
          workforce: t(`${p}.domains.workforce`),
          operational: t(`${p}.domains.operational`),
          strategic: t(`${p}.domains.strategic`),
          customer: t(`${p}.domains.customer`),
          institutional: t(`${p}.domains.institutional`),
        },
        signalTypes: {
          knowledge_flow: t(`${p}.signalTypes.knowledge_flow`),
          mentorship_strength: t(`${p}.signalTypes.mentorship_strength`),
          institutional_memory: t(`${p}.signalTypes.institutional_memory`),
          lessons_integrated: t(`${p}.signalTypes.lessons_integrated`),
          judgment_preserved: t(`${p}.signalTypes.judgment_preserved`),
        },
        signalTones: {
          positive: t(`${p}.signalTones.positive`),
          neutral: t(`${p}.signalTones.neutral`),
          attention: t(`${p}.signalTones.attention`),
        },
        transferTypes: {
          lessons_learned: t(`${p}.transferTypes.lessons_learned`),
          experience_shared: t(`${p}.transferTypes.experience_shared`),
          judgment_documented: t(`${p}.transferTypes.judgment_documented`),
          wisdom_preserved: t(`${p}.transferTypes.wisdom_preserved`),
          knowledge_carried_forward: t(`${p}.transferTypes.knowledge_carried_forward`),
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
          wisdom_transfer_recommended: t(`${p}.healthLabels.wisdom_transfer_recommended`),
        },
        timelineTypes: {
          leadership_succession: t(`${p}.timelineTypes.leadership_succession`),
          knowledge_archive: t(`${p}.timelineTypes.knowledge_archive`),
          mentorship_practice: t(`${p}.timelineTypes.mentorship_practice`),
          strategic_lesson: t(`${p}.timelineTypes.strategic_lesson`),
          cultural_wisdom: t(`${p}.timelineTypes.cultural_wisdom`),
        },
        reviewTypes: {
          quarterly_wisdom_transfer: t(`${p}.reviewTypes.quarterly_wisdom_transfer`),
          leadership_reflection: t(`${p}.reviewTypes.leadership_reflection`),
          knowledge_transfer_discussion: t(`${p}.reviewTypes.knowledge_transfer_discussion`),
          annual_organizational_assessment: t(`${p}.reviewTypes.annual_organizational_assessment`),
        },
        sessionTypes: {
          reflection_session: t(`${p}.sessionTypes.reflection_session`),
          knowledge_transfer_discussion: t(`${p}.sessionTypes.knowledge_transfer_discussion`),
          mentorship_session: t(`${p}.sessionTypes.mentorship_session`),
        },
        metrics: {
          experienceSharing: t(`${p}.metrics.experienceSharing`),
          judgmentTransfer: t(`${p}.metrics.judgmentTransfer`),
          institutionalMemory: t(`${p}.metrics.institutionalMemory`),
          learningIntegration: t(`${p}.metrics.learningIntegration`),
          wisdomStewardship: t(`${p}.metrics.wisdomStewardship`),
          mentorshipParticipation: t(`${p}.metrics.mentorshipParticipation`),
          initiatives: t(`${p}.metrics.initiatives`),
          reviews: t(`${p}.metrics.reviews`),
        },
        executiveFields: {
          leadershipStewardship: t(`${p}.executiveFields.leadershipStewardship`),
          institutionalMemoryStrength: t(`${p}.executiveFields.institutionalMemoryStrength`),
          knowledgeTransferTrends: t(`${p}.executiveFields.knowledgeTransferTrends`),
          successionReadiness: t(`${p}.executiveFields.successionReadiness`),
        },
      }}
    />
  );
}
