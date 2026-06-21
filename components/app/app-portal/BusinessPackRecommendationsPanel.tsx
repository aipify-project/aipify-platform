"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  PACK_COMPLEXITY_LEVELS,
  PACK_CONFIDENCE_LEVELS,
  PACK_IMPACT_LEVELS,
  PACK_RECOMMENDATION_CATEGORIES,
  parsePackComparison,
  parsePackRecommendationOverview,
  type PackComparisonItem,
  type PackRecommendation,
  type PackRecommendationLabels,
  type PackRecommendationOverview,
} from "@/lib/app-portal/business-pack-recommendations";
import { resolveRecommendationLearnMore } from "@/lib/app-portal/business-pack-resolver";

type Props = { labels: PackRecommendationLabels };

const RECOMMENDATIONS_STATE_KEY = "aipify:business-pack-recommendations-state";

const CONFIDENCE_STYLE: Record<string, string> = {
  exploratory: "bg-slate-100 text-slate-700",
  suggested: "bg-blue-100 text-blue-900",
  strong_match: "bg-teal-100 text-teal-900",
  highly_relevant: "bg-indigo-100 text-indigo-900",
};

export function BusinessPackRecommendationsPanel({ labels }: Props) {
  const [data, setData] = useState<PackRecommendationOverview | null>(null);
  const [comparison, setComparison] = useState<PackComparisonItem[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [industry, setIndustry] = useState("");
  const [category, setCategory] = useState("");
  const [complexity, setComplexity] = useState("");
  const [businessImpact, setBusinessImpact] = useState("");
  const [confidenceLevel, setConfidenceLevel] = useState("");
  const [installedStatus, setInstalledStatus] = useState("");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const restoredRef = useRef(false);
  const scrollRestoredRef = useRef(false);

  useEffect(() => {
    if (restoredRef.current || typeof window === "undefined") return;
    restoredRef.current = true;
    try {
      const raw = sessionStorage.getItem(RECOMMENDATIONS_STATE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as {
        industry?: string;
        category?: string;
        complexity?: string;
        businessImpact?: string;
        confidenceLevel?: string;
        installedStatus?: string;
        search?: string;
        scrollY?: number;
      };
      if (saved.industry) setIndustry(saved.industry);
      if (saved.category) setCategory(saved.category);
      if (saved.complexity) setComplexity(saved.complexity);
      if (saved.businessImpact) setBusinessImpact(saved.businessImpact);
      if (saved.confidenceLevel) setConfidenceLevel(saved.confidenceLevel);
      if (saved.installedStatus) setInstalledStatus(saved.installedStatus);
      if (saved.search) setSearch(saved.search);
      if (typeof saved.scrollY === "number") {
        requestAnimationFrame(() => {
          window.scrollTo(0, saved.scrollY ?? 0);
          scrollRestoredRef.current = true;
        });
      }
    } catch {
      // ignore corrupt session state
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || scrollRestoredRef.current) return;
    const onScroll = () => {
      sessionStorage.setItem(
        RECOMMENDATIONS_STATE_KEY,
        JSON.stringify({
          industry,
          category,
          complexity,
          businessImpact,
          confidenceLevel,
          installedStatus,
          search,
          scrollY: window.scrollY,
        })
      );
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [industry, category, complexity, businessImpact, confidenceLevel, installedStatus, search]);

  function persistBeforeNavigate() {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(
      RECOMMENDATIONS_STATE_KEY,
      JSON.stringify({
        industry,
        category,
        complexity,
        businessImpact,
        confidenceLevel,
        installedStatus,
        search,
        scrollY: window.scrollY,
      })
    );
  }

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (industry) params.set("industry", industry);
    if (category) params.set("category", category);
    if (complexity) params.set("complexity", complexity);
    if (businessImpact) params.set("business_impact", businessImpact);
    if (confidenceLevel) params.set("confidence_level", confidenceLevel);
    if (installedStatus) params.set("installed_status", installedStatus);
    if (search.trim()) params.set("search", search.trim());
    const res = await fetch(`/api/aipify/business-packs/recommendations?${params}`);
    if (res.ok) {
      setData(parsePackRecommendationOverview(await res.json()));
    } else {
      const body = (await res.json()) as { error?: string };
      setError(body.error ?? labels.accessDenied);
      setData(null);
    }
    setLoading(false);
  }, [industry, category, complexity, businessImpact, confidenceLevel, installedStatus, search, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function saveRecommendation(packKey: string) {
    setBusy(true);
    const res = await fetch("/api/aipify/business-packs/recommendations/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pack_key: packKey }),
    });
    setBusy(false);
    if (res.ok) setData(parsePackRecommendationOverview(await res.json()));
  }

  async function dismissRecommendation(packKey: string) {
    setBusy(true);
    const res = await fetch("/api/aipify/business-packs/recommendations/dismiss", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pack_key: packKey }),
    });
    setBusy(false);
    if (res.ok) setData(parsePackRecommendationOverview(await res.json()));
  }

  async function runCompare() {
    if (selected.length < 2) return;
    setBusy(true);
    const res = await fetch("/api/aipify/business-packs/recommendations/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pack_keys: selected.slice(0, 3) }),
    });
    setBusy(false);
    if (res.ok) setComparison(parsePackComparison(await res.json()));
  }

  function toggleSelect(packKey: string) {
    setSelected((prev) => (
      prev.includes(packKey) ? prev.filter((k) => k !== packKey) : [...prev, packKey].slice(0, 3)
    ));
  }

  if (loading && !data && !error) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" aria-hidden />
        <p className="mt-4 text-sm text-slate-600">{labels.loading}</p>
      </div>
    );
  }

  if (error && !data?.found) {
    return (
      <div className="mx-auto max-w-6xl space-y-4">
        <Link href="/app" className="text-sm font-medium text-indigo-700 hover:underline">← APP Dashboard</Link>
        <p className="text-slate-600">{labels.accessDenied}</p>
      </div>
    );
  }

  const empty = !data?.has_recommendations;
  const canFull = data?.can_full === true;
  const canManage = data?.can_manage === true;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <Link href="/app" className="text-sm font-medium text-indigo-700 hover:underline">← APP Dashboard</Link>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">{labels.title}</h1>
        <p className="mt-2 text-slate-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-slate-800">{labels.principle}</p>
      </div>

      {empty ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{labels.emptyTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{labels.emptyBody}</p>
          <Link href="/app/business-packs/available" className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white">{labels.emptyCta}</Link>
        </section>
      ) : null}

      <section className="flex flex-wrap gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={labels.filters.search} className="min-w-[12rem] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder={labels.filters.industry} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.category}</option>
          {PACK_RECOMMENDATION_CATEGORIES.map((c) => <option key={c} value={c}>{labels.categories[c]}</option>)}
        </select>
        <select value={complexity} onChange={(e) => setComplexity(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.complexity}</option>
          {PACK_COMPLEXITY_LEVELS.map((c) => <option key={c} value={c}>{labels.complexityLevels[c]}</option>)}
        </select>
        <select value={businessImpact} onChange={(e) => setBusinessImpact(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.businessImpact}</option>
          {PACK_IMPACT_LEVELS.map((i) => <option key={i} value={i}>{labels.impactLevels[i]}</option>)}
        </select>
        <select value={confidenceLevel} onChange={(e) => setConfidenceLevel(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.confidenceLevel}</option>
          {PACK_CONFIDENCE_LEVELS.map((c) => <option key={c} value={c}>{labels.confidenceLevels[c]}</option>)}
        </select>
        <select value={installedStatus} onChange={(e) => setInstalledStatus(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.installedStatus}</option>
          <option value="not_installed">{labels.filters.notInstalled}</option>
          <option value="installed">{labels.filters.installed}</option>
        </select>
      </section>

      {!empty && canFull ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-600">{labels.compare.selectTwo}</p>
            <button type="button" disabled={busy || selected.length < 2} onClick={() => void runCompare()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
              {labels.compare.runCompare}
            </button>
          </div>
        </section>
      ) : null}

      {!empty && (data?.recommendations?.length ?? 0) > 0 ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">{labels.dashboard.recommendedPacks}</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {data!.recommendations!.map((rec) => (
              <RecommendationCard
                key={rec.id}
                rec={rec}
                labels={labels}
                canFull={canFull}
                canManage={canManage}
                busy={busy}
                selected={selected.includes(rec.pack_key)}
                onToggleSelect={() => toggleSelect(rec.pack_key)}
                onSave={() => void saveRecommendation(rec.pack_key)}
                onDismiss={() => void dismissRecommendation(rec.pack_key)}
                onNavigate={persistBeforeNavigate}
              />
            ))}
          </div>
        </section>
      ) : null}

      {comparison.length > 0 ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h2 className="font-semibold">{labels.compare.title}</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {comparison.map((item) => (
              <div key={item.pack_key} className="rounded-xl border border-white bg-white p-4 text-sm">
                <h3 className="font-semibold text-slate-900">{item.name}</h3>
                <p className="mt-2"><span className="text-slate-500">{labels.compare.complexity}:</span> {labels.complexityLevels[item.complexity as keyof typeof labels.complexityLevels] ?? item.complexity}</p>
                <p><span className="text-slate-500">{labels.compare.impact}:</span> {labels.impactLevels[item.business_impact as keyof typeof labels.impactLevels] ?? item.business_impact}</p>
                <p><span className="text-slate-500">{labels.compare.audience}:</span> {item.recommended_audience}</p>
                <p className="mt-2 font-medium">{labels.compare.features}</p>
                <ul className="list-disc pl-5">{item.features.map((f) => <li key={f}>{f}</li>)}</ul>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {!empty && (data?.installed_packs?.length ?? 0) > 0 ? (
        <SidebarList title={labels.dashboard.installedPacks} items={data!.installed_packs!.map((p) => p.name ?? p.pack_key)} />
      ) : null}

      {!empty && canFull && (data?.saved_recommendations?.length ?? 0) > 0 ? (
        <SidebarList title={labels.dashboard.savedRecommendations} items={data!.saved_recommendations!.map((p) => p.pack_key)} />
      ) : null}

      {!empty && (data?.recently_viewed?.length ?? 0) > 0 ? (
        <SidebarList title={labels.dashboard.recentlyViewed} items={data!.recently_viewed!.map((p) => p.pack_key)} />
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold">{labels.faq.title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div><dt className="font-medium">{labels.faq.whatIs}</dt><dd className="mt-1 text-slate-600">{labels.faq.whatIsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.autoInstall}</dt><dd className="mt-1 text-slate-600">{labels.faq.autoInstallAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.whyChange}</dt><dd className="mt-1 text-slate-600">{labels.faq.whyChangeAnswer}</dd></div>
        </dl>
      </section>
    </div>
  );
}

function RecommendationCard({
  rec,
  labels,
  canFull,
  canManage,
  busy,
  selected,
  onToggleSelect,
  onSave,
  onDismiss,
  onNavigate,
}: {
  rec: PackRecommendation;
  labels: PackRecommendationLabels;
  canFull: boolean;
  canManage: boolean;
  busy: boolean;
  selected: boolean;
  onToggleSelect: () => void;
  onSave: () => void;
  onDismiss: () => void;
  onNavigate: () => void;
}) {
  const { href: learnMoreHref } = resolveRecommendationLearnMore(rec);
  const confidenceLabel =
    labels.confidenceLevels[rec.confidence_level as keyof typeof labels.confidenceLevels] ??
    rec.confidence_level;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-slate-900">{rec.name}</h3>
            <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-900">
              {labels.card.matchBadge}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${CONFIDENCE_STYLE[rec.confidence_level] ?? CONFIDENCE_STYLE.suggested}`}>
              {confidenceLabel}
            </span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${rec.installed ? "bg-emerald-100 text-emerald-900" : "bg-slate-100 text-slate-700"}`}>
              {rec.installed ? labels.card.accessInstalled : labels.card.accessAvailable}
            </span>
          </div>
        </div>
        {rec.confidence_score ? (
          <p className="text-sm text-slate-500">
            {labels.card.confidenceScore}: {rec.confidence_score}/100
          </p>
        ) : null}
      </div>
      <p className="mt-3 text-sm text-slate-700">
        <span className="font-medium text-slate-800">{labels.card.reason}:</span>{" "}
        {labels.reasons[rec.reason_key as keyof typeof labels.reasons] ?? rec.reason_key}
      </p>
      <p className="mt-2 text-sm text-slate-600">
        <span className="font-medium text-slate-800">{labels.card.benefits}:</span>{" "}
        {labels.benefits[rec.benefits_key as keyof typeof labels.benefits] ?? rec.benefits_key}
      </p>
      <dl className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{labels.card.complexity}</dt>
          <dd className="mt-0.5">{labels.complexityLevels[rec.complexity as keyof typeof labels.complexityLevels] ?? rec.complexity}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{labels.card.suggestedUsers}</dt>
          <dd className="mt-0.5">{rec.suggested_users ?? "—"}</dd>
        </div>
      </dl>
      {(rec.related_packs?.length ?? 0) > 0 ? (
        <p className="mt-3 text-xs text-slate-500">
          <span className="font-medium text-slate-600">{labels.card.relatedPacks}:</span>{" "}
          {rec.related_packs!.join(", ")}
        </p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        {learnMoreHref ? (
          <Link
            href={learnMoreHref}
            onClick={onNavigate}
            className="rounded-lg border border-indigo-200 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
          >
            {labels.card.learnMore}
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-lg border border-slate-100 px-3 py-1.5 text-sm text-slate-400"
          >
            {labels.card.learnMore}
          </button>
        )}
        {canFull ? (
          <>
            <button type="button" disabled={busy || rec.saved} onClick={onSave} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-60">
              {rec.saved ? labels.card.saved : labels.card.saveRecommendation}
            </button>
            <button type="button" disabled={busy} onClick={onToggleSelect} className={`rounded-lg border px-3 py-1.5 text-sm ${selected ? "border-indigo-600 bg-indigo-50 text-indigo-800" : "border-slate-200"}`}>
              {labels.card.compare}
            </button>
          </>
        ) : null}
        {canManage ? (
          <button type="button" disabled={busy} onClick={onDismiss} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600">{labels.card.dismiss}</button>
        ) : null}
      </div>
    </article>
  );
}

function SidebarList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-semibold">{title}</h2>
      <ul className="mt-3 space-y-1 text-sm text-slate-700">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </section>
  );
}
