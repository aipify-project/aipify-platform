"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  DGC_CORE_PRINCIPLE,
  DGC_PHILOSOPHY,
  DGC_VISION,
  parseDatabaseGovernanceCenter,
  type DatabaseGovernanceCenter,
  type MigrationRegistryEntry,
} from "@/lib/database-governance-center";

type PanelLabels = {
  title: string;
  subtitle: string;
  loading: string;
  corePrinciple: string;
  philosophyTitle: string;
  visionTitle: string;
  operationsLink: string;
  automationControlLink: string;
  updatesLink: string;
  securityLink: string;
  executiveLink: string;
  dashboardTitle: string;
  migrationsTitle: string;
  validationTitle: string;
  driftTitle: string;
  insightsTitle: string;
  recommendationsTitle: string;
  environmentTitle: string;
  reviewsTitle: string;
  emptySection: string;
  healthScore: string;
  dismiss: string;
  accept: string;
  acknowledge: string;
  review: string;
  validate: string;
  archive: string;
  completeReview: string;
  generateReport: string;
  resolve: string;
  humansDecide: string;
  privacyNote: string;
  migrationStatus: string;
  riskLevel: string;
  environment: string;
  rollbackNotes: string;
  healthBands: Record<string, string>;
  migrationStatuses: Record<string, string>;
  riskLevels: Record<string, string>;
  reviewTypes: Record<string, string>;
  metrics: Record<string, string>;
};

type Props = { labels: PanelLabels };

const BAND_STYLES: Record<string, string> = {
  excellent: "bg-emerald-100 text-emerald-900",
  healthy: "bg-teal-100 text-teal-900",
  attention_required: "bg-amber-100 text-amber-900",
  critical: "bg-rose-100 text-rose-900",
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-800",
  applied: "bg-emerald-50 text-emerald-800",
  failed: "bg-rose-50 text-rose-800",
  rolled_back: "bg-slate-100 text-slate-700",
  archived: "bg-gray-100 text-gray-600",
};

