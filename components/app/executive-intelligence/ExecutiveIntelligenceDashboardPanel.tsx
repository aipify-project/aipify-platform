"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseExecutiveIntelligenceDashboard,
  type AbosSuccessCriterion,
  type BlueprintObjective,
  type BriefingEntry,
  type ExecutiveIntelligenceDashboard,
  type HealthSnapshot,
  type IntegrationLink,
  type MemoryEntry,
  type PriorityItem,
  type RiskSignal,
} from "@/lib/aipify/executive-intelligence";

type Props = { labels: Record<string, string> };

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-indigo-100 bg-indigo-50/40 px-3 py-2 text-sm">
      <span className="font-medium">
        {objective.emoji ? `${objective.emoji} ` : ""}
        {objective.label}
      </span>
      {objective.description ? (
        <p className="mt-1 text-xs text-indigo-900">{objective.description}</p>
      ) : null}
    </div>
  );
}

function SuccessCriterionRow({
  criterion,
  metLabel,
  pendingLabel,
}: {
  criterion: AbosSuccessCriterion;
  metLabel: string;
  pendingLabel: string;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-2 rounded border border-gray-100 px-3 py-2 text-sm">
      <span className="text-gray-800">{criterion.label}</span>
      <span className={criterion.met ? "text-xs text-green-700" : "text-xs text-amber-700"}>
        {criterion.met ? metLabel : pendingLabel}
      </span>
    </div>
  );
}

function badgeClass(value?: string) {
  switch (value) {
    case "ready":
    case "delivered":
    case "on_track":
    case "strong":
    case "active":
      return "bg-emerald-100 text-emerald-800";
    case "draft":
    case "moderate":
    case "needs_review":
    case "monitoring":
      return "bg-amber-100 text-amber-800";
    case "at_risk":
    case "important":
    case "critical":
    case "needs_attention":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function BriefingRow({ briefing }: { briefing: BriefingEntry }) {
  return (
    <li className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium">{briefing.title}</span>
        {briefing.status ? (
          <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(briefing.status)}`}>{briefing.status}</span>
        ) : null}
      </div>
      <p className="mt-1 text-xs text-gray-600">{briefing.summary}</p>
    </li>
  );
}

function MemoryRow({ entry }: { entry: MemoryEntry }) {
  return (
    <li className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium">{entry.title}</span>
        <span className="text-xs capitalize text-gray-500">{entry.memory_type?.replace(/_/g, " ")}</span>
      </div>
      <p className="mt-1 text-xs text-gray-600">{entry.summary}</p>
    </li>
  );
}

function PriorityRow({ item }: { item: PriorityItem }) {
  return (
    <li className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium">{item.title}</span>
        {item.alignment_signal ? (
          <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(item.alignment_signal)}`}>
            {item.alignment_signal.replace(/_/g, " ")}
          </span>
        ) : null}
      </div>
      {item.progress_pct != null ? (
        <p className="mt-1 text-xs text-gray-500">
          {item.progress_pct}% · {item.track_type?.replace(/_/g, " ")}
        </p>
      ) : null}
    </li>
  );
}

function SignalRow({ signal }: { signal: RiskSignal }) {
  return (
    <li className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium">{signal.title}</span>
        {signal.severity ? (
          <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(signal.severity)}`}>{signal.severity}</span>
        ) : null}
      </div>
      <p className="mt-1 text-xs text-gray-600">{signal.summary}</p>
    </li>
  );
}

function HealthRow({ snapshot }: { snapshot: HealthSnapshot }) {
  return (
    <li className="rounded-lg border border-indigo-100 bg-indigo-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium capitalize">{snapshot.indicator_type?.replace(/_/g, " ")}</span>
        {snapshot.signal_strength ? (
          <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(snapshot.signal_strength)}`}>
            {snapshot.signal_strength.replace(/_/g, " ")}
          </span>
        ) : null}
      </div>
      <p className="mt-1 text-xs text-gray-600">{snapshot.summary}</p>
    </li>
  );
}

