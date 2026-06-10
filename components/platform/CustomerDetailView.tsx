"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getTrialDaysRemaining, isTrialActive } from "@/lib/platform/trial";
import type { CustomerDetail } from "@/lib/platform/types";
import StatusBadge from "./StatusBadge";

type CustomerDetailViewProps = {
  customerId: string;
  labels: {
    back: string;
    loading: string;
    notFound: string;
    profile: string;
    billing: string;
    subscription: string;
    installations: string;
    invoices: string;
    paymentEvents: string;
    customerNumber: string;
    customerType: string;
    email: string;
    phone: string;
    country: string;
    language: string;
    status: string;
    createdAt: string;
    billingEmail: string;
    billingAddress: string;
    provider: string;
    paymentStatus: string;
    kid: string;
    providerCustomerId: string;
    providerMandateId: string;
    plan: string;
    planType: string;
    billingCycle: string;
    price: string;
    maxUsers: string;
    maxInstallations: string;
    nextBillingDate: string;
    trialActive: string;
    daysRemaining: string;
    trialEnds: string;
    noBilling: string;
    noSubscription: string;
    noInstallations: string;
    noInvoices: string;
    noEvents: string;
    eventType: string;
    statusLabels: Record<string, string>;
    typeLabels: Record<string, string>;
    planTypeLabels: Record<string, string>;
    providerLabels: Record<string, string>;
    paymentStatusLabels: Record<string, string>;
    invoiceStatusLabels: Record<string, string>;
  };
};

function formatDate(value: string | null | undefined, locale: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
    new Date(value)
  );
}

