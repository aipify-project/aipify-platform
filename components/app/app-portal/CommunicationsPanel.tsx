"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseCommunicationList,
  type AudienceType,
  type CommunicationListResponse,
  type CommunicationPriority,
  type CommunicationStatus,
  type CommunicationType,
  type CommunicationsLabels,
} from "@/lib/app-portal/communications";

type Props = { labels: CommunicationsLabels };

const TYPES: CommunicationType[] = [
  "company_announcement", "operational_update", "policy_update", "security_notice",
  "executive_message", "team_update", "maintenance_notification", "celebration_recognition",
  "emergency_communication", "custom_communication",
];
const STATUSES: CommunicationStatus[] = ["draft", "scheduled", "published", "expired", "archived"];
const PRIORITIES: CommunicationPriority[] = ["informational", "important", "high_priority", "critical"];
const AUDIENCES: AudienceType[] = [
  "entire_organization", "specific_departments", "administrators_only", "executives_only",
  "custom_groups", "individual_users",
];

const PRIORITY_STYLE: Record<CommunicationPriority, string> = {
  informational: "bg-slate-100 text-slate-700",
  important: "bg-blue-100 text-blue-900",
  high_priority: "bg-amber-100 text-amber-950",
  critical: "bg-rose-100 text-rose-900",
};

