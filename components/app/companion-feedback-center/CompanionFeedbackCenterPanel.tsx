"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseFeedbackCenter,
  ratingLevelLabel,
  type FeedbackCenter,
} from "@/lib/companion-feedback-center-engine/parse";
import type { Cife596Section } from "@/lib/companion-feedback-center-engine/config";
import { cife596SectionToRpc } from "@/lib/companion-feedback-center-engine/config";
import type { buildCompanionFeedbackCenterLabels } from "@/lib/companion-feedback-center-engine/labels";

type Labels = ReturnType<typeof buildCompanionFeedbackCenterLabels>;

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

function ratingBadge(level: string): string {
  const label = ratingLevelLabel(level);
  if (level === "excellent" || level === "positive") return label;
  if (level === "mixed") return `Mixed · ${label}`;
  return `Improvement · ${label}`;
}

export function CompanionFeedbackCenterPanel({
  labels,
  activeSection,
}: {
  labels: Labels;
  activeSection: Cife596Section;
}) {
  const [center, setCenter] = useState<FeedbackCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const rpcSection = cife596SectionToRpc(activeSection);
    const res = await fetch(`/api/companion-feedback-center/center?section=${rpcSection}`);
    if (res.ok) setCenter(parseFeedbackCenter(await res.json()));
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
            <StatCard label={labels.executive.companionSatisfaction} value={exec.companion_satisfaction ?? 0} />
            <StatCard label={labels.executive.companionQuality} value={exec.companion_quality ?? 0} />
            <StatCard label={labels.executive.openFeedback} value={exec.open_feedback ?? 0} />
            <StatCard label={labels.executive.improvementOpportunities} value={exec.improvement_opportunities ?? 0} />
            <StatCard label={labels.executive.featureRequests} value={exec.feature_requests ?? 0} />
            <StatCard label={labels.executive.knowledgeGaps} value={exec.knowledge_gaps ?? 0} />
          </div>
        </section>
      )}

      {activeSection === "overview" && (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label={labels.stats.feedback} value={stats.feedback ?? 0} />
            <StatCard label={labels.stats.suggestions} value={stats.suggestions ?? 0} />
            <StatCard label={labels.stats.ratings} value={stats.ratings ?? 0} />
            <StatCard label={labels.stats.experienceSignals} value={stats.experience_signals ?? 0} />
            <StatCard label={labels.stats.improvements} value={stats.improvements ?? 0} />
            <StatCard label={labels.stats.qualityMetrics} value={stats.quality_metrics ?? 0} />
          </section>
          {(center.companion_recommendations?.length ?? 0) > 0 && (
            <section className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.companionRecommendations}</h3>
              {(center.companion_recommendations ?? []).map((rec, i) => (
                <ItemCard
                  key={i}
                  title={String(rec.improvement_title ?? "Insight")}
                  summary={String(rec.recommendation ?? "")}
                />
              ))}
            </section>
          )}
        </>
      )}

      {activeSection === "feedback" && (
        <section className="grid gap-3 sm:grid-cols-2">
          {(center.feedback ?? []).length === 0 ? (
            <p className="text-sm text-zinc-600">{labels.noRecords}</p>
          ) : (
            (center.feedback ?? []).map((f) => (
              <ItemCard
                key={String(f.feedback_key)}
                title={String(f.feedback_title)}
                summary={String(f.summary ?? "")}
                badge={String(f.feedback_type ?? "")}
              />
            ))
          )}
        </section>
      )}

      {activeSection === "suggestions" && (
        <section className="grid gap-3">
          {(center.suggestions ?? []).map((s) => (
            <ItemCard
              key={String(s.suggestion_key)}
              title={String(s.suggestion_title)}
              summary={String(s.summary ?? "")}
              badge={String(s.suggestion_status ?? "")}
            />
          ))}
        </section>
      )}

      {activeSection === "ratings" && (
        <section className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2">
            {(center.ratings ?? []).map((r) => (
              <ItemCard
                key={String(r.rating_key)}
                title={String(r.rating_title)}
                summary={String(r.summary ?? "")}
                badge={ratingBadge(String(r.rating_level ?? ""))}
                extra={<p className="mt-1 text-xs text-zinc-500">Score: {String(r.score ?? 0)}</p>}
              />
            ))}
          </div>
          {(center.quality_metrics ?? []).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.companionQuality}</h3>
              {(center.quality_metrics ?? []).map((m) => (
                <ItemCard
                  key={String(m.metric_key)}
                  title={String(m.metric_title)}
                  summary={String(m.summary ?? "")}
                  badge={`${String(m.metric_score ?? 0)}`}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {activeSection === "insights" && (
        <section className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-zinc-900">{labels.experienceSignals}</h3>
            {(center.experience_signals ?? []).map((s) => (
              <ItemCard
                key={String(s.signal_key)}
                title={String(s.signal_title)}
                summary={String(s.summary ?? "")}
                badge={`count ${String(s.signal_count ?? 0)}`}
              />
            ))}
          </div>
          {(center.feedback_loops ?? []).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.feedbackLoops}</h3>
              {(center.feedback_loops ?? []).map((l) => (
                <ItemCard
                  key={String(l.loop_key)}
                  title={String(l.loop_title)}
                  summary={String(l.summary ?? "")}
                  badge={String(l.loop_stage ?? "")}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {activeSection === "improvements" && (
        <section className="space-y-6">
          <div className="grid gap-3">
            {(center.improvements ?? []).map((i) => (
              <ItemCard
                key={String(i.improvement_key)}
                title={String(i.improvement_title)}
                summary={String(i.summary ?? "")}
                badge={String(i.improvement_type ?? "")}
              />
            ))}
          </div>
          {(center.knowledge_gaps ?? []).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.knowledgeImprovement}</h3>
              {(center.knowledge_gaps ?? []).map((g) => (
                <ItemCard
                  key={String(g.gap_key)}
                  title={String(g.gap_title)}
                  summary={String(g.summary ?? "")}
                  badge={String(g.gap_type ?? "")}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {activeSection === "reports" && (
        <section className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-zinc-900">{labels.experienceAdvisor}</h3>
            {Object.entries(center.reports ?? {}).map(([key, prompt]) => (
              <ItemCard key={key} title={String(prompt)} badge={key.replace(/_/g, " ")} />
            ))}
          </div>
          {(center.feature_requests ?? []).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.featureRequests}</h3>
              {(center.feature_requests ?? []).map((r) => (
                <ItemCard
                  key={String(r.request_key)}
                  title={String(r.request_title)}
                  summary={String(r.summary ?? "")}
                  badge={String(r.request_source ?? "")}
                />
              ))}
            </div>
          )}
          {(center.business_packs ?? []).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.businessPackIntegration}</h3>
              {(center.business_packs ?? []).map((pack) => (
                <ItemCard
                  key={String(pack.pack_key)}
                  title={String(pack.pack_title)}
                  summary={String(pack.summary ?? "")}
                  badge={`${String(pack.feedback_count ?? 0)} feedback · ${String(pack.satisfaction_score ?? 0)} sat.`}
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
