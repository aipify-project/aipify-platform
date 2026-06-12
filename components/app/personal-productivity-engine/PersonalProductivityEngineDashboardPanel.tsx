"use client";

import { useCallback, useEffect, useState } from "react";
import {
  parsePersonalProductivityEngineDashboard,
  type PersonalProductivityEngineDashboard,
  type PersonalProductivityReminder,
  type ProductivityRecommendation,
} from "@/lib/aipify/personal-productivity-engine";

type Props = { labels: Record<string, string> };

export function PersonalProductivityEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<PersonalProductivityEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [generatingBriefing, setGeneratingBriefing] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/personal-productivity-engine/dashboard");
    if (res.ok) setDashboard(parsePersonalProductivityEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const dismissReminder = async (reminder: PersonalProductivityReminder) => {
    if (!reminder.id) return;
    setBusyId(reminder.id);
    setActionError(null);
    const res = await fetch("/api/aipify/personal-productivity-engine/reminders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "dismiss", reminder_id: reminder.id }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.actionFailed);
    } else {
      await load();
    }
    setBusyId(null);
  };

  const generateBriefing = async () => {
    setGeneratingBriefing(true);
    setActionError(null);
    const res = await fetch("/api/aipify/personal-productivity-engine/briefing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.briefingFailed);
    } else {
      await load();
    }
    setGeneratingBriefing(false);
  };

  const exportManifest = async () => {
    setExporting(true);
    setActionError(null);
    const res = await fetch("/api/aipify/personal-productivity-engine/export", {
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

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const sections = dashboard.sections ?? {};
  const priorities = sections.todays_priorities ?? [];
  const upcoming = sections.upcoming_commitments ?? [];
  const overdue = sections.overdue_work ?? [];
  const focusRecs = sections.focus_recommendations ?? dashboard.recommendations ?? [];
  const dailyBriefing = sections.daily_briefing ?? {};
  const reminders = dashboard.reminders ?? [];

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-sky-200 bg-sky-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        <p className="mt-2 text-xs text-sky-700">{labels.distinctionNote}</p>
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded border border-sky-300 px-3 py-1 text-xs text-sky-800 disabled:opacity-50"
          disabled={generatingBriefing}
          onClick={() => void generateBriefing()}
        >
          {generatingBriefing ? labels.generatingBriefing : labels.generateBriefing}
        </button>
        <button
          type="button"
          className="rounded border border-sky-300 px-3 py-1 text-xs text-sky-800 disabled:opacity-50"
          disabled={exporting}
          onClick={() => void exportManifest()}
        >
          {exporting ? labels.exporting : labels.exportManifest}
        </button>
      </div>

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.summary}</h3>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div><dt className="text-gray-500">{labels.openPriorities}</dt><dd>{String(summary.open_priorities ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.overdueItems}</dt><dd>{String(summary.overdue_items ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.upcomingCommitments}</dt><dd>{String(summary.upcoming_commitments_7d ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.scheduledReminders}</dt><dd>{String(summary.scheduled_reminders ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.pendingApprovals}</dt><dd>{String(summary.pending_approvals ?? 0)}</dd></div>
        </dl>
      </section>

      {dashboard.principles && dashboard.principles.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.principles}</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
            {dashboard.principles.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </section>
      )}

      {Boolean(dailyBriefing.has_briefing) && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.dailyBriefing}</h3>
          <p className="mt-2 text-sm text-gray-700">
            {(dailyBriefing.briefing as { summary?: string } | undefined)?.summary ?? labels.briefingReady}
          </p>
        </section>
      )}

      {priorities.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.todaysPriorities}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {priorities.map((item, i) => (
              <li key={`priority-${i}`} className="rounded border border-gray-100 p-2">
                <span className="font-medium">{String(item.title ?? "—")}</span>
                <span className="ml-2 text-xs text-gray-500">{String(item.priority ?? "")}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {upcoming.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.upcomingCommitmentsSection}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {upcoming.map((item, i) => (
              <li key={`upcoming-${i}`} className="rounded border border-gray-100 p-2">
                {String(item.title ?? "—")}
                <span className="ml-2 text-xs text-gray-500">{String(item.source ?? "")}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {overdue.length > 0 && (
        <section className="rounded-lg border border-amber-200 bg-amber-50/30 p-4">
          <h3 className="text-sm font-semibold">{labels.overdueWork}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {overdue.map((item, i) => (
              <li key={`overdue-${i}`} className="rounded border border-amber-100 p-2">
                {String(item.title ?? "—")}
              </li>
            ))}
          </ul>
        </section>
      )}

      {focusRecs.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.focusRecommendations}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {(focusRecs as ProductivityRecommendation[]).map((rec, i) => (
              <li key={`${rec.type ?? "rec"}-${i}`} className="rounded border border-gray-100 p-2">
                <span className="text-xs uppercase text-gray-500">{rec.type} · {rec.confidence}</span>
                <p className="mt-1">{rec.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {reminders.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.reminders}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {reminders.map((r) => (
              <li key={r.id} className="rounded border border-sky-100 bg-sky-50/30 p-3">
                <div className="font-medium">{r.title}</div>
                <div className="mt-1 text-xs text-gray-500">{r.remind_at} · {r.channel}</div>
                {r.id && (
                  <button
                    type="button"
                    className="mt-2 rounded border px-2 py-0.5 text-xs disabled:opacity-50"
                    disabled={busyId === r.id}
                    onClick={() => void dismissReminder(r)}
                  >
                    {labels.dismissReminder}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {dashboard.integration_summaries && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.integrationSummaries}</h3>
          <pre className="mt-2 overflow-x-auto text-xs text-gray-600">
            {JSON.stringify(dashboard.integration_summaries, null, 2)}
          </pre>
        </section>
      )}
    </div>
  );
}
