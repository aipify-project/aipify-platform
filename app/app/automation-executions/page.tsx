import { AutomationExecutionsPanel } from "@/components/app/adaptive-automation/AutomationExecutionsPanel";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AutomationExecutionsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);

  return (
    <AutomationExecutionsPanel
      labels={{
        title: t("customerApp.automation.executions.title"),
        subtitle: t("customerApp.automation.executions.subtitle"),
        loading: t("customerApp.automation.executions.loading"),
        back: t("customerApp.automation.executions.back"),
        empty: t("customerApp.automation.executions.empty"),
        statuses: {
          success: t("customerApp.automation.executionStatuses.success"),
          failed: t("customerApp.automation.executionStatuses.failed"),
          running: t("customerApp.automation.executionStatuses.running"),
          waiting_approval: t("customerApp.automation.executionStatuses.waiting_approval"),
          partial_success: t("customerApp.automation.executionStatuses.partial_success"),
          skipped: t("customerApp.automation.executionStatuses.skipped"),
          queued: t("customerApp.automation.executionStatuses.queued"),
        },
      }}
    />
  );
}
