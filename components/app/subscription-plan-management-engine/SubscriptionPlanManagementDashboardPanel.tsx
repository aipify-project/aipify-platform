"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseSubscriptionPlanManagementDashboard,
  type SubscriptionPlanManagementDashboard,
} from "@/lib/aipify/subscription-plan-management-engine";

type SubscriptionPlanManagementDashboardPanelProps = {
  labels: Record<string, string>;
};

function statusBadgeClass(status?: string) {
  switch (status) {
    case "active":
    case "internal":
      return "bg-emerald-100 text-emerald-800";
    case "trial":
      return "bg-amber-100 text-amber-800";
    case "past_due":
    case "expired":
      return "bg-rose-100 text-rose-800";
    case "cancelled":
      return "bg-slate-100 text-slate-700";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export function SubscriptionPlanManagementDashboardPanel({
  labels,
}: SubscriptionPlanManagementDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<SubscriptionPlanManagementDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionKey, setActionKey] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/subscription-plan-management-engine/dashboard");
    if (res.ok) setDashboard(parseSubscriptionPlanManagementDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function runAction(
    key: string,
    path: string,
    body?: Record<string, unknown>
  ) {
    setActionKey(key);
    await fetch(path, {
      method: "POST",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    await load();
    setActionKey(null);
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_organization) return null;

  const sub = dashboard.subscription ?? {};
  const settings = dashboard.settings ?? {};
  const billing = dashboard.billing_scaffold ?? {};

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/license" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.licenseCenter}
        </Link>
        <Link href="/app/integration-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.integrations}
        </Link>
        <Link href="/app/settings/billing" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.billingSettings}
        </Link>
      </div>

      <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
        <h2 className="text-sm font-semibold text-teal-900">{labels.subscriptionEngine}</h2>
        <p className="mt-2 text-sm text-teal-900">{dashboard.philosophy}</p>
        <p className="mt-1 text-xs text-teal-700">{dashboard.safety_note}</p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.activePlan}</p>
          <p className="mt-1 text-lg font-semibold capitalize text-gray-900">{sub.plan_key ?? "—"}</p>
          <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(sub.status)}`}>
            {sub.status ?? "—"}
          </span>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.trialStatus}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {sub.status === "trial" ? (sub.trial_days_remaining ?? 0) : "—"}
          </p>
          {sub.trial_ends_at ? (
            <p className="mt-1 text-xs text-gray-500">
              {labels.trialEnds}: {new Date(sub.trial_ends_at).toLocaleDateString()}
            </p>
          ) : null}
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.activeModules}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.active_modules.length}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.billingCycle}</p>
          <p className="mt-1 text-lg font-semibold capitalize text-gray-900">{sub.billing_cycle ?? "—"}</p>
          <p className="mt-1 text-xs text-gray-500">
            {labels.billingProvider}: {settings.billing_provider ?? "manual"}
          </p>
        </div>
      </section>

      <section className="rounded-lg border border-gray-100 bg-white p-4">
        <h2 className="text-sm font-semibold text-gray-900">{labels.subscriptionActions}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {sub.status === "trial" || sub.status === "expired" ? (
            <button
              type="button"
              disabled={actionKey === "trial"}
              onClick={() => void runAction("trial", "/api/subscriptions/trial")}
              className="rounded-lg bg-teal-600 px-3 py-1.5 text-sm text-white disabled:opacity-50"
            >
              {labels.startTrial}
            </button>
          ) : null}
          {sub.status === "cancelled" || sub.status === "expired" ? (
            <button
              type="button"
              disabled={actionKey === "reactivate"}
              onClick={() => void runAction("reactivate", "/api/subscriptions/reactivate")}
              className="rounded-lg border border-teal-600 px-3 py-1.5 text-sm text-teal-700 disabled:opacity-50"
            >
              {labels.reactivate}
            </button>
          ) : null}
          {sub.status !== "cancelled" ? (
            <button
              type="button"
              disabled={actionKey === "cancel"}
              onClick={() => void runAction("cancel", "/api/subscriptions/cancel")}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 disabled:opacity-50"
            >
              {labels.cancel}
            </button>
          ) : null}
        </div>
      </section>

      {dashboard.upgrade_opportunities.length > 0 ? (
        <section className="rounded-lg border border-teal-100 bg-teal-50/30 p-4">
          <h2 className="text-sm font-semibold text-teal-900">{labels.upgradeOpportunities}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.upgrade_opportunities.map((opp) => (
              <li
                key={opp.plan_key}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-teal-100 bg-white p-3"
              >
                <div>
                  <p className="text-sm font-medium capitalize text-gray-900">{opp.plan_key}</p>
                  <p className="text-xs text-gray-600">{opp.reason}</p>
                </div>
                <button
                  type="button"
                  disabled={actionKey === `upgrade-${opp.plan_key}`}
                  onClick={() =>
                    void runAction(`upgrade-${opp.plan_key}`, "/api/subscriptions/upgrade", {
                      plan_key: opp.plan_key,
                    })
                  }
                  className="rounded-lg bg-teal-600 px-3 py-1.5 text-sm text-white disabled:opacity-50"
                >
                  {labels.upgrade}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-lg border border-gray-100 bg-white p-4">
        <h2 className="text-sm font-semibold text-gray-900">{labels.availablePlans}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {dashboard.available_plans.map((plan) => (
            <div key={plan.plan_key} className="rounded-lg border border-gray-100 p-3">
              <p className="text-sm font-medium text-gray-900">{plan.label ?? plan.plan_key}</p>
              {plan.highlights?.length ? (
                <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
                  {plan.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-gray-100 bg-white p-4">
        <h2 className="text-sm font-semibold text-gray-900">{labels.moduleAccess}</h2>
        {dashboard.active_modules.length === 0 ? (
          <p className="mt-2 text-sm text-gray-600">{labels.noModules}</p>
        ) : (
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {dashboard.active_modules.map((mod) => (
              <li
                key={mod.module_key}
                className="flex items-center justify-between rounded border border-gray-100 px-3 py-2 text-sm"
              >
                <span className="text-gray-800">{mod.module_key}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    mod.licensed ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {mod.licensed ? labels.licensed : labels.notLicensed}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-lg border border-gray-100 bg-gray-50 p-4">
        <h2 className="text-sm font-semibold text-gray-900">{labels.billingReadiness}</h2>
        <p className="mt-2 text-sm text-gray-600">{billing.note}</p>
        <p className="mt-1 text-xs text-gray-500">
          {labels.providers}: {(billing.providers ?? []).join(", ")}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          {labels.billingReady}: {billing.ready ? labels.yes : labels.no}
        </p>
      </section>

      {dashboard.principles?.length ? (
        <section className="rounded-lg border border-gray-100 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.principles}</h2>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-600">
            {dashboard.principles.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
