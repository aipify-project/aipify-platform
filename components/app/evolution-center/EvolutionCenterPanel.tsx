"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { parseEvolutionCenter, type EvolutionCenter } from "@/lib/evolution-center-engine/parse";
import type { Ce600Section } from "@/lib/evolution-center-engine/config";
import { ce600SectionToRpc } from "@/lib/evolution-center-engine/config";
import type { buildEvolutionCenterLabels } from "@/lib/evolution-center-engine/labels";

type Labels = ReturnType<typeof buildEvolutionCenterLabels>;

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

function ItemGrid({
  title,
  items,
  titleKey,
  badgeKey,
  summaryKey,
}: {
  title: string;
  items: Record<string, unknown>[];
  titleKey: string;
  badgeKey?: string;
  summaryKey?: string;
}) {
  if (!items.length) return null;
  return (
    <section className="space-y-3">
      <h3 className="font-semibold text-zinc-900">{title}</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item, idx) => {
          const keyField = Object.keys(item).find((k) => k.endsWith("_key"));
          return (
            <ItemCard
              key={keyField ? String(item[keyField]) : idx}
              title={String(item[titleKey] ?? "")}
              summary={summaryKey ? String(item[summaryKey] ?? "") : undefined}
              badge={badgeKey ? String(item[badgeKey] ?? "") : undefined}
            />
          );
        })}
      </div>
    </section>
  );
}

