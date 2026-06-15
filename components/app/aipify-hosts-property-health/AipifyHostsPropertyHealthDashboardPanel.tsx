"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseAipifyHostsPropertyHealthActionResult,
  parseAipifyHostsPropertyHealthDashboard,
  type HostsPropertyHealthDashboard,
  type HostsPropertyHealthRecommendationRow,
  type HostsPropertyHealthRiskRow,
  type HostsPropertyHealthSectionKey,
  type HostsPropertyScoreRow,
} from "@/lib/aipify/aipify-hosts-property-health";

type Props = { labels: Record<string, string> };

function labelFor(labels: Record<string, string>, prefix: string, key: string): string {
  return labels[`${prefix}_${key}`] ?? key.replace(/_/g, " ");
}

function levelBadge(level: string): string {
  const map: Record<string, string> = {
    excellent: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    good: "bg-sky-50 text-sky-800 ring-sky-200",
    attention_required: "bg-amber-50 text-amber-900 ring-amber-200",
    critical: "bg-red-50 text-red-800 ring-red-200",
    high: "bg-orange-50 text-orange-900 ring-orange-200",
    medium: "bg-amber-50 text-amber-800 ring-amber-200",
    low: "bg-gray-100 text-gray-600 ring-gray-200",
  };
  return map[level] ?? "bg-gray-100 text-gray-700 ring-gray-200";
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

function CategoryScores({ row, labels }: { row: HostsPropertyScoreRow; labels: Record<string, string> }) {
  const cats = [
    { key: "guest_experience", score: row.guest_experience_score },
    { key: "operations", score: row.operations_score },
    { key: "safety", score: row.safety_score },
    { key: "maintenance", score: row.maintenance_score },
    { key: "finance", score: row.finance_score },
    { key: "compliance", score: row.compliance_score },
  ];
  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {cats.map((c) => (
        <div key={c.key} className="rounded-lg border border-gray-100 bg-gray-50/50 p-3">
          <dt className="text-xs text-gray-500">{labelFor(labels, "category", c.key)}</dt>
          <dd className="text-lg font-semibold text-gray-900">{c.score}</dd>
        </div>
      ))}
    </dl>
  );
}

