"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import type {
  BusinessPack,
  MarketplaceOperationsCenter,
  MarketplaceOperationsLabels,
  MarketplaceOperationsTab,
} from "@/lib/marketplace-operations";
import { parseMarketplaceOperationsCenter } from "@/lib/marketplace-operations/parse";

type Tab = MarketplaceOperationsTab;

type Props = {
  labels: MarketplaceOperationsLabels;
  initialTab?: Tab;
  titleOverride?: string;
  subtitleOverride?: string;
  visibleTabs?: Tab[];
};

function PackCard({
  pack,
  labels,
  onInstall,
  onTrial,
  busy,
}: {
  pack: BusinessPack;
  labels: MarketplaceOperationsLabels;
  onInstall?: (key: string) => void;
  onTrial?: (key: string) => void;
  busy?: boolean;
}) {
  const missingDeps =
    pack.dependency_check?.satisfied === false && Array.isArray(pack.dependency_check.missing)
      ? (pack.dependency_check.missing as string[])
      : [];

  return (
    <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs uppercase text-aipify-text-muted">{pack.category?.replace(/_/g, " ")}</p>
          <p className="font-medium text-aipify-text">{pack.pack_name}</p>
          {pack.version ? <p className="text-xs text-aipify-text-muted">v{pack.version}</p> : null}
        </div>
        {pack.status ? (
          <span className="rounded-full bg-aipify-surface-muted px-2 py-0.5 text-xs text-aipify-text-secondary">
            {pack.status.replace(/_/g, " ")}
          </span>
        ) : null}
      </div>
      {pack.description ? <p className="mt-2 text-aipify-text-secondary">{pack.description}</p> : null}
      {pack.starting_price_monthly != null ? (
        <p className="mt-1 text-xs text-aipify-text-muted">
          {pack.starting_price_monthly} {labels.perMonth}
          {pack.trial_days ? ` · ${pack.trial_days}d trial` : ""}
        </p>
      ) : null}
      {missingDeps.length > 0 ? (
        <p className="mt-2 text-xs text-amber-700">
          {labels.dependenciesMissing}: {missingDeps.join(", ")}
        </p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {pack.detail_href ? (
          <Link href={pack.detail_href} className={`${AipifyShellClasses.secondaryButton} text-xs`}>
            {labels.openCatalog}
          </Link>
        ) : null}
        {onInstall && pack.status === "available" ? (
          <button type="button" disabled={busy || missingDeps.length > 0} onClick={() => onInstall(pack.pack_key)} className={`${AipifyShellClasses.primaryButton} text-xs`}>
            {labels.installPack}
          </button>
        ) : null}
        {onTrial && pack.status === "available" ? (
          <button type="button" disabled={busy} onClick={() => onTrial(pack.pack_key)} className={`${AipifyShellClasses.secondaryButton} text-xs`}>
            {labels.startTrial}
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function MarketplaceOperationsPanel({
  labels,
  initialTab = "overview",
  titleOverride,
  subtitleOverride,
  visibleTabs,
}: Props) {
  const [center, setCenter] = useState<MarketplaceOperationsCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>(initialTab);
  const [busy, setBusy] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<BusinessPack[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/marketplace-operations");
    if (res.ok) setCenter(parseMarketplaceOperationsCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  async function runAction(action_type: string, payload: Record<string, unknown> = {}) {
    setBusy(true);
    await fetch("/api/app/marketplace-operations/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type, payload }),
    });
    setBusy(false);
    await load();
  }

  async function runSearch() {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setBusy(true);
    const res = await fetch(`/api/app/marketplace-operations/search?q=${encodeURIComponent(searchQuery.trim())}`);
    if (res.ok) {
      const data = await res.json();
      setSearchResults(Array.isArray(data.results) ? data.results : []);
    }
    setBusy(false);
  }

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
      </div>
    );
  }

  if (!center?.found) {
    return <AipifyModuleAccessDenied message={labels.accessDenied} />;
  }

  const overview = center.overview ?? {};
  const advisor = center.companion_advisor ?? {};
  const executive = center.executive_dashboard ?? {};
  const governance = center.platform_governance ?? {};
  const routes = center.routes ?? {};

  const allTabs: { id: Tab; label: string }[] = [
    { id: "overview", label: labels.overview },
    { id: "business_packs", label: labels.businessPacks },
    { id: "installed", label: labels.installed },
    { id: "recommended", label: labels.recommended },
    { id: "connectors", label: labels.connectors },
    { id: "licenses", label: labels.licenses },
    { id: "domains", label: labels.domains },
    { id: "purchases", label: labels.purchases },
    { id: "reports", label: labels.reports },
    { id: "companion", label: labels.companion },
  ];
  const tabs = visibleTabs ? allTabs.filter((t) => visibleTabs.includes(t.id)) : allTabs;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-semibold text-aipify-text">{titleOverride ?? labels.title}</h1>
        <p className="mt-1 text-sm text-aipify-text-secondary">{subtitleOverride ?? labels.subtitle}</p>
        {center.principle ? <p className="mt-2 text-xs text-aipify-text-muted">{center.principle}</p> : null}
      </header>

      <div className={`${AipifyShellClasses.surfaceCard} flex flex-wrap gap-2 p-3`}>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={labels.searchPlaceholder}
          className="min-w-[200px] flex-1 rounded-md border border-aipify-border bg-white px-3 py-2 text-sm"
        />
        <button type="button" disabled={busy} onClick={() => void runSearch()} className={`${AipifyShellClasses.primaryButton} text-sm`}>
          {labels.searchMarketplace}
        </button>
        <Link href={routes.catalog ?? "/app/marketplace/catalog"} className={`${AipifyShellClasses.secondaryButton} text-sm`}>
          {labels.openCatalog}
        </Link>
        <Link href={routes.integrations ?? "/app/integrations"} className={`${AipifyShellClasses.secondaryButton} text-sm`}>
          {labels.connectors}
        </Link>
      </div>

      {searchResults.length > 0 ? (
        <section className="grid gap-3 sm:grid-cols-2">
          {searchResults.map((p) => (
            <PackCard key={p.pack_key} pack={p} labels={labels} />
          ))}
        </section>
      ) : null}

      <nav className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={tab === item.id ? `${AipifyShellClasses.primaryButton} text-sm` : `${AipifyShellClasses.secondaryButton} text-sm`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {tab === "overview" ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(
              [
                [labels.catalogCount, overview.catalog_count],
                [labels.installedCount, overview.installed_count],
                [labels.trialCount, overview.trial_count],
                [labels.updateCount, overview.update_count],
              ] as const
            ).map(([label, value]) => (
              <div key={label} className={`${AipifyShellClasses.surfaceCard} p-4`}>
                <p className="text-xs uppercase text-aipify-text-muted">{label}</p>
                <p className="mt-1 text-2xl font-semibold text-aipify-text">{String(value ?? 0)}</p>
              </div>
            ))}
          </div>
          <section>
            <h2 className="mb-3 text-sm font-semibold text-aipify-text">{labels.featuredPacks}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(center.featured_packs ?? []).slice(0, 6).map((p) => (
                <PackCard key={p.pack_key} pack={p} labels={labels} busy={busy} onInstall={(k) => void runAction("install_pack", { pack_key: k })} onTrial={(k) => void runAction("start_trial", { pack_key: k })} />
              ))}
            </div>
          </section>
        </>
      ) : null}

      {tab === "business_packs" ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(center.business_packs ?? []).length === 0 ? (
            <PlatformEmptyState title={labels.noItems} message={labels.emptyHint} />
          ) : (
            center.business_packs?.map((p) => (
              <PackCard key={p.pack_key} pack={p} labels={labels} busy={busy} onInstall={(k) => void runAction("install_pack", { pack_key: k })} onTrial={(k) => void runAction("start_trial", { pack_key: k })} />
            ))
          )}
        </div>
      ) : null}

      {tab === "installed" ? (
        <div className="space-y-3">
          {(center.installed_packs ?? []).length === 0 ? (
            <PlatformEmptyState title={labels.noItems} message={labels.emptyHint} />
          ) : (
            center.installed_packs?.map((p) => (
              <div key={`${p.pack_key}-${p.domain_id}`} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <p className="font-medium text-aipify-text">{p.pack_name ?? p.pack_key}</p>
                <p className="mt-1 text-xs text-aipify-text-muted">
                  {p.domain ?? "Organization-wide"} · {p.license_status} · v{p.version ?? "—"}
                </p>
              </div>
            ))
          )}
          <Link href={routes.installed ?? "/app/marketplace/installed"} className={`${AipifyShellClasses.secondaryButton} inline-flex text-xs`}>
            {labels.openInstalled}
          </Link>
        </div>
      ) : null}

      {tab === "recommended" ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(center.recommended_packs ?? []).map((p) => (
            <PackCard key={p.pack_key} pack={p} labels={labels} busy={busy} onInstall={(k) => void runAction("install_pack", { pack_key: k })} onTrial={(k) => void runAction("start_trial", { pack_key: k })} />
          ))}
        </div>
      ) : null}

      {tab === "connectors" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {(center.connectors ?? []).length === 0 ? (
            <PlatformEmptyState title={labels.noItems} message={labels.emptyHint} />
          ) : (
            center.connectors?.map((c) => (
              <div key={c.connector_key} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <p className="font-medium text-aipify-text">{c.connector_name}</p>
                <p className="text-xs text-aipify-text-muted">{c.category}</p>
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "licenses" ? (
        <div className={`${AipifyShellClasses.surfaceCard} space-y-3 p-4 text-sm`}>
          <h2 className="font-semibold text-aipify-text">{labels.licenseOrchestration}</h2>
          <pre className="overflow-auto rounded bg-aipify-surface-muted p-3 text-xs text-aipify-text-secondary">
            {JSON.stringify(center.licenses ?? {}, null, 2)}
          </pre>
        </div>
      ) : null}

      {tab === "domains" ? (
        <div className="space-y-3">
          {(center.domains ?? []).map((d) => (
            <div key={d.domain_id ?? d.domain} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="font-medium text-aipify-text">{d.domain}</p>
              <p className="mt-1 text-xs text-aipify-text-muted">
                {d.license_status} · {d.pack_count ?? 0} packs
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "purchases" ? (
        <div className="space-y-3">
          {(center.purchases ?? []).map((p, i) => (
            <div key={`${p.pack_key}-${p.created_at}-${i}`} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="font-medium text-aipify-text">{p.pack_key}</p>
              <p className="mt-1 text-aipify-text-secondary">{p.summary}</p>
              <p className="mt-1 text-xs text-aipify-text-muted">{p.event_type}</p>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "reports" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(center.reports ?? {}).map(([key, value]) => (
            <div key={key} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="text-xs uppercase text-aipify-text-muted">{key.replace(/_/g, " ")}</p>
              <p className="mt-1 font-medium text-aipify-text">
                {typeof value === "object" ? JSON.stringify(value) : String(value ?? "—")}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "companion" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
            <h2 className="font-semibold text-aipify-text">{labels.companionAdvisor}</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-aipify-text-secondary">
              {Array.isArray(advisor.prompts) ? advisor.prompts.map((p) => <li key={String(p)}>{String(p)}</li>) : null}
            </ul>
          </div>
          <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
            <h2 className="font-semibold text-aipify-text">{labels.industryPacks}</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {(center.industry_packs ?? []).map((p) => (
                <PackCard key={p.pack_key} pack={p} labels={labels} />
              ))}
            </div>
          </div>
          <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
            <h2 className="font-semibold text-aipify-text">{labels.executiveDashboard}</h2>
            {Array.isArray(executive.companion_recommendations) ? (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-aipify-text-secondary">
                {executive.companion_recommendations.map((h) => (
                  <li key={String(h)}>{String(h)}</li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
            <h2 className="font-semibold text-aipify-text">{labels.platformGovernance}</h2>
            {Array.isArray(governance.controls) ? (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-aipify-text-secondary">
                {governance.controls.map((c) => (
                  <li key={String(c)}>{String(c)}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      ) : null}

      {(center.available_upgrades ?? []).length > 0 ? (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-aipify-text">{labels.availableUpgrades}</h2>
          <div className="space-y-2">
            {center.available_upgrades?.map((u) => (
              <div key={u.id} className={`${AipifyShellClasses.surfaceCard} flex flex-wrap items-center justify-between gap-2 p-4 text-sm`}>
                <div>
                  <p className="font-medium text-aipify-text">{u.pack_key}</p>
                  <p className="text-xs text-aipify-text-muted">
                    {u.from_version} → {u.to_version} · {u.update_type}
                  </p>
                </div>
                <button type="button" disabled={busy} onClick={() => void runAction("apply_update", { update_id: u.id })} className={`${AipifyShellClasses.primaryButton} text-xs`}>
                  {labels.applyUpdate}
                </button>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {(center.audit_recent ?? []).length > 0 ? (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-aipify-text">{labels.auditLog}</h2>
          <div className="space-y-2">
            {center.audit_recent?.map((entry) => (
              <div key={`${entry.action}-${entry.created_at}`} className={`${AipifyShellClasses.surfaceCard} p-3 text-xs text-aipify-text-secondary`}>
                <span className="font-medium text-aipify-text">{entry.action}</span> — {entry.summary}
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
