"use client";

import { AipifyLoader } from "@/components/ui/aipify-loader";
import { AipifyStatusBadge } from "@/components/ui/aipify-status-badge";
import {
  buildBillingViewModel,
  type BillingLockedCapability,
  type BillingReferenceLabels,
  type BillingViewModel,
} from "@/lib/commercial-packages";
import { AppLayoutClasses } from "@/lib/design/app-layout";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import type { AipifyStatusKind } from "@/lib/design/status-system";
import { formatDate } from "@/lib/i18n/format-date";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type BillingAdminPanelProps = {
  labels: BillingReferenceLabels;
  locale: string;
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

function lockedReason(labels: BillingReferenceLabels, kind: BillingLockedCapability["kind"]): string {
  if (kind === "addon") return labels.locked.addonReason;
  if (kind === "recommendation") return labels.locked.recommendationReason;
  return labels.locked.upgradeReason;
}

function nextStepBody(labels: BillingReferenceLabels, vm: BillingViewModel): string {
  if (vm.nextStep.kind === "view_packages") {
    return vm.nextStep.recommendationText?.trim() || labels.nextStep.viewPackages;
  }
  if (vm.nextStep.kind === "review_usage") return labels.nextStep.reviewUsage;
  return labels.nextStep.none;
}

function UsageMeter({
  label,
  used,
  max,
  percent,
  unlimitedLabel,
  usedOfMax,
}: {
  label: string;
  used: number;
  max: number | null;
  percent: number | null;
  unlimitedLabel: string;
  usedOfMax: string;
}) {
  const valueText =
    max == null
      ? `${used} · ${unlimitedLabel}`
      : usedOfMax.replace("{used}", String(used)).replace("{max}", String(max));

  return (
    <div className="rounded-xl border border-aipify-border bg-aipify-canvas/40 p-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-medium text-aipify-text">{label}</p>
        <p className="text-sm tabular-nums text-aipify-text-secondary">{valueText}</p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-aipify-surface-muted">
        <div
          className="h-full rounded-full bg-aipify-companion transition-[width]"
          style={{ width: `${percent == null ? Math.min(12, used > 0 ? 12 : 0) : percent}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export function BillingAdminPanel({ labels, locale }: BillingAdminPanelProps) {
  const [vm, setVm] = useState<BillingViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

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
      setVm(buildBillingViewModel(payload));
    } catch {
      setVm(null);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (loading) {
    return (
      <div className={AppLayoutClasses.page}>
        <AipifyLoader centered />
        <span className="sr-only">{labels.title}</span>
      </div>
    );
  }

  if (loadError || !vm) {
    return (
      <div className={`${AppLayoutClasses.page} ${AppLayoutClasses.sectionGap}`}>
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

  const packageStatus = statusLabel(labels, vm.statusKey);
  const usageWithValues = vm.usageItems.filter((item) => item.value > 0);
  const usageRows = usageWithValues.length > 0 ? usageWithValues : vm.usageItems;

  return (
    <div className={`${AppLayoutClasses.page} ${AppLayoutClasses.sectionGap}`}>
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
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
        <div className="flex shrink-0 flex-col items-start gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end">
          <AipifyStatusBadge kind={statusKind(vm.statusKey)} label={packageStatus} />
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
          <section className={AppLayoutClasses.card} aria-labelledby="billing-package-heading">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 id="billing-package-heading" className={AppPremiumShell.sectionTitle}>
                  {labels.sections.package}
                </h2>
                <p className={AppPremiumShell.sectionSubtitle}>
                  {labels.modulesCount.replace("{count}", String(vm.modulesCount))}
                </p>
              </div>
              <AipifyStatusBadge kind={statusKind(vm.statusKey)} label={packageStatus} />
            </div>
            {vm.packageName ? (
              <div className="mt-5">
                <p className="text-2xl font-semibold tracking-tight text-aipify-text">{vm.packageName}</p>
                {vm.packageDescription ? (
                  <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">
                    {vm.packageDescription}
                  </p>
                ) : null}
                {vm.nextBillingDate ? (
                  <p className="mt-3 text-sm text-aipify-text-secondary">
                    {labels.nextBillingDate}:{" "}
                    <span className="font-medium text-aipify-text">
                      {formatDate(vm.nextBillingDate, locale)}
                    </span>
                  </p>
                ) : null}
                {vm.packageFeatures.length > 0 ? (
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
              <p className="mt-4 text-sm text-aipify-text-secondary">{labels.emptyPackage}</p>
            )}
            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm">
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
                  unlimitedLabel={labels.unlimited}
                  usedOfMax={labels.usedOfMax}
                />
              ))}
            </div>
          </section>

          <section className={AppLayoutClasses.card} aria-labelledby="billing-usage-heading">
            <h2 id="billing-usage-heading" className={AppPremiumShell.sectionTitle}>
              {labels.sections.usage}
            </h2>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {usageRows.map((item) => (
                <li
                  key={item.key}
                  className="flex items-center justify-between gap-3 rounded-xl border border-aipify-border bg-aipify-canvas/40 px-3.5 py-3"
                >
                  <span className="text-sm text-aipify-text-secondary">{usageLabel(labels, item.key)}</span>
                  <span className="text-sm font-semibold tabular-nums text-aipify-text">{item.value}</span>
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
                      <th className="px-2 py-2 font-medium">{labels.nextBillingDate}</th>
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
                          {row.nextBillingDate
                            ? formatDate(row.nextBillingDate, locale)
                            : labels.unavailable}
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
          <section className={AppLayoutClasses.card} aria-labelledby="billing-next-heading">
            <h2 id="billing-next-heading" className={AppPremiumShell.sectionTitle}>
              {labels.sections.nextStep}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-aipify-text-secondary">
              {nextStepBody(labels, vm)}
            </p>
            {vm.nextStep.kind === "view_packages" ? (
              <Link
                href="/app/settings/billing/packages"
                className={`mt-4 inline-flex rounded-lg bg-aipify-companion px-3.5 py-2 text-sm font-medium text-white hover:opacity-95 ${AppPremiumShell.focusRing}`}
              >
                {labels.locked.viewPackagesCta}
              </Link>
            ) : null}
          </section>

          <section className={AppLayoutClasses.card} aria-labelledby="billing-locked-heading">
            <h2 id="billing-locked-heading" className={AppPremiumShell.sectionTitle}>
              {labels.sections.locked}
            </h2>
            {vm.lockedCapabilities.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {vm.lockedCapabilities.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-xl border border-aipify-border bg-aipify-canvas/40 p-3.5"
                  >
                    <p className="text-sm font-semibold text-aipify-text">{item.name}</p>
                    {item.description ? (
                      <p className="mt-1 text-sm leading-relaxed text-aipify-text-secondary">
                        {item.description}
                      </p>
                    ) : null}
                    <p className="mt-2 text-xs text-aipify-text-muted">{lockedReason(labels, item.kind)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-aipify-text-secondary">{labels.emptyLocked}</p>
            )}
            {vm.lockedCapabilities.length > 0 ? (
              <Link
                href="/app/settings/billing/packages"
                className="mt-4 inline-flex text-sm font-medium text-aipify-companion hover:underline"
              >
                {labels.locked.viewPackagesCta}
              </Link>
            ) : null}
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
