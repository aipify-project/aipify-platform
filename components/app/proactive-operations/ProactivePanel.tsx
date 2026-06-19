"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  ACTION_STATUS_BADGES,
  HEALTH_STATUS_BADGES,
  OBSERVATION_STATUS_BADGES,
  PRIORITY_BADGES,
  PROACTIVE_TABS,
  RECOMMENDATION_STATUS_BADGES,
  parseProactiveCenter,
  type ProactiveCenter,
  type ProactiveLabels,
  type ProactiveRecommendation,
  type ProactiveTab,
} from "@/lib/customer-proactive-operations";

type Props = {
  labels: ProactiveLabels;
  backHref: string;
  initialTab?: ProactiveTab;
  visibleTabs?: ProactiveTab[];
  titleOverride?: string;
};

function OverviewCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function JsonList({ items }: { items: Record<string, unknown>[] }) {
  if (!items.length) return <p className="text-sm text-zinc-500">—</p>;
  return (
    <>
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-sm">
          <p className="font-medium text-zinc-900">
            {String(
              item.observation_title ?? item.opportunity_title ?? item.action_title
                ?? item.recommendation_title ?? item.watchlist_title ?? item.pack_title
                ?? item.health_area ?? item.title ?? i
            )}
          </p>
          {(item.summary ?? item.impact_estimate) ? (
            <p className="mt-1 text-zinc-600">{String(item.summary ?? item.impact_estimate)}</p>
          ) : null}
          <div className="mt-2 flex flex-wrap gap-1">
            {item.observation_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${OBSERVATION_STATUS_BADGES[String(item.observation_status)] ?? OBSERVATION_STATUS_BADGES.informational}`}>
                {String(item.observation_status)}
              </span>
            ) : null}
            {item.health_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${HEALTH_STATUS_BADGES[String(item.health_status)] ?? HEALTH_STATUS_BADGES.healthy}`}>
                {String(item.health_status)}
              </span>
            ) : null}
            {item.priority ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${PRIORITY_BADGES[String(item.priority)] ?? PRIORITY_BADGES.moderate}`}>
                {String(item.priority)}
              </span>
            ) : null}
            {item.action_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${ACTION_STATUS_BADGES[String(item.action_status)] ?? ACTION_STATUS_BADGES.prepared}`}>
                {String(item.action_status)}
              </span>
            ) : null}
            {item.recommendation_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${RECOMMENDATION_STATUS_BADGES[String(item.recommendation_status)] ?? RECOMMENDATION_STATUS_BADGES.pending}`}>
                {String(item.recommendation_status)}
              </span>
            ) : null}
            {item.health_score != null ? (
              <span className="inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">{String(item.health_score)}</span>
            ) : null}
          </div>
        </div>
      ))}
    </>
  );
}

function RecommendationCard({ item, labels, busy, onApprove, onReject }: {
  item: ProactiveRecommendation; labels: ProactiveLabels; busy: boolean;
  onApprove: (key: string) => void; onReject: (key: string) => void;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <JsonList items={[item as unknown as Record<string, unknown>]} />
      {item.recommendation_status === "pending" ? (
        <div className="mt-3 flex gap-2">
          <button type="button" disabled={busy} onClick={() => onApprove(item.recommendation_key)}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
            {labels.actions.approveRecommendation}
          </button>
          <button type="button" disabled={busy} onClick={() => onReject(item.recommendation_key)}
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium disabled:opacity-50">
            {labels.actions.rejectRecommendation}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function ProactivePanel({ labels, backHref, initialTab = "overview", visibleTabs, titleOverride }: Props) {
  const tabs = visibleTabs ?? PROACTIVE_TABS;
  const [center, setCenter] = useState<ProactiveCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<ProactiveTab>(initialTab);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/proactive-operations");
    if (res.ok) setCenter(parseProactiveCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { setTab(initialTab); }, [initialTab]);

  const runAction = useCallback(async (action_type: string, payload: Record<string, unknown> = {}) => {
    setBusy(true);
    try {
      const res = await fetch("/api/app/proactive-operations/action", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action_type, ...payload }),
      });
      if (res.ok) await load();
    } finally { setBusy(false); }
  }, [load]);

  if (loading && !center) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <AipifyLoader centered /><span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found) return <p className="p-6 text-sm text-red-600">{labels.emptyState}</p>;

  const overview = center.overview ?? {};
  const advisorPrompts = (center.integrations?.observation_feed_prompts as string[]) ?? [];
  const recommendations = (center.reports?.companion_recommendations as Record<string, unknown>[]) ?? [];
  const insights = center.insights ?? {};
  const decisionPacks = (insights.decision_packs as Record<string, unknown>[]) ?? [];
  const pendingApprovals = center.approvals ?? center.recommendations?.filter((r) => r.recommendation_status === "pending") ?? [];

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">← {labels.back}</Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">{titleOverride ?? labels.title}</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm text-zinc-800">{center.principle}</p>
        {center.philosophy ? <p className="mt-3 text-sm text-zinc-600">{center.philosophy}</p> : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" disabled={busy} onClick={() => void runAction("refresh_proactive")}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
          {labels.actions.refreshProactive}
        </button>
        <Link href="/app/proactive/watchlists" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openWatchlists}</Link>
        <Link href="/app/approvals" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openApprovals}</Link>
        <Link href="/app/companion/teams" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openCompanionTeams}</Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((key) => (
          <button key={key} type="button" onClick={() => setTab(key)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${tab === key ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"}`}>
            {labels.tabs[key]}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <OverviewCard label={labels.overview.observationCount} value={Number(overview.observation_count ?? 0)} />
          <OverviewCard label={labels.overview.attentionRequired} value={Number(overview.attention_required ?? 0)} />
          <OverviewCard label={labels.overview.immediateReview} value={Number(overview.immediate_review ?? 0)} />
          <OverviewCard label={labels.overview.opportunitiesIdentified} value={Number(overview.opportunities_identified ?? 0)} />
          <OverviewCard label={labels.overview.preparedActionsReady} value={Number(overview.prepared_actions_ready ?? 0)} />
          <OverviewCard label={labels.overview.pendingRecommendations} value={Number(overview.pending_recommendations ?? 0)} />
          <OverviewCard label={labels.overview.watchlistsActive} value={Number(overview.watchlists_active ?? 0)} />
          <OverviewCard label={labels.overview.healthScore} value={Number(overview.health_score ?? 0)} />
          <OverviewCard label={labels.overview.decisionPacksReady} value={Number(overview.decision_packs_ready ?? 0)} />
        </dl>
      ) : null}

      {tab === "observations" ? (
        <section className="space-y-3">
          <button type="button" disabled={busy} onClick={() => void runAction("create_observation", { observation_title: "New Observation" })}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
            {labels.actions.createObservation}
          </button>
          <JsonList items={(center.observations ?? []) as unknown as Record<string, unknown>[]} />
        </section>
      ) : null}

      {tab === "recommendations" ? (
        <section className="space-y-3">
          {(center.recommendations ?? []).map((item) => (
            <RecommendationCard key={item.recommendation_key} item={item} labels={labels} busy={busy}
              onApprove={(key) => void runAction("approve_recommendation", { recommendation_key: key })}
              onReject={(key) => void runAction("reject_recommendation", { recommendation_key: key })} />
          ))}
        </section>
      ) : null}

      {tab === "prepared_actions" ? (
        <section className="space-y-3">
          <button type="button" disabled={busy} onClick={() => void runAction("generate_prepared_action", { action_title: "Prepared Action" })}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
            {labels.actions.generatePreparedAction}
          </button>
          <JsonList items={center.prepared_actions ?? []} />
        </section>
      ) : null}

      {tab === "approvals" ? (
        <section className="space-y-3">
          {pendingApprovals.map((item) => (
            <RecommendationCard key={item.recommendation_key} item={item} labels={labels} busy={busy}
              onApprove={(key) => void runAction("approve_recommendation", { recommendation_key: key })}
              onReject={(key) => void runAction("reject_recommendation", { recommendation_key: key })} />
          ))}
        </section>
      ) : null}

      {tab === "insights" ? (
        <section className="space-y-6">
          {(center.watchlists ?? []).length ? (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold text-zinc-900">{labels.watchlistsTitle}</h2>
                <button type="button" disabled={busy} onClick={() => void runAction("add_watchlist", { watchlist_title: "New Watchlist" })}
                  className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
                  {labels.actions.addWatchlist}
                </button>
              </div>
              <JsonList items={center.watchlists ?? []} />
            </div>
          ) : null}
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.observationFeed}</h2>
            <div className="mt-4"><JsonList items={(insights.observation_feed as Record<string, unknown>[]) ?? []} /></div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.decisionPacks}</h2>
            <div className="mt-4"><JsonList items={decisionPacks} /></div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.operationalHealth}</h2>
            <div className="mt-4"><JsonList items={center.operational_health ?? []} /></div>
          </div>
        </section>
      ) : null}

      {tab === "opportunities" ? (
        <section className="space-y-3">
          <button type="button" disabled={busy} onClick={() => void runAction("identify_opportunity", { opportunity_title: "New Opportunity" })}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
            {labels.actions.identifyOpportunity}
          </button>
          <JsonList items={center.opportunities ?? []} />
        </section>
      ) : null}

      {tab === "reports" ? (
        <section className="space-y-6">
          <JsonList items={recommendations} />
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.operationalHealth}</h2>
            <div className="mt-4"><JsonList items={(center.reports?.operational_health as Record<string, unknown>[]) ?? center.operational_health ?? []} /></div>
          </div>
        </section>
      ) : null}

      {center.executive_dashboard ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(center.executive_dashboard).map(([key, value]) => (
            <OverviewCard key={key} label={key.replace(/_/g, " ")} value={String(value)} />
          ))}
        </section>
      ) : null}

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-zinc-900">{labels.sections.companionAdvisor}</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-600">
          {advisorPrompts.map((p) => <li key={p}>{p}</li>)}
        </ul>
      </div>

      {(center.audit_recent ?? []).length ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-zinc-900">{labels.sections.audit}</h2>
          <ul className="mt-4 space-y-2 text-sm text-zinc-600">
            {(center.audit_recent ?? []).map((entry, i) => (
              <li key={i}>{entry.summary || entry.event_type}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
