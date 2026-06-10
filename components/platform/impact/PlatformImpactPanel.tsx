"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyEmptyState } from "@/components/branding";
import { formatImpactCount } from "@/lib/impact/marketing";
import type { MarketingProofResult, PlatformImpactDashboard } from "@/lib/impact/types";
import { createClient } from "@/lib/supabase/client";

type PlatformImpactPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    pulseLabel: string;
    principle: string;
    cards: {
      supportResolved: string;
      actionsCompleted: string;
      recommendations: string;
      selfHealing: string;
      responseTimeSaved: string;
      timeSaved: string;
      ytdTenants: string;
    };
    trend: {
      title: string;
      month: string;
      totalEvents: string;
      supportResolved: string;
      actionsCompleted: string;
    };
    marketing: {
      title: string;
      subtitle: string;
      generate: string;
      download: string;
      internalOnly: string;
      publicAllowed: string;
      approvePublic: string;
      approved: string;
      minimumGroup: string;
    };
    units: {
      minutes: string;
      tenants: string;
    };
  };
};

export function PlatformImpactPanel({ labels }: PlatformImpactPanelProps) {
  const [dashboard, setDashboard] = useState<PlatformImpactDashboard | null>(null);
  const [proof, setProof] = useState<MarketingProofResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_platform_impact_dashboard");
      if (!error && data) {
        setDashboard(data as PlatformImpactDashboard);
      }
      setLoading(false);
    }
    void load();
  }, []);

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    const supabase = createClient();
    const { data, error } = await supabase.rpc("generate_marketing_proof_statements", {
      p_year: new Date().getFullYear(),
    });
    if (!error && data) {
      setProof(data as MarketingProofResult);
    }
    setGenerating(false);
  }, []);

  const handleApprovePublic = useCallback(async () => {
    if (!proof?.public_marketing_allowed) return;
    const supabase = createClient();
    await supabase.rpc("record_impact_audit_event", {
      p_event_type: "public_metric_approved",
      p_details: { year: proof.year, tenant_count: proof.tenant_count },
    });
    setApproved(true);
  }, [proof]);

  const handleDownload = useCallback(async () => {
    const response = await fetch("/api/platform/impact/marketing-proof", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ year: proof?.year ?? new Date().getFullYear() }),
    });
    if (!response.ok) return;
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `aipify-marketing-proof-${proof?.year ?? "report"}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }, [proof?.year]);

  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-600">{labels.loading}</div>
    );
  }

  if (!dashboard) {
    return (
      <div className="p-6">
        <AipifyEmptyState message={labels.empty} pulseLabel={labels.pulseLabel} />
      </div>
    );
  }

  const cards = [
    {
      label: labels.cards.supportResolved,
      value: formatImpactCount(dashboard.support_cases_resolved),
    },
    {
      label: labels.cards.actionsCompleted,
      value: formatImpactCount(dashboard.automated_actions_completed),
    },
    {
      label: labels.cards.recommendations,
      value: formatImpactCount(dashboard.recommendations_generated),
    },
    {
      label: labels.cards.selfHealing,
      value: formatImpactCount(dashboard.self_healing_runs_completed),
    },
    {
      label: labels.cards.responseTimeSaved,
      value: `${formatImpactCount(dashboard.response_time_improvement_minutes)} ${labels.units.minutes}`,
    },
    {
      label: labels.cards.timeSaved,
      value: `${formatImpactCount(dashboard.time_saved_minutes)} ${labels.units.minutes}`,
    },
    {
      label: labels.cards.ytdTenants,
      value: `${dashboard.year_to_date_tenants} ${labels.units.tenants}`,
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-lg border border-emerald-100 bg-emerald-50/70 px-3 py-2 text-sm text-emerald-900">
          {dashboard.principle ?? labels.principle}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-lg border border-gray-200 bg-white px-4 py-4"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              {card.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      {dashboard.monthly_trend.length > 0 ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="text-lg font-semibold text-gray-900">{labels.trend.title}</h2>
          <ul className="mt-4 divide-y divide-gray-100">
            {dashboard.monthly_trend.map((row) => (
              <li
                key={`${row.year}-${row.month}`}
                className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm text-gray-700"
              >
                <span className="font-medium">
                  {labels.trend.month}: {row.month}/{row.year}
                </span>
                <span>
                  {labels.trend.totalEvents}: {formatImpactCount(row.total_events)}
                </span>
                <span>
                  {labels.trend.supportResolved}: {formatImpactCount(row.support_resolved)}
                </span>
                <span>
                  {labels.trend.actionsCompleted}: {formatImpactCount(row.actions_completed)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-gray-900">{labels.marketing.title}</h2>
        <p className="mt-2 text-sm text-gray-600">{labels.marketing.subtitle}</p>
        <p className="mt-2 text-xs text-gray-500">
          {labels.marketing.minimumGroup.replace(
            "{count}",
            String(dashboard.minimum_group_size)
          )}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void handleGenerate()}
            disabled={generating}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {labels.marketing.generate}
          </button>
          {proof ? (
            <>
              <button
                type="button"
                onClick={() => void handleDownload()}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800"
              >
                {labels.marketing.download}
              </button>
              {proof.public_marketing_allowed ? (
                <button
                  type="button"
                  onClick={() => void handleApprovePublic()}
                  disabled={approved}
                  className="rounded-md border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-900 disabled:opacity-50"
                >
                  {approved ? labels.marketing.approved : labels.marketing.approvePublic}
                </button>
              ) : null}
            </>
          ) : null}
        </div>
        {proof ? (
          <div className="mt-4 space-y-3">
            <p
              className={`text-sm ${
                proof.public_marketing_allowed ? "text-emerald-800" : "text-amber-800"
              }`}
            >
              {proof.public_marketing_allowed
                ? labels.marketing.publicAllowed
                : labels.marketing.internalOnly}
            </p>
            <ul className="list-disc space-y-2 pl-5 text-sm text-gray-800">
              {proof.statements.map((statement) => (
                <li key={statement}>{statement}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>
    </div>
  );
}
