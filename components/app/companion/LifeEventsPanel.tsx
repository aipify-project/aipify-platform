"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  LIFE_EVENTS_CORE_PRINCIPLE,
  LIFE_EVENTS_VISION,
  USER_CONTROL_PRINCIPLE,
  parseLifeEventsCenter,
  type LifeEventsCenter,
} from "@/lib/life-events";

type LifeEventsPanelLabels = {
  title: string;
  subtitle: string;
  loading: string;
  corePrinciple: string;
  visionTitle: string;
  userControlTitle: string;
  upcomingTitle: string;
  remindersTitle: string;
  suggestedActionsTitle: string;
  preparationTitle: string;
  careInsightsTitle: string;
  completedTitle: string;
  settingsTitle: string;
  proactivityLevel: string;
  suggestActions: string;
  executeActions: string;
  optOut: string;
  saveSettings: string;
  approve: string;
  decline: string;
  complete: string;
  dismiss: string;
  snooze: string;
  daysUntil: string;
  importance: string;
  noUpcoming: string;
  noReminders: string;
  noActions: string;
  privacyNote: string;
  trustAdoptionLink: string;
  approvalsLink: string;
  marketplaceLink: string;
  categories: Record<string, string>;
  importanceLevels: Record<string, string>;
};

type LifeEventsPanelProps = {
  labels: LifeEventsPanelLabels;
};

