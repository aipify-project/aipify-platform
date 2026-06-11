import { WorkflowsPanel } from "@/components/app/organizational-intelligence/WorkflowsPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function WorkflowsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  return (
    <WorkflowsPanel
      labels={{
        title: t("customerApp.workflows.title"),
        subtitle: t("customerApp.workflows.subtitle"),
        loading: t("customerApp.workflows.loading"),
        back: t("customerApp.workflows.back"),
        empty: t("customerApp.workflows.empty"),
        addWorkflow: t("customerApp.workflows.addWorkflow"),
        name: t("customerApp.workflows.name"),
        key: t("customerApp.workflows.key"),
        category: t("customerApp.workflows.category"),
        responseTime: t("customerApp.workflows.responseTime"),
        openItems: t("customerApp.workflows.openItems"),
        insightsLink: t("customerApp.workflows.insightsLink"),
      }}
    />
  );
}
