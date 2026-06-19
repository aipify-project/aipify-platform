import { LearningCenterPanel } from "@/components/app/organizational-learning-operations";
import { buildOrganizationalLearningLabels } from "@/lib/customer-organizational-learning-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function LearningCenterPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "organizationalLearningOperations");
  const labels = buildOrganizationalLearningLabels(createTranslator(dict));
  return <LearningCenterPanel backHref="/app" labels={labels} />;
}
