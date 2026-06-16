"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseAipifyHostsReputationCenterActionResult,
  parseAipifyHostsReputationCenterDashboard,
  type HostsImprovementOpportunity,
  type HostsPropertyReviewRow,
  type HostsRecoveryCaseRow,
  type HostsReputationCenterDashboard,
  type HostsReputationSectionKey,
  type HostsReputationTrends,
} from "@/lib/aipify/aipify-hosts-reputation-center";

type Props = { labels: Record<string, string> };

function labelFor(labels: Record<string, string>, prefix: string, key: string): string {
  return labels[`${prefix}_${key}`] ?? key.replace(/_/g, " ");
}

function statusBadge(status: string): string {
  const map: Record<string, string> = {
    new: "bg-sky-50 text-sky-800 ring-sky-200",
    reviewed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    action_required: "bg-amber-50 text-amber-900 ring-amber-200",
    closed: "bg-gray-100 text-gray-700 ring-gray-200",
    open: "bg-amber-50 text-amber-900 ring-amber-200",
    in_progress: "bg-indigo-50 text-indigo-800 ring-indigo-200",
    resolved: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    overdue: "bg-red-50 text-red-800 ring-red-200",
    critical: "bg-red-50 text-red-800 ring-red-200",
    attention: "bg-amber-50 text-amber-900 ring-amber-200",
    good: "bg-blue-50 text-blue-800 ring-blue-200",
    excellent: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  };
  return map[status] ?? "bg-gray-100 text-gray-700 ring-gray-200";
}

function EmptyBoard({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 px-4 py-8 text-center">
      <p className="text-sm font-medium text-gray-800">{title}</p>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
    </div>
  );
}

function MetricCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-gray-900">{value}</dd>
      {sub && <p className="mt-1 text-xs text-gray-500">{sub}</p>}
    </div>
  );
}

