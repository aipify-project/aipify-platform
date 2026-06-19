"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { parseCompensationCenter, type CompensationCenter } from "@/lib/compensation-engine/parse";
import {
  cmp614SectionToRpc,
  cmp614UsesEmployeeRpc,
  type Cmp614Section,
} from "@/lib/compensation-engine/config";
import type { buildCompensationLabels } from "@/lib/compensation-engine/labels";

type Labels = ReturnType<typeof buildCompensationLabels>;

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function RecordCard({ record }: { record: Record<string, unknown> }) {
  const title = String(record.record_title ?? record.title ?? "Record");
  const summary = record.summary ? String(record.summary) : undefined;
  const statusLabel = String(record.status_label ?? record.record_status ?? "");
  const statusIcon = record.status_icon ? String(record.status_icon) : undefined;
  const employee = record.employee_label ? String(record.employee_label) : undefined;
  const amount = record.amount != null ? `${record.amount} ${record.currency_code ?? ""}`.trim() : undefined;
  const period = record.period_label ? String(record.period_label) : undefined;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-semibold text-zinc-900">{title}</p>
        {statusLabel ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700">
            {statusIcon ? <span aria-hidden="true">{statusIcon === "check-circle" ? "✓" : "●"}</span> : null}
            {statusLabel.replace(/_/g, " ")}
          </span>
        ) : null}
      </div>
      {employee ? <p className="mt-1 text-xs text-zinc-500">{employee}</p> : null}
      {summary ? <p className="mt-2 text-sm text-zinc-600">{summary}</p> : null}
      {amount || period ? (
        <p className="mt-2 text-xs text-zinc-500">
          {[amount, period].filter(Boolean).join(" · ")}
        </p>
      ) : null}
    </div>
  );
}

function RecordsList({ records, emptyLabel }: { records: Record<string, unknown>[]; emptyLabel: string }) {
  if (records.length === 0) return <p className="text-sm text-zinc-500">{emptyLabel}</p>;
  return (
    <section className="grid gap-3">
      {records.map((r) => (
        <RecordCard key={String(r.record_key ?? r.title)} record={r} />
      ))}
    </section>
  );
}

export function CompensationPanel({ labels, activeSection }: { labels: Labels; activeSection: Cmp614Section }) {
  const [center, setCenter] = useState<CompensationCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const section = cmp614SectionToRpc(activeSection);
    const endpoint = cmp614UsesEmployeeRpc(activeSection)
      ? `/api/compensation/center?section=${section}&view=employee`
      : `/api/compensation/center?section=${section}`;
    const res = await fetch(endpoint);
    if (res.ok) setCenter(parseCompensationCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, [activeSection]);

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
        {center?.error ? <p className="mt-2 text-sm">{center.error}</p> : null}
        <button
          type="button"
          onClick={() => void load()}
          className="mt-4 rounded-lg border border-amber-300 px-4 py-2 text-sm font-medium hover:bg-amber-100"
        >
          {labels.refresh}
        </button>
      </div>
    );
  }

  const stats = center.stats ?? {};
  const records = center.records ?? [];

  const centerSubtitle =
    activeSection === "compensationPlans"
      ? labels.planCenter.subtitle
      : activeSection === "payrollPeriods"
        ? labels.payrollPeriodCenter.subtitle
        : activeSection === "exceptions"
          ? labels.exceptionCenter.subtitle
          : activeSection === "exports"
            ? labels.exportCenter.subtitle
            : activeSection === "policies"
              ? labels.policyCenter.subtitle
              : activeSection === "myCompensation"
                ? labels.myCompensation.subtitle
                : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">{labels.sections[activeSection]}</h2>
          {centerSubtitle ? <p className="mt-1 text-sm text-zinc-600">{centerSubtitle}</p> : null}
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
        <p className="rounded-2xl border border-violet-100 bg-violet-50/60 px-5 py-4 text-sm text-violet-950">
          {center.principle}
        </p>
      ) : null}

      {center.distinction_note && activeSection === "overview" ? (
        <p className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-xs text-zinc-600">
          {center.distinction_note}
        </p>
      ) : null}

      {activeSection === "overview" && (
        <>
          <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/80 to-white p-6 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <StatCard label={labels.stats.commissionPending} value={stats.commission_pending ?? 0} />
              <StatCard label={labels.stats.payrollReady} value={stats.payroll_ready ?? 0} />
              <StatCard label={labels.stats.openExceptions} value={stats.open_exceptions ?? 0} />
              <StatCard label={labels.stats.pendingApprovals} value={stats.pending_approvals ?? 0} />
              <StatCard label={labels.stats.tipPoolsOpen} value={stats.tip_pools_open ?? 0} />
            </div>
          </section>

          <p className="rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3 text-sm text-amber-950">
            {labels.growthPartnerSeparation}
          </p>

          {(center.companion_recommendations?.length ?? 0) > 0 && (
            <section className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.companionRecommendations}</h3>
              {(center.companion_recommendations ?? []).map((rec, i) => (
                <RecordCard
                  key={i}
                  record={{
                    record_title: rec.observation,
                    summary: rec.recommendation,
                    status_label: "recommendation",
                  }}
                />
              ))}
            </section>
          )}

          {(center.integrations?.length ?? 0) > 0 && (
            <section>
              <h3 className="mb-2 font-semibold text-zinc-900">{labels.integrations}</h3>
              <div className="grid gap-2">
                {(center.integrations ?? []).map((i) => (
                  <Link
                    key={String(i.record_key)}
                    href={String((i.metadata as Record<string, unknown>)?.href ?? "#")}
                    className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm hover:border-violet-200"
                  >
                    <span className="font-medium">{String(i.record_title)}</span>
                    <span className="mt-1 block text-xs text-zinc-500">{String(i.summary ?? "")}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {activeSection === "myCompensation" && (
        <RecordsList
          records={[
            ...(center.employee_preview ?? []),
            ...(center.commission_ledger ?? []),
            ...(center.tip_allocations ?? []),
            ...(center.bonuses ?? []),
          ]}
          emptyLabel={labels.noRecords}
        />
      )}

      {activeSection !== "overview" && activeSection !== "myCompensation" && activeSection !== "reports" && (
        <RecordsList records={records} emptyLabel={labels.noRecords} />
      )}

      {activeSection === "reports" && (
        <section className="space-y-4">
          <RecordsList records={records} emptyLabel={labels.noRecords} />
          {(center.audit_recent?.length ?? 0) > 0 && (
            <div>
              <h3 className="mb-2 font-semibold text-zinc-900">{labels.sections.reports}</h3>
              {(center.audit_recent ?? []).map((a, i) => (
                <RecordCard
                  key={i}
                  record={{
                    record_title: a.event_type,
                    summary: a.summary,
                    status_label: "audit",
                  }}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
