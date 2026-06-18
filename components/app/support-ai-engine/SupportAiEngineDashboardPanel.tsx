"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseSupportAiEngineDashboard,
  type SupportAiEngineDashboard,
} from "@/lib/aipify/support-ai-engine";

type SupportAiEngineDashboardPanelProps = {
  labels: Record<string, string>;
};

function badgeClass(value?: string) {
  switch (value) {
    case "urgent":
    case "high":
      return "bg-rose-100 text-rose-800";
    case "medium":
      return "bg-amber-100 text-amber-800";
    case "low":
      return "bg-emerald-100 text-emerald-800";
    case "open":
    case "new":
      return "bg-violet-100 text-violet-800";
    case "waiting_for_internal":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export function SupportAiEngineDashboardPanel({ labels }: SupportAiEngineDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<SupportAiEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/support-ai-engine/dashboard");
    if (res.ok) setDashboard(parseSupportAiEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleApproval(id: string, action: "approve" | "send") {
    setActionId(id);
    if (action === "approve") {
      await fetch(`/api/support/responses/${id}/approve`, { method: "POST" });
    } else {
      await fetch(`/api/support/responses/${id}/send`, { method: "POST" });
    }
    await load();
    setActionId(null);
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_organization) return null;

  const metrics = dashboard.metrics ?? {};
  const aiStats = dashboard.ai_statistics ?? {};

  return (
    <div className="space-y-6">
      {(dashboard.integration_links ?? []).length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {dashboard.integration_links?.map((link) =>
            link.route ? (
              <Link key={link.route} href={link.route} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
                {link.label}
              </Link>
            ) : null
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Link href="/app/knowledge-center-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
            {labels.knowledgeCenter}
          </Link>
          <Link href="/app/admin-assistant-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
            {labels.adminAssistant}
          </Link>
          <Link href="/app/secure-ai-actions" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
            {labels.secureAiActions}
          </Link>
        </div>
      )}

      <section className="rounded-xl border border-sky-200 bg-sky-50/50 p-6">
        <h2 className="text-sm font-semibold text-sky-900">{labels.supportEngine}</h2>
        {dashboard.mission ? (
          <p className="mt-2 text-sm font-medium text-sky-900">{dashboard.mission}</p>
        ) : null}
        <p className="mt-2 text-sm text-sky-900">{dashboard.philosophy}</p>
        {dashboard.abos_principle ? (
          <p className="mt-2 text-xs text-sky-800">{dashboard.abos_principle}</p>
        ) : null}
        {dashboard.vision ? <p className="mt-2 text-xs text-gray-600">{dashboard.vision}</p> : null}
        {dashboard.support_ai_engine_note ? (
          <p className="mt-1 text-xs text-sky-700">{dashboard.support_ai_engine_note}</p>
        ) : null}
        {dashboard.distinction_note ? (
          <p className="mt-1 text-xs text-sky-700">{dashboard.distinction_note}</p>
        ) : null}
        {dashboard.safety_note ? (
          <p className="mt-1 text-xs text-sky-700">{dashboard.safety_note}</p>
        ) : null}
      </section>

      {dashboard.support_tiers && dashboard.support_tiers.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.supportTiers}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {dashboard.support_tiers.map((tier) => (
              <div key={tier.key ?? tier.label} className="rounded-lg border border-sky-100 bg-sky-50/30 px-3 py-2">
                <p className="text-sm font-medium text-sky-900">{tier.label}</p>
                {tier.focus && tier.focus.length > 0 ? (
                  <ul className="mt-1 flex flex-wrap gap-1">
                    {tier.focus.map((item) => (
                      <li key={item} className="rounded-full bg-white px-2 py-0.5 text-xs text-sky-800">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {tier.examples && tier.examples.length > 0 ? (
                  <ul className="mt-2 list-disc space-y-0.5 pl-4 text-xs text-gray-600">
                    {tier.examples.slice(0, 2).map((ex) => (
                      <li key={ex}>{ex}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.kc_connection ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.kcConnection}</h3>
          {dashboard.kc_connection.principle ? (
            <p className="mt-2 text-gray-600">{dashboard.kc_connection.principle}</p>
          ) : null}
          {dashboard.kc_connection.knowledge_center_route ? (
            <Link
              href={dashboard.kc_connection.knowledge_center_route}
              className="mt-2 inline-block text-xs text-sky-700 underline"
            >
              {labels.knowledgeCenter}
            </Link>
          ) : null}
        </section>
      ) : null}

      {Array.isArray(dashboard.success_criteria) && dashboard.success_criteria.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.successCriteria}</h3>
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

      {dashboard.self_love_note ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/50 px-4 py-3 text-sm text-amber-900">
          {dashboard.self_love_note}
        </section>
      ) : null}

      {dashboard.trust_connection ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.trustConnection}</h3>
          {dashboard.trust_connection.principle ? (
            <p className="mt-2 text-gray-600">{dashboard.trust_connection.principle}</p>
          ) : null}
          {dashboard.trust_connection.audit_note ? (
            <p className="mt-2 text-xs text-gray-500">{dashboard.trust_connection.audit_note}</p>
          ) : null}
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
          <p className="text-xs font-medium text-gray-700">{labels.openCases}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.open_cases.length}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.pendingApprovals}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.pending_approvals.length}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.escalatedCases}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.escalated_cases.length}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.aiResponses}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{aiStats.total_responses ?? 0}</p>
        </div>
      </section>

      {dashboard.settings ? (
        <section className="rounded-lg border border-gray-100 bg-gray-50 p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.responseModes}</h2>
          <p className="mt-1 text-xs text-gray-600">
            {labels.defaultMode}: <strong className="capitalize">{dashboard.settings.default_response_mode}</strong>
            {" · "}
            {labels.autoFaq}: {dashboard.settings.auto_faq_enabled ? labels.enabled : labels.disabled}
          </p>
        </section>
      ) : null}

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.openCasesList}</h2>
        {dashboard.open_cases.length === 0 ? (
          <p className="mt-3 text-xs text-gray-500">{labels.noCases}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.open_cases.map((c) => (
              <li key={c.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-gray-900">
                    {c.case_number} — {c.subject}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(c.priority)}`}>
                    {c.priority}
                  </span>
                </div>
                {c.ai_summary ? <p className="mt-1 text-xs text-gray-500">{c.ai_summary}</p> : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.pendingApprovalsList}</h2>
        {dashboard.pending_approvals.length === 0 ? (
          <p className="mt-3 text-xs text-gray-500">{labels.noApprovals}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.pending_approvals.map((a) => (
              <li key={a.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                <p className="text-gray-900">{a.content}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {a.response_mode} · confidence {Math.round((a.confidence_score ?? 0) * 100)}%
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    disabled={actionId === a.id}
                    onClick={() => void handleApproval(a.id, "approve")}
                    className="rounded border border-sky-200 px-2 py-0.5 text-xs text-sky-800 disabled:opacity-50"
                  >
                    {labels.approve}
                  </button>
                  <button
                    type="button"
                    disabled={actionId === a.id}
                    onClick={() => void handleApproval(a.id, "send")}
                    className="rounded border border-emerald-200 px-2 py-0.5 text-xs text-emerald-800 disabled:opacity-50"
                  >
                    {labels.send}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{labels.supportMetrics}</h2>
          <div className="mt-3 space-y-1 text-xs text-gray-600">
            <p>{labels.escalationRate}: {String(Number(metrics.escalation_rate ?? 0) * 100).slice(0, 5)}%</p>
            <p>{labels.aiUsageRate}: {String(Number(metrics.ai_usage_rate ?? 0) * 100).slice(0, 5)}%</p>
            <p>{labels.approvalRate}: {String(Number(metrics.approval_rate ?? 0) * 100).slice(0, 5)}%</p>
            <p>{labels.avgResponseTime}: {Number(metrics.first_response_time_avg_hours ?? 0).toFixed(1)}h</p>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{labels.aiStatistics}</h2>
          <div className="mt-3 space-y-1 text-xs text-gray-600">
            <p>{labels.automaticSent}: {aiStats.automatic_sent ?? 0}</p>
            <p>{labels.draftsPending}: {aiStats.drafts_pending ?? 0}</p>
            <p>{labels.escalatedResponses}: {aiStats.escalated ?? 0}</p>
          </div>
        </div>
      </section>

      {dashboard.knowledge_gaps.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.knowledgeGaps}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.knowledge_gaps.map((g) => (
              <li key={g.id} className="rounded-lg border border-amber-100 bg-amber-50/30 px-3 py-2 text-sm">
                <span className="font-medium text-gray-900">{g.question}</span>
                <p className="mt-1 text-xs text-gray-500">
                  {g.gap_type?.replace(/_/g, " ")} · {g.occurrence_count} occurrences
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.principles && dashboard.principles.length > 0 ? (
        <section className="rounded-lg border border-sky-100 bg-sky-50/30 p-4">
          <h2 className="text-sm font-semibold text-sky-900">{labels.principles}</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-sky-800">
            {dashboard.principles.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
