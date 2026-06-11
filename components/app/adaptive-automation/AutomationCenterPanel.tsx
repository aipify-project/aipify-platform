"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseAutomationCenter,
  type AutomationCenter,
  type AutomationItem,
  type AutomationSuggestion,
} from "@/lib/aipify/adaptive-automation";

type AutomationCenterPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    back: string;
    privacy: string;
    upgradeTitle: string;
    upgradeBody: string;
    upgradeCta: string;
    refresh: string;
    notEnabledTitle: string;
    notEnabledBody: string;
    enableCta: string;
    metrics: {
      active: string;
      drafts: string;
      suggestions: string;
      timeSaved: string;
      approvals: string;
    };
    sections: {
      automations: string;
      suggestions: string;
      approvals: string;
    };
    riskLevels: Record<string, string>;
    statuses: Record<string, string>;
    suggestionActions: {
      createDraft: string;
      dismiss: string;
      snooze: string;
    };
    automationActions: {
      enable: string;
      pause: string;
      test: string;
    };
    approvalAction: string;
    emptySuggestions: string;
    emptyAutomations: string;
    links: {
      library: string;
      executions: string;
      settings: string;
    };
  };
};

const RISK_STYLES: Record<string, string> = {
  low: "bg-emerald-100 text-emerald-800",
  medium: "bg-amber-100 text-amber-900",
  high: "bg-orange-100 text-orange-900",
  blocked: "bg-rose-100 text-rose-900",
};

export function AutomationCenterPanel({ labels }: AutomationCenterPanelProps) {
  const [center, setCenter] = useState<AutomationCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/automation");
    if (res.ok) setCenter(parseAutomationCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function discover() {
    await fetch("/api/aipify/automation/suggestions/discover", { method: "POST" });
    void refresh();
  }

  if (loading) return <p className="text-sm text-gray-500">{labels.loading}</p>;
  if (!center?.has_customer) return <p className="text-sm text-gray-500">{labels.loading}</p>;

  if (center.upgrade_required || !center.has_access) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 p-6">
        <Link href="/app" className="text-sm text-indigo-600 hover:underline">{labels.back}</Link>
        <h1 className="text-2xl font-semibold text-gray-900">{labels.title}</h1>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium">{labels.upgradeTitle}</h2>
          <p className="mt-2 text-sm text-gray-600">{labels.upgradeBody}</p>
          <Link href="/app/settings/billing" className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700">{labels.upgradeCta}</Link>
        </div>
      </div>
    );
  }

  if (center.enabled === false) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 p-6">
        <Link href="/app" className="text-sm text-indigo-600 hover:underline">{labels.back}</Link>
        <h1 className="text-2xl font-semibold text-gray-900">{labels.title}</h1>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium">{labels.notEnabledTitle}</h2>
          <p className="mt-2 text-sm text-gray-600">{labels.notEnabledBody}</p>
          <Link href="/app/settings/automation" className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700">{labels.enableCta}</Link>
        </div>
      </div>
    );
  }

  const m = center.metrics;
  const hoursSaved = m ? Math.round(m.time_saved_minutes_month / 60) : 0;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/app" className="text-sm text-indigo-600 hover:underline">{labels.back}</Link>
          <h1 className="mt-2 text-2xl font-semibold text-gray-900">{labels.title}</h1>
          <p className="mt-1 text-sm text-gray-600">{labels.subtitle}</p>
          <p className="mt-2 text-xs text-gray-500">{center.privacy_note}</p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <button type="button" onClick={() => void discover()} className="rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-50">{labels.refresh}</button>
          <Link href="/app/automation-library" className="rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-50">{labels.links.library}</Link>
          <Link href="/app/automation-executions" className="rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-50">{labels.links.executions}</Link>
          <Link href="/app/settings/automation" className="rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-50">{labels.links.settings}</Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label={labels.metrics.active} value={m?.active_count ?? 0} />
        <MetricCard label={labels.metrics.drafts} value={m?.draft_count ?? 0} />
        <MetricCard label={labels.metrics.suggestions} value={m?.new_suggestions ?? 0} />
        <MetricCard label={labels.metrics.timeSaved} value={`${hoursSaved}h`} />
      </div>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-gray-900">{labels.sections.suggestions}</h2>
        {(center.suggestions ?? []).length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-sm text-gray-600">{labels.emptySuggestions}</p>
        ) : (
          (center.suggestions ?? []).map((s) => (
            <SuggestionCard key={s.id} suggestion={s} labels={labels} onDone={refresh} />
          ))
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-gray-900">{labels.sections.automations}</h2>
        {(center.automations ?? []).length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-sm text-gray-600">{labels.emptyAutomations}</p>
        ) : (
          (center.automations ?? []).map((a) => (
            <AutomationCard key={a.id} automation={a} labels={labels} onDone={refresh} />
          ))
        )}
      </section>

      {(center.pending_approvals_list ?? []).length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-gray-900">{labels.sections.approvals}</h2>
          {(center.pending_approvals_list ?? []).map((ap) => (
            <div key={ap.id} className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 p-4">
              <span className="text-sm text-amber-900">{ap.approval_type}</span>
              <button
                type="button"
                onClick={async () => {
                  await fetch(`/api/aipify/automation/approvals/${ap.id}/approve`, { method: "POST" });
                  void refresh();
                }}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs text-white hover:bg-indigo-700"
              >
                {labels.approvalAction}
              </button>
            </div>
          ))}
        </section>
      ) : null}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function SuggestionCard({
  suggestion,
  labels,
  onDone,
}: {
  suggestion: AutomationSuggestion;
  labels: AutomationCenterPanelProps["labels"];
  onDone: () => void;
}) {
  const mins = suggestion.estimated_time_saved_minutes_per_week;
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap gap-2">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${RISK_STYLES[suggestion.risk_level] ?? ""}`}>
          {labels.riskLevels[suggestion.risk_level] ?? suggestion.risk_level}
        </span>
        {mins ? <span className="text-xs text-gray-500">~{Math.round(mins / 60)}h/week</span> : null}
      </div>
      <h3 className="mt-2 font-semibold text-gray-900">{suggestion.title}</h3>
      <p className="mt-1 text-sm text-gray-600">{suggestion.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={async () => {
            await fetch(`/api/aipify/automation/suggestions/${suggestion.id}/convert`, { method: "POST" });
            onDone();
          }}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs text-white hover:bg-indigo-700"
        >
          {labels.suggestionActions.createDraft}
        </button>
        <button type="button" onClick={async () => { await fetch(`/api/aipify/automation/suggestions/${suggestion.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "dismissed" }) }); onDone(); }} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600">{labels.suggestionActions.dismiss}</button>
        <button type="button" onClick={async () => { await fetch(`/api/aipify/automation/suggestions/${suggestion.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "snoozed" }) }); onDone(); }} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600">{labels.suggestionActions.snooze}</button>
      </div>
    </article>
  );
}

