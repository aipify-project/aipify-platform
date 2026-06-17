"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseDesktopCompanionHome,
  type DesktopCompanionHome,
} from "@/lib/desktop-companion-foundation";
import { DesktopCompanionFirstRunPanel } from "./DesktopCompanionFirstRunPanel";

type Props = {
  labels: Record<string, string>;
};

export function DesktopCompanionHomePanel({ labels }: Props) {
  const [home, setHome] = useState<DesktopCompanionHome | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/aipify/desktop/foundation/home");
      if (!res.ok) {
        setError(true);
        setLoading(false);
        return;
      }
      setHome(parseDesktopCompanionHome(await res.json()));
    } catch {
      setError(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (error || !home?.has_customer) {
    return (
      <PlatformEmptyState
        title={labels.emptyTitle}
        message={labels.emptyMessage}
        primaryAction={{ label: labels.emptyCta, href: "/app/desktop/settings" }}
      />
    );
  }

  const needsFirstRun = !home.profile?.profile?.first_run_complete;

  if (needsFirstRun) {
    return (
      <DesktopCompanionFirstRunPanel
        labels={labels}
        onComplete={() => void load()}
      />
    );
  }

  const tasks = home.tasks?.items ?? [];
  const notifications = home.notifications?.items ?? [];
  const quickActions = home.quick_actions ?? [];

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900">
          {home.greeting || labels.goodMorning}
        </h1>
        <p className="text-sm text-gray-600">{home.todays_focus || labels.todaysFocus}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Section title={labels.dailyBriefing}>
          <p className="text-sm text-gray-700">
            {home.daily_briefing?.headline || home.daily_briefing?.summary || "—"}
          </p>
        </Section>
        <Section title={labels.tasks}>
          {tasks.length === 0 ? (
            <p className="text-sm text-gray-500">—</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {tasks.slice(0, 5).map((task, i) => (
                <li key={task.id ?? i}>{task.title}</li>
              ))}
            </ul>
          )}
        </Section>
        <Section title={labels.calendar}>
          <p className="text-sm text-gray-500">
            {(home.calendar?.length ?? 0) > 0
              ? `${home.calendar?.length} ${labels.calendar}`
              : "—"}
          </p>
        </Section>
        <Section title={labels.companionInsights}>
          <p className="text-sm text-gray-700">
            {String(home.companion_insights?.mode_name ?? labels.companionInsights)}
          </p>
        </Section>
        <Section title={labels.recommendedActions}>
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500">—</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {notifications.slice(0, 3).map((n) => (
                <li key={n.id}>{n.title}</li>
              ))}
            </ul>
          )}
        </Section>
        <Section title={labels.recentActivity}>
          {(home.recent_activity ?? []).length === 0 ? (
            <p className="text-sm text-gray-500">—</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {home.recent_activity?.slice(0, 4).map((a, i) => (
                <li key={a.id ?? i}>{a.label}</li>
              ))}
            </ul>
          )}
        </Section>
      </div>

      <Section title={labels.quickActions}>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <button
              key={action.id}
              type="button"
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              {action.label}
            </button>
          ))}
        </div>
      </Section>

      <p className="text-xs text-gray-500">{labels.privacy}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">{title}</h2>
      {children}
    </section>
  );
}
