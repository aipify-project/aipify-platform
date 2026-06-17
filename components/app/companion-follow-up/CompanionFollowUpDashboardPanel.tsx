"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  parseFollowUpDashboard,
  parseFollowUpList,
  parseFollowUpWaiting,
  type CompanionFollowUpLabels,
  type FollowUpDashboard,
  type FollowUpItem,
} from "@/lib/aipify/companion-follow-up";

type Props = { labels: CompanionFollowUpLabels };

export function CompanionFollowUpDashboardPanel({ labels }: Props) {
  const [data, setData] = useState<FollowUpDashboard | null>(null);
  const [openItems, setOpenItems] = useState<FollowUpItem[]>([]);
  const [overdueItems, setOverdueItems] = useState<FollowUpItem[]>([]);
  const [waitingOnOthers, setWaitingOnOthers] = useState<FollowUpItem[]>([]);
  const [waitingForMe, setWaitingForMe] = useState<FollowUpItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [owner, setOwner] = useState("");
  const [department, setDepartment] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const p = new URLSearchParams();
    if (status) p.set("status", status);
    if (priority) p.set("priority", priority);
    if (owner) p.set("owner", owner);
    if (department) p.set("department", department);
    if (category) p.set("category", category);
    if (search.trim()) p.set("search", search.trim());

    const [dashRes, openRes, overdueRes, waitingRes] = await Promise.all([
      fetch(`/api/aipify/follow-ups?${p}`),
      fetch("/api/aipify/follow-ups/open"),
      fetch("/api/aipify/follow-ups/overdue"),
      fetch("/api/aipify/follow-ups/waiting"),
    ]);

    if (dashRes.ok) {
      setData(parseFollowUpDashboard(await dashRes.json()));
    } else {
      const b = (await dashRes.json()) as { error?: string };
      setError(b.error ?? labels.accessDenied);
      setData(null);
    }
    if (openRes.ok) setOpenItems(parseFollowUpList(await openRes.json()).items);
    if (overdueRes.ok) setOverdueItems(parseFollowUpList(await overdueRes.json()).items);
    if (waitingRes.ok) {
      const w = parseFollowUpWaiting(await waitingRes.json());
      setWaitingOnOthers(w.waiting_on_others);
      setWaitingForMe(w.waiting_for_me);
    }
    setLoading(false);
  }, [status, priority, owner, department, category, search, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function updateFollowUp(id: string, action: string, reminderType?: string) {
    setActing(id);
    await fetch(`/api/aipify/follow-ups/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        ...(reminderType ? { reminder_type: reminderType } : {}),
      }),
    });
    setActing(null);
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

  const items = data?.items ?? [];
  const needsAttention = items.filter((i) => i.status !== "completed" && i.status !== "archived");
  const empty = needsAttention.length === 0 && (data?.completed_count ?? 0) === 0;
  const upcomingItems = items.filter((i) =>
    i.due_date && i.status !== "completed" && i.status !== "archived" && i.status !== "overdue",
  );
  const completedItems = items.filter((i) => i.status === "completed");

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
            <ScoreCard label={labels.dashboard.healthScore} value={data?.follow_up_health_score ?? 0} />
            <ScoreCard label={labels.dashboard.openFollowUps} value={data?.open_count ?? openItems.length} />
            <ScoreCard label={labels.dashboard.overdueFollowUps} value={data?.overdue_count ?? overdueItems.length} />
            <ScoreCard label={labels.dashboard.upcomingFollowUps} value={data?.upcoming_count ?? upcomingItems.length} />
            <ScoreCard label={labels.dashboard.completedFollowUps} value={data?.completed_count ?? completedItems.length} />
            <ScoreCard label={labels.dashboard.successRate} text={`${data?.success_rate ?? 0}%`} />
          </section>
        </>
      )}

      {!empty && overdueItems.length > 0 ? (
        <Section title={labels.sections.overdueFollowUps}>
          <div className="grid gap-3 lg:grid-cols-2">
            {overdueItems.map((item) => (
              <FollowUpCard key={item.id} item={item} labels={labels} acting={acting} onAction={updateFollowUp} />
            ))}
          </div>
        </Section>
      ) : null}

      {!empty && openItems.length > 0 ? (
        <Section title={labels.sections.openFollowUps}>
          <div className="grid gap-3 lg:grid-cols-2">
            {openItems.map((item) => (
              <FollowUpCard key={item.id} item={item} labels={labels} acting={acting} onAction={updateFollowUp} />
            ))}
          </div>
        </Section>
      ) : null}

      {!empty && waitingOnOthers.length > 0 ? (
        <Section title={labels.sections.waitingOnOthers}>
          <div className="grid gap-3 lg:grid-cols-2">
            {waitingOnOthers.map((item) => (
              <FollowUpCard key={item.id} item={item} labels={labels} acting={acting} onAction={updateFollowUp} />
            ))}
          </div>
        </Section>
      ) : null}

      {!empty && waitingForMe.length > 0 ? (
        <Section title={labels.sections.waitingForMe}>
          <div className="grid gap-3 lg:grid-cols-2">
            {waitingForMe.map((item) => (
              <FollowUpCard key={item.id} item={item} labels={labels} acting={acting} onAction={updateFollowUp} />
            ))}
          </div>
        </Section>
      ) : null}

      {!empty && upcomingItems.length > 0 ? (
        <Section title={labels.sections.upcomingFollowUps}>
          <div className="grid gap-3 lg:grid-cols-2">
            {upcomingItems.slice(0, 6).map((item) => (
              <FollowUpCard key={item.id} item={item} labels={labels} acting={acting} onAction={updateFollowUp} />
            ))}
          </div>
        </Section>
      ) : null}

      {!empty && completedItems.length > 0 ? (
        <Section title={labels.sections.completedFollowUps}>
          <div className="grid gap-3 lg:grid-cols-2">
            {completedItems.map((item) => (
              <FollowUpCard key={item.id} item={item} labels={labels} acting={acting} onAction={updateFollowUp} />
            ))}
          </div>
        </Section>
      ) : null}

      {!empty && items.length > 0 ? (
        <Section title={labels.sections.allFollowUps}>
          <div className="grid gap-3 lg:grid-cols-2">
            {items.map((item) => (
              <FollowUpCard key={item.id} item={item} labels={labels} acting={acting} onAction={updateFollowUp} />
            ))}
          </div>
        </Section>
      ) : null}

      <section className="flex flex-wrap gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder={labels.filters.search}
          className="min-w-[12rem] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={status} onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.all}</option>
          {(["open", "pending", "waiting", "overdue", "completed"] as const).map((s) => (
            <option key={s} value={s}>{labels.statuses[s]}</option>
          ))}
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.priority}</option>
          {(["critical", "high", "medium", "low"] as const).map((p) => (
            <option key={p} value={p}>{labels.priorities[p]}</option>
          ))}
        </select>
        <input value={owner} onChange={(e) => setOwner(e.target.value)}
          placeholder={labels.filters.owner}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input value={department} onChange={(e) => setDepartment(e.target.value)}
          placeholder={labels.filters.department}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={category} onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.category}</option>
          {Object.entries(labels.categories).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
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
          <div><dt className="font-medium">{labels.faq.reminders}</dt><dd className="mt-1 text-slate-600">{labels.faq.remindersAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.whyImportant}</dt><dd className="mt-1 text-slate-600">{labels.faq.whyImportantAnswer}</dd></div>
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

function FollowUpCard({
  item,
  labels,
  acting,
  onAction,
}: {
  item: FollowUpItem;
  labels: CompanionFollowUpLabels;
  acting: string | null;
  onAction: (id: string, action: string, reminderType?: string) => Promise<void>;
}) {
  const busy = acting === item.id;
  return (
    <article className="rounded-lg border border-slate-100 p-4 text-sm">
      <h3 className="font-medium text-slate-900">{item.title}</h3>
      <p className="mt-1 text-slate-600">{item.description}</p>
      {item.explanation ? (
        <p className="mt-2 rounded-md bg-slate-50 px-3 py-2 text-slate-700">
          <span className="font-medium">{labels.card.explanation}: </span>{item.explanation}
        </p>
      ) : null}
      <dl className="mt-2 grid gap-1 text-xs text-slate-500">
        <div><dt className="inline">{labels.card.priority}: </dt>
          <dd className="inline">{labels.priorities[item.priority as keyof typeof labels.priorities] ?? item.priority}</dd></div>
        <div><dt className="inline">{labels.card.status}: </dt>
          <dd className="inline">{labels.statuses[item.status as keyof typeof labels.statuses] ?? item.status}</dd></div>
        {item.assigned_to ? (
          <div><dt className="inline">{labels.card.assignedTo}: </dt><dd className="inline">{item.assigned_to}</dd></div>
        ) : null}
        {item.due_date ? (
          <div><dt className="inline">{labels.card.dueDate}: </dt><dd className="inline">{item.due_date}</dd></div>
        ) : null}
      </dl>
      {item.status !== "completed" && item.status !== "archived" ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" disabled={busy} onClick={() => void onAction(item.id, "complete")}
            className="rounded-md bg-indigo-600 px-2.5 py-1 text-xs font-medium text-white disabled:opacity-50">
            {labels.actions.complete}
          </button>
          <button type="button" disabled={busy} onClick={() => void onAction(item.id, "postpone")}
            className="rounded-md border border-slate-200 px-2.5 py-1 text-xs disabled:opacity-50">
            {labels.actions.postpone}
          </button>
          <button type="button" disabled={busy} onClick={() => void onAction(item.id, "complete", "today")}
            className="rounded-md border border-indigo-200 px-2.5 py-1 text-xs text-indigo-800 disabled:opacity-50">
            {labels.actions.createReminder}
          </button>
          <button type="button" disabled={busy} onClick={() => void onAction(item.id, "archive")}
            className="rounded-md border border-slate-200 px-2.5 py-1 text-xs disabled:opacity-50">
            {labels.actions.archive}
          </button>
        </div>
      ) : null}
    </article>
  );
}
