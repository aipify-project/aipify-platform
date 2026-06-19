"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import type { AipifyStatusKind } from "@/lib/design/status-system";
import { AipifyStatusBadge } from "@/components/ui/aipify-status-badge";
import {
  bc607SectionToRpc,
  type Bc607Section,
} from "@/lib/business-continuity-engine/config";
import {
  parseBusinessContinuityCenter,
  type BusinessContinuityCenter,
} from "@/lib/business-continuity-engine/parse";
import type { buildBusinessContinuityLabels } from "@/lib/business-continuity-engine/labels";

type Labels = ReturnType<typeof buildBusinessContinuityLabels>;

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function statusKeyToKind(statusKey?: string): AipifyStatusKind {
  switch (statusKey) {
    case "verified":
    case "operational":
    case "active":
    case "completed":
      return "verified";
    case "restricted":
    case "critical_unavailable":
      return "restricted";
    case "continuity_risk":
    case "attention":
    case "elevated":
      return "needs_attention";
    case "waiting":
    case "pending":
      return "waiting";
    case "not_allowed":
    case "failed":
      return "not_allowed";
    default:
      return "information";
  }
}

function StatusBadge({ statusKey, label }: { statusKey?: string; label?: string }) {
  if (!label) return null;
  return <AipifyStatusBadge kind={statusKeyToKind(statusKey)} label={label} />;
}

function ItemCard({
  title,
  summary,
  badge,
  statusKey,
  statusLabel,
  extra,
}: {
  title: string;
  summary?: string;
  badge?: string;
  statusKey?: string;
  statusLabel?: string;
  extra?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-semibold text-zinc-900">{title}</p>
        <div className="flex flex-wrap items-center gap-2">
          {statusLabel ? <StatusBadge statusKey={statusKey} label={statusLabel} /> : null}
          {badge ? (
            <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium capitalize text-zinc-700">
              {badge.replace(/_/g, " ")}
            </span>
          ) : null}
        </div>
      </div>
      {summary ? <p className="mt-2 text-sm text-zinc-600">{summary}</p> : null}
      {extra}
    </div>
  );
}

function ItemGrid({
  title,
  items,
  titleKey,
  badgeKey,
  summaryKey,
}: {
  title: string;
  items: Record<string, unknown>[];
  titleKey: string;
  badgeKey?: string;
  summaryKey?: string;
}) {
  if (!items.length) return null;
  return (
    <section className="space-y-3">
      <h3 className="font-semibold text-zinc-900">{title}</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item, idx) => {
          const keyField = Object.keys(item).find((k) => k.endsWith("_key"));
          return (
            <ItemCard
              key={keyField ? String(item[keyField]) : idx}
              title={String(item[titleKey] ?? "")}
              summary={summaryKey ? String(item[summaryKey] ?? "") : undefined}
              badge={badgeKey ? String(item[badgeKey] ?? "") : undefined}
              statusKey={typeof item.status_key === "string" ? item.status_key : undefined}
              statusLabel={typeof item.status_label === "string" ? item.status_label : undefined}
            />
          );
        })}
      </div>
    </section>
  );
}

const SECTION_DATA: Record<
  Bc607Section,
  Array<{ groupKey: keyof Labels["groups"]; dataKey: keyof BusinessContinuityCenter; titleKey: string; badgeKey?: string }>
