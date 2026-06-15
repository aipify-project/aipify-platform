"use client";

import Link from "next/link";
import { useMemo } from "react";
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
      allSystemsOperational: string;
      subscriptionsReview: string;
      growthPartnerActivity: string;
      marketplaceReviews: string;
      criticalIncidents: string;
      noInterventionRequired: string;
      platformStable: string;
    };
    systemStatus: {
      title: string;
      lastCheck: string;
      lastCheckSeconds: string;
      avgResponse: string;
      avgResponseMs: string;
      statusOperational: string;
      statusPendingSetup: string;
      statusAttentionRequired: string;
      services: Record<string, string>;
    };
    trustSignals: {
      title: string;
      backupOk: string;
      twoFactorEnforced: string;
      auditLoggingActive: string;
      complianceMonitoringActive: string;
    };
    actionCenter: {
      title: string;
      subtitle: string;
      open: string;
      priorityCritical: string;
      priorityAttention: string;
      priorityInformational: string;
      criticalIncidents: string;
      subscriptionReview: string;
      growthPartnerApplications: string;
      marketplaceReviews: string;
      organizationHealth: string;
      supportEscalations: string;
      globalGovernance: string;
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
    });
  }, [center, labels.actionCenter]);

  if (loading) {
    return <p className="text-sm text-zinc-500">{labels.loading}</p>;
  }

  if (error || !center) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">{labels.emptyStateTitle}</h2>
        <p className="mt-2 text-sm text-zinc-600">{error ?? labels.loadError}</p>
        <p className="mt-4 text-sm text-zinc-500">{labels.emptyStateBody}</p>
      </div>
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
