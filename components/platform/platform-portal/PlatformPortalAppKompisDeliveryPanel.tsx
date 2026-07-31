"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import type { PlatformPortalAppKompisDeliveryLabels } from "@/lib/platform-portal";
import {
  appKompisDeliveryReasonLabel,
  createAppKompisDeliveryIdempotencyKey,
  deliveryStatusVariant,
  mapAppKompisDeliveryRpcError,
  parsePlatformPortalAppKompisDeliveryResult,
  parsePlatformPortalAppKompisDeliveryStatus,
  parsePlatformPortalAppKompisReconcileResult,
  type PlatformPortalAppKompisDeliveryStatusPayload,
  type PlatformPortalAppKompisErrorCode,
} from "@/lib/platform-portal/app-kompis-delivery";
import {
  formatPlatformDateTimeFull,
  resolvePlatformStatusLabel,
  resolvePlatformStatusSeverity,
} from "@/lib/platform-presentation-quality";

type Props = {
  customerId: string;
  labels: PlatformPortalAppKompisDeliveryLabels;
  locale: string;
};

type LoadState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "unauthorized" }
  | { kind: "forbidden" }
  | { kind: "success"; data: PlatformPortalAppKompisDeliveryStatusPayload };

type ModalMode = "deliver" | "reconcile";

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "error"; code: PlatformPortalAppKompisErrorCode };

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

function Badge({ label, variant }: { label: string; variant: string }) {
  return (
    <span
      title={label}
      aria-label={label}
      className={`inline-flex max-w-full items-center rounded-md border px-2 py-0.5 text-xs font-medium ${BADGE[variant] ?? BADGE.muted}`}
    >
      <span className="truncate">{label}</span>
    </span>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-2 last:border-0 dark:border-slate-800">
      <dt className="text-sm text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="text-right text-sm font-medium text-slate-900 dark:text-slate-100">
        {children}
      </dd>
    </div>
  );
}

function errorMessage(
  labels: PlatformPortalAppKompisDeliveryLabels,
  code: PlatformPortalAppKompisErrorCode,
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
    case "parent_license_required":
    case "parent_license_not_eligible":
    case "app_panel_required":
    case "child_entitlement_required":
    case "domain_required":
    case "installation_required":
    case "install_id_required":
      return labels.notEligible;
    default:
      return labels.error;
  }
}

function primaryAction(
  data: PlatformPortalAppKompisDeliveryStatusPayload,
): "deliver" | "reconcile" | "verify" | "blocked" {
  if (data.blocked) return "blocked";
  if (data.deliveryStatus === "active") return "verify";
  if (
    data.deliveryStatus === "attention" ||
    data.deliveryStatus === "failed" ||
    data.deliveryStatus === "suspended" ||
    data.deliveryStatus === "revoked"
  ) {
    return "reconcile";
  }
  if (data.eligible) return "deliver";
  return "blocked";
}

