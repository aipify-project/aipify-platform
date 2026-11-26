"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { AipifyStatusBadge } from "@/components/ui/aipify-status-badge";
import { SellerAvatar } from "@/components/platform/sellers/SellerAvatar";
import { partnerStatusKind } from "@/lib/certified-sales-partner/platform-sellers-view";
import {
  availableSellerCountries,
  availableSellerStatuses,
  filterSellerRanking,
  parseSellerRanking,
  sortSellerRanking,
  topSellers,
  type SellerRankMetric,
  type SellerRankRow,
} from "@/lib/certified-sales-partner/seller-ranking";
import type { SellersLiveLabels } from "@/lib/partners-portal/csp-workspace-labels";
import { toBcp47Locale } from "@/lib/platform-presentation-quality/bcp47";

type Props = {
  locale: string;
  labels: SellersLiveLabels;
  /** Opens the canonical seller profile (the same component as the partners table). */
  onOpenProfile: (partnerId: string) => void;
};

type RankingState = { phase: "loading" } | { phase: "error" } | { phase: "ready"; rows: SellerRankRow[] };
type EmailSearchState =
  | { phase: "idle" }
  | { phase: "loading"; query: string }
  | { phase: "done"; query: string; matches: Array<{ partnerId: string; email: string }> }
  | { phase: "error"; query: string };

const PARTNER_STATUS_ORDER = ["registered", "under_review", "needs_information", "approved", "rejected", "suspended"];
const SEARCH_RESULT_LIMIT = 20;
const EMAIL_SEARCH_MIN = 3;

function formatCountry(code: string | null, locale: string, fallback: string): string {
  if (!code) return fallback;
  const upper = code.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(upper)) return code;
  try {
    return new Intl.DisplayNames([toBcp47Locale(locale)], { type: "region" }).of(upper) ?? upper;
  } catch {
    return upper;
  }
}

/**
 * Overview: Top 5 sellers ranked by clicks (default) and a search over ALL sellers.
 * Reads `/api/platform/sellers/ranking`; filters only narrow the ranking Core returned — no invented metrics.
 */
