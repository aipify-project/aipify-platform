"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { BillingProfileRow } from "@/lib/platform/types";

type BillingPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    customer: string;
    customerNumber: string;
    billingName: string;
    billingEmail: string;
    address: string;
    paymentMethod: string;
    currency: string;
    paymentMethodLabels: Record<string, string>;
  };
};

export default function BillingPanel({ labels }: BillingPanelProps) {
  const [rows, setRows] = useState<BillingProfileRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("list_platform_billing_profiles");

      if (!cancelled) {
        setRows(error || !data ? [] : (data as BillingProfileRow[]));
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {labels.title}
        </h1>
        <p className="mt-2 text-base text-gray-500">{labels.subtitle}</p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">{labels.loading}</p>
      ) : rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 p-6 text-sm text-gray-500">
          {labels.empty}
        </p>
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
                    {labels.billingName}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.billingEmail}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.address}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.paymentMethod}
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
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{row.billing_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{row.billing_email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {row.billing_address}, {row.postal_code} {row.city}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {labels.paymentMethodLabels[row.payment_method] ?? row.payment_method} ·{" "}
                      {row.currency}
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
