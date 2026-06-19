"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import {
  inv613RowsKey,
  inv613SectionToRpc,
  type Inv613Section,
} from "@/lib/inventory-operations-engine/config";
import {
  parseInventoryOperationsCenter,
  type InventoryOperationsCenter,
} from "@/lib/inventory-operations-engine/parse";
import type { InventoryOperationsEngineLabels } from "@/lib/inventory-operations-engine/labels";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className={`${AipifyShellClasses.surfaceCard} px-5 py-4`}>
      <dt className="text-xs font-medium uppercase tracking-wide text-aipify-text-muted">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-aipify-text">{value}</dd>
    </div>
  );
}

function statusTitle(status: unknown): string | undefined {
  if (status && typeof status === "object" && "status_title" in (status as object)) {
    return String((status as Record<string, unknown>).status_title);
  }
  return undefined;
}

function RecordCard({ row }: { row: Record<string, unknown> }) {
  const title = String(row.record_title ?? row.title ?? "—");
  const summary = typeof row.summary === "string" ? row.summary : undefined;
  const badge = statusTitle(row.status) ?? String(row.status_label ?? row.record_status ?? "");
  const qty = row.quantity != null ? String(row.quantity) : undefined;
  const unit = row.unit_label ? String(row.unit_label) : "";
  const location = row.location_label ? String(row.location_label) : "";

  return (
    <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs text-aipify-text-muted">{String(row.record_key ?? "")}</p>
          <h3 className="font-semibold text-aipify-text">{title}</h3>
          {location ? <p className="text-aipify-text-secondary">{location}</p> : null}
          {qty ? (
            <p className="text-aipify-text-muted">
              {qty}
              {unit ? ` ${unit}` : ""}
            </p>
          ) : null}
        </div>
        {badge ? (
          <span className="inline-flex rounded-full bg-aipify-surface-muted px-2.5 py-0.5 text-xs font-medium text-aipify-text-secondary ring-1 ring-inset ring-aipify-border">
            {badge.replace(/_/g, " ")}
          </span>
        ) : null}
      </div>
      {summary ? <p className="mt-2 text-aipify-text-secondary">{summary}</p> : null}
    </div>
  );
}

type Props = {
  labels: InventoryOperationsEngineLabels;
  activeSection: Inv613Section;
};

export function InventoryOperationsEnginePanel({ labels, activeSection }: Props) {
  const [center, setCenter] = useState<InventoryOperationsCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const section = inv613SectionToRpc(activeSection);
    const res = await fetch(`/api/inventory/center?section=${encodeURIComponent(section)}`);
    if (res.ok) setCenter(parseInventoryOperationsCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, [activeSection]);

  useEffect(() => {
    void load();
  }, [load]);

  const rows = useMemo(() => {
    if (!center) return [];
    const key = inv613RowsKey(activeSection);
    const fromCenter = (center as Record<string, unknown>)[key];
    if (Array.isArray(fromCenter) && fromCenter.length > 0) return fromCenter as Record<string, unknown>[];
    if (center.rows?.length) return center.rows;
    return center.products ?? [];
  }, [center, activeSection]);

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found) {
    return <AipifyModuleAccessDenied message={labels.accessDenied} />;
  }

  const stats = center.stats ?? {};

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-aipify-text">{labels.sections[activeSection]}</h2>
          {center.privacy_note ? <p className="mt-1 text-xs text-aipify-text-muted">{center.privacy_note}</p> : null}
        </div>
        <button type="button" onClick={() => void load()} className={AipifyShellClasses.secondaryButton}>
          {labels.refresh}
        </button>
      </div>

      {center.principle ? (
        <p className="rounded-2xl border border-violet-100 bg-violet-50/60 px-5 py-4 text-sm text-violet-950">
          {center.principle}
        </p>
      ) : null}

      {activeSection === "overview" ? (
        <>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label={labels.stats.totalProducts} value={Number(stats.total_products ?? 0)} />
            <StatCard label={labels.stats.totalLocations} value={Number(stats.total_locations ?? 0)} />
            <StatCard label={labels.stats.lowStockCount} value={Number(stats.low_stock_count ?? 0)} />
            <StatCard label={labels.stats.pendingPurchaseRequests} value={Number(stats.pending_purchase_requests ?? 0)} />
            <StatCard label={labels.stats.openPurchaseOrders} value={Number(stats.open_purchase_orders ?? 0)} />
            <StatCard label={labels.stats.pendingReceiving} value={Number(stats.pending_receiving ?? 0)} />
            <StatCard label={labels.stats.activeTransfers} value={Number(stats.active_transfers ?? 0)} />
            <StatCard label={labels.stats.activeReservations} value={Number(stats.active_reservations ?? 0)} />
          </dl>

          {center.companion_recommendations && center.companion_recommendations.length > 0 ? (
            <section>
              <h3 className="mb-3 text-sm font-semibold text-aipify-text">{labels.companionRecommendations}</h3>
              <div className="grid gap-3 md:grid-cols-2">
                {center.companion_recommendations.map((rec, i) => (
                  <div key={i} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                    <p className="font-semibold text-aipify-text">{String(rec.title ?? "")}</p>
                    <p className="mt-1 text-aipify-text-secondary">{String(rec.reason ?? "")}</p>
                    {rec.route ? (
                      <Link href={String(rec.route)} className={`mt-3 inline-block ${AipifyShellClasses.secondaryButton}`}>
                        {labels.companionInventoryAdvisor}
                      </Link>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {(center.low_stock_alerts?.length ?? 0) > 0 ? (
            <section>
              <h3 className="mb-3 text-sm font-semibold text-aipify-text">{labels.stats.lowStockCount}</h3>
              <div className="grid gap-3">
                {center.low_stock_alerts!.map((row, i) => (
                  <RecordCard key={String(row.record_key ?? i)} row={row} />
                ))}
              </div>
            </section>
          ) : null}
        </>
      ) : null}

      {activeSection !== "overview" && activeSection !== "reports" ? (
        rows.length === 0 ? (
          <PlatformEmptyState title={labels.noRecords} message={labels.noRecordsHint} />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {rows.map((row, i) => (
              <RecordCard key={String(row.record_key ?? i)} row={row} />
            ))}
          </div>
        )
      ) : null}

      {activeSection === "reports" ? (
        <div className={`${AipifyShellClasses.surfaceCard} space-y-2 p-4 text-sm text-aipify-text-secondary`}>
          <p>
            {labels.sections.reports}: {String(center.reports?.section_count ?? center.section_count ?? 120)} domains
          </p>
          <p>
            {labels.auditLog}: {String(center.reports?.audit_entries ?? center.audit_recent?.length ?? 0)}
          </p>
        </div>
      ) : null}

      {center.audit_recent && center.audit_recent.length > 0 ? (
        <section>
          <h3 className="mb-2 text-sm font-semibold text-aipify-text">{labels.auditLog}</h3>
          <ul className={`${AipifyShellClasses.surfaceCard} divide-y divide-aipify-border text-sm`}>
            {center.audit_recent.map((entry, i) => (
              <li key={i} className="px-4 py-2 text-aipify-text-secondary">
                {String(entry.summary ?? "")}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
