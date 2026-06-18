"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseGrowthPartnerOperationsDashboard,
  type AbosSuccessCriterion,
  type BlueprintObjective,
  type CertificationLevel,
  type CompanionAdaptationExample,
  type GrowthPartnerOperationsDashboard,
  type IntegrationLink,
  type PortfolioCustomer,
  type RenewalItem,
  type StageTemplate,
  type TrainingProgram,
} from "@/lib/aipify/growth-partner-operations";

type GrowthPartnerOperationsDashboardPanelProps = {
  labels: Record<string, string>;
};

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-indigo-100 bg-indigo-50/40 px-3 py-2 text-sm">
      <span className="font-medium">
        {objective.emoji ? `${objective.emoji} ` : ""}
        {objective.label}
      </span>
      {objective.description ? <p className="mt-1 text-xs text-indigo-900">{objective.description}</p> : null}
    </div>
  );
}

function SuccessCriterionRow({
  criterion,
  metLabel,
  pendingLabel,
}: {
  criterion: AbosSuccessCriterion;
  metLabel: string;
  pendingLabel: string;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-2 rounded border border-gray-100 px-3 py-2 text-sm">
      <span className="text-gray-800">{criterion.label}</span>
      <span className={criterion.met ? "text-xs text-green-700" : "text-xs text-amber-700"}>
        {criterion.met ? metLabel : pendingLabel}
      </span>
      {criterion.note ? <p className="w-full text-xs text-gray-500">{criterion.note}</p> : null}
    </div>
  );
}

