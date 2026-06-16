"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseExternalRelationshipList,
  type CriticalityLevel,
  type ExternalRelationshipListResponse,
  type ExternalRelationshipsLabels,
  type RelationshipStatus,
  type RelationshipType,
} from "@/lib/app-portal/external-relationships";

type Props = { labels: ExternalRelationshipsLabels };

const TYPES: RelationshipType[] = [
  "supplier", "strategic_partner", "technology_vendor", "consultant",
  "outsourcing_provider", "financial_institution", "legal_advisor",
  "insurance_provider", "service_provider", "custom",
];
const STATUSES: RelationshipStatus[] = ["active", "under_review", "pending_renewal", "suspended", "ended"];
const CRITICALITY: CriticalityLevel[] = ["low", "moderate", "high", "mission_critical"];

const CRIT_STYLE: Record<CriticalityLevel, string> = {
  low: "bg-slate-100 text-slate-700",
  moderate: "bg-blue-100 text-blue-900",
  high: "bg-amber-100 text-amber-950",
  mission_critical: "bg-rose-100 text-rose-900",
};

export function ExternalRelationshipsPanel({ labels }: Props) {
  const [data, setData] = useState<ExternalRelationshipListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [relType, setRelType] = useState("");
  const [status, setStatus] = useState("");
  const [criticality, setCriticality] = useState("");
  const [country, setCountry] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState<RelationshipType>("supplier");
  const [formContact, setFormContact] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formCountry, setFormCountry] = useState("");
  const [formCrit, setFormCrit] = useState<CriticalityLevel>("moderate");
  const [formNotes, setFormNotes] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (relType) params.set("relationship_type", relType);
    if (status) params.set("status", status);
    if (criticality) params.set("criticality", criticality);
    if (country.trim()) params.set("country", country.trim());
    if (search.trim()) params.set("search", search.trim());
    const res = await fetch(`/api/aipify/external-relationships?${params}`);
    if (res.ok) setData(parseExternalRelationshipList(await res.json()));
    setLoading(false);
  }, [relType, status, criticality, country, search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function createItem() {
    if (!formName.trim()) return;
    const res = await fetch("/api/aipify/external-relationships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        organization_name: formName,
        relationship_type: formType,
        primary_contact: formContact,
        email: formEmail,
        country: formCountry,
        criticality_level: formCrit,
        notes: formNotes,
      }),
    });
    if (res.ok) {
      const body = (await res.json()) as { relationship?: { id?: string } };
      if (body.relationship?.id) {
        window.location.href = `/app/organization/external-relationships/${body.relationship.id}`;
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
  const empty = (data?.items.length ?? 0) === 0 && !relType && !status && !search;

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
          <Stat label={labels.dashboard.upcomingRenewals} value={dash.upcoming_renewals} />
          <Stat label={labels.dashboard.critical} value={dash.critical} />
          <Stat label={labels.dashboard.needsReview} value={dash.needs_review} />
          <Stat label={labels.dashboard.withoutOwner} value={dash.without_owner} />
        </section>
      ) : null}

      {dash && dash.recently_updated.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-900">{labels.dashboard.recent}</p>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            {dash.recently_updated.map((r) => (
              <li key={r.id}>
                <Link href={`/app/organization/external-relationships/${r.id}`} className="text-indigo-700 hover:underline">{r.organization_name}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="flex flex-wrap gap-3">
        <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={labels.filters.search} className="min-w-[200px] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={relType} onChange={(e) => setRelType(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.type}</option>
          {TYPES.map((t) => <option key={t} value={t}>{labels.types[t]}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.status}</option>
          {STATUSES.map((s) => <option key={s} value={s}>{labels.statuses[s]}</option>)}
        </select>
        <select value={criticality} onChange={(e) => setCriticality(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.criticality}</option>
          {CRITICALITY.map((c) => <option key={c} value={c}>{labels.criticality[c]}</option>)}
        </select>
        <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder={labels.filters.country} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        {data?.can_manage ? (
          <button type="button" onClick={() => setShowForm(true)} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">{labels.emptyCta}</button>
        ) : null}
      </section>

      {showForm ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold">{labels.form.createTitle}</h2>
          <input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder={labels.form.organizationName} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <select value={formType} onChange={(e) => setFormType(e.target.value as RelationshipType)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            {TYPES.map((t) => <option key={t} value={t}>{labels.types[t]}</option>)}
          </select>
          <input value={formContact} onChange={(e) => setFormContact(e.target.value)} placeholder={labels.form.primaryContact} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <input value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder={labels.form.email} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <input value={formCountry} onChange={(e) => setFormCountry(e.target.value)} placeholder={labels.form.country} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <select value={formCrit} onChange={(e) => setFormCrit(e.target.value as CriticalityLevel)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            {CRITICALITY.map((c) => <option key={c} value={c}>{labels.criticality[c]}</option>)}
          </select>
          <textarea value={formNotes} onChange={(e) => setFormNotes(e.target.value)} placeholder={labels.form.notes} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <div className="flex gap-2">
            <button type="button" onClick={() => void createItem()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">{labels.form.submit}</button>
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
                  <Link href={`/app/organization/external-relationships/${item.id}`} className="font-medium text-slate-900 hover:text-indigo-700">{item.organization_name}</Link>
                  <p className="mt-1 text-xs text-slate-500">{labels.types[item.relationship_type]} · {labels.statuses[item.status]}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${CRIT_STYLE[item.criticality_level]}`}>{labels.criticality[item.criticality_level]}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">
                <span>{labels.card.owner}: {item.owner_name}</span>
                {item.primary_contact ? <span>{labels.card.contact}: {item.primary_contact}</span> : null}
                {item.country ? <span>{labels.card.country}: {item.country}</span> : null}
                {item.contract_end_date ? <span>{labels.card.contractEnd}: {item.contract_end_date}</span> : null}
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
          <div><dt className="font-medium">{labels.faq.owners}</dt><dd className="mt-1 text-slate-600">{labels.faq.ownersAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.autoManage}</dt><dd className="mt-1 text-slate-600">{labels.faq.autoManageAnswer}</dd></div>
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
