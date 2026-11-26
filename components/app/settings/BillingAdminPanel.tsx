"use client";

import { Blocks, Globe, Monitor, Users, type LucideIcon } from "lucide-react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { AipifyStatusBadge } from "@/components/ui/aipify-status-badge";
import { KompisProductPortfolio } from "@/components/app/settings/billing/KompisProductPortfolio";
import {
  buildBillingViewModel,
  presentationOptionsFromMaps,
  type BillingPresentationMaps,
  type BillingReferenceLabels,
  type BillingViewModel,
} from "@/lib/commercial-packages";
import type { PortfolioLabels } from "@/lib/commercial-packages/portfolio-labels";
import {
  isLegacyCommercialPackage,
  renewalPresentation,
  subscriptionShowsDistinctLicense,
  type KompisProductAccessRead,
  type WorkspaceLicenseRead,
} from "@/lib/commercial-packages/portfolio-presentation";
import { AppLayoutClasses } from "@/lib/design/app-layout";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import type { AipifyStatusKind } from "@/lib/design/status-system";
import { formatDate } from "@/lib/i18n/format-date";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type BillingAdminPanelProps = {
  labels: BillingReferenceLabels;
  portfolio: PortfolioLabels;
  license: WorkspaceLicenseRead;
  access: KompisProductAccessRead;
  locale: string;
  presentation?: BillingPresentationMaps;
  /** Inside AppHubShell — omit page chrome and extra width padding. */
  embedded?: boolean;
};

function statusKind(statusKey: string | null): AipifyStatusKind {
  switch (statusKey) {
    case "active":
    case "lifetime":
      return "verified";
    case "trial":
      return "information";
    case "past_due":
      return "needs_attention";
    case "cancelled":
      return "restricted";
    default:
      return "waiting";
  }
}

function statusLabel(labels: BillingReferenceLabels, statusKey: string | null): string {
  if (!statusKey) return labels.statusLabels.unknown;
  return labels.statusLabels[statusKey] ?? labels.statusLabels.unknown;
}

function limitLabel(labels: BillingReferenceLabels, key: BillingViewModel["limits"][number]["key"]): string {
  return labels.limits[key];
}

function usageLabel(labels: BillingReferenceLabels, key: string): string {
  return labels.usage[key] ?? labels.unavailable;
}

function limitIcon(key: string): LucideIcon {
  if (key === "users") return Users;
  if (key === "installations") return Monitor;
  return Globe;
}

function UsageMeter({
  label,
  used,
  max,
  percent,
  state,
  unlimitedLabel,
  unknownLabel,
  usedOfMax,
  icon: Icon,
}: {
  label: string;
  used: number | null;
  max: number | null;
  percent: number | null;
  state: "meter" | "unlimited" | "unknown";
  unlimitedLabel: string;
  unknownLabel: string;
  usedOfMax: string;
  icon: LucideIcon;
}) {
  if (state !== "meter" || max == null || max <= 0) {
    return (
      <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4">
        <div className="flex items-center gap-2">
          <Icon aria-hidden className="size-4 text-[var(--app-primary)]" strokeWidth={2} />
          <p className="text-sm font-medium text-[var(--app-text)]">{label}</p>
        </div>
        <p className="mt-2 text-sm text-[var(--app-text-muted)]">
          {state === "unlimited" ? `${used ?? "—"} · ${unlimitedLabel}` : unknownLabel}
        </p>
      </div>
    );
  }
  const valueText = usedOfMax.replace("{used}", String(used ?? 0)).replace("{max}", String(max));

  return (
    <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4">
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon aria-hidden className="size-4 text-[var(--app-primary)]" strokeWidth={2} />
          <p className="text-sm font-medium text-[var(--app-text)]">{label}</p>
        </div>
        <p className="text-sm tabular-nums text-[var(--app-text-muted)]">{valueText}</p>
      </div>
      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--app-primary-soft)]"
        role="progressbar"
        aria-valuenow={percent ?? 0}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className="h-full rounded-full bg-[image:var(--app-primary-gradient)] motion-reduce:transition-none"
          style={{ width: `${percent == null ? 0 : percent}%` }}
        />
      </div>
    </div>
  );
}

