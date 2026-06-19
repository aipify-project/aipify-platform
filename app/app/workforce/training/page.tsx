import { AiWorkforcePanel } from "@/components/app/workforce-operations";
import { buildAiWorkforceLabels } from "@/lib/customer-workforce-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function WorkforceTrainingPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "aiWorkforceOperations");
  const labels = buildAiWorkforceLabels(createTranslator(dict));
  return (
    <AiWorkforcePanel
      backHref="/app/workforce"
      initialTab="training"
      visibleTabs={["overview", "training", "employees", "performance", "governance"]}
      titleOverride={labels.trainingPage.title}
      subtitleOverride={labels.trainingPage.subtitle}
      labels={labels}
    />
  );
}
