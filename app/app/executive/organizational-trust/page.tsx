import { OrganizationalTrustCenterPanel } from "@/components/app/organizational-trust-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalTrustCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalTrustCenter";

  return (
    <OrganizationalTrustCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalStewardshipLink: t(`${p}.organizationalStewardshipLink`),
        organizationalSimplicityLink: t(`${p}.organizationalSimplicityLink`),
        organizationalPurposeLink: t(`${p}.organizationalPurposeLink`),
        trustTransparencyLink: t(`${p}.trustTransparencyLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        signalsTitle: t(`${p}.signalsTitle`),
        accountabilityTitle: t(`${p}.accountabilityTitle`),
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
        scheduleSession: t(`${p}.scheduleSession`),
        fulfillCommitment: t(`${p}.fulfillCommitment`),
        generateSummary: t(`${p}.generateSummary`),
        printReport: t(`${p}.printReport`),
        exportSnapshot: t(`${p}.exportSnapshot`),
        coordinateReview: t(`${p}.coordinateReview`),
        archiveMilestone: t(`${p}.archiveMilestone`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        trustScore: t(`${p}.trustScore`),
        domains: {
          leadership: t(`${p}.domains.leadership`),
          team: t(`${p}.domains.team`),
          customer: t(`${p}.domains.customer`),
          partner: t(`${p}.domains.partner`),
          organizational: t(`${p}.domains.organizational`),
        },
        signalTypes: {
          follow_through: t(`${p}.signalTypes.follow_through`),
          communication_gap: t(`${p}.signalTypes.communication_gap`),
          governance_reliability: t(`${p}.signalTypes.governance_reliability`),
          service_consistency: t(`${p}.signalTypes.service_consistency`),
          accountability_pattern: t(`${p}.signalTypes.accountability_pattern`),
        },
        signalTones: {
          positive: t(`${p}.signalTones.positive`),
          neutral: t(`${p}.signalTones.neutral`),
          attention: t(`${p}.signalTones.attention`),
        },
        commitmentStatuses: {
          open: t(`${p}.commitmentStatuses.open`),
          fulfilled: t(`${p}.commitmentStatuses.fulfilled`),
          review: t(`${p}.commitmentStatuses.review`),
        },
        healthLabels: {
          exceptional: t(`${p}.healthLabels.exceptional`),
          strong: t(`${p}.healthLabels.strong`),
          developing: t(`${p}.healthLabels.developing`),
          needs_attention: t(`${p}.healthLabels.needs_attention`),
          fragile: t(`${p}.healthLabels.fragile`),
        },
        timelineTypes: {
          commitment_fulfilled: t(`${p}.timelineTypes.commitment_fulfilled`),
          recovery_effort: t(`${p}.timelineTypes.recovery_effort`),
          governance_improvement: t(`${p}.timelineTypes.governance_improvement`),
          customer_trust_milestone: t(`${p}.timelineTypes.customer_trust_milestone`),
          leadership_reflection: t(`${p}.timelineTypes.leadership_reflection`),
        },
        reviewTypes: {
          quarterly_trust: t(`${p}.reviewTypes.quarterly_trust`),
          leadership_reflection: t(`${p}.reviewTypes.leadership_reflection`),
          customer_trust: t(`${p}.reviewTypes.customer_trust`),
          governance_transparency: t(`${p}.reviewTypes.governance_transparency`),
        },
        sessionTypes: {
          leadership_reflection: t(`${p}.sessionTypes.leadership_reflection`),
          leadership_review: t(`${p}.sessionTypes.leadership_review`),
          customer_trust_discussion: t(`${p}.sessionTypes.customer_trust_discussion`),
        },
        metrics: {
          trend: t(`${p}.metrics.trend`),
          reliability: t(`${p}.metrics.reliability`),
          accountability: t(`${p}.metrics.accountability`),
          fulfillment: t(`${p}.metrics.fulfillment`),
          communication: t(`${p}.metrics.communication`),
          transparency: t(`${p}.metrics.transparency`),
          openCommitments: t(`${p}.metrics.openCommitments`),
          confidence: t(`${p}.metrics.confidence`),
        },
        executiveFields: {
          consistency: t(`${p}.executiveFields.consistency`),
          reliability: t(`${p}.executiveFields.reliability`),
          governance: t(`${p}.executiveFields.governance`),
          stakeholders: t(`${p}.executiveFields.stakeholders`),
        },
      }}
    />
  );
}
