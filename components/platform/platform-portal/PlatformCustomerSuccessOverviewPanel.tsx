"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  PlatformCustomerSuccessCustomer,
  PlatformCustomerSuccessLabels,
  PlatformCustomerSuccessOverview,
  PlatformCustomerSuccessStatus,
} from "@/lib/platform-portal/customer-success";
import {
  filterCustomerSuccessCustomers,
  primarySuccessReasonCode,
  successStatusVariant,
} from "@/lib/platform-portal/customer-success";

type PanelProps = {
  labels: PlatformCustomerSuccessLabels;
  locale: string;
};

type MetricVariant = "neutral" | "info" | "success" | "warning" | "danger" | "muted";

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
        />
      </div>
      <dd className={`mt-2 text-2xl font-semibold tabular-nums tracking-tight ${styles.value}`}>
        {value}
      </dd>
    </div>
  );
}

function StatusBadge({ label, variant }: { label: string; variant: MetricVariant }) {
  return (
    <span
      className={`inline-flex max-w-full items-center rounded-md border px-2 py-0.5 text-xs font-medium ${BADGE_STYLES[variant]}`}
      data-variant={variant}
    >
      <span className="truncate">{label}</span>
    </span>
  );
}

function formatTemplate(template: string, count: number): string {
  return template.replace("{count}", String(count));
}

function mapLookup(
  value: string | null | undefined,
  map: Record<string, string>,
  fallback: string,
): string {
  if (!value) return fallback;
  const key = value.trim().toLowerCase();
  return map[key] ?? map[value.trim()] ?? fallback;
}

function formatGeneratedAt(value: string, locale: string): string {
  const ms = Date.parse(value);
  if (Number.isNaN(ms) || ms === 0) return "—";
  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(ms));
  } catch {
    return new Date(ms).toISOString();
  }
}

