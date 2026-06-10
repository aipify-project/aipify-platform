"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyPulse } from "@/components/branding";
import {
  getOnboardingItems,
  type CustomerOnboarding,
} from "@/lib/platform/installation-engine";

type CustomerOnboardingPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    complete: string;
    items: Record<string, string>;
    pulseLabel: string;
  };
};

export default function CustomerOnboardingPanel({ labels }: CustomerOnboardingPanelProps) {
  const [onboarding, setOnboarding] = useState<CustomerOnboarding | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/onboarding");
      const data = await res.json();
      if (data?.onboarding) {
        setOnboarding(data.onboarding as CustomerOnboarding);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
        <AipifyPulse size="sm" title={labels.pulseLabel} aria-label={labels.pulseLabel} />
        {labels.loading}
      </div>
    );
  }

  if (!onboarding) return null;

  const items = getOnboardingItems(onboarding);

  return (
    <section className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{labels.title}</h2>
          <p className="text-sm text-gray-500">{labels.subtitle}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-violet-700">{onboarding.score}%</p>
          <p className="text-xs text-gray-500">{labels.complete}</p>
        </div>
      </div>
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-violet-500 transition-all"
          style={{ width: `${onboarding.score}%` }}
        />
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.key} className="flex items-center gap-2 text-sm text-gray-700">
            <span className={item.done ? "text-green-600" : "text-amber-500"}>
              {item.done ? "✓" : "⚠"}
            </span>
            {labels.items[item.key]}
          </li>
        ))}
      </ul>
    </section>
  );
}
