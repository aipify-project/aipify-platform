"use client";

import { useCallback, useEffect, useState } from "react";
import {
  parseOrganizationalResilienceEngineDashboard,
  type OrganizationalResilienceEngineDashboard,
  type ResiliencePlanRecord,
  type ResilienceVulnerabilityRecord,
} from "@/lib/aipify/organizational-resilience-engine";

type Props = { labels: Record<string, string> };

export function OrganizationalResilienceEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<OrganizationalResilienceEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [approving, setApproving] = useState<string | null>(null);
  const [simulating, setSimulating] = useState<string | null>(null);
  const [resolving, setResolving] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/organizational-resilience-engine/dashboard");
    if (res.ok) setDashboard(parseOrganizationalResilienceEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const approvePlan = async (plan: ResiliencePlanRecord) => {
    if (!plan.id) return;
    setApproving(plan.id);
    setActionError(null);
    const res = await fetch("/api/aipify/organizational-resilience-engine/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approve", plan_id: plan.id }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.approveFailed);
    } else {
      await load();
    }
    setApproving(null);
  };

  const submitForReview = async (plan: ResiliencePlanRecord) => {
    if (!plan.id) return;
    setUpdating(plan.id);
    setActionError(null);
    const res = await fetch("/api/aipify/organizational-resilience-engine/plans", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan_id: plan.id, status: "under_review" }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.updateFailed);
    } else {
      await load();
    }
    setUpdating(null);
  };

  const recordSimulation = async (plan: ResiliencePlanRecord) => {
    if (!plan.id) return;
    setSimulating(plan.id);
    setActionError(null);
    const res = await fetch("/api/aipify/organizational-resilience-engine/simulations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plan_id: plan.id,
        simulation_type: "tabletop",
        outcomes_metadata: { summary: "Tabletop exercise recorded from dashboard" },
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.simulationFailed);
    } else {
      await load();
    }
    setSimulating(null);
  };

  const resolveVulnerability = async (vulnerability: ResilienceVulnerabilityRecord) => {
    if (!vulnerability.id) return;
    setResolving(vulnerability.id);
    setActionError(null);
    const res = await fetch("/api/aipify/organizational-resilience-engine/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "resolve_vulnerability", vulnerability_id: vulnerability.id }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.resolveFailed);
    } else {
      await load();
    }
    setResolving(null);
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-xs text-gray-500">{labels.summary}</p>
        <pre className="mt-2 overflow-auto text-xs text-gray-700">{JSON.stringify(summary, null, 2)}</pre>
      </div>

      {dashboard.executive_summary && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.executiveSummary}</h3>
          <pre className="mt-2 overflow-auto text-xs text-gray-700">
            {JSON.stringify(dashboard.executive_summary, null, 2)}
          </pre>
        </section>
      )}

      {dashboard.principles && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.principles}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
            {dashboard.principles.map((pr) => <li key={pr}>{pr}</li>)}
          </ul>
        </section>
      )}

      {dashboard.plans && dashboard.plans.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.plans}</h3>
          <div className="mt-3 space-y-3">
            {dashboard.plans.map((plan) => (
              <div key={plan.id} className="rounded-lg border border-gray-200 p-3 text-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="font-medium text-gray-900">{plan.plan_name}</span>
                    <span className="ml-2 text-xs uppercase text-gray-500">{plan.scenario_type}</span>
                    <p className="mt-1 text-xs text-gray-600">
                      {labels.reviewFrequency}: {plan.review_frequency}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">{plan.status}</span>
                    {plan.status === "draft" && (
                      <>
                        <button
                          type="button"
                          className="rounded border border-teal-300 px-2 py-0.5 text-xs text-teal-700 disabled:opacity-50"
                          disabled={updating === plan.id}
                          onClick={() => void submitForReview(plan)}
                        >
                          {updating === plan.id ? labels.updating : labels.submitReview}
                        </button>
                        <button
                          type="button"
                          className="rounded border border-teal-300 px-2 py-0.5 text-xs text-teal-700 disabled:opacity-50"
                          disabled={approving === plan.id}
                          onClick={() => void approvePlan(plan)}
                        >
                          {approving === plan.id ? labels.approving : labels.approvePlan}
                        </button>
                      </>
                    )}
                    {plan.status === "active" && (
                      <button
                        type="button"
                        className="rounded border border-teal-300 px-2 py-0.5 text-xs text-teal-700 disabled:opacity-50"
                        disabled={simulating === plan.id}
                        onClick={() => void recordSimulation(plan)}
                      >
                        {simulating === plan.id ? labels.recording : labels.recordSimulation}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {dashboard.vulnerabilities && dashboard.vulnerabilities.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.vulnerabilities}</h3>
          <div className="mt-3 space-y-3">
            {dashboard.vulnerabilities.map((vulnerability) => (
              <div key={vulnerability.id} className="rounded-lg border border-gray-200 p-3 text-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="font-medium text-gray-900">{vulnerability.title}</span>
                    <span className="ml-2 text-xs uppercase text-gray-500">{vulnerability.severity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">{vulnerability.status}</span>
                    {vulnerability.status === "open" && (
                      <button
                        type="button"
                        className="rounded border border-teal-300 px-2 py-0.5 text-xs text-teal-700 disabled:opacity-50"
                        disabled={resolving === vulnerability.id}
                        onClick={() => void resolveVulnerability(vulnerability)}
                      >
                        {resolving === vulnerability.id ? labels.resolving : labels.resolve}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {dashboard.simulations && dashboard.simulations.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.simulations}</h3>
          <div className="mt-3 space-y-2 text-sm text-gray-600">
            {dashboard.simulations.map((sim) => (
              <div key={sim.id} className="rounded border border-gray-100 p-2">
                <span className="font-medium">{sim.simulation_type}</span>
                <span className="ml-2 text-xs">{sim.status}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {dashboard.integration_summaries && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.integrationSummaries}</h3>
          <pre className="mt-2 overflow-auto text-xs text-gray-700">
            {JSON.stringify(dashboard.integration_summaries, null, 2)}
          </pre>
        </section>
      )}
    </div>
  );
}
