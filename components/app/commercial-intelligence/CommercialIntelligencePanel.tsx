"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseCommercialIntelligenceCenter,
  type CommercialIntelligenceCenter,
} from "@/lib/commercial-intelligence-engine/parse";
import type { Roci588CustomerSection } from "@/lib/commercial-intelligence-engine/config";
import type { buildCommercialIntelligenceLabels } from "@/lib/commercial-intelligence-engine/labels";

type Labels = ReturnType<typeof buildCommercialIntelligenceLabels>;

type Props = {
  labels: Labels;
  activeSection: Roci588CustomerSection;
};

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function formatNok(value: unknown) {
  const n = Number(value ?? 0);
  return new Intl.NumberFormat("nb-NO", { style: "currency", currency: "NOK", maximumFractionDigits: 0 }).format(n);
}

function ItemCard({ title, summary, badge, extra }: { title: string; summary?: string; badge?: string; extra?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-semibold text-zinc-900">{title}</p>
        {badge ? (
          <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium capitalize text-zinc-700">
            {badge.replace(/_/g, " ")}
          </span>
        ) : null}
      </div>
      {summary ? <p className="mt-2 text-sm text-zinc-600">{summary}</p> : null}
      {extra}
    </div>
  );
}

export function CommercialIntelligencePanel({ labels, activeSection }: Props) {
  const [center, setCenter] = useState<CommercialIntelligenceCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/commercial-intelligence/center?section=${activeSection}`);
    if (res.ok) setCenter(parseCommercialIntelligenceCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, [activeSection]);

  useEffect(() => { void load(); }, [load]);

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered /><span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <p className="font-medium">{labels.empty}</p>
        {center?.error ? <p className="mt-2 text-sm">{center.error}</p> : null}
      </div>
    );
  }

  const sectionTitle = labels.sections[activeSection];
  const stats = center.stats ?? {};
  const healthBand = labels.healthBand[center.health_status as keyof typeof labels.healthBand] ?? center.health_status;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">{sectionTitle}</h2>
          {center.privacy_note ? <p className="mt-1 text-xs text-zinc-500">{center.privacy_note}</p> : null}
        </div>
        <div className="flex gap-2">
          <Link href="/app/revenue/pipeline" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
            {labels.openPipeline}
          </Link>
          <button type="button" onClick={() => void load()} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
            {labels.refresh}
          </button>
        </div>
      </div>

      {center.principle ? (
        <p className="rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-indigo-950">{center.principle}</p>
      ) : null}

      {(activeSection === "overview" || activeSection === "reports") && (
        <section className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-white p-6 shadow-sm">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label={labels.mrr} value={formatNok(center.mrr)} />
            <StatCard label={labels.arr} value={formatNok(center.arr)} />
            <StatCard label={labels.nrr} value={`${center.nrr_pct ?? 0}%`} />
            <div>
              <p className="text-xs font-medium uppercase text-zinc-500">{labels.healthScore}</p>
              <p className="mt-1 text-3xl font-bold text-indigo-900">{center.health_score ?? 0}</p>
              <span className="mt-2 inline-flex rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">{healthBand}</span>
            </div>
          </div>
        </section>
      )}

      {activeSection === "overview" && (center.companion_recommendations?.length ?? 0) > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold text-zinc-900">{labels.companionRecommendations}</h3>
          {(center.companion_recommendations ?? []).map((rec, i) => (
            <ItemCard key={i} title={String(rec.signal_title ?? "Insight")} summary={String(rec.recommendation ?? "")} />
          ))}
        </section>
      )}

      {(activeSection === "revenue" || activeSection === "overview") && (
        <section className="grid gap-3 sm:grid-cols-2">
          {(center.revenue_registry ?? []).map((r) => (
            <ItemCard key={String(r.source_key)} title={String(r.source_title)} summary={String(r.summary ?? "")} badge={`${formatNok(r.revenue_amount)} · ${String(r.trend_label ?? "")}`} />
          ))}
        </section>
      )}

      {activeSection === "revenue" && center.recurring_revenue && Object.keys(center.recurring_revenue).length > 0 && (
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label={labels.mrr} value={formatNok(center.recurring_revenue.mrr)} />
          <StatCard label={labels.arr} value={formatNok(center.recurring_revenue.arr)} />
          <StatCard label={labels.nrr} value={`${center.recurring_revenue.net_revenue_retention_pct ?? 0}%`} />
          <StatCard label="Expansion" value={formatNok(center.recurring_revenue.expansion_revenue)} />
          <StatCard label="Contraction" value={formatNok(center.recurring_revenue.contraction_revenue)} />
          <StatCard label="Churn" value={formatNok(center.recurring_revenue.churn_revenue)} />
        </dl>
      )}

      {activeSection === "customers" && (
        <section className="grid gap-3">
          {(center.customers ?? []).length === 0 ? <p className="text-sm text-zinc-500">{labels.noRecords}</p> : (center.customers ?? []).map((c) => (
            <ItemCard key={String(c.customer_key)} title={String(c.customer_label)} summary={String(c.summary ?? "")} badge={`${formatNok(c.revenue_total)} · ${String(c.health_label ?? "")}`} />
          ))}
        </section>
      )}

      {activeSection === "subscriptions" && (
        <section className="grid gap-3">
          {(center.subscriptions ?? []).map((s) => (
            <ItemCard key={String(s.subscription_key)} title={String(s.customer_label)} summary={String(s.summary ?? "")} badge={`${String(s.plan_label)} · ${formatNok(s.mrr)}/mo`} />
          ))}
        </section>
      )}

      {activeSection === "businessPacks" && (
        <section className="grid gap-3 sm:grid-cols-2">
          {(center.business_packs ?? []).map((b) => (
            <ItemCard key={String(b.pack_key)} title={String(b.pack_title)} summary={String(b.summary ?? "")} badge={`${formatNok(b.pack_revenue)} · ${b.adoption_pct ?? 0}%`} extra={b.expansion_opportunity ? <p className="mt-2 text-xs text-indigo-700">{String(b.expansion_opportunity)}</p> : null} />
          ))}
        </section>
      )}

      {activeSection === "forecasts" && (
        <section className="grid gap-3">
          {(center.forecasts ?? []).map((f) => (
            <ItemCard key={String(f.forecast_key)} title={`${String(f.horizon)} forecast`} summary={String(f.summary ?? "")} badge={String(f.confidence ?? "")}
              extra={
                <dl className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                  <div><dt className="text-zinc-500">Expected</dt><dd className="font-medium">{formatNok(f.expected_revenue)}</dd></div>
                  <div><dt className="text-zinc-500">Risk-adjusted</dt><dd className="font-medium">{formatNok(f.risk_adjusted_revenue)}</dd></div>
                  <div><dt className="text-zinc-500">Best case</dt><dd className="font-medium">{formatNok(f.best_case_revenue)}</dd></div>
                  <div><dt className="text-zinc-500">Conservative</dt><dd className="font-medium">{formatNok(f.conservative_revenue)}</dd></div>
                </dl>
              }
            />
          ))}
        </section>
      )}

      {activeSection === "growth" && (
        <>
          <section className="grid gap-3 sm:grid-cols-2">
            {(center.expansion ?? []).map((e) => (
              <ItemCard key={String(e.expansion_key)} title={String(e.expansion_title)} summary={String(e.summary ?? "")} badge={formatNok(e.forecast_revenue)} extra={e.recommendation ? <p className="mt-2 text-sm text-indigo-800">{String(e.recommendation)}</p> : null} />
            ))}
          </section>
          {(center.attribution ?? []).length > 0 && (
            <section className="grid gap-3 sm:grid-cols-2">
              <h3 className="col-span-full font-semibold text-zinc-900">Attribution</h3>
              {(center.attribution ?? []).map((a) => (
                <ItemCard key={String(a.attribution_key)} title={String(a.attribution_title)} summary={String(a.summary ?? "")} badge={`${a.share_pct ?? 0}% · ${formatNok(a.revenue_amount)}`} />
              ))}
            </section>
          )}
          {(center.funnel ?? []).length > 0 && (
            <ol className="space-y-2 border-l-2 border-indigo-200 pl-6">
              {(center.funnel ?? []).map((stage) => (
                <li key={String(stage.stage_key)} className="text-sm">
                  <span className="font-medium">{String(stage.stage_title)}</span>
                  <span className="text-zinc-600"> — {String(stage.stage_count)} ({String(stage.conversion_pct)}%)</span>
                </li>
              ))}
            </ol>
          )}
        </>
      )}

      {activeSection === "retention" && (
        <section className="grid gap-3">
          {(center.churn_signals ?? []).map((c) => (
            <ItemCard key={String(c.signal_key)} title={String(c.signal_title)} summary={String(c.summary ?? "")} badge={String(c.severity ?? c.signal_type ?? "")} extra={c.companion_recommendation ? <p className="mt-2 text-sm text-indigo-800">{String(c.companion_recommendation)}</p> : null} />
          ))}
          {center.health && Object.keys(center.health).length > 0 && (
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <StatCard label="Retention" value={`${center.health.retention_pct ?? 0}%`} />
              <StatCard label="Churn" value={`${center.health.churn_pct ?? 0}%`} />
              <StatCard label="Renewal" value={`${center.health.renewal_pct ?? 0}%`} />
              <StatCard label="Expansion" value={`${center.health.expansion_pct ?? 0}%`} />
              <StatCard label={labels.stats.growthRate} value={`${center.health.growth_rate_pct ?? 0}%`} />
            </dl>
          )}
        </section>
      )}

      {activeSection === "reports" && (
        <>
          {(center.customer_value ?? []).length > 0 && (
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(center.customer_value ?? []).map((v) => (
                <StatCard key={String(v.metric_key)} label={String(v.metric_title)} value={`${formatNok(v.metric_value)}`} />
              ))}
            </dl>
          )}
          {(center.audit_recent ?? []).length > 0 && (
            <ul className="space-y-2 text-sm">
              {(center.audit_recent ?? []).map((log, i) => (
                <li key={i} className="rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2">
                  <span className="font-medium">{String(log.event_type ?? "")}</span>
                  <span className="text-zinc-600"> — {String(log.summary ?? "")}</span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <p className="text-xs text-zinc-500">{labels.privacyNote}</p>
    </div>
  );
}
