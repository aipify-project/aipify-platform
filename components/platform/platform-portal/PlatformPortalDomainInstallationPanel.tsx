"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  PlatformPortalCustomerDetailLicense,
  PlatformPortalDomainInstallationLabels,
  PlatformPortalEligibleLicense,
} from "@/lib/platform-portal";
import {
  createDomainInstallationIdempotencyKey,
  normalizeHostnamePreview,
  parsePlatformPortalCustomerDomainsPayload,
  type PlatformPortalDomainInstallationErrorCode,
} from "@/lib/platform-portal/domain-installation";

type Props = {
  open: boolean;
  customerId: string;
  existingLicenses: PlatformPortalCustomerDetailLicense[];
  labels: PlatformPortalDomainInstallationLabels;
  onClose: () => void;
  onSuccess: () => void;
};

type LoadState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "ready"; licenses: PlatformPortalEligibleLicense[] };

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "error"; code: PlatformPortalDomainInstallationErrorCode };

function errorMessage(
  labels: PlatformPortalDomainInstallationLabels,
  code: PlatformPortalDomainInstallationErrorCode,
): string {
  switch (code) {
    case "domain_already_exists":
      return labels.domainAlreadyRegistered;
    case "license_domain_conflict":
      return labels.licenseAlreadyHasDomain;
    case "invalid_hostname":
      return labels.hostnameInvalid;
    case "license_not_eligible":
    case "commercial_plan_required":
      return labels.noEligibleLicenses;
    case "invalid_internal_reason":
      return labels.reasonRequired;
    case "unauthorized":
      return labels.unauthorized;
    case "forbidden":
      return labels.forbidden;
    default:
      return labels.createError;
  }
}

function statusLabel(
  status: string | null | undefined,
  map: Record<string, string>,
  fallback: string,
): string {
  if (!status) return fallback;
  return map[status.toLowerCase()] ?? map[status] ?? fallback;
}

