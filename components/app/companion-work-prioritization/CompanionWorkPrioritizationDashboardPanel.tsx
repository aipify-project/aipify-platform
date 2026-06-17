"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  parseWorkPrioritizationDashboard,
  parseWorkPrioritizationDependencies,
  parseWorkPrioritizationFocus,
  parseWorkPrioritizationWorkload,
  type CompanionWorkPrioritizationLabels,
  type PriorityDependency,
  type WorkPriorityItem,
  type WorkPrioritizationDashboard,
  type WorkloadSnapshot,
} from "@/lib/aipify/companion-work-prioritization";

type Props = { labels: CompanionWorkPrioritizationLabels };

type FocusData = {
  top_priority?: string;
  next_priority?: string;
  focus_items: WorkPriorityItem[];
};

export function CompanionWorkPrioritizationDashboardPanel({ labels }: Props) {
  const [data, setData] = useState<WorkPrioritizationDashboard | null>(null);
  const [focus, setFocus] = useState<FocusData | null>(null);
  const [workload, setWorkload] = useState<WorkloadSnapshot | null>(null);
  const [dependencies, setDependencies] = useState<PriorityDependency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [priority, setPriority] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [project, setProject] = useState("");
  const [owner, setOwner] = useState("");
  const [search, setSearch] = useState("");
  const [recalculating, setRecalculating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const p = new URLSearchParams();
    if (priority) p.set("priority", priority);
    if (department) p.set("department", department);
    if (status) p.set("status", status);
    if (project) p.set("project", project);
    if (owner) p.set("owner", owner);
    if (search.trim()) p.set("search", search.trim());

    const [dashRes, focusRes, workloadRes, depsRes] = await Promise.all([
      fetch(`/api/aipify/work-prioritization?${p}`),
      fetch("/api/aipify/work-prioritization/focus"),
      fetch("/api/aipify/work-prioritization/workload"),
      fetch("/api/aipify/work-prioritization/dependencies"),
    ]);

    if (dashRes.ok) {
      setData(parseWorkPrioritizationDashboard(await dashRes.json()));
    } else {
      const b = (await dashRes.json()) as { error?: string };
      setError(b.error ?? labels.accessDenied);
      setData(null);
    }

    if (focusRes.ok) {
      const f = parseWorkPrioritizationFocus(await focusRes.json());
      setFocus({
        top_priority: f.focus_mode?.top_priority,
        next_priority: f.focus_mode?.next_priority,
        focus_items: f.focus_items,
      });
    }
    if (workloadRes.ok) {
      const w = parseWorkPrioritizationWorkload(await workloadRes.json());
      setWorkload(w.workload ?? null);
    }
    if (depsRes.ok) {
      const d = parseWorkPrioritizationDependencies(await depsRes.json());
      setDependencies(d.dependencies);
    }
    setLoading(false);
  }, [priority, department, status, project, owner, search, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function recalculate() {
    setRecalculating(true);
    await fetch("/api/aipify/work-prioritization/recalculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ force: true }),
    });
    setRecalculating(false);
    void load();
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
    return <p className="text-sm text-slate-600">{labels.accessDenied}</p>;
  }

  const empty = !data?.has_priorities;
  const items = data?.items ?? [];
  const focusLimit = data?.focus_limit ?? 5;
  const focusItems = items.slice(0, focusLimit);
  const criticalItems = items.filter((i) => i.priority_level === "critical");
  const delegationItems = items.filter((i) => i.recommended_action === "delegate");
  const deadlineItems = items.filter((i) => i.due_date).sort((a, b) => (a.due_date ?? "").localeCompare(b.due_date ?? ""));

  return (
    <div className="space-y-8">
      <p className="rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-slate-800">{labels.principle}</p>
      {data?.privacy_note ? <p className="text-sm text-slate-600">{labels.privacyNote}</p> : null}

      {empty ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{labels.emptyTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{labels.emptyBody}</p>
          <Link href="/app/assistant"
            className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white">
            {labels.emptyCta}
          </Link>
        </section>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <ScoreCard label={labels.dashboard.workPriorityScore} value={data?.work_priority_score ?? 0} />
            <ScoreCard label={labels.dashboard.criticalItems} value={data?.critical_count ?? criticalItems.length} />
            <ScoreCard label={labels.dashboard.todaysFocus} text={data?.todays_focus} />
            <ScoreCard label={labels.dashboard.upcomingDeadlines} value={deadlineItems.length} />
            <ScoreCard label={labels.dashboard.delegationOpportunities} value={delegationItems.length} />
            <ScoreCard label={labels.dashboard.recommendedActions} value={items.length} />
          </section>

          {focusItems.length > 0 ? (
            <Section title={`${labels.sections.todaysFocus} (Top ${focusLimit})`}>
              <div className="grid gap-3 lg:grid-cols-2">
                {focusItems.map((item) => (
                  <PriorityCard key={item.id} item={item} labels={labels} />
                ))}
              </div>
            </Section>
          ) : null}

          {criticalItems.length > 0 ? (
            <Section title={labels.sections.criticalItems}>
              <div className="grid gap-3 lg:grid-cols-2">
                {criticalItems.map((item) => (
                  <PriorityCard key={item.id} item={item} labels={labels} />
                ))}
              </div>
            </Section>
          ) : null}
        </>
      )}

      {!empty && (focus?.top_priority || focus?.focus_items.length) ? (
        <Section title={labels.sections.focusMode}>
          {focus?.top_priority ? (
            <p className="text-sm text-slate-700">
              <span className="font-medium">{labels.focusMode.topPriority}: </span>{focus.top_priority}
            </p>
          ) : null}
          {focus?.next_priority ? (
            <p className="mt-2 text-sm text-slate-700">
              <span className="font-medium">{labels.focusMode.nextPriority}: </span>{focus.next_priority}
            </p>
          ) : null}
          {focus?.focus_items.length ? (
            <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-slate-700">
              {focus.focus_items.map((item) => (
                <li key={item.id}>{item.title}</li>
              ))}
            </ol>
          ) : null}
        </Section>
      ) : null}

      {!empty && workload ? (
        <Section title={labels.sections.workloadBalance}>
          <ul className="grid gap-2 sm:grid-cols-2 text-sm text-slate-700">
            <li>{labels.workload.current}: {workload.current_workload}%</li>
            <li>{labels.workload.upcoming}: {workload.upcoming_workload}%</li>
            <li>{labels.workload.overloadRisk}: {workload.overload_risk}</li>
            <li>{labels.workload.capacity}: {workload.capacity_indicator}</li>
          </ul>
          {workload.delegation_suggestion ? (
            <p className="mt-3 text-sm text-indigo-800">{labels.workload.delegationSuggestion}: {workload.delegation_suggestion}</p>
          ) : null}
        </Section>
      ) : null}

      {!empty && dependencies.length > 0 ? (
        <Section title={labels.sections.dependencies}>
          <div className="grid gap-3 lg:grid-cols-2">
            {dependencies.map((dep) => (
              <article key={dep.id} className="rounded-lg border border-slate-100 p-4 text-sm">
                <h3 className="font-medium text-slate-900">{dep.title}</h3>
                <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                  {labels.dependencies[dep.dependency_type as keyof typeof labels.dependencies] ?? dep.dependency_type}
                </p>
                <p className="mt-1 text-slate-600">{dep.description}</p>
              </article>
            ))}
          </div>
        </Section>
      ) : null}

      {!empty && deadlineItems.length > 0 ? (
        <Section title={labels.sections.upcomingDeadlines}>
          <div className="grid gap-3 lg:grid-cols-2">
            {deadlineItems.slice(0, 6).map((item) => (
              <PriorityCard key={item.id} item={item} labels={labels} />
            ))}
          </div>
        </Section>
      ) : null}

      {!empty && delegationItems.length > 0 ? (
        <Section title={labels.sections.delegationOpportunities}>
          <div className="grid gap-3 lg:grid-cols-2">
            {delegationItems.map((item) => (
              <PriorityCard key={item.id} item={item} labels={labels} />
            ))}
          </div>
        </Section>
      ) : null}

      {!empty && items.length > 0 ? (
        <Section title={labels.sections.allPriorities}>
          <div className="grid gap-3 lg:grid-cols-2">
            {items.map((item) => (
              <PriorityCard key={item.id} item={item} labels={labels} />
            ))}
          </div>
        </Section>
      ) : null}

      <section className="flex flex-wrap gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder={labels.filters.search}
          className="min-w-[12rem] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.priority}</option>
          {(["critical", "high", "medium", "low", "optional"] as const).map((p) => (
            <option key={p} value={p}>{labels.priorities[p]}</option>
          ))}
        </select>
        <input value={department} onChange={(e) => setDepartment(e.target.value)}
          placeholder={labels.filters.department}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={status} onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.all}</option>
          {(["pending", "in_progress", "blocked", "completed", "postponed"] as const).map((s) => (
            <option key={s} value={s}>{labels.statuses[s]}</option>
          ))}
        </select>
        <input value={project} onChange={(e) => setProject(e.target.value)}
          placeholder={labels.filters.project}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input value={owner} onChange={(e) => setOwner(e.target.value)}
          placeholder={labels.filters.owner}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <button type="button" disabled={recalculating} onClick={() => void recalculate()}
          className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-800 disabled:opacity-50">
          {labels.actions.recalculate}
        </button>
      </section>

      {(data?.timeline?.length ?? 0) > 0 ? (
        <Section title={labels.sections.timeline}>
          <ul className="space-y-2 text-sm text-slate-700">
            {data!.timeline!.map((e) => (
              <li key={e.id}>{e.description} · {new Date(e.created_at).toLocaleDateString()}</li>
            ))}
          </ul>
        </Section>
      ) : null}

      {data?.usage_example ? (
        <Section title={labels.sections.usageExamples}>
          <p className="text-sm italic text-slate-700">{data.usage_example}</p>
        </Section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold">{labels.faq.title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div><dt className="font-medium">{labels.faq.whatIs}</dt><dd className="mt-1 text-slate-600">{labels.faq.whatIsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.canDecide}</dt><dd className="mt-1 text-slate-600">{labels.faq.canDecideAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.howCalculated}</dt><dd className="mt-1 text-slate-600">{labels.faq.howCalculatedAnswer}</dd></div>
        </dl>
      </section>
    </div>
  );
}

function ScoreCard({ label, value, text }: { label: string; value?: number; text?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-indigo-700">{text ?? value ?? "—"}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-semibold text-slate-900">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function PriorityCard({ item, labels }: { item: WorkPriorityItem; labels: CompanionWorkPrioritizationLabels }) {
  return (
    <article className="rounded-lg border border-slate-100 p-4 text-sm">
      <h3 className="font-medium text-slate-900">{item.title}</h3>
      <p className="mt-1 text-slate-600">{item.description}</p>
      {item.reason ? (
        <p className="mt-2 rounded-md bg-slate-50 px-3 py-2 text-slate-700">
          <span className="font-medium">{labels.card.reason}: </span>{item.reason}
        </p>
      ) : null}
      {item.recommended_action ? (
        <p className="mt-2 text-indigo-800">
          <span className="font-medium">{labels.card.recommendedAction}: </span>
          {labels.recommendedActions[item.recommended_action as keyof typeof labels.recommendedActions] ?? item.recommended_action}
        </p>
      ) : null}
      <dl className="mt-2 grid gap-1 text-xs text-slate-500">
        <div><dt className="inline">{labels.card.priority}: </dt>
          <dd className="inline">{labels.priorities[item.priority_level as keyof typeof labels.priorities] ?? item.priority_level}</dd></div>
        <div><dt className="inline">{labels.card.status}: </dt>
          <dd className="inline">{labels.statuses[item.status as keyof typeof labels.statuses] ?? item.status}</dd></div>
        <div><dt className="inline">{labels.card.source}: </dt>
          <dd className="inline">{labels.sources[item.source_type as keyof typeof labels.sources] ?? item.source_type}</dd></div>
        {item.due_date ? (
          <div><dt className="inline">{labels.card.dueDate}: </dt><dd className="inline">{item.due_date}</dd></div>
        ) : null}
        {item.owner_label ? (
          <div><dt className="inline">{labels.card.owner}: </dt><dd className="inline">{item.owner_label}</dd></div>
        ) : null}
      </dl>
    </article>
  );
}
