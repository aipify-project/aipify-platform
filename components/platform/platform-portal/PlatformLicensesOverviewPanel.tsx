"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  mapAgreementDisplayName,
  mapAgreementDuration,
  mapAgreementStatus,
  mapLicenseProductName,
} from "@/lib/platform-portal/business-language";
import { formatPlatformDateTimeFull } from "@/lib/platform-presentation-quality";
import type {
  PlatformLicenseRow,
  PlatformLicensesLabels,
  PlatformLicensesOverview,
  PlatformLicensesProvisioningFilter,
  PlatformLicensesStatusFilter,
} from "@/lib/platform-portal/licenses-overview";
import {
  filterPlatformLicenses,
  licenseStatusVariant,
  looksLikeFullLicenseKey,
  provisioningStatusVariant,
} from "@/lib/platform-portal/licenses-overview";

type PanelProps = {
  labels: PlatformLicensesLabels;
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

const FILTER_CONTROL_CLASS =
  "mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-violet-500 focus-visible:ring-2 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100";

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

function formatTemplate(template: string, count: number): string {
  return template.replace("{count}", String(count));
}

function formatGeneratedAt(value: string, locale: string): string {
  return formatPlatformDateTimeFull(value, {
    locale,
    emptyFallback: "—",
    invalidFallback: "—",
  });
}

function productCatalog(
  productNames: Record<string, string>,
): Record<string, { name: string }> {
  return Object.fromEntries(
    Object.entries(productNames).map(([code, name]) => [code, { name }]),
  );
}

function displayLicenseKey(
  masked: string | null | undefined,
  notAvailable: string,
): string {
  if (!masked?.trim()) return notAvailable;
  if (looksLikeFullLicenseKey(masked)) return notAvailable;
  return masked.trim();
}

export function PlatformLicensesOverviewPanel({ labels, locale }: PanelProps) {
  const [overview, setOverview] = useState<PlatformLicensesOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PlatformLicensesStatusFilter>("all");
  const [provisioningFilter, setProvisioningFilter] =
    useState<PlatformLicensesProvisioningFilter>("all");
  const [productFilter, setProductFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [websiteKompisFilter, setWebsiteKompisFilter] = useState("all");

  const products = useMemo(() => productCatalog(labels.productNames), [labels.productNames]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch("/api/platform-portal/licenses", {
        method: "GET",
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      if (!response.ok) {
        setError(true);
        setOverview(null);
        return;
      }
      const payload = (await response.json()) as PlatformLicensesOverview;
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
    return filterPlatformLicenses(overview.licenses, {
      query,
      status: statusFilter,
      provisioning: provisioningFilter,
      productCode: productFilter,
      countryCode: countryFilter,
      websiteKompis: websiteKompisFilter,
    });
  }, [
    overview,
    query,
    statusFilter,
    provisioningFilter,
    productFilter,
    countryFilter,
    websiteKompisFilter,
  ]);

  const countryOptions = useMemo(() => {
    const values = new Set<string>();
    for (const license of overview?.licenses ?? []) {
      if (license.countryCode) values.add(license.countryCode.toUpperCase());
    }
    return Array.from(values).sort();
  }, [overview]);

  const productOptions = useMemo(() => {
    const values = new Set<string>();
    for (const license of overview?.licenses ?? []) {
      if (license.licenseProductCode) {
        values.add(license.licenseProductCode.toLowerCase());
      }
    }
    return Array.from(values).sort();
  }, [overview]);

  const websiteKompisOptions = useMemo(() => {
    const values = new Set<string>();
    for (const license of overview?.licenses ?? []) {
      const status = license.services.websiteKompisStatus?.trim();
      if (status) values.add(status.toLowerCase());
    }
    return Array.from(values).sort();
  }, [overview]);

  const hasActiveFilters =
    query.trim().length > 0 ||
    statusFilter !== "all" ||
    provisioningFilter !== "all" ||
    productFilter !== "all" ||
    countryFilter !== "all" ||
    websiteKompisFilter !== "all";

  function resetFilters() {
    setQuery("");
    setStatusFilter("all");
    setProvisioningFilter("all");
    setProductFilter("all");
    setCountryFilter("all");
    setWebsiteKompisFilter("all");
  }

  function renderLicenseRow(license: PlatformLicenseRow) {
    const productLabel = mapLicenseProductName(
      license.licenseProductCode,
      license.licenseProductCode,
      products,
      labels.unknownProduct,
    );
    const licenseStatusLabel = mapLookup(
      license.licenseStatus,
      labels.licenseStatuses,
      labels.unknownStatus,
    );
    const provisioningLabel = mapLookup(
      license.provisioningStatus,
      labels.provisioningStatuses,
      labels.unknownProvisioning,
    );
    const agreementName = mapAgreementDisplayName({
      planName: license.agreement.name,
      lifetime: (license.agreement.duration ?? "").toLowerCase() === "lifetime",
      customerName: license.companyName,
      labels: {
        unonightPilotAgreement: labels.unonightPilotAgreement,
        unonightUnlimitedAgreement: labels.unonightUnlimitedAgreement,
        lifetimeAgreement: labels.lifetimeAgreement,
      },
    });
    const agreementStatusLabel = mapAgreementStatus({
      status: license.agreement.status,
      lifetime: (license.agreement.duration ?? "").toLowerCase() === "lifetime",
      map: labels.agreementStatuses,
      unknownFallback: labels.unknownStatus,
    });
    const durationLabel = mapAgreementDuration(
      license.agreement.duration,
      labels.durationLabels,
      labels.notAvailable,
    );
    const licenseKeyLabel = displayLicenseKey(
      license.maskedLicenseKey,
      labels.notAvailable,
    );
    const domainHostname = license.domain.hostname?.trim() || labels.notAvailable;
    const domainVerifiedLabel =
      license.domain.verified === true
        ? labels.verified
        : license.domain.verified === false
          ? labels.notVerified
          : null;
    const installId = license.installation.installId?.trim() || null;
    const installationId = license.installation.id?.trim() || null;
    const websiteKompisStatus = license.services.websiteKompisStatus?.trim() || null;
    const websiteKompisLabel = websiteKompisStatus
      ? mapLookup(websiteKompisStatus, labels.serviceStatuses, websiteKompisStatus)
      : null;

    return (
      <tr
        key={license.licenseId}
        className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80 dark:border-slate-800 dark:hover:bg-slate-900/40"
      >
        <td className="px-4 py-3 align-top">
          <div className="min-w-0">
            <div className="truncate font-medium text-slate-900 dark:text-slate-100">
              {license.companyName}
            </div>
            <div className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
              {license.customerKey}
              {license.registrationNumber ? ` · ${license.registrationNumber}` : ""}
              {license.countryCode ? ` · ${license.countryCode}` : ""}
            </div>
          </div>
        </td>
        <td className="px-4 py-3 align-top text-sm text-slate-700 dark:text-slate-200">
          <div className="font-medium text-slate-900 dark:text-slate-100">{productLabel}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {labels.productCodeLabel}: {license.licenseProductCode}
          </div>
        </td>
        <td className="px-4 py-3 align-top">
          <StatusBadge
            label={licenseStatusLabel}
            variant={licenseStatusVariant(license.licenseStatus)}
          />
        </td>
        <td className="px-4 py-3 align-top">
          <StatusBadge
            label={provisioningLabel}
            variant={provisioningStatusVariant(license.provisioningStatus)}
          />
        </td>
        <td className="px-4 py-3 align-top text-sm text-slate-700 dark:text-slate-200">
          <div className="font-medium text-slate-900 dark:text-slate-100">{agreementName}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {agreementStatusLabel}
            {license.agreement.duration ? ` · ${durationLabel}` : ""}
          </div>
        </td>
        <td className="px-4 py-3 align-top text-sm text-slate-700 dark:text-slate-200">
          <div className="truncate">{domainHostname}</div>
          {domainVerifiedLabel ? (
            <div className="text-xs text-slate-500 dark:text-slate-400">{domainVerifiedLabel}</div>
          ) : null}
        </td>
        <td className="px-4 py-3 align-top text-sm text-slate-700 dark:text-slate-200">
          {installId || installationId ? (
            <div className="space-y-0.5">
              {installId ? (
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {labels.installationKey}:{" "}
                  </span>
                  <span className="font-mono text-xs">{installId}</span>
                </div>
              ) : null}
              {installationId ? (
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {labels.installationId}:{" "}
                  </span>
                  <span className="font-mono text-xs">{installationId}</span>
                </div>
              ) : null}
              {license.installation.status ? (
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {license.installation.status}
                </div>
              ) : null}
            </div>
          ) : (
            labels.notAvailable
          )}
        </td>
        <td className="px-4 py-3 align-top text-sm text-slate-700 dark:text-slate-200">
          <div>{formatTemplate(labels.servicesCount, license.services.activeCount)}</div>
          {websiteKompisLabel ? (
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {labels.websiteKompis}: {websiteKompisLabel}
            </div>
          ) : null}
        </td>
        <td className="px-4 py-3 align-top font-mono text-xs text-slate-600 dark:text-slate-300">
          {licenseKeyLabel}
        </td>
        <td className="px-4 py-3 align-top">
          <Link
            href={`/platform/customers/${license.customerId}`}
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
          value={overview?.metrics.totalLicenses ?? (loading ? "—" : 0)}
          variant="neutral"
        />
        <MetricCard
          label={labels.kpiActive}
          value={overview?.metrics.activeLicenses ?? (loading ? "—" : 0)}
          variant="success"
        />
        <MetricCard
          label={labels.kpiPending}
          value={overview?.metrics.pendingLicenses ?? (loading ? "—" : 0)}
          variant="warning"
        />
        <MetricCard
          label={labels.kpiAttention}
          value={overview?.metrics.attentionLicenses ?? (loading ? "—" : 0)}
          variant="danger"
        />
        <MetricCard
          label={labels.kpiReady}
          value={overview?.metrics.readyForActivationLicenses ?? (loading ? "—" : 0)}
          variant="info"
        />
        <MetricCard
          label={labels.kpiActiveSetup}
          value={overview?.metrics.activeSetupLicenses ?? (loading ? "—" : 0)}
          variant="muted"
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
                className={FILTER_CONTROL_CLASS}
              />
            </label>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
              <span className="sr-only">{labels.filterAll}</span>
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as PlatformLicensesStatusFilter)
                }
                className={FILTER_CONTROL_CLASS}
              >
                <option value="all">{labels.filterAll}</option>
                <option value="active">{labels.filterActive}</option>
                <option value="pending">{labels.filterPending}</option>
                <option value="suspended">{labels.filterSuspended}</option>
                <option value="expired">{labels.filterExpired}</option>
                <option value="ended">{labels.filterEnded}</option>
                <option value="revoked">{labels.filterRevoked}</option>
                <option value="unknown">{labels.filterUnknown}</option>
              </select>
            </label>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
              <span className="sr-only">{labels.filterProvisioningAll}</span>
              <select
                value={provisioningFilter}
                onChange={(event) =>
                  setProvisioningFilter(
                    event.target.value as PlatformLicensesProvisioningFilter,
                  )
                }
                className={FILTER_CONTROL_CLASS}
              >
                <option value="all">{labels.filterProvisioningAll}</option>
                <option value="requires_domain">{labels.filterRequiresDomain}</option>
                <option value="requires_installation">
                  {labels.filterRequiresInstallation}
                </option>
                <option value="ready_for_activation">{labels.filterReady}</option>
                <option value="active">{labels.filterActiveSetup}</option>
                <option value="failed">{labels.filterFailedSetup}</option>
                <option value="unknown">{labels.filterUnknownSetup}</option>
              </select>
            </label>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
              <span className="sr-only">{labels.filterProductAll}</span>
              <select
                value={productFilter}
                onChange={(event) => setProductFilter(event.target.value)}
                className={FILTER_CONTROL_CLASS}
              >
                <option value="all">{labels.filterProductAll}</option>
                {productOptions.map((code) => (
                  <option key={code} value={code}>
                    {mapLicenseProductName(code, code, products, code)}
                  </option>
                ))}
              </select>
            </label>
            {countryOptions.length > 0 ? (
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                <span className="sr-only">{labels.filterCountry}</span>
                <select
                  value={countryFilter}
                  onChange={(event) => setCountryFilter(event.target.value)}
                  className={FILTER_CONTROL_CLASS}
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
            {websiteKompisOptions.length > 0 ? (
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                <span className="sr-only">{labels.filterWebsiteKompis}</span>
                <select
                  value={websiteKompisFilter}
                  onChange={(event) => setWebsiteKompisFilter(event.target.value)}
                  className={FILTER_CONTROL_CLASS}
                >
                  <option value="all">{labels.filterWebsiteKompis}</option>
                  {websiteKompisOptions.map((value) => (
                    <option key={value} value={value}>
                      {mapLookup(value, labels.serviceStatuses, value)}
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

        {!loading && !error && overview && overview.licenses.length === 0 ? (
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
        overview.licenses.length > 0 &&
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
                    {labels.columnProduct}
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {labels.columnLicenseStatus}
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {labels.columnProvisioning}
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
                    {labels.columnDomain}
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {labels.columnInstallation}
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {labels.columnServices}
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {labels.columnLicenseKey}
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {labels.columnFollowUp}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-950">{filtered.map(renderLicenseRow)}</tbody>
            </table>
          </div>
        ) : null}
      </section>
    </div>
  );
}