function badgeClass(value?: string) {
  switch (value) {
    case "continuous_success":
    case "optimization":
    case "go_live":
      return "bg-emerald-100 text-emerald-800";
    case "pilot_deployment":
    case "user_training":
    case "moderate":
    case "informational":
      return "bg-amber-100 text-amber-800";
    case "important":
    case "critical":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function PortfolioCard({ customer, labels }: { customer: PortfolioCustomer; labels: Record<string, string> }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-gray-900">{customer.customer_org_key}</span>
        <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(customer.implementation_status)}`}>
          {customer.implementation_status.replace(/_/g, " ")}
        </span>
      </div>
      <p className="mt-1 text-xs text-gray-600">{customer.org_profile_summary}</p>
      <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
        <span>
          {labels.healthScore}: {customer.health_score}
        </span>
        <span>
          {labels.trainingProgress}: {customer.training_progress_pct}%
        </span>
        <span>
          {labels.companionsDeployed}: {customer.companions_deployed_count}
        </span>
      </div>
    </div>
  );
}

export function GrowthPartnerOperationsDashboardPanel({
  labels,
}: GrowthPartnerOperationsDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<GrowthPartnerOperationsDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/growth-partner-operations/dashboard");
    if (res.ok) setDashboard(parseGrowthPartnerOperationsDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_customer) return null;

  const integrationLinks: IntegrationLink[] =
    dashboard.gpocbp114_integration_links ?? dashboard.integration_links ?? [];
  const limitationItems = dashboard.growth_partner_operations_limitation_principles?.must_avoid ?? [];
  const companionExamples =
    dashboard.growth_partner_operations_companion_adaptation?.examples ?? [];
  const operationsModules = dashboard.operations_center_modules ?? [];
  const insightsQuestions = Array.isArray(dashboard.partner_insights_meta?.questions)
    ? (dashboard.partner_insights_meta.questions as string[])
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/partners" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.partnerCertification}
        </Link>
        <Link href="/app/partner-success-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.partnerSuccessEngine}
        </Link>
        <Link href="/app/companion-marketplace" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.companionMarketplace}
        </Link>
        <Link href="/app/marketplace" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.marketplace}
        </Link>
        <Link href="/app/learning-training-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.learningTrainingEngine}
        </Link>
        <Link href="/app/settings/two-factor" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.twoFactorSettings}
        </Link>
        {integrationLinks.map((link) =>
          link.route ? (
            <Link
              key={link.route + (link.key ?? "")}
              href={link.route}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
            >
              {link.label ?? link.route}
            </Link>
          ) : null,
        )}
      </div>

      <section className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-5">
        <h2 className="text-sm font-semibold text-indigo-900">{labels.blueprintTitle}</h2>
        {dashboard.implementation_blueprint_phase114?.phase ? (
          <p className="mt-1 text-xs text-indigo-700">
            {dashboard.implementation_blueprint_phase114.phase}
            {dashboard.implementation_blueprint_phase114.engine_phase
              ? ` · ${dashboard.implementation_blueprint_phase114.engine_phase}`
              : ""}
          </p>
        ) : null}
        {dashboard.growth_partner_operations_mission ? (
          <p className="mt-2 text-sm font-medium text-indigo-900">{dashboard.growth_partner_operations_mission}</p>
        ) : null}
        {dashboard.growth_partner_operations_philosophy ? (
          <p className="mt-2 text-sm text-indigo-900">{dashboard.growth_partner_operations_philosophy}</p>
        ) : null}
        {dashboard.growth_partner_operations_distinction_note ? (
          <p className="mt-2 text-xs text-indigo-700">{dashboard.growth_partner_operations_distinction_note}</p>
        ) : null}
        {dashboard.growth_partner_operations_vision ? (
          <p className="mt-2 text-xs italic text-indigo-800">{dashboard.growth_partner_operations_vision}</p>
        ) : null}
      </section>

      <div className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-indigo-800">{labels.partnerHealthScore}</p>
            <p className="text-3xl font-bold text-indigo-900">{dashboard.partner_health_score ?? 0}</p>
            <p className="mt-1 text-sm text-indigo-700">{dashboard.philosophy}</p>
            {dashboard.human_oversight_required ? (
              <p className="mt-2 text-xs text-indigo-600">{labels.humanOversightRequired}</p>
            ) : null}
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-indigo-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-indigo-600">{labels.activeCustomers}</span>
            <p className="font-semibold">{dashboard.active_customers ?? 0}</p>
          </div>
          <div className="rounded-lg border border-indigo-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-indigo-600">{labels.upcomingRenewals}</span>
            <p className="font-semibold">{dashboard.upcoming_renewals ?? 0}</p>
          </div>
          <div className="rounded-lg border border-indigo-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-indigo-600">{labels.implementationsInProgress}</span>
            <p className="font-semibold">{dashboard.implementations_in_progress ?? 0}</p>
          </div>
          <div className="rounded-lg border border-indigo-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-indigo-600">{labels.openRenewalItems}</span>
            <p className="font-semibold">{dashboard.open_renewal_items ?? 0}</p>
          </div>
        </div>
      </div>

      {operationsModules.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.operationsCenterModules}</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {operationsModules.map((mod) => (
              <div
                key={String(mod.key ?? mod.label)}
                className="rounded-lg border border-indigo-100 bg-indigo-50/30 px-3 py-2 text-sm"
              >
                <span className="font-medium text-indigo-900">{String(mod.label ?? mod.key)}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.portfolio_customers.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.customerPortfolio}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {dashboard.portfolio_customers.map((customer) => (
              <PortfolioCard key={customer.id} customer={customer} labels={labels} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.implementation_stage_templates.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.implementationCenter}</h2>
          <ol className="space-y-2">
            {dashboard.implementation_stage_templates.map((stage: StageTemplate) => (
              <li key={stage.key} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                <span className="font-medium text-gray-900">
                  {stage.order}. {stage.label}
                </span>
                {stage.description ? <p className="mt-1 text-xs text-gray-600">{stage.description}</p> : null}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {dashboard.implementations.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.implementationProgress}</h2>
          {dashboard.implementations.map((impl) => (
            <div key={impl.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(impl.current_stage)}`}>
                  {impl.current_stage.replace(/_/g, " ")}
                </span>
                <span className="text-xs text-gray-600">
                  {labels.progress}: {impl.progress_pct}%
                </span>
              </div>
            </div>
          ))}
        </section>
      ) : null}

      {dashboard.training_programs.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.trainingAcademy}</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {dashboard.training_programs.map((program: TrainingProgram) => (
              <li key={program.key} className="rounded-lg border border-violet-100 bg-violet-50/40 px-3 py-2 text-sm">
                {program.label}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.certification_levels.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.certificationFramework}</h2>
          <ul className="space-y-2">
            {dashboard.certification_levels.map((level: CertificationLevel) => (
              <li key={level.key} className="flex flex-wrap items-center justify-between gap-2 rounded border border-gray-100 px-3 py-2 text-sm">
                <span className="font-medium text-gray-900">{level.label}</span>
                {level.maps_to_tier_label ? (
                  <span className="text-xs text-violet-700">{level.maps_to_tier_label}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.renewal_items.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.renewalCenter}</h2>
          {dashboard.renewal_items.map((item: RenewalItem) => (
            <div key={item.id} className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-amber-900">{item.title}</span>
                <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(item.priority)}`}>
                  {item.priority}
                </span>
              </div>
              <p className="mt-1 text-xs text-amber-800">{item.summary}</p>
            </div>
          ))}
        </section>
      ) : null}

      {dashboard.health_snapshot?.summary ? (
        <section className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.partnerHealthScores}</h2>
          <p className="mt-2 text-sm text-gray-700">{dashboard.health_snapshot.summary}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ["customer_retention_score", labels.customerRetention],
              ["implementation_success_score", labels.implementationSuccess],
              ["training_effectiveness_score", labels.trainingEffectiveness],
              ["governance_compliance_score", labels.governanceCompliance],
              ["partner_growth_score", labels.partnerGrowth],
            ].map(([key, label]) => (
              <div key={key} className="rounded border border-gray-100 bg-white px-2 py-1 text-xs">
                <span className="text-gray-500">{label}</span>
                <p className="font-semibold text-gray-900">
                  {dashboard.health_snapshot?.[key as keyof typeof dashboard.health_snapshot] ?? "—"}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {insightsQuestions.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.partnerInsights}</h2>
          <ul className="list-inside list-disc text-sm text-gray-700">
            {insightsQuestions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {companionExamples.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.companionAdaptation}</h2>
          {companionExamples.map((example: CompanionAdaptationExample) => (
            <div key={example.key} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
              <p className="font-medium">
                {example.emoji ? `${example.emoji} ` : ""}
                {example.prompt}
              </p>
              {example.consideration ? (
                <p className="mt-1 text-xs text-gray-600">{example.consideration}</p>
              ) : null}
            </div>
          ))}
        </section>
      ) : null}

      {(dashboard.growth_partner_operations_objectives ?? []).length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.blueprintObjectives}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {(dashboard.growth_partner_operations_objectives ?? []).map((obj) => (
              <ObjectiveCard key={obj.key ?? obj.label} objective={obj} />
            ))}
          </div>
        </section>
      ) : null}

      {limitationItems.length > 0 ? (
        <section className="rounded-xl border border-orange-100 bg-orange-50/40 p-4">
          <h2 className="text-sm font-semibold text-orange-900">{labels.limitationPrinciples}</h2>
          <ul className="mt-2 list-inside list-disc text-xs text-orange-800">
            {limitationItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {(dashboard.growth_partner_operations_success_criteria ?? []).length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.successCriteria}</h2>
          <div className="space-y-2">
            {(dashboard.growth_partner_operations_success_criteria ?? []).map((criterion) => (
              <SuccessCriterionRow
                key={criterion.key ?? criterion.label}
                criterion={criterion}
                metLabel={labels.criterionMet}
                pendingLabel={labels.criterionPending}
              />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.growth_partner_operations_privacy_note ? (
        <p className="text-xs text-gray-500">{dashboard.growth_partner_operations_privacy_note}</p>
      ) : null}
    </div>
  );
}
