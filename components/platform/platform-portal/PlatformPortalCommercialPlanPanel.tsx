"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  PlatformPortalCommercialPlan,
  PlatformPortalCommercialPlanLabels,
  PlatformPortalCustomerDetail,
  PlatformPortalCustomerDetailCommercial,
} from "@/lib/platform-portal";
import {
  createCommercialPlanIdempotencyKey,
  formatCommercialAmount,
  parsePlatformPortalCommercialPlansPayload,
  type PlatformPortalCommercialPlanErrorCode,
} from "@/lib/platform-portal/commercial-plan";

type Props = {
  open: boolean;
  customerId: string;
  commercial: PlatformPortalCustomerDetailCommercial;
  labels: PlatformPortalCommercialPlanLabels;
  locale: string;
  onClose: () => void;
  onSuccess: (detail?: PlatformPortalCustomerDetail) => void;
};

type PlansState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "empty" }
  | { kind: "ready"; plans: PlatformPortalCommercialPlan[] };

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; code: PlatformPortalCommercialPlanErrorCode };

function errorMessage(
  labels: PlatformPortalCommercialPlanLabels,
  code: PlatformPortalCommercialPlanErrorCode,
): string {
  switch (code) {
    case "active_plan_conflict":
      return labels.activePlanConflict;
    case "plan_lifetime_unsupported":
      return labels.planLifetimeUnsupported;
    case "plan_recurring_unsupported":
      return labels.planRecurringUnsupported;
    case "trial_not_supported":
      return labels.planTrialUnsupported;
    case "invalid_internal_reason":
      return labels.reasonRequired;
    case "unauthorized":
      return labels.unauthorized;
    case "forbidden":
      return labels.forbidden;
    default:
      return labels.activateError;
  }
}

function hasActiveCommercialPlan(commercial: PlatformPortalCustomerDetailCommercial): boolean {
  if (commercial.lifetime) return true;
  const status = (commercial.subscriptionStatus ?? "").toLowerCase();
  return status === "active" || status === "trialing" || status === "past_due";
}

