"use client";

import { useCallback, useEffect, useState } from "react";
import {
  parseOrganizationalDecisionSupportEngineDashboard,
  type OrganizationalDecisionItem,
  type OrganizationalDecisionSupportEngineDashboard,
} from "@/lib/aipify/organizational-decision-support-engine";

type Props = { labels: Record<string, string> };

export function OrganizationalDecisionSupportEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<OrganizationalDecisionSupportEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [reviewing, setReviewing] = useState<string | null>(null);
  const [approving, setApproving] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [implementing, setImplementing] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/organizational-decision-support-engine/dashboard");
    if (res.ok) setDashboard(parseOrganizationalDecisionSupportEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const reviewDecision = async (decision: OrganizationalDecisionItem) => {
    if (!decision.id) return;
    setReviewing(decision.id);
    setActionError(null);
    const res = await fetch("/api/aipify/organizational-decision-support-engine/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        decision_id: decision.id,
        review_notes: "Moved to review from organizational decision dashboard",
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.reviewFailed);
    } else {
      await load();
    }
    setReviewing(null);
  };

  const approveDecision = async (decision: OrganizationalDecisionItem) => {
    if (!decision.id) return;
    setApproving(decision.id);
    setActionError(null);
    const res = await fetch("/api/aipify/organizational-decision-support-engine/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "approve",
        decision_id: decision.id,
        approval_rationale: "Approved from organizational decision dashboard",
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.approveFailed);
    } else {
      await load();
    }
    setApproving(null);
  };

  const rejectDecision = async (decision: OrganizationalDecisionItem) => {
    if (!decision.id) return;
    setRejecting(decision.id);
    setActionError(null);
    const res = await fetch("/api/aipify/organizational-decision-support-engine/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "reject",
        decision_id: decision.id,
        rejection_rationale: "Rejected from organizational decision dashboard",
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.rejectFailed);
    } else {
      await load();
    }
    setRejecting(null);
  };

  const markImplemented = async (decision: OrganizationalDecisionItem) => {
    if (!decision.id) return;
    setImplementing(decision.id);
    setActionError(null);
    const res = await fetch("/api/aipify/organizational-decision-support-engine/decisions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "mark_implemented", decision_id: decision.id }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.implementFailed);
    } else {
      await load();
    }
    setImplementing(null);
  };

  const exportReport = async () => {
    setExporting(true);
    setActionError(null);
    const res = await fetch("/api/aipify/organizational-decision-support-engine/export", {
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

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        <p className="mt-2 text-xs text-indigo-700">{labels.distinctionNote}</p>
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded border border-indigo-300 px-3 py-1 text-xs text-indigo-800 disabled:opacity-50"
          disabled={exporting}
          onClick={() => void exportReport()}
        >
          {exporting ? labels.exporting : labels.exportReport}
        </button>
      </div>

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

      {dashboard.decisions && dashboard.decisions.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.decisions}</h3>
          <div className="mt-3 space-y-3">
            {dashboard.decisions.map((decision) => (
              <div key={decision.id} className="rounded-lg border border-gray-200 p-3 text-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="font-medium text-gray-900">{decision.decision_title}</span>
                    <span className="ml-2 text-xs uppercase text-gray-500">{decision.decision_category}</span>
                    <p className="mt-1 text-xs text-gray-600">{decision.recommendation}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {labels.confidence}: {decision.confidence_level}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">{decision.status}</span>
                    {decision.status === "proposed" && (
                      <button
                        type="button"
                        className="rounded border border-indigo-300 px-2 py-0.5 text-xs text-indigo-700 disabled:opacity-50"
                        disabled={reviewing === decision.id}
                        onClick={() => void reviewDecision(decision)}
                      >
                        {reviewing === decision.id ? labels.reviewing : labels.startReview}
                      </button>
                    )}
                    {(decision.status === "proposed" || decision.status === "under_review") && (
                      <>
                        <button
                          type="button"
                          className="rounded border border-green-300 px-2 py-0.5 text-xs text-green-700 disabled:opacity-50"
                          disabled={approving === decision.id}
                          onClick={() => void approveDecision(decision)}
                        >
                          {approving === decision.id ? labels.approving : labels.approve}
                        </button>
                        <button
                          type="button"
                          className="rounded border border-red-300 px-2 py-0.5 text-xs text-red-700 disabled:opacity-50"
                          disabled={rejecting === decision.id}
                          onClick={() => void rejectDecision(decision)}
                        >
                          {rejecting === decision.id ? labels.rejecting : labels.reject}
                        </button>
                      </>
                    )}
                    {decision.status === "approved" && (
                      <button
                        type="button"
                        className="rounded border border-indigo-300 px-2 py-0.5 text-xs text-indigo-700 disabled:opacity-50"
                        disabled={implementing === decision.id}
                        onClick={() => void markImplemented(decision)}
                      >
                        {implementing === decision.id ? labels.implementing : labels.markImplemented}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {dashboard.outcomes && dashboard.outcomes.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.outcomes}</h3>
          <div className="mt-3 space-y-2">
            {dashboard.outcomes.map((outcome) => (
              <div key={outcome.id} className="rounded-lg border border-gray-100 p-2 text-xs text-gray-600">
                {outcome.outcome_summary}
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
