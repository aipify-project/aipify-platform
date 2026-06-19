"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  DECISION_MEMORY_TABS,
  DECISION_STATUS_BADGES,
  HEALTH_STATUS_BADGES,
  PATTERN_TYPE_BADGES,
  REVIEW_STATUS_BADGES,
  SUCCESS_LEVEL_BADGES,
  parseDecisionMemoryCenter,
  type DecisionMemoryCenter,
  type DecisionMemoryLabels,
  type DecisionMemoryTab,
} from "@/lib/customer-decision-memory-operations";

type Props = {
  labels: DecisionMemoryLabels;
  backHref: string;
  initialTab?: DecisionMemoryTab;
};

function OverviewCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function ItemList({ items }: { items: Record<string, unknown>[] }) {
  if (!items.length) return <p className="text-sm text-zinc-500">—</p>;
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={String(item.decision_key ?? item.outcome_key ?? item.review_key ?? item.pattern_key ?? item.pack_key ?? i)} className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-sm">
          <p className="font-medium text-zinc-900">
            {String(
              item.decision_title ?? item.decision_id ?? item.lessons_learned
                ?? item.pattern_title ?? item.pack_title ?? item.title ?? i
            )}
          </p>
          {item.summary ? <p className="mt-1 text-zinc-600">{String(item.summary)}</p> : null}
          {item.lessons_learned && item.summary !== item.lessons_learned ? (
            <p className="mt-1 text-indigo-700">{String(item.lessons_learned)}</p>
          ) : null}
          {item.owner_name ? <p className="mt-1 text-zinc-500">{String(item.owner_name)}</p> : null}
          <div className="mt-2 flex flex-wrap gap-1">
            {item.decision_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${DECISION_STATUS_BADGES[String(item.decision_status)] ?? DECISION_STATUS_BADGES.pending}`}>
                {String(item.decision_status)}
              </span>
            ) : null}
            {item.outcome_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${SUCCESS_LEVEL_BADGES[String(item.outcome_status)] ?? SUCCESS_LEVEL_BADGES.pending}`}>
                {String(item.outcome_status)}
              </span>
            ) : null}
            {item.success_level ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${SUCCESS_LEVEL_BADGES[String(item.success_level)] ?? SUCCESS_LEVEL_BADGES.pending}`}>
                {String(item.success_level)}
              </span>
            ) : null}
            {item.review_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${REVIEW_STATUS_BADGES[String(item.review_status)] ?? REVIEW_STATUS_BADGES.scheduled}`}>
                {String(item.review_status)}
              </span>
            ) : null}
            {item.pattern_type ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${PATTERN_TYPE_BADGES[String(item.pattern_type)] ?? PATTERN_TYPE_BADGES.risk_pattern}`}>
                {String(item.pattern_type)}
              </span>
            ) : null}
            {item.decision_category ? (
              <span className="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700">{String(item.decision_category)}</span>
            ) : null}
            {item.decision_id ? (
              <span className="inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">{String(item.decision_id)}</span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export function DecisionMemoryPanel({ labels, backHref, initialTab = "overview" }: Props) {
  const [center, setCenter] = useState<DecisionMemoryCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<DecisionMemoryTab>(initialTab);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/decision-memory-operations");
    if (res.ok) setCenter(parseDecisionMemoryCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const runAction = useCallback(async (action_type: string, payload: Record<string, unknown> = {}) => {
    setBusy(true);
    try {
      const res = await fetch("/api/app/decision-memory-operations/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
  const health = center.decision_health ?? {};
  const knowledge = center.knowledge_base ?? {};
  const briefings = center.executive_briefings ?? {};
  const companion = center.companion ?? {};
  const advisorPrompts = (companion.decision_advisor_prompts as string[]) ?? [];
  const recommendations = (briefings.companion_recommendations as Record<string, unknown>[]) ?? [];
  const healthStatus = String(overview.health_status ?? "needs_review");

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">← {labels.back}</Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm text-zinc-800">{center.principle}</p>
        {center.philosophy ? <p className="mt-3 text-sm text-zinc-600">{center.philosophy}</p> : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" disabled={busy} onClick={() => void runAction("refresh_decisions")}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
          {labels.actions.refreshDecisions}
        </button>
        <button type="button" disabled={busy} onClick={() => void runAction("generate_briefing")}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 disabled:opacity-50">
          {labels.actions.generateBriefing}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {DECISION_MEMORY_TABS.map((key) => (
          <button key={key} type="button" onClick={() => setTab(key)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${tab === key ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"}`}>
            {labels.tabs[key]}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ring-1 ${HEALTH_STATUS_BADGES[healthStatus] ?? HEALTH_STATUS_BADGES.needs_review}`}>
              {labels.healthStatus[healthStatus as keyof typeof labels.healthStatus] ?? healthStatus}
            </span>
            <span className="text-sm text-zinc-600">{labels.overview.healthScore}: {Number(overview.health_score ?? 0)}</span>
          </div>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <OverviewCard label={labels.overview.totalDecisions} value={Number(overview.total_decisions ?? 0)} />
            <OverviewCard label={labels.overview.pendingDecisions} value={Number(overview.pending_decisions ?? 0)} />
            <OverviewCard label={labels.overview.pendingApprovals} value={Number(overview.pending_approvals ?? 0)} />
            <OverviewCard label={labels.overview.reviewsDue} value={Number(overview.reviews_due ?? 0)} />
            <OverviewCard label={labels.overview.patternsActive} value={Number(overview.patterns_active ?? 0)} />
            <OverviewCard label={labels.overview.successfulOutcomes} value={Number(overview.successful_outcomes ?? 0)} />
          </dl>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.decisionHealth}</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <OverviewCard label={labels.sections.executiveBriefings} value={`${Number(health.review_quality ?? 0)}%`} />
              <OverviewCard label={labels.overview.successfulOutcomes} value={`${Number(health.outcome_tracking ?? 0)}%`} />
              <OverviewCard label={labels.overview.pendingApprovals} value={`${Number(health.approval_quality ?? 0)}%`} />
              <OverviewCard label={labels.sections.knowledgeBase} value={`${Number(health.documentation_quality ?? 0)}%`} />
              <OverviewCard label={labels.sections.patterns} value={`${Number(health.forecast_accuracy ?? 0)}%`} />
            </dl>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.executiveBriefings}</h2>
            <div className="mt-4"><ItemList items={recommendations} /></div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.patterns}</h2>
            <div className="mt-4"><ItemList items={center.patterns ?? []} /></div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.knowledgeBase}</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <OverviewCard label="Supplier" value={Number(knowledge.supplier_decisions ?? 0)} />
              <OverviewCard label="Budget" value={Number(knowledge.budget_decisions ?? 0)} />
              <OverviewCard label="Hiring" value={Number(knowledge.hiring_decisions ?? 0)} />
              <OverviewCard label="Technology" value={Number(knowledge.technology_decisions ?? 0)} />
              <OverviewCard label="Expansion" value={Number(knowledge.expansion_decisions ?? 0)} />
            </dl>
          </div>
        </section>
      ) : null}

      {tab === "decisions" ? (
        <section className="space-y-6">
          <ItemList items={center.decisions ?? []} />
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.businessPacks}</h2>
            <div className="mt-4"><ItemList items={center.business_packs ?? []} /></div>
          </div>
        </section>
      ) : null}

      {tab === "approvals" ? (
        <section className="space-y-4">
          <ItemList items={center.approvals ?? []} />
          {(center.approvals ?? []).filter((d) => d.decision_status === "pending").map((decision) => (
            <button key={String(decision.decision_key)} type="button" disabled={busy}
              onClick={() => void runAction("approve_decision", { decision_key: decision.decision_key })}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
              {labels.actions.approveDecision}
            </button>
          ))}
        </section>
      ) : null}

      {tab === "outcomes" ? (
        <section><ItemList items={center.outcomes ?? []} /></section>
      ) : null}

      {tab === "lessons" ? (
        <section><ItemList items={center.lessons ?? []} /></section>
      ) : null}

      {tab === "reviews" ? (
        <section className="space-y-4">
          <ItemList items={center.reviews ?? []} />
          {(center.reviews ?? []).filter((r) => r.review_status === "due" || r.review_status === "overdue").map((review) => (
            <button key={String(review.review_key)} type="button" disabled={busy}
              onClick={() => void runAction("complete_review", { decision_key: review.decision_key, review_key: review.review_key })}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
              {labels.actions.completeReview}
            </button>
          ))}
        </section>
      ) : null}

      {tab === "reports" ? (
        <section className="space-y-6">
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.companionAdvisor}</h2>
            <ul className="mt-3 space-y-1 text-sm text-zinc-700">
              {advisorPrompts.map((prompt) => <li key={prompt}>· {prompt}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.audit}</h2>
            <ul className="mt-4 space-y-2 text-sm text-zinc-600">
              {(center.audit_recent ?? []).map((entry, i) => (
                <li key={i} className="rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2">
                  <span className="font-medium text-zinc-900">{entry.event_type}</span>
                  {entry.summary ? ` — ${entry.summary}` : ""}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </div>
  );
}