function TableSkeleton({ labels }: { labels: PlatformCustomerSuccessLabels }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700" aria-hidden="true">
      <div className="grid grid-cols-9 gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/60">
        {[
          labels.columnCustomer,
          labels.columnStatus,
          labels.columnAgreement,
          labels.columnLicenseSetup,
          labels.columnDomains,
          labels.columnInstallations,
          labels.columnServices,
          labels.columnUsers,
          labels.columnFollowUp,
        ].map((col) => (
          <div key={col} className="h-3 rounded bg-slate-200 dark:bg-slate-700" />
        ))}
      </div>
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-9 gap-3 border-b border-slate-100 px-4 py-4 last:border-0 dark:border-slate-800"
        >
          {Array.from({ length: 9 }).map((__, cell) => (
            <div key={cell} className="h-4 rounded bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function PlatformCustomerSuccessOverviewPanel({ labels, locale }: PanelProps) {
  const [overview, setOverview] = useState<PlatformCustomerSuccessOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PlatformCustomerSuccessStatus | "all">("all");
  const [agreementFilter, setAgreementFilter] = useState("all");
  const [licenseFilter, setLicenseFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch("/api/platform-portal/customer-success", {
        method: "GET",
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      if (!response.ok) {
        setError(true);
        setOverview(null);
        return;
      }
      const payload = (await response.json()) as PlatformCustomerSuccessOverview;
      setOverview(payload);
    } catch {
      setError(true);
      setOverview(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    if (!overview) return [];
    return filterCustomerSuccessCustomers(overview.customers, {
      query,
      status: statusFilter,
      agreementStatus: agreementFilter,
      licenseStatus: licenseFilter,
      serviceStatus: serviceFilter,
      countryCode: countryFilter,
    });
  }, [
    overview,
    query,
    statusFilter,
    agreementFilter,
    licenseFilter,
    serviceFilter,
    countryFilter,
  ]);

  const agreementOptions = useMemo(() => {
    const values = new Set<string>();
    for (const customer of overview?.customers ?? []) {
      if (customer.agreement.status) values.add(customer.agreement.status.toLowerCase());
    }
    return Array.from(values).sort();
  }, [overview]);

  const licenseOptions = useMemo(() => {
    const values = new Set<string>();
    for (const customer of overview?.customers ?? []) {
      if (customer.license.primaryStatus) {
        values.add(customer.license.primaryStatus.toLowerCase());
      }
    }
    return Array.from(values).sort();
  }, [overview]);

  const serviceOptions = useMemo(() => {
    const values = new Set<string>();
    for (const customer of overview?.customers ?? []) {
      if (customer.services.websiteKompisStatus) {
        values.add(customer.services.websiteKompisStatus.toLowerCase());
      }
    }
    return Array.from(values).sort();
  }, [overview]);

  const countryOptions = useMemo(() => {
    const values = new Set<string>();
    for (const customer of overview?.customers ?? []) {
      if (customer.countryCode) values.add(customer.countryCode.toUpperCase());
    }
    return Array.from(values).sort();
  }, [overview]);

  const hasActiveFilters =
    query.trim().length > 0 ||
    statusFilter !== "all" ||
    agreementFilter !== "all" ||
    licenseFilter !== "all" ||
    serviceFilter !== "all" ||
    countryFilter !== "all";

  function resetFilters() {
    setQuery("");
    setStatusFilter("all");
    setAgreementFilter("all");
    setLicenseFilter("all");
    setServiceFilter("all");
    setCountryFilter("all");
  }

  function renderCustomerRow(customer: PlatformCustomerSuccessCustomer) {
    const statusVariant = successStatusVariant(customer.successStatus);
    const primaryReason = primarySuccessReasonCode(customer);
    const primaryReasonLabel =
      labels.reasonCodes[primaryReason] ?? labels.reasonCodes.status_unknown;
    const otherReasons = customer.successReasonCodes.filter((code) => code !== primaryReason);
    const allReasonsTitle = customer.successReasonCodes
      .map((code) => labels.reasonCodes[code] ?? code)
      .join(" · ");

    const agreementStatusLabel = mapLookup(
      customer.agreement.status,
      labels.agreementStatuses,
      labels.notAvailable,
    );
    const durationLabel = customer.agreement.duration
      ? mapLookup(customer.agreement.duration, labels.durationLabels, customer.agreement.duration)
      : null;
    const setupLabel = mapLookup(
      customer.license.provisioningStatus,
      labels.setupStatuses,
      labels.notAvailable,
    );
    const serviceLabel = mapLookup(
      customer.services.websiteKompisStatus,
      labels.serviceStatuses,
      labels.notAvailable,
    );

    return (
      <tr
        key={customer.customerId}
        className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80 dark:border-slate-800 dark:hover:bg-slate-900/40"
      >
        <td className="px-4 py-3 align-top">
          <div className="min-w-0">
            <div className="truncate font-medium text-slate-900 dark:text-slate-100">
              {customer.companyName}
            </div>
            <div className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
              {customer.customerKey}
              {customer.countryCode ? ` · ${customer.countryCode}` : ""}
            </div>
          </div>
        </td>
        <td className="px-4 py-3 align-top">
          <div className="space-y-1">
            <StatusBadge
              label={labels.successStatuses[customer.successStatus]}
              variant={statusVariant}
            />
            <p className="max-w-[16rem] text-xs text-slate-600 dark:text-slate-300" title={allReasonsTitle}>
              {primaryReasonLabel}
              {otherReasons.length > 0
                ? ` · ${formatTemplate(labels.moreReasons, otherReasons.length)}`
                : ""}
            </p>
          </div>
        </td>
        <td className="px-4 py-3 align-top text-sm text-slate-700 dark:text-slate-200">
          <div>{agreementStatusLabel}</div>
          {durationLabel ? (
            <div className="text-xs text-slate-500 dark:text-slate-400">{durationLabel}</div>
          ) : null}
          {customer.agreement.trialEndsAt ? (
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {formatGeneratedAt(customer.agreement.trialEndsAt, locale)}
            </div>
          ) : null}
        </td>
        <td className="px-4 py-3 align-top text-sm text-slate-700 dark:text-slate-200">
          <div>
            {customer.license.activeCount > 0 ? labels.licenseActive : labels.licenseMissing}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{setupLabel}</div>
        </td>
        <td className="px-4 py-3 align-top text-sm text-slate-700 dark:text-slate-200">
          <div>{formatTemplate(labels.domainsCount, customer.domains.count)}</div>
          {customer.domains.count > 0 ? (
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {formatTemplate(labels.verifiedCount, customer.domains.verifiedCount)}
            </div>
          ) : null}
        </td>
        <td className="px-4 py-3 align-top text-sm text-slate-700 dark:text-slate-200">
          <div>{formatTemplate(labels.installationsCount, customer.installations.count)}</div>
          {customer.installations.revokedCount > 0 ? (
            <div className="text-xs font-medium text-rose-700 dark:text-rose-300">
              {formatTemplate(labels.revokedHighlight, customer.installations.revokedCount)}
            </div>
          ) : null}
        </td>
        <td className="px-4 py-3 align-top text-sm text-slate-700 dark:text-slate-200">
          <div>{formatTemplate(labels.servicesCount, customer.services.activeCount)}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {labels.websiteKompis}: {serviceLabel}
          </div>
        </td>
        <td className="px-4 py-3 align-top text-sm tabular-nums text-slate-700 dark:text-slate-200">
          {customer.registeredUsers == null
            ? labels.notAvailable
            : customer.registeredUsers}
        </td>
        <td className="px-4 py-3 align-top">
          <Link
            href={`/platform/customers/${customer.customerId}`}
            className="inline-flex rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-800 transition hover:border-violet-300 hover:text-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-violet-500 dark:hover:text-violet-200"
          >
            {labels.openCustomer}
          </Link>
        </td>
      </tr>
    );
  }

  return (
    <div className="w-full max-w-none space-y-6" data-theme-support="light-dark">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          {labels.title}
        </h1>
        <p className="max-w-3xl text-sm text-slate-600 dark:text-slate-300">{labels.subtitle}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {labels.lastChecked}
          {": "}
          {overview ? formatGeneratedAt(overview.generatedAt, locale) : "—"}
        </p>
      </header>

      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          label={labels.kpiTotal}
          value={overview?.metrics.totalCustomers ?? (loading ? "—" : 0)}
          variant="neutral"
        />
        <MetricCard
          label={labels.kpiHealthy}
          value={overview?.metrics.healthyCustomers ?? (loading ? "—" : 0)}
          variant="success"
        />
        <MetricCard
          label={labels.kpiAttention}
          value={overview?.metrics.attentionCustomers ?? (loading ? "—" : 0)}
          variant="warning"
        />
        <MetricCard
          label={labels.kpiCritical}
          value={overview?.metrics.criticalCustomers ?? (loading ? "—" : 0)}
          variant="danger"
        />
        <MetricCard
          label={labels.kpiIncomplete}
          value={overview?.metrics.incompleteCustomers ?? (loading ? "—" : 0)}
          variant="info"
        />
      </dl>

      <section className="space-y-3" aria-label={labels.title}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap">
            <label className="min-w-[14rem] flex-1 text-xs font-medium text-slate-600 dark:text-slate-300">
              <span className="sr-only">{labels.searchPlaceholder}</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={labels.searchPlaceholder}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-violet-500 focus:ring-2 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
              <span className="sr-only">{labels.filterAll}</span>
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as PlatformCustomerSuccessStatus | "all")
                }
                className="mt-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="all">{labels.filterAll}</option>
                <option value="healthy">{labels.filterHealthy}</option>
                <option value="attention">{labels.filterAttention}</option>
                <option value="critical">{labels.filterCritical}</option>
                <option value="incomplete">{labels.filterIncomplete}</option>
                <option value="unknown">{labels.filterUnknown}</option>
              </select>
            </label>
            {agreementOptions.length > 0 ? (
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                <span className="sr-only">{labels.filterAgreement}</span>
                <select
                  value={agreementFilter}
                  onChange={(event) => setAgreementFilter(event.target.value)}
                  className="mt-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                >
                  <option value="all">{labels.filterAgreement}</option>
                  {agreementOptions.map((value) => (
                    <option key={value} value={value}>
                      {mapLookup(value, labels.agreementStatuses, value)}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            {licenseOptions.length > 0 ? (
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                <span className="sr-only">{labels.filterLicense}</span>
                <select
                  value={licenseFilter}
                  onChange={(event) => setLicenseFilter(event.target.value)}
                  className="mt-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                >
                  <option value="all">{labels.filterLicense}</option>
                  {licenseOptions.map((value) => (
                    <option key={value} value={value}>
                      {mapLookup(value, labels.licenseStatuses, value)}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            {serviceOptions.length > 0 ? (
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                <span className="sr-only">{labels.filterService}</span>
                <select
                  value={serviceFilter}
                  onChange={(event) => setServiceFilter(event.target.value)}
                  className="mt-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                >
                  <option value="all">{labels.filterService}</option>
                  {serviceOptions.map((value) => (
                    <option key={value} value={value}>
                      {mapLookup(value, labels.serviceStatuses, value)}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            {countryOptions.length > 0 ? (
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                <span className="sr-only">{labels.filterCountry}</span>
                <select
                  value={countryFilter}
                  onChange={(event) => setCountryFilter(event.target.value)}
                  className="mt-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                >
                  <option value="all">{labels.filterCountry}</option>
                  {countryOptions.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
          </div>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {labels.clearFilters}
            </button>
          ) : null}
        </div>

        {loading ? <TableSkeleton labels={labels} /> : null}

        {!loading && error ? (
          <div
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-6 dark:border-rose-900 dark:bg-rose-950/40"
            role="alert"
          >
            <h2 className="text-base font-semibold text-rose-900 dark:text-rose-100">
              {labels.errorTitle}
            </h2>
            <p className="mt-1 text-sm text-rose-800 dark:text-rose-200">{labels.errorDescription}</p>
            <button
              type="button"
              onClick={() => void load()}
              className="mt-4 rounded-lg bg-rose-700 px-3 py-2 text-sm font-medium text-white hover:bg-rose-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
            >
              {labels.retry}
            </button>
          </div>
        ) : null}

        {!loading && !error && overview && overview.customers.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-8 text-center dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {labels.emptyTitle}
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {labels.emptyDescription}
            </p>
          </div>
        ) : null}

        {!loading && !error && overview && overview.customers.length > 0 && filtered.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-8 text-center dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {labels.filteredEmptyTitle}
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {labels.filteredEmptyDescription}
            </p>
          </div>
        ) : null}

        {!loading && !error && filtered.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="min-w-full divide-y divide-slate-200 text-left dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-900/70">
                <tr>
                  <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {labels.columnCustomer}
                  </th>
                  <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {labels.columnStatus}
                  </th>
                  <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {labels.columnAgreement}
                  </th>
                  <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {labels.columnLicenseSetup}
                  </th>
                  <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {labels.columnDomains}
                  </th>
                  <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {labels.columnInstallations}
                  </th>
                  <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {labels.columnServices}
                  </th>
                  <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {labels.columnUsers}
                  </th>
                  <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {labels.columnFollowUp}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-950">{filtered.map(renderCustomerRow)}</tbody>
            </table>
          </div>
        ) : null}
      </section>
    </div>
  );
}