function DeliveryModal({
  open,
  mode,
  customerId,
  data,
  labels,
  onClose,
  onSuccess,
}: {
  open: boolean;
  mode: ModalMode;
  customerId: string;
  data: PlatformPortalAppKompisDeliveryStatusPayload | null;
  labels: PlatformPortalAppKompisDeliveryLabels;
  onClose: () => void;
  onSuccess: (message: string) => void;
}) {
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [submit, setSubmit] = useState<SubmitState>({ kind: "idle" });
  const [idempotencyKey, setIdempotencyKey] = useState(() =>
    createAppKompisDeliveryIdempotencyKey(),
  );

  useEffect(() => {
    if (!open) return;
    setReason("");
    setConfirmed(false);
    setSubmit({ kind: "idle" });
    setIdempotencyKey(createAppKompisDeliveryIdempotencyKey());
  }, [open]);

  if (!open) return null;

  const busy = submit.kind === "submitting";
  const canSubmit = reason.trim().length >= 3 && confirmed && !busy;
  const title = mode === "deliver" ? labels.deliver : labels.reconcile;

  async function submitAction() {
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
      const path =
        mode === "deliver"
          ? `/api/platform-portal/customers/${customerId}/app-kompis-delivery`
          : `/api/platform-portal/customers/${customerId}/app-kompis-delivery/reconcile`;
      const response = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          internalReason: reason.trim(),
          confirmation: true,
          idempotencyKey,
        }),
      });
      const body = (await response.json().catch(() => null)) as {
        code?: string;
      } | null;
      if (!response.ok) {
        const mapped = mapAppKompisDeliveryRpcError(body?.code ?? "");
        setSubmit({
          kind: "error",
          code:
            (body?.code as PlatformPortalAppKompisErrorCode | undefined) ??
            mapped.code,
        });
        return;
      }
      const parsed =
        mode === "deliver"
          ? parsePlatformPortalAppKompisDeliveryResult(body)
          : parsePlatformPortalAppKompisReconcileResult(body);
      onSuccess(
        parsed?.deliveryStatus === "awaiting_confirmation"
          ? labels.alreadyActive
          : mode === "deliver"
            ? labels.success
            : labels.reconcileSuccess,
      );
    } catch {
      setSubmit({ kind: "error", code: "unknown" });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 sm:items-center sm:p-6 dark:bg-black/60">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="akd-modal-title"
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6 dark:border-slate-700 dark:bg-slate-950"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="akd-modal-title"
              className="text-lg font-semibold text-slate-900 dark:text-slate-50"
            >
              {labels.modalTitle}
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {title}
            </p>
          </div>
          <Badge
            label={
              labels.deliveryStatuses[data?.deliveryStatus ?? "not_started"] ??
              labels.deliveryStatuses.not_started
            }
            variant={deliveryStatusVariant(data?.deliveryStatus)}
          />
        </div>

        <ol className="mt-5 space-y-2 rounded-xl border border-slate-200 p-4 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-200">
          <li>1. {labels.modalSteps.checkingRequirements}</li>
          <li>2. {labels.modalSteps.provisioningApp}</li>
          <li>3. {labels.modalSteps.provisioningCompanion}</li>
          <li>4. {labels.modalSteps.installing}</li>
        </ol>

        {data?.reasons?.length ? (
          <section className="mt-5 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {labels.prerequisites}
            </h3>
            <ul className="mt-3 space-y-2">
              {data.reasons.map((reasonItem) => (
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
                    {appKompisDeliveryReasonLabel(
                      reasonItem.code,
                      labels.reasonLabels,
                      reasonItem.satisfied,
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

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
            <li>{labels.summaryDelivers}</li>
            <li>{labels.summaryAppProvisioned}</li>
            <li>{labels.summaryCompanionInstalled}</li>
            <li>{labels.summaryAutoInstallEnabled}</li>
            <li>{labels.summaryAcknowledgementVerified}</li>
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
            onClick={() => void submitAction()}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy
              ? mode === "deliver"
                ? labels.delivering
                : labels.reconciling
              : labels.startDelivery}
          </button>
        </div>
      </div>
    </div>
  );
}

export function PlatformPortalAppKompisDeliveryPanel({
  customerId,
  labels,
  locale,
}: Props) {
  const [loadState, setLoadState] = useState<LoadState>({ kind: "loading" });
  const [modal, setModal] = useState<{ open: boolean; mode: ModalMode }>({
    open: false,
    mode: "deliver",
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  const load = useCallback(async () => {
    setLoadState((prev) => (prev.kind === "success" ? prev : { kind: "loading" }));
    try {
      const response = await fetch(
        `/api/platform-portal/customers/${customerId}/app-kompis-delivery`,
        { cache: "no-store" },
      );
      if (response.status === 401) {
        setLoadState({ kind: "unauthorized" });
        return;
      }
      if (response.status === 403) {
        setLoadState({ kind: "forbidden" });
        return;
      }
      if (!response.ok) {
        setLoadState({ kind: "error" });
        return;
      }
      const body: unknown = await response.json();
      const parsed = parsePlatformPortalAppKompisDeliveryStatus(body);
      if (!parsed) {
        setLoadState({ kind: "error" });
        return;
      }
      setLoadState({ kind: "success", data: parsed });
    } catch {
      setLoadState({ kind: "error" });
    }
  }, [customerId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleVerify() {
    setVerifying(true);
    await load();
    setVerifying(false);
  }

  if (loadState.kind === "loading") {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-950/40">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {labels.sectionTitle}
        </h2>
        <div className="flex min-h-[10rem] items-center justify-center">
          <AipifyLoader centered />
        </div>
      </section>
    );
  }

  if (loadState.kind === "unauthorized" || loadState.kind === "forbidden") {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-950/40">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {labels.sectionTitle}
        </h2>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          {loadState.kind === "unauthorized" ? labels.unauthorized : labels.forbidden}
        </p>
      </section>
    );
  }

  if (loadState.kind === "error") {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-950/40">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {labels.sectionTitle}
        </h2>
        <p className="mt-3 text-sm text-rose-700 dark:text-rose-300">{labels.error}</p>
        <button
          type="button"
          onClick={() => void load()}
          className="mt-3 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
        >
          {labels.retry}
        </button>
      </section>
    );
  }

  const { data } = loadState;
  const action = primaryAction(data);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-950/40">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {labels.sectionTitle}
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{labels.scopeNote}</p>
        </div>
        <Badge
          label={
            labels.deliveryStatuses[data.deliveryStatus] ??
            resolvePlatformStatusLabel({
              status: data.deliveryStatus,
              labels: labels.presentationStatuses,
              unknownFallback: labels.unknownStatus,
            })
          }
          variant={deliveryStatusVariant(data.deliveryStatus)}
        />
      </div>

      {successMessage ? (
        <p
          className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200"
          role="status"
        >
          {successMessage}
        </p>
      ) : null}

      <dl className="mt-4">
        <Row label={labels.rowAgreement}>
          <Badge
            label={resolvePlatformStatusLabel({
              status: data.agreement.status,
              labels: labels.presentationStatuses,
              unknownFallback: labels.unknownStatus,
              emptyFallback: labels.unknownStatus,
            })}
            variant={resolvePlatformStatusSeverity(data.agreement.status)}
          />
        </Row>
        <Row label={labels.rowParentLicense}>
          <Badge
            label={resolvePlatformStatusLabel({
              status: data.parentLicense.status,
              labels: labels.presentationStatuses,
              unknownFallback: labels.unknownStatus,
              emptyFallback: labels.unknownStatus,
            })}
            variant={
              data.parentLicense.eligible
                ? "success"
                : resolvePlatformStatusSeverity(data.parentLicense.status)
            }
          />
        </Row>
        <Row label={labels.rowAppPanel}>
          <Badge
            label={resolvePlatformStatusLabel({
              status: data.appPanel.status,
              labels: labels.presentationStatuses,
              unknownFallback: labels.unknownStatus,
              emptyFallback: labels.unknownStatus,
            })}
            variant={
              data.appPanel.eligible
                ? "success"
                : resolvePlatformStatusSeverity(data.appPanel.status)
            }
          />
        </Row>
        <Row label={labels.rowChild}>
          <Badge
            label={resolvePlatformStatusLabel({
              status: data.childEntitlement.status,
              labels: labels.presentationStatuses,
              unknownFallback: labels.unknownStatus,
              emptyFallback: labels.unknownStatus,
            })}
            variant={
              data.childEntitlement.licensed && data.childEntitlement.enabled
                ? "success"
                : resolvePlatformStatusSeverity(data.childEntitlement.status)
            }
          />
        </Row>
        <Row label={labels.rowDomain}>
          {data.domain.hostname ?? labels.notLinked}
        </Row>
        <Row label={labels.rowInstallation}>
          <Badge
            label={resolvePlatformStatusLabel({
              status: data.installation.status,
              labels: labels.presentationStatuses,
              unknownFallback: labels.unknownStatus,
              emptyFallback: labels.unknownStatus,
            })}
            variant={
              data.installation.active
                ? "success"
                : resolvePlatformStatusSeverity(data.installation.status)
            }
          />
        </Row>
        <Row label={labels.rowAutoInstall}>
          <Badge
            label={
              data.autoInstall.configEnabled
                ? labels.installEnabledLabel
                : labels.installDisabledLabel
            }
            variant={data.autoInstall.configEnabled ? "success" : "muted"}
          />
        </Row>
        <Row label={labels.rowAcknowledgement}>
          <Badge
            label={data.acknowledgement.ok ? labels.acknowledgementOk : labels.acknowledgementFailed}
            variant={data.acknowledgement.ok ? "success" : "warning"}
          />
        </Row>
        <Row label={labels.overallStatus}>
          <Badge
            label={
              labels.deliveryStatuses[data.deliveryStatus] ??
              resolvePlatformStatusLabel({
                status: data.deliveryStatus,
                labels: labels.presentationStatuses,
                unknownFallback: labels.unknownStatus,
              })
            }
            variant={deliveryStatusVariant(data.deliveryStatus)}
          />
        </Row>
        <Row label={labels.lastCheck}>
          <span className="inline-block max-w-[16rem] break-words text-right">
            {formatPlatformDateTimeFull(data.lastCheckedAt, {
              locale,
              emptyFallback: labels.emptyDate,
              invalidFallback: labels.invalidDate,
            })}
          </span>
        </Row>
        <Row label={labels.lastAttempt}>
          <span className="inline-block max-w-[16rem] break-words text-right">
            {formatPlatformDateTimeFull(data.lastAttemptAt, {
              locale,
              emptyFallback: labels.emptyDate,
              invalidFallback: labels.invalidDate,
            })}
          </span>
        </Row>
      </dl>

      {action === "blocked" && data.reasons.length > 0 ? (
        <section className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-950/30">
          <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
            {labels.blocked}
          </h3>
          <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">
            {labels.blockedDescription}
          </p>
          <ul className="mt-3 space-y-1.5">
            {data.reasons.map((reasonItem) => (
              <li
                key={reasonItem.code}
                className="flex items-start gap-2 text-sm text-amber-900 dark:text-amber-200"
              >
                <span
                  aria-hidden
                  className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                    reasonItem.satisfied ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
                <span>
                  {appKompisDeliveryReasonLabel(
                    reasonItem.code,
                    labels.reasonLabels,
                    reasonItem.satisfied,
                  )}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {action === "deliver" ? (
          <button
            type="button"
            onClick={() => setModal({ open: true, mode: "deliver" })}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
          >
            {labels.deliver}
          </button>
        ) : null}
        {action === "reconcile" ? (
          <button
            type="button"
            onClick={() => setModal({ open: true, mode: "reconcile" })}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
          >
            {labels.reconcile}
          </button>
        ) : null}
        {action === "verify" ? (
          <button
            type="button"
            onClick={() => void handleVerify()}
            disabled={verifying}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
          >
            {verifying ? labels.verifying : labels.verify}
          </button>
        ) : null}
      </div>

      <DeliveryModal
        open={modal.open}
        mode={modal.mode}
        customerId={customerId}
        data={data}
        labels={labels}
        onClose={() => setModal((prev) => ({ ...prev, open: false }))}
        onSuccess={(message) => {
          setModal((prev) => ({ ...prev, open: false }));
          setSuccessMessage(message);
          void load();
        }}
      />
    </section>
  );
}
