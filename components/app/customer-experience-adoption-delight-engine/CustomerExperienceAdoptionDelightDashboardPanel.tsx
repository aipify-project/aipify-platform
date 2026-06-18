"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseCustomerExperienceAdoptionDelightCenter,
  type CustomerExperienceAdoptionDelightCenter,
} from "@/lib/aipify/customer-experience-adoption-delight-engine";

type Props = { labels: Record<string, string> };

function metricValue(value: unknown): string | number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return value;
  return 0;
}

function statusBadgeClass(status?: string): string {
  switch (status) {
    case "completed":
    case "celebrated":
    case "delivered":
    case "active":
      return "bg-emerald-100 text-emerald-800";
    case "in_progress":
    case "pending":
    case "moderate":
      return "bg-amber-100 text-amber-800";
    case "skipped":
    case "high":
    case "paused":
      return "bg-red-100 text-red-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export function CustomerExperienceAdoptionDelightDashboardPanel({ labels }: Props) {
  const [center, setCenter] = useState<CustomerExperienceAdoptionDelightCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/customer-experience-adoption-delight-engine/dashboard");
    if (res.ok) {
      setCenter(parseCustomerExperienceAdoptionDelightCenter(await res.json()));
    } else {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.loadFailed);
    }
    setLoading(false);
  }, [labels.loadFailed]);

  useEffect(() => {
    void load();
  }, [load]);

  const runAction = async (action: string, extra?: Record<string, unknown>) => {
    setActing(true);
    setActionError(null);
    const res = await fetch("/api/aipify/customer-experience-adoption-delight-engine/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...extra }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.actionFailed);
    } else {
      await load();
    }
    setActing(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <AipifyLoader label={labels.loading} centered />
      </div>
    );
  }

  if (!center?.found || !center.has_access) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
        <p className="font-medium">{labels.accessRequiredTitle}</p>
        <p className="mt-2 text-sm">{center?.error ?? labels.accessRequiredBody}</p>
      </div>
    );
  }

  const overview = center.overview ?? {};
  const exec = center.executive_dashboard ?? {};

  return (
    <div className="space-y-6">
      {actionError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{actionError}</div>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-gradient-to-br from-indigo-50/50 to-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.overviewTitle}</h2>
        <p className="mt-1 text-sm text-gray-600">{center.philosophy}</p>
        <p className="mt-2 text-xs text-gray-500">{center.abos_principle}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [labels.metricOnboarding, metricValue(overview.onboarding_completion)],
            [labels.metricAdoption, metricValue(overview.feature_adoption)],
            [labels.metricCompanion, metricValue(overview.companion_engagement)],
            [labels.metricRetention, metricValue(overview.retention)],
            [labels.metricExperience, metricValue(overview.experience_score)],
            [labels.metricSuccess, metricValue(overview.overall_success_score)],
            [labels.metricHealth, metricValue(overview.customer_health)],
            [labels.metricRisks, metricValue(overview.retention_risks)],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-lg border border-white bg-white/90 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {center.customer_onboarding_route ? (
            <Link href={center.customer_onboarding_route} className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400">
              {labels.openOnboarding}
            </Link>
          ) : null}
          {center.customer_success_route ? (
            <Link href={center.customer_success_route} className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400">
              {labels.openCustomerSuccess}
            </Link>
          ) : null}
          {center.install_route ? (
            <Link href={center.install_route} className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400">
              {labels.openInstall}
            </Link>
          ) : null}
          {center.assistant_route ? (
            <Link href={center.assistant_route} className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400">
              {labels.openAssistant}
            </Link>
          ) : null}
        </div>
      </section>

      <section id="onboarding" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.onboardingTitle}</h2>
        <p className="mt-1 text-sm text-gray-500">{labels.onboardingSubtitle}</p>
        {center.onboarding_steps?.length ? (
          <ul className="mt-4 space-y-3">
            {center.onboarding_steps.map((s) => (
              <li key={s.id ?? s.step_key} className="rounded-lg border border-gray-100 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{s.step_title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(s.status)}`}>{s.status}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {s.step_category} · {s.progress_percent}% {labels.progressLabel}
                </p>
                {s.summary ? <p className="mt-1 text-sm text-gray-600">{s.summary}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noOnboarding}</p>
        )}
        {center.first_impressions?.length ? (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-800">{labels.firstImpressionsTitle}</h3>
            <ul className="mt-3 space-y-2">
              {center.first_impressions.map((f) => (
                <li key={f.id ?? f.impression_key} className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-700">
                  <span>{f.impression_title}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(f.status)}`}>{f.status}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {center.getting_started?.length ? (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-800">{labels.gettingStartedTitle}</h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {center.getting_started.map((g) => (
                <li key={g.id ?? g.progress_key} className="rounded-lg border border-gray-100 p-3 text-sm">
                  <p className="font-medium text-gray-900">{g.progress_title}</p>
                  <p className="text-xs text-gray-500">{g.progress_percent}% · {g.progress_category}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={acting}
            onClick={() => void runAction("start_onboarding", { step_key: "OB-SETUP" })}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {labels.startOnboarding}
          </button>
          <button
            type="button"
            disabled={acting}
            onClick={() => void runAction("complete_onboarding_step", { step_key: "OB-SETUP" })}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {labels.completeStep}
          </button>
        </div>
      </section>

      <section id="adoption" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.adoptionTitle}</h2>
        {center.adoption_metrics?.length ? (
          <ul className="mt-4 space-y-3">
            {center.adoption_metrics.map((a) => (
              <li key={a.id ?? a.metric_key} className="rounded-lg border border-gray-100 p-3">
                <p className="font-medium text-gray-900">{a.metric_title}</p>
                <p className="text-xs text-gray-500">
                  {a.metric_category} · {a.adoption_percent}% {labels.adoptionLabel}
                </p>
                {a.summary ? <p className="mt-1 text-sm text-gray-600">{a.summary}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noAdoption}</p>
        )}
      </section>

      <section id="companion" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.companionTitle}</h2>
        <p className="mt-1 text-sm text-gray-500">{labels.companionSubtitle}</p>
        {center.companion_moments?.length ? (
          <ul className="mt-4 space-y-3">
            {center.companion_moments.map((c) => (
              <li key={c.id ?? c.moment_key} className="rounded-lg border border-indigo-50 bg-indigo-50/30 p-3">
                <p className="font-medium text-gray-900">{c.moment_title}</p>
                <p className="text-xs text-gray-500">{c.moment_type}</p>
                {c.summary ? <p className="mt-1 text-sm text-gray-600">{c.summary}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noCompanion}</p>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section id="journeys" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.journeysTitle}</h2>
          {center.success_journeys?.length ? (
            <ul className="mt-4 space-y-3">
              {center.success_journeys.map((j) => (
                <li key={j.id ?? j.journey_key} className="rounded-lg border border-gray-100 p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="font-medium text-gray-900">{j.journey_title}</p>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(j.status)}`}>{j.status}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {j.journey_stage} · {j.progress_percent}% {labels.progressLabel}
                  </p>
                  {j.summary ? <p className="mt-1 text-sm text-gray-600">{j.summary}</p> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noJourneys}</p>
          )}
          <button
            type="button"
            disabled={acting}
            onClick={() => void runAction("update_journey", { journey_key: "SJ-NEW", progress_percent: 50 })}
            className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {labels.updateJourney}
          </button>
        </section>

        <section id="delight" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.delightTitle}</h2>
          {center.success_moments?.length ? (
            <ul className="mt-4 space-y-3">
              {center.success_moments.map((m) => (
                <li key={m.id ?? m.moment_key} className="rounded-lg border border-gray-100 p-3">
                  <p className="font-medium text-gray-900">{m.moment_title}</p>
                  <p className="text-xs text-gray-500">
                    {m.moment_type} · {m.celebration_level}
                  </p>
                  {m.summary ? <p className="mt-1 text-sm text-gray-600">{m.summary}</p> : null}
                </li>
              ))}
            </ul>
          ) : null}
          {center.delight_moments?.length ? (
            <ul className="mt-4 space-y-3">
              {center.delight_moments.map((d) => (
                <li key={d.id ?? d.delight_key} className="rounded-lg border border-amber-50 bg-amber-50/30 p-3">
                  <p className="font-medium text-gray-900">{d.delight_title}</p>
                  <p className="text-xs text-gray-500">{d.delight_type}</p>
                  {d.summary ? <p className="mt-1 text-sm text-gray-600">{d.summary}</p> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noDelight}</p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={acting}
              onClick={() => void runAction("record_milestone", { moment_title: "New milestone", moment_type: "milestone" })}
              className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {labels.recordMilestone}
            </button>
            <button
              type="button"
              disabled={acting}
              onClick={() => void runAction("award_achievement", { delight_title: "Team achievement", delight_type: "team_achievement" })}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              {labels.awardAchievement}
            </button>
          </div>
        </section>
      </div>

      <section id="retention" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.retentionTitle}</h2>
        {center.retention_signals?.length ? (
          <ul className="mt-4 space-y-3">
            {center.retention_signals.map((r) => (
              <li key={r.id ?? r.signal_key} className="rounded-lg border border-gray-100 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{r.signal_title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(r.risk_level)}`}>{r.risk_level}</span>
                </div>
                <p className="text-xs text-gray-500">{r.signal_type}</p>
                {r.summary ? <p className="mt-1 text-sm text-gray-600">{r.summary}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noRetention}</p>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.intelligenceTitle}</h2>
          {center.intelligence_signals?.length ? (
            <ul className="mt-4 space-y-3">
              {center.intelligence_signals.map((s) => (
                <li key={s.id ?? s.signal_type} className="rounded-lg border border-gray-100 p-3">
                  <p className="font-medium text-gray-900">{s.observation}</p>
                  {s.recommendation ? (
                    <p className="mt-1 text-sm text-gray-600">
                      {labels.recommendation}: {s.recommendation}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noIntelligence}</p>
          )}
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.advisorTitle}</h2>
          {center.advisor_signals?.length ? (
            <ul className="mt-4 space-y-3">
              {center.advisor_signals.map((s) => (
                <li key={s.id ?? s.signal_type} className="rounded-lg border border-gray-100 p-3">
                  <p className="font-medium text-gray-900">{s.observation}</p>
                  {s.recommendation ? (
                    <p className="mt-1 text-sm text-gray-600">
                      {labels.recommendation}: {s.recommendation}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noAdvisor}</p>
          )}
        </section>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.trustTitle}</h2>
        <ul className="mt-4 space-y-2 text-sm text-gray-700">
          <li>{labels.trustTransparency}</li>
          <li>{labels.trustPredictability}</li>
          <li>{labels.trustConsistency}</li>
          <li>{labels.trustHumanOversight}</li>
        </ul>
        <p className="mt-4 text-xs text-gray-500">{center.distinction_note}</p>
      </section>

      <section id="analytics" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.analyticsTitle}</h2>
        {center.audit_logs?.length ? (
          <ul className="mt-4 space-y-2">
            {center.audit_logs.map((log) => (
              <li key={String(log.id)} className="flex justify-between gap-4 text-sm text-gray-700">
                <span>{String(log.summary ?? "")}</span>
                <span className="shrink-0 text-xs uppercase text-gray-400">{String(log.event_type ?? "")}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noAudit}</p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={acting}
            onClick={() => void runAction("refresh_analytics")}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {labels.refreshAnalytics}
          </button>
          <button
            type="button"
            disabled={acting}
            onClick={() => void runAction("generate_recommendation")}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {labels.generateRecommendation}
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-700">{labels.executiveTitle}</p>
        <p className="mt-1">
          {labels.executiveSummary}: {labels.adoptionExecutiveLabel} {String(exec.customer_adoption ?? "—")} ·{" "}
          {labels.satisfactionLabel} {String(exec.customer_satisfaction ?? "—")} · {labels.retentionExecutiveLabel}{" "}
          {String(exec.retention ?? "—")} · {labels.companionExecutiveLabel} {String(exec.companion_engagement ?? "—")}
        </p>
        {center.privacy_note ? <p className="mt-2">{center.privacy_note}</p> : null}
      </section>
    </div>
  );
}
