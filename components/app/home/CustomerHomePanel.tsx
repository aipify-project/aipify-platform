"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyBriefingCard } from "@/components/app/briefing";
import { DesktopCompanionCard } from "@/components/app/desktop";
import { MemoryEngineCard } from "@/components/app/memory";
import { AipifyEmptyState } from "@/components/branding";
import { HealthScoreCard } from "@/components/app/shared/HealthScoreCard";
import { SectionCard } from "@/components/app/shared/SectionCard";
import type { CustomerAppHomeBundle, HealthScoreBand } from "@/lib/app/customer-app";
import {
  formatWelcomeMessage,
  getBrowserTimezone,
  type GreetingLabels,
} from "@/lib/core/greeting";
import { formatDate } from "@/lib/i18n/format-date";
import { createClient } from "@/lib/supabase/client";

type CustomerHomePanelProps = {
  locale: string;
  labels: {
    loading: string;
    empty: string;
    pulseLabel: string;
    principle: string;
    healthTitle: string;
    healthBands: Record<HealthScoreBand, string>;
    sections: {
      activity: string;
      recommendations: string;
      approvals: string;
      quickActions: string;
    };
    noActivity: string;
    noRecommendations: string;
    approvalsPending: string;
    viewAll: string;
    onboardingNote: string;
    greetings: GreetingLabels;
    overviewLate: string;
    briefing: {
      sinceLastLogin: string;
      viewFull: string;
      recommendedStep: string;
      openApprovals: string;
      openQuality: string;
      markRead: string;
    };
    desktop: {
      title: string;
      open: string;
      mode: string;
      unread: string;
      remindersSoon: string;
    };
    memoryEngine: {
      title: string;
      open: string;
      profiles: string;
      patterns: string;
    };
  };
};

export function CustomerHomePanel({ locale, labels }: CustomerHomePanelProps) {
  const [bundle, setBundle] = useState<CustomerAppHomeBundle | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("get_customer_app_home_bundle");
    if (!error && data?.has_customer) {
      setBundle(data as CustomerAppHomeBundle);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (loading) {
    return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;
  }

  if (!bundle?.has_customer) {
    return (
      <div className="p-6">
        <AipifyEmptyState message={labels.empty} pulseLabel={labels.pulseLabel} />
      </div>
    );
  }

  const health = bundle.health_score ?? { score: 90, label: "healthy" as HealthScoreBand };
  const timezone = bundle.timezone ?? getBrowserTimezone();
  const welcome = formatWelcomeMessage(labels.greetings, {
    timezone,
    userName: bundle.user_name,
  });
  const overview =
    welcome.period === "late" ? labels.overviewLate : bundle.executive_overview;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {welcome.message}
        </h1>
        <p className="mt-2 max-w-2xl text-base text-gray-600">{overview}</p>
        <p className="mt-3 text-sm text-indigo-700">{labels.principle}</p>
      </div>

      <AipifyBriefingCard labels={labels.briefing} />
      <DesktopCompanionCard labels={labels.desktop} />
      <MemoryEngineCard labels={labels.memoryEngine} />

      <div className="grid gap-4 lg:grid-cols-3">
        <HealthScoreCard
          score={health.score}
          label={health.label}
          labels={labels.healthBands}
          title={labels.healthTitle}
        />
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
          <p className="text-sm text-gray-600">
            {bundle.recommendations_count ?? 0} {labels.sections.recommendations.toLowerCase()}.
            {(bundle.pending_approvals_count ?? 0) > 0
              ? ` ${bundle.pending_approvals_count} ${labels.approvalsPending}.`
              : ""}
          </p>
          {!bundle.onboarding_complete && (
            <p className="mt-3 rounded-lg border border-violet-100 bg-violet-50 px-3 py-2 text-sm text-violet-900">
              {labels.onboardingNote}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          title={labels.sections.activity}
          action={
            <Link href="/app/presence" className="text-sm text-indigo-600 hover:underline">
              {labels.viewAll}
            </Link>
          }
        >
          {(bundle.recent_activity ?? []).length === 0 ? (
            <p className="text-sm text-gray-500">{labels.noActivity}</p>
          ) : (
            <ul className="space-y-2">
              {(bundle.recent_activity ?? []).slice(0, 5).map((item) => (
                <li key={item.id} className="text-sm text-gray-700">
                  <span className="font-medium">{item.title}</span>
                  <span className="ml-2 text-gray-400">
                    {formatDate(item.created_at, locale)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard
          title={labels.sections.recommendations}
          action={
            <Link href="/app/recommendations" className="text-sm text-indigo-600 hover:underline">
              {labels.viewAll}
            </Link>
          }
        >
          {(bundle.recommendations_preview ?? []).length === 0 ? (
            <p className="text-sm text-gray-500">{labels.noRecommendations}</p>
          ) : (
            <ul className="space-y-2">
              {(bundle.recommendations_preview ?? []).map((item) => (
                <li key={item.id} className="text-sm text-gray-700">
                  {item.title}
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      <SectionCard title={labels.sections.quickActions}>
        <div className="flex flex-wrap gap-2">
          {(bundle.quick_actions ?? []).map((action) => (
            <Link
              key={action.id}
              href={action.href ?? "/app"}
              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 hover:border-indigo-200 hover:bg-indigo-50"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
