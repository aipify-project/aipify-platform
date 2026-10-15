"use client";

import { useCallback, useEffect, useState } from "react";
import type { PlatformPortalKompisBedriftLabels } from "@/lib/platform-portal/kompis-bedrift-activation";
import {
  bedriftReasonLabel,
  kompisBedriftStatusVariant,
  parsePlatformPortalKompisBedriftStatus,
  type PlatformPortalKompisBedriftStatus,
} from "@/lib/platform-portal/kompis-bedrift-activation";
import { resolvePlatformStatusLabel } from "@/lib/platform-presentation-quality";

type Props = {
  customerId: string;
  labels: PlatformPortalKompisBedriftLabels;
};

type LoadState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "unauthorized" }
  | { kind: "forbidden" }
  | { kind: "notFound" }
  | { kind: "success"; data: PlatformPortalKompisBedriftStatus };

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

function statusLabel(
  labels: PlatformPortalKompisBedriftLabels,
  status: PlatformPortalKompisBedriftStatus["displayStatus"],
): string {
  switch (status) {
    case "active":
      return labels.active;
    case "eligible":
      return labels.eligible;
    case "inactive":
      return labels.inactive;
    default:
      return labels.unknown;
  }
}

export function PlatformPortalKompisBedriftStatusPanel({
  customerId,
  labels,
}: Props) {
  const [state, setState] = useState<LoadState>({ kind: "loading" });

  const load = useCallback(async () => {
    setState({ kind: "loading" });
    try {
      const response = await fetch(
        `/api/platform-portal/customers/${customerId}/kompis-bedrift`,
        { cache: "no-store" },
      );
      if (response.status === 401) {
        setState({ kind: "unauthorized" });
        return;
      }
      if (response.status === 403) {
        setState({ kind: "forbidden" });
        return;
      }
      if (response.status === 404) {
        setState({ kind: "notFound" });
        return;
      }
      if (!response.ok) {
        setState({ kind: "error" });
        return;
      }
      const body = (await response.json()) as unknown;
      const parsed = parsePlatformPortalKompisBedriftStatus(body);
      if (!parsed) {
        setState({ kind: "error" });
        return;
      }
      setState({ kind: "success", data: parsed });
    } catch {
      setState({ kind: "error" });
    }
  }, [customerId]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {labels.sectionTitle}
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {labels.sourceCore}
          </p>
        </div>
        {state.kind === "success" ? (
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${BADGE[kompisBedriftStatusVariant(state.data.displayStatus)]}`}
          >
            {statusLabel(labels, state.data.displayStatus)}
          </span>
        ) : null}
      </div>

      {state.kind === "loading" ? (
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{labels.loading}</p>
      ) : null}
      {state.kind === "unauthorized" ? (
        <p className="mt-4 text-sm text-rose-700 dark:text-rose-300">{labels.unauthorized}</p>
      ) : null}
      {state.kind === "forbidden" ? (
        <p className="mt-4 text-sm text-rose-700 dark:text-rose-300">{labels.forbidden}</p>
      ) : null}
      {state.kind === "error" || state.kind === "notFound" ? (
        <div className="mt-4 space-y-2">
          <p className="text-sm text-rose-700 dark:text-rose-300">{labels.error}</p>
          <button
            type="button"
            onClick={() => void load()}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {labels.retry}
          </button>
        </div>
      ) : null}

      {state.kind === "success" ? (
        <div className="mt-4 space-y-4">
          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {labels.moduleKey}
              </dt>
              <dd className="mt-1 font-mono text-sm text-slate-800 dark:text-slate-200">
                {state.data.moduleKey}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {labels.serviceName}
              </dt>
              <dd className="mt-1 text-sm text-slate-800 dark:text-slate-200">
                {state.data.active
                  ? labels.active
                  : state.data.existingActivation
                    ? labels.inactive
                    : labels.noGrant}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {labels.subscriptionStatus}
              </dt>
              <dd className="mt-1 text-sm text-slate-800 dark:text-slate-200">
                {resolvePlatformStatusLabel({
                  status: state.data.subscription?.status,
                  labels: labels.presentationStatuses,
                  unknownFallback: labels.unknownStatus,
                  emptyFallback: labels.notConfigured,
                })}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {labels.planKey}
              </dt>
              <dd className="mt-1 text-sm text-slate-800 dark:text-slate-200">
                {state.data.subscription?.planKey ?? labels.notConfigured}
              </dd>
            </div>
          </dl>

          {state.data.reasons.length > 0 ? (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {labels.prerequisites}
              </h3>
              <ul className="mt-2 space-y-1.5">
                {state.data.reasons.map((reason) => (
                  <li
                    key={reason.code}
                    className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"
                  >
                    <span
                      aria-hidden
                      className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                        reason.satisfied ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    />
                    <span>
                      {bedriftReasonLabel(
                        reason.code,
                        labels.reasonLabels,
                        reason.satisfied,
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-950/40">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {labels.productDistinctionTitle}
            </h3>
            <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
              <li>{labels.productWebsiteKompis}</li>
              <li>{labels.productKompisBedrift}</li>
              <li>
                {labels.productEmployeeKnowledge}
                {" — "}
                {labels.productEmployeeKnowledgeNote}
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 dark:border-amber-800/70 dark:bg-amber-950/30">
            <h3 className="text-sm font-semibold text-amber-950 dark:text-amber-100">
              {labels.activateLockedTitle}
            </h3>
            <p className="mt-1 text-sm text-amber-900/90 dark:text-amber-100/90">
              {labels.activateLockedBody}
            </p>
            <button
              type="button"
              disabled
              className="mt-3 cursor-not-allowed rounded-lg bg-slate-300 px-4 py-2 text-sm font-medium text-slate-600 opacity-80 dark:bg-slate-700 dark:text-slate-300"
              aria-disabled="true"
              title={labels.activateUnavailable}
            >
              {labels.activateUnavailable}
            </button>
            {state.data.active ? (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {labels.alreadyActive}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
