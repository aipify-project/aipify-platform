"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import type {
  PlatformPortalCommercialPlanLabels,
  PlatformPortalCustomerDetail,
  PlatformPortalCustomerDetailLabels,
  PlatformPortalLicenseProvisioningLabels,
} from "@/lib/platform-portal";
import { PlatformPortalCommercialPlanPanel } from "@/components/platform/platform-portal/PlatformPortalCommercialPlanPanel";
import { PlatformPortalLicenseProvisioningPanel } from "@/components/platform/platform-portal/PlatformPortalLicenseProvisioningPanel";

type Props = {
  customerId: string;
  labels: PlatformPortalCustomerDetailLabels;
  commercialPlanLabels: PlatformPortalCommercialPlanLabels;
  licenseProvisioningLabels: PlatformPortalLicenseProvisioningLabels;
  locale: string;
};

type LoadState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "unauthorized" }
  | { kind: "forbidden" }
  | { kind: "notFound" }
  | { kind: "success"; data: PlatformPortalCustomerDetail };

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

function isDetailPayload(value: unknown): value is PlatformPortalCustomerDetail {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  if (
    typeof row.customer !== "object" ||
    row.customer === null ||
    typeof row.commercial !== "object" ||
    row.commercial === null ||
    typeof row.usage !== "object" ||
    row.usage === null ||
    !Array.isArray(row.licenses) ||
    !Array.isArray(row.domains) ||
    !Array.isArray(row.entitlements) ||
    typeof row.metadata !== "object" ||
    row.metadata === null
  ) {
    return false;
  }

  const customer = row.customer as Record<string, unknown>;
  const metadata = row.metadata as Record<string, unknown>;
  return (
    typeof customer.id === "string" &&
    typeof customer.companyId === "string" &&
    typeof customer.name === "string" &&
    typeof customer.status === "string" &&
    typeof metadata.generatedAt === "string"
  );
}