export function PlatformPortalDomainInstallationPanel({
  open,
  customerId,
  existingLicenses,
  labels,
  onClose,
  onSuccess,
}: Props) {
  const [loadState, setLoadState] = useState<LoadState>({ kind: "loading" });
  const [selectedLicenseId, setSelectedLicenseId] = useState<string | null>(null);
  const [hostname, setHostname] = useState("");
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [submit, setSubmit] = useState<SubmitState>({ kind: "idle" });
  const [idempotencyKey] = useState(() => createDomainInstallationIdempotencyKey());

  const canonical = useMemo(() => normalizeHostnamePreview(hostname), [hostname]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    async function loadEligible() {
      setLoadState({ kind: "loading" });
      try {
        const response = await fetch(`/api/platform-portal/customers/${customerId}/domains`, {
          cache: "no-store",
        });
        if (response.status === 401) {
          setSubmit({ kind: "error", code: "unauthorized" });
          return;
        }
        if (response.status === 403) {
          setSubmit({ kind: "error", code: "forbidden" });
          return;
        }
        if (!response.ok) {
          if (!cancelled) setLoadState({ kind: "error" });
          return;
        }
        const payload = parsePlatformPortalCustomerDomainsPayload(await response.json());
        if (cancelled) return;
        const eligible = payload.eligibleLicenses.filter((license) => license.eligible);
        setLoadState({ kind: "ready", licenses: eligible });
        setSelectedLicenseId(eligible[0]?.id ?? null);
      } catch {
        if (!cancelled) setLoadState({ kind: "error" });
      }
    }

    void loadEligible();
    return () => {
      cancelled = true;
    };
  }, [open, customerId]);

  const noEligible =
    loadState.kind === "ready" && loadState.licenses.length === 0;
  const conflictingLicenses = existingLicenses.filter(
    (license) =>
      (license.productCode ?? "").toLowerCase() === "app_subscription" &&
      Boolean(license.domain?.trim()),
  );
  const domainConflict = conflictingLicenses.length > 0;
  const blocked = noEligible || domainConflict;

  const canSubmit =
    !blocked &&
    loadState.kind === "ready" &&
    selectedLicenseId != null &&
    canonical != null &&
    reason.trim().length >= 3 &&
    confirmed &&
    submit.kind !== "submitting";

  async function handleSubmit() {
    if (!canSubmit || !selectedLicenseId || !canonical) return;
    setSubmit({ kind: "submitting" });
    try {
      const response = await fetch(
        `/api/platform-portal/customers/${customerId}/domain-installation`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
          body: JSON.stringify({
            licenseId: selectedLicenseId,
            hostname: canonical,
            internalReason: reason.trim(),
            idempotencyKey,
          }),
        },
      );

      if (response.status === 401) {
        setSubmit({ kind: "error", code: "unauthorized" });
        return;
      }
      if (response.status === 403) {
        setSubmit({ kind: "error", code: "forbidden" });
        return;
      }

      const body = (await response.json().catch(() => null)) as {
        code?: PlatformPortalDomainInstallationErrorCode;
      } | null;

      if (!response.ok) {
        setSubmit({ kind: "error", code: body?.code ?? "unknown" });
        return;
      }

      onSuccess();
    } catch {
      setSubmit({ kind: "error", code: "unknown" });
    }
  }

  if (!open) return null;

  const productName = (license: {
    productCode: string | null;
    productName: string | null;
  }) => {
    const code = (license.productCode ?? "").toLowerCase();
    if (code === "app_subscription" && labels.productNames.app_subscription) {
      return labels.productNames.app_subscription;
    }
    const raw = (license.productName ?? "").trim();
    if (raw.toLowerCase() === "lifetime") {
      return labels.productNames.app_subscription ?? raw;
    }
    return raw || license.productCode || labels.selectLicense;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 sm:items-center sm:p-6 dark:bg-black/60">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="domain-installation-title"
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border border-slate-200 bg-white shadow-2xl sm:rounded-2xl dark:border-slate-700 dark:bg-slate-950"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div>
            <h2
              id="domain-installation-title"
              className="text-lg font-semibold text-slate-900 dark:text-slate-50"
            >
              {labels.title}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {domainConflict ? labels.conflictReadOnly : labels.summaryCreates}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {domainConflict ? labels.close : labels.cancel}
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          {domainConflict ? (
            <>
              <div className="rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
                {labels.conflictReadOnly}
              </div>
              <ul className="space-y-2">
                {conflictingLicenses.map((license) => (
                  <li
                    key={license.id}
                    className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-700"
                  >
                    <p className="font-medium text-slate-900 dark:text-slate-50">
                      {productName(license)}
                    </p>
                    <p className="mt-1 text-slate-600 dark:text-slate-300">
                      {labels.hostname}: {license.domain}
                    </p>
                    {license.installId ? (
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {labels.installId}: {license.installId}
                      </p>
                    ) : null}
                    {license.provisioningStatus ? (
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {statusLabel(
                          license.provisioningStatus,
                          labels.provisioningStatuses,
                          labels.waitingVerification,
                        )}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              {loadState.kind === "loading" ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">{labels.loadingEligible}</p>
              ) : null}
              {loadState.kind === "error" ? (
                <p className="text-sm text-rose-700 dark:text-rose-300">{labels.loadDomainsError}</p>
              ) : null}
              {noEligible ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
                  {labels.noEligibleLicenses}
                </div>
              ) : null}

              {loadState.kind === "ready" && loadState.licenses.length > 0 ? (
                <section className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {labels.eligibleLicenses}
                  </h3>
                  {loadState.licenses.map((license) => {
                    const selected = selectedLicenseId === license.id;
                    return (
                      <button
                        key={license.id}
                        type="button"
                        onClick={() => setSelectedLicenseId(license.id)}
                        className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                          selected
                            ? "border-violet-400 bg-violet-50/80 ring-2 ring-violet-300 dark:border-violet-500 dark:bg-violet-950/40 dark:ring-violet-700"
                            : "border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
                        }`}
                      >
                        <p className="font-medium text-slate-900 dark:text-slate-50">
                          {productName(license)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {statusLabel(
                            license.provisioningStatus,
                            labels.provisioningStatuses,
                            labels.waitingVerification,
                          )}
                        </p>
                      </button>
                    );
                  })}
                </section>
              ) : null}

              <section className="space-y-2">
                <label
                  htmlFor="domain-hostname"
                  className="text-sm font-semibold text-slate-800 dark:text-slate-100"
                >
                  {labels.hostname}
                </label>
                <input
                  id="domain-hostname"
                  value={hostname}
                  disabled={blocked || submit.kind === "submitting"}
                  onChange={(event) => setHostname(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-violet-400 focus:ring-2 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  placeholder="example.com"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {labels.canonicalHostname}:{" "}
                  <span className="font-mono text-slate-700 dark:text-slate-200">
                    {canonical ?? "—"}
                  </span>
                </p>
                {hostname.trim() && !canonical ? (
                  <p className="text-xs text-amber-700 dark:text-amber-300">{labels.hostnameInvalid}</p>
                ) : null}
              </section>

              <section className="space-y-2">
                <label
                  htmlFor="domain-internal-reason"
                  className="text-sm font-semibold text-slate-800 dark:text-slate-100"
                >
                  {labels.internalReason}
                </label>
                <textarea
                  id="domain-internal-reason"
                  value={reason}
                  disabled={blocked || submit.kind === "submitting"}
                  onChange={(event) => setReason(event.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-violet-400 focus:ring-2 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </section>

              <section className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/50">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {labels.summary}
                </h3>
                <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                  <li>{labels.summaryCreates}</li>
                  <li>{labels.domainNotAutoVerified}</li>
                  <li>{labels.dnsNotChanged}</li>
                  <li>{labels.websiteKompisNotActivated}</li>
                </ul>
                <label className="mt-2 flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    disabled={blocked || submit.kind === "submitting"}
                    onChange={(event) => setConfirmed(event.target.checked)}
                    className="mt-0.5"
                  />
                  <span>{labels.confirmRequired}</span>
                </label>
              </section>

              {submit.kind === "error" ? (
                <p className="text-sm text-rose-700 dark:text-rose-300">
                  {errorMessage(labels, submit.code)}
                </p>
              ) : null}
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
          {domainConflict ? (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-500 dark:bg-violet-500 dark:hover:bg-violet-400"
            >
              {labels.close}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {labels.cancel}
              </button>
              <button
                type="button"
                disabled={!canSubmit}
                onClick={() => void handleSubmit()}
                className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-violet-500 dark:hover:bg-violet-400"
              >
                {submit.kind === "submitting" ? labels.creating : labels.create}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

