import { PaymentHealthPanel } from "@/components/platform/payment-provider-health";
import { buildPaymentProviderHealthLabels } from "@/lib/payment-provider-health";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformPaymentHealthPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <PaymentHealthPanel
      backHref="/platform/billing"
      labels={buildPaymentProviderHealthLabels(t)}
    />
  );
}
