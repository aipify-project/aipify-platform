"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseConstitutionDashboard,
  type ConstitutionDashboard,
} from "@/lib/aipify/constitution";

type ConstitutionDashboardPanelProps = {
  labels: Record<string, string>;
};

function statusClass(status?: string) {
  switch (status) {
    case "completed":
    case "aligned":
    case "active":
      return "bg-emerald-100 text-emerald-800";
    case "in_progress":
    case "review_due":
      return "bg-amber-100 text-amber-800";
    case "scheduled":
    case "pending":
      return "bg-blue-100 text-blue-800";
    case "needs_attention":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export function ConstitutionDashboardPanel({ labels }: ConstitutionDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<ConstitutionDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/constitution/dashboard");
    if (res.ok) setDashboard(parseConstitutionDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const generateBriefing = async () => {
    await fetch("/api/aipify/constitution/briefings/generate", { method: "POST" });
    await load();
  };

  const acknowledgePrinciple = async (principleId: string) => {
    setActing(`ack-${principleId}`);
    await fetch(`/api/aipify/constitution/principles/${principleId}/acknowledge`, { method: "POST" });
    setActing(null);
    await load();
  };

  const completeReview = async (reviewId: string) => {
    setActing(`review-${reviewId}`);
    await fetch(`/api/aipify/constitution/reviews/${reviewId}/complete`, { method: "POST" });
    setActing(null);
    await load();
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_customer) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/governance" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.governance}
        </Link>
        <Link href="/app/partners" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.partners}
        </Link>
        <Link href="/app/knowledge-center" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.knowledgeCenter}
        </Link>
      </div>

      <section className="rounded-xl border border-amber-200 bg-amber-50/50 p-6">
        <h2 className="text-sm font-semibold text-amber-900">{labels.constitutionalAlignment}</h2>
        <p className="mt-2 text-4xl font-bold text-amber-800">
          {dashboard.constitution_score ?? 0}
          <span className="text-lg font-normal text-gray-500">/100</span>
        </p>
        <p className="mt-1 text-sm font-medium text-amber-700">
          v{dashboard.current_version} · {dashboard.principles_acknowledged ?? 0}/{dashboard.principles_count ?? 0}{" "}
          {labels.principlesAcknowledged} · {dashboard.alignment_score ?? 0}% {labels.alignment}
        </p>
        <p className="mt-2 text-sm text-amber-800">{dashboard.philosophy}</p>
        {dashboard.preamble ? <p className="mt-2 text-xs italic text-amber-700">{dashboard.preamble}</p> : null}
        <p className="mt-1 text-xs text-amber-700">{dashboard.safety_note}</p>
        <button
          type="button"
          onClick={() => void generateBriefing()}
          className="mt-4 rounded-md bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800"
        >
          {labels.generateBriefing}
        </button>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: labels.corePrinciples, value: dashboard.principles_count ?? 0 },
          { label: labels.principlesAcknowledged, value: dashboard.principles_acknowledged ?? 0 },
          { label: labels.alignment, value: `${dashboard.alignment_score ?? 0}%` },
          { label: labels.partnerAlignment, value: `${dashboard.partner_alignment_avg ?? 0}%` },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <p className="text-xs text-gray-500">{m.label}</p>
            <p className="text-lg font-semibold text-gray-900">{m.value}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.corePrinciples}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {dashboard.core_principles.map((principle) => (
            <article key={principle.id} className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <span className="text-xs font-semibold text-amber-800">
                  {labels.principle} {principle.principle_number}
                </span>
                {principle.acknowledged ? (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                    {labels.acknowledged}
                  </span>
                ) : null}
              </div>
              <p className="mt-2 font-medium text-gray-900">{principle.title}</p>
              <p className="mt-1 text-xs text-gray-600">{principle.description}</p>
              {!principle.acknowledged ? (
                <button
                  type="button"
                  disabled={acting === `ack-${principle.id}`}
                  onClick={() => void acknowledgePrinciple(principle.id)}
                  className="mt-3 rounded-md bg-amber-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-800 disabled:opacity-50"
                >
                  {labels.acknowledgePrinciple}
                </button>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      {dashboard.responsible_ai_commitments.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.responsibleAi}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {dashboard.responsible_ai_commitments.map((c) => (
              <article key={c.id} className="rounded-lg border border-violet-100 bg-violet-50/30 p-4">
                <p className="font-medium text-violet-900">{c.title}</p>
                <p className="mt-1 text-xs text-violet-800">{c.description}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.decision_framework && dashboard.decision_framework.length > 0 ? (
        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-sm font-semibold text-slate-900">{labels.decisionFramework}</h2>
          <ul className="mt-2 list-inside list-disc text-xs text-slate-700">
            {dashboard.decision_framework.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.commitment_records.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.commitments}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.commitment_records.map((c) => (
              <li key={c.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                <span className="font-medium text-gray-900">{c.title}</span>
                <span className="ml-2 text-xs capitalize text-gray-500">{c.commitment_type?.replace(/_/g, " ")}</span>
                <p className="mt-1 text-xs text-gray-600">{c.description}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.constitutional_reviews.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.constitutionalReviews}</h2>
          <div className="mt-3 space-y-2">
            {dashboard.constitutional_reviews.map((review) => (
              <article key={review.id} className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{review.title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusClass(review.status)}`}>
                    {review.status?.replace(/_/g, " ")}
                  </span>
                </div>
                {review.summary ? <p className="mt-1 text-xs text-gray-600">{review.summary}</p> : null}
                {review.alignment_score != null ? (
                  <p className="mt-2 text-xs text-emerald-700">{review.alignment_score}% {labels.alignment}</p>
                ) : null}
                {review.status === "scheduled" || review.status === "in_progress" ? (
                  <button
                    type="button"
                    disabled={acting === `review-${review.id}`}
                    onClick={() => void completeReview(review.id)}
                    className="mt-2 text-xs text-amber-800 underline hover:text-amber-900 disabled:opacity-50"
                  >
                    {labels.completeReview}
                  </button>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.partner_alignment.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.partnerAlignmentSection}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.partner_alignment.map((p) => (
              <article key={p.id} className="rounded-lg border border-indigo-100 bg-indigo-50/30 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-indigo-900">{p.partner_name}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusClass(p.alignment_status)}`}>
                    {p.alignment_status?.replace(/_/g, " ")}
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold text-indigo-700">{p.alignment_score}%</p>
                {p.notes ? <p className="mt-1 text-xs text-indigo-800">{p.notes}</p> : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.governance_decisions.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.governanceDecisions}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.governance_decisions.map((d) => (
              <article key={d.id} className="rounded-lg border border-emerald-100 bg-emerald-50/30 p-4">
                <p className="text-xs capitalize text-emerald-700">{d.decision_area}</p>
                <p className="mt-1 font-medium text-emerald-900">{d.title}</p>
                <p className="mt-1 text-xs text-emerald-800">{d.summary}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.review_process && dashboard.review_process.length > 0 ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/30 p-4">
          <h2 className="text-sm font-semibold text-amber-900">{labels.reviewProcess}</h2>
          <ul className="mt-2 list-inside list-disc text-xs text-amber-800">
            {dashboard.review_process.map((step) => (
              <li key={step}>{step}</li>
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
