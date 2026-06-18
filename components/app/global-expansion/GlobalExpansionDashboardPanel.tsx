"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseGlobalExpansionDashboard,
  type GlobalExpansionDashboard,
} from "@/lib/aipify/global-expansion";

type GlobalExpansionDashboardPanelProps = {
  labels: Record<string, string>;
};

function statusClass(status?: string) {
  switch (status) {
    case "active":
    case "published":
    case "completed":
      return "bg-emerald-100 text-emerald-800";
    case "launch_ready":
    case "review":
      return "bg-blue-100 text-blue-800";
    case "in_progress":
    case "planning":
      return "bg-amber-100 text-amber-800";
    case "planned":
    case "assessment":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-indigo-100 text-indigo-800";
  }
}

function priorityClass(priority?: string) {
  switch (priority) {
    case "high":
      return "bg-rose-100 text-rose-800";
    case "medium":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export function GlobalExpansionDashboardPanel({ labels }: GlobalExpansionDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<GlobalExpansionDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/global-expansion/dashboard");
    if (res.ok) setDashboard(parseGlobalExpansionDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const generateBriefing = async () => {
    await fetch("/api/aipify/global-expansion/briefings/generate", { method: "POST" });
    await load();
  };

  const dismissRecommendation = async (recommendationId: string) => {
    setActing(`dismiss-${recommendationId}`);
    await fetch(`/api/aipify/global-expansion/recommendations/${recommendationId}/dismiss`, { method: "POST" });
    setActing(null);
    await load();
  };

  const advancePlaybook = async (countryCode: string) => {
    setActing(`advance-${countryCode}`);
    await fetch(`/api/aipify/global-expansion/playbooks/${countryCode}/advance`, { method: "POST" });
    setActing(null);
    await load();
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_customer) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/knowledge-center" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.knowledgeCenter}
        </Link>
        <Link href="/app/global-learning" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.globalLearning}
        </Link>
        <Link href="/app/academy" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.academy}
        </Link>
        <Link href="/app/commercial" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.commercial}
        </Link>
        {(dashboard.localization_integration_links ?? []).map((link) =>
          link.route && !["/app/knowledge-center", "/app/global-learning", "/app/academy", "/app/commercial"].includes(link.route) ? (
            <Link key={link.route} href={link.route} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
              {link.label ?? link.route}
            </Link>
          ) : null
        )}
      </div>

      {dashboard.implementation_blueprint_phase35 ? (
        <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
          <h2 className="text-sm font-semibold text-violet-900">{labels.blueprintTitle}</h2>
          <p className="mt-1 text-xs uppercase tracking-wide text-violet-700">
            {dashboard.implementation_blueprint_phase35.title ?? labels.blueprintPhase35}
            {dashboard.implementation_blueprint_phase35.engine_phase
              ? ` · ${dashboard.implementation_blueprint_phase35.engine_phase}`
              : ""}
          </p>
          {dashboard.localization_expansion_mission ? (
            <p className="mt-2 text-sm font-medium text-violet-900">{dashboard.localization_expansion_mission}</p>
          ) : null}
          {dashboard.localization_expansion_philosophy ? (
            <p className="mt-2 text-sm text-violet-900">{dashboard.localization_expansion_philosophy}</p>
          ) : null}
          {dashboard.localization_abos_principle ? (
            <p className="mt-2 text-xs text-violet-800">{dashboard.localization_abos_principle}</p>
          ) : null}
          {dashboard.localization_distinction_note ? (
            <p className="mt-2 text-xs text-violet-700">{dashboard.localization_distinction_note}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.localization_summary ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.localizationSummary}</h3>
          <div className="mt-3 grid gap-2 text-xs text-gray-600 sm:grid-cols-3">
            <span>
              {labels.activeLanguages}: {dashboard.localization_summary.active_languages ?? 0}
            </span>
            <span>
              {labels.avgCoverage}: {dashboard.localization_summary.avg_coverage_pct ?? 0}%
            </span>
            <span>
              {labels.openRecommendations}: {dashboard.localization_summary.open_recommendations ?? 0}
            </span>
            <span>
              {labels.publishedProjects}: {dashboard.localization_summary.published_projects ?? 0}
            </span>
            <span>
              {labels.regionalContentItems}: {dashboard.localization_summary.regional_content_items ?? 0}
            </span>
          </div>
        </section>
      ) : null}

      {dashboard.localization_objectives && dashboard.localization_objectives.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.localizationObjectives}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.localization_objectives.map((objective) => (
              <article key={objective.key ?? objective.label} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <p className="font-medium text-gray-900">{objective.label}</p>
                {objective.description ? <p className="mt-1 text-xs text-gray-600">{objective.description}</p> : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.language_strategy?.priority_locales && dashboard.language_strategy.priority_locales.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.languageStrategy}</h3>
          {dashboard.language_strategy.principle ? (
            <p className="mt-2 text-xs text-gray-600">{dashboard.language_strategy.principle}</p>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-2">
            {dashboard.language_strategy.priority_locales.map((locale) => (
              <span
                key={locale.code ?? locale.label}
                className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800"
              >
                {locale.label ?? locale.code} ({locale.code})
              </span>
            ))}
          </div>
          {dashboard.language_strategy.future_locales && dashboard.language_strategy.future_locales.length > 0 ? (
            <p className="mt-3 text-xs text-gray-500">
              {labels.futureLocales}: {dashboard.language_strategy.future_locales.join(", ")}
            </p>
          ) : null}
        </section>
      ) : null}

      {dashboard.companion_localization?.personalities && dashboard.companion_localization.personalities.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.companionLocalization}</h3>
          {dashboard.companion_localization.principle ? (
            <p className="mt-2 text-xs text-gray-600">{dashboard.companion_localization.principle}</p>
          ) : null}
          <div className="mt-3 space-y-3">
            {dashboard.companion_localization.personalities.map((personality) => (
              <article key={personality.key ?? personality.trait} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="text-sm font-medium text-gray-900">
                  {personality.emoji} {personality.trait}
                </p>
                {personality.example ? <p className="mt-1 text-xs italic text-gray-600">{personality.example}</p> : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.payment_financial_localization?.nordic_markets &&
      dashboard.payment_financial_localization.nordic_markets.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.paymentLocalization}</h3>
          {dashboard.payment_financial_localization.principle ? (
            <p className="mt-2 text-xs text-gray-600">{dashboard.payment_financial_localization.principle}</p>
          ) : null}
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {dashboard.payment_financial_localization.nordic_markets.map((market) => (
              <article key={market.code ?? market.country} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <p className="font-medium text-gray-900">{market.country}</p>
                {market.providers && market.providers.length > 0 ? (
                  <p className="mt-1 text-xs text-gray-600">{market.providers.join(" · ")}</p>
                ) : null}
                {market.expectations && market.expectations.length > 0 ? (
                  <ul className="mt-2 list-inside list-disc text-xs text-gray-500">
                    {market.expectations.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
          {dashboard.payment_financial_localization.international?.providers ? (
            <p className="mt-3 text-xs text-gray-600">
              {labels.internationalPayments}: {dashboard.payment_financial_localization.international.providers.join(", ")}
            </p>
          ) : null}
          {dashboard.payment_financial_localization.safety_note ? (
            <p className="mt-2 text-xs text-amber-700">{dashboard.payment_financial_localization.safety_note}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.sales_expert_localization?.capabilities && dashboard.sales_expert_localization.capabilities.length > 0 ? (
        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-semibold text-slate-900">{labels.salesExpertLocalization}</h3>
          {dashboard.sales_expert_localization.principle ? (
            <p className="mt-2 text-xs text-slate-700">{dashboard.sales_expert_localization.principle}</p>
          ) : null}
          <ul className="mt-2 list-inside list-disc text-xs text-slate-700">
            {dashboard.sales_expert_localization.capabilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {dashboard.sales_expert_localization.sales_expert_route ? (
            <Link
              href={dashboard.sales_expert_localization.sales_expert_route}
              className="mt-3 inline-block text-xs text-indigo-700 underline"
            >
              {labels.openSalesExpert}
            </Link>
          ) : null}
        </section>
      ) : null}

      {dashboard.training_certification_localization?.capabilities &&
      dashboard.training_certification_localization.capabilities.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.trainingCertificationLocalization}</h3>
          {dashboard.training_certification_localization.principle ? (
            <p className="mt-2 text-xs text-gray-600">{dashboard.training_certification_localization.principle}</p>
          ) : null}
          <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
            {dashboard.training_certification_localization.capabilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.localization_trust_connection?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold text-gray-900">{labels.trustConnection}</h3>
          <p className="mt-2 text-gray-700">{dashboard.localization_trust_connection.principle}</p>
          {dashboard.localization_trust_connection.users_should_understand &&
          dashboard.localization_trust_connection.users_should_understand.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-gray-600">
              {dashboard.localization_trust_connection.users_should_understand.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.localization_dogfooding?.principle ? (
        <section className="rounded-lg border border-emerald-100 bg-emerald-50/40 p-4 text-sm text-emerald-900">
          <h3 className="text-sm font-semibold">{labels.dogfooding}</h3>
          <p className="mt-2">{dashboard.localization_dogfooding.principle}</p>
          {dashboard.localization_dogfooding.aipify_group?.role ? (
            <p className="mt-2 text-xs">
              <span className="font-medium">{labels.aipifyGroup}:</span> {dashboard.localization_dogfooding.aipify_group.role}
            </p>
          ) : null}
          {dashboard.localization_dogfooding.unonight?.role ? (
            <p className="mt-1 text-xs">
              <span className="font-medium">{labels.unonight}:</span> {dashboard.localization_dogfooding.unonight.role}
            </p>
          ) : null}
        </section>
      ) : null}

      {Array.isArray(dashboard.localization_success_criteria) && dashboard.localization_success_criteria.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.successCriteria}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {dashboard.localization_success_criteria.map((item) => {
              const label = typeof item.label === "string" ? item.label : String(item.key ?? "");
              const met = Boolean(item.met);
              return (
                <li key={item.key ?? label} className="flex items-start gap-2">
                  <span className={met ? "text-emerald-600" : "text-gray-400"}>{met ? "✓" : "○"}</span>
                  <span>
                    {label}
                    {item.note ? <span className="block text-xs text-gray-500">{item.note}</span> : null}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {dashboard.localization_vision_phrases && dashboard.localization_vision_phrases.length > 0 ? (
        <section className="rounded-lg border border-indigo-100 bg-indigo-50/30 p-4">
          <h3 className="text-sm font-semibold text-indigo-900">{labels.visionPhrases}</h3>
          <ul className="mt-2 space-y-2 text-xs italic text-indigo-800">
            {dashboard.localization_vision_phrases.map((phrase) => (
              <li key={phrase}>{phrase}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold text-indigo-900">{labels.globalReadiness}</h2>
        <p className="mt-2 text-4xl font-bold text-indigo-800">
          {dashboard.global_readiness_score ?? 0}
          <span className="text-lg font-normal text-gray-500">/100</span>
        </p>
        <p className="mt-1 text-sm font-medium text-indigo-700">
          {dashboard.avg_language_coverage_pct ?? 0}% {labels.languageCoverage} · {dashboard.default_region}{" "}
          · {dashboard.default_timezone}
        </p>
        <p className="mt-2 text-sm text-indigo-800">{dashboard.philosophy}</p>
        <p className="mt-1 text-xs text-indigo-700">{dashboard.safety_note}</p>
        <button
          type="button"
          onClick={() => void generateBriefing()}
          className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          {labels.generateBriefing}
        </button>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: labels.activeMarkets, value: dashboard.active_markets ?? 0 },
          { label: labels.plannedMarkets, value: dashboard.planned_markets ?? 0 },
          { label: labels.defaultLanguage, value: dashboard.default_language ?? "en" },
          { label: labels.defaultCurrency, value: dashboard.default_currency ?? "EUR" },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <p className="text-xs text-gray-500">{m.label}</p>
            <p className="text-lg font-semibold text-gray-900">{m.value}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.supportedLanguages}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {dashboard.supported_languages.map((lang) => (
            <article key={lang.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <span className="font-medium text-gray-900">{lang.native_name}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusClass(lang.market_status)}`}>
                  {lang.market_status}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-600">{lang.language_name}</p>
              <p className="mt-2 text-sm font-semibold text-indigo-700">{lang.coverage_pct}% {labels.coverage}</p>
            </article>
          ))}
        </div>
        {dashboard.future_languages && dashboard.future_languages.length > 0 ? (
          <p className="mt-3 text-xs text-gray-500">
            {labels.futureLanguages}: {dashboard.future_languages.join(", ")}
          </p>
        ) : null}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.localizationProjects}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {dashboard.localization_projects.map((project) => (
            <article key={project.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <span className="text-xs uppercase text-gray-500">{project.target_language}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusClass(project.status)}`}>
                  {project.status?.replace(/_/g, " ")}
                </span>
              </div>
              <p className="mt-2 font-medium text-gray-900">{project.title}</p>
              <p className="mt-1 text-xs text-gray-600">{project.description}</p>
              <p className="mt-2 text-xs capitalize text-indigo-700">{project.content_scope?.replace(/_/g, " ")}</p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full bg-indigo-500" style={{ width: `${project.progress_pct}%` }} />
              </div>
              <p className="mt-1 text-xs text-gray-500">{project.progress_pct}%</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.countryPlaybooks}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {dashboard.country_playbooks.map((playbook) => (
            <article key={playbook.id} className="rounded-lg border border-indigo-100 bg-indigo-50/30 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <span className="font-medium text-indigo-900">{playbook.country_name}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusClass(playbook.market_status)}`}>
                  {playbook.market_status?.replace(/_/g, " ")}
                </span>
              </div>
              <p className="mt-1 text-xs text-indigo-800">{playbook.summary}</p>
              <p className="mt-2 text-sm font-semibold text-indigo-700">
                {playbook.readiness_score}% {labels.readiness}
              </p>
              {playbook.checklist && playbook.checklist.length > 0 ? (
                <ul className="mt-2 list-inside list-disc text-xs text-indigo-700">
                  {playbook.checklist.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              {playbook.market_status !== "active" ? (
                <button
                  type="button"
                  disabled={acting === `advance-${playbook.country_code}`}
                  onClick={() => void advancePlaybook(playbook.country_code)}
                  className="mt-3 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {labels.advancePlaybook}
                </button>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      {dashboard.recommendations.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.recommendations}</h2>
          <div className="mt-3 space-y-2">
            {dashboard.recommendations.map((r) => (
              <article key={r.id} className="rounded-lg border border-amber-100 bg-amber-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-amber-900">{r.title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${priorityClass(r.priority)}`}>
                    {r.priority}
                  </span>
                </div>
                <p className="mt-1 text-xs text-amber-800">{r.description}</p>
                <p className="mt-1 text-xs capitalize text-amber-700">{r.recommendation_type?.replace(/_/g, " ")}</p>
                <button
                  type="button"
                  disabled={acting === `dismiss-${r.id}`}
                  onClick={() => void dismissRecommendation(r.id)}
                  className="mt-2 text-xs text-amber-800 underline hover:text-amber-900 disabled:opacity-50"
                >
                  {labels.dismiss}
                </button>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.international_analytics.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.internationalAnalytics}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {dashboard.international_analytics.map((ia) => (
              <article key={ia.id} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <p className="font-medium text-gray-900">{ia.region_label}</p>
                <p className="mt-2 text-xs text-gray-600">
                  {labels.adoption}: {ia.adoption_rate_pct}%
                </p>
                <p className="text-xs text-gray-600">
                  {labels.languageUsage}: {ia.language_usage_pct}%
                </p>
                <p className="text-xs text-gray-600">
                  {labels.satisfaction}: {ia.satisfaction_score}%
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.terminology_glossary.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.terminologyGlossary}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.terminology_glossary.map((term) => (
              <li key={term.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                <span className="font-medium text-gray-900">{term.source_term}</span>
                <span className="mx-2 text-gray-400">→</span>
                <span className="text-gray-700">{term.translated_term}</span>
                <span className="ml-2 text-xs text-gray-500">
                  ({term.language_code} · {term.domain})
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.regional_content.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.regionalContent}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.regional_content.map((rc) => (
              <article key={rc.id} className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-xs uppercase text-gray-500">{rc.region_code}</p>
                <p className="mt-1 font-medium text-gray-900">{rc.title}</p>
                <p className="mt-1 text-xs text-gray-600">{rc.description}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.localization_audits.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.qualityAssurance}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.localization_audits.map((audit) => (
              <article key={audit.id} className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
                <p className="text-xs capitalize text-emerald-700">{audit.audit_type?.replace(/_/g, " ")}</p>
                <p className="mt-1 font-medium text-emerald-900">{audit.title}</p>
                {audit.summary ? <p className="mt-1 text-xs text-emerald-800">{audit.summary}</p> : null}
                {audit.overall_score != null ? (
                  <p className="mt-2 text-sm font-semibold text-emerald-700">{audit.overall_score}/100</p>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.compliance_readiness && dashboard.compliance_readiness.length > 0 ? (
        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-sm font-semibold text-slate-900">{labels.complianceReadiness}</h2>
          <ul className="mt-2 list-inside list-disc text-xs text-slate-700">
            {dashboard.compliance_readiness.map((item) => (
              <li key={item}>{item}</li>
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
