"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseProactiveCompanionEngineDashboard,
  type ProactiveCompanionEngineDashboard,
  type ProactiveCompanionNudge,
} from "@/lib/aipify/proactive-companion-engine";

type Props = { labels: Record<string, string> };

function badgeClass(value?: string) {
  switch (value) {
    case "high":
      return "bg-orange-100 text-orange-800";
    case "normal":
      return "bg-amber-100 text-amber-800";
    case "low":
      return "bg-emerald-100 text-emerald-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function NudgeRow({
  nudge,
  labels,
  onDismiss,
  onSnooze,
  busy,
  canDismiss,
}: {
  nudge: ProactiveCompanionNudge;
  labels: Record<string, string>;
  onDismiss: (id: string) => void;
  onSnooze: (id: string) => void;
  busy: boolean;
  canDismiss: boolean;
}) {
  if (!nudge.id) return null;
  return (
    <li className="rounded-lg border border-gray-100 bg-white px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium capitalize text-gray-900">
          {(nudge.category ?? "operational").replace(/_/g, " ")}
        </span>
        <span className={`rounded-full px-2 py-0.5 text-xs uppercase ${badgeClass(nudge.priority)}`}>
          {nudge.priority ?? "normal"}
        </span>
      </div>
      {nudge.summary ? <p className="mt-1 text-xs text-gray-700">{nudge.summary}</p> : null}
      {nudge.suggested_action ? (
        <p className="mt-1 text-xs text-indigo-700">{nudge.suggested_action}</p>
      ) : null}
      {canDismiss ? (
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => onDismiss(nudge.id!)}
            className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-700 disabled:opacity-50"
          >
            {labels.dismiss}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onSnooze(nudge.id!)}
            className="rounded border border-indigo-200 px-2 py-1 text-xs text-indigo-800 disabled:opacity-50"
          >
            {labels.snooze}
          </button>
        </div>
      ) : null}
    </li>
  );
}

