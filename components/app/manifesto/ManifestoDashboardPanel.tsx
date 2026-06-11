"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseManifestoDashboard,
  type ManifestoDashboard,
} from "@/lib/aipify/manifesto";

type ManifestoDashboardPanelProps = {
  labels: Record<string, string>;
};

function statusClass(status?: string) {
  switch (status) {
    case "completed":
    case "published":
    case "active":
      return "bg-emerald-100 text-emerald-800";
    case "in_progress":
      return "bg-amber-100 text-amber-800";
    case "scheduled":
    case "draft":
      return "bg-blue-100 text-blue-800";
    case "deferred":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function categoryClass(category?: string) {
  switch (category) {
    case "belief":
      return "border-indigo-200 bg-indigo-50/40";
    case "aspiration":
      return "border-violet-200 bg-violet-50/40";
    case "philosophy":
      return "border-sky-200 bg-sky-50/40";
    case "view":
      return "border-teal-200 bg-teal-50/40";
    default:
      return "border-stone-200 bg-white";
  }
}

export function ManifestoDashboardPanel({ labels }: ManifestoDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<ManifestoDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/manifesto/dashboard");
    if (res.ok) setDashboard(parseManifestoDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const generateBriefing = async () => {
    await fetch("/api/aipify/manifesto/briefings/generate", { method: "POST" });
    await load();
  };

  const acknowledgeTheme = async (themeId: string) => {
    setActing(`ack-${themeId}`);
    await fetch(`/api/aipify/manifesto/themes/${themeId}/acknowledge`, { method: "POST" });
    setActing(null);
    await load();
  };

  const completeUpdate = async (updateId: string) => {
    setActing(`update-${updateId}`);
    await fetch(`/api/aipify/manifesto/updates/${updateId}/complete`, { method: "POST" });
    setActing(null);
    await load();
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  const beliefThemes = dashboard.strategic_themes.filter((t) => t.category === "belief");
  const otherThemes = dashboard.strategic_themes.filter((t) => t.category !== "belief");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/constitution" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.constitution}
        </Link>
        <Link href="/app/academy" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.academy}
        </Link>
        <Link href="/app/knowledge-center" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.knowledgeCenter}
        </Link>
      </div>

      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold text-indigo-900">{labels.visionAlignment}</h2>
        <p className="mt-2 text-4xl font-bold text-indigo-800">
          {dashboard.manifesto_score ?? 0}
          <span className="text-lg font-normal text-gray-500">/100</span>
        </p>
        <p className="mt-1 text-sm font-medium text-indigo-700">
          v{dashboard.current_version} · {dashboard.themes_acknowledged ?? 0}/{dashboard.themes_count ?? 0}{" "}
          {labels.themesAcknowledged} · {dashboard.vision_alignment_score ?? 0}% {labels.alignment}
        </p>
        <p className="mt-2 text-sm text-indigo-800">{dashboard.philosophy}</p>
        {dashboard.founding_belief ? (
          <p className="mt-2 text-xs italic text-indigo-700">{dashboard.founding_belief}</p>
        ) : null}
        {dashboard.aipify_promise ? (
          <p className="mt-2 rounded-lg border border-indigo-100 bg-white/60 px-3 py-2 text-xs text-indigo-800">
            {dashboard.aipify_promise}
          </p>
        ) : null}
        <p className="mt-1 text-xs text-indigo-700">{dashboard.safety_note}</p>
        <button
          type="button"
          onClick={() => void generateBriefing()}
          className="mt-4 rounded-md bg-indigo-700 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-800"
        >
          {labels.generateBriefing}
        </button>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: labels.strategicThemes, value: dashboard.themes_count ?? 0 },
          { label: labels.themesAcknowledged, value: dashboard.themes_acknowledged ?? 0 },
          { label: labels.alignment, value: `${dashboard.vision_alignment_score ?? 0}%` },
          { label: labels.publications, value: dashboard.publications_count ?? 0 },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <p className="text-xs text-gray-500">{m.label}</p>
            <p className="text-lg font-semibold text-gray-900">{m.value}</p>
          </div>
        ))}
      </section>

      {dashboard.founding_statements.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.foundingStatements}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.founding_statements.map((statement) => (
              <article key={statement.id} className="rounded-lg border border-indigo-100 bg-white p-4 shadow-sm">
                <p className="font-medium text-indigo-900">{statement.title}</p>
                <p className="mt-2 text-xs text-gray-600">{statement.content}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {beliefThemes.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.manifestoBeliefs}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {beliefThemes.map((theme) => (
              <article key={theme.id} className={`rounded-lg border p-4 shadow-sm ${categoryClass(theme.category)}`}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <span className="text-xs font-semibold text-indigo-800">
                    {labels.belief} {theme.theme_number}
                  </span>
                  {theme.acknowledged ? (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                      {labels.acknowledged}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 font-medium text-gray-900">{theme.title}</p>
                <p className="mt-1 text-xs text-gray-600">{theme.description}</p>
                {!theme.acknowledged ? (
                  <button
                    type="button"
                    disabled={acting === `ack-${theme.id}`}
                    onClick={() => void acknowledgeTheme(theme.id)}
                    className="mt-3 rounded-md bg-indigo-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-800 disabled:opacity-50"
                  >
                    {labels.acknowledgeTheme}
                  </button>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {otherThemes.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.visionPerspectives}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {otherThemes.map((theme) => (
              <article key={theme.id} className={`rounded-lg border p-4 ${categoryClass(theme.category)}`}>
                <p className="text-xs capitalize text-gray-500">{theme.category}</p>
                <p className="mt-1 font-medium text-gray-900">{theme.title}</p>
                <p className="mt-1 text-xs text-gray-600">{theme.description}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.organizational_commitments.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.organizationalCommitments}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.organizational_commitments.map((c) => (
              <li key={c.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                <span className="font-medium text-gray-900">{c.title}</span>
                <span className="ml-2 text-xs capitalize text-gray-500">{c.commitment_type?.replace(/_/g, " ")}</span>
                <p className="mt-1 text-xs text-gray-600">{c.description}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.vision_updates.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.visionUpdates}</h2>
          <div className="mt-3 space-y-2">
            {dashboard.vision_updates.map((update) => (
              <article key={update.id} className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{update.title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusClass(update.status)}`}>
                    {update.status?.replace(/_/g, " ")}
                  </span>
                </div>
                {update.summary ? <p className="mt-1 text-xs text-gray-600">{update.summary}</p> : null}
                {update.alignment_score != null ? (
                  <p className="mt-2 text-xs text-emerald-700">{update.alignment_score}% {labels.alignment}</p>
                ) : null}
                {update.status === "scheduled" || update.status === "in_progress" ? (
                  <button
                    type="button"
                    disabled={acting === `update-${update.id}`}
                    onClick={() => void completeUpdate(update.id)}
                    className="mt-2 text-xs text-indigo-800 underline hover:text-indigo-900 disabled:opacity-50"
                  >
                    {labels.completeUpdate}
                  </button>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.vision_publications.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.visionPublications}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {dashboard.vision_publications.map((pub) => (
              <article key={pub.id} className="rounded-lg border border-violet-100 bg-violet-50/30 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-violet-900">{pub.title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusClass(pub.status)}`}>
                    {pub.status}
                  </span>
                </div>
                <p className="mt-1 text-xs capitalize text-violet-700">{pub.audience}</p>
                <p className="mt-2 text-xs text-violet-800">{pub.summary}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.target_audiences && dashboard.target_audiences.length > 0 ? (
        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-sm font-semibold text-slate-900">{labels.targetAudiences}</h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {dashboard.target_audiences.map((audience) => (
              <li key={audience} className="rounded-full bg-white px-3 py-1 text-xs text-slate-700 ring-1 ring-slate-200">
                {audience}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.briefings.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.recentBriefings}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.briefings.map((b) => (
              <li key={b.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                {b.summary}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
