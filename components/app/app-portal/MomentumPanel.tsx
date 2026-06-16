"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  MOMENTUM_PRIORITIES,
  MOMENTUM_STATUSES,
  MOMENTUM_TRENDS,
  parseMomentumOverview,
  parseMomentumTimeline,
  type MomentumInitiative,
  type MomentumLabels,
  type MomentumOverview,
  type MomentumStatus,
  type MomentumTimelineEvent,
  type MomentumTrend,
} from "@/lib/app-portal/momentum";

type Props = { labels: MomentumLabels };

const STATUS_STYLE: Record<MomentumStatus, string> = {
  accelerating: "bg-emerald-100 text-emerald-900",
  healthy: "bg-teal-100 text-teal-900",
  stable: "bg-blue-100 text-blue-900",
  slowing: "bg-amber-100 text-amber-950",
  stalled: "bg-red-100 text-red-900",
};

const TREND_STYLE: Record<MomentumTrend, string> = {
  improving: "text-emerald-700",
  stable: "text-slate-600",
  declining: "text-red-700",
};

const PRIORITY_STYLE: Record<string, string> = {
  opportunity: "bg-slate-100 text-slate-700",
  recommended: "bg-blue-100 text-blue-900",
  important: "bg-amber-100 text-amber-950",
  immediate_attention: "bg-red-100 text-red-900",
};

