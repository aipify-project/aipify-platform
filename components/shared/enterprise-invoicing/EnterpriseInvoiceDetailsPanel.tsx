"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseEnterpriseBillingProfile,
  parseEnterpriseInvoiceBillingCenter,
  type EnterpriseBillingProfile,
  type EnterpriseInvoice,
  type EnterpriseInvoicingLabels,
} from "@/lib/enterprise-invoicing";

type EnterpriseInvoiceDetailsPanelProps = {
  labels: EnterpriseInvoicingLabels;
  backHref: string;
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

export function EnterpriseInvoiceDetailsPanel({
  labels,
  backHref,
}: EnterpriseInvoiceDetailsPanelProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [invoices, setInvoices] = useState<EnterpriseInvoice[]>([]);
  const [form, setForm] = useState<EnterpriseBillingProfile>(EMPTY_PROFILE);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/enterprise-invoicing/center?scope=tenant");
    if (res.ok) {
      const center = parseEnterpriseInvoiceBillingCenter(await res.json());
      if (center) {
        setCanEdit(center.can_edit_billing_details);
        setInvoices(center.invoices);
        if (center.profile) {
          setForm(center.profile);
        }
      }
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
    return <p className="p-6 text-sm text-slate-600">{labels.loading}</p>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <Link href={backHref} className="text-sm text-indigo-600 hover:underline">
          ← {labels.back}
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{labels.title}</h1>
        <p className="mt-2 text-slate-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          {labels.principle}
        </p>
        {!canEdit && (
          <p className="mt-2 text-sm text-amber-700">{labels.permissions.viewOnly}</p>
        )}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{labels.sections.billingDetails}</h2>
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
              <span className="font-medium text-slate-700">{label}</span>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 disabled:bg-slate-50"
                value={form[key]}
                disabled={!canEdit}
                onChange={(e) => updateField(key, e.target.value)}
              />
            </label>
          ))}
        </div>

        <h3 className="mt-6 text-sm font-semibold text-slate-800">{labels.fields.billingAddress}</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {(
            [
              ["line1", labels.fields.addressLine1],
              ["line2", labels.fields.addressLine2],
              ["city", labels.fields.city],
              ["postal_code", labels.fields.postalCode],
              ["country", labels.fields.country],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block text-sm">
              <span className="font-medium text-slate-700">{label}</span>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 disabled:bg-slate-50"
                value={form.billing_address[key] ?? ""}
                disabled={!canEdit}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    billing_address: { ...prev.billing_address, [key]: e.target.value },
                  }))
                }
              />
            </label>
          ))}
        </div>

        <h3 className="mt-6 text-sm font-semibold text-slate-800">{labels.sections.paymentTerms}</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium text-slate-700">{labels.fields.paymentTerms}</span>
            <select
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 disabled:bg-slate-50"
              value={form.payment_terms}
              disabled={!canEdit}
              onChange={(e) =>
                updateField("payment_terms", e.target.value as EnterpriseBillingProfile["payment_terms"])
              }
            >
              {Object.entries(labels.paymentTerms).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          {form.payment_terms === "custom" && (
            <label className="block text-sm">
              <span className="font-medium text-slate-700">{labels.fields.paymentTermsCustom}</span>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 disabled:bg-slate-50"
                value={form.payment_terms_custom}
                disabled={!canEdit}
                onChange={(e) => updateField("payment_terms_custom", e.target.value)}
              />
            </label>
          )}
        </div>

        {canEdit && (
          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {saving ? labels.saving : labels.save}
            </button>
            {saved && <span className="text-sm text-emerald-700">{labels.saved}</span>}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{labels.sections.invoices}</h2>
        {invoices.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">{labels.empty}</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {invoices.map((invoice) => (
              <li key={invoice.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-medium text-slate-900">{invoice.invoice_number}</p>
                  <p className="text-sm text-slate-600">
                    {invoice.total_amount} {invoice.currency} · {labels.statuses[invoice.status]}
                  </p>
                </div>
                {invoice.due_date && (
                  <p className="text-sm text-slate-500">
                    {labels.fields.dueDate}: {invoice.due_date}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
