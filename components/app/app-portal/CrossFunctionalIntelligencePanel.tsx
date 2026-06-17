"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  DEPENDENCY_TYPES,
  PRIORITIES,
  RISK_LEVELS,
  REVIEW_STATUSES,
  parseCFIOverview,
  type CollaborationRecord,
  type CrossFunctionalIntelligenceLabels,
  type CrossFunctionalIntelligenceOverview,
  type Dependency,
  type FrictionRecord,
} from "@/lib/app-portal/cross-functional-intelligence";

type Props = { labels: CrossFunctionalIntelligenceLabels };

export function CrossFunctionalIntelligencePanel({ labels }: Props) {
  const [data, setData] = useState<CrossFunctionalIntelligenceOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [department, setDepartment] = useState("");
  const [dependencyType, setDependencyType] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const [priority, setPriority] = useState("");
  const [reviewStatus, setReviewStatus] = useState("");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const p = new URLSearchParams();
    if (department.trim()) p.set("department", department.trim());
    if (dependencyType) p.set("dependency_type", dependencyType);
    if (riskLevel) p.set("risk_level", riskLevel);
    if (priority) p.set("priority", priority);
    if (reviewStatus) p.set("review_status", reviewStatus);
    if (search.trim()) p.set("search", search.trim());

    const res = await fetch(`/api/aipify/cross-functional-intelligence?${p}`);
    if (res.ok) {
      setData(parseCFIOverview(await res.json()));
    } else {
      const b = (await res.json()) as { error?: string };
      setError(b.error ?? labels.accessDenied);
      setData(null);
    }
    setLoading(false);
  }, [department, dependencyType, riskLevel, priority, reviewStatus, search, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function beginReview() {
    setBusy(true);
    setMessage("");
    const res = await fetch("/api/aipify/cross-functional-intelligence/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "begin_review" }),
    });
    setBusy(false);
    if (res.ok) {
      setMessage(labels.beginReview.success);
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

  const empty = !data?.has_intelligence_data;
  const canReview = data?.can_review === true;

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
          {canReview ? (
            <button type="button" disabled={busy} onClick={() => void beginReview()}
              className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">
              {labels.emptyCta}
            </button>
          ) : null}
        </section>
      ) : (
        <>
          {/* Score cards */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ScoreCard label={labels.dashboard.healthScore}           value={data?.cross_functional_health_score} />
            <ScoreCard label={labels.dashboard.collaborationScore}    value={data?.department_collaboration_score} />
            <ScoreCard label={labels.dashboard.dependencyScore}       value={data?.organizational_dependency_score} />
            <ScoreCard label={labels.dashboard.processAlignmentScore} value={data?.process_alignment_score} />
          </section>

          {/* Summary + attention + opportunities */}
          <section className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{labels.dashboard.executiveSummary}</p>
              <p className="mt-2 text-sm text-slate-700">{data?.executive_summary}</p>
            </div>
            <InsightBlock title={labels.dashboard.areasRequiringAttention} items={data?.areas_requiring_attention ?? []} />
            <InsightBlock title={labels.dashboard.improvementOpportunities} items={data?.improvement_opportunities ?? []} />
          </section>

          {/* Heatmap */}
          {(data?.collaboration?.length ?? 0) > 0 ? (
            <section>
              <h2 className="mb-3 text-lg font-semibold text-slate-900">{labels.dashboard.heatmap}</h2>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {data!.collaboration!.map((c) => <HeatmapCell key={c.id} col={c} labels={labels} />)}
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                <LegendDot color="emerald" label={labels.heatmapLegend.healthy} />
                <LegendDot color="slate"   label={labels.heatmapLegend.stable} />
                <LegendDot color="amber"   label={labels.heatmapLegend.needsAttention} />
                <LegendDot color="red"     label={labels.heatmapLegend.highPriority} />
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
        <input value={department} onChange={(e) => setDepartment(e.target.value)}
          placeholder={labels.filters.department}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={dependencyType} onChange={(e) => setDependencyType(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.dependencyType}</option>
          {DEPENDENCY_TYPES.map((t) => <option key={t} value={t}>{labels.dependencyTypes[t]}</option>)}
        </select>
        <select value={riskLevel} onChange={(e) => setRiskLevel(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.riskLevel}</option>
          {RISK_LEVELS.map((r) => <option key={r} value={r}>{labels.riskLevels[r]}</option>)}
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.priority}</option>
          {PRIORITIES.map((p) => <option key={p} value={p}>{labels.priorities[p]}</option>)}
        </select>
        <select value={reviewStatus} onChange={(e) => setReviewStatus(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.reviewStatus}</option>
          {REVIEW_STATUSES.map((s) => <option key={s} value={s}>{labels.reviewStatuses[s]}</option>)}
        </select>
      </section>

      {/* Dependency map */}
      {!empty && (data?.dependencies?.length ?? 0) > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">{labels.dashboard.dependencyMap}</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {data!.dependencies!.map((d) => <DependencyCard key={d.id} dep={d} labels={labels} />)}
          </div>
        </section>
      ) : null}

      {/* Friction */}
      {!empty && (data?.friction?.length ?? 0) > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">{labels.dashboard.frictionView}</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {data!.friction!.map((f) => <FrictionCard key={f.id} fr={f} labels={labels} />)}
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

      {canReview && !empty ? (
        <button type="button" disabled={busy} onClick={() => void beginReview()}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">
          {labels.emptyCta}
        </button>
      ) : null}

      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold">{labels.faq.title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div><dt className="font-medium">{labels.faq.whatIs}</dt><dd className="mt-1 text-slate-600">{labels.faq.whatIsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.whyImportant}</dt><dd className="mt-1 text-slate-600">{labels.faq.whyImportantAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.whoShouldUse}</dt><dd className="mt-1 text-slate-600">{labels.faq.whoShouldUseAnswer}</dd></div>
        </dl>
      </section>
    </div>
  );
}

function ScoreCard({ label, value }: { label: string; value?: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-indigo-700">{value ?? "—"}</p>
    </div>
  );
}

function InsightBlock({ title, items }: { title: string; items: { id: string; title: string }[] }) {
  if (items.length === 0) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium text-slate-500">{title}</p>
      <ul className="mt-2 space-y-1 text-sm text-slate-700">
        {items.map((i) => <li key={i.id}>{i.title}</li>)}
      </ul>
    </div>
  );
}

const heatColor: Record<string, string> = {
  healthy:         "border-emerald-200 bg-emerald-50",
  stable:          "border-slate-200 bg-white",
  needs_attention: "border-amber-200 bg-amber-50",
  high_priority:   "border-red-200 bg-red-50",
};

function HeatmapCell({ col, labels }: { col: CollaborationRecord; labels: CrossFunctionalIntelligenceLabels }) {
  return (
    <div className={`rounded-xl border p-4 ${heatColor[col.health_status] ?? "border-slate-200 bg-white"}`}>
      <p className="text-xs font-semibold text-slate-700">{col.department_a} ↔ {col.department_b}</p>
      <p className="mt-1 text-xs text-slate-500">{labels.healthStatuses[col.health_status as keyof typeof labels.healthStatuses] ?? col.health_status}</p>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  const dot: Record<string, string> = {
    emerald:"bg-emerald-400", slate:"bg-slate-300", amber:"bg-amber-400", red:"bg-red-400",
  };
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-2.5 w-2.5 rounded-full ${dot[color] ?? "bg-slate-300"}`} />
      {label}
    </span>
  );
}

function DependencyCard({ dep, labels }: { dep: Dependency; labels: CrossFunctionalIntelligenceLabels }) {
  const riskColor: Record<string, string> = {
    critical:"text-red-700", high:"text-amber-700", moderate:"text-slate-700", low:"text-slate-500",
  };
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="font-semibold text-slate-900">{dep.from_department} → {dep.to_department}</p>
      <p className="mt-2 text-sm text-slate-600">{dep.description}</p>
      <dl className="mt-3 grid gap-1 text-xs text-slate-500">
        <div><dt className="inline">{labels.dependency.type}: </dt><dd className="inline">{labels.dependencyTypes[dep.dependency_type as keyof typeof labels.dependencyTypes] ?? dep.dependency_type}</dd></div>
        <div><dt className="inline">{labels.dependency.strength}: </dt><dd className="inline">{labels.dependencyStrengths[dep.dependency_strength as keyof typeof labels.dependencyStrengths] ?? dep.dependency_strength}</dd></div>
        <div><dt className="inline">{labels.dependency.riskLevel}: </dt><dd className={`inline font-medium ${riskColor[dep.risk_level] ?? ""}`}>{labels.riskLevels[dep.risk_level as keyof typeof labels.riskLevels] ?? dep.risk_level}</dd></div>
        <div><dt className="inline">{labels.dependency.owner}: </dt><dd className="inline">{dep.leadership_owner}</dd></div>
      </dl>
      {dep.recommended_review ? <p className="mt-3 text-xs text-slate-700">{dep.recommended_review}</p> : null}
    </article>
  );
}

function FrictionCard({ fr, labels }: { fr: FrictionRecord; labels: CrossFunctionalIntelligenceLabels }) {
  const sev: Record<string, string> = {
    critical:"border-red-200 bg-red-50/40", high:"border-amber-200 bg-amber-50/40",
    moderate:"border-slate-200 bg-white", low:"border-slate-200 bg-white",
  };
  return (
    <article className={`rounded-2xl border p-5 shadow-sm ${sev[fr.severity] ?? "border-slate-200 bg-white"}`}>
      <h3 className="font-semibold text-slate-900">{fr.title}</h3>
      <p className="mt-2 text-sm text-slate-600">{fr.description}</p>
      <dl className="mt-3 grid gap-1 text-xs text-slate-500">
        <div><dt className="inline">{labels.friction.type}: </dt><dd className="inline">{labels.frictionTypes[fr.friction_type as keyof typeof labels.frictionTypes] ?? fr.friction_type}</dd></div>
        <div><dt className="inline">{labels.friction.severity}: </dt><dd className="inline">{labels.frictionSeverities[fr.severity as keyof typeof labels.frictionSeverities] ?? fr.severity}</dd></div>
        {fr.affected_departments.length > 0 ? (
          <div><dt className="inline">{labels.friction.affectedDepartments}: </dt><dd className="inline">{fr.affected_departments.join(", ")}</dd></div>
        ) : null}
      </dl>
      <p className="mt-3 text-xs text-slate-700">{fr.recommended_action}</p>
    </article>
  );
}