export function CommunicationsPanel({ labels }: Props) {
  const [data, setData] = useState<CommunicationListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [commType, setCommType] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [audience, setAudience] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formSummary, setFormSummary] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formType, setFormType] = useState<CommunicationType>("company_announcement");
  const [formAudience, setFormAudience] = useState<AudienceType>("entire_organization");
  const [formPriority, setFormPriority] = useState<CommunicationPriority>("informational");
  const [formRequiresAck, setFormRequiresAck] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (commType) params.set("communication_type", commType);
    if (status) params.set("status", status);
    if (priority) params.set("priority", priority);
    if (audience) params.set("audience_type", audience);
    if (search.trim()) params.set("search", search.trim());
    const res = await fetch(`/api/aipify/communications?${params}`);
    if (res.ok) setData(parseCommunicationList(await res.json()));
    setLoading(false);
  }, [commType, status, priority, audience, search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function createItem(publish = false) {
    if (!formTitle.trim()) return;
    const res = await fetch("/api/aipify/communications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formTitle,
        summary: formSummary,
        full_message: formMessage,
        communication_type: formType,
        audience_type: formAudience,
        priority: formPriority,
        requires_acknowledgement: formRequiresAck,
        publish_date: publish ? new Date().toISOString() : undefined,
      }),
    });
    if (res.ok) {
      const body = (await res.json()) as { communication?: { id?: string } };
      if (publish && body.communication?.id) {
        await fetch(`/api/aipify/communications/${body.communication.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "published", publish_date: new Date().toISOString() }),
        });
      }
      if (body.communication?.id) {
        window.location.href = `/app/organization/communications/${body.communication.id}`;
        return;
      }
      setShowForm(false);
      void load();
    }
  }

  if (loading && !data) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" aria-hidden />
        <p className="mt-4 text-sm text-slate-600">{labels.loading}</p>
      </div>
    );
  }

  const dash = data?.dashboard;
  const empty = (data?.items.length ?? 0) === 0 && !commType && !status && !search;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <Link href="/app" className="text-sm font-medium text-indigo-700 hover:underline">← APP Dashboard</Link>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">{labels.title}</h1>
        <p className="mt-2 text-slate-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-slate-800">{labels.principle}</p>
      </div>

      {dash ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Stat label={labels.dashboard.active} value={dash.active} />
          <Stat label={labels.dashboard.scheduled} value={dash.scheduled} />
          <Stat label={labels.dashboard.critical} value={dash.critical} />
          <Stat label={labels.dashboard.expiring} value={dash.expiring} />
          <Stat label={labels.dashboard.drafts} value={dash.drafts} />
        </section>
      ) : null}

      {dash && dash.recently_published.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-900">{labels.dashboard.recentlyPublished}</p>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            {dash.recently_published.map((c) => (
              <li key={c.id}>
                <Link href={`/app/organization/communications/${c.id}`} className="text-indigo-700 hover:underline">{c.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="flex flex-wrap gap-3">
        <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={labels.filters.search} className="min-w-[200px] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={commType} onChange={(e) => setCommType(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.type}</option>
          {TYPES.map((t) => <option key={t} value={t}>{labels.types[t]}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.status}</option>
          {STATUSES.map((s) => <option key={s} value={s}>{labels.statuses[s]}</option>)}
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.priority}</option>
          {PRIORITIES.map((p) => <option key={p} value={p}>{labels.priorities[p]}</option>)}
        </select>
        <select value={audience} onChange={(e) => setAudience(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.audience}</option>
          {AUDIENCES.map((a) => <option key={a} value={a}>{labels.audiences[a]}</option>)}
        </select>
        {data?.can_manage ? (
          <button type="button" onClick={() => setShowForm(true)} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">{labels.emptyCta}</button>
        ) : null}
      </section>

      {showForm ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold">{labels.form.createTitle}</h2>
          <input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder={labels.form.title} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <textarea value={formSummary} onChange={(e) => setFormSummary(e.target.value)} placeholder={labels.form.summary} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <textarea value={formMessage} onChange={(e) => setFormMessage(e.target.value)} placeholder={labels.form.message} rows={4} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <div className="flex flex-wrap gap-3">
            <select value={formType} onChange={(e) => setFormType(e.target.value as CommunicationType)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
              {TYPES.map((t) => <option key={t} value={t}>{labels.types[t]}</option>)}
            </select>
            <select value={formAudience} onChange={(e) => setFormAudience(e.target.value as AudienceType)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
              {AUDIENCES.map((a) => <option key={a} value={a}>{labels.audiences[a]}</option>)}
            </select>
            <select value={formPriority} onChange={(e) => setFormPriority(e.target.value as CommunicationPriority)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
              {PRIORITIES.map((p) => <option key={p} value={p}>{labels.priorities[p]}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={formRequiresAck} onChange={(e) => setFormRequiresAck(e.target.checked)} />
            {labels.form.requiresAck}
          </label>
          <div className="flex gap-2">
            <button type="button" onClick={() => void createItem(false)} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">{labels.form.submit}</button>
            <button type="button" onClick={() => void createItem(true)} className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-800">{labels.form.publish}</button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm">{labels.form.cancel}</button>
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
        <ul className="space-y-3">
          {data?.items.map((item) => (
            <li key={item.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link href={`/app/organization/communications/${item.id}`} className="font-medium text-slate-900 hover:text-indigo-700">{item.title}</Link>
                  <p className="mt-1 text-xs text-slate-500">{labels.types[item.communication_type]} · {labels.statuses[item.status]}</p>
                  {item.summary ? <p className="mt-2 text-sm text-slate-600 line-clamp-2">{item.summary}</p> : null}
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${PRIORITY_STYLE[item.priority]}`}>{labels.priorities[item.priority]}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">
                <span>{labels.card.author}: {item.author_name}</span>
                <span>{labels.card.audience}: {labels.audiences[item.audience_type]}</span>
                {item.publish_date ? <span>{labels.card.publishDate}: {new Date(item.publish_date).toLocaleDateString()}</span> : null}
                {item.user_acknowledged ? <span>{labels.card.acknowledged}</span> : item.requires_acknowledgement && item.status === "published" ? <span>{labels.card.pending}</span> : null}
              </div>
            </li>
          ))}
        </ul>
      )}

      {(data?.recommendations?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <ul className="space-y-2 text-sm text-slate-700">
            {data!.recommendations!.map((r) => (
              <li key={r.id}>{labels.recommendations[r.key as keyof typeof labels.recommendations] ?? r.key}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold">{labels.faq.title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div><dt className="font-medium">{labels.faq.whatIs}</dt><dd className="mt-1 text-slate-600">{labels.faq.whatIsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.acknowledgements}</dt><dd className="mt-1 text-slate-600">{labels.faq.acknowledgementsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.autoCommunicate}</dt><dd className="mt-1 text-slate-600">{labels.faq.autoCommunicateAnswer}</dd></div>
        </dl>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