function formatDate(
  value: string | null,
  locale: string,
  fallback: string,
): string {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatDateRange(
  start: string | null,
  end: string | null,
  locale: string,
  fallback: string,
): string {
  if (!start && !end) return fallback;
  const startText = formatDate(start, locale, fallback);
  const endText = formatDate(end, locale, fallback);
  if (startText === fallback && endText === fallback) return fallback;
  if (startText !== fallback && endText !== fallback) {
    return `${startText} – ${endText}`;
  }
  return startText !== fallback ? startText : endText;
}

function statusLabel(
  status: string | null | undefined,
  map: Record<string, string>,
  fallback: string,
): string {
  if (!status) return fallback;
  return map[status] ?? map[status.toLowerCase()] ?? fallback;
}

function customerStatusVariant(status: string): MetricVariant {
  switch (status.toLowerCase()) {
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

function licenseStatusVariant(status: string): MetricVariant {
  switch (status.toLowerCase()) {
    case "active":
      return "success";
    case "pending":
      return "warning";
    case "suspended":
      return "danger";
    case "expired":
      return "danger";
    case "cancelled":
    case "canceled":
      return "muted";
    default:
      return "muted";
  }
}

function domainStatusVariant(status: string): MetricVariant {
  switch (status.toLowerCase()) {
    case "active":
    case "verified":
      return "success";
    case "pending":
      return "warning";
    case "disabled":
      return "muted";
    case "removed":
      return "muted";
    case "unknown":
      return "muted";
    default:
      return "muted";
  }
}

function entitlementStatusVariant(status: string): MetricVariant {
  switch (status.toLowerCase()) {
    case "active":
    case "licensed":
      return "success";
    case "inactive":
    case "deactivated":
      return "muted";
    case "expired":
      return "danger";
    default:
      return "muted";
  }
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

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-950/40">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1 sm:grid-cols-[minmax(0,10rem)_1fr] sm:gap-4">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </dt>
      <dd className="min-w-0 text-sm text-slate-800 dark:text-slate-200">{children}</dd>
    </div>
  );
}

function CopyButton({
  value,
  copyLabel,
  copiedLabel,
  copyKey,
  copiedKey,
  onCopy,
}: {
  value: string;
  copyLabel: string;
  copiedLabel: string;
  copyKey: string;
  copiedKey: string | null;
  onCopy: (key: string, value: string) => void;
}) {
  const copied = copiedKey === copyKey;

  return (
    <button
      type="button"
      onClick={() => onCopy(copyKey, value)}
      className="inline-flex shrink-0 items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 dark:border-slate-600 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:bg-slate-800"
      aria-label={copied ? copiedLabel : copyLabel}
    >
      {copied ? copiedLabel : copyLabel}
    </button>
  );
}

function CopyableValue({
  value,
  copyKey,
  copiedKey,
  labels,
  onCopy,
  mono = true,
}: {
  value: string;
  copyKey: string;
  copiedKey: string | null;
  labels: PlatformPortalCustomerDetailLabels;
  onCopy: (key: string, value: string) => void;
  mono?: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2">
      <span className={`min-w-0 break-all ${mono ? "font-mono text-xs" : ""}`}>{value}</span>
      <CopyButton
        value={value}
        copyLabel={labels.copy}
        copiedLabel={labels.copied}
        copyKey={copyKey}
        copiedKey={copiedKey}
        onCopy={onCopy}
      />
    </div>
  );
}

function StateMessage({
  message,
  onRetry,
  retryLabel,
  tone = "error",
}: {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  tone?: "error" | "neutral";
}) {
  const isError = tone === "error";

  return (
    <div
      role="alert"
      className={`flex min-h-[40vh] w-full flex-col items-center justify-center gap-4 rounded-xl border px-5 py-8 text-center shadow-sm ${
        isError
          ? "border-rose-200 bg-rose-50 dark:border-rose-800/80 dark:bg-rose-950/40"
          : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50"
      }`}
    >
      <p
        className={`max-w-lg text-sm font-medium ${
          isError
            ? "text-rose-950 dark:text-rose-50"
            : "text-slate-700 dark:text-slate-200"
        }`}
      >
        {message}
      </p>
      {onRetry && retryLabel ? (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50 dark:hover:bg-slate-900"
        >
          {retryLabel}
        </button>
      ) : null}
    </div>
  );
}

function EmptyTableMessage({ message }: { message: string }) {
  return (
    <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50/80 px-4 py-6 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
      {message}
    </p>
  );
}

function subscriptionKpi(data: PlatformPortalCustomerDetail, labels: PlatformPortalCustomerDetailLabels) {
  if (data.commercial.lifetime) {
    return { label: labels.lifetime, value: labels.lifetime, variant: "info" as MetricVariant };
  }
  if (data.commercial.subscriptionStatus) {
    return {
      label: labels.subscription,
      value: statusLabel(
        data.commercial.subscriptionStatus,
        labels.subscriptionStatuses,
        labels.notAvailable,
      ),
      variant: subscriptionStatusVariant(data.commercial.subscriptionStatus),
    };
  }
  return {
    label: labels.subscription,
    value: labels.notAvailable,
    variant: data.customer.requiresAttention ? ("warning" as MetricVariant) : ("muted" as MetricVariant),
  };
}

export function PlatformPortalCustomerDetailPanel({
  customerId,
  labels,
  commercialPlanLabels,
  licenseProvisioningLabels,
  locale,
}: Props) {
  const [loadState, setLoadState] = useState<LoadState>({ kind: "loading" });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [commercialOpen, setCommercialOpen] = useState(false);
  const [commercialSuccess, setCommercialSuccess] = useState(false);
  const [licenseOpen, setLicenseOpen] = useState(false);
  const [licenseSuccess, setLicenseSuccess] = useState(false);

  const load = useCallback(async () => {
    setLoadState({ kind: "loading" });
    setCopiedKey(null);

    try {
      const res = await fetch(`/api/platform-portal/customers/${customerId}`, {
        cache: "no-store",
      });

      if (res.status === 401) {
        setLoadState({ kind: "unauthorized" });
        return;
      }
      if (res.status === 403) {
        setLoadState({ kind: "forbidden" });
        return;
      }
      if (res.status === 404) {
        setLoadState({ kind: "notFound" });
        return;
      }
      if (!res.ok) {
        setLoadState({ kind: "error" });
        return;
      }

      let body: unknown;
      try {
        body = await res.json();
      } catch {
        setLoadState({ kind: "error" });
        return;
      }

      if (!isDetailPayload(body)) {
        setLoadState({ kind: "error" });
        return;
      }

      setLoadState({ kind: "success", data: body });
    } catch {
      setLoadState({ kind: "error" });
    }
  }, [customerId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!copiedKey) return;
    const timer = window.setTimeout(() => setCopiedKey(null), 2000);
    return () => window.clearTimeout(timer);
  }, [copiedKey]);

  const handleCopy = useCallback(async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
    } catch {
      setCopiedKey(null);
    }
  }, []);

  if (loadState.kind === "loading") {
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

  if (loadState.kind === "unauthorized") {
    return (
      <div className="w-full space-y-6">
        <StateMessage message={labels.unauthorized} tone="neutral" />
      </div>
    );
  }

  if (loadState.kind === "forbidden") {
    return (
      <div className="w-full space-y-6">
        <StateMessage message={labels.forbidden} tone="neutral" />
      </div>
    );
  }

  if (loadState.kind === "notFound") {
    return (
      <div className="w-full space-y-6">
        <nav>
          <Link
            href="/platform/customers"
            className="inline-flex items-center text-sm font-medium text-violet-700 transition hover:text-violet-800 dark:text-violet-300 dark:hover:text-violet-200"
          >
            ← {labels.backToCustomers}
          </Link>
        </nav>
        <StateMessage message={labels.notFound} tone="neutral" />
      </div>
    );
  }

  if (loadState.kind === "error") {
    return (
      <div className="w-full space-y-6">
        <nav>
          <Link
            href="/platform/customers"
            className="inline-flex items-center text-sm font-medium text-violet-700 transition hover:text-violet-800 dark:text-violet-300 dark:hover:text-violet-200"
          >
            ← {labels.backToCustomers}
          </Link>
        </nav>
        <StateMessage message={labels.error} onRetry={() => void load()} retryLabel={labels.retry} />
      </div>
    );
  }

  const { data } = loadState;
  const { customer, commercial, usage } = data;
  const customerStatusLabel = statusLabel(
    customer.status,
    labels.customerStatuses,
    labels.notAvailable,
  );
  const subscriptionKpiValue = subscriptionKpi(data, labels);
  const showLegalName =
    customer.legalName != null &&
    customer.legalName.trim().length > 0 &&
    customer.legalName.trim() !== customer.name.trim();
  const healthLabel = customer.requiresAttention ? labels.requiresAttention : labels.healthy;
  const healthVariant: MetricVariant = customer.requiresAttention ? "warning" : "success";
  const partnerLabel = commercial.partnerAttributed
    ? labels.partnerCustomer
    : labels.directCustomer;
  const partnerVariant: MetricVariant = commercial.partnerAttributed ? "info" : "neutral";

  return (
    <div className="w-full space-y-6">
      <header className="space-y-4">
        <nav>
          <Link
            href="/platform/customers"
            className="inline-flex items-center text-sm font-medium text-violet-700 transition hover:text-violet-800 dark:text-violet-300 dark:hover:text-violet-200"
          >
            ← {labels.backToCustomers}
          </Link>
        </nav>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-950/40">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                {customer.name}
              </h1>
              {showLegalName ? (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {labels.legalName}: {customer.legalName}
                </p>
              ) : null}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600 dark:text-slate-400">
                {customer.organizationNumber ? (
                  <span>
                    {labels.organizationNumber}: {customer.organizationNumber}
                  </span>
                ) : null}
                {customer.slug ? (
                  <span>
                    {labels.slug}: {customer.slug}
                  </span>
                ) : null}
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <StatusBadge
                  label={customerStatusLabel}
                  variant={customerStatusVariant(customer.status)}
                />
                {commercial.lifetime ? (
                  <StatusBadge label={labels.lifetime} variant="info" />
                ) : commercial.subscriptionStatus ? (
                  <StatusBadge
                    label={statusLabel(
                      commercial.subscriptionStatus,
                      labels.subscriptionStatuses,
                      labels.notAvailable,
                    )}
                    variant={subscriptionStatusVariant(commercial.subscriptionStatus)}
                  />
                ) : null}
                <StatusBadge label={partnerLabel} variant={partnerVariant} />
              </div>
            </div>

            <div className="min-w-0 shrink-0 space-y-1.5 lg:text-right">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {labels.customerId}
              </p>
              <CopyableValue
                value={customer.id}
                copyKey="header-customer-id"
                copiedKey={copiedKey}
                labels={labels}
                onCopy={(key, value) => void handleCopy(key, value)}
              />
            </div>
          </div>
        </div>
      </header>

      <section
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-950/40"
        aria-label={labels.title}
      >
        <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
          <MetricCard
            label={subscriptionKpiValue.label}
            value={subscriptionKpiValue.value}
            variant={subscriptionKpiValue.variant}
          />
          <MetricCard
            label={labels.activeLicenses}
            value={usage.activeLicenseCount}
            variant={usage.activeLicenseCount > 0 ? "success" : "muted"}
          />
          <MetricCard
            label={`${labels.domains} · ${labels.installations}`}
            value={`${usage.domainCount} · ${usage.installationCount}`}
            variant={usage.domainCount > 0 || usage.installationCount > 0 ? "info" : "muted"}
          />
          <MetricCard
            label={labels.members}
            value={usage.memberCount}
            variant={usage.memberCount > 0 ? "neutral" : "muted"}
          />
          <MetricCard
            label={labels.openSupport}
            value={usage.openSupportCount}
            variant={usage.openSupportCount > 0 ? "warning" : "success"}
          />
        </dl>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SectionCard title={labels.sectionBusiness}>
            <dl className="space-y-4">
              <DetailRow label={labels.customerName}>{customer.name}</DetailRow>
              <DetailRow label={labels.legalName}>
                {customer.legalName?.trim() ? customer.legalName : labels.notAvailable}
              </DetailRow>
              <DetailRow label={labels.organizationNumber}>
                {customer.organizationNumber?.trim()
                  ? customer.organizationNumber
                  : labels.notAvailable}
              </DetailRow>
              <DetailRow label={labels.customerId}>
                <CopyableValue
                  value={customer.id}
                  copyKey="business-customer-id"
                  copiedKey={copiedKey}
                  labels={labels}
                  onCopy={(key, value) => void handleCopy(key, value)}
                />
              </DetailRow>
              <DetailRow label={labels.companyId}>
                <CopyableValue
                  value={customer.companyId}
                  copyKey="business-company-id"
                  copiedKey={copiedKey}
                  labels={labels}
                  onCopy={(key, value) => void handleCopy(key, value)}
                />
              </DetailRow>
              <DetailRow label={labels.createdAt}>
                {formatDate(customer.createdAt, locale, labels.notAvailable)}
              </DetailRow>
              <DetailRow label={labels.updatedAt}>
                {formatDate(customer.updatedAt, locale, labels.notAvailable)}
              </DetailRow>
            </dl>
          </SectionCard>

          <SectionCard title={labels.sectionCommercial}>
            <dl className="space-y-4">
              <DetailRow label={labels.lifetime}>
                <StatusBadge
                  label={commercial.lifetime ? labels.lifetime : labels.notAvailable}
                  variant={commercial.lifetime ? "info" : "muted"}
                />
              </DetailRow>
              <DetailRow label={labels.subscription}>
                {commercial.subscriptionStatus ? (
                  <StatusBadge
                    label={statusLabel(
                      commercial.subscriptionStatus,
                      labels.subscriptionStatuses,
                      labels.notAvailable,
                    )}
                    variant={subscriptionStatusVariant(commercial.subscriptionStatus)}
                  />
                ) : (
                  labels.notAvailable
                )}
              </DetailRow>
              <DetailRow label={labels.plan}>
                {commercial.planName?.trim() ? commercial.planName : labels.notAvailable}
              </DetailRow>
              <DetailRow label={labels.trialPeriod}>
                {formatDateRange(
                  commercial.trialStartsAt,
                  commercial.trialEndsAt,
                  locale,
                  labels.notAvailable,
                )}
              </DetailRow>
              <DetailRow label={labels.activePeriod}>
                {formatDateRange(
                  commercial.currentPeriodStartsAt,
                  commercial.currentPeriodEndsAt,
                  locale,
                  labels.notAvailable,
                )}
              </DetailRow>
              <DetailRow label={commercial.partnerAttributed ? labels.partnerCustomer : labels.directCustomer}>
                <div className="space-y-1">
                  <StatusBadge label={partnerLabel} variant={partnerVariant} />
                  {commercial.partnerAttributed && commercial.partnerName ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {commercial.partnerName}
                    </p>
                  ) : null}
                </div>
              </DetailRow>
            </dl>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setCommercialSuccess(false);
                  setCommercialOpen(true);
                }}
                className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 dark:bg-violet-500 dark:hover:bg-violet-400"
              >
                {labels.managePlan}
              </button>
              {commercialSuccess ? (
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  {commercialPlanLabels.success}
                </p>
              ) : null}
            </div>
          </SectionCard>

          <SectionCard title={labels.sectionLicenses}>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setLicenseSuccess(false);
                  setLicenseOpen(true);
                }}
                className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 dark:bg-violet-500 dark:hover:bg-violet-400"
              >
                {labels.createLicense}
              </button>
              {licenseSuccess ? (
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  {licenseProvisioningLabels.success}
                </p>
              ) : null}
            </div>
            {data.licenses.length === 0 ? (
              <EmptyTableMessage message={labels.emptyLicenses} />
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                <table className="min-w-full border-collapse text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50/95 dark:border-slate-700 dark:bg-slate-900/95">
                    <tr>
                      <th scope="col" className="whitespace-nowrap px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {labels.product}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {labels.status}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {licenseProvisioningLabels.provisioningStatus}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {licenseProvisioningLabels.maskedLicenseCode}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {labels.domain}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {labels.installId}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {labels.createdAt}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {labels.activatedAt}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {labels.expiresAt}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {data.licenses.map((license) => {
                      const productLabel =
                        license.productName?.trim() ||
                        license.productCode?.trim() ||
                        labels.notAvailable;
                      return (
                        <tr key={license.id} className="align-top">
                          <td className="px-3 py-2.5 text-slate-800 dark:text-slate-200">{productLabel}</td>
                          <td className="px-3 py-2.5">
                            <StatusBadge
                              label={statusLabel(
                                license.status,
                                labels.licenseStatuses,
                                labels.notAvailable,
                              )}
                              variant={licenseStatusVariant(license.status)}
                            />
                          </td>
                          <td className="px-3 py-2.5">
                            <StatusBadge
                              label={statusLabel(
                                license.provisioningStatus,
                                labels.provisioningStatuses,
                                labels.notAvailable,
                              )}
                              variant={
                                (license.provisioningStatus ?? "").toLowerCase() ===
                                "domain_linked"
                                  ? "success"
                                  : (license.provisioningStatus ?? "").toLowerCase() ===
                                      "requires_domain" ||
                                    (license.provisioningStatus ?? "").toLowerCase() ===
                                      "requires_installation"
                                  ? "warning"
                                  : "info"
                              }
                            />
                          </td>
                          <td className="px-3 py-2.5 font-mono text-xs text-slate-600 dark:text-slate-300">
                            {license.maskedLicenseCode?.trim()
                              ? license.maskedLicenseCode
                              : labels.notAvailable}
                          </td>
                          <td className="px-3 py-2.5 text-slate-700 dark:text-slate-300">
                            {license.domain?.trim() ? license.domain : labels.notAvailable}
                          </td>
                          <td className="px-3 py-2.5">
                            {license.installId ? (
                              <CopyableValue
                                value={license.installId}
                                copyKey={`license-install-${license.id}`}
                                copiedKey={copiedKey}
                                labels={labels}
                                onCopy={(key, value) => void handleCopy(key, value)}
                              />
                            ) : (
                              labels.notAvailable
                            )}
                          </td>
                          <td className="whitespace-nowrap px-3 py-2.5 text-slate-700 dark:text-slate-300">
                            {formatDate(license.createdAt, locale, labels.notAvailable)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-2.5 text-slate-700 dark:text-slate-300">
                            {formatDate(license.activatedAt, locale, labels.notAvailable)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-2.5 text-slate-700 dark:text-slate-300">
                            {formatDate(license.expiresAt, locale, labels.notAvailable)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>

          <SectionCard title={labels.sectionDomains}>
            {data.domains.length === 0 ? (
              <EmptyTableMessage message={labels.emptyDomains} />
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                <table className="min-w-full border-collapse text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50/95 dark:border-slate-700 dark:bg-slate-900/95">
                    <tr>
                      <th scope="col" className="whitespace-nowrap px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {labels.hostname}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {labels.status}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {labels.installId}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {labels.createdAt}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {labels.verifiedAt}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {data.domains.map((domain) => (
                      <tr key={domain.id} className="align-top">
                        <td className="px-3 py-2.5 font-medium text-slate-800 dark:text-slate-200">
                          {domain.hostname}
                        </td>
                        <td className="px-3 py-2.5">
                          <StatusBadge
                            label={statusLabel(
                              domain.status,
                              labels.domainStatuses,
                              labels.notAvailable,
                            )}
                            variant={domainStatusVariant(domain.status)}
                          />
                        </td>
                        <td className="px-3 py-2.5">
                          {domain.installId ? (
                            <CopyableValue
                              value={domain.installId}
                              copyKey={`domain-install-${domain.id}`}
                              copiedKey={copiedKey}
                              labels={labels}
                              onCopy={(key, value) => void handleCopy(key, value)}
                            />
                          ) : (
                            labels.notAvailable
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-slate-700 dark:text-slate-300">
                          {formatDate(domain.createdAt, locale, labels.notAvailable)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-slate-700 dark:text-slate-300">
                          {formatDate(domain.verifiedAt, locale, labels.notAvailable)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>

          <SectionCard title={labels.sectionEntitlements}>
            {data.entitlements.length === 0 ? (
              <EmptyTableMessage message={labels.emptyEntitlements} />
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                <table className="min-w-full border-collapse text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50/95 dark:border-slate-700 dark:bg-slate-900/95">
                    <tr>
                      <th scope="col" className="whitespace-nowrap px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {labels.code}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {labels.name}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {labels.status}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {labels.grantedAt}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {labels.expiresAt}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {data.entitlements.map((entitlement) => (
                      <tr key={entitlement.id} className="align-top">
                        <td className="px-3 py-2.5 font-mono text-xs text-slate-800 dark:text-slate-200">
                          {entitlement.code}
                        </td>
                        <td className="px-3 py-2.5 text-slate-700 dark:text-slate-300">
                          {entitlement.name?.trim() ? entitlement.name : labels.notAvailable}
                        </td>
                        <td className="px-3 py-2.5">
                          <StatusBadge
                            label={statusLabel(
                              entitlement.status,
                              labels.entitlementStatuses,
                              labels.notAvailable,
                            )}
                            variant={entitlementStatusVariant(entitlement.status)}
                          />
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-slate-700 dark:text-slate-300">
                          {formatDate(entitlement.grantedAt, locale, labels.notAvailable)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-slate-700 dark:text-slate-300">
                          {formatDate(entitlement.expiresAt, locale, labels.notAvailable)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>
        </div>

        <aside className="space-y-6">
          <SectionCard title={labels.sectionStatus}>
            <dl className="space-y-4">
              <DetailRow label={labels.status}>
                <StatusBadge label={healthLabel} variant={healthVariant} />
              </DetailRow>
              <DetailRow label={commercial.partnerAttributed ? labels.partnerCustomer : labels.directCustomer}>
                <StatusBadge label={partnerLabel} variant={partnerVariant} />
              </DetailRow>
              <DetailRow label={commercial.lifetime ? labels.lifetime : labels.subscription}>
                {commercial.lifetime ? (
                  <StatusBadge label={labels.lifetime} variant="info" />
                ) : commercial.subscriptionStatus ? (
                  <StatusBadge
                    label={statusLabel(
                      commercial.subscriptionStatus,
                      labels.subscriptionStatuses,
                      labels.notAvailable,
                    )}
                    variant={subscriptionStatusVariant(commercial.subscriptionStatus)}
                  />
                ) : (
                  labels.notAvailable
                )}
              </DetailRow>
              <DetailRow label={labels.members}>{usage.memberCount}</DetailRow>
              <DetailRow label={labels.openSupport}>
                {usage.openSupportCount > 0 ? (
                  <StatusBadge
                    label={String(usage.openSupportCount)}
                    variant="warning"
                  />
                ) : (
                  <StatusBadge label={String(usage.openSupportCount)} variant="success" />
                )}
              </DetailRow>
              <DetailRow label={labels.customerId}>
                <CopyableValue
                  value={customer.id}
                  copyKey="status-customer-id"
                  copiedKey={copiedKey}
                  labels={labels}
                  onCopy={(key, value) => void handleCopy(key, value)}
                />
              </DetailRow>
              <DetailRow label={labels.companyId}>
                <CopyableValue
                  value={customer.companyId}
                  copyKey="status-company-id"
                  copiedKey={copiedKey}
                  labels={labels}
                  onCopy={(key, value) => void handleCopy(key, value)}
                />
              </DetailRow>
              <DetailRow label={labels.slug}>
                {customer.slug?.trim() ? customer.slug : labels.notAvailable}
              </DetailRow>
              <DetailRow label={labels.generatedAt}>
                {formatDate(data.metadata.generatedAt, locale, labels.notAvailable)}
              </DetailRow>
            </dl>
          </SectionCard>
        </aside>
      </div>

      <PlatformPortalCommercialPlanPanel
        open={commercialOpen}
        customerId={customerId}
        commercial={commercial}
        labels={commercialPlanLabels}
        locale={locale}
        onClose={() => setCommercialOpen(false)}
        onSuccess={() => {
          setCommercialSuccess(true);
          setCommercialOpen(false);
          void load();
        }}
      />

      <PlatformPortalLicenseProvisioningPanel
        open={licenseOpen}
        customerId={customerId}
        commercial={commercial}
        existingLicenses={data.licenses}
        labels={licenseProvisioningLabels}
        onClose={() => setLicenseOpen(false)}
        onSuccess={() => {
          setLicenseSuccess(true);
          setLicenseOpen(false);
          void load();
        }}
      />
    </div>
  );
}
