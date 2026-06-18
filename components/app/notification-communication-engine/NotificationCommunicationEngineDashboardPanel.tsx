"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseNotificationCommunicationEngineDashboard,
  type MobileDashboardBlock,
  type NotificationCommunicationEngineDashboard,
} from "@/lib/aipify/notification-communication-engine";

type NotificationCommunicationEngineDashboardPanelProps = {
  labels: Record<string, string>;
};

function priorityClass(priority?: string) {
  switch (priority) {
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

function formatCategory(category?: string) {
  return (category ?? "").replace(/_/g, " ");
}

function MobileDashboardBlockCard({ block, labels }: { block: MobileDashboardBlock; labels: Record<string, string> }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium text-gray-900">{block.label}</p>
          {block.description ? <p className="mt-1 text-xs text-gray-500">{block.description}</p> : null}
        </div>
        <p className="text-2xl font-semibold text-gray-900">{block.count ?? 0}</p>
      </div>
      {block.route ? (
        <Link href={block.route} className="mt-2 inline-block text-xs text-sky-700 underline">
          {labels.openLink}
        </Link>
      ) : null}
    </div>
  );
}

export function NotificationCommunicationEngineDashboardPanel({
  labels,
}: NotificationCommunicationEngineDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<NotificationCommunicationEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [frequency, setFrequency] = useState("immediate");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/notification-communication-engine/dashboard");
    if (res.ok) {
      const parsed = parseNotificationCommunicationEngineDashboard(await res.json());
      setDashboard(parsed);
      setFrequency(String(parsed.preferences?.frequency ?? "immediate"));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleNotification(id: string, action: "read" | "dismiss") {
    setActionId(id);
    await fetch(`/api/notifications/${id}/${action}`, { method: "POST" });
    await load();
    setActionId(null);
  }

  async function generateDigest() {
    setActionId("digest");
    await fetch("/api/notifications/digests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ digest_type: "daily" }),
    });
    await load();
    setActionId(null);
  }

  async function savePreferences() {
    setActionId("prefs");
    await fetch("/api/notifications/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ frequency }),
    });
    await load();
    setActionId(null);
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_organization) return null;

  const trends = dashboard.trends ?? {};
  const engagement = dashboard.engagement_summary;

  return (
    <div className="space-y-6">
      {(dashboard.integration_links ?? []).length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {dashboard.integration_links?.map((link) =>
            link.route ? (
              <Link key={link.key ?? link.route} href={link.route} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
                {link.label ?? link.key?.replace(/_/g, " ")}
              </Link>
            ) : null
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Link href="/app/operations-dashboard-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
            {labels.operationsDashboard}
          </Link>
          <Link href="/app/presence" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
            {labels.presence}
          </Link>
          <Link href="/app/admin-assistant-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
            {labels.adminAssistant}
          </Link>
          <Link href="/app/secure-ai-actions" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
            {labels.secureAiActions}
          </Link>
        </div>
      )}

      <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
        <h2 className="text-sm font-semibold text-violet-900">{labels.mobileCompanionEngine}</h2>
        {dashboard.mission ? (
          <p className="mt-2 text-sm font-medium text-violet-900">{dashboard.mission}</p>
        ) : null}
        <p className="mt-2 text-sm text-violet-900">{dashboard.mobile_philosophy ?? dashboard.philosophy}</p>
        {dashboard.abos_principle ? (
          <p className="mt-2 text-xs text-violet-800">{dashboard.abos_principle}</p>
        ) : null}
        {dashboard.implementation_blueprint?.title ? (
          <p className="mt-1 text-xs text-violet-700">
            {dashboard.implementation_blueprint.title}
            {dashboard.implementation_blueprint.phase ? ` · Phase ${dashboard.implementation_blueprint.phase}` : ""}
          </p>
        ) : null}
        <p className="mt-1 text-xs text-violet-700">{dashboard.safety_note}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={actionId === "digest"}
            onClick={() => void generateDigest()}
            className="rounded-lg border border-violet-300 bg-white px-3 py-1.5 text-sm text-violet-900"
          >
            {labels.generateDigest}
          </button>
        </div>
      </section>

      {engagement ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.engagementSummary}</h3>
          <div className="mt-3 grid gap-2 text-xs text-gray-600 sm:grid-cols-3">
            <span>{labels.unread}: {engagement.unread_notifications ?? 0}</span>
            <span>{labels.criticalUnread}: {engagement.critical_unread ?? 0}</span>
            <span>{labels.delivered24h}: {engagement.delivered_last_24h ?? 0}</span>
            <span>{labels.frequency}: {engagement.frequency ?? "immediate"}</span>
            <span>{labels.quietHours}: {engagement.quiet_hours_enabled ? labels.enabled : labels.disabled}</span>
            <span>{labels.subscribedCategories}: {engagement.subscribed_categories ?? 0}</span>
          </div>
          {engagement.mobile_push_note ? (
            <p className="mt-2 text-xs text-gray-500">{engagement.mobile_push_note}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.mobile_dashboard?.blocks && dashboard.mobile_dashboard.blocks.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.mobileDashboard}</h3>
          {dashboard.mobile_dashboard.principle ? (
            <p className="mt-1 text-xs text-gray-500">{dashboard.mobile_dashboard.principle}</p>
          ) : null}
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {dashboard.mobile_dashboard.blocks.map((block) => (
              <MobileDashboardBlockCard key={block.key ?? block.label} block={block} labels={labels} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.since_last_time ? (
        <section className="rounded-lg border border-sky-100 bg-sky-50/40 p-4 text-sm">
          <h3 className="text-sm font-semibold text-sky-900">{labels.sinceLastTime}</h3>
          {typeof dashboard.since_last_time.summary === "string" ? (
            <p className="mt-2 text-sky-900">{dashboard.since_last_time.summary}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.companion_experiences && dashboard.companion_experiences.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.companionExperiences}</h3>
          <ul className="mt-3 space-y-3">
            {dashboard.companion_experiences.map((exp) => (
              <li key={exp.key ?? exp.scenario} className="rounded-lg border border-gray-100 p-3 text-sm">
                <p className="font-medium text-gray-900">
                  {exp.emoji ? `${exp.emoji} ` : ""}
                  {exp.scenario}
                </p>
                {exp.example ? <p className="mt-1 text-xs text-gray-600">{exp.example}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.unread}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{trends.unread ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.criticalUnread}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{trends.critical_unread ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.deliveredWeek}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{trends.delivered_7d ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.recentDigests}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.recent_digests.length}</p>
        </div>
      </section>

      {(dashboard.critical_alerts?.length ?? 0) > 0 && (
        <section className="rounded-xl border border-rose-200 bg-rose-50/40 p-4">
          <h3 className="text-sm font-semibold text-rose-900">{labels.criticalAlerts}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.critical_alerts.map((alert) => (
              <li key={alert.id} className="rounded-lg border border-rose-100 bg-white p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                    {alert.message && <p className="mt-1 text-xs text-gray-600">{alert.message}</p>}
                    {alert.recommended_action && (
                      <p className="mt-1 text-xs text-rose-700">{alert.recommended_action}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {alert.action_url && (
                      <Link href={alert.action_url} className="rounded border border-gray-200 px-2 py-1 text-xs">
                        {labels.openAction}
                      </Link>
                    )}
                    <button
                      type="button"
                      disabled={actionId === alert.id}
                      onClick={() => void handleNotification(alert.id, "read")}
                      className="rounded border border-gray-200 px-2 py-1 text-xs"
                    >
                      {labels.markRead}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-gray-900">{labels.unreadNotifications}</h3>
        {dashboard.unread_notifications.length === 0 ? (
          <p className="mt-3 text-sm text-gray-600">{labels.noNotifications}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.unread_notifications.map((n) => (
              <li key={n.id} className="rounded-lg border border-gray-100 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded px-2 py-0.5 text-xs capitalize ${priorityClass(n.priority)}`}>
                        {n.priority}
                      </span>
                      <span className="text-xs capitalize text-gray-500">{formatCategory(n.category)}</span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-gray-900">{n.title}</p>
                    {n.message && <p className="mt-1 text-xs text-gray-600">{n.message}</p>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {n.action_url && (
                      <Link href={n.action_url} className="rounded border border-gray-200 px-2 py-1 text-xs">
                        {labels.openAction}
                      </Link>
                    )}
                    <button
                      type="button"
                      disabled={actionId === n.id}
                      onClick={() => void handleNotification(n.id, "read")}
                      className="rounded border border-gray-200 px-2 py-1 text-xs"
                    >
                      {labels.markRead}
                    </button>
                    <button
                      type="button"
                      disabled={actionId === n.id}
                      onClick={() => void handleNotification(n.id, "dismiss")}
                      className="rounded border border-gray-200 px-2 py-1 text-xs"
                    >
                      {labels.dismiss}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.preferences}</h3>
          <div className="mt-3 space-y-3">
            <label className="block text-xs text-gray-600">
              {labels.frequency}
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="mt-1 block w-full rounded border border-gray-200 px-2 py-1.5 text-sm"
              >
                <option value="immediate">{labels.immediate}</option>
                <option value="daily_digest">{labels.dailyDigest}</option>
                <option value="weekly_digest">{labels.weeklyDigest}</option>
              </select>
            </label>
            <button
              type="button"
              disabled={actionId === "prefs"}
              onClick={() => void savePreferences()}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
            >
              {labels.savePreferences}
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.recentHistory}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.recent_history.slice(0, 8).map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-2 text-xs text-gray-600">
                <span className="truncate">{item.title}</span>
                <span className="shrink-0 capitalize">{item.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {Array.isArray(dashboard.success_criteria) && dashboard.success_criteria.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.successCriteria}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.success_criteria.map((criterion) => (
              <li key={criterion.key ?? criterion.label} className="flex gap-2 text-sm">
                <span className={criterion.met ? "text-emerald-600" : "text-amber-600"}>
                  {criterion.met ? "✓" : "○"}
                </span>
                <span className="text-gray-700">
                  {criterion.label}
                  {criterion.note ? <span className="block text-xs text-gray-500">{criterion.note}</span> : null}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.self_love_connection?.principle ? (
        <section className="rounded-lg border border-rose-100 bg-rose-50/40 p-4 text-sm text-rose-900">
          <h3 className="text-sm font-semibold">{labels.selfLoveConnection}</h3>
          <p className="mt-2">{dashboard.self_love_connection.principle}</p>
          {dashboard.self_love_connection.companion_patterns && dashboard.self_love_connection.companion_patterns.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
              {dashboard.self_love_connection.companion_patterns.map((pattern) => (
                <li key={pattern}>{pattern}</li>
              ))}
            </ul>
          ) : null}
          {dashboard.self_love_connection.self_love_route ? (
            <Link href={dashboard.self_love_connection.self_love_route} className="mt-2 inline-block text-xs underline">
              {labels.openSelfLove}
            </Link>
          ) : null}
        </section>
      ) : null}

      {dashboard.trust_connection?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold text-gray-900">{labels.trustConnection}</h3>
          <p className="mt-2 text-gray-600">{dashboard.trust_connection.principle}</p>
          {dashboard.trust_connection.users_should_know && dashboard.trust_connection.users_should_know.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-gray-600">
              {dashboard.trust_connection.users_should_know.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.configuration_options?.options && dashboard.configuration_options.options.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.configurationOptions}</h3>
          {dashboard.configuration_options.principle ? (
            <p className="mt-1 text-xs text-gray-500">{dashboard.configuration_options.principle}</p>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-2">
            {dashboard.configuration_options.options.map((option) =>
              option.route ? (
                <Link key={option.key ?? option.label} href={option.route} className="rounded border border-gray-200 px-2 py-1 text-xs">
                  {option.label}
                </Link>
              ) : null
            )}
          </div>
        </section>
      ) : null}

      {(dashboard.principles?.length ?? 0) > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.principles}</h3>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-600">
            {dashboard.principles!.map((principle) => (
              <li key={principle}>{principle}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
