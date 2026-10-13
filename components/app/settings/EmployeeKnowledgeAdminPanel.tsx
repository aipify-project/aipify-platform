"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import { AppVisualClasses } from "@/lib/design/app-visual-system";
import {
  canPersistEmployeeKnowledgeDraft,
  parseEmployeeAnswer,
  parseEmployeeKnowledgeCenter,
  parseEmployeeKnowledgeItemRow,
  recentKnowledgeItems,
  sortKnowledgeItemsNewestFirst,
  statusForItem,
  toneForItemStatus,
  type EmployeeAnswer,
  type EmployeeKnowledgeCenter,
  type EmployeeKnowledgeItemRow,
  type EmployeeKnowledgeLabels,
  type EkeSettings,
} from "@/lib/employee-knowledge-engine";

type WorkspaceSection = "create" | "articles" | "pending" | "gaps" | "ask" | "settings";

type EmployeeKnowledgeAdminPanelProps = {
  labels: EmployeeKnowledgeLabels;
  /** Inside AppHubShell — omit page chrome. */
  embedded?: boolean;
  initialSection?: WorkspaceSection;
};

function StatusChip({
  tone,
  label,
}: {
  tone: "positive" | "warning" | "critical" | "neutral";
  label: string;
}) {
  const styles = {
    positive: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    warning: "bg-amber-50 text-amber-900 ring-amber-200",
    critical: "bg-rose-50 text-rose-800 ring-rose-200",
    neutral: "bg-slate-50 text-slate-700 ring-slate-200",
  } as const;
  const icons = { positive: "✓", warning: "!", critical: "!", neutral: "·" } as const;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${styles[tone]}`}
    >
      <span aria-hidden>{icons[tone]}</span>
      {label}
    </span>
  );
}

function formatWhen(value: string | null, locale?: string): string {
  if (!value) return "—";
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return "—";
  try {
    return new Intl.DateTimeFormat(locale || undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(parsed));
  } catch {
    return "—";
  }
}

function SectionNavButton({
  active,
  title,
  meta,
  onClick,
}: {
  active: boolean;
  title: string;
  meta: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[5.25rem] flex-col items-start rounded-2xl border px-4 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus,#7C3AED)] ${
        active
          ? "border-[var(--app-border-accent,#CFC4FF)] bg-[var(--app-primary-soft,#EEEAFE)] shadow-sm"
          : "border-[var(--app-border,#E5E7F0)] bg-[var(--app-card,#fff)] hover:border-[var(--app-border-accent,#CFC4FF)]"
      }`}
      aria-current={active ? "true" : undefined}
    >
      <span className="text-base font-semibold text-[var(--app-text,#202336)]">{title}</span>
      <span className="mt-1 text-sm text-[var(--app-text-muted,#5C6275)]">{meta}</span>
    </button>
  );
}

