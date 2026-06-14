import { ActionCenterPanel } from "@/components/app/action-center/ActionCenterPanel";
import { buildActionImpactLabels } from "@/lib/action-center-impact";
import { ACTION_STATUSES, EXECUTION_LEVELS, RISK_LEVELS } from "@/lib/aipify/execution";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ActionCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  const riskLabels = Object.fromEntries(
    RISK_LEVELS.map((level) => [level, t(`customerApp.actionCenter.riskLevels.${level}`)])
  );
  const statusLabels = Object.fromEntries(
    ACTION_STATUSES.map((status) => [status, t(`customerApp.actionCenter.statusLabels.${status}`)])
  );
  const executionLabels = Object.fromEntries(
    EXECUTION_LEVELS.map((level) => [level, t(`customerApp.actionCenter.executionLevels.${level}`)])
  );

  return (
    <ActionCenterPanel
      labels={{
        title: t("customerApp.actionCenter.title"),
        subtitle: t("customerApp.actionCenter.subtitle"),
        loading: t("customerApp.actionCenter.loading"),
        back: t("customerApp.actionCenter.back"),
        empty: t("customerApp.actionCenter.empty"),
        youControl: t("customerApp.actionCenter.youControl"),
        privacy: t("customerApp.actionCenter.privacy"),
        upgradeTitle: t("customerApp.actionCenter.upgrade.title"),
        upgradeBody: t("customerApp.actionCenter.upgrade.body"),
        upgradeCta: t("customerApp.actionCenter.upgrade.cta"),
        viewApprovals: t("customerApp.actionCenter.viewApprovals"),
        createDemo: t("customerApp.actionCenter.createDemo"),
        sections: {
          overview: t("customerApp.actionCenter.sections.overview"),
          pending: t("customerApp.actionCenter.sections.pending"),
          executed: t("customerApp.actionCenter.sections.executed"),
          rules: t("customerApp.actionCenter.sections.rules"),
          audit: t("customerApp.actionCenter.sections.audit"),
          ethics: t("customerApp.actionCenter.sections.ethics"),
          blocked: t("customerApp.actionCenter.sections.blocked"),
        },
        counts: {
          pending: t("customerApp.actionCenter.counts.pending"),
          approved: t("customerApp.actionCenter.counts.approved"),
          executed: t("customerApp.actionCenter.counts.executed"),
          rejected: t("customerApp.actionCenter.counts.rejected"),
          failed: t("customerApp.actionCenter.counts.failed"),
          scheduled: t("customerApp.actionCenter.counts.scheduled"),
          blocked: t("customerApp.actionCenter.counts.blocked"),
        },
        actions: {
          approve: t("customerApp.actionCenter.actions.approve"),
          reject: t("customerApp.actionCenter.actions.reject"),
          execute: t("customerApp.actionCenter.actions.execute"),
          schedule: t("customerApp.actionCenter.actions.schedule"),
          cancel: t("customerApp.actionCenter.actions.cancel"),
          view: t("customerApp.actionCenter.actions.view"),
          review: t("customerApp.actionCenter.actions.review"),
        },
        riskLevels: riskLabels,
        statusLabels,
        executionLevels: executionLabels,
        detail: {
          back: t("customerApp.actionCenter.detail.back"),
          explanation: t("customerApp.actionCenter.detail.explanation"),
          impact: t("customerApp.actionCenter.detail.impact"),
          preview: t("customerApp.actionCenter.detail.preview"),
          safety: t("customerApp.actionCenter.detail.safety"),
          history: t("customerApp.actionCenter.detail.history"),
        },
      }}
      impactLabels={buildActionImpactLabels(t)}
    />
  );
}
