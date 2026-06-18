"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseActionHubDashboard, type ActionHubDashboard } from "@/lib/aipify/action-hub";
import { ActionItemList } from "./ActionItemList";

type ActionHubPanelProps = {
  labels: Record<string, string>;
};

export function ActionHubPanel({ labels }: ActionHubPanelProps) {
  const [dashboard, setDashboard] = useState<ActionHubDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [collecting, setCollecting] = useState(false);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/action-hub/dashboard");
    if (res.ok) setDashboard(parseActionHubDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function collect() {
    setCollecting(true);
    await fetch("/api/aipify/action-hub/collect", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    await load();
    setCollecting(false);
  }

  async function updateStatus(id: string, status: string) {
    setActing(id);
    await fetch(`/api/aipify/action-hub/${id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
    setActing(null);
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_customer) {
    return <div className="p-6 text-sm text-gray-600">{labels.empty}</div>;
  }

  const sections = [
    { key: "my_actions", title: labels.myActions, items: dashboard.my_actions },
    { key: "recommended", title: labels.recommended, items: dashboard.recommended_actions },
    { key: "critical", title: labels.critical, items: dashboard.critical_actions },
    { key: "team", title: labels.teamActions, items: dashboard.team_actions },
    { key: "blocked", title: labels.blocked, items: dashboard.blocked_items },
    { key: "completed", title: labels.completed, items: dashboard.recently_completed },
  ] as const;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{labels.title}</h1>
          <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/app/actions/inbox" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
            {labels.inbox}
          </Link>
          <Link href="/app/actions/recommended" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
            {labels.recommendedLink}
          </Link>
          <Link href="/app/actions/completed" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
            {labels.completedLink}
          </Link>
          <Link href="/app/actions/settings" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
            {labels.settings}
          </Link>
          <button
            type="button"
            disabled={collecting}
            onClick={() => void collect()}
            className="rounded-lg bg-gray-900 px-3 py-1.5 text-sm text-white disabled:opacity-50"
          >
            {labels.refresh}
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {sections.map((section) => (
          <section key={section.key} className="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
            <h2 className="text-sm font-semibold text-gray-900">{section.title}</h2>
            <div className="mt-3">
              <ActionItemList
                items={section.items}
                empty={labels.sectionEmpty}
                showActions={section.key !== "completed"}
                labels={labels}
                onStatus={updateStatus}
                acting={acting}
              />
            </div>
          </section>
        ))}
      </div>

      <p className="text-xs text-gray-500">{labels.privacy}</p>
    </div>
  );
}
