import { AutomationCenterPanel } from "@/components/app/adaptive-automation/AutomationCenterPanel";
import { AUTOMATION_RISK_LEVELS, AUTOMATION_STATUSES } from "@/lib/aipify/adaptive-automation";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AutomationsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  const riskLevels = Object.fromEntries(
    AUTOMATION_RISK_LEVELS.map((r) => [r, t(`customerApp.automation.risk.${r}`)])
  );
  const statuses = Object.fromEntries(
    AUTOMATION_STATUSES.map((s) => [s, t(`customerApp.automation.statuses.${s}`)])
  );

  return (
    <AutomationCenterPanel
      labels={{
        title: t("customerApp.automation.center.title"),
        subtitle: t("customerApp.automation.center.subtitle"),
        loading: t("customerApp.automation.center.loading"),
        back: t("customerApp.automation.center.back"),
        privacy: t("customerApp.automation.center.privacy"),
        upgradeTitle: t("customerApp.automation.center.upgrade.title"),
        upgradeBody: t("customerApp.automation.center.upgrade.body"),
        upgradeCta: t("customerApp.automation.center.upgrade.cta"),
        refresh: t("customerApp.automation.center.refresh"),
        notEnabledTitle: t("customerApp.automation.center.notEnabled.title"),
        notEnabledBody: t("customerApp.automation.center.notEnabled.body"),
        enableCta: t("customerApp.automation.center.notEnabled.cta"),
        metrics: {
          active: t("customerApp.automation.metrics.active"),
          drafts: t("customerApp.automation.metrics.drafts"),
          suggestions: t("customerApp.automation.metrics.newSuggestions"),
          timeSaved: t("customerApp.automation.metrics.timeSaved"),
          approvals: t("customerApp.automation.metrics.approvals"),
        },
        sections: {
          automations: t("customerApp.automation.sections.automations"),
          suggestions: t("customerApp.automation.sections.suggestions"),
          approvals: t("customerApp.automation.sections.approvals"),
        },
        riskLevels,
        statuses,
        suggestionActions: {
          createDraft: t("customerApp.automation.suggestion.createDraft"),
          dismiss: t("customerApp.automation.suggestion.dismiss"),
          snooze: t("customerApp.automation.suggestion.snooze"),
        },
        automationActions: {
          enable: t("customerApp.automation.actions.enable"),
          pause: t("customerApp.automation.actions.pause"),
          test: t("customerApp.automation.actions.test"),
        },
        approvalAction: t("customerApp.automation.approval.approve"),
        emptySuggestions: t("customerApp.automation.suggestions.empty"),
        emptyAutomations: t("customerApp.automation.automations.empty"),
        links: {
          library: t("customerApp.automation.links.library"),
          executions: t("customerApp.automation.links.executions"),
          settings: t("customerApp.automation.links.settings"),
        },
      }}
    />
  );
}
