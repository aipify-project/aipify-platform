import { ExpertisePanel } from "@/components/app/expertise-operations";
import { buildExpertiseLabels } from "@/lib/customer-expertise-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ExpertisePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "expertiseOperations");
  const labels = buildExpertiseLabels(createTranslator(dict));
  return <ExpertisePanel backHref="/app" labels={labels} />;
}
