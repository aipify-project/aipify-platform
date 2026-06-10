"use client";

import { useEffect, useMemo, useState } from "react";
import { AipifyEmptyState } from "@/components/branding";
import { createClient } from "@/lib/supabase/client";
import { buildSystemAiSummary } from "@/lib/platform/ai-dashboard";
import { getSystemHealth } from "@/lib/platform/metrics-dashboard";
import type { PaymentProviderSummary, PlatformMetrics, PlatformServiceStatus } from "@/lib/platform/types";

type ServiceCard = {
  id: string;
  name: string;
  status: PlatformServiceStatus;
  detail: string;
};

type PlatformSystemStatusPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    operational: string;
    degraded: string;
    outage: string;
    pending: string;
    aiSummaryTitle: string;
    pulseLabel: string;
    services: {
      supabase: string;
      resend: string;
      klarna: string;
      stripe: string;
      aipifyApi: string;
      webhooks: string;
    };
    details: {
      supabase: string;
      resend: string;
      klarna: string;
      stripe: string;
      aipifyApi: string;
      webhooks: string;
    };
  };
};

function statusTone(status: PlatformServiceStatus) {
  switch (status) {
    case "operational":
      return "bg-emerald-500";
    case "degraded":
      return "bg-amber-500";
    case "outage":
      return "bg-rose-500";
    case "pending":
      return "bg-gray-400";
  }
}

function statusLabel(status: PlatformServiceStatus, labels: PlatformSystemStatusPanelProps["labels"]) {
  switch (status) {
    case "operational":
      return labels.operational;
    case "degraded":
      return labels.degraded;
    case "outage":
      return labels.outage;
    case "pending":
      return labels.pending;
  }
}

function providerStatus(summary: PaymentProviderSummary | undefined): PlatformServiceStatus {
  if (!summary) return "pending";
  if (summary.failed_count > 0) return "degraded";
  if (summary.active_count > 0) return "operational";
  if (summary.trialing_count > 0) return "pending";
  return "pending";
}

export default function PlatformSystemStatusPanel({ labels }: PlatformSystemStatusPanelProps) {
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [providers, setProviders] = useState<PaymentProviderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const [metricsResult, providersResult] = await Promise.all([
        supabase.rpc("get_platform_metrics"),
        supabase.rpc("list_platform_payment_providers"),
      ]);

      if (!cancelled) {
        setMetrics(
          metricsResult.error || !metricsResult.data
            ? null
            : (metricsResult.data as PlatformMetrics)
        );
        setProviders(
          providersResult.error || !providersResult.data
            ? []
            : (providersResult.data as PaymentProviderSummary[])
        );
        setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const services = useMemo<ServiceCard[]>(() => {
    const klarna = providers.find((row) => row.provider === "klarna");
    const stripe = providers.find((row) => row.provider === "stripe");
    const health = metrics ? getSystemHealth(metrics) : null;
    const apiStatus: PlatformServiceStatus =
      health?.label === "healthy"
        ? "operational"
        : health?.label === "stable"
          ? "degraded"
          : health
            ? "outage"
            : "pending";
    const webhookStatus: PlatformServiceStatus =
      metrics && metrics.installations.failed > 0 ? "degraded" : "operational";

    return [
      {
        id: "supabase",
        name: labels.services.supabase,
        status: "operational",
        detail: labels.details.supabase,
      },
      {
        id: "resend",
        name: labels.services.resend,
        status: "operational",
        detail: labels.details.resend,
      },
      {
        id: "klarna",
        name: labels.services.klarna,
        status: providerStatus(klarna),
        detail: labels.details.klarna,
      },
      {
        id: "stripe",
        name: labels.services.stripe,
        status: providerStatus(stripe),
        detail: labels.details.stripe,
      },
      {
        id: "aipify-api",
        name: labels.services.aipifyApi,
        status: apiStatus,
        detail: labels.details.aipifyApi,
      },
      {
        id: "webhooks",
        name: labels.services.webhooks,
        status: webhookStatus,
        detail: labels.details.webhooks,
      },
    ];
  }, [labels, metrics, providers]);

  if (loading) {
    return <p className="text-sm text-gray-500">{labels.loading}</p>;
  }

  if (!metrics) {
    return <AipifyEmptyState message={labels.empty} pulseLabel={labels.pulseLabel} />;
  }

  const aiSummary = buildSystemAiSummary(metrics, providers);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {labels.title}
        </h1>
        <p className="mt-2 text-base text-gray-500">{labels.subtitle}</p>
      </div>

      <section className="mb-6 rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/60 via-white to-indigo-50/30 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.aiSummaryTitle}</h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-700">{aiSummary}</p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <article
            key={service.id}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-gray-900">{service.name}</h2>
                <p className="mt-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${statusTone(service.status)}`}
                    aria-hidden="true"
                  />
                  {statusLabel(service.status, labels)}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-gray-500">{service.detail}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
