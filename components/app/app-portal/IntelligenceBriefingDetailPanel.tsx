"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseBriefingDetail,
  type BriefingDetail,
  type BriefingPriority,
  type IntelligenceBriefingsLabels,
  type OrgStatus,
} from "@/lib/app-portal/intelligence-briefings";

type Props = { briefingId: string; labels: IntelligenceBriefingsLabels };

const PRIORITY_STYLE: Record<BriefingPriority, string> = {
  informational: "bg-slate-100 text-slate-700",
  important: "bg-blue-100 text-blue-900",
  high_priority: "bg-amber-100 text-amber-950",
  critical_attention_required: "bg-red-100 text-red-900",
};

const STATUS_STYLE: Record<OrgStatus, string> = {
  stable: "bg-emerald-100 text-emerald-900",
  improving: "bg-teal-100 text-teal-900",
  requires_attention: "bg-amber-100 text-amber-950",
  elevated_risk: "bg-red-100 text-red-900",
};

export function IntelligenceBriefingDetailPanel({ briefingId, labels }: Props) {
  const [detail, setDetail] = useState<BriefingDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/aipify/briefings/${briefingId}`);
    if (res.ok) setDetail(parseBriefingDetail(await res.json()));
    setLoading(false);
  }, [briefingId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial load
    void load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex min-h-[30vh] flex-col items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" aria-hidden />
        <p className="mt-4 text-sm text-slate-600">{labels.loading}</p>
      </div>
    );
  }

  if (!detail?.found || !detail.briefing) {
    return (
      <div className="space-y-4">
        <p className="text-slate-600">{labels.notFound}</p>
        <Link href="/app/operations/briefings" className="text-sm text-indigo-700 hover:underline">← {labels.back}</Link>
      </div>
    );
  }

  const b = detail.briefing;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/app/operations/briefings" className="text-sm font-medium text-indigo-700 hover:underline">← {labels.back}</Link>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{b.title}</h1>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge className={PRIORITY_STYLE[b.priority_level]}>{labels.priorities[b.priority_level]}</Badge>
          <Badge className={STATUS_STYLE[b.org_status]}>{labels.orgStatuses[b.org_status]}</Badge>
          <span className="text-xs text-slate-500">{labels.types[b.briefing_type]}</span>
        </div>
        {(b.reporting_period_start || b.reporting_period_end) ? (
          <p className="mt-2 text-xs text-slate-500">
            {labels.detail.reportingPeriod}: {b.reporting_period_start ?? "—"} — {b.reporting_period_end ?? "—"}
          </p>
        ) : null}
      </div>

      <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.executiveSummary}</h2>
        <p className="mt-3 text-sm text-slate-800 whitespace-pre-line">{b.executive_summary}</p>
      </section>

      {(b.key_insights?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.keyInsights}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {b.key_insights!.map((i) => <li key={i.id}>{i.text}</li>)}
          </ul>
        </section>
      ) : null}

      {(b.risks?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-red-100 bg-red-50/40 p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.risks}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {b.risks!.map((r) => <li key={r.id}>{r.text}</li>)}
          </ul>
        </section>
      ) : null}

      {(b.opportunities?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.opportunities}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {b.opportunities!.map((o) => <li key={o.id}>{o.text}</li>)}
          </ul>
        </section>
      ) : null}

      {(b.recommended_actions?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <p className="text-sm font-medium text-slate-900">{labels.detail.recommendedActions}</p>
          <ul className="mt-2 space-y-2 text-sm text-slate-700">
            {b.recommended_actions!.map((r) => (
              <li key={r.id}>{labels.recommendations[r.key] ?? r.key}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {(detail.related_initiatives?.length ?? 0) > 0 ? (
        <RelatedSection title={labels.detail.relatedInitiatives} items={detail.related_initiatives!} />
      ) : null}

      {(detail.related_commitments?.length ?? 0) > 0 ? (
        <RelatedSection title={labels.detail.relatedCommitments} items={detail.related_commitments!} />
      ) : null}

      {(detail.related_decisions?.length ?? 0) > 0 ? (
        <RelatedSection title={labels.detail.relatedDecisions} items={detail.related_decisions!} />
      ) : null}

      {(detail.related_follow_ups?.length ?? 0) > 0 ? (
        <RelatedSection title={labels.detail.relatedFollowUps} items={detail.related_follow_ups!} />
      ) : null}

      {(detail.activity_timeline?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.activityTimeline}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {detail.activity_timeline!.map((a) => (
              <li key={a.id} className="flex justify-between gap-2 border-b border-slate-100 pb-2">
                <span>{a.description}</span>
                <span className="text-xs text-slate-500">{new Date(a.created_at).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function RelatedSection({ title, items }: { title: string; items: Array<{ id: string; title: string; status: string }> }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-semibold">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm text-slate-700">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between gap-2">
            <span>{item.title}</span>
            <span className="text-xs text-slate-500">{item.status}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className: string }) {
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>{children}</span>;
}
