import { OrganizationalContinuityCenterPanel } from "@/components/app/organizational-continuity-center";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalContinuityCenterPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalContinuityCenter";

  return (
    <OrganizationalContinuityCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalCoherenceLink: t(`${p}.organizationalCoherenceLink`),
        organizationalFuturesLink: t(`${p}.organizationalFuturesLink`),
        organizationalMomentumLink: t(`${p}.organizationalMomentumLink`),
        organizationalTrustLink: t(`${p}.organizationalTrustLink`),
        organizationalLegacyLink: t(`${p}.organizationalLegacyLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        dependencyTitle: t(`${p}.dependencyTitle`),
        successionTitle: t(`${p}.successionTitle`),
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
        scheduleDiscussion: t(`${p}.scheduleDiscussion`),
        addressDependency: t(`${p}.addressDependency`),
        advanceSuccession: t(`${p}.advanceSuccession`),
        generateReport: t(`${p}.generateReport`),
        printSummary: t(`${p}.printSummary`),
        exportSnapshot: t(`${p}.exportSnapshot`),
        coordinateTransfer: t(`${p}.coordinateTransfer`),
        archiveMilestone: t(`${p}.archiveMilestone`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        continuityScore: t(`${p}.continuityScore`),
        domains: {
          leadership: t(`${p}.domains.leadership`),
          knowledge: t(`${p}.domains.knowledge`),
          operational: t(`${p}.domains.operational`),
          customer: t(`${p}.domains.customer`),
          strategic: t(`${p}.domains.strategic`),
          cultural: t(`${p}.domains.cultural`),
        },
        signalTypes: {
          critical_knowledge_concentration: t(`${p}.signalTypes.critical_knowledge_concentration`),
          leadership_dependency: t(`${p}.signalTypes.leadership_dependency`),
          process_ownership_vulnerability: t(`${p}.signalTypes.process_ownership_vulnerability`),
          operational_bottleneck: t(`${p}.signalTypes.operational_bottleneck`),
        },
        signalTones: {
          positive: t(`${p}.signalTones.positive`),
          neutral: t(`${p}.signalTones.neutral`),
          attention: t(`${p}.signalTones.attention`),
        },
        signalStatuses: {
          open: t(`${p}.signalStatuses.open`),
          addressed: t(`${p}.signalStatuses.addressed`),
        },
        successionTypes: {
          leadership_transition: t(`${p}.successionTypes.leadership_transition`),
          knowledge_handover: t(`${p}.successionTypes.knowledge_handover`),
          responsibility_mapping: t(`${p}.successionTypes.responsibility_mapping`),
          executive_onboarding: t(`${p}.successionTypes.executive_onboarding`),
        },
        successionStatuses: {
          pending: t(`${p}.successionStatuses.pending`),
          in_progress: t(`${p}.successionStatuses.in_progress`),
          completed: t(`${p}.successionStatuses.completed`),
        },
        healthLabels: {
          exceptional: t(`${p}.healthLabels.exceptional`),
          strong: t(`${p}.healthLabels.strong`),
          stable: t(`${p}.healthLabels.stable`),
          developing: t(`${p}.healthLabels.developing`),
          vulnerable: t(`${p}.healthLabels.vulnerable`),
        },
        timelineTypes: {
          leadership_transition: t(`${p}.timelineTypes.leadership_transition`),
          knowledge_preservation: t(`${p}.timelineTypes.knowledge_preservation`),
          operational_milestone: t(`${p}.timelineTypes.operational_milestone`),
          strategic_reaffirmation: t(`${p}.timelineTypes.strategic_reaffirmation`),
          cultural_continuity: t(`${p}.timelineTypes.cultural_continuity`),
        },
        reviewTypes: {
          quarterly_continuity: t(`${p}.reviewTypes.quarterly_continuity`),
          annual_succession: t(`${p}.reviewTypes.annual_succession`),
          knowledge_preservation: t(`${p}.reviewTypes.knowledge_preservation`),
          executive_preparedness: t(`${p}.reviewTypes.executive_preparedness`),
        },
        sessionTypes: {
          succession_discussion: t(`${p}.sessionTypes.succession_discussion`),
          knowledge_transfer: t(`${p}.sessionTypes.knowledge_transfer`),
          preparedness_assessment: t(`${p}.sessionTypes.preparedness_assessment`),
        },
        metrics: {
          leadership: t(`${p}.metrics.leadership`),
          knowledge: t(`${p}.metrics.knowledge`),
          operational: t(`${p}.metrics.operational`),
          strategic: t(`${p}.metrics.strategic`),
          succession: t(`${p}.metrics.succession`),
          documentation: t(`${p}.metrics.documentation`),
          dependencies: t(`${p}.metrics.dependencies`),
          confidence: t(`${p}.metrics.confidence`),
        },
        executiveFields: {
          leadership: t(`${p}.executiveFields.leadership`),
          consistency: t(`${p}.executiveFields.consistency`),
          knowledge: t(`${p}.executiveFields.knowledge`),
          opportunities: t(`${p}.executiveFields.opportunities`),
        },
      }}
    />
  );
}
