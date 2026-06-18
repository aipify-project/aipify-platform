"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseAiCostGovernanceEngineDashboard,
  type AiBudget,
  type AiBudgetAlert,
  type AiCostGovernanceEngineDashboard,
  type AiCostOptimizationRecommendation,
  type AiUsageEvent,
} from "@/lib/aipify/ai-cost-governance-engine";

type Props = { labels: Record<string, string> };

function formatCost(value: unknown, currency = "USD"): string {
  const n = Number(value ?? 0);
  return new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 2 }).format(n);
}

function taskTierLabel(tier: string | undefined, labels: Record<string, string>): string {
  if (tier === "cost_efficient") return labels.tierCostEfficient;
  if (tier === "high_accuracy") return labels.tierHighAccuracy;
  return labels.tierStandard;
}

export function AiCostGovernanceEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<AiCostGovernanceEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [creating, setCreating] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [budgetName, setBudgetName] = useState("");
  const [softLimit, setSoftLimit] = useState("400");
  const [hardLimit, setHardLimit] = useState("500");
  const [overageRationale, setOverageRationale] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/ai-cost-governance-engine/dashboard");
    if (res.ok) {
      setDashboard(parseAiCostGovernanceEngineDashboard(await res.json()));
    }
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const createBudget = async () => {
    if (!budgetName.trim()) return;
    setCreating(true);
    setActionError(null);
    const res = await fetch("/api/aipify/ai-cost-governance-engine/budgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        budget_name: budgetName.trim(),
        scope_type: "organization",
        period: "monthly",
        soft_limit_amount: Number(softLimit) || 0,
        hard_limit_amount: Number(hardLimit) || 0,
        currency: dashboard?.settings?.currency ?? "USD",
        status: "active",
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.createFailed);
    } else {
      setBudgetName("");
      await load();
    }
    setCreating(false);
  };

  const approveOverage = async (budget: AiBudget) => {
    if (!budget.id) return;
    setBusyId(budget.id);
    setActionError(null);
    const res = await fetch("/api/aipify/ai-cost-governance-engine/budgets", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "approve_overage",
        budget_id: budget.id,
        rationale: overageRationale.trim() || labels.overageDefaultRationale,
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.actionFailed);
    } else {
      setOverageRationale("");
      await load();
    }
    setBusyId(null);
  };

  const acknowledgeAlert = async (alert: AiBudgetAlert) => {
    if (!alert.id) return;
    setBusyId(alert.id);
    const res = await fetch("/api/aipify/ai-cost-governance-engine/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "acknowledge_alert", alert_id: alert.id }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.actionFailed);
    } else {
      await load();
    }
    setBusyId(null);
  };

  const generateRecommendations = async () => {
    setGenerating(true);
    setActionError(null);
    const res = await fetch("/api/aipify/ai-cost-governance-engine/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.generateFailed);
    } else {
      await load();
    }
    setGenerating(false);
  };

  const exportManifest = async () => {
    setExporting(true);
    setActionError(null);
    const res = await fetch("/api/aipify/ai-cost-governance-engine/export", {
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

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const sections = dashboard.sections ?? {};
  const currency = String(summary.currency ?? dashboard.settings?.currency ?? "USD");
  const byModule = sections.by_module ?? [];
  const byTaskTier = sections.by_task_tier ?? [];
  const budgets = sections.budgets ?? [];
  const alerts = sections.alerts ?? [];
  const blocked = sections.blocked_requests ?? [];
  const recommendations = sections.optimization_recommendations ?? [];
  const recentUsage = dashboard.recent_usage ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/secure-ai-action-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.secureAiActions}
        </Link>
        <Link href="/app/analytics-insights-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.analyticsInsights}
        </Link>
        <Link href="/app/document-output-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.documentOutput}
        </Link>
      </div>

      <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        <p className="mt-2 text-xs text-violet-700">{labels.distinctionNote}</p>
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded border border-violet-300 px-3 py-1 text-xs text-violet-800 disabled:opacity-50"
          disabled={exporting}
          onClick={() => void exportManifest()}
        >
          {exporting ? labels.exporting : labels.exportManifest}
        </button>
        <button
          type="button"
          className="rounded border border-violet-300 px-3 py-1 text-xs text-violet-800 disabled:opacity-50"
          disabled={generating}
          onClick={() => void generateRecommendations()}
        >
          {generating ? labels.generating : labels.generateRecommendations}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.totalCostMtd}</p>
          <p className="mt-1 text-2xl font-semibold">{formatCost(summary.total_cost_mtd, currency)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.budgetPct}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.budget_pct ?? 0)}%</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.blockedRequests}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.blocked_count_mtd ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.unacknowledgedAlerts}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.unacknowledged_alerts ?? 0)}</p>
        </div>
      </div>

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.createBudget}</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <input
            className="rounded border border-gray-300 px-2 py-1 text-sm"
            placeholder={labels.budgetNamePlaceholder}
            value={budgetName}
            onChange={(e) => setBudgetName(e.target.value)}
          />
          <input
            className="w-24 rounded border border-gray-300 px-2 py-1 text-sm"
            placeholder={labels.softLimit}
            value={softLimit}
            onChange={(e) => setSoftLimit(e.target.value)}
          />
          <input
            className="w-24 rounded border border-gray-300 px-2 py-1 text-sm"
            placeholder={labels.hardLimit}
            value={hardLimit}
            onChange={(e) => setHardLimit(e.target.value)}
          />
          <button
            type="button"
            className="rounded bg-violet-700 px-3 py-1 text-xs text-white disabled:opacity-50"
            disabled={creating}
            onClick={() => void createBudget()}
          >
            {creating ? labels.creating : labels.createBudgetButton}
          </button>
        </div>
      </section>

      {budgets.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.budgets}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {budgets.map((b) => (
              <li key={String(b.id)} className="flex flex-wrap items-center justify-between gap-2 rounded border border-gray-100 p-2">
                <div>
                  <span className="font-medium">{b.budget_name}</span>
                  <span className="ml-2 text-xs text-gray-500">
                    {formatCost(b.spent, String(b.currency ?? currency))} / {formatCost(b.hard_limit_amount, String(b.currency ?? currency))}
                    ({String(b.pct_of_hard_limit ?? 0)}%)
                  </span>
                </div>
                {Number(b.pct_of_hard_limit ?? 0) >= 75 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      className="rounded border border-gray-300 px-2 py-0.5 text-xs"
                      placeholder={labels.overageRationalePlaceholder}
                      value={overageRationale}
                      onChange={(e) => setOverageRationale(e.target.value)}
                    />
                    <button
                      type="button"
                      className="rounded border border-amber-300 px-2 py-0.5 text-xs text-amber-800 disabled:opacity-50"
                      disabled={busyId === b.id}
                      onClick={() => void approveOverage(b)}
                    >
                      {labels.approveOverage}
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {alerts.length > 0 && (
        <section className="rounded-lg border border-amber-200 bg-amber-50/30 p-4">
          <h3 className="text-sm font-semibold">{labels.alerts}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {alerts.map((a) => (
              <li key={String(a.id)} className="flex flex-wrap items-center justify-between gap-2">
                <span>
                  <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium">{a.alert_level}%</span>
                  <span className="ml-2">{a.message}</span>
                </span>
                <button
                  type="button"
                  className="rounded border border-gray-300 px-2 py-0.5 text-xs disabled:opacity-50"
                  disabled={busyId === a.id}
                  onClick={() => void acknowledgeAlert(a)}
                >
                  {labels.acknowledgeAlert}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {recommendations.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.optimizationRecommendations}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {recommendations.map((r: AiCostOptimizationRecommendation) => (
              <li key={String(r.id)} className="rounded border border-gray-100 p-2">
                <span className="text-xs font-medium text-violet-700">{r.recommendation_type}</span>
                <p className="mt-1">{r.summary}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {labels.estimatedSavings}: {formatCost(r.estimated_savings, currency)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.byModule}</h3>
          {byModule.length === 0 ? (
            <p className="mt-2 text-sm text-gray-500">{labels.noUsage}</p>
          ) : (
            <ul className="mt-3 space-y-1 text-sm">
              {byModule.map((m, i) => (
                <li key={i} className="flex justify-between">
                  <span>{String(m.module_key)}</span>
                  <span>{formatCost(m.total_cost, currency)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.byTaskTier}</h3>
          {byTaskTier.length === 0 ? (
            <p className="mt-2 text-sm text-gray-500">{labels.noUsage}</p>
          ) : (
            <ul className="mt-3 space-y-1 text-sm">
              {byTaskTier.map((t, i) => (
                <li key={i} className="flex justify-between">
                  <span>{taskTierLabel(String(t.task_tier), labels)}</span>
                  <span>{formatCost(t.total_cost, currency)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {blocked.length > 0 && (
        <section className="rounded-lg border border-red-200 bg-red-50/30 p-4">
          <h3 className="text-sm font-semibold">{labels.blockedRequestsList}</h3>
          <ul className="mt-3 space-y-1 text-sm">
            {blocked.map((e: AiUsageEvent) => (
              <li key={String(e.id)} className="flex justify-between">
                <span>{e.module_key} · {taskTierLabel(e.task_tier, labels)}</span>
                <span className="text-red-700">{e.status}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.recentUsage}</h3>
        {recentUsage.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noUsage}</p>
        ) : (
          <ul className="mt-3 space-y-1 text-sm">
            {recentUsage.slice(0, 10).map((e: AiUsageEvent) => (
              <li key={String(e.id)} className="flex flex-wrap justify-between gap-2">
                <span>{e.module_key} · {taskTierLabel(e.task_tier, labels)}</span>
                <span>{formatCost(e.estimated_cost, currency)} · {e.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {dashboard.principles && dashboard.principles.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.principles}</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-600">
            {dashboard.principles.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </section>
      )}

      {dashboard.integration_summaries && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.integrationSummaries}</h3>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
            {Object.entries(dashboard.integration_summaries).map(([key, val]) => {
              const s = val as Record<string, unknown>;
              return (
                <div key={key}>
                  <dt className="font-medium capitalize">{key.replace(/_/g, " ")}</dt>
                  <dd className="text-gray-600">
                    {s.available === false ? labels.notAvailable : labels.available}
                  </dd>
                </div>
              );
            })}
          </dl>
        </section>
      )}
    </div>
  );
}
