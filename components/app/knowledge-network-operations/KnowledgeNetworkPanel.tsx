"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  WISDOM_STATUS_BADGES,
  parseKnowledgeNetworkCenter,
  type KnowledgeAsset,
  type KnowledgeLesson,
  type KnowledgeNetworkCenter,
  type KnowledgeNetworkLabels,
  type KnowledgeNetworkTab,
} from "@/lib/knowledge-network-operations";

type Props = {
  labels: KnowledgeNetworkLabels;
  backHref: string;
  initialTab?: KnowledgeNetworkTab;
  visibleTabs?: KnowledgeNetworkTab[];
  titleOverride?: string;
  subtitleOverride?: string;
};

function OverviewCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

const ALL_TABS: KnowledgeNetworkTab[] = [
  "overview",
  "knowledge_assets",
  "lessons_learned",
  "playbooks",
  "best_practices",
  "experience",
  "companion",
  "executive",
  "reports",
];

export function KnowledgeNetworkPanel({
  labels,
  backHref,
  initialTab = "overview",
  visibleTabs,
  titleOverride,
  subtitleOverride,
}: Props) {
  const tabs = visibleTabs ?? ALL_TABS;
  const [center, setCenter] = useState<KnowledgeNetworkCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<KnowledgeNetworkTab>(initialTab);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/knowledge-network-operations");
    if (res.ok) setCenter(parseKnowledgeNetworkCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  const runAction = useCallback(
    async (action_type: string, payload: Record<string, unknown> = {}) => {
      setBusy(true);
      try {
        const res = await fetch("/api/app/knowledge-network-operations/action", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action_type, payload }),
        });
        if (res.ok) await load();
      } finally {
        setBusy(false);
      }
    },
    [load]
  );

  if (loading && !center) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found) {
    return <p className="p-6 text-sm text-red-600">{labels.emptyState}</p>;
  }

  const overview = center.overview ?? {};
  const assets = center.knowledge_assets ?? [];
  const lessons = center.lessons_learned_engine ?? [];
  const playbooks = center.playbook_engine ?? [];
  const practices = center.best_practice_engine ?? [];
  const experience = center.experience_library ?? [];
  const decisions = center.decision_knowledge_base ?? [];
  const retention = center.knowledge_retention_engine ?? [];
  const meetings = center.meeting_intelligence ?? [];
  const companionSignals = center.companion_learning_engine ?? [];
  const departments = center.department_knowledge_centers ?? [];
  const packContrib = center.business_pack_integration ?? [];
  const recommendations = center.knowledge_recommendations ?? [];
  const advisorPrompts = (center.companion_advisor?.advisor_prompts as string[]) ?? [];
  const wisdomStatus = String(overview.wisdom_status ?? "strong_learning_culture");

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          ← {labels.back}
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            {titleOverride ?? labels.title}
          </h1>
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
              WISDOM_STATUS_BADGES[wisdomStatus] ?? WISDOM_STATUS_BADGES.strong_learning_culture
            }`}
          >
            {labels.wisdomStatuses[wisdomStatus] ?? wisdomStatus.replace(/_/g, " ")}
          </span>
        </div>
        <p className="mt-2 max-w-3xl text-zinc-600">{subtitleOverride ?? labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm text-zinc-800">
          {center.principle}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/app/knowledge-network/lessons"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          {labels.actions.openLessons}
        </Link>
        <Link
          href="/app/knowledge-network/experience"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
        >
          {labels.actions.openExperience}
        </Link>
        <Link
          href="/app/knowledge-graph"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
        >
          {labels.actions.openKnowledgeGraph}
        </Link>
        <button
          type="button"
          disabled={busy}
          onClick={() => void runAction("refresh_wisdom_score", { wisdom_score: 80 })}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 disabled:opacity-50"
        >
          {labels.actions.refreshWisdomScore}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              tab === key ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            {labels.tabs[key]}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <OverviewCard label={labels.overview.wisdomScore} value={overview.wisdom_score ?? 0} />
          <OverviewCard label={labels.overview.knowledgeAssets} value={overview.knowledge_assets ?? 0} />
          <OverviewCard label={labels.overview.lessonsLearned} value={overview.lessons_learned ?? 0} />
          <OverviewCard label={labels.overview.playbooks} value={overview.playbooks ?? 0} />
          <OverviewCard label={labels.overview.bestPractices} value={overview.best_practices ?? 0} />
          <OverviewCard label={labels.overview.experienceEntries} value={overview.experience_entries ?? 0} />
          <OverviewCard label={labels.overview.retentionPending} value={overview.retention_pending ?? 0} />
          <OverviewCard label={labels.overview.reviewsDue} value={overview.reviews_due ?? 0} />
        </dl>
      ) : null}

      {tab === "knowledge_assets" ? (
        <section className="space-y-4">
          {assets.map((asset: KnowledgeAsset) => (
            <div key={asset.id} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
              <p className="font-medium text-zinc-900">{asset.title}</p>
              <p className="text-xs text-zinc-500">
                {asset.asset_type} · {asset.department_label} · {asset.review_status}
              </p>
              <p className="mt-1 text-sm text-zinc-600">{asset.summary}</p>
              {asset.review_status === "review_due" && asset.asset_key ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void runAction("mark_reviewed", { asset_key: asset.asset_key })}
                  className="mt-3 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                >
                  {labels.actions.markReviewed}
                </button>
              ) : null}
            </div>
          ))}
        </section>
      ) : null}

      {tab === "lessons_learned" ? (
        <section className="space-y-4">
          {lessons.map((lesson: KnowledgeLesson) => (
            <div key={lesson.id} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
              <p className="font-medium text-zinc-900">{lesson.title}</p>
              <p className="text-xs text-zinc-500">{lesson.category} · {lesson.review_status}</p>
              <p className="mt-1 text-sm text-zinc-600">{lesson.outcome}</p>
              <p className="mt-1 text-sm text-indigo-700">{lesson.recommendation}</p>
            </div>
          ))}
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              void runAction("add_lesson", {
                title: "New organizational lesson",
                category: "operations",
                recommendation: "Document and share with the team.",
              })
            }
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {labels.actions.addLesson}
          </button>
        </section>
      ) : null}

      {tab === "playbooks" ? (
        <section className="space-y-4">
          {playbooks.map((pb) => (
            <div key={String(pb.id)} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
              <p className="font-medium text-zinc-900">{String(pb.title)}</p>
              <p className="text-xs text-zinc-500">
                {String(pb.playbook_type)} · {String(pb.status)} · used {String(pb.usage_count ?? 0)}×
              </p>
              <p className="mt-1 text-sm text-zinc-600">{String(pb.summary ?? "")}</p>
              {pb.status === "draft" && pb.playbook_key ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void runAction("publish_playbook", { playbook_key: String(pb.playbook_key) })}
                  className="mt-3 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                >
                  {labels.actions.publishPlaybook}
                </button>
              ) : null}
            </div>
          ))}
        </section>
      ) : null}

      {tab === "best_practices" ? (
        <section className="space-y-3">
          {practices.map((p) => (
            <div key={String(p.id)} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
              <p className="font-medium text-zinc-900">{String(p.title)}</p>
              <p className="text-zinc-500">{String(p.pattern_type)} · {String(p.confidence)} confidence</p>
              <p className="mt-1 text-zinc-600">{String(p.summary ?? "")}</p>
            </div>
          ))}
        </section>
      ) : null}

      {tab === "experience" ? (
        <section className="space-y-4">
          {experience.map((e) => (
            <div key={String(e.id)} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
              <p className="font-medium text-zinc-900">{String(e.title)}</p>
              <p className="text-zinc-500">{String(e.experience_type)} · {String(e.department_label)}</p>
              <p className="mt-1 text-zinc-600">{String(e.summary ?? "")}</p>
            </div>
          ))}
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              void runAction("contribute_experience", {
                title: "Shared organizational experience",
                experience_type: "success",
                summary: "Practical experience captured for the team.",
              })
            }
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {labels.actions.contributeExperience}
          </button>
        </section>
      ) : null}

      {tab === "companion" ? (
        <section className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <h2 className="font-semibold text-zinc-900">Companion Learning</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-600">
              {advisorPrompts.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          {companionSignals.map((s) => (
            <div key={String(s.id)} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
              <p className="font-medium text-zinc-900">{String(s.title)}</p>
              <p className="text-zinc-500">{String(s.signal_type)}</p>
              <p className="mt-1 text-zinc-600">{String(s.summary ?? "")}</p>
            </div>
          ))}
          {recommendations.map((r) => (
            <div key={String(r.id)} className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-sm">
              <p className="font-medium text-zinc-900">{String(r.title)}</p>
              <p className="text-zinc-500">{String(r.recommendation_type)} · {String(r.context_type)}</p>
            </div>
          ))}
        </section>
      ) : null}

      {tab === "executive" ? (
        <section className="space-y-4">
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(center.executive_dashboard ?? {}).map(([key, value]) => (
              <OverviewCard key={key} label={key.replace(/_/g, " ")} value={String(value)} />
            ))}
          </dl>
          {decisions.length ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-4">
              <h2 className="font-semibold text-zinc-900">Decision Knowledge Base</h2>
              <ul className="mt-2 space-y-2 text-sm text-zinc-600">
                {decisions.map((d) => (
                  <li key={String(d.id)}>
                    <span className="font-medium text-zinc-900">{String(d.title)}</span> — {String(d.future_recommendation ?? "")}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {retention.length ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-4">
              <h2 className="font-semibold text-zinc-900">Knowledge Retention</h2>
              {retention.map((r) => (
                <div key={String(r.id)} className="mt-2 text-sm">
                  <p className="font-medium text-zinc-900">{String(r.employee_label)} · {String(r.status)}</p>
                  <p className="text-zinc-600">{String(r.capture_summary ?? "")}</p>
                  {r.status === "pending" && r.retention_key ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        void runAction("start_retention_capture", { retention_key: String(r.retention_key) })
                      }
                      className="mt-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                    >
                      {labels.actions.startRetentionCapture}
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
          {departments.length ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-4">
              <h2 className="font-semibold text-zinc-900">Department Knowledge Centers</h2>
              <ul className="mt-2 grid gap-2 sm:grid-cols-2 text-sm text-zinc-600">
                {departments.map((d) => (
                  <li key={String(d.id)}>{String(d.department_label)} — {String(d.summary ?? "")}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {packContrib.length ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-4">
              <h2 className="font-semibold text-zinc-900">Business Pack Integration</h2>
              <ul className="mt-2 space-y-1 text-sm text-zinc-600">
                {packContrib.map((b) => (
                  <li key={String(b.id)}>{String(b.pack_label)} — {String(b.summary ?? "")}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {meetings.length ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
              <h2 className="font-semibold text-zinc-900">Meeting Intelligence</h2>
              {meetings.map((m) => (
                <p key={String(m.id)} className="mt-2">{String(m.title)} — {String(m.outcome_summary ?? "")}</p>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {tab === "reports" ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <pre className="overflow-x-auto whitespace-pre-wrap text-sm text-zinc-600">
            {JSON.stringify(center.reports ?? {}, null, 2)}
          </pre>
        </section>
      ) : null}

      {center.audit_recent?.length ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-zinc-900">Audit</h2>
          <ul className="mt-3 space-y-2 text-sm text-zinc-600">
            {center.audit_recent.map((entry, i) => (
              <li key={`${entry.event_type}-${i}`}>{entry.summary}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
