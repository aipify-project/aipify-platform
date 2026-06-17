"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  COMMISSION_TIER_LADDER,
  parseEconomyCommissions,
  parseEconomyInvoices,
  parseEconomyOverview,
  parseEconomySales,
  type EconomyCommission,
  type EconomyInvoice,
  type EconomyOverview,
  type EconomySale,
  type GrowthPartnerEconomyLabels,
} from "@/lib/partners-portal/economy-engine";

type Props = { labels: GrowthPartnerEconomyLabels };

export function GrowthPartnerEconomyPanel({ labels }: Props) {
  const [data, setData] = useState<EconomyOverview | null>(null);
  const [sales, setSales] = useState<EconomySale[]>([]);
  const [commissions, setCommissions] = useState<EconomyCommission[]>([]);
  const [invoices, setInvoices] = useState<EconomyInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [companyType, setCompanyType] = useState("norwegian_as");
  const [companyName, setCompanyName] = useState("");
  const [orgNumber, setOrgNumber] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [vatRegistered, setVatRegistered] = useState(false);
  const [address, setAddress] = useState("");
  const [bankAccount, setBankAccount] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const [overviewRes, salesRes, commRes, invRes] = await Promise.all([
      fetch("/api/partners-portal/economy"),
      fetch("/api/partners-portal/economy/sales"),
      fetch("/api/partners-portal/economy/commissions"),
      fetch("/api/partners-portal/economy/invoices"),
    ]);
    if (overviewRes.ok) {
      setData(parseEconomyOverview(await overviewRes.json()));
    } else {
      const body = (await overviewRes.json()) as { error?: string };
      setError(body.error ?? labels.accessDenied);
      setData(null);
    }
    if (salesRes.ok) setSales(parseEconomySales(await salesRes.json()));
    if (commRes.ok) setCommissions(parseEconomyCommissions(await commRes.json()));
    if (invRes.ok) setInvoices(parseEconomyInvoices(await invRes.json()));
    setLoading(false);
  }, [labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function acceptAgreements() {
    setBusy(true);
    setMessage("");
    const profile = {
      company_type: companyType,
      company_name: companyName,
      organization_number: orgNumber,
      vat_number: vatNumber,
      vat_registered: vatRegistered,
      country_code: companyType.startsWith("norwegian") ? "NO" : "INT",
      business_address: { line1: address },
      bank_account: { account_number: bankAccount },
    };
    for (const agreementType of ["growth_partner_agreement", "self_billing_agreement", "partner_terms"]) {
      await fetch("/api/partners-portal/economy/agreements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agreement_type: agreementType, company_profile: profile }),
      });
    }
    setBusy(false);
    setMessage(labels.agreements.acceptSuccess);
    void load();
  }

  async function prepareSettlement() {
    setBusy(true);
    setMessage("");
    const res = await fetch("/api/partners-portal/economy/settlements", { method: "POST" });
    setBusy(false);
    if (res.ok) {
      setMessage(labels.settlement.prepareSuccess);
      void load();
    }
  }

  async function approveSettlement(settlementId: string) {
    setBusy(true);
    setMessage("");
    const res = await fetch(`/api/partners-portal/economy/settlements/${settlementId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approval_statement: labels.settlement.approvalStatement }),
    });
    setBusy(false);
    if (res.ok) {
      setMessage(labels.settlement.approveSuccess);
      void load();
    }
  }

  if (loading && !data && !error) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600" aria-hidden />
        <p className="mt-4 text-sm text-slate-600">{labels.loading}</p>
      </div>
    );
  }

  if (error && !data?.found) {
    return (
      <div className="mx-auto max-w-6xl space-y-4">
        <Link href="/partners" className="text-sm font-medium text-emerald-700 hover:underline">← Partners</Link>
        <p className="text-slate-600">{labels.accessDenied}</p>
      </div>
    );
  }

  const noCompany = data?.no_company || data?.verification_status === "no_company";

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <Link href="/partners" className="text-sm font-medium text-emerald-700 hover:underline">← Partners</Link>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">{labels.title}</h1>
        <p className="mt-2 text-slate-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-5 py-4 text-sm text-slate-800">{labels.principle}</p>
        <p className="mt-3 text-sm text-slate-600">{labels.oneTimeNote}</p>
      </div>

      {noCompany ? (
        <section className="rounded-2xl border border-amber-100 bg-amber-50/40 p-6">
          <h2 className="text-lg font-semibold text-slate-900">{labels.noCompanyTitle}</h2>
          <p className="mt-2 text-sm text-slate-700">{labels.noCompanyBody}</p>
          <p className="mt-3 text-sm text-slate-600">{labels.norwayGuidance}</p>
          <a href="https://www.brreg.no/" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-medium text-emerald-700 hover:underline">{labels.brregLink}</a>
        </section>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label={labels.tier.salesCount} value={String(data?.approved_sales_count ?? 0)} />
        <Stat label={labels.tier.current} value={`${data?.current_commission_tier_pct ?? 0}%`} />
        <Stat label={labels.sections.pendingSettlements} value={String(data?.pending_settlements?.length ?? 0)} />
        <Stat label={labels.sections.commissionHistory} value={`${data?.pending_commission_total ?? 0} NOK`} />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-sm">
        <h2 className="font-semibold">{labels.sections.commissionTier}</h2>
        <p className="mt-2 text-slate-600">{labels.tier.ladderNote}</p>
        <ul className="mt-3 space-y-1 text-slate-700">
          {COMMISSION_TIER_LADDER.map((t) => (
            <li key={t.pct}>{t.min}–{t.max ?? "∞"} sales: {t.pct}%</li>
          ))}
        </ul>
      </section>

      {(data?.milestones?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.sections.milestones}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {data!.milestones!.map((m) => (
              <li key={m.milestone_key}>{m.label} — {m.achieved ? "✓" : "…"}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5 text-sm">
        <h2 className="font-semibold">{labels.sections.agreements}</h2>
        <ul className="mt-3 space-y-2">
          {data?.agreements?.map((a) => (
            <li key={a.agreement_type}>
              {a.agreement_type === "growth_partner_agreement" ? labels.agreements.growthPartner
                : a.agreement_type === "self_billing_agreement" ? labels.agreements.selfBilling
                  : labels.agreements.partnerTerms}
              {" — "}{a.accepted ? "✓" : labels.agreements.accept}
            </li>
          ))}
        </ul>
        {!noCompany && data?.can_earn_commissions !== true ? (
          <div className="mt-4 space-y-3">
            <select value={companyType} onChange={(e) => setCompanyType(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2">
              {Object.entries(labels.companyTypes).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder={labels.onboarding.companyName} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
            <input value={orgNumber} onChange={(e) => setOrgNumber(e.target.value)} placeholder={labels.onboarding.organizationNumber} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
            <input value={vatNumber} onChange={(e) => setVatNumber(e.target.value)} placeholder={labels.onboarding.vatNumber} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
            <label className="flex items-center gap-2"><input type="checkbox" checked={vatRegistered} onChange={(e) => setVatRegistered(e.target.checked)} />{labels.onboarding.vatRegistered}</label>
            <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder={labels.onboarding.address} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
            <input value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} placeholder={labels.onboarding.bankAccount} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
            <button type="button" disabled={busy} onClick={() => void acceptAgreements()} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">{labels.onboarding.submit}</button>
          </div>
        ) : null}
      </section>

      {(data?.pending_settlements?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5">
          <h2 className="font-semibold">{labels.sections.pendingSettlements}</h2>
          <ul className="mt-3 space-y-3 text-sm">
            {data!.pending_settlements!.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-3">
                <span>{s.settlement_period} — {s.total_payable} NOK</span>
                <button type="button" disabled={busy} onClick={() => void approveSettlement(s.id)} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white">{labels.settlement.approve}</button>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-600">{labels.settlement.approvalStatement}</p>
        </section>
      ) : null}

      {data?.can_earn_commissions && (data.pending_commission_total ?? 0) > 0 && (data.pending_settlements?.length ?? 0) === 0 ? (
        <button type="button" disabled={busy} onClick={() => void prepareSettlement()} className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">{labels.settlement.prepare}</button>
      ) : null}

      {sales.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.sections.salesHistory}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {sales.map((s) => <li key={s.id}>{s.customer_label} — {s.sale_amount} NOK ({s.sale_status})</li>)}
          </ul>
        </section>
      ) : null}

      {commissions.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.sections.commissionHistory}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {commissions.map((c) => <li key={c.id}>{c.customer_label} — {c.commission_amount} NOK @ {c.commission_rate_pct}%</li>)}
          </ul>
        </section>
      ) : null}

      {invoices.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.sections.invoices}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {invoices.map((i) => <li key={i.id}>{i.invoice_number} — {i.total_amount} NOK ({i.invoice_status})</li>)}
          </ul>
        </section>
      ) : null}

      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold">{labels.faq.title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div><dt className="font-medium">{labels.faq.notEmployee}</dt><dd className="mt-1 text-slate-600">{labels.faq.notEmployeeAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.recurring}</dt><dd className="mt-1 text-slate-600">{labels.faq.recurringAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.selfBilling}</dt><dd className="mt-1 text-slate-600">{labels.faq.selfBillingAnswer}</dd></div>
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
