"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseGratitudeRecognitionDashboard,
  type BoundaryPhrases,
  type GratitudeMoment,
  type GratitudeMomentTypeInfo,
  type GratitudeRecognitionDashboard,
  type RedRoseMoment,
} from "@/lib/aipify/gratitude-recognition-engine";

type Props = { labels: Record<string, string> };

function momentTypeBadgeClass(momentType?: string) {
  switch (momentType) {
    case "exceptional_support":
      return "bg-sky-100 text-sky-800";
    case "milestone":
      return "bg-violet-100 text-violet-800";
    case "customer_appreciation":
      return "bg-emerald-100 text-emerald-800";
    case "consistent_helper":
      return "bg-amber-100 text-amber-800";
    case "above_and_beyond":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function statusBadgeClass(status?: string) {
  switch (status) {
    case "celebrated":
      return "bg-emerald-100 text-emerald-800";
    case "acknowledged":
      return "bg-sky-100 text-sky-800";
    case "pending":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export function GratitudeRecognitionEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<GratitudeRecognitionDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [sendingRose, setSendingRose] = useState(false);
  const [roseSent, setRoseSent] = useState(false);
  const [digitalRoseEnabled, setDigitalRoseEnabled] = useState(true);
  const [gratitudeMomentsEnabled, setGratitudeMomentsEnabled] = useState(true);
  const [redirectRomantic, setRedirectRomantic] = useState(true);
  const [recipientLabel, setRecipientLabel] = useState("");
  const [messageSummary, setMessageSummary] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/gratitude-recognition-engine/dashboard");
    if (res.ok) {
      const parsed = parseGratitudeRecognitionDashboard(await res.json());
      setDashboard(parsed);
      if (typeof parsed.settings?.digital_rose_enabled === "boolean") {
        setDigitalRoseEnabled(parsed.settings.digital_rose_enabled);
      }
      if (typeof parsed.settings?.gratitude_moments_enabled === "boolean") {
        setGratitudeMomentsEnabled(parsed.settings.gratitude_moments_enabled);
      }
      if (typeof parsed.settings?.redirect_romantic_language === "boolean") {
        setRedirectRomantic(parsed.settings.redirect_romantic_language);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveSettings() {
    setSavingSettings(true);
    setActionError(null);
    const res = await fetch("/api/aipify/gratitude-recognition-engine/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        digital_rose_enabled: digitalRoseEnabled,
        gratitude_moments_enabled: gratitudeMomentsEnabled,
        redirect_romantic_language: redirectRomantic,
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.settingsFailed);
    } else {
      await load();
    }
    setSavingSettings(false);
  }

  async function exportReport() {
    setExporting(true);
    setActionError(null);
    const res = await fetch("/api/aipify/gratitude-recognition-engine/export", {
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

  async function sendRose() {
    setSendingRose(true);
    setActionError(null);
    setRoseSent(false);
    const res = await fetch("/api/aipify/gratitude-recognition-engine/rose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient_label: recipientLabel,
        message_summary: messageSummary,
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.roseFailed);
    } else {
      setRoseSent(true);
      setRecipientLabel("");
      setMessageSummary("");
      await load();
    }
    setSendingRose(false);
  }

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const permissions = dashboard.permissions ?? {};
  const canManage = Boolean(permissions.can_manage);
  const canExport = Boolean(permissions.can_export);
  const canSendRose = Boolean(permissions.can_send_rose);
  const recentMoments = dashboard.recent_moments ?? [];
  const momentTypes = dashboard.gratitude_moment_types ?? [];
  const redRose = dashboard.red_rose_moment;
  const boundaryPhrases = dashboard.boundary_phrases;
  const recentRoses = dashboard.recent_roses ?? {};
  const integrationLinks = dashboard.integration_links ?? {};

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-rose-200 bg-rose-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        {dashboard.mission ? <p className="mt-2 text-xs text-rose-800">{dashboard.mission}</p> : null}
        {dashboard.abos_principle ? (
          <p className="mt-1 text-xs font-medium text-rose-900">{dashboard.abos_principle}</p>
        ) : null}
        {dashboard.vision ? <p className="mt-1 text-xs italic text-rose-700">{dashboard.vision}</p> : null}
        <p className="mt-2 text-xs text-rose-700">{dashboard.distinction_note ?? labels.distinctionNote}</p>
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}
      {roseSent ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          {labels.roseSent}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {canExport ? (
          <button
            type="button"
            className="rounded border border-rose-300 px-3 py-1 text-xs text-rose-800 disabled:opacity-50"
            disabled={exporting}
            onClick={() => void exportReport()}
          >
            {exporting ? labels.exporting : labels.exportReport}
          </button>
        ) : null}
      </div>

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.summary}</h3>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-gray-500">{labels.momentCount}</dt>
            <dd>{String(summary.moment_count ?? 0)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">{labels.roseCount}</dt>
            <dd>{String(summary.rose_count ?? recentRoses.count ?? 0)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">{labels.digitalRoseEnabled}</dt>
            <dd>{summary.digital_rose_enabled ? labels.yes : labels.no}</dd>
          </div>
          <div>
            <dt className="text-gray-500">{labels.gratitudeMomentsEnabled}</dt>
            <dd>{summary.gratitude_moments_enabled ? labels.yes : labels.no}</dd>
          </div>
        </dl>
      </section>

      {momentTypes.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.gratitudeMomentTypes}</h3>
          <ul className="mt-3 space-y-3 text-sm">
            {(momentTypes as GratitudeMomentTypeInfo[]).map((mt) => (
              <li key={mt.key ?? mt.label} className="rounded border border-rose-100 bg-rose-50/30 p-3">
                <div className="font-medium">{mt.label}</div>
                {mt.description ? <p className="mt-1 text-xs text-gray-600">{mt.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {redRose && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.redRoseMoment}</h3>
          {redRose.feature_description ? (
            <p className="mt-2 text-xs text-gray-600">{redRose.feature_description}</p>
          ) : null}
          {redRose.digital_rose_symbol ? (
            <p className="mt-2 text-xs text-rose-700">{redRose.digital_rose_symbol}</p>
          ) : null}
          {Array.isArray(redRose.example_exchange) && redRose.example_exchange.length > 0 ? (
            <ul className="mt-3 space-y-2 text-sm">
              {(redRose as RedRoseMoment).example_exchange!.map((line, i) => (
                <li
                  key={i}
                  className={`rounded border px-3 py-2 text-xs ${
                    line.role === "user" ? "border-gray-200 bg-gray-50" : "border-rose-100 bg-rose-50/40"
                  }`}
                >
                  <span className="font-medium capitalize">{line.role}: </span>
                  {line.text}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      )}

      {boundaryPhrases && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.boundaryPhrases}</h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 text-xs">
            <div>
              <h4 className="font-semibold text-red-700">{labels.avoidPhrases}</h4>
              <ul className="mt-2 list-inside list-disc text-gray-600">
                {((boundaryPhrases as BoundaryPhrases).avoid ?? []).map((p, i) => (
                  <li key={i}>{String(p)}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-emerald-700">{labels.preferPhrases}</h4>
              <ul className="mt-2 list-inside list-disc text-gray-600">
                {((boundaryPhrases as BoundaryPhrases).prefer ?? []).map((p, i) => (
                  <li key={i}>{String(p)}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {recentMoments.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.recentMoments}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {(recentMoments as GratitudeMoment[]).map((moment) => (
              <li key={moment.id} className="rounded border border-gray-100 p-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs capitalize ${momentTypeBadgeClass(moment.moment_type)}`}
                  >
                    {moment.moment_type?.replace(/_/g, " ")}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs capitalize ${statusBadgeClass(moment.status)}`}
                  >
                    {moment.status}
                  </span>
                  {moment.recognition_target_role ? (
                    <span className="text-xs text-gray-500">
                      → {moment.recognition_target_role.replace(/_/g, " ")}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-xs text-gray-700">{moment.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(dashboard.self_love_note || dashboard.trust_note) && (
        <section className="rounded-lg border border-gray-200 p-4 text-xs text-gray-600">
          {dashboard.self_love_note ? (
            <div>
              <h4 className="font-semibold text-gray-700">{labels.selfLoveNote}</h4>
              <p className="mt-1">{dashboard.self_love_note}</p>
            </div>
          ) : null}
          {dashboard.trust_note ? (
            <div className="mt-3">
              <h4 className="font-semibold text-gray-700">{labels.trustNote}</h4>
              <p className="mt-1">{dashboard.trust_note}</p>
            </div>
          ) : null}
        </section>
      )}

      {canSendRose && digitalRoseEnabled ? (
        <section className="rounded-lg border border-rose-200 bg-rose-50/30 p-4">
          <h3 className="text-sm font-semibold">{labels.sendDigitalRose}</h3>
          <p className="mt-1 text-xs text-gray-600">{labels.sendDigitalRoseHint}</p>
          <div className="mt-3 space-y-3">
            <label className="flex flex-col gap-1 text-sm">
              <span>{labels.recipientLabel}</span>
              <input
                type="text"
                value={recipientLabel}
                onChange={(e) => setRecipientLabel(e.target.value)}
                maxLength={120}
                className="rounded border border-gray-200 px-2 py-1 text-sm"
                placeholder={labels.recipientPlaceholder}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span>{labels.messageSummary}</span>
              <textarea
                value={messageSummary}
                onChange={(e) => setMessageSummary(e.target.value)}
                maxLength={500}
                rows={3}
                className="rounded border border-gray-200 px-2 py-1 text-sm"
                placeholder={labels.messagePlaceholder}
              />
            </label>
            <button
              type="button"
              disabled={sendingRose || !recipientLabel.trim() || !messageSummary.trim()}
              onClick={() => void sendRose()}
              className="rounded border border-rose-300 px-3 py-1 text-xs text-rose-800 disabled:opacity-50"
            >
              {sendingRose ? labels.sendingRose : labels.sendRose}
            </button>
          </div>
        </section>
      ) : null}

      {canManage ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.gratitudeSettings}</h3>
          <div className="mt-3 space-y-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={digitalRoseEnabled}
                onChange={(e) => setDigitalRoseEnabled(e.target.checked)}
              />
              {labels.digitalRoseToggle}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={gratitudeMomentsEnabled}
                onChange={(e) => setGratitudeMomentsEnabled(e.target.checked)}
              />
              {labels.gratitudeMomentsToggle}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={redirectRomantic}
                onChange={(e) => setRedirectRomantic(e.target.checked)}
              />
              {labels.redirectRomanticToggle}
            </label>
            <button
              type="button"
              disabled={savingSettings}
              onClick={() => void saveSettings()}
              className="rounded border border-rose-300 px-3 py-1 text-xs text-rose-800 disabled:opacity-50"
            >
              {savingSettings ? labels.saving : labels.saveSettings}
            </button>
          </div>
        </section>
      ) : null}

      {Object.keys(integrationLinks).length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.integrationLinks}</h3>
          <ul className="mt-2 flex flex-wrap gap-2 text-xs">
            {Object.entries(integrationLinks).map(([key, href]) =>
              typeof href === "string" ? (
                <li key={key}>
                  <Link href={href} className="text-rose-700 underline">
                    {key.replace(/_/g, " ")}
                  </Link>
                </li>
              ) : null
            )}
          </ul>
        </section>
      )}
    </div>
  );
}
