"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AipifyBillingDocumentHeader, AipifyEmptyState } from "@/components/branding";
import { createClient } from "@/lib/supabase/client";
import { getTrialDaysRemaining, isTrialActive } from "@/lib/platform/trial";
import type { SubscriptionRow } from "@/lib/platform/types";
import StatusBadge from "./StatusBadge";

type SubscriptionsPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    customer: string;
    customerNumber: string;
    plan: string;
    planType: string;
    status: string;
    trial: string;
    price: string;
    billingCycle: string;
    daysRemaining: string;
    nextBillingDate: string;
    provider: string;
    paymentStatus: string;
    statusLabels: Record<string, string>;
    planTypeLabels: Record<string, string>;
    providerLabels: Record<string, string>;
    paymentStatusLabels: Record<string, string>;
    pulseLabel: string;
  };
};

export default function SubscriptionsPanel({ labels }: SubscriptionsPanelProps) {
  const [rows, setRows] = useState<SubscriptionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("list_platform_subscriptions");

      if (!cancelled) {
        setRows(error || !data ? [] : (data as SubscriptionRow[]));
        setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl">
      <AipifyBillingDocumentHeader
        title={labels.title}
        subtitle={labels.subtitle}
        pulseLabel={labels.pulseLabel}
      />

      {loading ? (
        <p className="text-sm text-gray-500">{labels.loading}</p>
      ) : rows.length === 0 ? (
        <AipifyEmptyState message={labels.empty} pulseLabel={labels.pulseLabel} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.customerNumber}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.customer}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.plan}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.status}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.trial}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.nextBillingDate}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.provider}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.price}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row) => {
                  const trialActive = isTrialActive(row.status, row.trial_ends_at);
                  const daysLeft = getTrialDaysRemaining(row.trial_ends_at);

                  return (
                    <tr key={row.id} className="hover:bg-gray-50/60">
                      <td className="whitespace-nowrap px-6 py-4 font-mono text-sm">
                        {row.customer_number}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/platform/customers/${row.customer_id}`}
                          className="text-sm font-semibold text-violet-600 hover:text-violet-700"
                        >
                          {row.display_name}
                        </Link>
                        <p className="mt-1 text-xs text-gray-500">
                          {labels.planTypeLabels[row.plan_type] ?? row.plan_type}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {row.plan_name}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge
                          status={row.status}
                          label={labels.statusLabels[row.status] ?? row.status}
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {trialActive
                          ? `${labels.daysRemaining}: ${daysLeft ?? 0}`
                          : "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {row.next_billing_date ?? "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {row.provider
                          ? labels.providerLabels[row.provider] ?? row.provider
                          : "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {row.price_amount} {row.currency} / {row.billing_cycle}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
