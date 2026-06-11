"use client";

import { useCallback, useEffect, useState } from "react";
import {
  parseChangeManagementEngineDashboard,
  type ChangeCommunicationPlanRecord,
  type ChangeInitiativeRecord,
  type ChangeManagementEngineDashboard,
  type ChangeMilestoneRecord,
} from "@/lib/aipify/change-management-engine";

type Props = { labels: Record<string, string> };

export function ChangeManagementEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<ChangeManagementEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [releasing, setReleasing] = useState<string | null>(null);
  const [completing, setCompleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/change-management-engine/dashboard");
    if (res.ok) setDashboard(parseChangeManagementEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const updateStatus = async (initiative: ChangeInitiativeRecord, status: string) => {
    if (!initiative.id) return;
    setUpdating(initiative.id);
    setActionError(null);
    const res = await fetch("/api/aipify/change-management-engine/initiatives", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initiative_id: initiative.id, status }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.updateFailed);
    } else {
      await load();
    }
    setUpdating(null);
  };

  const releaseCommunication = async (plan: ChangeCommunicationPlanRecord) => {
    if (!plan.id) return;
    setReleasing(plan.id);
    setActionError(null);
    const res = await fetch("/api/aipify/change-management-engine/communicate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "release", plan_id: plan.id }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.releaseFailed);
    } else {
      await load();
    }
    setReleasing(null);
  };

  const completeMilestone = async (milestone: ChangeMilestoneRecord) => {
    if (!milestone.id) return;
    setCompleting(milestone.id);
    setActionError(null);
    const res = await fetch("/api/aipify/change-management-engine/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "complete_milestone", milestone_id: milestone.id }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.milestoneFailed);
    } else {
      await load();
    }
    setCompleting(null);
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
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

      {dashboard.principles && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.principles}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
            {dashboard.principles.map((pr) => <li key={pr}>{pr}</li>)}
          </ul>
        </section>
      )}

      {dashboard.initiatives && dashboard.initiatives.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.initiatives}</h3>
          <div className="mt-3 space-y-3">
            {dashboard.initiatives.map((initiative) => (
              <div key={initiative.id} className="rounded-lg border border-gray-200 p-3 text-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="font-medium text-gray-900">{initiative.initiative_name}</span>
                    <span className="ml-2 text-xs uppercase text-gray-500">{initiative.change_type}</span>
                    <p className="mt-1 text-xs text-gray-600">{initiative.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">{initiative.status}</span>
                    {initiative.status === "planning" && (
                      <button
                        type="button"
                        className="rounded border border-indigo-300 px-2 py-0.5 text-xs text-indigo-700 disabled:opacity-50"
                        disabled={updating === initiative.id}
                        onClick={() => void updateStatus(initiative, "in_progress")}
                      >
                        {updating === initiative.id ? labels.updating : labels.startInitiative}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {dashboard.milestones && dashboard.milestones.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.milestones}</h3>
          <div className="mt-3 space-y-2">
            {dashboard.milestones.map((milestone) => (
              <div key={milestone.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-2 text-sm">
                <span className={milestone.status === "completed" ? "text-gray-400 line-through" : "text-gray-700"}>
                  {milestone.milestone_name}
                </span>
                {milestone.status === "pending" && (
                  <button
                    type="button"
                    className="rounded border border-green-300 px-2 py-0.5 text-xs text-green-700 disabled:opacity-50"
                    disabled={completing === milestone.id}
                    onClick={() => void completeMilestone(milestone)}
                  >
                    {completing === milestone.id ? labels.completing : labels.completeMilestone}
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {dashboard.communication_plans && dashboard.communication_plans.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.communications}</h3>
          <div className="mt-3 space-y-3">
            {dashboard.communication_plans.map((plan) => (
              <div key={plan.id} className="rounded-lg border border-gray-200 p-3 text-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="font-medium">{plan.subject}</span>
                    <span className="ml-2 text-xs text-gray-500">{plan.communication_type}</span>
                    <p className="mt-1 text-xs text-gray-600">{plan.message_summary}</p>
                  </div>
                  {plan.status !== "released" && (
                    <button
                      type="button"
                      className="rounded border border-indigo-300 px-2 py-0.5 text-xs text-indigo-700 disabled:opacity-50"
                      disabled={releasing === plan.id}
                      onClick={() => void releaseCommunication(plan)}
                    >
                      {releasing === plan.id ? labels.releasing : labels.releaseCommunication}
                    </button>
                  )}
                </div>
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
