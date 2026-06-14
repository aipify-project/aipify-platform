"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyEmptyState } from "@/components/branding";
import { HealthScoreCard } from "@/components/app/shared/HealthScoreCard";
import { SectionCard } from "@/components/app/shared/SectionCard";
import type { CustomerExecutiveDashboard, HealthScoreBand } from "@/lib/app/customer-app";
import { formatDate } from "@/lib/i18n/format-date";
import { createClient } from "@/lib/supabase/client";

type ExecutiveDashboardPanelProps = {
  locale: string;
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    pulseLabel: string;
    healthTitle: string;
    healthBands: Record<HealthScoreBand, string>;
    sections: {
      summary: string;
      activity: string;
      recommendations: string;
      approvals: string;
      skills: string;
      installations: string;
      quickActions: string;
    };
    noActivity: string;
    installationsHealthy: string;
    viewApprovals: string;
    decisionSupportLink: string;
    strategicIntelligenceLink: string;
    continuousImprovementLink: string;
    organizationalResilienceLink: string;
    opportunityDiscoveryLink: string;
    organizationalHealthLink: string;
    changeManagementLink: string;
    organizationalDigitalTwinLink: string;
    capabilityMaturityLink: string;
    executionExcellenceLink: string;
    organizationalAlignmentLink: string;
    organizationalFocusLink: string;
    organizationalEnergyLink: string;
    organizationalAdaptabilityLink: string;
    organizationalWisdomLink: string;
    organizationalLegacyLink: string;
    organizationalPurposeLink: string;
    organizationalStewardshipLink: string;
    organizationalSimplicityLink: string;
    organizationalTrustLink: string;
    organizationalMomentumLink: string;
    organizationalFuturesLink: string;
    organizationalCoherenceLink: string;
    organizationalContinuityLink: string;
    organizationalExcellenceLink: string;
    organizationalImpactLink: string;
    organizationalDecisionQualityLink: string;
    organizationalConfidenceLink: string;
    organizationalFlourishingLink: string;
    organizationalRenewalLink: string;
    organizationalSustainabilityLink: string;
    organizationalTransformationLink: string;
    organizationalCompoundingLink: string;
    organizationalSteadfastnessLink: string;
    organizationalClarityLink: string;
    organizationalIntentionalityLink: string;
    organizationalAwarenessLink: string;
    organizationalHarmonyLink: string;
    organizationalCuriosityLink: string;
    organizationalCourageLink: string;
    organizationalHopeLink: string;
    organizationalWisdomTransferLink: string;
    organizationalAdaptiveIntelligenceLink: string;
    organizationalBalanceLink: string;
    organizationalPresenceLink: string;
  };
};

