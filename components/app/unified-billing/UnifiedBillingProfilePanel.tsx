"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { AIPIFY_CUSTOMER_TYPES } from "@/lib/unified-billing-engine/constants";
import { parseUnifiedBillingCenter, type UnifiedBillingCenter } from "@/lib/unified-billing-engine";

type ProfileForm = {
  profile_key: string;
  profile_label: string;
  customer_type: string;
  legal_name: string;
  company_name: string;
  organization_number: string;
  vat_number: string;
  country: string;
  billing_address: string;
  billing_email: string;
  invoice_email: string;
  payment_method: string;
  is_primary: boolean;
};

type Props = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    back: string;
    save: string;
    saving: string;
    saved: string;
    accessDenied: string;
    auditTitle: string;
    customerType: string;
    profileLabel: string;
    companyName: string;
    legalName: string;
    organizationNumber: string;
    vatNumber: string;
    country: string;
    billingAddress: string;
    billingEmail: string;
    invoiceEmail: string;
    paymentMethod: string;
    isPrimary: string;
  };
};

const emptyForm: ProfileForm = {
  profile_key: "primary",
  profile_label: "Primary billing profile",
  customer_type: "business",
  legal_name: "",
  company_name: "",
  organization_number: "",
  vat_number: "",
  country: "NO",
  billing_address: "",
  billing_email: "",
  invoice_email: "",
  payment_method: "stripe",
  is_primary: true,
};

export function UnifiedBillingProfilePanel({ labels }: Props) {
  const [center, setCenter] = useState<UnifiedBillingCenter | null>(null);
  const [form, setForm] = useState<ProfileForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [audit, setAudit] = useState<Record<string, unknown>[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/unified-billing/profile");
    if (res.ok) {
      const data = (await res.json()) as Record<string, unknown>;
      const parsed = parseUnifiedBillingCenter(data);
      setCenter(parsed);
      setAudit(Array.isArray(data.audit_recent) ? (data.audit_recent as Record<string, unknown>[]) : []);
      const primary = parsed.profiles?.find((p) => p.is_primary) ?? parsed.profiles?.[0];
      if (primary) {
        setForm((prev) => ({
          ...prev,
          profile_key: primary.profile_key,
          profile_label: primary.profile_label,
          customer_type: primary.customer_type,
          company_name: primary.company_name,
          vat_number: primary.vat_number,
          country: primary.country,
          is_primary: primary.is_primary,
        }));
      }
    } else {
      setCenter(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async () => {
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/unified-billing/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setMessage(labels.saved);
      await load();
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found) {
    return <p className="p-6 text-sm text-red-600">{center?.error ?? labels.empty}</p>;
  }

  if (!center.can_manage_profiles) {
    return <p className="p-6 text-sm text-amber-800">{labels.accessDenied}</p>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-4 sm:p-6">
      <div>
        <Link href="/app/billing" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          ← {labels.back}
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
      </div>

      <form
        className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        onSubmit={(e) => {
          e.preventDefault();
          void save();
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium text-gray-700">{labels.profileLabel}</span>
            <input
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={form.profile_label}
              onChange={(e) => setForm({ ...form, profile_label: e.target.value })}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-gray-700">{labels.customerType}</span>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={form.customer_type}
              onChange={(e) => setForm({ ...form, customer_type: e.target.value })}
            >
              {AIPIFY_CUSTOMER_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="font-medium text-gray-700">{labels.companyName}</span>
            <input
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={form.company_name}
              onChange={(e) => setForm({ ...form, company_name: e.target.value })}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-gray-700">{labels.organizationNumber}</span>
            <input
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={form.organization_number}
              onChange={(e) => setForm({ ...form, organization_number: e.target.value })}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-gray-700">{labels.vatNumber}</span>
            <input
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={form.vat_number}
              onChange={(e) => setForm({ ...form, vat_number: e.target.value })}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-gray-700">{labels.country}</span>
            <input
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value.toUpperCase() })}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-gray-700">{labels.billingEmail}</span>
            <input
              type="email"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={form.billing_email}
              onChange={(e) => setForm({ ...form, billing_email: e.target.value })}
            />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="font-medium text-gray-700">{labels.billingAddress}</span>
            <input
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={form.billing_address}
              onChange={(e) => setForm({ ...form, billing_address: e.target.value })}
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_primary}
              onChange={(e) => setForm({ ...form, is_primary: e.target.checked })}
            />
            {labels.isPrimary}
          </label>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {saving ? labels.saving : labels.save}
        </button>
        {message ? <p className="text-sm text-green-700">{message}</p> : null}
      </form>

      {audit.length > 0 ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.auditTitle}</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            {audit.map((row, i) => (
              <li key={i}>
                {String(row.summary ?? row.event_type)} · {String(row.created_at ?? "")}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
