"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { formatExecutiveMetric, formatOverviewMetric } from "@/lib/ui/overview-metrics";
import {
  parseRealWorldActionServiceOrchestrationCenter,
  type RealWorldActionServiceOrchestrationCenter,
} from "@/lib/aipify/real-world-action-service-orchestration-engine";

type Props = { labels: Record<string, string> };

function riskBadgeClass(risk?: string): string {
  switch (risk) {
    case "low":
      return "bg-emerald-100 text-emerald-800";
    case "medium":
      return "bg-amber-100 text-amber-800";
    case "high":
      return "bg-orange-100 text-orange-800";
    case "critical":
    case "human_reserved":
      return "bg-red-100 text-red-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function statusBadgeClass(status?: string): string {
  switch (status) {
    case "completed":
    case "approved":
      return "bg-emerald-100 text-emerald-800";
    case "failed":
    case "rejected":
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "executing":
    case "scheduled":
      return "bg-blue-100 text-blue-800";
    case "pending_approval":
    case "pending":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export function RealWorldActionServiceOrchestrationDashboardPanel({ labels }: Props) {
  const [center, setCenter] = useState<RealWorldActionServiceOrchestrationCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/real-world-action-service-orchestration-engine/dashboard");
    if (res.ok) {
      setCenter(parseRealWorldActionServiceOrchestrationCenter(await res.json()));
    } else {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.loadFailed);
    }
    setLoading(false);
  }, [labels.loadFailed]);

  useEffect(() => {
    void load();
  }, [load]);

  const runAction = async (action: string, extra?: Record<string, unknown>) => {
    setActing(true);
    setActionError(null);
    const res = await fetch("/api/aipify/real-world-action-service-orchestration-engine/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...extra }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.actionFailed);
    } else {
      await load();
    }
    setActing(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <AipifyLoader label={labels.loading} centered />
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
  const exec = center.executive_dashboard ?? {};

  return (
    <div className="space-y-6">
      {actionError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{actionError}</div>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.overviewTitle}</h2>
        <p className="mt-1 text-sm text-gray-600">{center.philosophy}</p>
        <p className="mt-2 text-xs text-gray-500">{center.abos_principle}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [labels.metricAvailable, formatOverviewMetric(overview.available_actions)],
            [labels.metricPending, formatOverviewMetric(overview.pending_approvals)],
            [labels.metricExecuted, formatOverviewMetric(overview.executed_actions)],
            [labels.metricFailed, formatOverviewMetric(overview.failed_actions)],
            [labels.metricProviders, formatOverviewMetric(overview.provider_connections)],
            [labels.metricHealth, formatOverviewMetric(overview.action_health_score)],
            [labels.metricSuccessRate, `${formatOverviewMetric(overview.success_rate_percent)}%`],
            [labels.metricAutomation, `${formatOverviewMetric(overview.automation_coverage_percent)}%`],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-lg border border-white bg-white/90 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {center.action_hub_route ? (
            <Link
              href={center.action_hub_route}
              className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400"
            >
              {labels.openActionHub}
            </Link>
          ) : null}
          {center.approvals_route ? (
            <Link
              href={center.approvals_route}
              className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400"
            >
              {labels.openApprovals}
            </Link>
          ) : null}
          {center.action_center_route ? (
            <Link
              href={center.action_center_route}
              className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400"
            >
              {labels.openActionCenter}
            </Link>
          ) : null}
        </div>
      </section>

      <section id="catalog" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.catalogTitle}</h2>
        {center.action_catalog?.length ? (
          <ul className="mt-4 space-y-3">
            {center.action_catalog.map((item) => (
              <li key={item.id ?? item.action_key} className="rounded-lg border border-gray-100 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-gray-900">{item.action_name}</p>
                    <p className="text-xs uppercase text-gray-500">{item.action_category}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${riskBadgeClass(item.risk_level)}`}>
                    {item.risk_level}
                  </span>
                </div>
                {item.description ? <p className="mt-1 text-sm text-gray-600">{item.description}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noCatalog}</p>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section id="providers" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.providersTitle}</h2>
          {center.service_providers?.length ? (
            <ul className="mt-4 space-y-3">
              {center.service_providers.map((p) => (
                <li key={p.id ?? p.provider_key} className="rounded-lg border border-gray-100 p-3">
                  <p className="font-medium text-gray-900">{p.provider_name}</p>
                  <p className="text-xs text-gray-500">
                    {p.provider_category} · {p.region} · {p.integration_type}
                  </p>
                  <p className="mt-1 text-xs text-gray-600">
                    {labels.vendorTier}: {p.vendor_tier} · {labels.approvalReq}: {p.approval_requirements}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noProviders}</p>
          )}
          <button
            type="button"
            disabled={acting}
            onClick={() =>
              void runAction("register_provider", {
                provider_name: "Regional Services Partner",
                provider_category: "service_requests",
              })
            }
            className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 disabled:opacity-50"
          >
            {acting ? labels.acting : labels.registerProvider}
          </button>
        </section>

        <section id="approvals" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.approvalsTitle}</h2>
          {center.approvals?.length ? (
            <ul className="mt-4 space-y-3">
              {center.approvals.map((a) => (
                <li key={a.id ?? a.approval_key} className="rounded-lg border border-gray-100 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-gray-900">{a.action_title}</p>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(a.status)}`}>{a.status}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {a.approval_type} · {a.approver_role}
                  </p>
                  {a.status === "pending" ? (
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        disabled={acting}
                        onClick={() => void runAction("approve_action", { approval_key: a.approval_key })}
                        className="rounded bg-slate-800 px-3 py-1 text-xs text-white disabled:opacity-50"
                      >
                        {labels.approve}
                      </button>
                      <button
                        type="button"
                        disabled={acting}
                        onClick={() => void runAction("reject_action", { approval_key: a.approval_key })}
                        className="rounded border border-slate-300 px-3 py-1 text-xs disabled:opacity-50"
                      >
                        {labels.reject}
                      </button>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noApprovals}</p>
          )}
        </section>
      </div>

      <section id="executions" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.executionsTitle}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={acting}
            onClick={() =>
              void runAction("request_action", {
                action_key: "ACT-BOOK-MEETING",
                action_name: "Book Meeting",
                risk_level: "low",
              })
            }
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {acting ? labels.acting : labels.requestAction}
          </button>
          <button
            type="button"
            disabled={acting}
            onClick={() => void runAction("execute_action")}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {labels.executeAction}
          </button>
          <button
            type="button"
            disabled={acting}
            onClick={() => void runAction("initiate_recovery", { execution_key: "EXE-004" })}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {labels.initiateRecovery}
          </button>
        </div>
        {center.executions?.length ? (
          <ul className="mt-4 space-y-3">
            {center.executions.map((e) => (
              <li key={e.id ?? e.execution_key} className="rounded-lg border border-gray-100 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{e.action_name}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(e.status)}`}>{e.status}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {e.provider_name}
                  {e.confirmation_ref ? ` · ${e.confirmation_ref}` : ""}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noExecutions}</p>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section id="intelligence" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.intelligenceTitle}</h2>
          {center.intelligence_signals?.length ? (
            <ul className="mt-4 space-y-3">
              {center.intelligence_signals.map((s) => (
                <li key={s.id ?? s.signal_type} className="rounded-lg border border-gray-100 p-3">
                  <p className="font-medium text-gray-900">{s.observation}</p>
                  {s.recommendation ? (
                    <p className="mt-1 text-sm text-gray-600">
                      {labels.recommendation}: {s.recommendation}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noIntelligence}</p>
          )}
        </section>

        <section id="advisor" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.advisorTitle}</h2>
          {center.advisor_signals?.length ? (
            <ul className="mt-4 space-y-3">
              {center.advisor_signals.map((s) => (
                <li key={s.id ?? s.signal_type} className="rounded-lg border border-gray-100 p-3">
                  <p className="font-medium text-gray-900">{s.observation}</p>
                  {s.recommendation ? (
                    <p className="mt-1 text-sm text-gray-600">
                      {labels.recommendation}: {s.recommendation}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noAdvisor}</p>
          )}
        </section>
      </div>

      <section id="governance" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.governanceTitle}</h2>
        <ul className="mt-4 space-y-2 text-sm text-gray-700">
          <li>{labels.governanceNoIrreversible}</li>
          <li>{labels.governanceNoFinancial}</li>
          <li>{labels.governanceNoExternal}</li>
          <li>{labels.governanceHumanOverride}</li>
        </ul>
        <p className="mt-4 text-xs text-gray-500">{center.distinction_note}</p>
      </section>

      <section id="audit" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.auditTitle}</h2>
        {center.audit_logs?.length ? (
          <ul className="mt-4 space-y-2">
            {center.audit_logs.map((log) => (
              <li key={String(log.id)} className="flex justify-between gap-4 text-sm text-gray-700">
                <span>{String(log.summary ?? "")}</span>
                <span className="shrink-0 text-xs uppercase text-gray-400">{String(log.event_type ?? "")}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noAudit}</p>
        )}
        <button
          type="button"
          disabled={acting}
          onClick={() => void runAction("refresh_analytics")}
          className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {labels.refreshAnalytics}
        </button>
      </section>

      <section className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-700">{labels.executiveTitle}</p>
        <p className="mt-1">
          {labels.executiveSummary}: {formatExecutiveMetric(exec.actions_executed)} {labels.executedLabel}, {formatExecutiveMetric(exec.pending_approvals)}{" "}
          {labels.pendingLabel}, {formatExecutiveMetric(exec.success_rate)} {labels.successLabel}
        </p>
        {center.privacy_note ? <p className="mt-2">{center.privacy_note}</p> : null}
      </section>
    </div>
  );
}
