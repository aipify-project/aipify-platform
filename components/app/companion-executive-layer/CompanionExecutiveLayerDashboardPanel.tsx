"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  parseExecutiveCompanionDashboard,
  parseExecutiveCompanionIntelligence,
  parseExecutiveCompanionPriorities,
  parseExecutiveCompanionRelationships,
  type CompanionExecutiveLayerLabels,
  type ExecutiveCompanionDashboard,
  type ExecutiveInsight,
  type IntelligenceModule,
} from "@/lib/aipify/companion-executive-layer";

type Props = { labels: CompanionExecutiveLayerLabels };

const LAYER = "layer=companion";

export function CompanionExecutiveLayerDashboardPanel({ labels }: Props) {
  const [data, setData] = useState<ExecutiveCompanionDashboard | null>(null);
  const [priorities, setPriorities] = useState<ReturnType<typeof parseExecutiveCompanionPriorities> | null>(null);
  const [relationships, setRelationships] = useState<ReturnType<typeof parseExecutiveCompanionRelationships> | null>(null);
  const [intelligence, setIntelligence] = useState<{ modules: IntelligenceModule[]; decision_support: ExecutiveInsight[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [workspace, setWorkspace] = useState("organization");
  const [generating, setGenerating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const p = new URLSearchParams({ layer: "companion", workspace });
    if (search.trim()) p.set("search", search.trim());

    const [dashRes, priRes, relRes, intRes] = await Promise.all([
      fetch(`/api/aipify/executive-companion?${p}`),
      fetch("/api/aipify/executive-companion/priorities?limit=5"),
      fetch("/api/aipify/executive-companion/relationships"),
      fetch("/api/aipify/executive-companion/intelligence"),
    ]);

    if (dashRes.ok) {
      setData(parseExecutiveCompanionDashboard(await dashRes.json()));
    } else {
      const b = (await dashRes.json()) as { error?: string };
      setError(b.error ?? labels.accessDenied);
      setData(null);
    }
    if (priRes.ok) setPriorities(parseExecutiveCompanionPriorities(await priRes.json()));
    if (relRes.ok) setRelationships(parseExecutiveCompanionRelationships(await relRes.json()));
    if (intRes.ok) {
      const i = parseExecutiveCompanionIntelligence(await intRes.json());
      setIntelligence({ modules: i.modules, decision_support: i.decision_support });
    }
    setLoading(false);
  }, [search, workspace, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function generateBriefing() {
    setGenerating(true);
    await fetch(`/api/aipify/executive-companion?${LAYER}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ period: "today" }),
    });
    setGenerating(false);
    void load();
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
    return <p className="text-sm text-slate-600">{labels.accessDenied}</p>;
  }

  const empty = !data?.has_briefing && (data?.priorities?.length ?? 0) === 0;

  return (
    <div className="space-y-8">
      <p className="rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-slate-800">{labels.principle}</p>
      <p className="text-sm text-slate-600">{labels.goldenRule}: {data?.golden_rule ?? labels.goldenRule}</p>
      {data?.privacy_note ? <p className="text-sm text-slate-600">{labels.privacyNote}</p> : null}

      {empty ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{labels.emptyTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{labels.emptyBody}</p>
          <button type="button" disabled={generating} onClick={() => void generateBriefing()}
            className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50">
            {labels.emptyCta}
          </button>
        </section>
      ) : (
        <>
          {data?.daily_opening ? (
            <Section title={labels.sections.dailyOpening}>
              <p className="whitespace-pre-line text-sm text-slate-700">{data.daily_opening}</p>
            </Section>
          ) : null}

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
            <ScoreCard label={labels.dashboard.executiveHealthScore} value={data?.executive_health_score ?? 0} />
            <ScoreCard label={labels.dashboard.organizationalHealthScore} value={data?.organizational_health_score ?? 0} />
            <ScoreCard label={labels.dashboard.executiveReadinessScore} value={data?.executive_readiness_score ?? 0} />
            <ScoreCard label={labels.dashboard.todaysPriorities} value={data?.priorities?.length ?? 0} />
            <ScoreCard label={labels.dashboard.strategicOpportunities} value={data?.opportunity_count ?? 0} />
            <ScoreCard label={labels.dashboard.emergingRisks} value={data?.risk_count ?? 0} />
            <ScoreCard label={labels.dashboard.relationshipInsights} value={relationships?.relationships.length ?? 0} />
            <ScoreCard label={labels.dashboard.executiveSummary} text={data?.executive_summary ? "Ready" : "—"} />
          </section>
        </>
      )}

      {(priorities?.priorities.length ?? 0) > 0 ? (
        <Section title={labels.sections.focusEngine}>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
            {priorities!.priorities.map((p) => (
              <li key={p.id}>
                <span className="font-medium">{p.title}</span>
                <span className="text-slate-500"> · {labels.focusAreas[p.focus_area as keyof typeof labels.focusAreas] ?? p.focus_area}</span>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}

      {(data?.actions?.length ?? 0) > 0 ? (
        <Section title={labels.sections.actionCenter}>
          <div className="grid gap-3 lg:grid-cols-2">
            {data!.actions!.map((a) => (
              <article key={a.id} className="rounded-lg border border-slate-100 p-4 text-sm">
                <h3 className="font-medium text-slate-900">{a.title}</h3>
                <p className="mt-1 text-slate-600">{a.description}</p>
              </article>
            ))}
          </div>
        </Section>
      ) : null}

      {(data?.insights?.length ?? 0) > 0 ? (
        <Section title={labels.sections.decisionSupport}>
          <div className="grid gap-3 lg:grid-cols-2">
            {data!.insights!.map((ins, idx) => (
              <InsightCard key={ins.id ?? idx} insight={ins} labels={labels} />
            ))}
          </div>
        </Section>
      ) : null}

      {(relationships?.relationships.length ?? 0) > 0 ? (
        <Section title={labels.sections.relationships}>
          <ul className="space-y-2 text-sm text-slate-700">
            {relationships!.relationships.map((r, i) => (
              <li key={String(r.id ?? i)}>
                {String(r.contact_name ?? r.title ?? "Contact")} · {String(r.insight ?? r.organization_name ?? "")}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {(intelligence?.modules.length ?? 0) > 0 ? (
        <Section title={labels.sections.intelligence}>
          <ul className="grid gap-2 sm:grid-cols-2 text-sm text-slate-700">
            {intelligence!.modules.map((m) => (
              <li key={m.key} className="rounded-md border border-slate-100 px-3 py-2">
                <span className="font-medium capitalize">{m.key.replace(/_/g, " ")}</span>
                {m.summary ? <p className="mt-1 text-slate-600">{m.summary}</p> : null}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {data?.executive_summary ? (
        <Section title={labels.sections.executiveBriefing}>
          <p className="text-sm text-slate-700">{data.executive_summary}</p>
          {data.organizational_summary ? (
            <p className="mt-2 text-sm text-slate-600">{data.organizational_summary}</p>
          ) : null}
        </Section>
      ) : null}

      <section className="flex flex-wrap gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder={labels.filters.search}
          className="min-w-[12rem] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={workspace} onChange={(e) => setWorkspace(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          {Object.entries(labels.workspaces).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <button type="button" disabled={generating} onClick={() => void generateBriefing()}
          className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-800 disabled:opacity-50">
          {labels.actions.generateBriefing}
        </button>
      </section>

      {(data?.timeline?.length ?? 0) > 0 ? (
        <Section title={labels.sections.timeline}>
          <ul className="space-y-2 text-sm text-slate-700">
            {data!.timeline!.map((e) => (
              <li key={e.id}>{e.description} · {new Date(e.created_at).toLocaleDateString()}</li>
            ))}
          </ul>
        </Section>
      ) : null}

      {data?.usage_example ? (
        <Section title={labels.sections.usageExamples}>
          <p className="text-sm italic text-slate-700">{data.usage_example}</p>
        </Section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold">{labels.faq.title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div><dt className="font-medium">{labels.faq.whatIs}</dt><dd className="mt-1 text-slate-600">{labels.faq.whatIsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.makesDecisions}</dt><dd className="mt-1 text-slate-600">{labels.faq.makesDecisionsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.whyUse}</dt><dd className="mt-1 text-slate-600">{labels.faq.whyUseAnswer}</dd></div>
        </dl>
      </section>
    </div>
  );
}

function ScoreCard({ label, value, text }: { label: string; value?: number; text?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-indigo-700">{text ?? value ?? "—"}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-semibold text-slate-900">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function InsightCard({ insight, labels }: { insight: ExecutiveInsight; labels: CompanionExecutiveLayerLabels }) {
  return (
    <article className="rounded-lg border border-slate-100 p-4 text-sm">
      <p className="font-medium text-slate-900">{insight.observation}</p>
      {insight.explanation ? <p className="mt-1 text-slate-600">{labels.card.explanation}: {insight.explanation}</p> : null}
      <dl className="mt-2 grid gap-1 text-xs text-slate-500">
        <div><dt className="inline">{labels.card.impact}: </dt><dd className="inline">{insight.impact}</dd></div>
        <div><dt className="inline">{labels.card.recommendation}: </dt><dd className="inline">{insight.recommendation}</dd></div>
        <div><dt className="inline">{labels.card.effort}: </dt><dd className="inline">{insight.effort}</dd></div>
        <div><dt className="inline">{labels.card.potentialValue}: </dt><dd className="inline">{insight.potential_value}</dd></div>
      </dl>
    </article>
  );
}
