"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
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

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const blueprint = dashboard.implementation_blueprint_phase72;
  const successCriteria = dashboard.blueprint_success_criteria ?? [];
  const objectives = dashboard.blueprint_objectives ?? [];
  const integrationLinks = dashboard.blueprint_integration_links ?? [];
  const visionPhrases = dashboard.blueprint_vision_phrases ?? [];
  const engagement = dashboard.engagement_summary;
  const decisionExamples = dashboard.decision_tracking?.examples ?? [];
  const companionInsights = dashboard.companion_insights?.insights ?? [];
  const continuityPatterns = dashboard.meeting_continuity?.continuity_patterns ?? [];
  const supportedPlatforms = dashboard.supported_platforms?.platforms ?? [];
  const teamsPrivacy = dashboard.teams_integration_privacy_standard;
  const teamsJoinOptions = teamsPrivacy?.join_options ?? [];
  const teamsSavePrefs = teamsPrivacy?.save_preferences ?? [];
  const teamsPostOptions = teamsPrivacy?.post_meeting_flow?.options ?? [];
  const teamsPermitted = teamsPrivacy?.permitted_capabilities ?? [];
  const teamsProhibited = teamsPrivacy?.prohibited_actions ?? [];
  const teamsFaq = teamsPrivacy?.knowledge_center_faq ?? [];
  const teamsVision = teamsPrivacy?.vision_phrases ?? [];
  const teamsLinks = teamsPrivacy?.integration_links ?? [];
  const teamsConsent = teamsPrivacy?.consent_summary;

  return (
    <div className="space-y-6">
      {integrationLinks.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {integrationLinks.slice(0, 6).map((link) =>
            link.route ? (
              <Link key={link.route} href={link.route} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
                {link.label ?? link.route}
              </Link>
            ) : null
          )}
        </div>
      )}

      <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        {dashboard.blueprint_mission ? (
          <p className="mt-2 text-sm font-medium text-violet-900">{dashboard.blueprint_mission}</p>
        ) : null}
        {dashboard.blueprint_philosophy ? (
          <p className="mt-2 text-sm text-violet-900">{dashboard.blueprint_philosophy}</p>
        ) : null}
        {dashboard.blueprint_abos_principle ? (
          <p className="mt-1 text-xs font-medium text-violet-800">{dashboard.blueprint_abos_principle}</p>
        ) : null}
        <p className="mt-2 text-xs text-violet-700">
          {dashboard.blueprint_distinction_note ?? labels.distinctionNote}
        </p>
        {blueprint?.phase ? (
          <p className="mt-2 text-xs text-violet-600">
            {blueprint.phase}
            {blueprint.engine_phase ? ` · ${blueprint.engine_phase}` : ""}
          </p>
        ) : null}
        {dashboard.meeting_companion_collaboration_note ? (
          <p className="mt-1 text-xs text-violet-600">{dashboard.meeting_companion_collaboration_note}</p>
        ) : null}
        {dashboard.blueprint_privacy_note ? (
          <p className="mt-2 text-xs text-violet-600">{dashboard.blueprint_privacy_note}</p>
        ) : null}
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

      {objectives.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.blueprintObjectives}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {objectives.map((obj) => (
              <li key={obj.key ?? obj.label} className="rounded border border-gray-100 p-2">
                <div className="font-medium">{obj.label}</div>
                {obj.description ? <p className="mt-1 text-xs text-gray-600">{obj.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {supportedPlatforms.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.supportedPlatforms}</h3>
          <ul className="mt-3 space-y-1 text-sm">
            {supportedPlatforms.map((platform) => (
              <li key={platform.key ?? platform.label}>
                {platform.label}
                {platform.status ? <span className="text-xs text-gray-500"> · {platform.status}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {teamsPrivacy && (
        <section className="rounded-xl border border-sky-200 bg-sky-50/50 p-6">
          <h3 className="text-sm font-semibold text-sky-900">{labels.teamsPrivacyTitle}</h3>
          <p className="mt-2 text-xs text-sky-800">{teamsPrivacy.distinction_note ?? labels.teamsPrivacyDistinction}</p>
          {teamsPrivacy.abos_principle ? (
            <p className="mt-2 text-sm font-medium text-sky-900">{teamsPrivacy.abos_principle}</p>
          ) : null}
          {typeof teamsPrivacy.pre_meeting_consent_prompt?.prompt === "string" ? (
            <blockquote className="mt-3 rounded border border-sky-200 bg-white p-3 text-sm italic text-sky-900">
              {teamsPrivacy.pre_meeting_consent_prompt.prompt}
            </blockquote>
          ) : null}
          {typeof teamsPrivacy.join_experience?.companion_name === "string" ? (
            <p className="mt-2 text-sm text-sky-800">
              {labels.teamsPrivacyJoinExperience}: {String(teamsPrivacy.join_experience.companion_name)}
            </p>
          ) : null}
          {teamsPrivacy.privacy_note ? (
            <p className="mt-2 text-xs text-sky-700">{teamsPrivacy.privacy_note}</p>
          ) : null}

          {teamsJoinOptions.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-sky-800">{labels.teamsPrivacyJoinOptions}</h4>
              <ul className="mt-2 space-y-1 text-sm">
                {teamsJoinOptions.map((opt) => (
                  <li key={opt.key ?? opt.label}>
                    <span className="font-medium">{opt.label}</span>
                    {opt.description ? <span className="text-xs text-sky-700"> — {opt.description}</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {teamsPermitted.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-sky-800">{labels.teamsPrivacyPermitted}</h4>
              <ul className="mt-2 list-inside list-disc text-sm text-sky-900">
                {teamsPermitted.map((cap) => (
                  <li key={cap.key ?? cap.label}>{cap.label}</li>
                ))}
              </ul>
            </div>
          )}

          {teamsProhibited.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-sky-800">{labels.teamsPrivacyProhibited}</h4>
              <ul className="mt-2 list-inside list-disc text-sm text-sky-900">
                {teamsProhibited.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {teamsSavePrefs.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-sky-800">{labels.teamsPrivacySavePreferences}</h4>
              <ul className="mt-2 space-y-1 text-sm">
                {teamsSavePrefs.map((pref) => (
                  <li key={pref.key ?? pref.label}>{pref.label}</li>
                ))}
              </ul>
            </div>
          )}

          {typeof teamsPrivacy.post_meeting_flow?.prompt === "string" && (
            <div className="mt-4">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-sky-800">{labels.teamsPrivacyPostMeeting}</h4>
              <blockquote className="mt-2 rounded border border-sky-200 bg-white p-3 text-sm italic text-sky-900">
                {teamsPrivacy.post_meeting_flow.prompt}
              </blockquote>
              {teamsPostOptions.length > 0 && (
                <ul className="mt-2 flex flex-wrap gap-2 text-xs">
                  {teamsPostOptions.map((opt) => (
                    <li key={opt.key ?? opt.label} className="rounded border border-sky-200 bg-white px-2 py-1">
                      {opt.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {teamsFaq.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-sky-800">{labels.teamsPrivacyFaq}</h4>
              <dl className="mt-2 space-y-3 text-sm">
                {teamsFaq.map((item) => (
                  <div key={item.question} className="rounded border border-sky-100 bg-white p-3">
                    <dt className="font-medium text-sky-900">{item.question}</dt>
                    {item.answer ? <dd className="mt-1 text-xs text-sky-800">{item.answer}</dd> : null}
                  </div>
                ))}
              </dl>
            </div>
          )}

          {teamsConsent && (
            <div className="mt-4">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-sky-800">{labels.teamsPrivacyConsentSummary}</h4>
              <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-sky-700">{labels.teamsPrivacyTotalMeetings}</dt>
                  <dd>{String(teamsConsent.total_meetings ?? 0)}</dd>
                </div>
                <div>
                  <dt className="text-sky-700">{labels.teamsPrivacyWithSummary}</dt>
                  <dd>{String(teamsConsent.meetings_with_summary_metadata ?? 0)}</dd>
                </div>
              </dl>
            </div>
          )}

          {teamsVision.length > 0 && (
            <ul className="mt-4 list-inside list-disc text-sm italic text-sky-800">
              {teamsVision.map((phrase) => (
                <li key={phrase}>{phrase}</li>
              ))}
            </ul>
          )}

          {teamsLinks.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {teamsLinks.map((link) =>
                link.route ? (
                  <Link key={link.route} href={link.route} className="rounded-lg border border-sky-200 px-3 py-1.5 text-xs">
                    {link.label ?? link.route}
                  </Link>
                ) : null
              )}
            </div>
          )}
        </section>
      )}

      {decisionExamples.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.decisionTracking}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {decisionExamples.map((ex) => (
              <li key={ex.key ?? ex.decision} className="rounded border border-gray-100 p-2">
                {ex.emoji ? `${ex.emoji} ` : ""}
                {ex.decision}
              </li>
            ))}
          </ul>
        </section>
      )}

      {companionInsights.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.companionInsights}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {companionInsights.map((insight) => (
              <li key={insight.key ?? insight.insight}>
                {insight.emoji ? `${insight.emoji} ` : ""}
                {insight.insight}
              </li>
            ))}
          </ul>
        </section>
      )}

      {continuityPatterns.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.meetingContinuity}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {continuityPatterns.map((pattern) => (
              <li key={pattern.key ?? pattern.pattern} className="rounded border border-gray-100 p-2">
                {pattern.example ?? pattern.pattern}
              </li>
            ))}
          </ul>
        </section>
      )}

      {dashboard.collaboration_health && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.collaborationHealth}</h3>
          <p className="mt-2 text-xs text-gray-600">
            {typeof dashboard.collaboration_health.principle === "string"
              ? dashboard.collaboration_health.principle
              : ""}
          </p>
        </section>
      )}

      {dashboard.blueprint_self_love_connection?.practices && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.selfLoveConnection}</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
            {dashboard.blueprint_self_love_connection.practices.map((practice) => (
              <li key={practice}>{practice}</li>
            ))}
          </ul>
        </section>
      )}

      {engagement && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.engagementSummary}</h3>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-gray-500">{labels.decisionsLogged30d}</dt>
              <dd>{String(engagement.decisions_logged_30d ?? 0)}</dd>
            </div>
            <div>
              <dt className="text-gray-500">{labels.overdueActions}</dt>
              <dd>{String(engagement.overdue_action_items ?? 0)}</dd>
            </div>
            <div>
              <dt className="text-gray-500">{labels.supportedPlatformsCount}</dt>
              <dd>{String(engagement.supported_platforms_count ?? 0)}</dd>
            </div>
          </dl>
        </section>
      )}

      {successCriteria.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.blueprintSuccessCriteria}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {successCriteria.map((criterion) => (
              <li key={criterion.key ?? criterion.label} className="flex flex-wrap items-start gap-2">
                <span
                  className={`rounded px-2 py-0.5 text-xs ${
                    criterion.met ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {criterion.met ? labels.criterionMet : labels.criterionPending}
                </span>
                <span>{criterion.label}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {visionPhrases.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.visionPhrases}</h3>
          <ul className="mt-2 list-inside list-disc text-sm italic text-gray-700">
            {visionPhrases.map((phrase) => (
              <li key={phrase}>{phrase}</li>
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