export function ExecutiveDashboardPanel({ locale, labels }: ExecutiveDashboardPanelProps) {
  const [data, setData] = useState<CustomerExecutiveDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const supabase = createClient();
    const { data: bundle, error } = await supabase.rpc("get_customer_executive_dashboard");
    if (!error && bundle?.has_customer) {
      setData(bundle as CustomerExecutiveDashboard);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;

  if (!data?.has_customer) {
    return (
      <div className="p-6">
        <AipifyEmptyState message={labels.empty} pulseLabel={labels.pulseLabel} />
      </div>
    );
  }

  const health = data.health_score ?? { score: 90, label: "healthy" as HealthScoreBand };
  const installs = data.installation_status ?? { total: 0, healthy: 0, attention: 0 };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <Link href="/app/executive/decision-support" className="mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.decisionSupportLink}
        </Link>
        <Link href="/app/executive/strategic-intelligence" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.strategicIntelligenceLink}
        </Link>
        <Link href="/app/executive/continuous-improvement" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.continuousImprovementLink}
        </Link>
        <Link href="/app/executive/organizational-resilience" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalResilienceLink}
        </Link>
        <Link href="/app/executive/opportunity-discovery" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.opportunityDiscoveryLink}
        </Link>
        <Link href="/app/executive/organizational-health" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalHealthLink}
        </Link>
        <Link href="/app/executive/change-management" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.changeManagementLink}
        </Link>
        <Link href="/app/executive/organizational-digital-twin" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalDigitalTwinLink}
        </Link>
        <Link href="/app/executive/capability-maturity" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.capabilityMaturityLink}
        </Link>
        <Link href="/app/executive/execution-excellence" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.executionExcellenceLink}
        </Link>
        <Link href="/app/executive/organizational-alignment" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalAlignmentLink}
        </Link>
        <Link href="/app/executive/organizational-focus" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalFocusLink}
        </Link>
        <Link href="/app/executive/organizational-energy" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalEnergyLink}
        </Link>
        <Link href="/app/executive/organizational-adaptability" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalAdaptabilityLink}
        </Link>
        <Link href="/app/executive/organizational-wisdom" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalWisdomLink}
        </Link>
        <Link href="/app/executive/organizational-legacy" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalLegacyLink}
        </Link>
        <Link href="/app/executive/organizational-purpose" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalPurposeLink}
        </Link>
        <Link href="/app/executive/organizational-stewardship" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalStewardshipLink}
        </Link>
        <Link href="/app/executive/organizational-simplicity" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalSimplicityLink}
        </Link>
        <Link href="/app/executive/organizational-trust" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalTrustLink}
        </Link>
        <Link href="/app/executive/organizational-momentum" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalMomentumLink}
        </Link>
        <Link href="/app/executive/organizational-futures" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalFuturesLink}
        </Link>
        <Link href="/app/executive/organizational-coherence" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalCoherenceLink}
        </Link>
        <Link href="/app/executive/organizational-continuity" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalContinuityLink}
        </Link>
        <Link href="/app/executive/organizational-excellence" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalExcellenceLink}
        </Link>
        <Link href="/app/executive/organizational-impact" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalImpactLink}
        </Link>
        <Link href="/app/executive/organizational-decision-quality" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalDecisionQualityLink}
        </Link>
        <Link href="/app/executive/organizational-confidence" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalConfidenceLink}
        </Link>
        <Link href="/app/executive/organizational-flourishing" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalFlourishingLink}
        </Link>
        <Link href="/app/executive/organizational-renewal" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalRenewalLink}
        </Link>
        <Link href="/app/executive/organizational-sustainability" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalSustainabilityLink}
        </Link>
        <Link href="/app/executive/organizational-transformation" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalTransformationLink}
        </Link>
        <Link href="/app/executive/organizational-compounding" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalCompoundingLink}
        </Link>
        <Link href="/app/executive/organizational-steadfastness" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalSteadfastnessLink}
        </Link>
        <Link href="/app/executive/organizational-clarity" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalClarityLink}
        </Link>
        <Link href="/app/executive/organizational-intentionality" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalIntentionalityLink}
        </Link>
        <Link href="/app/executive/organizational-awareness" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalAwarenessLink}
        </Link>
        <Link href="/app/executive/organizational-harmony" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalHarmonyLink}
        </Link>
        <Link href="/app/executive/organizational-curiosity" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalCuriosityLink}
        </Link>
        <Link href="/app/executive/organizational-courage" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalCourageLink}
        </Link>
        <Link href="/app/executive/organizational-hope" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalHopeLink}
        </Link>
        <Link href="/app/executive/organizational-wisdom-transfer" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalWisdomTransferLink}
        </Link>
        <Link href="/app/executive/organizational-adaptive-intelligence" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalAdaptiveIntelligenceLink}
        </Link>
        <Link href="/app/executive/organizational-balance" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalBalanceLink}
        </Link>
        <Link href="/app/executive/organizational-presence" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalPresenceLink}
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <HealthScoreCard
          score={health.score}
          label={health.label}
          labels={labels.healthBands}
          title={labels.healthTitle}
        />
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">{labels.sections.approvals}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{data.pending_approvals ?? 0}</p>
          <Link href="/app/approvals" className="mt-2 inline-block text-sm text-indigo-600 hover:underline">
            {labels.viewApprovals}
          </Link>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">{labels.sections.skills}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{data.active_skills ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">{labels.sections.installations}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{installs.total}</p>
          <p className="mt-1 text-xs text-gray-500">
            {installs.healthy} {labels.installationsHealthy}
          </p>
        </div>
      </div>

      <SectionCard title={labels.sections.summary}>
        <p className="text-sm text-gray-700">{data.executive_summary}</p>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title={labels.sections.activity}>
          {(data.recent_activity ?? []).length === 0 ? (
            <p className="text-sm text-gray-500">{labels.noActivity}</p>
          ) : (
            <ul className="space-y-2">
              {(data.recent_activity ?? []).slice(0, 8).map((item) => (
                <li key={item.id} className="text-sm text-gray-700">
                  {item.title}
                  <span className="ml-2 text-gray-400">{formatDate(item.created_at, locale)}</span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title={labels.sections.recommendations}>
          <ul className="space-y-2">
            {(data.recommendations ?? []).slice(0, 5).map((item) => (
              <li key={item.id} className="text-sm text-gray-700">
                {item.message}
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
