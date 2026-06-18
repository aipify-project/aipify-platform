"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import { useCallback, useEffect, useState } from "react";
import { AipifyEmptyState } from "@/components/branding";
import type { CustomerRecommendation } from "@/lib/app/customer-app";
import { formatDate } from "@/lib/i18n/format-date";
import { createClient } from "@/lib/supabase/client";

type RecommendationsCenterPanelProps = {
  locale: string;
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    pulseLabel: string;
    approve: string;
    dismiss: string;
    learnMore: string;
    fields: {
      reason: string;
      impact: string;
      risk: string;
      action: string;
    };
  };
};

export function RecommendationsCenterPanel({ locale, labels }: RecommendationsCenterPanelProps) {
  const [items, setItems] = useState<CustomerRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("get_customer_recommendations_center");
    if (!error && data?.has_customer) {
      setItems((data.recommendations as CustomerRecommendation[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function handleAction(id: string, source: string, action: "approve" | "dismiss") {
    const supabase = createClient();
    await supabase.rpc("perform_customer_recommendation_action", {
      p_recommendation_id: id,
      p_source: source,
      p_action: action,
    });
    await refresh();
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  if (items.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <div className="mt-8">
          <AipifyEmptyState message={labels.empty} pulseLabel={labels.pulseLabel} />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
      </div>

      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h2 className="text-lg font-semibold text-gray-900">{item.title}</h2>
              <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                {item.risk_level}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-700">{item.description}</p>
            <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-gray-500">{labels.fields.reason}</dt>
                <dd className="text-gray-800">{item.reason}</dd>
              </div>
              <div>
                <dt className="text-gray-500">{labels.fields.impact}</dt>
                <dd className="text-gray-800">{item.expected_impact}</dd>
              </div>
              <div>
                <dt className="text-gray-500">{labels.fields.action}</dt>
                <dd className="text-gray-800">{item.suggested_action}</dd>
              </div>
              <div>
                <dt className="text-gray-500">{labels.fields.risk}</dt>
                <dd className="text-gray-800">{item.risk_level}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-gray-400">{formatDate(item.created_at, locale)}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void handleAction(item.id, item.source, "approve")}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700"
              >
                {labels.approve}
              </button>
              <button
                type="button"
                onClick={() => void handleAction(item.id, item.source, "dismiss")}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                {labels.dismiss}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
