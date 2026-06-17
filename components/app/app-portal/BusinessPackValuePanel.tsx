"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  PACK_ROI_INDICATORS,
  PACK_VALUE_CATEGORIES,
  parsePackValueOverview,
  type PackValueCard,
  type PackValueLabels,
  type PackValueOverview,
} from "@/lib/app-portal/business-pack-value";

type Props = { labels: PackValueLabels };

const ROI_STYLE: Record<string, string> = {
  emerging_value: "bg-slate-100 text-slate-700",
  positive_roi: "bg-teal-100 text-teal-900",
  strong_roi: "bg-emerald-100 text-emerald-900",
  strategic_roi_leader: "bg-indigo-100 text-indigo-900",
};

const TREND_STYLE: Record<string, string> = {
  increasing: "text-emerald-700",
  stable: "text-slate-600",
  declining: "text-amber-700",
  unrealized_opportunity: "text-violet-700",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export function BusinessPackValuePanel({ labels }: Props) {
  const [data, setData] = useState<PackValueOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [packKey, setPackKey] = useState("");
  const [valueCategory, setValueCategory] = useState("");
  const [department, setDepartment] = useState("");
  const [roiIndicator, setRoiIndicator] = useState("");
  const [adoptionStatus, setAdoptionStatus] = useState("");
  const [periodFrom, setPeriodFrom] = useState("");
  const [search, setSearch] = useState("");
  const [expandedPack, setExpandedPack] = useState<string | null>(null);
  const [exportBusy, setExportBusy] = useState(false);
  const [exportMessage, setExportMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (packKey) params.set("pack_key", packKey);
    if (valueCategory) params.set("value_category", valueCategory);
    if (department) params.set("department", department);
    if (roiIndicator) params.set("roi_indicator", roiIndicator);
    if (adoptionStatus) params.set("adoption_status", adoptionStatus);
    if (periodFrom) params.set("period_from", periodFrom);
    if (search.trim()) params.set("search", search.trim());
    const res = await fetch(`/api/aipify/business-packs/value?${params}`);
    if (res.ok) {
      setData(parsePackValueOverview(await res.json()));
    } else {
      const body = (await res.json()) as { error?: string };
      setError(body.error ?? labels.accessDenied);
      setData(null);
    }
    setLoading(false);
  }, [packKey, valueCategory, department, roiIndicator, adoptionStatus, periodFrom, search, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function exportReport(format: "pdf" | "excel" | "csv") {
    setExportBusy(true);
    setExportMessage("");
    const res = await fetch("/api/aipify/business-packs/value/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ format, report_type: "executive" }),
    });
    setExportBusy(false);
    if (!res.ok) return;
    const result = (await res.json()) as { content?: string; file_name?: string; content_type?: string; format?: string };
    if (format === "csv" && result.content && result.file_name) {
      const blob = new Blob([result.content], { type: result.content_type ?? "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.file_name;
      a.click();
      URL.revokeObjectURL(url);
    }
    setExportMessage(labels.export.success);
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

  const empty = !data?.has_value_data;
  const canExport = data?.can_full === true || data?.can_manage === true;
  const trends = data?.value_trends ?? {};

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
          <Link href="/app/business-packs/installed" className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white">{labels.emptyCta}</Link>
        </section>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label={labels.dashboard.totalEstimatedValue} value={formatCurrency(data?.total_estimated_value ?? 0)} />
            <Stat label={labels.dashboard.totalTimeSaved} value={`${Math.round(data?.total_time_saved_hours ?? 0)}h`} />
            <Stat label={labels.dashboard.realizedVsPotential} value={`${formatCurrency(data?.realized_value ?? 0)} / ${formatCurrency(data?.potential_value ?? 0)}`} />
            <Stat label={labels.dashboard.executiveSummary} value="" summary={data?.executive_summary} />
          </section>

          {Object.keys(trends).length > 0 ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold">{labels.dashboard.valueTrends}</h2>
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                {Object.entries(trends).map(([trend, count]) => (
                  <span key={trend} className={TREND_STYLE[trend] ?? "text-slate-600"}>
                    {labels.valueTrends[trend as keyof typeof labels.valueTrends] ?? trend}: {count}
                  </span>
                ))}
              </div>
            </section>
          ) : null}

          {(data?.highest_value_packs?.length ?? 0) > 0 ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold">{labels.dashboard.highestValuePacks}</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {data!.highest_value_packs!.map((p) => (
                  <li key={p.pack_key} className="flex justify-between gap-4">
                    <span>{p.name}</span>
                    <span className="font-medium">{formatCurrency(p.estimated_value ?? 0)}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {canExport ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold">{labels.dashboard.executiveReport}</h2>
              <p className="mt-2 text-sm text-slate-600">{labels.export.estimateNote}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" disabled={exportBusy} onClick={() => void exportReport("pdf")} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-800 disabled:opacity-60">{labels.export.pdf}</button>
                <button type="button" disabled={exportBusy} onClick={() => void exportReport("excel")} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-800 disabled:opacity-60">{labels.export.excel}</button>
                <button type="button" disabled={exportBusy} onClick={() => void exportReport("csv")} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">{labels.export.csv}</button>
              </div>
              {exportMessage ? <p className="mt-3 text-sm text-emerald-700">{exportMessage}</p> : null}
            </section>
          ) : null}
        </>
      )}

      <section className="flex flex-wrap gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={labels.filters.search} className="min-w-[12rem] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input value={packKey} onChange={(e) => setPackKey(e.target.value)} placeholder={labels.filters.packKey} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={valueCategory} onChange={(e) => setValueCategory(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.valueCategory}</option>
          {PACK_VALUE_CATEGORIES.map((c) => <option key={c} value={c}>{labels.categories[c]}</option>)}
        </select>
        <input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder={labels.filters.department} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={roiIndicator} onChange={(e) => setRoiIndicator(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.roiIndicator}</option>
          {PACK_ROI_INDICATORS.map((r) => <option key={r} value={r}>{labels.roiIndicators[r]}</option>)}
        </select>
        <select value={adoptionStatus} onChange={(e) => setAdoptionStatus(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.adoptionStatus}</option>
          <option value="low">{labels.filters.lowAdoption}</option>
          <option value="healthy">{labels.filters.healthyAdoption}</option>
          <option value="high">{labels.filters.highAdoption}</option>
        </select>
        <input type="date" value={periodFrom} onChange={(e) => setPeriodFrom(e.target.value)} aria-label={labels.filters.periodFrom} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </section>

      {!empty && (data?.packs?.length ?? 0) > 0 ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">{labels.dashboard.installedPacks}</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {data!.packs!.map((pack) => (
              <ValueCard
                key={pack.pack_key}
                pack={pack}
                labels={labels}
                expanded={expandedPack === pack.pack_key}
                onToggle={() => setExpandedPack(expandedPack === pack.pack_key ? null : pack.pack_key)}
              />
            ))}
          </div>
        </section>
      ) : null}

      {!empty && (data?.recommendations?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h2 className="font-semibold">{labels.dashboard.recommendedActions}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-800">
            {data!.recommendations!.map((r) => (
              <li key={r.id}>{labels.recommendations[r.key as keyof typeof labels.recommendations] ?? r.key}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold">{labels.faq.title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div><dt className="font-medium">{labels.faq.whatIs}</dt><dd className="mt-1 text-slate-600">{labels.faq.whatIsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.exactRoi}</dt><dd className="mt-1 text-slate-600">{labels.faq.exactRoiAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.whyImportant}</dt><dd className="mt-1 text-slate-600">{labels.faq.whyImportantAnswer}</dd></div>
        </dl>
      </section>
    </div>
  );
}

function Stat({ label, value, summary }: { label: string; value: string; summary?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      {summary ? <p className="mt-2 text-sm text-slate-700">{summary}</p> : <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>}
    </div>
  );
}

function ValueCard({
  pack,
  labels,
  expanded,
  onToggle,
}: {
  pack: PackValueCard;
  labels: PackValueLabels;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900">{pack.name}</h3>
          <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${ROI_STYLE[pack.roi_indicator] ?? ROI_STYLE.emerging_value}`}>
            {labels.roiIndicators[pack.roi_indicator as keyof typeof labels.roiIndicators] ?? pack.roi_indicator}
          </span>
        </div>
        <p className="text-sm font-semibold text-slate-900">{formatCurrency(pack.estimated_value)}</p>
      </div>
      <dl className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
        <div><dt className="text-xs text-slate-500">{labels.card.timeSaved}</dt><dd>{Math.round(pack.time_saved_hours)}h</dd></div>
        <div><dt className="text-xs text-slate-500">{labels.card.adoptionScore}</dt><dd>{pack.adoption_score}/100</dd></div>
        <div><dt className="text-xs text-slate-500">{labels.card.utilizationRate}</dt><dd>{pack.utilization_rate}%</dd></div>
        <div><dt className="text-xs text-slate-500">{labels.card.valueTrend}</dt><dd className={TREND_STYLE[pack.value_trend] ?? ""}>{labels.valueTrends[pack.value_trend as keyof typeof labels.valueTrends] ?? pack.value_trend}</dd></div>
      </dl>
      <p className="mt-3 text-sm text-slate-600">{pack.executive_summary}</p>
      <button type="button" onClick={onToggle} className="mt-4 text-sm font-medium text-indigo-700 hover:underline">{labels.card.viewDetails}</button>
      {expanded ? (
        <div className="mt-4 space-y-3 border-t border-slate-100 pt-4 text-sm">
          {(pack.improvement_opportunities?.length ?? 0) > 0 ? (
            <div>
              <p className="font-medium">{labels.card.improvementOpportunities}</p>
              <ul className="mt-2 list-disc pl-5 text-slate-600">{pack.improvement_opportunities!.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          ) : null}
          {(pack.key_wins?.length ?? 0) > 0 ? (
            <div>
              <p className="font-medium">{labels.card.keyWins}</p>
              <ul className="mt-2 list-disc pl-5 text-slate-600">{pack.key_wins!.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          ) : null}
          {(pack.timeline?.length ?? 0) > 0 ? (
            <div>
              <p className="font-medium">{labels.dashboard.valueTimeline}</p>
              <ul className="mt-2 space-y-1 text-slate-600">
                {pack.timeline!.map((e) => (
                  <li key={e.id}>{labels.timelineEvents[e.event_type as keyof typeof labels.timelineEvents] ?? e.description}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