> = {
  overview: [],
  plans: [
    { groupKey: "continuityPlans", dataKey: "continuity_plans", titleKey: "plan_title", badgeKey: "plan_status" },
    { groupKey: "planReviewCycles", dataKey: "plan_review_cycles", titleKey: "cycle_title", badgeKey: "cycle_status" },
  ],
  criticalOperations: [
    { groupKey: "criticalOperations", dataKey: "critical_operations", titleKey: "operation_title", badgeKey: "operation_type" },
    { groupKey: "continuityScopes", dataKey: "continuity_scopes", titleKey: "scope_title" },
  ],
  businessImpact: [
    { groupKey: "businessImpact", dataKey: "business_impact_assessments", titleKey: "bia_title", badgeKey: "process_name" },
    { groupKey: "recoveryObjectives", dataKey: "recovery_objectives", titleKey: "objective_title", badgeKey: "objective_type" },
  ],
  crisisMode: [
    { groupKey: "crisisModes", dataKey: "crisis_modes", titleKey: "crisis_title", badgeKey: "crisis_status" },
    { groupKey: "crisisCommand", dataKey: "crisis_command", titleKey: "role_title" },
    { groupKey: "minimumOperating", dataKey: "minimum_operating_modes", titleKey: "mode_title" },
  ],
  recoveryPlans: [
    { groupKey: "recoveryPlans", dataKey: "recovery_plans", titleKey: "recovery_title", badgeKey: "recovery_status" },
    { groupKey: "returnToNormal", dataKey: "return_to_normal", titleKey: "closure_title" },
  ],
  emergencyContacts: [
    { groupKey: "emergencyContacts", dataKey: "emergency_contacts", titleKey: "contact_name", badgeKey: "contact_role" },
  ],
  communication: [
    { groupKey: "communications", dataKey: "communications", titleKey: "communication_title", badgeKey: "audience_type" },
  ],
  dependencies: [
    { groupKey: "dependencies", dataKey: "dependencies", titleKey: "dependency_title", badgeKey: "dependency_type" },
    { groupKey: "supplierContinuity", dataKey: "supplier_continuity", titleKey: "supplier_title" },
    { groupKey: "connectedApps", dataKey: "connected_app_continuity", titleKey: "app_title" },
    { groupKey: "domainContinuity", dataKey: "domain_continuity", titleKey: "domain_label" },
  ],
  exercises: [
    { groupKey: "exercises", dataKey: "exercises", titleKey: "exercise_title", badgeKey: "exercise_type" },
    { groupKey: "readinessScores", dataKey: "readiness_scores", titleKey: "dimension" },
  ],
  evidence: [
    { groupKey: "criticalDocuments", dataKey: "critical_documents", titleKey: "document_title" },
    { groupKey: "dataContinuity", dataKey: "data_continuity", titleKey: "data_title" },
    { groupKey: "financialContinuity", dataKey: "financial_continuity", titleKey: "financial_title" },
    { groupKey: "customerService", dataKey: "customer_service_continuity", titleKey: "service_title" },
    { groupKey: "salesContinuity", dataKey: "sales_continuity", titleKey: "sales_title" },
    { groupKey: "partnerCommission", dataKey: "partner_commission_protection", titleKey: "protection_title" },
  ],
  reports: [
    { groupKey: "reports", dataKey: "reports", titleKey: "report_title", badgeKey: "report_type" },
    { groupKey: "auditRecent", dataKey: "audit_recent", titleKey: "event_type", badgeKey: "audit_category" },
  ],
};

