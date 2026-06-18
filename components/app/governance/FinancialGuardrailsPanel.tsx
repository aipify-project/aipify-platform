"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  FINANCIAL_GUARDRAILS_CORE_PRINCIPLE,
  FINANCIAL_GUARDRAILS_PHILOSOPHY,
  FINANCIAL_GUARDRAILS_VISION,
  parseFinancialGuardrailsCenter,
  type FinancialGuardrailsCenter,
} from "@/lib/financial-guardrails";

type PanelLabels = {
  title: string;
  subtitle: string;
  loading: string;
  corePrinciple: string;
  philosophyTitle: string;
  visionTitle: string;
  activeTitle: string;
  recommendationsTitle: string;
  alertsTitle: string;
  expendituresTitle: string;
  trendsTitle: string;
  utilizationTitle: string;
  highValueTitle: string;
  exceptionsTitle: string;
  effectivenessTitle: string;
  accept: string;
  dismiss: string;
  suspend: string;
  delete: string;
  privacyNote: string;
  approvalsLink: string;
  approvalProfilesLink: string;
  governanceLink: string;
  spendingCategories: Record<string, string>;
  limitTypes: Record<string, string>;
  approvalThresholds: Record<string, string>;
};

type FinancialGuardrailsPanelProps = {
  labels: PanelLabels;
};

function alertBadge(severity: string) {
  switch (severity) {
    case "critical":
      return "bg-rose-100 text-rose-800";
    case "warning":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-sky-100 text-sky-800";
  }
}

function thresholdBadge(threshold: string) {
  switch (threshold) {
    case "level_4":
      return "bg-rose-100 text-rose-800";
    case "level_3":
      return "bg-orange-100 text-orange-800";
    case "level_2":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-emerald-100 text-emerald-800";
  }
}

