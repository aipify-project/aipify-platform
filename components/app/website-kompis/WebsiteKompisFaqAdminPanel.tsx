"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { WebsiteKompisFaqPreviewPanel } from "@/components/app/website-kompis/WebsiteKompisFaqPreviewPanel";
import { WebsiteKompisFaqImportActions, WebsiteKompisFaqImportWorkspace } from "@/components/app/website-kompis/WebsiteKompisFaqImportWorkspace";
import { FaqPermanentExpiryFields } from "@/components/app/website-kompis/FaqPermanentExpiryFields";
import { WebsiteKompisFaqPublishDialog } from "@/components/app/website-kompis/WebsiteKompisFaqPublishDialog";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  WPKF_CONTENT_TYPES,
  WPKF_LOCALES,
  WPKF_STATUSES,
  type WpkfContentType,
  type WpkfStatus,
} from "@/lib/website-kompis-faq/constants";
import type { WebsiteKompisFaqLabels } from "@/lib/website-kompis-faq/labels";
import { runFaqPublishFlow } from "@/lib/website-kompis-faq/publish-flow";
import {
  detectWebsiteKompisFaqRiskyWords,
  isWebsiteKompisFaqEditorValid,
  planWebsiteKompisFaqPublish,
  resolveFaqExpiryForSave,
} from "@/lib/website-kompis-faq/safety";
import type {
  WebsiteKompisFaqItem,
  WebsiteKompisFaqUpsertInput,
} from "@/lib/website-kompis-faq/types";

type WebsiteKompisFaqAdminPanelProps = {
  labels: WebsiteKompisFaqLabels;
  /** Job 61 — inside AppHubShell: no duplicate page header / settings back-link as nav. */
  embedded?: boolean;
  /** Job 64 — shown when opening a draft suggested from visitor feedback. */
  suggestFromFeedbackWarning?: string;
};

const STATUS_STYLES: Record<WpkfStatus, string> = {
  draft: "bg-slate-100 text-slate-700",
  published: "bg-emerald-100 text-emerald-800",
  archived: "bg-amber-100 text-amber-800",
};

type OwnedSiteOption = {
  installId: string;
  domain: string;
};

type FaqEditorState = WebsiteKompisFaqUpsertInput & {
  editorStatus: "new" | WpkfStatus;
  permanent: boolean;
};

function createEmptyDraft(site?: OwnedSiteOption | null): FaqEditorState {
  return {
    editorStatus: "new",
    itemId: null,
    installId: site?.installId ?? null,
    domain: site?.domain ?? null,
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
    permanent: true,
    lastReviewedAt: null,
  };
}

