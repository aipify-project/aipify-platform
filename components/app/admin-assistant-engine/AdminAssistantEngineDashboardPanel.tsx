"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseAdminAssistantEngineDashboard,
  type AdminAssistantEngineDashboard,
} from "@/lib/aipify/admin-assistant-engine";

type AdminAssistantEngineDashboardPanelProps = {
  labels: Record<string, string>;
};

function badgeClass(value?: string) {
  switch (value) {
    case "critical":
    case "high":
      return "bg-rose-100 text-rose-800";
    case "medium":
      return "bg-amber-100 text-amber-800";
    case "low":
      return "bg-emerald-100 text-emerald-800";
    case "open":
    case "pending":
      return "bg-violet-100 text-violet-800";
    case "in_progress":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export function AdminAssistantEngineDashboardPanel({ labels }: AdminAssistantEngineDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<AdminAssistantEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/admin-assistant-engine/dashboard");
    if (res.ok) setDashboard(parseAdminAssistantEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function resolveRecommendation(id: string, decision: "accept" | "reject") {
    setActionId(id);
    await fetch(`/api/assistant/recommendations/${id}/${decision}`, { method: "POST" });
    await load();
    setActionId(null);
  }

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const since = dashboard.since_last_login;
  const briefing = dashboard.daily_briefing;
  const knowledgeSources = Array.isArray(dashboard.knowledge_suggestions?.sources)
    ? (dashboard.knowledge_suggestions.sources as Record<string, unknown>[])
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/aipify-core" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.aipifyCore}
        </Link>
        <Link href="/app/knowledge-center-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.knowledgeCenter}
        </Link>
        <Link href="/app/secure-ai-actions" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.secureAiActions}
        </Link>
      </div>

      <section className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
        <h2 className="text-sm font-semibold text-emerald-900">{labels.assistantEngine}</h2>
        <p className="mt-2 text-sm text-emerald-900">{dashboard.philosophy}</p>
        <p className="mt-1 text-xs text-emerald-700">{dashboard.safety_note}</p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.openTasks}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {(dashboard.task_counts?.open ?? 0) + (dashboard.task_counts?.in_progress ?? 0)}
          </p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.pendingApprovals}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.pending_approvals.length}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.openSupport}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.support_overview?.open_cases ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.unreadNotifications}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.unread_notifications ?? 0}</p>
        </div>
      </section>

      {since ? (
        <section className="rounded-lg border border-emerald-100 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.sinceLastLogin}</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <p className="text-xs text-gray-600">{labels.newSupportCases}: <strong>{since.new_support_cases ?? 0}</strong></p>
            <p className="text-xs text-gray-600">{labels.unresolvedApprovals}: <strong>{since.unresolved_approvals ?? 0}</strong></p>
            <p className="text-xs text-gray-600">{labels.newUsers}: <strong>{since.new_users ?? 0}</strong></p>
            <p className="text-xs text-gray-600">{labels.failedIntegrations}: <strong>{since.failed_integrations ?? 0}</strong></p>
            <p className="text-xs text-gray-600">{labels.knowledgeUpdates}: <strong>{since.knowledge_updates?.length ?? 0}</strong></p>
            <p className="text-xs text-gray-600">{labels.aiRecommendations}: <strong>{since.ai_recommendations?.length ?? 0}</strong></p>
          </div>
        </section>
      ) : null}

      {briefing?.operational_summary ? (
        <section className="rounded-lg border border-gray-100 bg-gray-50 p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.dailyBriefing}</h2>
          <p className="mt-2 text-sm text-gray-700">{briefing.operational_summary}</p>
          {Array.isArray(briefing.reminders) && briefing.reminders.filter(Boolean).length > 0 ? (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-gray-600">
              {briefing.reminders.filter(Boolean).map((r) => (
                <li key={String(r)}>{r}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{labels.pendingTasks}</h2>
          {dashboard.pending_tasks.length === 0 ? (
            <p className="mt-3 text-xs text-gray-500">{labels.noTasks}</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {dashboard.pending_tasks.map((t) => (
                <li key={t.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium text-gray-900">{t.title}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(t.priority)}`}>
                      {t.priority}
                    </span>
                  </div>
                  <p className="mt-1 text-xs capitalize text-gray-500">
                    {t.status?.replace(/_/g, " ")}
                    {t.ai_generated ? " · AI" : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{labels.recommendedActions}</h2>
          {dashboard.recommended_actions.length === 0 ? (
            <p className="mt-3 text-xs text-gray-500">{labels.noRecommendations}</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {dashboard.recommended_actions.map((r) => (
                <li key={r.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium text-gray-900">{r.summary}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(r.urgency)}`}>
                      {r.urgency}
                    </span>
                  </div>
                  {r.reason ? <p className="mt-1 text-xs text-gray-500">{r.reason}</p> : null}
                  {r.suggested_next_step ? (
                    <p className="mt-1 text-xs text-emerald-700">{r.suggested_next_step}</p>
                  ) : null}
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      disabled={actionId === r.id}
                      onClick={() => void resolveRecommendation(r.id, "accept")}
                      className="rounded border border-emerald-200 px-2 py-0.5 text-xs text-emerald-800 disabled:opacity-50"
                    >
                      {labels.accept}
                    </button>
                    <button
                      type="button"
                      disabled={actionId === r.id}
                      onClick={() => void resolveRecommendation(r.id, "reject")}
                      className="rounded border border-rose-200 px-2 py-0.5 text-xs text-rose-800 disabled:opacity-50"
                    >
                      {labels.reject}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{labels.supportOverview}</h2>
          {(dashboard.support_overview?.recent_cases ?? []).length === 0 ? (
            <p className="mt-3 text-xs text-gray-500">{labels.noSupportCases}</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {(dashboard.support_overview?.recent_cases ?? []).map((c) => (
                <li key={c.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                  <span className="font-medium text-gray-900">{c.subject}</span>
                  <span className={`ml-2 rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(c.status)}`}>
                    {c.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{labels.recentNotifications}</h2>
          {dashboard.recent_notifications.length === 0 ? (
            <p className="mt-3 text-xs text-gray-500">{labels.noNotifications}</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {dashboard.recent_notifications.map((n) => (
                <li key={n.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                  <span className="font-medium text-gray-900">{n.title}</span>
                  {n.body ? <p className="mt-1 text-xs text-gray-500">{n.body}</p> : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {knowledgeSources.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.knowledgeSuggestions}</h2>
          <ul className="mt-3 space-y-2">
            {knowledgeSources.slice(0, 5).map((s, i) => (
              <li key={String(s.id ?? i)} className="rounded-lg border border-indigo-100 bg-indigo-50/30 px-3 py-2 text-sm">
                <span className="font-medium">{String(s.title ?? "")}</span>
                <p className="mt-1 text-xs text-gray-500">{String(s.summary ?? "").slice(0, 120)}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.principles && dashboard.principles.length > 0 ? (
        <section className="rounded-lg border border-emerald-100 bg-emerald-50/30 p-4">
          <h2 className="text-sm font-semibold text-emerald-900">{labels.principles}</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-emerald-800">
            {dashboard.principles.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
