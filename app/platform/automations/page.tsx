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
        lastSuccess: t("platform.automations.lastSuccess"),
        totalExecutions: t("platform.automations.totalExecutions"),
        failureCount: t("platform.automations.failureCount"),
        avgExecution: t("platform.automations.avgExecution"),
        view: t("platform.automations.view"),
        pulseLabel: t("branding.pulseLabel"),
        statusLabels: {
          active: t("platform.automations.statusLabels.active"),
          paused: t("platform.automations.statusLabels.paused"),
          warning: t("platform.automations.statusLabels.warning"),
          failed: t("platform.automations.statusLabels.failed"),
        },
        digest: {
          title: t("platform.automations.digest.title"),
          newCustomers: t("platform.automations.digest.newCustomers"),
          supportRequests: t("platform.automations.digest.supportRequests"),
          aiResolved: t("platform.automations.digest.aiResolved"),
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
        healthDashboard: {
          title: t("platform.automations.healthDashboard.title"),
          total: t("platform.automations.healthDashboard.total"),
          successRate: t("platform.automations.healthDashboard.successRate"),
          avgExecution: t("platform.automations.healthDashboard.avgExecution"),
          warnings: t("platform.automations.healthDashboard.warnings"),
          failures: t("platform.automations.healthDashboard.failures"),
          upcoming: t("platform.automations.healthDashboard.upcoming"),
          needsAttention: t("platform.automations.healthDashboard.needsAttention"),
          statusLabels: {
            active: t("platform.automations.statusLabels.active"),
            paused: t("platform.automations.statusLabels.paused"),
            warning: t("platform.automations.statusLabels.warning"),
            failed: t("platform.automations.statusLabels.failed"),
          },
        },
      }}
    />
  );
}
