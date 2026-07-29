"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import type {
  PlatformPortalCustomerRecord,
  PlatformPortalCustomersLabels,
  PlatformPortalCustomersPayload,
} from "@/lib/platform-portal";

type PlatformPortalCustomersPanelProps = {
  labels: PlatformPortalCustomersLabels;
  locale: string;
};

type MetricVariant = "neutral" | "info" | "success" | "warning" | "danger" | "muted";

type AttributionFilter = "all" | "partner" | "direct";

const NO_SUBSCRIPTION_FILTER = "__none__";

const METRIC_VARIANT_STYLES: Record<
  MetricVariant,
  { card: string; label: string; value: string; marker: string }
> = {
  neutral: {
    card: "border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-900/50",
    label: "text-slate-500 dark:text-slate-400",
    value: "text-slate-900 dark:text-slate-100",
    marker: "bg-slate-400 ring-slate-200 dark:bg-slate-500 dark:ring-slate-700",
  },
  info: {
    card: "border-violet-200/90 bg-violet-50/70 dark:border-violet-800/70 dark:bg-violet-950/35",
    label: "text-violet-800/80 dark:text-violet-300/90",
    value: "text-violet-950 dark:text-violet-50",
    marker: "bg-violet-500 ring-violet-200 dark:bg-violet-400 dark:ring-violet-900",
  },
  success: {
    card: "border-emerald-200/90 bg-emerald-50/70 dark:border-emerald-800/70 dark:bg-emerald-950/35",
    label: "text-emerald-800/80 dark:text-emerald-300/90",
    value: "text-emerald-950 dark:text-emerald-50",
    marker: "bg-emerald-500 ring-emerald-200 dark:bg-emerald-400 dark:ring-emerald-900",
  },
  warning: {
    card: "border-amber-200/90 bg-amber-50/70 dark:border-amber-800/70 dark:bg-amber-950/35",
    label: "text-amber-800/80 dark:text-amber-300/90",
    value: "text-amber-950 dark:text-amber-50",
    marker: "bg-amber-500 ring-amber-200 dark:bg-amber-400 dark:ring-amber-900",
  },
  danger: {
    card: "border-rose-200/90 bg-rose-50/70 dark:border-rose-800/70 dark:bg-rose-950/35",
    label: "text-rose-800/80 dark:text-rose-300/90",
    value: "text-rose-950 dark:text-rose-50",
    marker: "bg-rose-500 ring-rose-200 dark:bg-rose-400 dark:ring-rose-900",
  },
  muted: {
    card: "border-slate-200 bg-slate-50/60 dark:border-slate-700 dark:bg-slate-900/40",
    label: "text-slate-500 dark:text-slate-400",
    value: "text-slate-700 dark:text-slate-300",
    marker: "bg-slate-400 ring-slate-200 dark:bg-slate-500 dark:ring-slate-700",
  },
};

const BADGE_STYLES: Record<MetricVariant, string> = {
  neutral:
    "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-600 dark:bg-slate-800/70 dark:text-slate-200",
  info: "border-violet-200 bg-violet-50 text-violet-800 dark:border-violet-700 dark:bg-violet-950/50 dark:text-violet-200",
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200",
  warning:
    "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-200",
  danger:
    "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-700 dark:bg-rose-950/50 dark:text-rose-200",
  muted:
    "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300",
};

function isCustomersPayload(value: unknown): value is PlatformPortalCustomersPayload {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  if (!row.summary || typeof row.summary !== "object" || Array.isArray(row.summary)) {
    return false;
  }
  return Array.isArray(row.customers);
}

