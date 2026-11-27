"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { AipifyStatusBadge } from "@/components/ui/aipify-status-badge";
import type { AipifyStatusKind } from "@/lib/design/status-system";
import type {
  PlatformPortalAppKompisDeliveryLabels,
  PlatformPortalCommercialPlanLabels,
  PlatformPortalCustomerDetail,
  PlatformPortalCustomerDetailLabels,
  PlatformPortalDomainInstallationLabels,
  PlatformPortalLicenseProvisioningLabels,
  PlatformAdminProvisionLabels,
  PlatformPortalKompisBedriftLabels,
  PlatformPortalWebsiteKompisLabels,
  PlatformPortalWebsiteKompisStatus,
} from "@/lib/platform-portal";
import {
  canShowCreateLicenseAction,
  canShowDomainInstallationAction,
  deriveLicenseProvisioningStatus,
  hasAuthoritativeTrial,
  mapAgreementDisplayName,
  mapAgreementStatus,
  mapCustomerLifecycleStatus,
  mapDomainRole,
  mapLicenseProductName,
  shouldShowTrialBadge,
} from "@/lib/platform-portal/business-language";
import { buildPlatformCustomerControlPlaneSummary } from "@/lib/core/access-control-plane";
import type { AccessProductStatus } from "@/lib/core/access-control-plane";
import { PlatformPortalAppKompisDeliveryPanel } from "@/components/platform/platform-portal/PlatformPortalAppKompisDeliveryPanel";
import { CustomerWebsiteRuntimeDeliveryPanel } from "@/components/platform/platform-portal/CustomerWebsiteRuntimeDeliveryPanel";
import type { CustomerWebsiteRuntimeLabels } from "@/lib/customer-website-runtime/labels";
import { PlatformPortalCommercialPlanPanel } from "@/components/platform/platform-portal/PlatformPortalCommercialPlanPanel";
import { PlatformPortalDomainInstallationPanel } from "@/components/platform/platform-portal/PlatformPortalDomainInstallationPanel";
import { PlatformPortalLicenseProvisioningPanel } from "@/components/platform/platform-portal/PlatformPortalLicenseProvisioningPanel";
import { PlatformPortalWebsiteKompisActivationPanel } from "@/components/platform/platform-portal/PlatformPortalWebsiteKompisActivationPanel";
import { PlatformPortalKompisBedriftStatusPanel } from "@/components/platform/platform-portal/PlatformPortalKompisBedriftStatusPanel";
import { PlatformPortalAdminProvisioningPanel } from "@/components/platform/platform-portal/PlatformPortalAdminProvisioningPanel";
import { PlatformPortalCustomerIdentityPanel } from "@/components/platform/platform-portal/PlatformPortalCustomerIdentityPanel";
import { PrimaryContactEditCard } from "@/components/platform/platform-portal/PrimaryContactEditCard";
import type { PlatformCustomerIdentityLabels } from "@/lib/platform-portal/customer-identity-labels";
import {
  parsePlatformPortalWebsiteKompisStatus,
  reasonLabel,
  websiteKompisStatusVariant,
} from "@/lib/platform-portal/website-kompis-activation";
import { isCustomer360Tab, type Customer360Tab } from "@/lib/platform-portal/customer-360-tabs";
import type { CustomerCompanyProfile } from "@/lib/platform-portal/customer-company-address";
import type { CurrencyAmount, CustomerInvoiceSummary } from "@/lib/platform-portal/customer-invoice-status";
import { formatEconomyCount, formatEconomyMoney, moneyText } from "@/lib/platform/economy-display";
import { toBcp47Locale } from "@/lib/platform-presentation-quality/bcp47";
import { formatPlatformDateTimeFull } from "@/lib/platform-presentation-quality";
import { presentCustomerNumber } from "@/lib/platform/economy-display";
import { createClient } from "@/lib/supabase/client";

