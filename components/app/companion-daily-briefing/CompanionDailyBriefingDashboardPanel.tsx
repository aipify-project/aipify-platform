"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  parseDailyBriefingDashboard,
  type BriefingItem,
  type CompanionDailyBriefingLabels,
  type DailyBriefingDashboard,
} from "@/lib/aipify/companion-daily-briefing";

type Props = { labels: CompanionDailyBriefingLabels };

export function CompanionDailyBriefingDashboardPanel({ labels }: Props) {
  const [data, setData] = useState<DailyBriefingDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [priority, setPriority] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [generating, setGenerating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const p = new URLSearchParams();
    if (priority) p.set("priority", priority);
    if (department) p.set("department", department);
    if (status) p.set("status", status);
    if (search.trim()) p.set("search", search.trim());

    const res = await fetch(`/api/aipify/daily-briefing?${p}`);
    if (res.ok) {
      setData(parseDailyBriefingDashboard(await res.json()));
    } else {
      const b = (await res.json()) as { error?: string };
      setError(b.error ?? labels.accessDenied);
      setData(null);
    }
    setLoading(false);
  }, [priority, department, status, search, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function generate() {
    setGenerating(true);
    await fetch("/api/aipify/daily-briefing/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ force: true }),
    });
    setGenerating(false);
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

  const empty = !data?.has_briefing;
  const items = data?.items ?? [];
  const bySection = (s: string) => items.filter((i) => i.section === s);
  const now = new Date();

  return (
    <div className="space-y-8">
      <p className="rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-slate-800">{labels.principle}</p>
      {data?.privacy_note ? <p className="text-sm text-slate-600">{labels.privacyNote}</p> : null}

      {empty ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{labels.emptyTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{labels.emptyBody}</p>
          <button type="button" disabled={generating} onClick={() => void generate()}
            className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50">
            {labels.emptyCta}
          </button>
        </section>
      ) : (
        <>
          <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-indigo-700">{labels.header.dailyBriefing}</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900">{data?.greeting ?? labels.header.goodMorning}</h2>
            <p className="mt-2 text-sm text-slate-600">
              {now.toLocaleDateString()} · {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              {data?.role ? ` · ${labels.header.role}: ${data.role}` : ""}
            </p>
          </header>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <ScoreCard label={labels.dashboard.readinessScore} value={data?.readiness_score ?? 0} />
            <ScoreCard label={labels.dashboard.todaysFocus} text={labels.focusAreas[data?.todays_focus ?? "operations"] ?? data?.todays_focus} />
            <ScoreCard label={labels.dashboard.newInsights} value={data?.new_insights_count ?? 0} />
            <ScoreCard label={labels.dashboard.newRecommendations} value={data?.new_recommendations_count ?? 0} />
            <ScoreCard label={labels.dashboard.briefingMode} text={labels.briefingModes[data?.briefing_mode ?? "standard"] ?? data?.briefing_mode} />
            <ScoreCard label={labels.dashboard.outstandingTasks} value={bySection("priorities").length} />
          </section>
        </>
      )}

      {!empty && data?.since_last_login ? (
        <Section title={labels.sections.sinceLastLogin}>
          <ul className="grid gap-2 sm:grid-cols-2 text-sm text-slate-700">
            {data.since_last_login.completed_tasks != null ? (
              <li>{labels.sinceLastLogin.completedTasks}: {data.since_last_login.completed_tasks}</li>
            ) : null}
            {data.since_last_login.new_notifications != null ? (
              <li>{labels.sinceLastLogin.newNotifications}: {data.since_last_login.new_notifications}</li>
            ) : null}
            {data.since_last_login.new_support_requests != null ? (
              <li>{labels.sinceLastLogin.newSupportRequests}: {data.since_last_login.new_support_requests}</li>
            ) : null}
            {data.since_last_login.new_approvals != null ? (
              <li>{labels.sinceLastLogin.newApprovals}: {data.since_last_login.new_approvals}</li>
            ) : null}
          </ul>
          {data.since_last_login.important_activity ? (
            <p className="mt-3 text-sm text-indigo-800">{data.since_last_login.important_activity}</p>
          ) : null}
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {bySection("since_last_login").map((item) => (
              <BriefingCard key={item.id} item={item} labels={labels} />
            ))}
          </div>
        </Section>
      ) : null}

      {!empty && bySection("priorities").length > 0 ? (
        <Section title={labels.sections.priorities}>
          <div className="grid gap-3 lg:grid-cols-2">
            {bySection("priorities").map((item) => (
              <BriefingCard key={item.id} item={item} labels={labels} />
            ))}
          </div>
        </Section>
      ) : null}

      {!empty && bySection("calendar").length > 0 ? (
        <Section title={labels.sections.calendar}>
          <div className="grid gap-3 lg:grid-cols-2">
            {bySection("calendar").map((item) => (
              <BriefingCard key={item.id} item={item} labels={labels} />
            ))}
          </div>
        </Section>
      ) : null}

      {!empty && bySection("insights_recommendations").length > 0 ? (
        <Section title={labels.sections.insightsRecommendations}>
          <div className="grid gap-3 lg:grid-cols-2">
            {bySection("insights_recommendations").map((item) => (
              <BriefingCard key={item.id} item={item} labels={labels} />
            ))}
          </div>
        </Section>
      ) : null}

      {!empty && data?.executive_summary ? (
        <Section title={labels.sections.executiveSummary}>
          <p className="text-sm text-slate-700">{data.executive_summary}</p>
        </Section>
      ) : null}

      {!empty && (data?.focus_areas?.length ?? 0) > 0 ? (
        <Section title={labels.sections.focusAreas}>
          <div className="flex flex-wrap gap-2">
            {data!.focus_areas!.map((f) => (
              <span key={f.focus_key} className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm text-indigo-800">
                {f.focus_label} ({f.focus_score})
              </span>
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
          {(["critical", "high", "medium", "low"] as const).map((p) => (
            <option key={p} value={p}>{labels.priorities[p]}</option>
          ))}
        </select>
        <input value={department} onChange={(e) => setDepartment(e.target.value)}
          placeholder={labels.filters.department}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={status} onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.all}</option>
          {(["critical", "attention_required", "upcoming", "on_track", "completed"] as const).map((s) => (
            <option key={s} value={s}>{labels.statuses[s]}</option>
          ))}
        </select>
        <button type="button" disabled={generating} onClick={() => void generate()}
          className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-800 disabled:opacity-50">
          {labels.actions.generate}
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
          <div><dt className="font-medium">{labels.faq.howGenerated}</dt><dd className="mt-1 text-slate-600">{labels.faq.howGeneratedAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.customize}</dt><dd className="mt-1 text-slate-600">{labels.faq.customizeAnswer}</dd></div>
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

function BriefingCard({ item, labels }: { item: BriefingItem; labels: CompanionDailyBriefingLabels }) {
  return (
    <article className="rounded-lg border border-slate-100 p-4 text-sm">
      <h3 className="font-medium text-slate-900">{item.title}</h3>
      <p className="mt-1 text-slate-600">{item.description}</p>
      {item.recommended_action ? (
        <p className="mt-2 text-indigo-800"><span className="font-medium">{labels.card.recommendedAction}: </span>{item.recommended_action}</p>
      ) : null}
      <dl className="mt-2 grid gap-1 text-xs text-slate-500">
        <div><dt className="inline">{labels.card.priority}: </dt>
          <dd className="inline">{labels.priorities[item.priority as keyof typeof labels.priorities] ?? item.priority}</dd></div>
        <div><dt className="inline">{labels.card.status}: </dt>
          <dd className="inline">{labels.statuses[item.status_indicator as keyof typeof labels.statuses] ?? item.status_indicator}</dd></div>
        {item.due_date ? (
          <div><dt className="inline">{labels.card.dueDate}: </dt><dd className="inline">{item.due_date}</dd></div>
        ) : null}
      </dl>
    </article>
  );
}
