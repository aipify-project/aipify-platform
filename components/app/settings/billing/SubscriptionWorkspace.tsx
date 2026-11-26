"use client";

import { ModulesAdminPanel } from "@/components/app/settings/ModulesAdminPanel";
import { KompisProductPortfolio } from "@/components/app/settings/billing/KompisProductPortfolio";
import {
  SubscriptionTabNav,
  type SubscriptionTabLabels,
} from "@/components/app/settings/billing/SubscriptionTabNav";
import { TrustLicenseCenterPanel } from "@/components/app/license";
import { EnterpriseInvoiceDetailsPanel } from "@/components/shared/enterprise-invoicing";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { AipifyStatusBadge } from "@/components/ui/aipify-status-badge";
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
import { buildWorkspaceProductCards } from "@/lib/commercial-packages/product-hero";
import {
  parseSubscriptionTab,
  subscriptionTabHref,
  type SubscriptionTabId,
} from "@/lib/commercial-packages/subscription-tabs";
import { AppLayoutClasses } from "@/lib/design/app-layout";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import type { AipifyStatusKind } from "@/lib/design/status-system";
import { formatDate } from "@/lib/i18n/format-date";
import { Boxes, FileText, Globe, Monitor, Package, ShieldCheck, Users, type LucideIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";

type SubscriptionWorkspaceProps = {
  labels: BillingReferenceLabels;
  portfolio: PortfolioLabels;
  tabLabels: SubscriptionTabLabels;
  license: WorkspaceLicenseRead;
  access: KompisProductAccessRead;
  locale: string;
  presentation?: BillingPresentationMaps;
  initialTab: SubscriptionTabId;
  modulesLabels: React.ComponentProps<typeof ModulesAdminPanel>["labels"];
  licenseLabels: React.ComponentProps<typeof TrustLicenseCenterPanel>["labels"];
  invoiceLabels: React.ComponentProps<typeof EnterpriseInvoiceDetailsPanel>["labels"];
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

export function SubscriptionWorkspace({
  labels,
  portfolio,
  tabLabels,
  license,
  access,
  locale,
  presentation,
  initialTab,
  modulesLabels,
  licenseLabels,
  invoiceLabels,
}: SubscriptionWorkspaceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const urlTab = parseSubscriptionTab(searchParams.get("tab"));
  const [activeTab, setActiveTab] = useState<SubscriptionTabId>(initialTab);

  useEffect(() => {
    setActiveTab(urlTab);
  }, [urlTab]);

  const selectTab = useCallback(
    (tab: SubscriptionTabId) => {
      setActiveTab(tab);
      startTransition(() => {
        router.replace(subscriptionTabHref(tab), { scroll: false });
      });
    },
    [router]
  );

  const [vm, setVm] = useState<BillingViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const presentationOptions = useMemo(
    () => presentationOptionsFromMaps(presentation),
    [presentation]
  );

  const refreshBilling = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const res = await fetch("/api/commercial-packages/billing");
      if (!res.ok) {
        setVm(null);
        setLoadError(true);
        return;
      }
      setVm(buildBillingViewModel(await res.json(), presentationOptions));
    } catch {
      setVm(null);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [presentationOptions]);

  useEffect(() => {
    if (activeTab === "overview" || activeTab === "capacity" || activeTab === "products") {
      void refreshBilling();
    }
  }, [activeTab, refreshBilling]);

  const activeProducts = buildWorkspaceProductCards(access).filter((c) => c.inMyProducts);
  const shownStatusKey = license.licenseStatus || vm?.statusKey || null;
  const packageStatus = statusLabel(labels, shownStatusKey);
  const legacyPackage = isLegacyCommercialPackage(vm?.packageKey);
  const distinctLicense = subscriptionShowsDistinctLicense(vm?.packageName ?? null, license);
  const renewal = renewalPresentation({
    statusKey: vm?.statusKey ?? null,
    licenseStatus: license.licenseStatus,
    renewalDate: vm?.renewalDate ?? null,
  });
  const subscriptionTitle = distinctLicense
    ? license.planName
    : legacyPackage && vm?.packageName
      ? vm.packageName
      : license.planName || vm?.packageName;
  const knownLimits = (vm?.limits ?? []).filter((limit) => limit.state !== "unknown");
  const knownUsage = (vm?.usageItems ?? []).filter((item) => item.value != null);

  return (
    <div className={`w-full ${AppLayoutClasses.sectionGap}`}>
      <header className="rounded-[var(--app-radius-lg)] border border-[var(--app-border)] bg-[var(--app-card)] p-5 shadow-[var(--app-shadow-card)] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 max-w-3xl">
            <h2 className={AppPremiumShell.pageTitle}>{labels.title}</h2>
            <p className={`mt-2 ${AppPremiumShell.pageDescription}`}>{labels.subtitle}</p>
          </div>
          <AipifyStatusBadge kind={statusKind(shownStatusKey)} label={packageStatus} />
        </div>
        <div className="mt-5">
          <SubscriptionTabNav active={activeTab} labels={tabLabels} onSelect={selectTab} />
        </div>
      </header>

      <div
        role="tabpanel"
        id={`subscription-panel-${activeTab}`}
        aria-labelledby={`subscription-tab-${activeTab}`}
        className={pending ? "opacity-90" : undefined}
      >
        {activeTab === "overview" ? (
          loading && !vm ? (
            <AipifyLoader centered />
          ) : loadError && !vm ? (
            <div className={`${AppLayoutClasses.card} border-rose-200 bg-rose-50/70`}>
              <p className="text-sm text-rose-800">{labels.loadError}</p>
              <button
                type="button"
                onClick={() => void refreshBilling()}
                className={`mt-4 rounded-lg bg-aipify-companion px-4 py-2 text-sm font-medium text-white ${AppPremiumShell.focusRing}`}
              >
                {labels.retry}
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <article className={`${AppLayoutClasses.card} flex h-full flex-col`}>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--app-text-muted)]">
                  {portfolio.mySubscription}
                </p>
                <p className="mt-2 text-xl font-semibold tracking-tight text-[var(--app-text)]">
                  {subscriptionTitle || portfolio.detailsUnavailable}
                </p>
                <p className="mt-2 text-sm text-[var(--app-text-muted)]">
                  {labels.renewalDate}:{" "}
                  {renewal === "date" && vm?.renewalDate
                    ? formatDate(vm.renewalDate, locale)
                    : renewal === "lifetime"
                      ? portfolio.noRenewal
                      : "—"}
                </p>
                {legacyPackage && vm?.packageName && distinctLicense ? (
                  <p className="mt-3 text-xs text-[var(--app-text-muted)]">
                    {portfolio.registeredLegacy}: {vm.packageName}
                  </p>
                ) : null}
                <div className="mt-auto pt-4">
                  <AipifyStatusBadge kind={statusKind(shownStatusKey)} label={packageStatus} />
                </div>
              </article>

              <article className={`${AppLayoutClasses.card} flex h-full flex-col`}>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--app-text-muted)]">
                  {portfolio.myProducts}
                </p>
                <p className="mt-2 text-xl font-semibold tabular-nums text-[var(--app-text)]">
                  {activeProducts.length}
                </p>
                <p className="mt-2 text-sm text-[var(--app-text-muted)]">
                  {activeProducts.length > 0
                    ? activeProducts
                        .map((p) =>
                          p.id === "kompis_web"
                            ? portfolio.kompisWeb
                            : p.id === "kompis_bedrift"
                              ? portfolio.kompisBedrift
                              : portfolio.salesPartner
                        )
                        .join(" · ")
                    : portfolio.detailsUnavailable}
                </p>
                <button
                  type="button"
                  onClick={() => selectTab("products")}
                  className={`mt-auto inline-flex min-h-11 items-center gap-2 pt-4 text-sm font-medium text-[var(--app-primary)] hover:underline ${AppPremiumShell.focusRing}`}
                >
                  <Package aria-hidden className="size-4" />
                  {portfolio.myProducts}
                </button>
              </article>

              <article className={`${AppLayoutClasses.card} flex h-full flex-col`}>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--app-text-muted)]">
                  {tabLabels.store}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--app-text-muted)]">
                  {portfolio.exploreProducts}
                </p>
                <button
                  type="button"
                  onClick={() => selectTab("store")}
                  className={`mt-auto inline-flex min-h-11 items-center gap-2 pt-4 text-sm font-medium text-[var(--app-primary)] hover:underline ${AppPremiumShell.focusRing}`}
                >
                  <Boxes aria-hidden className="size-4" />
                  {portfolio.exploreProductsCta}
                </button>
              </article>

              <article className={`${AppLayoutClasses.card} flex h-full flex-col`}>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--app-text-muted)]">
                  {tabLabels.invoices} / {tabLabels.license}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--app-text-muted)]">
                  {portfolio.viewInvoices} · {portfolio.viewLicenseCenter}
                </p>
                <div className="mt-auto flex flex-wrap gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => selectTab("invoices")}
                    className={`inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[var(--app-primary)] hover:underline ${AppPremiumShell.focusRing}`}
                  >
                    <FileText aria-hidden className="size-4" />
                    {portfolio.viewInvoices}
                  </button>
                  <button
                    type="button"
                    onClick={() => selectTab("license")}
                    className={`inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[var(--app-primary)] hover:underline ${AppPremiumShell.focusRing}`}
                  >
                    <ShieldCheck aria-hidden className="size-4" />
                    {portfolio.viewLicenseCenter}
                  </button>
                </div>
              </article>
            </div>
          )
        ) : null}

        {activeTab === "products" ? (
          <div className={AppLayoutClasses.card}>
            <KompisProductPortfolio
              labels={portfolio}
              access={access}
              mineOnly
              onExploreStore={() => selectTab("store")}
            />
          </div>
        ) : null}

        {activeTab === "store" ? (
          <div className={AppLayoutClasses.card}>
            <KompisProductPortfolio labels={portfolio} access={access} storeOnly showCatalog />
          </div>
        ) : null}

        {activeTab === "addons" ? (
          <div className={AppLayoutClasses.card}>
            <ModulesAdminPanel labels={modulesLabels} embedded />
          </div>
        ) : null}

        {activeTab === "capacity" ? (
          loading && !vm ? (
            <AipifyLoader centered />
          ) : (
            <div className="space-y-6">
              <section className={AppLayoutClasses.card}>
                <h3 className={AppPremiumShell.sectionTitle}>{labels.sections.limits}</h3>
                {knownLimits.length > 0 ? (
                  <div className={`mt-5 ${AppLayoutClasses.metricGrid}`}>
                    {knownLimits.map((limit) => (
                      <UsageMeter
                        key={limit.key}
                        label={labels.limits[limit.key]}
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
                  <p className="mt-4 text-sm text-[var(--app-text-muted)]">{portfolio.capacityEmpty}</p>
                )}
              </section>
              <section className={AppLayoutClasses.card}>
                <h3 className={AppPremiumShell.sectionTitle}>{labels.sections.usage}</h3>
                {knownUsage.length > 0 ? (
                  <ul className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                    {knownUsage.map((item) => (
                      <li
                        key={item.key}
                        className="flex items-center justify-between gap-3 rounded-xl border border-aipify-border bg-aipify-canvas/40 px-3.5 py-3"
                      >
                        <span className="text-sm text-aipify-text-secondary">
                          {labels.usage[item.key] ?? labels.unavailable}
                        </span>
                        <span className="text-sm font-semibold tabular-nums text-aipify-text">
                          {item.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-[var(--app-text-muted)]">{portfolio.usageEmpty}</p>
                )}
              </section>
            </div>
          )
        ) : null}

        {activeTab === "license" ? (
          <div className={AppLayoutClasses.card}>
            <TrustLicenseCenterPanel locale={locale} labels={licenseLabels} />
          </div>
        ) : null}

        {activeTab === "invoices" ? (
          <div className={AppLayoutClasses.card}>
            <EnterpriseInvoiceDetailsPanel
              backHref={subscriptionTabHref("overview")}
              labels={invoiceLabels}
              locale={locale}
              embedded
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
