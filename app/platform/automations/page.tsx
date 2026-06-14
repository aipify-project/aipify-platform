import PlatformAutomationsPanel from "@/components/platform/PlatformAutomationsPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformAutomationsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform", "branding"]);
  const t = createTranslator(dict);

  return (
    <PlatformAutomationsPanel
      locale={locale}
      labels={{
        title: t("platform.automations.title"),
        subtitle: t("platform.automations.subtitle"),
        loading: t("platform.automations.loading"),
        empty: t("platform.automations.empty"),
        name: t("platform.automations.name"),
        status: t("platform.automations.status"),
        trigger: t("platform.automations.trigger"),
        lastRun: t("platform.automations.lastRun"),
        nextRun: t("platform.automations.nextRun"),
        actions: t("platform.automations.actions"),
        healthTitle: t("platform.automations.healthTitle"),
        healthScore: t("platform.automations.healthScore"),
        lastSuccess: t("platform.automations.lastSuccess"),
        totalExecutions: t("platform.automations.totalExecutions"),
        failureCount: t("platform.automations.failureCount"),
        avgExecution: t("platform.automations.avgExecution"),
        runs: t("platform.automations.runs"),
        view: t("platform.automations.view"),
        monitoringNote: t("platform.automations.monitoringNote"),
        pulseLabel: t("branding.pulseLabel"),
        greeting: {
          morning: t("platform.automations.greeting.morning"),
          afternoon: t("platform.automations.greeting.afternoon"),
          evening: t("platform.automations.greeting.evening"),
        },
        executiveSummary: {
          intro: t("platform.automations.executiveSummary.intro"),
          activeAutomations: t("platform.automations.executiveSummary.activeAutomations"),
          needsAttention: t("platform.automations.executiveSummary.needsAttention"),
          selfHealingToday: t("platform.automations.executiveSummary.selfHealingToday"),
          platformHealth: t("platform.automations.executiveSummary.platformHealth"),
        },
        insight: {
          title: t("platform.automations.insight.title"),
          healthy: t("platform.automations.insight.healthy"),
          needsAttention: t("platform.automations.insight.needsAttention"),
          critical: t("platform.automations.insight.critical"),
          improving: t("platform.automations.insight.improving"),
          healthyWithFocus: t("platform.automations.insight.healthyWithFocus"),
          criticalWithFocus: t("platform.automations.insight.criticalWithFocus"),
          needsAttentionWithFocus: t("platform.automations.insight.needsAttentionWithFocus"),
        },
        healthBands: {
          healthy: t("platform.automations.healthBands.healthy"),
          needs_attention: t("platform.automations.healthBands.needs_attention"),
          at_risk: t("platform.automations.healthBands.at_risk"),
          critical: t("platform.automations.healthBands.critical"),
        },
        insightStates: {
          healthy: t("platform.automations.insightStates.healthy"),
          needs_attention: t("platform.automations.insightStates.needs_attention"),
          critical: t("platform.automations.insightStates.critical"),
          improving: t("platform.automations.insightStates.improving"),
        },
        filters: {
          all: t("platform.automations.filters.all"),
          active: t("platform.automations.filters.active"),
          warning: t("platform.automations.filters.warning"),
          failed: t("platform.automations.filters.failed"),
          self_healing: t("platform.automations.filters.self_healing"),
          admin_approved: t("platform.automations.filters.admin_approved"),
        },
        searchPlaceholder: t("platform.automations.searchPlaceholder"),
        emptyHealthy: t("platform.automations.emptyHealthy"),
        actionButtons: {
          review: t("platform.automations.actionButtons.review"),
          runNow: t("platform.automations.actionButtons.runNow"),
          pause: t("platform.automations.actionButtons.pause"),
          viewHistory: t("platform.automations.actionButtons.viewHistory"),
          testRecovery: t("platform.automations.actionButtons.testRecovery"),
          viewLogs: t("platform.automations.actionButtons.viewLogs"),
          disable: t("platform.automations.actionButtons.disable"),
        },
        statusLabels: {
          active: t("platform.automations.statusLabels.active"),
          paused: t("platform.automations.statusLabels.paused"),
          warning: t("platform.automations.statusLabels.warning"),
          failed: t("platform.automations.statusLabels.failed"),
          running: t("platform.automations.statusLabels.running"),
          self_healing: t("platform.automations.statusLabels.self_healing"),
          admin_approved: t("platform.automations.statusLabels.admin_approved"),
        },
        digest: {
          title: t("platform.automations.digest.title"),
          newCustomers: t("platform.automations.digest.newCustomers"),
          supportRequests: t("platform.automations.digest.supportRequests"),
          aipifyResolved: t("platform.automations.digest.aipifyResolved"),
          revenueGrowth: t("platform.automations.digest.revenueGrowth"),
          supportEscalations: t("platform.automations.digest.supportEscalations"),
          trialsExpiring: t("platform.automations.digest.trialsExpiring"),
          recommendations: t("platform.automations.digest.recommendations"),
        },
        categories: {
          ai_generated: t("platform.automations.categories.aiGenerated"),
          admin_approved: t("platform.automations.categories.adminApproved"),
          self_healing: t("platform.automations.categories.selfHealing"),
        },
      }}
    />
  );
}
