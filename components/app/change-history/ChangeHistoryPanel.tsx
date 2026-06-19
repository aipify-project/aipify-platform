"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { AipifyStatusBadge } from "@/components/ui/aipify-status-badge";
import { parseOrganizationChangeHistory } from "@/lib/change-operations-engine/parse";
import type { OrganizationChangeHistory } from "@/lib/change-operations-engine/parse";
import type { buildChangeHistoryLabels } from "@/lib/change-operations-engine/labels";
import type { AipifyStatusKind } from "@/lib/design/status-system";

type Labels = ReturnType<typeof buildChangeHistoryLabels>;

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

export function ChangeHistoryPanel({ labels }: { labels: Labels }) {
  const [center, setCenter] = useState<OrganizationChangeHistory | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/change-history/center?section=overview");
    if (res.ok) setCenter(parseOrganizationChangeHistory(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !center) {
    return (
      <div className="flex min-h-[280px] items-center justify-center">
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
      </div>
    );
  }

  const stats = center.stats ?? {};

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{labels.title}</h2>
          <p className="mt-1 text-sm text-gray-600">{labels.subtitle}</p>
          {center.privacy_note ? <p className="mt-1 text-xs text-gray-500">{center.privacy_note}</p> : null}
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {labels.refresh}
        </button>
      </div>

      {center.principle ? (
        <p className="rounded-2xl border border-violet-100 bg-violet-50/70 px-5 py-4 text-sm text-violet-950">
          {center.principle}
        </p>
      ) : null}

      {Object.keys(stats).length > 0 && (
        <dl className="grid gap-4 sm:grid-cols-3">
          <StatCard label={labels.records} value={stats.total_changes ?? 0} />
          <StatCard label={labels.upcoming} value={stats.upcoming ?? 0} />
          <StatCard label={labels.completed} value={stats.completed ?? 0} />
        </dl>
      )}

      {(center.history ?? []).length > 0 ? (
        <section className="space-y-3">
          <h3 className="font-semibold text-gray-900">{labels.records}</h3>
          <div className="space-y-3">
            {(center.history ?? []).map((item, idx) => (
              <div key={String(item.history_id ?? idx)} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-900">{String(item.change_title ?? "")}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {labels.version}: {String(item.release_version ?? "—")} · {labels.impact}: {String(item.impact_level ?? "—")}
                    </p>
                  </div>
                  <AipifyStatusBadge
                    kind={mapHistoryStatus(String(item.change_status ?? ""))}
                    label={`${labels.status}: ${String(item.change_status ?? "").replace(/_/g, " ")}`}
                  />
                </div>
                {item.summary ? <p className="mt-2 text-sm text-gray-600">{String(item.summary)}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : (
        <p className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-600">
          {labels.noRecords}
        </p>
      )}
    </div>
  );
}

function mapHistoryStatus(status: string): AipifyStatusKind {
  const s = status.toLowerCase();
  if (s.includes("successfully_released") || s.includes("released")) return "completed";
  if (s.includes("failed") || s.includes("rolled_back")) return "not_allowed";
  if (s.includes("scheduled") || s.includes("pending")) return "waiting";
  return "information";
}
