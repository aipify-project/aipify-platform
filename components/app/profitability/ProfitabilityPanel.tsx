"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { parseProfitabilityCenter, type ProfitabilityCenter } from "@/lib/profitability-engine/parse";
import { prof615SectionToRpc, type Prof615Section } from "@/lib/profitability-engine/config";
import type { buildProfitabilityLabels } from "@/lib/profitability-engine/labels";

type Labels = ReturnType<typeof buildProfitabilityLabels>;

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function statusIconChar(icon?: string) {
  switch (icon) {
    case "check-circle":
    case "shield-check":
    case "verified_against_source":
      return "✓";
    case "trending-up":
    case "activity":
      return "↗";
    case "trending-down":
    case "alert-triangle":
      return "!";
    case "refresh-cw":
      return "↻";
    default:
      return "●";
  }
}

function dataQualityLabel(quality: string | undefined, labels: Labels) {
  switch (quality) {
    case "verified":
      return labels.dataQualityLabels.verified;
    case "estimated":
      return labels.dataQualityLabels.estimated;
    case "incomplete":
      return labels.dataQualityLabels.incomplete;
    default:
      return quality?.replace(/_/g, " ") ?? labels.dataQuality;
  }
}

function ServiceProfitabilityCard({
  record,
  labels,
}: {
  record: Record<string, unknown>;
  labels: Labels;
}) {
  const title = String(record.service_label || record.record_title || "Service");
  const statusLabel = String(record.status_label ?? record.record_status ?? "");
  const statusIcon = record.status_icon ? String(record.status_icon) : undefined;
  const revenue = record.revenue_amount != null ? Number(record.revenue_amount) : null;
  const cost = record.cost_amount != null ? Number(record.cost_amount) : null;
  const margin = record.margin_amount != null ? Number(record.margin_amount) : null;
  const marginPct = record.margin_percent != null ? Number(record.margin_percent) : null;
  const currency = record.currency_code ? String(record.currency_code) : "NOK";
  const quality = record.data_quality ? String(record.data_quality) : "estimated";

  return (
    <div className="rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50/40 to-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-semibold text-zinc-900">{title}</p>
        {statusLabel ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700">
            <span aria-hidden="true">{statusIconChar(statusIcon)}</span>
            {statusLabel.replace(/_/g, " ")}
          </span>
        ) : null}
      </div>
      <p className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-900">
        <span aria-hidden="true">◆</span>
        {labels.dataQuality}: {dataQualityLabel(quality, labels)}
      </p>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
        {revenue != null ? (
          <div>
            <dt className="text-xs text-zinc-500">{labels.verifiedRevenue}</dt>
            <dd className="font-medium text-zinc-900">
              {revenue.toLocaleString()} {currency}
            </dd>
          </div>
        ) : null}
        {cost != null ? (
          <div>
            <dt className="text-xs text-zinc-500">{labels.estimatedLaborCost}</dt>
            <dd className="font-medium text-zinc-900">
              {cost.toLocaleString()} {currency}
            </dd>
          </div>
        ) : null}
        {margin != null ? (
          <div>
            <dt className="text-xs text-zinc-500">Margin</dt>
            <dd className="font-medium text-zinc-900">
              {margin.toLocaleString()} {currency}
            </dd>
          </div>
        ) : null}
        {marginPct != null ? (
          <div>
            <dt className="text-xs text-zinc-500">{labels.marginPercent}</dt>
            <dd className="font-medium text-zinc-900">{marginPct.toFixed(1)}%</dd>
          </div>
        ) : null}
      </dl>
      {record.summary ? <p className="mt-2 text-xs text-zinc-600">{String(record.summary)}</p> : null}
    </div>
  );
}

