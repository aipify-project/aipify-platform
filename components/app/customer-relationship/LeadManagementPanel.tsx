"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { parseLeadManagementCenter, type CustomerRelationshipLabels, type LeadManagementCenter } from "@/lib/customer-relationship";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";

export function LeadManagementPanel({ labels }: { labels: CustomerRelationshipLabels }) {
  const [center, setCenter] = useState<LeadManagementCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [company, setCompany] = useState("");
  const [contact, setContact] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/customer-relationship/leads");
    if (res.ok) setCenter(parseLeadManagementCenter(await res.json()));
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

  if (loading && !center) return <div className="flex min-h-[320px] items-center justify-center"><AipifyLoader centered /></div>;
  if (!center?.found) return <AipifyModuleAccessDenied message={labels.accessDenied} />;

  const pipeline = center.pipeline ?? {};

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <div>
        <Link href="/app/customers" className="text-sm text-indigo-600 hover:underline">{labels.backToCustomers}</Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">{labels.leadsTitle}</h1>
        {center.principle ? <p className="mt-2 text-sm text-gray-600">{center.principle}</p> : null}
      </div>

      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-7">
        {Object.entries(pipeline).map(([status, count]) => (
          <div key={status} className="rounded-xl border border-gray-200 bg-white p-3 text-center">
            <p className="text-xs uppercase text-gray-500">{status.replace(/_/g, " ")}</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">{String(count ?? 0)}</p>
          </div>
        ))}
      </div>

      <form className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:flex-row" onSubmit={(e) => {
        e.preventDefault();
        void runAction("create_lead", { company_name: company, contact_name: contact, status: "new" });
        setCompany(""); setContact("");
      }}>
        <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder={labels.companyName} className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" required />
        <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder={labels.customerName} className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <button type="submit" disabled={busy} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{labels.createLead}</button>
      </form>

      <div className="space-y-3">
        {(center.leads ?? []).map((lead, i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs text-gray-500">{String(lead.lead_number ?? "")}</p>
                <p className="font-semibold text-gray-900">{String(lead.company_name ?? "")}</p>
                <p className="text-gray-500">{String(lead.contact_name ?? "")} · {String(lead.status ?? "")} · {String(lead.lead_source ?? "")}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {lead.status !== "won" && lead.status !== "lost" ? (
                  <>
                    <button type="button" disabled={busy} onClick={() => void runAction("update_lead", { lead_id: lead.id, status: "qualified" })} className="text-xs text-indigo-700 hover:underline">{labels.updateStatus}</button>
                    <button type="button" disabled={busy} onClick={() => void runAction("convert_lead", { lead_id: lead.id })} className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">{labels.convertLead}</button>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
