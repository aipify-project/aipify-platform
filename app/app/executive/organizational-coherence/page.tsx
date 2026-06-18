import { OrganizationalCoherenceCenterPanel } from "@/components/app/organizational-coherence-center";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalCoherenceCenterPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalCoherenceCenter";

  return (
    <OrganizationalCoherenceCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalFuturesLink: t(`${p}.organizationalFuturesLink`),
        organizationalMomentumLink: t(`${p}.organizationalMomentumLink`),
        organizationalTrustLink: t(`${p}.organizationalTrustLink`),
        organizationalPurposeLink: t(`${p}.organizationalPurposeLink`),
        organizationalStewardshipLink: t(`${p}.organizationalStewardshipLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        fragmentationTitle: t(`${p}.fragmentationTitle`),
        alignmentTitle: t(`${p}.alignmentTitle`),
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
        addressSignal: t(`${p}.addressSignal`),
        generateReport: t(`${p}.generateReport`),
        printSummary: t(`${p}.printSummary`),
        exportSnapshot: t(`${p}.exportSnapshot`),
        coordinateDiscussion: t(`${p}.coordinateDiscussion`),
        archiveMilestone: t(`${p}.archiveMilestone`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        coherenceScore: t(`${p}.coherenceScore`),
        domains: {
          vision: t(`${p}.domains.vision`),
          values: t(`${p}.domains.values`),
          execution: t(`${p}.domains.execution`),
          governance: t(`${p}.domains.governance`),
          customer: t(`${p}.domains.customer`),
          leadership: t(`${p}.domains.leadership`),
        },
        signalTypes: {
          conflicting_priorities: t(`${p}.signalTypes.conflicting_priorities`),
          mixed_leadership_signals: t(`${p}.signalTypes.mixed_leadership_signals`),
          competing_initiatives: t(`${p}.signalTypes.competing_initiatives`),
          policy_inconsistencies: t(`${p}.signalTypes.policy_inconsistencies`),
          customer_promise_gaps: t(`${p}.signalTypes.customer_promise_gaps`),
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
        alignmentStatuses: {
          aligned: t(`${p}.alignmentStatuses.aligned`),
          developing: t(`${p}.alignmentStatuses.developing`),
          review: t(`${p}.alignmentStatuses.review`),
        },
        healthLabels: {
          exceptional: t(`${p}.healthLabels.exceptional`),
          strong: t(`${p}.healthLabels.strong`),
          stable: t(`${p}.healthLabels.stable`),
          developing: t(`${p}.healthLabels.developing`),
          fragmented: t(`${p}.healthLabels.fragmented`),
        },
        timelineTypes: {
          strategic_transition: t(`${p}.timelineTypes.strategic_transition`),
          cultural_milestone: t(`${p}.timelineTypes.cultural_milestone`),
          governance_improvement: t(`${p}.timelineTypes.governance_improvement`),
          leadership_reflection: t(`${p}.timelineTypes.leadership_reflection`),
          alignment_achievement: t(`${p}.timelineTypes.alignment_achievement`),
        },
        reviewTypes: {
          quarterly_coherence: t(`${p}.reviewTypes.quarterly_coherence`),
          executive_reflection: t(`${p}.reviewTypes.executive_reflection`),
          strategic_alignment: t(`${p}.reviewTypes.strategic_alignment`),
          annual_assessment: t(`${p}.reviewTypes.annual_assessment`),
        },
        sessionTypes: {
          leadership_workshop: t(`${p}.sessionTypes.leadership_workshop`),
          executive_reflection: t(`${p}.sessionTypes.executive_reflection`),
          cross_functional_discussion: t(`${p}.sessionTypes.cross_functional_discussion`),
        },
        metrics: {
          consistency: t(`${p}.metrics.consistency`),
          alignment: t(`${p}.metrics.alignment`),
          vision: t(`${p}.metrics.vision`),
          values: t(`${p}.metrics.values`),
          governance: t(`${p}.metrics.governance`),
          initiatives: t(`${p}.metrics.initiatives`),
          fragmentation: t(`${p}.metrics.fragmentation`),
          confidence: t(`${p}.metrics.confidence`),
        },
        executiveFields: {
          leadership: t(`${p}.executiveFields.leadership`),
          consistency: t(`${p}.executiveFields.consistency`),
          integrity: t(`${p}.executiveFields.integrity`),
          opportunities: t(`${p}.executiveFields.opportunities`),
        },
      }}
    />
  );
}