function importanceBadge(level: string) {
  switch (level) {
    case "never_forget":
      return "bg-rose-100 text-rose-800";
    case "very_important":
      return "bg-amber-100 text-amber-800";
    case "important":
      return "bg-indigo-100 text-indigo-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export function LifeEventsPanel({ labels }: LifeEventsPanelProps) {
  const [center, setCenter] = useState<LifeEventsCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [proactivity, setProactivity] = useState("moderate");
  const [suggestActions, setSuggestActions] = useState(true);
  const [executeActions, setExecuteActions] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/life-events/center");
    if (res.ok) {
      const parsed = parseLifeEventsCenter(await res.json());
      setCenter(parsed);
      if (parsed.settings) {
        setProactivity(parsed.settings.proactivity_level);
        setSuggestActions(parsed.settings.suggest_actions_allowed);
        setExecuteActions(parsed.settings.execute_actions_allowed);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const postAction = async (payload: Record<string, unknown>) => {
    await fetch("/api/life-events/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await load();
  };

  const saveSettings = async () => {
    await postAction({
      action: "update_preferences",
      proactivity_level: proactivity,
      suggest_actions_allowed: suggestActions,
      execute_actions_allowed: executeActions,
    });
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap gap-3 text-sm">
        {center?.links?.trust_adoption && (
          <Link href={center.links.trust_adoption} className="text-rose-600 hover:underline">
            {labels.trustAdoptionLink}
          </Link>
        )}
        {center?.links?.approvals && (
          <Link href={center.links.approvals} className="text-rose-600 hover:underline">
            {labels.approvalsLink}
          </Link>
        )}
        {center?.links?.companion_marketplace && (
          <Link href={center.links.companion_marketplace} className="text-rose-600 hover:underline">
            {labels.marketplaceLink}
          </Link>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-900">
          {labels.corePrinciple}: {LIFE_EVENTS_CORE_PRINCIPLE}
        </p>
        <p className="mt-2 text-sm text-gray-600">
          {labels.visionTitle}: {LIFE_EVENTS_VISION}
        </p>
        {center?.privacy_note && (
          <p className="mt-2 text-sm text-gray-500">
            {labels.privacyNote}: {center.privacy_note}
          </p>
        )}
      </div>

      {center?.can_manage && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.settingsTitle}</h2>
          <p className="mt-1 text-sm text-gray-600">
            {labels.userControlTitle}: {USER_CONTROL_PRINCIPLE}
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 text-sm">
            <label className="flex flex-col gap-1">
              <span className="text-gray-600">{labels.proactivityLevel}</span>
              <select
                value={proactivity}
                onChange={(e) => setProactivity(e.target.value)}
                className="rounded-lg border border-gray-200 px-3 py-2"
              >
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
              </select>
            </label>
            <label className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                checked={suggestActions}
                onChange={(e) => setSuggestActions(e.target.checked)}
              />
              <span>{labels.suggestActions}</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={executeActions}
                onChange={(e) => setExecuteActions(e.target.checked)}
              />
              <span>{labels.executeActions}</span>
            </label>
          </div>
          <button
            type="button"
            onClick={() => void saveSettings()}
            className="mt-4 rounded-lg bg-rose-700 px-4 py-2 text-sm font-medium text-white hover:bg-rose-800"
          >
            {labels.saveSettings}
          </button>
        </section>
      )}

      {center && center.reminders.length > 0 && (
        <section className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5">
          <h2 className="font-semibold text-amber-900">{labels.remindersTitle}</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {center.reminders.map((reminder) => (
              <li key={reminder.reminder_key} className="rounded-xl border border-amber-100 bg-white p-4">
                <p className="text-gray-800">{reminder.message}</p>
                <p className="mt-1 text-xs text-gray-500">{reminder.timing_option.replace(/_/g, " ")}</p>
                {center.can_record && (
                  <div className="mt-2 flex gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() =>
                        void postAction({
                          action: "record_action",
                          reminder_key: reminder.reminder_key,
                          decision: "snooze",
                        })
                      }
                      className="text-amber-700 hover:underline"
                    >
                      {labels.snooze}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        void postAction({
                          action: "record_action",
                          reminder_key: reminder.reminder_key,
                          decision: "dismiss",
                        })
                      }
                      className="text-gray-600 hover:underline"
                    >
                      {labels.dismiss}
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {center && center.upcoming_events.length > 0 ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.upcomingTitle}</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {center.upcoming_events.map((event) => (
              <li key={event.event_key} className="rounded-xl border border-gray-100 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{event.title}</span>
                  <span className={`rounded px-2 py-0.5 text-xs ${importanceBadge(event.importance_level)}`}>
                    {labels.importanceLevels[event.importance_level] ?? event.importance_level}
                  </span>
                </div>
                <p className="mt-1 text-gray-600">
                  {labels.categories[event.category] ?? event.category} · {event.event_date}
                  {event.days_until != null && (
                    <span>
                      {" "}
                      · {labels.daysUntil}: {event.days_until}
                    </span>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <p className="text-sm text-gray-500">{labels.noUpcoming}</p>
      )}

      {center && center.suggested_actions.length > 0 && (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h2 className="font-semibold text-indigo-900">{labels.suggestedActionsTitle}</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {center.suggested_actions.map((action) => (
              <li key={action.action_key} className="rounded-xl border border-indigo-100 bg-white p-4">
                <p className="text-gray-800">{action.message}</p>
                {center.can_record && action.status === "suggested" && (
                  <div className="mt-2 flex gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() =>
                        void postAction({
                          action: "record_action",
                          action_key: action.action_key,
                          decision: "approve",
                        })
                      }
                      className="text-indigo-700 hover:underline"
                    >
                      {labels.approve}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        void postAction({
                          action: "record_action",
                          action_key: action.action_key,
                          decision: "decline",
                        })
                      }
                      className="text-gray-600 hover:underline"
                    >
                      {labels.decline}
                    </button>
                  </div>
                )}
                {action.status === "approved" && center.can_record && (
                  <button
                    type="button"
                    onClick={() =>
                      void postAction({
                        action: "record_action",
                        action_key: action.action_key,
                        decision: "complete",
                      })
                    }
                    className="mt-2 text-xs text-indigo-700 hover:underline"
                  >
                    {labels.complete}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {center && center.preparation_needed.length > 0 && (
        <section className="rounded-2xl border border-violet-100 bg-violet-50/40 p-5">
          <h2 className="font-semibold text-violet-900">{labels.preparationTitle}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {center.preparation_needed.map((event) => (
              <li key={event.event_key} className="text-violet-950">
                {event.title} — {event.event_date}
              </li>
            ))}
          </ul>
        </section>
      )}

      {center && center.care_insights.length > 0 && (
        <section className="rounded-2xl border border-rose-100 bg-rose-50/30 p-5">
          <h2 className="font-semibold text-rose-900">{labels.careInsightsTitle}</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {center.care_insights.map((insight) => (
              <li key={insight.insight_key} className="rounded-xl border border-rose-100 bg-white p-4">
                <p className="text-gray-800">{insight.message}</p>
                {center.can_record && (
                  <button
                    type="button"
                    onClick={() =>
                      void postAction({
                        action: "record_action",
                        insight_key: insight.insight_key,
                        decision: "dismiss",
                      })
                    }
                    className="mt-2 text-xs text-gray-600 hover:underline"
                  >
                    {labels.dismiss}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {center && center.recently_completed.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.completedTitle}</h2>
          <ul className="mt-4 space-y-2 text-sm text-gray-700">
            {center.recently_completed.map((item) => (
              <li key={item.action_key}>
                {item.action_type.replace(/_/g, " ")} — {item.completed_at}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
