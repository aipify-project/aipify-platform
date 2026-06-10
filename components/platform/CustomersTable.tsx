"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AipifyEmptyState } from "@/components/branding";
import { formatDate } from "@/lib/i18n/format-date";
import { createClient } from "@/lib/supabase/client";
import type { CustomerRecord, CustomerStatus, CustomerType } from "@/lib/platform/types";
import StatusBadge from "./StatusBadge";

type CustomersTableProps = {
  locale: string;
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    search: string;
    filterStatus: string;
    filterType: string;
    filterAll: string;
    customerNumber: string;
    name: string;
    type: string;
    plan: string;
    status: string;
    trialRemaining: string;
    installations: string;
    users: string;
    country: string;
    created: string;
    actions: string;
    view: string;
    days: string;
    statusLabels: Record<string, string>;
    typeLabels: Record<string, string>;
    pulseLabel: string;
  };
};

export default function CustomersTable({ locale, labels }: CustomersTableProps) {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<CustomerType | "all">("all");

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

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return customers.filter((customer) => {
      if (statusFilter !== "all" && customer.status !== statusFilter) return false;
      if (typeFilter !== "all" && customer.customer_type !== typeFilter) return false;
      if (!query) return true;

      const haystack = [
        customer.customer_number,
        customer.display_name,
        customer.email,
        customer.country,
        customer.plan_name ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [customers, search, statusFilter, typeFilter]);

  const statusOptions: CustomerStatus[] = [
    "trial",
    "active",
    "paused",
    "cancelled",
    "overdue",
  ];

  const typeOptions: CustomerType[] = ["company", "private"];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {labels.title}
        </h1>
        <p className="mt-2 text-base text-gray-500">{labels.subtitle}</p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={labels.search}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100 sm:max-w-sm"
        />
        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value as CustomerStatus | "all")
          }
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
        >
          <option value="all">{labels.filterAll}</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {labels.statusLabels[status] ?? status}
            </option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value as CustomerType | "all")}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
        >
          <option value="all">{labels.filterType}</option>
          {typeOptions.map((type) => (
            <option key={type} value={type}>
              {labels.typeLabels[type] ?? type}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">{labels.loading}</p>
      ) : filteredCustomers.length === 0 ? (
        <AipifyEmptyState message={labels.empty} pulseLabel={labels.pulseLabel} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.customerNumber}
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.name}
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.type}
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.plan}
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.status}
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.trialRemaining}
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.installations}
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.users}
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.country}
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.created}
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50/60">
                    <td className="whitespace-nowrap px-4 py-4 font-mono text-sm font-medium text-gray-900">
                      {customer.customer_number}
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                      {customer.display_name}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge
                        status={customer.customer_type}
                        label={
                          labels.typeLabels[customer.customer_type] ?? customer.customer_type
                        }
                      />
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {customer.plan_name ?? "—"}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge
                        status={customer.status}
                        label={labels.statusLabels[customer.status] ?? customer.status}
                      />
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {customer.trial_days_remaining != null
                        ? `${customer.trial_days_remaining} ${labels.days}`
                        : "—"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {customer.installation_count}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">{customer.user_count}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{customer.country}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {formatDate(customer.created_at, locale)}
                    </td>
                    <td className="px-4 py-4 text-right">
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
