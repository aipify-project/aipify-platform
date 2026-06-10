import BillingPanel from "@/components/platform/BillingPanel";
import { paymentMethodLabels } from "@/lib/platform/labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformBillingPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <BillingPanel
      labels={{
        title: t("platform.billing.title"),
        subtitle: t("platform.billing.subtitle"),
        loading: t("platform.billing.loading"),
        empty: t("platform.billing.empty"),
        customer: t("platform.billing.customer"),
        customerNumber: t("platform.customers.customerNumber"),
        billingName: t("platform.billing.billingName"),
        billingEmail: t("platform.billing.billingEmail"),
        address: t("platform.billing.address"),
        paymentMethod: t("platform.billing.paymentMethod"),
        currency: t("platform.billing.currency"),
        paymentMethodLabels: paymentMethodLabels(t),
      }}
    />
  );
}
