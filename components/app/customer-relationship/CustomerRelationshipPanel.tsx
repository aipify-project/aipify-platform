"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import {
  parseCustomerRelationshipCenter,
  type CrmCustomer,
  type CustomerRelationshipCenter,
  type CustomerRelationshipLabels,
  type CustomerRelationshipTab,
} from "@/lib/customer-relationship";

const STATUS_STYLE: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  prospect: "bg-sky-50 text-sky-900 ring-sky-200",
  requires_attention: "bg-amber-50 text-amber-900 ring-amber-200",
  at_risk: "bg-amber-50 text-amber-900 ring-amber-200",
  restricted: "bg-violet-50 text-violet-800 ring-violet-200",
  renewed: "bg-teal-50 text-teal-800 ring-teal-200",
  lost: "bg-rose-50 text-rose-800 ring-rose-200",
  inactive: "bg-gray-100 text-gray-600 ring-gray-200",
};

const HEALTH_STYLE: Record<string, string> = {
  healthy: "text-emerald-700",
  needs_attention: "text-amber-700",
  at_risk: "text-rose-700",
};

function MetricCard({ label, value }: { label: string; value: unknown }) {
  return (
    <div className={`${AipifyShellClasses.surfaceCard} p-4`}>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-gray-900">{String(value ?? "—")}</p>
    </div>
  );
}

