"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { WebsiteKompisFaqPreviewPanel } from "@/components/app/website-kompis/WebsiteKompisFaqPreviewPanel";
import { WebsiteKompisFaqImportWorkspace } from "@/components/app/website-kompis/WebsiteKompisFaqImportWorkspace";
import { FaqContentLanguagePicker } from "@/components/app/website-kompis/FaqContentLanguagePicker";
import { FaqPermanentExpiryFields } from "@/components/app/website-kompis/FaqPermanentExpiryFields";
import { Download, FileUp, Plus } from "lucide-react";
import { WebsiteKompisFaqPublishDialog } from "@/components/app/website-kompis/WebsiteKompisFaqPublishDialog";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  WPKF_CONTENT_TYPES,
  WPKF_STATUSES,
  type WpkfContentType,
  type WpkfStatus,
} from "@/lib/website-kompis-faq/constants";
import type { FaqCountBreakdown } from "@/lib/website-kompis-faq/count-contract";
import type { WebsiteKompisFaqLabels } from "@/lib/website-kompis-faq/labels";
import type { FaqKnowledgeCounts } from "@/lib/website-kompis-knowledge/source-inventory";
import {
  chunkFaqIds,
  planPublicSafeReview,
  selectionAfterPublicSafeReview,
} from "@/lib/website-kompis-faq/bulk-review";
import {
  acceptLocaleResponse,
  emptyLocaleVersion,
  localeDraftIsDirty,
} from "@/lib/website-kompis-faq/locale-family";
import {
  FAQ_GLOBAL_MATCH_SELECT_SUPPORTED,
  FAQ_LIST_PAGE_SIZE,
  buildFaqListWindow,
  planVisibleDraftPublish,
  pruneSelectionToVisible,
  selectionAfterVisiblePublish,
  summarizeVisiblePublish,
  visiblePublishBlock,
  visibleRowRange,
  type FaqListWindow,
} from "@/lib/website-kompis-faq/list-window";
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
  onLibraryCounts?: (counts: FaqKnowledgeCounts) => void;
};

const STATUS_STYLES: Record<WpkfStatus, string> = {
  draft: "bg-slate-100 text-slate-700",
  published: "bg-emerald-100 text-emerald-800",
  archived: "bg-amber-100 text-amber-800",
};

