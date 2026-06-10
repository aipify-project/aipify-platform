"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AipifyEmptyState } from "@/components/branding";
import AiInsightList from "@/components/platform/AiInsightList";
import { buildCustomerAiInsights } from "@/lib/platform/ai-dashboard";
import { formatDate, formatDateTime } from "@/lib/i18n/format-date";
import { createClient } from "@/lib/supabase/client";
import type { CustomerMasterDetail, InvoiceAction } from "@/lib/platform/types";
import StatusBadge from "./StatusBadge";

type TabId =
  | "overview"
  | "users"
  | "installations"
  | "subscriptions"
  | "invoices"
  | "usage"
  | "support"
  | "activity";

type CustomerMasterDetailViewProps = {
  customerId: string;
  locale: string;
  labels: {
    back: string;
    loading: string;
    notFound: string;
    tabs: Record<TabId, string>;
    customerNumber: string;
    customerName: string;
    customerType: string;
    companyNumber: string;
    country: string;
    language: string;
    plan: string;
    subscriptionStatus: string;
    paymentProvider: string;
    ownerEmail: string;
    createdAt: string;
    currentPlan: string;
    trialRemaining: string;
    nextBillingDate: string;
    totalUsers: string;
    totalInstallations: string;
    outstandingInvoices: string;
    name: string;
    email: string;
    role: string;
    status: string;
    lastLogin: string;
    ownerBadge: string;
    installationName: string;
    domain: string;
    systemType: string;
    connectedModules: string;
    lastSync: string;
    trialDates: string;
    startDate: string;
    price: string;
    currency: string;
    billingCycle: string;
    invoiceNumber: string;
    invoiceStatus: string;
    issueDate: string;
    dueDate: string;
    amount: string;
    paymentStatus: string;
    kid: string;
    view: string;
    download: string;
    resend: string;
    markPaid: string;
    supportRequests: string;
    automatedActions: string;
    aiRecommendations: string;
    avgResponseTime: string;
    mostUsedModules: string;
    openTickets: string;
    closedTickets: string;
    avgResolutionTime: string;
    lastContact: string;
    assignedAgent: string;
    subject: string;
    noData: string;
    actionPending: string;
    statusLabels: Record<string, string>;
    typeLabels: Record<string, string>;
    planTypeLabels: Record<string, string>;
    providerLabels: Record<string, string>;
    invoiceStatusLabels: Record<string, string>;
    userRoleLabels: Record<string, string>;
    userStatusLabels: Record<string, string>;
    seconds: string;
    hours: string;
    days: string;
    pulseLabel: string;
    aiInsightsTitle: string;
  };
};

