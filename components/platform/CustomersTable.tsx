"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AipifyEmptyState } from "@/components/branding";
import { formatDate } from "@/lib/i18n/format-date";
import { createClient } from "@/lib/supabase/client";
import { computeCustomerHealth } from "@/lib/platform/ai-dashboard";
import type { CustomerRecord, CustomerStatus, CustomerType } from "@/lib/platform/types";
import CustomerHealthBadge from "./CustomerHealthBadge";
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
    filterWorkspaceType: string;
    filterVerification: string;
    filterEnterprise: string;
    customerNumber: string;
    name: string;
    owner: string;
    type: string;
    plan: string;
    status: string;
    health: string;
    healthLabels: {
      healthy: string;
      attention: string;
      atRisk: string;
    };
    trialRemaining: string;
    installations: string;
    users: string;
    country: string;
    phone: string;
    organizationNumber: string;
    industry: string;
    workspaceType: string;
    verification: string;
    twoFactor: string;
    growthPartner: string;
    employeeSize: string;
    website: string;
    enterprise: string;
    created: string;
    actions: string;
    view: string;
    contact: string;
    quickActive: string;
    quickPaused: string;
    quickCancelled: string;
    days: string;
    statusLabels: Record<string, string>;
    typeLabels: Record<string, string>;
    workspaceTypeLabels: Record<string, string>;
    verificationLabels: Record<string, string>;
    twoFactorLabels: Record<string, string>;
    growthPartnerLabels: Record<string, string>;
    enterpriseLabels: Record<string, string>;
    pulseLabel: string;
  };
};