export default function CustomerDetailView({
  customerId,
  labels,
}: CustomerDetailViewProps) {
  const [detail, setDetail] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const locale = "en";

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_platform_customer_detail", {
        p_customer_id: customerId,
      });

      if (!cancelled) {
        if (error || !data) {
          setDetail(null);
        } else {
          setDetail(data as CustomerDetail);
        }
        setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [customerId]);

  if (loading) {
    return <p className="text-sm text-gray-500">{labels.loading}</p>;
  }

  if (!detail?.customer) {
    return <p className="text-sm text-gray-500">{labels.notFound}</p>;
  }

  const {
    customer,
    payment_profile,
    subscription,
    installations,
    invoices,
    payment_events,
  } = detail;
  const displayName =
    customer.company_name ?? customer.full_name ?? labels.profile;
  const trialDays = getTrialDaysRemaining(subscription?.trial_ends_at);
  const trialActive = subscription
    ? isTrialActive(subscription.status, subscription.trial_ends_at)
    : customer.status === "trial";

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        href="/platform/customers"
        className="text-sm font-semibold text-violet-600 hover:text-violet-700"
      >
        ← {labels.back}
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-sm font-medium text-gray-500">
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

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.profile}</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Row label={labels.customerNumber} value={customer.customer_number} mono />
            <Row
              label={labels.customerType}
              value={labels.typeLabels[customer.customer_type] ?? customer.customer_type}
            />
            <Row label={labels.email} value={customer.email} />
            <Row label={labels.phone} value={customer.phone ?? "—"} />
            <Row label={labels.country} value={customer.country} />
            <Row label={labels.language} value={customer.language.toUpperCase()} />
            <Row label={labels.createdAt} value={formatDate(customer.created_at, locale)} />
          </dl>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.billing}</h2>
          {payment_profile ? (
            <dl className="mt-4 space-y-3 text-sm">
              <Row
                label={labels.provider}
                value={
                  labels.providerLabels[payment_profile.provider] ??
                  payment_profile.provider
                }
              />
              <Row
                label={labels.paymentStatus}
                value={
                  labels.paymentStatusLabels[payment_profile.payment_status] ??
                  payment_profile.payment_status
                }
              />
              <Row label={labels.billingEmail} value={payment_profile.billing_email} />
              <Row
                label={labels.billingAddress}
                value={`${payment_profile.billing_address}, ${payment_profile.postal_code} ${payment_profile.city}, ${payment_profile.country}`}
              />
              <Row label={labels.kid} value={payment_profile.kid_number ?? "—"} mono />
              <Row
                label={labels.providerCustomerId}
                value={payment_profile.provider_customer_id ?? "—"}
                mono
              />
              <Row
                label={labels.providerMandateId}
                value={payment_profile.provider_mandate_id ?? "—"}
                mono
              />
            </dl>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noBilling}</p>
          )}
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900">{labels.subscription}</h2>
          {subscription ? (
            <>
              {trialActive && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  <p className="font-semibold">{labels.trialActive}</p>
                  <p className="mt-1">
                    {labels.daysRemaining}: {trialDays ?? 0} · {labels.trialEnds}:{" "}
                    {formatDate(subscription.trial_ends_at, locale)}
                  </p>
                </div>
              )}
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <Row label={labels.plan} value={subscription.plan_name} />
                <Row
                  label={labels.planType}
                  value={
                    labels.planTypeLabels[subscription.plan_type] ??
                    subscription.plan_type
                  }
                />
                <Row
                  label={labels.status}
                  value={
                    labels.statusLabels[subscription.status] ?? subscription.status
                  }
                />
                <Row label={labels.billingCycle} value={subscription.billing_cycle} />
                <Row
                  label={labels.price}
                  value={`${subscription.price_amount} ${subscription.currency}`}
                />
                <Row
                  label={labels.nextBillingDate}
                  value={formatDate(subscription.next_billing_date, locale)}
                />
                <Row label={labels.maxUsers} value={String(subscription.max_users)} />
                <Row
                  label={labels.maxInstallations}
                  value={String(subscription.max_installations)}
                />
              </dl>
            </>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noSubscription}</p>
          )}
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900">{labels.installations}</h2>
          {installations.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">{labels.noInstallations}</p>
          ) : (
            <ul className="mt-4 divide-y divide-gray-100">
              {installations.map((installation) => (
                <li
                  key={installation.id}
                  className="flex flex-wrap items-center justify-between gap-2 py-3"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {installation.name ?? installation.site_url ?? installation.id}
                    </p>
                    {installation.site_url && (
                      <p className="text-xs text-gray-500">{installation.site_url}</p>
                    )}
                  </div>
                  <StatusBadge
                    status={installation.status}
                    label={
                      labels.statusLabels[installation.status] ?? installation.status
                    }
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900">{labels.invoices}</h2>
          {invoices.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">{labels.noInvoices}</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead>
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="py-2 pr-4">#</th>
                    <th className="py-2 pr-4">{labels.status}</th>
                    <th className="py-2 pr-4">{labels.kid}</th>
                    <th className="py-2 pr-4">{labels.price}</th>
                    <th className="py-2">{labels.createdAt}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="py-3 pr-4 font-mono text-sm">
                        {invoice.invoice_number}
                      </td>
                      <td className="py-3 pr-4">
                        <StatusBadge
                          status={invoice.status}
                          label={
                            labels.invoiceStatusLabels[invoice.status] ?? invoice.status
                          }
                        />
                      </td>
                      <td className="py-3 pr-4 font-mono text-sm text-gray-600">
                        {invoice.kid_number ?? "—"}
                      </td>
                      <td className="py-3 pr-4 text-sm">
                        {invoice.amount} {invoice.currency}
                      </td>
                      <td className="py-3 text-sm text-gray-600">
                        {formatDate(invoice.issued_at, locale)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900">{labels.paymentEvents}</h2>
          {!payment_events?.length ? (
            <p className="mt-4 text-sm text-gray-500">{labels.noEvents}</p>
          ) : (
            <ul className="mt-4 divide-y divide-gray-100">
              {payment_events.map((event) => (
                <li key={event.id} className="flex flex-wrap justify-between gap-2 py-3 text-sm">
                  <span className="font-mono text-gray-700">{event.event_type}</span>
                  <span className="text-gray-500">
                    {labels.providerLabels[event.provider] ?? event.provider} ·{" "}
                    {formatDate(event.created_at, locale)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-wrap justify-between gap-2">
      <dt className="font-medium text-gray-500">{label}</dt>
      <dd className={`text-gray-900 ${mono ? "font-mono text-xs" : ""}`}>{value}</dd>
    </div>
  );
}
