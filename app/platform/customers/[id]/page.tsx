import CustomerMasterDetailView from "@/components/platform/CustomerMasterDetailView";
import {
  customerStatusLabels,
  customerTypeLabels,
  invoiceStatusLabels,
  paymentProviderLabels,
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
  const dict = await getDictionary(locale, ["platform", "branding"]);
  const t = createTranslator(dict);

  const statusLabels = {
    ...customerStatusLabels(t),
    ...subscriptionStatusLabels(t),
    open: t("platform.masterDetail.supportStatus.open"),
    closed: t("platform.masterDetail.supportStatus.closed"),
    escalated: t("platform.masterDetail.supportStatus.escalated"),
    pending: t("platform.masterDetail.paymentPending"),
  };

  const installationStatusLabels = {
    pending: t("platform.status.installation.pending"),
    active: t("platform.status.installation.active"),
    paused: t("platform.status.installation.paused"),
    revoked: t("platform.status.installation.revoked"),
  };

  return (
    <CustomerMasterDetailView
      customerId={id}
      locale={locale}
      labels={{
        back: t("platform.masterDetail.back"),
        loading: t("platform.masterDetail.loading"),
        notFound: t("platform.masterDetail.notFound"),
        tabs: {
          overview: t("platform.masterDetail.tabs.overview"),
          users: t("platform.masterDetail.tabs.users"),
          installations: t("platform.masterDetail.tabs.installations"),
          subscriptions: t("platform.masterDetail.tabs.subscriptions"),
          invoices: t("platform.masterDetail.tabs.invoices"),
          usage: t("platform.masterDetail.tabs.usage"),
          support: t("platform.masterDetail.tabs.support"),
          activity: t("platform.masterDetail.tabs.activity"),
        },
        customerNumber: t("platform.customers.customerNumber"),
        customerName: t("platform.customers.name"),
        customerType: t("platform.masterDetail.customerType"),
        companyNumber: t("platform.masterDetail.companyNumber"),
        country: t("platform.customers.country"),
        language: t("platform.masterDetail.language"),
        plan: t("platform.subscriptions.plan"),
        subscriptionStatus: t("platform.masterDetail.subscriptionStatus"),
        paymentProvider: t("platform.billing.provider"),
        ownerEmail: t("platform.masterDetail.ownerEmail"),
        createdAt: t("platform.masterDetail.createdAt"),
        currentPlan: t("platform.masterDetail.currentPlan"),
        trialRemaining: t("platform.masterDetail.trialRemaining"),
        nextBillingDate: t("platform.subscriptions.nextBillingDate"),
        totalUsers: t("platform.masterDetail.totalUsers"),
        totalInstallations: t("platform.masterDetail.totalInstallations"),
        outstandingInvoices: t("platform.masterDetail.outstandingInvoices"),
        name: t("platform.masterDetail.name"),
        email: t("platform.customers.email"),
        role: t("platform.masterDetail.role"),
        status: t("platform.customers.status"),
        lastLogin: t("platform.masterDetail.lastLogin"),
        ownerBadge: t("platform.masterDetail.ownerBadge"),
        installationName: t("platform.masterDetail.installationName"),
        domain: t("platform.masterDetail.domain"),
        systemType: t("platform.masterDetail.systemType"),
        connectedModules: t("platform.masterDetail.connectedModules"),
        lastSync: t("platform.masterDetail.lastSync"),
        trialDates: t("platform.masterDetail.trialDates"),
        startDate: t("platform.masterDetail.startDate"),
        price: t("platform.subscriptions.price"),
        currency: t("platform.masterDetail.currency"),
        billingCycle: t("platform.subscriptions.billingCycle"),
        invoiceNumber: t("platform.invoices.invoiceNumber"),
        invoiceStatus: t("platform.invoices.status"),
        issueDate: t("platform.masterDetail.issueDate"),
        dueDate: t("platform.invoices.dueDate"),
        amount: t("platform.invoices.amount"),
        paymentStatus: t("platform.masterDetail.paymentStatus"),
        kid: t("platform.billing.kid"),
        view: t("platform.invoices.send"),
        download: t("platform.invoices.downloadPdf"),
        resend: t("platform.invoices.resend"),
        markPaid: t("platform.invoices.markPaid"),
        supportRequests: t("platform.masterDetail.supportRequests"),
        automatedActions: t("platform.masterDetail.automatedActions"),
        aiRecommendations: t("platform.masterDetail.aiRecommendations"),
        avgResponseTime: t("platform.masterDetail.avgResponseTime"),
        mostUsedModules: t("platform.masterDetail.mostUsedModules"),
        openTickets: t("platform.masterDetail.openTickets"),
        closedTickets: t("platform.masterDetail.closedTickets"),
        avgResolutionTime: t("platform.masterDetail.avgResolutionTime"),
        lastContact: t("platform.masterDetail.lastContact"),
        assignedAgent: t("platform.masterDetail.assignedAgent"),
        subject: t("platform.masterDetail.subject"),
        noData: t("platform.masterDetail.noData"),
        actionPending: t("platform.invoices.actionPending"),
        statusLabels: { ...statusLabels, ...installationStatusLabels },
        typeLabels: customerTypeLabels(t),
        planTypeLabels: planTypeLabels(t),
        providerLabels: paymentProviderLabels(t),
        invoiceStatusLabels: invoiceStatusLabels(t),
        userRoleLabels: {
          owner: t("platform.masterDetail.userRoles.owner"),
          admin: t("platform.masterDetail.userRoles.admin"),
          support: t("platform.masterDetail.userRoles.support"),
          staff: t("platform.masterDetail.userRoles.staff"),
          read_only: t("platform.masterDetail.userRoles.readOnly"),
        },
        userStatusLabels: {
          active: t("platform.masterDetail.userStatus.active"),
          invited: t("platform.masterDetail.userStatus.invited"),
          disabled: t("platform.masterDetail.userStatus.disabled"),
        },
        seconds: t("platform.metrics.seconds"),
        hours: t("platform.masterDetail.hours"),
        days: t("platform.customers.days"),
        pulseLabel: t("branding.pulseLabel"),
      }}
    />
  );
}