export function PlatformPortalCommercialPlanPanel({
  open,
  customerId,
  commercial,
  labels,
  locale,
  onClose,
  onSuccess,
}: Props) {
  const [plansState, setPlansState] = useState<PlansState>({ kind: "loading" });
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [mode, setMode] = useState<"lifetime" | "recurring">("recurring");
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [submit, setSubmit] = useState<SubmitState>({ kind: "idle" });
  const [idempotencyKey] = useState(() => createCommercialPlanIdempotencyKey());

  const blocked = hasActiveCommercialPlan(commercial);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    async function loadPlans() {
      setPlansState({ kind: "loading" });
      try {
        const response = await fetch("/api/platform-portal/commercial-plans", {
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
          if (!cancelled) setPlansState({ kind: "error" });
          return;
        }
        const payload = parsePlatformPortalCommercialPlansPayload(await response.json());
        if (cancelled) return;
        if (payload.plans.length === 0) {
          setPlansState({ kind: "empty" });
          return;
        }
        setPlansState({ kind: "ready", plans: payload.plans });
      } catch {
        if (!cancelled) setPlansState({ kind: "error" });
      }
    }

    void loadPlans();
    return () => {
      cancelled = true;
    };
  }, [open]);

  const selectedPlan = useMemo(() => {
    if (plansState.kind !== "ready" || !selectedPlanId) return null;
    return plansState.plans.find((plan) => plan.id === selectedPlanId) ?? null;
  }, [plansState, selectedPlanId]);

  useEffect(() => {
    if (!selectedPlan) return;
    if (selectedPlan.supportsLifetime && !selectedPlan.supportsRecurring) {
      setMode("lifetime");
    } else if (selectedPlan.supportsRecurring) {
      setMode("recurring");
    }
  }, [selectedPlan]);

  if (!open) return null;

  async function activate() {
    if (blocked || submit.kind === "submitting" || submit.kind === "success") return;
    if (!selectedPlan) {
      setSubmit({ kind: "error", code: "invalid_plan" });
      return;
    }
    if (mode === "lifetime" && !selectedPlan.supportsLifetime) {
      setSubmit({ kind: "error", code: "plan_lifetime_unsupported" });
      return;
    }
    if (mode === "recurring" && !selectedPlan.supportsRecurring) {
      setSubmit({ kind: "error", code: "plan_recurring_unsupported" });
      return;
    }
    if (reason.trim().length < 3) {
      setSubmit({ kind: "error", code: "invalid_internal_reason" });
      return;
    }
    if (!confirmed) {
      setSubmit({ kind: "error", code: "unknown" });
      return;
    }

    setSubmit({ kind: "submitting" });
    try {
      const response = await fetch(
        `/api/platform-portal/customers/${customerId}/commercial-plan`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
          body: JSON.stringify({
            planId: selectedPlan.id,
            mode,
            startMode: "now",
            trialDays: null,
            internalReason: reason.trim(),
            idempotencyKey,
          }),
        },
      );

      const payload = (await response.json().catch(() => null)) as {
        code?: PlatformPortalCommercialPlanErrorCode;
      } | null;

      if (response.status === 401) {
        setSubmit({ kind: "error", code: "unauthorized" });
        return;
      }
      if (response.status === 403) {
        setSubmit({ kind: "error", code: "forbidden" });
        return;
      }
      if (!response.ok) {
        setSubmit({ kind: "error", code: payload?.code ?? "unknown" });
        return;
      }

      setSubmit({ kind: "success" });
      onSuccess();
    } catch {
      setSubmit({ kind: "error", code: "unknown" });
    }
  }

  const banner =
    submit.kind === "error"
      ? errorMessage(labels, submit.code)
      : submit.kind === "success"
        ? labels.success
        : !confirmed && submit.kind === "idle" && reason.trim().length >= 3 && selectedPlan
          ? labels.confirmRequired
          : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-4 sm:items-center dark:bg-black/60">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="commercial-plan-title"
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-950"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-700">
          <div>
            <h2
              id="commercial-plan-title"
              className="text-lg font-semibold text-slate-900 dark:text-slate-50"
            >
              {labels.title}
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {labels.summaryCreates}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            {labels.cancel}
          </button>
        </div>

        <div className="space-y-5 px-5 py-5">
          <section className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-900/50">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              {labels.currentPlan}
            </h3>
            <dl className="mt-3 grid gap-2 sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">{labels.title}</dt>
                <dd className="text-sm font-medium text-slate-900 dark:text-slate-50">
                  {commercial.planName ?? labels.noPrice}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">{labels.active}</dt>
                <dd className="text-sm font-medium text-slate-900 dark:text-slate-50">
                  {commercial.lifetime
                    ? labels.lifetime
                    : commercial.subscriptionStatus
                      ? labels.subscriptionStatuses[commercial.subscriptionStatus] ??
                        labels.unknownStatus
                      : labels.pending}
                </dd>
              </div>
            </dl>
            {blocked ? (
              <p className="mt-3 text-sm text-amber-800 dark:text-amber-200">
                {labels.activePlanConflict}
              </p>
            ) : null}
          </section>

          {plansState.kind === "loading" ? (
            <p className="text-sm text-slate-600 dark:text-slate-400">{labels.loadingPlans}</p>
          ) : null}
          {plansState.kind === "error" ? (
            <p className="text-sm text-rose-700 dark:text-rose-300">{labels.loadPlansError}</p>
          ) : null}
          {plansState.kind === "empty" ? (
            <p className="text-sm text-slate-600 dark:text-slate-400">{labels.emptyPlans}</p>
          ) : null}

          {plansState.kind === "ready" && !blocked ? (
            <>
              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {labels.availablePlans}
                </h3>
                <div className="grid gap-3">
                  {plansState.plans.map((plan) => {
                    const price = formatCommercialAmount(plan.amountMinor, plan.currency, locale);
                    const selected = selectedPlanId === plan.id;
                    return (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => setSelectedPlanId(plan.id)}
                        className={`rounded-xl border px-4 py-3 text-left transition ${
                          selected
                            ? "border-violet-400 bg-violet-50 dark:border-violet-600 dark:bg-violet-950/40"
                            : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-slate-600"
                        }`}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-slate-900 dark:text-slate-50">
                              {plan.name}
                            </p>
                            {plan.description ? (
                              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                {plan.description}
                              </p>
                            ) : null}
                          </div>
                          <div className="text-right text-sm">
                            <p className="font-semibold text-slate-900 dark:text-slate-50">
                              {price ?? labels.noPrice}
                            </p>
                            <p className="text-slate-500 dark:text-slate-400">
                              {plan.supportsLifetime
                                ? labels.lifetime
                                : plan.billingCycle === "yearly"
                                  ? labels.yearly
                                  : labels.monthly}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              {selectedPlan ? (
                <section className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {labels.selectPlan}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPlan.supportsLifetime ? (
                      <button
                        type="button"
                        onClick={() => setMode("lifetime")}
                        className={`rounded-lg px-3 py-2 text-sm font-medium ${
                          mode === "lifetime"
                            ? "bg-violet-600 text-white"
                            : "border border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-200"
                        }`}
                      >
                        {labels.lifetime}
                      </button>
                    ) : null}
                    {selectedPlan.supportsRecurring ? (
                      <button
                        type="button"
                        onClick={() => setMode("recurring")}
                        className={`rounded-lg px-3 py-2 text-sm font-medium ${
                          mode === "recurring"
                            ? "bg-violet-600 text-white"
                            : "border border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-200"
                        }`}
                      >
                        {labels.recurring}
                      </button>
                    ) : null}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{labels.noTrial}</p>
                </section>
              ) : null}

              <section className="space-y-2">
                <label
                  htmlFor="internalReason"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  {labels.internalReason}
                </label>
                <textarea
                  id="internalReason"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                />
              </section>

              <section className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-900/50">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {labels.summary}
                </h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
                  <li>{labels.summaryCreates}</li>
                  <li>{labels.summaryNoPayment}</li>
                  <li>{labels.summaryNoLicense}</li>
                </ul>
                <label className="mt-3 flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(event) => setConfirmed(event.target.checked)}
                    className="mt-1"
                  />
                  <span>{labels.confirmRequired}</span>
                </label>
              </section>
            </>
          ) : null}

          {banner ? (
            <p
              role="status"
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                submit.kind === "success"
                  ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100"
                  : submit.kind === "error"
                    ? "bg-rose-50 text-rose-900 dark:bg-rose-950/40 dark:text-rose-100"
                    : "bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100"
              }`}
            >
              {banner}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:justify-end dark:border-slate-700">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-800 dark:border-slate-600 dark:text-slate-100"
          >
            {labels.cancel}
          </button>
          <button
            type="button"
            disabled={
              blocked ||
              submit.kind === "submitting" ||
              submit.kind === "success" ||
              !selectedPlan ||
              !confirmed ||
              reason.trim().length < 3
            }
            onClick={() => void activate()}
            className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submit.kind === "submitting" ? labels.activating : labels.activate}
          </button>
        </div>
      </div>
    </div>
  );
}
