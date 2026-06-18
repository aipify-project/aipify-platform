"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseSelfSupportEngineDashboard,
  type SelfSupportEngineDashboard,
} from "@/lib/aipify/self-support-engine";

type SelfSupportEngineDashboardPanelProps = {
  labels: Record<string, string>;
};

function badgeClass(value?: string) {
  switch (value) {
    case "high":
      return "bg-emerald-100 text-emerald-800";
    case "medium":
      return "bg-amber-100 text-amber-800";
    case "low":
      return "bg-rose-100 text-rose-800";
    case "escalated":
      return "bg-orange-100 text-orange-800";
    case "active":
      return "bg-violet-100 text-violet-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export function SelfSupportEngineDashboardPanel({ labels }: SelfSupportEngineDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<SelfSupportEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/self-support-engine/dashboard");
    if (res.ok) setDashboard(parseSelfSupportEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleAction(id: string, action: "escalate" | "close") {
    setActionId(id);
    await fetch(`/api/self-support/${id}/${action}`, { method: "POST" });
    await load();
    setActionId(null);
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_organization) return null;

  const stats = dashboard.statistics ?? {};
  const satisfaction = dashboard.satisfaction_trends ?? {};

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/knowledge-center-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.knowledgeCenter}
        </Link>
        <Link href="/app/support-ai-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.supportAi}
        </Link>
        <Link href="/app/customer-onboarding-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.onboarding}
        </Link>
      </div>

      <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
        <h2 className="text-sm font-semibold text-teal-900">{labels.selfSupportEngine}</h2>
        <p className="mt-2 text-sm text-teal-900">{dashboard.philosophy}</p>
        <p className="mt-1 text-xs text-teal-700">{dashboard.safety_note}</p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.activeConversations}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.active_conversations.length}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.escalationQueue}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.escalation_queue.length}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.unresolvedIssues}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.unresolved_issues.length}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.totalConversations}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.total_conversations ?? 0}</p>
        </div>
      </section>

      {dashboard.settings ? (
        <section className="rounded-lg border border-gray-100 bg-gray-50 p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.settings}</h2>
          <p className="mt-1 text-xs text-gray-600">
            {labels.autoResponse}: {dashboard.settings.auto_response_enabled ? labels.enabled : labels.disabled}
            {" · "}
            {labels.confidenceThreshold}: {Math.round((dashboard.settings.escalation_confidence_threshold ?? 0.5) * 100)}%
          </p>
          {dashboard.future_channels && dashboard.future_channels.length > 0 ? (
            <p className="mt-1 text-xs text-gray-500">
              {labels.futureChannels}: {dashboard.future_channels.join(", ")}
            </p>
          ) : null}
        </section>
      ) : null}

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.activeConversationsList}</h2>
        {dashboard.active_conversations.length === 0 ? (
          <p className="mt-3 text-xs text-gray-500">{labels.noConversations}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.active_conversations.map((c) => (
              <li key={c.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-gray-900">
                    {c.conversation_number} — {c.subject}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(c.last_confidence_level ?? c.status)}`}>
                    {c.last_confidence_level ?? c.status}
                  </span>
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    disabled={actionId === c.id}
                    onClick={() => void handleAction(c.id, "escalate")}
                    className="rounded border border-orange-200 px-2 py-0.5 text-xs text-orange-800 disabled:opacity-50"
                  >
                    {labels.escalate}
                  </button>
                  <button
                    type="button"
                    disabled={actionId === c.id}
                    onClick={() => void handleAction(c.id, "close")}
                    className="rounded border border-gray-200 px-2 py-0.5 text-xs text-gray-700 disabled:opacity-50"
                  >
                    {labels.close}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.escalationQueueList}</h2>
        {dashboard.escalation_queue.length === 0 ? (
          <p className="mt-3 text-xs text-gray-500">{labels.noEscalations}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.escalation_queue.map((e) => (
              <li key={e.id} className="rounded-lg border border-orange-100 bg-orange-50/30 px-3 py-2 text-sm">
                <span className="font-medium text-gray-900">
                  {e.conversation_number} — {e.subject}
                </span>
                <p className="mt-1 text-xs text-gray-500">{e.reason}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{labels.satisfactionTrends}</h2>
          <div className="mt-3 space-y-1 text-xs text-gray-600">
            <p>{labels.helpful}: {satisfaction.helpful ?? 0}</p>
            <p>{labels.unhelpful}: {satisfaction.unhelpful ?? 0}</p>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{labels.statistics}</h2>
          <div className="mt-3 space-y-1 text-xs text-gray-600">
            <p>{labels.automaticResponses}: {stats.automatic_responses ?? 0}</p>
            <p>{labels.draftResponses}: {stats.draft_responses ?? 0}</p>
            <p>{labels.escalatedConversations}: {stats.escalated_conversations ?? 0}</p>
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
        <section className="rounded-lg border border-teal-100 bg-teal-50/30 p-4">
          <h2 className="text-sm font-semibold text-teal-900">{labels.principles}</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-teal-800">
            {dashboard.principles.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
