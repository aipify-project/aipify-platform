"use client";

import { useCallback, useEffect, useState } from "react";
import {
  parseMeetingCollaborationIntelligenceEngineDashboard,
  type CollaborationMeeting,
  type MeetingActionItem,
  type MeetingCollaborationIntelligenceEngineDashboard,
  type MeetingDecision,
} from "@/lib/aipify/meeting-collaboration-intelligence-engine";

type Props = { labels: Record<string, string> };

export function MeetingCollaborationIntelligenceEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<MeetingCollaborationIntelligenceEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [busyMeetingId, setBusyMeetingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/meeting-collaboration-intelligence-engine/dashboard");
    if (res.ok) setDashboard(parseMeetingCollaborationIntelligenceEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const createMeeting = async () => {
    setCreating(true);
    setActionError(null);
    const res = await fetch("/api/aipify/meeting-collaboration-intelligence-engine/meetings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        meeting_title: labels.defaultMeetingTitle,
        meeting_type: "department",
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.createFailed);
    } else {
      await load();
    }
    setCreating(false);
  };

  const meetingAction = async (meeting: CollaborationMeeting, action: string, extra: Record<string, unknown> = {}) => {
    if (!meeting.id) return;
    setBusyMeetingId(meeting.id);
    setActionError(null);
    const res = await fetch("/api/aipify/meeting-collaboration-intelligence-engine/meetings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, meeting_id: meeting.id, ...extra }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.actionFailed);
    } else {
      await load();
    }
    setBusyMeetingId(null);
  };

  const completeAction = async (action: MeetingActionItem) => {
    if (!action.id) return;
    setActionError(null);
    const res = await fetch("/api/aipify/meeting-collaboration-intelligence-engine/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update_status", action_id: action.id, status: "completed" }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.actionFailed);
    } else {
      await load();
    }
  };

  const exportManifest = async () => {
    setExporting(true);
    setActionError(null);
    const res = await fetch("/api/aipify/meeting-collaboration-intelligence-engine/export", {
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

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        <p className="mt-2 text-xs text-violet-700">{labels.distinctionNote}</p>
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded border border-violet-300 px-3 py-1 text-xs text-violet-800 disabled:opacity-50"
          disabled={creating}
          onClick={() => void createMeeting()}
        >
          {creating ? labels.creating : labels.createMeeting}
        </button>
        <button
          type="button"
          className="rounded border border-violet-300 px-3 py-1 text-xs text-violet-800 disabled:opacity-50"
          disabled={exporting}
          onClick={() => void exportManifest()}
        >
          {exporting ? labels.exporting : labels.exportManifest}
        </button>
      </div>

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.summary}</h3>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div><dt className="text-gray-500">{labels.scheduledMeetings}</dt><dd>{String(summary.scheduled_meetings ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.openActions}</dt><dd>{String(summary.open_action_items ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.completedMeetings30d}</dt><dd>{String(summary.completed_meetings_30d ?? 0)}</dd></div>
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

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.meetings}</h3>
        <ul className="mt-3 space-y-3">
          {(dashboard.meetings ?? []).map((meeting: CollaborationMeeting) => (
            <li key={meeting.id} className="rounded border border-gray-100 p-3 text-sm">
              <div className="font-medium">{meeting.meeting_title}</div>
              <div className="mt-1 text-xs text-gray-500">
                {meeting.meeting_type} · {meeting.status} · {meeting.scheduled_at}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded border px-2 py-0.5 text-xs disabled:opacity-50"
                  disabled={busyMeetingId === meeting.id}
                  onClick={() => void meetingAction(meeting, "generate_agenda")}
                >
                  {labels.generateAgenda}
                </button>
                <button
                  type="button"
                  className="rounded border px-2 py-0.5 text-xs disabled:opacity-50"
                  disabled={busyMeetingId === meeting.id}
                  onClick={() => void meetingAction(meeting, "capture_summary", {
                    summary_metadata: { headline: meeting.meeting_title, metadata_only: true },
                  })}
                >
                  {labels.captureSummary}
                </button>
                <button
                  type="button"
                  className="rounded border px-2 py-0.5 text-xs disabled:opacity-50"
                  disabled={busyMeetingId === meeting.id}
                  onClick={() => void meetingAction(meeting, "extract_actions")}
                >
                  {labels.extractActions}
                </button>
                <button
                  type="button"
                  className="rounded border px-2 py-0.5 text-xs disabled:opacity-50"
                  disabled={busyMeetingId === meeting.id}
                  onClick={() => void meetingAction(meeting, "capture_decision", {
                    decision_text: labels.defaultDecisionText,
                  })}
                >
                  {labels.captureDecision}
                </button>
                {meeting.status === "scheduled" && (
                  <button
                    type="button"
                    className="rounded border px-2 py-0.5 text-xs disabled:opacity-50"
                    disabled={busyMeetingId === meeting.id}
                    onClick={() => void meetingAction(meeting, "update_status", { status: "in_progress" })}
                  >
                    {labels.startMeeting}
                  </button>
                )}
                {meeting.status === "in_progress" && (
                  <button
                    type="button"
                    className="rounded border px-2 py-0.5 text-xs disabled:opacity-50"
                    disabled={busyMeetingId === meeting.id}
                    onClick={() => void meetingAction(meeting, "update_status", { status: "completed" })}
                  >
                    {labels.completeMeeting}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.actionItems}</h3>
        <ul className="mt-3 space-y-2 text-sm">
          {(dashboard.action_items ?? []).map((action: MeetingActionItem) => (
            <li key={action.id} className="flex flex-wrap items-center justify-between gap-2 rounded border border-gray-100 p-2">
              <span>{action.action_description}</span>
              <span className="text-xs text-gray-500">{action.status}{action.due_date ? ` · ${action.due_date}` : ""}</span>
              {action.status !== "completed" && action.id && (
                <button
                  type="button"
                  className="rounded border px-2 py-0.5 text-xs"
                  onClick={() => void completeAction(action)}
                >
                  {labels.completeAction}
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.decisions}</h3>
        <ul className="mt-3 space-y-2 text-sm">
          {(dashboard.decisions ?? []).map((decision: MeetingDecision) => (
            <li key={decision.id} className="rounded border border-gray-100 p-2">{decision.decision_text}</li>
          ))}
        </ul>
      </section>

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
