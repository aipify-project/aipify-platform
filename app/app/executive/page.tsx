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
      }}
    />
  );
}