function AutomationCard({
  automation,
  labels,
  onDone,
}: {
  automation: AutomationItem;
  labels: AutomationCenterPanelProps["labels"];
  onDone: () => void;
}) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-semibold text-gray-900">{automation.name}</h3>
        <span className={`rounded-full px-2 py-0.5 text-xs ${RISK_STYLES[automation.risk_level] ?? ""}`}>{labels.riskLevels[automation.risk_level]}</span>
        <span className="text-xs text-gray-500">{labels.statuses[automation.status] ?? automation.status}</span>
      </div>
      {automation.description ? <p className="mt-1 text-sm text-gray-600">{automation.description}</p> : null}
      <div className="mt-4 flex flex-wrap gap-2">
        {automation.status === "draft" || automation.status === "pending_approval" ? (
          <button type="button" onClick={async () => { await fetch(`/api/aipify/automations/${automation.id}/enable`, { method: "POST" }); onDone(); }} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs text-white">{labels.automationActions.enable}</button>
        ) : null}
        {automation.status === "active" ? (
          <>
            <button type="button" onClick={async () => { await fetch(`/api/aipify/automations/${automation.id}/pause`, { method: "POST" }); onDone(); }} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs">{labels.automationActions.pause}</button>
            <button type="button" onClick={async () => { await fetch(`/api/aipify/automations/${automation.id}/test-run`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }); onDone(); }} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs">{labels.automationActions.test}</button>
          </>
        ) : null}
      </div>
    </article>
  );
}
