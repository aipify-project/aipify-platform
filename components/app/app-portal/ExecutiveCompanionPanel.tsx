"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  EXECUTIVE_COMPANION_PRIORITIES,
  parseExecutiveCompanionOverview,
  parseExecutiveCompanionTimeline,
  type ExecutiveCompanionLabels,
  type ExecutiveCompanionOverview,
  type ExecutiveDailyBriefing,
  type ExecutivePriority,
  type ExecutiveTimelineEvent,
} from "@/lib/app-portal/executive-companion";

type Props = { labels: ExecutiveCompanionLabels };

const PRIORITY_STYLE: Record<string, string> = {
  informational: "bg-slate-100 text-slate-700",
  recommended: "bg-blue-100 text-blue-900",
  important: "bg-amber-100 text-amber-950",
  immediate_attention: "bg-red-100 text-red-900",
};

function formatBriefingLine(
  labels: ExecutiveCompanionLabels,
  line: { key: string; count?: number },
): string {
  const map: Record<string, string> = {
    strategicInitiativesAttention: labels.briefing.strategicInitiativesAttention,
    commitmentsApproaching: labels.briefing.commitmentsApproaching,
    riskShouldReview: labels.briefing.riskShouldReview,
  };
  const template = map[line.key] ?? line.key;
  return template.replace("{{count}}", String(line.count ?? 0));
}

function renderBriefing(labels: ExecutiveCompanionLabels, briefing?: ExecutiveDailyBriefing) {
  if (!briefing) return null;
  const greeting = labels.briefing[briefing.greeting_key as keyof typeof labels.briefing] ?? labels.briefing.goodMorning;
  const momentum = labels.briefing[briefing.momentum_summary_key as keyof typeof labels.briefing] ?? labels.briefing.momentumStable;
  return (
    <div className="space-y-2 text-sm text-slate-800">
      <p className="text-base font-medium text-slate-900">{greeting}</p>
      {briefing.lines.map((line) => (
        <p key={line.key}>{formatBriefingLine(labels, line)}</p>
      ))}
      <p className="text-slate-600">{momentum}</p>
    </div>
  );
}

