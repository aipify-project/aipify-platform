import { PaymentAnalyticsPanel } from "@/components/platform/payment-analytics";
import { buildPaymentAnalyticsLabels } from "@/lib/payment-analytics";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformPaymentAnalyticsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <PaymentAnalyticsPanel
      backHref="/platform/billing"
      labels={buildPaymentAnalyticsLabels(t)}
    />
  );
}
