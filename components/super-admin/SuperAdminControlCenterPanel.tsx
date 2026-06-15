"use client";

import Link from "next/link";
import { useMemo } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  buildActionCenterItems,
  buildExecutiveSummary,
} from "@/lib/super-admin/executive-summary";
import { SUPER_ADMIN_SECTIONS } from "@/lib/super-admin/nav-config";
import { useSuperAdminOperations } from "./SuperAdminOperationsProvider";
import SuperAdminExecutiveHeader from "./executive/SuperAdminExecutiveHeader";
import SuperAdminExecutiveSummary from "./executive/SuperAdminExecutiveSummary";
import SuperAdminSystemStatusCards from "./executive/SuperAdminSystemStatusCards";
import SuperAdminTrustSignalsPanel, {
  SuperAdminActionCenterPanel,
} from "./executive/SuperAdminTrustSignals";

type SuperAdminControlCenterPanelProps = {
  labels: {
    loading: string;
    loadError: string;
    emptyStateTitle: string;
    emptyStateBody: string;
    setupNotice: string;
    privacyNote: string;
    sectionsTitle: string;
    openModule: string;
    executiveHeader: {
      headquarters: string;
      operationsCenter: string;
      subtext: string;
      platformStatus: string;
      organizationsServed: string;
      activeWorkspaces: string;
      actionsToday: string;
      systemUptime: string;
      statusOperational: string;
      statusPendingSetup: string;
      statusAttentionRequired: string;
    };
    executiveSummary: {
      title: string;
      greetingMorning: string;
      greetingAfternoon: string;
      greetingEvening: string;
      monitoringAreas: string;
      allSystemsOperational: string;
      subscriptionsReview: string;
      growthPartnerActivity: string;
      marketplaceReviews: string;
      paymentProviderIncomplete: string;
      criticalIncidents: string;
      noInterventionRequired: string;
      platformStable: string;
      attentionRequiredToday: string;
      estimatedReviewTime: string;
    };
    systemStatus: {
      title: string;
      lastCheck: string;
      lastCheckSeconds: string;
      avgResponse: string;
      avgResponseMs: string;
      uptimeTrend: string;
      uptimeTrendValue: string;
      setupProgress: string;
      statusOperational: string;
      statusPendingSetup: string;
      statusAttentionRequired: string;
      services: Record<string, string>;
    };
    trustSignals: {
      title: string;
      subtitle: string;
      backupOk: string;
      backupVerified: string;
      twoFactorEnforced: string;
      auditLoggingActive: string;
      complianceMonitoringActive: string;
      securityPosture: string;
      securityPostureStrong: string;
      securityPostureReview: string;
      complianceHealth: string;
      incidentFreeDays: string;
      executiveVisibility: string;
    };
    actionCenter: {
      title: string;
      subtitle: string;
      open: string;
      takeAction: string;
      priorityCritical: string;
      priorityAttention: string;
      priorityInformational: string;
      categoryRequiresApproval: string;
      categoryRecommended: string;
      categoryCritical: string;
      categoryMilestones: string;
      impactHigh: string;
      impactMedium: string;
      impactLow: string;
      estimatedTime: string;
      criticalIncidents: string;
      subscriptionReview: string;
      growthPartnerApplications: string;
      marketplaceReviews: string;
      organizationHealth: string;
      supportEscalations: string;
      globalGovernance: string;
      paymentProviderSetup: string;
    };
  };
  sectionLabels: Record<string, { title: string; purpose: string }>;
  moduleLabels: Record<string, { label: string; description: string }>;
};

export default function SuperAdminControlCenterPanel({
  labels,
  sectionLabels,
  moduleLabels,
}: SuperAdminControlCenterPanelProps) {
  const { center, loading, error } = useSuperAdminOperations();

  const summaryLines = useMemo(() => {
    if (!center) return [];
    return buildExecutiveSummary(center, labels.executiveSummary);
  }, [center, labels.executiveSummary]);

  const actionItems = useMemo(() => {
    if (!center) return [];
    return buildActionCenterItems(center, {
      criticalIncidents: labels.actionCenter.criticalIncidents,
      subscriptionReview: labels.actionCenter.subscriptionReview,
      growthPartnerApplications: labels.actionCenter.growthPartnerApplications,
      marketplaceReviews: labels.actionCenter.marketplaceReviews,
      organizationHealth: labels.actionCenter.organizationHealth,
      supportEscalations: labels.actionCenter.supportEscalations,
      globalGovernance: labels.actionCenter.globalGovernance,
      paymentProviderSetup: labels.actionCenter.paymentProviderSetup,
    });
  }, [center, labels.actionCenter]);

  if (loading) {
    return <AipifyLoader label={labels.loading} centered fullPage />;
  }

  if (error || !center) {
    return (
      <PlatformEmptyState
        title={labels.emptyStateTitle}
        message={`${error ?? labels.loadError} ${labels.emptyStateBody}`}
      />
    );
  }

  const showEmptyNotice =
    center.setup_notice === true ||
    center.data_state === "empty" ||
    center.data_state === "degraded";

  const services = center.system_services ?? [];

  return (
    <div className="space-y-6">
      {showEmptyNotice ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-950">
          <p className="font-medium">{labels.emptyStateTitle}</p>
          <p className="mt-1 text-amber-900">{center.setup_notice ? labels.setupNotice : labels.emptyStateBody}</p>
        </div>
      ) : null}

      <SuperAdminExecutiveHeader center={center} labels={labels.executiveHeader} />

      <SuperAdminExecutiveSummary
        lines={summaryLines}
        title={labels.executiveSummary.title}
        openActionLabel={labels.actionCenter.open}
      />

      <SuperAdminSystemStatusCards services={services} labels={labels.systemStatus} />

      {center.trust_signals ? (
        <SuperAdminTrustSignalsPanel signals={center.trust_signals} labels={labels.trustSignals} />
      ) : null}

      <SuperAdminActionCenterPanel items={actionItems} labels={labels.actionCenter} />

      <p className="text-xs text-zinc-500">{labels.privacyNote}</p>

      <section>
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
          {labels.sectionsTitle}
        </h3>
        <div className="mt-4 space-y-6">
          {SUPER_ADMIN_SECTIONS.map((section) => {
            const sectionLabel = sectionLabels[section.id];
            return (
              <div
                key={section.id}
                className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm lg:p-8"
              >
                <h4 className="text-base font-semibold text-zinc-900">{sectionLabel?.title}</h4>
                <p className="mt-1 text-sm text-zinc-600">{sectionLabel?.purpose}</p>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {section.modules.map((module) => {
                    const moduleLabel = moduleLabels[module.id];
                    return (
                      <li key={module.id}>
                        <Link
                          href={module.href}
                          className="block rounded-xl border border-zinc-100 bg-zinc-50/60 p-4 transition hover:border-zinc-300 hover:bg-white"
                        >
                          <p className="text-sm font-medium text-zinc-900">{moduleLabel?.label}</p>
                          <p className="mt-1 text-xs leading-relaxed text-zinc-600">
                            {moduleLabel?.description}
                          </p>
                          <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                            {labels.openModule}
                          </p>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
