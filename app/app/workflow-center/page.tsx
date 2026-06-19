import { WorkflowProcessPanel } from "@/components/app/workflow-process-operations";
import { buildWorkflowProcessLabels } from "@/lib/customer-workflow-process-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function WorkflowCenterPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "workflowProcessOperations");
  const labels = buildWorkflowProcessLabels(createTranslator(dict));
  return <WorkflowProcessPanel backHref="/app" labels={labels} />;
}
