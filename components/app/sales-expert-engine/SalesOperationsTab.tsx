"use client";

import Link from "next/link";
import type {
  BusinessGoal,
  OperationsSuccessCriterion,
  SalesExpertEngineDashboard,
} from "@/lib/aipify/sales-expert-operating-system";

type Props = {
  dashboard: SalesExpertEngineDashboard;
  labels: Record<string, string>;
};

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function BlueprintHeader({
  mission,
  philosophy,
  abosPrinciple,
  distinctionNote,
  labels,
}: {
  mission?: string;
  philosophy?: string;
  abosPrinciple?: string;
  distinctionNote?: string;
  labels: Record<string, string>;
}) {
  return (
    <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
      <h2 className="text-sm font-semibold text-teal-900">{labels.operationsTitle}</h2>
      {mission ? (
        <p className="mt-2 text-sm text-teal-900">
          <span className="font-medium">{labels.operationsMission}: </span>
          {mission}
        </p>
      ) : null}
      {philosophy ? (
        <p className="mt-2 text-sm text-teal-900">
          <span className="font-medium">{labels.operationsPhilosophy}: </span>
          {philosophy}
        </p>
      ) : null}
      {abosPrinciple ? (
        <p className="mt-2 text-xs text-teal-800">
          <span className="font-medium">{labels.operationsAbosPrinciple}: </span>
          {abosPrinciple}
        </p>
      ) : null}
      {distinctionNote ? (
        <p className="mt-2 text-xs text-teal-700">
          <span className="font-medium">{labels.operationsDistinctionNote}: </span>
          {distinctionNote}
        </p>
      ) : null}
    </section>
  );
}

