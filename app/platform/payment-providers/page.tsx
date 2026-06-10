import PaymentProvidersPanel from "@/components/platform/PaymentProvidersPanel";
import { paymentProviderLabels } from "@/lib/platform/labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformPaymentProvidersPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform", "branding"]);
  const t = createTranslator(dict);

  return (
    <PaymentProvidersPanel
      labels={{
        title: t("platform.paymentProviders.title"),
        subtitle: t("platform.paymentProviders.subtitle"),
        loading: t("platform.paymentProviders.loading"),
        empty: t("platform.paymentProviders.empty"),
        provider: t("platform.paymentProviders.provider"),
        customers: t("platform.paymentProviders.customers"),
        active: t("platform.paymentProviders.active"),
        trialing: t("platform.paymentProviders.trialing"),
        failed: t("platform.paymentProviders.failed"),
        recentEvents: t("platform.paymentProviders.recentEvents"),
        noEvents: t("platform.paymentProviders.noEvents"),
        eventType: t("platform.paymentProviders.eventType"),
        customer: t("platform.paymentProviders.customer"),
        providerLabels: paymentProviderLabels(t),
        pulseLabel: t("branding.pulseLabel"),
      }}
    />
  );
}
