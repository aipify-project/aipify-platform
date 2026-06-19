import { AiWorkforcePanel } from "@/components/app/workforce-operations";
import { buildAiWorkforceLabels } from "@/lib/customer-workforce-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AiWorkforcePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "aiWorkforceOperations");
  return (
    <AiWorkforcePanel backHref="/app" labels={buildAiWorkforceLabels(createTranslator(dict))} />
  );
}