type OwnedSiteOption = {
  installId: string;
  domain: string;
  verificationStatus?: string;
  domainStatus?: string;
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

function fillLabel(template: string, values: Record<string, string | number>): string {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

function disclosureReasonLabel(labels: WebsiteKompisFaqLabels, code: string): string | null {
  if (code in labels.disclosureReasons) {
    return labels.disclosureReasons[code as keyof WebsiteKompisFaqLabels["disclosureReasons"]];
  }
  return null;
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

function ListWindowBar({
  labels,
  listWindow,
  selectedIds,
  items,
  busy,
  summary,
  onPrevious,
  onNext,
  onTogglePage,
  onClear,
  onPublish,
  onShowDrafts,
  onReview,
  onSelectAll,
  detail,
  canPublish,
  canReview,
  matchSelection,
  explanation,
}: {
  labels: WebsiteKompisFaqLabels;
  listWindow: FaqListWindow;
  selectedIds: string[];
  items: WebsiteKompisFaqItem[];
  busy: boolean;
  summary: string | null;
  onPrevious: () => void;
  onNext: () => void;
  onTogglePage: (checked: boolean) => void;
  onClear: () => void;
  onPublish: () => void;
  onShowDrafts: () => void;
  onReview: () => void;
  onSelectAll: () => void;
  detail: string | null;
  canPublish: boolean;
  canReview: boolean;
  matchSelection: boolean;
  explanation: string | null;
}) {
  const range = visibleRowRange(listWindow);
  const rangeLabel =
    listWindow.siteTotal != null
      ? fillLabel(labels.listWindow.showingExact, {
          from: range.from,
          to: range.to,
          total: listWindow.siteTotal,
        })
      : fillLabel(labels.listWindow.showingWindow, { count: listWindow.visibleReturned });
  const pageChecked = !matchSelection && items.length > 0 && selectedIds.length === items.length;

  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-700">{rangeLabel}</p>
      {listWindow.totalState === "at_least_tenant" ? (
        <p className="text-sm text-slate-600">{labels.listWindow.moreMayExist}</p>
      ) : null}
      {detail ? <p className="text-sm text-slate-700">{detail}</p> : null}
      {listWindow.selectAllSupported || FAQ_GLOBAL_MATCH_SELECT_SUPPORTED ? null : (
        <p className="text-sm text-slate-600">
          {labels.listWindow.globalBlocked} {labels.listWindow.totalUnavailable}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex items-center gap-2 text-sm text-slate-800">
          <input
            type="checkbox"
            checked={pageChecked}
            onChange={(event) => onTogglePage(event.target.checked)}
            disabled={items.length === 0 || busy}
          />
          {labels.listWindow.selectPage}
        </label>
        <span className="text-sm text-slate-600">
          {fillLabel(
            matchSelection ? labels.listWindow.selectedAcrossFilters : labels.listWindow.selectedCount,
            { count: selectedIds.length },
          )}
        </span>
        <button
          type="button"
          onClick={onClear}
          disabled={selectedIds.length === 0 || busy}
          className="text-sm text-slate-700 underline disabled:opacity-50"
        >
          {labels.listWindow.clearSelection}
        </button>
        <button
          type="button"
          onClick={onPrevious}
          disabled={listWindow.offset === 0 || busy}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm disabled:opacity-50"
        >
          {labels.listWindow.previous}
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!listWindow.hasMore || busy}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm disabled:opacity-50"
        >
          {labels.listWindow.loadMore}
        </button>
        <button
          type="button"
          onClick={onShowDrafts}
          disabled={busy}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm disabled:opacity-50"
        >
          {labels.listWindow.showDrafts}
        </button>
        <button
          type="button"
          onClick={onPublish}
          disabled={!canPublish || busy}
          className="rounded-md bg-violet-700 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {labels.listWindow.publishSelected}
        </button>
        <button
          type="button"
          onClick={onReview}
          disabled={!canReview || busy}
          className="rounded-md border border-violet-300 px-3 py-2 text-sm text-violet-800 disabled:opacity-50"
        >
          {labels.listWindow.reviewPublicSafe}
        </button>
        <button
          type="button"
          onClick={onSelectAll}
          disabled={!listWindow.selectAllSupported || busy}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm disabled:opacity-50"
        >
          {labels.listWindow.selectAllMatches}
        </button>
      </div>
      {explanation ? <p className="text-sm text-slate-700">{explanation}</p> : null}
      {summary ? <p className="text-sm text-slate-700">{summary}</p> : null}
    </section>
  );
}

export function WebsiteKompisFaqAdminPanel({
  labels,
  embedded = false,
  suggestFromFeedbackWarning,
  onLibraryCounts,
}: WebsiteKompisFaqAdminPanelProps) {
  const [items, setItems] = useState<WebsiteKompisFaqItem[]>([]);
  const [listOffset, setListOffset] = useState(0);
  const [listWindow, setListWindow] = useState<FaqListWindow>(() =>
    buildFaqListWindow({
      offset: 0,
      limit: FAQ_LIST_PAGE_SIZE,
      tenantReturned: 0,
      visibleReturned: 0,
    }),
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewAck, setReviewAck] = useState(false);
  const [pendingPublishIds, setPendingPublishIds] = useState<string[]>([]);
  const [progressLabel, setProgressLabel] = useState<string | null>(null);
  const [matchSelection, setMatchSelection] = useState(false);
  const [qualification, setQualification] = useState<FaqCountBreakdown | null>(null);
  const [selectionNote, setSelectionNote] = useState<string | null>(null);
  const matchModeRef = useRef(false);
  const [pagePublishOpen, setPagePublishOpen] = useState(false);
  const [pagePublishSummary, setPagePublishSummary] = useState<string | null>(null);
  const [heldById, setHeldById] = useState<Record<string, string>>({});
  const [showHeldOnly, setShowHeldOnly] = useState(false);
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
  const familySourceIdRef = useRef<string | null>(null);
  const localeBaselineRef = useRef<FaqEditorState>(createEmptyDraft());
  const localeRequestRef = useRef(0);
  const draftRef = useRef<FaqEditorState>(createEmptyDraft());
  const openedEditRef = useRef("");
  draftRef.current = draft;
  const [localeLoading, setLocaleLoading] = useState(false);
  const [pendingLocale, setPendingLocale] = useState<string | null>(null);
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
  const [legacyNullHidden, setLegacyNullHidden] = useState(false);
  const [unassigned, setUnassigned] = useState<Array<{ id: string; title: string; locale: string }>>([]);
  const [assignTarget, setAssignTarget] = useState<string | null>(null);
  const [requiresSiteSelection, setRequiresSiteSelection] = useState(false);
  const searchParams = useSearchParams();

  const selectedSite = useMemo(
    () => sites.find((site) => site.installId === selectedInstallId) ?? null,
    [selectedInstallId, sites],
  );
  const pagePublishPlan = useMemo(
    () => planVisibleDraftPublish(items, selectedIds),
    [items, selectedIds],
  );
  const pagePublishSummaryCounts = useMemo(
    () => summarizeVisiblePublish(items, selectedIds),
    [items, selectedIds],
  );
  const pagePublishBlock = visiblePublishBlock(pagePublishSummaryCounts);
  const pagePublishExplanation =
    pagePublishBlock === "already_published"
      ? fillLabel(labels.listWindow.alreadyPublished, { count: pagePublishSummaryCounts.published })
      : pagePublishBlock === "ready"
        ? fillLabel(labels.listWindow.eligibility, {
            ready: pagePublishSummaryCounts.ready,
            published: pagePublishSummaryCounts.published,
            draftNotReady: pagePublishSummaryCounts.draftNotReady,
            archived: pagePublishSummaryCounts.archived,
          })
        : pagePublishBlock === "none_ready"
          ? fillLabel(labels.listWindow.noneReadyDetail, {
              published: pagePublishSummaryCounts.published,
              draftNotReady: pagePublishSummaryCounts.draftNotReady,
              archived: pagePublishSummaryCounts.archived,
            })
          : null;

  const listDetail = [
    qualification &&
    (statusFilter === "" || statusFilter === "draft") &&
    (qualification.draftPublicSafe > 0 || qualification.draftNeedsReview > 0)
      ? fillLabel(labels.listWindow.draftQualification, {
          already: qualification.draftPublicSafe,
          needs: qualification.draftNeedsReview,
        })
      : null,
    selectionNote,
    matchSelection && pendingPublishIds.length > 0
      ? fillLabel(labels.listWindow.readyToPublish, { ready: pendingPublishIds.length })
      : matchSelection && selectedIds.length > 0
        ? `${fillLabel(labels.listWindow.matchSelected, { selected: selectedIds.length })} ${labels.listWindow.reviewBeforePublish}`
        : listWindow.selectAllSupported && listWindow.siteTotal != null && listWindow.siteTotal > items.length
          ? fillLabel(labels.listWindow.fullSetHint, {
              visible: items.length,
              total: listWindow.siteTotal,
            })
          : null,
  ]
    .filter((part): part is string => Boolean(part))
    .join(" ");

  const riskyWords = useMemo(
    () =>
      detectWebsiteKompisFaqRiskyWords(
        [draft.title, draft.question ?? "", draft.answer, draft.category ?? ""].join(" "),
      ),
    [draft.answer, draft.category, draft.question, draft.title],
  );
  const disclosureLabels = riskyWords
    .map((code) => disclosureReasonLabel(labels, code))
    .filter((label): label is string => Boolean(label));

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
    params.set("offset", String(listOffset));
    params.set("limit", String(FAQ_LIST_PAGE_SIZE));

    const res = await fetch(`/api/website-kompis/faq?${params.toString()}`);
    if (res.status === 403) {
      setAccessDenied(true);
      setItems([]);
      setLoading(false);
      return;
    }

    const body = (await res.json()) as {
      items?: WebsiteKompisFaqItem[];
      listWindow?: FaqListWindow;
      libraryCounts?: FaqCountBreakdown | null;
      qualification?: FaqCountBreakdown | null;
      error?: string;
      siteContext?: {
        state?: "no_sites" | "single_site" | "multi_site";
        selectedInstallId?: string | null;
        sites?: OwnedSiteOption[];
        requiresSiteSelection?: boolean;
        legacyNullVisible?: boolean;
        legacyNullHidden?: boolean;
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
    setLegacyNullHidden(body.siteContext?.legacyNullHidden === true);
    const nextItems = body.items ?? [];
    setItems(nextItems);
    setListWindow(
      body.listWindow ??
        buildFaqListWindow({
          offset: listOffset,
          limit: FAQ_LIST_PAGE_SIZE,
          tenantReturned: nextItems.length,
          visibleReturned: nextItems.length,
        }),
    );
    setSelectedIds((current) =>
      matchModeRef.current ? current : pruneSelectionToVisible(current, nextItems.map((item) => item.id)),
    );
    setQualification(body.qualification ?? null);
    if (body.libraryCounts) {
      onLibraryCounts?.({
        total: body.libraryCounts.total,
        published: body.libraryCounts.published,
        draft: body.libraryCounts.draft,
        archived: body.libraryCounts.archived,
        lastUpdatedAt: null,
      });
    }
    setLoading(false);
  }, [
    contentTypeFilter,
    labels.errorGeneric,
    listOffset,
    localeFilter,
    searchQuery,
    selectedInstallId,
    statusFilter,
    onLibraryCounts,
  ]);

  const requestedSite = (searchParams.get("site") || searchParams.get("installId") || "").trim().toLowerCase();

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
      const owned = nextSites.find((site) => site.installId.toLowerCase() === requestedSite);
      if (owned) {
        setSelectedInstallId(owned.installId);
      } else if (nextSites.length === 1) {
        setSelectedInstallId(nextSites[0]!.installId);
      }
    })();
  }, [requestedSite]);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/website-kompis/faq?scope=unassigned&limit=50");
      if (!res.ok) {
        setUnassigned([]);
        return;
      }
      const body = (await res.json()) as { items?: Array<{ id: string; title: string; locale: string }> };
      setUnassigned(body.items ?? []);
    })();
  }, [selectedInstallId]);

  async function assignLegacy(itemId: string) {
    if (!selectedInstallId) return;
    setBusy(true);
    setError(null);
    const res = await fetch("/api/website-kompis/faq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        assignLegacy: true,
        confirmAssignment: true,
        itemId,
        installId: selectedInstallId,
      }),
    });
    setBusy(false);
    if (!res.ok) {
      setError(labels.siteContext.assignLegacyFailed);
      return;
    }
    setNotice(labels.siteContext.assignLegacyDone);
    setAssignTarget(null);
    setUnassigned((current) => current.filter((item) => item.id !== itemId));
    await refresh();
  }

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const editId = searchParams.get("edit")?.trim() ?? "";
    const query = searchParams.get("query")?.trim() ?? "";
    if (editId && query) setSearchQuery((current) => current || query);
    const suggestQuestion = searchParams.get("suggestQuestion")?.trim() ?? "";
    if (suggestQuestion) {
      const suggestLocale = searchParams.get("suggestLocale")?.trim() || "no";
      const fromFeedback = searchParams.get("fromFeedback") === "1";
      const suggested = {
        ...createEmptyDraft(selectedSite),
        locale: suggestLocale.slice(0, 16),
        title: suggestQuestion.slice(0, 120),
        question: suggestQuestion.slice(0, 2000),
        answer: "",
      };
      persistedIdRef.current = null;
      familySourceIdRef.current = null;
      localeBaselineRef.current = suggested;
      setDraft(suggested);
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

  useEffect(() => {
    const editId = searchParams.get("edit")?.trim() ?? "";
    if (!editId || openedEditRef.current === editId) return;
    const item = items.find((row) => row.id === editId);
    if (!item) return;
    openedEditRef.current = editId;
    openEdit(item);
  }, [items, searchParams]);

  function openCreate() {
    persistedIdRef.current = null;
    familySourceIdRef.current = null;
    const next = createEmptyDraft(selectedSite);
    localeBaselineRef.current = next;
    setDraft(next);
    setPendingLocale(null);
    setSuggestFromFeedback(false);
    setEditorOpen(true);
    setError(null);
    setNotice(null);
  }

  function openEdit(item: WebsiteKompisFaqItem) {
    persistedIdRef.current = item.id;
    familySourceIdRef.current = item.id;
    const next = itemToDraft(item);
    localeBaselineRef.current = next;
    setDraft(next);
    setPendingLocale(null);
    setEditorOpen(true);
    setError(null);
    setNotice(null);
  }

  function leaveMatchMode() {
    matchModeRef.current = false;
    setMatchSelection(false);
  }

  function enterMatchMode() {
    matchModeRef.current = true;
    setMatchSelection(true);
  }

  function resetListScope() {
    setListOffset(0);
    setSelectedIds([]);
    leaveMatchMode();
    setPendingPublishIds([]);
    setReviewOpen(false);
    setReviewAck(false);
    setPagePublishOpen(false);
    setPagePublishSummary(null);
    setHeldById({});
    setShowHeldOnly(false);
    setSelectionNote(null);
  }

  const reviewPlan = useMemo(
    () => planPublicSafeReview(items, matchModeRef.current ? [] : selectedIds),
    [items, selectedIds],
  );

  async function selectAllMatches() {
    if (!listWindow.selectAllSupported || busy) return;
    setBusy(true);
    setError(null);
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (localeFilter) params.set("locale", localeFilter);
    if (contentTypeFilter) params.set("contentType", contentTypeFilter);
    if (searchQuery.trim()) params.set("query", searchQuery.trim());
    if (selectedInstallId) params.set("installId", selectedInstallId);
    const res = await fetch(`/api/website-kompis/faq/match-ids?${params.toString()}`);
    setBusy(false);
    if (!res.ok) {
      leaveMatchMode();
      setSelectionNote(null);
      setError(labels.listWindow.totalUnavailable);
      return;
    }
    const body = (await res.json()) as { ids?: string[]; unreadable?: number };
    if (!body.ids) {
      leaveMatchMode();
      setError(labels.listWindow.totalUnavailable);
      return;
    }
    if (body.ids.length === 0) {
      leaveMatchMode();
      setSelectedIds([]);
      setSelectionNote(
        fillLabel(labels.listWindow.matchGap, {
          readable: 0,
          unreadable: body.unreadable ?? 0,
        }),
      );
      return;
    }
    enterMatchMode();
    setSelectedIds(body.ids);
    setPendingPublishIds([]);
    setSelectionNote(
      (body.unreadable ?? 0) > 0
        ? fillLabel(labels.listWindow.matchGap, {
            readable: body.ids.length,
            unreadable: body.unreadable ?? 0,
          })
        : null,
    );
  }

  async function reviewSelectedDrafts() {
    if (publishLock.current || !reviewAck) return;
    const ids = matchModeRef.current ? selectedIds : reviewPlan.readyIds;
    if (ids.length === 0) return;
    publishLock.current = true;
    setBusy(true);
    setError(null);
    let marked: string[] = [];
    let alreadyIds: string[] = [];
    let already = reviewPlan.alreadySafeIds.length;
    let manual = reviewPlan.manualIds.length;
    let skipped = reviewPlan.skipped.length;
    let failed: string[] = [];
    const held: Record<string, string> = {};
    const reasonCodes: string[] = [];
    if (!matchModeRef.current) {
      for (const row of reviewPlan.skipped) {
        if (row.reason !== "manual_review" || !row.disclosures?.length) continue;
        held[row.id] = row.disclosures[0] ?? "";
        reasonCodes.push(...row.disclosures);
      }
    }
    try {
      const chunks = chunkFaqIds(ids);
      for (let index = 0; index < chunks.length; index += 1) {
        setProgressLabel(
          fillLabel(labels.listWindow.reviewProgress, {
            done: Math.min(ids.length, index * 25),
            total: ids.length,
          }),
        );
        const res = await fetch("/api/website-kompis/faq/public-safe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            confirm: true,
            installId: selectedInstallId || null,
            status: statusFilter || null,
            locale: localeFilter || null,
            contentType: contentTypeFilter || null,
            query: searchQuery.trim() || null,
            itemIds: chunks[index],
          }),
        });
        const body = (await res.json().catch(() => null)) as {
          marked?: string[];
          alreadySafe?: string[];
          manual?: string[];
          results?: Array<{ id: string; outcome: string; disclosures?: string[] }>;
        } | null;
        if (!res.ok || !body) {
          failed = failed.concat(chunks[index] ?? []);
          continue;
        }
        marked = marked.concat(body.marked ?? []);
        if (matchModeRef.current) {
          alreadyIds = alreadyIds.concat(body.alreadySafe ?? []);
          already += body.alreadySafe?.length ?? 0;
          manual += body.manual?.length ?? 0;
          skipped += (body.results ?? []).filter((row) => row.outcome !== "marked" && row.outcome !== "failed").length;
        }
        failed = failed.concat((body.results ?? []).filter((row) => row.outcome === "failed").map((row) => row.id));
        for (const row of body.results ?? []) {
          if (row.outcome !== "manual_review" || !row.disclosures?.length) continue;
          held[row.id] = row.disclosures[0] ?? "";
          reasonCodes.push(...row.disclosures);
        }
      }
      const counts = new Map<string, number>();
      for (const code of reasonCodes) counts.set(code, (counts.get(code) ?? 0) + 1);
      const summary = [...counts.entries()]
        .map(([code, count]) => {
          const label = disclosureReasonLabel(labels, code);
          return label ? `${count} ${label}` : null;
        })
        .filter((part): part is string => Boolean(part))
        .join(", ");
      const result = fillLabel(labels.listWindow.reviewResult, {
        marked: marked.length,
        already,
        manual,
        skipped,
        failed: failed.length,
      });
      setPagePublishSummary(summary ? `${result} ${fillLabel(labels.listWindow.holdReasons, { summary })}` : result);
      setHeldById(held);
      setShowHeldOnly(false);
      setPendingPublishIds(matchModeRef.current ? [...new Set([...marked, ...alreadyIds])] : marked);
      setSelectedIds(
        selectionAfterPublicSafeReview({
          selectedIds: ids,
          markedIds: marked,
          alreadySafeIds: matchModeRef.current ? alreadyIds : reviewPlan.alreadySafeIds,
        }).concat(failed),
      );
      setReviewOpen(false);
      setReviewAck(false);
      await refresh();
    } finally {
      setProgressLabel(null);
      publishLock.current = false;
      setBusy(false);
    }
  }

  async function publishVisibleDrafts() {
    if (publishLock.current) return;
    const plan = planVisibleDraftPublish(items, selectedIds);
    const queue = pendingPublishIds.length > 0 ? pendingPublishIds : plan.readyIds;
    if (queue.length === 0) return;
    publishLock.current = true;
    setBusy(true);
    setError(null);
    try {
      let passed = 0;
      const failedIds: string[] = [];
      for (let index = 0; index < queue.length; index += 1) {
        const id = queue[index]!;
        setProgressLabel(fillLabel(labels.listWindow.publishProgress, { done: index, total: queue.length }));
        const res = await fetch(`/api/website-kompis/faq/${id}/publish`, { method: "POST" });
        const body = (await res.json().catch(() => null)) as { status?: string } | null;
        if (res.ok && body?.status === "published") passed += 1;
        else failedIds.push(id);
      }
      setPendingPublishIds(failedIds);
      setPagePublishSummary(
        fillLabel(labels.listWindow.publishResult, {
          passed,
          failed: failedIds.length,
          skipped: plan.skipped.length,
        }),
      );
      setPagePublishOpen(false);
      setSelectedIds(selectionAfterVisiblePublish(failedIds));
      leaveMatchMode();
      await refresh();
    } finally {
      setProgressLabel(null);
      publishLock.current = false;
      setBusy(false);
    }
  }

  function closeEditor() {
    setEditorOpen(false);
    setPublishDialogOpen(false);
    setSuggestFromFeedback(false);
    persistedIdRef.current = null;
    familySourceIdRef.current = null;
    localeRequestRef.current += 1;
    setLocaleLoading(false);
    setPendingLocale(null);
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

    const creatingLocaleVersion = draft.editorStatus === "new" && familySourceIdRef.current && !persistedIdRef.current;
    if (!creatingLocaleVersion && persistedIdRef.current && draft.locale !== localeBaselineRef.current.locale) {
      setError(labels.localeSwitchError);
      return null;
    }

    const res = await fetch(creatingLocaleVersion ? "/api/website-kompis/faq/locale-version" : "/api/website-kompis/faq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        creatingLocaleVersion
          ? {
              sourceItemId: familySourceIdRef.current,
              locale: draft.locale,
              title: draft.title,
              question: draft.question,
              answer: draft.answer,
              category: draft.category,
              contentType: draft.contentType,
              priority: draft.priority,
              tags: draft.tags,
              sourceUrl: draft.sourceUrl,
              validFrom: expiry.validFrom,
              validUntil: expiry.validUntil,
            }
          : {
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
            },
      ),
    });

    const body = (await res.json()) as { id?: string; status?: WpkfStatus; error?: string };
    if (!res.ok || !body.id || !body.status) {
      setError(failureMessage);
      return null;
    }

    persistedIdRef.current = body.id;
    familySourceIdRef.current = body.id;
    const savedDraft: FaqEditorState = {
      ...draft,
      itemId: body.id,
      editorStatus: body.status,
      validFrom: expiry.validFrom,
      validUntil: expiry.validUntil,
      permanent: expiry.validUntil == null,
    };
    localeBaselineRef.current = savedDraft;
    setDraft(savedDraft);
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

  async function applyLocale(locale: string) {
    const sourceId = persistedIdRef.current ?? familySourceIdRef.current;
    if (!sourceId) {
      setDraft((current) => ({ ...current, locale }));
      return;
    }
    const requestId = localeRequestRef.current + 1;
    localeRequestRef.current = requestId;
    const previous = draftRef.current;
    setLocaleLoading(true);
    setError(null);
    setDraft(
      emptyLocaleVersion(
        {
          installId: previous.installId ?? null,
          domain: previous.domain ?? null,
          contentType: previous.contentType,
          priority: previous.priority,
        },
        locale,
      ),
    );
    try {
      const res = await fetch(
        `/api/website-kompis/faq/locale-version?itemId=${encodeURIComponent(sourceId)}&locale=${encodeURIComponent(locale)}`,
      );
      const body = (await res.json().catch(() => null)) as {
        outcome?: string;
        code?: string;
        item?: WebsiteKompisFaqItem;
      } | null;
      if (!acceptLocaleResponse(requestId, localeRequestRef.current)) return;
      if (!res.ok || !body) {
        setDraft(previous);
        setError(body?.code === "translation_group_unavailable" ? labels.localeSwitchUnavailable : labels.localeSwitchError);
        return;
      }
      if (body.outcome === "found" && body.item) {
        const next = itemToDraft(body.item);
        persistedIdRef.current = next.itemId ?? null;
        familySourceIdRef.current = next.itemId ?? sourceId;
        localeBaselineRef.current = next;
        setDraft(next);
        return;
      }
      if (body.outcome === "missing") {
        const next: FaqEditorState = emptyLocaleVersion(
          {
            installId: previous.installId ?? null,
            domain: previous.domain ?? null,
            contentType: previous.contentType,
            priority: previous.priority,
          },
          locale,
        );
        persistedIdRef.current = null;
        familySourceIdRef.current = sourceId;
        localeBaselineRef.current = next;
        setDraft(next);
        return;
      }
      setDraft(previous);
      setError(labels.localeSwitchError);
    } finally {
      if (acceptLocaleResponse(requestId, localeRequestRef.current)) setLocaleLoading(false);
    }
  }

  function requestLocaleSwitch(locale: string) {
    if (locale === draft.locale || localeLoading) return;
    if (!persistedIdRef.current && !familySourceIdRef.current) {
      setDraft((current) => ({ ...current, locale }));
      return;
    }
    if (localeDraftIsDirty(draft, localeBaselineRef.current)) {
      setPendingLocale(locale);
      return;
    }
    void applyLocale(locale);
  }

  async function confirmLocaleSwitch(action: "keep" | "save" | "discard") {
    const locale = pendingLocale;
    if (!locale) return;
    if (action === "keep") {
      setPendingLocale(null);
      return;
    }
    if (action === "save") {
      if (draft.editorStatus === "published") return;
      setBusy(true);
      const saved = await persistEditor(labels.errorGeneric);
      setBusy(false);
      if (!saved) return;
    }
    setPendingLocale(null);
    await applyLocale(locale);
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
            className="inline-flex min-h-11 items-center rounded-xl border border-[#E3E6F1] bg-white px-3 text-sm font-medium text-[#5538D3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7357e8]"
          >
            {labels.feedbackOverviewLink}
          </Link>
        </div>
      )}

      {!editorOpen ? (
        <div className="flex flex-wrap items-center gap-2 rounded-[18px] border border-[#E3E6F1] bg-white p-4 shadow-[0_8px_22px_rgba(38,37,104,0.04)]" data-faq-library-actions>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#7357e8] px-4 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7357e8]"
            >
              <Plus aria-hidden className="h-4 w-4" />
              {labels.create}
            </button>
            <button
              type="button"
              disabled={siteState === "loading" || requiresSiteSelection || (!selectedInstallId && siteState !== "no_sites")}
              onClick={() => setImportOpen(true)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7357e8] disabled:opacity-60"
            >
              <FileUp aria-hidden className="h-4 w-4 text-[#7357e8]" />
              {labels.importFaq.open}
            </button>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <a href="/api/website-kompis/faq/import/template?format=csv" className="inline-flex min-h-11 items-center gap-2 text-sm text-slate-600">
              <Download aria-hidden className="h-4 w-4" />
              {labels.importFaq.downloadCsv}
            </a>
            <a href="/api/website-kompis/faq/import/template?format=xlsx" className="inline-flex min-h-11 items-center gap-2 text-sm text-slate-600">
              <Download aria-hidden className="h-4 w-4" />
              {labels.importFaq.downloadXlsx}
            </a>
          </div>
        </div>
      ) : null}

      <p className="rounded-[18px] border border-[#E3E6F1] bg-white px-4 py-3 text-sm leading-relaxed text-[#20243A]">
        {labels.warningBanner}
      </p>

      <section className="space-y-3 rounded-[18px] border border-[#E3E6F1] bg-white p-4 shadow-[0_8px_22px_rgba(38,37,104,0.04)]">
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
              onChange={(event) => {
                resetListScope();
                setSelectedInstallId(event.target.value);
              }}
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
        {legacyNullHidden ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
            {labels.siteContext.legacyHidden}
          </p>
        ) : null}
        {unassigned.length > 0 ? (
          <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
            <p className="text-sm font-medium text-amber-950">{labels.siteContext.unassignedTitle}</p>
            <p className="text-sm text-amber-950">{labels.siteContext.assignLegacyExplain}</p>
            {unassigned.map((item) => {
              const selected = sites.find((site) => site.installId === selectedInstallId);
              const verified = selected?.verificationStatus === "verified" && selected?.domainStatus === "active";
              return (
                <div key={item.id} className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm text-amber-950">{item.title}</p>
                  {assignTarget === item.id ? (
                    <button
                      type="button"
                      disabled={busy || !verified}
                      onClick={() => void assignLegacy(item.id)}
                      className="inline-flex min-h-11 items-center rounded-full bg-[#7055EE] px-4 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      {labels.siteContext.assignLegacyConfirm}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={busy || !verified}
                      onClick={() => setAssignTarget(item.id)}
                      className="inline-flex min-h-11 items-center rounded-full border border-amber-300 px-4 text-sm font-semibold text-amber-950 disabled:opacity-60"
                    >
                      {verified ? labels.siteContext.assignLegacy : labels.siteContext.assignLegacyNeedsVerifiedSite}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
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
          <section className="rounded-[18px] border border-[#E3E6F1] bg-white p-4 shadow-[0_8px_22px_rgba(38,37,104,0.04)]">
            <div className="grid gap-3 md:grid-cols-4">
              <label className="text-sm">
                <span className="mb-1 block text-xs font-medium text-slate-600">
                  {labels.filters.status}
                </span>
                <select
                  value={statusFilter}
                  onChange={(event) => {
                    resetListScope();
                    setStatusFilter(event.target.value as WpkfStatus | "");
                  }}
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

              <div className="text-sm">
                <span className="mb-1 block text-xs font-medium text-slate-600">
                  {labels.filters.locale}
                </span>
                <FaqContentLanguagePicker
                  value={localeFilter}
                  onChange={(code) => {
                    resetListScope();
                    setLocaleFilter(code);
                  }}
                  labels={labels.locales}
                  searchLabel={labels.languageSearch}
                  noMatchLabel={labels.languageNoMatch}
                  listLabel={labels.languageList}
                  collationLocale={labels.languageCollation}
                  allowEmpty
                  emptyLabel={labels.filters.all}
                />
              </div>

              <label className="text-sm">
                <span className="mb-1 block text-xs font-medium text-slate-600">
                  {labels.filters.contentType}
                </span>
                <select
                  value={contentTypeFilter}
                  onChange={(event) => {
                    resetListScope();
                    setContentTypeFilter(event.target.value as WpkfContentType | "");
                  }}
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
                  onChange={(event) => {
                    resetListScope();
                    setSearchQuery(event.target.value);
                  }}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
            </div>
          </section>

          {requiresSiteSelection ? null : (
          <ListWindowBar
            labels={labels}
            listWindow={listWindow}
            selectedIds={selectedIds}
            items={items}
            busy={busy}
            onPrevious={() => {
              leaveMatchMode();
              setSelectedIds([]);
              setPagePublishOpen(false);
              setListOffset((current) => Math.max(0, current - FAQ_LIST_PAGE_SIZE));
            }}
            onNext={() => {
              leaveMatchMode();
              setSelectedIds([]);
              setPagePublishOpen(false);
              setListOffset((current) => current + FAQ_LIST_PAGE_SIZE);
            }}
            onTogglePage={(checked) => {
              leaveMatchMode();
              setPendingPublishIds([]);
              setSelectedIds(checked ? items.map((item) => item.id) : []);
            }}
            onClear={() => {
              leaveMatchMode();
              setSelectedIds([]);
              setSelectionNote(null);
            }}
            matchSelection={matchSelection}
            onShowDrafts={() => {
              resetListScope();
              setStatusFilter("draft");
            }}
            canPublish={pendingPublishIds.length > 0 || (!matchSelection && pagePublishBlock === "ready")}
            canReview={reviewPlan.readyIds.length > 0 || (matchSelection && selectedIds.length > 0)}
            explanation={progressLabel ?? (matchSelection ? null : pagePublishExplanation)}
            detail={listDetail || null}
            onReview={() => {
              setReviewAck(false);
              setReviewOpen(true);
            }}
            onSelectAll={() => void selectAllMatches()}
            onPublish={() => {
              if (matchSelection) {
                if (pendingPublishIds.length === 0) return;
              } else if (pagePublishPlan.readyIds.length === 0 && pendingPublishIds.length === 0) {
                return;
              }
              setPagePublishOpen(true);
            }}
            summary={pagePublishSummary}
          />
          )}

          {Object.keys(heldById).length > 0 ? (
            <div className="flex flex-wrap items-center gap-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
              <button
                type="button"
                onClick={() => setShowHeldOnly((current) => !current)}
                className="font-medium underline"
              >
                {showHeldOnly ? labels.listWindow.showAllRows : labels.listWindow.showHeld}
              </button>
              {Object.keys(heldById).length > items.filter((item) => heldById[item.id]).length ? (
                <span>
                  {fillLabel(labels.listWindow.heldOffPage, {
                    count: Object.keys(heldById).length - items.filter((item) => heldById[item.id]).length,
                  })}
                </span>
              ) : null}
            </div>
          ) : null}

          {items.length === 0 && !listWindow.hasMore ? (
            <PlatformEmptyState
              title={labels.emptyTitle}
              message={labels.emptyDescription}
              primaryAction={{ label: labels.createFirst, onClick: openCreate }}
            />
          ) : (
            <section className="overflow-x-auto rounded-[18px] border border-[#E3E6F1] bg-white shadow-[0_8px_22px_rgba(38,37,104,0.04)]">
              <table className="min-w-full text-sm">
                <thead className="border-b border-[#E3E6F1] bg-[#F8F9FD] text-left text-xs uppercase tracking-wide text-[#657089]">
                  <tr>
                    <th className="px-4 py-3">
                      <input
                        type="checkbox"
                        aria-label={labels.listWindow.selectPage}
                        checked={!matchSelection && items.length > 0 && selectedIds.length === items.length}
                        onChange={(event) => {
                          leaveMatchMode();
                          setPendingPublishIds([]);
                          setSelectionNote(null);
                          setSelectedIds(event.target.checked ? items.map((item) => item.id) : []);
                        }}
                      />
                    </th>
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
                  {(showHeldOnly ? items.filter((item) => heldById[item.id]) : items).map((item) => (
                    <tr key={item.id} className="border-b border-[#EEF0F6] hover:bg-[#FAF9FF]">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          aria-label={fillLabel(labels.listWindow.selectRow, { title: item.title })}
                          checked={selectedIds.includes(item.id)}
                          onChange={(event) => {
                            if (matchModeRef.current) {
                              leaveMatchMode();
                              setPendingPublishIds([]);
                              setSelectionNote(null);
                              const pageIds = items.map((row) => row.id);
                              setSelectedIds(
                                event.target.checked
                                  ? pageIds
                                  : pageIds.filter((id) => id !== item.id),
                              );
                              return;
                            }
                            setSelectedIds((current) =>
                              event.target.checked
                                ? [...current, item.id]
                                : current.filter((id) => id !== item.id),
                            );
                          }}
                        />
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        <div className="flex flex-wrap items-center gap-2">
                          <span>{item.title}</span>
                          {heldById[item.id] && disclosureReasonLabel(labels, heldById[item.id] ?? "") ? (
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-950">
                              {fillLabel(labels.listWindow.heldOnRow, {
                                reason: disclosureReasonLabel(labels, heldById[item.id] ?? "") ?? "",
                              })}
                            </span>
                          ) : null}
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
          <WebsiteKompisFaqPublishDialog
            labels={labels}
            open={pagePublishOpen}
            riskyWords={[]}
            title={labels.listWindow.publishTitle}
            body={
              matchSelection && pendingPublishIds.length > 0
                ? fillLabel(labels.listWindow.readyToPublish, { ready: pendingPublishIds.length })
                : pendingPublishIds.length > 0
                ? fillLabel(labels.listWindow.publishPendingBody, {
                    site: selectedSite?.domain ?? labels.filters.all,
                    ready: pendingPublishIds.length,
                  })
                : fillLabel(labels.listWindow.publishBody, {
                    site: selectedSite?.domain ?? labels.filters.all,
                    filter: statusFilter ? labels.statuses[statusFilter] : labels.filters.all,
                    ready: pagePublishPlan.readyIds.length,
                    skipped: pagePublishPlan.skipped.length,
                    published: pagePublishSummaryCounts.published,
                  })
            }
            confirmLabel={labels.listWindow.publishConfirm}
            error={null}
            busy={busy}
            onCancel={() => {
              if (!busy) setPagePublishOpen(false);
            }}
            onConfirm={() => void publishVisibleDrafts()}
          />
          <WebsiteKompisFaqPublishDialog
            labels={labels}
            open={reviewOpen}
            riskyWords={[]}
            title={labels.listWindow.reviewTitle}
            body={`${labels.listWindow.publicExposureWarning} ${labels.listWindow.reviewScope} ${
              matchModeRef.current
                ? fillLabel(labels.listWindow.reviewBodySelection, {
                    site: selectedSite?.domain ?? labels.filters.all,
                    selected: selectedIds.length,
                  })
                : fillLabel(labels.listWindow.reviewBody, {
                    site: selectedSite?.domain ?? labels.filters.all,
                    ready: reviewPlan.readyIds.length,
                    manual: reviewPlan.manualIds.length,
                    already: reviewPlan.alreadySafeIds.length,
                  })
            }`}
            confirmLabel={labels.listWindow.reviewConfirm}
            acknowledgementLabel={labels.listWindow.reviewConfirmLabel}
            acknowledged={reviewAck}
            onAcknowledge={setReviewAck}
            error={null}
            busy={busy}
            busyLabel={labels.listWindow.reviewBusy}
            onCancel={() => {
              if (!busy) setReviewOpen(false);
            }}
            onConfirm={() => void reviewSelectedDrafts()}
          />

        </>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {draft.itemId ? labels.edit : labels.create}
                </h2>
                <p className="text-sm text-slate-600">
                  {localeLoading
                    ? labels.localeSwitchLoading
                    : draft.editorStatus === "new"
                      ? labels.localeVersionNew
                      : labels.statuses[draft.editorStatus]}
                </p>
              </div>
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
                  disabled={localeLoading}
                  onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
                  className="w-full rounded-md border border-slate-300 px-3 py-2"
                />
              </label>

              <label className="text-sm md:col-span-2">
                <span className="mb-1 block font-medium text-slate-700">{labels.fields.question}</span>
                <input
                  value={draft.question ?? ""}
                  disabled={localeLoading}
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
                  disabled={localeLoading}
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

              <div className="text-sm">
                <span className="mb-1 block font-medium text-slate-700">{labels.fields.locale}</span>
                <FaqContentLanguagePicker
                  value={draft.locale}
                  onChange={requestLocaleSwitch}
                  labels={labels.locales}
                  searchLabel={labels.languageSearch}
                  noMatchLabel={labels.languageNoMatch}
                  listLabel={labels.languageList}
                  collationLocale={labels.languageCollation}
                />
                {pendingLocale ? (
                  <div className="mt-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800">
                    <p className="font-medium">{labels.localeUnsavedTitle}</p>
                    <p className="mt-1">{labels.localeUnsavedBody}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button type="button" className="rounded-md border border-slate-300 px-2 py-1" onClick={() => void confirmLocaleSwitch("keep")}>
                        {labels.localeUnsavedKeep}
                      </button>
                      {draft.editorStatus === "published" ? null : (
                        <button type="button" className="rounded-md border border-slate-300 px-2 py-1" onClick={() => void confirmLocaleSwitch("save")}>
                          {labels.localeUnsavedSave}
                        </button>
                      )}
                      <button type="button" className="rounded-md border border-slate-300 px-2 py-1" onClick={() => void confirmLocaleSwitch("discard")}>
                        {labels.localeUnsavedDiscard}
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>

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

            {disclosureLabels.length > 0 ? (
              <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                {labels.riskyWordsWarning}: {disclosureLabels.join(", ")}
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
        riskyWords={disclosureLabels}
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
