"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  INCIDENT_STATUS_BADGES,
  RESILIENCE_LABEL_BADGES,
  RESILIENCE_TABS,
  RISK_LEVEL_BADGES,
  SEVERITY_BADGES,
  parseResilienceCenter,
  type ResilienceCenter,
  type ResilienceIncident,
  type ResilienceLabels,
  type ResilienceTab,
} from "@/lib/customer-resilience-operations";

type Props = {
  labels: ResilienceLabels;
  backHref: string;
  initialTab?: ResilienceTab;
  visibleTabs?: ResilienceTab[];
  titleOverride?: string;
};

function OverviewCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function JsonList({ items }: { items: Record<string, unknown>[] }) {
  if (!items.length) return <p className="text-sm text-zinc-500">—</p>;
  return (
    <>
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-sm">
          <p className="font-medium text-zinc-900">
            {String(
              item.incident_title ?? item.plan_title ?? item.recovery_title
                ?? item.dependency_title ?? item.preparedness_title ?? item.scenario_title
                ?? item.communication_title ?? item.dimension ?? i
            )}
          </p>
          {(item.summary ?? item.impact_summary ?? item.recovery_outcome) ? (
            <p className="mt-1 text-zinc-600">{String(item.summary ?? item.impact_summary ?? item.recovery_outcome)}</p>
          ) : null}
          <div className="mt-2 flex flex-wrap gap-1">
            {item.severity ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${SEVERITY_BADGES[String(item.severity)] ?? SEVERITY_BADGES.moderate}`}>
                {String(item.severity)}
              </span>
            ) : null}
            {item.incident_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${INCIDENT_STATUS_BADGES[String(item.incident_status)] ?? INCIDENT_STATUS_BADGES.open}`}>
                {String(item.incident_status)}
              </span>
            ) : null}
            {item.risk_level ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${RISK_LEVEL_BADGES[String(item.risk_level)] ?? RISK_LEVEL_BADGES.moderate}`}>
                {String(item.risk_level)}
              </span>
            ) : null}
            {item.resilience_label ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${RESILIENCE_LABEL_BADGES[String(item.resilience_label)] ?? RESILIENCE_LABEL_BADGES.stable}`}>
                {String(item.resilience_label)}
              </span>
            ) : null}
            {item.recovery_progress_pct != null ? (
              <span className="inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">{String(item.recovery_progress_pct)}%</span>
            ) : null}
          </div>
        </div>
      ))}
    </>
  );
}