export function BusinessContinuityPanel({
  labels,
  activeSection,
  rpcSection,
}: {
  labels: Labels;
  activeSection: Bc607Section;
  rpcSection?: string;
}) {
  const [center, setCenter] = useState<BusinessContinuityCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const section = rpcSection ?? bc607SectionToRpc(activeSection);
    const res = await fetch(`/api/business-continuity/center?section=${section}`);
    if (res.ok) setCenter(parseBusinessContinuityCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, [activeSection, rpcSection]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <p className="font-medium">{labels.empty}</p>
        <p className="mt-2 text-sm text-amber-900">{labels.noRecords}</p>
        {center?.error ? <p className="mt-2 text-sm">{center.error}</p> : null}
      </div>
    );
  }

  const stats = center.stats ?? {};
  const exec = center.executive_dashboard ?? {};
  const sectionBlocks = SECTION_DATA[activeSection];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">{labels.sections[activeSection]}</h2>
          {center.privacy_note ? <p className="mt-1 text-xs text-zinc-500">{center.privacy_note}</p> : null}
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          {labels.refresh}
        </button>
      </div>

      {center.principle ? (
        <p className="rounded-2xl border border-violet-100 bg-violet-50/70 px-5 py-4 text-sm text-violet-950">
          {center.principle}
        </p>
      ) : null}

      {center.continuity_status ? (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
          <span className="text-sm font-medium text-zinc-600">{labels.continuityStatus}</span>
          <StatusBadge
            statusKey={center.continuity_status.status_key}
            label={center.continuity_status.status_label}
          />
          {center.readiness_score != null ? (
            <span className="text-sm text-zinc-600">
              {labels.readinessScore}: <strong>{center.readiness_score}</strong>
            </span>
          ) : null}
        </div>
      ) : null}

      {activeSection === "overview" && (
        <>
          <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/80 to-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-600">
              {labels.executiveDashboard}
            </h3>
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard label={labels.executive.readinessScore} value={exec.readiness_score ?? "—"} />
              <StatCard label={labels.executive.activePlans} value={exec.active_plans ?? "—"} />
              <StatCard label={labels.executive.criticalOperations} value={exec.critical_operations ?? "—"} />
              <StatCard label={labels.executive.singlePointsOfFailure} value={exec.single_points_of_failure ?? "—"} />
              <StatCard label={labels.executive.crisisModeStatus} value={String(exec.crisis_mode_status ?? "—")} />
              <StatCard label={labels.executive.recoveryPlansReady} value={exec.recovery_plans_ready ?? "—"} />
            </dl>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/app/business-continuity/crisis"
                className="rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
              >
                {labels.openCrisisDashboard}
              </Link>
              <Link
                href="/app/business-continuity/recovery"
                className="rounded-lg bg-indigo-700 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-800"
              >
                {labels.openRecoveryBoard}
              </Link>
            </div>
          </section>

          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label={labels.stats.continuityScopes} value={stats.continuity_scopes ?? 0} />
            <StatCard label={labels.stats.biaAssessments} value={stats.bia_assessments ?? 0} />
            <StatCard label={labels.stats.continuityPlans} value={stats.continuity_plans ?? 0} />
            <StatCard label={labels.stats.dependencies} value={stats.dependencies ?? 0} />
            <StatCard label={labels.stats.emergencyContacts} value={stats.emergency_contacts ?? 0} />
            <StatCard label={labels.stats.exercises} value={stats.exercises ?? 0} />
            <StatCard label={labels.stats.recoveryPlans} value={stats.recovery_plans ?? 0} />
          </dl>

          {center.companion_recommendations?.length ? (
            <section className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.companionRecommendations}</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {center.companion_recommendations.map((rec, idx) => (
                  <ItemCard
                    key={idx}
                    title={String(rec.title ?? "")}
                    summary={String(rec.reason ?? "")}
                    extra={
                      rec.href ? (
                        <Link href={String(rec.href)} className="mt-3 inline-block text-sm font-medium text-violet-700 hover:underline">
                          View →
                        </Link>
                      ) : null
                    }
                  />
                ))}
              </div>
            </section>
          ) : null}

          <ItemGrid
            title={labels.governanceRules}
            items={center.governance_rules ?? []}
            titleKey="rule_title"
            badgeKey="rule_category"
            summaryKey="summary"
          />

          <ItemGrid
            title={labels.phaseIntegrations}
            items={center.phase_integrations ?? []}
            titleKey="integration_title"
            badgeKey="phase_ref"
            summaryKey="summary"
          />
        </>
      )}

      {sectionBlocks.map((block) => {
        const items = (center[block.dataKey] as Record<string, unknown>[] | undefined) ?? [];
        return (
          <ItemGrid
            key={block.dataKey}
            title={labels.groups[block.groupKey]}
            items={items}
            titleKey={block.titleKey}
            badgeKey={block.badgeKey}
            summaryKey="summary"
          />
        );
      })}

      {activeSection !== "overview" && !sectionBlocks.some((b) => ((center[b.dataKey] as unknown[]) ?? []).length > 0) && (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-center text-sm text-zinc-600">
          {labels.noRecords}
        </div>
      )}
    </div>
  );
}
