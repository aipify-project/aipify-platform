import BillingPanel from "@/components/platform/BillingPanel";
import {
  paymentProviderLabels,
  paymentStatusLabels,
} from "@/lib/platform/labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformBillingPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform", "branding"]);
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
        billingEmail: t("platform.billing.billingEmail"),
        address: t("platform.billing.address"),
        provider: t("platform.billing.provider"),
        paymentStatus: t("platform.billing.paymentStatus"),
        kid: t("platform.billing.kid"),
        providerCustomerId: t("platform.billing.providerCustomerId"),
        providerMandateId: t("platform.billing.providerMandateId"),
        providerLabels: paymentProviderLabels(t),
        paymentStatusLabels: paymentStatusLabels(t),
        pulseLabel: t("branding.pulseLabel"),
      }}
    />
  );
}
