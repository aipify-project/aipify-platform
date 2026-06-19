import { AiWorkforcePanel } from "@/components/app/workforce-operations";
import { buildAiWorkforceLabels } from "@/lib/customer-workforce-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function DigitalEmployeeRegistryPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "aiWorkforceOperations");
  const labels = buildAiWorkforceLabels(createTranslator(dict));
  return (
    <AiWorkforcePanel
      backHref="/app/workforce"
      initialTab="employees"
      visibleTabs={["overview", "employees", "departments", "assignments", "performance", "governance"]}
      titleOverride={labels.employeesPage.title}
      subtitleOverride={labels.employeesPage.subtitle}
      labels={labels}
    />
  );
}
