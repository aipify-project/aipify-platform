"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  AUTOMATION_CATEGORIES,
  AUTOMATION_HEALTH_STATUSES,
  AUTOMATION_STATUSES,
  parseAutomationOverview,
  parseAutomationTimeline,
  type AutomationCard,
  type AutomationLabels,
  type AutomationOverview,
  type AutomationTimelineEvent,
} from "@/lib/app-portal/business-pack-automation";

type Props = { labels: AutomationLabels };

const HEALTH_STYLE: Record<string, string> = {
  healthy: "bg-emerald-100 text-emerald-900",
  stable: "bg-slate-100 text-slate-700",
  requires_attention: "bg-amber-100 text-amber-950",
  at_risk: "bg-red-100 text-red-900",
};

const STATUS_STYLE: Record<string, string> = {
  recommended: "bg-violet-100 text-violet-900",
  draft: "bg-slate-100 text-slate-700",
  active: "bg-teal-100 text-teal-900",
  paused: "bg-amber-100 text-amber-950",
  requires_review: "bg-orange-100 text-orange-950",
  retired: "bg-slate-200 text-slate-800",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export function BusinessPackAutomationPanel({ labels }: Props) {
  const [data, setData] = useState<AutomationOverview | null>(null);
  const [timeline, setTimeline] = useState<AutomationTimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [owner, setOwner] = useState("");
  const [packKey, setPackKey] = useState("");
  const [healthStatus, setHealthStatus] = useState("");
  const [periodFrom, setPeriodFrom] = useState("");
  const [search, setSearch] = useState("");
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [approveKey, setApproveKey] = useState<string | null>(null);
  const [approveNotes, setApproveNotes] = useState("");
  const [approveMessage, setApproveMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (status) params.set("status", status);
    if (owner) params.set("owner", owner);
    if (packKey) params.set("pack_key", packKey);
    if (healthStatus) params.set("health_status", healthStatus);
    if (periodFrom) params.set("period_from", periodFrom);
    if (search.trim()) params.set("search", search.trim());

    const timelineParams = new URLSearchParams();
    if (periodFrom) timelineParams.set("period_from", periodFrom);

    const [dashRes, timelineRes] = await Promise.all([
      fetch(`/api/aipify/business-packs/automation?${params}`),
      fetch(`/api/aipify/business-packs/automation/timeline?${timelineParams}`),
    ]);

    if (dashRes.ok) {
      setData(parseAutomationOverview(await dashRes.json()));
    } else {
      const body = (await dashRes.json()) as { error?: string };
      setError(body.error ?? labels.accessDenied);
      setData(null);
    }
    if (timelineRes.ok) {
      const body = (await timelineRes.json()) as { events?: unknown };
      setTimeline(parseAutomationTimeline(body));
    }
    setLoading(false);
  }, [category, status, owner, packKey, healthStatus, periodFrom, search, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function approveAutomation(automationKey: string) {
    setBusy(true);
    setApproveMessage("");
    const res = await fetch("/api/aipify/business-packs/automation/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ automation_key: automationKey, governance_notes: approveNotes }),
    });
    setBusy(false);
    if (res.ok) {
      setApproveKey(null);
      setApproveNotes("");
      setApproveMessage(labels.approval.success);
      void load();
    }
  }

  if (loading && !data && !error) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" aria-hidden />
        <p className="mt-4 text-sm text-slate-600">{labels.loading}</p>
      </div>
    );
  }

  if (error && !data?.found) {
    return (
      <div className="mx-auto max-w-6xl space-y-4">
        <Link href="/app" className="text-sm font-medium text-indigo-700 hover:underline">← APP Dashboard</Link>
        <p className="text-slate-600">{labels.accessDenied}</p>
      </div>
    );
  }

  const empty = !data?.has_automation_data;
  const canApprove = data?.can_approve === true;
  const insights = data?.insights;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <Link href="/app" className="text-sm font-medium text-indigo-700 hover:underline">← APP Dashboard</Link>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">{labels.title}</h1>
        <p className="mt-2 text-slate-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-slate-800">{labels.principle}</p>
      </div>

      {empty ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{labels.emptyTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{labels.emptyBody}</p>
          <Link href="/app/business-packs/available" className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white">{labels.emptyCta}</Link>
        </section>
      ) : (
        <>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{labels.dashboard.executiveSummary}</p>
            <p className="mt-2 text-sm text-slate-700">{data?.executive_summary}</p>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label={labels.dashboard.totalAutomations} value={String(data?.total_automations ?? 0)} />
            <Stat label={labels.dashboard.activeAutomations} value={String(data?.active_automations ?? 0)} />
            <Stat label={labels.dashboard.recommendedAutomations} value={String(data?.recommended_automations ?? 0)} />
            <Stat label={labels.dashboard.timeSaved} value={`${Math.round(data?.time_saved_hours ?? 0)}h`} />
          </section>

          <Stat label={labels.dashboard.requiringReview} value={String(data?.automations_requiring_review ?? 0)} />
        </>
      )}

      <section className="flex flex-wrap gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={labels.filters.search} className="min-w-[12rem] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.category}</option>
          {AUTOMATION_CATEGORIES.map((c) => <option key={c} value={c}>{labels.categories[c]}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.status}</option>
          {AUTOMATION_STATUSES.map((s) => <option key={s} value={s}>{labels.statuses[s]}</option>)}
        </select>
        <input value={owner} onChange={(e) => setOwner(e.target.value)} placeholder={labels.filters.owner} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input value={packKey} onChange={(e) => setPackKey(e.target.value)} placeholder={labels.filters.packKey} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={healthStatus} onChange={(e) => setHealthStatus(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.healthStatus}</option>
          {AUTOMATION_HEALTH_STATUSES.map((h) => <option key={h} value={h}>{labels.healthStatuses[h]}</option>)}
        </select>
        <input type="date" value={periodFrom} onChange={(e) => setPeriodFrom(e.target.value)} aria-label={labels.filters.periodFrom} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </section>

      {!empty && (data?.automations?.length ?? 0) > 0 ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">{labels.dashboard.healthOverview}</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {data!.automations!.map((automation) => (
              <AutomationCardView
                key={automation.automation_key}
                automation={automation}
                labels={labels}
                expanded={expandedKey === automation.automation_key}
                canApprove={canApprove}
                approveOpen={approveKey === automation.automation_key}
                approveNotes={approveNotes}
                busy={busy}
                onToggle={() => setExpandedKey(expandedKey === automation.automation_key ? null : automation.automation_key)}
                onOpenApprove={() => setApproveKey(approveKey === automation.automation_key ? null : automation.automation_key)}
                onApproveNotesChange={setApproveNotes}
                onApprove={() => void approveAutomation(automation.automation_key)}
              />
            ))}
          </div>
        </section>
      ) : null}

      {!empty && insights ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.dashboard.automationInsights}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <InsightList title={labels.insights.mostValuable} items={insights.most_valuable?.map((a) => a.name) ?? []} />
            <InsightList title={labels.insights.underutilized} items={insights.underutilized?.map((a) => a.name) ?? []} />
            <InsightList title={labels.insights.frequentlyUsed} items={insights.frequently_used?.map((a) => a.name) ?? []} />
            <InsightList title={labels.insights.failedAttention} items={insights.failed_attention?.map((a) => a.name) ?? []} />
            <InsightList title={labels.insights.expansionOpportunities} items={insights.expansion_opportunities?.map((a) => a.name) ?? []} />
          </div>
        </section>
      ) : null}

      {!empty && timeline.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.dashboard.timeline}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {timeline.map((e) => (
              <li key={e.id}>{labels.timelineEvents[e.event_type as keyof typeof labels.timelineEvents] ?? e.description}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {!empty && (data?.recommendations?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h2 className="font-semibold">{labels.dashboard.recommendedActions}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-800">
            {data!.recommendations!.map((r) => (
              <li key={r.id}>{labels.recommendations[r.key as keyof typeof labels.recommendations] ?? r.key}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {approveMessage ? <p className="text-sm text-emerald-700">{approveMessage}</p> : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold">{labels.faq.title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div><dt className="font-medium">{labels.faq.whatIs}</dt><dd className="mt-1 text-slate-600">{labels.faq.whatIsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.autoActivate}</dt><dd className="mt-1 text-slate-600">{labels.faq.autoActivateAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.whyGovernance}</dt><dd className="mt-1 text-slate-600">{labels.faq.whyGovernanceAnswer}</dd></div>
        </dl>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function InsightList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="text-sm font-medium text-slate-900">{title}</p>
      <ul className="mt-2 space-y-1 text-sm text-slate-600">{items.map((item) => <li key={item}>{item}</li>)}</ul>
    </div>
  );
}

function AutomationCardView({
  automation,
  labels,
  expanded,
  canApprove,
  approveOpen,
  approveNotes,
  busy,
  onToggle,
  onOpenApprove,
  onApproveNotesChange,
  onApprove,
}: {
  automation: AutomationCard;
  labels: AutomationLabels;
  expanded: boolean;
  canApprove: boolean;
  approveOpen: boolean;
  approveNotes: string;
  busy: boolean;
  onToggle: () => void;
  onOpenApprove: () => void;
  onApproveNotesChange: (v: string) => void;
  onApprove: () => void;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900">{automation.name}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[automation.status] ?? STATUS_STYLE.recommended}`}>
              {labels.statuses[automation.status as keyof typeof labels.statuses] ?? automation.status}
            </span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${HEALTH_STYLE[automation.health_status] ?? HEALTH_STYLE.stable}`}>
              {labels.healthStatuses[automation.health_status as keyof typeof labels.healthStatuses] ?? automation.health_status}
            </span>
          </div>
        </div>
        <p className="text-sm font-semibold text-slate-900">{formatCurrency(automation.estimated_value)}</p>
      </div>
      <dl className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
        <div><dt className="text-xs text-slate-500">{labels.card.category}</dt><dd>{labels.categories[automation.category as keyof typeof labels.categories] ?? automation.category}</dd></div>
        <div><dt className="text-xs text-slate-500">{labels.card.successRate}</dt><dd>{automation.success_rate}%</dd></div>
        <div className="sm:col-span-2"><dt className="text-xs text-slate-500">{labels.card.trigger}</dt><dd>{automation.trigger_description}</dd></div>
        <div className="sm:col-span-2"><dt className="text-xs text-slate-500">{labels.card.action}</dt><dd>{automation.action_description}</dd></div>
      </dl>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={onToggle} className="text-sm font-medium text-indigo-700 hover:underline">{labels.card.viewDetails}</button>
        {canApprove && automation.status === "recommended" ? (
          <button type="button" onClick={onOpenApprove} className="text-sm font-medium text-indigo-700 hover:underline">{labels.card.approve}</button>
        ) : null}
      </div>
      {expanded && (automation.recommended_improvements?.length ?? 0) > 0 ? (
        <ul className="mt-4 list-disc pl-5 text-sm text-slate-600">
          {automation.recommended_improvements!.map((item) => <li key={item}>{item}</li>)}
        </ul>
      ) : null}
      {approveOpen ? (
        <div className="mt-4 space-y-3 rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 text-sm">
          <p className="font-medium">{labels.approval.title}</p>
          <p className="text-slate-600">{labels.approval.governanceNote}</p>
          <textarea value={approveNotes} onChange={(e) => onApproveNotesChange(e.target.value)} placeholder={labels.approval.notes} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
          <button type="button" disabled={busy} onClick={onApprove} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">{labels.approval.submit}</button>
        </div>
      ) : null}
    </article>
  );
}