export function DatabaseGovernanceCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<DatabaseGovernanceCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/database-governance/center");
    if (res.ok) setCenter(parseDatabaseGovernanceCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const postAction = async (payload: Record<string, unknown>) => {
    await fetch("/api/database-governance/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await load();
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  const dash = center?.dashboard;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap gap-3 text-sm">
        {center?.links?.operations && <Link href={center.links.operations} className="text-slate-600 hover:underline">{labels.operationsLink}</Link>}
        {center?.links?.automation_control && <Link href={center.links.automation_control} className="text-slate-600 hover:underline">{labels.automationControlLink}</Link>}
        {center?.links?.updates && <Link href={center.links.updates} className="text-slate-600 hover:underline">{labels.updatesLink}</Link>}
        {center?.links?.security && <Link href={center.links.security} className="text-slate-600 hover:underline">{labels.securityLink}</Link>}
        {center?.links?.executive && <Link href={center.links.executive} className="text-slate-600 hover:underline">{labels.executiveLink}</Link>}
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">{labels.corePrinciple}: {DGC_CORE_PRINCIPLE}</p>
        <p className="mt-2 text-sm text-gray-600">{labels.philosophyTitle}: {DGC_PHILOSOPHY}</p>
        <p className="mt-1 text-sm text-gray-600">{labels.visionTitle}: {DGC_VISION}</p>
        <p className="mt-3 text-sm font-medium text-indigo-900">{labels.humansDecide}</p>
      </div>

      {dash && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.dashboardTitle}</h2>
          <div className="mt-4 flex flex-wrap items-end gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">{labels.healthScore}</p>
              <p className="text-3xl font-bold text-gray-900">{dash.database_health_score}</p>
              <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${BAND_STYLES[dash.database_health_band] ?? BAND_STYLES.healthy}`}>
                {labels.healthBands[dash.database_health_band] ?? dash.database_health_band}
              </span>
            </div>
          </div>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label={labels.metrics.pending} value={dash.pending_migrations} />
            <Metric label={labels.metrics.failed} value={dash.failed_migrations} />
            <Metric label={labels.metrics.applied} value={dash.applied_migrations} />
            <Metric label={labels.metrics.validationFindings} value={dash.open_validation_findings} />
            <Metric label={labels.metrics.driftEvents} value={dash.open_drift_events} />
            <Metric label={labels.metrics.consistency} value={`${dash.environment_consistency_score}%`} />
            <Metric label={labels.metrics.successRate} value={`${dash.migration_success_rate}%`} />
            <Metric label={labels.metrics.confidence} value={`${dash.deployment_confidence}/5`} />
          </dl>
          {center?.can_manage && (
            <div className="mt-4 flex flex-wrap gap-2">
              <ActionBtn label={labels.validate} onClick={() => void postAction({ action: "validate_schema", summary: "Manual schema validation requested." })} />
              <ActionBtn label={labels.generateReport} onClick={() => void postAction({ action: "generate_report" })} />
            </div>
          )}
        </section>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.migrationsTitle}</h2>
        {center?.migrations.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">{labels.emptySection}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {center?.migrations.map((mig) => (
              <MigrationRow key={mig.migration_key} mig={mig} labels={labels} canManage={center?.can_manage ?? false} onAction={postAction} />
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.validationTitle}</h2>
        <ul className="mt-4 space-y-2">
          {center?.validation_findings.map((f) => (
            <li key={f.finding_key} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-sm">
              <p className="font-medium text-gray-900">{f.object_name}</p>
              <p className="mt-1 text-gray-700">{f.message}</p>
              {center?.can_manage && (
                <ActionBtn label={labels.resolve} className="mt-2" onClick={() => void postAction({ action: "resolve_finding", finding_key: f.finding_key })} />
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-amber-100 bg-amber-50/20 p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.driftTitle}</h2>
        <ul className="mt-4 space-y-2">
          {center?.drift_events.map((d) => (
            <li key={d.drift_key} className="rounded-xl border border-amber-100 bg-white p-3 text-sm">
              <p className="text-xs text-gray-500">{d.environment}</p>
              <p className="mt-1 text-gray-800">{d.message}</p>
              {center?.can_manage && d.status === "open" && (
                <div className="mt-2 flex flex-wrap gap-2">
                  <ActionBtn label={labels.acknowledge} onClick={() => void postAction({ action: "acknowledge_drift", drift_key: d.drift_key })} />
                  <ActionBtn label={labels.dismiss} variant="muted" onClick={() => void postAction({ action: "dismiss_drift", drift_key: d.drift_key })} />
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.insightsTitle}</h2>
        <ul className="mt-4 space-y-2">
          {center?.insights.map((ins) => (
            <li key={ins.insight_key} className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-3 text-sm">
              <p className="text-gray-800">{ins.message}</p>
              {center?.can_manage && (
                <button type="button" className="mt-2 text-xs text-slate-600 hover:underline" onClick={() => void postAction({ action: "dismiss_insight", insight_key: ins.insight_key })}>{labels.dismiss}</button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.recommendationsTitle}</h2>
        <ul className="mt-4 space-y-2">
          {center?.recommendations.map((rec) => (
            <li key={rec.recommendation_key} className="rounded-xl border border-gray-100 p-3 text-sm">
              <p className="text-gray-800">{rec.message}</p>
              {center?.can_manage && (
                <div className="mt-2 flex flex-wrap gap-2">
                  <ActionBtn label={labels.accept} onClick={() => void postAction({ action: "accept_recommendation", recommendation_key: rec.recommendation_key })} />
                  <ActionBtn label={labels.dismiss} variant="muted" onClick={() => void postAction({ action: "dismiss_recommendation", recommendation_key: rec.recommendation_key })} />
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.environmentTitle}</h2>
        <ul className="mt-4 space-y-2">
          {center?.environment_comparisons.map((cmp) => (
            <li key={cmp.comparison_key} className="rounded-xl border border-gray-100 p-3 text-sm">
              <p className="font-medium text-gray-900">{cmp.environment_a} ↔ {cmp.environment_b}</p>
              <p className="mt-1 text-gray-700">{cmp.summary}</p>
              <p className="mt-1 text-xs text-gray-500">
                {cmp.migration_parity} · {cmp.schema_consistency} · {cmp.version_alignment}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.reviewsTitle}</h2>
        <ul className="mt-4 space-y-3">
          {center?.governance_reviews.map((rev) => (
            <li key={rev.review_key} className="rounded-xl border border-gray-100 p-4 text-sm">
              <p className="font-medium text-gray-900">{labels.reviewTypes[rev.review_type] ?? rev.review_type}</p>
              <p className="mt-1 text-gray-700">{rev.prompt}</p>
              {rev.status !== "completed" && center?.can_manage && (
                <ActionBtn label={labels.completeReview} className="mt-3" onClick={() => void postAction({ action: "complete_review", review_key: rev.review_key })} />
              )}
            </li>
          ))}
        </ul>
      </section>

      {center?.privacy_note && (
        <p className="text-xs text-gray-500">{labels.privacyNote}: {center.privacy_note}</p>
      )}
    </div>
  );
}

function MigrationRow({
  mig,
  labels,
  canManage,
  onAction,
}: {
  mig: MigrationRegistryEntry;
  labels: PanelLabels;
  canManage: boolean;
  onAction: (payload: Record<string, unknown>) => Promise<void>;
}) {
  return (
    <li className="rounded-xl border border-gray-100 p-4 text-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-medium text-gray-900">{mig.migration_name}</p>
          <p className="mt-1 text-xs text-gray-500">{mig.migration_id} · {labels.environment}: {mig.environment}</p>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[mig.status] ?? STATUS_STYLES.pending}`}>
          {labels.migrationStatuses[mig.status] ?? mig.status}
        </span>
      </div>
      <p className="mt-2 text-xs text-gray-600">{labels.riskLevel}: {labels.riskLevels[mig.risk_level] ?? mig.risk_level}</p>
      {mig.rollback_notes && (
        <p className="mt-2 text-xs text-gray-600">{labels.rollbackNotes}: {mig.rollback_notes}</p>
      )}
      {canManage && (
        <div className="mt-3 flex flex-wrap gap-2">
          <ActionBtn label={labels.review} onClick={() => void onAction({ action: "review_migration", migration_key: mig.migration_key })} />
          {mig.status === "applied" && (
            <ActionBtn label={labels.archive} variant="muted" onClick={() => void onAction({ action: "archive_migration", migration_key: mig.migration_key })} />
          )}
        </div>
      )}
    </li>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd className="text-lg font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

function ActionBtn({
  label,
  onClick,
  variant = "primary",
  className = "",
}: {
  label: string;
  onClick: () => void;
  variant?: "primary" | "muted";
  className?: string;
}) {
  const styles =
    variant === "primary"
      ? "rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
      : "rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50";
  return (
    <button type="button" className={`${styles} ${className}`} onClick={onClick}>
      {label}
    </button>
  );
}
