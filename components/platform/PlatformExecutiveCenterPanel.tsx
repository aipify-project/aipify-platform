"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import SinceLastLoginSummaryPanel, {
  type SinceLastLoginSummaryLabels,
} from "@/components/shared/since-last-login/SinceLastLoginSummaryPanel";
import { AipifyEmptyState } from "@/components/branding";
import {
  getExecutiveImpactStyle,
  parseExecutiveCenterBundle,
  type ExecutiveCenterBundle,
} from "@/lib/platform/executive-center";
import type { ExecutiveCenterLabels } from "@/lib/platform/executive-page-labels";
import { getGreetingPeriodForTimezone, getBrowserTimezone } from "@/lib/core/greeting";
import type { PlatformAdminSession } from "@/lib/platform/ai-dashboard";
import { createClient } from "@/lib/supabase/client";

type PlatformExecutiveCenterPanelProps = {
  labels: ExecutiveCenterLabels;
  sinceLastLoginLabels: SinceLastLoginSummaryLabels;
};

const CARD = "rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm lg:p-8";

export default function PlatformExecutiveCenterPanel({
  labels,
  sinceLastLoginLabels,
}: PlatformExecutiveCenterPanelProps) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<PlatformAdminSession | null>(null);
  const [bundle, setBundle] = useState<ExecutiveCenterBundle | null>(null);
  const [askQuery, setAskQuery] = useState("");
  const [askResponse, setAskResponse] = useState<string | null>(null);

  const load = useCallback(async () => {
    const supabase = createClient();
    const sessionResult = await supabase.rpc("record_platform_admin_login");
    const previousLogin =
      sessionResult.data && typeof sessionResult.data === "object"
        ? ((sessionResult.data as PlatformAdminSession).previous_login_at ?? null)
        : null;

    const [bundleResult] = await Promise.all([
      supabase.rpc("get_executive_center_bundle", { p_since: previousLogin }),
      supabase.rpc("update_presence_settings", {
        p_surface: "platform",
        p_view_mode: "executive",
        p_executive_summaries: true,
      }),
    ]);

    setSession(
      sessionResult.error || !sessionResult.data
        ? null
        : (sessionResult.data as PlatformAdminSession)
    );
    setBundle(
      bundleResult.error || !bundleResult.data
        ? null
        : parseExecutiveCenterBundle(bundleResult.data)
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const adminFirstName = useMemo(() => {
    const name = session?.admin_name?.trim();
    if (!name) return null;
    return name.split(/\s+/)[0] ?? null;
  }, [session?.admin_name]);

  const greeting = useMemo(() => {
    const part = getGreetingPeriodForTimezone(getBrowserTimezone());
    if (adminFirstName) {
      if (part === "morning") return labels.greetingMorning.replace("{name}", adminFirstName);
      if (part === "afternoon") return labels.greetingAfternoon.replace("{name}", adminFirstName);
      return labels.greetingEvening.replace("{name}", adminFirstName);
    }
    if (part === "morning") return labels.greetingMorningNoName;
    if (part === "afternoon") return labels.greetingAfternoonNoName;
    return labels.greetingEveningNoName;
  }, [adminFirstName, labels]);

  const metrics = bundle?.executive_metrics;
  const operationalHealth = bundle?.operational_health ?? {
    score: bundle?.since_visit.overall_health ?? 98,
    label: "Excellent",
    signals: [],
  };
  const healthSignals =
    operationalHealth.signals.length > 0
      ? operationalHealth.signals
      : labels.operationalHealth.defaultSignals;
  const attentionItems = bundle?.requires_attention ?? [];
  const customers = bundle?.customer_health_snapshot ?? [];

  const suggestedPrompts = [
    labels.askAipify.prompts.attention,
    labels.askAipify.prompts.support,
    labels.askAipify.prompts.atRisk,
    labels.askAipify.prompts.failedAutomations,
    labels.askAipify.prompts.sinceLogin,
  ];

  function handleAskSubmit(event: React.FormEvent) {
    event.preventDefault();
    setAskResponse(labels.askAipify.placeholderResponse);
  }

  if (loading) {
    return <p className="text-sm text-zinc-500">{labels.loading}</p>;
  }

  if (!session || !bundle) {
    return <AipifyEmptyState message={labels.loadError} pulseLabel={labels.presence} />;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          {greeting}
        </h1>
        <p className="mt-2 text-sm text-zinc-600">{labels.greetingSubtext}</p>
      </section>

      <SinceLastLoginSummaryPanel
        scope="platform_executive"
        labels={sinceLastLoginLabels}
        touchLogin={false}
      />

      <OperationalHealthModule
        health={{ ...operationalHealth, signals: healthSignals }}
        labels={labels}
      />

      <RequiresAttentionCard items={attentionItems} labels={labels} />

      <section>
        <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label={labels.metrics.activeCustomers}
            value={String(metrics?.active_customers ?? 0)}
            trend={
              metrics?.customers_trend_pct
                ? labels.metrics.trendUp.replace("{value}", String(metrics.customers_trend_pct))
                : undefined
            }
          />
          <MetricCard
            label={labels.metrics.mrr}
            value={`$${Number(metrics?.mrr ?? 0).toLocaleString()}`}
            trend={
              metrics?.mrr_trend_pct
                ? labels.metrics.trendUp.replace("{value}", String(metrics.mrr_trend_pct))
                : undefined
            }
          />
          <MetricCard
            label={labels.metrics.automationSuccess}
            value={`${metrics?.automation_success_pct ?? 96}%`}
          />
          <MetricCard
            label={labels.metrics.customerSatisfaction}
            value={`${metrics?.customer_satisfaction ?? 4.8} / 5`}
          />
        </dl>
      </section>

      <RecommendationsSection bundle={bundle} labels={labels} />

      <TimelineSection bundle={bundle} labels={labels} />

      <CustomerHealthSection customers={customers} labels={labels} />

      <section className={CARD}>
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
          {labels.askAipify.title}
        </h2>
        <form onSubmit={handleAskSubmit} className="mt-5 space-y-4">
          <textarea
            value={askQuery}
            onChange={(event) => setAskQuery(event.target.value)}
            placeholder={labels.askAipify.placeholder}
            rows={3}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50/80 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
          />
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setAskQuery(prompt)}
                className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-white"
              >
                {prompt}
              </button>
            ))}
          </div>
          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            {labels.askAipify.submit}
          </button>
        </form>
        {askResponse ? (
          <p className="mt-4 rounded-xl border border-zinc-100 bg-zinc-50/80 px-4 py-3 text-sm text-zinc-700">
            {askResponse}
          </p>
        ) : null}
      </section>
    </div>
  );
}

