import { OrganizationalClarityCenterPanel } from "@/components/app/organizational-clarity-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalClarityCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalClarityCenter";

  return (
    <OrganizationalClarityCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalSteadfastnessLink: t(`${p}.organizationalSteadfastnessLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        signalsTitle: t(`${p}.signalsTitle`),
        alignmentTitle: t(`${p}.alignmentTitle`),
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
        scheduleCommunicationReview: t(`${p}.scheduleCommunicationReview`),
        completeInitiative: t(`${p}.completeInitiative`),
        generateReport: t(`${p}.generateReport`),
        printSummary: t(`${p}.printSummary`),
        exportSnapshot: t(`${p}.exportSnapshot`),
        coordinateReview: t(`${p}.coordinateReview`),
        archiveMilestone: t(`${p}.archiveMilestone`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        clarityScore: t(`${p}.clarityScore`),
        communicationIndicators: t(`${p}.communicationIndicators`),
        domains: {
          strategic: t(`${p}.domains.strategic`),
          role: t(`${p}.domains.role`),
          operational: t(`${p}.domains.operational`),
          communication: t(`${p}.domains.communication`),
          governance: t(`${p}.domains.governance`),
          customer: t(`${p}.domains.customer`),
        },
        signalTypes: {
          ambiguous_responsibility: t(`${p}.signalTypes.ambiguous_responsibility`),
          conflicting_priority: t(`${p}.signalTypes.conflicting_priority`),
          communication_gap: t(`${p}.signalTypes.communication_gap`),
          unclear_process: t(`${p}.signalTypes.unclear_process`),
          decision_confusion: t(`${p}.signalTypes.decision_confusion`),
        },
        signalTones: {
          positive: t(`${p}.signalTones.positive`),
          neutral: t(`${p}.signalTones.neutral`),
          attention: t(`${p}.signalTones.attention`),
        },
        alignmentTypes: {
          responsibility_clarity: t(`${p}.alignmentTypes.responsibility_clarity`),
          priority_communication: t(`${p}.alignmentTypes.priority_communication`),
          realistic_expectations: t(`${p}.alignmentTypes.realistic_expectations`),
          decision_transparency: t(`${p}.alignmentTypes.decision_transparency`),
          additional_clarification: t(`${p}.alignmentTypes.additional_clarification`),
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
          clarity_improvement_recommended: t(`${p}.healthLabels.clarity_improvement_recommended`),
        },
        timelineTypes: {
          communication_milestone: t(`${p}.timelineTypes.communication_milestone`),
          governance_improvement: t(`${p}.timelineTypes.governance_improvement`),
          priority_clarification: t(`${p}.timelineTypes.priority_clarification`),
          leadership_reflection: t(`${p}.timelineTypes.leadership_reflection`),
          role_definition_update: t(`${p}.timelineTypes.role_definition_update`),
        },
        reviewTypes: {
          monthly_clarity: t(`${p}.reviewTypes.monthly_clarity`),
          quarterly_leadership: t(`${p}.reviewTypes.quarterly_leadership`),
          communication_assessment: t(`${p}.reviewTypes.communication_assessment`),
          annual_organizational_reflection: t(`${p}.reviewTypes.annual_organizational_reflection`),
        },
        sessionTypes: {
          communication_review: t(`${p}.sessionTypes.communication_review`),
          leadership_discussion: t(`${p}.sessionTypes.leadership_discussion`),
          organizational_reflection: t(`${p}.sessionTypes.organizational_reflection`),
        },
        metrics: {
          communicationConsistency: t(`${p}.metrics.communicationConsistency`),
          responsibilityAwareness: t(`${p}.metrics.responsibilityAwareness`),
          priorityUnderstanding: t(`${p}.metrics.priorityUnderstanding`),
          governanceTransparency: t(`${p}.metrics.governanceTransparency`),
          expectationAlignment: t(`${p}.metrics.expectationAlignment`),
          roleUnderstanding: t(`${p}.metrics.roleUnderstanding`),
          initiatives: t(`${p}.metrics.initiatives`),
          reviews: t(`${p}.metrics.reviews`),
        },
        executiveFields: {
          communicationEffectiveness: t(`${p}.executiveFields.communicationEffectiveness`),
          strategicUnderstanding: t(`${p}.executiveFields.strategicUnderstanding`),
          responsibilityTransparency: t(`${p}.executiveFields.responsibilityTransparency`),
          clarityOpportunities: t(`${p}.executiveFields.clarityOpportunities`),
        },
      }}
    />
  );
}