function MetricCard({
  label,
  value,
  variant = "neutral",
}: {
  label: string;
  value: string | number;
  variant?: MetricVariant;
}) {
  const styles = METRIC_VARIANT_STYLES[variant];

  return (
    <div
      className={`flex h-full flex-col rounded-xl border px-4 py-3.5 shadow-sm ${styles.card}`}
      data-variant={variant}
    >
      <div className="flex items-start justify-between gap-3">
        <dt className={`text-xs font-medium uppercase tracking-wide ${styles.label}`}>{label}</dt>
        <span
          className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ring-2 ${styles.marker}`}
          aria-hidden="true"
          data-status={variant}
        />
      </div>
      <dd className={`mt-2 text-2xl font-semibold tabular-nums tracking-tight ${styles.value}`}>
        {value}
      </dd>
    </div>
  );
}

function StatusBadge({
  label,
  variant,
}: {
  label: string;
  variant: MetricVariant;
}) {
  return (
    <span
      className={`inline-flex max-w-full items-center rounded-md border px-2 py-0.5 text-xs font-medium ${BADGE_STYLES[variant]}`}
      data-variant={variant}
    >
      <span className="truncate">{label}</span>
    </span>
  );
}

function customerStatusVariant(status: string | null): MetricVariant {
  switch ((status ?? "").toLowerCase()) {
    case "active":
      return "success";
    case "trial":
      return "info";
    case "paused":
      return "warning";
    case "overdue":
      return "danger";
    case "cancelled":
    case "canceled":
      return "muted";
    default:
      return "muted";
  }
}

function subscriptionStatusVariant(status: string | null): MetricVariant {
  switch ((status ?? "").toLowerCase()) {
    case "active":
      return "success";
    case "trialing":
      return "info";
    case "past_due":
    case "unpaid":
      return "danger";
    case "paused":
      return "warning";
    case "cancelled":
    case "canceled":
      return "muted";
    default:
      return "muted";
  }
}

function planSecondaryText(customer: PlatformPortalCustomerRecord): string | null {
  return (
    customer.subscriptionPlanName ||
    customer.subscriptionPlanKey ||
    customer.subscriptionPlanType ||
    null
  );
}

function uniqueInOrder(values: Array<string | null | undefined>): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    if (value == null || value === "") continue;
    if (seen.has(value)) continue;
    seen.add(value);
    result.push(value);
  }
  return result;
}

function matchesSearch(customer: PlatformPortalCustomerRecord, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  const fields = [
    customer.legalName,
    customer.organizationNumber,
    customer.organizationSlug,
    customer.primaryContactName,
  ];
  return fields.some((field) => (field ?? "").toLowerCase().includes(normalized));
}

function formatActivity(value: string | null, locale: string, fallback: string): string {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function PlatformPortalCustomersPanel({
  labels,
  locale,
}: PlatformPortalCustomersPanelProps) {
  const [payload, setPayload] = useState<PlatformPortalCustomersPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [subscriptionFilter, setSubscriptionFilter] = useState("all");
  const [attributionFilter, setAttributionFilter] = useState<AttributionFilter>("all");

  const load = useCallback(async () => {
    setLoadError(false);
    setLoading(true);
    setPayload(null);

    try {
      const res = await fetch("/api/platform-portal/customers", {
        cache: "no-store",
      });
      if (!res.ok) {
        setLoadError(true);
        return;
      }

      let body: unknown;
      try {
        body = await res.json();
      } catch {
        setLoadError(true);
        return;
      }

      if (!isCustomersPayload(body)) {
        setLoadError(true);
        return;
      }

      setPayload(body);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtersActive =
    search.trim().length > 0 ||
    statusFilter !== "all" ||
    subscriptionFilter !== "all" ||
    attributionFilter !== "all";

  const clearFilters = useCallback(() => {
    setSearch("");
    setStatusFilter("all");
    setSubscriptionFilter("all");
    setAttributionFilter("all");
  }, []);

  const statusOptions = useMemo(
    () => (payload ? uniqueInOrder(payload.customers.map((row) => row.customerStatus)) : []),
    [payload],
  );

  const subscriptionOptions = useMemo(() => {
    if (!payload) return { statuses: [] as string[], hasMissing: false };
    const statuses = uniqueInOrder(payload.customers.map((row) => row.subscriptionStatus));
    const hasMissing = payload.customers.some((row) => !row.subscriptionStatus);
    return { statuses, hasMissing };
  }, [payload]);

  const visibleCustomers = useMemo(() => {
    if (!payload) return [];
    return payload.customers.filter((customer) => {
      if (!matchesSearch(customer, search)) return false;

      if (statusFilter !== "all") {
        if ((customer.customerStatus ?? "") !== statusFilter) return false;
      }

      if (subscriptionFilter !== "all") {
        if (subscriptionFilter === NO_SUBSCRIPTION_FILTER) {
          if (customer.subscriptionStatus) return false;
        } else if ((customer.subscriptionStatus ?? "") !== subscriptionFilter) {
          return false;
        }
      }

      if (attributionFilter === "partner" && !customer.isPartnerAttributed) return false;
      if (attributionFilter === "direct" && customer.isPartnerAttributed) return false;

      return true;
    });
  }, [payload, search, statusFilter, subscriptionFilter, attributionFilter]);

  if (loading) {
    return (
      <div
        className="flex min-h-[60vh] w-full items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <AipifyLoader centered label={labels.loading} />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {labels.title}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {labels.description}
          </p>
        </div>
        <Link
          href="/platform/customers/new"
          className="inline-flex shrink-0 items-center justify-center rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 dark:bg-violet-500 dark:hover:bg-violet-400"
        >
          {labels.createCustomer}
        </Link>
      </header>

      {loadError || !payload ? (
        <div
          role="alert"
          className="flex flex-col gap-4 rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 shadow-sm sm:flex-row sm:items-start sm:justify-between dark:border-rose-800/80 dark:bg-rose-950/40"
        >
          <div className="flex min-w-0 items-start gap-3">
            <span
              className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/70 dark:text-rose-300"
              aria-hidden="true"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.168 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 6.75a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 6.75Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <p className="text-sm font-medium text-rose-950 dark:text-rose-50">{labels.error}</p>
          </div>
          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-rose-300 bg-white px-4 py-2 text-sm font-medium text-rose-900 shadow-sm transition hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 dark:border-rose-700 dark:bg-rose-950 dark:text-rose-50 dark:hover:bg-rose-900"
          >
            {labels.retry}
          </button>
        </div>
      ) : (
        <>
          <section
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-950/40"
            aria-label={labels.title}
          >
            <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                label={labels.summaryTotal}
                value={payload.summary.total}
                variant="info"
              />
              <MetricCard
                label={labels.summaryActive}
                value={payload.summary.active}
                variant="success"
              />
              <MetricCard
                label={labels.summaryNew}
                value={payload.summary.new30d}
                variant="neutral"
              />
              <MetricCard
                label={labels.summaryAttention}
                value={payload.summary.requiresAttention}
                variant={payload.summary.requiresAttention > 0 ? "warning" : "success"}
              />
            </dl>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-950/40">
            <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-4">
                <label
                  htmlFor="platform-portal-customers-search"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400"
                >
                  {labels.searchPlaceholder}
                </label>
                <input
                  id="platform-portal-customers-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={labels.searchPlaceholder}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-violet-500 dark:focus:ring-violet-900/60"
                />
              </div>

              <div className="lg:col-span-2">
                <label
                  htmlFor="platform-portal-customers-status"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400"
                >
                  {labels.filterStatus}
                </label>
                <select
                  id="platform-portal-customers-status"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-violet-500 dark:focus:ring-violet-900/60"
                >
                  <option value="all">{labels.filterAll}</option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {labels.customerStatuses[status] ?? labels.notAvailable}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-2">
                <label
                  htmlFor="platform-portal-customers-subscription"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400"
                >
                  {labels.filterSubscription}
                </label>
                <select
                  id="platform-portal-customers-subscription"
                  value={subscriptionFilter}
                  onChange={(event) => setSubscriptionFilter(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-violet-500 dark:focus:ring-violet-900/60"
                >
                  <option value="all">{labels.filterAll}</option>
                  {subscriptionOptions.statuses.map((status) => (
                    <option key={status} value={status}>
                      {labels.subscriptionStatuses[status] ?? labels.notAvailable}
                    </option>
                  ))}
                  {subscriptionOptions.hasMissing ? (
                    <option value={NO_SUBSCRIPTION_FILTER}>{labels.noSubscription}</option>
                  ) : null}
                </select>
              </div>

              <div className="lg:col-span-2">
                <label
                  htmlFor="platform-portal-customers-attribution"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400"
                >
                  {labels.filterAttribution}
                </label>
                <select
                  id="platform-portal-customers-attribution"
                  value={attributionFilter}
                  onChange={(event) =>
                    setAttributionFilter(event.target.value as AttributionFilter)
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-violet-500 dark:focus:ring-violet-900/60"
                >
                  <option value="all">{labels.filterAll}</option>
                  <option value="partner">{labels.filterPartner}</option>
                  <option value="direct">{labels.filterDirect}</option>
                </select>
              </div>

              <div className="lg:col-span-2">
                {filtersActive ? (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex w-full items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    {labels.clearFilters}
                  </button>
                ) : (
                  <div className="hidden lg:block" aria-hidden="true" />
                )}
              </div>
            </div>
          </section>

          {payload.customers.length === 0 || visibleCustomers.length === 0 ? (
            <section className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm dark:border-slate-700 dark:bg-slate-950/40">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                {labels.emptyTitle}
              </h2>
              <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600 dark:text-slate-400">
                {labels.emptyDescription}
              </p>
              {payload.customers.length > 0 && filtersActive ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {labels.clearFilters}
                </button>
              ) : null}
            </section>
          ) : (
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-950/40">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-left text-sm">
                  <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50/95 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
                    <tr>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                      >
                        {labels.columnCustomer}
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                      >
                        {labels.columnOrganizationNumber}
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                      >
                        {labels.columnStatus}
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                      >
                        {labels.columnSubscription}
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                      >
                        {labels.columnMembers}
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                      >
                        {labels.columnAttribution}
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                      >
                        {labels.columnSupport}
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                      >
                        {labels.columnLastActivity}
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                      >
                        {labels.columnActions}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {visibleCustomers.map((customer) => {
                      const customerStatusLabel = customer.customerStatus
                        ? labels.customerStatuses[customer.customerStatus] ?? labels.notAvailable
                        : labels.notAvailable;
                      const subscriptionStatusLabel = customer.subscriptionStatus
                        ? labels.subscriptionStatuses[customer.subscriptionStatus] ??
                          labels.notAvailable
                        : null;
                      const planText = planSecondaryText(customer);
                      const legalName = customer.legalName.trim()
                        ? customer.legalName
                        : labels.notAvailable;

                      return (
                        <tr
                          key={customer.customerId}
                          className="transition hover:bg-slate-50/80 dark:hover:bg-slate-900/50"
                        >
                          <td className="max-w-[18rem] px-4 py-3 align-top">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="truncate font-medium text-slate-900 dark:text-slate-100">
                                  {legalName}
                                </p>
                                {customer.requiresAttention ? (
                                  <StatusBadge
                                    label={labels.requiresAttention}
                                    variant="warning"
                                  />
                                ) : null}
                              </div>
                              {customer.organizationSlug ? (
                                <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                                  {customer.organizationSlug}
                                </p>
                              ) : null}
                              {customer.primaryContactName ? (
                                <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                                  {customer.primaryContactName}
                                </p>
                              ) : null}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 align-top text-slate-700 dark:text-slate-300">
                            {customer.organizationNumber?.trim()
                              ? customer.organizationNumber
                              : labels.notAvailable}
                          </td>
                          <td className="px-4 py-3 align-top">
                            <StatusBadge
                              label={customerStatusLabel}
                              variant={customerStatusVariant(customer.customerStatus)}
                            />
                          </td>
                          <td className="min-w-[12rem] px-4 py-3 align-top">
                            {customer.subscriptionStatus ? (
                              <div className="space-y-1.5">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <StatusBadge
                                    label={
                                      subscriptionStatusLabel ?? labels.notAvailable
                                    }
                                    variant={subscriptionStatusVariant(
                                      customer.subscriptionStatus,
                                    )}
                                  />
                                  {customer.isLifetime ? (
                                    <StatusBadge label={labels.lifetime} variant="info" />
                                  ) : null}
                                </div>
                                {planText ? (
                                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                                    {planText}
                                  </p>
                                ) : null}
                              </div>
                            ) : (
                              <StatusBadge
                                label={labels.noSubscription}
                                variant={
                                  customer.requiresAttention ? "warning" : "neutral"
                                }
                              />
                            )}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 align-top tabular-nums text-slate-800 dark:text-slate-200">
                            {customer.memberCount}
                          </td>
                          <td className="px-4 py-3 align-top">
                            <StatusBadge
                              label={
                                customer.isPartnerAttributed
                                  ? labels.partnerCustomer
                                  : labels.directCustomer
                              }
                              variant={customer.isPartnerAttributed ? "info" : "neutral"}
                            />
                          </td>
                          <td className="px-4 py-3 align-top">
                            {customer.openSupportCount > 0 ? (
                              <StatusBadge
                                label={String(customer.openSupportCount)}
                                variant="warning"
                              />
                            ) : (
                              <StatusBadge
                                label={labels.noOpenSupport}
                                variant="success"
                              />
                            )}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 align-top text-slate-700 dark:text-slate-300">
                            {formatActivity(
                              customer.lastActivityAt,
                              locale,
                              labels.notAvailable,
                            )}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 align-top text-right">
                            <Link
                              href={`/platform/customers/${customer.customerId}`}
                              className="inline-flex items-center rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-900 transition hover:border-violet-300 hover:bg-violet-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-100 dark:hover:bg-violet-900/60"
                            >
                              {labels.openCustomer}
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
