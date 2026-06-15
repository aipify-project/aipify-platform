"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  buildComplianceFilterQuery,
  parseComplianceGovernanceCenter,
  RISK_BADGES,
  STATUS_BADGES,
  type ComplianceFilters,
  type ComplianceGovernanceCenter,
  type ComplianceGovernanceCenterLabels,
} from "@/lib/compliance-governance-center";
import type { PolicyCategory, PolicyStatus, RiskLevel } from "@/lib/compliance-governance-center/constants";

type ComplianceGovernanceCenterPanelProps = {
  labels: ComplianceGovernanceCenterLabels;
  backHref: string;
};

function OverviewCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

function StatusPill({ label, className }: { label: string; className: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${className}`}>
      {label}
    </span>
  );
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString();
}

export function ComplianceGovernanceCenterPanel({ labels, backHref }: ComplianceGovernanceCenterPanelProps) {
  const [center, setCenter] = useState<ComplianceGovernanceCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filters, setFilters] = useState<ComplianceFilters>({});
  const [draftFilters, setDraftFilters] = useState<ComplianceFilters>({});
  const [newPolicyName, setNewPolicyName] = useState("");
  const [newPolicyOwner, setNewPolicyOwner] = useState("");
  const [newPolicySummary, setNewPolicySummary] = useState("");
  const [retentionEdits, setRetentionEdits] = useState<Record<string, number>>({});

  const load = useCallback(async (activeFilters: ComplianceFilters) => {
    setLoading(true);
    const query = buildComplianceFilterQuery(activeFilters);
    const res = await fetch(`/api/compliance-governance-center/overview${query}`);
    if (res.ok) setCenter(parseComplianceGovernanceCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load(filters);
  }, [filters, load]);

  const handleAction = useCallback(
    async (payload: Record<string, unknown>) => {
      const id = String(payload.id ?? "action");
      setBusyId(id);
      try {
        const res = await fetch("/api/compliance-governance-center/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, filters }),
        });
        if (res.ok) setCenter(parseComplianceGovernanceCenter(await res.json()));
      } finally {
        setBusyId(null);
      }
    },
    [filters]
  );

  const handleCreatePolicy = useCallback(async () => {
    if (!newPolicyName.trim()) return;
    setBusyId("create");
    await handleAction({
      action: "create_policy",
      policy_name: newPolicyName.trim(),
      owner: newPolicyOwner.trim(),
      summary: newPolicySummary.trim(),
      category: "operational_standards",
    });
    setNewPolicyName("");
    setNewPolicyOwner("");
    setNewPolicySummary("");
  }, [handleAction, newPolicyName, newPolicyOwner, newPolicySummary]);

  const handleExport = useCallback(
    async (format: "csv" | "xlsx" | "pdf") => {
      const query = buildComplianceFilterQuery(filters);
      const sep = query ? "&" : "?";
      window.location.href = `/api/compliance-governance-center/export${query}${sep}format=${format}`;
    },
    [filters]
  );

  if (loading && !center) {
    return <p className="p-6 text-sm text-gray-500">{labels.loading}</p>;
  }

  if (!center) {
    return <p className="p-6 text-sm text-red-600">{labels.loading}</p>;
  }

  const { overview, reports } = center;

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          ← {labels.back}
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-gray-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 text-sm text-gray-800">
          {center.principle}
        </p>
      </div>

      <section>
        <h2 className="mb-4 font-semibold text-gray-900">{labels.sections.overview}</h2>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <OverviewCard label={labels.overview.complianceAlerts} value={overview.compliance_alerts} />
          <OverviewCard label={labels.overview.policiesRequiringReview} value={overview.policies_requiring_review} />
          <OverviewCard label={labels.overview.pendingApprovals} value={overview.pending_approvals} />
          <OverviewCard label={labels.overview.governanceExceptions} value={overview.governance_exceptions} />
          <OverviewCard label={labels.overview.auditFindings} value={overview.audit_findings} />
          <OverviewCard label={labels.overview.highRiskActivities} value={overview.high_risk_activities} />
        </dl>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.modules}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {center.modules.map((mod) => (
            <span key={mod} className="rounded-lg bg-indigo-50 px-3 py-1.5 text-sm text-indigo-800 ring-1 ring-indigo-100">
              {labels.modules[mod]}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.filters}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.category}</span>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.category ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({ ...prev, category: e.target.value as PolicyCategory | "" }))
              }
            >
              <option value="">{labels.filters.allCategories}</option>
              {Object.entries(labels.categories).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.status}</span>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.status ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({ ...prev, status: e.target.value as PolicyStatus | "" }))
              }
            >
              <option value="">{labels.filters.allStatuses}</option>
              {Object.entries(labels.policyStatuses).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.riskLevel}</span>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.risk_level ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({ ...prev, risk_level: e.target.value as RiskLevel | "" }))
              }
            >
              <option value="">{labels.filters.allRiskLevels}</option>
              {Object.entries(labels.riskLevels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.owner}</span>
            <input
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.owner ?? ""}
              onChange={(e) => setDraftFilters((prev) => ({ ...prev, owner: e.target.value }))}
            />
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.reviewFrom}</span>
            <input
              type="date"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.review_from ?? ""}
              onChange={(e) => setDraftFilters((prev) => ({ ...prev, review_from: e.target.value }))}
            />
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.reviewTo}</span>
            <input
              type="date"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.review_to ?? ""}
              onChange={(e) => setDraftFilters((prev) => ({ ...prev, review_to: e.target.value }))}
            />
          </label>
        </div>
        <button
          type="button"
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          onClick={() => setFilters(draftFilters)}
        >
          {labels.filters.apply}
        </button>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.createPolicy}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            placeholder={labels.create.placeholderName}
            value={newPolicyName}
            onChange={(e) => setNewPolicyName(e.target.value)}
          />
          <input
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            placeholder={labels.create.placeholderOwner}
            value={newPolicyOwner}
            onChange={(e) => setNewPolicyOwner(e.target.value)}
          />
        </div>
        <textarea
          className="mt-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          rows={3}
          placeholder={labels.create.placeholderSummary}
          value={newPolicySummary}
          onChange={(e) => setNewPolicySummary(e.target.value)}
        />
        <button
          type="button"
          disabled={!newPolicyName.trim() || busyId === "create"}
          className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          onClick={() => void handleCreatePolicy()}
        >
          {busyId === "create" ? labels.actions.applying : labels.create.submit}
        </button>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.policies}</h2>
        {center.policies.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">{labels.emptyState}</p>
        ) : (
          <div className="mt-4 space-y-4">
            {center.policies.map((policy) => (
              <article key={policy.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{policy.policy_name}</h3>
                    <p className="mt-1 text-sm text-gray-600">{policy.summary || "—"}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <StatusPill label={labels.policyStatuses[policy.status]} className={STATUS_BADGES[policy.status]} />
                      <StatusPill label={labels.riskLevels[policy.risk_level]} className={RISK_BADGES[policy.risk_level]} />
                      <span className="text-xs text-gray-500">
                        {labels.categories[policy.category]} · {labels.table.owner}: {policy.owner}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {labels.table.reviewDate}: {formatDate(policy.review_date)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {policy.status === "draft" && (
                      <button
                        type="button"
                        disabled={busyId === policy.id}
                        className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                        onClick={() =>
                          void handleAction({ action: "update_policy_status", id: policy.id, status: "active" })
                        }
                      >
                        {labels.actions.activatePolicy}
                      </button>
                    )}
                    {policy.status !== "archived" && (
                      <button
                        type="button"
                        disabled={busyId === policy.id}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        onClick={() =>
                          void handleAction({ action: "update_policy_status", id: policy.id, status: "archived" })
                        }
                      >
                        {labels.actions.archivePolicy}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.approvals}</h2>
        {center.approvals.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">{labels.emptyState}</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-gray-500">
                  <th className="py-2 pr-4">{labels.table.request}</th>
                  <th className="py-2 pr-4">{labels.table.category}</th>
                  <th className="py-2 pr-4">{labels.table.submittedBy}</th>
                  <th className="py-2 pr-4">{labels.table.priority}</th>
                  <th className="py-2 pr-4">{labels.table.dueDate}</th>
                  <th className="py-2 pr-4">{labels.table.approver}</th>
                  <th className="py-2">{labels.table.actions}</th>
                </tr>
              </thead>
              <tbody>
                {center.approvals.map((approval) => (
                  <tr key={approval.id} className="border-b border-gray-50">
                    <td className="py-3 pr-4 font-medium text-gray-900">{approval.request_title}</td>
                    <td className="py-3 pr-4">{labels.categories[approval.category]}</td>
                    <td className="py-3 pr-4">{approval.submitted_by}</td>
                    <td className="py-3 pr-4">{labels.priorities[approval.priority]}</td>
                    <td className="py-3 pr-4">{formatDate(approval.due_date)}</td>
                    <td className="py-3 pr-4">{approval.approver}</td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-1">
                        <button
                          type="button"
                          disabled={busyId === approval.id}
                          className="rounded bg-green-600 px-2 py-1 text-xs text-white disabled:opacity-50"
                          onClick={() => void handleAction({ action: "approve_request", id: approval.id })}
                        >
                          {labels.actions.approve}
                        </button>
                        <button
                          type="button"
                          disabled={busyId === approval.id}
                          className="rounded border px-2 py-1 text-xs disabled:opacity-50"
                          onClick={() => void handleAction({ action: "reject_request", id: approval.id })}
                        >
                          {labels.actions.reject}
                        </button>
                        <button
                          type="button"
                          disabled={busyId === approval.id}
                          className="rounded border px-2 py-1 text-xs disabled:opacity-50"
                          onClick={() => void handleAction({ action: "request_changes", id: approval.id })}
                        >
                          {labels.actions.requestChanges}
                        </button>
                        <button
                          type="button"
                          disabled={busyId === approval.id}
                          className="rounded border px-2 py-1 text-xs disabled:opacity-50"
                          onClick={() => void handleAction({ action: "escalate_request", id: approval.id })}
                        >
                          {labels.actions.escalate}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.retention}</h2>
        <ul className="mt-4 divide-y divide-gray-100">
          {center.retention.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p className="font-medium text-gray-900">{labels.retentionTypes[item.data_type]}</p>
                <p className="text-xs text-gray-500">{labels.table.retentionDays}</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={30}
                  max={3650}
                  className="w-24 rounded-lg border border-gray-200 px-2 py-1 text-sm"
                  value={retentionEdits[item.id] ?? item.retention_days}
                  onChange={(e) =>
                    setRetentionEdits((prev) => ({ ...prev, [item.id]: Number(e.target.value) }))
                  }
                />
                <button
                  type="button"
                  disabled={busyId === item.id}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  onClick={() =>
                    void handleAction({
                      action: "update_retention",
                      id: item.id,
                      retention_days: retentionEdits[item.id] ?? item.retention_days,
                    })
                  }
                >
                  {labels.actions.updateRetention}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.access}</h2>
        <ul className="mt-4 divide-y divide-gray-100">
          {center.access.map((record) => (
            <li key={record.id} className="flex flex-wrap items-start justify-between gap-3 py-3">
              <div>
                <p className="font-medium text-gray-900">{record.subject}</p>
                <p className="text-sm text-gray-600">{record.detail}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {labels.accessTypes[record.record_type]} · {labels.riskLevels[record.risk_level]}
                </p>
              </div>
              <button
                type="button"
                disabled={busyId === record.id}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                onClick={() => void handleAction({ action: "complete_access_review", id: record.id })}
              >
                {labels.actions.completeAccessReview}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.alerts}</h2>
        <ul className="mt-4 divide-y divide-gray-100">
          {center.alerts.map((alert) => (
            <li key={alert.id} className="flex flex-wrap items-start justify-between gap-3 py-3">
              <div>
                <p className="font-medium text-gray-900">{alert.message}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {labels.alertTypes[alert.alert_type]} · {labels.table.severity}: {labels.riskLevels[alert.severity]}
                </p>
              </div>
              <button
                type="button"
                disabled={busyId === alert.id}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                onClick={() => void handleAction({ action: "resolve_alert", id: alert.id })}
              >
                {labels.actions.resolveAlert}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.exceptions}</h2>
        <ul className="mt-4 divide-y divide-gray-100">
          {center.exceptions.map((exc) => (
            <li key={exc.id} className="flex flex-wrap items-start justify-between gap-3 py-3">
              <div>
                <p className="font-medium text-gray-900">{exc.title}</p>
                <p className="text-sm text-gray-600">{exc.summary}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {labels.table.owner}: {exc.owner} · {labels.table.expiresAt}: {formatDate(exc.expires_at)}
                </p>
              </div>
              <button
                type="button"
                disabled={busyId === exc.id}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                onClick={() => void handleAction({ action: "resolve_exception", id: exc.id })}
              >
                {labels.actions.resolveException}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.reports}</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <OverviewCard label={labels.reports.governanceActivities} value={reports.governance_activities} />
          <OverviewCard label={labels.reports.approvalHistories} value={reports.approval_histories} />
          <OverviewCard label={labels.reports.policyCompliance} value={reports.policy_compliance} />
          <OverviewCard label={labels.reports.auditSummaries} value={reports.audit_summaries} />
        </dl>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={() => void handleExport("pdf")}
          >
            {labels.reports.exportPdf}
          </button>
          <button
            type="button"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={() => void handleExport("xlsx")}
          >
            {labels.reports.exportExcel}
          </button>
          <button
            type="button"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={() => void handleExport("csv")}
          >
            {labels.reports.exportCsv}
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.audit}</h2>
        {center.audit.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">{labels.emptyState}</p>
        ) : (
          <ul className="mt-4 divide-y divide-gray-100">
            {center.audit.map((entry) => (
              <li key={entry.id} className="py-3">
                <p className="text-sm text-gray-900">{entry.summary}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {entry.event_type} · {new Date(entry.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
