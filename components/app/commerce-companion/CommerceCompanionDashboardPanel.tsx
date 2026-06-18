"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseCommerceCompanionDashboard,
  type AbosSuccessCriterion,
  type BlueprintObjective,
  type CommerceCompanionDashboard,
  type CompanionGuidanceItem,
  type IntegrationLink,
} from "@/lib/aipify/commerce-companion";

type CommerceCompanionDashboardPanelProps = {
  labels: Record<string, string>;
};

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-teal-100 bg-teal-50/40 px-3 py-2 text-sm">
      <span className="font-medium">
        {objective.emoji ? `${objective.emoji} ` : ""}
        {objective.label}
      </span>
      {objective.description ? <p className="mt-1 text-xs text-teal-900">{objective.description}</p> : null}
    </div>
  );
}

function GuidanceCard({ item }: { item: CompanionGuidanceItem }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
      <p className="font-medium">
        {item.emoji ? `${item.emoji} ` : ""}
        {item.title}
      </p>
      {item.summary ? <p className="mt-1 text-xs text-gray-600">{item.summary}</p> : null}
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
    case "healthy":
    case "linked":
    case "informational":
      return "bg-emerald-100 text-emerald-800";
    case "attention":
    case "moderate":
    case "important":
      return "bg-amber-100 text-amber-800";
    case "critical":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export function CommerceCompanionDashboardPanel({ labels }: CommerceCompanionDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<CommerceCompanionDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/commerce-companion/dashboard");
    if (res.ok) setDashboard(parseCommerceCompanionDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const generateBriefing = async () => {
    await fetch("/api/aipify/commerce-companion/briefings/generate", { method: "POST" });
    await load();
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_customer) return null;

  const integrationLinks: IntegrationLink[] =
    dashboard.ccombp110_integration_links ?? dashboard.integration_links ?? [];
  const limitationItems = dashboard.commerce_limitation_principles?.must_avoid ?? [];
  const selfLoveQuotes = dashboard.commerce_self_love_connection?.quotes ?? [];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-teal-800">{labels.companionScore}</p>
            <p className="text-3xl font-bold text-teal-900">{dashboard.companion_score ?? 0}</p>
            <p className="mt-1 text-sm text-teal-700">{dashboard.philosophy}</p>
            {dashboard.pressure_free_mode ? (
              <p className="mt-2 text-xs text-teal-600">{labels.pressureFreeMode}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => void generateBriefing()}
            className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
          >
            {labels.generateBriefing}
          </button>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-teal-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-teal-600">{labels.operationalAlerts}</span>
            <p className="font-semibold">{dashboard.operational_alerts_count ?? 0}</p>
          </div>
          <div className="rounded-lg border border-teal-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-teal-600">{labels.growthOpportunities}</span>
            <p className="font-semibold">{dashboard.growth_opportunities_count ?? 0}</p>
          </div>
          <div className="rounded-lg border border-teal-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-teal-600">{labels.profitabilityCoaching}</span>
            <p className="font-semibold">{dashboard.profitability_coaching_count ?? 0}</p>
          </div>
          <div className="rounded-lg border border-teal-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-teal-600">{labels.integrationModules}</span>
            <p className="font-semibold">{dashboard.integration_modules_count ?? 0}</p>
          </div>
        </div>
      </div>

      {dashboard.daily_briefings.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.morningBriefing}</h2>
          {dashboard.daily_briefings.slice(0, 2).map((briefing) => (
            <div key={briefing.id} className="rounded-lg border border-amber-100 bg-amber-50/50 p-4 text-sm">
              <p className="font-medium text-amber-900">{briefing.summary}</p>
              {briefing.revenue_note ? (
                <p className="mt-2 text-xs text-amber-800">
                  {labels.revenueNote}: {briefing.revenue_note}
                </p>
              ) : null}
              {briefing.profit_note ? (
                <p className="mt-1 text-xs text-amber-800">
                  {labels.profitNote}: {briefing.profit_note}
                </p>
              ) : null}
            </div>
          ))}
        </section>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">{labels.holisticVisibility}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { label: labels.revenuePerformance, value: dashboard.revenue_performance },
            { label: labels.profitPerformance, value: dashboard.profit_performance },
            { label: labels.topProducts, value: dashboard.top_products_summary },
            { label: labels.supplierHealth, value: dashboard.supplier_health_summary },
            { label: labels.journeyIndicators, value: dashboard.journey_indicators_summary },
            { label: labels.expansionReadiness, value: dashboard.expansion_readiness_summary },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-gray-100 bg-white p-3 text-sm">
              <p className="font-medium text-gray-800">{item.label}</p>
              <p className="mt-1 text-xs text-gray-600">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {dashboard.morning_briefing_guidance.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.morningGuidance}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.morning_briefing_guidance.map((item) => (
              <GuidanceCard key={item.id ?? item.title} item={item} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.operational_alerts.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.operationalAlertsSection}</h2>
          {dashboard.operational_alerts.map((alert) => (
            <div key={alert.id} className="rounded-lg border border-gray-100 p-3 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{alert.title}</span>
                <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(alert.severity)}`}>
                  {alert.severity}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-600">{alert.summary}</p>
            </div>
          ))}
        </section>
      ) : null}

      {dashboard.opportunity_signals.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.opportunityGuidance}</h2>
          {dashboard.opportunity_signals.map((signal) => (
            <div key={signal.id} className="rounded-lg border border-orange-100 bg-orange-50/30 p-3 text-sm">
              <p className="font-medium">{signal.title}</p>
              <p className="mt-1 text-xs text-gray-600">{signal.summary}</p>
              {signal.intention_note ? (
                <p className="mt-1 text-xs italic text-orange-800">{signal.intention_note}</p>
              ) : null}
            </div>
          ))}
        </section>
      ) : null}

      {dashboard.profitability_coaching.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.profitabilityCoachingSection}</h2>
          {dashboard.profitability_coaching.map((item) => (
            <div key={item.id} className="rounded-lg border border-emerald-100 bg-emerald-50/30 p-3 text-sm">
              <p className="font-medium">{item.title}</p>
              <p className="mt-1 text-xs text-gray-600">{item.summary}</p>
              {item.margin_note ? <p className="mt-1 text-xs text-emerald-800">{item.margin_note}</p> : null}
            </div>
          ))}
        </section>
      ) : null}

      {dashboard.companion_personality.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.companionPersonality}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.companion_personality.map((item) => (
              <GuidanceCard key={item.id ?? item.title} item={item} />
            ))}
          </div>
        </section>
      ) : null}

      {integrationLinks.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.integrationLinks}</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {integrationLinks.map((link) =>
              link.route ? (
                <Link
                  key={link.key ?? link.route}
                  href={link.route}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:border-teal-300 hover:bg-teal-50/50"
                >
                  <span className="font-medium text-gray-900">{link.label}</span>
                  {link.note ? <p className="mt-1 text-xs text-gray-500">{link.note}</p> : null}
                </Link>
              ) : null,
            )}
          </div>
        </section>
      ) : null}

      {dashboard.commerce_companion_objectives?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.blueprintObjectives}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.commerce_companion_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {limitationItems.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.limitationPrinciples}</h2>
          <ul className="list-inside list-disc space-y-1 text-sm text-gray-700">
            {limitationItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {selfLoveQuotes.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.selfLoveConnection}</h2>
          {selfLoveQuotes.slice(0, 2).map((quote) => (
            <p key={quote} className="rounded-lg border border-rose-100 bg-rose-50/40 px-3 py-2 text-sm text-rose-900">
              {quote}
            </p>
          ))}
        </section>
      ) : null}

      {dashboard.commerce_companion_success_criteria?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.successCriteria}</h2>
          <div className="space-y-2">
            {dashboard.commerce_companion_success_criteria.map((criterion) => (
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

      {dashboard.commerce_companion_vision ? (
        <p className="rounded-lg border border-teal-100 bg-teal-50/30 px-4 py-3 text-sm italic text-teal-900">
          {dashboard.commerce_companion_vision}
        </p>
      ) : null}

      {dashboard.safety_note ? <p className="text-xs text-gray-500">{dashboard.safety_note}</p> : null}
    </div>
  );
}
