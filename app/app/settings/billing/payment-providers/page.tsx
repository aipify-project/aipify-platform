import { PaymentProvidersExperiencePanel } from "@/components/shared/payment-providers";
import { buildBillingExperienceLabels } from "@/lib/billing-experience";
import { buildPaymentProviderLabels } from "@/lib/payment-providers";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CustomerPaymentProvidersPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);

  return (
    <PaymentProvidersExperiencePanel
      scope="tenant"
      backHref="/app/settings/billing"
      labels={buildPaymentProviderLabels(t, "customerApp")}
      billingLabels={buildBillingExperienceLabels(t, "customerApp")}
    />
  );
}