function CustomerRow({ customer, labels, busy, onFollowUp, onNote, onRefreshHealth }: {
  customer: CrmCustomer;
  labels: CustomerRelationshipLabels;
  busy: boolean;
  onFollowUp: (id: string) => void;
  onNote: (id: string) => void;
  onRefreshHealth: (id: string) => void;
}) {
  const display = customer.company_name || customer.name;
  return (
    <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs text-gray-500">{customer.customer_number ?? customer.id.slice(0, 8)}</p>
          <h3 className="font-semibold text-gray-900">{display}</h3>
          <p className="text-gray-500">{customer.email ?? "—"} · {customer.customer_type.replace(/_/g, " ")}</p>
          {customer.industry ? <p className="text-gray-500">{customer.industry}</p> : null}
          {customer.assigned_employee_name ? <p className="text-gray-500">{customer.assigned_employee_name}</p> : null}
          {customer.health_score != null ? (
            <p className={`mt-1 text-xs font-medium ${HEALTH_STYLE[customer.health_status ?? ""] ?? "text-gray-600"}`}>
              {labels.healthScore}: {customer.health_score}
            </p>
          ) : null}
        </div>
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_STYLE[customer.status] ?? STATUS_STYLE.prospect}`}>
          {customer.status.replace(/_/g, " ")}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" disabled={busy} onClick={() => onFollowUp(customer.id)} className={`${AipifyShellClasses.secondaryButton} px-3 py-1 text-xs`}>{labels.followUpTask}</button>
        <button type="button" disabled={busy} onClick={() => onNote(customer.id)} className={`${AipifyShellClasses.secondaryButton} px-3 py-1 text-xs`}>{labels.addNote}</button>
        <button type="button" disabled={busy} onClick={() => onRefreshHealth(customer.id)} className={`${AipifyShellClasses.secondaryButton} px-3 py-1 text-xs`}>{labels.refreshHealth}</button>
      </div>
    </div>
  );
}

type Props = {
  labels: CustomerRelationshipLabels;
  initialTab?: CustomerRelationshipTab;
  titleOverride?: string;
  visibleTabs?: CustomerRelationshipTab[];
};

export function CustomerRelationshipPanel({ labels, initialTab = "overview", titleOverride, visibleTabs }: Props) {
  const [center, setCenter] = useState<CustomerRelationshipCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<CustomerRelationshipTab>(initialTab);
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Record<string, unknown> | null>(null);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [oppName, setOppName] = useState("");
  const [oppValue, setOppValue] = useState("");
  const [contractTitle, setContractTitle] = useState("");

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

  const allTabs = useMemo(() => [
    { key: "overview" as const, label: labels.overview },
    { key: "prospects" as const, label: labels.prospects },
    { key: "customers" as const, label: labels.customers },
    { key: "organizations" as const, label: labels.organizations },
    { key: "contacts" as const, label: labels.contacts },
    { key: "opportunities" as const, label: labels.opportunities },
    { key: "activities" as const, label: labels.activities },
    { key: "renewals" as const, label: labels.renewals },
    { key: "contracts" as const, label: labels.contracts },
    { key: "leads" as const, label: labels.leads },
    { key: "communication" as const, label: labels.communication },
    { key: "reports" as const, label: labels.reports },
  ], [labels]);

  const tabs = visibleTabs ? allTabs.filter((t) => visibleTabs.includes(t.key)) : allTabs;

  if (loading && !center) return <div className="flex min-h-[320px] items-center justify-center"><AipifyLoader centered /></div>;
  if (!center?.found) return <AipifyModuleAccessDenied message={labels.accessDenied} />;

  const overview = center.overview ?? {};
  const routes = center.routes ?? {};
  const firstCustomerId = center.customers?.[0]?.id;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className={AipifyShellClasses.pageTitle}>{titleOverride ?? labels.title}</h1>
        <p className={AipifyShellClasses.pageSubtitle}>{labels.subtitle}</p>
        {center.principle ? <p className="mt-2 text-sm font-medium text-violet-800">{center.principle}</p> : null}
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          {routes.leads ? <Link href={routes.leads} className={AipifyShellClasses.link}>{labels.leadsLink}</Link> : null}
          {routes.opportunities ? <Link href={routes.opportunities} className={AipifyShellClasses.link}>{labels.opportunitiesLink}</Link> : null}
          {routes.contracts ? <Link href={routes.contracts} className={AipifyShellClasses.link}>{labels.contractsLink}</Link> : null}
          {titleOverride ? <Link href={routes.customers ?? "/app/customers"} className={AipifyShellClasses.link}>{labels.backToCustomers}</Link> : null}
        </div>
      </div>

      <form className="flex gap-2" onSubmit={(e) => void runSearch(e)}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={labels.searchPlaceholder} className={`flex-1 ${AipifyShellClasses.input}`} />
        <button type="submit" className={AipifyShellClasses.primaryButton}>{labels.search}</button>
      </form>
      {searchResults?.found ? (
        <div className={`${AipifyShellClasses.surfaceMuted} p-4 text-sm`}>
          <p className="font-medium text-gray-900">{labels.search}: {String(searchResults.query ?? "")}</p>
          <p className="mt-1 text-gray-600">{(searchResults.customers as unknown[])?.length ?? 0} customers · {(searchResults.contacts as unknown[])?.length ?? 0} contacts · {(searchResults.leads as unknown[])?.length ?? 0} leads</p>
        </div>
      ) : null}

      {(tab === "overview" || !visibleTabs) && (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          <MetricCard label={labels.totalCustomers} value={overview.total_customers} />
          <MetricCard label={labels.activeCustomers} value={overview.active} />
          <MetricCard label={labels.openOpportunities} value={overview.open_opportunities} />
          <MetricCard label={labels.renewalsDue} value={overview.renewals_due_90d} />
          <MetricCard label={labels.atRisk} value={overview.at_risk} />
        </div>
      )}

      <div className="-mx-1 flex gap-1 overflow-x-auto border-b border-gray-200 pb-2">
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => setTab(t.key)} className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium ${tab === t.key ? "bg-aipify-companion text-white" : "text-gray-600 hover:bg-gray-100"}`}>{t.label}</button>
        ))}
      </div>

      {(tab === "customers" || tab === "overview") && (
        <form className={`flex flex-col gap-2 ${AipifyShellClasses.surfaceMuted} p-4 sm:flex-row`} onSubmit={(e) => {
          e.preventDefault();
          void runAction("create_customer", { name, company_name: company, email, customer_type: "business", status: "prospect" });
          setName(""); setCompany(""); setEmail("");
        }}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder={labels.customerName} className={`flex-1 ${AipifyShellClasses.input}`} required />
          <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder={labels.companyName} className={`flex-1 ${AipifyShellClasses.input}`} />
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder={labels.email} className={`flex-1 ${AipifyShellClasses.input}`} />
          <button type="submit" disabled={busy} className={AipifyShellClasses.primaryButton}>{labels.createCustomer}</button>
        </form>
      )}

      {(tab === "customers" || tab === "overview") && (
        <div className="grid gap-3 lg:grid-cols-2">
          {(center.customers ?? []).length === 0 ? (
            <PlatformEmptyState title={labels.noCustomers} message={labels.noCustomersHint} primaryAction={{ label: labels.createCustomer, onClick: () => setTab("customers") }} />
          ) : (
            (center.customers ?? []).slice(0, tab === "overview" ? 4 : 100).map((c) => (
              <CustomerRow key={c.id} customer={c} labels={labels} busy={busy}
                onFollowUp={(id) => void runAction("create_follow_up_task", { customer_id: id, title: "Follow up with customer" })}
                onNote={(id) => void runAction("add_note", { customer_id: id, title: "Customer note", summary: "Note added from Customer Center" })}
                onRefreshHealth={(id) => void runAction("refresh_health_score", { customer_id: id })}
              />
            ))
          )}
        </div>
      )}

      {tab === "prospects" && (
        <div className="grid gap-3 lg:grid-cols-2">
          {(center.prospects ?? center.customers?.filter((c) => c.status === "prospect") ?? []).map((c) => (
            <CustomerRow key={c.id} customer={c} labels={labels} busy={busy}
              onFollowUp={(id) => void runAction("create_follow_up_task", { customer_id: id })}
              onNote={(id) => void runAction("add_note", { customer_id: id, title: "Note", summary: "" })}
              onRefreshHealth={(id) => void runAction("refresh_health_score", { customer_id: id })}
            />
          ))}
        </div>
      )}

      {tab === "contacts" && (
        <div className="space-y-2">
          {(center.contacts ?? []).map((c, i) => (
            <div key={i} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="font-medium text-gray-900">{String(c.full_name ?? "")}</p>
              <p className="text-gray-500">{String(c.customer_name ?? "")} · {String(c.contact_role ?? "")} · {String(c.email ?? "")}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "organizations" && (
        <div className="grid gap-3 lg:grid-cols-2">
          {(center.organizations ?? []).map((c) => (
            <CustomerRow key={c.id} customer={c} labels={labels} busy={busy}
              onFollowUp={(id) => void runAction("create_follow_up_task", { customer_id: id })}
              onNote={(id) => void runAction("add_note", { customer_id: id, title: "Note", summary: "" })}
              onRefreshHealth={(id) => void runAction("refresh_health_score", { customer_id: id })}
            />
          ))}
        </div>
      )}

      {tab === "leads" && (
        <div className="space-y-2">
          {(center.leads ?? []).map((l, i) => (
            <div key={i} className={`${AipifyShellClasses.surfaceCard} border-sky-100 p-4 text-sm`}>
              <p className="font-medium text-gray-900">{String(l.company_name ?? "")}</p>
              <p className="text-gray-500">{String(l.status ?? "")} · {String(l.lead_source ?? "")} · follow-up {String(l.follow_up_date ?? "—")}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "opportunities" && (
        <>
          <form className={`flex flex-col gap-2 ${AipifyShellClasses.surfaceMuted} p-4 sm:flex-row`} onSubmit={(e) => {
            e.preventDefault();
            if (!firstCustomerId) return;
            void runAction("create_opportunity", { customer_id: firstCustomerId, name: oppName, value: oppValue, stage: "lead" });
            setOppName(""); setOppValue("");
          }}>
            <input value={oppName} onChange={(e) => setOppName(e.target.value)} placeholder={labels.opportunityName} className={`flex-1 ${AipifyShellClasses.input}`} required />
            <input value={oppValue} onChange={(e) => setOppValue(e.target.value)} placeholder={labels.value} className={`w-32 ${AipifyShellClasses.input}`} />
            <button type="submit" disabled={busy || !firstCustomerId} className={AipifyShellClasses.primaryButton}>{labels.createOpportunity}</button>
          </form>
          <div className="space-y-2">
            {(center.opportunities ?? []).length === 0 ? (
              <PlatformEmptyState title={labels.noOpportunities} message={labels.noCustomersHint} />
            ) : (
              (center.opportunities ?? []).map((o, i) => (
                <div key={i} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                  <p className="font-medium text-gray-900">{String(o.name ?? "")}</p>
                  <p className="text-gray-500">{String(o.customer_name ?? "")} · {String(o.stage ?? "")} · {String(o.value ?? "—")}</p>
                </div>
              ))
            )}
          </div>
          {center.pipeline ? (
            <div className={`${AipifyShellClasses.surfaceMuted} p-4 text-sm`}>
              <p className="font-medium text-gray-900">{labels.pipeline}</p>
              <div className="mt-2 flex flex-wrap gap-3">
                {Object.entries(center.pipeline).map(([k, v]) => (
                  <span key={k} className="text-gray-600 capitalize">{k.replace(/_/g, " ")}: {String(v)}</span>
                ))}
              </div>
            </div>
          ) : null}
        </>
      )}

      {(tab === "activities" || tab === "relationships") && (
        <div className="space-y-2">
          {(center.activities ?? center.timeline ?? []).map((e, i) => (
            <div key={i} className={`${AipifyShellClasses.surfaceMuted} p-4 text-sm`}>
              <p className="font-medium text-gray-900">{String(e.title ?? "")}</p>
              <p className="text-gray-500">{String(e.customer_name ?? "")} · {String(e.event_type ?? "")} · {String(e.occurred_at ?? "")}</p>
              {e.summary ? <p className="mt-1 text-gray-600">{String(e.summary)}</p> : null}
            </div>
          ))}
        </div>
      )}

      {tab === "renewals" && (
        <div className="space-y-2">
          {(center.renewals ?? []).length === 0 ? (
            <PlatformEmptyState title={labels.noRenewals} message={labels.noCustomersHint} primaryAction={firstCustomerId ? { label: labels.triggerRenewal, onClick: () => void runAction("trigger_renewal", { customer_id: firstCustomerId }) } : undefined} />
          ) : (
            (center.renewals ?? []).map((r, i) => (
              <div key={i} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <p className="font-medium text-gray-900">{String(r.customer_name ?? "")}</p>
                <p className="text-gray-500">{String(r.renewal_type ?? "")} · due {String(r.due_date ?? "—")} · {String(r.status ?? "")}</p>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "contracts" && (
        <>
          <form className={`flex flex-col gap-2 ${AipifyShellClasses.surfaceMuted} p-4 sm:flex-row`} onSubmit={(e) => {
            e.preventDefault();
            if (!firstCustomerId) return;
            void runAction("create_contract", { customer_id: firstCustomerId, title: contractTitle });
            setContractTitle("");
          }}>
            <input value={contractTitle} onChange={(e) => setContractTitle(e.target.value)} placeholder={labels.contractTitle} className={`flex-1 ${AipifyShellClasses.input}`} required />
            <button type="submit" disabled={busy || !firstCustomerId} className={AipifyShellClasses.primaryButton}>{labels.createContract}</button>
          </form>
          <div className="space-y-2">
            {(center.contracts ?? []).length === 0 ? (
              <PlatformEmptyState title={labels.noContracts} message={labels.noCustomersHint} />
            ) : (
              (center.contracts ?? []).map((c, i) => (
                <div key={i} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                  <p className="font-medium text-gray-900">{String(c.title ?? "")}</p>
                  <p className="text-gray-500">{String(c.customer_name ?? "")} · {String(c.status ?? "")} · ends {String(c.ends_at ?? "—")}</p>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {tab === "communication" && (
        <div className="space-y-2">
          {(center.communications ?? []).map((c, i) => (
            <div key={i} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="font-medium text-gray-900">{String(c.subject ?? "")}</p>
              <p className="text-gray-500">{String(c.customer_name ?? "")} · {String(c.channel ?? "")}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "reports" && center.reports ? (
        <div className={`${AipifyShellClasses.surfaceCard} p-5 text-sm space-y-2`}>
          {Object.entries(center.reports).map(([k, v]) => (
            <p key={k}><span className="font-medium capitalize">{k.replace(/_/g, " ")}:</span> {typeof v === "object" ? JSON.stringify(v) : String(v)}</p>
          ))}
        </div>
      ) : null}

      {center.subscription_awareness ? (
        <section className={`${AipifyShellClasses.surfaceMuted} p-4 text-sm`}>
          <h2 className="font-semibold text-gray-900">{labels.subscriptionAwareness}</h2>
          <p className="mt-1 text-gray-600">{String(center.subscription_awareness.note ?? "")}</p>
        </section>
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
              <li key={i} className={`${AipifyShellClasses.surfaceMuted} px-4 py-2 text-sm`}><p className="font-medium text-gray-900">{a.summary}</p></li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
