"use client";

import { useState } from "react";
import { COMPANY_ADDRESS_WRITE_CORE_LIVE } from "@/lib/platform-portal/customer-company-address-write";

export type CompanyAddressEditLabels = {
  editCompany: string;
  saveChanges: string;
  cancel: string;
  reasonLabel: string;
  reasonPlaceholder: string;
  ticketLabel: string;
  ticketPlaceholder: string;
  confirmLabel: string;
  confirmInvoiceLabel: string;
  copyCompanyToInvoice: string;
  displayName: string;
  companyPhone: string;
  website: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  invoiceTitle: string;
  legalLockedNote: string;
  coreGateLocked: string;
  success: string;
  errorGeneric: string;
  errorForbidden: string;
  errorValidation: string;
  errorCoreGatePending: string;
};

type InitialValues = {
  displayName: string;
  website: string;
  companyPhone: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  invoiceStreet: string;
  invoicePostalCode: string;
  invoiceCity: string;
  invoiceCountry: string;
};

type Props = {
  customerId: string;
  initial: InitialValues;
  labels: CompanyAddressEditLabels;
  onSaved: () => void;
};

export function CompanyAddressEditCard({ customerId, initial, labels, onSaved }: Props) {
  const [open, setOpen] = useState(false);
  const [displayName, setDisplayName] = useState(initial.displayName);
  const [website, setWebsite] = useState(initial.website);
  const [companyPhone, setCompanyPhone] = useState(initial.companyPhone);
  const [street, setStreet] = useState(initial.street);
  const [postalCode, setPostalCode] = useState(initial.postalCode);
  const [city, setCity] = useState(initial.city);
  const [country, setCountry] = useState(initial.country);
  const [invoiceStreet, setInvoiceStreet] = useState(initial.invoiceStreet);
  const [invoicePostalCode, setInvoicePostalCode] = useState(initial.invoicePostalCode);
  const [invoiceCity, setInvoiceCity] = useState(initial.invoiceCity);
  const [invoiceCountry, setInvoiceCountry] = useState(initial.invoiceCountry);
  const [copyInvoice, setCopyInvoice] = useState(false);
  const [reason, setReason] = useState("");
  const [ticket, setTicket] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [confirmInvoice, setConfirmInvoice] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function reset() {
    setDisplayName(initial.displayName);
    setWebsite(initial.website);
    setCompanyPhone(initial.companyPhone);
    setStreet(initial.street);
    setPostalCode(initial.postalCode);
    setCity(initial.city);
    setCountry(initial.country);
    setInvoiceStreet(initial.invoiceStreet);
    setInvoicePostalCode(initial.invoicePostalCode);
    setInvoiceCity(initial.invoiceCity);
    setInvoiceCountry(initial.invoiceCountry);
    setCopyInvoice(false);
    setReason("");
    setTicket("");
    setConfirmed(false);
    setConfirmInvoice(false);
    setError(null);
  }

  async function save() {
    if (busy) return;
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(
        `/api/platform-portal/customers/${customerId}/company-address`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            displayName,
            website,
            companyPhone,
            street,
            postalCode,
            city,
            country,
            updateCompany: true,
            invoiceStreet,
            invoicePostalCode,
            invoiceCity,
            invoiceCountry,
            updateInvoice: true,
            copyCompanyToInvoice: copyInvoice,
            confirmation: confirmed && confirmInvoice,
            internalReason: reason,
            supportTicketReference: ticket || null,
          }),
        },
      );
      const body = (await res.json().catch(() => ({}))) as {
        code?: string;
        ok?: boolean;
      };
      if (!res.ok || body.ok !== true) {
        if (body.code === "forbidden") setError(labels.errorForbidden);
        else if (body.code === "core_gate_pending") setError(labels.errorCoreGatePending);
        else if (
          body.code?.startsWith("invalid_") ||
          body.code === "confirmation_required" ||
          body.code === "nothing_to_update"
        ) {
          setError(labels.errorValidation);
        } else setError(labels.errorGeneric);
        setBusy(false);
        return;
      }
      onSaved();
      setSuccess(labels.success);
      setOpen(false);
      reset();
    } catch {
      setError(labels.errorGeneric);
    } finally {
      setBusy(false);
    }
  }

  if (!COMPANY_ADDRESS_WRITE_CORE_LIVE) {
    return (
      <div className="mt-3 space-y-2">
        <button
          type="button"
          disabled
          className="inline-flex min-h-9 cursor-not-allowed items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
        >
          {labels.editCompany}
        </button>
        <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-200" role="status">
          {labels.coreGateLocked}
        </p>
        {success ? (
          <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300" role="status">
            {success}
          </p>
        ) : null}
      </div>
    );
  }

  if (!open) {
    return (
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            reset();
            setOpen(true);
          }}
          className="inline-flex min-h-9 items-center justify-center rounded-lg border border-violet-200 bg-white px-3 text-xs font-semibold text-[#7C3AED] transition hover:bg-violet-50 dark:border-violet-800 dark:bg-slate-950 dark:hover:bg-violet-950/40"
        >
          {labels.editCompany}
        </button>
        {success ? (
          <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300" role="status">
            {success}
          </p>
        ) : null}
      </div>
    );
  }

  const fieldClass =
    "mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950";

  return (
    <div className="mt-3 space-y-4 rounded-xl border border-violet-200 bg-violet-50/40 p-3 dark:border-violet-800 dark:bg-violet-950/20">
      <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">{labels.legalLockedNote}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-200">{labels.displayName}</span>
          <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className={fieldClass} />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-200">{labels.companyPhone}</span>
          <input value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} className={fieldClass} placeholder="+47…" />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="font-medium text-slate-700 dark:text-slate-200">{labels.website}</span>
          <input value={website} onChange={(e) => setWebsite(e.target.value)} className={fieldClass} />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="font-medium text-slate-700 dark:text-slate-200">{labels.street}</span>
          <input value={street} onChange={(e) => setStreet(e.target.value)} className={fieldClass} />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-200">{labels.postalCode}</span>
          <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className={fieldClass} />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-200">{labels.city}</span>
          <input value={city} onChange={(e) => setCity(e.target.value)} className={fieldClass} />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-200">{labels.country}</span>
          <input value={country} onChange={(e) => setCountry(e.target.value)} className={fieldClass} maxLength={2} />
        </label>
      </div>

      <div className="border-t border-violet-100 pt-3 dark:border-violet-900">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{labels.invoiceTitle}</p>
        <label className="mt-2 flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
          <input
            type="checkbox"
            checked={copyInvoice}
            onChange={(e) => {
              const next = e.target.checked;
              setCopyInvoice(next);
              if (next) {
                setInvoiceStreet(street);
                setInvoicePostalCode(postalCode);
                setInvoiceCity(city);
                setInvoiceCountry(country);
              }
            }}
            className="mt-1"
          />
          <span>{labels.copyCompanyToInvoice}</span>
        </label>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="block text-sm sm:col-span-2">
            <span className="font-medium text-slate-700 dark:text-slate-200">{labels.street}</span>
            <input
              value={invoiceStreet}
              disabled={copyInvoice}
              onChange={(e) => setInvoiceStreet(e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700 dark:text-slate-200">{labels.postalCode}</span>
            <input
              value={invoicePostalCode}
              disabled={copyInvoice}
              onChange={(e) => setInvoicePostalCode(e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700 dark:text-slate-200">{labels.city}</span>
            <input
              value={invoiceCity}
              disabled={copyInvoice}
              onChange={(e) => setInvoiceCity(e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700 dark:text-slate-200">{labels.country}</span>
            <input
              value={invoiceCountry}
              disabled={copyInvoice}
              onChange={(e) => setInvoiceCountry(e.target.value)}
              className={fieldClass}
              maxLength={2}
            />
          </label>
        </div>
      </div>

      <label className="block text-sm">
        <span className="font-medium text-slate-700 dark:text-slate-200">{labels.reasonLabel}</span>
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={labels.reasonPlaceholder}
          className={fieldClass}
        />
      </label>
      <label className="block text-sm">
        <span className="font-medium text-slate-700 dark:text-slate-200">{labels.ticketLabel}</span>
        <input
          value={ticket}
          onChange={(e) => setTicket(e.target.value)}
          placeholder={labels.ticketPlaceholder}
          className={fieldClass}
        />
      </label>
      <label className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="mt-1"
        />
        <span>{labels.confirmLabel}</span>
      </label>
      <label className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
        <input
          type="checkbox"
          checked={confirmInvoice}
          onChange={(e) => setConfirmInvoice(e.target.checked)}
          className="mt-1"
        />
        <span>{labels.confirmInvoiceLabel}</span>
      </label>
      {error ? (
        <p className="text-sm text-rose-700 dark:text-rose-300" role="alert">
          {error}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy || !confirmed || !confirmInvoice || reason.trim().length < 3}
          onClick={() => void save()}
          className="inline-flex min-h-9 items-center justify-center rounded-lg bg-[#7C3AED] px-3 text-xs font-semibold text-white disabled:opacity-60"
        >
          {labels.saveChanges}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            setOpen(false);
            reset();
          }}
          className="inline-flex min-h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
        >
          {labels.cancel}
        </button>
      </div>
    </div>
  );
}