function PropertyDetailPanel({
  row,
  labels,
  busy,
  onAction,
  onBack,
}: {
  row: HostsPropertyScoreRow;
  labels: Record<string, string>;
  busy: boolean;
  onAction: (propertyId: string, action: string, extra?: Record<string, unknown>) => void;
  onBack: () => void;
}) {
  const inputKeys = [
    "occupancy_status", "guest_satisfaction", "cleaning_completion", "maintenance_status",
    "incident_history", "inspection_results", "supply_readiness", "access_readiness", "document_readiness",
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <button type="button" onClick={onBack} className="text-sm font-medium text-teal-700 hover:text-teal-900">
            ← {labels.backToScores}
          </button>
          <h3 className="mt-2 text-xl font-semibold text-gray-900">{row.property}</h3>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900">{row.overall_score}</div>
          <span className={`mt-1 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${levelBadge(row.score_level)}`}>
            {labelFor(labels, "level", row.score_level)}
          </span>
          <p className="mt-1 text-xs text-gray-500">
            {labels.trend}: {row.score_trend > 0 ? "+" : ""}{row.score_trend}
          </p>
        </div>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h4 className="font-semibold text-gray-900">{labels.categoryBreakdown}</h4>
        <div className="mt-4"><CategoryScores row={row} labels={labels} /></div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h4 className="font-semibold text-gray-900">{labels.scoreInputs}</h4>
        <dl className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
          {inputKeys.map((key) => (
            <div key={key}>
              <dt className="text-gray-500">{labelFor(labels, "input", key)}</dt>
              <dd className="font-medium">{row.inputs[key]}</dd>
            </div>
          ))}
        </dl>
      </section>

      {row.top_strengths.length > 0 && (
        <section className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-5">
          <h4 className="font-semibold text-emerald-950">{labels.topStrengths}</h4>
          <ul className="mt-2 list-inside list-disc text-sm text-emerald-900">
            {row.top_strengths.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </section>
      )}

      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={busy} onClick={() => onAction(row.property_id, "open_property")} className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-800 disabled:opacity-60">{labels.openProperty}</button>
        <button type="button" disabled={busy} onClick={() => onAction(row.property_id, "create_task")} className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-indigo-700 disabled:opacity-60">{labels.createTask}</button>
        <button type="button" disabled={busy} onClick={() => onAction(row.property_id, "schedule_inspection")} className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-orange-700 disabled:opacity-60">{labels.scheduleInspection}</button>
        <Link href="/app/aipify-hosts/incidents" className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700">{labels.viewIncidents}</Link>
        <Link href="/app/aipify-hosts/supplies" className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-teal-700">{labels.reviewSupplies}</Link>
      </div>
    </div>
  );
}

function PropertyScoresTable({
  rows,
  labels,
  onSelect,
}: {
  rows: HostsPropertyScoreRow[];
  labels: Record<string, string>;
  onSelect: (propertyId: string) => void;
}) {
  if (rows.length === 0) return <EmptyBoard title={labels.emptyScoresTitle} message={labels.emptyScoresMessage} />;
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">{labels.property}</th>
            <th className="px-4 py-3">{labels.overallScore}</th>
            <th className="px-4 py-3">{labels.level}</th>
            <th className="px-4 py-3">{labels.trend}</th>
            <th className="px-4 py-3">{labels.guestExperience}</th>
            <th className="px-4 py-3">{labels.operations}</th>
            <th className="px-4 py-3">{labels.actions}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-100">
              <td className="px-4 py-3 font-medium text-gray-900">{row.property}</td>
              <td className="px-4 py-3 text-lg font-semibold">{row.overall_score}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${levelBadge(row.score_level)}`}>
                  {labelFor(labels, "level", row.score_level)}
                </span>
              </td>
              <td className={`px-4 py-3 font-medium ${row.score_trend < 0 ? "text-red-700" : row.score_trend > 0 ? "text-emerald-700" : "text-gray-600"}`}>
                {row.score_trend > 0 ? "+" : ""}{row.score_trend}
              </td>
              <td className="px-4 py-3 text-gray-700">{row.guest_experience_score}</td>
              <td className="px-4 py-3 text-gray-700">{row.operations_score}</td>
              <td className="px-4 py-3">
                <button type="button" onClick={() => onSelect(row.property_id)} className="text-xs font-medium text-teal-700">{labels.viewDetail}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RisksTable({
  rows,
  labels,
  busy,
  onResolve,
}: {
  rows: HostsPropertyHealthRiskRow[];
  labels: Record<string, string>;
  busy: boolean;
  onResolve: (id: string) => void;
}) {
  if (rows.length === 0) return <EmptyBoard title={labels.emptyRisksTitle} message={labels.emptyRisksMessage} />;
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">{labels.property}</th>
            <th className="px-4 py-3">{labels.riskIndicator}</th>
            <th className="px-4 py-3">{labels.severity}</th>
            <th className="px-4 py-3">{labels.summary}</th>
            <th className="px-4 py-3">{labels.hoursUnresolved}</th>
            <th className="px-4 py-3">{labels.actions}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-100">
              <td className="px-4 py-3 font-medium text-gray-900">{row.property}</td>
              <td className="px-4 py-3 text-gray-700">{labelFor(labels, "risk", row.risk_indicator)}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${levelBadge(row.severity)}`}>{row.severity}</span>
              </td>
              <td className="px-4 py-3 text-gray-600 max-w-xs">{row.summary}</td>
              <td className={`px-4 py-3 font-medium ${row.hours_unresolved >= 48 ? "text-red-700" : "text-gray-700"}`}>{row.hours_unresolved}h</td>
              <td className="px-4 py-3">
                <button type="button" disabled={busy} onClick={() => onResolve(row.id)} className="text-xs font-medium text-emerald-700 disabled:opacity-60">{labels.resolveRisk}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RecommendationsTable({
  rows,
  labels,
  busy,
  onComplete,
}: {
  rows: HostsPropertyHealthRecommendationRow[];
  labels: Record<string, string>;
  busy: boolean;
  onComplete: (id: string) => void;
}) {
  if (rows.length === 0) return <EmptyBoard title={labels.emptyActionsTitle} message={labels.emptyActionsMessage} />;
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">{labels.property}</th>
            <th className="px-4 py-3">{labels.actionSummary}</th>
            <th className="px-4 py-3">{labels.category}</th>
            <th className="px-4 py-3">{labels.priority}</th>
            <th className="px-4 py-3">{labels.actions}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-100">
              <td className="px-4 py-3 font-medium text-gray-900">{row.property}</td>
              <td className="px-4 py-3 text-gray-700">{row.action_summary}</td>
              <td className="px-4 py-3 text-gray-600">{labelFor(labels, "category", row.action_category)}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${levelBadge(row.priority)}`}>{row.priority}</span>
              </td>
              <td className="px-4 py-3">
                <button type="button" disabled={busy} onClick={() => onComplete(row.id)} className="text-xs font-medium text-emerald-700 disabled:opacity-60">{labels.completeAction}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AipifyHostsPropertyHealthDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<HostsPropertyHealthDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeSection, setActiveSection] = useState<HostsPropertyHealthSectionKey>("portfolio_overview");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const params = new URLSearchParams({ section: activeSection });
    if (selectedPropertyId) params.set("property_id", selectedPropertyId);
    const res = await fetch(`/api/aipify/aipify-hosts/property-health/dashboard?${params}`);
    if (res.ok) {
      setDashboard(parseAipifyHostsPropertyHealthDashboard(await res.json()));
    } else {
      setError(true);
    }
    setLoading(false);
  }, [activeSection, selectedPropertyId]);

  useEffect(() => {
    void load();
  }, [load]);

  const runAction = async (body: Record<string, unknown>) => {
    setBusy(true);
    setActionMessage(null);
    const res = await fetch("/api/aipify/aipify-hosts/property-health/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = parseAipifyHostsPropertyHealthActionResult(await res.json());
    setBusy(false);
    if (result.success) {
      setActionMessage(result.summary ?? labels.actionRecorded);
      await load();
    } else {
      setActionMessage(labels.actionFailed);
    }
  };

  const runPropertyAction = (propertyId: string, actionType: string, extra?: Record<string, unknown>) => {
    void runAction({ action_type: actionType, property_id: propertyId, ...extra });
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

  const detailRow = selectedPropertyId
    ? dashboard.property_detail ?? dashboard.property_scores.find((p) => p.property_id === selectedPropertyId) ?? null
    : null;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-teal-100 bg-teal-50/40 p-6">
        <p className="text-sm font-medium text-teal-950">{dashboard.positioning}</p>
        <p className="mt-2 text-xs text-teal-900">{labels.governanceNote}</p>
        <Link href="/app/aipify-hosts" className="mt-4 inline-flex rounded-lg border border-teal-200 bg-white px-4 py-2 text-sm font-medium text-teal-900 hover:bg-teal-50">
          {labels.backToHosts}
        </Link>
      </section>

      {!selectedPropertyId && (
        <>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label={labels.overallScore}
              value={dashboard.stats.overall_score}
              sub={labelFor(labels, "level", dashboard.stats.portfolio_level)}
            />
            <MetricCard label={labels.scoreTrend} value={`${dashboard.stats.avg_score_trend > 0 ? "+" : ""}${dashboard.stats.avg_score_trend}`} />
            <MetricCard label={labels.openRisks} value={dashboard.stats.open_risks} />
            <MetricCard label={labels.pendingActions} value={dashboard.stats.pending_actions} />
          </dl>

          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900">{labels.levelDistribution}</h3>
            <dl className="mt-3 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
              <div><dt className="text-gray-500">{labelFor(labels, "level", "excellent")}</dt><dd className="text-lg font-semibold text-emerald-700">{dashboard.stats.excellent_count}</dd></div>
              <div><dt className="text-gray-500">{labelFor(labels, "level", "good")}</dt><dd className="text-lg font-semibold text-sky-700">{dashboard.stats.good_count}</dd></div>
              <div><dt className="text-gray-500">{labelFor(labels, "level", "attention_required")}</dt><dd className="text-lg font-semibold text-amber-700">{dashboard.stats.attention_count}</dd></div>
              <div><dt className="text-gray-500">{labelFor(labels, "level", "critical")}</dt><dd className="text-lg font-semibold text-red-700">{dashboard.stats.critical_count}</dd></div>
            </dl>
          </section>

          {activeSection === "portfolio_overview" && dashboard.top_strengths.length > 0 && (
            <section className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-5">
              <h3 className="font-semibold text-emerald-950">{labels.topStrengths}</h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {dashboard.top_strengths.map((s) => (
                  <li key={s} className="rounded-full bg-white px-3 py-1 text-sm text-emerald-900 ring-1 ring-emerald-200">{s}</li>
                ))}
              </ul>
            </section>
          )}

          {activeSection === "portfolio_overview" && dashboard.score_trend.length > 0 && (
            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900">{labels.scoreTrendChart}</h3>
              <div className="mt-4 flex items-end gap-2 overflow-x-auto pb-2">
                {dashboard.score_trend.map((pt) => (
                  <div key={pt.date} className="flex min-w-[48px] flex-col items-center">
                    <div
                      className="w-8 rounded-t bg-teal-600"
                      style={{ height: `${Math.max(8, pt.score * 1.2)}px` }}
                      title={`${pt.date}: ${pt.score}`}
                    />
                    <span className="mt-1 text-[10px] text-gray-500">{pt.date.slice(5)}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {!selectedPropertyId && (
        <section className="flex flex-wrap gap-2">
          {dashboard.sections.map((section) => (
            <button
              key={section.key}
              type="button"
              onClick={() => setActiveSection(section.key as HostsPropertyHealthSectionKey)}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                activeSection === section.key ? "bg-teal-700 text-white" : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {labelFor(labels, "section", section.key)}
            </button>
          ))}
        </section>
      )}

      {actionMessage && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">{actionMessage}</p>
      )}

      {detailRow ? (
        <PropertyDetailPanel
          row={detailRow}
          labels={labels}
          busy={busy}
          onAction={runPropertyAction}
          onBack={() => setSelectedPropertyId(null)}
        />
      ) : activeSection === "open_risks" ? (
        <RisksTable rows={dashboard.open_risks} labels={labels} busy={busy} onResolve={(id) => void runAction({ action_type: "resolve_risk", risk_id: id })} />
      ) : activeSection === "recommended_actions" ? (
        <RecommendationsTable rows={dashboard.recommended_actions} labels={labels} busy={busy} onComplete={(id) => void runAction({ action_type: "complete_recommendation", recommendation_id: id })} />
      ) : (
        <PropertyScoresTable rows={dashboard.property_scores} labels={labels} onSelect={setSelectedPropertyId} />
      )}

      {activeSection === "portfolio_overview" && !selectedPropertyId && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="mb-3 font-semibold text-gray-900">{labels.openRisksPreview}</h3>
            <RisksTable rows={dashboard.open_risks.slice(0, 5)} labels={labels} busy={busy} onResolve={(id) => void runAction({ action_type: "resolve_risk", risk_id: id })} />
          </div>
          <div>
            <h3 className="mb-3 font-semibold text-gray-900">{labels.recommendedActionsPreview}</h3>
            <RecommendationsTable rows={dashboard.recommended_actions.slice(0, 5)} labels={labels} busy={busy} onComplete={(id) => void runAction({ action_type: "complete_recommendation", recommendation_id: id })} />
          </div>
        </div>
      )}
    </div>
  );
}
