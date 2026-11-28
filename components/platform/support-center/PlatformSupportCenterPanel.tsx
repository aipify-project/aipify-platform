"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  attachSupportSignatureToDraft,
  computeSupportKpis,
  createDefaultSupportSignature,
  filterTicketsForTab,
  getSupportCenterGateState,
  isSupportSendPublicReplyApplied,
  listSupportChannelActivations,
  listSupportReplyStarterTemplates,
  normalizeSupportTimeline,
  parseSupportCenterTab,
  renderSupportSignatureText,
  renderSupportTemplateBody,
  resolveTicketDescription,
  ticketFromDetailItem,
  ticketReference,
  type EditableSupportTemplate,
  type SupportCenterTabId,
  type SupportKpiState,
  type SupportSignatureDraft,
  type SupportTicketCounts,
  type SupportTimelineEntry,
} from "@/lib/platform-portal/support-center";
import type { PlatformSupportTicketsListItem } from "@/lib/platform-portal/support-tickets-read-adapter";
import type { SupportCenterLabels } from "./support-center-labels";
import SupportSignatureTab, { type StoredSignatureState } from "./SupportSignatureTab";
import SupportTemplatesTab from "./SupportTemplatesTab";
import SupportTicketDetail, {
  type SupportBusyScope,
  type SupportDetailState,
  type SupportFeedbackScope,
} from "./SupportTicketDetail";
import SupportTicketList from "./SupportTicketList";
import {
  FlashMessage,
  inputClass,
  secondaryButtonClass,
  type SupportFlash,
} from "./support-center-ui";

type PlatformSupportCenterPanelProps = {
  locale: string;
  labels: SupportCenterLabels;
};

type LoadState =
  | { kind: "loading" }
  | { kind: "blocked" }
  | { kind: "error"; message: string }
  | {
      kind: "ready";
      items: PlatformSupportTicketsListItem[];
      counts: SupportTicketCounts | null;
      viewerUserId: string | null;
    };

type DetailLoad = {
  id: string;
  status: "ready" | "error";
  item: Record<string, unknown> | null;
  timeline: SupportTimelineEntry[];
};

type Drafts = {
  ticketId: string | null;
  reply: string;
  /** Reply text as last saved — equal to `reply` means nothing unsaved. */
  replyBaseline: string;
  note: string;
  templateId: string;
  /**
   * Stable send idempotency key for this draft — reused until a successful send
   * clears the draft (avoids duplicate customer-visible messages on retry).
   */
  sendIdempotencyKey: string | null;
};

const EMPTY_DRAFTS: Drafts = {
  ticketId: null,
  reply: "",
  replyBaseline: "",
  note: "",
  templateId: "",
  sendIdempotencyKey: null,
};

const SEARCH_DEBOUNCE_MS = 300;

function starterAsEditable(): EditableSupportTemplate[] {
  return listSupportReplyStarterTemplates().map((t) => ({
    ...t,
    starter: true,
    archived: false,
  }));
}

function KpiCard({
  label,
  kpi,
  labels,
}: {
  label: string;
  kpi: SupportKpiState;
  labels: SupportCenterLabels;
}) {
  return (
    <article
      title={kpi.state === "value" && kpi.source === "page" ? labels.kpiPageNote : undefined}
      className="flex min-h-[5.5rem] flex-col justify-between rounded-xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] p-4"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-[color:var(--aipify-text-secondary)]">
        {label}
      </p>
      {kpi.state === "value" ? (
        <p className="mt-2 text-2xl font-semibold text-[color:var(--aipify-text)]">
          {kpi.value}
        </p>
      ) : kpi.state === "loading" ? (
        <p className="mt-2" aria-busy="true">
          <span
            aria-hidden
            className="block h-7 w-12 animate-pulse rounded-md bg-[color:var(--aipify-surface-muted)]"
          />
          <span className="sr-only">{labels.kpiLoading}</span>
        </p>
      ) : (
        <p className="mt-2 text-sm font-medium text-[color:var(--aipify-text-secondary)]">
          {labels.kpiUnavailable}
        </p>
      )}
    </article>
  );
}

