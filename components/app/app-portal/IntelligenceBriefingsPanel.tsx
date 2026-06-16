"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  BRIEFING_PRIORITIES,
  BRIEFING_TYPES,
  ORG_STATUSES,
  parseBriefingList,
  type BriefingListResponse,
  type BriefingPriority,
  type BriefingType,
  type IntelligenceBriefingsLabels,
  type OrgStatus,
} from "@/lib/app-portal/intelligence-briefings";

type Props = { labels: IntelligenceBriefingsLabels };

const PRIORITY_STYLE: Record<BriefingPriority, string> = {
  informational: "bg-slate-100 text-slate-700",
  important: "bg-blue-100 text-blue-900",
  high_priority: "bg-amber-100 text-amber-950",
  critical_attention_required: "bg-red-100 text-red-900",
};

const STATUS_STYLE: Record<OrgStatus, string> = {
  stable: "bg-emerald-100 text-emerald-900",
  improving: "bg-teal-100 text-teal-900",
  requires_attention: "bg-amber-100 text-amber-950",
  elevated_risk: "bg-red-100 text-red-900",
};

export function IntelligenceBriefingsPanel({ labels }: Props) {
  const [data, setData] = useState<BriefingListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [briefingType, setBriefingType] = useState("");
  const [priority, setPriority] = useState("");
  const [orgStatus, setOrgStatus] = useState("");
  const [audience, setAudience] = useState("");
  const [periodFrom, setPeriodFrom] = useState("");
  const [periodTo, setPeriodTo] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<BriefingType>("executive_briefing");
  const [formAudience, setFormAudience] = useState("leadership");
  const [formNotes, setFormNotes] = useState("");
  const [generating, setGenerating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (briefingType) params.set("briefing_type", briefingType);
    if (priority) params.set("priority_level", priority);
    if (orgStatus) params.set("org_status", orgStatus);
    if (audience.trim()) params.set("audience", audience.trim());
    if (periodFrom) params.set("period_from", periodFrom);
    if (periodTo) params.set("period_to", periodTo);
    if (search.trim()) params.set("search", search.trim());
    const res = await fetch(`/api/aipify/briefings?${params}`);
    if (res.ok) {
      setData(parseBriefingList(await res.json()));
    } else {
      const body = (await res.json()) as { error?: string };
      setError(body.error ?? labels.accessDenied);
      setData(null);
    }
    setLoading(false);
  }, [briefingType, priority, orgStatus, audience, periodFrom, periodTo, search, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function generateBriefing() {
    setGenerating(true);
    const res = await fetch("/api/aipify/briefings/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ briefing_type: formType, audience: formAudience, notes: formNotes }),
    });
    setGenerating(false);
    if (res.ok) {
      const body = (await res.json()) as { briefing?: { id?: string } };
      if (body.briefing?.id) {
        window.location.href = `/app/operations/briefings/${body.briefing.id}`;
        return;
      }
      setShowForm(false);
      void load();
    }
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

  const dash = data?.dashboard;
  const empty = (data?.items.length ?? 0) === 0 && !briefingType && !search;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <Link href="/app" className="text-sm font-medium text-indigo-700 hover:underline">← APP Dashboard</Link>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">{labels.title}</h1>
        <p className="mt-2 text-slate-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-slate-800">{labels.principle}</p>
      </div>

      {dash?.latest_briefing ? (
        <section className="rounded-2xl border border-indigo-200 bg-indigo-50/30 p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-indigo-700">{labels.dashboard.latest}</p>
          <Link href={`/app/operations/briefings/${dash.latest_briefing.id}`} className="mt-2 block">
            <h2 className="text-lg font-semibold text-slate-900 hover:text-indigo-700">{dash.latest_briefing.title}</h2>
            <p className="mt-2 text-sm text-slate-700 whitespace-pre-line">{dash.latest_briefing.executive_summary}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge className={PRIORITY_STYLE[dash.latest_briefing.priority_level]}>{labels.priorities[dash.latest_briefing.priority_level]}</Badge>
              <Badge className={STATUS_STYLE[dash.latest_briefing.org_status]}>{labels.orgStatuses[dash.latest_briefing.org_status]}</Badge>
            </div>
          </Link>
        </section>
      ) : null}

      <section className="flex flex-wrap gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={labels.filters.search} className="min-w-[12rem] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={briefingType} onChange={(e) => setBriefingType(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.type}</option>
          {BRIEFING_TYPES.map((t) => <option key={t} value={t}>{labels.types[t]}</option>)}
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.priority}</option>
          {BRIEFING_PRIORITIES.map((p) => <option key={p} value={p}>{labels.priorities[p]}</option>)}
        </select>
        <select value={orgStatus} onChange={(e) => setOrgStatus(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.orgStatus}</option>
          {ORG_STATUSES.map((s) => <option key={s} value={s}>{labels.orgStatuses[s]}</option>)}
        </select>
        <input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder={labels.filters.audience} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input type="date" value={periodFrom} onChange={(e) => setPeriodFrom(e.target.value)} aria-label={labels.filters.periodFrom} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input type="date" value={periodTo} onChange={(e) => setPeriodTo(e.target.value)} aria-label={labels.filters.periodTo} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        {data?.can_manage ? (
          <button type="button" onClick={() => setShowForm(true)} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">{labels.emptyCta}</button>
        ) : null}
      </section>

      {showForm ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold">{labels.generate.title}</h2>
          <select value={formType} onChange={(e) => setFormType(e.target.value as BriefingType)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
            {BRIEFING_TYPES.map((t) => <option key={t} value={t}>{labels.types[t]}</option>)}
          </select>
          <input value={formAudience} onChange={(e) => setFormAudience(e.target.value)} placeholder={labels.generate.audience} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <textarea value={formNotes} onChange={(e) => setFormNotes(e.target.value)} placeholder={labels.generate.notes} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <div className="flex gap-2">
            <button type="button" disabled={generating} onClick={() => void generateBriefing()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">{labels.generate.submit}</button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm">{labels.generate.cancel}</button>
          </div>
        </section>
      ) : null}

      {empty ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{labels.emptyTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{labels.emptyBody}</p>
          {data?.can_manage ? (
            <button type="button" onClick={() => setShowForm(true)} className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white">{labels.emptyCta}</button>
          ) : null}
        </section>
      ) : (
        <section className="grid gap-3">
          {data?.items.map((item) => (
            <Link key={item.id} href={`/app/operations/briefings/${item.id}`} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-indigo-200">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="font-medium text-slate-900">{item.title}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge className={PRIORITY_STYLE[item.priority_level]}>{labels.priorities[item.priority_level]}</Badge>
                  <Badge className={STATUS_STYLE[item.org_status]}>{labels.orgStatuses[item.org_status]}</Badge>
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-600 line-clamp-2">{item.executive_summary}</p>
              <p className="mt-2 text-xs text-slate-500">
                {labels.types[item.briefing_type]} · {new Date(item.generated_at).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </section>
      )}

      {(dash?.priority_items.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5">
          <p className="text-sm font-medium text-slate-900">{labels.dashboard.priorityItems}</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            {dash!.priority_items.map((p) => <li key={p.id}>{p.title}</li>)}
          </ul>
        </section>
      ) : null}

      {(data?.recommendations?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <p className="text-sm font-medium text-slate-900">{labels.detail.recommendations}</p>
          <ul className="mt-2 space-y-2 text-sm text-slate-700">
            {data!.recommendations!.map((r) => (
              <li key={r.id}>{labels.recommendations[r.key] ?? r.key}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold">{labels.faq.title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div><dt className="font-medium">{labels.faq.whatIs}</dt><dd className="mt-1 text-slate-600">{labels.faq.whatIsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.howCreated}</dt><dd className="mt-1 text-slate-600">{labels.faq.howCreatedAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.autoDecisions}</dt><dd className="mt-1 text-slate-600">{labels.faq.autoDecisionsAnswer}</dd></div>
        </dl>
      </section>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className: string }) {
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>{children}</span>;
}
