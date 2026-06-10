"use client";

import { useEffect, useState } from "react";
import { AipifyEmptyState } from "@/components/branding";
import { createClient } from "@/lib/supabase/client";
import type { PlatformMetrics } from "@/lib/platform/types";

type MetricCard = {
  label: string;
  value: string;
  hint?: string;
};

type MetricSection = {
  title: string;
  cards: MetricCard[];
};

type PlatformMetricsPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    sections: {
      revenue: string;
      customers: string;
      installations: string;
      aiActivity: string;
      growth: string;
    };
    metrics: Record<string, string>;
    currency: string;
    seconds: string;
    days: string;
    percent: string;
    none: string;
    pulseLabel: string;
  };
};

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en").format(value);
}

export default function PlatformMetricsPanel({ labels }: PlatformMetricsPanelProps) {
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_platform_metrics");

      if (!cancelled) {
        setMetrics(error || !data ? null : (data as PlatformMetrics));
        setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-500">{labels.loading}</p>;
  }

  if (!metrics) {
    return (
      <AipifyEmptyState message={labels.empty} pulseLabel={labels.pulseLabel} />
    );
  }

  const sections: MetricSection[] = [
    {
      title: labels.sections.revenue,
      cards: [
        {
          label: labels.metrics.mrr,
          value: formatCurrency(metrics.revenue.mrr, labels.currency),
        },
        {
          label: labels.metrics.arr,
          value: formatCurrency(metrics.revenue.arr, labels.currency),
        },
        {
          label: labels.metrics.trialConversion,
          value: `${metrics.revenue.trial_to_paid_conversion_rate}${labels.percent}`,
        },
        {
          label: labels.metrics.outstanding,
          value: formatCurrency(metrics.revenue.outstanding_invoice_amount, labels.currency),
        },
        {
          label: labels.metrics.arpc,
          value: formatCurrency(metrics.revenue.average_revenue_per_customer, labels.currency),
        },
      ],
    },
    {
      title: labels.sections.customers,
      cards: [
        { label: labels.metrics.totalCustomers, value: formatNumber(metrics.customers.total) },
        { label: labels.metrics.activeCustomers, value: formatNumber(metrics.customers.active) },
        { label: labels.metrics.trialCustomers, value: formatNumber(metrics.customers.trial) },
        { label: labels.metrics.pausedCustomers, value: formatNumber(metrics.customers.paused) },
        {
          label: labels.metrics.cancelledCustomers,
          value: formatNumber(metrics.customers.cancelled),
        },
        { label: labels.metrics.overdueCustomers, value: formatNumber(metrics.customers.overdue) },
      ],
    },
    {
      title: labels.sections.installations,
      cards: [
        {
          label: labels.metrics.totalInstallations,
          value: formatNumber(metrics.installations.total),
        },
        {
          label: labels.metrics.activeInstallations,
          value: formatNumber(metrics.installations.active),
        },
        {
          label: labels.metrics.failedInstallations,
          value: formatNumber(metrics.installations.failed),
        },
        {
          label: labels.metrics.avgInstallations,
          value: String(metrics.installations.average_per_customer),
        },
      ],
    },
    {
      title: labels.sections.aiActivity,
      cards: [
        {
          label: labels.metrics.supportHandled,
          value: formatNumber(metrics.ai_activity.support_requests_handled),
        },
        {
          label: labels.metrics.automatedTasks,
          value: formatNumber(metrics.ai_activity.automated_tasks_completed),
        },
        {
          label: labels.metrics.aiRecommendations,
          value: formatNumber(metrics.ai_activity.ai_recommendations_generated),
        },
        {
          label: labels.metrics.avgResponseTime,
          value: `${metrics.ai_activity.average_assistant_response_time_seconds} ${labels.seconds}`,
        },
      ],
    },
    {
      title: labels.sections.growth,
      cards: [
        {
          label: labels.metrics.newCustomers30d,
          value: formatNumber(metrics.growth.new_customers_30d),
        },
        {
          label: labels.metrics.newInstallations30d,
          value: formatNumber(metrics.growth.new_installations_30d),
        },
        {
          label: labels.metrics.mostUsedModules,
          value:
            metrics.growth.most_used_modules.length > 0
              ? metrics.growth.most_used_modules.join(", ")
              : labels.none,
        },
        {
          label: labels.metrics.retentionRate,
          value: `${metrics.growth.customer_retention_rate}${labels.percent}`,
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {labels.title}
        </h1>
        <p className="mt-2 text-base text-gray-500">{labels.subtitle}</p>
      </div>

      <div className="space-y-10">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {section.cards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <p className="text-sm font-medium text-gray-500">{card.label}</p>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
                    {card.value}
                  </p>
                  {card.hint && <p className="mt-1 text-xs text-gray-400">{card.hint}</p>}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
