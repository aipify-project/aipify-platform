"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseCustomerSuccessAdoptionCenter,
  type CustomerSuccessAdoptionCenter,
  type CustomerSuccessSection,
} from "@/lib/customer-success-adoption-center";
import type { CustomerSuccessAdoptionCenterLabels } from "@/lib/customer-success-adoption-center/labels";
import { CustomerSuccessStatusBadge } from "./CustomerSuccessStatusBadge";

type Props = {
  labels: CustomerSuccessAdoptionCenterLabels;
  activeSection: CustomerSuccessSection;
};

function ItemCard({
  title,
  summary,
  statusKey,
  labels,
  extra,
}: {
  title: string;
  summary?: string;
  statusKey: string;
  labels: CustomerSuccessAdoptionCenterLabels;
  extra?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-semibold text-zinc-900">{title}</p>
        <CustomerSuccessStatusBadge statusKey={statusKey} labels={labels.status} />
      </div>
      {summary ? <p className="mt-2 text-sm text-zinc-600">{summary}</p> : null}
      {extra}
    </div>
  );
}

export function CustomerSuccessAdoptionCenterPanel({ labels, activeSection }: Props) {
  const [center, setCenter] = useState<CustomerSuccessAdoptionCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/customer-success/adoption-center");
    if (res.ok) setCenter(parseCustomerSuccessAdoptionCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

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
  const healthBandLabel =
    labels.healthBand[center.healthBand as keyof typeof labels.healthBand] ?? center.healthBandLabel;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">{sectionTitle}</h2>
          {center.privacyNote ? <p className="mt-1 text-xs text-zinc-500">{center.privacyNote}</p> : null}
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          {labels.refresh}
        </button>
      </div>

      {activeSection === "overview" ? (
        <>
          <section className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-white p-6 shadow-sm">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs font-medium uppercase text-zinc-500">{labels.healthScore}</p>
                <p className="mt-1 text-4xl font-bold text-indigo-900">{center.healthScore ?? 0}</p>
                <div className="mt-2 flex items-center gap-2">
                  <CustomerSuccessStatusBadge statusKey={center.healthStatusKey ?? "information"} labels={labels.status} />
                  <span className="text-sm text-zinc-700">{healthBandLabel}</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-zinc-500">{labels.adoptionScore}</p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">{center.adoptionScore ?? 0}%</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-zinc-500">{labels.engagementScore}</p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">{center.engagementScore ?? 0}%</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-zinc-500">{labels.retentionRisk}</p>
                <p className="mt-1 text-lg font-semibold capitalize text-zinc-900">
                  {center.retentionRiskLevel?.replace(/_/g, " ")}
                </p>
                {(center.retentionRiskLevel === "high" || center.retentionRiskLevel === "critical") ? (
                  <p className="mt-1 text-sm font-medium text-amber-800">{labels.highChurnRisk}</p>
                ) : null}
              </div>
            </div>
          </section>

          {center.companionAdvice.length > 0 ? (
            <section className="rounded-2xl border border-blue-100 bg-blue-50/30 p-5">
              <h3 className="font-semibold text-zinc-900">{labels.companionAdviceTitle}</h3>
              <ul className="mt-4 space-y-3">
                {center.companionAdvice.map((a) => (
                  <li key={a.id} className="rounded-lg border border-blue-100 bg-white p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="font-medium text-zinc-900">{a.title}</p>
                      <CustomerSuccessStatusBadge statusKey={a.statusKey} labels={labels.status} />
                    </div>
                    <p className="mt-1 text-sm text-zinc-600">{a.insight}</p>
                    {a.recommendation ? (
                      <p className="mt-2 text-sm font-medium text-indigo-800">{a.recommendation}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {center.topRecommendations.length > 0 ? (
            <section className="rounded-2xl border border-violet-100 bg-violet-50/20 p-5">
              <h3 className="font-semibold text-zinc-900">{labels.topRecommendations}</h3>
              <ul className="mt-4 space-y-2">
                {center.topRecommendations.map((rec) => (
                  <li key={rec.id} className="flex flex-wrap items-start justify-between gap-2 rounded-lg bg-white p-3">
                    <div>
                      <p className="font-medium text-zinc-900">{rec.title}</p>
                      <p className="text-sm text-zinc-600">{rec.insight}</p>
                    </div>
                    <CustomerSuccessStatusBadge statusKey={rec.statusKey} labels={labels.status} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="rounded-2xl border border-zinc-200 bg-white p-5">
            <h3 className="font-semibold text-zinc-900">{labels.relatedLinks}</h3>
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              <Link href="/app/onboarding" className="font-medium text-indigo-700 hover:underline">
                {labels.onboardingCenter}
              </Link>
              <Link href="/app/customer-success-engine" className="font-medium text-indigo-700 hover:underline">
                {labels.customerSuccessEngine}
              </Link>
            </div>
          </section>
        </>
      ) : null}

      {activeSection === "adoption" ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {center.adoptionMetrics.map((m) => (
            <div key={m.id} className="rounded-xl border border-indigo-100 bg-indigo-50/20 p-4">
              <p className="text-xs font-medium uppercase text-zinc-500 capitalize">{m.metricKey.replace(/_/g, " ")}</p>
              <p className="mt-1 text-2xl font-bold text-indigo-900">{m.metricValue}</p>
              {m.trendLabel ? <p className="mt-1 text-xs text-zinc-600">{m.trendLabel}</p> : null}
              <div className="mt-2">
                <CustomerSuccessStatusBadge statusKey={m.statusKey} labels={labels.status} />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {activeSection === "health" ? (
        <>
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-6 text-center">
            <p className="text-xs font-medium uppercase text-zinc-500">{labels.healthScore}</p>
            <p className="mt-2 text-5xl font-bold text-indigo-900">{center.healthScore ?? 0}</p>
            <p className="mt-2 text-lg font-medium text-indigo-800">{healthBandLabel}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {center.healthDimensions.map((d) => (
              <ItemCard
                key={d.id}
                title={d.title}
                summary={d.trendLabel}
                statusKey={d.statusKey}
                labels={labels}
                extra={<p className="mt-2 text-2xl font-bold text-zinc-900">{d.scoreLabel}</p>}
              />
            ))}
          </div>
          {center.retentionRisks.length > 0 ? (
            <section>
              <h3 className="font-semibold text-zinc-900">{labels.retentionRisk}</h3>
              <ul className="mt-4 space-y-3">
                {center.retentionRisks.map((r) => (
                  <li key={r.id} className="rounded-lg border border-amber-100 bg-amber-50/30 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="font-medium text-zinc-900">{r.title}</p>
                      <CustomerSuccessStatusBadge statusKey={r.statusKey} labels={labels.status} />
                    </div>
                    <p className="mt-1 text-sm text-zinc-600">{r.insight}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      ) : null}

      {activeSection === "expansion" ? (
        <div className="space-y-3">
          {center.expansionOpportunities.map((o) => (
            <ItemCard key={o.id} title={o.title} summary={o.insight} statusKey={o.statusKey} labels={labels}
              extra={<p className="mt-2 text-xs capitalize text-zinc-500">{o.opportunityType.replace(/_/g, " ")}</p>}
            />
          ))}
        </div>
      ) : null}

      {activeSection === "plans" ? (
        <div className="space-y-3">
          {center.successPlans.map((p) => (
            <div key={p.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="font-semibold text-zinc-900">{p.title}</p>
                <CustomerSuccessStatusBadge statusKey={p.statusKey} labels={labels.status} />
              </div>
              <p className="mt-2 text-sm text-zinc-600">{p.goalSummary}</p>
              <div className="mt-3 grid gap-1 text-sm sm:grid-cols-2">
                <p><span className="text-zinc-500">{labels.milestone}:</span> {p.milestoneLabel}</p>
                <p><span className="text-zinc-500">{labels.targetOutcome}:</span> {p.targetOutcome}</p>
                <p><span className="text-zinc-500">{labels.reviewDate}:</span> {p.reviewDateLabel}</p>
                <p><span className="text-zinc-500">{labels.owner}:</span> {p.ownerLabel}</p>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {activeSection === "training" ? (
        <ul className="space-y-2">
          {center.trainingCenter.map((t) => (
            <li key={t.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-zinc-100 px-4 py-3 text-sm">
              <div>
                <span className="font-medium text-zinc-800">{t.moduleTitle}</span>
                <span className="ml-2 text-xs capitalize text-zinc-500">{t.trainingCategory.replace(/_/g, " ")}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500">{t.progressLabel}</span>
                <CustomerSuccessStatusBadge statusKey={t.statusKey} labels={labels.status} />
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {activeSection === "engagement" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {center.engagement.map((e) => (
            <ItemCard key={e.id} title={e.title} summary={e.summary} statusKey={e.statusKey} labels={labels}
              extra={<p className="mt-2 text-xl font-bold text-indigo-900">{e.metricValue}</p>}
            />
          ))}
        </div>
      ) : null}

      {activeSection === "businessPacks" ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {center.businessPackUsage.map((p) => (
            <ItemCard key={p.id} title={p.packName} summary={p.summary} statusKey={p.statusKey} labels={labels}
              extra={
                <>
                  <p className="mt-2 text-xs capitalize text-zinc-500">{p.utilizationCategory.replace(/_/g, " ")}</p>
                  {p.usageLabel ? <p className="mt-1 text-sm font-medium text-indigo-800">{labels.usage}: {p.usageLabel}</p> : null}
                </>
              }
            />
          ))}
        </div>
      ) : null}

      {activeSection === "journey" ? (
        <div className="space-y-3">
          {center.customerJourney.map((j) => (
            <div key={j.id} className="flex flex-wrap items-start gap-4 rounded-xl border border-zinc-200 bg-white p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-800">
                {j.sortOrder}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-semibold text-zinc-900">{j.title}</p>
                  <CustomerSuccessStatusBadge statusKey={j.statusKey} labels={labels.status} />
                </div>
                <p className="mt-1 text-sm text-zinc-600">{j.summary}</p>
                <p className="mt-1 text-xs font-medium text-indigo-700">{j.progressLabel}</p>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {activeSection === "reviews" ? (
        <div className="space-y-4">
          {center.successReviews.map((r) => (
            <div key={r.id} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="font-semibold text-zinc-900">{r.title}</p>
                <CustomerSuccessStatusBadge statusKey={r.statusKey} labels={labels.status} />
              </div>
              <p className="mt-1 text-xs text-zinc-500">{labels.reviewDate}: {r.reviewDateLabel}</p>
              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                <div><p className="text-xs font-medium uppercase text-zinc-500">{labels.achievements}</p><p className="mt-1">{r.achievements}</p></div>
                <div><p className="text-xs font-medium uppercase text-zinc-500">{labels.challenges}</p><p className="mt-1">{r.challenges}</p></div>
                <div><p className="text-xs font-medium uppercase text-zinc-500">{labels.recommendations}</p><p className="mt-1">{r.recommendations}</p></div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {activeSection === "tasks" ? (
        <div className="space-y-3">
          {center.successTasks.map((t) => (
            <ItemCard key={t.id} title={t.title} summary={t.summary} statusKey={t.statusKey} labels={labels}
              extra={
                <>
                  <p className="mt-2 text-xs capitalize text-zinc-500">{t.taskType.replace(/_/g, " ")}</p>
                  <p className="mt-1 text-sm text-zinc-600">{labels.dueDate}: {t.dueLabel}</p>
                </>
              }
            />
          ))}
        </div>
      ) : null}

      {activeSection === "executive" ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {center.executiveOverview.map((m) => (
              <div key={m.id} className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-4">
                <p className="text-xs font-medium uppercase text-zinc-500 capitalize">{m.metricKey.replace(/_/g, " ")}</p>
                <p className="mt-1 text-2xl font-bold text-indigo-900">{m.metricValue}</p>
                {m.trendLabel ? <p className="mt-1 text-xs text-zinc-600">{m.trendLabel}</p> : null}
                <div className="mt-2">
                  <CustomerSuccessStatusBadge statusKey={m.statusKey} labels={labels.status} />
                </div>
              </div>
            ))}
          </div>
          {center.topRecommendations.length > 0 ? (
            <section className="rounded-2xl border border-violet-100 bg-violet-50/20 p-5">
              <h3 className="font-semibold text-zinc-900">{labels.topRecommendations}</h3>
              <ul className="mt-4 space-y-2">
                {center.topRecommendations.map((rec) => (
                  <li key={rec.id} className="rounded-lg bg-white p-3">
                    <p className="font-medium text-zinc-900">{rec.title}</p>
                    <p className="text-sm text-zinc-600">{rec.insight}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      ) : null}

      {activeSection === "governance" ? (
        <>
          {center.governanceNote ? (
            <p className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-4 text-sm text-indigo-900">
              {center.governanceNote}
            </p>
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
