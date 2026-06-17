"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  READINESS_CATEGORIES,
  READINESS_LEVELS,
  READINESS_PRIORITIES,
  REVIEW_STATUSES,
  parseEnterpriseReadinessOverview,
  type EnterpriseReadinessLabels,
  type EnterpriseReadinessOverview,
  type ReadinessAssessment,
  type ReadinessGap,
} from "@/lib/app-portal/enterprise-readiness";

type Props = { labels: EnterpriseReadinessLabels };

export function EnterpriseReadinessPanel({ labels }: Props) {
  const [data, setData] = useState<EnterpriseReadinessOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");
  const [readinessLevel, setReadinessLevel] = useState("");
  const [priority, setPriority] = useState("");
  const [reviewStatus, setReviewStatus] = useState("");
  const [owner, setOwner] = useState("");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const p = new URLSearchParams();
    if (category) p.set("category", category);
    if (readinessLevel) p.set("readiness_level", readinessLevel);
    if (priority) p.set("priority", priority);
    if (reviewStatus) p.set("review_status", reviewStatus);
    if (owner.trim()) p.set("owner", owner.trim());
    if (search.trim()) p.set("search", search.trim());

    const res = await fetch(`/api/aipify/enterprise-readiness?${p}`);
    if (res.ok) {
      setData(parseEnterpriseReadinessOverview(await res.json()));
    } else {
      const b = (await res.json()) as { error?: string };
      setError(b.error ?? labels.accessDenied);
      setData(null);
    }
    setLoading(false);
  }, [category, readinessLevel, priority, reviewStatus, owner, search, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function startAssessment() {
    setBusy(true);
    setMessage("");
    const res = await fetch("/api/aipify/enterprise-readiness/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "start_assessment" }),
    });
    setBusy(false);
    if (res.ok) {
      setMessage(labels.startAssessment.success);
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

  const empty     = !data?.has_assessment_data;
  const canAssess = data?.can_assess === true;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <Link href="/app" className="text-sm font-medium text-indigo-700 hover:underline">← APP Dashboard</Link>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">{labels.title}</h1>
        <p className="mt-2 text-slate-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-slate-800">{labels.principle}</p>
        {data?.advisory_note ? <p className="mt-3 text-sm text-slate-600">{labels.advisoryNote}</p> : null}
      </div>

      {empty ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{labels.emptyTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{labels.emptyBody}</p>
          {canAssess ? (
            <button type="button" disabled={busy} onClick={() => void startAssessment()}
              className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">
              {labels.emptyCta}
            </button>
          ) : null}
        </section>
      ) : (
        <>
          {/* Score + level + summary */}
          <section className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{labels.dashboard.readinessScore}</p>
              <p className="mt-1 text-3xl font-semibold text-indigo-700">{data?.enterprise_readiness_score ?? "—"}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{labels.dashboard.overallLevel}</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {labels.readinessLevels[data?.readiness_level as keyof typeof labels.readinessLevels] ?? data?.readiness_level}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{labels.dashboard.executiveSummary}</p>
              <p className="mt-2 text-sm text-slate-700">{data?.executive_summary}</p>
            </div>
          </section>

          {/* Spotlight areas */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: labels.dashboard.operationalReadiness, a: data?.operational_readiness },
              { label: labels.dashboard.leadershipReadiness,  a: data?.leadership_readiness },
              { label: labels.dashboard.securityReadiness,    a: data?.security_readiness },
              { label: labels.dashboard.complianceReadiness,  a: data?.compliance_readiness },
            ].filter((x) => x.a).map(({ label, a }) => (
              <SpotlightCard key={label} label={label} assessment={a!} levels={labels.readinessLevels} />
            ))}
          </section>

          {/* Gaps */}
          {(data?.gaps?.length ?? 0) > 0 ? (
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-slate-900">{labels.dashboard.identifiedGaps}</h2>
              <div className="grid gap-4 lg:grid-cols-2">
                {data!.gaps!.map((g) => <GapCard key={g.id} gap={g} labels={labels} />)}
              </div>
            </section>
          ) : null}

          {/* Review questions */}
          <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
            <h2 className="font-semibold text-slate-900">{labels.dashboard.reviewQuestions}</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-slate-700">
              {labels.reviewQuestions.map((q, i) => <li key={i}>{q}</li>)}
            </ul>
          </section>
        </>
      )}

      {/* Filters */}
      <section className="flex flex-wrap gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder={labels.filters.search}
          className="min-w-[12rem] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={category} onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.category}</option>
          {READINESS_CATEGORIES.map((c) => <option key={c} value={c}>{labels.categories[c]}</option>)}
        </select>
        <select value={readinessLevel} onChange={(e) => setReadinessLevel(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.readinessLevel}</option>
          {READINESS_LEVELS.map((l) => <option key={l} value={l}>{labels.readinessLevels[l]}</option>)}
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.priority}</option>
          {READINESS_PRIORITIES.map((p) => <option key={p} value={p}>{labels.priorities[p]}</option>)}
        </select>
        <select value={reviewStatus} onChange={(e) => setReviewStatus(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.reviewStatus}</option>
          {REVIEW_STATUSES.map((s) => <option key={s} value={s}>{labels.reviewStatuses[s]}</option>)}
        </select>
        <input value={owner} onChange={(e) => setOwner(e.target.value)}
          placeholder={labels.filters.owner}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </section>

      {/* All assessments */}
      {!empty && (data?.assessments?.length ?? 0) > 0 ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">{labels.dashboard.allAssessments}</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {data!.assessments!.map((a) => <AssessmentCard key={a.id} assessment={a} labels={labels} />)}
          </div>
        </section>
      ) : null}

      {/* Recommendations */}
      {!empty && (data?.recommendations?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h2 className="font-semibold">{labels.dashboard.recommendations}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-800">
            {data!.recommendations!.map((r) => (
              <li key={r.id}>{labels.recommendations[r.key as keyof typeof labels.recommendations] ?? r.key}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {canAssess && !empty ? (
        <button type="button" disabled={busy} onClick={() => void startAssessment()}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">
          {labels.emptyCta}
        </button>
      ) : null}

      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold">{labels.faq.title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div><dt className="font-medium">{labels.faq.whatIs}</dt><dd className="mt-1 text-slate-600">{labels.faq.whatIsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.certifies}</dt><dd className="mt-1 text-slate-600">{labels.faq.certifiesAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.whoShouldUse}</dt><dd className="mt-1 text-slate-600">{labels.faq.whoShouldUseAnswer}</dd></div>
        </dl>
      </section>
    </div>
  );
}

function SpotlightCard({ label, assessment, levels }: { label: string; assessment: ReadinessAssessment; levels: Record<string, string> }) {
  const pct = Math.round((assessment.current_score / 100) * 100);
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-indigo-700">{assessment.current_score}</p>
      <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100">
        <div className="h-1.5 rounded-full bg-indigo-500" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-xs text-slate-500">{levels[assessment.readiness_level as keyof typeof levels] ?? assessment.readiness_level}</p>
    </div>
  );
}

function GapCard({ gap, labels }: { gap: ReadinessGap; labels: EnterpriseReadinessLabels }) {
  const impactColor: Record<string, string> = {
    critical: "border-red-200 bg-red-50/40",
    high: "border-amber-200 bg-amber-50/40",
    moderate: "border-slate-200 bg-white",
    low: "border-slate-200 bg-white",
  };
  return (
    <article className={`rounded-2xl border p-5 shadow-sm ${impactColor[gap.impact_level] ?? "border-slate-200 bg-white"}`}>
      <h3 className="font-semibold text-slate-900">{gap.title}</h3>
      <p className="mt-2 text-sm text-slate-600">{gap.description}</p>
      <dl className="mt-3 grid gap-1 text-xs text-slate-500">
        <div><dt className="inline">{labels.gap.impactLevel}: </dt><dd className="inline">{labels.impactLevels[gap.impact_level as keyof typeof labels.impactLevels] ?? gap.impact_level}</dd></div>
        <div><dt className="inline">{labels.gap.suggestedOwner}: </dt><dd className="inline">{gap.suggested_owner}</dd></div>
        <div><dt className="inline">{labels.gap.reviewTimeline}: </dt><dd className="inline">{gap.review_timeline}</dd></div>
      </dl>
      <p className="mt-3 text-xs text-slate-700">{gap.recommended_action}</p>
    </article>
  );
}

function AssessmentCard({ assessment: a, labels }: { assessment: ReadinessAssessment; labels: EnterpriseReadinessLabels }) {
  const pct = Math.round((a.current_score / 100) * 100);
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-slate-900">{a.title}</h3>
      <div className="mt-3 flex items-center gap-3">
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>{labels.scorecard.currentScore}: {a.current_score}</span>
            <span>{labels.scorecard.targetScore}: {a.target_score}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-100">
            <div className="h-1.5 rounded-full bg-indigo-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
      <dl className="mt-3 grid gap-1 text-xs text-slate-500">
        <div><dt className="inline">{labels.scorecard.priority}: </dt><dd className="inline">{labels.priorities[a.priority as keyof typeof labels.priorities] ?? a.priority}</dd></div>
        <div><dt className="inline">{labels.scorecard.trend}: </dt><dd className="inline">{labels.trends[a.trend as keyof typeof labels.trends] ?? a.trend}</dd></div>
        <div><dt className="inline">{labels.scorecard.owner}: </dt><dd className="inline">{a.leadership_owner}</dd></div>
      </dl>
      <Link href={`/app/intelligence/enterprise-readiness/${a.id}`}
        className="mt-4 inline-block text-sm font-medium text-indigo-700 hover:underline">
        {labels.dashboard.viewAssessment}
      </Link>
    </article>
  );
}
