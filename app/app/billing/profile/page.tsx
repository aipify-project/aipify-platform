import { UnifiedBillingProfilePanel } from "@/components/app/unified-billing";
import { buildUnifiedBillingLabels } from "@/lib/unified-billing-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function UnifiedBillingProfilePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "unifiedBilling");
  const t = createTranslator(dict);
  const labels = buildUnifiedBillingLabels(t);
  return (
    <UnifiedBillingProfilePanel
      labels={{
        ...labels.profile,
        loading: labels.loading,
        empty: labels.empty,
        back: labels.back,
      }}
    />
  );
}