export default function CustomerMasterDetailView({
  customerId,
  locale,
  labels,
}: CustomerMasterDetailViewProps) {
  const [detail, setDetail] = useState<CustomerMasterDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [actingInvoiceId, setActingInvoiceId] = useState<string | null>(null);

  async function loadDetail() {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("get_platform_customer_master_detail", {
      p_customer_id: customerId,
    });

    if (error || !data) {
      setDetail(null);
    } else {
      setDetail(data as CustomerMasterDetail);
    }
    setLoading(false);
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_platform_customer_master_detail", {
        p_customer_id: customerId,
      });

      if (!cancelled) {
        if (error || !data) {
          setDetail(null);
        } else {
          setDetail(data as CustomerMasterDetail);
        }
        setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [customerId]);

  const ownerEmail = useMemo(() => {
    if (!detail) return "—";
    const owner = detail.users.find((user) => user.is_owner);
    return owner?.email ?? detail.customer.email;
  }, [detail]);

  async function runInvoiceAction(invoiceId: string, action: InvoiceAction) {
    setActingInvoiceId(invoiceId);
    try {
      await fetch(`/api/platform/invoices/${invoiceId}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      await loadDetail();
    } finally {
      setActingInvoiceId(null);
    }
  }

  if (loading) {
    return <p className="text-sm text-gray-500">{labels.loading}</p>;
  }

  if (!detail?.customer) {
    return <p className="text-sm text-gray-500">{labels.notFound}</p>;
  }

  const { customer, payment_profile, subscription, overview, users, installations, invoices, usage, support, activity_log } =
    detail;
  const displayName = customer.company_name ?? customer.full_name ?? labels.customerName;

  const openTickets = support.filter((ticket) => ticket.status === "open" || ticket.status === "escalated");
  const closedTickets = support.filter((ticket) => ticket.status === "closed");
  const avgResolution =
    closedTickets.length > 0
      ? closedTickets.reduce((sum, ticket) => sum + (ticket.resolution_time_hours ?? 0), 0) /
        closedTickets.length
      : null;
  const lastContact = support.reduce<string | null>((latest, ticket) => {
    if (!ticket.last_contact_at) return latest;
    if (!latest || ticket.last_contact_at > latest) return ticket.last_contact_at;
    return latest;
  }, null);
  const assignedAgent =
    openTickets.find((ticket) => ticket.assigned_agent)?.assigned_agent ?? "—";

  const tabIds: TabId[] = [
    "overview",
    "users",
    "installations",
    "subscriptions",
    "invoices",
    "usage",
    "support",
    "activity",
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        href="/platform/customers"
        className="text-sm font-semibold text-violet-600 hover:text-violet-700"
      >
        ← {labels.back}
      </Link>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-sm font-medium text-violet-600">
              {customer.customer_number}
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {displayName}
            </h1>
          </div>
          <StatusBadge
            status={customer.status}
            label={labels.statusLabels[customer.status] ?? customer.status}
          />
        </div>

        <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <HeaderField label={labels.customerType} value={labels.typeLabels[customer.customer_type] ?? customer.customer_type} />
          <HeaderField label={labels.companyNumber} value={customer.organization_number ?? "—"} mono />
          <HeaderField label={labels.country} value={customer.country} />
          <HeaderField label={labels.language} value={customer.language.toUpperCase()} />
          <HeaderField label={labels.plan} value={overview.plan_name ?? subscription?.plan_name ?? "—"} />
          <HeaderField
            label={labels.subscriptionStatus}
            value={
              overview.subscription_status
                ? labels.statusLabels[overview.subscription_status] ?? overview.subscription_status
                : "—"
            }
          />
          <HeaderField
            label={labels.paymentProvider}
            value={
              payment_profile
                ? labels.providerLabels[payment_profile.provider] ?? payment_profile.provider
                : "—"
            }
          />
          <HeaderField label={labels.ownerEmail} value={ownerEmail} />
          <HeaderField label={labels.createdAt} value={formatDate(customer.created_at, locale)} />
        </dl>
      </div>

      <div className="mt-8 border-b border-gray-200">
        <nav className="-mb-px flex gap-1 overflow-x-auto">
          {tabIds.map((tabId) => (
            <button
              key={tabId}
              type="button"
              onClick={() => setActiveTab(tabId)}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                activeTab === tabId
                  ? "border-violet-600 text-violet-700"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {labels.tabs[tabId]}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <OverviewCard label={labels.currentPlan} value={overview.plan_name ?? "—"} />
              <OverviewCard
                label={labels.subscriptionStatus}
                value={
                  overview.subscription_status
                    ? labels.statusLabels[overview.subscription_status] ?? overview.subscription_status
                    : labels.statusLabels[overview.customer_status] ?? overview.customer_status
                }
              />
              <OverviewCard
                label={labels.trialRemaining}
                value={
                  overview.trial_days_remaining != null
                    ? `${overview.trial_days_remaining} ${labels.days}`
                    : "—"
                }
              />
              <OverviewCard label={labels.nextBillingDate} value={formatDate(overview.next_billing_date, locale)} />
              <OverviewCard label={labels.totalUsers} value={String(overview.total_users)} />
              <OverviewCard label={labels.totalInstallations} value={String(overview.total_installations)} />
              <OverviewCard
                label={labels.outstandingInvoices}
                value={`${overview.outstanding_invoices} NOK`}
              />
              <OverviewCard
                label={labels.paymentProvider}
                value={
                  overview.payment_provider
                    ? labels.providerLabels[overview.payment_provider] ?? overview.payment_provider
                    : "—"
                }
              />
            </div>
            <AiInsightList
              title={labels.aiInsightsTitle}
              items={buildCustomerAiInsights(detail)}
            />
          </div>
        )}

        {activeTab === "users" && (
          <DataTable
            empty={labels.noData}
            pulseLabel={labels.pulseLabel}
            headers={[labels.name, labels.email, labels.role, labels.status, labels.lastLogin, ""]}
            rows={
              users.length === 0
                ? []
                : users.map((user) => [
                    user.full_name ?? "—",
                    user.email ?? "—",
                    labels.userRoleLabels[user.role] ?? user.role,
                    labels.userStatusLabels[user.status] ?? user.status,
                    formatDateTime(user.last_login_at, locale),
                    user.is_owner ? (
                      <span className="rounded-full bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-700 ring-1 ring-violet-100">
                        {labels.ownerBadge}
                      </span>
                    ) : (
                      ""
                    ),
                  ])
            }
          />
        )}

        {activeTab === "installations" && (
          <DataTable
            empty={labels.noData}
            pulseLabel={labels.pulseLabel}
            headers={[
              labels.installationName,
              labels.domain,
              labels.systemType,
              labels.status,
              labels.connectedModules,
              labels.lastSync,
            ]}
            rows={
              installations.length === 0
                ? []
                : installations.map((installation) => [
                    installation.name ?? installation.site_url ?? "—",
                    installation.site_url ?? "—",
                    installation.system_type,
                    labels.statusLabels[installation.status] ?? installation.status,
                    installation.modules.length > 0 ? installation.modules.join(", ") : "—",
                    formatDateTime(installation.last_synced_at, locale),
                  ])
            }
          />
        )}

        {activeTab === "subscriptions" && (
          subscription ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <dl className="grid gap-4 text-sm sm:grid-cols-2">
                <HeaderField label={labels.plan} value={subscription.plan_name} />
                <HeaderField
                  label={labels.status}
                  value={labels.statusLabels[subscription.status] ?? subscription.status}
                />
                <HeaderField
                  label={labels.trialDates}
                  value={`${formatDate(subscription.trial_starts_at, locale)} – ${formatDate(subscription.trial_ends_at, locale)}`}
                />
                <HeaderField label={labels.startDate} value={formatDate(subscription.created_at, locale)} />
                <HeaderField label={labels.nextBillingDate} value={formatDate(subscription.next_billing_date, locale)} />
                <HeaderField label={labels.price} value={`${subscription.price_amount} ${subscription.currency}`} />
                <HeaderField label={labels.currency} value={subscription.currency} />
                <HeaderField label={labels.billingCycle} value={subscription.billing_cycle} />
              </dl>
            </div>
          ) : (
            <BrandedEmptyState message={labels.noData} pulseLabel={labels.pulseLabel} />
          )
        )}

        {activeTab === "invoices" && (
          invoices.length === 0 ? (
            <BrandedEmptyState message={labels.noData} pulseLabel={labels.pulseLabel} />
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50/80">
                    <tr>
                      {[labels.invoiceNumber, labels.invoiceStatus, labels.issueDate, labels.dueDate, labels.amount, labels.paymentStatus, labels.kid, labels.view].map((header) => (
                        <th
                          key={header}
                          className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {invoices.map((invoice) => (
                      <tr key={invoice.id}>
                        <td className="px-4 py-3 font-mono text-sm">{invoice.invoice_number}</td>
                        <td className="px-4 py-3">
                          <StatusBadge
                            status={invoice.status}
                            label={labels.invoiceStatusLabels[invoice.status] ?? invoice.status}
                          />
                        </td>
                        <td className="px-4 py-3 text-sm">{formatDate(invoice.issued_at, locale)}</td>
                        <td className="px-4 py-3 text-sm">{formatDate(invoice.due_date, locale)}</td>
                        <td className="px-4 py-3 text-sm">
                          {invoice.amount} {invoice.currency}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {invoice.status === "paid"
                            ? labels.invoiceStatusLabels.paid
                            : labels.statusLabels.pending ?? "Pending"}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs">{invoice.kid_number ?? "—"}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              className="text-xs font-semibold text-violet-600 hover:text-violet-700"
                              onClick={() => runInvoiceAction(invoice.id, "send")}
                              disabled={actingInvoiceId === invoice.id}
                            >
                              {actingInvoiceId === invoice.id ? labels.actionPending : labels.view}
                            </button>
                            {invoice.pdf_url && (
                              <a
                                href={invoice.pdf_url}
                                className="text-xs font-semibold text-gray-600 hover:text-gray-800"
                              >
                                {labels.download}
                              </a>
                            )}
                            <button
                              type="button"
                              className="text-xs font-semibold text-gray-600 hover:text-gray-800"
                              onClick={() => runInvoiceAction(invoice.id, "resend")}
                              disabled={actingInvoiceId === invoice.id}
                            >
                              {labels.resend}
                            </button>
                            <button
                              type="button"
                              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                              onClick={() => runInvoiceAction(invoice.id, "mark_paid")}
                              disabled={actingInvoiceId === invoice.id}
                            >
                              {labels.markPaid}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}

        {activeTab === "usage" && (
          usage ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <OverviewCard label={labels.supportRequests} value={String(usage.support_requests_handled)} />
              <OverviewCard label={labels.automatedActions} value={String(usage.automated_actions)} />
              <OverviewCard label={labels.aiRecommendations} value={String(usage.ai_recommendations)} />
              <OverviewCard
                label={labels.avgResponseTime}
                value={`${usage.avg_response_time_seconds} ${labels.seconds}`}
              />
              <OverviewCard
                label={labels.mostUsedModules}
                value={
                  usage.most_used_modules.length > 0
                    ? usage.most_used_modules.join(", ")
                    : "—"
                }
              />
            </div>
          ) : (
            <BrandedEmptyState message={labels.noData} pulseLabel={labels.pulseLabel} />
          )
        )}

        {activeTab === "support" && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <OverviewCard label={labels.openTickets} value={String(openTickets.length)} />
              <OverviewCard label={labels.closedTickets} value={String(closedTickets.length)} />
              <OverviewCard
                label={labels.avgResolutionTime}
                value={avgResolution != null ? `${avgResolution.toFixed(1)} ${labels.hours}` : "—"}
              />
              <OverviewCard label={labels.lastContact} value={formatDate(lastContact, locale)} />
              <OverviewCard label={labels.assignedAgent} value={assignedAgent} />
            </div>
            <DataTable
              empty={labels.noData}
              pulseLabel={labels.pulseLabel}
              headers={[labels.subject, labels.status, labels.assignedAgent, labels.lastContact]}
              rows={
                support.length === 0
                  ? []
                  : support.map((ticket) => [
                      ticket.subject,
                      labels.statusLabels[ticket.status] ?? ticket.status,
                      ticket.assigned_agent ?? "—",
                      formatDate(ticket.last_contact_at, locale),
                    ])
              }
            />
          </div>
        )}

        {activeTab === "activity" && (
          activity_log.length === 0 ? (
            <BrandedEmptyState message={labels.noData} pulseLabel={labels.pulseLabel} />
          ) : (
            <ul className="divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white shadow-sm">
              {activity_log.map((entry) => (
                <li key={entry.id} className="flex flex-wrap items-start justify-between gap-3 px-6 py-4">
                  <div>
                    <p className="font-semibold text-gray-900">{entry.title}</p>
                    <p className="mt-1 font-mono text-xs text-gray-500">{entry.event_type}</p>
                  </div>
                  <p className="text-sm text-gray-500">{formatDateTime(entry.created_at, locale)}</p>
                </li>
              ))}
            </ul>
          )
        )}
      </div>
    </div>
  );
}

function HeaderField({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className={`mt-1 text-sm font-medium text-gray-900 ${mono ? "font-mono" : ""}`}>
        {value}
      </dd>
    </div>
  );
}

function OverviewCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-2 text-xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function BrandedEmptyState({
  message,
  pulseLabel,
}: {
  message: string;
  pulseLabel: string;
}) {
  return <AipifyEmptyState message={message} pulseLabel={pulseLabel} />;
}

function DataTable({
  headers,
  rows,
  empty,
  pulseLabel,
}: {
  headers: string[];
  rows: (string | ReactNode)[][];
  empty: string;
  pulseLabel: string;
}) {
  if (rows.length === 0) {
    return <BrandedEmptyState message={empty} pulseLabel={pulseLabel} />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/80">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row, index) => (
              <tr key={index}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3 text-sm text-gray-700">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