type Props = {
  customerId: string;
  labels: PlatformPortalCustomerDetailLabels;
  commercialPlanLabels: PlatformPortalCommercialPlanLabels;
  licenseProvisioningLabels: PlatformPortalLicenseProvisioningLabels;
  domainInstallationLabels: PlatformPortalDomainInstallationLabels;
  websiteKompisLabels: PlatformPortalWebsiteKompisLabels;
  kompisBedriftLabels: PlatformPortalKompisBedriftLabels;
  adminProvisionLabels: PlatformAdminProvisionLabels;
  appKompisDeliveryLabels: PlatformPortalAppKompisDeliveryLabels;
  websiteRuntimeLabels: CustomerWebsiteRuntimeLabels;
  customerIdentityLabels: PlatformCustomerIdentityLabels;
  locale: string;
  initialTab?: Customer360Tab;
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

function controlPlaneStatusVariant(status: AccessProductStatus): MetricVariant {
  switch (status) {
    case "active":
      return "success";
    case "pending":
    case "conflict":
      return "warning";
    case "suspended":
    case "expired":
    case "cancelled":
      return "danger";
    default:
      return "muted";
  }
}

function ControlPlaneOverviewCard({
  labels,
  data,
}: {
  labels: PlatformPortalCustomerDetailLabels;
  data: PlatformPortalCustomerDetail;
}) {
  const summary = buildPlatformCustomerControlPlaneSummary(data);
  const cp = labels.controlPlane;
  const statusLabel = (status: string) => cp.statuses[status] ?? labels.unknownStatus;
  const productLabel = (key: "web" | "bedrift" | "website_kompis") => {
    if (key === "web") return cp.web;
    if (key === "bedrift") return cp.bedrift;
    return cp.websiteKompis;
  };

  return (
    <section
      className="rounded-xl border border-violet-200/80 bg-violet-50/40 p-4 shadow-sm dark:border-violet-800/60 dark:bg-violet-950/25"
      aria-label={cp.sectionControlPlane}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {cp.sectionControlPlane}
          </h2>
          <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
            {cp.overallStatus}
          </p>
        </div>
        <StatusBadge
          label={statusLabel(summary.overallStatus)}
          variant={controlPlaneStatusVariant(summary.overallStatus)}
        />
      </div>
      <dl className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label={cp.membership}
          value={summary.membershipReady ? cp.ready : cp.notReady}
          variant={summary.membershipReady ? "success" : "warning"}
        />
        <MetricCard
          label={cp.provisioning}
          value={summary.provisioningReady ? cp.ready : cp.notReady}
          variant={summary.provisioningReady ? "success" : "warning"}
        />
        <MetricCard
          label={cp.modules}
          value={
            summary.modulesAvailable &&
            summary.modulesActiveCount != null &&
            summary.modulesTotalCount != null
              ? `${summary.modulesActiveCount}/${summary.modulesTotalCount}`
              : labels.notAvailable
          }
          variant={
            summary.modulesAvailable && (summary.modulesActiveCount ?? 0) > 0
              ? "info"
              : "muted"
          }
        />
        <MetricCard
          label={cp.overallStatus}
          value={statusLabel(summary.overallStatus)}
          variant={controlPlaneStatusVariant(summary.overallStatus)}
        />
      </dl>
      <div className="mt-3">
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {cp.products}
        </p>
        <ul className="mt-1.5 flex flex-wrap gap-1.5">
          {summary.products.map((product) => (
            <li key={`${product.productId}-${product.labelKey}`}>
              <StatusBadge
                label={`${productLabel(product.labelKey)} · ${statusLabel(product.status)}`}
                variant={controlPlaneStatusVariant(product.status)}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

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
  return formatPlatformDateTimeFull(value, {
    locale,
    emptyFallback: fallback,
    invalidFallback: fallback,
  });
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
  detail,
  href,
}: {
  label: string;
  value: string | number;
  variant?: MetricVariant;
  detail?: string;
  href?: string;
}) {
  const styles = METRIC_VARIANT_STYLES[variant];
  const body = (
    <div
      className={`flex h-full flex-col rounded-lg border px-3 py-2.5 shadow-sm ${styles.card}`}
      data-variant={variant}
    >
      <div className="flex items-start justify-between gap-2">
        <dt className={`text-[11px] font-medium uppercase tracking-wide ${styles.label}`}>
          {label}
        </dt>
        <AipifyStatusBadge kind={variantToKind(variant)} label={label} />
      </div>
      <dd className={`mt-1 text-lg font-semibold tabular-nums tracking-tight ${styles.value}`}>
        {value}
      </dd>
      {detail ? (
        <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{detail}</p>
      ) : null}
    </div>
  );

  if (!href) return body;
  return (
    <Link
      href={href}
      className="block min-w-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
    >
      {body}
    </Link>
  );
}

function variantToKind(variant: MetricVariant): AipifyStatusKind {
  switch (variant) {
    case "success":
      return "verified";
    case "warning":
      return "needs_attention";
    case "danger":
      return "not_allowed";
    case "info":
      return "information";
    case "muted":
      return "waiting";
    default:
      return "information";
  }
}

function StatusBadge({
  label,
  variant,
}: {
  label: string;
  variant: MetricVariant;
}) {
  return <AipifyStatusBadge kind={variantToKind(variant)} label={label} />;
}

function SectionCard({
  title,
  children,
  headerAction,
  compact = false,
}: {
  title: string;
  children: ReactNode;
  headerAction?: ReactNode;
  compact?: boolean;
}) {
  return (
    <section
      className={`rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-950/40 ${
        compact ? "p-3.5" : "p-4"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {title}
        </h2>
        {headerAction ? <div className="shrink-0">{headerAction}</div> : null}
      </div>
      <div className={compact ? "mt-2.5" : "mt-3"}>{children}</div>
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
    <div className="grid gap-0.5 border-b border-slate-100 py-2 last:border-b-0 sm:grid-cols-[minmax(0,9.5rem)_1fr] sm:gap-3 dark:border-slate-800">
      <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
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

function formatCalendarDate(value: string | null | undefined, locale: string, fallback: string) {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return fallback;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12));
  return new Intl.DateTimeFormat(toBcp47Locale(locale), {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(date);
}

function formatAmountList(
  amounts: CurrencyAmount[],
  locale: string,
  unavailable: string,
): string {
  if (amounts.length === 0) {
    const zero = formatEconomyCount(0, locale);
    return zero.state === "value" ? zero.text : unavailable;
  }
  return amounts
    .map((entry) =>
      moneyText(
        formatEconomyMoney({
          amount: entry.amount,
          currency: entry.currency,
          locale,
          scale: "major",
        }),
        unavailable,
      ),
    )
    .join(" · ");
}

function countText(value: number, locale: string, unavailable: string) {
  const formatted = formatEconomyCount(value, locale);
  return formatted.state === "value" ? formatted.text : unavailable;
}

function registeredOrEmpty(
  value: string | null | undefined,
  ready: boolean,
  notRegistered: string,
  unavailable: string,
) {
  if (!ready) return unavailable;
  const trimmed = value?.trim();
  return trimmed ? trimmed : notRegistered;
}

function invoiceListHref(customerId: string, bucket?: "overdue" | "paid") {
  const returnTo = encodeURIComponent(`/platform/customers/${customerId}?tab=subscription`);
  const bucketQuery = bucket ? `&bucket=${bucket}` : "";
  return `/platform/billing/invoices?customerId=${encodeURIComponent(customerId)}${bucketQuery}&returnTo=${returnTo}`;
}

function AddressFields({
  labels,
  ready,
  street,
  line2,
  postalCode,
  city,
  region,
  country,
  website,
}: {
  labels: PlatformPortalCustomerDetailLabels;
  ready: boolean;
  street: string | null;
  line2: string | null;
  postalCode: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  website?: string | null;
}) {
  const address = labels.companyAddress;
  const show = (value: string | null) =>
    registeredOrEmpty(value, ready, labels.notRegistered, address.unavailable);
  return (
    <dl className="grid gap-0 sm:grid-cols-2 sm:gap-x-6">
      <DetailRow label={address.street}>{show(street)}</DetailRow>
      <DetailRow label={address.line2}>{show(line2)}</DetailRow>
      <DetailRow label={address.postalCode}>{show(postalCode)}</DetailRow>
      <DetailRow label={address.city}>{show(city)}</DetailRow>
      <DetailRow label={address.region}>{show(region)}</DetailRow>
      <DetailRow label={address.country}>{show(country)}</DetailRow>
      {website !== undefined ? (
        <DetailRow label={address.website}>{show(website)}</DetailRow>
      ) : null}
    </dl>
  );
}

function CompanyAddressSection({
  customerName,
  legalName,
  organizationNumber,
  createdAt,
  updatedAt,
  profile,
  labels,
}: {
  customerName: string;
  legalName: string | null;
  organizationNumber: string | null;
  createdAt: string;
  updatedAt: string;
  profile: CustomerCompanyProfile | undefined;
  labels: PlatformPortalCustomerDetailLabels;
}) {
  const companyReady = profile?.readState === "ready";
  const invoiceReady = profile?.invoiceAddress.readState === "ready";
  const shownLegal = legalName?.trim()
    ? legalName
    : registeredOrEmpty(profile?.legalName, Boolean(companyReady), labels.notRegistered, labels.companyAddress.unavailable);
  const shownOrg = organizationNumber?.trim()
    ? organizationNumber
    : registeredOrEmpty(
        profile?.organizationNumber,
        Boolean(companyReady),
        labels.notRegistered,
        labels.companyAddress.unavailable,
      );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <SectionCard title={labels.companyAddress.title} compact>
        <dl className="grid gap-0 sm:grid-cols-2 sm:gap-x-6">
          <DetailRow label={labels.customerName}>{customerName}</DetailRow>
          <DetailRow label={labels.legalName}>{shownLegal}</DetailRow>
          <DetailRow label={labels.organizationNumber}>{shownOrg}</DetailRow>
          <DetailRow label={labels.createdAt}>{createdAt}</DetailRow>
          <DetailRow label={labels.updatedAt}>{updatedAt}</DetailRow>
        </dl>
        <div className="mt-3 border-t border-slate-100 pt-3 dark:border-slate-800">
          <AddressFields
            labels={labels}
            ready={Boolean(companyReady)}
            street={profile?.street ?? null}
            line2={profile?.line2 ?? null}
            postalCode={profile?.postalCode ?? null}
            city={profile?.city ?? null}
            region={profile?.region ?? null}
            country={profile?.country ?? null}
            website={profile?.website ?? null}
          />
        </div>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{labels.companyAddress.readOnlyNote}</p>
      </SectionCard>
      <SectionCard title={labels.companyAddress.invoiceTitle} compact>
        {!profile || !invoiceReady ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">{labels.companyAddress.unavailable}</p>
        ) : profile.invoiceAddress.sameAsCompany ? (
          <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
            {labels.companyAddress.sameAsCompany}
          </p>
        ) : (
          <AddressFields
            labels={labels}
            ready
            street={profile.invoiceAddress.street}
            line2={profile.invoiceAddress.line2}
            postalCode={profile.invoiceAddress.postalCode}
            city={profile.invoiceAddress.city}
            region={profile.invoiceAddress.region}
            country={profile.invoiceAddress.country}
          />
        )}
      </SectionCard>
    </div>
  );
}

function LatestInvoiceBlock({
  summary,
  labels,
  locale,
  customerId,
}: {
  summary: CustomerInvoiceSummary | undefined;
  labels: PlatformPortalCustomerDetailLabels;
  locale: string;
  customerId: string;
}) {
  const kpi = labels.invoiceKpi;
  if (!summary || summary.readState !== "ready") {
    return <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{kpi.unavailable}</p>;
  }
  const statusLabelText = summary.latest
    ? (kpi.statuses[summary.latest.presentation] ?? kpi.unavailable)
    : null;
  return (
    <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{kpi.latestInvoice}</h3>
        <Link
          href={invoiceListHref(customerId)}
          className="text-sm font-medium text-violet-700 hover:text-violet-800 dark:text-violet-300"
        >
          {kpi.openFilteredList}
        </Link>
      </div>
      {summary.latest ? (
        <dl className="mt-2">
          <DetailRow label={kpi.invoiceNumber}>
            {summary.latest.invoiceNumber ?? labels.notRegistered}
          </DetailRow>
          <DetailRow label={kpi.amount}>
            {moneyText(
              formatEconomyMoney({
                amount: summary.latest.amount,
                currency: summary.latest.currency,
                locale,
                scale: "major",
              }),
              kpi.unavailable,
            )}
          </DetailRow>
          <DetailRow label={kpi.invoiceDate}>
            {formatCalendarDate(summary.latest.issuedAt, locale, labels.notAvailable)}
          </DetailRow>
          <DetailRow label={kpi.dueDate}>
            {formatCalendarDate(summary.latest.dueDate, locale, labels.notAvailable)}
          </DetailRow>
          <DetailRow label={labels.status}>
            <StatusBadge
              label={statusLabelText ?? kpi.unavailable}
              variant={
                summary.latest.presentation === "paid"
                  ? "success"
                  : summary.latest.presentation === "overdue"
                    ? "danger"
                    : summary.latest.presentation === "zero_open"
                      ? "info"
                      : "muted"
              }
            />
          </DetailRow>
        </dl>
      ) : (
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{kpi.noInvoices}</p>
      )}
      {summary.nextBillingDate ? (
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
          {kpi.nextInvoiceDate}: {formatCalendarDate(summary.nextBillingDate, locale, labels.notAvailable)}
        </p>
      ) : null}
    </div>
  );
}

function InvoiceStatusCards({
  customerId,
  summary,
  labels,
  locale,
}: {
  customerId: string;
  summary: CustomerInvoiceSummary | undefined;
  labels: PlatformPortalCustomerDetailLabels;
  locale: string;
}) {
  const readySummary = summary?.readState === "ready" ? summary : null;
  const unavailable = labels.invoiceKpi.unavailable;
  const overdueValue = readySummary ? countText(readySummary.overdueCount, locale, unavailable) : unavailable;
  const paidValue = readySummary ? countText(readySummary.paidCount, locale, unavailable) : unavailable;
  const overdueDetail = readySummary
    ? `${labels.invoiceKpi.outstanding}: ${formatAmountList(readySummary.overdueAmounts, locale, unavailable)}`
    : unavailable;
  const paidDetail = readySummary
    ? `${labels.invoiceKpi.paidSum}: ${formatAmountList(readySummary.paidAmounts, locale, unavailable)}`
    : unavailable;

  return (
    <div className="mt-2 grid gap-2 sm:grid-cols-2">
      <MetricCard
        label={labels.invoiceKpi.overdue}
        value={overdueValue}
        detail={overdueDetail}
        variant={readySummary && readySummary.overdueCount > 0 ? "danger" : "muted"}
        href={readySummary ? invoiceListHref(customerId, "overdue") : undefined}
      />
      <MetricCard
        label={labels.invoiceKpi.paid}
        value={paidValue}
        detail={paidDetail}
        variant={readySummary && readySummary.paidCount > 0 ? "success" : "muted"}
        href={readySummary ? invoiceListHref(customerId, "paid") : undefined}
      />
    </div>
  );
}

function subscriptionKpi(data: PlatformPortalCustomerDetail, labels: PlatformPortalCustomerDetailLabels) {
  if (data.commercial.lifetime) {
    return { label: labels.duration, value: labels.lifetime, variant: "info" as MetricVariant };
  }
  if (data.commercial.subscriptionStatus) {
    return {
      label: labels.subscription,
      value: mapAgreementStatus({
        status: data.commercial.subscriptionStatus,
        lifetime: data.commercial.lifetime,
        trialStartsAt: data.commercial.trialStartsAt,
        trialEndsAt: data.commercial.trialEndsAt,
        map: labels.subscriptionStatuses,
        unknownFallback: labels.unknownStatus,
      }),
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
  domainInstallationLabels,
  websiteKompisLabels,
  kompisBedriftLabels,
  adminProvisionLabels,
  appKompisDeliveryLabels,
  websiteRuntimeLabels,
  customerIdentityLabels,
  locale,
  initialTab = "contact",
}: Props) {
  const [loadState, setLoadState] = useState<LoadState>({ kind: "loading" });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [commercialOpen, setCommercialOpen] = useState(false);
  const [commercialSuccess, setCommercialSuccess] = useState(false);
  const [licenseOpen, setLicenseOpen] = useState(false);
  const [licenseSuccess, setLicenseSuccess] = useState(false);
  const [domainOpen, setDomainOpen] = useState(false);
  const [domainSuccess, setDomainSuccess] = useState(false);
  const [websiteKompis, setWebsiteKompis] =
    useState<PlatformPortalWebsiteKompisStatus | null>(null);
  const [websiteKompisOpen, setWebsiteKompisOpen] = useState(false);
  const [websiteKompisSuccess, setWebsiteKompisSuccess] = useState<string | null>(
    null,
  );
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<Customer360Tab>(
    isCustomer360Tab(initialTab) ? initialTab : "contact",
  );
  const [businessCustomerNumber, setBusinessCustomerNumber] = useState<string | null>(null);

  const selectTab = useCallback(
    (tab: Customer360Tab) => {
      setActiveTab(tab);
      router.replace(`${pathname}?tab=${tab}`, { scroll: false });
    },
    [pathname, router],
  );

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

  const detailCompanyId =
    loadState.kind === "success" ? loadState.data.customer.companyId : null;

  useEffect(() => {
    if (!detailCompanyId) {
      setBusinessCustomerNumber(null);
      return;
    }
    let cancelled = false;
    void (async () => {
      const { data, error } = await createClient().rpc("list_platform_customer_records");
      if (cancelled) return;
      if (error || !Array.isArray(data)) {
        setBusinessCustomerNumber(null);
        return;
      }
      const numbers = [
        ...new Set(
          data
            .filter(
              (row): row is { company_id?: string | null; customer_number?: string | null } =>
                Boolean(row) &&
                typeof row === "object" &&
                (row as { company_id?: string | null }).company_id === detailCompanyId,
            )
            .map((row) => (row.customer_number ?? "").trim())
            .filter((value) => value.length > 0),
        ),
      ];
      setBusinessCustomerNumber(numbers.length === 1 ? numbers[0] : null);
    })();
    return () => {
      cancelled = true;
    };
  }, [detailCompanyId]);

  useEffect(() => {
    let cancelled = false;
    async function loadWebsiteKompis() {
      try {
        const response = await fetch(
          `/api/platform-portal/customers/${customerId}/website-kompis`,
          { cache: "no-store" },
        );
        if (!response.ok) return;
        const body: unknown = await response.json();
        const parsed = parsePlatformPortalWebsiteKompisStatus(body);
        if (!cancelled) setWebsiteKompis(parsed);
      } catch {
        /* keep previous */
      }
    }
    void loadWebsiteKompis();
    return () => {
      cancelled = true;
    };
  }, [customerId, loadState.kind]);

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
      <div className="w-full space-y-4">
        <StateMessage message={labels.unauthorized} tone="neutral" />
      </div>
    );
  }

  if (loadState.kind === "forbidden") {
    return (
      <div className="w-full space-y-4">
        <StateMessage message={labels.forbidden} tone="neutral" />
      </div>
    );
  }

  if (loadState.kind === "notFound") {
    return (
      <div className="w-full space-y-4">
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
      <div className="w-full space-y-4">
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
  const customerStatusLabel = mapCustomerLifecycleStatus({
    customerStatus: customer.status,
    subscriptionStatus: commercial.subscriptionStatus,
    trialStartsAt: commercial.trialStartsAt,
    trialEndsAt: commercial.trialEndsAt,
    map: labels.customerStatuses,
    agreementMap: labels.subscriptionStatuses,
    unknownFallback: labels.unknownStatus,
  });
  const agreementDisplayName = mapAgreementDisplayName({
    planName: commercial.planName,
    lifetime: commercial.lifetime,
    customerName: customer.name,
    labels: labels.agreementDisplayNames,
  });
  const showCreateLicense = canShowCreateLicenseAction({
    hasQualifiedAgreement:
      Boolean(commercial.subscriptionStatus) &&
      ["active", "trialing"].includes(
        (commercial.subscriptionStatus ?? "").trim().toLowerCase(),
      ),
    licenses: data.licenses,
  });
  const showDomainInstallation = canShowDomainInstallationAction({
    licenses: data.licenses,
  });
  const licenseDomain = data.licenses
    .map((license) => (license.domain ?? "").trim().toLowerCase())
    .find((hostname) => hostname.length > 0);
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
  const showTrialBadge = shouldShowTrialBadge({
    subscriptionStatus: commercial.subscriptionStatus,
    trialStartsAt: commercial.trialStartsAt,
    trialEndsAt: commercial.trialEndsAt,
    customerStatus: customer.status,
  });

  return (
    <div className="w-full space-y-4">
      <header className="space-y-3">
        <nav>
          <Link
            href="/platform/customers"
            className="inline-flex items-center text-sm font-medium text-violet-700 transition hover:text-violet-800 dark:text-violet-300 dark:hover:text-violet-200"
          >
            ← {labels.backToCustomers}
          </Link>
        </nav>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-950/40">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 space-y-1.5">
              <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                {customer.name}
              </h1>
              {showLegalName ? (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {labels.legalName}: {customer.legalName}
                </p>
              ) : null}
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {labels.primaryContactName}:{" "}
                {customer.primaryContactName?.trim()
                  ? customer.primaryContactName
                  : labels.primaryContactEmpty}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
                {customer.organizationNumber ? (
                  <span>
                    {labels.organizationNumber}: {customer.organizationNumber}
                  </span>
                ) : null}
                {customer.slug ? (
                  <span title={labels.slugHelp}>
                    {labels.slug}: {customer.slug}
                  </span>
                ) : null}
              </div>
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <StatusBadge
                  label={customerStatusLabel}
                  variant={
                    showTrialBadge
                      ? "info"
                      : customerStatusVariant(
                          customerStatusLabel ===
                            (labels.customerStatuses.active ?? labels.subscriptionStatuses.active)
                            ? "active"
                            : customer.status,
                        )
                  }
                />
                {commercial.lifetime ? (
                  <StatusBadge label={labels.lifetime} variant="info" />
                ) : null}
                {commercial.subscriptionStatus &&
                !(
                  commercial.lifetime &&
                  !hasAuthoritativeTrial(commercial) &&
                  commercial.subscriptionStatus.toLowerCase() === "trialing"
                ) ? (
                  <StatusBadge
                    label={mapAgreementStatus({
                      status: commercial.subscriptionStatus,
                      lifetime: commercial.lifetime,
                      trialStartsAt: commercial.trialStartsAt,
                      trialEndsAt: commercial.trialEndsAt,
                      map: labels.subscriptionStatuses,
                      unknownFallback: labels.unknownStatus,
                    })}
                    variant={subscriptionStatusVariant(commercial.subscriptionStatus)}
                  />
                ) : commercial.lifetime ? (
                  <StatusBadge
                    label={labels.subscriptionStatuses.active ?? labels.notAvailable}
                    variant="success"
                  />
                ) : null}
                <StatusBadge label={partnerLabel} variant={partnerVariant} />
                <StatusBadge label={healthLabel} variant={healthVariant} />
              </div>
            </div>

            <div className="min-w-0 shrink-0 space-y-1 lg:text-right">
              <p className="text-[11px] font-medium tracking-normal text-slate-500 dark:text-slate-400">
                {labels.customerNumber}
              </p>
              {businessCustomerNumber &&
              presentCustomerNumber(businessCustomerNumber, "") === businessCustomerNumber.trim() ? (
                <CopyableValue
                  value={(businessCustomerNumber ?? "").trim()}
                  copyKey="header-customer-number"
                  copiedKey={copiedKey}
                  labels={labels}
                  onCopy={(key, value) => void handleCopy(key, value)}
                />
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-300">{labels.dataUnavailable}</p>
              )}
            </div>
          </div>

          <dl
            className="mt-3 grid gap-2 border-t border-slate-100 pt-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 dark:border-slate-800"
            aria-label={labels.title}
          >
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
              label={labels.domainCountLabel}
              value={usage.domainCount}
              variant={usage.domainCount > 0 ? "info" : "muted"}
            />
            <MetricCard
              label={labels.installationCountLabel}
              value={usage.installationCount}
              variant={usage.installationCount > 0 ? "info" : "muted"}
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
          <InvoiceStatusCards
            customerId={customer.id}
            summary={data.invoiceSummary}
            labels={labels}
            locale={locale}
          />
        </div>
      </header>

      <ControlPlaneOverviewCard labels={labels} data={data} />

      <div
        role="tablist"
        aria-label={labels.tabsAria}
        className="flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-950/40"
      >
        {(
          [
            ["contact", labels.tabContact],
            ["company", labels.tabCompany],
            ["products", labels.tabProducts],
            ["subscription", labels.tabSubscription],
            ["support", labels.tabSupport],
            ["technical", labels.tabTechnical],
          ] as const
        ).map(([id, label]) => {
          const selected = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => selectTab(id)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                selected
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-12 lg:items-start">
        <div className="space-y-4 lg:col-span-7 xl:col-span-8">
          {activeTab === "contact" ? (
            <SectionCard title={labels.sectionContact} compact>
              <dl className="grid gap-0 sm:grid-cols-2 sm:gap-x-6">
                <DetailRow label={labels.primaryContactName}>
                  {customer.primaryContactName?.trim()
                    ? customer.primaryContactName
                    : labels.primaryContactEmpty}
                </DetailRow>
                <DetailRow label={labels.primaryContactPhone}>
                  {customer.primaryContactPhone?.trim()
                    ? customer.primaryContactPhone
                    : labels.notRegistered}
                </DetailRow>
                <DetailRow label={labels.contactEmailLabel}>
                  {customer.primaryContactEmail?.trim()
                    ? customer.primaryContactEmail
                    : labels.notRegistered}
                </DetailRow>
              </dl>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                {labels.loginEmailLabel}
              </p>
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                {labels.highRiskIdentityNote}
              </p>
              <PrimaryContactEditCard
                customerId={customerId}
                initialName={customer.primaryContactName?.trim() ?? ""}
                initialPhone={customer.primaryContactPhone?.trim() ?? ""}
                labels={{
                  ...labels.contactEdit,
                  primaryContactName: labels.primaryContactName,
                  primaryContactPhone: labels.primaryContactPhone,
                }}
                onSaved={() => {
                  void load();
                }}
              />
            </SectionCard>
          ) : null}

          {activeTab === "company" ? (
            <CompanyAddressSection
              customerName={customer.name}
              legalName={customer.legalName}
              organizationNumber={customer.organizationNumber}
              createdAt={formatDate(customer.createdAt, locale, labels.notAvailable)}
              updatedAt={formatDate(customer.updatedAt, locale, labels.notAvailable)}
              profile={data.companyProfile}
              labels={labels}
            />
          ) : null}

          {activeTab === "subscription" ? (
          <SectionCard
            title={labels.sectionCommercial}
            compact
            headerAction={
              <button
                type="button"
                onClick={() => {
                  setCommercialSuccess(false);
                  setCommercialOpen(true);
                }}
                className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 dark:bg-violet-500 dark:hover:bg-violet-400"
              >
                {labels.managePlan}
              </button>
            }
          >
            <dl>
              <DetailRow label={labels.duration}>
                <StatusBadge
                  label={commercial.lifetime ? labels.lifetime : labels.notAvailable}
                  variant={commercial.lifetime ? "info" : "muted"}
                />
              </DetailRow>
              <DetailRow label={labels.subscription}>
                {commercial.subscriptionStatus ? (
                  <StatusBadge
                    label={mapAgreementStatus({
                      status: commercial.subscriptionStatus,
                      lifetime: commercial.lifetime,
                      trialStartsAt: commercial.trialStartsAt,
                      trialEndsAt: commercial.trialEndsAt,
                      map: labels.subscriptionStatuses,
                      unknownFallback: labels.unknownStatus,
                    })}
                    variant={subscriptionStatusVariant(commercial.subscriptionStatus)}
                  />
                ) : (
                  labels.notAvailable
                )}
              </DetailRow>
              <DetailRow label={labels.plan}>{agreementDisplayName}</DetailRow>
              {hasAuthoritativeTrial(commercial) ? (
                <DetailRow label={labels.trialPeriod}>
                  {formatDateRange(
                    commercial.trialStartsAt,
                    commercial.trialEndsAt,
                    locale,
                    labels.notAvailable,
                  )}
                </DetailRow>
              ) : (
                <DetailRow label={labels.trialPeriod}>{labels.noTrial}</DetailRow>
              )}
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
            {commercialSuccess ? (
              <p className="mt-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                {commercialPlanLabels.success}
              </p>
            ) : null}
            <LatestInvoiceBlock
              summary={data.invoiceSummary}
              labels={labels}
              locale={locale}
              customerId={customer.id}
            />
          </SectionCard>
          ) : null}

          {activeTab === "products" ? (
          <>
          <p className="text-xs text-slate-600 dark:text-slate-300">{labels.productTruthNote}</p>
          <SectionCard
            title={labels.sectionLicenses}
            compact
            headerAction={
              showCreateLicense ? (
                <button
                  type="button"
                  onClick={() => {
                    setLicenseSuccess(false);
                    setLicenseOpen(true);
                  }}
                  className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 dark:bg-violet-500 dark:hover:bg-violet-400"
                >
                  {labels.createLicense}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    document
                      .getElementById("platform-portal-customer-licenses")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
                >
                  {labels.viewLicense}
                </button>
              )
            }
          >
            {!showCreateLicense ? (
              <p className="mb-2 text-xs text-slate-600 dark:text-slate-400">
                {labels.noNewLicenseNeeded}
              </p>
            ) : null}
            {licenseSuccess ? (
              <p className="mb-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                {licenseProvisioningLabels.success}
              </p>
            ) : null}
            <div id="platform-portal-customer-licenses">
            {data.licenses.length === 0 ? (
              <EmptyTableMessage message={labels.emptyLicenses} />
            ) : (
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                <table className="min-w-full border-collapse text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50/95 dark:border-slate-700 dark:bg-slate-900/95">
                    <tr>
                      <th scope="col" className="whitespace-nowrap px-2.5 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {labels.product}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-2.5 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {labels.status}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-2.5 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {licenseProvisioningLabels.provisioningStatus}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-2.5 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {licenseProvisioningLabels.maskedLicenseCode}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-2.5 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {labels.domain}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-2.5 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {labels.installId}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-2.5 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {labels.createdAt}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-2.5 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {labels.activatedAt}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-2.5 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {labels.expiresAt}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {data.licenses.map((license) => {
                      const productLabel = mapLicenseProductName(
                        license.productCode,
                        license.productName,
                        Object.fromEntries(
                          Object.entries(labels.licenseProductNames).map(([code, name]) => [
                            code,
                            { name, description: labels.licenseProductDescriptions[code] },
                          ]),
                        ),
                        labels.notAvailable,
                      );
                      const provisioningStatus = deriveLicenseProvisioningStatus({
                        domain: license.domain,
                        installId: license.installId,
                        storedStatus: license.provisioningStatus,
                      });
                      return (
                        <tr key={license.id} className="align-top">
                          <td className="px-2.5 py-2 text-slate-800 dark:text-slate-200">{productLabel}</td>
                          <td className="px-2.5 py-2">
                            <StatusBadge
                              label={statusLabel(
                                license.status,
                                labels.licenseStatuses,
                                labels.notAvailable,
                              )}
                              variant={licenseStatusVariant(license.status)}
                            />
                          </td>
                          <td className="px-2.5 py-2">
                            <StatusBadge
                              label={statusLabel(
                                provisioningStatus,
                                labels.provisioningStatuses,
                                labels.unknownStatus,
                              )}
                              variant={
                                provisioningStatus === "domain_linked" ||
                                provisioningStatus === "ready_for_activation" ||
                                provisioningStatus === "provisioned" ||
                                provisioningStatus === "active"
                                  ? "success"
                                  : provisioningStatus === "requires_domain" ||
                                      provisioningStatus === "requires_installation"
                                    ? "warning"
                                    : provisioningStatus === "failed"
                                      ? "danger"
                                      : "info"
                              }
                            />
                          </td>
                          <td className="px-2.5 py-2 font-mono text-xs text-slate-600 dark:text-slate-300">
                            {license.maskedLicenseCode?.trim()
                              ? license.maskedLicenseCode
                              : labels.notAvailable}
                          </td>
                          <td className="px-2.5 py-2 text-slate-700 dark:text-slate-300">
                            {license.domain?.trim() ? license.domain : labels.notAvailable}
                          </td>
                          <td className="px-2.5 py-2">
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
                          <td className="whitespace-nowrap px-2.5 py-2 text-slate-700 dark:text-slate-300">
                            {formatDate(license.createdAt, locale, labels.notAvailable)}
                          </td>
                          <td className="whitespace-nowrap px-2.5 py-2 text-slate-700 dark:text-slate-300">
                            {formatDate(license.activatedAt, locale, labels.notAvailable)}
                          </td>
                          <td className="whitespace-nowrap px-2.5 py-2 text-slate-700 dark:text-slate-300">
                            {formatDate(license.expiresAt, locale, labels.notAvailable)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            </div>
          </SectionCard>

          <SectionCard
            title={labels.sectionDomains}
            compact
            headerAction={
              showDomainInstallation ? (
                <button
                  type="button"
                  onClick={() => {
                    setDomainSuccess(false);
                    setDomainOpen(true);
                  }}
                  className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 dark:bg-violet-500 dark:hover:bg-violet-400"
                >
                  {labels.addDomainInstallation}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    document
                      .getElementById("platform-portal-customer-domains")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
                >
                  {labels.viewSetup}
                </button>
              )
            }
          >
            {!showDomainInstallation ? (
              <p className="mb-2 text-xs text-slate-600 dark:text-slate-400">
                {data.licenses.some((license) => !(license.domain ?? "").trim()) &&
                (usage.domainCount > 0 || usage.installationCount > 0)
                  ? labels.licenseMissingLink
                  : labels.noNewDomainInstallationNeeded}
              </p>
            ) : null}
            {domainSuccess ? (
              <p className="mb-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                {domainInstallationLabels.success}
              </p>
            ) : null}
            <div id="platform-portal-customer-domains">
            {data.domains.length === 0 ? (
              <EmptyTableMessage message={labels.emptyDomains} />
            ) : (
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                <table className="min-w-full border-collapse text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50/95 dark:border-slate-700 dark:bg-slate-900/95">
                    <tr>
                      <th scope="col" className="whitespace-nowrap px-2.5 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {labels.hostname}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-2.5 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {labels.domainRole}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-2.5 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {labels.status}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-2.5 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {labels.installId}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-2.5 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {labels.createdAt}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-2.5 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {labels.verifiedAt}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {data.domains.map((domain) => {
                      const role = mapDomainRole({
                        hostname: domain.hostname,
                        status: domain.status,
                        installId: domain.installId,
                        isPrimary: domain.isPrimary,
                        licenseDomain,
                        role: domain.role,
                      });
                      return (
                      <tr key={domain.id} className="align-top">
                        <td className="px-2.5 py-2 font-medium text-slate-800 dark:text-slate-200">
                          {domain.hostname}
                        </td>
                        <td className="px-2.5 py-2">
                          <StatusBadge
                            label={
                              role === "unknown"
                                ? labels.notAvailable
                                : labels.domainRoles[role] ?? labels.notAvailable
                            }
                            variant={role === "license" || role === "runtime" ? "info" : "neutral"}
                          />
                        </td>
                        <td className="px-2.5 py-2">
                          <StatusBadge
                            label={statusLabel(
                              domain.status,
                              labels.domainStatuses,
                              labels.notAvailable,
                            )}
                            variant={domainStatusVariant(domain.status)}
                          />
                        </td>
                        <td className="px-2.5 py-2">
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
                        <td className="whitespace-nowrap px-2.5 py-2 text-slate-700 dark:text-slate-300">
                          {formatDate(domain.createdAt, locale, labels.notAvailable)}
                        </td>
                        <td className="whitespace-nowrap px-2.5 py-2 text-slate-700 dark:text-slate-300">
                          {formatDate(domain.verifiedAt, locale, labels.notAvailable)}
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            </div>
          </SectionCard>

          <SectionCard title={labels.sectionEntitlements} compact>
            {data.entitlements.length === 0 ? (
              <EmptyTableMessage message={labels.emptyEntitlements} />
            ) : (
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                <table className="min-w-full border-collapse text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50/95 dark:border-slate-700 dark:bg-slate-900/95">
                    <tr>
                      <th scope="col" className="whitespace-nowrap px-2.5 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {labels.code}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-2.5 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {labels.name}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-2.5 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {labels.status}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-2.5 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {labels.grantedAt}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-2.5 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {labels.expiresAt}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {data.entitlements.map((entitlement) => (
                      <tr key={entitlement.id} className="align-top">
                        <td className="px-2.5 py-2 font-mono text-xs text-slate-800 dark:text-slate-200">
                          {entitlement.code}
                        </td>
                        <td className="px-2.5 py-2 text-slate-700 dark:text-slate-300">
                          {entitlement.name?.trim() ? entitlement.name : labels.notAvailable}
                        </td>
                        <td className="px-2.5 py-2">
                          <StatusBadge
                            label={statusLabel(
                              entitlement.status,
                              labels.entitlementStatuses,
                              labels.notAvailable,
                            )}
                            variant={entitlementStatusVariant(entitlement.status)}
                          />
                        </td>
                        <td className="whitespace-nowrap px-2.5 py-2 text-slate-700 dark:text-slate-300">
                          {formatDate(entitlement.grantedAt, locale, labels.notAvailable)}
                        </td>
                        <td className="whitespace-nowrap px-2.5 py-2 text-slate-700 dark:text-slate-300">
                          {formatDate(entitlement.expiresAt, locale, labels.notAvailable)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>

          <SectionCard
            title={websiteKompisLabels.sectionActivatedServices}
            compact
            headerAction={
              websiteKompis?.eligible && !websiteKompis.active ? (
                <button
                  type="button"
                  onClick={() => setWebsiteKompisOpen(true)}
                  className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-500"
                >
                  {websiteKompisLabels.activate}
                </button>
              ) : null
            }
          >
            <div className="space-y-3">
              {websiteKompisSuccess ? (
                <p
                  className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200"
                  role="status"
                >
                  {websiteKompisSuccess}
                </p>
              ) : null}
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {websiteKompisLabels.scopeNote}
              </p>
              <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {websiteKompisLabels.serviceName}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                      {websiteKompisLabels.appLicense}
                      {websiteKompis?.domain.hostname
                        ? ` · ${websiteKompis.domain.hostname}`
                        : ""}
                    </p>
                  </div>
                  <StatusBadge
                    label={
                      websiteKompisLabels.activationStatuses[
                        websiteKompis?.activationStatus ?? "not_ready"
                      ] ?? websiteKompisLabels.notReady
                    }
                    variant={websiteKompisStatusVariant(
                      websiteKompis?.activationStatus,
                    )}
                  />
                </div>
                <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                  <div>
                    <dt className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {websiteKompisLabels.domain}
                    </dt>
                    <dd className="mt-0.5 text-sm text-slate-800 dark:text-slate-200">
                      {websiteKompis?.domain.hostname ??
                        websiteKompisLabels.notLinked}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {websiteKompisLabels.installKey}
                    </dt>
                    <dd className="mt-0.5 break-all text-sm text-slate-800 dark:text-slate-200">
                      {websiteKompis?.installation.installId ??
                        websiteKompisLabels.notConfigured}
                    </dd>
                  </div>
                </dl>
                {!websiteKompis?.active && websiteKompis?.reasons?.length ? (
                  <ul className="mt-3 space-y-1">
                    {websiteKompis.reasons.map((reason) => (
                      <li
                        key={reason.code}
                        className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300"
                      >
                        <span
                          aria-hidden
                          className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                            reason.satisfied ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                        />
                        <span>
                          {reasonLabel(
                            reason.code,
                            websiteKompisLabels.reasonLabels,
                            reason.satisfied,
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {websiteKompis?.active ? (
                  <p className="mt-3 text-xs text-slate-600 dark:text-slate-300">
                    {websiteKompisLabels.alreadyActive}
                    {websiteKompis.existingActivation.activatedAt
                      ? ` · ${formatDate(
                          websiteKompis.existingActivation.activatedAt,
                          locale,
                          labels.notAvailable,
                        )}`
                      : ""}
                  </p>
                ) : null}
              </div>
            </div>
          </SectionCard>
          </>
          ) : null}

          {activeTab === "support" ? (
            <SectionCard title={labels.sectionSupport} compact>
              <dl>
                <DetailRow label={labels.openSupportCases}>
                  {usage.openSupportCount > 0 ? (
                    <StatusBadge
                      label={String(usage.openSupportCount)}
                      variant="warning"
                    />
                  ) : (
                    <StatusBadge label={String(usage.openSupportCount)} variant="success" />
                  )}
                </DetailRow>
              </dl>
              <div className="mt-3">
                <Link
                  href="/platform/support"
                  className="inline-flex items-center justify-center rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-50 dark:border-violet-800 dark:bg-slate-950 dark:text-violet-300 dark:hover:bg-slate-900"
                >
                  {labels.viewSupportInbox}
                </Link>
              </div>
            </SectionCard>
          ) : null}

          {activeTab === "technical" ? (
            <SectionCard title={labels.sectionTechnical} compact>
              <dl>
                <DetailRow label={labels.customerNumber}>
                  <p>
                    {presentCustomerNumber(businessCustomerNumber, labels.dataUnavailable)}
                  </p>
                </DetailRow>
                <DetailRow label={labels.technicalCustomerId}>
                  <CopyableValue
                    value={customer.id}
                    copyKey="technical-customer-id"
                    copiedKey={copiedKey}
                    labels={labels}
                    onCopy={(key, value) => void handleCopy(key, value)}
                  />
                </DetailRow>
                <DetailRow label={labels.companyId}>
                  <CopyableValue
                    value={customer.companyId}
                    copyKey="technical-company-id"
                    copiedKey={copiedKey}
                    labels={labels}
                    onCopy={(key, value) => void handleCopy(key, value)}
                  />
                </DetailRow>
                <DetailRow label={labels.slug}>
                  <div className="space-y-1">
                    <p>{customer.slug?.trim() ? customer.slug : labels.notRegistered}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{labels.slugHelp}</p>
                  </div>
                </DetailRow>
              </dl>
            </SectionCard>
          ) : null}
        </div>

        <aside className="space-y-4 lg:col-span-5 xl:col-span-4 lg:sticky lg:top-4 lg:self-start">
          {activeTab === "contact" || activeTab === "technical" ? (
            <PlatformPortalCustomerIdentityPanel
              customerId={customerId}
              labels={customerIdentityLabels}
            />
          ) : null}
          {activeTab === "products" || activeTab === "technical" ? (
            <>
              <PlatformPortalAppKompisDeliveryPanel
                customerId={customerId}
                labels={appKompisDeliveryLabels}
                locale={locale}
              />
              <CustomerWebsiteRuntimeDeliveryPanel
                organizationId={customerId}
                labels={websiteRuntimeLabels}
                locale={locale}
              />
              <PlatformPortalKompisBedriftStatusPanel
                customerId={customerId}
                labels={kompisBedriftLabels}
              />
            </>
          ) : null}
          {activeTab === "technical" ? (
            <PlatformPortalAdminProvisioningPanel
              customerId={customerId}
              labels={adminProvisionLabels}
            />
          ) : null}
          {activeTab === "subscription" || activeTab === "support" ? (
          <SectionCard title={labels.sectionStatus} compact>
            <dl>
              <DetailRow label={labels.status}>
                <StatusBadge label={healthLabel} variant={healthVariant} />
              </DetailRow>
              <DetailRow label={commercial.partnerAttributed ? labels.partnerCustomer : labels.directCustomer}>
                <StatusBadge label={partnerLabel} variant={partnerVariant} />
              </DetailRow>
              <DetailRow label={labels.duration}>
                {commercial.lifetime ? (
                  <StatusBadge label={labels.lifetime} variant="info" />
                ) : commercial.subscriptionStatus ? (
                  <StatusBadge
                    label={mapAgreementStatus({
                      status: commercial.subscriptionStatus,
                      lifetime: commercial.lifetime,
                      trialStartsAt: commercial.trialStartsAt,
                      trialEndsAt: commercial.trialEndsAt,
                      map: labels.subscriptionStatuses,
                      unknownFallback: labels.unknownStatus,
                    })}
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
              <DetailRow label={labels.customerNumber}>
                {presentCustomerNumber(businessCustomerNumber, labels.dataUnavailable)}
              </DetailRow>
              <DetailRow label={labels.slug}>
                <div className="space-y-1">
                  <p>{customer.slug?.trim() ? customer.slug : labels.notAvailable}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{labels.slugHelp}</p>
                </div>
              </DetailRow>
              <DetailRow label={labels.lastChecked}>
                {formatDate(data.metadata.generatedAt, locale, labels.notAvailable)}
              </DetailRow>
            </dl>
          </SectionCard>
          ) : null}
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

      <PlatformPortalDomainInstallationPanel
        open={domainOpen}
        customerId={customerId}
        existingLicenses={data.licenses}
        labels={domainInstallationLabels}
        onClose={() => setDomainOpen(false)}
        onSuccess={() => {
          setDomainSuccess(true);
          setDomainOpen(false);
          void load();
        }}
      />
      <PlatformPortalWebsiteKompisActivationPanel
        open={websiteKompisOpen}
        customerId={customerId}
        status={websiteKompis}
        labels={websiteKompisLabels}
        onClose={() => setWebsiteKompisOpen(false)}
        onSuccess={(message) => {
          setWebsiteKompisOpen(false);
          setWebsiteKompisSuccess(message);
          void load();
          void fetch(
            `/api/platform-portal/customers/${customerId}/website-kompis`,
            { cache: "no-store" },
          )
            .then((response) => (response.ok ? response.json() : null))
            .then((value) => {
              const parsed = parsePlatformPortalWebsiteKompisStatus(value);
              if (parsed) setWebsiteKompis(parsed);
            })
            .catch(() => undefined);
        }}
      />
    </div>
  );
}
