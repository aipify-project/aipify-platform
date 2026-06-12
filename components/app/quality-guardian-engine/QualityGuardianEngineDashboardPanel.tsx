"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseQualityGuardianEngineDashboard,
  type QualityGuardianEngineDashboard,
} from "@/lib/aipify/quality-guardian-engine";

type QualityGuardianEngineDashboardPanelProps = {
  labels: Record<string, string>;
};

function severityClass(severity?: string) {
  switch (severity) {
    case "critical":
      return "bg-rose-100 text-rose-800";
    case "high":
      return "bg-orange-100 text-orange-800";
    case "medium":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function urgencyClass(urgency?: string) {
  switch (urgency) {
    case "critical":
      return "bg-rose-100 text-rose-800";
    case "high":
      return "bg-orange-100 text-orange-800";
    case "moderate":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function formatCategory(category?: string) {
  return (category ?? "").replace(/_/g, " ");
}

export function QualityGuardianEngineDashboardPanel({
  labels,
}: QualityGuardianEngineDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<QualityGuardianEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/quality-guardian-engine/dashboard");
    if (res.ok) setDashboard(parseQualityGuardianEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function runScan() {
    setActionId("scan");
    await fetch("/api/quality/scan", { method: "POST" });
    await load();
    setActionId(null);
  }

  async function handleCheck(id: string, action: "resolve" | "ignore") {
    setActionId(id);
    await fetch(`/api/quality/checks/${id}/${action}`, { method: "POST" });
    await load();
    setActionId(null);
  }

  async function handleRecommendation(id: string, action: "accept" | "reject") {
    setActionId(id);
    await fetch(`/api/quality/recommendations/${id}/${action}`, { method: "POST" });
    await load();
    setActionId(null);
  }

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const trends = dashboard.trends ?? {};
  const governance = dashboard.governance_summary ?? {};
  const integrationLinks = dashboard.integration_links ?? [];

  return (
    <div className="space-y-6">
      {integrationLinks.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {integrationLinks.map((link) =>
            typeof link.route === "string" && link.route.startsWith("/") ? (
              <Link
                key={link.key ?? link.route}
                href={link.route}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
              >
                {link.label ?? link.key?.replace(/_/g, " ")}
              </Link>
            ) : null
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Link href="/app/support-ai-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
            {labels.supportAi}
          </Link>
          <Link href="/app/knowledge-center-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
            {labels.knowledgeCenter}
          </Link>
          <Link href="/app/governance-policy-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
            {labels.governancePolicy}
          </Link>
          <Link href="/app/secure-ai-actions" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
            {labels.secureAiActions}
          </Link>
        </div>
      )}

      <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-violet-900">{labels.qualityGuardian}</h2>
            {dashboard.mission ? (
              <p className="mt-2 text-sm font-medium text-violet-900">{dashboard.mission}</p>
            ) : null}
            <p className="mt-2 text-sm text-violet-900">{dashboard.philosophy}</p>
            {dashboard.abos_principle ? (
              <p className="mt-2 text-xs text-violet-800">{dashboard.abos_principle}</p>
            ) : null}
            <p className="mt-1 text-xs text-violet-700">{dashboard.safety_note}</p>
          </div>
          <button
            type="button"
            disabled={actionId === "scan"}
            onClick={() => void runScan()}
            className="rounded-lg border border-violet-300 bg-white px-3 py-1.5 text-sm text-violet-900"
          >
            {labels.runScan}
          </button>
        </div>
      </section>

      {governance && typeof governance.active_policies === "number" ? (
        <section className="rounded-xl border border-sky-200 bg-sky-50/50 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-sky-900">{labels.governanceSummary}</h3>
              {typeof governance.note === "string" ? (
                <p className="mt-1 text-xs text-sky-700">{governance.note}</p>
              ) : null}
            </div>
            {typeof governance.governance_route === "string" ? (
              <Link
                href={governance.governance_route}
                className="rounded-lg border border-sky-300 bg-white px-3 py-1.5 text-xs text-sky-900"
              >
                {labels.configureGovernance}
              </Link>
            ) : null}
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-sky-100 bg-white p-3">
              <p className="text-xs font-medium text-gray-700">{labels.activePolicies}</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{governance.active_policies ?? 0}</p>
            </div>
            <div className="rounded-lg border border-sky-100 bg-white p-3">
              <p className="text-xs font-medium text-gray-700">{labels.openViolations}</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{governance.open_violations ?? 0}</p>
            </div>
            <div className="rounded-lg border border-sky-100 bg-white p-3">
              <p className="text-xs font-medium text-gray-700">{labels.pendingApprovals}</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{governance.pending_approvals ?? 0}</p>
            </div>
            <div className="rounded-lg border border-sky-100 bg-white p-3">
              <p className="text-xs font-medium text-gray-700">{labels.autonomyLevel}</p>
              <p className="mt-1 text-sm font-semibold capitalize text-gray-900">
                {(governance.ai_autonomy_level ?? "—").replace(/_/g, " ")}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {labels.reviewCadence}: {governance.review_cadence_days ?? "—"} {labels.days}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {(dashboard.companion_quality_principles?.length ?? 0) > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.companionQualityPrinciples}</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {dashboard.companion_quality_principles!.map((principle) => (
              <li key={principle.key} className="rounded-lg border border-gray-100 p-3 text-sm">
                <span className="mr-1">{principle.emoji}</span>
                <span className="text-gray-900">{principle.label}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {Array.isArray(dashboard.success_criteria) && dashboard.success_criteria.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.successCriteria}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {dashboard.success_criteria.map((item) => {
              const label = typeof item.label === "string" ? item.label : String(item.key ?? "");
              const met = Boolean(item.met);
              const note = typeof item.note === "string" ? item.note : null;
              return (
                <li key={label}>
                  <span className={met ? "text-green-800" : "text-gray-700"}>
                    {met ? "✓" : "○"} {label}
                  </span>
                  {note ? <p className="text-xs text-gray-500">{note}</p> : null}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {dashboard.trust_connection ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold text-gray-900">{labels.trustConnection}</h3>
          {dashboard.trust_connection.principle ? (
            <p className="mt-2 text-gray-600">{dashboard.trust_connection.principle}</p>
          ) : null}
          {dashboard.trust_connection.audit_note ? (
            <p className="mt-2 text-xs text-gray-500">{dashboard.trust_connection.audit_note}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.self_love_note ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/50 px-4 py-3 text-sm text-amber-900">
          {dashboard.self_love_note}
        </section>
      ) : null}

      {dashboard.dogfooding ? (
        <section className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-xs text-gray-600">
          <span className="font-semibold text-gray-800">{labels.dogfooding}: </span>
          {dashboard.dogfooding.principle}
        </section>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.openChecks}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{trends.open_checks ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.criticalOpen}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{trends.critical_open ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.resolvedWeek}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{trends.resolved_last_7_days ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.pendingRecommendations}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.recommendations.length}</p>
        </div>
      </section>

      {(dashboard.high_risk_areas?.length ?? 0) > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.highRiskAreas}</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {dashboard.high_risk_areas.map((area) => (
              <li key={area.category} className="rounded-lg border border-gray-100 p-3">
                <p className="text-sm font-medium capitalize text-gray-900">{formatCategory(area.category)}</p>
                <p className="mt-1 text-xs text-gray-600">
                  {area.open_count ?? 0} {labels.openIssues} · {area.max_severity}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(dashboard.active_checks?.length ?? 0) > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.activeAlerts}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.active_checks.map((check) => (
              <li key={check.id} className="flex flex-wrap items-start justify-between gap-2 rounded-lg border border-gray-100 p-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded px-2 py-0.5 text-xs ${severityClass(check.severity)}`}>
                      {check.severity}
                    </span>
                    <span className="text-xs capitalize text-gray-500">{formatCategory(check.category)}</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-gray-900">{check.title}</p>
                  {check.description ? <p className="text-xs text-gray-600">{check.description}</p> : null}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={actionId === check.id}
                    onClick={() => void handleCheck(check.id, "resolve")}
                    className="rounded border border-emerald-200 px-2 py-1 text-xs text-emerald-800"
                  >
                    {labels.resolve}
                  </button>
                  <button
                    type="button"
                    disabled={actionId === check.id}
                    onClick={() => void handleCheck(check.id, "ignore")}
                    className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-700"
                  >
                    {labels.ignore}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(dashboard.recommendations?.length ?? 0) > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.recommendations}</h3>
          <ul className="mt-3 space-y-3">
            {dashboard.recommendations.map((rec) => (
              <li key={rec.id} className="rounded-lg border border-gray-100 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded px-2 py-0.5 text-xs ${urgencyClass(rec.urgency)}`}>
                    {rec.urgency}
                  </span>
                  <span className="text-xs text-gray-500">
                    {labels.confidence}: {rec.confidence}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900">{rec.issue_summary}</p>
                {rec.business_impact ? <p className="mt-1 text-xs text-gray-600">{rec.business_impact}</p> : null}
                <p className="mt-2 text-sm text-gray-800">{rec.suggested_resolution}</p>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    disabled={actionId === rec.id}
                    onClick={() => void handleRecommendation(rec.id, "accept")}
                    className="rounded border border-violet-200 px-2 py-1 text-xs text-violet-800"
                  >
                    {labels.accept}
                  </button>
                  <button
                    type="button"
                    disabled={actionId === rec.id}
                    onClick={() => void handleRecommendation(rec.id, "reject")}
                    className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-700"
                  >
                    {labels.reject}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(dashboard.recently_resolved?.length ?? 0) > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.recentlyResolved}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.recently_resolved.map((item) => (
              <li key={item.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                <div>
                  <p className="text-sm text-gray-900">{item.title}</p>
                  <p className="text-xs capitalize text-gray-500">{formatCategory(item.category)}</p>
                </div>
                <span className={`rounded px-2 py-0.5 text-xs ${severityClass(item.severity)}`}>
                  {item.severity}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(dashboard.principles?.length ?? 0) > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.principles}</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
            {dashboard.principles!.map((principle) => (
              <li key={principle}>{principle}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
