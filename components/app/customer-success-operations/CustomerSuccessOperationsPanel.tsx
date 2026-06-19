"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseCsar587OperationsCenter,
  type Csar587OperationsCenter,
} from "@/lib/customer-success-operations/csar587-parse";
import type { Csar587CustomerSection } from "@/lib/customer-success-operations/config";
import type { buildCsar587CustomerLabels } from "@/lib/customer-success-operations/labels";

type Labels = ReturnType<typeof buildCsar587CustomerLabels>;

type Props = {
  labels: Labels;
  activeSection: Csar587CustomerSection;
};

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

function healthBandClass(status?: string) {
  if (status === "healthy") return "text-emerald-700 bg-emerald-50 ring-emerald-200";
  if (status === "attention_required") return "text-amber-800 bg-amber-50 ring-amber-200";
  return "text-red-800 bg-red-50 ring-red-200";
}

export function CustomerSuccessOperationsPanel({ labels, activeSection }: Props) {
  const [center, setCenter] = useState<Csar587OperationsCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/customer-success/operations?section=${activeSection}`);
    if (res.ok) setCenter(parseCsar587OperationsCenter(await res.json()));
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

  const sectionTitle = labels.sections[activeSection] ?? labels.title;
  const stats = center.stats ?? {};
  const healthBand =
    labels.healthBand[center.health_status as keyof typeof labels.healthBand] ??
    center.health_status_label;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">{sectionTitle}</h2>
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
        <p className="rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-indigo-950">
          {center.principle}
        </p>
      ) : null}

      {(activeSection === "overview" || activeSection === "executive") && (
        <section className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-white p-6 shadow-sm">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs font-medium uppercase text-zinc-500">{labels.healthScore}</p>
              <p className="mt-1 text-4xl font-bold text-indigo-900">{center.health_score ?? 0}</p>
              <span
                className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${healthBandClass(center.health_status)}`}
              >
                {healthBand}
              </span>
            </div>
            <StatCard label={labels.stats.openRisks} value={stats.open_risks ?? 0} />
            <StatCard label={labels.stats.openOpportunities} value={stats.open_opportunities ?? 0} />
            <StatCard
              label={labels.stats.onboardingProgress}
              value={`${stats.onboarding_completed ?? 0}/${stats.onboarding_total ?? 0}`}
            />
          </div>
        </section>
      )}

      {activeSection === "overview" && (center.companion_recommendations?.length ?? 0) > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold text-zinc-900">{labels.companionRecommendations}</h3>
          {(center.companion_recommendations ?? []).map((rec, i) => (
            <ItemCard
              key={i}
              title={String(rec.risk_title ?? "Recommendation")}
              summary={String(rec.recommendation ?? "")}
            />
          ))}
        </section>
      )}

      {(activeSection === "onboarding" || activeSection === "executive") && (
        <section className="grid gap-3">
          <h3 className="font-semibold text-zinc-900">{labels.sections.onboarding}</h3>
          {(center.onboarding ?? []).length === 0 ? (
            <p className="text-sm text-zinc-500">{labels.noRecords}</p>
          ) : (
            (center.onboarding ?? []).map((m) => (
              <ItemCard
                key={String(m.milestone_key)}
                title={String(m.milestone_title ?? "")}
                summary={String(m.summary ?? "")}
                badge={String(m.milestone_status ?? "")}
              />
            ))
          )}
        </section>
      )}

      {(activeSection === "health" || activeSection === "executive") && center.health && (
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["login_activity_score", "Login Activity"],
            ["companion_usage_score", "Companion Usage"],
            ["business_pack_usage_score", "Business Pack Usage"],
            ["user_adoption_score", "User Adoption"],
            ["workflow_activity_score", "Workflow Activity"],
            ["knowledge_activity_score", "Knowledge Activity"],
            ["support_activity_score", "Support Activity"],
            ["renewal_risk_score", "Renewal Risk"],
          ].map(([key, title]) => (
            <StatCard
              key={key}
              label={title}
              value={Number((center.health as Record<string, unknown>)[key] ?? 0)}
            />
          ))}
        </section>
      )}

      {(activeSection === "adoption" || activeSection === "executive") && (
        <section className="grid gap-3 sm:grid-cols-2">
          {(center.adoption ?? []).map((a) => (
            <ItemCard
              key={String(a.metric_key)}
              title={String(a.metric_title ?? "")}
              summary={String(a.summary ?? "")}
              badge={`${a.adoption_pct ?? 0}% · ${String(a.trend_label ?? "")}`}
            />
          ))}
          {(center.business_packs ?? []).map((b) => (
            <ItemCard
              key={String(b.pack_key)}
              title={String(b.pack_title ?? "")}
              summary={String(b.usage_summary ?? b.summary ?? "")}
              badge={`${b.adoption_pct ?? 0}% adoption`}
              extra={
                b.expansion_opportunity ? (
                  <p className="mt-2 text-xs text-indigo-700">{String(b.expansion_opportunity)}</p>
                ) : null
              }
            />
          ))}
        </section>
      )}

      {activeSection === "adoption" && (center.value_realization ?? []).length > 0 && (
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(center.value_realization ?? []).map((v) => (
            <StatCard
              key={String(v.value_key)}
              label={String(v.value_title ?? "")}
              value={`${v.metric_value ?? 0} ${String(v.value_unit ?? "")}`}
            />
          ))}
        </section>
      )}

      {(activeSection === "risks" || activeSection === "executive") && (
        <section className="grid gap-3">
          {(center.risks ?? []).length === 0 ? (
            <p className="text-sm text-zinc-500">{labels.noRecords}</p>
          ) : (
            (center.risks ?? []).map((r) => (
              <ItemCard
                key={String(r.risk_key)}
                title={String(r.risk_title ?? "")}
                summary={String(r.summary ?? "")}
                badge={String(r.severity ?? r.risk_status ?? "")}
                extra={
                  r.companion_recommendation ? (
                    <p className="mt-2 text-sm text-indigo-800">
                      {String(r.companion_recommendation)}
                    </p>
                  ) : null
                }
              />
            ))
          )}
        </section>
      )}

      {(activeSection === "opportunities" || activeSection === "executive") && (
        <section className="grid gap-3">
          {(center.opportunities ?? []).map((o) => (
            <ItemCard
              key={String(o.opportunity_key)}
              title={String(o.opportunity_title ?? "")}
              summary={String(o.summary ?? "")}
              badge={String(o.opportunity_type ?? o.opportunity_status ?? "")}
              extra={
                o.recommendation ? (
                  <p className="mt-2 text-sm text-indigo-800">{String(o.recommendation)}</p>
                ) : null
              }
            />
          ))}
        </section>
      )}

      {(activeSection === "renewals" || activeSection === "executive") && (
        <section className="grid gap-3">
          {(center.renewals ?? []).map((r) => (
            <ItemCard
              key={String(r.renewal_key)}
              title={`Renewal · ${r.days_until_renewal ?? "—"} days`}
              summary={String(r.summary ?? "")}
              badge={String(r.renewal_status ?? "")}
              extra={
                <>
                  <p className="mt-2 text-xs text-zinc-500">
                    Usage: {String(r.usage_trend ?? "—")} · Adoption: {String(r.adoption_trend ?? "—")}
                  </p>
                  {r.expansion_notes ? (
                    <p className="mt-1 text-sm text-zinc-600">{String(r.expansion_notes)}</p>
                  ) : null}
                </>
              }
            />
          ))}
        </section>
      )}

      {activeSection === "reports" && (
        <section className="space-y-4">
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label={labels.healthScore} value={Number(center.reports?.health_report ?? center.health_score ?? 0)} />
            <StatCard label={labels.sections.adoption} value={`${Number(center.reports?.adoption_avg ?? 0)}%`} />
            <StatCard label={labels.records} value={Number(center.reports?.value_metrics ?? 0)} />
            <StatCard label={labels.stats.daysUntilRenewal} value={String(center.reports?.renewal_days ?? "—")} />
          </dl>
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
        </section>
      )}

      {activeSection === "journey" && (
        <ol className="relative space-y-4 border-l-2 border-indigo-200 pl-6">
          {(center.journey ?? []).map((stage) => (
            <li key={String(stage.stage_key)} className="relative">
              <span className="absolute -left-[1.6rem] top-1 h-3 w-3 rounded-full bg-indigo-600 ring-4 ring-white" />
              <ItemCard
                title={String(stage.stage_title ?? "")}
                summary={String(stage.summary ?? "")}
                badge={String(stage.stage_status ?? "")}
              />
            </li>
          ))}
        </ol>
      )}

      <p className="text-xs text-zinc-500">{labels.privacyNote}</p>
    </div>
  );
}