export function EmployeeKnowledgeAdminPanel({
  labels,
  embedded = false,
  initialSection = "create",
}: EmployeeKnowledgeAdminPanelProps) {
  const [center, setCenter] = useState<EmployeeKnowledgeCenter | null>(null);
  const [settings, setSettings] = useState<EkeSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [saved, setSaved] = useState(false);
  const [section, setSection] = useState<WorkspaceSection>(initialSection);
  const [question, setQuestion] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [articleFilter, setArticleFilter] = useState<"all" | "draft" | "approved">("all");
  const [answer, setAnswer] = useState<EmployeeAnswer | null>(null);
  const [searchResults, setSearchResults] = useState<Array<Record<string, unknown>>>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("operational_procedures");
  const [newContent, setNewContent] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    setLoadError(false);
    const res = await fetch("/api/employee-knowledge");
    if (res.ok) {
      const data = parseEmployeeKnowledgeCenter(await res.json());
      setCenter(data);
      if (data.settings) setSettings(data.settings);
    } else {
      setLoadError(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const items: EmployeeKnowledgeItemRow[] = useMemo(() => {
    const rows = (center?.knowledge_items ?? [])
      .map((raw) => parseEmployeeKnowledgeItemRow(raw as Record<string, unknown>))
      .filter((row): row is EmployeeKnowledgeItemRow => row !== null);
    const pendingOnly = (center?.pending_approval ?? [])
      .map((raw) => parseEmployeeKnowledgeItemRow(raw as Record<string, unknown>))
      .filter((row): row is EmployeeKnowledgeItemRow => row !== null);
    const byId = new Map<string, EmployeeKnowledgeItemRow>();
    for (const row of [...rows, ...pendingOnly]) byId.set(row.id, row);
    return sortKnowledgeItemsNewestFirst([...byId.values()]);
  }, [center]);

  const recent = useMemo(() => recentKnowledgeItems(items, 4), [items]);
  const pending = useMemo(() => items.filter((i) => !i.approved), [items]);
  const filteredArticles = useMemo(() => {
    if (articleFilter === "approved") return items.filter((i) => i.approved);
    if (articleFilter === "draft") return items.filter((i) => !i.approved);
    return items;
  }, [items, articleFilter]);

  async function saveSettings() {
    if (!settings) return;
    await fetch("/api/employee-knowledge", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
    await refresh();
  }

  async function runAsk() {
    const res = await fetch("/api/employee-knowledge/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    setAnswer(parseEmployeeAnswer(await res.json()));
  }

  async function runSearch() {
    const res = await fetch("/api/employee-knowledge/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: searchQuery }),
    });
    const data = (await res.json()) as { results?: Array<Record<string, unknown>> };
    setSearchResults(data.results ?? []);
  }

  async function createItem(sendForApproval: boolean) {
    setFormError(null);
    setFormSuccess(false);
    const gate = canPersistEmployeeKnowledgeDraft({ title: newTitle, content: newContent });
    if (!gate.ok) {
      setFormError(labels.workspace.emptyAnswerBlocked);
      return;
    }
    setSaving(true);
    const res = await fetch("/api/employee-knowledge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create_item",
        category: newCategory,
        title: newTitle.trim(),
        content: newContent.trim(),
        // Core: require_admin_approval forces approved=false unless admin sets true.
        // "Send for approval" still creates pending item — never auto-publishes.
        approved: false,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      setFormError(labels.workspace.createError);
      return;
    }
    setNewTitle("");
    setNewContent("");
    setFormSuccess(true);
    await refresh();
    if (sendForApproval) setSection("pending");
    else setSection("articles");
  }

  async function approveItem(id: string) {
    await fetch("/api/employee-knowledge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approve_item", item_id: id }),
    });
    await refresh();
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  if (loadError) {
    return (
      <div className="space-y-4">
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {labels.workspace.loadError}
        </p>
        <button
          type="button"
          onClick={() => {
            setLoading(true);
            void refresh();
          }}
          className="rounded-xl bg-[var(--app-primary,#7357E8)] px-4 py-2.5 text-sm font-semibold text-white"
        >
          {labels.workspace.retry}
        </button>
      </div>
    );
  }

  const health = center?.health;
  const gaps = center?.knowledge_gaps ?? [];
  const w = labels.workspace;

  return (
    <div className={embedded ? "w-full space-y-6" : "mx-auto max-w-6xl space-y-6 p-6"}>
      {!embedded ? (
        <div>
          <Link href="/app/settings" className="text-sm text-indigo-600 hover:underline">
            ← {labels.back}
          </Link>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--app-text,#202336)]">
            {labels.title}
          </h1>
          <p className="mt-2 text-base text-[var(--app-text-muted,#5C6275)]">{labels.subtitle}</p>
          <p className="mt-1 text-sm font-medium text-[var(--app-primary,#7357E8)]">{labels.youControl}</p>
        </div>
      ) : null}

      {center?.privacy_note ? (
        <p className={`${AppVisualClasses.card} text-sm text-[var(--app-text,#202336)]`}>
          {center.privacy_note}
        </p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SectionNavButton
          active={section === "create"}
          title={w.createFaq}
          meta={recent.length ? `${recent.length}/4` : w.noRecent}
          onClick={() => setSection("create")}
        />
        <SectionNavButton
          active={section === "articles"}
          title={w.articles}
          meta={String(items.length)}
          onClick={() => setSection("articles")}
        />
        <SectionNavButton
          active={section === "pending"}
          title={w.pendingReview}
          meta={String(pending.length)}
          onClick={() => setSection("pending")}
        />
        <SectionNavButton
          active={section === "gaps"}
          title={w.gaps}
          meta={String(gaps.length)}
          onClick={() => setSection("gaps")}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <SectionNavButton
          active={section === "ask"}
          title={w.askTest}
          meta={labels.sections.search}
          onClick={() => setSection("ask")}
        />
        <SectionNavButton
          active={section === "settings"}
          title={labels.sections.settings}
          meta={health ? `${health.health_score}` : "—"}
          onClick={() => setSection("settings")}
        />
        <Link
          href="/app/settings/business-dna"
          className="flex min-h-[5.25rem] flex-col items-start rounded-2xl border border-[var(--app-border,#E5E7F0)] bg-[var(--app-card,#fff)] px-4 py-3 text-left transition hover:border-[var(--app-border-accent,#CFC4FF)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus,#7C3AED)]"
        >
          <span className="text-base font-semibold text-[var(--app-text,#202336)]">
            {labels.viewBusinessDna}
          </span>
          <span className="mt-1 text-sm text-[var(--app-text-muted,#5C6275)]">{labels.privacy}</span>
        </Link>
      </div>

      {/* Honest Core gap — no fake multilingual controls */}
      <section className={`${AppVisualClasses.card} border-amber-200 bg-amber-50/50`}>
        <h2 className="text-lg font-semibold text-[var(--app-text,#202336)]">{w.multilingualGapTitle}</h2>
        <p className="mt-2 text-base leading-relaxed text-[var(--app-text-muted,#5C6275)]">
          {w.multilingualGapBody}
        </p>
        <div className="mt-3">
          <StatusChip tone="warning" label={w.statusPending} />
        </div>
      </section>

      {section === "create" ? (
        <section className={`${AppVisualClasses.card} space-y-5`}>
          <h2 className="text-xl font-semibold text-[var(--app-text,#202336)]">{w.createFaq}</h2>
          <div className="space-y-3">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-[var(--app-text,#202336)]">{w.questionLabel}</span>
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder={labels.create.title}
                className="w-full rounded-xl border border-[var(--app-border,#E5E7F0)] bg-white px-4 py-3 text-base text-[var(--app-text,#202336)]"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-[var(--app-text,#202336)]">{labels.create.category}</span>
              <div className="flex flex-wrap gap-2">
                {(center?.categories ?? []).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setNewCategory(c.id)}
                    className={`rounded-xl px-3 py-2 text-sm font-medium ring-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus,#7C3AED)] ${
                      newCategory === c.id
                        ? "bg-[var(--app-primary,#7357E8)] text-white ring-[var(--app-primary,#7357E8)]"
                        : "bg-white text-[var(--app-text,#202336)] ring-[var(--app-border,#E5E7F0)]"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-[var(--app-text,#202336)]">{w.answerLabel}</span>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder={labels.create.content}
                rows={5}
                className="w-full rounded-xl border border-[var(--app-border,#E5E7F0)] bg-white px-4 py-3 text-base text-[var(--app-text,#202336)]"
              />
            </label>
            {formError ? (
              <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800" role="alert">
                {formError}
              </p>
            ) : null}
            {formSuccess ? (
              <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                {w.createSuccess}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                disabled={saving}
                onClick={() => void createItem(false)}
                className="rounded-xl bg-[var(--app-primary,#7357E8)] px-5 py-3 text-base font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-60"
              >
                {w.saveDraft}
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => void createItem(true)}
                className="rounded-xl bg-amber-600 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-amber-700 disabled:opacity-60"
              >
                {w.sendForApproval}
              </button>
            </div>
            <StatusChip tone="warning" label={w.statusDraft} />
          </div>

          <div className="border-t border-[var(--app-border,#E5E7F0)] pt-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-semibold text-[var(--app-text,#202336)]">{w.recentTitle}</h3>
              <button
                type="button"
                onClick={() => setSection("articles")}
                className="text-sm font-semibold text-[var(--app-primary,#7357E8)] hover:underline"
              >
                {w.seeAllArticles}
              </button>
            </div>
            {recent.length === 0 ? (
              <p className="mt-3 text-sm text-[var(--app-text-muted,#5C6275)]">{w.noRecent}</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {recent.map((item) => {
                  const status = statusForItem(item);
                  return (
                    <li
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--app-border,#E5E7F0)] bg-[var(--app-soft-surface,#F2F3F9)] px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-base font-medium text-[var(--app-text,#202336)]">
                          {item.title}
                        </p>
                        <p className="text-xs text-[var(--app-text-muted,#5C6275)]">
                          {w.updatedLabel}: {formatWhen(item.updatedAt ?? item.createdAt)}
                        </p>
                      </div>
                      <StatusChip
                        tone={toneForItemStatus(status)}
                        label={status === "approved" ? w.statusApproved : w.statusPending}
                      />
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      ) : null}

      {section === "articles" ? (
        <section className={`${AppVisualClasses.card} space-y-4`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-[var(--app-text,#202336)]">{w.articles}</h2>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["all", w.filterAll],
                  ["draft", w.filterDraft],
                  ["approved", w.filterApproved],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setArticleFilter(key)}
                  className={`rounded-xl px-3 py-2 text-sm font-medium ring-1 ${
                    articleFilter === key
                      ? "bg-[var(--app-primary,#7357E8)] text-white ring-[var(--app-primary,#7357E8)]"
                      : "bg-white text-[var(--app-text,#202336)] ring-[var(--app-border,#E5E7F0)]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          {filteredArticles.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--app-border,#E5E7F0)] px-6 py-10">
              <h3 className="text-lg font-semibold text-[var(--app-text,#202336)]">{w.emptyArticlesTitle}</h3>
              <p className="mt-2 text-base text-[var(--app-text-muted,#5C6275)]">{w.emptyArticlesBody}</p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {filteredArticles.map((item) => {
                const status = statusForItem(item);
                return (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-[var(--app-border,#E5E7F0)] bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold text-[var(--app-text,#202336)]">{item.title}</h3>
                      <StatusChip
                        tone={toneForItemStatus(status)}
                        label={status === "approved" ? w.statusApproved : w.statusPending}
                      />
                    </div>
                    <p className="mt-2 line-clamp-3 text-sm text-[var(--app-text-muted,#5C6275)]">
                      {item.content || "—"}
                    </p>
                    <p className="mt-3 text-xs text-[var(--app-text-muted,#5C6275)]">
                      {item.category} · {w.updatedLabel}: {formatWhen(item.updatedAt ?? item.createdAt)}
                    </p>
                    <p className="mt-2 text-xs text-[var(--app-text-muted,#5C6275)]">{w.editUnavailable}</p>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      ) : null}

      {section === "pending" ? (
        <section className={`${AppVisualClasses.card} space-y-4`}>
          <h2 className="text-xl font-semibold text-[var(--app-text,#202336)]">{w.pendingReview}</h2>
          {pending.length === 0 ? (
            <p className="text-sm text-[var(--app-text-muted,#5C6275)]">{labels.empty}</p>
          ) : (
            <ul className="space-y-3">
              {pending.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50/60 px-4 py-4"
                >
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-[var(--app-text,#202336)]">{item.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-[var(--app-text-muted,#5C6275)]">
                      {item.content}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void approveItem(item.id)}
                    className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    {w.approve}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {section === "gaps" ? (
        <section className={`${AppVisualClasses.card} space-y-4`}>
          <h2 className="text-xl font-semibold text-[var(--app-text,#202336)]">{w.gaps}</h2>
          <ul className="space-y-2 text-sm">
            {gaps.length === 0 ? (
              <li className="text-[var(--app-text-muted,#5C6275)]">{labels.empty}</li>
            ) : (
              gaps.map((g) => (
                <li
                  key={String((g as Record<string, unknown>).id)}
                  className="rounded-xl border border-[var(--app-border,#E5E7F0)] bg-[var(--app-soft-surface,#F2F3F9)] px-4 py-3"
                >
                  <span className="font-medium">{String((g as Record<string, unknown>).category)}</span>{" "}
                  ({String((g as Record<string, unknown>).occurrence_count)}×) —{" "}
                  {String((g as Record<string, unknown>).suggestion)}
                </li>
              ))
            )}
          </ul>
        </section>
      ) : null}

      {section === "ask" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <section className={`${AppVisualClasses.card} space-y-3`}>
            <h2 className="text-xl font-semibold text-[var(--app-text,#202336)]">{w.askTest}</h2>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              placeholder={labels.ask.placeholder}
              className="w-full rounded-xl border border-[var(--app-border,#E5E7F0)] px-4 py-3 text-base"
            />
            <button
              type="button"
              onClick={() => void runAsk()}
              className="rounded-xl bg-[var(--app-primary,#7357E8)] px-4 py-2.5 text-sm font-semibold text-white"
            >
              {labels.ask.run}
            </button>
            {answer?.answer ? (
              <div className="rounded-xl bg-[var(--app-soft-surface,#F2F3F9)] p-4 text-sm">
                <p className="font-medium">{answer.title}</p>
                <p className="mt-2 text-[var(--app-text,#202336)]">{answer.answer}</p>
                <p className="mt-2 text-xs text-[var(--app-text-muted,#5C6275)]">
                  {labels.ask.confidence}: {answer.confidence_level} ({answer.confidence_score}%)
                </p>
                {answer.escalate_recommended ? (
                  <p className="mt-1 text-xs text-rose-700">{labels.ask.escalate}</p>
                ) : null}
              </div>
            ) : null}
          </section>
          <section className={`${AppVisualClasses.card} space-y-3`}>
            <h2 className="text-xl font-semibold text-[var(--app-text,#202336)]">{w.searchKnowledge}</h2>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={labels.search.placeholder}
              className="w-full rounded-xl border border-[var(--app-border,#E5E7F0)] px-4 py-3 text-base"
            />
            <button
              type="button"
              onClick={() => void runSearch()}
              className="rounded-xl bg-[var(--app-primary-blue,#5577F2)] px-4 py-2.5 text-sm font-semibold text-white"
            >
              {labels.search.run}
            </button>
            <ul className="space-y-2 text-sm">
              {searchResults.map((r) => (
                <li key={String(r.id)} className="rounded-xl bg-[var(--app-soft-surface,#F2F3F9)] px-3 py-2">
                  {String(r.title)} — {String(r.category)}
                </li>
              ))}
            </ul>
          </section>
        </div>
      ) : null}

      {section === "settings" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <section className={`${AppVisualClasses.card} space-y-3`}>
            <h2 className="text-xl font-semibold text-[var(--app-text,#202336)]">{labels.sections.health}</h2>
            {health ? (
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-4xl font-bold text-[var(--app-text,#202336)]">{health.health_score}</span>
                <StatusChip
                  tone={
                    health.level === "strong"
                      ? "positive"
                      : health.level === "critical"
                        ? "critical"
                        : health.level === "limited"
                          ? "warning"
                          : "neutral"
                  }
                  label={health.health_label}
                />
                {center?.user_role ? (
                  <span className="text-sm text-[var(--app-text-muted,#5C6275)]">
                    {w.roleLabel}: {center.user_role}
                  </span>
                ) : null}
              </div>
            ) : (
              <p className="text-sm text-[var(--app-text-muted,#5C6275)]">{labels.empty}</p>
            )}
          </section>
          {settings ? (
            <section className={`${AppVisualClasses.card} space-y-3`}>
              <h2 className="text-xl font-semibold text-[var(--app-text,#202336)]">{labels.sections.settings}</h2>
              <div className="space-y-3 text-sm">
                {(
                  [
                    ["employee_assistant_enabled", labels.settings.assistant],
                    ["gap_detection_enabled", labels.settings.gapDetection],
                    ["onboarding_enabled", labels.settings.onboarding],
                    ["improvement_loop_enabled", labels.settings.improvementLoop],
                    ["require_admin_approval", labels.settings.adminApproval],
                    ["video_support_enabled", labels.settings.videoSupport],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={Boolean(settings[key])}
                      onChange={(e) => setSettings({ ...settings, [key]: e.target.checked })}
                    />
                    {label}
                  </label>
                ))}
                <button
                  type="button"
                  onClick={() => void saveSettings()}
                  className="rounded-xl bg-[var(--app-primary,#7357E8)] px-4 py-2.5 text-sm font-semibold text-white"
                >
                  {saved ? labels.saved : labels.save}
                </button>
              </div>
            </section>
          ) : null}
          {Array.isArray(center?.ethical_principles) ? (
            <section className={`${AppVisualClasses.card} space-y-2 lg:col-span-2`}>
              <h2 className="text-lg font-semibold text-[var(--app-text,#202336)]">{labels.sections.ethics}</h2>
              <ul className="space-y-1 text-sm text-[var(--app-text-muted,#5C6275)]">
                {center.ethical_principles.map((p, i) => (
                  <li key={i}>· {p}</li>
                ))}
              </ul>
            </section>
          ) : null}
          <section className={`${AppVisualClasses.card} space-y-2 lg:col-span-2`}>
            <h2 className="text-lg font-semibold text-[var(--app-text,#202336)]">{labels.sections.audit}</h2>
            <ul className="space-y-1 text-sm text-[var(--app-text-muted,#5C6275)]">
              {center?.audit_log?.map((a) => (
                <li key={String((a as Record<string, unknown>).id)}>
                  {String((a as Record<string, unknown>).event_type)} —{" "}
                  {formatWhen(String((a as Record<string, unknown>).created_at))}
                </li>
              )) ?? <li>{labels.empty}</li>}
            </ul>
          </section>
        </div>
      ) : null}
    </div>
  );
}