export function ProactiveCompanionEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<ProactiveCompanionEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [frequency, setFrequency] = useState("normal");
  const [communicationStyle, setCommunicationStyle] = useState("supportive");

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/proactive-companion-engine/dashboard");
    if (res.ok) {
      const parsed = parseProactiveCompanionEngineDashboard(await res.json());
      setDashboard(parsed);
      if (typeof parsed.user_preferences?.frequency === "string") {
        setFrequency(parsed.user_preferences.frequency);
      }
      if (typeof parsed.user_preferences?.communication_style === "string") {
        setCommunicationStyle(parsed.user_preferences.communication_style);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function nudgeAction(nudgeId: string, action: "dismiss" | "snooze") {
    setBusyId(nudgeId);
    setActionError(null);
    const res = await fetch("/api/aipify/proactive-companion-engine/nudges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nudge_id: nudgeId, action }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.actionFailed);
    } else {
      await load();
    }
    setBusyId(null);
  }

  async function savePreferences() {
    setSavingPrefs(true);
    setActionError(null);
    const res = await fetch("/api/aipify/proactive-companion-engine/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ frequency, communication_style: communicationStyle }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.preferencesFailed);
    } else {
      await load();
    }
    setSavingPrefs(false);
  }

  async function exportSummary() {
    setExporting(true);
    setActionError(null);
    const res = await fetch("/api/aipify/proactive-companion-engine/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.exportFailed);
    }
    setExporting(false);
  }

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const integrationLinks = dashboard.integration_links ?? {};
  const permissions = dashboard.permissions ?? {};
  const canDismiss = Boolean(permissions.can_dismiss);
  const canManagePrefs = Boolean(permissions.can_manage_preferences);
  const nudges = dashboard.active_nudges ?? [];
  const categories = dashboard.assistance_categories ?? [];
  const styleExamples = dashboard.companion_style_examples ?? [];
  const boundaries = dashboard.boundaries ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/command-center" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.commandCenter}
        </Link>
        <Link
          href="/app/settings/companion-presence"
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
        >
          {labels.companionPresence}
        </Link>
        <Link
          href="/app/notification-communication-engine"
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
        >
          {labels.notificationEngine}
        </Link>
      </div>

      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        {dashboard.mission ? <p className="mt-2 text-sm text-gray-700">{dashboard.mission}</p> : null}
        {dashboard.abos_principle ? (
          <p className="mt-2 text-xs text-indigo-800">{dashboard.abos_principle}</p>
        ) : null}
        {dashboard.self_love_note ? (
          <p className="mt-2 text-xs text-gray-600">{dashboard.self_love_note}</p>
        ) : null}
        {dashboard.distinction_note ? (
          <p className="mt-2 text-xs text-indigo-700">{dashboard.distinction_note}</p>
        ) : null}
      </section>

      {actionError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 p-4">
          <p className="text-xs uppercase text-gray-500">{labels.pendingNudges}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.pending_nudges ?? 0)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-4">
          <p className="text-xs uppercase text-gray-500">{labels.snoozedNudges}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.snoozed_nudges ?? 0)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-4">
          <p className="text-xs uppercase text-gray-500">{labels.dismissedToday}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.dismissed_today ?? 0)}</p>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold">{labels.assistanceCategories}</h3>
        <ul className="mt-3 space-y-2">
          {categories.map((cat) => (
            <li key={String(cat.key)} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
              <span className="font-medium">{cat.label}</span>
              {cat.description ? <p className="mt-1 text-xs text-gray-600">{cat.description}</p> : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold">{labels.activeNudges}</h3>
        {nudges.length === 0 ? (
          <p className="mt-2 text-sm text-gray-600">{labels.noNudges}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {nudges.map((nudge) => (
              <NudgeRow
                key={nudge.id}
                nudge={nudge}
                labels={labels}
                onDismiss={(id) => void nudgeAction(id, "dismiss")}
                onSnooze={(id) => void nudgeAction(id, "snooze")}
                busy={busyId === nudge.id}
                canDismiss={canDismiss}
              />
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold">{labels.companionStyle}</h3>
        <ul className="mt-3 space-y-2">
          {styleExamples.map((ex, i) => (
            <li key={`${ex.style}-${i}`} className="text-sm text-gray-700">
              <span className="font-medium capitalize">{ex.style}:</span> {ex.example}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold">{labels.boundaries}</h3>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-700">
          {boundaries.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {canManagePrefs ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.preferences}</h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <label className="text-sm">
              <span className="block text-xs text-gray-500">{labels.frequency}</span>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="mt-1 w-full rounded border border-gray-200 px-2 py-1.5"
              >
                <option value="low">{labels.frequencyLow}</option>
                <option value="normal">{labels.frequencyNormal}</option>
                <option value="high">{labels.frequencyHigh}</option>
              </select>
            </label>
            <label className="text-sm">
              <span className="block text-xs text-gray-500">{labels.communicationStyle}</span>
              <select
                value={communicationStyle}
                onChange={(e) => setCommunicationStyle(e.target.value)}
                className="mt-1 w-full rounded border border-gray-200 px-2 py-1.5"
              >
                <option value="supportive">{labels.styleSupportive}</option>
                <option value="balanced">{labels.styleBalanced}</option>
                <option value="minimal">{labels.styleMinimal}</option>
              </select>
            </label>
          </div>
          <button
            type="button"
            disabled={savingPrefs}
            onClick={() => void savePreferences()}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {savingPrefs ? labels.saving : labels.savePreferences}
          </button>
        </section>
      ) : null}

      <section className="rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold">{labels.integrationLinks}</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries(integrationLinks).map(([key, href]) =>
            typeof href === "string" ? (
              <Link key={key} href={href} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm capitalize">
                {key.replace(/_/g, " ")}
              </Link>
            ) : null
          )}
        </div>
      </section>

      <button
        type="button"
        disabled={exporting}
        onClick={() => void exportSummary()}
        className="rounded-lg border border-gray-200 px-4 py-2 text-sm disabled:opacity-50"
      >
        {exporting ? labels.exporting : labels.exportSummary}
      </button>
    </div>
  );
}
