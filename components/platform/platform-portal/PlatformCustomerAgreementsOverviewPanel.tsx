"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { mapAgreementDisplayName } from "@/lib/platform-portal/business-language";
import {
  formatPlatformDateOnly,
  formatPlatformDateTimeFull,
} from "@/lib/platform-presentation-quality";
import type {
  PlatformCustomerAgreement,
  PlatformCustomerAgreementsDurationFilter,
  PlatformCustomerAgreementsLabels,
  PlatformCustomerAgreementsOverview,
  PlatformCustomerAgreementsStatusFilter,
} from "@/lib/platform-portal/customer-agreements";
import {
  agreementStatusVariant,
  filterCustomerAgreements,
  formatAgreementAmount,
} from "@/lib/platform-portal/customer-agreements";

type PanelProps = {
  labels: PlatformCustomerAgreementsLabels;
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

function mapLookup(
  value: string | null | undefined,
  map: Record<string, string>,
  fallback: string,
): string {
  if (!value) return fallback;
  const key = value.trim().toLowerCase();
  return map[key] ?? map[value.trim()] ?? fallback;
}

function formatDate(value: string | null, locale: string, fallback: string): string {
  return formatPlatformDateOnly(value, {
    locale,
    emptyFallback: fallback,
    invalidFallback: fallback,
  });
}

function formatGeneratedAt(value: string, locale: string): string {
  return formatPlatformDateTimeFull(value, {
    locale,
    emptyFallback: "—",
    invalidFallback: "—",
  });
}

export function PlatformCustomerAgreementsOverviewPanel({ labels, locale }: PanelProps) {
  const [overview, setOverview] = useState<PlatformCustomerAgreementsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<PlatformCustomerAgreementsStatusFilter>("all");
  const [durationFilter, setDurationFilter] =
    useState<PlatformCustomerAgreementsDurationFilter>("all");
  const [countryFilter, setCountryFilter] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch("/api/platform-portal/customer-agreements", {
        method: "GET",
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      if (!response.ok) {
        setError(true);
        setOverview(null);
        return;
      }
      const payload = (await response.json()) as PlatformCustomerAgreementsOverview;
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
    return filterCustomerAgreements(overview.agreements, {
      query,
      status: statusFilter,
      duration: durationFilter,
      countryCode: countryFilter,
    });
  }, [overview, query, statusFilter, durationFilter, countryFilter]);

  const countryOptions = useMemo(() => {
    const values = new Set<string>();
    for (const agreement of overview?.agreements ?? []) {
      if (agreement.countryCode) values.add(agreement.countryCode.toUpperCase());
    }
    return Array.from(values).sort();
  }, [overview]);

  const hasActiveFilters =
    query.trim().length > 0 ||
    statusFilter !== "all" ||
    durationFilter !== "all" ||
    countryFilter !== "all";

  function resetFilters() {
    setQuery("");
    setStatusFilter("all");
    setDurationFilter("all");
    setCountryFilter("all");
  }

  function renderAgreementRow(agreement: PlatformCustomerAgreement) {
    const statusVariant = agreementStatusVariant(agreement.agreementStatus);
    const statusLabel = mapLookup(
      agreement.agreementStatus,
      labels.agreementStatuses,
      labels.unknownStatus,
    );
    const durationLabel =
      agreement.duration === "lifetime"
        ? labels.durationLabels.lifetime
        : mapLookup(agreement.duration, labels.durationLabels, labels.notAvailable);
    const displayName = mapAgreementDisplayName({
      planName: agreement.agreementName,
      planKey: agreement.planKey,
      planType: agreement.planType,
      lifetime: agreement.duration === "lifetime",
      customerName: agreement.companyName,
      labels: {
        unonightPilotAgreement: labels.unonightPilotAgreement,
        unonightUnlimitedAgreement: labels.unonightUnlimitedAgreement,
        lifetimeAgreement: labels.lifetimeAgreement,
      },
    });
    const amountLabel =
      formatAgreementAmount(agreement.amount, agreement.currency, locale) ??
      labels.notAvailable;
    const endLabel =
      agreement.duration === "lifetime" || !agreement.endsAt
        ? labels.noEndDate
        : formatDate(agreement.endsAt, locale, labels.notAvailable);

    return (
      <tr
        key={agreement.agreementId}
        className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80 dark:border-slate-800 dark:hover:bg-slate-900/40"
      >
        <td className="px-4 py-3 align-top">
          <div className="min-w-0">
            <div className="truncate font-medium text-slate-900 dark:text-slate-100">
              {agreement.companyName}
            </div>
            <div className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
              {agreement.customerKey}
              {agreement.registrationNumber ? ` · ${agreement.registrationNumber}` : ""}
              {agreement.countryCode ? ` · ${agreement.countryCode}` : ""}
            </div>
          </div>
        </td>
        <td className="px-4 py-3 align-top text-sm text-slate-700 dark:text-slate-200">
          <div className="font-medium text-slate-900 dark:text-slate-100">{displayName}</div>
          {agreement.isCurrent ? (
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {labels.currentAgreement}
            </div>
          ) : (
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {labels.historicalAgreement}
            </div>
          )}
        </td>
        <td className="px-4 py-3 align-top">
          <StatusBadge label={statusLabel} variant={statusVariant} />
        </td>
        <td className="px-4 py-3 align-top text-sm text-slate-700 dark:text-slate-200">
          {durationLabel}
        </td>
        <td className="px-4 py-3 align-top text-sm text-slate-700 dark:text-slate-200">
          <div>
            {labels.startDate}: {formatDate(agreement.startedAt, locale, labels.notAvailable)}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {labels.endDate}: {endLabel}
          </div>
          {agreement.agreementStatus === "trialing" && agreement.trialEndsAt ? (
            <div className="text-xs text-amber-700 dark:text-amber-300">
              {formatDate(agreement.trialEndsAt, locale, labels.notAvailable)}
            </div>
          ) : null}
        </td>
        <td className="px-4 py-3 align-top text-sm text-slate-700 dark:text-slate-200">
          {formatDate(agreement.renewsAt, locale, labels.notAvailable)}
        </td>
        <td className="px-4 py-3 align-top text-sm tabular-nums text-slate-700 dark:text-slate-200">
          {amountLabel}
        </td>
        <td className="px-4 py-3 align-top">
          <Link
            href={`/platform/customers/${agreement.customerId}`}
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

      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <MetricCard
          label={labels.kpiTotal}
          value={overview?.metrics.totalAgreements ?? (loading ? "—" : 0)}
          variant="neutral"
        />
        <MetricCard
          label={labels.kpiActive}
          value={overview?.metrics.activeAgreements ?? (loading ? "—" : 0)}
          variant="success"
        />
        <MetricCard
          label={labels.kpiTrial}
          value={overview?.metrics.trialAgreements ?? (loading ? "—" : 0)}
          variant="warning"
        />
        <MetricCard
          label={labels.kpiAttention}
          value={overview?.metrics.attentionAgreements ?? (loading ? "—" : 0)}
          variant="danger"
        />
        <MetricCard
          label={labels.kpiEnded}
          value={overview?.metrics.endedAgreements ?? (loading ? "—" : 0)}
          variant="muted"
        />
        <MetricCard
          label={labels.kpiUnlimited}
          value={overview?.metrics.unlimitedAgreements ?? (loading ? "—" : 0)}
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
                  setStatusFilter(event.target.value as PlatformCustomerAgreementsStatusFilter)
                }
                className="mt-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="all">{labels.filterAll}</option>
                <option value="active">{labels.filterActive}</option>
                <option value="trialing">{labels.filterTrial}</option>
                <option value="attention">{labels.filterAttention}</option>
                <option value="ended">{labels.filterEnded}</option>
                <option value="expired">{labels.filterExpired}</option>
                <option value="unknown">{labels.filterUnknown}</option>
              </select>
            </label>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
              <span className="sr-only">{labels.filterDurationAll}</span>
              <select
                value={durationFilter}
                onChange={(event) =>
                  setDurationFilter(
                    event.target.value as PlatformCustomerAgreementsDurationFilter,
                  )
                }
                className="mt-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="all">{labels.filterDurationAll}</option>
                <option value="monthly">{labels.filterDurationMonthly}</option>
                <option value="yearly">{labels.filterDurationYearly}</option>
                <option value="lifetime">{labels.filterDurationUnlimited}</option>
              </select>
            </label>
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

        {loading ? (
          <div
            className="flex min-h-[240px] w-full items-center justify-center"
            role="status"
            aria-live="polite"
          >
            <AipifyLoader centered className="!w-auto !bg-transparent" />
          </div>
        ) : null}

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

        {!loading && !error && overview && overview.agreements.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-8 text-center dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {labels.emptyTitle}
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {labels.emptyDescription}
            </p>
          </div>
        ) : null}

        {!loading &&
        !error &&
        overview &&
        overview.agreements.length > 0 &&
        filtered.length === 0 ? (
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
                  <th
                    scope="col"
                    className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {labels.columnCustomer}
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {labels.columnAgreement}
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {labels.columnStatus}
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {labels.columnDuration}
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {labels.columnPeriod}
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {labels.columnRenewal}
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {labels.columnAmount}
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {labels.columnFollowUp}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-950">{filtered.map(renderAgreementRow)}</tbody>
            </table>
          </div>
        ) : null}
      </section>
    </div>
  );
}
