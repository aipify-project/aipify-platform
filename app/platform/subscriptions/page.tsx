import SubscriptionsPanel from "@/components/platform/SubscriptionsPanel";
import {
  paymentProviderLabels,
  paymentStatusLabels,
  planTypeLabels,
  subscriptionStatusLabels,
} from "@/lib/platform/labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformSubscriptionsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform", "branding"]);
  const t = createTranslator(dict);

  return (
    <SubscriptionsPanel
      locale={locale}
      labels={{
        title: t("platform.subscriptions.title"),
        subtitle: t("platform.subscriptions.subtitle"),
        loading: t("platform.subscriptions.loading"),
        empty: t("platform.subscriptions.empty"),
        customer: t("platform.subscriptions.customer"),
        customerNumber: t("platform.customers.customerNumber"),
        plan: t("platform.subscriptions.plan"),
        planType: t("platform.subscriptions.planType"),
        status: t("platform.subscriptions.status"),
        trial: t("platform.subscriptions.trial"),
        price: t("platform.subscriptions.price"),
        billingCycle: t("platform.subscriptions.billingCycle"),
        daysRemaining: t("platform.subscriptions.daysRemaining"),
        nextBillingDate: t("platform.subscriptions.nextBillingDate"),
        provider: t("platform.subscriptions.provider"),
        paymentStatus: t("platform.subscriptions.paymentStatus"),
        statusLabels: subscriptionStatusLabels(t),
        planTypeLabels: planTypeLabels(t),
        providerLabels: paymentProviderLabels(t),
        paymentStatusLabels: paymentStatusLabels(t),
        pulseLabel: t("branding.pulseLabel"),
      }}
    />
  );
}
