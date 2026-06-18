"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import { useCallback, useEffect, useState } from "react";
import {
  parseRecordsRetentionManagementEngineDashboard,
  type ArchivedRecord,
  type RecordDisposalRequest,
  type RecordsRetentionManagementEngineDashboard,
  type RetentionPolicy,
} from "@/lib/aipify/records-retention-management-engine";

type Props = { labels: Record<string, string> };

export function RecordsRetentionManagementEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<RecordsRetentionManagementEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [activatingPolicy, setActivatingPolicy] = useState<string | null>(null);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [disposing, setDisposing] = useState<string | null>(null);
  const [approving, setApproving] = useState<string | null>(null);
  const [completing, setCompleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/records-retention-management-engine/dashboard");
    if (res.ok) setDashboard(parseRecordsRetentionManagementEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const activatePolicy = async (policy: RetentionPolicy) => {
    if (!policy.id) return;
    setActivatingPolicy(policy.id);
    setActionError(null);
    const res = await fetch("/api/aipify/records-retention-management-engine/policies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update", policy_id: policy.id, status: "active" }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.activateFailed);
    } else {
      await load();
    }
    setActivatingPolicy(null);
  };

  const restoreRecord = async (record: ArchivedRecord) => {
    if (!record.id) return;
    setRestoring(record.id);
    setActionError(null);
    const res = await fetch("/api/aipify/records-retention-management-engine/restore", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archived_record_id: record.id }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.restoreFailed);
    } else {
      await load();
    }
    setRestoring(null);
  };

  const requestDisposal = async (record: ArchivedRecord) => {
    if (!record.id) return;
    setDisposing(record.id);
    setActionError(null);
    const res = await fetch("/api/aipify/records-retention-management-engine/dispose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archived_record_id: record.id, reason: "Retention period review" }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.disposeFailed);
    } else {
      await load();
    }
    setDisposing(null);
  };

  const approveDisposal = async (request: RecordDisposalRequest, approved: boolean) => {
    if (!request.id) return;
    setApproving(request.id);
    setActionError(null);
    const res = await fetch("/api/aipify/records-retention-management-engine/dispose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "approve",
        disposal_request_id: request.id,
        approved,
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

  const completeDisposal = async (request: RecordDisposalRequest) => {
    if (!request.id) return;
    setCompleting(request.id);
    setActionError(null);
    const res = await fetch("/api/aipify/records-retention-management-engine/dispose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "complete", disposal_request_id: request.id }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.completeFailed);
    } else {
      await load();
    }
    setCompleting(null);
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const policies = dashboard.policies ?? [];
  const archivedRecords = dashboard.archived_records ?? [];
  const disposalRequests = dashboard.disposal_requests ?? [];
  const compliance = dashboard.compliance ?? {};

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        <p className="mt-2 text-xs text-violet-700">{labels.distinctionNote}</p>
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-xs text-gray-500">{labels.summary}</p>
        <pre className="mt-2 overflow-auto text-xs text-gray-700">{JSON.stringify(summary, null, 2)}</pre>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.compliance}</h3>
        <pre className="mt-2 overflow-auto text-xs text-gray-700">{JSON.stringify(compliance, null, 2)}</pre>
      </section>

      {dashboard.integration_summaries && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.integrationSummaries}</h3>
          <pre className="mt-2 overflow-auto text-xs text-gray-700">
            {JSON.stringify(dashboard.integration_summaries, null, 2)}
          </pre>
        </section>
      )}

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.policies}</h3>
        {policies.length === 0 ? (
          <p className="mt-2 text-sm text-gray-600">{labels.noPolicies}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {policies.map((policy) => (
              <li key={policy.id} className="rounded border border-gray-100 p-3 text-sm">
                <div className="font-medium">{policy.policy_name}</div>
                <div className="text-xs text-gray-500">
                  {policy.record_category} · {policy.retention_period_value} {policy.retention_period_unit} ·{" "}
                  {policy.status}
                </div>
                {policy.status === "draft" && policy.id && (
                  <button
                    type="button"
                    className="mt-2 rounded border border-violet-300 px-2 py-1 text-xs text-violet-800 disabled:opacity-50"
                    disabled={activatingPolicy === policy.id}
                    onClick={() => void activatePolicy(policy)}
                  >
                    {activatingPolicy === policy.id ? labels.activating : labels.activatePolicy}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.archivedRecords}</h3>
        {archivedRecords.length === 0 ? (
          <p className="mt-2 text-sm text-gray-600">{labels.noArchivedRecords}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {archivedRecords.map((record) => (
              <li key={record.id} className="rounded border border-gray-100 p-3 text-sm">
                <div className="font-medium">{record.source_entity_type}</div>
                <div className="text-xs text-gray-500">{record.archived_at}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {record.id && (
                    <>
                      <button
                        type="button"
                        className="rounded border border-gray-300 px-2 py-1 text-xs disabled:opacity-50"
                        disabled={restoring === record.id}
                        onClick={() => void restoreRecord(record)}
                      >
                        {restoring === record.id ? labels.restoring : labels.restore}
                      </button>
                      <button
                        type="button"
                        className="rounded border border-red-300 px-2 py-1 text-xs text-red-800 disabled:opacity-50"
                        disabled={disposing === record.id}
                        onClick={() => void requestDisposal(record)}
                      >
                        {disposing === record.id ? labels.requestingDisposal : labels.requestDisposal}
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.disposalRequests}</h3>
        {disposalRequests.length === 0 ? (
          <p className="mt-2 text-sm text-gray-600">{labels.noDisposalRequests}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {disposalRequests.map((request) => (
              <li key={request.id} className="rounded border border-gray-100 p-3 text-sm">
                <div className="font-medium">{request.status}</div>
                <div className="text-xs text-gray-500">{request.created_at}</div>
                {request.id && request.status === "pending" && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded border border-green-300 px-2 py-1 text-xs text-green-800 disabled:opacity-50"
                      disabled={approving === request.id}
                      onClick={() => void approveDisposal(request, true)}
                    >
                      {approving === request.id ? labels.approving : labels.approve}
                    </button>
                    <button
                      type="button"
                      className="rounded border border-gray-300 px-2 py-1 text-xs disabled:opacity-50"
                      disabled={approving === request.id}
                      onClick={() => void approveDisposal(request, false)}
                    >
                      {labels.reject}
                    </button>
                  </div>
                )}
                {request.id && request.status === "approved" && (
                  <button
                    type="button"
                    className="mt-2 rounded border border-red-300 px-2 py-1 text-xs text-red-800 disabled:opacity-50"
                    disabled={completing === request.id}
                    onClick={() => void completeDisposal(request)}
                  >
                    {completing === request.id ? labels.completing : labels.completeDisposal}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