function OperationalHealthModule({
  health,
  labels,
}: {
  health: { score: number; label: string; signals: string[] };
  labels: ExecutiveCenterLabels;
}) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm lg:p-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
            {labels.operationalHealth.title}
          </h2>
          <p className="mt-3 text-5xl font-semibold tracking-tight text-zinc-900">{health.score}%</p>
          <p className="mt-2 text-lg font-medium text-zinc-700">{health.label}</p>
        </div>
        <div className="lg:max-w-md">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            {labels.operationalHealth.signalsTitle}
          </p>
          <ul className="mt-3 space-y-2">
            {health.signals.map((signal) => (
              <li key={signal} className="flex items-center gap-2 text-sm text-zinc-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
                {signal}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function RequiresAttentionCard({
  items,
  labels,
}: {
  items: Array<{ id: string; message: string; href: string }>;
  labels: ExecutiveCenterLabels;
}) {
  return (
    <section className={CARD}>
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
        {labels.requiresAttention.title}
      </h2>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-emerald-700">{labels.requiresAttention.empty}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="flex items-center justify-between gap-4 rounded-xl border border-zinc-100 bg-zinc-50/70 px-4 py-3 transition hover:border-zinc-300 hover:bg-white"
              >
                <span className="text-sm font-medium text-zinc-900">{item.message}</span>
                <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  {labels.requiresAttention.open}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function MetricCard({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend?: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <dt className="text-sm font-medium text-zinc-500">{label}</dt>
      <dd className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">{value}</dd>
      {trend ? <p className="mt-1 text-xs font-medium text-emerald-700">{trend}</p> : null}
    </div>
  );
}

function RecommendationsSection({
  bundle,
  labels,
}: {
  bundle: ExecutiveCenterBundle;
  labels: ExecutiveCenterLabels;
}) {
  const recommendations = bundle.recommendations;

  return (
    <section className={CARD}>
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
        {labels.recommendations.title}
      </h2>
      {recommendations.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-500">{labels.recommendations.empty}</p>
      ) : (
        <ul className="mt-5 space-y-4">
          {recommendations.map((rec) => (
            <li key={rec.id} className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase ring-1 ring-inset ${getExecutiveImpactStyle(rec.impact_level)}`}
                >
                  {rec.impact_level}
                </span>
                <h3 className="font-semibold text-zinc-900">{rec.title}</h3>
              </div>
              <dl className="mt-3 space-y-2 text-sm text-zinc-700">
                <div>
                  <dt className="font-medium text-zinc-500">{labels.recommendations.observation}</dt>
                  <dd>{rec.observation ?? rec.business_impact}</dd>
                </div>
                <div>
                  <dt className="font-medium text-zinc-500">
                    {labels.recommendations.recommendedAction}
                  </dt>
                  <dd>{rec.suggested_action}</dd>
                </div>
                <div>
                  <dt className="font-medium text-zinc-500">
                    {labels.recommendations.potentialImpact}
                  </dt>
                  <dd>{rec.expected_benefit}</dd>
                </div>
              </dl>
              <Link
                href={rec.review_href ?? "/platform/intelligence/global-patterns"}
                className="mt-4 inline-flex rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-semibold text-zinc-800 transition hover:border-zinc-300"
              >
                {labels.recommendations.review}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function TimelineSection({
  bundle,
  labels,
}: {
  bundle: ExecutiveCenterBundle;
  labels: ExecutiveCenterLabels;
}) {
  return (
    <section className={CARD}>
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
        {labels.timeline.title}
      </h2>
      {bundle.timeline.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-500">{labels.timeline.empty}</p>
      ) : (
        <ul className="mt-5 space-y-4">
          {bundle.timeline.map((event) => (
            <li key={event.id} className="flex gap-4 border-l-2 border-zinc-200 pl-4">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-zinc-500">{event.time}</p>
                <p className="mt-1 text-sm text-zinc-800">{event.executive_title}</p>
              </div>
              {event.href ? (
                <Link
                  href={event.href}
                  className="shrink-0 text-xs font-semibold uppercase tracking-wide text-zinc-600 hover:text-zinc-900"
                >
                  {labels.timeline.open}
                </Link>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function CustomerHealthSection({
  customers,
  labels,
}: {
  customers: Array<{
    id: string;
    name: string;
    health_score: number;
    status: "healthy" | "needs_review";
    href: string;
  }>;
  labels: ExecutiveCenterLabels;
}) {
  return (
    <section className={CARD}>
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
        {labels.customerHealth.title}
      </h2>
      {customers.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-500">{labels.customerHealth.empty}</p>
      ) : (
        <ul className="mt-5 space-y-3">
          {customers.map((customer) => (
            <li key={customer.id}>
              <Link
                href={customer.href}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-100 bg-zinc-50/70 px-4 py-3 transition hover:border-zinc-300 hover:bg-white"
              >
                <div>
                  <p className="font-semibold text-zinc-900">{customer.name}</p>
                  <p className="mt-0.5 text-sm text-zinc-600">
                    {labels.customerHealth.operationalHealth.replace(
                      "{score}",
                      String(customer.health_score)
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-zinc-700">
                    {customer.status === "healthy"
                      ? labels.customerHealth.statusHealthy
                      : labels.customerHealth.statusNeedsReview}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    {labels.customerHealth.open}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
