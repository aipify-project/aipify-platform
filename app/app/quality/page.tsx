import { QualityDashboardPanel } from "@/components/app/quality";
import { QUALITY_SEVERITIES } from "@/lib/aipify/quality";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function QualityPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  const severityLabels = Object.fromEntries(
    QUALITY_SEVERITIES.map((s) => [s, t(`customerApp.quality.severity.${s}`)])
  );

  return (
    <QualityDashboardPanel
      severityLabels={severityLabels}
      labels={{
        title: t("customerApp.quality.title"),
        subtitle: t("customerApp.quality.subtitle"),
        loading: t("customerApp.quality.loading"),
        empty: t("customerApp.quality.empty"),
        observationMode: t("customerApp.quality.observationMode"),
        runScan: t("customerApp.quality.runScan"),
        incidents: t("customerApp.quality.incidents"),
        reports: t("customerApp.quality.reports"),
        scans: t("customerApp.quality.scans"),
        settings: t("customerApp.quality.settings"),
        openIncidents: t("customerApp.quality.widgets.openIncidents"),
        criticalIncidents: t("customerApp.quality.widgets.criticalIncidents"),
        brokenLinks: t("customerApp.quality.widgets.brokenLinks"),
        failedWorkflows: t("customerApp.quality.widgets.failedWorkflows"),
        integrationHealth: t("customerApp.quality.widgets.integrationHealth"),
        knowledgeGaps: t("customerApp.quality.widgets.knowledgeGaps"),
        recommendedActions: t("customerApp.quality.widgets.recommendedActions"),
        recentIncidents: t("customerApp.quality.recentIncidents"),
        noIncidents: t("customerApp.quality.noIncidents"),
        approvalRequired: t("customerApp.quality.approvalRequired"),
        upgradeBody: t("customerApp.quality.upgrade.body"),
        upgradeCta: t("customerApp.quality.upgrade.cta"),
      }}
    />
  );
}