export default function PlatformSupportCenterPanel({
  locale,
  labels,
}: PlatformSupportCenterPanelProps) {
  const router = useRouter();
  const pathname = usePathname() || "/platform/support";
  const searchParams = useSearchParams();
  const tab = parseSupportCenterTab(searchParams.get("tab"));
  const selectedId = searchParams.get("ticket");

  const gates = useMemo(() => getSupportCenterGateState(), []);
  const [load, setLoad] = useState<LoadState>({ kind: "loading" });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [channelFilter, setChannelFilter] = useState("");
  const [flash, setFlash] = useState<SupportFlash | null>(null);
  const [feedback, setFeedback] = useState<{
    scope: SupportFeedbackScope;
    flash: SupportFlash;
  } | null>(null);
  const [busy, setBusy] = useState<SupportBusyScope | null>(null);

  const [drafts, setDrafts] = useState<Drafts>(EMPTY_DRAFTS);
  /** Sync map so rapid Send retries reuse the same key before React state flushes. */
  const sendIdempotencyByTicketRef = useRef<Record<string, string>>({});
  const [statusChoice, setStatusChoice] = useState<{
    ticketId: string;
    value: string;
  } | null>(null);
  const [detail, setDetail] = useState<DetailLoad | null>(null);
  const [detailNonce, setDetailNonce] = useState(0);

  const [workspaceTemplates, setWorkspaceTemplates] = useState<
    EditableSupportTemplate[] | null
  >(null);
  const [templatesPersist, setTemplatesPersist] = useState(false);
  const [signatureStored, setSignatureStored] = useState<StoredSignatureState>(() => ({
    signature: createDefaultSupportSignature(),
    customized: false,
    loaded: false,
    loadFailed: false,
  }));

  const channels = useMemo(() => listSupportChannelActivations(), []);
  const requestRef = useRef(0);

  const allTemplates = useMemo(
    () => workspaceTemplates ?? starterAsEditable(),
    [workspaceTemplates],
  );
  const templates = useMemo(
    () => allTemplates.filter((t) => !t.archived && t.active !== false),
    [allTemplates],
  );

  // ----- navigation ------------------------------------------------------

  const draftsForSelected: Drafts =
    drafts.ticketId !== null && drafts.ticketId === selectedId
      ? drafts
      : { ...EMPTY_DRAFTS, ticketId: selectedId };
  const replyDraft = draftsForSelected.reply;
  const noteDraft = draftsForSelected.note;
  const replyUnsaved =
    replyDraft.trim() !== "" && replyDraft !== draftsForSelected.replyBaseline;
  const draftsDirty = Boolean(selectedId) && (replyUnsaved || noteDraft.trim() !== "");
  const replySaved =
    replyDraft.trim() !== "" && replyDraft === draftsForSelected.replyBaseline;

  /** Ask before discarding unsaved text. Returns true when it is OK to leave. */
  const confirmLeave = useCallback((): boolean => {
    if (!draftsDirty) return true;
    return window.confirm(labels.dirtyLeave);
  }, [draftsDirty, labels.dirtyLeave]);

  useEffect(() => {
    if (!draftsDirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [draftsDirty]);

  const navigate = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const setTab = useCallback(
    (next: SupportCenterTabId) => {
      // The selected ticket is kept across tabs so a template can be inserted
      // into its reply draft from the Templates tab.
      navigate((params) => params.set("tab", next));
    },
    [navigate],
  );

  const openTicket = useCallback(
    (id: string) => {
      if (id === selectedId) return;
      if (!confirmLeave()) return;
      setDrafts(EMPTY_DRAFTS);
      setStatusChoice(null);
      setFeedback(null);
      setFlash(null);
      navigate((params) => {
        params.set("tab", tab === "mine" ? "mine" : "all");
        params.set("ticket", id);
      });
    },
    [confirmLeave, navigate, selectedId, tab],
  );

  const clearTicket = useCallback(() => {
    if (!confirmLeave()) return;
    setDrafts(EMPTY_DRAFTS);
    setStatusChoice(null);
    setFeedback(null);
    navigate((params) => params.delete("ticket"));
  }, [confirmLeave, navigate]);

  // ----- data loading ------------------------------------------------------

  useEffect(() => {
    const handle = window.setTimeout(
      () => setDebouncedSearch(search.trim()),
      SEARCH_DEBOUNCE_MS,
    );
    return () => window.clearTimeout(handle);
  }, [search]);

  const loadTickets = useCallback(async () => {
    const requestId = ++requestRef.current;
    // Keep showing the current list while filters / refreshes load.
    setLoad((prev) => (prev.kind === "ready" ? prev : { kind: "loading" }));
    try {
      const params = new URLSearchParams({
        page_size: "50",
        sort: "updated_desc",
      });
      if (statusFilter) params.set("status", statusFilter);
      if (priorityFilter) params.set("priority", priorityFilter);
      if (channelFilter) params.set("channel", channelFilter);
      if (debouncedSearch) params.set("search", debouncedSearch);
      // Server-side Mine filter (paginated). Falls back client-side if Core lacks param.
      if (tab === "mine") params.set("assigned_to", "me");
      const [listRes, countsRes] = await Promise.all([
        fetch(`/api/platform-portal/support-requests?${params.toString()}`, {
          cache: "no-store",
        }),
        fetch("/api/platform-portal/support-requests/counts", { cache: "no-store" }),
      ]);
      if (requestId !== requestRef.current) return;

      if (listRes.status === 503) {
        setLoad({ kind: "blocked" });
        return;
      }
      if (listRes.status === 401 || listRes.status === 403) {
        setLoad({
          kind: "error",
          message:
            listRes.status === 401
              ? labels.detail.writeErrors.unauthorized
              : labels.detail.writeErrors.forbidden,
        });
        return;
      }
      if (!listRes.ok) {
        setLoad({ kind: "error", message: labels.errorBody });
        return;
      }

      const listJson = (await listRes.json()) as {
        items?: PlatformSupportTicketsListItem[];
        viewerUserId?: string | null;
      };
      let counts: SupportTicketCounts | null = null;
      if (countsRes.ok) {
        const countsJson = (await countsRes.json()) as { counts?: SupportTicketCounts };
        counts = countsJson.counts ?? null;
      }
      if (requestId !== requestRef.current) return;
      setLoad({
        kind: "ready",
        items: Array.isArray(listJson.items) ? listJson.items : [],
        counts,
        viewerUserId:
          typeof listJson.viewerUserId === "string" ? listJson.viewerUserId : null,
      });
    } catch {
      if (requestId !== requestRef.current) return;
      setLoad({ kind: "error", message: labels.errorBody });
    }
  }, [
    debouncedSearch,
    labels.detail.writeErrors.forbidden,
    labels.detail.writeErrors.unauthorized,
    labels.errorBody,
    channelFilter,
    priorityFilter,
    statusFilter,
    tab,
  ]);

  useEffect(() => {
    void loadTickets();
  }, [loadTickets]);

  const loadTemplates = useCallback(async () => {
    try {
      const res = await fetch("/api/platform-portal/support-templates?include_archived=1", {
        cache: "no-store",
      });
      if (!res.ok) return;
      const json = (await res.json()) as {
        items?: EditableSupportTemplate[];
        persistConfigured?: boolean;
      };
      if (Array.isArray(json.items)) setWorkspaceTemplates(json.items);
      setTemplatesPersist(json.persistConfigured === true);
    } catch {
      /* keep starters */
    }
  }, []);

  useEffect(() => {
    void loadTemplates();
  }, [loadTemplates]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/platform-portal/support-signature", {
          cache: "no-store",
        });
        const json = (await res.json().catch(() => ({}))) as {
          signature?: SupportSignatureDraft;
          customized?: boolean;
        };
        if (cancelled) return;
        if (res.ok && json.signature) {
          setSignatureStored({
            signature: json.signature,
            customized: Boolean(json.customized),
            loaded: true,
            loadFailed: false,
          });
        } else {
          setSignatureStored((prev) => ({ ...prev, loaded: true, loadFailed: true }));
        }
      } catch {
        if (!cancelled) {
          setSignatureStored((prev) => ({ ...prev, loaded: true, loadFailed: true }));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch(
          `/api/platform-portal/support-requests/${encodeURIComponent(selectedId)}`,
          { cache: "no-store" },
        );
        if (!res.ok) {
          if (!cancelled) {
            setDetail({ id: selectedId, status: "error", item: null, timeline: [] });
          }
          return;
        }
        const json = (await res.json()) as {
          item?: Record<string, unknown>;
          timeline?: unknown;
        };
        if (cancelled) return;
        setDetail({
          id: selectedId,
          status: "ready",
          item: json.item ?? null,
          timeline: normalizeSupportTimeline(json.timeline),
        });
      } catch {
        if (!cancelled) {
          setDetail({ id: selectedId, status: "error", item: null, timeline: [] });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedId, detailNonce]);

  // ----- derived data ------------------------------------------------------

  const readyItems = load.kind === "ready" ? load.items : [];
  const viewerUserId = load.kind === "ready" ? load.viewerUserId : null;
  const visibleItems = filterTicketsForTab(readyItems, tab, viewerUserId);
  const hasFilters = Boolean(
    debouncedSearch || statusFilter || priorityFilter || channelFilter,
  );

  const kpis = computeSupportKpis({
    status:
      load.kind === "loading"
        ? "loading"
        : load.kind === "ready"
          ? "ready"
          : "unavailable",
    counts: load.kind === "ready" ? load.counts : null,
    items: readyItems,
  });

  const detailForSelected =
    selectedId && detail && detail.id === selectedId ? detail : null;
  const selectedTicket: PlatformSupportTicketsListItem | null = selectedId
    ? (readyItems.find((i) => i.id === selectedId) ??
      ticketFromDetailItem(selectedId, detailForSelected?.item))
    : null;
  const detailView: SupportDetailState = {
    status: detailForSelected ? detailForSelected.status : "loading",
    description: resolveTicketDescription(
      detailForSelected?.item,
      selectedTicket?.description_preview ?? "",
    ),
    status_code:
      typeof detailForSelected?.item?.status === "string"
        ? (detailForSelected.item.status as string)
        : null,
    timeline: detailForSelected?.timeline ?? [],
  };
  const currentStatus = detailView.status_code ?? selectedTicket?.status ?? "";
  const statusChoiceValue =
    statusChoice && statusChoice.ticketId === selectedId
      ? statusChoice.value
      : currentStatus;

  // ----- writes --------------------------------------------------------------

  function updateDrafts(patch: Partial<Drafts>) {
    setDrafts({ ...draftsForSelected, ticketId: selectedId, ...patch });
  }

  async function refreshAfterWrite() {
    setDetailNonce((n) => n + 1);
    await loadTickets();
  }

  async function runWrite(
    scope: SupportBusyScope,
    payload: Record<string, unknown>,
    successText: string,
    onSuccess?: () => void,
  ) {
    if (!selectedId) return;
    setBusy(scope);
    setFeedback(null);
    try {
      const res = await fetch("/api/platform-portal/support-requests/write", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId: selectedId, ...payload }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        code?: string;
        error?: string;
        message?: string;
      };
      if (!res.ok) {
        const mapped =
          labels.detail.writeErrors[json.code ?? "unknown"] ??
          labels.detail.writeErrors.unknown;
        const detail =
          typeof json.error === "string" && json.error.trim().length > 0
            ? json.error.trim()
            : typeof json.message === "string" && json.message.trim().length > 0
              ? json.message.trim()
              : null;
        const text =
          json.code === "invalid_transition" && detail
            ? detail
            : json.code === "validation" && detail
              ? `${mapped} (${detail})`
              : mapped;
        // Drafts are left untouched so nothing typed is lost.
        setFeedback({ scope, flash: { tone: "error", text } });
        return;
      }
      onSuccess?.();
      setFeedback({ scope, flash: { tone: "success", text: successText } });
      await refreshAfterWrite();
    } catch {
      setFeedback({
        scope,
        flash: { tone: "error", text: labels.detail.writeErrors.unknown },
      });
    } finally {
      setBusy(null);
    }
  }

  function saveDraft() {
    const body = replyDraft;
    void runWrite(
      "reply",
      {
        action: "external_reply",
        body,
        templateId: draftsForSelected.templateId || null,
        // The signature is already part of the draft when attached — never add twice.
        includeSignature: false,
      },
      labels.reply.draftSaved,
      () => setDrafts({ ...draftsForSelected, ticketId: selectedId, replyBaseline: body }),
    );
  }

  function sendReply() {
    const body = replyDraft;
    const ticketKey = selectedId ?? "unknown";
    const existing =
      draftsForSelected.sendIdempotencyKey ??
      sendIdempotencyByTicketRef.current[ticketKey] ??
      null;
    const key =
      existing ??
      (typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `send-${Date.now()}`);
    sendIdempotencyByTicketRef.current[ticketKey] = key;
    if (draftsForSelected.sendIdempotencyKey !== key) {
      setDrafts({
        ...draftsForSelected,
        ticketId: selectedId,
        sendIdempotencyKey: key,
      });
    }
    void runWrite(
      "send",
      {
        action: "send_public_reply",
        body,
        templateId: draftsForSelected.templateId || null,
        includeSignature: false,
        idempotencyKey: key,
      },
      labels.reply.sendReplySaved,
      () => {
        delete sendIdempotencyByTicketRef.current[ticketKey];
        setDrafts({
          ...draftsForSelected,
          ticketId: selectedId,
          reply: "",
          replyBaseline: "",
          templateId: "",
          sendIdempotencyKey: null,
        });
      },
    );
  }

  function saveNote() {
    void runWrite(
      "note",
      { action: "internal_note", body: noteDraft },
      labels.reply.noteSaved,
      () => setDrafts({ ...draftsForSelected, ticketId: selectedId, note: "" }),
    );
  }

  function updateStatus() {
    if (!selectedTicket || statusChoiceValue === currentStatus) return;
    void runWrite(
      "status",
      {
        action: "status",
        fromStatus: currentStatus,
        toStatus: statusChoiceValue,
      },
      labels.detail.statusUpdated,
      () => setStatusChoice(null),
    );
  }

  function assignToMe() {
    if (!viewerUserId) return;
    void runWrite(
      "assign",
      { action: "assign", assigneeUserId: viewerUserId },
      labels.detail.assignmentUpdated,
    );
  }

  function attachSignature() {
    const text = renderSupportSignatureText(signatureStored.signature);
    updateDrafts({ reply: attachSupportSignatureToDraft(replyDraft, text) });
    setFeedback({
      scope: "template",
      flash: { tone: "success", text: labels.reply.signatureAttached },
    });
  }

  function insertTemplate(template: EditableSupportTemplate) {
    if (!selectedId) {
      setFlash({ tone: "info", text: labels.templates.insertNeedsTicket });
      setTab("all");
      return;
    }
    if (replyDraft.trim() && !window.confirm(labels.templates.confirmOverwriteDraft)) {
      return;
    }
    const rendered = renderSupportTemplateBody(
      template.body,
      {
        customer_name: "",
        ticket_number: ticketReference(selectedId),
        product_name: "",
        agent_name:
          signatureStored.signature.agentName || signatureStored.signature.displayName,
      },
      { escapeHtml: false },
    );
    updateDrafts({
      reply: rendered.ok ? rendered.text : template.body,
      templateId: template.id,
    });
    setFlash(null);
    setFeedback({
      scope: "template",
      flash: { tone: "success", text: labels.templates.inserted },
    });
    setTab(tab === "mine" ? "mine" : "all");
  }

  function clearFilters() {
    setSearch("");
    setDebouncedSearch("");
    setStatusFilter("");
    setPriorityFilter("");
  }

  // ----- render ----------------------------------------------------------------

  const tabs: { id: SupportCenterTabId; label: string }[] = [
    { id: "all", label: labels.tabAll },
    { id: "mine", label: labels.tabMine },
    { id: "templates", label: labels.tabTemplates },
    { id: "signature", label: labels.tabSignature },
    { id: "channels", label: labels.tabChannels },
  ];

  function renderListArea() {
    if (load.kind === "loading") {
      return <AipifyLoader label={labels.loading} />;
    }
    if (load.kind === "blocked") {
      return (
        <PlatformEmptyState
          title={labels.emptyCoreBlockedTitle}
          message={labels.emptyCoreBlocked}
          primaryAction={{ label: labels.retry, onClick: () => void loadTickets() }}
        />
      );
    }
    if (load.kind === "error") {
      return (
        <PlatformEmptyState
          title={labels.errorTitle}
          message={load.message}
          primaryAction={{ label: labels.retry, onClick: () => void loadTickets() }}
        />
      );
    }

    const detailOpen = Boolean(selectedId);
    if (visibleItems.length === 0 && !detailOpen) {
      if (hasFilters) {
        return (
          <PlatformEmptyState
            title={labels.emptySearchTitle}
            message={`${labels.emptySearch} ${labels.emptySearchBody}`}
            primaryAction={{ label: labels.clearFilters, onClick: clearFilters }}
          />
        );
      }
      if (tab === "mine") {
        return (
          <PlatformEmptyState
            title={labels.emptyMineTitle}
            message={`${labels.emptyMine} ${labels.emptyMineBody}`}
            primaryAction={{ label: labels.goToAll, onClick: () => setTab("all") }}
          />
        );
      }
      return <PlatformEmptyState title={labels.emptyTitle} message={labels.empty} />;
    }

    if (!detailOpen) {
      return (
        <SupportTicketList
          items={visibleItems}
          selectedId={null}
          viewerUserId={viewerUserId}
          locale={locale}
          labels={labels}
          onOpen={openTicket}
        />
      );
    }

    return (
      <div className="grid gap-4 lg:grid-cols-[minmax(17rem,22rem)_minmax(0,1fr)]">
        <div className="hidden lg:block">
          {visibleItems.length > 0 ? (
            <SupportTicketList
              items={visibleItems}
              selectedId={selectedId}
              viewerUserId={viewerUserId}
              locale={locale}
              labels={labels}
              onOpen={openTicket}
            />
          ) : (
            <p className="rounded-xl border border-dashed border-[color:var(--aipify-border)] p-4 text-sm text-[color:var(--aipify-text-secondary)]">
              {tab === "mine" && !hasFilters ? labels.emptyMine : labels.emptySearch}
            </p>
          )}
        </div>
        <div className="min-w-0">
          {selectedTicket ? (
            <SupportTicketDetail
              labels={labels}
              locale={locale}
              ticket={selectedTicket}
              detail={detailView}
              viewerUserId={viewerUserId}
              templates={templates.map((t) => ({ id: t.id, name: t.name }))}
              selectedTemplateId={draftsForSelected.templateId}
              replyDraft={replyDraft}
              noteDraft={noteDraft}
              statusChoice={statusChoiceValue}
              busy={busy}
              feedback={feedback}
              replySaved={replySaved}
              signatureReady={signatureStored.loaded}
              sendPublicReplyReady={isSupportSendPublicReplyApplied()}
              onReplyChange={(value) => updateDrafts({ reply: value })}
              onNoteChange={(value) => updateDrafts({ note: value })}
              onStatusChoice={(value) =>
                setStatusChoice({ ticketId: selectedId as string, value })
              }
              onTemplatePick={(id) => {
                const tpl = templates.find((t) => t.id === id);
                if (tpl) insertTemplate(tpl);
              }}
              onSaveDraft={saveDraft}
              onSendReply={sendReply}
              onSaveNote={saveNote}
              onUpdateStatus={updateStatus}
              onAssignToMe={assignToMe}
              onAttachSignature={attachSignature}
              onClose={clearTicket}
              onLeaveForCustomer={confirmLeave}
            />
          ) : detailView.status === "loading" ? (
            <AipifyLoader label={labels.detail.loadingDetail} />
          ) : (
            <PlatformEmptyState
              title={labels.errorTitle}
              message={labels.detail.detailError}
              primaryAction={{ label: labels.detail.back, onClick: clearTicket }}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[color:var(--aipify-text)] sm:text-3xl">
          {labels.title}
        </h1>
        <p className="mt-2 max-w-3xl text-base text-[color:var(--aipify-text-secondary)]">
          {labels.subtitle}
        </p>
      </header>

      {!gates.ticketsLive && (
        <div
          role="status"
          className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
        >
          <p className="font-semibold">{labels.coreBlockedTitle}</p>
          <p className="mt-1">{labels.coreBlockedBody}</p>
        </div>
      )}

      <nav aria-label={labels.tabsAria} className="-mx-1 mb-6 overflow-x-auto px-1">
        <ul className="flex min-w-max flex-nowrap gap-1 rounded-xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface-muted)] p-0.5">
          {tabs.map((item) => {
            const active = item.id === tab;
            return (
              <li key={item.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setTab(item.id)}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex min-h-10 items-center whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--aipify-focus-ring)] ${
                    active
                      ? "bg-[color:var(--aipify-companion-purple)] font-semibold text-white shadow-sm"
                      : "text-[color:var(--aipify-text-secondary)] hover:bg-[color:var(--aipify-surface)] hover:text-[color:var(--aipify-text)]"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {(tab === "all" || tab === "mine") && (
        <section className="space-y-6">
          <div className="grid gap-3 rounded-xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] p-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
            <label className="text-sm">
              <span className="mb-1 block text-xs font-medium text-[color:var(--aipify-text-secondary)]">
                {labels.search}
              </span>
              <input
                type="search"
                className={inputClass}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={labels.searchPlaceholder}
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-xs font-medium text-[color:var(--aipify-text-secondary)]">
                {labels.status}
              </span>
              <select
                className={inputClass}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">{labels.filterAll}</option>
                {Object.entries(labels.statusLabels).map(([code, label]) => (
                  <option key={code} value={code}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-xs font-medium text-[color:var(--aipify-text-secondary)]">
                {labels.priority}
              </span>
              <select
                className={inputClass}
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="">{labels.filterAll}</option>
                {Object.entries(labels.priorityLabels).map(([code, label]) => (
                  <option key={code} value={code}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-xs font-medium text-[color:var(--aipify-text-secondary)]">
                {labels.channel}
              </span>
              <select
                className={inputClass}
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
              >
                <option value="">{labels.filterAll}</option>
                {Object.entries(labels.channelLabels).map(([code, label]) => (
                  <option key={code} value={code}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-end">
              <button
                type="button"
                className={`${secondaryButtonClass} w-full lg:w-auto`}
                onClick={() => void loadTickets()}
              >
                {labels.refresh}
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <KpiCard label={labels.kpiNew} kpi={kpis.open} labels={labels} />
            <KpiCard label={labels.kpiInProgress} kpi={kpis.inProgress} labels={labels} />
            <KpiCard label={labels.kpiWaiting} kpi={kpis.waiting} labels={labels} />
            <KpiCard label={labels.kpiCritical} kpi={kpis.critical} labels={labels} />
            <KpiCard label={labels.kpiResolved} kpi={kpis.resolved} labels={labels} />
          </div>
          <p className="text-xs text-[color:var(--aipify-text-secondary)]">
            {labels.kpiSourceNote}
            {kpis.usesLoadedPage ? ` ${labels.kpiPageNote}` : ""}
          </p>
          {tab === "mine" ? (
            <p className="text-xs text-[color:var(--aipify-text-secondary)]">
              {labels.mineScopeNote}
            </p>
          ) : null}

          <FlashMessage flash={flash} />

          {renderListArea()}
        </section>
      )}

      {tab === "templates" && (
        <div className="space-y-4">
          {selectedId ? (
            <p className="rounded-lg border border-violet-200 bg-violet-50/60 px-3 py-2 text-sm text-[color:var(--aipify-text)]">
              {labels.reply.draft}: {ticketReference(selectedId)}
            </p>
          ) : null}
          <FlashMessage flash={flash} />
          <SupportTemplatesTab
            labels={labels}
            templates={allTemplates}
            persistConfigured={templatesPersist}
            onReload={loadTemplates}
            onInsert={insertTemplate}
          />
        </div>
      )}

      {tab === "signature" && (
        <SupportSignatureTab
          labels={labels}
          stored={signatureStored}
          onStored={(next) =>
            setSignatureStored({
              signature: next.signature,
              customized: next.customized,
              loaded: true,
              loadFailed: false,
            })
          }
        />
      )}

      {tab === "channels" && (
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-[color:var(--aipify-text)]">
              {labels.channels.title}
            </h2>
            <p className="mt-1 text-sm text-[color:var(--aipify-text-secondary)]">
              {labels.channels.subtitle}
            </p>
            <p className="mt-2 text-sm text-amber-900">{labels.channels.emailSendBlocked}</p>
          </div>
          <ul className="grid gap-3 md:grid-cols-2">
            {channels.map((ch) => {
              const statusLabel =
                ch.status === "active"
                  ? labels.channels.active
                  : ch.status === "incoming_live"
                    ? labels.channels.incomingLive
                    : ch.status === "staging_only"
                      ? labels.channels.stagingOnly
                      : ch.status === "prepared_only"
                        ? labels.channels.preparedOnly
                        : labels.channels.notActivated;
              const copy = {
                web: [
                  labels.channels.web,
                  ch.noteKey === "channels.webNoteLive"
                    ? labels.channels.webNoteLive
                    : labels.channels.webNote,
                ],
                app: [labels.channels.app, labels.channels.appNote],
                partner: [
                  labels.channels.partner,
                  ch.noteKey === "channels.partnerNoteLive"
                    ? labels.channels.partnerNoteLive
                    : labels.channels.partnerNote,
                ],
                module: [labels.channels.module, labels.channels.moduleNote],
                kompis: [labels.channels.kompis, labels.channels.kompisNote],
              }[ch.id as "web" | "app" | "partner" | "module" | "kompis"];
              const tone =
                ch.status === "active" || ch.status === "incoming_live"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                  : ch.status === "prepared_only" || ch.status === "staging_only"
                    ? "border-sky-200 bg-sky-50 text-sky-900"
                    : "border-slate-200 bg-slate-50 text-slate-800";
              return (
                <li key={ch.id} className={`rounded-xl border p-4 ${tone}`}>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold">{copy[0]}</h3>
                    <span className="inline-flex flex-col items-end gap-0.5 text-xs font-medium">
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          aria-hidden
                          className="h-1.5 w-1.5 rounded-full bg-current opacity-70"
                        />
                        {statusLabel}
                      </span>
                      {ch.runtimeHealth === "unverified" ? (
                        <span className="font-normal opacity-80">
                          {labels.channels.runtimeUnverified}
                        </span>
                      ) : null}
                    </span>
                  </div>
                  <p className="mt-2 text-sm opacity-90">{copy[1]}</p>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