export function EvolutionCenterPanel({
  labels,
  activeSection,
}: {
  labels: Labels;
  activeSection: Ce600Section;
}) {
  const [center, setCenter] = useState<EvolutionCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const rpcSection = ce600SectionToRpc(activeSection);
    const res = await fetch(`/api/evolution-center/center?section=${rpcSection}`);
    if (res.ok) setCenter(parseEvolutionCenter(await res.json()));
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
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-600">
            {labels.executiveDashboard}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label={labels.executive.platformHealthScore} value={exec.platform_health_score ?? 0} />
            <StatCard label={labels.executive.completedPhases} value={exec.completed_phases ?? 0} />
            <StatCard label={labels.executive.plannedPhases} value={exec.planned_phases ?? 0} />
            <StatCard label={labels.executive.innovationPipeline} value={exec.innovation_pipeline ?? 0} />
            <StatCard label={labels.executive.futureOpportunities} value={exec.future_opportunities ?? 0} />
            <StatCard label={labels.executive.openRequests} value={exec.open_requests ?? 0} />
          </div>
        </section>
      )}

      {activeSection === "overview" && (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label={labels.stats.platformPhases} value={stats.platform_phases ?? 0} />
            <StatCard label={labels.stats.companionEvolution} value={stats.companion_evolution ?? 0} />
            <StatCard label={labels.stats.innovationItems} value={stats.innovation_items ?? 0} />
            <StatCard label={labels.stats.opportunities} value={stats.opportunities ?? 0} />
            <StatCard label={labels.stats.capabilities} value={stats.capabilities ?? 0} />
            <StatCard label={labels.stats.packEvolution} value={stats.pack_evolution ?? 0} />
          </section>
          {(center.self_assessment?.length ?? 0) > 0 && (
            <ItemGrid
              title={labels.platformSelfAssessment}
              items={center.self_assessment ?? []}
              titleKey="assessment_title"
              badgeKey="assessment_score"
              summaryKey="summary"
            />
          )}
          {(center.companion_recommendations?.length ?? 0) > 0 && (
            <section className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.companionRecommendations}</h3>
              {(center.companion_recommendations ?? []).map((rec, i) => (
                <ItemCard
                  key={i}
                  title={String(rec.opportunity_title ?? "Insight")}
                  summary={String(rec.recommendation ?? "")}
                  badge={String(rec.opportunity_type ?? "")}
                />
              ))}
            </section>
          )}
          {center.foundation_milestone && (
            <section className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
              <h3 className="font-semibold text-zinc-900">{labels.foundationMilestone}</h3>
              <ul className="mt-2 flex flex-wrap gap-2 text-sm text-zinc-700">
                {Object.entries(center.foundation_milestone).map(([key, enabled]) => (
                  <li key={key} className="rounded-full bg-white px-3 py-1 ring-1 ring-emerald-100">
                    {key.replace(/_/g, " ")}: {enabled ? "✓" : "—"}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      {activeSection === "platform" && (
        <section className="space-y-6">
          <ItemGrid
            title={labels.platformEvolution}
            items={center.platform_phases ?? []}
            titleKey="phase_title"
            badgeKey="phase_type"
            summaryKey="summary"
          />
          <ItemGrid
            title={labels.innovationPipeline}
            items={center.innovation_pipeline ?? []}
            titleKey="pipeline_title"
            badgeKey="pipeline_stage"
            summaryKey="summary"
          />
          <ItemGrid
            title={labels.platformSelfAssessment}
            items={center.self_assessment ?? []}
            titleKey="assessment_title"
            badgeKey="assessment_score"
            summaryKey="summary"
          />
          <ItemGrid
            title={labels.platformStewardship}
            items={center.stewardship ?? []}
            titleKey="stewardship_title"
            badgeKey="debt_level"
            summaryKey="summary"
          />
        </section>
      )}

      {activeSection === "companion" && (
        <section className="space-y-6">
          <ItemGrid
            title={labels.companionEvolution}
            items={center.companion_evolution ?? []}
            titleKey="evolution_title"
            badgeKey="evolution_status"
            summaryKey="summary"
          />
          <ItemGrid
            title={labels.readinessReviews}
            items={center.readiness_reviews ?? []}
            titleKey="readiness_title"
            badgeKey="readiness_score"
            summaryKey="summary"
          />
        </section>
      )}

      {activeSection === "businessPacks" && (
        <ItemGrid
          title={labels.businessPackEvolution}
          items={center.pack_evolution ?? []}
          titleKey="pack_title"
          badgeKey="pack_evolution_type"
          summaryKey="summary"
        />
      )}

      {activeSection === "roadmaps" && (
        <section className="space-y-6">
          <ItemGrid
            title={labels.capabilityRoadmap}
            items={center.capability_roadmap ?? []}
            titleKey="capability_title"
            badgeKey="capability_status"
            summaryKey="summary"
          />
          <ItemGrid
            title={labels.platformEvolution}
            items={(center.platform_phases ?? []).filter((p) =>
              ["planned_phase", "completed_phase"].includes(String(p.phase_type))
            )}
            titleKey="phase_title"
            badgeKey="phase_type"
            summaryKey="summary"
          />
        </section>
      )}

      {activeSection === "recommendations" && (
        <section className="space-y-6">
          <ItemGrid
            title={labels.companionRecommendations}
            items={center.future_opportunities ?? []}
            titleKey="opportunity_title"
            badgeKey="opportunity_type"
            summaryKey="summary"
          />
          <ItemGrid
            title={labels.platformEvolution}
            items={(center.platform_phases ?? []).filter((p) =>
              ["customer_request", "partner_request", "requested_feature"].includes(String(p.phase_type))
            )}
            titleKey="phase_title"
            badgeKey="phase_type"
            summaryKey="summary"
          />
        </section>
      )}

      {activeSection === "opportunities" && (
        <ItemGrid
          title={labels.futureOpportunityEngine}
          items={center.future_opportunities ?? []}
          titleKey="opportunity_title"
          badgeKey="opportunity_type"
          summaryKey="summary"
        />
      )}

      {activeSection === "reports" && (
        <section className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-zinc-900">{labels.futureAdvisor}</h3>
            {Object.entries(center.reports ?? {}).map(([key, prompt]) => (
              <ItemCard key={key} title={String(prompt)} badge={key.replace(/_/g, " ")} />
            ))}
          </div>
          <ItemGrid
            title={labels.enterpriseProgram}
            items={center.enterprise_program ?? []}
            titleKey="program_title"
            badgeKey="program_type"
            summaryKey="summary"
          />
          {(center.audit_recent?.length ?? 0) > 0 && (
            <section className="space-y-3">
              <h3 className="font-semibold text-zinc-900">Audit</h3>
              {(center.audit_recent ?? []).map((entry, i) => (
                <ItemCard
                  key={i}
                  title={String(entry.event_type ?? "")}
                  summary={String(entry.summary ?? "")}
                  extra={
                    entry.created_at ? (
                      <p className="mt-1 text-xs text-zinc-500">{String(entry.created_at)}</p>
                    ) : null
                  }
                />
              ))}
            </section>
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
