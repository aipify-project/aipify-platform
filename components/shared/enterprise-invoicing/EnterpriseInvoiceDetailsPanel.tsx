"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { COMPANY_CONFIG } from "@/lib/company/company.config";
import {
  buildCustomerInvoiceWorkspace,
  formatInvoiceDate,
  formatInvoiceMoney,
  parseEnterpriseBillingProfile,
  parseEnterpriseInvoiceBillingCenter,
  type CustomerInvoiceListItem,
  type CustomerInvoiceTone,
  type EnterpriseBillingProfile,
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

const EMPTY_PROFILE: EnterpriseBillingProfile = {
  tenant_id: "",
  company_name: "",
  organization_number: "",
  vat_number: "",
  billing_address: {},
  invoice_email: "",
  ap_contact_name: "",
  ap_contact_email: "",
  purchase_order_number: "",
  internal_reference: "",
  payment_terms: "net_30",
  payment_terms_custom: "",
  preferred_currency: "NOK",
  billing_language: "en",
  access_unlock_policy: "contract_approval",
  auto_send_invoices: false,
  require_approval_before_send: true,
  configured: false,
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
  const statusLabel = labels.statuses[invoice.status] ?? invoice.status;

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
        <StatusChip tone={item.tone} label={statusLabel} />
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
          <p>
            <span className="font-medium text-[var(--app-text-muted,#5C6275)]">{cw.descriptionLabel}: </span>
            {invoice.description || "—"}
          </p>
          <p>
            <span className="font-medium text-[var(--app-text-muted,#5C6275)]">{cw.periodLabel}: </span>
            {cw.periodUnavailable}
          </p>
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

export function EnterpriseInvoiceDetailsPanel({
  labels,
  backHref,
  locale: localeProp = "en",
  embedded = false,
}: EnterpriseInvoiceDetailsPanelProps) {
  const locale = localeProp;
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [invoices, setInvoices] = useState<EnterpriseInvoice[]>([]);
  const [form, setForm] = useState<EnterpriseBillingProfile>(EMPTY_PROFILE);
  const [showProfile, setShowProfile] = useState(false);
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
        setCanEdit(center.can_edit_billing_details);
        setInvoices(center.invoices);
        if (center.profile) {
          setForm(center.profile);
        }
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

  async function handleSave() {
    if (!canEdit) return;
    setSaving(true);
    setSaved(false);
    const res = await fetch("/api/enterprise-invoicing/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      const profile = parseEnterpriseBillingProfile(await res.json());
      if (profile) setForm(profile);
      setSaved(true);
      await load();
    }
  }

  function updateField<K extends keyof EnterpriseBillingProfile>(
    key: K,
    value: EnterpriseBillingProfile[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

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

      {/* Hero — next due */}
      <section
        className={`rounded-2xl border p-6 sm:p-8 ${
          next?.tone === "critical"
            ? "border-rose-200 bg-rose-50/60"
            : next
              ? "border-amber-200 bg-amber-50/50"
              : "border-emerald-200 bg-emerald-50/50"
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
                {cw.periodLabel}: {cw.periodUnavailable}
              </p>
              <StatusChip
                tone={next.tone}
                label={labels.statuses[next.invoice.status] ?? next.invoice.status}
              />
            </div>
            <div className="space-y-3 rounded-xl border border-white/70 bg-white/80 p-4">
              <p className="text-sm font-medium text-[var(--app-text-muted,#5C6275)]">{cw.payeeLabel}</p>
              <p className="text-base font-semibold text-[var(--app-text,#202336)]">
                {COMPANY_CONFIG.legalCompanyName}
              </p>
              <p className="text-sm text-[var(--app-text-muted,#5C6275)]">
                Org.nr. {COMPANY_CONFIG.organizationNumberDisplay}
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
          <div className="mt-3 space-y-2">
            <p className="text-2xl font-semibold text-emerald-900">{cw.nextDueEmpty}</p>
            <StatusChip tone="positive" label={cw.nextDueEmpty} />
          </div>
        )}
      </section>

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

      {!workspace.hasAnyInvoices ? (
        <p className="rounded-xl border border-[var(--app-border,#e5e7f0)] bg-white px-4 py-6 text-base text-[var(--app-text-muted,#5C6275)]">
          {labels.empty}
        </p>
      ) : null}

      <div>
        <button
          type="button"
          onClick={() => setShowProfile((v) => !v)}
          className="rounded-xl border border-[var(--app-border,#e5e7f0)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--app-text,#202336)] hover:bg-[var(--app-soft-surface,#F2F3F9)]"
        >
          {cw.billingProfileToggle}
        </button>
      </div>

      {showProfile ? (
        <section className="rounded-2xl border border-[var(--app-border,#e5e7f0)] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--app-text,#202336)]">
            {labels.sections.billingDetails}
          </h2>
          {!canEdit && (
            <p className="mt-2 text-sm text-amber-700">{labels.permissions.viewOnly}</p>
          )}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {(
              [
                ["company_name", labels.fields.companyName],
                ["organization_number", labels.fields.organizationNumber],
                ["vat_number", labels.fields.vatNumber],
                ["invoice_email", labels.fields.invoiceEmail],
                ["ap_contact_name", labels.fields.apContactName],
                ["ap_contact_email", labels.fields.apContactEmail],
                ["purchase_order_number", labels.fields.purchaseOrderNumber],
                ["internal_reference", labels.fields.internalReference],
                ["preferred_currency", labels.fields.preferredCurrency],
                ["billing_language", labels.fields.billingLanguage],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="block text-sm">
                <span className="font-medium text-[var(--app-text,#202336)]">{label}</span>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base disabled:bg-slate-50"
                  value={form[key]}
                  disabled={!canEdit}
                  onChange={(e) => updateField(key, e.target.value)}
                />
              </label>
            ))}
          </div>

          <h3 className="mt-6 text-sm font-semibold text-[var(--app-text,#202336)]">
            {labels.sections.paymentTerms}
          </h3>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={labels.fields.paymentTerms}>
            {Object.entries(labels.paymentTerms).map(([value, label]) => {
              const selected = form.payment_terms === value;
              return (
                <button
                  key={value}
                  type="button"
                  disabled={!canEdit}
                  aria-pressed={selected}
                  onClick={() =>
                    updateField("payment_terms", value as EnterpriseBillingProfile["payment_terms"])
                  }
                  className={`rounded-xl px-3.5 py-2 text-sm font-medium ring-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus,#7C3AED)] disabled:opacity-60 ${
                    selected
                      ? "bg-[var(--app-primary-soft,#EEEAFE)] text-[var(--app-primary,#7357E8)] ring-[var(--app-border-accent,#CFC4FF)]"
                      : "bg-white text-[var(--app-text,#202336)] ring-[var(--app-border,#e5e7f0)] hover:bg-[var(--app-soft-surface,#F2F3F9)]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {canEdit && (
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={saving}
                className="rounded-xl bg-[var(--app-primary,#7357E8)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
              >
                {saving ? labels.saving : labels.save}
              </button>
              {saved && <span className="text-sm text-emerald-700">{labels.saved}</span>}
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