export function CertifiedSellersOverviewRanking({ locale, labels, onOpenProfile }: Props) {
  const l = labels.text;
  const nf = useMemo(() => new Intl.NumberFormat(toBcp47Locale(locale)), [locale]);
  const [ranking, setRanking] = useState<RankingState>({ phase: "loading" });
  const [metric, setMetric] = useState<SellerRankMetric>("clicks");
  const [country, setCountry] = useState("all");
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  const [emailSearch, setEmailSearch] = useState<EmailSearchState>({ phase: "idle" });

  const loadRanking = useCallback(async () => {
    setRanking({ phase: "loading" });
    try {
      const res = await fetch("/api/platform/sellers/ranking", { cache: "no-store" });
      const body = await res.json().catch(() => null);
      const rows = res.ok ? parseSellerRanking(body) : null;
      setRanking(rows ? { phase: "ready", rows } : { phase: "error" });
    } catch {
      setRanking({ phase: "error" });
    }
  }, []);

  useEffect(() => {
    void loadRanking();
  }, [loadRanking]);

  const rows = ranking.phase === "ready" ? ranking.rows : null;
  const countryLabel = useCallback((code: string) => formatCountry(code, locale, code), [locale]);
  const trimmedQuery = query.trim();

  const localMatches = useMemo(
    () => (rows && trimmedQuery ? filterSellerRanking(rows, { query: trimmedQuery, countryLabel }) : []),
    [rows, trimmedQuery, countryLabel],
  );

  // Email lives in the sign-in identity (server-side). Look it up for address-like queries, or when nothing else matched.
  const needsEmailLookup =
    rows !== null &&
    trimmedQuery.length >= EMAIL_SEARCH_MIN &&
    (trimmedQuery.includes("@") || localMatches.length === 0);

  useEffect(() => {
    if (!needsEmailLookup) {
      setEmailSearch({ phase: "idle" });
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setEmailSearch({ phase: "loading", query: trimmedQuery });
      try {
        const res = await fetch(`/api/platform/sellers/ranking?email=${encodeURIComponent(trimmedQuery)}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        const body = (await res.json().catch(() => null)) as { matches?: unknown } | null;
        if (!res.ok || !body || !Array.isArray(body.matches)) {
          setEmailSearch({ phase: "error", query: trimmedQuery });
          return;
        }
        const matches = body.matches.flatMap((m) => {
          if (!m || typeof m !== "object") return [];
          const r = m as Record<string, unknown>;
          return typeof r.partnerId === "string" && typeof r.email === "string"
            ? [{ partnerId: r.partnerId, email: r.email }]
            : [];
        });
        setEmailSearch({ phase: "done", query: trimmedQuery, matches });
      } catch {
        if (!controller.signal.aborted) setEmailSearch({ phase: "error", query: trimmedQuery });
      }
    }, 350);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [needsEmailLookup, trimmedQuery]);

  const emailByPartner = useMemo(() => {
    const map = new Map<string, string>();
    if (emailSearch.phase === "done" && emailSearch.query === trimmedQuery) {
      for (const m of emailSearch.matches) map.set(m.partnerId, m.email);
    }
    return map;
  }, [emailSearch, trimmedQuery]);

  const searchResults = useMemo(() => {
    if (!rows || !trimmedQuery) return [];
    return sortSellerRanking(
      filterSellerRanking(rows, {
        query: trimmedQuery,
        countryLabel,
        emailMatchIds: new Set(emailByPartner.keys()),
      }),
      "clicks",
    );
  }, [rows, trimmedQuery, countryLabel, emailByPartner]);

  const top = useMemo(
    () => (rows ? topSellers(filterSellerRanking(rows, { country, status }), 5, metric) : []),
    [rows, country, status, metric],
  );

  const countries = useMemo(() => (rows ? availableSellerCountries(rows) : []), [rows]);
  const statuses = useMemo(() => (rows ? availableSellerStatuses(rows, PARTNER_STATUS_ORDER) : []), [rows]);

  const metricLabel: Record<SellerRankMetric, string> = {
    clicks: l.colClicks,
    registrations: l.colRegistrations,
    qualifiedSales: l.colSales,
  };
  const statusLabel = (s: string) => labels.partnerStatus[s] ?? labels.partnerStatus.unknown;

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card title={l.top5Title} hint={l.top5Subtitle}>
        {ranking.phase === "loading" ? <AipifyLoader centered size="sm" label={l.loading} /> : null}
        {ranking.phase === "error" ? (
          <div role="status" className="space-y-2">
            <p className="text-sm font-medium text-[color:var(--aipify-text-primary)]">{l.top5Unavailable}</p>
            <button type="button" onClick={() => void loadRanking()} className={LINK_BUTTON}>
              {l.retry}
            </button>
          </div>
        ) : null}
        {rows ? (
          <>
            <div className="mb-4 grid gap-3 sm:grid-cols-3">
              <Select label={l.rankSortLabel} value={metric} onChange={(v) => setMetric(v as SellerRankMetric)}>
                <option value="clicks">{l.rankSortClicks}</option>
                <option value="registrations">{l.rankSortRegistrations}</option>
                <option value="qualifiedSales">{l.rankSortSales}</option>
              </Select>
              <Select label={l.rankFilterCountry} value={country} onChange={setCountry}>
                <option value="all">{l.rankFilterAllCountries}</option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {formatCountry(c, locale, c)}
                  </option>
                ))}
              </Select>
              <Select label={l.rankFilterStatus} value={status} onChange={setStatus}>
                <option value="all">{l.rankFilterAllStatuses}</option>
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {statusLabel(s)}
                  </option>
                ))}
              </Select>
            </div>

            {top.length === 0 ? (
              <p className="text-sm text-[color:var(--aipify-text-secondary)]">{l.top5Empty}</p>
            ) : (
              <ol className="space-y-2">
                {top.map((row, index) => (
                  <li key={row.partnerId}>
                    <button
                      type="button"
                      aria-haspopup="dialog"
                      onClick={() => onOpenProfile(row.partnerId)}
                      className="flex w-full items-center gap-3 rounded-xl border border-[color:var(--aipify-border)] px-3 py-2 text-left hover:border-[color:var(--aipify-companion-purple)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--aipify-focus-ring)]"
                    >
                      <span className="w-5 text-sm font-semibold text-[color:var(--aipify-text-secondary)]">
                        <span className="sr-only">{l.colRank} </span>
                        {index + 1}
                      </span>
                      <SellerAvatar name={row.displayName} imageUrl={row.avatarUrl} size="sm" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium text-[color:var(--aipify-text-primary)]">
                          {row.displayName ?? l.partnerUnnamed}
                        </span>
                        <span className="block truncate text-xs text-[color:var(--aipify-text-secondary)]">
                          {formatCountry(row.country, locale, l.dateEmpty)}
                        </span>
                      </span>
                      <span className="text-right">
                        <span className="block text-base font-semibold text-[color:var(--aipify-text-primary)]">
                          {nf.format(row[metric])}
                        </span>
                        <span className="block text-xs text-[color:var(--aipify-text-secondary)]">
                          {metricLabel[metric]}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            )}
            <p className="mt-3 text-xs text-[color:var(--aipify-text-secondary)]">{l.rankFiltersNote}</p>
          </>
        ) : null}
      </Card>

      <Card title={l.searchTitle} hint={l.searchHint}>
        <label className="block text-sm">
          <span className="font-medium">{l.searchLabel}</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={l.searchPlaceholder}
            autoComplete="off"
            disabled={!rows}
            className="mt-1 w-full rounded-xl border border-[color:var(--aipify-border)] px-3 py-2 disabled:opacity-60"
          />
        </label>

        <div className="mt-4" aria-live="polite">
          {rows && trimmedQuery ? (
            <>
              {emailSearch.phase === "loading" ? (
                <AipifyLoader centered size="sm" label={l.loading} />
              ) : null}
              {searchResults.length === 0 && emailSearch.phase !== "loading" ? (
                <p className="text-sm text-[color:var(--aipify-text-secondary)]">
                  {emailSearch.phase === "error" ? l.searchEmailUnavailable : l.searchEmpty}
                </p>
              ) : null}
              {searchResults.length > 0 ? (
                <>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--aipify-text-secondary)]">
                    {l.searchResultsTitle}
                  </p>
                  <ul className="space-y-2">
                    {searchResults.slice(0, SEARCH_RESULT_LIMIT).map((row) => {
                      const email = emailByPartner.get(row.partnerId);
                      return (
                        <li key={row.partnerId}>
                          <button
                            type="button"
                            aria-haspopup="dialog"
                            onClick={() => onOpenProfile(row.partnerId)}
                            className="flex w-full items-center gap-3 rounded-xl border border-[color:var(--aipify-border)] px-3 py-2 text-left hover:border-[color:var(--aipify-companion-purple)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--aipify-focus-ring)]"
                          >
                            <SellerAvatar name={row.displayName} imageUrl={row.avatarUrl} size="sm" />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate font-medium text-[color:var(--aipify-text-primary)]">
                                {row.displayName ?? l.partnerUnnamed}
                              </span>
                              <span className="block truncate text-xs text-[color:var(--aipify-text-secondary)]">
                                {formatCountry(row.country, locale, l.dateEmpty)}
                                {email ? ` · ${l.searchEmailMatch}: ${email}` : ""}
                              </span>
                            </span>
                            <AipifyStatusBadge kind={partnerStatusKind(row.status)} label={statusLabel(row.status)} />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </>
              ) : null}
            </>
          ) : null}
        </div>
      </Card>
    </div>
  );
}

const LINK_BUTTON =
  "text-sm font-semibold text-[color:var(--aipify-companion-purple)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--aipify-focus-ring)]";

function Card({ title, hint, children }: { title: string; hint: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-[color:var(--aipify-text-primary)]">{title}</h2>
      <p className="mb-4 mt-1 text-sm text-[color:var(--aipify-text-secondary)]">{hint}</p>
      {children}
    </section>
  );
}

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-[color:var(--aipify-border)] px-3 py-2"
      >
        {children}
      </select>
    </label>
  );
}
