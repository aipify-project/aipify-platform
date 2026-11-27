"use client";

import { useState } from "react";

export type PrimaryContactEditLabels = {
  editContact: string;
  saveContact: string;
  cancel: string;
  reasonLabel: string;
  reasonPlaceholder: string;
  ticketLabel: string;
  ticketPlaceholder: string;
  confirmLabel: string;
  success: string;
  errorGeneric: string;
  errorForbidden: string;
  errorPhone: string;
  errorCoreGatePending: string;
  primaryContactName: string;
  primaryContactPhone: string;
};

type Props = {
  customerId: string;
  initialName: string;
  initialPhone: string;
  labels: PrimaryContactEditLabels;
  onSaved: (next: { fullName: string; phone: string }) => void;
};

export function PrimaryContactEditCard({
  customerId,
  initialName,
  initialPhone,
  labels,
  onSaved,
}: Props) {
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [reason, setReason] = useState("");
  const [ticket, setTicket] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function reset() {
    setFullName(initialName);
    setPhone(initialPhone);
    setReason("");
    setTicket("");
    setConfirmed(false);
    setError(null);
  }

  async function save() {
    if (busy) return;
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(
        `/api/platform-portal/customers/${customerId}/primary-contact`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName,
            phone,
            confirmation: confirmed,
            internalReason: reason,
            supportTicketReference: ticket || null,
          }),
        },
      );
      const body = (await res.json().catch(() => ({}))) as {
        code?: string;
        ok?: boolean;
        next?: { fullName?: string | null; phone?: string | null };
      };
      if (!res.ok || body.ok !== true) {
        if (body.code === "forbidden") setError(labels.errorForbidden);
        else if (body.code === "invalid_phone") setError(labels.errorPhone);
        else if (body.code === "core_gate_pending") setError(labels.errorCoreGatePending);
        else setError(labels.errorGeneric);
        setBusy(false);
        return;
      }
      const nextName = body.next?.fullName?.trim() || fullName;
      const nextPhone = body.next?.phone?.trim() || phone;
      onSaved({ fullName: nextName, phone: nextPhone });
      setSuccess(labels.success);
      setOpen(false);
      reset();
    } catch {
      setError(labels.errorGeneric);
    } finally {
      setBusy(false);
    }
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
          {labels.editContact}
        </button>
        {success ? (
          <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300" role="status">
            {success}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-3 rounded-xl border border-violet-200 bg-violet-50/40 p-3 dark:border-violet-800 dark:bg-violet-950/20">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-200">
            {labels.primaryContactName}
          </span>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-200">
            {labels.primaryContactPhone}
          </span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+47…"
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
      </div>
      <label className="block text-sm">
        <span className="font-medium text-slate-700 dark:text-slate-200">
          {labels.reasonLabel}
        </span>
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={labels.reasonPlaceholder}
          className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
        />
      </label>
      <label className="block text-sm">
        <span className="font-medium text-slate-700 dark:text-slate-200">
          {labels.ticketLabel}
        </span>
        <input
          value={ticket}
          onChange={(e) => setTicket(e.target.value)}
          placeholder={labels.ticketPlaceholder}
          className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
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
      {error ? (
        <p className="text-sm text-rose-700 dark:text-rose-300" role="alert">
          {error}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy || !confirmed || reason.trim().length < 3}
          onClick={() => void save()}
          className="inline-flex min-h-9 items-center justify-center rounded-lg bg-[#7C3AED] px-3 text-xs font-semibold text-white disabled:opacity-60"
        >
          {labels.saveContact}
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