export function BillingAdminPanel({
  labels,
  portfolio,
  license,
  access,
  locale,
  presentation,
  embedded = false,
}: BillingAdminPanelProps) {
  const [vm, setVm] = useState<BillingViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const presentationOptions = useMemo(
    () => presentationOptionsFromMaps(presentation),
    [presentation]
  );
  const frame = embedded
    ? `w-full ${AppLayoutClasses.sectionGap}`
    : `${AppLayoutClasses.page} ${AppLayoutClasses.sectionGap}`;

  const refresh = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const res = await fetch("/api/commercial-packages/billing");
      if (!res.ok) {
        setVm(null);
        setLoadError(true);
        return;
      }
      const payload = await res.json();
      setVm(buildBillingViewModel(payload, presentationOptions));
    } catch {
      setVm(null);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [presentationOptions]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (loading) {
    return (
      <div className={embedded ? "w-full" : AppLayoutClasses.page}>
        <AipifyLoader centered />
        <span className="sr-only">{labels.title}</span>
      </div>
    );
  }

  if (loadError || !vm) {
    return (
      <div className={frame}>
        {!embedded ? (
          <>
            <Link
              href="/app/settings"
              className={`text-sm font-medium text-aipify-companion hover:underline ${AppPremiumShell.focusRing}`}
            >
              ← {labels.back}
            </Link>
            <header>
              <p className={AppPremiumShell.eyebrow}>{labels.eyebrow}</p>
              <h1 className={`mt-2 ${AppPremiumShell.pageTitle}`}>{labels.title}</h1>
              <p className={`mt-2 ${AppPremiumShell.pageDescription}`}>{labels.subtitle}</p>
            </header>
          </>
        ) : null}
        <div className={`${AppLayoutClasses.card} border-rose-200 bg-rose-50/70 dark:border-rose-900 dark:bg-rose-950/30`}>
          <p className="text-sm text-rose-800 dark:text-rose-200">{labels.loadError}</p>
          <button
            type="button"
            onClick={() => void refresh()}
            className={`mt-4 rounded-lg bg-aipify-companion px-4 py-2 text-sm font-medium text-white hover:opacity-95 ${AppPremiumShell.focusRing}`}
          >
            {labels.retry}
          </button>
        </div>
      </div>
    );
  }

  const shownStatusKey = license.licenseStatus || vm.statusKey;
  const packageStatus = statusLabel(labels, shownStatusKey);
  const legacyPackage = isLegacyCommercialPackage(vm.packageKey);
  const distinctLicense = subscriptionShowsDistinctLicense(vm.packageName, license);
  const renewal = renewalPresentation({
    statusKey: vm.statusKey,
    licenseStatus: license.licenseStatus,
    renewalDate: vm.renewalDate,
  });

  const subscriptionTitle = distinctLicense
    ? license.planName
    : legacyPackage && vm.packageName
      ? vm.packageName
      : license.planName || vm.packageName;

  const knownLimits = vm.limits.filter((limit) => limit.state !== "unknown");
  const knownUsage = vm.usageItems.filter((item) => item.value != null);

  return (
    <div className={frame}>
      {/* Hero */}
      <header className="rounded-[var(--app-radius-lg)] border border-[var(--app-border)] bg-[var(--app-card)] p-5 shadow-[var(--app-shadow-card)] sm:p-6">
        {!embedded ? (
          <Link
            href="/app/settings"
            className={`text-sm font-medium text-aipify-companion hover:underline ${AppPremiumShell.focusRing}`}
          >
            ← {labels.back}
          </Link>
        ) : null}
        <div className={`flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between ${embedded ? "" : "mt-3"}`}>
          <div className="min-w-0 max-w-3xl">
            {!embedded ? <p className={AppPremiumShell.eyebrow}>{labels.eyebrow}</p> : null}
            <h1 className={`${embedded ? "" : "mt-2 "} ${AppPremiumShell.pageTitle}`}>{labels.title}</h1>
            <p className={`mt-2 ${AppPremiumShell.pageDescription}`}>{labels.subtitle}</p>
            <dl className="mt-4 grid gap-3 sm:grid-cols-3">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-[var(--app-text-muted)]">
                  {portfolio.workspaceLabel}
                </dt>
                <dd className="mt-1 text-sm font-medium text-[var(--app-text)]">
                  {license.planName || subscriptionTitle || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-[var(--app-text-muted)]">
                  {portfolio.mySubscription}
                </dt>
                <dd className="mt-1 text-sm font-medium text-[var(--app-text)]">
                  {subscriptionTitle || portfolio.detailsUnavailable}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-[var(--app-text-muted)]">
                  {portfolio.overallStatus}
                </dt>
                <dd className="mt-1">
                  <AipifyStatusBadge kind={statusKind(shownStatusKey)} label={packageStatus} />
                </dd>
              </div>
            </dl>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <a
              href="#active-subscription"
              className={`rounded-lg bg-aipify-companion px-3.5 py-2 text-sm font-medium text-white hover:opacity-95 ${AppPremiumShell.focusRing}`}
            >
              {portfolio.viewSubscriptionDetails}
            </a>
            <Link
              href="/app/account/invoices"
              className={`rounded-lg border border-aipify-border bg-aipify-surface px-3.5 py-2 text-sm font-medium text-aipify-text hover:bg-aipify-surface-muted ${AppPremiumShell.focusRing}`}
            >
              {portfolio.viewInvoices}
            </Link>
            <Link
              href="/app/license"
              className={`rounded-lg border border-aipify-border bg-aipify-surface px-3.5 py-2 text-sm font-medium text-aipify-text hover:bg-aipify-surface-muted ${AppPremiumShell.focusRing}`}
            >
              {portfolio.viewLicenseCenter}
            </Link>
            <a
              href="#my-products"
              className={`rounded-lg border border-aipify-border bg-aipify-surface px-3.5 py-2 text-sm font-medium text-aipify-text hover:bg-aipify-surface-muted ${AppPremiumShell.focusRing}`}
            >
              {portfolio.exploreProductsCta}
            </a>
          </div>
        </div>
      </header>

      {/* Active subscription */}
      <section
        id="active-subscription"
        className={`${AppLayoutClasses.card} overflow-hidden !p-0`}
        aria-labelledby="billing-package-heading"
      >
        <div className="flex flex-wrap items-start justify-between gap-3 bg-[image:var(--app-primary-soft-fill)] px-5 py-5 sm:px-6">
          <div className="min-w-0">
            <h2 id="billing-package-heading" className="text-sm font-medium text-[var(--app-text-muted)]">
              {portfolio.mySubscription}
            </h2>
            <p className="mt-1 text-sm text-[var(--app-text-muted)]">{portfolio.currentLicense}</p>
            {subscriptionTitle ? (
              <p className="mt-1 text-2xl font-semibold tracking-tight text-[var(--app-text)]">
                {subscriptionTitle}
              </p>
            ) : null}
          </div>
          <AipifyStatusBadge kind={statusKind(shownStatusKey)} label={packageStatus} />
        </div>
        {vm.packageName || license.planName ? (
          <div className="space-y-4 px-5 py-5 sm:px-6">
            {legacyPackage && vm.packageName && distinctLicense ? (
              <p className="text-sm text-[var(--app-text-muted)]">
                {portfolio.registeredLegacy}:{" "}
                <span className="font-medium text-[var(--app-text)]">{vm.packageName}</span>
              </p>
            ) : null}
            {vm.packageDescription ? (
              <p className="text-sm leading-relaxed text-aipify-text-secondary">{vm.packageDescription}</p>
            ) : null}
            <p className="text-sm text-aipify-text-secondary">
              {labels.renewalDate}:{" "}
              <span className="font-medium text-aipify-text">
                {renewal === "date" && vm.renewalDate
                  ? formatDate(vm.renewalDate, locale)
                  : renewal === "lifetime"
                    ? portfolio.noRenewal
                    : "—"}
              </span>
            </p>
            {!legacyPackage && vm.packageFeatures.length > 0 ? (
              <ul className="grid gap-2 sm:grid-cols-2">
                {vm.packageFeatures.map((feature) => (
                  <li
                    key={feature}
                    className="rounded-lg border border-aipify-border bg-aipify-canvas/50 px-3 py-2 text-sm text-aipify-text"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : (
          <p className="px-5 py-5 text-sm text-aipify-text-secondary sm:px-6">
            {portfolio.detailsUnavailable}
          </p>
        )}
        <div className="flex flex-wrap gap-2 px-5 pb-5 sm:px-6">
          <Link
            href="/app/license"
            className={`rounded-lg border border-aipify-border bg-aipify-surface px-3.5 py-2 text-sm font-medium text-aipify-text hover:bg-aipify-surface-muted ${AppPremiumShell.focusRing}`}
          >
            {portfolio.manageSubscription}
          </Link>
          <Link
            href="/app/settings/modules"
            className={`rounded-lg border border-aipify-border bg-aipify-surface px-3.5 py-2 text-sm font-medium text-aipify-text hover:bg-aipify-surface-muted ${AppPremiumShell.focusRing}`}
          >
            {labels.viewModules}
          </Link>
        </div>
      </section>

      {/* Products */}
      <section id="my-products" className={AppLayoutClasses.card} aria-labelledby="billing-products-heading">
        <h2 id="billing-products-heading" className="sr-only">
          {portfolio.myProducts}
        </h2>
        <KompisProductPortfolio labels={portfolio} access={access} showCatalog={false} />
        <Link
          href="/app/settings/billing/packages"
          className={`mt-6 inline-flex min-h-11 items-center text-sm font-medium text-[#7055EE] hover:underline ${AppPremiumShell.focusRing}`}
        >
          {portfolio.exploreProducts}
        </Link>
      </section>

      {/* Tilleggsmoduler */}
      <section className={AppLayoutClasses.card} aria-labelledby="billing-addons-heading">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 id="billing-addons-heading" className={AppPremiumShell.sectionTitle}>
              {portfolio.addonsSection}
            </h2>
            <p className={`mt-2 ${AppPremiumShell.sectionSubtitle}`}>{portfolio.addonsEmpty}</p>
          </div>
          <Blocks aria-hidden className="size-5 text-[var(--app-primary)]" strokeWidth={2} />
        </div>
        <Link
          href="/app/settings/modules"
          className={`mt-5 inline-flex min-h-11 items-center rounded-lg bg-aipify-companion px-3.5 py-2 text-sm font-medium text-white hover:opacity-95 ${AppPremiumShell.focusRing}`}
        >
          {portfolio.addModule}
        </Link>
      </section>

      <div className={AppLayoutClasses.contentGrid}>
        <div className={`${AppLayoutClasses.mainColumn} space-y-6`}>
          {/* Capacity */}
          <section className={AppLayoutClasses.card} aria-labelledby="billing-limits-heading">
            <h2 id="billing-limits-heading" className={AppPremiumShell.sectionTitle}>
              {labels.sections.limits}
            </h2>
            {knownLimits.length > 0 ? (
              <div className={`mt-5 ${AppLayoutClasses.metricGrid}`}>
                {knownLimits.map((limit) => (
                  <UsageMeter
                    key={limit.key}
                    label={limitLabel(labels, limit.key)}
                    used={limit.used}
                    max={limit.max}
                    percent={limit.percent}
                    state={limit.state}
                    unlimitedLabel={labels.unlimited}
                    unknownLabel={portfolio.limitUnavailable}
                    usedOfMax={labels.usedOfMax}
                    icon={limitIcon(limit.key)}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-aipify-text-secondary">{portfolio.capacityEmpty}</p>
            )}
          </section>

          {/* Usage */}
          <section className={AppLayoutClasses.card} aria-labelledby="billing-usage-heading">
            <h2 id="billing-usage-heading" className={AppPremiumShell.sectionTitle}>
              {labels.sections.usage}
            </h2>
            {knownUsage.length > 0 ? (
              <ul className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {knownUsage.map((item) => (
                  <li
                    key={item.key}
                    className="flex items-center justify-between gap-3 rounded-xl border border-aipify-border bg-aipify-canvas/40 px-3.5 py-3"
                  >
                    <span className="text-sm text-aipify-text-secondary">
                      {usageLabel(labels, item.key)}
                    </span>
                    <span className="text-sm font-semibold tabular-nums text-aipify-text">
                      {item.value}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-aipify-text-secondary">{portfolio.usageEmpty}</p>
            )}
          </section>

          {/* History */}
          <section className={AppLayoutClasses.card} aria-labelledby="billing-history-heading">
            <h2 id="billing-history-heading" className={AppPremiumShell.sectionTitle}>
              {labels.sections.history}
            </h2>
            {vm.history.length > 0 ? (
              <div className="mt-5 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-aipify-border text-aipify-text-secondary">
                      <th className="px-2 py-2 font-medium">{labels.sections.package}</th>
                      <th className="px-2 py-2 font-medium">{labels.statusColumn}</th>
                      <th className="px-2 py-2 font-medium">{labels.renewalDate}</th>
                      <th className="px-2 py-2 font-medium">{labels.lastUpdated}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vm.history.map((row, index) => (
                      <tr key={`${row.planName}-${index}`} className="border-b border-aipify-border/70">
                        <td className="px-2 py-3 font-medium text-aipify-text">{row.planName}</td>
                        <td className="px-2 py-3">
                          <AipifyStatusBadge
                            kind={statusKind(row.statusKey)}
                            label={statusLabel(labels, row.statusKey)}
                          />
                        </td>
                        <td className="px-2 py-3 text-aipify-text-secondary">
                          {row.renewalDate ? formatDate(row.renewalDate, locale) : "—"}
                        </td>
                        <td className="px-2 py-3 text-aipify-text-secondary">
                          {row.updatedAt ? formatDate(row.updatedAt, locale) : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-4 text-sm text-aipify-text-secondary">{labels.emptyHistory}</p>
            )}
          </section>
        </div>

        <aside className={`${AppLayoutClasses.sideColumn} space-y-6`}>
          <section className={AppLayoutClasses.cardMuted} aria-labelledby="billing-support-heading">
            <h2 id="billing-support-heading" className={AppPremiumShell.sectionTitle}>
              {labels.sections.support}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-aipify-text-secondary">{labels.support.body}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <Link
                href="/app/account/invoices"
                className="font-medium text-aipify-companion hover:underline"
              >
                {labels.support.invoiceDetails}
              </Link>
              <Link
                href="/app/settings/billing/packages"
                className="font-medium text-aipify-companion hover:underline"
              >
                {labels.viewPackages}
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
