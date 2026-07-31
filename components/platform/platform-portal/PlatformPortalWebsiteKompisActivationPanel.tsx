"use client";

import { useEffect, useState } from "react";
import type {
  PlatformPortalWebsiteKompisLabels,
  PlatformPortalWebsiteKompisStatus,
} from "@/lib/platform-portal";
import {
  createWebsiteKompisActivationIdempotencyKey,
  mapWebsiteKompisActivationRpcError,
  parsePlatformPortalWebsiteKompisStatus,
  reasonLabel,
  websiteKompisStatusVariant,
  type PlatformPortalWebsiteKompisErrorCode,
} from "@/lib/platform-portal/website-kompis-activation";
import { resolvePlatformStatusLabel } from "@/lib/platform-presentation-quality";

type Props = {
  open: boolean;
  customerId: string;
  status: PlatformPortalWebsiteKompisStatus | null;
  labels: PlatformPortalWebsiteKompisLabels;
  onClose: () => void;
  onSuccess: (message: string) => void;
};

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "error"; code: PlatformPortalWebsiteKompisErrorCode };

const BADGE: Record<string, string> = {
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200",
  warning:
    "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-200",
  danger:
    "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-700 dark:bg-rose-950/50 dark:text-rose-200",
  info: "border-violet-200 bg-violet-50 text-violet-800 dark:border-violet-700 dark:bg-violet-950/50 dark:text-violet-200",
  muted:
    "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-600 dark:bg-slate-800/70 dark:text-slate-200",
};

function errorMessage(
  labels: PlatformPortalWebsiteKompisLabels,
  code: PlatformPortalWebsiteKompisErrorCode,
): string {
  switch (code) {
    case "invalid_internal_reason":
      return labels.reasonRequired;
    case "confirmation_required":
      return labels.confirmRequired;
    case "unauthorized":
      return labels.unauthorized;
    case "forbidden":
      return labels.forbidden;
    case "prerequisites_not_met":
    case "commercial_plan_required":
    case "license_required":
    case "license_not_eligible":
    case "domain_required":
    case "installation_required":
    case "install_id_required":
      return labels.notEligible;
    default:
      return labels.error;
  }
}

function Row({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-2 last:border-0 dark:border-slate-800">
      <dt className="text-sm text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="text-right text-sm font-medium text-slate-900 dark:text-slate-100">
        {value?.trim() || "—"}
      </dd>
    </div>
  );
}

function StatusRow({
  label,
  status,
  labels,
}: {
  label: string;
  status: string | null | undefined;
  labels: PlatformPortalWebsiteKompisLabels;
}) {
  return (
    <Row
      label={label}
      value={resolvePlatformStatusLabel({
        status,
        labels: labels.presentationStatuses,
        unknownFallback: labels.unknownStatus,
        emptyFallback: labels.notConfigured,
      })}
    />
  );
}

