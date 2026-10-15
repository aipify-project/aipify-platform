"use client";

import { useMemo, useState } from "react";
import {
  WEBSITE_KOMPIS_COMMUNICATION_TEMPLATES,
  WEBSITE_KOMPIS_PLAN_CATALOG,
  WEBSITE_KOMPIS_FUTURE_APPROVAL_GATES,
  WEBSITE_KOMPIS_STRIPE_TRIAL_NOTE,
  type WebsiteKompisCommunicationTemplate,
  type WebsiteKompisEmailPreviewCopy,
  type WebsiteKompisPlanPlatformLabels,
} from "@/lib/website-kompis-plans";
import { PlatformLayoutClasses, PlatformStatusToneClasses } from "@/lib/design";
import { PlatformPageFrame } from "@/components/platform/PlatformPageFrame";
import Link from "next/link";

type Props = {
  labels: WebsiteKompisPlanPlatformLabels;
  /** Prebuilt on the server — never pass a translate function into this client panel. */
  previews: Record<WebsiteKompisCommunicationTemplate["id"], WebsiteKompisEmailPreviewCopy>;
  planNames: Record<string, string>;
  backHref: string;
  backLabel: string;
};

/**
 * Platform communication readiness — catalog + draft template preview.
 * Does not send email, mutate Stripe, or claim delivery is live.
 */
export function WebsiteKompisPlansCommunicationPanel({
  labels,
  previews,
  planNames,
  backHref,
  backLabel,
}: Props) {
  const [selected, setSelected] = useState(WEBSITE_KOMPIS_COMMUNICATION_TEMPLATES[0]!.id);
  const preview = useMemo(() => previews[selected], [previews, selected]);

  const readinessRows = [
    { label: labels.readinessLedger, gate: WEBSITE_KOMPIS_FUTURE_APPROVAL_GATES.A_ledger_sql_and_frozen_ask_reopen },
    { label: labels.readinessMultisite, gate: WEBSITE_KOMPIS_FUTURE_APPROVAL_GATES.B_multisite_knowledge_acl },
    { label: labels.readinessStripe, gate: WEBSITE_KOMPIS_FUTURE_APPROVAL_GATES.C_stripe_sku_checkout_webhooks },
    { label: labels.readinessEmail, gate: WEBSITE_KOMPIS_FUTURE_APPROVAL_GATES.D_platform_email_delivery },
    { label: labels.readinessInvoice, gate: WEBSITE_KOMPIS_FUTURE_APPROVAL_GATES.E_invoice_site_lines },
  ] as const;

  return (
    <PlatformPageFrame tight>
      <div className="space-y-8">
        <div>
          <Link href={backHref} className="text-sm font-medium text-sky-700 hover:text-sky-800">
            ← {backLabel}
          </Link>
          <h1 className={`${PlatformLayoutClasses.pageTitle} mt-3`}>{labels.title}</h1>
          <p className={PlatformLayoutClasses.pageSubtitle}>{labels.subtitle}</p>
          <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            {labels.noCustomerSend}
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">{labels.catalogSection}</h2>
          <div className={PlatformLayoutClasses.navCardGrid}>
            {WEBSITE_KOMPIS_PLAN_CATALOG.map((plan) => (
              <article key={plan.id} className={PlatformLayoutClasses.card}>
                <p className={`text-xs font-semibold uppercase tracking-wide ${PlatformStatusToneClasses.warning}`}>
                  {labels.offerStatusPlanned}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">
                  {planNames[plan.id] ?? plan.id}
                </h3>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {plan.answerQuota.toLocaleString()}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {plan.quotaKind === "lifetime_total"
                    ? labels.quotaLifetime
                    : labels.quotaMonthly}
                </p>
                {plan.monthlyPrice ? (
                  <p className="mt-3 text-sm text-slate-700">
                    {labels.priceMonthly
                      .replace("{amount}", plan.monthlyPrice.amountDisplay)
                      .replace("{currency}", plan.monthlyPrice.currency)}
                    {" · "}
                    {labels.priceAnnual
                      .replace("{amount}", plan.annualPrice?.amountDisplay ?? "—")
                      .replace("{currency}", plan.annualPrice?.currency ?? plan.monthlyPrice.currency)}
                  </p>
                ) : (
                  <p className="mt-3 text-sm text-slate-700">{labels.freePrice}</p>
                )}
                <p className={`mt-2 text-xs font-medium ${PlatformStatusToneClasses.warning}`}>
                  {labels.checkoutNotEnabled}
                </p>
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
                className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
                  selected === tpl.id
                    ? PlatformLayoutClasses.tabActive
                    : PlatformLayoutClasses.tabIdle
                }`}
              >
                {labels.templates[tpl.id]}
              </button>
            ))}
          </div>
          <div className={`${PlatformLayoutClasses.cardMuted}`}>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {labels.previewSubject}
            </p>
            <h3 className="mt-2 text-base font-semibold text-slate-900">{preview.subject}</h3>
            <p className="mt-1 text-sm font-medium text-slate-800">{preview.title}</p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
              {preview.body}
            </p>
            <p className="mt-4 text-sm font-semibold text-sky-800">{preview.ctaLabel}</p>
          </div>
        </section>

        <section className={PlatformLayoutClasses.card}>
          <h2 className="text-lg font-semibold text-slate-900">{labels.readinessSection}</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            {readinessRows.map((row) => (
              <li key={row.label} className="rounded-xl bg-slate-50 px-4 py-3">
                <span className="font-semibold">{row.label}</span>
                <span className={`mt-1 block ${PlatformStatusToneClasses.warning}`}>{row.gate.status}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
            {labels.stripeTrialNote || WEBSITE_KOMPIS_STRIPE_TRIAL_NOTE}
          </p>
        </section>
      </div>
    </PlatformPageFrame>
  );
}