function RecordCard({ record, labels }: { record: Record<string, unknown>; labels: Labels }) {
  const title = String(record.record_title ?? record.title ?? "Record");
  const summary = record.summary ? String(record.summary) : undefined;
  const statusLabel = String(record.status_label ?? record.record_status ?? "");
  const statusIcon = record.status_icon ? String(record.status_icon) : undefined;
  const service = record.service_label ? String(record.service_label) : undefined;
  const quality = record.data_quality ? String(record.data_quality) : undefined;
  const marginPct = record.margin_percent != null ? `${record.margin_percent}%` : undefined;
  const amount =
    record.revenue_amount != null
      ? `${record.revenue_amount} ${record.currency_code ?? ""}`.trim()
      : record.margin_amount != null
        ? `${record.margin_amount} ${record.currency_code ?? ""}`.trim()
        : undefined;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-semibold text-zinc-900">{title}</p>
        {statusLabel ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700">
            <span aria-hidden="true">{statusIconChar(statusIcon)}</span>
            {statusLabel.replace(/_/g, " ")}
          </span>
        ) : null}
      </div>
      {service ? <p className="mt-1 text-xs text-zinc-500">{service}</p> : null}
      {quality ? (
        <p className="mt-2 text-xs font-medium text-amber-800">
          {labels.dataQuality}: {dataQualityLabel(quality, labels)}
        </p>
      ) : null}
      {summary ? <p className="mt-2 text-sm text-zinc-600">{summary}</p> : null}
      {amount || marginPct ? (
        <p className="mt-2 text-xs text-zinc-500">
          {[amount, marginPct ? `${labels.marginPercent}: ${marginPct}` : null].filter(Boolean).join(" · ")}
        </p>
      ) : null}
    </div>
  );
}

function RecordsList({
  records,
  emptyLabel,
  labels,
}: {
  records: Record<string, unknown>[];
  emptyLabel: string;
  labels: Labels;
}) {
  if (records.length === 0) return <p className="text-sm text-zinc-500">{emptyLabel}</p>;
  return (
    <section className="grid gap-3">
      {records.map((r) => (
        <RecordCard key={String(r.record_key ?? r.title)} record={r} labels={labels} />
      ))}
    </section>
  );
}

export function ProfitabilityPanel({ labels, activeSection }: { labels: Labels; activeSection: Prof615Section }) {
  const [center, setCenter] = useState<ProfitabilityCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const section = prof615SectionToRpc(activeSection);
    const res = await fetch(`/api/profitability/center?section=${section}`);
    if (res.ok) setCenter(parseProfitabilityCenter(await res.json()));
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
  const cards = center.service_profitability_cards ?? [];

  const centerSubtitle =
    activeSection === "allocations"
      ? labels.allocationCenter.subtitle
      : activeSection === "pricing"
        ? labels.pricingCenter.subtitle
        : activeSection === "scenarios"
          ? labels.scenarioLab.subtitle
          : activeSection === "exceptions"
            ? labels.exceptionCenter.subtitle
            : activeSection === "policies"
              ? labels.policyCenter.subtitle
              : null;

  const showCards =
    activeSection === "overview" ||
    activeSection === "services" ||
    activeSection === "margins" ||
    activeSection === "pricing";

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

      {(center.data_quality_warning || center.principle) && (
        <p className="rounded-2xl border border-amber-200 bg-amber-50/80 px-5 py-4 text-sm text-amber-950">
          {center.data_quality_warning ?? labels.dataQualityWarning}
        </p>
      )}

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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
              <StatCard label={labels.stats.servicesTracked} value={stats.services_tracked ?? 0} />
              <StatCard label={labels.stats.marginResults} value={stats.margin_results ?? 0} />
              <StatCard label={labels.stats.openExceptions} value={stats.open_exceptions ?? 0} />
              <StatCard label={labels.stats.pendingApprovals} value={stats.pending_approvals ?? 0} />
              <StatCard label={labels.stats.recalculationPending} value={stats.recalculation_pending ?? 0} />
              <StatCard label={labels.stats.priceRecommendations} value={stats.price_recommendations ?? 0} />
            </div>
          </section>

          {(center.companion_recommendations?.length ?? 0) > 0 && (
            <section className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.companionRecommendations}</h3>
              {(center.companion_recommendations ?? []).map((rec, i) => (
                <RecordCard
                  key={i}
                  labels={labels}
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

      {showCards && cards.length > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold text-zinc-900">{labels.serviceProfitabilityCards}</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {cards.map((card) => (
              <ServiceProfitabilityCard key={String(card.record_key)} record={card} labels={labels} />
            ))}
          </div>
        </section>
      )}

      {activeSection !== "overview" && activeSection !== "reports" && (
        <RecordsList records={records} emptyLabel={labels.noRecords} labels={labels} />
      )}

      {activeSection === "reports" && (
        <section className="space-y-4">
          <RecordsList records={records} emptyLabel={labels.noRecords} labels={labels} />
          {(center.audit_recent?.length ?? 0) > 0 && (
            <div>
              <h3 className="mb-2 font-semibold text-zinc-900">Audit</h3>
              <RecordsList records={center.audit_recent ?? []} emptyLabel={labels.noRecords} labels={labels} />
            </div>
          )}
        </section>
      )}
    </div>
  );
}
