import { PaymentOperationsCenterPanel } from "@/components/platform/payment-operations";
import { buildPaymentOperationsLabels } from "@/lib/payment-operations";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformPaymentOperationsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <PaymentOperationsCenterPanel
      backHref="/platform/billing"
      labels={buildPaymentOperationsLabels(t)}
    />
  );
}
