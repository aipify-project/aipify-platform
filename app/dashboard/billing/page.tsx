import CustomerBillingPanel from "@/components/dashboard/CustomerBillingPanel";
import {
  invoiceStatusLabels,
  paymentProviderLabels,
  paymentStatusLabels,
  planTypeLabels,
  subscriptionStatusLabels,
} from "@/lib/platform/labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function DashboardBillingPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["dashboard", "platform", "branding"]);
  const t = createTranslator(dict);

  return (
    <CustomerBillingPanel
      labels={{
        title: t("dashboard.billing.title"),
        subtitle: t("dashboard.billing.subtitle"),
        loading: t("dashboard.billing.loading"),
        empty: t("dashboard.billing.empty"),
        plan: t("dashboard.billing.plan"),
        planType: t("dashboard.billing.planType"),
        status: t("dashboard.billing.status"),
        trialActive: t("dashboard.billing.trialActive"),
        daysRemaining: t("dashboard.billing.daysRemaining"),
        trialEnds: t("dashboard.billing.trialEnds"),
        nextBillingDate: t("dashboard.billing.nextBillingDate"),
        price: t("dashboard.billing.price"),
        provider: t("dashboard.billing.provider"),
        paymentStatus: t("dashboard.billing.paymentStatus"),
        kid: t("dashboard.billing.kid"),
        invoices: t("dashboard.billing.invoices"),
        invoiceNumber: t("dashboard.billing.invoiceNumber"),
        amount: t("dashboard.billing.amount"),
        dueDate: t("dashboard.billing.dueDate"),
        cancelSubscription: t("dashboard.billing.cancelSubscription"),
        cancelPlaceholder: t("dashboard.billing.cancelPlaceholder"),
        noSubscription: t("dashboard.billing.noSubscription"),
        noInvoices: t("dashboard.billing.noInvoices"),
        planTypeLabels: planTypeLabels(t),
        providerLabels: paymentProviderLabels(t),
        paymentStatusLabels: paymentStatusLabels(t),
        subscriptionStatusLabels: subscriptionStatusLabels(t),
        invoiceStatusLabels: invoiceStatusLabels(t),
        pulseLabel: t("branding.pulseLabel"),
      }}
    />
  );
}