export function MomentumPanel({ labels }: Props) {
  const [data, setData] = useState<MomentumOverview | null>(null);
  const [timeline, setTimeline] = useState<MomentumTimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [momentumStatus, setMomentumStatus] = useState("");
  const [team, setTeam] = useState("");
  const [owner, setOwner] = useState("");
  const [trend, setTrend] = useState("");
  const [priority, setPriority] = useState("");
  const [periodFrom, setPeriodFrom] = useState("");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (momentumStatus) params.set("momentum_status", momentumStatus);
    if (team) params.set("team", team);
    if (owner) params.set("owner", owner);
    if (trend) params.set("trend", trend);
    if (priority) params.set("priority", priority);
    if (periodFrom) params.set("period_from", periodFrom);
    if (search.trim()) params.set("search", search.trim());
    const [overviewRes, timelineRes] = await Promise.all([
      fetch(`/api/aipify/momentum?${params}`),
      fetch(`/api/aipify/momentum/timeline?${periodFrom ? `period_from=${periodFrom}` : ""}`),
    ]);
    if (overviewRes.ok) {
      setData(parseMomentumOverview(await overviewRes.json()));
    } else {
      const body = (await overviewRes.json()) as { error?: string };
      setError(body.error ?? labels.accessDenied);
      setData(null);
    }
    if (timelineRes.ok) {
      const body = (await timelineRes.json()) as { timeline?: MomentumTimelineEvent[] };
      setTimeline(parseMomentumTimeline(body));
    }
    setLoading(false);
  }, [momentumStatus, team, owner, trend, priority, periodFrom, search, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function startReview() {
    setBusy(true);
    const res = await fetch("/api/aipify/momentum", { method: "POST" });
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

  const empty = !data?.review_started;
  const signals = data?.execution_signals;
  const initiatives = data?.initiatives ?? [];

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
          <button type="button" disabled={busy} onClick={() => void startReview()} className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">{labels.emptyCta}</button>
        </section>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label={labels.dashboard.momentumScore} value={`${data?.organizational_momentum_score ?? 0}/100`} />
            <Stat label={labels.dashboard.executionTrend} value={data?.execution_trend ? labels.trends[data.execution_trend] : "—"} />
            <Stat label={labels.dashboard.highMomentum} value={String(data?.high_momentum_initiatives?.length ?? 0)} />
            <Stat label={labels.dashboard.stalled} value={String(data?.stalled_initiatives?.length ?? 0)} />
          </section>

          <section className="grid gap-4 sm:grid-cols-3">
            <Stat label={labels.dashboard.slowing} value={String(data?.slowing_initiatives?.length ?? 0)} />
            <Stat label={labels.dashboard.openRecommendations} value={String(data?.recommendations?.length ?? 0)} />
            {data?.organizational_momentum_status ? (
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs text-slate-500">{labels.dashboard.momentumStatus}</p>
                <span className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[data.organizational_momentum_status]}`}>
                  {labels.statuses[data.organizational_momentum_status]}
                </span>
              </div>
            ) : null}
          </section>
        </>
      )}

      <section className="flex flex-wrap gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={labels.filters.search} className="min-w-[12rem] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={momentumStatus} onChange={(e) => setMomentumStatus(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.momentumStatus}</option>
          {MOMENTUM_STATUSES.map((s) => <option key={s} value={s}>{labels.statuses[s]}</option>)}
        </select>
        <input value={team} onChange={(e) => setTeam(e.target.value)} placeholder={labels.filters.team} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input value={owner} onChange={(e) => setOwner(e.target.value)} placeholder={labels.filters.owner} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={trend} onChange={(e) => setTrend(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.trend}</option>
          {MOMENTUM_TRENDS.map((t) => <option key={t} value={t}>{labels.trends[t]}</option>)}
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.priority}</option>
          {MOMENTUM_PRIORITIES.map((p) => <option key={p} value={p}>{labels.priorities[p]}</option>)}
        </select>
        <input type="date" value={periodFrom} onChange={(e) => setPeriodFrom(e.target.value)} aria-label={labels.filters.periodFrom} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </section>

      {!empty && signals ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.signals.title}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            <Signal label={labels.signals.goalProgress} value={signals.goal_progress} />
            <Signal label={labels.signals.followUpCompletion} value={signals.follow_up_completion} />
            <Signal label={labels.signals.commitmentFulfillment} value={signals.commitment_fulfillment} />
            <Signal label={labels.signals.decisionImplementation} value={signals.decision_implementation} />
            <Signal label={labels.signals.strategicMovement} value={signals.strategic_movement} />
            <Signal label={labels.signals.learningImplementation} value={signals.learning_implementation} />
            <Signal label={labels.signals.meetingActionCompletion} value={signals.meeting_action_completion} />
            <Signal label={labels.signals.successInitiativeProgress} value={signals.success_initiative_progress} />
          </div>
        </section>
      ) : null}

      {!empty && (data?.positive_momentum_signals?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5">
          <h2 className="font-semibold">{labels.dashboard.positiveSignals}</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            {data!.positive_momentum_signals!.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </section>
      ) : null}

      {!empty && (data?.teams_requiring_attention?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5">
          <h2 className="font-semibold">{labels.dashboard.teamsAttention}</h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {data!.teams_requiring_attention!.map((t) => (
              <li key={t} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-950">{t}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {!empty && (data?.recommendations?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h2 className="font-semibold">{labels.dashboard.openRecommendations}</h2>
          <ul className="mt-3 space-y-2">
            {data!.recommendations!.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-800">
                <span>{labels.recommendations[r.key as keyof typeof labels.recommendations] ?? r.key}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLE[r.priority] ?? PRIORITY_STYLE.recommended}`}>
                  {labels.priorities[r.priority as keyof typeof labels.priorities] ?? r.priority}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {!empty && (data?.bottlenecks?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.bottlenecks.title}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {data!.bottlenecks!.map((b) => (
              <li key={b.id}>{labels.bottleneckKeys[b.key as keyof typeof labels.bottleneckKeys] ?? b.key}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {!empty && initiatives.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.initiatives.title}</h2>
          <ul className="mt-4 space-y-4">
            {initiatives.slice(0, 12).map((item) => (
              <InitiativeRow key={item.id} item={item} labels={labels} />
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
          <div><dt className="font-medium">{labels.faq.howCalculated}</dt><dd className="mt-1 text-slate-600">{labels.faq.howCalculatedAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.autoIncrease}</dt><dd className="mt-1 text-slate-600">{labels.faq.autoIncreaseAnswer}</dd></div>
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

function Signal({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-slate-600"><span>{label}</span><span>{value}</span></div>
      <div className="mt-1 h-1.5 rounded-full bg-slate-100"><div className="h-1.5 rounded-full bg-indigo-600" style={{ width: `${Math.min(100, value)}%` }} /></div>
    </div>
  );
}

function InitiativeRow({ item, labels }: { item: MomentumInitiative; labels: MomentumLabels }) {
  const status = item.momentum_status as MomentumStatus;
  const trend = item.trend_direction as MomentumTrend;
  return (
    <li className="rounded-xl border border-slate-100 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-medium text-slate-900">{item.title}</p>
          <p className="mt-1 text-xs text-slate-500">{labels.initiatives.owner}: {item.initiative_owner}</p>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[status] ?? STATUS_STYLE.stable}`}>
          {labels.statuses[status] ?? status}
        </span>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3 text-xs text-slate-600">
        <span>{labels.initiatives.progress}: {item.progress_percent}%</span>
        <span className={TREND_STYLE[trend] ?? TREND_STYLE.stable}>{labels.initiatives.trend}: {labels.trends[trend] ?? trend}</span>
        <span>{labels.initiatives.activity}: {item.recent_activity_count}</span>
      </div>
      {item.blockers_identified.length > 0 ? (
        <p className="mt-2 text-xs text-amber-800">{labels.initiatives.blockers}: {item.blockers_identified.join("; ")}</p>
      ) : null}
      {item.next_milestone ? (
        <p className="mt-1 text-xs text-slate-500">{labels.initiatives.nextMilestone}: {item.next_milestone}</p>
      ) : null}
    </li>
  );
}
