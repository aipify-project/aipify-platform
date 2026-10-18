"use client";

import { Globe, Monitor, Users, type LucideIcon } from "lucide-react";
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
      // HTTP 200 always renders — sparse/partial payloads must not collapse the page.
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

  return (
    <div className={frame}>
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        {!embedded ? (
          <div className="min-w-0 max-w-3xl">
            <Link
              href="/app/settings"
              className={`text-sm font-medium text-aipify-companion hover:underline ${AppPremiumShell.focusRing}`}
            >
              ← {labels.back}
            </Link>
            <p className={`mt-3 ${AppPremiumShell.eyebrow}`}>{labels.eyebrow}</p>
            <h1 className={`mt-2 ${AppPremiumShell.pageTitle}`}>{labels.title}</h1>
            <p className={`mt-2 ${AppPremiumShell.pageDescription}`}>{labels.subtitle}</p>
            <p className="mt-3 text-sm text-aipify-text-muted">{labels.privacyNote}</p>
          </div>
        ) : (
          <p className="min-w-0 text-sm text-aipify-text-muted">{labels.privacyNote}</p>
        )}
        <div className="flex shrink-0 flex-col items-start gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end">
          <AipifyStatusBadge kind={statusKind(shownStatusKey)} label={packageStatus} />
          <div className="flex flex-wrap gap-2">
            <Link
              href="/app/settings/billing/packages"
              className={`rounded-lg bg-aipify-companion px-3.5 py-2 text-sm font-medium text-white hover:opacity-95 ${AppPremiumShell.focusRing}`}
            >
              {labels.viewPackages}
            </Link>
            <Link
              href="/app/settings/billing/invoice-details"
              className={`rounded-lg border border-aipify-border bg-aipify-surface px-3.5 py-2 text-sm font-medium text-aipify-text hover:bg-aipify-surface-muted ${AppPremiumShell.focusRing}`}
            >
              {labels.viewInvoiceDetails}
            </Link>
          </div>
        </div>
      </header>

      <div className={AppLayoutClasses.contentGrid}>
        <div className={`${AppLayoutClasses.mainColumn} space-y-6`}>
          <section className={`${AppLayoutClasses.card} overflow-hidden !p-0`} aria-labelledby="billing-package-heading">
            <div className="flex flex-wrap items-start justify-between gap-3 bg-[image:var(--app-primary-soft-fill)] px-5 py-5 sm:px-6">
              <div className="min-w-0">
                <h2 id="billing-package-heading" className="text-sm font-medium text-[var(--app-text-muted)]">
                  {portfolio.mySubscription}
                </h2>
                <p className="mt-1 text-sm text-[var(--app-text-muted)]">{portfolio.currentLicense}</p>
                {vm.packageName || license.planName ? (
                  <p className="mt-1 text-2xl font-semibold tracking-tight text-[var(--app-text)]">
                    {distinctLicense
                      ? license.planName
                      : legacyPackage && vm.packageName
                        ? vm.packageName
                        : license.planName || vm.packageName}
                  </p>
                ) : null}
                {vm.modulesCount != null ? (
                  <p className="mt-1 text-sm text-[var(--app-text-muted)]">
                    {labels.modulesCount.replace("{count}", String(vm.modulesCount))}
                  </p>
                ) : null}
              </div>
              <AipifyStatusBadge kind={statusKind(shownStatusKey)} label={packageStatus} />
            </div>
            {vm.packageName || license.planName ? (
              <div className="space-y-4 px-5 py-5 sm:px-6">
                {legacyPackage && vm.packageName ? (
                  <p className="text-sm text-[var(--app-text-muted)]">
                    {portfolio.registeredLegacy}:{" "}
                    <span className="font-medium text-[var(--app-text)]">{vm.packageName}</span>
                  </p>
                ) : null}
                {vm.packageDescription ? (
                  <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">
                    {vm.packageDescription}
                  </p>
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
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
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
              <p className="px-5 py-5 text-sm text-aipify-text-secondary sm:px-6">{portfolio.detailsUnavailable}</p>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-2 px-5 pb-5 text-sm sm:px-6">
              <Link href="/app/license" className="text-aipify-companion hover:underline">
                {labels.viewLicense}
              </Link>
              <Link href="/app/settings/modules" className="text-aipify-companion hover:underline">
                {labels.viewModules}
              </Link>
              <Link
                href="/app/settings/billing/payment-providers"
                className="text-aipify-companion hover:underline"
              >
                {labels.viewPaymentProviders}
              </Link>
            </div>
          </section>

          <section className={AppLayoutClasses.card} aria-labelledby="billing-limits-heading">
            <h2 id="billing-limits-heading" className={AppPremiumShell.sectionTitle}>
              {labels.sections.limits}
            </h2>
            <p className={AppPremiumShell.sectionSubtitle}>{labels.sections.usage}</p>
            <div className={`mt-5 ${AppLayoutClasses.metricGrid}`}>
              {vm.limits.map((limit) => (
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
          </section>

          <section className={AppLayoutClasses.card} aria-labelledby="billing-usage-heading">
            <h2 id="billing-usage-heading" className={AppPremiumShell.sectionTitle}>
              {labels.sections.usage}
            </h2>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {vm.usageItems.map((item) => (
                <li
                  key={item.key}
                  className="flex items-center justify-between gap-3 rounded-xl border border-aipify-border bg-aipify-canvas/40 px-3.5 py-3"
                >
                  <span className="text-sm text-aipify-text-secondary">{usageLabel(labels, item.key)}</span>
                  <span className="text-sm font-semibold tabular-nums text-aipify-text">
                    {item.value == null ? labels.unavailable : item.value}
                  </span>
                </li>
              ))}
            </ul>
          </section>

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
          <section className={AppLayoutClasses.card} aria-labelledby="billing-products-heading">
            <h2 id="billing-products-heading" className={AppPremiumShell.sectionTitle}>
              {portfolio.myProducts}
            </h2>
            <p className="mt-2 text-sm text-aipify-text-secondary">{portfolio.noChange}</p>
            <div className="mt-4">
              <KompisProductPortfolio labels={portfolio} access={access} />
            </div>
            <Link
              href="/app/settings/billing/packages"
              className={`mt-4 inline-flex min-h-11 items-center text-sm font-medium text-[#7055EE] hover:underline ${AppPremiumShell.focusRing}`}
            >
              {portfolio.exploreProducts}
            </Link>
          </section>

          <section className={AppLayoutClasses.cardMuted} aria-labelledby="billing-support-heading">
            <h2 id="billing-support-heading" className={AppPremiumShell.sectionTitle}>
              {labels.sections.support}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-aipify-text-secondary">{labels.support.body}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <Link
                href="/app/settings/billing/invoice-details"
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