function IncidentCard({ item, labels, busy, onUpdate }: {
  item: ResilienceIncident; labels: ResilienceLabels; busy: boolean; onUpdate: (key: string) => void;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="font-medium text-zinc-900">{item.incident_title}</p>
      {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
      <p className="mt-2 text-xs text-zinc-500">{item.owner_name} · {item.incident_type} · {item.severity} · {item.incident_status}</p>
      {item.incident_status === "open" ? (
        <button type="button" disabled={busy} onClick={() => onUpdate(item.incident_key)}
          className="mt-3 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
          {labels.actions.updateIncident}
        </button>
      ) : null}
    </div>
  );
}

export function ResiliencePanel({ labels, backHref, initialTab = "overview", visibleTabs, titleOverride }: Props) {
  const tabs = visibleTabs ?? RESILIENCE_TABS;
  const [center, setCenter] = useState<ResilienceCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<ResilienceTab>(initialTab);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/resilience-operations");
    if (res.ok) setCenter(parseResilienceCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { setTab(initialTab); }, [initialTab]);

  const runAction = useCallback(async (action_type: string, payload: Record<string, unknown> = {}) => {
    setBusy(true);
    try {
      const res = await fetch("/api/app/resilience-operations/action", {
        method: "POST", headers: { "Content-Type": "application/json" },
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
  const advisorPrompts = (center.integrations?.crisis_advisor_prompts as string[]) ?? [];
  const recommendations = (center.reports?.companion_recommendations as Record<string, unknown>[]) ?? [];
  const scores = center.resilience_scores ?? (center.reports?.resilience_scores as Record<string, unknown>[]) ?? [];
  const scenarios = (center.reports?.scenario_tests as Record<string, unknown>[]) ?? [];
  const crisis = center.crisis_management ?? {};
  const activeIncidents = (crisis.active_incidents as Record<string, unknown>[]) ?? [];
  const communications = (crisis.communications as Record<string, unknown>[]) ?? [];

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">← {labels.back}</Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">{titleOverride ?? labels.title}</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm text-zinc-800">{center.principle}</p>
        {center.philosophy ? <p className="mt-3 text-sm text-zinc-600">{center.philosophy}</p> : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" disabled={busy} onClick={() => void runAction("refresh_resilience")}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
          {labels.actions.refreshResilience}
        </button>
        <Link href="/app/resilience/incidents" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openIncidents}</Link>
        <Link href="/app/resilience/emergency" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openEmergency}</Link>
        <Link href="/app/knowledge-graph" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openKnowledgeGraph}</Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((key) => (
          <button key={key} type="button" onClick={() => setTab(key)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${tab === key ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"}`}>
            {labels.tabs[key]}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <OverviewCard label={labels.overview.resilienceScore} value={Number(overview.resilience_score ?? 0)} />
          <OverviewCard label={labels.overview.openIncidents} value={Number(overview.open_incidents ?? 0)} />
          <OverviewCard label={labels.overview.criticalIncidents} value={Number(overview.critical_incidents ?? 0)} />
          <OverviewCard label={labels.overview.recoveryInProgress} value={Number(overview.recovery_in_progress ?? 0)} />
          <OverviewCard label={labels.overview.criticalDependencies} value={Number(overview.critical_dependencies ?? 0)} />
          <OverviewCard label={labels.overview.preparednessLevel} value={Number(overview.preparedness_level ?? 0)} />
          <OverviewCard label={labels.overview.continuityPlansActive} value={Number(overview.continuity_plans_active ?? 0)} />
        </dl>
      ) : null}

      {tab === "incidents" ? (
        <section className="space-y-3">
          <button type="button" disabled={busy} onClick={() => void runAction("create_incident", { incident_title: "New Incident" })}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
            {labels.actions.createIncident}
          </button>
          {(center.incidents ?? []).map((item) => (
            <IncidentCard key={item.incident_key} item={item} labels={labels} busy={busy}
              onUpdate={(key) => void runAction("update_incident", { incident_key: key, incident_status: "investigating" })} />
          ))}
        </section>
      ) : null}

      {tab === "continuity" ? (
        <section className="space-y-3">
          {(center.continuity ?? []).map((item) => (
            <div key={String(item.plan_key)} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <JsonList items={[item]} />
              {item.plan_status === "review_required" ? (
                <button type="button" disabled={busy}
                  onClick={() => void runAction("activate_continuity", { plan_key: item.plan_key })}
                  className="mt-3 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
                  {labels.actions.activateContinuity}
                </button>
              ) : null}
            </div>
          ))}
        </section>
      ) : null}

      {tab === "recovery" ? (
        <section className="space-y-3">
          {(center.recovery ?? []).map((item) => (
            <div key={String(item.recovery_key)} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <JsonList items={[item]} />
              <div className="mt-3 flex gap-2">
                {item.recovery_status === "in_progress" ? (
                  <button type="button" disabled={busy}
                    onClick={() => void runAction("update_recovery", { recovery_key: item.recovery_key })}
                    className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
                    {labels.actions.updateRecovery}
                  </button>
                ) : null}
                {item.recovery_status === "in_progress" && Number(item.recovery_progress_pct) >= 90 ? (
                  <button type="button" disabled={busy}
                    onClick={() => void runAction("complete_recovery", { recovery_key: item.recovery_key })}
                    className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium disabled:opacity-50">
                    {labels.actions.completeRecovery}
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </section>
      ) : null}

      {tab === "crisis" ? (
        <section className="space-y-6">
          <div>
            <h2 className="font-semibold text-zinc-900">Active incidents</h2>
            <div className="mt-4"><JsonList items={activeIncidents} /></div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.crisisCommunication}</h2>
            <div className="mt-4"><JsonList items={communications} /></div>
          </div>
        </section>
      ) : null}

      {tab === "dependencies" ? (
        <section>
          <h2 className="font-semibold text-zinc-900">{labels.sections.dependencyObservatory}</h2>
          <div className="mt-4"><JsonList items={center.dependencies ?? []} /></div>
        </section>
      ) : null}

      {tab === "preparedness" ? (
        <section className="space-y-3">
          <h2 className="font-semibold text-zinc-900">{labels.sections.preparednessEngine}</h2>
          {(center.preparedness ?? []).map((item) => (
            <div key={String(item.preparedness_key)}>
              <JsonList items={[item]} />
              {item.activity_status === "scheduled" || item.activity_status === "review_required" ? (
                <button type="button" disabled={busy}
                  onClick={() => void runAction("run_preparedness_test", { preparedness_key: item.preparedness_key })}
                  className="mt-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
                  {labels.actions.runPreparednessTest}
                </button>
              ) : null}
            </div>
          ))}
        </section>
      ) : null}

      {tab === "reports" ? (
        <section className="space-y-6">
          <JsonList items={recommendations} />
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.resilienceScore}</h2>
            <div className="mt-4"><JsonList items={scores} /></div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.scenarioTesting}</h2>
            <div className="mt-4"><JsonList items={scenarios} /></div>
          </div>
        </section>
      ) : null}

      {center.executive_dashboard ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(center.executive_dashboard).map(([key, value]) => (
            <OverviewCard key={key} label={key.replace(/_/g, " ")} value={String(value)} />
          ))}
        </section>
      ) : null}

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-zinc-900">{labels.sections.crisisAdvisor}</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-600">
          {advisorPrompts.map((p) => <li key={p}>{p}</li>)}
        </ul>
      </div>

      {(center.audit_recent ?? []).length ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-zinc-900">{labels.sections.audit}</h2>
          <ul className="mt-4 space-y-2 text-sm text-zinc-600">
            {(center.audit_recent ?? []).map((entry, i) => (
              <li key={i}>{entry.summary || entry.event_type}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
