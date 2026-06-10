"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { CustomerRecord } from "@/lib/platform/types";
import StatusBadge from "./StatusBadge";

type CustomersTableProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    customerNumber: string;
    name: string;
    email: string;
    country: string;
    status: string;
    installations: string;
    created: string;
    view: string;
    statusLabels: Record<string, string>;
    typeLabels: Record<string, string>;
  };
};

export default function CustomersTable({ labels }: CustomersTableProps) {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("list_platform_customer_records");

      if (!cancelled) {
        setCustomers(error || !data ? [] : (data as CustomerRecord[]));
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
      ) : customers.length === 0 ? (
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
                    {labels.name}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.email}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.country}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.status}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.installations}
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.view}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50/60">
                    <td className="whitespace-nowrap px-6 py-4 font-mono text-sm font-medium text-gray-900">
                      {customer.customer_number}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900">
                        {customer.display_name}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {labels.typeLabels[customer.customer_type] ?? customer.customer_type}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{customer.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{customer.country}</td>
                    <td className="px-6 py-4">
                      <StatusBadge
                        status={customer.status}
                        label={labels.statusLabels[customer.status] ?? customer.status}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {customer.installation_count}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/platform/customers/${customer.id}`}
                        className="text-sm font-semibold text-violet-600 hover:text-violet-700"
                      >
                        {labels.view}
                      </Link>
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
