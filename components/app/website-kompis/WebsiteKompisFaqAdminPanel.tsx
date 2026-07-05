"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { WebsiteKompisFaqPreviewPanel } from "@/components/app/website-kompis/WebsiteKompisFaqPreviewPanel";
import { WebsiteKompisFaqPublishDialog } from "@/components/app/website-kompis/WebsiteKompisFaqPublishDialog";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  WPKF_CONTENT_TYPES,
  WPKF_LOCALES,
  WPKF_STATUSES,
  type WpkfContentType,
  type WpkfStatus,
} from "@/lib/website-kompis-faq/constants";
import type { WebsiteKompisFaqLabels } from "@/lib/website-kompis-faq/labels";
import {
  canPublishWebsiteKompisFaqDraft,
  detectWebsiteKompisFaqRiskyWords,
  isWebsiteKompisFaqEditorValid,
} from "@/lib/website-kompis-faq/safety";
import type {
  WebsiteKompisFaqItem,
  WebsiteKompisFaqUpsertInput,
} from "@/lib/website-kompis-faq/types";

type WebsiteKompisFaqAdminPanelProps = {
  labels: WebsiteKompisFaqLabels;
};

const STATUS_STYLES: Record<WpkfStatus, string> = {
  draft: "bg-slate-100 text-slate-700",
  published: "bg-emerald-100 text-emerald-800",
  archived: "bg-amber-100 text-amber-800",
};

function createEmptyDraft(): WebsiteKompisFaqUpsertInput {
  return {
    itemId: null,
    locale: "no",
    title: "",
    question: "",
    answer: "",
    category: "",
    contentType: "faq",
    publicSafe: false,
    priority: 100,
    tags: [],
    sourceUrl: "",
    validFrom: null,
    validUntil: null,
    lastReviewedAt: null,
  };
}

function itemToDraft(item: WebsiteKompisFaqItem): WebsiteKompisFaqUpsertInput {
  return {
    itemId: item.id,
    installId: item.installId,
    domain: item.domain,
    locale: item.locale,
    title: item.title,
    question: item.question ?? "",
    answer: item.answer,
    category: item.category ?? "",
    contentType: item.contentType,
    publicSafe: item.publicSafe,
    priority: item.priority,
    tags: item.tags,
    sourceUrl: item.sourceUrl ?? "",
    validFrom: item.validFrom,
    validUntil: item.validUntil,
    lastReviewedAt: item.lastReviewedAt,
  };
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return "—";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(parsed));
}

