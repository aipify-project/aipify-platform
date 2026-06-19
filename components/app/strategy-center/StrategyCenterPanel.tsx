"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { parseStrategyCenter, type StrategyCenter } from "@/lib/strategy-center-engine/parse";
import type { Sibo589Section } from "@/lib/strategy-center-engine/config";
import type { buildStrategyCenterLabels } from "@/lib/strategy-center-engine/labels";

type Labels = ReturnType<typeof buildStrategyCenterLabels>;

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function ItemCard({ title, summary, badge, extra }: { title: string; summary?: string; badge?: string; extra?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-semibold text-zinc-900">{title}</p>
        {badge ? <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium capitalize text-zinc-700">{badge.replace(/_/g, " ")}</span> : null}
      </div>
      {summary ? <p className="mt-2 text-sm text-zinc-600">{summary}</p> : null}
      {extra}
    </div>
  );
}

export function StrategyCenterPanel({ labels, activeSection }: { labels: Labels; activeSection: Sibo589Section }) {
  const [center, setCenter] = useState<StrategyCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/strategy-center/center?section=${activeSection}`);
    if (res.ok) setCenter(parseStrategyCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, [activeSection]);

  useEffect(() => { void load(); }, [load]);

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered /><span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <p className="font-medium">{labels.empty}</p>
        {center?.error ? <p className="mt-2 text-sm">{center.error}</p> : null}
      </div>
    );
  }

  const stats = center.stats ?? {};

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">{labels.sections[activeSection]}</h2>
          {center.privacy_note ? <p className="mt-1 text-xs text-zinc-500">{center.privacy_note}</p> : null}
        </div>
        <button type="button" onClick={() => void load()} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50">{labels.refresh}</button>
      </div>

      {center.principle ? <p className="rounded-2xl border border-violet-100 bg-violet-50/60 px-5 py-4 text-sm text-violet-950">{center.principle}</p> : null}

      {(activeSection === "overview" || activeSection === "reports") && (
        <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/80 to-white p-6 shadow-sm">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <p className="text-xs font-medium uppercase text-zinc-500">{labels.strategicHealthScore}</p>
              <p className="mt-1 text-4xl font-bold text-violet-900">{center.strategic_health_score ?? 0}</p>
            </div>
            <StatCard label={labels.stats.activeObjectives} value={stats.active_objectives ?? 0} />
            <StatCard label={labels.stats.openRisks} value={stats.open_risks ?? 0} />
            <StatCard label={labels.stats.openOpportunities} value={stats.open_opportunities ?? 0} />
            <StatCard label={labels.stats.boardPending} value={stats.board_items_pending ?? 0} />
          </div>
        </section>
      )}

      {activeSection === "overview" && (center.companion_recommendations?.length ?? 0) > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold text-zinc-900">{labels.companionRecommendations}</h3>
          {(center.companion_recommendations ?? []).map((rec, i) => (
            <ItemCard key={i} title={String(rec.risk_title ?? "Insight")} summary={String(rec.recommendation ?? "")} />
          ))}
        </section>
      )}

      {activeSection === "objectives" && (
        <section className="grid gap-3">
          {(center.objectives ?? []).map((o) => (
            <ItemCard key={String(o.objective_key)} title={String(o.objective_title)} summary={String(o.success_criteria || o.summary || "")} badge={`${String(o.priority ?? "")} · ${String(o.objective_status ?? "")}`} extra={<p className="mt-1 text-xs text-zinc-500">{String(o.owner_label ?? "")} · {String(o.timeline_label ?? "")}</p>} />
          ))}
        </section>
      )}

      {activeSection === "initiatives" && (
        <section className="space-y-4">
          <p className="text-sm text-zinc-600">{labels.alignmentChain}</p>
          {(center.initiatives ?? []).map((a) => (
            <div key={String(a.alignment_key)} className="rounded-xl border border-violet-100 bg-white p-4 shadow-sm">
              <p className="font-semibold text-zinc-900">{String(a.initiative_title)}</p>
              <ol className="mt-3 flex flex-wrap items-center gap-2 text-sm text-zinc-600">
                <li className="rounded bg-violet-50 px-2 py-1">{String(a.objective_key ?? "objective")}</li>
                <span>→</span>
                <li className="rounded bg-zinc-50 px-2 py-1">{String(a.project_title || "project")}</li>
                <span>→</span>
                <li className="rounded bg-zinc-50 px-2 py-1">{String(a.action_title || "action")}</li>
                <span>→</span>
                <li className="rounded bg-emerald-50 px-2 py-1">{String(a.outcome_title || "outcome")}</li>
              </ol>
              {a.summary ? <p className="mt-2 text-sm text-zinc-600">{String(a.summary)}</p> : null}
            </div>
          ))}
        </section>
      )}

      {activeSection === "risks" && (
        <section className="grid gap-3">
          {(center.risks ?? []).map((r) => (
            <ItemCard key={String(r.risk_key)} title={String(r.risk_title)} summary={String(r.summary ?? "")} badge={String(r.risk_status ?? r.severity ?? "")} extra={r.companion_recommendation ? <p className="mt-2 text-sm text-violet-800">{String(r.companion_recommendation)}</p> : null} />
          ))}
        </section>
      )}

      {activeSection === "opportunities" && (
        <section className="grid gap-3 sm:grid-cols-2">
          {(center.opportunities ?? []).map((o) => (
            <ItemCard key={String(o.opportunity_key)} title={String(o.opportunity_title)} summary={String(o.summary ?? "")} badge={String(o.opportunity_type ?? o.opportunity_status ?? "")} />
          ))}
        </section>
      )}

      {activeSection === "board" && (
        <>
          <section className="grid gap-3">
            {(center.board ?? []).map((b) => (
              <ItemCard key={String(b.board_key)} title={String(b.board_title)} summary={String(b.summary ?? "")} badge={`${String(b.board_type ?? "")} · ${String(b.board_status ?? "")}`} />
            ))}
          </section>
          {(center.briefings ?? []).length > 0 && (
            <section className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.generateBriefing}</h3>
              {(center.briefings ?? []).map((b) => (
                <ItemCard key={String(b.briefing_key)} title={String(b.briefing_title)} summary={String(b.summary ?? "")} badge={String(b.briefing_status ?? "")} />
              ))}
            </section>
          )}
        </>
      )}

      {activeSection === "forecasts" && (
        <section className="grid gap-3 sm:grid-cols-2">
          {(center.forecasts ?? []).map((f) => (
            <ItemCard key={String(f.forecast_key)} title={String(f.forecast_title)} summary={String(f.summary ?? "")} badge={`${String(f.horizon ?? "")} · ${String(f.forecast_direction ?? "")}`} />
          ))}
          {(center.kpis ?? []).length > 0 && (
            <dl className="col-span-full grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(center.kpis ?? []).map((k) => (
                <StatCard key={String(k.kpi_key)} label={String(k.kpi_title)} value={`${k.kpi_value ?? 0} ${String(k.kpi_unit ?? "")}`} />
              ))}
            </dl>
          )}
        </section>
      )}

      {activeSection === "reports" && (
        <>
          {(center.planning_cycles ?? []).length > 0 && (
            <section className="grid gap-3">
              <h3 className="font-semibold text-zinc-900">{labels.stats.planningCycles}</h3>
              {(center.planning_cycles ?? []).map((c) => (
                <ItemCard key={String(c.cycle_key)} title={String(c.cycle_title)} summary={String(c.summary ?? "")} badge={String(c.cycle_status ?? c.cycle_type ?? "")} />
              ))}
            </section>
          )}
          {(center.business_packs ?? []).length > 0 && (
            <section className="grid gap-3 sm:grid-cols-2">
              {(center.business_packs ?? []).map((p) => (
                <ItemCard key={String(p.pack_key)} title={String(p.pack_title)} summary={String(p.summary ?? "")} badge={`${p.objectives_count ?? 0} obj · ${p.risks_count ?? 0} risk`} extra={<p className="mt-1 text-xs text-zinc-500">{String(p.kpi_summary ?? "")}</p>} />
              ))}
            </section>
          )}
          {center.decision_support && Object.keys(center.decision_support).length > 0 && (
            <section>
              <h3 className="mb-2 font-semibold text-zinc-900">{labels.decisionSupport}</h3>
              <ul className="flex flex-wrap gap-2">
                {Object.entries(center.decision_support).map(([key, href]) => (
                  <li key={key}><Link href={href} className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-violet-700 hover:bg-violet-50">{key.replace(/_/g, " ")}</Link></li>
                ))}
              </ul>
            </section>
          )}
          {(center.audit_recent ?? []).length > 0 && (
            <ul className="space-y-2 text-sm">
              {(center.audit_recent ?? []).map((log, i) => (
                <li key={i} className="rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2">
                  <span className="font-medium">{String(log.event_type ?? "")}</span>
                  <span className="text-zinc-600"> — {String(log.summary ?? "")}</span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <p className="text-xs text-zinc-500">{labels.privacyNote}</p>
    </div>
  );
}
