"use client";

import { useMemo, useState } from "react";
import {
  WEBSITE_KOMPIS_COMMUNICATION_TEMPLATES,
  WEBSITE_KOMPIS_PLAN_CATALOG,
  WEBSITE_KOMPIS_FUTURE_APPROVAL_GATES,
  WEBSITE_KOMPIS_STRIPE_TRIAL_NOTE,
  buildWebsiteKompisEmailPreviewCopy,
  type WebsiteKompisPlanPlatformLabels,
} from "@/lib/website-kompis-plans";

type Props = {
  labels: WebsiteKompisPlanPlatformLabels;
  t: (key: string) => string;
};

/**
 * Platform communication readiness — catalog + draft template preview.
 * Does not send email, mutate Stripe, or claim delivery is live.
 */
export function WebsiteKompisPlansCommunicationPanel({ labels, t }: Props) {
  const [selected, setSelected] = useState(WEBSITE_KOMPIS_COMMUNICATION_TEMPLATES[0]!.id);
  const preview = useMemo(() => buildWebsiteKompisEmailPreviewCopy(selected, t), [selected, t]);

  const readinessRows = [
    { label: labels.readinessLedger, gate: WEBSITE_KOMPIS_FUTURE_APPROVAL_GATES.A_ledger_sql_and_frozen_ask_reopen },
    { label: labels.readinessMultisite, gate: WEBSITE_KOMPIS_FUTURE_APPROVAL_GATES.B_multisite_knowledge_acl },
    { label: labels.readinessStripe, gate: WEBSITE_KOMPIS_FUTURE_APPROVAL_GATES.C_stripe_sku_checkout_webhooks },
    { label: labels.readinessEmail, gate: WEBSITE_KOMPIS_FUTURE_APPROVAL_GATES.D_platform_email_delivery },
    { label: labels.readinessInvoice, gate: WEBSITE_KOMPIS_FUTURE_APPROVAL_GATES.E_invoice_site_lines },
  ] as const;

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-base text-slate-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {labels.noCustomerSend}
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">{labels.catalogSection}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {WEBSITE_KOMPIS_PLAN_CATALOG.map((plan) => (
            <article key={plan.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
                {plan.offerStatus}
              </p>
              <h3 className="mt-2 text-xl font-semibold capitalize text-slate-900">{plan.id}</h3>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {plan.answerQuota.toLocaleString("en-GB")}
              </p>
              <p className="mt-1 text-sm text-slate-600">{plan.quotaKind}</p>
              {plan.monthlyPrice ? (
                <p className="mt-3 text-sm text-slate-700">
                  NOK {plan.monthlyPrice.amountDisplay}/mo · NOK {plan.annualPrice?.amountDisplay}/yr
                </p>
              ) : (
                <p className="mt-3 text-sm text-slate-700">—</p>
              )}
              <p className="mt-2 text-xs font-medium text-amber-800">checkoutEnabled=false</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">{labels.templatesSection}</h2>
        <p className="text-sm text-slate-600">{labels.deliveryDraftOnly}</p>
        <div className="flex flex-wrap gap-2">
          {WEBSITE_KOMPIS_COMMUNICATION_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => setSelected(tpl.id)}
              className={`rounded-xl px-3 py-2 text-sm font-medium ring-1 ${
                selected === tpl.id
                  ? "bg-violet-600 text-white ring-violet-600"
                  : "bg-white text-slate-800 ring-slate-200"
              }`}
            >
              {labels.templates[tpl.id]}
            </button>
          ))}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {labels.previewSubject}
          </p>
          <h3 className="mt-2 text-base font-semibold text-slate-900">{preview.subject}</h3>
          <p className="mt-1 text-sm font-medium text-slate-800">{preview.title}</p>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{preview.body}</p>
          <p className="mt-4 text-sm font-semibold text-violet-700">{preview.ctaLabel}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{labels.readinessSection}</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-700">
          {readinessRows.map((row) => (
            <li key={row.label} className="rounded-xl bg-slate-50 px-4 py-3">
              <span className="font-semibold">{row.label}</span>
              <span className="mt-1 block text-slate-600">{row.gate.status}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
          {WEBSITE_KOMPIS_STRIPE_TRIAL_NOTE}
        </p>
      </section>
    </div>
  );
}