export function WebsiteKompisFaqAdminPanel({ labels }: WebsiteKompisFaqAdminPanelProps) {
  const [items, setItems] = useState<WebsiteKompisFaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [draft, setDraft] = useState<WebsiteKompisFaqUpsertInput>(createEmptyDraft());
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<WpkfStatus | "">("");
  const [localeFilter, setLocaleFilter] = useState("");
  const [contentTypeFilter, setContentTypeFilter] = useState<WpkfContentType | "">("");
  const [searchQuery, setSearchQuery] = useState("");

  const riskyWords = useMemo(
    () =>
      detectWebsiteKompisFaqRiskyWords(
        [draft.title, draft.question ?? "", draft.answer, draft.category ?? ""].join(" "),
      ),
    [draft.answer, draft.category, draft.question, draft.title],
  );

  const canPublish = canPublishWebsiteKompisFaqDraft({
    title: draft.title,
    answer: draft.answer,
    locale: draft.locale,
    contentType: draft.contentType,
    publicSafe: draft.publicSafe,
    status: "draft",
  });

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    setAccessDenied(false);

    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (localeFilter) params.set("locale", localeFilter);
    if (contentTypeFilter) params.set("contentType", contentTypeFilter);
    if (searchQuery.trim()) params.set("query", searchQuery.trim());

    const res = await fetch(`/api/website-kompis/faq?${params.toString()}`);
    if (res.status === 403) {
      setAccessDenied(true);
      setItems([]);
      setLoading(false);
      return;
    }

    const body = (await res.json()) as { items?: WebsiteKompisFaqItem[]; error?: string };
    if (!res.ok) {
      setError(body.error ?? labels.errorGeneric);
      setItems([]);
      setLoading(false);
      return;
    }

    setItems(body.items ?? []);
    setLoading(false);
  }, [contentTypeFilter, labels.errorGeneric, localeFilter, searchQuery, statusFilter]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  function openCreate() {
    setDraft(createEmptyDraft());
    setEditorOpen(true);
    setError(null);
  }

  function openEdit(item: WebsiteKompisFaqItem) {
    setDraft(itemToDraft(item));
    setEditorOpen(true);
    setError(null);
  }

  function closeEditor() {
    setEditorOpen(false);
    setPublishDialogOpen(false);
    setDraft(createEmptyDraft());
  }

  async function saveDraft() {
    if (!isWebsiteKompisFaqEditorValid(draft)) {
      setError(labels.errorGeneric);
      return;
    }

    setBusy(true);
    setError(null);

    const res = await fetch("/api/website-kompis/faq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemId: draft.itemId,
        installId: draft.installId,
        domain: draft.domain,
        locale: draft.locale,
        title: draft.title,
        question: draft.question,
        answer: draft.answer,
        category: draft.category,
        contentType: draft.contentType,
        publicSafe: draft.publicSafe,
        priority: draft.priority,
        tags: draft.tags,
        sourceUrl: draft.sourceUrl,
        validFrom: draft.validFrom,
        validUntil: draft.validUntil,
        lastReviewedAt: draft.lastReviewedAt,
      }),
    });

    const body = (await res.json()) as { id?: string; error?: string };
    if (!res.ok) {
      setError(body.error ?? labels.errorGeneric);
      setBusy(false);
      return;
    }

    if (body.id) {
      setDraft((current) => ({ ...current, itemId: body.id ?? current.itemId }));
    }

    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
    setBusy(false);
    await refresh();
  }

  async function runAction(action: "publish" | "unpublish" | "archive" | "restore", itemId: string) {
    setBusy(true);
    setError(null);

    const res = await fetch(`/api/website-kompis/faq/${itemId}/${action}`, { method: "POST" });
    const body = (await res.json()) as { error?: string };

    if (!res.ok) {
      setError(body.error ?? labels.errorGeneric);
      setBusy(false);
      return;
    }

    setPublishDialogOpen(false);
    setBusy(false);
    closeEditor();
    await refresh();
  }

  async function confirmPublish() {
    if (!draft.itemId) {
      await saveDraft();
    }
    const itemId = draft.itemId;
    if (!itemId) {
      setError(labels.errorGeneric);
      return;
    }
    await runAction("publish", itemId);
  }

  if (loading && items.length === 0 && !editorOpen) {
    return <AipifyLoadingState centered />;
  }

  if (accessDenied) {
    return (
      <PlatformEmptyState
        title={labels.accessDenied}
        message={labels.subtitle}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/app/settings" className="text-sm text-violet-600 hover:underline">
          {labels.back}
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">{labels.title}</h1>
        <p className="mt-1 text-sm text-slate-600">{labels.subtitle}</p>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        {labels.warningBanner}
      </div>

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      {saved ? (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {labels.saved}
        </p>
      ) : null}

      {!editorOpen ? (
        <>
          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid gap-3 md:grid-cols-4">
              <label className="text-sm">
                <span className="mb-1 block text-xs font-medium text-slate-600">
                  {labels.filters.status}
                </span>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as WpkfStatus | "")}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="">{labels.filters.all}</option>
                  {WPKF_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {labels.statuses[status]}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm">
                <span className="mb-1 block text-xs font-medium text-slate-600">
                  {labels.filters.locale}
                </span>
                <select
                  value={localeFilter}
                  onChange={(event) => setLocaleFilter(event.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="">{labels.filters.all}</option>
                  {WPKF_LOCALES.map((locale) => (
                    <option key={locale} value={locale}>
                      {labels.locales[locale]}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm">
                <span className="mb-1 block text-xs font-medium text-slate-600">
                  {labels.filters.contentType}
                </span>
                <select
                  value={contentTypeFilter}
                  onChange={(event) =>
                    setContentTypeFilter(event.target.value as WpkfContentType | "")
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="">{labels.filters.all}</option>
                  {WPKF_CONTENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {labels.contentTypes[type]}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm">
                <span className="mb-1 block text-xs font-medium text-slate-600">
                  {labels.filters.search}
                </span>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
            </div>
          </section>

          {items.length === 0 ? (
            <PlatformEmptyState
              title={labels.emptyTitle}
              message={labels.emptyDescription}
              primaryAction={{ label: labels.createFirst, onClick: openCreate }}
            />
          ) : (
            <section className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="min-w-full text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">{labels.columns.title}</th>
                    <th className="px-4 py-3">{labels.columns.locale}</th>
                    <th className="px-4 py-3">{labels.columns.category}</th>
                    <th className="px-4 py-3">{labels.columns.contentType}</th>
                    <th className="px-4 py-3">{labels.columns.status}</th>
                    <th className="px-4 py-3">{labels.columns.publicSafe}</th>
                    <th className="px-4 py-3">{labels.columns.priority}</th>
                    <th className="px-4 py-3">{labels.columns.publishedAt}</th>
                    <th className="px-4 py-3">{labels.columns.lastReviewedAt}</th>
                    <th className="px-4 py-3">{labels.columns.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100">
                      <td className="px-4 py-3 font-medium text-slate-900">{item.title}</td>
                      <td className="px-4 py-3">{labels.locales[item.locale as keyof typeof labels.locales] ?? item.locale}</td>
                      <td className="px-4 py-3">{item.category ?? "—"}</td>
                      <td className="px-4 py-3">{labels.contentTypes[item.contentType]}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_STYLES[item.status]}`}>
                          {labels.statuses[item.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3">{item.publicSafe ? labels.yes : labels.no}</td>
                      <td className="px-4 py-3">{item.priority}</td>
                      <td className="px-4 py-3">{formatDate(item.publishedAt)}</td>
                      <td className="px-4 py-3">{formatDate(item.lastReviewedAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          {item.status !== "archived" ? (
                            <button
                              type="button"
                              onClick={() => openEdit(item)}
                              className="text-xs text-violet-600 hover:underline"
                            >
                              {labels.edit}
                            </button>
                          ) : null}
                          {item.status === "published" ? (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => void runAction("unpublish", item.id)}
                              className="text-xs text-slate-600 hover:underline disabled:opacity-50"
                            >
                              {labels.unpublish}
                            </button>
                          ) : null}
                          {item.status !== "archived" ? (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => void runAction("archive", item.id)}
                              className="text-xs text-amber-700 hover:underline disabled:opacity-50"
                            >
                              {labels.archive}
                            </button>
                          ) : null}
                          {item.status === "archived" ? (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => void runAction("restore", item.id)}
                              className="text-xs text-violet-600 hover:underline disabled:opacity-50"
                            >
                              {labels.restore}
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          <div>
            <button
              type="button"
              onClick={openCreate}
              className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
            >
              {labels.create}
            </button>
          </div>
        </>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-900">
                {draft.itemId ? labels.edit : labels.create}
              </h2>
              <button
                type="button"
                onClick={closeEditor}
                className="text-sm text-slate-600 hover:underline"
              >
                {labels.cancel}
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm md:col-span-2">
                <span className="mb-1 block font-medium text-slate-700">{labels.fields.title}</span>
                <input
                  value={draft.title}
                  onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
                  className="w-full rounded-md border border-slate-300 px-3 py-2"
                />
              </label>

              <label className="text-sm md:col-span-2">
                <span className="mb-1 block font-medium text-slate-700">{labels.fields.question}</span>
                <input
                  value={draft.question ?? ""}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, question: event.target.value }))
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-2"
                />
              </label>

              <label className="text-sm md:col-span-2">
                <span className="mb-1 block font-medium text-slate-700">{labels.fields.answer}</span>
                <textarea
                  value={draft.answer}
                  onChange={(event) => setDraft((current) => ({ ...current, answer: event.target.value }))}
                  rows={6}
                  className="w-full rounded-md border border-slate-300 px-3 py-2"
                />
              </label>

              <label className="text-sm">
                <span className="mb-1 block font-medium text-slate-700">{labels.fields.category}</span>
                <input
                  value={draft.category ?? ""}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, category: event.target.value }))
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-2"
                />
              </label>

              <label className="text-sm">
                <span className="mb-1 block font-medium text-slate-700">{labels.fields.locale}</span>
                <select
                  value={draft.locale}
                  onChange={(event) => setDraft((current) => ({ ...current, locale: event.target.value }))}
                  className="w-full rounded-md border border-slate-300 px-3 py-2"
                >
                  {WPKF_LOCALES.map((locale) => (
                    <option key={locale} value={locale}>
                      {labels.locales[locale]}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm">
                <span className="mb-1 block font-medium text-slate-700">{labels.fields.contentType}</span>
                <select
                  value={draft.contentType}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      contentType: event.target.value as WpkfContentType,
                    }))
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-2"
                >
                  {WPKF_CONTENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {labels.contentTypes[type]}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm">
                <span className="mb-1 block font-medium text-slate-700">{labels.fields.priority}</span>
                <input
                  type="number"
                  min={1}
                  max={9999}
                  value={draft.priority}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      priority: Number(event.target.value) || 100,
                    }))
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-2"
                />
              </label>

              <label className="text-sm md:col-span-2">
                <span className="mb-1 block font-medium text-slate-700">{labels.fields.tags}</span>
                <input
                  value={draft.tags.join(", ")}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      tags: event.target.value
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean),
                    }))
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-2"
                />
              </label>

              <label className="text-sm md:col-span-2">
                <span className="mb-1 block font-medium text-slate-700">{labels.fields.sourceUrl}</span>
                <input
                  value={draft.sourceUrl ?? ""}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, sourceUrl: event.target.value }))
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-2"
                />
              </label>

              <label className="text-sm">
                <span className="mb-1 block font-medium text-slate-700">{labels.fields.validFrom}</span>
                <input
                  type="datetime-local"
                  value={draft.validFrom ? draft.validFrom.slice(0, 16) : ""}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      validFrom: event.target.value ? new Date(event.target.value).toISOString() : null,
                    }))
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-2"
                />
              </label>

              <label className="text-sm">
                <span className="mb-1 block font-medium text-slate-700">{labels.fields.validUntil}</span>
                <input
                  type="datetime-local"
                  value={draft.validUntil ? draft.validUntil.slice(0, 16) : ""}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      validUntil: event.target.value ? new Date(event.target.value).toISOString() : null,
                    }))
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-2"
                />
              </label>

              <label className="text-sm md:col-span-2">
                <span className="mb-1 block font-medium text-slate-700">
                  {labels.fields.lastReviewedAt}
                </span>
                <input
                  type="datetime-local"
                  value={draft.lastReviewedAt ? draft.lastReviewedAt.slice(0, 16) : ""}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      lastReviewedAt: event.target.value
                        ? new Date(event.target.value).toISOString()
                        : null,
                    }))
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-2"
                />
              </label>

              <label className="flex items-start gap-2 text-sm md:col-span-2">
                <input
                  type="checkbox"
                  checked={draft.publicSafe}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, publicSafe: event.target.checked }))
                  }
                  className="mt-1"
                />
                <span>
                  <span className="block font-medium text-slate-700">{labels.fields.publicSafe}</span>
                  <span className="text-xs text-slate-500">{labels.fields.publicSafeHint}</span>
                </span>
              </label>
            </div>

            {riskyWords.length > 0 ? (
              <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                {labels.riskyWordsWarning}: {riskyWords.join(", ")}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busy || !isWebsiteKompisFaqEditorValid(draft)}
                onClick={() => void saveDraft()}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                {labels.saveDraft}
              </button>
              <button
                type="button"
                disabled={busy || !canPublish}
                title={!canPublish ? labels.publishDisabledHint : undefined}
                onClick={() => setPublishDialogOpen(true)}
                className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
              >
                {labels.publish}
              </button>
            </div>
          </section>

          <WebsiteKompisFaqPreviewPanel
            labels={labels}
            title={draft.title}
            question={draft.question ?? ""}
            answer={draft.answer}
          />
        </div>
      )}

      <WebsiteKompisFaqPublishDialog
        labels={labels}
        open={publishDialogOpen}
        riskyWords={riskyWords}
        onConfirm={() => void confirmPublish()}
        onCancel={() => setPublishDialogOpen(false)}
        busy={busy}
      />
    </div>
  );
}
