import { UnifiedBillingCenterPanel } from "@/components/app/unified-billing";
import { buildUnifiedBillingLabels } from "@/lib/unified-billing-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function UnifiedBillingPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "unifiedBilling");
  const labels = buildUnifiedBillingLabels(createTranslator(dict));
  return <UnifiedBillingCenterPanel labels={labels} backHref="/app" />;
}
