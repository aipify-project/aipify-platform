"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  groupEventsByTimeline,
  parseActivityHistory,
  type ActivityEvent,
  type ActivityEventType,
  type ActivityHistoryLabels,
  type ActivityHistoryResponse,
  type ActivitySeverity,
  type TimelineBucket,
} from "@/lib/app-portal/activity-history";

type Props = { labels: ActivityHistoryLabels };

const EVENT_TYPES: ActivityEventType[] = [
  "follow_up_created", "follow_up_completed", "decision_recorded", "decision_evaluated",
  "approval_requested", "approval_completed", "task_updated", "integration_connected",
  "business_pack_installed", "billing_event", "security_event", "support_event", "system_recommendation",
];
const SEVERITIES: ActivitySeverity[] = ["info", "notice", "important", "critical"];
const MODULES = [
  "follow_ups", "decision_center", "approvals", "tasks", "integrations",
  "business_packs", "billing", "security", "support", "system",
];

const SEV_STYLE: Record<ActivitySeverity, string> = {
  info: "border-slate-200 bg-white",
  notice: "border-sky-200 bg-sky-50/40",
  important: "border-amber-200 bg-amber-50/40",
  critical: "border-rose-200 bg-rose-50/40",
};

const ICON: Record<ActivityEventType, string> = {
  follow_up_created: "F",
  follow_up_completed: "C",
  decision_recorded: "D",
  decision_evaluated: "E",
  approval_requested: "A",
  approval_completed: "A",
  task_updated: "T",
  integration_connected: "I",
  business_pack_installed: "P",
  billing_event: "B",
  security_event: "S",
  support_event: "H",
  system_recommendation: "R",
};

const BUCKET_LABEL: Record<TimelineBucket, keyof ActivityHistoryLabels["timeline"]> = {
  today: "today",
  yesterday: "yesterday",
  this_week: "thisWeek",
  earlier: "earlier",
};

const BUCKET_ORDER: TimelineBucket[] = ["today", "yesterday", "this_week", "earlier"];

export function ActivityHistoryPanel({ labels }: Props) {
  const [data, setData] = useState<ActivityHistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [eventType, setEventType] = useState("");
  const [module, setModule] = useState("");
  const [severity, setSeverity] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (eventType) params.set("event_type", eventType);
    if (module) params.set("module", module);
    if (severity) params.set("severity", severity);
    if (dateFrom) params.set("date_from", dateFrom);
    if (dateTo) params.set("date_to", dateTo);
    if (search.trim()) params.set("search", search.trim());
    const res = await fetch(`/api/aipify/activity-history?${params}`);
    if (res.ok) setData(parseActivityHistory(await res.json()));
    setLoading(false);
  }, [eventType, module, severity, dateFrom, dateTo, search]);

  useEffect(() => {
    void load();
  }, [load]);

  const grouped = useMemo(
    () => groupEventsByTimeline(data?.items ?? []),
    [data?.items],
  );

  if (loading && !data) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" aria-hidden />
        <p className="mt-4 text-sm text-slate-600">{labels.loading}</p>
      </div>
    );
  }

  const items = data?.items ?? [];
  const hasItems = items.length > 0;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <Link href="/app" className="text-sm font-medium text-indigo-700 hover:underline">← APP Dashboard</Link>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">{labels.title}</h1>
        <p className="mt-2 text-slate-600">{labels.subtitle}</p>
        {data?.principle ? (
          <p className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-slate-800">{data.principle}</p>
        ) : null}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-slate-900">{labels.filters.title}</h2>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={labels.filters.searchPlaceholder}
            className="min-w-[200px] flex-1 rounded-lg border border-slate-200 px-3 py-1.5"
          />
          <select value={eventType} onChange={(e) => setEventType(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1">
            <option value="">{labels.filters.all} — {labels.filters.eventType}</option>
            {EVENT_TYPES.map((t) => <option key={t} value={t}>{labels.eventTypes[t]}</option>)}
          </select>
          <select value={module} onChange={(e) => setModule(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1">
            <option value="">{labels.filters.all} — {labels.filters.module}</option>
            {MODULES.map((m) => <option key={m} value={m}>{labels.modules[m] ?? m}</option>)}
          </select>
          <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1">
            <option value="">{labels.filters.all} — {labels.filters.severity}</option>
            {SEVERITIES.map((s) => <option key={s} value={s}>{labels.severities[s]}</option>)}
          </select>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1" aria-label={labels.filters.dateFrom} />
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1" aria-label={labels.filters.dateTo} />
        </div>
      </section>

      {!hasItems ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{labels.emptyTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{labels.emptyBody}</p>
        </section>
      ) : (
        BUCKET_ORDER.map((bucket) => {
          const bucketItems = grouped[bucket];
          if (bucketItems.length === 0) return null;
          return (
            <section key={bucket} className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{labels.timeline[BUCKET_LABEL[bucket]]}</h2>
              {bucketItems.map((item) => (
                <ActivityCard key={item.id} item={item} labels={labels} />
              ))}
            </section>
          );
        })
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold">{labels.faq.title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div><dt className="font-medium">{labels.faq.whatIs}</dt><dd className="mt-1 text-slate-600">{labels.faq.whatIsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.whoCanSee}</dt><dd className="mt-1 text-slate-600">{labels.faq.whoCanSeeAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.canDelete}</dt><dd className="mt-1 text-slate-600">{labels.faq.canDeleteAnswer}</dd></div>
        </dl>
      </section>
    </div>
  );
}

function ActivityCard({ item, labels }: { item: ActivityEvent; labels: ActivityHistoryLabels }) {
  const moduleLabel = labels.modules[item.module_source] ?? item.module_source;
  const inner = (
    <article className={`rounded-2xl border p-4 shadow-sm ${SEV_STYLE[item.severity]}`}>
      <div className="flex gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-sm font-semibold text-indigo-800" aria-hidden>
          {ICON[item.event_type]}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="font-semibold text-slate-900">{item.title}</h3>
            <time className="text-xs text-slate-500">{new Date(item.timestamp).toLocaleString()}</time>
          </div>
          <p className="mt-1 text-sm text-slate-600">{item.description}</p>
          <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
            <div><dt className="inline">{labels.card.user}: </dt><dd className="inline font-medium text-slate-700">{item.user_name}</dd></div>
            <div><dt className="inline">{labels.card.module}: </dt><dd className="inline font-medium text-slate-700">{moduleLabel}</dd></div>
            <div><dd className="inline">{labels.eventTypes[item.event_type]}</dd></div>
          </dl>
          {item.action_link ? (
            <p className="mt-2 text-xs font-medium text-indigo-700">{labels.card.viewRelated} →</p>
          ) : null}
        </div>
      </div>
    </article>
  );

  if (item.action_link) {
    return <Link href={item.action_link} className="block transition hover:opacity-90">{inner}</Link>;
  }
  return inner;
}
