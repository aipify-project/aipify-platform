"use client";

import { useCallback, useEffect, useState } from "react";
import {
  parseResourcePlanningEngineDashboard,
  type OrganizationResourceAllocation,
  type OrganizationResourcePlan,
  type ResourcePlanningEngineDashboard,
  type ResourcePlanningRecommendation,
} from "@/lib/aipify/resource-planning-engine";

type Props = { labels: Record<string, string> };

export function ResourcePlanningEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<ResourcePlanningEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [busyPlanId, setBusyPlanId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/resource-planning-engine/dashboard");
    if (res.ok) setDashboard(parseResourcePlanningEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const planAction = async (payload: Record<string, unknown>) => {
    setActionError(null);
    const res = await fetch("/api/aipify/resource-planning-engine/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.actionFailed);
      return false;
    }
    await load();
    return true;
  };

  const createPlan = async () => {
    setCreating(true);
    await planAction({
      plan_name: labels.defaultPlanName,
      planning_period: labels.defaultPlanningPeriod,
    });
    setCreating(false);
  };

  const approvePlan = async (plan: OrganizationResourcePlan) => {
    if (!plan.id) return;
    setBusyPlanId(plan.id);
    await planAction({ action: "approve", plan_id: plan.id });
    setBusyPlanId(null);
  };

  const compareScenarios = async (plan: OrganizationResourcePlan) => {
    if (!plan.id) return;
    setBusyPlanId(plan.id);
    await planAction({ action: "compare_scenarios", plan_id: plan.id });
    setBusyPlanId(null);
  };

  const exportManifest = async () => {
    setExporting(true);
    setActionError(null);
    const res = await fetch("/api/aipify/resource-planning-engine/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.exportFailed);
    }
    setExporting(false);
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const sections = dashboard.sections ?? {};
  const allocations = sections.allocation_summaries ?? [];
  const recommendations = dashboard.recommendations ?? sections.optimization_opportunities ?? [];

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        <p className="mt-2 text-xs text-emerald-700">{labels.distinctionNote}</p>
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded border border-emerald-300 px-3 py-1 text-xs text-emerald-800 disabled:opacity-50"
          disabled={creating}
          onClick={() => void createPlan()}
        >
          {creating ? labels.creating : labels.createPlan}
        </button>
        <button
          type="button"
          className="rounded border border-emerald-300 px-3 py-1 text-xs text-emerald-800 disabled:opacity-50"
          disabled={exporting}
          onClick={() => void exportManifest()}
        >
          {exporting ? labels.exporting : labels.exportManifest}
        </button>
      </div>

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.summary}</h3>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div><dt className="text-gray-500">{labels.activePlans}</dt><dd>{String(summary.active_plans ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.overUtilized}</dt><dd>{String(summary.over_utilized_allocations ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.planningGaps}</dt><dd>{String(summary.planning_gaps ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.avgUtilization}</dt><dd>{String(summary.avg_utilization_pct ?? 0)}%</dd></div>
          <div><dt className="text-gray-500">{labels.plansUnderReview}</dt><dd>{String(summary.plans_under_review ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.scenariosAvailable}</dt><dd>{String(summary.scenarios_available ?? 0)}</dd></div>
        </dl>
      </section>

      {dashboard.principles && dashboard.principles.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.principles}</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
            {dashboard.principles.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </section>
      )}

      {recommendations.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.recommendations}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {(recommendations as ResourcePlanningRecommendation[]).map((rec, i) => (
              <li key={`${rec.type ?? "rec"}-${i}`} className="rounded border border-gray-100 p-2">
                <span className="text-xs uppercase text-gray-500">{rec.type} · {rec.confidence}</span>
                <p className="mt-1">{rec.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {dashboard.plans && dashboard.plans.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.plans}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {dashboard.plans.map((plan) => (
              <li key={plan.id} className="rounded border border-gray-100 p-3">
                <div className="font-medium">{plan.plan_name}</div>
                <div className="mt-1 text-xs text-gray-500">
                  {plan.planning_period} · {plan.status}
                </div>
                {plan.status !== "active" && plan.id && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded border px-2 py-0.5 text-xs disabled:opacity-50"
                      disabled={busyPlanId === plan.id}
                      onClick={() => void approvePlan(plan)}
                    >
                      {labels.approvePlan}
                    </button>
                  </div>
                )}
                {plan.status === "active" && plan.id && (
                  <button
                    type="button"
                    className="mt-2 rounded border px-2 py-0.5 text-xs disabled:opacity-50"
                    disabled={busyPlanId === plan.id}
                    onClick={() => void compareScenarios(plan)}
                  >
                    {labels.compareScenarios}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {allocations.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.allocations}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {allocations.map((alloc: OrganizationResourceAllocation) => (
              <li key={alloc.id} className="rounded border border-gray-100 p-2">
                <span className="font-medium">{alloc.resource_type}</span>
                <span className="ml-2 text-xs text-gray-500">
                  {labels.allocated}: {alloc.allocated_amount} · {labels.utilized}: {alloc.utilized_amount} · {labels.variance}: {alloc.variance}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {dashboard.integration_summaries && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.integrationSummaries}</h3>
          <pre className="mt-2 overflow-x-auto text-xs text-gray-600">
            {JSON.stringify(dashboard.integration_summaries, null, 2)}
          </pre>
        </section>
      )}
    </div>
  );
}
