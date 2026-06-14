import { ExecutiveDashboardPanel } from "@/components/app/executive/ExecutiveDashboardPanel";
import type { HealthScoreBand } from "@/lib/app/customer-app";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ExecutivePage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp", "branding"]);
  const t = createTranslator(dict);

  return (
    <ExecutiveDashboardPanel
      locale={locale}
      labels={{
        title: t("customerApp.executive.title"),
        subtitle: t("customerApp.executive.subtitle"),
        loading: t("customerApp.executive.loading"),
        empty: t("customerApp.executive.empty"),
        pulseLabel: t("branding.pulseLabel"),
        healthTitle: t("customerApp.executive.healthTitle"),
        healthBands: {
          excellent: t("customerApp.home.healthBands.excellent"),
          healthy: t("customerApp.home.healthBands.healthy"),
          needs_attention: t("customerApp.home.healthBands.needs_attention"),
          action_recommended: t("customerApp.home.healthBands.action_recommended"),
        } as Record<HealthScoreBand, string>,
        sections: {
          summary: t("customerApp.executive.sections.summary"),
          activity: t("customerApp.executive.sections.activity"),
          recommendations: t("customerApp.executive.sections.recommendations"),
          approvals: t("customerApp.executive.sections.approvals"),
          skills: t("customerApp.executive.sections.skills"),
          installations: t("customerApp.executive.sections.installations"),
          quickActions: t("customerApp.executive.sections.quickActions"),
        },
        noActivity: t("customerApp.executive.noActivity"),
        installationsHealthy: t("customerApp.executive.installationsHealthy"),
        viewApprovals: t("customerApp.executive.viewApprovals"),
        decisionSupportLink: t("customerApp.executive.decisionSupportLink"),
        strategicIntelligenceLink: t("customerApp.executive.strategicIntelligenceLink"),
        continuousImprovementLink: t("customerApp.executive.continuousImprovementLink"),
        organizationalResilienceLink: t("customerApp.executive.organizationalResilienceLink"),
        opportunityDiscoveryLink: t("customerApp.executive.opportunityDiscoveryLink"),
        organizationalHealthLink: t("customerApp.executive.organizationalHealthLink"),
        changeManagementLink: t("customerApp.executive.changeManagementLink"),
        organizationalDigitalTwinLink: t("customerApp.executive.organizationalDigitalTwinLink"),
        capabilityMaturityLink: t("customerApp.executive.capabilityMaturityLink"),
        executionExcellenceLink: t("customerApp.executive.executionExcellenceLink"),
        organizationalAlignmentLink: t("customerApp.executive.organizationalAlignmentLink"),
        organizationalFocusLink: t("customerApp.executive.organizationalFocusLink"),
        organizationalEnergyLink: t("customerApp.executive.organizationalEnergyLink"),
        organizationalAdaptabilityLink: t("customerApp.executive.organizationalAdaptabilityLink"),
        organizationalWisdomLink: t("customerApp.executive.organizationalWisdomLink"),
        organizationalLegacyLink: t("customerApp.executive.organizationalLegacyLink"),
        organizationalPurposeLink: t("customerApp.executive.organizationalPurposeLink"),
        organizationalStewardshipLink: t("customerApp.executive.organizationalStewardshipLink"),
        organizationalSimplicityLink: t("customerApp.executive.organizationalSimplicityLink"),
        organizationalTrustLink: t("customerApp.executive.organizationalTrustLink"),
        organizationalMomentumLink: t("customerApp.executive.organizationalMomentumLink"),
        organizationalFuturesLink: t("customerApp.executive.organizationalFuturesLink"),
        organizationalCoherenceLink: t("customerApp.executive.organizationalCoherenceLink"),
        organizationalContinuityLink: t("customerApp.executive.organizationalContinuityLink"),
        organizationalExcellenceLink: t("customerApp.executive.organizationalExcellenceLink"),
        organizationalImpactLink: t("customerApp.executive.organizationalImpactLink"),
        organizationalDecisionQualityLink: t("customerApp.executive.organizationalDecisionQualityLink"),
        organizationalConfidenceLink: t("customerApp.executive.organizationalConfidenceLink"),
        organizationalFlourishingLink: t("customerApp.executive.organizationalFlourishingLink"),
        organizationalRenewalLink: t("customerApp.executive.organizationalRenewalLink"),
        organizationalSustainabilityLink: t("customerApp.executive.organizationalSustainabilityLink"),
        organizationalTransformationLink: t("customerApp.executive.organizationalTransformationLink"),
        organizationalCompoundingLink: t("customerApp.executive.organizationalCompoundingLink"),
        organizationalSteadfastnessLink: t("customerApp.executive.organizationalSteadfastnessLink"),
        organizationalClarityLink: t("customerApp.executive.organizationalClarityLink"),
        organizationalIntentionalityLink: t("customerApp.executive.organizationalIntentionalityLink"),
        organizationalAwarenessLink: t("customerApp.executive.organizationalAwarenessLink"),
        organizationalHarmonyLink: t("customerApp.executive.organizationalHarmonyLink"),
        organizationalCuriosityLink: t("customerApp.executive.organizationalCuriosityLink"),
        organizationalCourageLink: t("customerApp.executive.organizationalCourageLink"),
      }}
    />
  );
}
