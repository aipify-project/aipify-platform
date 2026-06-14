import { PlatformObservabilityCenterPanel } from "@/components/app/platform-observability-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformObservabilityCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.platformObservabilityCenter";

  return (
    <PlatformObservabilityCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        operationsLink: t(`${p}.operationsLink`),
        deploymentsLink: t(`${p}.deploymentsLink`),
        databaseGovernanceLink: t(`${p}.databaseGovernanceLink`),
        automationControlLink: t(`${p}.automationControlLink`),
        executiveLink: t(`${p}.executiveLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        domainsTitle: t(`${p}.domainsTitle`),
        servicesTitle: t(`${p}.servicesTitle`),
        alertsTitle: t(`${p}.alertsTitle`),
        correlationsTitle: t(`${p}.correlationsTitle`),
        investigationsTitle: t(`${p}.investigationsTitle`),
        feedsTitle: t(`${p}.feedsTitle`),
        insightsTitle: t(`${p}.insightsTitle`),
        recommendationsTitle: t(`${p}.recommendationsTitle`),
        executiveTitle: t(`${p}.executiveTitle`),
        reviewsTitle: t(`${p}.reviewsTitle`),
        emptySection: t(`${p}.emptySection`),
        healthScore: t(`${p}.healthScore`),
        dismiss: t(`${p}.dismiss`),
        accept: t(`${p}.accept`),
        acknowledge: t(`${p}.acknowledge`),
        resolve: t(`${p}.resolve`),
        investigate: t(`${p}.investigate`),
        completeInvestigation: t(`${p}.completeInvestigation`),
        completeReview: t(`${p}.completeReview`),
        generateReport: t(`${p}.generateReport`),
        generateSummary: t(`${p}.generateSummary`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        healthBands: {
          thriving: t(`${p}.healthBands.thriving`),
          healthy: t(`${p}.healthBands.healthy`),
          stable: t(`${p}.healthBands.stable`),
          attention_required: t(`${p}.healthBands.attention_required`),
          critical: t(`${p}.healthBands.critical`),
        },
        alertSeverities: {
          informational: t(`${p}.alertSeverities.informational`),
          minor: t(`${p}.alertSeverities.minor`),
          moderate: t(`${p}.alertSeverities.moderate`),
          high: t(`${p}.alertSeverities.high`),
          critical: t(`${p}.alertSeverities.critical`),
        },
        domains: {
          application: t(`${p}.domains.application`),
          user_experience: t(`${p}.domains.user_experience`),
          automation: t(`${p}.domains.automation`),
          integration: t(`${p}.domains.integration`),
          companion: t(`${p}.domains.companion`),
        },
        feedTypes: {
          platform_activity: t(`${p}.feedTypes.platform_activity`),
          integration_status: t(`${p}.feedTypes.integration_status`),
          self_healing: t(`${p}.feedTypes.self_healing`),
          automation_outcome: t(`${p}.feedTypes.automation_outcome`),
          deployment_update: t(`${p}.feedTypes.deployment_update`),
        },
        metrics: {
          criticalAlerts: t(`${p}.metrics.criticalAlerts`),
          openAlerts: t(`${p}.metrics.openAlerts`),
          availability: t(`${p}.metrics.availability`),
          selfHealing: t(`${p}.metrics.selfHealing`),
          mttr: t(`${p}.metrics.mttr`),
          detection: t(`${p}.metrics.detection`),
          alertUsefulness: t(`${p}.metrics.alertUsefulness`),
          confidence: t(`${p}.metrics.confidence`),
        },
        executiveFields: {
          impact: t(`${p}.executiveFields.impact`),
          reliability: t(`${p}.executiveFields.reliability`),
          maturity: t(`${p}.executiveFields.maturity`),
          experience: t(`${p}.executiveFields.experience`),
          strategy: t(`${p}.executiveFields.strategy`),
        },
      }}
    />
  );
}
