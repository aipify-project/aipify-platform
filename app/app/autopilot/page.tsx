import { AutopilotPanel } from "@/components/app/autopilot-operations";
import { buildAutopilotLabels } from "@/lib/customer-autopilot-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AutopilotPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "autopilotOperations");
  const labels = buildAutopilotLabels(createTranslator(dict));
  return <AutopilotPanel backHref="/app" labels={labels} />;
}