export function FinancialGuardrailsPanel({ labels }: FinancialGuardrailsPanelProps) {
  const [center, setCenter] = useState<FinancialGuardrailsCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/financial-guardrails/center");
    if (res.ok) setCenter(parseFinancialGuardrailsCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const postAction = async (payload: Record<string, unknown>) => {
    await fetch("/api/financial-guardrails/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await load();
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap gap-3 text-sm">
        {center?.links?.approvals && (
          <Link href={center.links.approvals} className="text-slate-600 hover:underline">
            {labels.approvalsLink}
          </Link>
        )}
        {center?.links?.approval_profiles && (
          <Link href={center.links.approval_profiles} className="text-slate-600 hover:underline">
            {labels.approvalProfilesLink}
          </Link>
        )}
        {center?.links?.governance_center && (
          <Link href={center.links.governance_center} className="text-slate-600 hover:underline">
            {labels.governanceLink}
          </Link>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">
          {labels.corePrinciple}: {FINANCIAL_GUARDRAILS_CORE_PRINCIPLE}
        </p>
        <p className="mt-2 text-sm text-gray-600">
          {labels.philosophyTitle}: {FINANCIAL_GUARDRAILS_PHILOSOPHY}
        </p>
        <p className="mt-1 text-sm text-gray-600">
          {labels.visionTitle}: {FINANCIAL_GUARDRAILS_VISION}
        </p>
        {center?.privacy_note && (
          <p className="mt-2 text-sm text-gray-500">
            {labels.privacyNote}: {center.privacy_note}
          </p>
        )}
      </div>

      {center?.effectiveness_indicators && (
        <section className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5">
          <h2 className="font-semibold text-emerald-900">{labels.effectivenessTitle}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            {Object.entries(center.effectiveness_indicators).map(([key, value]) => (
              <div key={key} className="rounded-lg border border-emerald-100 bg-white p-3">
                <p className="text-gray-500">{key.replace(/_/g, " ")}</p>
                <p className="mt-1 font-semibold">{String(value)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {center?.budget_utilization && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.utilizationTitle}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
            {Object.entries(center.budget_utilization).map(([key, value]) => (
              <div key={key} className="rounded-lg border border-gray-100 p-3">
                <p className="text-gray-500">{key.replace(/_/g, " ")}</p>
                <p className="mt-1 font-semibold">{String(value)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {center?.spending_trends && (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h2 className="font-semibold text-indigo-900">{labels.trendsTitle}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
            {Object.entries(center.spending_trends).map(([key, value]) => (
              <div key={key} className="rounded-lg border border-indigo-100 bg-white p-3">
                <p className="text-gray-500">{key.replace(/_/g, " ")}</p>
                <p className="mt-1 font-semibold">{String(value)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {center && center.alerts.length > 0 && (
        <section className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5">
          <h2 className="font-semibold text-amber-900">{labels.alertsTitle}</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {center.alerts.map((alert) => (
              <li key={alert.alert_key} className="rounded-xl border border-amber-100 bg-white p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded px-2 py-0.5 text-xs ${alertBadge(alert.severity)}`}>
                    {alert.alert_type.replace(/_/g, " ")}
                  </span>
                  <span className="text-gray-800">{alert.message}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {center && center.recommendations.length > 0 && (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h2 className="font-semibold text-indigo-900">{labels.recommendationsTitle}</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {center.recommendations.map((rec) => (
              <li key={rec.recommendation_key} className="rounded-xl border border-indigo-100 bg-white p-4">
                <p className="text-gray-800">{rec.message}</p>
                {center.can_record && rec.status === "pending" && (
                  <div className="mt-2 flex gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() =>
                        void postAction({
                          action: "event",
                          recommendation_key: rec.recommendation_key,
                          decision: "accept",
                        })
                      }
                      className="text-indigo-700 hover:underline"
                    >
                      {labels.accept}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        void postAction({
                          action: "event",
                          recommendation_key: rec.recommendation_key,
                          decision: "dismiss",
                        })
                      }
                      className="text-gray-600 hover:underline"
                    >
                      {labels.dismiss}
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {center && center.high_value_transactions.length > 0 && (
        <section className="rounded-2xl border border-rose-100 bg-rose-50/40 p-5">
          <h2 className="font-semibold text-rose-900">{labels.highValueTitle}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {center.high_value_transactions.map((tx) => (
              <li key={tx.expenditure_key} className="rounded-lg border border-rose-100 bg-white px-3 py-2">
                {tx.category} · {tx.amount} {tx.currency}
                {tx.approval_threshold && (
                  <span className={`ml-2 rounded px-2 py-0.5 text-xs ${thresholdBadge(tx.approval_threshold)}`}>
                    {labels.approvalThresholds[tx.approval_threshold] ?? tx.approval_threshold}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {center?.policy_exceptions && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.exceptionsTitle}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
            {Object.entries(center.policy_exceptions).map(([key, value]) => (
              <div key={key} className="rounded-lg border border-gray-100 p-3">
                <p className="text-gray-500">{key.replace(/_/g, " ")}</p>
                <p className="mt-1 font-semibold">{String(value)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {center && center.active_profiles.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.activeTitle}</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {center.active_profiles.map((profile) => (
              <li key={profile.profile_key} className="rounded-xl border border-gray-100 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">{profile.profile_name}</p>
                    <p className="text-xs text-gray-500">
                      {labels.spendingCategories[profile.spending_category] ?? profile.spending_category} ·{" "}
                      {labels.limitTypes[profile.limit_type] ?? profile.limit_type}
                    </p>
                  </div>
                  <span
                    className={`rounded px-2 py-0.5 text-xs ${thresholdBadge(profile.approval_threshold)}`}
                  >
                    {labels.approvalThresholds[profile.approval_threshold] ?? profile.approval_threshold}
                  </span>
                </div>
                {center.can_manage && (
                  <div className="mt-2 flex gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() =>
                        void postAction({
                          action: "event",
                          profile_key: profile.profile_key,
                          decision: "suspend",
                        })
                      }
                      className="text-gray-600 hover:underline"
                    >
                      {labels.suspend}
                    </button>
                    {center.can_delete && (
                      <button
                        type="button"
                        onClick={() =>
                          void postAction({
                            action: "event",
                            profile_key: profile.profile_key,
                            decision: "delete",
                          })
                        }
                        className="text-rose-700 hover:underline"
                      >
                        {labels.delete}
                      </button>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {center && center.expenditures.length > 0 && (
        <section className="rounded-2xl border border-violet-100 bg-violet-50/40 p-5">
          <h2 className="font-semibold text-violet-900">{labels.expendituresTitle}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {center.expenditures.map((exp) => (
              <li key={exp.expenditure_key} className="rounded-lg border border-violet-100 bg-white px-3 py-2">
                {exp.category} · {exp.amount} {exp.currency} · {exp.status}
                <span className="ml-2 text-xs text-gray-500">via {exp.profile_key}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
