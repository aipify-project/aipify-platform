import { PaymentProvidersExperiencePanel } from "@/components/shared/payment-providers";
import { buildBillingExperienceLabels } from "@/lib/billing-experience";
import { buildPaymentProviderLabels } from "@/lib/payment-providers";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformBillingPaymentProvidersPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <PaymentProvidersExperiencePanel
      scope="platform"
      backHref="/platform/billing"
      labels={buildPaymentProviderLabels(t, "platform")}
      billingLabels={buildBillingExperienceLabels(t, "platform")}
    />
  );
}
