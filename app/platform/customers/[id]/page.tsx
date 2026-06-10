import CustomerDetailView from "@/components/platform/CustomerDetailView";
import {
  customerStatusLabels,
  customerTypeLabels,
  invoiceStatusLabels,
  paymentMethodLabels,
  planTypeLabels,
  subscriptionStatusLabels,
} from "@/lib/platform/labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type CustomerDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { id } = await params;
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  const statusLabels = {
    ...customerStatusLabels(t),
    ...subscriptionStatusLabels(t),
  };

  const installationStatusLabels = {
    pending: t("platform.status.installation.pending"),
    active: t("platform.status.installation.active"),
    paused: t("platform.status.installation.paused"),
    revoked: t("platform.status.installation.revoked"),
  };

  return (
    <CustomerDetailView
      customerId={id}
      labels={{
        back: t("platform.customerDetail.back"),
        loading: t("platform.customerDetail.loading"),
        notFound: t("platform.customerDetail.notFound"),
        profile: t("platform.customerDetail.profile"),
        billing: t("platform.customerDetail.billing"),
        subscription: t("platform.customerDetail.subscription"),
        installations: t("platform.customerDetail.installations"),
        invoices: t("platform.customerDetail.invoices"),
        customerNumber: t("platform.customers.customerNumber"),
        customerType: t("platform.customerDetail.customerType"),
        email: t("platform.customers.email"),
        phone: t("platform.customerDetail.phone"),
        country: t("platform.customers.country"),
        language: t("platform.customerDetail.language"),
        status: t("platform.customers.status"),
        createdAt: t("platform.customerDetail.createdAt"),
        billingName: t("platform.billing.billingName"),
        billingEmail: t("platform.billing.billingEmail"),
        billingAddress: t("platform.billing.address"),
        paymentMethod: t("platform.billing.paymentMethod"),
        currency: t("platform.billing.currency"),
        plan: t("platform.subscriptions.plan"),
        planType: t("platform.subscriptions.planType"),
        billingCycle: t("platform.subscriptions.billingCycle"),
        price: t("platform.subscriptions.price"),
        maxUsers: t("platform.subscriptions.maxUsers"),
        maxInstallations: t("platform.subscriptions.maxInstallations"),
        trialActive: t("platform.subscriptions.trialActive"),
        daysRemaining: t("platform.subscriptions.daysRemaining"),
        trialEnds: t("platform.subscriptions.trialEnds"),
        noBilling: t("platform.customerDetail.noBilling"),
        noSubscription: t("platform.customerDetail.noSubscription"),
        noInstallations: t("platform.customerDetail.noInstallations"),
        noInvoices: t("platform.customerDetail.noInvoices"),
        statusLabels: { ...statusLabels, ...installationStatusLabels },
        typeLabels: customerTypeLabels(t),
        planTypeLabels: planTypeLabels(t),
        paymentMethodLabels: paymentMethodLabels(t),
        invoiceStatusLabels: invoiceStatusLabels(t),
      }}
    />
  );
}
