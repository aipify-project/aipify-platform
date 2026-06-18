"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  hasCommitmentPhrase,
  parseCommitmentDetection,
  parseCompanionMemoryCenter,
  parseMemoryCenterAction,
  type CompanionMemoryCenter,
  type CompanionMemoryCenterLabels,
  type MemoryCenterItem,
} from "@/lib/companion-memory-center";
import { MemoryStatusBadge } from "./MemoryStatusBadge";

type CompanionMemoryCenterPanelProps = {
  labels: CompanionMemoryCenterLabels;
};

function formatWhen(value?: string | null) {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function MemoryItemCard({
  item,
  labels,
  busy,
  onAction,
}: {
  item: MemoryCenterItem;
  labels: CompanionMemoryCenterLabels;
  busy: boolean;
  onAction: (item: MemoryCenterItem, action: string) => void;
}) {
  const categoryLabel =
    item.memoryCategory && item.memoryCategory in labels.categories
      ? labels.categories[item.memoryCategory as keyof typeof labels.categories]
      : item.memoryCategory;

  return (
    <li className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-medium text-zinc-900">{item.title}</p>
          {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
          {item.suggestedAction ? (
            <p className="mt-2 text-sm text-indigo-700">
              <span className="font-medium">{labels.suggestions.suggestedAction}:</span> {item.suggestedAction}
            </p>
          ) : null}
        </div>
        <MemoryStatusBadge statusKey={item.statusKey} labels={labels.status} />
      </div>

      <dl className="mt-3 grid gap-1 text-xs text-zinc-500 sm:grid-cols-2">
        <div>
          <dt className="inline font-medium text-zinc-600">{labels.governance.source}: </dt>
          <dd className="inline">{item.source}</dd>
        </div>
        <div>
          <dt className="inline font-medium text-zinc-600">{labels.governance.owner}: </dt>
          <dd className="inline">{item.owner}</dd>
        </div>
        <div>
          <dt className="inline font-medium text-zinc-600">{labels.governance.created}: </dt>
          <dd className="inline">{formatWhen(item.createdAt)}</dd>
        </div>
        <div>
          <dt className="inline font-medium text-zinc-600">{labels.governance.lastActivity}: </dt>
          <dd className="inline">{formatWhen(item.lastActivityAt)}</dd>
        </div>
        {categoryLabel ? (
          <div>
            <dt className="inline font-medium text-zinc-600">{labels.governance.status}: </dt>
            <dd className="inline">{categoryLabel}</dd>
          </div>
        ) : null}
        {item.dueAt ? (
          <div>
            <dt className="inline font-medium text-zinc-600">{labels.governance.dueDate}: </dt>
            <dd className="inline">{formatWhen(item.dueAt)}</dd>
          </div>
        ) : null}
      </dl>

      {item.sectionKey !== "archived" ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => onAction(item, "complete")}
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {labels.actions.complete}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onAction(item, "snooze")}
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
          >
            {labels.actions.snooze}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onAction(item, "archive")}
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
          >
            {labels.actions.archive}
          </button>
        </div>
      ) : null}
    </li>
  );
}

function SectionBlock({
  title,
  items,
  labels,
  busy,
  onAction,
  empty,
}: {
  title: string;
  items: MemoryCenterItem[];
  labels: CompanionMemoryCenterLabels;
  busy: boolean;
  onAction: (item: MemoryCenterItem, action: string) => void;
  empty: string;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
        <span className="text-sm text-zinc-500">{items.length}</span>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-zinc-500">{empty}</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <MemoryItemCard key={`${item.itemType}-${item.id}`} item={item} labels={labels} busy={busy} onAction={onAction} />
          ))}
        </ul>
      )}
    </section>
  );
}

