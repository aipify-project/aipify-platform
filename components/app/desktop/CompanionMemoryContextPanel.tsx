"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseCompanionContextBundle,
  parseCompanionMemoryCenter,
  parseCompanionProjectMap,
  type CompanionContextBundle,
  type CompanionMemoryCenter,
  type CompanionProjectMap,
} from "@/lib/companion-memory-context";

type Props = {
  labels: Record<string, string>;
};

export function CompanionMemoryContextPanel({ labels }: Props) {
  const [memory, setMemory] = useState<CompanionMemoryCenter | null>(null);
  const [context, setContext] = useState<CompanionContextBundle | null>(null);
  const [projects, setProjects] = useState<CompanionProjectMap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const params = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : "";
      const [memoryRes, contextRes, relRes] = await Promise.all([
        fetch(`/api/companion/memory${params}`),
        fetch("/api/companion/context"),
        fetch("/api/companion/relationships"),
      ]);
      if (!memoryRes.ok) {
        setError(true);
        setLoading(false);
        return;
      }
      setMemory(parseCompanionMemoryCenter(await memoryRes.json()));
      if (contextRes.ok) setContext(parseCompanionContextBundle(await contextRes.json()));
      if (relRes.ok) setProjects(parseCompanionProjectMap(await relRes.json()));
    } catch {
      setError(true);
    }
    setLoading(false);
  }, [search]);

  useEffect(() => {
    void load();
  }, [load]);

  const enableMemory = async () => {
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/companion/memory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "enable" }),
    });
    if (res.ok) {
      setMemory(parseCompanionMemoryCenter(await res.json()));
      await load();
    } else {
      setMessage(labels.actionFailed);
    }
    setBusy(false);
  };

  const deleteMemory = async (id: string) => {
    setBusy(true);
    const res = await fetch(`/api/companion/memory?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setMemory(parseCompanionMemoryCenter(await res.json()));
      setMessage(labels.deleted);
    } else {
      setMessage(labels.actionFailed);
    }
    setBusy(false);
  };

  const exportMemory = async () => {
    setBusy(true);
    const res = await fetch("/api/companion/memory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "export" }),
    });
    if (res.ok) {
      setMessage(labels.exported);
    } else {
      setMessage(labels.actionFailed);
    }
    setBusy(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-3">
        <AipifyLoader centered />
        <p className="sr-only">{labels.loadingContext}</p>
      </div>
    );
  }

  if (error || !memory) {
    return (
      <PlatformEmptyState
        title={labels.errorTitle}
        message={labels.errorMessage}
        primaryAction={{ label: labels.retry, onClick: () => void load() }}
      />
    );
  }

  if (!memory.memory_enabled) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 p-6">
        <div>
          <Link href="/app/desktop" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
            ← {labels.backToDesktop}
          </Link>
          <h1 className="mt-3 text-2xl font-semibold text-slate-900">{labels.title}</h1>
          <p className="mt-2 text-slate-600">{labels.subtitle}</p>
        </div>
        <PlatformEmptyState
          title={labels.emptyTitle}
          message={labels.emptyMessage}
          primaryAction={{ label: labels.enableMemory, onClick: () => void enableMemory() }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/app/desktop" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
            ← {labels.backToDesktop}
          </Link>
          <h1 className="mt-3 text-2xl font-semibold text-slate-900">{labels.title}</h1>
          <p className="mt-2 max-w-3xl text-slate-600">{labels.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => void exportMemory()}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {labels.exportMemory}
          </button>
        </div>
      </div>

      {context?.briefing ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-6">
          <p className="text-sm font-medium text-indigo-900">{context.briefing.greeting}</p>
          <ul className="mt-3 space-y-1 text-sm text-indigo-950">
            <li>✓ {context.briefing.active_projects} active projects</li>
            <li>✓ {context.briefing.pending_tasks} pending tasks</li>
            <li>✓ {context.briefing.attention_projects} project requiring attention</li>
          </ul>
          <p className="mt-4 text-sm text-indigo-900">
            {labels.recommendedFocus}: <strong>{context.briefing.recommended_focus}</strong>
          </p>
        </section>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label={labels.usefulMemory} value={memory.memory_health.useful_count} />
        <MetricCard label={labels.unusedMemory} value={memory.memory_health.unused_count} />
        <MetricCard label={labels.oldMemory} value={memory.memory_health.old_count} />
        <MetricCard
          label={labels.workspaceHealth}
          value={context?.workspace_health?.label ?? "—"}
        />
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">{labels.workspaceMapTitle}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {(projects?.workspace_map ?? []).map((root) => (
            <div key={root.project_key} className="rounded-xl border border-slate-200 bg-white p-4 font-mono text-sm">
              <p className="font-semibold text-slate-900">{root.project_label}</p>
              <ul className="mt-2 space-y-1 text-slate-600">
                {root.children.map((child) => (
                  <li key={child.project_key}>├─ {child.label}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">{labels.whatAipifyKnows}</h2>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
        {memory.memories.length === 0 ? (
          <p className="text-sm text-slate-500">{labels.emptyMessage}</p>
        ) : (
          <div className="space-y-4">
            {memory.memories.map((item) => (
              <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
                      {labels[`category_${item.memory_category}`] ?? item.memory_category}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{item.summary}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                    {labels[`confidence_${item.confidence_level}`] ?? item.confidence_level}
                  </span>
                </div>
                <dl className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                  <div>
                    <dt className="font-medium text-slate-900">{labels.whatStored}</dt>
                    <dd>{item.what_stored}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-slate-900">{labels.whyHelps}</dt>
                    <dd>{item.why_helps}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-slate-900">{labels.howLearned}</dt>
                    <dd>{item.how_learned}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-slate-900">{labels.source}</dt>
                    <dd>{item.source_label}</dd>
                  </div>
                </dl>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                  <span>
                    {labels.lastUsed}: {item.last_used_at ? new Date(item.last_used_at).toLocaleString() : "—"}
                  </span>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void deleteMemory(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    {labels.delete}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {context?.insights?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">{labels.insightsTitle}</h2>
          <ul className="space-y-2">
            {context.insights.map((insight) => (
              <li key={insight.id} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                {insight.message}
                <span className="ml-2 text-xs text-slate-500">
                  ({labels[`confidence_${insight.confidence_level}`] ?? insight.confidence_level})
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-lg font-semibold text-slate-900">{labels.faqTitle}</h2>
        <dl className="mt-4 space-y-4 text-sm text-slate-700">
          <div>
            <dt className="font-medium text-slate-900">{labels.faqWhatRemember}</dt>
            <dd className="mt-1">{labels.faqWhatRememberAnswer}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">{labels.faqDelete}</dt>
            <dd className="mt-1">{labels.faqDeleteAnswer}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">{labels.faqHidden}</dt>
            <dd className="mt-1">{labels.faqHiddenAnswer}</dd>
          </div>
        </dl>
      </section>

      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-slate-900">{value}</dd>
    </div>
  );
}