function CrossLinkGrid({ links, title }: { links: IntegrationLink[]; title: string }) {
  if (!links.length) return null;
  return (
    <section>
      <h3 className="mb-3 text-sm font-semibold text-gray-900">{title}</h3>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <Link
            key={link.key ?? link.route}
            href={link.route ?? "#"}
            className="rounded-lg border border-indigo-100 bg-white px-3 py-2 text-sm hover:border-indigo-300"
          >
            <span className="font-medium text-indigo-900">{link.label}</span>
            {link.note ? <p className="mt-1 text-xs text-gray-500">{link.note}</p> : null}
          </Link>
        ))}
      </div>
    </section>
  );
}

export function ExecutiveIntelligenceDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<ExecutiveIntelligenceDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/aipify/executive-intelligence/dashboard");
      if (!res.ok) throw new Error(await res.text());
      const data = parseExecutiveIntelligenceDashboard(await res.json());
      setDashboard(data);
    } catch {
      setError(labels.loading);
    } finally {
      setLoading(false);
    }
  }, [labels.loading]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <p className="text-sm text-gray-500">{labels.loading}</p>;
  if (error || !dashboard?.has_customer) {
    return <p className="text-sm text-rose-600">{error ?? labels.loading}</p>;
  }

  const adaptationExamples = dashboard.executive_intelligence_companion_adaptation?.examples ?? [];
  const limitationRules = dashboard.companion_limitations ?? [];
  const intelligenceCenter = dashboard.executive_intelligence_intelligence_center ?? [];

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-indigo-700">{labels.blueprintTitle}</p>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-indigo-800">{labels.intelligenceScore}</p>
            <p className="text-3xl font-bold text-indigo-900">{dashboard.intelligence_score ?? 0}</p>
            {dashboard.human_decision_required ? (
              <p className="mt-2 text-xs text-indigo-600">{labels.humanDecisionRequired}</p>
            ) : null}
            {dashboard.overload_aware_mode ? (
              <p className="mt-1 text-xs text-indigo-600">{labels.overloadAwareMode}</p>
            ) : null}
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-indigo-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-indigo-600">{labels.briefingsReady}</span>
            <p className="text-xl font-semibold">{dashboard.briefings_ready ?? 0}</p>
          </div>
          <div className="rounded-lg border border-indigo-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-indigo-600">{labels.memoryEntries}</span>
            <p className="text-xl font-semibold">{dashboard.memory_entries_active ?? 0}</p>
          </div>
          <div className="rounded-lg border border-indigo-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-indigo-600">{labels.prioritiesActive}</span>
            <p className="text-xl font-semibold">{dashboard.priorities_active ?? 0}</p>
          </div>
          <div className="rounded-lg border border-indigo-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-indigo-600">{labels.risksActive}</span>
            <p className="text-xl font-semibold">{dashboard.risks_active ?? 0}</p>
          </div>
        </div>
        {dashboard.safety_note ? (
          <p className="mt-4 text-xs italic text-indigo-700">{dashboard.safety_note}</p>
        ) : null}
      </div>

      {dashboard.philosophy ? (
        <section className="rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-900">{labels.philosophy}</h3>
          <p className="mt-2 text-sm text-gray-700">{dashboard.philosophy}</p>
        </section>
      ) : null}

      {intelligenceCenter.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.intelligenceCenter}</h3>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {intelligenceCenter.map((cap) => (
              <li key={String(cap.key)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                {String(cap.label ?? cap.key)}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.dashboard_sections.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.dashboardSections}</h3>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {dashboard.dashboard_sections.map((section) => (
              <li key={String(section.key)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                {String(section.label ?? section.key)}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.executive_intelligence_objectives?.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.blueprintObjectives}</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.executive_intelligence_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.briefings.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.executiveBriefings}</h3>
          <ul className="space-y-2">
            {dashboard.briefings.map((briefing) => (
              <BriefingRow key={briefing.id ?? briefing.briefing_key} briefing={briefing} />
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.memory_entries.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.executiveMemory}</h3>
          <ul className="space-y-2">
            {dashboard.memory_entries.map((entry) => (
              <MemoryRow key={entry.id ?? entry.memory_key} entry={entry} />
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.decision_support_meta.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.decisionSupport}</h3>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {dashboard.decision_support_meta.map((item) => (
              <li key={String(item.key)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                {String(item.label ?? item.key)}
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link href="/app/assistant/decisions" className="text-xs text-indigo-700 hover:underline">
              {labels.personalDecisionSupport}
            </Link>
            <Link href="/app/organizational-decision-support-engine" className="text-xs text-indigo-700 hover:underline">
              {labels.organizationalDecisionSupport}
            </Link>
          </div>
        </section>
      ) : null}

      {dashboard.health_snapshots.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.orgHealth}</h3>
          <ul className="grid gap-2 sm:grid-cols-2">
            {dashboard.health_snapshots.map((snapshot) => (
              <HealthRow key={snapshot.id ?? snapshot.indicator_key} snapshot={snapshot} />
            ))}
          </ul>
          <Link href="/app/organizational-health-engine" className="mt-2 inline-block text-xs text-indigo-700 hover:underline">
            {labels.organizationalHealthLink}
          </Link>
        </section>
      ) : null}

      {dashboard.priority_items.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.priorityAlignment}</h3>
          <ul className="space-y-2">
            {dashboard.priority_items.map((item) => (
              <PriorityRow key={item.id ?? item.priority_key} item={item} />
            ))}
          </ul>
          <Link href="/app/strategic-alignment-engine" className="mt-2 inline-block text-xs text-indigo-700 hover:underline">
            {labels.strategicAlignmentLink}
          </Link>
        </section>
      ) : null}

      {dashboard.companion_supports.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.executiveCompanion}</h3>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {dashboard.companion_supports.map((support) => (
              <li key={String(support.key)} className="rounded-lg border border-indigo-100 px-3 py-2 text-sm">
                {String(support.label ?? support.key)}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {adaptationExamples.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.companionAdaptation}</h3>
          <ul className="space-y-2">
            {adaptationExamples.map((example) => (
              <li key={example.key ?? example.prompt} className="rounded-lg border border-indigo-100 bg-indigo-50/30 px-3 py-2 text-sm">
                <span className="font-medium">
                  {example.emoji ? `${example.emoji} ` : ""}
                  {example.prompt}
                </span>
                {example.consideration ? (
                  <p className="mt-1 text-xs text-gray-600">{example.consideration}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.risk_signals.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.riskVisibility}</h3>
          <ul className="space-y-2">
            {dashboard.risk_signals.map((signal) => (
              <SignalRow key={signal.id ?? signal.signal_key} signal={signal} />
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.opportunity_signals.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.opportunityIntelligence}</h3>
          <ul className="space-y-2">
            {dashboard.opportunity_signals.map((signal) => (
              <SignalRow key={signal.id ?? signal.signal_key} signal={signal} />
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.communication_support_types.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.communicationSupport}</h3>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {dashboard.communication_support_types.map((type) => (
              <li key={String(type.key)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                {String(type.label ?? type.key)}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {limitationRules.length ? (
        <section className="rounded-lg border border-amber-200 bg-amber-50/50 px-4 py-3">
          <h3 className="text-sm font-semibold text-amber-900">{labels.companionLimitations}</h3>
          <ul className="mt-2 space-y-1">
            {limitationRules.map((rule) => (
              <li key={String(rule.key)} className="text-sm text-amber-900">
                {String(rule.label ?? rule.key)}
                {rule.description ? <span className="text-xs text-amber-800"> — {String(rule.description)}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.self_love_leadership.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.selfLoveLeadership}</h3>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {dashboard.self_love_leadership.map((item) => (
              <li key={String(item.key)} className="rounded-lg border border-rose-100 bg-rose-50/30 px-3 py-2 text-sm">
                {String(item.label ?? item.key)}
              </li>
            ))}
          </ul>
          <Link href="/app/self-love-engine" className="mt-2 inline-block text-xs text-indigo-700 hover:underline">
            {labels.selfLoveLink}
          </Link>
        </section>
      ) : null}

      <CrossLinkGrid links={dashboard.integration_links} title={labels.crossLinks} />

      {dashboard.executive_intelligence_success_criteria?.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.successCriteria}</h3>
          <div className="space-y-2">
            {dashboard.executive_intelligence_success_criteria.map((criterion) => (
              <SuccessCriterionRow
                key={criterion.key ?? criterion.label}
                criterion={criterion}
                metLabel={labels.criterionMet}
                pendingLabel={labels.criterionPending}
              />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.executive_intelligence_privacy_note ? (
        <p className="text-xs italic text-gray-500">{dashboard.executive_intelligence_privacy_note}</p>
      ) : null}
    </div>
  );
}
