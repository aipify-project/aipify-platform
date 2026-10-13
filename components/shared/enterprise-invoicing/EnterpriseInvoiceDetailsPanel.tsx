"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { COMPANY_CONFIG } from "@/lib/company/company.config";
import {
  buildCustomerInvoiceWorkspace,
  formatInvoiceDate,
  formatInvoiceMoney,
  parseEnterpriseInvoiceBillingCenter,
  type CustomerInvoiceListItem,
  type CustomerInvoiceTone,
  type EnterpriseInvoice,
  type EnterpriseInvoicingLabels,
} from "@/lib/enterprise-invoicing";

type EnterpriseInvoiceDetailsPanelProps = {
  labels: EnterpriseInvoicingLabels;
  backHref: string;
  /** BCP 47 locale for currency/date formatting — legal amounts stay as issued. */
  locale?: string;
  /** Inside AppHubShell — omit page chrome and narrow max-width. */
  embedded?: boolean;
};

function StatusChip({
  tone,
  label,
}: {
  tone: CustomerInvoiceTone;
  label: string;
}) {
  const styles: Record<CustomerInvoiceTone, string> = {
    positive: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    warning: "bg-amber-50 text-amber-900 ring-amber-200",
    critical: "bg-rose-50 text-rose-800 ring-rose-200",
    neutral: "bg-slate-50 text-slate-700 ring-slate-200",
  };
  const icons: Record<CustomerInvoiceTone, string> = {
    positive: "✓",
    warning: "!",
    critical: "!",
    neutral: "·",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${styles[tone]}`}
    >
      <span aria-hidden>{icons[tone]}</span>
      {label}
    </span>
  );
}

function statusLabelForItem(
  item: CustomerInvoiceListItem,
  labels: EnterpriseInvoicingLabels
): string {
  const cw = labels.customerWorkspace;
  if (item.bucket === "overdue") return cw.requiresPayment;
  if (item.bucket === "paid") return labels.statuses.paid;
  return labels.statuses[item.invoice.status] ?? item.invoice.status;
}

function InvoiceCard({
  item,
  labels,
  locale,
  expanded,
  onToggle,
}: {
  item: CustomerInvoiceListItem;
  labels: EnterpriseInvoicingLabels;
  locale: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  const { invoice } = item;
  const cw = labels.customerWorkspace;
  const money = formatInvoiceMoney(invoice.total_amount, invoice.currency, locale);
  const due = formatInvoiceDate(invoice.due_date, locale);
  const issued = formatInvoiceDate(invoice.created_at, locale);

  return (
    <article className="rounded-2xl border border-[var(--app-border,#e5e7f0)] bg-[var(--app-card,#fff)] p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <span aria-hidden className="text-[var(--app-primary,#7357E8)]">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 3.75h7.5L19.5 8.75V20.25a.75.75 0 01-.75.75H7.75a.75.75 0 01-.75-.75V4.5a.75.75 0 01.75-.75z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 3.75V8.5h4.75" />
              </svg>
            </span>
            <p className="text-base font-semibold text-[var(--app-text,#202336)]">{invoice.invoice_number}</p>
          </div>
          <p className="text-2xl font-semibold tracking-tight text-[var(--app-text,#202336)]">{money}</p>
          <p className="text-sm text-[var(--app-text-muted,#5C6275)]">
            {cw.dueLabel}: {due ?? "—"} · {cw.issuedLabel}: {issued ?? "—"}
          </p>
        </div>
        <StatusChip tone={item.tone} label={statusLabelForItem(item, labels)} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {item.canPayOnline && item.paymentUrl ? (
          <a
            href={item.paymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          >
            {cw.payCta}
          </a>
        ) : null}
        <button
          type="button"
          onClick={onToggle}
          className="inline-flex items-center justify-center rounded-xl border border-[var(--app-border,#e5e7f0)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--app-text,#202336)] hover:bg-[var(--app-soft-surface,#F2F3F9)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus,#7C3AED)]"
        >
          {expanded ? cw.hideDetails : cw.showDetails}
        </button>
      </div>

      {expanded ? (
        <div className="mt-5 space-y-3 border-t border-[var(--app-border,#e5e7f0)] pt-4 text-sm text-[var(--app-text,#202336)]">
          {invoice.description ? (
            <p>
              <span className="font-medium text-[var(--app-text-muted,#5C6275)]">{cw.descriptionLabel}: </span>
              {invoice.description}
            </p>
          ) : null}
          <div className="grid gap-2 sm:grid-cols-3">
            <p>
              <span className="font-medium text-[var(--app-text-muted,#5C6275)]">{cw.netLabel}: </span>
              {formatInvoiceMoney(invoice.amount, invoice.currency, locale)}
            </p>
            <p>
              <span className="font-medium text-[var(--app-text-muted,#5C6275)]">{cw.taxLabel}: </span>
              {formatInvoiceMoney(invoice.tax_amount, invoice.currency, locale)}
            </p>
            <p>
              <span className="font-medium text-[var(--app-text-muted,#5C6275)]">{cw.totalLabel}: </span>
              {money}
            </p>
          </div>
          {invoice.amount_paid > 0 ? (
            <p>
              <span className="font-medium text-[var(--app-text-muted,#5C6275)]">{cw.paidAmountLabel}: </span>
              {formatInvoiceMoney(invoice.amount_paid, invoice.currency, locale)}
            </p>
          ) : null}
          {!item.canPayOnline && (item.bucket === "overdue" || item.bucket === "awaiting_payment") ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-[var(--app-text,#202336)]">
              <p className="font-semibold">{cw.payUnavailableTitle}</p>
              <p className="mt-1 text-[var(--app-text-muted,#5C6275)]">{cw.payUnavailableBody}</p>
              {item.paymentHints.kid ? (
                <p className="mt-2">
                  <span className="font-medium">{cw.kidLabel}: </span>
                  {item.paymentHints.kid}
                </p>
              ) : null}
              {item.paymentHints.bankReference ? (
                <p className="mt-1">
                  <span className="font-medium">{cw.bankReferenceLabel}: </span>
                  {item.paymentHints.bankReference}
                </p>
              ) : null}
            </div>
          ) : null}
          <p className="text-[var(--app-text-muted,#5C6275)]">{cw.originalDocumentUnavailable}</p>
          <p className="text-[var(--app-text-muted,#5C6275)]">
            {cw.periodLabel}: {cw.periodUnavailable}
          </p>
        </div>
      ) : null}
    </article>
  );
}

function InvoiceSection({
  title,
  items,
  labels,
  locale,
  expandedId,
  setExpandedId,
}: {
  title: string;
  items: CustomerInvoiceListItem[];
  labels: EnterpriseInvoicingLabels;
  locale: string;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
}) {
  if (items.length === 0) return null;
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-[var(--app-text,#202336)]">{title}</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        {items.map((item) => (
          <InvoiceCard
            key={item.invoice.id}
            item={item}
            labels={labels}
            locale={locale}
            expanded={expandedId === item.invoice.id}
            onToggle={() =>
              setExpandedId(expandedId === item.invoice.id ? null : item.invoice.id)
            }
          />
        ))}
      </div>
    </section>
  );
}

/**
 * Customer APP invoice receiver — displays invoices issued by Aipify Platform.
 * Does not create, edit, or issue invoices. No billing-profile editor on this surface.
 */
export function EnterpriseInvoiceDetailsPanel({
  labels,
  backHref,
  locale: localeProp = "en",
  embedded = false,
}: EnterpriseInvoiceDetailsPanelProps) {
  const locale = localeProp;
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [invoices, setInvoices] = useState<EnterpriseInvoice[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const cw = labels.customerWorkspace;
  const workspace = useMemo(() => buildCustomerInvoiceWorkspace(invoices), [invoices]);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    const res = await fetch("/api/enterprise-invoicing/center?scope=tenant");
    if (res.ok) {
      const center = parseEnterpriseInvoiceBillingCenter(await res.json());
      if (center) {
        setInvoices(center.invoices);
      } else {
        setLoadError(true);
      }
    } else {
      setLoadError(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return <p className="p-6 text-base text-[var(--app-text-muted,#5C6275)]">{labels.loading}</p>;
  }

  if (loadError) {
    return (
      <div className={embedded ? "w-full space-y-4" : "mx-auto max-w-5xl space-y-4 p-6"}>
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {cw.loadError}
        </p>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-xl bg-[var(--app-primary,#7357E8)] px-4 py-2.5 text-sm font-semibold text-white"
        >
          {cw.retry}
        </button>
      </div>
    );
  }

  const next = workspace.nextDue;

  return (
    <div className={embedded ? "w-full space-y-8" : "mx-auto max-w-5xl space-y-8 p-6"}>
      {!embedded ? (
        <div>
          <Link href={backHref} className="text-sm text-indigo-600 hover:underline">
            ← {labels.back}
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[var(--app-text,#202336)]">
            {labels.title}
          </h1>
          <p className="mt-2 text-base text-[var(--app-text-muted,#5C6275)]">{labels.subtitle}</p>
        </div>
      ) : null}

      {/* Hero — next due (neutral when empty — never green success for no data) */}
      <section
        className={`rounded-2xl border p-6 sm:p-8 ${
          next?.tone === "critical"
            ? "border-rose-200 bg-rose-50/60"
            : next
              ? "border-amber-200 bg-amber-50/50"
              : "border-[var(--app-border,#e5e7f0)] bg-[var(--app-card,#fff)]"
        }`}
      >
        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--app-text-muted,#5C6275)]">
          {cw.nextDueTitle}
        </p>
        {next ? (
          <div className="mt-4 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-3">
              <p className="text-3xl font-semibold tracking-tight text-[var(--app-text,#202336)] sm:text-4xl">
                {formatInvoiceMoney(next.invoice.total_amount, next.invoice.currency, locale)}
              </p>
              <p className="text-base text-[var(--app-text,#202336)]">
                {labels.fields.invoiceNumber}:{" "}
                <span className="font-semibold">{next.invoice.invoice_number}</span>
              </p>
              <p className="text-base text-[var(--app-text-muted,#5C6275)]">
                {cw.dueLabel}:{" "}
                <span className="font-medium text-[var(--app-text,#202336)]">
                  {formatInvoiceDate(next.invoice.due_date, locale) ?? "—"}
                </span>
              </p>
              <p className="text-base text-[var(--app-text-muted,#5C6275)]">
                {cw.issuedLabel}:{" "}
                <span className="font-medium text-[var(--app-text,#202336)]">
                  {formatInvoiceDate(next.invoice.created_at, locale) ?? "—"}
                </span>
              </p>
              <StatusChip tone={next.tone} label={statusLabelForItem(next, labels)} />
            </div>
            <div className="space-y-3 rounded-xl border border-white/70 bg-white/80 p-4">
              <p className="text-sm font-medium text-[var(--app-text-muted,#5C6275)]">{cw.payeeLabel}</p>
              <p className="text-base font-semibold text-[var(--app-text,#202336)]">
                {COMPANY_CONFIG.legalCompanyName}
              </p>
              <p className="text-sm text-[var(--app-text-muted,#5C6275)]">
                {labels.fields.organizationNumber}: {COMPANY_CONFIG.organizationNumberDisplay}
              </p>
              {next.canPayOnline && next.paymentUrl ? (
                <a
                  href={next.paymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-rose-600 px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-rose-700"
                >
                  {cw.payCta}
                </a>
              ) : (
                <div className="mt-2 space-y-2 text-sm">
                  <p className="font-semibold text-[var(--app-text,#202336)]">{cw.payUnavailableTitle}</p>
                  <p className="text-[var(--app-text-muted,#5C6275)]">{cw.payUnavailableBody}</p>
                  {next.paymentHints.kid ? (
                    <p>
                      <span className="font-medium">{cw.kidLabel}: </span>
                      {next.paymentHints.kid}
                    </p>
                  ) : null}
                  {next.paymentHints.bankReference ? (
                    <p>
                      <span className="font-medium">{cw.bankReferenceLabel}: </span>
                      {next.paymentHints.bankReference}
                    </p>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-4 max-w-2xl space-y-2">
            <p className="text-2xl font-semibold text-[var(--app-text,#202336)]">{cw.nextDueEmpty}</p>
            <p className="text-base leading-relaxed text-[var(--app-text-muted,#5C6275)]">
              {cw.nextDueEmptyBody}
            </p>
            <StatusChip tone="neutral" label={cw.nextDueEmpty} />
          </div>
        )}
      </section>

      {workspace.hasAnyInvoices ? (
        <>
          <InvoiceSection
            title={cw.sectionOverdue}
            items={workspace.overdue}
            labels={labels}
            locale={locale}
            expandedId={expandedId}
            setExpandedId={setExpandedId}
          />
          <InvoiceSection
            title={cw.sectionAwaiting}
            items={workspace.awaitingPayment}
            labels={labels}
            locale={locale}
            expandedId={expandedId}
            setExpandedId={setExpandedId}
          />
          <InvoiceSection
            title={cw.sectionPaid}
            items={workspace.paid}
            labels={labels}
            locale={locale}
            expandedId={expandedId}
            setExpandedId={setExpandedId}
          />
          <InvoiceSection
            title={cw.sectionOther}
            items={workspace.other}
            labels={labels}
            locale={locale}
            expandedId={expandedId}
            setExpandedId={setExpandedId}
          />
        </>
      ) : (
        <section className="rounded-2xl border border-[var(--app-border,#e5e7f0)] bg-[var(--app-card,#fff)] p-8 shadow-sm sm:p-10">
          <div className="mx-auto flex max-w-xl flex-col items-start gap-4">
            <span
              aria-hidden
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--app-primary-soft,#EEEAFE)] text-[var(--app-primary,#7357E8)]"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 3.75h7.5L19.5 8.75V20.25a.75.75 0 01-.75.75H7.75a.75.75 0 01-.75-.75V4.5a.75.75 0 01.75-.75z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 3.75V8.5h4.75" />
              </svg>
            </span>
            <h2 className="text-xl font-semibold text-[var(--app-text,#202336)]">{cw.historyEmptyTitle}</h2>
            <p className="text-base leading-relaxed text-[var(--app-text-muted,#5C6275)]">
              {cw.historyEmptyBody}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
