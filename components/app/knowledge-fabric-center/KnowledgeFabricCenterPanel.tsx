"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseKnowledgeFabricCenter,
  trustLevelLabel,
  type KnowledgeFabricCenter,
} from "@/lib/knowledge-fabric-center-engine/parse";
import type { Kftw597Section } from "@/lib/knowledge-fabric-center-engine/config";
import { kftw597SectionToRpc } from "@/lib/knowledge-fabric-center-engine/config";
import type { buildKnowledgeFabricCenterLabels } from "@/lib/knowledge-fabric-center-engine/labels";

type Labels = ReturnType<typeof buildKnowledgeFabricCenterLabels>;

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function ItemCard({
  title,
  summary,
  badge,
  extra,
}: {
  title: string;
  summary?: string;
  badge?: string;
  extra?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-semibold text-zinc-900">{title}</p>
        {badge ? (
          <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium capitalize text-zinc-700">
            {badge.replace(/_/g, " ")}
          </span>
        ) : null}
      </div>
      {summary ? <p className="mt-2 text-sm text-zinc-600">{summary}</p> : null}
      {extra}
    </div>
  );
}

export function KnowledgeFabricCenterPanel({
  labels,
  activeSection,
}: {
  labels: Labels;
  activeSection: Kftw597Section;
}) {
  const [center, setCenter] = useState<KnowledgeFabricCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const rpcSection = kftw597SectionToRpc(activeSection);
    const res = await fetch(`/api/knowledge-fabric-center/center?section=${rpcSection}`);
    if (res.ok) setCenter(parseKnowledgeFabricCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, [activeSection]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
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
  const exec = center.executive_dashboard ?? {};

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">{labels.sections[activeSection]}</h2>
          {center.privacy_note ? <p className="mt-1 text-xs text-zinc-500">{center.privacy_note}</p> : null}
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          {labels.refresh}
        </button>
      </div>

      {center.principle ? (
        <p className="rounded-2xl border border-violet-100 bg-violet-50/70 px-5 py-4 text-sm text-violet-950">
          {center.principle}
        </p>
      ) : null}

      {(activeSection === "overview" || activeSection === "reports") && (
        <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/80 to-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-600">{labels.executiveDashboard}</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label={labels.executive.knowledgeHealth} value={exec.knowledge_health ?? 0} />
            <StatCard label={labels.executive.avgTrustScore} value={exec.avg_trust_score ?? 0} />
            <StatCard label={labels.executive.openConflicts} value={exec.open_conflicts ?? 0} />
            <StatCard label={labels.executive.pendingReviews} value={exec.pending_reviews ?? 0} />
            <StatCard label={labels.executive.decaySignals} value={exec.decay_signals ?? 0} />
            <StatCard label={labels.executive.criticalRisks} value={exec.critical_risks ?? 0} />
          </div>
        </section>
      )}

      {activeSection === "overview" && (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label={labels.stats.sources} value={stats.sources ?? 0} />
            <StatCard label={labels.stats.knowledge} value={stats.knowledge ?? 0} />
            <StatCard label={labels.stats.conflicts} value={stats.conflicts ?? 0} />
            <StatCard label={labels.stats.trustScores} value={stats.trust_scores ?? 0} />
            <StatCard label={labels.stats.reviews} value={stats.reviews ?? 0} />
            <StatCard label={labels.stats.wisdomItems} value={stats.wisdom_items ?? 0} />
          </section>
          {(center.companion_recommendations?.length ?? 0) > 0 && (
            <section className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.companionRecommendations}</h3>
              {(center.companion_recommendations ?? []).map((rec, i) => (
                <ItemCard
                  key={i}
                  title={String(rec.conflict_title ?? "Insight")}
                  summary={String(rec.recommendation ?? "")}
                />
              ))}
            </section>
          )}
        </>
      )}

      {activeSection === "sources" && (
        <section className="grid gap-3 sm:grid-cols-2">
          {(center.sources ?? []).map((s) => (
            <ItemCard
              key={String(s.source_key)}
              title={String(s.source_title)}
              summary={String(s.summary ?? "")}
              badge={String(s.source_type ?? "")}
            />
          ))}
        </section>
      )}

      {activeSection === "knowledge" && (
        <section className="space-y-6">
          <div className="grid gap-3">
            {(center.knowledge ?? []).map((k) => (
              <ItemCard
                key={String(k.knowledge_key)}
                title={String(k.knowledge_title)}
                summary={String(k.summary ?? "")}
                badge={String(k.knowledge_type ?? "")}
              />
            ))}
          </div>
          {(center.wisdom_library ?? []).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.wisdomLibrary}</h3>
              {(center.wisdom_library ?? []).map((w) => (
                <ItemCard
                  key={String(w.wisdom_key)}
                  title={String(w.wisdom_title)}
                  summary={String(w.summary ?? "")}
                  badge={String(w.wisdom_type ?? "")}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {activeSection === "conflicts" && (
        <section className="space-y-3">
          <h3 className="font-semibold text-zinc-900">{labels.conflictDetection}</h3>
          {(center.conflicts ?? []).map((c) => (
            <ItemCard
              key={String(c.conflict_key)}
              title={String(c.conflict_title)}
              summary={String(c.summary ?? "")}
              badge={String(c.conflict_type ?? "")}
            />
          ))}
        </section>
      )}

      {activeSection === "trust" && (
        <section className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-zinc-900">{labels.trustScores}</h3>
            {(center.trust_scores ?? []).map((t) => (
              <ItemCard
                key={String(t.trust_key)}
                title={String(t.trust_title)}
                summary={String(t.summary ?? "")}
                badge={trustLevelLabel(String(t.trust_level ?? ""))}
                extra={<p className="mt-1 text-xs text-zinc-500">Score: {String(t.trust_score ?? 0)}</p>}
              />
            ))}
          </div>
          {(center.reliability_metrics ?? []).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.reliabilityEngine}</h3>
              {(center.reliability_metrics ?? []).map((m) => (
                <ItemCard
                  key={String(m.metric_key)}
                  title={String(m.metric_title)}
                  summary={String(m.summary ?? "")}
                  badge={String(m.metric_score ?? 0)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {activeSection === "reviews" && (
        <section className="grid gap-3">
          <h3 className="font-semibold text-zinc-900">{labels.reviewEngine}</h3>
          {(center.reviews ?? []).map((r) => (
            <ItemCard
              key={String(r.review_key)}
              title={String(r.review_title)}
              summary={String(r.summary ?? "")}
              badge={String(r.review_cycle ?? "")}
              extra={r.due_at ? <p className="mt-1 text-xs text-zinc-500">Due: {String(r.due_at)}</p> : null}
            />
          ))}
        </section>
      )}

      {activeSection === "insights" && (
        <section className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-zinc-900">{labels.knowledgeLineage}</h3>
            {(center.lineage ?? []).map((l) => (
              <ItemCard
                key={String(l.lineage_key)}
                title={String(l.lineage_title)}
                summary={String(l.summary ?? "")}
                badge={String(l.lineage_stage ?? "")}
              />
            ))}
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-zinc-900">{labels.decayDetection}</h3>
            {(center.decay_signals ?? []).map((d) => (
              <ItemCard
                key={String(d.decay_key)}
                title={String(d.decay_title)}
                summary={String(d.summary ?? "")}
                badge={String(d.decay_type ?? "")}
                extra={
                  d.months_since_review != null ? (
                    <p className="mt-1 text-xs text-zinc-500">{String(d.months_since_review)} months since review</p>
                  ) : null
                }
              />
            ))}
          </div>
        </section>
      )}

      {activeSection === "reports" && (
        <section className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-zinc-900">{labels.truthAdvisor}</h3>
            {Object.entries(center.reports ?? {}).map(([key, prompt]) => (
              <ItemCard key={key} title={String(prompt)} badge={key.replace(/_/g, " ")} />
            ))}
          </div>
          {(center.business_packs ?? []).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.businessPackIntegration}</h3>
              {(center.business_packs ?? []).map((pack) => (
                <ItemCard
                  key={String(pack.pack_key)}
                  title={String(pack.pack_title)}
                  summary={String(pack.summary ?? "")}
                  badge={`${String(pack.knowledge_count ?? 0)} knowledge · ${String(pack.policies_count ?? 0)} policies`}
                />
              ))}
            </div>
          )}
          {(center.audit_recent ?? []).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-900">Audit</h3>
              {(center.audit_recent ?? []).map((entry, i) => (
                <ItemCard
                  key={i}
                  title={String(entry.event_type ?? "")}
                  summary={String(entry.summary ?? "")}
                  extra={entry.created_at ? <p className="mt-1 text-xs text-zinc-500">{String(entry.created_at)}</p> : null}
                />
              ))}
            </div>
          )}
          {center.mobile_access && (
            <div className="rounded-xl border border-violet-100 bg-violet-50/50 p-4">
              <h3 className="font-semibold text-zinc-900">{labels.mobileAccess}</h3>
              <ul className="mt-2 flex flex-wrap gap-2 text-sm text-zinc-700">
                {Object.entries(center.mobile_access).map(([cap, enabled]) => (
                  <li key={cap} className="rounded-full bg-white px-3 py-1 ring-1 ring-violet-100">
                    {cap.replace(/_/g, " ")}: {enabled === true ? "✓" : "—"}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
