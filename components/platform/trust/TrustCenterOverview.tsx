"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { usePlatformProfile } from "@/components/platform/PlatformProfileProvider";
import {
  filterTrustDomainsForRole,
  type TrustDomain,
  type TrustDomainId,
} from "@/lib/platform/trust-center/config";
import { TrustDomainCard } from "./TrustDomainCard";
import { TrustKpiCards } from "./TrustKpiCards";

type GovernanceSummary = {
  audit_event_count?: number;
  tenants_with_audit_events?: number;
  platform_responsibility?: string;
};

type TrustActionsSummary = {
  pending_approvals?: number;
  emergency_tenants?: number;
};

type DomainStats = Partial<Record<TrustDomainId, number>>;

type Props = {
  labels: {
    title: string;
    subtitle: string;
    responsibility: string;
    domainsTitle: string;
    domainsSubtitle: string;
    loading: string;
    kpis: {
      trustScore: string;
      modulesActive: string;
      pendingReviews: string;
      securityExceptions: string;
      scoreHint: string;
    };
    status: {
      active: string;
      attention: string;
    };
    openDomain: string;
    domains: Record<
      TrustDomainId,
      {
        title: string;
        description: string;
        stat: string;
      }
    >;
  };
};

function computeTrustScore(auditCount: number, modulesActive: number): number {
  const auditComponent = Math.min(40, Math.floor(auditCount / 5));
  const moduleComponent = Math.min(40, modulesActive * 4);
  return Math.min(100, 20 + auditComponent + moduleComponent);
}

export function TrustCenterOverview({ labels }: Props) {
  const { platformAdmin, loading: profileLoading } = usePlatformProfile();
  const [loading, setLoading] = useState(true);
  const [governance, setGovernance] = useState<GovernanceSummary | null>(null);
  const [actions, setActions] = useState<TrustActionsSummary | null>(null);
  const [domainStats, setDomainStats] = useState<DomainStats>({});

  const visibleDomains = useMemo(
    () => filterTrustDomainsForRole(platformAdmin?.role),
    [platformAdmin?.role]
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const [
        governanceResult,
        actionsResult,
        identityResult,
        decisionsResult,
        ekeResult,
        goalsResult,
        lifeResult,
        relationshipsResult,
        commercialResult,
        memoryResult,
      ] = await Promise.all([
        supabase.rpc("get_platform_trust_governance"),
        supabase.rpc("get_platform_trust_actions_overview"),
        supabase.rpc("get_platform_identity_overview"),
        supabase.rpc("get_platform_decisions_overview"),
        supabase.rpc("get_platform_employee_knowledge_overview"),
        supabase.rpc("get_platform_goals_overview"),
        supabase.rpc("get_platform_life_os_overview"),
        supabase.rpc("get_platform_relationship_overview"),
        supabase.rpc("get_platform_commercial_packages_overview"),
        supabase.rpc("get_platform_assistant_memory_overview"),
      ]);

      if (cancelled) return;

      setGovernance((governanceResult.data as GovernanceSummary) ?? null);
      setActions((actionsResult.data as TrustActionsSummary) ?? null);
      setDomainStats({
        identity: Number((identityResult.data as { profiles_count?: number })?.profiles_count ?? 0),
        decisions: Number((decisionsResult.data as { pending_recommendations?: number })?.pending_recommendations ?? 0),
        knowledge: Number((ekeResult.data as { approved_items?: number })?.approved_items ?? 0),
        goals: Number((goalsResult.data as { active_goals?: number })?.active_goals ?? 0),
        life: Number((lifeResult.data as { tenants_with_life_os?: number })?.tenants_with_life_os ?? 0),
        relationships: Number((relationshipsResult.data as { active_people?: number })?.active_people ?? 0),
        actions: Number((actionsResult.data as { pending_approvals?: number })?.pending_approvals ?? 0),
        commercial: Number((commercialResult.data as { licensed_modules?: number })?.licensed_modules ?? 0),
        security: Number(governanceResult.data?.audit_event_count ?? 0),
        privacy: Number((memoryResult.data as { tenants_with_memory?: number })?.tenants_with_memory ?? 0),
      });
      setLoading(false);
    }

    if (!profileLoading) void load();

    return () => {
      cancelled = true;
    };
  }, [profileLoading]);

  if (profileLoading || loading) {
    return <p className="text-sm text-gray-500">{labels.loading}</p>;
  }

  const auditCount = governance?.audit_event_count ?? 0;
  const pendingReviews = actions?.pending_approvals ?? 0;
  const securityExceptions = actions?.emergency_tenants ?? 0;
  const trustScore = computeTrustScore(auditCount, visibleDomains.length);

  const kpiItems = [
    {
      label: labels.kpis.trustScore,
      value: `${trustScore}`,
      hint: labels.kpis.scoreHint,
    },
    {
      label: labels.kpis.modulesActive,
      value: `${visibleDomains.length}`,
    },
    {
      label: labels.kpis.pendingReviews,
      value: `${pendingReviews}`,
    },
    {
      label: labels.kpis.securityExceptions,
      value: `${securityExceptions}`,
    },
  ];

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="max-w-3xl text-sm leading-relaxed text-gray-600">{labels.subtitle}</p>
        <p className="max-w-3xl rounded-lg border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-900">
          {governance?.platform_responsibility ?? labels.responsibility}
        </p>
      </header>

      <TrustKpiCards items={kpiItems} />

      <section id="domains" className="scroll-mt-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{labels.domainsTitle}</h2>
          <p className="mt-1 text-sm text-gray-600">{labels.domainsSubtitle}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleDomains.map((domain) => (
            <DomainCardWithLabels
              key={domain.id}
              domain={domain}
              labels={labels}
              statValue={domainStats[domain.id] ?? 0}
              needsAttention={
                (domain.id === "actions" && pendingReviews > 0) ||
                (domain.id === "security" && securityExceptions > 0)
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function DomainCardWithLabels({
  domain,
  labels,
  statValue,
  needsAttention,
}: {
  domain: TrustDomain;
  labels: Props["labels"];
  statValue: number;
  needsAttention: boolean;
}) {
  const copy = labels.domains[domain.id];
  return (
    <TrustDomainCard
      domain={domain}
      title={copy.title}
      description={copy.description}
      statLabel={copy.stat}
      statValue={String(statValue)}
      statusLabel={needsAttention ? labels.status.attention : labels.status.active}
      statusTone={needsAttention ? "attention" : "active"}
      openLabel={labels.openDomain}
    />
  );
}
