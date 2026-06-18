"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseRevenueGrowthCenter,
  type RevenueGrowthCenter,
  type RevenueGrowthSection,
} from "@/lib/revenue-growth-center";
import type { RevenueGrowthCenterLabels } from "@/lib/revenue-growth-center/labels";
import { RevenueGrowthStatusBadge } from "./RevenueGrowthStatusBadge";

type Props = { labels: RevenueGrowthCenterLabels; activeSection: RevenueGrowthSection };

function Card({
  title, summary, statusKey, labels, extra,
}: {
  title: string; summary?: string; statusKey: string;
  labels: RevenueGrowthCenterLabels; extra?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-semibold text-zinc-900">{title}</p>
        <RevenueGrowthStatusBadge statusKey={statusKey} labels={labels.status} />
      </div>
      {summary ? <p className="mt-2 text-sm text-zinc-600">{summary}</p> : null}
      {extra}
    </div>
  );
}

export function RevenueGrowthCenterPanel({ labels, activeSection }: Props) {
  const [center, setCenter] = useState<RevenueGrowthCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/revenue-growth/center");
    if (res.ok) setCenter(parseRevenueGrowthCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.title}</span>
      </div>
    );
  }

  if (!center?.found) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <p className="font-medium">{labels.accessDenied}</p>
        {center?.error ? <p className="mt-2 text-sm">{center.error}</p> : null}
      </div>
    );
  }

  const sectionTitle = labels.sections[activeSection] ?? labels.title;
  const renewalLabel = (s: string) =>
    labels.renewalStatus[s as keyof typeof labels.renewalStatus] ?? s.replace(/_/g, " ");
  const forecastLabel = (p: string) =>
    labels.forecastPeriod[p as keyof typeof labels.forecastPeriod] ?? p.replace(/_/g, " ");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">{sectionTitle}</h2>
          {center.privacyNote ? <p className="mt-1 text-xs text-zinc-500">{center.privacyNote}</p> : null}
        </div>
        <button type="button" onClick={() => void load()} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
          {labels.refresh}
        </button>
      </div>

      {activeSection === "overview" ? (
        <>
          {center.corePrinciple ? (
            <p className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 text-sm text-emerald-900">{center.corePrinciple}</p>
          ) : null}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {center.dashboardMetrics.map((m) => (
              <div key={m.id} className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-4">
                <p className="text-xs font-medium uppercase text-zinc-500">{m.metricKey.replace(/_/g, " ")}</p>
                <p className="mt-1 text-2xl font-bold text-emerald-900">{m.metricValue}</p>
                {m.trendLabel ? <p className="mt-1 text-xs text-zinc-600">{m.trendLabel}</p> : null}
                <div className="mt-2"><RevenueGrowthStatusBadge statusKey={m.statusKey} labels={labels.status} /></div>
              </div>
            ))}
          </div>
          {center.companionAdvice.length > 0 ? (
            <section className="rounded-2xl border border-blue-100 bg-blue-50/30 p-5">
              <h3 className="font-semibold text-zinc-900">{labels.companionAdviceTitle}</h3>
              <ul className="mt-4 space-y-3">
                {center.companionAdvice.map((a) => (
                  <li key={a.id} className="rounded-lg border border-blue-100 bg-white p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="font-medium text-zinc-900">{a.title}</p>
                      <RevenueGrowthStatusBadge statusKey={a.statusKey} labels={labels.status} />
                    </div>
                    <p className="mt-1 text-sm text-zinc-600">{a.insight}</p>
                    {a.recommendation ? <p className="mt-2 text-sm font-medium text-emerald-800">{a.recommendation}</p> : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {center.growthRecommendations.length > 0 ? (
            <section className="rounded-2xl border border-violet-100 bg-violet-50/20 p-5">
              <h3 className="font-semibold text-zinc-900">{labels.topRecommendations}</h3>
              <ul className="mt-4 space-y-2">
                {center.growthRecommendations.map((rec) => (
                  <li key={rec.id} className="flex flex-wrap items-start justify-between gap-2 rounded-lg bg-white p-3">
                    <div><p className="font-medium text-zinc-900">{rec.title}</p><p className="text-sm text-zinc-600">{rec.insight}</p></div>
                    <RevenueGrowthStatusBadge statusKey={rec.statusKey} labels={labels.status} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          <section className="rounded-2xl border border-zinc-200 bg-white p-5">
            <h3 className="font-semibold text-zinc-900">{labels.relatedLinks}</h3>
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              <Link href="/app/customer-success" className="font-medium text-emerald-700 hover:underline">{labels.customerSuccessCenter}</Link>
              <Link href="/app/onboarding" className="font-medium text-emerald-700 hover:underline">{labels.onboardingCenter}</Link>
            </div>
          </section>
        </>
      ) : null}

      {activeSection === "renewals" ? (
        <div className="space-y-3">
          {(center.statistics.atRiskRenewals ?? 0) > 0 ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {labels.atRiskRenewals}: {center.statistics.atRiskRenewals}
            </p>
          ) : null}
          {center.renewals.map((r) => (
            <div key={r.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-zinc-900">{r.customerLabel}</p>
                  <p className="text-sm capitalize text-zinc-600">{renewalLabel(r.renewalStatus)}</p>
                </div>
                <RevenueGrowthStatusBadge statusKey={r.statusKey} labels={labels.status} />
              </div>
              <div className="mt-3 grid gap-1 text-sm sm:grid-cols-2">
                <p><span className="text-zinc-500">{labels.renewalDate}:</span> {r.renewalDateLabel}</p>
                <p><span className="text-zinc-500">{labels.renewalRisk}:</span> {r.renewalRiskLabel}</p>
                <p><span className="text-zinc-500">{labels.health}:</span> {r.healthLabel}</p>
                <p><span className="text-zinc-500">{labels.owner}:</span> {r.ownerLabel}</p>
                <p className="sm:col-span-2"><span className="text-zinc-500">{labels.pipeline}:</span> {r.pipelineStage}</p>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {activeSection === "expansion" ? (
        <div className="space-y-3">
          {center.expansionOpportunities.map((o) => (
            <Card key={o.id} title={o.title} summary={o.insight} statusKey={o.statusKey} labels={labels}
              extra={
                <>
                  {o.suggestion ? <p className="mt-2 text-sm font-medium text-emerald-800">{labels.suggestion}: {o.suggestion}</p> : null}
                  <div className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
                    <p><span className="text-zinc-500">{labels.potentialRevenue}:</span> {o.potentialRevenueLabel}</p>
                    <p><span className="text-zinc-500">{labels.confidence}:</span> {o.confidenceLabel}</p>
                  </div>
                </>
              }
            />
          ))}
        </div>
      ) : null}

      {activeSection === "subscription" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {center.subscriptionGrowth.map((s) => (
            <Card key={s.id} title={s.title} summary={s.summary} statusKey={s.statusKey} labels={labels}
              extra={s.valueLabel ? <p className="mt-2 text-lg font-bold text-emerald-900">{s.valueLabel}</p> : null}
            />
          ))}
        </div>
      ) : null}

      {activeSection === "businessPacks" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {center.businessPackExpansion.map((p) => (
            <Card key={p.id} title={p.packName} summary={p.summary} statusKey={p.statusKey} labels={labels}
              extra={
                <div className="mt-2 grid gap-1 text-sm">
                  <p className="capitalize text-zinc-500">{p.packStatus.replace(/_/g, " ")}</p>
                  <p><span className="text-zinc-500">{labels.departmentUsage}:</span> {p.departmentUsageLabel}</p>
                  <p><span className="text-zinc-500">{labels.potentialRevenue}:</span> {p.potentialRevenueLabel}</p>
                  <p><span className="text-zinc-500">{labels.expectedAdoption}:</span> {p.expectedAdoptionLabel}</p>
                  <p><span className="text-zinc-500">{labels.confidence}:</span> {p.confidenceLabel}</p>
                </div>
              }
            />
          ))}
        </div>
      ) : null}

      {activeSection === "forecast" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {center.revenueForecasts.map((f) => (
            <div key={f.id} className="rounded-xl border border-emerald-100 bg-emerald-50/20 p-5">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-zinc-900">{forecastLabel(f.forecastPeriod)}</p>
                <RevenueGrowthStatusBadge statusKey={f.statusKey} labels={labels.status} />
              </div>
              <p className="mt-3 text-2xl font-bold text-emerald-900">{f.totalForecastLabel}</p>
              <div className="mt-3 grid gap-1 text-xs text-zinc-600">
                <p>Renewals: {f.renewalsLabel}</p>
                <p>Expansion: {f.expansionRevenueLabel}</p>
                <p>New: {f.newRevenueLabel}</p>
                <p>Retention: {f.retentionRevenueLabel}</p>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {activeSection === "clv" ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {center.customerLifetimeValue.map((c) => (
            <Card key={c.id} title={c.title} summary={c.summary} statusKey={c.statusKey} labels={labels}
              extra={<p className="mt-2 text-2xl font-bold text-emerald-900">{c.valueLabel}</p>}
            />
          ))}
        </div>
      ) : null}

      {activeSection === "retention" ? (
        <div className="space-y-3">
          {center.retentionProtection.map((s) => (
            <Card key={s.id} title={s.title} summary={s.insight} statusKey={s.statusKey} labels={labels}
              extra={s.intervention ? <p className="mt-2 text-sm font-medium text-emerald-800">{labels.intervention}: {s.intervention}</p> : null}
            />
          ))}
        </div>
      ) : null}

      {activeSection === "recommendations" ? (
        <div className="space-y-3">
          {center.growthRecommendations.map((rec) => (
            <Card key={rec.id} title={rec.title} summary={rec.insight} statusKey={rec.statusKey} labels={labels} />
          ))}
        </div>
      ) : null}

      {activeSection === "executive" ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {center.executiveOverview.map((m) => (
            <div key={m.id} className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-4">
              <p className="text-xs font-medium uppercase text-zinc-500 capitalize">{m.metricKey.replace(/_/g, " ")}</p>
              <p className="mt-1 text-2xl font-bold text-emerald-900">{m.metricValue}</p>
              {m.trendLabel ? <p className="mt-1 text-xs text-zinc-600">{m.trendLabel}</p> : null}
              <div className="mt-2"><RevenueGrowthStatusBadge statusKey={m.statusKey} labels={labels.status} /></div>
            </div>
          ))}
        </div>
      ) : null}

      {activeSection === "partner" ? (
        <div className="space-y-4">
          {center.growthPartnerAttributed ? (
            <p className="text-sm text-zinc-700">{labels.growthPartner}: {center.growthPartnerName}</p>
          ) : (
            <p className="text-sm text-zinc-500">{labels.notAttributed}</p>
          )}
          {center.growthPartnerView.map((p) => (
            <Card key={p.id} title={p.title} summary={p.summary} statusKey={p.statusKey} labels={labels}
              extra={p.valueLabel ? <p className="mt-2 font-medium text-emerald-800">{p.valueLabel}</p> : null}
            />
          ))}
        </div>
      ) : null}

      {activeSection === "playbooks" ? (
        <div className="space-y-3">
          {center.revenuePlaybooks.map((p) => (
            <Card key={p.id} title={p.title} summary={p.summary} statusKey={p.statusKey} labels={labels}
              extra={p.stepsSummary ? <p className="mt-2 text-sm text-zinc-700"><span className="font-medium">{labels.steps}:</span> {p.stepsSummary}</p> : null}
            />
          ))}
        </div>
      ) : null}

      {activeSection === "governance" ? (
        <>
          {center.governanceNote ? (
            <p className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-4 text-sm text-emerald-900">{center.governanceNote}</p>
          ) : null}
          {center.auditHistory.length > 0 ? (
            <ul className="space-y-3">
              {center.auditHistory.map((a) => (
                <li key={a.id} className="rounded-lg border border-zinc-100 px-4 py-3 text-sm">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="font-medium capitalize text-zinc-900">{a.action.replace(/_/g, " ")}</p>
                    <span className="text-xs text-zinc-500">{a.createdAt ? new Date(a.createdAt).toLocaleString() : ""}</span>
                  </div>
                  <p className="mt-1 text-zinc-600">{a.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-500">{labels.noAudit}</p>
          )}
        </>
      ) : null}
    </div>
  );
}
