"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  HEALTH_LABEL_BADGES,
  MEMORY_EVOLUTION_TABS,
  MEMORY_STATUS_BADGES,
  parseCompanionMemoryEvolutionCenter,
  type CompanionMemoryEvolutionCenter,
  type CompanionMemoryEvolutionLabels,
  type CompanionMemoryEvolutionTab,
  type MemoryItem,
} from "@/lib/customer-companion-memory-evolution";

type Props = {
  labels: CompanionMemoryEvolutionLabels;
  backHref: string;
  initialTab?: CompanionMemoryEvolutionTab;
};

function OverviewCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function MemoryStatusBadge({
  status,
  labels,
}: {
  status?: string;
  labels: CompanionMemoryEvolutionLabels;
}) {
  if (!status) return null;
  const label = labels.memoryStatuses[status] ?? status;
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
        MEMORY_STATUS_BADGES[status] ?? MEMORY_STATUS_BADGES.active
      }`}
    >
      {label}
    </span>
  );
}

function MemoryItemCard({
  item,
  labels,
  busy,
  onApprove,
}: {
  item: MemoryItem;
  labels: CompanionMemoryEvolutionLabels;
  busy: boolean;
  onApprove: (key: string) => void;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-medium text-zinc-900">{item.memory_title}</p>
          {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
        </div>
        <MemoryStatusBadge status={item.memory_status} labels={labels} />
      </div>
      {item.memory_status === "review_required" ? (
        <button
          type="button"
          disabled={busy}
          onClick={() => onApprove(item.memory_key)}
          className="mt-3 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
        >
          {labels.actions.approveMemory}
        </button>
      ) : null}
    </div>
  );
}

function JsonList({ items }: { items: Record<string, unknown>[] }) {
  if (!items.length) return <p className="text-sm text-zinc-500">—</p>;
  return (
    <>
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-sm">
          <p className="font-medium text-zinc-900">
            {String(
              item.memory_title ??
                item.context_title ??
                item.relationship_title ??
                item.session_title ??
                item.department_title ??
                item.decision_title ??
                item.meeting_title ??
                item.event_key ??
                item.style_title ??
                item.policy_title ??
                item.contribution_title ??
                item.pattern_summary ??
                i
            )}
          </p>
          {(item.summary ?? item.outcome_summary ?? item.reason_summary ?? item.policy_body) ? (
            <p className="mt-1 text-zinc-600">
              {String(item.summary ?? item.outcome_summary ?? item.reason_summary ?? item.policy_body)}
            </p>
          ) : null}
        </div>
      ))}
    </>
  );
}

export function CompanionMemoryEvolutionPanel({
  labels,
  backHref,
  initialTab = "overview",
}: Props) {
  const [center, setCenter] = useState<CompanionMemoryEvolutionCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<CompanionMemoryEvolutionTab>(initialTab);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/companion-memory-evolution");
    if (res.ok) setCenter(parseCompanionMemoryEvolutionCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  const runAction = useCallback(
    async (action_type: string, payload: Record<string, unknown> = {}) => {
      setBusy(true);
      try {
        const res = await fetch("/api/app/companion-memory-evolution/action", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action_type, ...payload }),
        });
        if (res.ok) await load();
      } finally {
        setBusy(false);
      }
    },
    [load]
  );

  if (loading && !center) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found) {
    return <p className="p-6 text-sm text-red-600">{labels.emptyState}</p>;
  }

  const overview = center.overview ?? {};
  const personal = center.personal_memory ?? [];
  const organization = center.organization_memory ?? [];
  const workingStyle = (center.preferences?.working_style as Record<string, unknown>[]) ?? [];
  const contextSnapshots = (center.context?.context_snapshots as Record<string, unknown>[]) ?? [];
  const conversationContext = (center.context?.conversation_context as Record<string, unknown>[]) ?? [];
  const relationshipMemory = (center.context?.relationship_memory as Record<string, unknown>[]) ?? [];
  const evolutionEvents = (center.learning?.memory_evolution as Record<string, unknown>[]) ?? [];
  const departmentMemory = (center.learning?.department_memory as Record<string, unknown>[]) ?? [];
  const decisionMemory = (center.learning?.decision_memory as Record<string, unknown>[]) ?? [];
  const meetingMemory = (center.learning?.meeting_memory as Record<string, unknown>[]) ?? [];
  const packIntegration = (center.learning?.business_pack_integration as Record<string, unknown>[]) ?? [];
  const governancePolicies = (center.memory_governance?.policies as Record<string, unknown>[]) ?? [];
  const advisorPrompts = (center.companion_context_advisor?.advisor_prompts as string[]) ?? [];
  const healthLabel = String(center.memory_health?.health_label ?? center.executive_dashboard?.health_label ?? "healthy");

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          ← {labels.back}
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm text-zinc-800">
          {center.principle}
        </p>
        {center.philosophy ? <p className="mt-3 text-sm text-zinc-600">{center.philosophy}</p> : null}
        <p className="mt-3">
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
              HEALTH_LABEL_BADGES[healthLabel] ?? HEALTH_LABEL_BADGES.healthy
            }`}
          >
            {healthLabel.replace(/_/g, " ")}
          </span>
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={() => void runAction("refresh_health_score")}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {labels.actions.refreshHealth}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => void runAction("export_memory")}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 disabled:opacity-50"
        >
          {labels.actions.exportMemory}
        </button>
        <Link
          href="/app/assistant/memory"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
        >
          {labels.actions.openAssistantMemory}
        </Link>
        <Link
          href="/app/companion/context"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
        >
          {labels.actions.openContext}
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {MEMORY_EVOLUTION_TABS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              tab === key ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            {labels.tabs[key]}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <OverviewCard label={labels.overview.memoryItems} value={Number(overview.memory_items ?? 0)} />
          <OverviewCard label={labels.overview.activeMemory} value={Number(overview.active_memory ?? 0)} />
          <OverviewCard label={labels.overview.reviewRequired} value={Number(overview.review_required ?? 0)} />
          <OverviewCard label={labels.overview.contextSnapshots} value={Number(overview.context_snapshots ?? 0)} />
          <OverviewCard label={labels.overview.relationshipEntries} value={Number(overview.relationship_entries ?? 0)} />
          <OverviewCard label={labels.overview.evolutionEvents} value={Number(overview.evolution_events ?? 0)} />
          <OverviewCard label={labels.overview.departmentMemory} value={Number(overview.department_memory ?? 0)} />
          <OverviewCard label={labels.overview.memoryHealthScore} value={Number(overview.memory_health_score ?? 0)} />
        </dl>
      ) : null}

      {tab === "personal_memory" ? (
        <section className="space-y-3">
          {personal.map((item) => (
            <MemoryItemCard
              key={item.memory_key}
              item={item}
              labels={labels}
              busy={busy}
              onApprove={(key) => void runAction("approve_memory", { memory_key: key })}
            />
          ))}
        </section>
      ) : null}

      {tab === "organization_memory" ? (
        <section className="space-y-3">
          {organization.map((item) => (
            <MemoryItemCard
              key={item.memory_key}
              item={item}
              labels={labels}
              busy={busy}
              onApprove={(key) => void runAction("approve_memory", { memory_key: key })}
            />
          ))}
        </section>
      ) : null}

      {tab === "preferences" ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-zinc-900">{labels.sections.workingStyle}</h2>
          <div className="mt-4">
            <JsonList items={workingStyle} />
          </div>
        </section>
      ) : null}

      {tab === "context" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-zinc-900">{labels.sections.contextSnapshots}</h2>
            <div className="mt-4">
              <JsonList items={contextSnapshots} />
            </div>
          </section>
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-zinc-900">{labels.sections.conversationContext}</h2>
            <div className="mt-4">
              <JsonList items={conversationContext} />
            </div>
          </section>
          <section className="col-span-full rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-zinc-900">{labels.sections.relationshipMemory}</h2>
            <div className="mt-4">
              <JsonList items={relationshipMemory} />
            </div>
          </section>
        </div>
      ) : null}

      {tab === "learning" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-zinc-900">{labels.sections.memoryEvolution}</h2>
            <div className="mt-4">
              <JsonList items={evolutionEvents} />
            </div>
          </section>
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-zinc-900">{labels.sections.departmentMemory}</h2>
            <div className="mt-4">
              <JsonList items={departmentMemory} />
            </div>
          </section>
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-zinc-900">{labels.sections.decisionMemory}</h2>
            <div className="mt-4">
              <JsonList items={decisionMemory} />
            </div>
          </section>
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-zinc-900">{labels.sections.meetingMemory}</h2>
            <div className="mt-4">
              <JsonList items={meetingMemory} />
            </div>
          </section>
          <section className="col-span-full rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-zinc-900">{labels.sections.businessPackIntegration}</h2>
            <div className="mt-4">
              <JsonList items={packIntegration} />
            </div>
          </section>
          <section className="col-span-full rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-zinc-900">{labels.sections.contextAdvisor}</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-600">
              {advisorPrompts.map((prompt) => (
                <li key={prompt}>{prompt}</li>
              ))}
            </ul>
          </section>
        </div>
      ) : null}

      {tab === "memory_governance" ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-zinc-600">{String(center.memory_governance?.governance_note ?? "")}</p>
          <div className="mt-4">
            <JsonList items={governancePolicies} />
          </div>
        </section>
      ) : null}

      {tab === "executive" ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(center.executive_dashboard ?? {}).map(([key, value]) => (
            <OverviewCard key={key} label={key.replace(/_/g, " ")} value={String(value)} />
          ))}
        </section>
      ) : null}

      {tab === "reports" ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm text-sm text-zinc-600">
          <pre className="overflow-x-auto whitespace-pre-wrap">{JSON.stringify(center.reports ?? {}, null, 2)}</pre>
        </section>
      ) : null}

      {center.audit_recent?.length ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-zinc-900">{labels.sections.audit}</h2>
          <ul className="mt-3 space-y-2 text-sm text-zinc-600">
            {center.audit_recent.map((entry, i) => (
              <li key={`${entry.event_type}-${i}`}>{entry.summary}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
