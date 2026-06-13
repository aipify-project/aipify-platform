import { OrganizationalResilienceCenterPanel } from "@/components/app/organizational-resilience-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalResilienceCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalResilienceCenter";

  return (
    <OrganizationalResilienceCenterPanel
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
        resilienceEngineLink: t(`${p}.resilienceEngineLink`),
        continuityLink: t(`${p}.continuityLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        scoreDimensionsTitle: t(`${p}.scoreDimensionsTitle`),
        dependenciesTitle: t(`${p}.dependenciesTitle`),
        reviewsTitle: t(`${p}.reviewsTitle`),
        scenariosTitle: t(`${p}.scenariosTitle`),
        insightsTitle: t(`${p}.insightsTitle`),
        recommendationsTitle: t(`${p}.recommendationsTitle`),
        executiveReviewsTitle: t(`${p}.executiveReviewsTitle`),
        emptySection: t(`${p}.emptySection`),
        domain: t(`${p}.domain`),
        severity: t(`${p}.severity`),
        reviewState: t(`${p}.reviewState`),
        readiness: t(`${p}.readiness`),
        dismiss: t(`${p}.dismiss`),
        accept: t(`${p}.accept`),
        acknowledge: t(`${p}.acknowledge`),
        completeReview: t(`${p}.completeReview`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        domains: {
          operational: t(`${p}.domains.operational`),
          technical: t(`${p}.domains.technical`),
          workforce: t(`${p}.domains.workforce`),
          customer: t(`${p}.domains.customer`),
          executive: t(`${p}.domains.executive`),
        },
        scoreLevels: {
          excellent: t(`${p}.scoreLevels.excellent`),
          strong: t(`${p}.scoreLevels.strong`),
          moderate: t(`${p}.scoreLevels.moderate`),
          needs_improvement: t(`${p}.scoreLevels.needs_improvement`),
        },
        reviewStates: {
          current: t(`${p}.reviewStates.current`),
          review_recommended: t(`${p}.reviewStates.review_recommended`),
          attention_needed: t(`${p}.reviewStates.attention_needed`),
          critical: t(`${p}.reviewStates.critical`),
        },
        readinessLevels: {
          prepared: t(`${p}.readinessLevels.prepared`),
          moderate: t(`${p}.readinessLevels.moderate`),
          needs_planning: t(`${p}.readinessLevels.needs_planning`),
        },
        reviewTypes: {
          quarterly: t(`${p}.reviewTypes.quarterly`),
          annual: t(`${p}.reviewTypes.annual`),
          leadership_continuity: t(`${p}.reviewTypes.leadership_continuity`),
          recovery_capability: t(`${p}.reviewTypes.recovery_capability`),
        },
        metrics: {
          resilienceScore: t(`${p}.metrics.resilienceScore`),
          resilienceLabel: t(`${p}.metrics.resilienceLabel`),
          criticalDependencies: t(`${p}.metrics.criticalDependencies`),
          reviewsCompleted: t(`${p}.metrics.reviewsCompleted`),
          reviewsPending: t(`${p}.metrics.reviewsPending`),
          recoveryCapability: t(`${p}.metrics.recoveryCapability`),
          executiveConfidence: t(`${p}.metrics.executiveConfidence`),
          companionUsefulness: t(`${p}.metrics.companionUsefulness`),
        },
        dimensions: {
          knowledge: t(`${p}.dimensions.knowledge`),
          operational: t(`${p}.dimensions.operational`),
          workforce: t(`${p}.dimensions.workforce`),
          technical: t(`${p}.dimensions.technical`),
          governance: t(`${p}.dimensions.governance`),
        },
      }}
    />
  );
}
