"use client";

import { useEffect, useState } from "react";
import { AipifyBillingDocumentHeader, AipifyEmptyState } from "@/components/branding";
import { formatDate } from "@/lib/i18n/format-date";
import { createClient } from "@/lib/supabase/client";
import { getTrialDaysRemaining, isTrialActive } from "@/lib/platform/trial";
import type { CustomerBillingOverview } from "@/lib/platform/types";
import StatusBadge from "@/components/platform/StatusBadge";

type CustomerBillingPanelProps = {
  locale: string;
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    plan: string;
    planType: string;
    status: string;
    trialActive: string;
    daysRemaining: string;
    trialEnds: string;
    nextBillingDate: string;
    price: string;
    provider: string;
    paymentStatus: string;
    kid: string;
    invoices: string;
    invoiceNumber: string;
    amount: string;
    dueDate: string;
    cancelSubscription: string;
    cancelPlaceholder: string;
    noSubscription: string;
    noInvoices: string;
    planTypeLabels: Record<string, string>;
    providerLabels: Record<string, string>;
    paymentStatusLabels: Record<string, string>;
    subscriptionStatusLabels: Record<string, string>;
    invoiceStatusLabels: Record<string, string>;
    pulseLabel: string;
  };
};

export default function CustomerBillingPanel({ locale, labels }: CustomerBillingPanelProps) {
  const [overview, setOverview] = useState<CustomerBillingOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_customer_billing_overview");

      if (!cancelled) {
        setOverview(error || !data ? null : (data as CustomerBillingOverview));
        setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-500">{labels.loading}</p>;
  }

  if (!overview?.subscription && !overview?.payment_profile) {
    return (
      <div className="mx-auto max-w-4xl">
        <AipifyBillingDocumentHeader
          title={labels.title}
          subtitle={labels.subtitle}
          pulseLabel={labels.pulseLabel}
        />
        <AipifyEmptyState message={labels.empty} pulseLabel={labels.pulseLabel} />
      </div>
    );
  }

  const { subscription, payment_profile, invoices } = overview;
  const trialActive = subscription
    ? isTrialActive(subscription.status, subscription.trial_ends_at)
    : false;
  const trialDays = getTrialDaysRemaining(subscription?.trial_ends_at);

  return (
    <div className="mx-auto max-w-4xl">
      <AipifyBillingDocumentHeader
        title={labels.title}
        subtitle={labels.subtitle}
        pulseLabel={labels.pulseLabel}
      />

      <div className="grid gap-6">
        {subscription ? (
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{labels.plan}</h2>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {subscription.plan_name}
                </p>
              </div>
              <StatusBadge
                status={subscription.status}
                label={
                  labels.subscriptionStatusLabels[subscription.status] ??
                  subscription.status
                }
              />
            </div>

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
              <Row
                label={labels.planType}
                value={
                  labels.planTypeLabels[subscription.plan_type] ??
                  subscription.plan_type
                }
              />
              <Row
                label={labels.price}
                value={`${subscription.price_amount} ${subscription.currency} / ${subscription.billing_cycle}`}
              />
              <Row
                label={labels.nextBillingDate}
                value={formatDate(subscription.next_billing_date, locale)}
              />
            </dl>
          </section>
        ) : (
          <p className="text-sm text-gray-500">{labels.noSubscription}</p>
        )}

        {payment_profile && (
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">{labels.paymentStatus}</h2>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
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
              {payment_profile.kid_number && (
                <Row label={labels.kid} value={payment_profile.kid_number} mono />
              )}
            </dl>
          </section>
        )}

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.invoices}</h2>
          {invoices.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">{labels.noInvoices}</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead>
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="py-2 pr-4">{labels.invoiceNumber}</th>
                    <th className="py-2 pr-4">{labels.status}</th>
                    <th className="py-2 pr-4">{labels.amount}</th>
                    <th className="py-2">{labels.dueDate}</th>
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
                            labels.invoiceStatusLabels[invoice.status] ??
                            invoice.status
                          }
                        />
                      </td>
                      <td className="py-3 pr-4 text-sm">
                        {invoice.amount} {invoice.currency}
                      </td>
                      <td className="py-3 text-sm text-gray-600">
                        {formatDate(invoice.due_date, locale)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 p-6">
          <button
            type="button"
            disabled
            className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-400"
            title={labels.cancelPlaceholder}
          >
            {labels.cancelSubscription}
          </button>
          <p className="mt-2 text-xs text-gray-500">{labels.cancelPlaceholder}</p>
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
      <dd className={`text-gray-900 ${mono ? "font-mono" : ""}`}>{value}</dd>
    </div>
  );
}
