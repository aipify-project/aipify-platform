"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseCustomerRelationshipCenter,
  type CrmCustomer,
  type CustomerRelationshipCenter,
  type CustomerRelationshipLabels,
} from "@/lib/customer-relationship";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";

type Tab = "overview" | "customers" | "contacts" | "organizations" | "leads" | "relationships" | "communication" | "documents" | "reports";

const STATUS_STYLE: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  prospect: "bg-sky-50 text-sky-900 ring-sky-200",
  requires_attention: "bg-amber-50 text-amber-900 ring-amber-200",
  restricted: "bg-violet-50 text-violet-800 ring-violet-200",
  inactive: "bg-gray-100 text-gray-600 ring-gray-200",
};

function CustomerRow({ customer, labels, busy, onFollowUp, onNote }: {
  customer: CrmCustomer;
  labels: CustomerRelationshipLabels;
  busy: boolean;
  onFollowUp: (id: string) => void;
  onNote: (id: string) => void;
}) {
  const display = customer.company_name || customer.name;
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs text-gray-500">{customer.customer_number ?? customer.id.slice(0, 8)}</p>
          <h3 className="font-semibold text-gray-900">{display}</h3>
          <p className="text-gray-500">{customer.email ?? "—"} · {customer.customer_type.replace(/_/g, " ")}</p>
          {customer.assigned_employee_name ? <p className="text-gray-500">{customer.assigned_employee_name}</p> : null}
        </div>
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_STYLE[customer.status] ?? STATUS_STYLE.prospect}`}>
          {customer.status.replace(/_/g, " ")}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" disabled={busy} onClick={() => onFollowUp(customer.id)} className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-800">{labels.followUpTask}</button>
        <button type="button" disabled={busy} onClick={() => onNote(customer.id)} className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-800">{labels.addNote}</button>
      </div>
    </div>
  );
}

type Props = { labels: CustomerRelationshipLabels };

export function CustomerRelationshipPanel({ labels }: Props) {
  const [center, setCenter] = useState<CustomerRelationshipCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("overview");
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Record<string, unknown> | null>(null);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/customer-relationship");
    if (res.ok) setCenter(parseCustomerRelationshipCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function runAction(action_type: string, payload: Record<string, unknown> = {}) {
    setBusy(true);
    await fetch("/api/app/customer-relationship/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type, payload }),
    });
    setBusy(false);
    await load();
  }

  async function runSearch(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/app/customer-relationship/search?q=${encodeURIComponent(search)}`);
    if (res.ok) setSearchResults(await res.json());
  }

  if (loading && !center) return <div className="flex min-h-[320px] items-center justify-center"><AipifyLoader centered /></div>;
  if (!center?.found) return <AipifyModuleAccessDenied message={labels.accessDenied} />;

  const overview = center.overview ?? {};
  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: labels.overview },
    { key: "customers", label: labels.customers },
    { key: "contacts", label: labels.contacts },
    { key: "organizations", label: labels.organizations },
    { key: "leads", label: labels.leads },
    { key: "relationships", label: labels.relationships },
    { key: "communication", label: labels.communication },
    { key: "documents", label: labels.documents },
    { key: "reports", label: labels.reports },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        {center.principle ? <p className="mt-2 text-sm font-medium text-violet-800">{center.principle}</p> : null}
        {center.routes?.leads ? <Link href={center.routes.leads} className="mt-2 inline-block text-sm text-indigo-700 hover:underline">{labels.leadsLink}</Link> : null}
      </div>

      <form className="flex gap-2" onSubmit={(e) => void runSearch(e)}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={labels.searchPlaceholder} className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <button type="submit" className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white">{labels.search}</button>
      </form>
      {searchResults?.found ? (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm">
          <p className="font-medium text-gray-900">{labels.search}: {String(searchResults.query ?? "")}</p>
          <p className="mt-1 text-gray-600">{(searchResults.customers as unknown[])?.length ?? 0} customers · {(searchResults.contacts as unknown[])?.length ?? 0} contacts · {(searchResults.leads as unknown[])?.length ?? 0} leads</p>
        </div>
      ) : null}

      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {([
          [labels.totalCustomers, overview.total_customers],
          [labels.activeCustomers, overview.active],
          [labels.prospects, overview.prospects],
          [labels.openLeads, overview.open_leads],
          [labels.followUpsDue, overview.follow_ups_due],
        ] as [string, unknown][]).map(([label, value]) => (
          <div key={label} className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
            <p className="mt-1 text-xl font-semibold text-gray-900">{String(value ?? "—")}</p>
          </div>
        ))}
      </div>

      <div className="-mx-1 flex gap-1 overflow-x-auto border-b border-gray-200 pb-2">
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => setTab(t.key)} className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium ${tab === t.key ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>{t.label}</button>
        ))}
      </div>

      {(tab === "customers" || tab === "overview") && (
        <form className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:flex-row" onSubmit={(e) => {
          e.preventDefault();
          void runAction("create_customer", { name, company_name: company, email, customer_type: "business", status: "prospect" });
          setName(""); setCompany(""); setEmail("");
        }}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder={labels.customerName} className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" required />
          <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder={labels.companyName} className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder={labels.email} className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <button type="submit" disabled={busy} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{labels.createCustomer}</button>
        </form>
      )}

      {(tab === "customers" || tab === "overview") && (
        <div className="grid gap-3 lg:grid-cols-2">
          {(center.customers ?? []).length === 0 ? (
            <PlatformEmptyState title={labels.noCustomers} message={labels.noCustomersHint} primaryAction={{ label: labels.createCustomer, onClick: () => setTab("customers") }} />
          ) : (
            (center.customers ?? []).slice(0, tab === "overview" ? 4 : 100).map((c) => (
              <CustomerRow
                key={c.id}
                customer={c}
                labels={labels}
                busy={busy}
                onFollowUp={(id) => void runAction("create_follow_up_task", { customer_id: id, title: "Follow up with customer" })}
                onNote={(id) => void runAction("add_note", { customer_id: id, title: "Customer note", summary: "Note added from Customer Center" })}
              />
            ))
          )}
        </div>
      )}

      {tab === "contacts" && (
        <div className="space-y-2">
          {(center.contacts ?? []).map((c, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 text-sm">
              <p className="font-medium text-gray-900">{String(c.full_name ?? "")}</p>
              <p className="text-gray-500">{String(c.customer_name ?? "")} · {String(c.contact_role ?? "")} · {String(c.email ?? "")}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "organizations" && (
        <div className="grid gap-3 lg:grid-cols-2">
          {(center.organizations ?? []).map((c) => (
            <CustomerRow key={c.id} customer={c} labels={labels} busy={busy} onFollowUp={(id) => void runAction("create_follow_up_task", { customer_id: id })} onNote={(id) => void runAction("add_note", { customer_id: id, title: "Note", summary: "" })} />
          ))}
        </div>
      )}

      {tab === "leads" && (
        <div className="space-y-2">
          {(center.leads ?? []).map((l, i) => (
            <div key={i} className="rounded-xl border border-sky-100 bg-white p-4 text-sm">
              <p className="font-medium text-gray-900">{String(l.company_name ?? "")}</p>
              <p className="text-gray-500">{String(l.status ?? "")} · {String(l.lead_source ?? "")} · follow-up {String(l.follow_up_date ?? "—")}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "relationships" && (
        <div className="space-y-2">
          {(center.timeline ?? []).map((e, i) => (
            <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm">
              <p className="font-medium text-gray-900">{String(e.title ?? "")}</p>
              <p className="text-gray-500">{String(e.customer_name ?? "")} · {String(e.event_type ?? "")} · {String(e.occurred_at ?? "")}</p>
              {e.summary ? <p className="mt-1 text-gray-600">{String(e.summary)}</p> : null}
            </div>
          ))}
        </div>
      )}

      {tab === "communication" && (
        <div className="space-y-2">
          {(center.communications ?? []).map((c, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 text-sm">
              <p className="font-medium text-gray-900">{String(c.subject ?? "")}</p>
              <p className="text-gray-500">{String(c.customer_name ?? "")} · {String(c.channel ?? "")}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "documents" && (
        <div className="space-y-2">
          {(center.documents ?? []).map((d, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 text-sm">
              <p className="font-medium text-gray-900">{String(d.title ?? "")}</p>
              <p className="text-gray-500">{String(d.customer_name ?? "")} · {String(d.document_type ?? "")}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "reports" && center.reports ? (
        <div className="rounded-xl border border-gray-200 bg-white p-5 text-sm space-y-2">
          {Object.entries(center.reports).map(([k, v]) => (
            <p key={k}><span className="font-medium capitalize">{k.replace(/_/g, " ")}:</span> {typeof v === "object" ? JSON.stringify(v) : String(v)}</p>
          ))}
        </div>
      ) : null}

      {center.companion_insights ? (
        <section>
          <h2 className="text-lg font-semibold text-gray-900">{labels.companionInsights}</h2>
          <pre className="mt-2 overflow-x-auto rounded-lg bg-violet-50 p-4 text-xs text-violet-900">{JSON.stringify(center.companion_insights, null, 2)}</pre>
        </section>
      ) : null}

      {center.audit_recent && center.audit_recent.length > 0 ? (
        <section>
          <h2 className="text-lg font-semibold text-gray-900">{labels.auditLog}</h2>
          <ul className="mt-3 space-y-2">
            {center.audit_recent.slice(0, 8).map((a, i) => (
              <li key={i} className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-2 text-sm"><p className="font-medium text-gray-900">{a.summary}</p></li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
