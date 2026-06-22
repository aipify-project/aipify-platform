"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { AppErrorState } from "@/components/app/design";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { resolveAppPortalAccessMessageKey } from "@/lib/app-portal/access-state-messages";
import type { AppOrganizationContextState } from "@/lib/tenant/resolve-app-organization-context";
import {
  APP_STORE_CARD_STATUS_STYLE,
  parseAppStoreHome,
  type AppStoreHome,
  type AppStoreLabels,
  type AppStorePackListing,
} from "@/lib/app-store";

type SectionKey = "installed" | "marketplace" | "recommended" | "popular" | "recently_added";

export type AppStoreCatalogRouting = {
  detailHref: (packKey: string) => string;
  installHref: (packKey: string) => string;
  upgradeHref: (packKey: string) => string;
};

function PackCard({
  listing,
  labels,
  catalogRouting,
  onInstall,
  onUpgrade,
  onRemove,
  busy,
}: {
  listing: AppStorePackListing;
  labels: AppStoreLabels;
  catalogRouting?: AppStoreCatalogRouting;
  onInstall: (key: string) => void;
  onUpgrade: (key: string) => void;
  onRemove: (key: string) => void;
  busy: boolean;
}) {
  const statusStyle = APP_STORE_CARD_STATUS_STYLE[listing.card_status] ?? APP_STORE_CARD_STATUS_STYLE.available;
  const detailHref = catalogRouting?.detailHref(listing.pack_key) ?? listing.detail_route;

  return (
    <article className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-violet-50 text-lg font-bold text-indigo-800">
          {listing.pack_logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={listing.pack_logo_url} alt="" className="h-12 w-12 rounded-xl object-cover" />
          ) : (
            listing.pack_name.charAt(0)
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={detailHref} className="font-semibold text-gray-900 hover:text-indigo-700">
              {listing.pack_name}
            </Link>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusStyle}`}>
              {listing.card_status.replace(/_/g, " ")}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {listing.category.replace(/_/g, " ")} · {labels.version} {listing.version}
          </p>
        </div>
      </div>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">{listing.short_description}</p>
      {listing.included_modules.length > 0 ? (
        <p className="mt-2 text-xs text-gray-500">
          {labels.includedModules}: {listing.included_modules.map((m) => m.module_name).join(", ")}
        </p>
      ) : null}
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-gray-100 pt-4">
        <div>
          <p className="text-sm font-semibold text-gray-900">{listing.starting_price || labels.startingPrice}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={detailHref}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {labels.viewDetails}
          </Link>
          {listing.installed && listing.workspace_route ? (
            <Link
              href={listing.workspace_route}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              {labels.openWorkspace}
            </Link>
          ) : null}
          {listing.installed ? (
            <>
              <Link
                href="/app/settings/module-access"
                className="rounded-lg border border-indigo-200 px-3 py-1.5 text-sm font-medium text-indigo-800 hover:bg-indigo-50"
              >
                {labels.manageAccess}
              </Link>
              <button
                type="button"
                disabled={busy}
                onClick={() => onRemove(listing.pack_key)}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-800 hover:bg-red-50 disabled:opacity-60"
              >
                {labels.remove}
              </button>
            </>
          ) : null}
          {listing.upgrade_required ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => onUpgrade(listing.pack_key)}
              className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-900 hover:bg-amber-100 disabled:opacity-60"
            >
              {labels.upgrade}
            </button>
          ) : null}
          {!listing.installed && listing.install_available ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => onInstall(listing.pack_key)}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {labels.install}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function Section({
  title,
  listings,
  labels,
  catalogRouting,
  onInstall,
  onUpgrade,
  onRemove,
  busy,
}: {
  title: string;
  listings: AppStorePackListing[];
  labels: AppStoreLabels;
  catalogRouting?: AppStoreCatalogRouting;
  onInstall: (key: string) => void;
  onUpgrade: (key: string) => void;
  onRemove: (key: string) => void;
  busy: boolean;
}) {
  if (listings.length === 0) return null;
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <PackCard
            key={listing.pack_key}
            listing={listing}
            labels={labels}
            catalogRouting={catalogRouting}
            onInstall={onInstall}
            onUpgrade={onUpgrade}
            onRemove={onRemove}
            busy={busy}
          />
        ))}
      </div>
    </section>
  );
}

export function AppStoreHomePanel({
  labels,
  locale = "en",
  catalogRouting,
  hideHeader = false,
  initialTab = "marketplace",
  visibleTabs,
}: {
  labels: AppStoreLabels;
  locale?: string;
  catalogRouting?: AppStoreCatalogRouting;
  hideHeader?: boolean;
  initialTab?: SectionKey;
  visibleTabs?: SectionKey[];
}) {
  const [home, setHome] = useState<AppStoreHome | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [accessState, setAccessState] = useState<AppOrganizationContextState | null>(null);
  const [activeTab, setActiveTab] = useState<SectionKey>(initialTab);
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    const res = await fetch(`/api/app/store?locale=${encodeURIComponent(locale)}`, { cache: "no-store" });
    if (res.ok) {
      setHome(parseAppStoreHome(await res.json()));
      setAccessState(null);
    } else {
      const body = (await res.json()) as {
        error?: string;
        access_state?: AppOrganizationContextState;
      };
      setAccessState(body.access_state ?? "access_denied");
      setLoadError(body.error ?? "access_denied");
      setHome(null);
    }
    setLoading(false);
  }, [locale]);

  useEffect(() => { void load(); }, [load]);

  async function runAction(actionType: string, packKey: string, payload: Record<string, unknown> = {}) {
    setBusy(true);
    await fetch("/api/app/store/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type: actionType, pack_key: packKey, payload }),
    });
    setBusy(false);
    await load();
  }

  function handleInstall(packKey: string) {
    window.location.href = catalogRouting?.installHref(packKey) ?? `/app/store/${packKey}?install=1`;
  }

  function handleUpgrade(packKey: string) {
    window.location.href = catalogRouting?.upgradeHref(packKey) ?? `/app/store/${packKey}?upgrade=1`;
  }

  async function handleRemove(packKey: string) {
    if (removeTarget !== packKey) {
      setRemoveTarget(packKey);
      return;
    }
    await runAction("remove_pack", packKey, { confirmed: true });
    setRemoveTarget(null);
  }

  if (loading && !home) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
      </div>
    );
  }

  if (loadError && !home) {
    const messageKey = resolveAppPortalAccessMessageKey(accessState, loadError);
    const description =
      messageKey === "pageLoadError"
        ? labels.loadErrorBody
        : messageKey === "entitlementLocked"
          ? labels.entitlementLocked
          : messageKey === "permissionMissing"
            ? labels.permissionMissing
            : labels.loadErrorBody;
    return (
      <AppErrorState
        title={labels.loadErrorTitle}
        description={description}
        onRetry={() => void load()}
        retryLabel={labels.retry}
      />
    );
  }

  if (!home?.found) {
    return (
      <PlatformEmptyState
        title={labels.catalogPendingTitle}
        message={labels.catalogPendingDescription}
      />
    );
  }

  const catalogPending = home.catalog_pending === true;
  const activeListings = home.sections?.[activeTab] ?? [];
  const marketplaceEmpty =
    catalogPending ||
    (activeTab === "marketplace" && activeListings.length === 0 && (home.sections?.installed.length ?? 0) === 0);

  if (marketplaceEmpty && hideHeader) {
    return (
      <PlatformEmptyState
        title={labels.catalogPendingTitle}
        message={labels.catalogPendingDescription}
      />
    );
  }

  const allTabs: { key: SectionKey; label: string; count: number }[] = [
    { key: "installed", label: labels.installed, count: home.sections?.installed.length ?? 0 },
    { key: "marketplace", label: labels.marketplace, count: home.sections?.marketplace.length ?? 0 },
    { key: "recommended", label: labels.recommended, count: home.sections?.recommended.length ?? 0 },
    { key: "popular", label: labels.popular, count: home.sections?.popular.length ?? 0 },
    { key: "recently_added", label: labels.recentlyAdded, count: home.sections?.recently_added.length ?? 0 },
  ];
  const tabs = visibleTabs ? allTabs.filter((tab) => visibleTabs.includes(tab.key)) : allTabs;

  const activeListingsForTab = home.sections?.[activeTab] ?? [];

  return (
    <div className={`mx-auto max-w-6xl space-y-8 ${hideHeader ? "" : "p-6"}`}>
      {!hideHeader ? (
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
            <p className="mt-2 text-gray-600">{labels.subtitle}</p>
            {home.principle ? <p className="mt-2 text-sm font-medium text-violet-800">{home.principle}</p> : null}
            {home.governance_note ? <p className="mt-1 text-xs text-zinc-500">{home.governance_note}</p> : null}
          </div>
          <Link
            href="/app/licenses"
            className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-100"
          >
            {labels.licensesLink}
          </Link>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              activeTab === tab.key
                ? "bg-indigo-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab.label}
            {tab.count > 0 ? ` (${tab.count})` : ""}
          </button>
        ))}
      </div>

      {removeTarget ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
          <p>{labels.removeWarning}</p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => void handleRemove(removeTarget)}
              className="rounded-lg bg-red-700 px-3 py-1.5 text-white hover:bg-red-800 disabled:opacity-60"
            >
              {labels.confirmRemove}
            </button>
            <button
              type="button"
              onClick={() => setRemoveTarget(null)}
              className="rounded-lg border border-red-200 px-3 py-1.5 hover:bg-red-100"
            >
              {labels.cancel}
            </button>
          </div>
        </div>
      ) : null}

      {activeListingsForTab.length === 0 ? (
        <PlatformEmptyState
          title={catalogPending ? labels.catalogPendingTitle : labels.emptyTitle}
          message={catalogPending ? labels.catalogPendingDescription : labels.emptyDescription}
          primaryAction={
            catalogPending
              ? undefined
              : { label: labels.browseMarketplace, href: "/app/store" }
          }
        />
      ) : (
        <Section
          title={tabs.find((t) => t.key === activeTab)?.label ?? labels.marketplace}
          listings={activeListingsForTab}
          labels={labels}
          catalogRouting={catalogRouting}
          onInstall={handleInstall}
          onUpgrade={handleUpgrade}
          onRemove={handleRemove}
          busy={busy}
        />
      )}

      {(home.sections?.recommended.length ?? 0) > 0 && activeTab !== "recommended" ? (
        <Section
          title={labels.recommended}
          listings={home.sections?.recommended ?? []}
          labels={labels}
          catalogRouting={catalogRouting}
          onInstall={handleInstall}
          onUpgrade={handleUpgrade}
          onRemove={handleRemove}
          busy={busy}
        />
      ) : null}
    </div>
  );
}
