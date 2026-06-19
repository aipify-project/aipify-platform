"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  ENGINE_STATUS_BADGES,
  parsePlatformAosCoreCenter,
  type AosEngine,
  type PlatformAosCoreCenter,
  type PlatformAosCoreLabels,
  type PlatformAosCoreTab,
} from "@/lib/platform-aos-core";

type Props = {
  labels: PlatformAosCoreLabels;
  backHref: string;
  initialTab?: PlatformAosCoreTab;
  visibleTabs?: PlatformAosCoreTab[];
  titleOverride?: string;
  subtitleOverride?: string;
};

function OverviewCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function EngineRow({ engine, labels }: { engine: AosEngine; labels: PlatformAosCoreLabels }) {
  const status = engine.engine_status ?? "healthy";
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-medium text-zinc-900">{engine.engine_name}</p>
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
            ENGINE_STATUS_BADGES[status] ?? ENGINE_STATUS_BADGES.healthy
          }`}
        >
          {labels.engineStatuses[status] ?? status}
        </span>
      </div>
      <p className="mt-1 text-xs text-zinc-500">
        {engine.engine_key} · v{engine.engine_version ?? "1.0.0"} · {engine.owner_team}
      </p>
      {engine.health_score != null ? (
        <p className="mt-1 text-sm text-zinc-600">Health: {engine.health_score}</p>
      ) : null}
    </div>
  );
}

const ALL_TABS: PlatformAosCoreTab[] = [
  "overview",
  "orchestration",
  "engine_registry",
  "dependencies",
  "platform_health",
  "feature_flags",
  "execution_control",
  "governance",
  "executive",
  "reports",
];

export function PlatformAosCorePanel({
  labels,
  backHref,
  initialTab = "overview",
  visibleTabs,
  titleOverride,
  subtitleOverride,
}: Props) {
  const tabs = visibleTabs ?? ALL_TABS;
  const [center, setCenter] = useState<PlatformAosCoreCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<PlatformAosCoreTab>(initialTab);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/platform-aos-core/overview");
    if (res.ok) setCenter(parsePlatformAosCoreCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  const performAction = useCallback(
    async (payload: Record<string, string>) => {
      setBusy(true);
      try {
        const res = await fetch("/api/platform-aos-core/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) await load();
      } finally {
        setBusy(false);
      }
    },
    [load]
  );

  if (loading && !center) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found) {
    return <p className="p-6 text-sm text-red-600">{labels.emptyState}</p>;
  }

  const overview = center.overview ?? {};
  const engines = center.engine_registry ?? [];
  const flows = (center.orchestration?.flows as Record<string, unknown>[]) ?? [];
  const dependencies = (center.dependency_engine?.dependencies as Record<string, unknown>[]) ?? [];
  const flags = center.feature_flags ?? [];
  const policies = center.platform_policies ?? [];
  const health = center.platform_health ?? [];
  const governor = center.platform_governor ?? {};
  const advisorPrompts = (center.companion_advisor?.advisor_prompts as string[]) ?? [];
  const protects = (governor.protects as string[]) ?? [];

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          ← {labels.back}
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">
          {titleOverride ?? labels.title}
        </h1>
        <p className="mt-2 max-w-3xl text-zinc-600">{subtitleOverride ?? labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm text-zinc-800">
          {center.principle}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/platform/aos-core/engines"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          {labels.actions.openEngines}
        </Link>
        <Link
          href="/platform/aos-core/features"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
        >
          {labels.actions.openFeatures}
        </Link>
        <button
          type="button"
          disabled={busy}
          onClick={() => void performAction({ action: "refresh_health", health_score: "89" })}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 disabled:opacity-50"
        >
          {labels.actions.refreshHealth}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              tab === key ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            {labels.tabs[key]}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <OverviewCard label={labels.overview.registeredEngines} value={overview.registered_engines ?? 0} />
          <OverviewCard label={labels.overview.healthyEngines} value={overview.healthy_engines ?? 0} />
          <OverviewCard label={labels.overview.dependencies} value={overview.dependencies ?? 0} />
          <OverviewCard label={labels.overview.orchestrationFlows} value={overview.orchestration_flows ?? 0} />
          <OverviewCard label={labels.overview.featureFlags} value={overview.feature_flags ?? 0} />
          <OverviewCard label={labels.overview.policies} value={overview.policies ?? 0} />
          <OverviewCard label={labels.overview.platformHealthScore} value={overview.platform_health_score ?? 0} />
        </dl>
      ) : null}

      {tab === "engine_registry" ? (
        <section className="grid gap-4 md:grid-cols-2">
          {engines.map((e) => (
            <EngineRow key={e.engine_key} engine={e} labels={labels} />
          ))}
        </section>
      ) : null}

      {tab === "orchestration" ? (
        <section className="space-y-4">
          {flows.map((f) => (
            <div key={String(f.flow_key)} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
              <p className="font-medium text-zinc-900">{String(f.title)}</p>
              <p className="mt-1 text-sm text-zinc-600">{String(f.description)}</p>
              <p className="mt-2 text-xs text-zinc-500">
                Trigger: {String(f.trigger_event)} · {JSON.stringify(f.engine_chain)}
              </p>
            </div>
          ))}
        </section>
      ) : null}

      {tab === "dependencies" ? (
        <section className="space-y-3">
          {dependencies.map((d, i) => (
            <div key={i} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
              <p className="font-medium text-zinc-900">
                {String(d.source_key)} → {String(d.target_key)}
              </p>
              <p className="text-zinc-500">{String(d.dependency_type)}</p>
            </div>
          ))}
        </section>
      ) : null}

      {tab === "platform_health" ? (
        <section className="space-y-3">
          {health.map((h, i) => (
            <div key={i} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
              <p className="font-medium text-zinc-900">
                {String(h.scope_type)} · {String(h.health_status)} · {String(h.health_score)}
              </p>
              {h.summary ? <p className="text-zinc-600">{String(h.summary)}</p> : null}
            </div>
          ))}
        </section>
      ) : null}

      {tab === "feature_flags" ? (
        <section className="space-y-4">
          {flags.map((f) => (
            <div key={String(f.flag_key)} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
              <p className="font-medium text-zinc-900">{String(f.title)}</p>
              <p className="text-sm text-zinc-600">{String(f.description ?? "")}</p>
              <p className="mt-1 text-xs text-zinc-500">Status: {String(f.status)}</p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    void performAction({ action: "enable_feature", flag_key: String(f.flag_key) })
                  }
                  className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                >
                  {labels.actions.enableFeature}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    void performAction({ action: "disable_feature", flag_key: String(f.flag_key) })
                  }
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium disabled:opacity-50"
                >
                  {labels.actions.disableFeature}
                </button>
              </div>
            </div>
          ))}
        </section>
      ) : null}

      {tab === "execution_control" ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-zinc-900">{labels.tabs.execution_control}</h2>
          {center.execution_coordination ? (
            <pre className="mt-3 overflow-x-auto text-sm text-zinc-600">
              {JSON.stringify(center.execution_coordination, null, 2)}
            </pre>
          ) : null}
          <button
            type="button"
            disabled={busy}
            onClick={() => void performAction({ action: "run_simulation" })}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {labels.actions.runSimulation}
          </button>
        </section>
      ) : null}

      {tab === "governance" ? (
        <section className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <h2 className="font-semibold text-zinc-900">Platform Governor</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-600">
              {protects.map((item) => (
                <li key={item}>{item.replace(/_/g, " ")}</li>
              ))}
            </ul>
          </div>
          {policies.map((p) => (
            <div key={String(p.policy_key)} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
              <p className="font-medium text-zinc-900">{String(p.title)}</p>
              <p className="text-zinc-500">{String(p.policy_type)}</p>
            </div>
          ))}
          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <h2 className="font-semibold text-zinc-900">Companion Platform Advisor</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-600">
              {advisorPrompts.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {tab === "executive" ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(center.executive_dashboard ?? {}).map(([key, value]) => (
            <OverviewCard key={key} label={key.replace(/_/g, " ")} value={String(value)} />
          ))}
          {center.enterprise_readiness ? (
            <div className="col-span-full rounded-2xl border border-zinc-200 bg-white p-4">
              <h2 className="font-semibold text-zinc-900">Enterprise Readiness</h2>
              <dl className="mt-3 grid gap-2 sm:grid-cols-2 text-sm">
                {Object.entries(center.enterprise_readiness).map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-zinc-500">{k.replace(/_/g, " ")}</dt>
                    <dd className="text-zinc-900">{String(v)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </section>
      ) : null}

      {tab === "reports" ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm text-sm text-zinc-600">
          <pre className="overflow-x-auto whitespace-pre-wrap">{JSON.stringify(center.reports ?? {}, null, 2)}</pre>
        </section>
      ) : null}

      {center.audit_recent?.length ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-zinc-900">Audit</h2>
          <ul className="mt-3 space-y-2 text-sm text-zinc-600">
            {center.audit_recent.map((entry, i) => (
              <li key={`${entry.event_type}-${i}`}>{entry.summary}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
