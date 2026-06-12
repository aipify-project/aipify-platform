"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseLegacyEngineDashboard,
  type LegacyDimensionInfo,
  type LegacyEngineDashboard,
  type LegacyMilestone,
  type LegacyMilestoneExample,
  type LegacyStory,
  type LegacyStorytellingExample,
} from "@/lib/aipify/legacy-engine";

type Props = { labels: Record<string, string> };

function dimensionBadgeClass(dimension?: string) {
  switch (dimension) {
    case "knowledge":
      return "bg-amber-100 text-amber-800";
    case "people":
      return "bg-rose-100 text-rose-800";
    case "customer":
      return "bg-violet-100 text-violet-800";
    case "innovation":
      return "bg-emerald-100 text-emerald-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export function LegacyEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<LegacyEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [acknowledging, setAcknowledging] = useState<string | null>(null);
  const [celebrateMilestones, setCelebrateMilestones] = useState(true);
  const [preserveStories, setPreserveStories] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/legacy-engine/dashboard");
    if (res.ok) {
      const parsed = parseLegacyEngineDashboard(await res.json());
      setDashboard(parsed);
      if (typeof parsed.settings?.celebrate_milestones === "boolean") {
        setCelebrateMilestones(parsed.settings.celebrate_milestones);
      }
      if (typeof parsed.settings?.preserve_stories === "boolean") {
        setPreserveStories(parsed.settings.preserve_stories);
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
    const res = await fetch("/api/aipify/legacy-engine/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        celebrate_milestones: celebrateMilestones,
        preserve_stories: preserveStories,
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

  async function acknowledgeMilestone(milestoneId: string) {
    setAcknowledging(milestoneId);
    setActionError(null);
    const res = await fetch("/api/aipify/legacy-engine/milestones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ milestone_id: milestoneId }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.acknowledgeFailed);
    } else {
      await load();
    }
    setAcknowledging(null);
  }

  async function exportReport() {
    setExporting(true);
    setActionError(null);
    const res = await fetch("/api/aipify/legacy-engine/export", {
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
  const permissions = dashboard.permissions ?? {};
  const canManage = Boolean(permissions.can_manage);
  const canExport = Boolean(permissions.can_export);
  const canAcknowledge = Boolean(permissions.can_acknowledge_milestones);
  const recentStories = dashboard.recent_stories ?? [];
  const recentMilestones = dashboard.recent_milestones ?? [];
  const integrationLinks = dashboard.integration_links ?? {};
  const dimensions = dashboard.legacy_dimensions ?? [];
  const storytellingExamples = dashboard.storytelling_examples ?? [];
  const milestoneExamples = dashboard.milestone_examples ?? [];

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        {dashboard.mission ? <p className="mt-2 text-xs text-indigo-800">{dashboard.mission}</p> : null}
        {dashboard.abos_principle ? (
          <p className="mt-1 text-xs font-medium text-indigo-900">{dashboard.abos_principle}</p>
        ) : null}
        {dashboard.vision ? <p className="mt-1 text-xs italic text-indigo-700">{dashboard.vision}</p> : null}
        <p className="mt-2 text-xs text-indigo-700">{dashboard.distinction_note ?? labels.distinctionNote}</p>
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      <div className="flex flex-wrap gap-2">
        {canExport ? (
          <button
            type="button"
            className="rounded border border-indigo-300 px-3 py-1 text-xs text-indigo-800 disabled:opacity-50"
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
            <dt className="text-gray-500">{labels.storyCount}</dt>
            <dd>{String(summary.story_count ?? 0)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">{labels.milestoneCount}</dt>
            <dd>{String(summary.milestone_count ?? 0)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">{labels.uncelebratedMilestones}</dt>
            <dd>{String(summary.uncelebrated_milestones ?? 0)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">{labels.celebrateMilestones}</dt>
            <dd>{summary.celebrate_milestones ? labels.yes : labels.no}</dd>
          </div>
        </dl>
      </section>

      {dimensions.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.legacyDimensions}</h3>
          <ul className="mt-3 space-y-3 text-sm">
            {(dimensions as LegacyDimensionInfo[]).map((dim) => (
              <li key={dim.key ?? dim.label} className="rounded border border-indigo-100 bg-indigo-50/30 p-3">
                <div className="font-medium">{dim.label}</div>
                {Array.isArray(dim.bullets) && dim.bullets.length > 0 ? (
                  <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
                    {dim.bullets.map((b, i) => (
                      <li key={i}>{String(b)}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {storytellingExamples.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.storytellingExamples}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {(storytellingExamples as LegacyStorytellingExample[]).map((ex) => (
              <li key={ex.key ?? ex.label} className="rounded border border-gray-100 p-2">
                <div className="font-medium">{ex.label}</div>
                {ex.example ? <p className="mt-1 text-xs text-gray-600">{ex.example}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {recentStories.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.recentStories}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {(recentStories as LegacyStory[]).map((story) => (
              <li key={story.id} className="rounded border border-gray-100 p-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs capitalize ${dimensionBadgeClass(story.dimension)}`}
                  >
                    {story.dimension?.replace(/_/g, " ")}
                  </span>
                  {story.timeline_ref ? (
                    <span className="text-xs text-gray-500">{story.timeline_ref}</span>
                  ) : null}
                </div>
                <p className="mt-1 font-medium text-xs text-gray-800">{story.title}</p>
                <p className="mt-1 text-xs text-gray-600">{story.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {recentMilestones.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.recentMilestones}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {(recentMilestones as LegacyMilestone[]).map((milestone) => (
              <li key={milestone.id} className="rounded border border-gray-100 p-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-medium capitalize text-gray-700">
                    {milestone.milestone_key?.replace(/_/g, " ")}
                  </span>
                  {milestone.celebrated ? (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800">
                      {labels.celebrated}
                    </span>
                  ) : canAcknowledge ? (
                    <button
                      type="button"
                      className="rounded border border-indigo-300 px-2 py-0.5 text-xs text-indigo-800 disabled:opacity-50"
                      disabled={acknowledging === milestone.id}
                      onClick={() => milestone.id && void acknowledgeMilestone(milestone.id)}
                    >
                      {acknowledging === milestone.id ? labels.acknowledging : labels.acknowledgeMilestone}
                    </button>
                  ) : null}
                </div>
                <p className="mt-1 text-xs text-gray-600">{milestone.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {milestoneExamples.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.milestoneExamples}</h3>
          <ul className="mt-2 space-y-1 text-sm text-gray-700">
            {(milestoneExamples as LegacyMilestoneExample[]).map((ex) => (
              <li key={ex.key} className="rounded border border-indigo-50 px-2 py-1 text-xs">
                {ex.bell_text}
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

      {canManage ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.legacySettings}</h3>
          <div className="mt-3 space-y-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={celebrateMilestones}
                onChange={(e) => setCelebrateMilestones(e.target.checked)}
              />
              {labels.celebrateMilestonesToggle}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={preserveStories}
                onChange={(e) => setPreserveStories(e.target.checked)}
              />
              {labels.preserveStoriesToggle}
            </label>
            <button
              type="button"
              disabled={savingSettings}
              onClick={() => void saveSettings()}
              className="rounded border border-indigo-300 px-3 py-1 text-xs text-indigo-800 disabled:opacity-50"
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
                  <Link href={href} className="text-indigo-700 underline">
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