function ReviewsTable({
  rows,
  labels,
  busy,
  onAction,
}: {
  rows: HostsPropertyReviewRow[];
  labels: Record<string, string>;
  busy: boolean;
  onAction: (body: Record<string, unknown>) => void;
}) {
  if (rows.length === 0) return <EmptyBoard title={labels.emptyReviewsTitle} message={labels.emptyReviewsMessage} />;
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">{labels.property}</th>
            <th className="px-4 py-3">{labels.stayPeriod}</th>
            <th className="px-4 py-3">{labels.overallRating}</th>
            <th className="px-4 py-3">{labels.reviewDate}</th>
            <th className="px-4 py-3">{labels.status}</th>
            <th className="px-4 py-3">{labels.actions}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-100">
              <td className="px-4 py-3">
                <div className="font-medium text-gray-900">{row.property}</div>
                {row.guest_name && <div className="text-xs text-gray-500">{row.guest_name}</div>}
              </td>
              <td className="px-4 py-3 text-gray-600">{row.stay_period}</td>
              <td className="px-4 py-3 font-semibold text-gray-900">{row.overall_rating.toFixed(1)}</td>
              <td className="px-4 py-3 text-gray-600">{row.review_date}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.review_status)}`}>
                  {labelFor(labels, "reviewStatus", row.review_status)}
                </span>
              </td>
              <td className="px-4 py-3 min-w-[240px]">
                <div className="flex flex-wrap gap-2">
                  {row.review_status === "new" && (
                    <button type="button" disabled={busy} onClick={() => onAction({ action_type: "update_review_status", review_id: row.id, status: "reviewed" })} className="text-xs font-medium text-emerald-700 disabled:opacity-60">{labels.markReviewed}</button>
                  )}
                  {row.review_status !== "action_required" && row.review_status !== "closed" && (
                    <button type="button" disabled={busy} onClick={() => onAction({ action_type: "update_review_status", review_id: row.id, status: "action_required" })} className="text-xs font-medium text-amber-700 disabled:opacity-60">{labels.flagActionRequired}</button>
                  )}
                  <button type="button" disabled={busy} onClick={() => onAction({ action_type: "schedule_inspection", review_id: row.id, owner: labels.defaultOwner })} className="text-xs font-medium text-indigo-700 disabled:opacity-60">{labels.scheduleInspection}</button>
                  <button type="button" disabled={busy} onClick={() => onAction({ action_type: "create_task", review_id: row.id, owner: labels.defaultOwner })} className="text-xs font-medium text-gray-700 disabled:opacity-60">{labels.createTask}</button>
                  <button type="button" disabled={busy} onClick={() => onAction({ action_type: "open_incident", review_id: row.id, owner: labels.defaultOwner })} className="text-xs font-medium text-red-700 disabled:opacity-60">{labels.openIncident}</button>
                </div>
                {row.guest_summary && <p className="mt-1 text-xs text-gray-500 line-clamp-2">{row.guest_summary}</p>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TrendsPanel({ trends, labels }: { trends: HostsReputationTrends | null; labels: Record<string, string> }) {
  if (!trends) return <EmptyBoard title={labels.emptyTrendsTitle} message={labels.emptyTrendsMessage} />;
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900">{labels.ratingTrends}</h3>
        <ul className="mt-3 space-y-2 text-sm">
          {trends.rating_trends.map((p) => (
            <li key={p.month} className="flex justify-between">
              <span className="text-gray-600">{p.month}</span>
              <span className="font-medium">{p.avg_rating.toFixed(1)} {p.review_count != null && <span className="text-xs text-gray-500">({p.review_count})</span>}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900">{labels.propertyComparisons}</h3>
        <ul className="mt-3 space-y-2 text-sm">
          {trends.property_comparisons.map((p) => (
            <li key={p.property_id} className="flex items-center justify-between gap-2">
              <span className="text-gray-800">{p.property}</span>
              <span className="flex items-center gap-2">
                <span className="font-medium">{p.avg_rating.toFixed(1)}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs ring-1 ${statusBadge(p.reputation_status)}`}>{labelFor(labels, "reputationStatus", p.reputation_status)}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
        <h3 className="text-sm font-semibold text-gray-900">{labels.categoryTrends}</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(trends.category_trends).slice(0, 6).map(([cat, points]) => (
            <div key={cat} className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs font-medium uppercase text-gray-500">{labelFor(labels, "reviewCategory", cat)}</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {points.length > 0 ? points[points.length - 1].avg_rating.toFixed(1) : "—"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OpportunitiesPanel({ items, labels }: { items: HostsImprovementOpportunity[]; labels: Record<string, string> }) {
  if (items.length === 0) return <EmptyBoard title={labels.emptyOpportunitiesTitle} message={labels.emptyOpportunitiesMessage} />;
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={`${item.type}-${item.category ?? item.property_id ?? i}`} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium text-gray-900">{item.label}</p>
              <p className="mt-1 text-xs text-gray-500">{labelFor(labels, "opportunityType", item.type)}</p>
            </div>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(item.severity === "high" ? "critical" : "attention")}`}>
              {labelFor(labels, "severity", item.severity)}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

function RecoveryPanel({
  rows,
  labels,
  busy,
  onAction,
}: {
  rows: HostsRecoveryCaseRow[];
  labels: Record<string, string>;
  busy: boolean;
  onAction: (body: Record<string, unknown>) => void;
}) {
  if (rows.length === 0) return <EmptyBoard title={labels.emptyRecoveryTitle} message={labels.emptyRecoveryMessage} />;
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">{labels.caseReference}</th>
            <th className="px-4 py-3">{labels.property}</th>
            <th className="px-4 py-3">{labels.actionType}</th>
            <th className="px-4 py-3">{labels.assignedOwner}</th>
            <th className="px-4 py-3">{labels.dueDate}</th>
            <th className="px-4 py-3">{labels.status}</th>
            <th className="px-4 py-3">{labels.actions}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className={`border-b border-gray-100 ${row.is_overdue ? "bg-red-50/30" : ""}`}>
              <td className="px-4 py-3 font-medium text-gray-900">{row.case_key}</td>
              <td className="px-4 py-3 text-gray-700">{row.property}</td>
              <td className="px-4 py-3 text-gray-700">{labelFor(labels, "recoveryAction", row.action_type)}</td>
              <td className="px-4 py-3 text-gray-600">{row.assigned_owner || "—"}</td>
              <td className="px-4 py-3 text-gray-600">{row.due_date || "—"}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.is_overdue ? "overdue" : row.case_status)}`}>
                  {row.is_overdue ? labels.overdue : labelFor(labels, "caseStatus", row.case_status)}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  <button type="button" disabled={busy} onClick={() => onAction({ action_type: "assign_recovery_owner", recovery_id: row.id, owner: labels.defaultOwner })} className="text-xs font-medium text-indigo-700 disabled:opacity-60">{labels.assignOwner}</button>
                  <button type="button" disabled={busy} onClick={() => onAction({ action_type: "document_resolution", recovery_id: row.id, notes: labels.defaultResolutionNote })} className="text-xs font-medium text-emerald-700 disabled:opacity-60">{labels.documentResolution}</button>
                  {row.case_status !== "resolved" && (
                    <button type="button" disabled={busy} onClick={() => onAction({ action_type: "close_recovery_case", recovery_id: row.id })} className="text-xs font-medium text-gray-700 disabled:opacity-60">{labels.closeCase}</button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AipifyHostsReputationCenterDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<HostsReputationCenterDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeSection, setActiveSection] = useState<HostsReputationSectionKey>("review_overview");
  const [propertyFilter, setPropertyFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [busy, setBusy] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const params = new URLSearchParams({ section: activeSection });
    if (propertyFilter) params.set("property_id", propertyFilter);
    if (categoryFilter) params.set("category", categoryFilter);
    if (statusFilter) params.set("status", statusFilter);
    const res = await fetch(`/api/aipify/aipify-hosts/reputation-center/dashboard?${params}`);
    if (res.ok) {
      setDashboard(parseAipifyHostsReputationCenterDashboard(await res.json()));
    } else {
      setError(true);
    }
    setLoading(false);
  }, [activeSection, propertyFilter, categoryFilter, statusFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  const runAction = async (body: Record<string, unknown>) => {
    setBusy(true);
    setActionMessage(null);
    const res = await fetch("/api/aipify/aipify-hosts/reputation-center/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = parseAipifyHostsReputationCenterActionResult(await res.json());
    setBusy(false);
    if (result.success) {
      setActionMessage(result.summary ?? labels.actionRecorded);
      await load();
    } else {
      setActionMessage(result.summary ?? labels.actionFailed);
    }
  };

  if (loading && !dashboard) return <AipifyLoader label={labels.loading} centered fullPage />;

  if (error || !dashboard) {
    return (
      <PlatformEmptyState
        title={labels.errorTitle}
        message={labels.errorMessage}
        primaryAction={{ label: labels.retry, onClick: () => void load() }}
      />
    );
  }

  const showReviews = activeSection === "review_overview" || activeSection === "property_reviews";
  const showTrends = activeSection === "review_overview" || activeSection === "review_trends";
  const showOpportunities = activeSection === "review_overview" || activeSection === "improvement_opportunities";
  const showRecovery = activeSection === "review_overview" || activeSection === "recovery_actions";

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-blue-100 bg-blue-50/40 p-6">
        <p className="text-sm font-medium text-blue-950">{dashboard.positioning}</p>
        <p className="mt-2 text-xs text-blue-900">{labels.governanceNote}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/app/aipify-hosts" className="inline-flex rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-50">
            {labels.backToHosts}
          </Link>
          <Link href="/app/aipify-hosts/knowledge" className="inline-flex rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-50">
            {labels.viewKnowledge}
          </Link>
        </div>
      </section>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label={labels.averageRating} value={dashboard.stats.average_rating.toFixed(1)} />
        <MetricCard label={labels.propertiesRequiringAttention} value={dashboard.stats.properties_requiring_attention} />
        <MetricCard label={labels.openRecoveryCases} value={dashboard.stats.open_recovery_cases} />
        <MetricCard label={labels.newReviews} value={dashboard.stats.new_reviews} sub={dashboard.stats.action_required_reviews > 0 ? `${dashboard.stats.action_required_reviews} ${labels.actionRequired}` : undefined} />
      </dl>

      {dashboard.stats.top_performing_properties.length > 0 && activeSection === "review_overview" && (
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900">{labels.topPerformingProperties}</h3>
          <ul className="mt-3 flex flex-wrap gap-3 text-sm">
            {dashboard.stats.top_performing_properties.map((p) => (
              <li key={p.property_id} className="rounded-lg bg-emerald-50 px-3 py-2 ring-1 ring-emerald-100">
                <span className="font-medium text-emerald-900">{p.property}</span>
                <span className="ml-2 text-emerald-700">{p.avg_rating.toFixed(1)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="flex flex-wrap items-end gap-3">
        <label className="text-sm text-gray-600">
          {labels.filterProperty}
          <select value={propertyFilter} onChange={(e) => setPropertyFilter(e.target.value)} className="ml-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm">
            <option value="">{labels.allProperties}</option>
            {dashboard.properties.map((p) => (
              <option key={p.id} value={p.id}>{p.display_name}</option>
            ))}
          </select>
        </label>
        <label className="text-sm text-gray-600">
          {labels.filterCategory}
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="ml-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm">
            <option value="">{labels.allCategories}</option>
            {dashboard.review_categories.map((c) => (
              <option key={c} value={c}>{labelFor(labels, "reviewCategory", c)}</option>
            ))}
          </select>
        </label>
        <label className="text-sm text-gray-600">
          {labels.filterStatus}
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="ml-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm">
            <option value="">{labels.allStatuses}</option>
            {dashboard.review_statuses.map((s) => (
              <option key={s} value={s}>{labelFor(labels, "reviewStatus", s)}</option>
            ))}
          </select>
        </label>
      </section>

      <section className="flex flex-wrap gap-2">
        {dashboard.sections.map((section) => (
          <button
            key={section.key}
            type="button"
            onClick={() => setActiveSection(section.key as HostsReputationSectionKey)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              activeSection === section.key ? "bg-blue-700 text-white" : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {labelFor(labels, "section", section.key)}
          </button>
        ))}
      </section>

      {actionMessage && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">{actionMessage}</p>
      )}

      {showReviews && (
        <ReviewsTable rows={dashboard.reviews} labels={labels} busy={busy} onAction={(body) => void runAction(body)} />
      )}
      {showTrends && <TrendsPanel trends={dashboard.trends} labels={labels} />}
      {showOpportunities && <OpportunitiesPanel items={dashboard.improvement_opportunities} labels={labels} />}
      {showRecovery && (
        <RecoveryPanel rows={dashboard.recovery_cases} labels={labels} busy={busy} onAction={(body) => void runAction(body)} />
      )}
    </div>
  );
}
