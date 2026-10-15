"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { previewContactEmailDecision } from "@/lib/platform-portal/customer-identity";
import type { PlatformCustomerIdentityPayload } from "@/lib/platform-portal/customer-identity";
import {
  customerIdentityErrorLabel,
  type PlatformCustomerIdentityLabels,
} from "@/lib/platform-portal/customer-identity-labels";

type Props = {
  customerId: string;
  labels: PlatformCustomerIdentityLabels;
};

type LoadState =
  | { kind: "loading" }
  | { kind: "error"; code?: string }
  | { kind: "success"; data: PlatformCustomerIdentityPayload };

function newIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `pci-${crypto.randomUUID()}`;
  }
  return `pci-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function PlatformPortalCustomerIdentityPanel({ customerId, labels }: Props) {
  const formId = useId();
  const [loadState, setLoadState] = useState<LoadState>({ kind: "loading" });
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState(newIdempotencyKey);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoadState({ kind: "loading" });
    setActionError(null);
    setSuccessMessage(null);
    try {
      const res = await fetch(`/api/platform-portal/customers/${customerId}/identity`, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      const body = (await res.json().catch(() => null)) as
        | PlatformCustomerIdentityPayload
        | { error?: string; code?: string }
        | null;
      if (!res.ok) {
        setLoadState({
          kind: "error",
          code: body && "code" in body ? body.code : undefined,
        });
        return;
      }
      const data = body as PlatformCustomerIdentityPayload;
      setLoadState({ kind: "success", data });
      setEmail(data.contactEmail ?? "");
      setIdempotencyKey(newIdempotencyKey());
      setConfirmed(false);
      setReason("");
    } catch {
      setLoadState({ kind: "error" });
    }
  }, [customerId]);

  useEffect(() => {
    void load();
  }, [load]);

  const isInternal =
    loadState.kind === "success" ? loadState.data.isInternalAipifyIdentity : false;

  const preview = useMemo(
    () => previewContactEmailDecision(email, isInternal),
    [email, isInternal],
  );

  const domainStatus = !email.trim()
    ? null
    : !preview.ok && preview.kind === "forbidden_unowned"
      ? { tone: "danger" as const, text: labels.domainStatusForbidden }
      : !preview.ok && preview.kind === "internal_requires_owned"
        ? { tone: "danger" as const, text: labels.domainStatusNeedsOwned }
        : !preview.ok
          ? { tone: "danger" as const, text: labels.invalidEmail }
          : { tone: "success" as const, text: labels.domainStatusOk };

  async function onSave() {
    if (loadState.kind !== "success") return;
    setSaving(true);
    setActionError(null);
    setSuccessMessage(null);
    try {
      const res = await fetch(`/api/platform-portal/customers/${customerId}/identity`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          expectedCurrentEmail: loadState.data.contactEmail ?? "",
          confirmation: confirmed,
          reason: reason.trim(),
          idempotencyKey,
        }),
      });
      const body = (await res.json().catch(() => null)) as {
        result?: string;
        code?: string;
        error?: string;
      } | null;
      if (!res.ok) {
        setActionError(customerIdentityErrorLabel(body?.code, labels));
        return;
      }
      setSuccessMessage(
        body?.result === "idempotent_replay" ? labels.successReplay : labels.success,
      );
      setIdempotencyKey(newIdempotencyKey());
      setConfirmed(false);
      await load();
    } catch {
      setActionError(labels.loadError);
    } finally {
      setSaving(false);
    }
  }

  if (loadState.kind === "loading") {
    return (
      <section
        className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900"
        aria-busy="true"
        aria-live="polite"
      >
        <AipifyLoader centered />
        <span className="sr-only">{labels.saving}</span>
      </section>
    );
  }

  if (loadState.kind === "error") {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{labels.title}</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300" role="alert">
          {customerIdentityErrorLabel(loadState.code, labels)}
        </p>
        <button
          type="button"
          onClick={() => void load()}
          className="mt-4 rounded-lg bg-violet-700 px-4 py-2 text-sm font-medium text-white hover:bg-violet-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
        >
          {labels.retry}
        </button>
      </section>
    );
  }

  const data = loadState.data;

  return (
    <section
      className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900"
      aria-labelledby={`${formId}-title`}
    >
      <h2 id={`${formId}-title`} className="text-lg font-semibold text-slate-900 dark:text-slate-100">
        {labels.title}
      </h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{labels.description}</p>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {labels.currentEmail}
          </dt>
          <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
            {data.contactEmail || "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {labels.emailDomain}
          </dt>
          <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
            {data.emailDomain || "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {data.isInternalAipifyIdentity ? labels.internalIdentity : labels.externalIdentity}
          </dt>
          <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
            {data.forbiddenUnownedDomain
              ? labels.forbiddenDomain
              : data.ownedAipifyDomain
                ? labels.ownedDomain
                : labels.domainStatusOk}
          </dd>
        </div>
      </dl>

      <div className="mt-6 space-y-4">
        <div>
          <label
            htmlFor={`${formId}-email`}
            className="block text-sm font-medium text-slate-800 dark:text-slate-200"
          >
            {labels.targetEmail}
          </label>
          <input
            id={`${formId}-email`}
            type="email"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
          />
          {domainStatus ? (
            <p
              className={
                domainStatus.tone === "danger"
                  ? "mt-1 text-sm text-rose-700 dark:text-rose-300"
                  : "mt-1 text-sm text-emerald-700 dark:text-emerald-300"
              }
              role={domainStatus.tone === "danger" ? "alert" : "status"}
            >
              {domainStatus.text}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor={`${formId}-reason`}
            className="block text-sm font-medium text-slate-800 dark:text-slate-200"
          >
            {labels.reason}
          </label>
          <textarea
            id={`${formId}-reason`}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder={labels.reasonPlaceholder}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950/60">
          <label className="flex items-start gap-3 text-sm text-slate-800 dark:text-slate-200">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
            />
            <span>
              <span className="font-medium">{labels.confirmation}</span>
              <span className="mt-1 block text-slate-600 dark:text-slate-400">
                {labels.confirmationHelp}
              </span>
            </span>
          </label>
        </div>

        {actionError ? (
          <p className="text-sm text-rose-700 dark:text-rose-300" role="alert">
            {actionError}
          </p>
        ) : null}
        {successMessage ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100" role="status">
            <p>{successMessage}</p>
            <p className="mt-1">{labels.noEmailSent}</p>
            <p>{labels.authUnchanged}</p>
            <p>{labels.billingUnchanged}</p>
            <p>{labels.auditNote}</p>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => void onSave()}
            disabled={saving || !confirmed || !email.trim() || reason.trim().length < 3}
            className="inline-flex items-center justify-center rounded-lg bg-violet-700 px-4 py-2 text-sm font-medium text-white hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          >
            {saving ? labels.saving : labels.save}
          </button>
          {saving ? <AipifyLoader /> : null}
        </div>
      </div>
    </section>
  );
}
