import { PaymentProvidersExperiencePanel } from "@/components/shared/payment-providers";
import { buildPaymentProviderLabels } from "@/lib/payment-providers";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CustomerPaymentProvidersPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  return (
    <PaymentProvidersExperiencePanel
      scope="tenant"
      backHref="/app/settings/billing"
      labels={buildPaymentProviderLabels(t, "customerApp")}
    />
  );
}