function SuccessCriteriaList({
  criteria,
  labels,
}: {
  criteria?: OperationsSuccessCriterion[];
  labels: Record<string, string>;
}) {
  if (!criteria || criteria.length === 0) return null;
  return (
    <section className="rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold">{labels.operationsSuccessCriteria}</h3>
      <ul className="mt-3 space-y-2">
        {criteria.map((c) => (
          <li key={c.key ?? c.label} className="flex items-start gap-2 rounded border border-gray-100 px-3 py-2 text-sm">
            <span className={c.met ? "text-emerald-600" : "text-gray-400"}>{c.met ? "✓" : "○"}</span>
            <div>
              <span className="font-medium">{c.label}</span>
              {c.note ? <p className="mt-0.5 text-xs text-gray-600">{c.note}</p> : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function GoalList({ goals, currency }: { goals?: BusinessGoal[]; currency?: string }) {
  if (!goals || goals.length === 0) return null;
  return (
    <ul className="mt-3 space-y-2">
      {goals.map((goal) => {
        const meta = goal.metadata ?? {};
        const label = typeof meta.label === "string" ? meta.label : goal.goal_key;
        const goalCurrency =
          typeof meta.currency === "string" ? meta.currency : currency ?? "NOK";
        return (
          <li key={goal.goal_key} className="flex flex-wrap items-center justify-between gap-2 rounded border border-gray-100 p-3 text-sm">
            <div>
              <span className="font-medium">{label}</span>
              <p className="text-xs text-gray-500">
                {goal.period} · {goal.status}
              </p>
              {typeof meta.realistic_note === "string" ? (
                <p className="mt-1 text-xs text-gray-600">{meta.realistic_note}</p>
              ) : null}
            </div>
            <span className="font-semibold text-teal-800">
              {goal.target_value ?? 0}
              {goal.goal_key?.includes("revenue") ? ` ${goalCurrency}` : ""}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function SalesOperationsTab({ dashboard, labels }: Props) {
  const ops = dashboard.sales_operations_summary;
  const currency = ops?.currency ?? "NOK";
  const commissions = ops?.commission_estimates;

  return (
    <div className="space-y-6">
      <BlueprintHeader
        mission={dashboard.sales_operations_mission}
        philosophy={dashboard.sales_operations_philosophy}
        abosPrinciple={dashboard.sales_operations_abos_principle}
        distinctionNote={dashboard.sales_operations_distinction_note}
        labels={labels}
      />

      {(dashboard.sales_operations_objectives ?? []).length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.operationsObjectives}</h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.sales_operations_objectives!.map((obj) => (
              <li key={obj.key} className="rounded border border-teal-100 bg-teal-50/40 p-3 text-sm">
                <p className="font-medium">{obj.label}</p>
                {obj.description ? <p className="mt-1 text-xs text-gray-600">{obj.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {ops ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.operationsDashboardSummary}</h3>
          {ops.trends_note ? <p className="mt-1 text-xs text-gray-500">{ops.trends_note}</p> : null}
          {ops.privacy_note ? <p className="mt-1 text-xs text-gray-500">{ops.privacy_note}</p> : null}
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard
              label={labels.operationsImplementationRevenue}
              value={`${ops.implementation_revenue_estimate ?? 0} ${currency}`}
            />
            <MetricCard
              label={labels.operationsTrainingRevenue}
              value={`${ops.training_revenue_estimate ?? 0} ${currency}`}
            />
            <MetricCard label={labels.activeCustomers} value={String(ops.active_customers ?? 0)} />
            <MetricCard label={labels.activeOpportunities} value={String(ops.active_opportunities ?? 0)} />
            <MetricCard label={labels.operationsSupportObligations} value={String(ops.support_obligations ?? 0)} />
            <MetricCard label={labels.operationsCustomersOnboarding} value={String(ops.customers_onboarding ?? 0)} />
            <MetricCard
              label={labels.pendingCommissions}
              value={`${commissions?.pending ?? 0} ${currency}`}
            />
            <MetricCard label={labels.paidCommissions} value={`${commissions?.paid ?? 0} ${currency}`} />
            <MetricCard
              label={labels.forecastedCommissions}
              value={`${commissions?.forecasted ?? 0} ${currency}`}
            />
          </div>
          {(ops.supported_currencies ?? []).length > 0 ? (
            <p className="mt-3 text-xs text-gray-500">
              {labels.operationsSupportedCurrencies}: {(ops.supported_currencies ?? []).join(", ")}
            </p>
          ) : null}
        </section>
      ) : null}

      {dashboard.sales_business_goals_summary ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.operationsGoalManagement}</h3>
          {dashboard.sales_business_goal_management?.principle ? (
            <p className="mt-1 text-xs text-gray-500">{dashboard.sales_business_goal_management.principle}</p>
          ) : null}
          {dashboard.sales_business_goal_management?.boundary ? (
            <p className="mt-1 text-xs font-medium text-amber-800">{dashboard.sales_business_goal_management.boundary}</p>
          ) : null}
          <GoalList goals={dashboard.sales_business_goals_summary.goals} currency={currency} />
          {dashboard.sales_business_goals_summary.goals_okr_route ? (
            <Link
              href={dashboard.sales_business_goals_summary.goals_okr_route}
              className="mt-3 inline-block text-sm text-teal-700 underline"
            >
              {labels.operationsGoalsOkrLink}
            </Link>
          ) : null}
        </section>
      ) : null}

      {dashboard.sales_capacity_awareness ? (
        <section className="rounded-lg border border-rose-100 bg-rose-50/30 p-4 text-sm">
          <h3 className="font-semibold text-rose-900">{labels.operationsCapacityAwareness}</h3>
          <p className="mt-2 text-rose-900">{dashboard.sales_capacity_awareness.principle}</p>
          {(dashboard.sales_capacity_awareness.companion_examples ?? []).map((ex) => (
            <p key={ex.example} className="mt-2 text-rose-800">
              {ex.emoji} {ex.example}
            </p>
          ))}
          <div className="mt-3 flex flex-wrap gap-3 text-xs">
            {dashboard.sales_capacity_awareness.resource_planning_route ? (
              <Link href={dashboard.sales_capacity_awareness.resource_planning_route} className="text-teal-700 underline">
                {labels.operationsResourcePlanningLink}
              </Link>
            ) : null}
            {dashboard.sales_capacity_awareness.personal_productivity_route ? (
              <Link
                href={dashboard.sales_capacity_awareness.personal_productivity_route}
                className="text-teal-700 underline"
              >
                {labels.operationsProductivityLink}
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}

      {dashboard.sales_service_tracking ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="font-semibold">{labels.operationsServiceTracking}</h3>
          <p className="mt-2 text-gray-600">{dashboard.sales_service_tracking.principle}</p>
          {dashboard.sales_service_tracking.independent_business_note ? (
            <p className="mt-2 text-xs font-medium text-teal-800">
              {dashboard.sales_service_tracking.independent_business_note}
            </p>
          ) : null}
          <ul className="mt-3 space-y-2">
            {(dashboard.sales_service_tracking.categories ?? []).map((cat) => (
              <li key={cat.key} className="rounded border border-gray-100 p-3">
                <span className="font-medium">{cat.label}</span>
                {cat.source ? <p className="text-xs text-gray-500">{cat.source}</p> : null}
                {cat.note ? <p className="text-xs text-gray-600">{cat.note}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.sales_forecasting_support ? (
        <section className="rounded-lg border border-sky-100 bg-sky-50/30 p-4 text-sm">
          <h3 className="font-semibold text-sky-900">{labels.operationsForecastingSupport}</h3>
          <p className="mt-2 text-sky-900">{dashboard.sales_forecasting_support.principle}</p>
          {(dashboard.sales_forecasting_support.companion_examples ?? []).map((ex) => (
            <p key={ex.example} className="mt-2 text-sky-800">
              {ex.emoji} {ex.example}
            </p>
          ))}
          {(dashboard.sales_forecasting_support.signals ?? []).length > 0 ? (
            <ul className="mt-3 list-inside list-disc text-xs text-sky-800">
              {dashboard.sales_forecasting_support.signals!.map((sig) => (
                <li key={sig.key}>
                  {sig.label}
                  {sig.source ? ` — ${sig.source}` : ""}
                </li>
              ))}
            </ul>
          ) : null}
          {dashboard.sales_forecasting_support.revenue_intelligence_route ? (
            <Link
              href={dashboard.sales_forecasting_support.revenue_intelligence_route}
              className="mt-3 inline-block text-teal-700 underline"
            >
              {labels.operationsRevenueIntelligenceLink}
            </Link>
          ) : null}
        </section>
      ) : null}

      {dashboard.sales_operations_self_love_connection ? (
        <section className="rounded-lg border border-rose-100 bg-rose-50/40 p-4 text-sm">
          <h3 className="font-semibold">{labels.selfLoveConnection}</h3>
          <p className="mt-2 text-gray-700">{dashboard.sales_operations_self_love_connection.principle}</p>
          {(dashboard.sales_operations_self_love_connection.examples ?? []).map((ex) => (
            <p key={ex.example} className="mt-1 text-gray-600">
              {ex.emoji} {ex.example}
            </p>
          ))}
          {dashboard.sales_operations_self_love_connection.route ? (
            <Link href={dashboard.sales_operations_self_love_connection.route} className="mt-3 inline-block text-teal-700 underline">
              {labels.selfLove}
            </Link>
          ) : null}
        </section>
      ) : null}

      {dashboard.sales_operations_trust_connection ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="font-semibold">{labels.trustConnection}</h3>
          <p className="mt-2 text-gray-600">{dashboard.sales_operations_trust_connection.principle}</p>
          {(dashboard.sales_operations_trust_connection.experts_should_understand ?? []).length > 0 ? (
            <ul className="mt-3 list-inside list-disc text-gray-600">
              {dashboard.sales_operations_trust_connection.experts_should_understand!.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {(dashboard.sales_operations_integration_links ?? []).length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.integrationLinks}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {dashboard.sales_operations_integration_links!.map((link) => (
              <li key={link.key ?? link.route}>
                {link.route ? (
                  <Link href={link.route} className="font-medium text-teal-700 hover:underline">
                    {link.label}
                  </Link>
                ) : (
                  <span className="font-medium">{link.label}</span>
                )}
                {link.note ? <p className="text-xs text-gray-500">{link.note}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(dashboard.sales_operations_vision_phrases ?? []).length > 0 ? (
        <section className="rounded-lg border border-teal-100 bg-teal-50/30 p-4">
          <h3 className="text-sm font-semibold">{labels.visionPhrases}</h3>
          <ul className="mt-3 list-inside list-disc text-sm text-teal-900">
            {dashboard.sales_operations_vision_phrases!.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <SuccessCriteriaList criteria={dashboard.sales_operations_success_criteria} labels={labels} />
    </div>
  );
}