export function PlatformPortalWebsiteKompisActivationPanel({
  open,
  customerId,
  status,
  labels,
  onClose,
  onSuccess,
}: Props) {
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [submit, setSubmit] = useState<SubmitState>({ kind: "idle" });
  const [idempotencyKey] = useState(() => createWebsiteKompisActivationIdempotencyKey());

  useEffect(() => {
    if (!open) return;
    setReason("");
    setConfirmed(false);
    setSubmit({ kind: "idle" });
  }, [open]);

  if (!open) return null;

  const statusLabel =
    labels.activationStatuses[status?.activationStatus ?? "not_ready"] ??
    labels.notReady;
  const busy = submit.kind === "submitting";
  const canSubmit =
    Boolean(status?.eligible) &&
    !status?.active &&
    reason.trim().length >= 3 &&
    confirmed &&
    !busy;

  async function submitActivation() {
    if (!canSubmit) {
      setSubmit({
        kind: "error",
        code:
          reason.trim().length < 3
            ? "invalid_internal_reason"
            : "confirmation_required",
      });
      return;
    }
    setSubmit({ kind: "submitting" });
    try {
      const response = await fetch(
        `/api/platform-portal/customers/${customerId}/website-kompis`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
          body: JSON.stringify({
            internalReason: reason.trim(),
            confirmation: true,
            idempotencyKey,
          }),
        },
      );
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          code?: string;
        } | null;
        const mapped = mapWebsiteKompisActivationRpcError(body?.code ?? "");
        setSubmit({
          kind: "error",
          code:
            (body?.code as PlatformPortalWebsiteKompisErrorCode | undefined) ??
            mapped.code,
        });
        return;
      }
      onSuccess(labels.success);
    } catch {
      setSubmit({ kind: "error", code: "unknown" });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 sm:items-center sm:p-6 dark:bg-black/60">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="wk-activation-title"
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6 dark:border-slate-700 dark:bg-slate-950"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="wk-activation-title"
              className="text-lg font-semibold text-slate-900 dark:text-slate-50"
            >
              {labels.activate}
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {labels.summary}
            </p>
          </div>
          <span
            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${BADGE[websiteKompisStatusVariant(status?.activationStatus)]}`}
          >
            {statusLabel}
          </span>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <section className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {labels.agreement}
            </h3>
            <dl className="mt-2">
              <StatusRow
                label={labels.statusLabel}
                status={status?.agreement.status}
                labels={labels}
              />
              <Row label={labels.setupStatus} value={status?.agreement.duration} />
            </dl>
          </section>
          <section className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {labels.licensePackage}
            </h3>
            <dl className="mt-2">
              <Row label={labels.licensePackage} value={labels.appLicense} />
              <StatusRow
                label={labels.statusLabel}
                status={status?.license.status}
                labels={labels}
              />
              <StatusRow
                label={labels.setupStatus}
                status={status?.license.provisioningStatus}
                labels={labels}
              />
            </dl>
          </section>
          <section className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {labels.domain}
            </h3>
            <dl className="mt-2">
              <Row
                label={labels.domain}
                value={status?.domain.hostname ?? labels.notLinked}
              />
              <StatusRow
                label={labels.statusLabel}
                status={status?.domain.status}
                labels={labels}
              />
              <Row
                label={labels.prerequisites}
                value={
                  status?.domain.verified
                    ? labels.reasonLabels.domain_verifiedOk
                    : labels.reasonLabels.domain_verifiedMissing
                }
              />
            </dl>
          </section>
          <section className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {labels.installation}
            </h3>
            <dl className="mt-2">
              <Row
                label={labels.installation}
                value={status?.installation.id ?? labels.notConfigured}
              />
              <Row
                label={labels.installKey}
                value={status?.installation.installId ?? labels.notConfigured}
              />
            </dl>
          </section>
        </div>

        <section className="mt-5 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {labels.prerequisites}
          </h3>
          <ul className="mt-3 space-y-2">
            {(status?.reasons ?? []).map((reasonItem) => (
              <li
                key={reasonItem.code}
                className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200"
              >
                <span
                  aria-hidden
                  className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                    reasonItem.satisfied ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
                <span>
                  {reasonLabel(
                    reasonItem.code,
                    labels.reasonLabels,
                    reasonItem.satisfied,
                  )}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <label className="mt-5 block text-sm font-medium text-slate-800 dark:text-slate-200">
          {labels.internalReason}
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            rows={3}
            disabled={busy}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none ring-violet-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </label>

        <section className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {labels.summaryTitle}
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
            <li>{labels.summaryActivates}</li>
            <li>{labels.summaryAgreementUnchanged}</li>
            <li>{labels.summaryLicenseUnchanged}</li>
            <li>{labels.summaryDomainUnchanged}</li>
            <li>{labels.summaryInstallationUnchanged}</li>
            <li>{labels.summaryNoPayment}</li>
            <li>{labels.summaryNoEmail}</li>
            <li>{labels.summaryNoDns}</li>
          </ul>
        </section>

        <label className="mt-4 flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
          <input
            type="checkbox"
            checked={confirmed}
            disabled={busy}
            onChange={(event) => setConfirmed(event.target.checked)}
            className="mt-0.5"
          />
          <span>{labels.confirmRequired}</span>
        </label>

        {submit.kind === "error" ? (
          <p className="mt-3 text-sm text-rose-700 dark:text-rose-300" role="alert">
            {errorMessage(labels, submit.code)}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {labels.cancel}
          </button>
          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => void submitActivation()}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? labels.activatingAction : labels.activate}
          </button>
        </div>
      </div>
    </div>
  );
}

export function parseWebsiteKompisClientStatus(
  value: unknown,
): PlatformPortalWebsiteKompisStatus | null {
  return parsePlatformPortalWebsiteKompisStatus(value);
}
