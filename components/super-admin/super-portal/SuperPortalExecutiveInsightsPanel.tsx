"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  STATUS_BADGES,
  parseSuperExecutiveInsights,
  type SuperExecutiveInsights,
  type SuperPortalLabels,
} from "@/lib/super-portal";

function InsightCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="font-semibold text-zinc-900">{title}</h2>
      <div className="mt-4 space-y-2 text-sm text-zinc-700">{children}</div>
    </article>
  );
}

export function SuperPortalExecutiveInsightsPanel({
  labels,
}: {
  labels: SuperPortalLabels["executiveInsights"];
}) {
  const [insights, setInsights] = useState<SuperExecutiveInsights | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/super-portal/executive-insights");
    if (res.ok) setInsights(parseSuperExecutiveInsights(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!insights) return <p className="p-6 text-sm text-red-600">{labels.loading}</p>;

  const trendClass = (trend: string) => STATUS_BADGES[trend] ?? STATUS_BADGES.stable;

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href="/super" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          ← {labels.back}
        </Link>
        <h1 className="mt-3 text-2xl font-semibold text-zinc-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">{labels.subtitle}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <InsightCard title={labels.organizationGrowth}>
          <p>
            {labels.newOrganizations30d}: {insights.organization_growth.new_organizations_30d}
          </p>
          <p className={trendClass(insights.organization_growth.trend)}>
            {labels.trends[insights.organization_growth.trend]}
          </p>
        </InsightCard>
        <InsightCard title={labels.subscriptionGrowth}>
          <p>
            {labels.newSubscriptions30d}: {insights.subscription_growth.new_subscriptions_30d}
          </p>
          <p>
            {labels.activeSubscriptions}: {insights.subscription_growth.active_subscriptions}
          </p>
          <p className={trendClass(insights.subscription_growth.trend)}>
            {labels.trends[insights.subscription_growth.trend]}
          </p>
        </InsightCard>
        <InsightCard title={labels.revenueIndicators}>
          <p>
            {labels.mrr}: {insights.revenue_indicators.mrr.toLocaleString()} NOK
          </p>
          <p className={trendClass(insights.revenue_indicators.trend)}>
            {labels.trends[insights.revenue_indicators.trend]}
          </p>
        </InsightCard>
        <InsightCard title={labels.platformAdoption}>
          <p>
            {labels.activeInstallations}: {insights.platform_adoption.active_installations}
          </p>
          <p className={trendClass(insights.platform_adoption.trend)}>
            {labels.trends[insights.platform_adoption.trend]}
          </p>
        </InsightCard>
        <InsightCard title={labels.globalActivity}>
          <p>
            {labels.actionsToday}: {insights.global_activity.actions_today}
          </p>
          <p>
            {labels.adminLogins7d}: {insights.global_activity.platform_admin_logins_7d}
          </p>
        </InsightCard>
      </div>
    </div>
  );
}
