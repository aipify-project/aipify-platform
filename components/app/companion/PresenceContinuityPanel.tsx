"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  PRESENCE_CORE_PRINCIPLE,
  PRESENCE_PHILOSOPHY,
  PRESENCE_VISION,
  parsePresenceContinuityCenter,
  type PresenceContinuityCenter,
} from "@/lib/presence-continuity";

type PanelLabels = {
  title: string;
  subtitle: string;
  loading: string;
  corePrinciple: string;
  philosophyTitle: string;
  visionTitle: string;
  presenceStatus: string;
  resumeTitle: string;
  continueSession: string;
  sinceLastSessionTitle: string;
  contextTitle: string;
  prioritiesTitle: string;
  initiativesTitle: string;
  insightsTitle: string;
  executiveTitle: string;
  settingsTitle: string;
  presenceState: string;
  greetingStyle: string;
  briefingFrequency: string;
  sinceLastSessionDetail: string;
  focusBehavior: string;
  saveSettings: string;
  dismiss: string;
  privacyNote: string;
  commandCenterLink: string;
  trustAdoptionLink: string;
  identityLink: string;
  attentionLink: string;
  states: Record<string, string>;
};

type PresenceContinuityPanelProps = {
  labels: PanelLabels;
};

function stateBadge(state: string) {
  switch (state) {
    case "active_companion":
      return "bg-emerald-100 text-emerald-800";
    case "focused":
      return "bg-indigo-100 text-indigo-800";
    case "available":
      return "bg-sky-100 text-sky-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export function PresenceContinuityPanel({ labels }: PresenceContinuityPanelProps) {
  const [center, setCenter] = useState<PresenceContinuityCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [presenceState, setPresenceState] = useState("available");
  const [greetingStyle, setGreetingStyle] = useState("warm");
  const [briefingFrequency, setBriefingFrequency] = useState("on_return");
  const [sessionDetail, setSessionDetail] = useState("standard");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/presence-continuity/center");
    if (res.ok) {
      const parsed = parsePresenceContinuityCenter(await res.json());
      setCenter(parsed);
      if (parsed.settings) {
        setPresenceState(parsed.settings.presence_state);
        setGreetingStyle(parsed.settings.greeting_style);
        setBriefingFrequency(parsed.settings.briefing_frequency);
        setSessionDetail(parsed.settings.since_last_session_detail);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const resumeSession = async () => {
    await fetch("/api/presence-continuity/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "resume" }),
    });
    await load();
  };

  const saveSettings = async () => {
    await fetch("/api/presence-continuity/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update_settings",
        presence_state: presenceState,
        greeting_style: greetingStyle,
        briefing_frequency: briefingFrequency,
        since_last_session_detail: sessionDetail,
      }),
    });
    await load();
  };

  const dismissInsight = async (insightKey: string) => {
    await fetch("/api/presence-continuity/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "event",
        event_type: "notification_action",
        insight_key: insightKey,
        summary: "Insight dismissed",
      }),
    });
    await load();
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  const resume = center?.resume_experience ?? center?.since_last_session;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap gap-3 text-sm">
        {center?.links?.command_center && (
          <Link href={center.links.command_center} className="text-teal-600 hover:underline">
            {labels.commandCenterLink}
          </Link>
        )}
        {center?.links?.trust_adoption && (
          <Link href={center.links.trust_adoption} className="text-teal-600 hover:underline">
            {labels.trustAdoptionLink}
          </Link>
        )}
        {center?.links?.identity_relationship && (
          <Link href={center.links.identity_relationship} className="text-teal-600 hover:underline">
            {labels.identityLink}
          </Link>
        )}
        {center?.links?.attention_guardian && (
          <Link href={center.links.attention_guardian} className="text-teal-600 hover:underline">
            {labels.attentionLink}
          </Link>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-teal-900">
          {labels.corePrinciple}: {PRESENCE_CORE_PRINCIPLE}
        </p>
        <p className="mt-2 text-sm text-gray-600">
          {labels.philosophyTitle}: {PRESENCE_PHILOSOPHY}
        </p>
        <p className="mt-1 text-sm text-gray-600">
          {labels.visionTitle}: {PRESENCE_VISION}
        </p>
        {center?.privacy_note && (
          <p className="mt-2 text-sm text-gray-500">
            {labels.privacyNote}: {center.privacy_note}
          </p>
        )}
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-gray-600">{labels.presenceStatus}</p>
            <p className="mt-1 text-xl font-semibold">
              <span
                className={`rounded px-2 py-0.5 text-sm ${stateBadge(center?.presence_status ?? "available")}`}
              >
                {labels.states[center?.presence_status ?? "available"] ?? center?.presence_status}
              </span>
            </p>
          </div>
          {center?.can_record && (
            <button
              type="button"
              onClick={() => void resumeSession()}
              className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
            >
              {labels.continueSession}
            </button>
          )}
        </div>
      </section>

      {resume && (
        <section className="rounded-2xl border border-teal-100 bg-teal-50/40 p-5">
          <h2 className="font-semibold text-teal-900">{labels.resumeTitle}</h2>
          {resume.greeting && <p className="mt-3 whitespace-pre-wrap text-sm text-gray-800">{resume.greeting}</p>}
          <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-gray-700">
            {resume.summary_items.map((item) => (
              <li key={item.label}>
                {item.label}
                {item.value != null ? `: ${item.value}` : ""}
              </li>
            ))}
          </ul>
        </section>
      )}

      {center && center.pending_priorities.length > 0 && (
        <section className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5">
          <h2 className="font-semibold text-amber-900">{labels.prioritiesTitle}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {center.pending_priorities.map((item) => (
              <li key={item.key} className="rounded-lg border border-amber-100 bg-white px-3 py-2">
                {item.title}
                <span className="ml-2 text-xs text-gray-500">{item.urgency}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {center && center.continuity_context.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.contextTitle}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {center.continuity_context.map((item) => (
              <li key={item.context_key} className="flex justify-between rounded-lg border px-3 py-2">
                <span>{item.title}</span>
                <span className="text-gray-500">{item.context_type}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {center && center.active_initiatives.length > 0 && (
        <section className="rounded-2xl border border-violet-100 bg-violet-50/40 p-5">
          <h2 className="font-semibold text-violet-900">{labels.initiativesTitle}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {center.active_initiatives.map((item) => (
              <li key={item.context_key} className="rounded-lg border border-violet-100 bg-white px-3 py-2">
                {item.title}
              </li>
            ))}
          </ul>
        </section>
      )}

      {center?.executive_widgets && Object.keys(center.executive_widgets).length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.executiveTitle}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            {Object.entries(center.executive_widgets).map(([key, value]) => (
              <div key={key} className="rounded-lg border border-gray-100 p-3">
                <p className="text-gray-500">{key.replace(/_/g, " ")}</p>
                <p className="mt-1 font-semibold">{String(value)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {center && center.presence_insights.length > 0 && (
        <section className="rounded-2xl border border-sky-100 bg-sky-50/40 p-5">
          <h2 className="font-semibold text-sky-900">{labels.insightsTitle}</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {center.presence_insights.map((insight) => (
              <li key={insight.insight_key} className="rounded-xl border border-sky-100 bg-white p-4">
                <p className="text-gray-800">{insight.message}</p>
                {center.can_record && (
                  <button
                    type="button"
                    onClick={() => void dismissInsight(insight.insight_key)}
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

      {center?.can_manage && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.settingsTitle}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 text-sm">
            <label className="flex flex-col gap-1">
              <span>{labels.presenceState}</span>
              <select
                value={presenceState}
                onChange={(e) => setPresenceState(e.target.value)}
                className="rounded-lg border px-3 py-2"
              >
                <option value="offline">{labels.states.offline}</option>
                <option value="available">{labels.states.available}</option>
                <option value="focused">{labels.states.focused}</option>
                <option value="active_companion">{labels.states.active_companion}</option>
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span>{labels.greetingStyle}</span>
              <select
                value={greetingStyle}
                onChange={(e) => setGreetingStyle(e.target.value)}
                className="rounded-lg border px-3 py-2"
              >
                <option value="warm">Warm</option>
                <option value="professional">Professional</option>
                <option value="brief">Brief</option>
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span>{labels.briefingFrequency}</span>
              <select
                value={briefingFrequency}
                onChange={(e) => setBriefingFrequency(e.target.value)}
                className="rounded-lg border px-3 py-2"
              >
                <option value="on_return">On return</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span>{labels.sinceLastSessionDetail}</span>
              <select
                value={sessionDetail}
                onChange={(e) => setSessionDetail(e.target.value)}
                className="rounded-lg border px-3 py-2"
              >
                <option value="brief">Brief</option>
                <option value="standard">Standard</option>
                <option value="executive">Executive</option>
              </select>
            </label>
          </div>
          <button
            type="button"
            onClick={() => void saveSettings()}
            className="mt-4 rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
          >
            {labels.saveSettings}
          </button>
        </section>
      )}
    </div>
  );
}
