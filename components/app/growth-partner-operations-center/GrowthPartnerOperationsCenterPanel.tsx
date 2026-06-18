"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseGrowthPartnerOperationsCenter,
  type GrowthPartnerOpsSection,
  type GrowthPartnerOperationsCenter,
} from "@/lib/growth-partner-operations-center";
import { GrowthPartnerLinkCard } from "@/components/app/growth-partner-attribution";
import type { GrowthPartnerOperationsCenterLabels } from "@/lib/growth-partner-operations-center/labels";
import { GrowthPartnerOpsStatusBadge } from "./GrowthPartnerOpsStatusBadge";

type Props = {
  labels: GrowthPartnerOperationsCenterLabels;
  activeSection: GrowthPartnerOpsSection;
};

function MetricGrid({
  items,
  labels,
}: {
  items: GrowthPartnerOperationsCenter["dashboardMetrics"];
  labels: GrowthPartnerOperationsCenterLabels;
}) {
  if (items.length === 0) return null;
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((m) => (
        <div key={m.id} className="rounded-xl border border-violet-100 bg-violet-50/30 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 capitalize">
            {m.metricKey.replace(/_/g, " ")}
          </p>
          <p className="mt-1 text-2xl font-bold text-violet-900">{m.metricValue}</p>
          {m.trendLabel ? <p className="mt-1 text-xs text-zinc-600">{m.trendLabel}</p> : null}
          <div className="mt-2">
            <GrowthPartnerOpsStatusBadge statusKey={m.statusKey} labels={labels.status} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function GrowthPartnerOperationsCenterPanel({ labels, activeSection }: Props) {
  const [center, setCenter] = useState<GrowthPartnerOperationsCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/growth-partner/operations-center");
    if (res.ok) setCenter(parseGrowthPartnerOperationsCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.title}</span>
      </div>
    );
  }

  if (!center?.found) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <p className="font-medium">{labels.accessDenied}</p>
        {center?.error ? <p className="mt-2 text-sm">{center.error}</p> : null}
        <Link href="/growth-partners" className="mt-4 inline-block text-sm font-medium text-violet-700 hover:underline">
          {labels.title}
        </Link>
      </div>
    );
  }

  const sectionTitle = (() => {
    switch (activeSection) {
      case "dashboard":
        return labels.dashboard.title;
      case "leads":
        return labels.leads.title;
      case "opportunities":
        return labels.opportunities.title;
      case "customers":
        return labels.customers.title;
      case "commissions":
        return labels.commissions.title;
      case "payouts":
        return labels.payouts.title;
      case "resources":
        return labels.resources.title;
      case "training":
        return labels.training.title;
      case "certifications":
        return labels.certifications.title;
      case "performance":
        return labels.performance.title;
      case "support":
        return labels.support.title;
      default:
        return labels.title;
    }
  })();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">{sectionTitle}</h2>
          {center.certificationStatusLabel ? (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <GrowthPartnerOpsStatusBadge
                statusKey={center.certificationStatusKey ?? "waiting"}
                labels={labels.status}
              />
              <span className="text-sm text-zinc-600">{center.certificationStatusLabel}</span>
            </div>
          ) : null}
          {activeSection === "dashboard" && center.governanceNote ? (
            <p className="mt-2 text-sm text-violet-900">{center.governanceNote}</p>
          ) : null}
          {center.privacyNote ? <p className="mt-1 text-xs text-zinc-500">{center.privacyNote}</p> : null}
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          {labels.refresh}
        </button>
      </div>

      {activeSection === "dashboard" ? (
        <>
          <GrowthPartnerLinkCard partnerLink={center.partnerLink} labels={labels.partnerLink} />
          <MetricGrid items={center.dashboardMetrics} labels={labels} />
          {center.growthRecommendations.length > 0 ? (
            <section className="rounded-2xl border border-blue-100 bg-blue-50/30 p-5">
              <h3 className="font-semibold text-zinc-900">{labels.dashboard.growthRecommendations}</h3>
              <ul className="mt-4 space-y-3">
                {center.growthRecommendations.map((rec) => (
                  <li key={rec.id} className="rounded-lg border border-blue-100 bg-white p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="font-medium text-zinc-900">{rec.title}</p>
                      <GrowthPartnerOpsStatusBadge statusKey={rec.statusKey} labels={labels.status} />
                    </div>
                    <p className="mt-1 text-sm text-zinc-600">{rec.insight}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {center.recentActivity.length > 0 ? (
            <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-zinc-900">{labels.dashboard.recentActivity}</h3>
              <ul className="mt-4 space-y-3">
                {center.recentActivity.map((act) => (
                  <li key={act.id} className="flex flex-wrap items-start justify-between gap-2 border-b border-zinc-100 pb-3 last:border-0">
                    <div>
                      <p className="font-medium text-zinc-900">{act.title}</p>
                      <p className="text-sm text-zinc-600">{act.summary}</p>
                      {act.auditRef ? (
                        <p className="mt-1 text-xs text-zinc-500">
                          {labels.auditRef}: {act.auditRef}
                        </p>
                      ) : null}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-zinc-500">{act.dateLabel}</p>
                      <GrowthPartnerOpsStatusBadge statusKey={act.statusKey} labels={labels.status} />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      ) : null}

      {activeSection === "leads" ? (
        <div className="space-y-3">
          {center.leadManagement.map((lead) => (
            <div key={lead.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-zinc-900">{lead.companyName}</p>
                  <p className="text-sm text-zinc-600">{lead.contactName}</p>
                </div>
                <GrowthPartnerOpsStatusBadge statusKey={lead.statusKey} labels={labels.status} />
              </div>
              <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <p><span className="font-medium capitalize">{lead.leadStatus.replace(/_/g, " ")}</span></p>
                <p><span className="text-zinc-500">{labels.leadSource}:</span> {lead.leadSource}</p>
                {lead.partnerNotes ? <p className="sm:col-span-2"><span className="text-zinc-500">{labels.partnerNotes}:</span> {lead.partnerNotes}</p> : null}
                {lead.followUpTask ? <p className="sm:col-span-2"><span className="text-zinc-500">{labels.followUpTask}:</span> {lead.followUpTask}</p> : null}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {activeSection === "opportunities" ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {center.opportunityPipeline.map((opp) => (
            <div key={opp.id} className="rounded-xl border border-indigo-100 bg-indigo-50/20 p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-zinc-900">{opp.title}</p>
                <GrowthPartnerOpsStatusBadge statusKey={opp.statusKey} labels={labels.status} />
              </div>
              <p className="mt-2 text-sm capitalize text-indigo-800">{opp.stage.replace(/_/g, " ")}</p>
              <p className="mt-1 text-sm text-zinc-700"><span className="font-medium">{labels.forecastValue}:</span> {opp.forecastValueLabel}</p>
              <p className="text-sm text-zinc-600"><span className="font-medium">{labels.expectedClose}:</span> {opp.expectedCloseDate}</p>
            </div>
          ))}
        </div>
      ) : null}

      {activeSection === "customers" ? (
        <div className="space-y-3">
          {center.customerPortfolio.map((cust) => (
            <div key={cust.id} className="rounded-xl border border-emerald-100 bg-emerald-50/20 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="font-semibold text-zinc-900">{cust.customerName}</p>
                <GrowthPartnerOpsStatusBadge statusKey={cust.statusKey} labels={labels.status} />
              </div>
              <div className="mt-3 grid gap-1 text-sm sm:grid-cols-2">
                <p><span className="text-zinc-500">{labels.plan}:</span> {cust.planLabel}</p>
                <p><span className="text-zinc-500">{labels.monthlyRevenue}:</span> {cust.monthlyRevenueLabel}</p>
                <p><span className="text-zinc-500">{labels.commissionValue}:</span> {cust.commissionValueLabel}</p>
                <p><span className="text-zinc-500">{labels.renewalStatus}:</span> {cust.renewalStatus}</p>
                <p><span className="text-zinc-500">{labels.health}:</span> {cust.healthLabel}</p>
                <p><span className="text-zinc-500">{labels.supportStatus}:</span> {cust.supportStatus}</p>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {activeSection === "commissions" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {center.commissionCenter.map((com) => (
            <div key={com.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-zinc-900">{com.periodLabel}</p>
                <GrowthPartnerOpsStatusBadge statusKey={com.statusKey} labels={labels.status} />
              </div>
              <p className="mt-2 text-2xl font-bold text-violet-900">{com.amountLabel}</p>
              {com.rulesSummary ? (
                <p className="mt-2 text-xs text-zinc-600"><span className="font-medium">{labels.commissionRules}:</span> {com.rulesSummary}</p>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {activeSection === "payouts" ? (
        <div className="space-y-3">
          {center.payoutCenter.map((pay) => (
            <div key={pay.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="text-xl font-bold text-zinc-900">{pay.amountLabel}</p>
                <GrowthPartnerOpsStatusBadge statusKey={pay.statusKey} labels={labels.status} />
              </div>
              <p className="mt-1 text-sm capitalize text-zinc-700">{pay.payoutStatus.replace(/_/g, " ")}</p>
              <p className="mt-2 text-sm text-zinc-600"><span className="font-medium">{labels.bankVerification}:</span> {pay.bankVerificationLabel}</p>
              <p className="text-sm text-zinc-600"><span className="font-medium">{labels.settlementDate}:</span> {pay.settlementDateLabel}</p>
            </div>
          ))}
          <p className="text-sm text-zinc-500">{labels.exportStatements}</p>
        </div>
      ) : null}

      {activeSection === "resources" ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {center.marketingResources.map((res) => (
            <div key={res.id} className="rounded-xl border border-violet-100 bg-violet-50/20 p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-zinc-900">{res.title}</p>
                <GrowthPartnerOpsStatusBadge statusKey={res.statusKey} labels={labels.status} />
              </div>
              <p className="mt-1 text-xs capitalize text-violet-800">{res.resourceType.replace(/_/g, " ")}</p>
              {res.summary ? <p className="mt-2 text-sm text-zinc-600">{res.summary}</p> : null}
            </div>
          ))}
        </div>
      ) : null}

      {activeSection === "training" || activeSection === "certifications" ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-5">
            <p className="text-xs font-medium uppercase text-zinc-500">{labels.trainingProgress}</p>
            <p className="mt-1 text-3xl font-bold text-emerald-900">{center.trainingProgressPct ?? 0}%</p>
            <p className="mt-1 text-sm text-zinc-600">
              {labels.completedModules}: {center.trainingCompletedCount ?? 0} · {labels.remainingModules}:{" "}
              {Math.max(0, (center.trainingTotalCount ?? 0) - (center.trainingCompletedCount ?? 0))}
            </p>
          </div>
          {activeSection === "certifications" ? (
            <p className="text-sm text-zinc-600">{labels.renewalRequirements}</p>
          ) : null}
          <ul className="space-y-2">
            {center.trainingCenter.map((mod) => (
              <li key={mod.moduleKey} className="flex items-center justify-between gap-4 rounded-lg border border-zinc-100 px-4 py-3 text-sm">
                <span className="text-zinc-800">{mod.moduleTitle}</span>
                <span className="text-xs capitalize text-zinc-500">{mod.status.replace(/_/g, " ")}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {activeSection === "performance" ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {center.performanceCenter.map((perf) => (
            <div key={perf.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase text-zinc-500 capitalize">{perf.metricKey.replace(/_/g, " ")}</p>
              <p className="mt-1 text-2xl font-bold text-zinc-900">{perf.metricValue}</p>
              {perf.trendLabel ? <p className="mt-1 text-xs text-zinc-600">{perf.trendLabel}</p> : null}
              <div className="mt-2">
                <GrowthPartnerOpsStatusBadge statusKey={perf.statusKey} labels={labels.status} />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {activeSection === "support" ? (
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-zinc-700">{labels.support.body}</p>
          <p className="text-sm font-medium text-violet-900">{center.governanceNote}</p>
          <Link href="/app/support" className="inline-block text-sm font-medium text-violet-700 hover:underline">
            /app/support
          </Link>
        </div>
      ) : null}
    </div>
  );
}
