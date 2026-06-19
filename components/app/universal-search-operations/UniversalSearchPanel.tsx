"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import type {
  SearchResultItem,
  UniversalSearchCenter,
  UniversalSearchLabels,
  UniversalSearchQueryResult,
  UniversalSearchTab,
} from "@/lib/universal-search-operations";
import { parseUniversalSearchCenter, parseUniversalSearchQueryResult } from "@/lib/universal-search-operations/parse";

type Tab = UniversalSearchTab;

type Props = {
  labels: UniversalSearchLabels;
  initialTab?: Tab;
  titleOverride?: string;
  visibleTabs?: Tab[];
  initialQuery?: string;
};

export function UniversalSearchPanel({ labels, initialTab = "overview", titleOverride, visibleTabs, initialQuery = "" }: Props) {
  const [center, setCenter] = useState<UniversalSearchCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>(initialTab);
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState(initialQuery);
  const [searchMode, setSearchMode] = useState("global");
  const [results, setResults] = useState<UniversalSearchQueryResult | null>(null);
  const [saveName, setSaveName] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/universal-search-operations");
    if (res.ok) setCenter(parseUniversalSearchCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  const runSearch = useCallback(async (q: string, mode = searchMode) => {
    if (!q.trim()) {
      setResults(null);
      return;
    }
    setBusy(true);
    const res = await fetch(`/api/app/universal-search-operations/query?q=${encodeURIComponent(q.trim())}&mode=${encodeURIComponent(mode)}`);
    if (res.ok) setResults(parseUniversalSearchQueryResult(await res.json()));
    else setResults(null);
    setBusy(false);
  }, [searchMode]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (initialQuery) void runSearch(initialQuery);
  }, [initialQuery, runSearch]);

  async function runAction(action_type: string, payload: Record<string, unknown> = {}) {
    setBusy(true);
    await fetch("/api/app/universal-search-operations/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type, payload }),
    });
    setBusy(false);
    await load();
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
  const analytics = center.analytics ?? {};
  const executive = center.executive_dashboard ?? {};
  const saved = center.saved_searches ?? [];
  const categories = center.categories ?? [];
  const modes = center.search_modes ?? [];
  const searchResults = results?.results ?? [];

  const allTabs: { id: Tab; label: string }[] = [
    { id: "overview", label: labels.overview },
    { id: "search", label: labels.search },
    { id: "discovery", label: labels.discovery },
    { id: "saved_searches", label: labels.savedSearches },
    { id: "filters", label: labels.filters },
    { id: "analytics", label: labels.analytics },
    { id: "reports", label: labels.reports },
  ];
  const tabs = visibleTabs ? allTabs.filter((t) => visibleTabs.includes(t.id)) : allTabs;

  function renderResults(items: SearchResultItem[]) {
    if (items.length === 0) {
      return <PlatformEmptyState title={labels.noResults} message={labels.emptyHint} />;
    }
    return items.map((item) => (
      <div key={item.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-xs uppercase text-aipify-text-muted">{item.entity_type.replace(/_/g, " ")}</p>
            <h3 className="font-semibold text-aipify-text">{item.title}</h3>
            {item.summary ? <p className="text-aipify-text-secondary">{item.summary}</p> : null}
            <p className="mt-1 capitalize text-aipify-text-muted">{labels.status}: {item.status.replace(/_/g, " ")}</p>
          </div>
          {item.record_href ? (
            <Link href={item.record_href} className={AipifyShellClasses.secondaryButton} onClick={() => void runAction("record_result_open", { query, entity_type: item.entity_type, entity_id: item.entity_id })}>
              {labels.openResult}
            </Link>
          ) : null}
        </div>
      </div>
    ));
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-semibold text-aipify-text">{titleOverride ?? labels.title}</h1>
        <p className="mt-1 text-sm text-aipify-text-secondary">{labels.subtitle}</p>
        {center.principle ? <p className="mt-2 text-xs text-aipify-text-muted">{center.principle}</p> : null}
        <p className="mt-1 text-xs text-aipify-text-muted">{labels.keyboardShortcut}</p>
      </header>

      <div className={`${AipifyShellClasses.surfaceCard} grid gap-3 p-4 sm:grid-cols-[1fr_auto_auto]`}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") void runSearch(query); }}
          placeholder={labels.searchPlaceholder}
          className={AipifyShellClasses.input}
        />
        <select value={searchMode} onChange={(e) => setSearchMode(e.target.value)} className={AipifyShellClasses.input}>
          {modes.map((m) => (
            <option key={m.key} value={m.key}>{m.label}</option>
          ))}
        </select>
        <button type="button" disabled={busy || !query.trim()} onClick={() => void runSearch(query)} className={AipifyShellClasses.primaryButton}>
          {labels.runSearch}
        </button>
      </div>

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
                [labels.indexedItems, overview.indexed_items],
                [labels.savedSearchCount, overview.saved_searches],
                [labels.searches7d, overview.searches_7d],
                [labels.discoveryTriggers, overview.discovery_triggers_7d],
              ] as [string, string | number | undefined][]
            ).map(([label, value]) => (
              <div key={String(label)} className={`${AipifyShellClasses.surfaceCard} p-4`}>
                <p className="text-xs text-aipify-text-muted">{label}</p>
                <p className="mt-1 text-xl font-semibold text-aipify-text">{value ?? "—"}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-aipify-text-secondary">{labels.permissionNote}</p>
          {searchResults.length > 0 ? renderResults(searchResults) : null}
        </>
      ) : null}

      {tab === "search" ? (
        <div className="space-y-4">
          {results?.natural_language?.intent ? (
            <p className="text-sm text-aipify-text-secondary">{labels.naturalLanguage}: {String(results.natural_language.intent).replace(/_/g, " ")}</p>
          ) : null}
          {results?.permission_note ? <p className="text-xs text-aipify-text-muted">{results.permission_note}</p> : null}
          {renderResults(searchResults)}
          <div className={`${AipifyShellClasses.surfaceCard} grid gap-3 p-4 sm:grid-cols-2`}>
            <input value={saveName} onChange={(e) => setSaveName(e.target.value)} placeholder={labels.saveSearchName} className={AipifyShellClasses.input} />
            <button type="button" disabled={busy || !saveName.trim() || !query.trim()} onClick={() => void runAction("save_search", { name: saveName.trim(), query: query.trim(), search_mode: searchMode }).then(() => setSaveName(""))} className={AipifyShellClasses.secondaryButton}>
              {labels.saveSearch}
            </button>
          </div>
        </div>
      ) : null}

      {tab === "discovery" ? (
        <div className="space-y-4">
          <p className="text-sm text-aipify-text-secondary">{labels.smartRecommendations}</p>
          {(results?.discovery ?? []).length === 0 && !query ? (
            <PlatformEmptyState title={labels.discovery} message={labels.emptyHint} />
          ) : (
            (results?.discovery ?? []).map((item, i) => (
              <div key={i} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <p className="text-xs uppercase text-aipify-text-muted">{item.entity_type.replace(/_/g, " ")}</p>
                <h3 className="font-semibold text-aipify-text">{item.title}</h3>
                {item.record_href ? <Link href={item.record_href} className="mt-2 inline-block text-aipify-accent underline">{labels.openResult}</Link> : null}
              </div>
            ))
          )}
          <button type="button" disabled={busy || !query.trim()} onClick={() => void runAction("trigger_discovery", { query })} className={AipifyShellClasses.secondaryButton}>
            {labels.discovery}
          </button>
        </div>
      ) : null}

      {tab === "saved_searches" ? (
        <div className="space-y-4">
          {saved.length === 0 ? (
            <PlatformEmptyState title={labels.savedSearches} message={labels.emptyHint} />
          ) : (
            saved.map((s) => (
              <div key={s.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <h3 className="font-semibold text-aipify-text">{s.name}</h3>
                <p className="text-aipify-text-secondary">{s.query}</p>
                <button type="button" disabled={busy} onClick={() => { setQuery(s.query); setSearchMode(s.search_mode); void runSearch(s.query, s.search_mode); setTab("search"); }} className={`mt-3 ${AipifyShellClasses.primaryButton}`}>
                  {labels.runSearch}
                </button>
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "filters" ? (
        <section className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
          <h2 className="font-semibold text-aipify-text">{labels.filters}</h2>
          <p className="mt-2 text-aipify-text-secondary">{labels.categories}: {categories.join(", ")}</p>
          {Array.isArray(center.filters?.supported) ? (
            <p className="mt-2 text-aipify-text-secondary">{(center.filters?.supported as string[]).join(" · ")}</p>
          ) : null}
        </section>
      ) : null}

      {tab === "analytics" ? (
        <section className={`${AipifyShellClasses.surfaceCard} space-y-2 p-4 text-sm`}>
          <p>{labels.searches7d}: {String(analytics.search_frequency_7d ?? 0)}</p>
          <p>{labels.companionIntegration}: {String(analytics.companion_usage_7d ?? 0)}</p>
          {Array.isArray(analytics.popular_searches) && (analytics.popular_searches as Record<string, unknown>[]).length > 0 ? (
            <ul className="mt-3 space-y-1 text-aipify-text-secondary">
              {(analytics.popular_searches as Record<string, unknown>[]).map((row, i) => (
                <li key={i}>{String(row.query ?? "")} ({String(row.count ?? 0)})</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {tab === "reports" ? (
        <section className={`${AipifyShellClasses.surfaceCard} space-y-2 p-4 text-sm`}>
          <p>{labels.searchHealth}: {String(executive.search_health ?? "—")}</p>
          <p>{labels.indexedItems}: {String(executive.indexed_items ?? 0)}</p>
          <p>{String(executive.knowledge_gaps ?? "")}</p>
          <button type="button" disabled={busy} onClick={() => void runAction("rebuild_index")} className={`mt-3 ${AipifyShellClasses.secondaryButton}`}>
            {labels.rebuildIndex}
          </button>
        </section>
      ) : null}

      {center.audit_recent && center.audit_recent.length > 0 ? (
        <section className={`${AipifyShellClasses.surfaceCard} p-4`}>
          <h2 className="text-sm font-semibold text-aipify-text">{labels.auditLog}</h2>
          <ul className="mt-3 space-y-1 text-xs text-aipify-text-secondary">
            {center.audit_recent.slice(0, 10).map((entry, i) => (
              <li key={i}>{entry.summary}{entry.query ? ` · "${entry.query}"` : ""}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
