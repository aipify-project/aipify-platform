"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  AVAILABILITY_STATUS_BADGES,
  DELIVERY_RISK_BADGES,
  HEALTH_STATUS_BADGES,
  RESOURCE_CAPACITY_TABS,
  RESOURCE_TYPE_BADGES,
  parseResourceCapacityCenter,
  type ResourceCapacityCenter,
  type ResourceCapacityLabels,
  type ResourceCapacityTab,
} from "@/lib/customer-resource-capacity-operations";

type Props = {
  labels: ResourceCapacityLabels;
  backHref: string;
  initialTab?: ResourceCapacityTab;
};

function OverviewCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function ItemList({ items, labels }: { items: Record<string, unknown>[]; labels: ResourceCapacityLabels }) {
  if (!items.length) return <p className="text-sm text-zinc-500">—</p>;
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={String(
            item.resource_key ?? item.capacity_key ?? item.workload_key ?? item.allocation_key
              ?? item.forecast_key ?? item.overload_key ?? item.underutil_key ?? item.match_key
              ?? item.project_key ?? item.pack_key ?? i
          )}
          className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-sm"
        >
          <p className="font-medium text-zinc-900">
            {String(
              item.resource_name ?? item.assignment_title ?? item.workload_title ?? item.overload_title
                ?? item.underutil_title ?? item.forecast_title ?? item.project_title ?? item.project_need
                ?? item.pack_title ?? i
            )}
          </p>
          {item.summary ? <p className="mt-1 text-zinc-600">{String(item.summary)}</p> : null}
          {item.recommendation ? <p className="mt-1 text-indigo-700">{String(item.recommendation)}</p> : null}
          {item.opportunity ? <p className="mt-1 text-indigo-700">{String(item.opportunity)}</p> : null}
          {item.owner_name ? <p className="mt-1 text-zinc-500">{String(item.owner_name)}</p> : null}
          {item.matched_resource ? <p className="mt-1 text-zinc-500">Match: {String(item.matched_resource)} ({String(item.match_score)}%)</p> : null}
          {item.allocated_capacity_pct != null ? (
            <p className="mt-1 text-zinc-500">Allocated: {String(item.allocated_capacity_pct)}% · Remaining: {String(item.remaining_capacity_pct)}%</p>
          ) : null}
          {item.workload_pct != null ? <p className="mt-1 text-zinc-500">Workload: {String(item.workload_pct)}%</p> : null}
          {item.shortage_pct != null ? <p className="mt-1 text-zinc-500">Shortage: {String(item.shortage_pct)}%</p> : null}
          <div className="mt-2 flex flex-wrap gap-1">
            {item.health_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${HEALTH_STATUS_BADGES[String(item.health_status)] ?? HEALTH_STATUS_BADGES.healthy}`}>
                {labels.healthStatus[String(item.health_status) as keyof typeof labels.healthStatus] ?? String(item.health_status)}
              </span>
            ) : null}
            {item.availability_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${AVAILABILITY_STATUS_BADGES[String(item.availability_status)] ?? AVAILABILITY_STATUS_BADGES.available}`}>
                {labels.availabilityStatus[String(item.availability_status) as keyof typeof labels.availabilityStatus] ?? String(item.availability_status)}
              </span>
            ) : null}
            {item.resource_type ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${RESOURCE_TYPE_BADGES[String(item.resource_type)] ?? RESOURCE_TYPE_BADGES.team}`}>
                {String(item.resource_type)}
              </span>
            ) : null}
            {item.delivery_risk ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${DELIVERY_RISK_BADGES[String(item.delivery_risk)] ?? DELIVERY_RISK_BADGES.low}`}>
                {labels.deliveryRisk[String(item.delivery_risk) as keyof typeof labels.deliveryRisk] ?? String(item.delivery_risk)}
              </span>
            ) : null}
            {item.department ? (
              <span className="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700">{String(item.department)}</span>
            ) : null}
            {item.forecast_horizon ? (
              <span className="inline-flex rounded-full bg-purple-50 px-2 py-0.5 text-xs text-purple-700">{String(item.forecast_horizon)}</span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ResourceCapacityPanel({ labels, backHref, initialTab = "overview" }: Props) {
  const [center, setCenter] = useState<ResourceCapacityCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<ResourceCapacityTab>(initialTab);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/resource-capacity-operations");
    if (res.ok) setCenter(parseResourceCapacityCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const runAction = useCallback(async (action_type: string, payload: Record<string, unknown> = {}) => {
    setBusy(true);
    try {
      const res = await fetch("/api/app/resource-capacity-operations/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action_type, ...payload }),
      });
      if (res.ok) await load();
    } finally { setBusy(false); }
  }, [load]);

  if (loading && !center) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <AipifyLoader centered /><span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found) return <p className="p-6 text-sm text-red-600">{labels.emptyState}</p>;

  const overview = center.overview ?? {};
  const executive = center.executive_dashboard ?? {};
  const companion = center.companion ?? {};
  const advisorPrompts = (companion.resource_advisor_prompts as string[]) ?? [];
  const recommendations = center.recommendations ?? (executive.companion_recommendations as Record<string, unknown>[]) ?? [];

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">← {labels.back}</Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm text-zinc-800">{center.principle}</p>
        {center.philosophy ? <p className="mt-3 text-sm text-zinc-600">{center.philosophy}</p> : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" disabled={busy} onClick={() => void runAction("refresh_resources")}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
          {labels.actions.refreshResources}
        </button>
        <button type="button" disabled={busy} onClick={() => void runAction("generate_capacity_forecast")}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 disabled:opacity-50">
          {labels.actions.generateCapacityForecast}
        </button>
        <button type="button" disabled={busy} onClick={() => void runAction("generate_resource_report")}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 disabled:opacity-50">
          {labels.actions.generateCapacityReport}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {RESOURCE_CAPACITY_TABS.map((key) => (
          <button key={key} type="button" onClick={() => setTab(key)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${tab === key ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"}`}>
            {labels.tabs[key]}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <section className="space-y-8">
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <OverviewCard label={labels.overview.totalResources} value={Number(overview.total_resources ?? 0)} />
            <OverviewCard label={labels.overview.overloadedResources} value={Number(overview.overloaded_resources ?? 0)} />
            <OverviewCard label={labels.overview.underutilizedResources} value={Number(overview.underutilized_resources ?? 0)} />
            <OverviewCard label={labels.overview.openOverloads} value={Number(overview.open_overloads ?? 0)} />
            <OverviewCard label={labels.overview.avgUtilization} value={`${Number(overview.avg_utilization ?? 0)}%`} />
            <OverviewCard label={labels.overview.availableCapacity} value={`${Number(overview.available_capacity_pct ?? 0)}%`} />
            <OverviewCard label={labels.overview.forecastShortages} value={Number(overview.forecast_shortages ?? 0)} />
            <OverviewCard label={labels.overview.activeAllocations} value={Number(overview.active_allocations ?? 0)} />
            <OverviewCard label={labels.overview.highRiskProjects} value={Number(overview.high_risk_projects ?? 0)} />
          </dl>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.overloadDetection}</h2>
            <div className="mt-4"><ItemList items={center.overloads ?? []} labels={labels} /></div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.underutilizationDetection}</h2>
            <div className="mt-4"><ItemList items={center.underutilization ?? []} labels={labels} /></div>
          </div>
        </section>
      ) : null}

      {tab === "capacity" ? (
        <section><ItemList items={center.capacity ?? []} labels={labels} /></section>
      ) : null}

      {tab === "teams" ? (
        <section className="space-y-6">
          <ItemList items={center.teams ?? []} labels={labels} />
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.skillMatching}</h2>
            <div className="mt-4"><ItemList items={center.skill_matches ?? []} labels={labels} /></div>
          </div>
        </section>
      ) : null}

      {tab === "workloads" ? (
        <section><ItemList items={center.workloads ?? []} labels={labels} /></section>
      ) : null}

      {tab === "allocations" ? (
        <section><ItemList items={center.allocations ?? []} labels={labels} /></section>
      ) : null}

      {tab === "forecasts" ? (
        <section><ItemList items={center.forecasts ?? []} labels={labels} /></section>
      ) : null}

      {tab === "availability" ? (
        <section className="space-y-6">
          <ItemList items={center.availability ?? []} labels={labels} />
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.projectCapacity}</h2>
            <div className="mt-4"><ItemList items={center.projects ?? []} labels={labels} /></div>
          </div>
        </section>
      ) : null}

      {tab === "reports" ? (
        <section className="space-y-6">
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.executiveDashboard}</h2>
            <div className="mt-4"><ItemList items={recommendations} labels={labels} /></div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.businessPacks}</h2>
            <div className="mt-4"><ItemList items={center.business_packs ?? []} labels={labels} /></div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.companionAdvisor}</h2>
            <ul className="mt-3 space-y-1 text-sm text-zinc-700">
              {advisorPrompts.map((prompt) => <li key={prompt}>· {prompt}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.audit}</h2>
            <ul className="mt-4 space-y-2 text-sm text-zinc-600">
              {(center.audit_recent ?? []).map((entry, i) => (
                <li key={i} className="rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2">
                  <span className="font-medium text-zinc-900">{entry.event_type}</span>
                  {entry.summary ? ` — ${entry.summary}` : ""}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </div>
  );
}