export default function CustomersTable({ locale, labels }: CustomersTableProps) {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<CustomerType | "all">("all");
  const [workspaceFilter, setWorkspaceFilter] = useState<string>("all");
  const [verificationFilter, setVerificationFilter] = useState<string>("all");
  const [enterpriseFilter, setEnterpriseFilter] = useState<"all" | "yes" | "no">("all");

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

  const workspaceOptions = useMemo(() => {
    const values = new Set<string>();
    customers.forEach((c) => {
      if (c.workspace_type) values.add(c.workspace_type);
    });
    return Array.from(values).sort();
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return customers.filter((customer) => {
      if (statusFilter !== "all" && customer.status !== statusFilter) return false;
      if (typeFilter !== "all" && customer.customer_type !== typeFilter) return false;
      if (workspaceFilter !== "all" && customer.workspace_type !== workspaceFilter) return false;
      if (verificationFilter !== "all" && customer.verification_status !== verificationFilter) return false;
      if (enterpriseFilter === "yes" && !customer.enterprise_candidate) return false;
      if (enterpriseFilter === "no" && customer.enterprise_candidate) return false;
      if (!query) return true;

      const haystack = [
        customer.customer_number,
        customer.display_name,
        customer.email,
        customer.country,
        customer.plan_name ?? "",
        customer.owner_name ?? "",
        customer.phone ?? "",
        customer.organization_number ?? "",
        customer.industry ?? "",
        customer.website ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [customers, search, statusFilter, typeFilter, workspaceFilter, verificationFilter, enterpriseFilter]);

  const statusOptions: CustomerStatus[] = [
    "trial",
    "active",
    "paused",
    "cancelled",
    "overdue",
  ];

  const typeOptions: CustomerType[] = ["company", "private"];

  return (
    <div className="mx-auto max-w-[1600px]">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {labels.title}
        </h1>
        <p className="mt-2 text-base text-gray-500">{labels.subtitle}</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(
          [
            { value: "all", label: labels.filterAll },
            { value: "active", label: labels.quickActive },
            { value: "paused", label: labels.quickPaused },
            { value: "cancelled", label: labels.quickCancelled },
          ] as const
        ).map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setStatusFilter(option.value)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              statusFilter === option.value
                ? "bg-violet-600 text-white shadow-sm"
                : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={labels.search}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100 lg:max-w-sm"
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
        <select
          value={workspaceFilter}
          onChange={(event) => setWorkspaceFilter(event.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
        >
          <option value="all">{labels.filterWorkspaceType}</option>
          {workspaceOptions.map((type) => (
            <option key={type} value={type}>
              {labels.workspaceTypeLabels[type] ?? type}
            </option>
          ))}
        </select>
        <select
          value={verificationFilter}
          onChange={(event) => setVerificationFilter(event.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
        >
          <option value="all">{labels.filterVerification}</option>
          {["pending", "verified", "rejected"].map((status) => (
            <option key={status} value={status}>
              {labels.verificationLabels[status] ?? status}
            </option>
          ))}
        </select>
        <select
          value={enterpriseFilter}
          onChange={(event) => setEnterpriseFilter(event.target.value as "all" | "yes" | "no")}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
        >
          <option value="all">{labels.filterEnterprise}</option>
          <option value="yes">{labels.enterpriseLabels.yes}</option>
          <option value="no">{labels.enterpriseLabels.no}</option>
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
                  <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{labels.customerNumber}</th>
                  <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{labels.name}</th>
                  <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{labels.owner}</th>
                  <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{labels.workspaceType}</th>
                  <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{labels.industry}</th>
                  <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{labels.employeeSize}</th>
                  <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{labels.status}</th>
                  <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{labels.verification}</th>
                  <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{labels.twoFactor}</th>
                  <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{labels.growthPartner}</th>
                  <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{labels.enterprise}</th>
                  <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{labels.phone}</th>
                  <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{labels.organizationNumber}</th>
                  <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{labels.website}</th>
                  <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{labels.plan}</th>
                  <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{labels.health}</th>
                  <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{labels.created}</th>
                  <th className="px-3 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">{labels.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50/60">
                    <td className="whitespace-nowrap px-3 py-4 font-mono text-sm font-medium text-gray-900">
                      {customer.customer_number}
                    </td>
                    <td className="px-3 py-4 text-sm font-semibold text-gray-900">
                      {customer.display_name}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-600">{customer.owner_name ?? "—"}</td>
                    <td className="px-3 py-4 text-sm text-gray-600">
                      {customer.workspace_type
                        ? labels.workspaceTypeLabels[customer.workspace_type] ?? customer.workspace_type
                        : "—"}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-600">{customer.industry ?? "—"}</td>
                    <td className="px-3 py-4 text-sm text-gray-600">{customer.employee_size ?? "—"}</td>
                    <td className="px-3 py-4">
                      <StatusBadge
                        status={customer.status}
                        label={labels.statusLabels[customer.status] ?? customer.status}
                      />
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-600">
                      {customer.verification_status
                        ? labels.verificationLabels[customer.verification_status] ?? customer.verification_status
                        : "—"}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-600">
                      {customer.two_factor_status
                        ? labels.twoFactorLabels[customer.two_factor_status] ?? customer.two_factor_status
                        : "—"}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-600">
                      {customer.growth_partner_status
                        ? labels.growthPartnerLabels[customer.growth_partner_status] ?? customer.growth_partner_status
                        : "—"}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-600">
                      {customer.enterprise_candidate ? labels.enterpriseLabels.yes : labels.enterpriseLabels.no}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-600">{customer.phone ?? "—"}</td>
                    <td className="px-3 py-4 text-sm text-gray-600">{customer.organization_number ?? "—"}</td>
                    <td className="px-3 py-4 text-sm text-gray-600">
                      {customer.website ? (
                        <a href={customer.website.startsWith("http") ? customer.website : `https://${customer.website}`}
                          target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:text-violet-700">
                          {customer.website}
                        </a>
                      ) : "—"}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-600">{customer.plan_name ?? "—"}</td>
                    <td className="px-3 py-4">
                      <CustomerHealthBadge
                        health={computeCustomerHealth(customer)}
                        labels={labels.healthLabels}
                      />
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-600">
                      {formatDate(customer.created_at, locale)}
                    </td>
                    <td className="px-3 py-4 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <Link
                          href={`/platform/customers/${customer.id}`}
                          className="text-sm font-semibold text-violet-600 hover:text-violet-700"
                        >
                          {labels.view}
                        </Link>
                        <a
                          href={`mailto:${customer.email}`}
                          className="text-sm font-medium text-gray-500 hover:text-gray-700"
                        >
                          {labels.contact}
                        </a>
                      </div>
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
