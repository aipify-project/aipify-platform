"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/shared/AipifyLoader";
import {
  parseDigitalWorkforceRecruitmentProvisioningCenter,
  type DigitalWorkforceRecruitmentProvisioningCenter,
} from "@/lib/aipify/digital-workforce-recruitment-provisioning-engine";

type Props = { labels: Record<string, string> };

export function DigitalWorkforceRecruitmentProvisioningEngineDashboardPanel({ labels }: Props) {
  const [center, setCenter] = useState<DigitalWorkforceRecruitmentProvisioningCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [requestTitle, setRequestTitle] = useState("");
  const [department, setDepartment] = useState("Support");

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/digital-workforce-recruitment-provisioning-engine/dashboard");
    if (res.ok) {
      setCenter(parseDigitalWorkforceRecruitmentProvisioningCenter(await res.json()));
    } else {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.loadFailed);
    }
    setLoading(false);
  }, [labels.loadFailed]);

  useEffect(() => {
    void load();
  }, [load]);

  const submitHiringRequest = async () => {
    if (!requestTitle.trim()) return;
    setCreating(true);
    setActionError(null);
    const res = await fetch("/api/aipify/digital-workforce-recruitment-provisioning-engine/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "submit_hiring_request",
        request_title: requestTitle.trim(),
        department,
        request_type: "department",
        business_justification: labels.defaultJustification,
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.createFailed);
    } else {
      setRequestTitle("");
      await load();
    }
    setCreating(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found || !center.has_access) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
        <p className="font-medium">{labels.accessRequiredTitle}</p>
        <p className="mt-2 text-sm">{center?.error ?? labels.accessRequiredBody}</p>
      </div>
    );
  }

  const overview = center.overview ?? {};
  const ops = center.operations ?? {};

  return (
    <div className="space-y-6">
      {actionError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{actionError}</div>
      ) : null}

      <section className="rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.overviewTitle}</h2>
        <p className="mt-1 text-sm text-gray-600">{center.philosophy}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [labels.metricEmployees, overview.digital_employees ?? 0],
            [labels.metricOpenPositions, overview.open_positions ?? 0],
            [labels.metricDepartments, overview.departments ?? 0],
            [labels.metricWorkload, `${overview.workload ?? 0}%`],
            [labels.metricCapacity, `${overview.capacity ?? 0}%`],
            [labels.metricAutomation, `${overview.automation_coverage ?? 0}%`],
            [labels.metricHealth, overview.workforce_health_score ?? 0],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-lg border border-white bg-white/90 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.operationsTitle}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            [labels.openPlanning, ops.planning_route],
            [labels.openPositions, ops.positions_route],
            [labels.openHiring, ops.hiring_route],
            [labels.openProvisioning, ops.provisioning_route],
            [labels.openAnalytics, ops.analytics_route],
            [labels.openGovernance, ops.governance_route],
            [labels.openLifecycle, ops.lifecycle_route],
            [labels.openOrchestration, ops.orchestration_route],
          ].map(([label, href]) =>
            href ? (
              <Link
                key={String(label)}
                href={href}
                className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400"
              >
                {label}
              </Link>
            ) : null
          )}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.positionsTitle}</h2>
        {(center.positions ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.noPositions}</p>
        ) : (
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {(center.positions ?? []).map((pos) => (
              <li key={pos.id} className="rounded-lg bg-gray-50 px-4 py-3 text-sm">
                <p className="font-medium text-gray-900">{pos.position_name}</p>
                <p className="text-gray-600">{pos.department} · {pos.position_type}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.plansTitle}</h2>
        {(center.workforce_plans ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.noPlans}</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {(center.workforce_plans ?? []).map((plan) => (
              <li key={plan.id} className="flex justify-between rounded-lg bg-gray-50 px-4 py-3 text-sm">
                <span className="font-medium text-gray-900">{plan.plan_name}</span>
                <span className="text-gray-600">
                  {plan.current_headcount} → {plan.future_headcount} · {plan.capacity_utilization}%
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.hiringTitle}</h2>
        {(center.hiring_requests ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.noHiringRequests}</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {(center.hiring_requests ?? []).slice(0, 6).map((req) => (
              <li key={req.id} className="flex justify-between rounded-lg bg-gray-50 px-4 py-3 text-sm">
                <span className="font-medium text-gray-900">{req.request_title}</span>
                <span className="text-gray-600">{req.request_status}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <input
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder={labels.requestTitlePlaceholder}
            value={requestTitle}
            onChange={(e) => setRequestTitle(e.target.value)}
          />
          <select
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="Support">{labels.deptSupport}</option>
            <option value="Finance">{labels.deptFinance}</option>
            <option value="Operations">{labels.deptOperations}</option>
            <option value="Compliance">{labels.deptCompliance}</option>
          </select>
          <button
            type="button"
            disabled={creating}
            onClick={() => void submitHiringRequest()}
            className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {creating ? labels.creating : labels.submitHiringRequest}
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.advisorTitle}</h2>
        <div className="mt-4 space-y-4">
          {(center.advisor_signals ?? []).map((sig) => (
            <article key={sig.id} className="rounded-lg bg-gray-50 p-4">
              <p className="font-medium text-gray-900">{sig.observation}</p>
              {sig.recommendation ? (
                <p className="mt-2 text-sm font-medium text-gray-800">
                  {labels.recommendation}: {sig.recommendation}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <p className="text-xs text-gray-500">{center.abos_principle}</p>
    </div>
  );
}