function itemToDraft(item: WebsiteKompisFaqItem): FaqEditorState {
  return {
    editorStatus: item.status,
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
    permanent: !item.validUntil,
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

export function WebsiteKompisFaqAdminPanel({
  labels,
  embedded = false,
  suggestFromFeedbackWarning,
}: WebsiteKompisFaqAdminPanelProps) {
  const [items, setItems] = useState<WebsiteKompisFaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [draft, setDraft] = useState<FaqEditorState>(createEmptyDraft());
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const publishLock = useRef(false);
  const persistedIdRef = useRef<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<WpkfStatus | "">("");
  const [localeFilter, setLocaleFilter] = useState("");
  const [contentTypeFilter, setContentTypeFilter] = useState<WpkfContentType | "">("");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestFromFeedback, setSuggestFromFeedback] = useState(false);
  const [sites, setSites] = useState<OwnedSiteOption[]>([]);
  const [selectedInstallId, setSelectedInstallId] = useState<string>("");
  const [siteState, setSiteState] = useState<"no_sites" | "single_site" | "multi_site" | "loading">(
    "loading",
  );
  const [legacyNullVisible, setLegacyNullVisible] = useState(false);
  const [requiresSiteSelection, setRequiresSiteSelection] = useState(false);
  const searchParams = useSearchParams();

  const selectedSite = useMemo(
    () => sites.find((site) => site.installId === selectedInstallId) ?? null,
    [selectedInstallId, sites],
  );

  const riskyWords = useMemo(
    () =>
      detectWebsiteKompisFaqRiskyWords(
        [draft.title, draft.question ?? "", draft.answer, draft.category ?? ""].join(" "),
      ),
    [draft.answer, draft.category, draft.question, draft.title],
  );

  const expiryPreview = resolveFaqExpiryForSave(draft);
  const publishPlan = expiryPreview.ok
    ? planWebsiteKompisFaqPublish({
        status: draft.editorStatus,
        title: draft.title,
        answer: draft.answer,
        locale: draft.locale,
        contentType: draft.contentType,
        publicSafe: draft.publicSafe,
        validFrom: expiryPreview.validFrom,
        validUntil: expiryPreview.validUntil,
      })
    : "blocked";
  const canPublish = publishPlan !== "blocked";
  const revisingPublished = publishPlan === "revise_published";

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    setAccessDenied(false);

    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (localeFilter) params.set("locale", localeFilter);
    if (contentTypeFilter) params.set("contentType", contentTypeFilter);
    if (searchQuery.trim()) params.set("query", searchQuery.trim());
    if (selectedInstallId) params.set("installId", selectedInstallId);

    const res = await fetch(`/api/website-kompis/faq?${params.toString()}`);
    if (res.status === 403) {
      setAccessDenied(true);
      setItems([]);
      setLoading(false);
      return;
    }

    const body = (await res.json()) as {
      items?: WebsiteKompisFaqItem[];
      error?: string;
      siteContext?: {
        state?: "no_sites" | "single_site" | "multi_site";
        selectedInstallId?: string | null;
        sites?: OwnedSiteOption[];
        requiresSiteSelection?: boolean;
        legacyNullVisible?: boolean;
      };
    };
    if (!res.ok) {
      setError(body.error ?? labels.errorGeneric);
      setItems([]);
      setLoading(false);
      return;
    }

    const nextSites = body.siteContext?.sites ?? [];
    if (nextSites.length > 0) {
      setSites(nextSites);
      setSiteState(body.siteContext?.state ?? (nextSites.length === 1 ? "single_site" : "multi_site"));
      const nextSelected =
        body.siteContext?.selectedInstallId ??
        selectedInstallId ??
        (nextSites.length === 1 ? nextSites[0]!.installId : "");
      if (nextSelected && nextSelected !== selectedInstallId) {
        setSelectedInstallId(nextSelected);
      }
    } else if (body.siteContext?.state === "no_sites") {
      setSites([]);
      setSiteState("no_sites");
    }

    setRequiresSiteSelection(body.siteContext?.requiresSiteSelection === true);
    setLegacyNullVisible(body.siteContext?.legacyNullVisible === true);
    setItems(body.items ?? []);
    setLoading(false);
  }, [
    contentTypeFilter,
    labels.errorGeneric,
    localeFilter,
    searchQuery,
    selectedInstallId,
    statusFilter,
  ]);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/website-kompis/sites");
      if (!res.ok) {
        setSiteState("no_sites");
        return;
      }
      const body = (await res.json()) as {
        sites?: OwnedSiteOption[];
        state?: "no_sites" | "single_site" | "multi_site";
      };
      const nextSites = body.sites ?? [];
      setSites(nextSites);
      setSiteState(body.state ?? (nextSites.length === 0 ? "no_sites" : nextSites.length === 1 ? "single_site" : "multi_site"));
      if (nextSites.length === 1) {
        setSelectedInstallId(nextSites[0]!.installId);
      }
    })();
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const suggestQuestion = searchParams.get("suggestQuestion")?.trim() ?? "";
    if (suggestQuestion) {
      const suggestLocale = searchParams.get("suggestLocale")?.trim() || "no";
      const fromFeedback = searchParams.get("fromFeedback") === "1";
      setDraft({
        ...createEmptyDraft(selectedSite),
        locale: suggestLocale.slice(0, 16),
        title: suggestQuestion.slice(0, 120),
        question: suggestQuestion.slice(0, 2000),
        answer: "",
      });
      persistedIdRef.current = null;
      setSuggestFromFeedback(fromFeedback);
      setEditorOpen(true);
      setError(null);
      return;
    }
    if (searchParams.get("create") === "1") {
      setDraft(createEmptyDraft(selectedSite));
      setSuggestFromFeedback(false);
      setEditorOpen(true);
      setError(null);
    }
    if (searchParams.get("status") === "draft") {
      setStatusFilter("draft");
    }
  }, [searchParams, selectedSite]);

  function openCreate() {
    persistedIdRef.current = null;
    setDraft(createEmptyDraft(selectedSite));
    setSuggestFromFeedback(false);
    setEditorOpen(true);
    setError(null);
    setNotice(null);
  }

  function openEdit(item: WebsiteKompisFaqItem) {
    persistedIdRef.current = item.id;
    setDraft(itemToDraft(item));
    setEditorOpen(true);
    setError(null);
    setNotice(null);
  }

  function closeEditor() {
    setEditorOpen(false);
    setPublishDialogOpen(false);
    setSuggestFromFeedback(false);
    persistedIdRef.current = null;
    setDraft(createEmptyDraft(selectedSite));
  }

  async function persistEditor(failureMessage: string): Promise<{ id: string; status: WpkfStatus } | null> {
    if (!isWebsiteKompisFaqEditorValid(draft)) {
      setError(labels.errorGeneric);
      return null;
    }
    const expiry = resolveFaqExpiryForSave(draft);
    if (!expiry.ok) {
      setError(expiry.reason === "window" ? labels.validityInvalidWindow : labels.permanentEndRequired);
      return null;
    }

    const res = await fetch("/api/website-kompis/faq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemId: persistedIdRef.current,
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
        validFrom: expiry.validFrom,
        validUntil: expiry.validUntil,
        lastReviewedAt: draft.lastReviewedAt,
      }),
    });

    const body = (await res.json()) as { id?: string; status?: WpkfStatus; error?: string };
    if (!res.ok || !body.id || !body.status) {
      setError(failureMessage);
      return null;
    }

    persistedIdRef.current = body.id;
    setDraft((current) => ({
      ...current,
      itemId: body.id ?? current.itemId,
      editorStatus: body.status ?? current.editorStatus,
      validFrom: expiry.validFrom,
      validUntil: expiry.validUntil,
      permanent: expiry.validUntil == null,
    }));
    return { id: body.id, status: body.status };
  }

  async function saveDraft() {
    if (draft.editorStatus === "published") return;
    setBusy(true);
    setError(null);
    setNotice(null);
    const savedRow = await persistEditor(labels.errorGeneric);
    if (savedRow) {
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
      await refresh();
    }
    setBusy(false);
  }

  async function runAction(action: "unpublish" | "archive" | "restore", itemId: string) {
    setBusy(true);
    setError(null);

    const res = await fetch(`/api/website-kompis/faq/${itemId}/${action}`, { method: "POST" });
    const body = (await res.json()) as { error?: string };

    if (!res.ok) {
      setError(body.error ?? labels.errorGeneric);
      setBusy(false);
      return;
    }

    setBusy(false);
    closeEditor();
    await refresh();
  }

  async function confirmPublish() {
    if (publishLock.current || busy || publishPlan === "blocked") {
      if (publishPlan === "blocked") setError(labels.validityInvalidWindow);
      return;
    }

    publishLock.current = true;
    setBusy(true);
    setError(null);
    setNotice(null);

    try {
      const result = await runFaqPublishFlow({
        plan: publishPlan,
        save: () => persistEditor(labels.publishFailed),
        publish: async (id) => {
          const res = await fetch(`/api/website-kompis/faq/${id}/publish`, { method: "POST" });
          const body = (await res.json()) as { id?: string; status?: string };
          return { ok: res.ok, id: body.id, status: body.status };
        },
      });

      if (result.outcome === "draft_saved_publish_failed") {
        persistedIdRef.current = result.id;
        setDraft((current) => ({ ...current, itemId: result.id, editorStatus: "draft" }));
        setError(labels.publishSavedAsDraft);
        return;
      }
      if (result.outcome !== "published" && result.outcome !== "revised") {
        setError(labels.publishFailed);
        return;
      }

      setDraft((current) => ({ ...current, itemId: result.id, editorStatus: "published" }));
      setPublishDialogOpen(false);
      setNotice(result.outcome === "revised" ? labels.publishedChangesSuccess : labels.publishedNewSuccess);
      await refresh();
    } catch {
      setError(labels.publishFailed);
    } finally {
      publishLock.current = false;
      setBusy(false);
    }
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
    <div className="w-full space-y-6">
      {!embedded ? (
        <div>
          <Link href="/app/settings" className="text-sm text-violet-600 hover:underline">
            {labels.back}
          </Link>
          <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">{labels.title}</h1>
              <p className="mt-1 text-sm text-slate-600">{labels.subtitle}</p>
            </div>
            <Link
              href="/app/website-kompis/feedback"
              className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-medium text-violet-800 hover:bg-violet-100"
            >
              {labels.feedbackOverviewLink}
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex justify-end">
          <Link
            href="/app/website-kompis/feedback"
            className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-medium text-violet-800 hover:bg-violet-100"
          >
            {labels.feedbackOverviewLink}
          </Link>
        </div>
      )}

      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        {labels.warningBanner}
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{labels.siteContext.label}</p>
          <p className="mt-1 text-sm text-slate-600">{labels.siteContext.hint}</p>
        </div>
        {siteState === "no_sites" ? (
          <p className="text-sm text-amber-900">{labels.siteContext.noSites}</p>
        ) : null}
        {siteState === "multi_site" || siteState === "single_site" ? (
          <label className="block text-sm">
            <span className="mb-1 block text-xs font-medium text-slate-600">
              {labels.siteContext.label}
            </span>
            <select
              value={selectedInstallId}
              onChange={(event) => setSelectedInstallId(event.target.value)}
              disabled={siteState === "single_site"}
              className="w-full max-w-md rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              {siteState === "multi_site" ? (
                <option value="">{labels.siteContext.selectRequired}</option>
              ) : null}
              {sites.map((site) => (
                <option key={site.installId} value={site.installId}>
                  {site.domain}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        {requiresSiteSelection ? (
          <p className="text-sm font-medium text-amber-900">{labels.siteContext.selectRequired}</p>
        ) : null}
        {legacyNullVisible ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
            {labels.siteContext.legacyWarning}
          </p>
        ) : null}
        <p className="text-xs text-slate-500">{labels.siteContext.visitorPartialNote}</p>
      </section>

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      {notice ? (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800" role="status">
          {notice}
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
                      <td className="px-4 py-3 font-medium text-slate-900">
                        <div className="flex flex-wrap items-center gap-2">
                          <span>{item.title}</span>
                          {item.scope?.isLegacyTenantGlobal ? (
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900">
                              {labels.siteContext.legacyBadge}
                            </span>
                          ) : item.installId ? (
                            <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-900">
                              {labels.siteContext.siteScopedBadge}
                            </span>
                          ) : null}
                        </div>
                      </td>
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

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex min-h-11 items-center rounded-xl bg-[image:var(--app-primary-gradient)] px-4 text-sm font-medium text-white"
            >
              {labels.create}
            </button>
            <WebsiteKompisFaqImportActions
              labels={labels.importFaq}
              disabled={siteState === "loading" || requiresSiteSelection || (!selectedInstallId && siteState !== "no_sites")}
              onOpen={() => setImportOpen(true)}
            />
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
            {suggestFromFeedback && suggestFromFeedbackWarning ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
                {suggestFromFeedbackWarning}
              </div>
            ) : null}

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

              <div className="md:col-span-2">
                <FaqPermanentExpiryFields
                  permanent={draft.permanent}
                  validFrom={draft.validFrom ?? null}
                  validUntil={draft.validUntil ?? null}
                  labels={{
                    permanent: labels.permanent,
                    permanentHelp: labels.permanentHelp,
                    validFrom: labels.fields.validFrom,
                    validUntil: labels.fields.validUntil,
                  }}
                  onPermanentChange={(permanent) =>
                    setDraft((current) => ({
                      ...current,
                      permanent,
                      validUntil: permanent ? null : current.validUntil,
                    }))
                  }
                  onValidFromChange={(validFrom) => setDraft((current) => ({ ...current, validFrom }))}
                  onValidUntilChange={(validUntil) => setDraft((current) => ({ ...current, validUntil }))}
                />
              </div>

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
                {busy ? labels.saving : labels.saveDraft}
              </button>
              <button
                type="button"
                disabled={busy || !canPublish}
                title={!canPublish ? labels.publishDisabledHint : undefined}
                onClick={() => setPublishDialogOpen(true)}
                className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
              >
                {revisingPublished ? labels.publishChanges : labels.publish}
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
        title={revisingPublished ? labels.confirmReviseTitle : labels.confirmPublishTitle}
        body={revisingPublished ? labels.confirmReviseBody : labels.confirmPublishBody}
        confirmLabel={revisingPublished ? labels.publishChanges : labels.confirmPublishAction}
        error={error}
        onConfirm={() => void confirmPublish()}
        onCancel={() => setPublishDialogOpen(false)}
        busy={busy}
      />
      {importOpen ? (
        <WebsiteKompisFaqImportWorkspace
          labels={labels.importFaq}
          fields={labels.fields}
          installId={selectedInstallId}
          onClose={() => setImportOpen(false)}
          onImported={(importedMessage) => {
            setImportOpen(false);
            setNotice(importedMessage);
            setStatusFilter("draft");
          }}
        />
      ) : null}
    </div>
  );
}
