"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AipifyBillingDocumentHeader, AipifyEmptyState } from "@/components/branding";
import { createClient } from "@/lib/supabase/client";
import type { PaymentProfileRow } from "@/lib/platform/types";
import StatusBadge from "./StatusBadge";

type BillingPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    customer: string;
    customerNumber: string;
    billingEmail: string;
    address: string;
    provider: string;
    paymentStatus: string;
    kid: string;
    providerCustomerId: string;
    providerMandateId: string;
    providerLabels: Record<string, string>;
    paymentStatusLabels: Record<string, string>;
    pulseLabel: string;
  };
};

export default function BillingPanel({ labels }: BillingPanelProps) {
  const [rows, setRows] = useState<PaymentProfileRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("list_platform_payment_profiles");

      if (!cancelled) {
        setRows(error || !data ? [] : (data as PaymentProfileRow[]));
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
                    {labels.provider}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.paymentStatus}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.kid}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.billingEmail}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row) => (
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
                        {row.billing_address}, {row.postal_code} {row.city}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {labels.providerLabels[row.provider] ?? row.provider}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge
                        status={row.payment_status}
                        label={
                          labels.paymentStatusLabels[row.payment_status] ??
                          row.payment_status
                        }
                      />
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-gray-600">
                      {row.kid_number ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {row.billing_email}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