export function ExecutiveCompanionPanel({ labels }: Props) {
  const [data, setData] = useState<ExecutiveCompanionOverview | null>(null);
  const [timeline, setTimeline] = useState<ExecutiveTimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [priority, setPriority] = useState("");
  const [strategicArea, setStrategicArea] = useState("");
  const [focusCategory, setFocusCategory] = useState("");
  const [periodFrom, setPeriodFrom] = useState("");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (priority) params.set("priority", priority);
    if (strategicArea) params.set("strategic_area", strategicArea);
    if (focusCategory) params.set("focus_category", focusCategory);
    if (periodFrom) params.set("period_from", periodFrom);
    if (search.trim()) params.set("search", search.trim());
    const [overviewRes, timelineRes] = await Promise.all([
      fetch(`/api/aipify/executive-companion?${params}`),
      fetch(`/api/aipify/executive-companion/timeline?${periodFrom ? `period_from=${periodFrom}` : ""}`),
    ]);
    if (overviewRes.ok) {
      setData(parseExecutiveCompanionOverview(await overviewRes.json()));
    } else {
      const body = (await overviewRes.json()) as { error?: string };
      setError(body.error ?? labels.accessDenied);
      setData(null);
    }
    if (timelineRes.ok) {
      const body = (await timelineRes.json()) as { timeline?: ExecutiveTimelineEvent[] };
      setTimeline(parseExecutiveCompanionTimeline(body));
    }
    setLoading(false);
  }, [priority, strategicArea, focusCategory, periodFrom, search, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function generateBriefing() {
    setBusy(true);
    const res = await fetch("/api/aipify/executive-companion", { method: "POST" });
    setBusy(false);
    if (res.ok) void load();
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
      <div className="mx-auto max-w-5xl space-y-4">
        <Link href="/app" className="text-sm font-medium text-indigo-700 hover:underline">← APP Dashboard</Link>
        <p className="text-slate-600">{labels.accessDenied}</p>
      </div>
    );
  }

  const empty = !data?.briefing_started;
  const health = data?.organizational_health;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
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
          <button type="button" disabled={busy} onClick={() => void generateBriefing()} className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">{labels.emptyCta}</button>
        </section>
      ) : (
        <>
          <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
            <h2 className="font-semibold">{labels.dashboard.executiveBriefing}</h2>
            <div className="mt-3">{renderBriefing(labels, data?.daily_briefing)}</div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <Stat label={labels.dashboard.activeInitiatives} value={String(data?.strategic_progress?.active_initiatives ?? 0)} />
            <Stat label={labels.dashboard.delayedInitiatives} value={String(data?.strategic_progress?.delayed_initiatives ?? 0)} />
          </section>
        </>
      )}

      <section className="flex flex-wrap gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={labels.filters.search} className="min-w-[12rem] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.priority}</option>
          {EXECUTIVE_COMPANION_PRIORITIES.map((p) => <option key={p} value={p}>{labels.priorityLevels[p]}</option>)}
        </select>
        <input value={focusCategory} onChange={(e) => setFocusCategory(e.target.value)} placeholder={labels.filters.focusCategory} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input value={strategicArea} onChange={(e) => setStrategicArea(e.target.value)} placeholder={labels.filters.strategicArea} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input type="date" value={periodFrom} onChange={(e) => setPeriodFrom(e.target.value)} aria-label={labels.filters.periodFrom} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </section>

      {!empty && (data?.todays_priorities?.length ?? 0) > 0 ? (
        <PrioritySection title={labels.dashboard.todaysPriorities} items={data!.todays_priorities!} labels={labels} />
      ) : null}

      {!empty && (data?.items_requiring_attention?.length ?? 0) > 0 ? (
        <PrioritySection title={labels.dashboard.itemsAttention} items={data!.items_requiring_attention!} labels={labels} highlight />
      ) : null}

      {!empty && (data?.upcoming_responsibilities?.length ?? 0) > 0 ? (
        <PrioritySection title={labels.dashboard.upcomingResponsibilities} items={data!.upcoming_responsibilities!} labels={labels} />
      ) : null}

      {!empty && health ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.dashboard.organizationalHealth}</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-sm text-slate-700">
            <p>{labels.health.strategy}: {health.strategy_status}</p>
            <p>{labels.health.momentum}: {health.momentum_status} ({health.momentum_score ?? 0}/100)</p>
            <p>{labels.health.resilience}: {health.resilience_status} ({health.resilience_score ?? 0}/100)</p>
            <p>{labels.health.capacity}: {health.capacity_indicator}</p>
            <p>{labels.health.risk}: {health.risk_indicator}</p>
            <p>{labels.health.success}: {health.success_indicator}</p>
          </div>
        </section>
      ) : null}

      {!empty && (data?.meeting_preparation?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.meetingPrep.title}</h2>
          <ul className="mt-4 space-y-4">
            {data!.meeting_preparation!.map((m) => (
              <li key={m.id} className="rounded-xl border border-slate-100 p-4 text-sm">
                <p className="font-medium text-slate-900">{m.title}</p>
                <p className="mt-1 text-xs text-slate-500">{new Date(m.scheduled_at).toLocaleString()}</p>
                {m.preparation_topics.length > 0 ? (
                  <ul className="mt-2 list-disc pl-5 text-slate-600">
                    {m.preparation_topics.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {!empty && (data?.executive_memory?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.memory.title}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {data!.executive_memory!.map((m) => (
              <li key={m.id} className="flex justify-between gap-2">
                <span>{m.title} · {m.type === "decision" ? labels.memory.decision : labels.memory.commitment}</span>
                <span className="text-xs text-slate-500">{new Date(m.recorded_at).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {!empty && (data?.recommendations?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h2 className="font-semibold">{labels.dashboard.recommendedActions}</h2>
          <ul className="mt-3 space-y-2">
            {data!.recommendations!.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-800">
                <span>{labels.recommendations[r.key as keyof typeof labels.recommendations] ?? r.key}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLE[r.priority] ?? PRIORITY_STYLE.recommended}`}>
                  {labels.priorityLevels[r.priority as keyof typeof labels.priorityLevels] ?? r.priority}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {!empty && timeline.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.timeline.title}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {timeline.slice(0, 12).map((e) => (
              <li key={e.id} className="flex justify-between gap-2 border-b border-slate-100 pb-2">
                <span>{e.description}</span>
                <span className="text-xs text-slate-500">{new Date(e.created_at).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold">{labels.faq.title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div><dt className="font-medium">{labels.faq.whatIs}</dt><dd className="mt-1 text-slate-600">{labels.faq.whatIsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.makesDecisions}</dt><dd className="mt-1 text-slate-600">{labels.faq.makesDecisionsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.replaceLeadership}</dt><dd className="mt-1 text-slate-600">{labels.faq.replaceLeadershipAnswer}</dd></div>
        </dl>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function PrioritySection({
  title,
  items,
  labels,
  highlight,
}: {
  title: string;
  items: ExecutivePriority[];
  labels: ExecutiveCompanionLabels;
  highlight?: boolean;
}) {
  return (
    <section className={`rounded-2xl border p-5 shadow-sm ${highlight ? "border-amber-100 bg-amber-50/40" : "border-slate-200 bg-white"}`}>
      <h2 className="font-semibold">{title}</h2>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-800">
            <span>{item.title}</span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLE[item.priority] ?? PRIORITY_STYLE.recommended}`}>
              {labels.priorityLevels[item.priority as keyof typeof labels.priorityLevels] ?? item.priority}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
