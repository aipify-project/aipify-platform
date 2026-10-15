"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import type { CustomerWebsiteRuntimeLabels } from "@/lib/customer-website-runtime/labels";
import {
  runtimeAckStatusLabelKey,
  runtimeAckStatusTone,
  runtimeFullyVerifiedTone,
} from "@/lib/customer-website-runtime/labels";
import { parseRuntimeStatusRpc } from "@/lib/customer-website-runtime/parse";
import { formatPlatformDateTimeFull } from "@/lib/platform-presentation-quality";

type Props = {
  organizationId: string;
  labels: CustomerWebsiteRuntimeLabels;
  locale: string;
};

type LoadState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "unauthorized" }
  | { kind: "forbidden" }
  | { kind: "empty" }
  | { kind: "success"; data: ReturnType<typeof parseRuntimeStatusRpc> };

type ActionState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "error" }
  | { kind: "success"; message: string };

const TONE: Record<string, string> = {
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

function Badge({ label, tone }: { label: string; tone: string }) {
  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium ${TONE[tone] ?? TONE.muted}`}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" aria-hidden="true" />
      <span className="truncate">{label}</span>
    </span>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-2 last:border-0 dark:border-slate-800">
      <dt className="text-sm text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="text-right text-sm font-medium text-slate-900 dark:text-slate-100">{children}</dd>
    </div>
  );
}

export function CustomerWebsiteRuntimeDeliveryPanel({
  organizationId,
  labels,
  locale,
}: Props) {
  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const [action, setAction] = useState<ActionState>({ kind: "idle" });
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [mountedPathsText, setMountedPathsText] = useState("");
  const [homepageEnabled, setHomepageEnabled] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [showConfig, setShowConfig] = useState(false);

  const load = useCallback(async () => {
    setState({ kind: "loading" });
    try {
      const res = await fetch(`/api/platform/customers/${organizationId}/website/runtime`, {
        cache: "no-store",
      });
      if (res.status === 401) {
        setState({ kind: "unauthorized" });
        return;
      }
      if (res.status === 403) {
        setState({ kind: "forbidden" });
        return;
      }
      if (!res.ok) {
        setState({ kind: "error" });
        return;
      }
      const json = await res.json();
      const parsed = parseRuntimeStatusRpc(json);
      if (!parsed.websiteProvisioned && !parsed.available) {
        setState({ kind: "empty" });
        return;
      }
      setMountedPathsText(parsed.mountedPaths.join("\n"));
      setHomepageEnabled(parsed.homepageEnabled);
      setEnabled(parsed.runtimeEnabled);
      setState({ kind: "success", data: parsed });
    } catch {
      setState({ kind: "error" });
    }
  }, [organizationId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function postAction(body: Record<string, unknown>, successMessage: string) {
    if (!reason.trim() || !confirmed) {
      setAction({ kind: "error" });
      return;
    }
    setAction({ kind: "submitting" });
    try {
      const res = await fetch(`/api/platform/customers/${organizationId}/website/runtime`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...body,
          confirmation: true,
          internalReason: reason.trim(),
        }),
      });
      if (!res.ok) {
        setAction({ kind: "error" });
        return;
      }
      setAction({ kind: "success", message: successMessage });
      setReason("");
      setConfirmed(false);
      setShowConfig(false);
      await load();
    } catch {
      setAction({ kind: "error" });
    }
  }

  if (state.kind === "loading") {
    return (
      <section
        className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-950"
        aria-busy="true"
        aria-label={labels.loading}
      >
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </section>
    );
  }

  if (state.kind === "unauthorized") {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-950">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">{labels.sectionTitle}</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300" role="alert">
          {labels.unauthorized}
        </p>
      </section>
    );
  }

  if (state.kind === "forbidden") {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-950">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">{labels.sectionTitle}</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300" role="alert">
          {labels.forbidden}
        </p>
      </section>
    );
  }

  if (state.kind === "error") {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-950">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">{labels.sectionTitle}</h2>
        <p className="mt-2 text-sm text-rose-700 dark:text-rose-300" role="alert">
          {labels.error}
        </p>
        <button
          type="button"
          className="mt-3 text-sm font-medium text-violet-700 underline dark:text-violet-300"
          onClick={() => void load()}
        >
          {labels.retryVerify}
        </button>
      </section>
    );
  }

  if (state.kind === "empty") {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-950">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">{labels.sectionTitle}</h2>
        <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-100">{labels.emptyTitle}</p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{labels.emptyDescription}</p>
      </section>
    );
  }

  const data = state.data;
  const ackKey = runtimeAckStatusLabelKey(data.acknowledgementStatus);
  const httpKey = runtimeAckStatusLabelKey(data.httpStatus);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-950">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">{labels.sectionTitle}</h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{labels.scopeNote}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {labels.contractVersion}: {data.contractVersion ?? labels.emptyDate}
          </p>
        </div>
        <Badge
          tone={runtimeFullyVerifiedTone(data.fullyVerified)}
          label={data.fullyVerified ? labels.fullyVerified : labels.notFullyVerified}
        />
      </div>

      <dl className="mt-4">
        <Row label={labels.websiteProvisioned}>
          <Badge
            tone={data.websiteProvisioned ? "success" : "muted"}
            label={data.websiteProvisioned ? labels.statusVerified : labels.statusNotConfigured}
          />
        </Row>
        <Row label={labels.runtimeEnabled}>
          <Badge
            tone={data.runtimeEnabled ? "success" : "muted"}
            label={data.runtimeEnabled ? labels.runtimeEnabled : labels.runtimeDisabled}
          />
        </Row>
        <Row label={labels.mountedPaths}>
          {data.mountedPaths.length > 0 ? data.mountedPaths.join(", ") : labels.noMountedPaths}
        </Row>
        <Row label={labels.homepageEnabled}>
          {data.homepageEnabled ? labels.homepageEnabled : labels.homepageDisabled}
        </Row>
        <Row label={labels.activeVersion}>
          {data.activeVersionNumber != null ? `v${data.activeVersionNumber}` : labels.noActiveVersion}
        </Row>
        <Row label={labels.dbVerification}>
          <Badge
            tone={data.dbPublished ? "success" : "warning"}
            label={data.dbPublished ? labels.statusVerified : labels.statusNotPublished}
          />
        </Row>
        <Row label={labels.acknowledgementStatus}>
          <Badge tone={runtimeAckStatusTone(data.acknowledgementStatus)} label={labels[ackKey]} />
        </Row>
        <Row label={labels.httpVerification}>
          <Badge tone={runtimeAckStatusTone(data.httpStatus)} label={labels[httpKey]} />
        </Row>
        <Row label={labels.safeFallback}>
          {data.fallbackMode === "unavailable"
            ? labels.fallbackUnavailable
            : labels.fallbackCustomerRuntime}
        </Row>
        <Row label={labels.configVersion}>{String(data.configVersion || "—")}</Row>
        <Row label={labels.lastVerified}>
          <span className="inline-block max-w-[16rem] break-words text-right">
            {formatPlatformDateTimeFull(data.lastFullyVerifiedAt, {
              locale,
              emptyFallback: labels.emptyDate,
              invalidFallback: labels.invalidDate,
            })}
          </span>
        </Row>
      </dl>

      {action.kind === "success" ? (
        <p className="mt-3 text-sm text-emerald-700 dark:text-emerald-300" role="status">
          {action.message}
        </p>
      ) : null}
      {action.kind === "error" ? (
        <p className="mt-3 text-sm text-rose-700 dark:text-rose-300" role="alert">
          {!confirmed || !reason.trim() ? labels.confirmationRequired : labels.error}
        </p>
      ) : null}

      <div className="mt-4 space-y-3">
        <label className="block text-sm text-slate-600 dark:text-slate-300">
          {labels.internalReason}
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            autoComplete="off"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
          />
          {labels.confirmation}
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg bg-violet-700 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
            disabled={action.kind === "submitting"}
            onClick={() =>
              void postAction(
                {
                  action: "verify-http",
                  path: data.mountedPaths[0] ?? "/",
                  locale: "en",
                  idempotencyKey: `cwrh-${Date.now().toString(36)}`,
                },
                labels.successVerify,
              )
            }
          >
            {action.kind === "submitting" ? labels.verifying : labels.verifyHttp}
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium dark:border-slate-600"
            onClick={() => setShowConfig((v) => !v)}
          >
            {labels.updateConfig}
          </button>
        </div>
      </div>

      {showConfig ? (
        <div className="mt-4 space-y-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
          <label className="block text-sm text-slate-600 dark:text-slate-300">
            {labels.mountedPaths}
            <textarea
              value={mountedPathsText}
              onChange={(e) => setMountedPathsText(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={homepageEnabled}
              onChange={(e) => setHomepageEnabled(e.target.checked)}
            />
            {labels.homepageEnabled}
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
            {labels.runtimeEnabled}
          </label>
          <button
            type="button"
            className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white dark:bg-slate-100 dark:text-slate-900 disabled:opacity-50"
            disabled={action.kind === "submitting"}
            onClick={() =>
              void postAction(
                {
                  action: "config",
                  mountedPaths: mountedPathsText
                    .split("\n")
                    .map((p) => p.trim())
                    .filter(Boolean),
                  homepageEnabled,
                  enabled,
                  fallbackMode: "customer_runtime",
                },
                labels.successConfig,
              )
            }
          >
            {action.kind === "submitting" ? labels.saving : labels.save}
          </button>
        </div>
      ) : null}
    </section>
  );
}
