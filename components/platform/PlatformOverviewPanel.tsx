"use client";

import { useEffect, useMemo, useState } from "react";
import { AipifyEmptyState } from "@/components/branding";
import { createClient } from "@/lib/supabase/client";
import {
  getGreetingName,
  type PlatformAdminSession,
  type PlatformDashboardSnapshot,
} from "@/lib/platform/ai-dashboard";
import { getSystemHealth } from "@/lib/platform/metrics-dashboard";
import type { PlatformMetrics } from "@/lib/platform/types";

type PlatformOverviewPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    note: string;
    loading: string;
    pulseLabel: string;
    briefing: {
      title: string;
      greetingMorning: string;
      greetingAfternoon: string;
      greetingEvening: string;
      sinceVisit: string;
      newCustomers: string;
      trialsEnding: string;
      supportResolved: string;
      followUp: string;
      noIncidents: string;
      incidents: string;
    };
    sinceLogin: {
      title: string;
      markRead: string;
      markedRead: string;
      newCustomers: string;
      newInstallations: string;
      supportResolved: string;
      escalated: string;
      trialsEnding: string;
      billingEvents: string;
      systemIncidents: string;
      aiRecommendations: string;
      recommendationHint: string;
      empty: string;
    };
  };
};

const READ_STORAGE_KEY = "aipify-platform-since-login-read";

export default function PlatformOverviewPanel({ labels }: PlatformOverviewPanelProps) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<PlatformAdminSession | null>(null);
  const [snapshot, setSnapshot] = useState<PlatformDashboardSnapshot | null>(null);
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [markedRead, setMarkedRead] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const sessionResult = await supabase.rpc("record_platform_admin_login");
      const previousLogin =
        sessionResult.data && typeof sessionResult.data === "object"
          ? ((sessionResult.data as PlatformAdminSession).previous_login_at ?? null)
          : null;

      const [snapshotResult, metricsResult] = await Promise.all([
        supabase.rpc("get_platform_dashboard_snapshot", {
          p_since: previousLogin,
        }),
        supabase.rpc("get_platform_metrics"),
      ]);

      if (!cancelled) {
        setSession(
          sessionResult.error || !sessionResult.data
            ? null
            : (sessionResult.data as PlatformAdminSession)
        );
        setSnapshot(
          snapshotResult.error || !snapshotResult.data
            ? null
            : (snapshotResult.data as PlatformDashboardSnapshot)
        );
        setMetrics(
          metricsResult.error || !metricsResult.data
            ? null
            : (metricsResult.data as PlatformMetrics)
        );
        setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!session?.last_login_at) return;
    const stored = localStorage.getItem(`${READ_STORAGE_KEY}-${session.last_login_at}`);
    setMarkedRead(stored === "1");
  }, [session?.last_login_at]);

  const greeting = useMemo(() => {
    const part = getGreetingName(new Date().getHours());
    if (part === "morning") return labels.briefing.greetingMorning;
    if (part === "afternoon") return labels.briefing.greetingAfternoon;
    return labels.briefing.greetingEvening;
  }, [labels.briefing]);

  const briefingItems = useMemo(() => {
    if (!snapshot) return [];
    const items: string[] = [];
    if (snapshot.new_customers > 0) {
      items.push(labels.briefing.newCustomers.replace("{count}", String(snapshot.new_customers)));
    }
    if (snapshot.trials_ending_7d > 0) {
      items.push(labels.briefing.trialsEnding.replace("{count}", String(snapshot.trials_ending_7d)));
    }
    if (snapshot.support_resolved > 0) {
      items.push(
        labels.briefing.supportResolved.replace("{count}", String(snapshot.support_resolved))
      );
    }
    if (snapshot.follow_up_customers > 0) {
      items.push(labels.briefing.followUp.replace("{count}", String(snapshot.follow_up_customers)));
    }
    if (snapshot.system_incidents === 0) {
      items.push(labels.briefing.noIncidents);
    } else {
      items.push(labels.briefing.incidents.replace("{count}", String(snapshot.system_incidents)));
    }
    return items;
  }, [labels.briefing, snapshot]);

  const sinceLoginItems = useMemo(() => {
    if (!snapshot || !metrics) return [];
    return [
      labels.sinceLogin.newCustomers.replace("{count}", String(snapshot.new_customers)),
      labels.sinceLogin.newInstallations.replace("{count}", String(snapshot.new_installations)),
      labels.sinceLogin.supportResolved.replace("{count}", String(snapshot.support_resolved)),
      labels.sinceLogin.escalated.replace("{count}", String(snapshot.escalated_cases)),
      labels.sinceLogin.trialsEnding.replace("{count}", String(snapshot.trials_ending_7d)),
      labels.sinceLogin.billingEvents.replace("{count}", String(snapshot.billing_events)),
      labels.sinceLogin.systemIncidents.replace("{count}", String(snapshot.system_incidents)),
      labels.sinceLogin.aiRecommendations.replace(
        "{count}",
        String(metrics.ai_activity.ai_recommendations_generated)
      ),
    ];
  }, [labels.sinceLogin, metrics, snapshot]);

  function handleMarkRead() {
    if (!session?.last_login_at) return;
    localStorage.setItem(`${READ_STORAGE_KEY}-${session.last_login_at}`, "1");
    setMarkedRead(true);
  }

  if (loading) {
    return <p className="text-sm text-gray-500">{labels.loading}</p>;
  }

  if (!session || !snapshot) {
    return <AipifyEmptyState message={labels.note} pulseLabel={labels.pulseLabel} />;
  }

  const adminName = session.admin_name;
  const health = metrics ? getSystemHealth(metrics) : null;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {labels.title}
        </h1>
        <p className="mt-2 text-base text-gray-500">{labels.subtitle}</p>
      </header>

      <section className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50/70 via-white to-indigo-50/40 p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-semibold text-violet-900">{labels.briefing.title}</h2>
        <p className="mt-4 text-base font-semibold text-gray-900">
          {greeting.replace("{name}", adminName)}
        </p>
        <p className="mt-2 text-sm font-medium text-gray-600">{labels.briefing.sinceVisit}</p>
        <ul className="mt-4 space-y-2.5">
          {briefingItems.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-gray-700">
              <span className="mt-1 text-violet-500" aria-hidden="true">
                •
              </span>
              {item}
            </li>
          ))}
        </ul>
        {health && (
          <p className="mt-5 text-xs text-gray-500">
            Platform score: {health.score}% · {health.label}
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.sinceLogin.title}</h2>
          <button
            type="button"
            onClick={handleMarkRead}
            disabled={markedRead}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:border-violet-200 hover:text-violet-700 disabled:opacity-50"
          >
            {markedRead ? labels.sinceLogin.markedRead : labels.sinceLogin.markRead}
          </button>
        </div>
        {markedRead ? (
          <p className="mt-4 text-sm text-gray-500">{labels.sinceLogin.empty}</p>
        ) : (
          <>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {sinceLoginItems.map((item) => (
                <li
                  key={item}
                  className="rounded-xl bg-gray-50/80 px-4 py-3 text-sm text-gray-700 ring-1 ring-gray-100"
                >
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-violet-700">{labels.sinceLogin.recommendationHint}</p>
          </>
        )}
      </section>

      <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-6 text-sm text-blue-900">
        {labels.note}
      </div>
    </div>
  );
}
