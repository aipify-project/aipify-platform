import { OrganizationalHealthCenterPanel } from "@/components/app/organizational-health-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalHealthCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalHealthCenter";

  return (
    <OrganizationalHealthCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        decisionSupportLink: t(`${p}.decisionSupportLink`),
        strategicIntelligenceLink: t(`${p}.strategicIntelligenceLink`),
        continuousImprovementLink: t(`${p}.continuousImprovementLink`),
        organizationalResilienceLink: t(`${p}.organizationalResilienceLink`),
        opportunityDiscoveryLink: t(`${p}.opportunityDiscoveryLink`),
        earlyWarningLink: t(`${p}.earlyWarningLink`),
        workforceInsightsLink: t(`${p}.workforceInsightsLink`),
        organizationalHealthEngineLink: t(`${p}.organizationalHealthEngineLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        domainScoresTitle: t(`${p}.domainScoresTitle`),
        indicatorsTitle: t(`${p}.indicatorsTitle`),
        insightsTitle: t(`${p}.insightsTitle`),
        recommendationsTitle: t(`${p}.recommendationsTitle`),
        earlyWarningsTitle: t(`${p}.earlyWarningsTitle`),
        healthReviewsTitle: t(`${p}.healthReviewsTitle`),
        timelineTitle: t(`${p}.timelineTitle`),
        emptySection: t(`${p}.emptySection`),
        overallScore: t(`${p}.overallScore`),
        trend: t(`${p}.trend`),
        dismiss: t(`${p}.dismiss`),
        accept: t(`${p}.accept`),
        acknowledge: t(`${p}.acknowledge`),
        completeReview: t(`${p}.completeReview`),
        generateReport: t(`${p}.generateReport`),
        archiveSnapshot: t(`${p}.archiveSnapshot`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        domains: {
          customer: t(`${p}.domains.customer`),
          workforce: t(`${p}.domains.workforce`),
          operational: t(`${p}.domains.operational`),
          governance: t(`${p}.domains.governance`),
          strategic: t(`${p}.domains.strategic`),
          financial: t(`${p}.domains.financial`),
        },
        healthBands: {
          thriving: t(`${p}.healthBands.thriving`),
          healthy: t(`${p}.healthBands.healthy`),
          stable: t(`${p}.healthBands.stable`),
          needs_attention: t(`${p}.healthBands.needs_attention`),
          critical_review: t(`${p}.healthBands.critical_review`),
        },
        trendDirections: {
          improving: t(`${p}.trendDirections.improving`),
          stable: t(`${p}.trendDirections.stable`),
          declining: t(`${p}.trendDirections.declining`),
          seasonal: t(`${p}.trendDirections.seasonal`),
          recovering: t(`${p}.trendDirections.recovering`),
        },
        reviewTypes: {
          monthly: t(`${p}.reviewTypes.monthly`),
          quarterly: t(`${p}.reviewTypes.quarterly`),
          annual: t(`${p}.reviewTypes.annual`),
          leadership_reflection: t(`${p}.reviewTypes.leadership_reflection`),
        },
        metrics: {
          improving: t(`${p}.metrics.improving`),
          needsAttention: t(`${p}.metrics.needsAttention`),
          openWarnings: t(`${p}.metrics.openWarnings`),
          reviewsPending: t(`${p}.metrics.reviewsPending`),
          confidence: t(`${p}.metrics.confidence`),
          reviewCompletion: t(`${p}.metrics.reviewCompletion`),
          usefulness: t(`${p}.metrics.usefulness`),
          satisfaction: t(`${p}.metrics.satisfaction`),
        },
      }}
    />
  );
}