export function CompanionMemoryCenterPanel({ labels }: CompanionMemoryCenterPanelProps) {
  const [center, setCenter] = useState<CompanionMemoryCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [detectText, setDetectText] = useState("");
  const [detectResult, setDetectResult] = useState<string>("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/companion/memory-center");
    if (res.ok) {
      setCenter(parseCompanionMemoryCenter(await res.json()));
    } else {
      setCenter(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const refresh = async () => {
    setBusy(true);
    await load();
    setBusy(false);
  };

  const runDetect = async () => {
    if (!detectText.trim()) return;
    setBusy(true);
    setDetectResult("");
    const res = await fetch("/api/companion/memory-center", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "detect", text: detectText.trim() }),
    });
    if (res.ok) {
      const parsed = parseCommitmentDetection(await res.json());
      if (parsed.detected) {
        setDetectResult(labels.detectFound);
      } else {
        setDetectResult(labels.detectNotFound);
      }
    }
    setBusy(false);
  };

  const saveDetected = async () => {
    if (!detectText.trim()) return;
    setBusy(true);
    const detectRes = await fetch("/api/companion/memory-center", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "detect", text: detectText.trim() }),
    });
    if (detectRes.ok) {
      const parsed = parseCommitmentDetection(await detectRes.json());
      if (parsed.detected) {
        await fetch("/api/companion/memory-center", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "create",
            payload: {
              title: parsed.title ?? detectText.trim(),
              summary: parsed.summary ?? detectText.trim(),
              memory_category: parsed.memoryCategory ?? "personal",
              section_key: parsed.sectionKey ?? "personal_reminders",
              suggested_action: parsed.suggestedAction ?? "",
              detection_phrase: detectText.trim(),
            },
          }),
        });
        setDetectText("");
        setDetectResult("");
        await load();
      }
    }
    setBusy(false);
  };

  const handleAction = async (item: MemoryCenterItem, action: string) => {
    setBusy(true);
    const res = await fetch("/api/companion/memory-center", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "manage",
        item_type: item.itemType,
        item_id: item.id,
        manage_action: action,
      }),
    });
    const result = parseMemoryCenterAction(await res.json());
    if (result.ok) await load();
    setBusy(false);
  };

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.title}</span>
      </div>
    );
  }

  if (!center?.found) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <p className="font-medium">{labels.accessDenied}</p>
        {center?.error ? <p className="mt-2 text-sm">{center.error}</p> : null}
      </div>
    );
  }

  const sectionBlocks = [
    { key: "personal" as const, title: labels.sections.personalReminders, items: center.sections.personalReminders },
    { key: "business" as const, title: labels.sections.businessReminders, items: center.sections.businessReminders },
    { key: "followUps" as const, title: labels.sections.followUps, items: center.sections.followUps },
    { key: "scheduled" as const, title: labels.sections.scheduledActions, items: center.sections.scheduledActions },
    { key: "archived" as const, title: labels.sections.archivedMemories, items: center.sections.archivedMemories },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-600">{labels.philosophy}</p>
          {center.privacyNote ? <p className="mt-2 text-xs text-zinc-500">{center.privacyNote}</p> : null}
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() => void refresh()}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
        >
          {labels.refresh}
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-5">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 text-center">
          <p className="text-2xl font-semibold text-zinc-900">{center.statistics.personalCount}</p>
          <p className="text-xs text-zinc-500">{labels.statistics.personal}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 text-center">
          <p className="text-2xl font-semibold text-zinc-900">{center.statistics.businessCount}</p>
          <p className="text-xs text-zinc-500">{labels.statistics.business}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 text-center">
          <p className="text-2xl font-semibold text-zinc-900">{center.statistics.followUpCount}</p>
          <p className="text-xs text-zinc-500">{labels.statistics.followUps}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 text-center">
          <p className="text-2xl font-semibold text-zinc-900">{center.statistics.scheduledCount}</p>
          <p className="text-xs text-zinc-500">{labels.statistics.scheduled}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 text-center">
          <p className="text-2xl font-semibold text-zinc-900">{center.statistics.archivedCount}</p>
          <p className="text-xs text-zinc-500">{labels.statistics.archived}</p>
        </div>
      </div>

      <section className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5">
        <h2 className="text-base font-semibold text-zinc-900">{labels.detectButton}</h2>
        <p className="mt-1 text-sm text-zinc-600">{labels.detectPlaceholder}</p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={detectText}
            onChange={(e) => {
              setDetectText(e.target.value);
              if (hasCommitmentPhrase(e.target.value)) setDetectResult("");
            }}
            placeholder={labels.detectPlaceholder}
            className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
          <button
            type="button"
            disabled={busy || !detectText.trim()}
            onClick={() => void runDetect()}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {labels.detectButton}
          </button>
          {detectResult && detectResult === labels.detectFound ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => void saveDetected()}
              className="rounded-lg border border-indigo-600 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100 disabled:opacity-50"
            >
              {labels.saveCommitment}
            </button>
          ) : null}
        </div>
        {detectResult ? <p className="mt-2 text-sm text-zinc-700">{detectResult}</p> : null}
      </section>

      {center.followUpSuggestions.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.suggestions.title}</h2>
          <ul className="space-y-3">
            {center.followUpSuggestions.map((suggestion, index) => (
              <li key={`${suggestion.title}-${index}`} className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-zinc-900">{suggestion.title}</p>
                    <p className="mt-1 text-sm text-zinc-600">{suggestion.summary}</p>
                    <p className="mt-2 text-sm text-indigo-700">
                      {labels.suggestions.suggestedAction}: {suggestion.suggestedAction}
                    </p>
                    {suggestion.companionPrompt ? (
                      <p className="mt-1 text-sm italic text-zinc-600">
                        {labels.suggestions.companionPrompt}: {suggestion.companionPrompt}
                      </p>
                    ) : null}
                  </div>
                  <MemoryStatusBadge statusKey={suggestion.statusKey} labels={labels.status} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.canExecutive ? (
        <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.executive.title}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            <div className="rounded-lg bg-white p-3 ring-1 ring-zinc-200">
              <p className="text-xl font-semibold text-amber-700">{center.executiveDashboard.overdueCommitments}</p>
              <p className="text-xs text-zinc-600">{labels.executive.overdueCommitments}</p>
            </div>
            <div className="rounded-lg bg-white p-3 ring-1 ring-zinc-200">
              <p className="text-xl font-semibold text-zinc-900">{center.executiveDashboard.openFollowUps}</p>
              <p className="text-xs text-zinc-600">{labels.executive.openFollowUps}</p>
            </div>
            <div className="rounded-lg bg-white p-3 ring-1 ring-zinc-200">
              <p className="text-xl font-semibold text-red-700">{center.executiveDashboard.missedActions}</p>
              <p className="text-xs text-zinc-600">{labels.executive.missedActions}</p>
            </div>
            <div className="rounded-lg bg-white p-3 ring-1 ring-zinc-200">
              <p className="text-xl font-semibold text-indigo-700">{center.executiveDashboard.outstandingApprovals}</p>
              <p className="text-xs text-zinc-600">{labels.executive.outstandingApprovals}</p>
            </div>
          </div>
        </section>
      ) : null}

      {sectionBlocks.map((block) => (
        <SectionBlock
          key={block.key}
          title={block.title}
          items={block.items}
          labels={labels}
          busy={busy}
          onAction={handleAction}
          empty={labels.emptyState}
        />
      ))}

      <div className="flex flex-wrap gap-4 text-sm">
        <Link href="/app/companion/follow-ups" className="text-indigo-700 hover:text-indigo-800">
          {labels.links.followUps}
        </Link>
      </div>
    </div>
  );
}
