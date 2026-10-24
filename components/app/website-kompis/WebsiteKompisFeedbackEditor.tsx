"use client";

import Link from "next/link";
import { Ban, Trash2 } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaqPermanentExpiryFields } from "@/components/app/website-kompis/FaqPermanentExpiryFields";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { runFaqPublishFlow } from "@/lib/website-kompis-faq/publish-flow";
import { FaqContentLanguagePicker } from "@/components/app/website-kompis/FaqContentLanguagePicker";
import { planWebsiteKompisFaqPublish, resolveFaqExpiryForSave } from "@/lib/website-kompis-faq/safety";
import type { WebsiteKompisFeedbackLabels } from "@/lib/website-kompis-feedback/labels";
import { existingPublishedFaqHref, resolveFeedbackDrawerClose } from "@/lib/website-kompis-feedback/drawer-close";
import {
  buildPublishedDispositionCall,
  buildRejectDispositionCall,
  retryFaqId,
  shouldRemoveReviewCard,
} from "@/lib/website-kompis-feedback/disposition";
import {
  canOfferFeedbackReviewClose,
  FEEDBACK_REVIEW_DISPOSITION_READY,
  type FeedbackOpsRow,
} from "@/lib/website-kompis-feedback/operations-model";
import { proposedFaqAnswerSeed, reviewReasonOk } from "@/lib/website-kompis-feedback/review-outcome";
import {
  buildFeedbackFaqWriteBody,
  feedbackFaqWriteAllowed,
  presentReviewAfterFaqPublish,
  removalStatusWhileDispositionOff,
  selectFaqMatchForInstall,
  sourceUrlMatchesPersisted,
  type FaqListCandidate,
  type FaqLookup,
} from "@/lib/website-kompis-feedback/ui-truth";

type SiteOption = { installId: string; domain: string };

type SavedDraft = { id: string; status: string };

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function WebsiteKompisFeedbackEditor({
  row,
  labels,
  onClose,
  closeReady = false,
  onReviewClosed,
}: {
  row: FeedbackOpsRow;
  labels: WebsiteKompisFeedbackLabels;
  onClose: () => void;
  closeReady?: boolean;
  onReviewClosed?: () => Promise<void> | void;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);
  const busy = useRef(false);
  const [question, setQuestion] = useState(row.questionPreview);
  const [answer, setAnswer] = useState<string>(proposedFaqAnswerSeed());
  const [locale, setLocale] = useState(row.locale?.trim() || "");
  const [publicSafe, setPublicSafe] = useState(false);
  const [category, setCategory] = useState("");
  const [permanent, setPermanent] = useState(true);
  const [validFrom, setValidFrom] = useState<string | null>(null);
  const [validUntil, setValidUntil] = useState<string | null>(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [reviewOpenAfterPublish, setReviewOpenAfterPublish] = useState(false);
  const [sites, setSites] = useState<SiteOption[]>([]);
  const [siteState, setSiteState] = useState<"loading" | "ready" | "empty">("loading");
  const [installId, setInstallId] = useState("");
  const [saved, setSaved] = useState<SavedDraft | null>(null);
  const [savedSnapshot, setSavedSnapshot] = useState("");
  const [matchingPublishedId, setMatchingPublishedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmClose, setConfirmClose] = useState(false);
  const [confirmReviewClose, setConfirmReviewClose] = useState(false);
  const [closingReview, setClosingReview] = useState(false);
  const [confirmReject, setConfirmReject] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [reviewReason, setReviewReason] = useState("");
  const [confirmDuplicate, setConfirmDuplicate] = useState(false);
  const [linkingExisting, setLinkingExisting] = useState(false);
  const reviewCloseLock = useRef(false);
  const canCloseReview = canOfferFeedbackReviewClose(row, closeReady);
  const removalUnavailable =
    removalStatusWhileDispositionOff({
      dispositionReady: FEEDBACK_REVIEW_DISPOSITION_READY,
      vote: row.vote,
      reviewDisposition: row.reviewDisposition,
      reviewStatus: row.reviewStatus,
    }) === "explain_unavailable";
  const canRejectSpam =
    FEEDBACK_REVIEW_DISPOSITION_READY &&
    row.vote === "not_helpful" &&
    row.reviewDisposition !== "published" &&
    row.reviewDisposition !== "retrieval_unresolved" &&
    row.reviewDisposition !== "rejected" &&
    row.reviewDisposition !== "duplicate" &&
    row.reviewStatus !== "closed";
  const openedFields = useRef({
    question: row.questionPreview,
    answer: proposedFaqAnswerSeed(),
    locale: row.locale?.trim() || "",
    publicSafe: false,
    category: "",
    permanent: true,
    validFrom: null as string | null,
    validUntil: null as string | null,
    sourceUrl: "",
  });
  const fieldSnapshot = JSON.stringify({
    question,
    answer,
    locale,
    publicSafe,
    category,
    permanent,
    validFrom,
    validUntil,
    sourceUrl,
  });
  const dirty = fieldSnapshot !== (savedSnapshot || JSON.stringify(openedFields.current));
  const requestCloseRef = useRef<() => void>(() => {});

  const requestClose = useCallback(() => {
    if (confirmReviewClose) {
      if (!closingReview) setConfirmReviewClose(false);
      return;
    }
    const decision = resolveFeedbackDrawerClose({ dirty, confirmVisible: confirmClose });
    if (decision === "confirm") {
      setConfirmClose(true);
      return;
    }
    onClose();
  }, [closingReview, confirmClose, confirmReviewClose, dirty, onClose]);
  requestCloseRef.current = requestClose;

  useEffect(() => {
    restoreFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = panelRef.current;
    const items = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter(
        (el) => !el.hasAttribute("disabled"),
      );
    items()[0]?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        requestCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const focusables = items();
      if (focusables.length === 0) return;
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      const editButton = document.querySelector<HTMLElement>(
        `[data-feedback-edit="${CSS.escape(row.id)}"]`,
      );
      (editButton ?? restoreFocus.current)?.focus();
    };
  }, [row.id]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const response = await fetch("/api/website-kompis/sites");
        if (!response.ok) {
          if (!cancelled) setSiteState("empty");
          return;
        }
        const payload = (await response.json()) as { sites?: SiteOption[] };
        const next = (payload.sites ?? []).filter((site) => site.installId && site.domain);
        if (cancelled) return;
        setSites(next);
        if (next.length === 1) setInstallId(next[0]!.installId);
        setSiteState(next.length === 0 ? "empty" : "ready");
      } catch {
        if (!cancelled) setSiteState("empty");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function findExisting(): Promise<FaqLookup> {
    if (!installId) return "lookup_failed";
    const params = new URLSearchParams();
    params.set("query", question.trim().slice(0, 180));
    params.set("installId", installId);
    params.set("limit", "100");
    if (locale.trim()) params.set("locale", locale.trim());
    const response = await fetch(`/api/website-kompis/faq?${params.toString()}`);
    if (!response.ok) return "lookup_failed";
    const payload = (await response.json()) as { items?: FaqListCandidate[] };
    return selectFaqMatchForInstall(payload.items ?? [], {
      question,
      locale,
      installId,
    });
  }

  async function confirmStoredSourceUrl(itemId: string, sent: string | null): Promise<boolean> {
    const params = new URLSearchParams();
    params.set("query", question.trim().slice(0, 180));
    params.set("installId", installId);
    params.set("limit", "100");
    const response = await fetch(`/api/website-kompis/faq?${params.toString()}`);
    if (!response.ok) return false;
    const payload = (await response.json()) as { items?: FaqListCandidate[] };
    const item = (payload.items ?? []).find((entry) => entry.id === itemId);
    if (!item || !sourceUrlMatchesPersisted(sent, item.sourceUrl ?? null)) return false;
    setSourceUrl(item.sourceUrl?.trim() ?? "");
    return true;
  }

  async function saveDraft(forcedId?: string | null): Promise<SavedDraft | null> {
    if (busy.current) return null;
    busy.current = true;
    if (!question.trim() || !answer.trim() || !locale.trim()) {
      busy.current = false;
      setError(labels.quality.saveError);
      return null;
    }
    if (!installId) {
      busy.current = false;
      setError(labels.quality.siteRequired);
      return null;
    }
    const expiry = resolveFaqExpiryForSave({ permanent, validFrom, validUntil });
    if (!expiry.ok) {
      busy.current = false;
      setError(expiry.reason === "window" ? labels.quality.expiryWindow : labels.quality.permanentEndRequired);
      return null;
    }
    setSaving(true);
    try {
      let itemId = forcedId ?? (saved ? saved.id : null);
      if (!itemId) {
        const existing = await findExisting();
        if (!feedbackFaqWriteAllowed(existing, itemId)) {
          if (existing !== "lookup_failed" && existing.kind === "published") {
            setMatchingPublishedId(existing.id);
            setReviewOpenAfterPublish(false);
          } else {
            setError(labels.quality.saveError);
          }
          return null;
        }
        if (existing !== "lookup_failed" && existing.kind === "draft") itemId = existing.id;
      }
      const writeBody = buildFeedbackFaqWriteBody({
        itemId,
        installId,
        locale,
        question,
        answer,
        category,
        publicSafe,
        sourceUrl,
        validFrom: expiry.validFrom,
        validUntil: expiry.validUntil,
      });
      const response = await fetch("/api/website-kompis/faq", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(writeBody),
      });
      const payload = (await response.json()) as { id?: string; status?: string; error?: string };
      if (!response.ok || !payload.id || !payload.status) {
        setError(labels.quality.saveError);
        return null;
      }
      const next = { id: payload.id, status: payload.status };
      setSaved(next);
      setSavedSnapshot(fieldSnapshot);
      if (writeBody.sourceUrl) {
        const confirmed = await confirmStoredSourceUrl(payload.id, writeBody.sourceUrl);
        if (!confirmed) {
          setError(labels.quality.sourceUrlUnconfirmed);
          setMessage(null);
          return null;
        }
      }
      setError(null);
      if (next.status === "draft") setMessage(labels.quality.savedDraft);
      return next;
    } catch {
      setError(labels.quality.saveError);
      return null;
    } finally {
      busy.current = false;
      setSaving(false);
    }
  }

  function showFaqPublishedReviewOpen() {
    const presentation = presentReviewAfterFaqPublish({ dispositionReady: false });
    if (presentation.closeDrawer || presentation.removeReviewCard) return;
    setReviewOpenAfterPublish(true);
    setMessage(null);
  }

  async function publishFaq() {
    if (busy.current || saving || publishing) return;
    setPublishing(true);
    if (!question.trim() || !answer.trim() || !locale.trim() || !publicSafe) {
      setPublishing(false);
      setError(labels.quality.privacy);
      return;
    }
    if (!installId) {
      setPublishing(false);
      setError(labels.quality.siteRequired);
      return;
    }
    const expiry = resolveFaqExpiryForSave({ permanent, validFrom, validUntil });
    if (!expiry.ok) {
      setPublishing(false);
      setError(expiry.reason === "window" ? labels.quality.expiryWindow : labels.quality.permanentEndRequired);
      return;
    }
    let existing: FaqLookup;
    try {
      existing = await findExisting();
    } catch {
      setPublishing(false);
      setError(labels.quality.publishError);
      return;
    }
    if (!feedbackFaqWriteAllowed(existing, saved?.id ?? null)) {
      if (existing !== "lookup_failed" && existing.kind === "published") {
        setMatchingPublishedId(existing.id);
        setReviewOpenAfterPublish(false);
      } else {
        setError(labels.quality.publishError);
      }
      setPublishing(false);
      return;
    }
    setError(null);
    setMessage(null);
    setMatchingPublishedId(null);
    const knownId =
      saved?.id ?? (existing !== "lookup_failed" && existing.kind === "draft" ? existing.id : null);
    const status =
      saved?.status === "published" || (existing !== "lookup_failed" && existing.kind === "published")
        ? "published"
        : "new";
    const plan = planWebsiteKompisFaqPublish({
      status,
      title: question,
      answer,
      locale,
      contentType: "faq",
      publicSafe,
      validFrom: expiry.validFrom,
      validUntil: expiry.validUntil,
    });
    if (plan === "blocked") {
      setPublishing(false);
      setError(labels.quality.privacy);
      return;
    }
    setPublishing(true);
    setSaving(true);
    try {
      const result = await runFaqPublishFlow({
        plan,
        save: () => saveDraft(knownId),
        publish: async (id) => {
          const response = await fetch(`/api/website-kompis/faq/${id}/publish`, { method: "POST" });
          const payload = (await response.json()) as { id?: string; status?: string };
          return { ok: response.ok, id: payload.id, status: payload.status };
        },
      });
      if (result.outcome === "draft_saved_publish_failed") {
        setSaved({ id: result.id, status: "draft" });
        setSavedSnapshot(fieldSnapshot);
        setError(labels.quality.publishRetry);
        return;
      }
      if (result.outcome === "save_failed") return;
      if (result.outcome !== "published" && result.outcome !== "revised") {
        setError(labels.quality.publishError);
        return;
      }
      setSaved({ id: result.id, status: "published" });
      setSavedSnapshot(fieldSnapshot);
      if (
        FEEDBACK_REVIEW_DISPOSITION_READY &&
        row.reviewDisposition !== "published" &&
        row.reviewDisposition !== "rejected" &&
        row.reviewStatus !== "closed"
      ) {
        const reusedFaqId = retryFaqId(result.id);
        const call = buildPublishedDispositionCall({
          feedbackId: row.id,
          faqItemId: reusedFaqId ?? "",
          feedbackInstallId: row.installId ?? "",
          faqInstallId: installId,
          publishStatus: "published",
        });
        if (!call.ok) {
          setReviewOpenAfterPublish(true);
          setMessage(null);
          return;
        }
        const response = await fetch(`/api/website-kompis/feedback/${row.id}/disposition`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            action: "published",
            faqItemId: reusedFaqId,
            feedbackInstallId: row.installId ?? "",
            faqInstallId: installId,
            publishStatus: "published",
            confirmation: true,
          }),
        });
        const payload = (await response.json()) as { reviewDisposition?: string; code?: string };
        const presentation = presentReviewAfterFaqPublish({
          dispositionReady: true,
          dispositionHttpStatus: response.status,
          dispositionCode: payload.code,
          reviewDisposition: payload.reviewDisposition,
        });
        const cardLeaves = shouldRemoveReviewCard({
          httpOk: response.ok,
          reviewDisposition: payload.reviewDisposition,
          expected: "published",
        });
        if (presentation.removeReviewCard && presentation.closeDrawer && cardLeaves) {
          setReviewOpenAfterPublish(false);
          await onReviewClosed?.();
          return;
        }
        setReviewOpenAfterPublish(true);
        setMessage(null);
        return;
      }
      if (
        row.reviewDisposition === "published" ||
        row.reviewDisposition === "rejected" ||
        row.reviewStatus === "closed"
      ) {
        setReviewOpenAfterPublish(false);
        setMessage(labels.quality.publishedOk);
        return;
      }
      showFaqPublishedReviewOpen();
    } catch {
      setError(labels.quality.publishError);
    } finally {
      setPublishing(false);
      setSaving(false);
    }
  }

  async function closeReview() {
    if (!canCloseReview || reviewCloseLock.current || closingReview) return;
    reviewCloseLock.current = true;
    setClosingReview(true);
    setError(null);
    try {
      const response = await fetch(`/api/website-kompis/feedback/${row.id}/close`, { method: "POST" });
      const payload = (await response.json()) as { reviewStatus?: string; code?: string };
      if (!response.ok || payload.reviewStatus !== "closed") {
        setError(labels.quality.removeFromReviewError);
        return;
      }
      setConfirmReviewClose(false);
      await onReviewClosed?.();
    } catch {
      setError(labels.quality.removeFromReviewError);
    } finally {
      reviewCloseLock.current = false;
      setClosingReview(false);
    }
  }

  async function postCaseDisposition(body: Record<string, unknown>) {
    return fetch(`/api/website-kompis/feedback/${row.id}/disposition`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  async function rejectSpam() {
    if (!canRejectSpam || rejecting || !reviewReasonOk(reviewReason)) return;
    const call = buildRejectDispositionCall(row.id, reviewReason);
    if (!call.ok) {
      setError(labels.quality.rejectSpamError);
      return;
    }
    setRejecting(true);
    setError(null);
    try {
      const response = await postCaseDisposition({
        action: "rejected",
        reason: call.args.p_reason,
        confirmation: true,
      });
      const payload = (await response.json()) as { reviewDisposition?: string };
      if (
        !shouldRemoveReviewCard({
          httpOk: response.ok,
          reviewDisposition: payload.reviewDisposition,
          expected: "rejected",
        })
      ) {
        setError(labels.quality.rejectSpamError);
        return;
      }
      setConfirmReject(false);
      await onReviewClosed?.();
    } catch {
      setError(labels.quality.rejectSpamError);
    } finally {
      setRejecting(false);
    }
  }

  async function markDuplicate() {
    if (!canRejectSpam || rejecting || !reviewReasonOk(reviewReason)) return;
    setRejecting(true);
    setError(null);
    try {
      const response = await postCaseDisposition({
        action: "duplicate",
        reason: reviewReason.trim(),
        confirmation: true,
      });
      const payload = (await response.json()) as { reviewDisposition?: string };
      if (
        !shouldRemoveReviewCard({
          httpOk: response.ok,
          reviewDisposition: payload.reviewDisposition,
          expected: "duplicate",
        })
      ) {
        setError(labels.quality.rejectSpamError);
        return;
      }
      setConfirmDuplicate(false);
      await onReviewClosed?.();
    } catch {
      setError(labels.quality.rejectSpamError);
    } finally {
      setRejecting(false);
    }
  }

  async function linkExistingFaq() {
    if (!canRejectSpam || !matchingPublishedId || linkingExisting || !reviewReasonOk(reviewReason)) return;
    setLinkingExisting(true);
    setError(null);
    try {
      const response = await postCaseDisposition({
        action: "retrieval_unresolved",
        faqItemId: matchingPublishedId,
        reason: reviewReason.trim(),
        confirmation: true,
      });
      const payload = (await response.json()) as { reviewDisposition?: string };
      if (
        !shouldRemoveReviewCard({
          httpOk: response.ok,
          reviewDisposition: payload.reviewDisposition,
          expected: "retrieval_unresolved",
        })
      ) {
        setError(labels.quality.linkExistingError);
        return;
      }
      await onReviewClosed?.();
    } catch {
      setError(labels.quality.linkExistingError);
    } finally {
      setLinkingExisting(false);
    }
  }

  const drawer = (
    <div className="fixed inset-0 z-[80] flex justify-end" role="presentation">
      <button
        type="button"
        className="absolute inset-0 z-0 cursor-default bg-slate-900/40"
        aria-label={labels.detailClose}
        onClick={requestClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(event) => event.stopPropagation()}
        className="relative z-10 flex h-dvh w-full max-w-xl flex-col overflow-hidden border-l border-slate-200 bg-white text-[var(--app-text)] shadow-xl"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
          <h2 id={titleId} className="text-lg font-semibold text-slate-900">
            {labels.openDetail}
          </h2>
          <button
            type="button"
            onClick={requestClose}
            className="rounded-lg px-2 py-1 text-sm text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7357e8]"
          >
            {labels.detailClose}
          </button>
        </div>

        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={(event) => {
            event.preventDefault();
            void saveDraft();
          }}
        >
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain bg-white px-5 py-5 sm:px-6">
            {row.comment?.trim() ? (
              <p className="text-sm text-slate-600">{row.comment.trim()}</p>
            ) : null}
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-900">{labels.quality.proposedQuestion}</span>
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7357e8]"
              />
            </label>
            {row.answerPreview.trim() ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm">
                <p className="font-medium text-slate-900">{labels.quality.originalAnswer}</p>
                <p className="mt-1 whitespace-pre-wrap text-slate-700">{row.answerPreview}</p>
              </div>
            ) : null}
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-900">{labels.quality.proposedAnswer}</span>
              <textarea
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                rows={5}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7357e8]"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-900">{labels.quality.category}</span>
              <input
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7357e8]"
              />
            </label>
            <div className="block text-sm">
              <span className="mb-1 block font-medium text-slate-900">{labels.quality.language}</span>
              <FaqContentLanguagePicker
                value={locale}
                onChange={setLocale}
                labels={labels.quality.languages}
                searchLabel={labels.quality.languageSearch}
                noMatchLabel={labels.quality.languageNoMatch}
                listLabel={labels.quality.languageList}
                collationLocale={labels.quality.languageCollation}
                allowEmpty
                emptyLabel={labels.quality.chooseLanguage}
              />
            </div>
            {siteState === "ready" && sites.length > 1 ? (
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-slate-900">{labels.quality.site}</span>
                <select
                  value={installId}
                  onChange={(event) => setInstallId(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7357e8]"
                >
                  <option value="">{labels.quality.siteRequired}</option>
                  {sites.map((site) => (
                    <option key={site.installId} value={site.installId}>
                      {site.domain}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            {siteState === "ready" && sites.length === 1 ? (
              <p className="text-sm text-slate-600">
                {labels.quality.site}: {sites[0]?.domain}
              </p>
            ) : null}
            {siteState === "empty" ? <p className="text-sm text-slate-900">{labels.quality.noSite}</p> : null}
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-900">{labels.quality.sourceUrl}</span>
              <input
                type="url"
                inputMode="url"
                value={sourceUrl}
                onChange={(event) => setSourceUrl(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7357e8]"
              />
            </label>
            <FaqPermanentExpiryFields
              permanent={permanent}
              validFrom={validFrom}
              validUntil={validUntil}
              labels={{
                permanent: labels.quality.permanent,
                permanentHelp: labels.quality.permanentHelp,
                validFrom: labels.quality.validFrom,
                validUntil: labels.quality.validUntil,
              }}
              onPermanentChange={(next) => {
                setPermanent(next);
                if (next) setValidUntil(null);
              }}
              onValidFromChange={setValidFrom}
              onValidUntilChange={setValidUntil}
            />
            <label className="flex items-start gap-2 text-sm text-slate-900">
              <input
                type="checkbox"
                checked={publicSafe}
                onChange={(event) => setPublicSafe(event.target.checked)}
                className="mt-1 h-4 w-4 accent-[#7357e8]"
              />
              <span>{labels.quality.publicSafe}</span>
            </label>
            <p className="text-sm leading-relaxed text-slate-600">{labels.quality.privacy}</p>
            <p className="text-sm leading-relaxed text-slate-600">{labels.suggestFaqWarning}</p>
            {reviewOpenAfterPublish ? (
              <div
                role="status"
                className="rounded-xl border border-[#F5D4A3] bg-[#FFF4E5] px-3 py-3 text-sm text-[#624422]"
              >
                <p className="font-medium text-[#20243E]">{labels.quality.publishedOk}</p>
                <p className="mt-1">{labels.quality.publishedReviewStillOpen}</p>
              </div>
            ) : null}
            {matchingPublishedId ? (
              <div role="status" className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900">
                <p>{labels.quality.matchingPublished}</p>
                <Link
                  href={existingPublishedFaqHref(
                    FOUNDATION_NAV_BINDINGS.kompisWebFaq,
                    matchingPublishedId,
                    question,
                  )}
                  className="mt-2 inline-flex min-h-11 items-center font-medium text-[#7357e8] underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7357e8]"
                >
                  {labels.quality.openExistingFaq}
                </Link>
                {canRejectSpam ? (
                  <div className="mt-3 space-y-2">
                    <label className="block text-sm">
                      <span className="mb-1 block font-medium text-slate-900">{labels.quality.reviewReason}</span>
                      <textarea
                        value={reviewReason}
                        onChange={(event) => setReviewReason(event.target.value)}
                        rows={2}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7357e8]"
                      />
                    </label>
                    <button
                      type="button"
                      disabled={linkingExisting || !reviewReasonOk(reviewReason)}
                      onClick={() => void linkExistingFaq()}
                      className="inline-flex min-h-11 items-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7357e8] disabled:opacity-60"
                    >
                      {labels.quality.linkExistingFaq}
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
            {message ? (
              <p className="text-sm text-[#1f7a4d]" role="status">
                {message}
              </p>
            ) : null}
            {error ? (
              <p className="text-sm text-slate-900" role="alert">
                {error}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2 border-t border-slate-200 bg-white px-5 py-4 sm:px-6">
            {removalUnavailable ? (
              <p className="basis-full text-sm leading-relaxed text-slate-600">{labels.quality.removalUnavailable}</p>
            ) : null}
            <button
              type="submit"
              disabled={saving || siteState === "empty"}
              className="inline-flex min-h-11 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7357e8] disabled:opacity-60"
            >
              {saving ? labels.quality.saving : labels.quality.saveDraft}
            </button>
            <button
              type="button"
              disabled={saving || publishing || !publicSafe || siteState === "empty"}
              onClick={() => void publishFaq()}
              className="inline-flex min-h-11 items-center rounded-xl bg-[#7357e8] px-4 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7357e8] disabled:opacity-60"
            >
              {publishing ? labels.quality.publishing : labels.quality.publishFaq}
            </button>
            {canRejectSpam ? (
              <button
                type="button"
                disabled={saving || publishing || rejecting}
                onClick={() => setConfirmReject(true)}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7357e8] disabled:opacity-60"
              >
                <Ban aria-hidden className="size-4" strokeWidth={2} />
                {labels.quality.rejectSpam}
              </button>
            ) : null}
            {canRejectSpam ? (
              <button
                type="button"
                disabled={saving || publishing || rejecting}
                onClick={() => setConfirmDuplicate(true)}
                className="inline-flex min-h-11 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7357e8] disabled:opacity-60"
              >
                {labels.quality.markDuplicate}
              </button>
            ) : null}
            {canCloseReview ? (
              <button
                type="button"
                disabled={saving || publishing || closingReview}
                onClick={() => setConfirmReviewClose(true)}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#F3C1C1] bg-white px-4 text-sm font-medium text-[#9F1239] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7357e8] disabled:opacity-60"
              >
                <Trash2 aria-hidden className="size-4" strokeWidth={2} />
                {labels.quality.removeFromReview}
              </button>
            ) : null}
          </div>
        </form>
        {confirmReviewClose ? (
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={`${titleId}-close-review`}
            className="absolute inset-0 z-30 flex items-end bg-white p-4 sm:items-center sm:justify-center"
          >
            <div className="w-full rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
              <h3 id={`${titleId}-close-review`} className="text-base font-semibold text-slate-900">
                {labels.quality.removeFromReviewTitle}
              </h3>
              <p className="mt-2 text-sm text-slate-700">{labels.quality.removeFromReviewBody}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={closingReview}
                  onClick={() => setConfirmReviewClose(false)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7357e8]"
                >
                  {labels.quality.removeFromReviewCancel}
                </button>
                <button
                  type="button"
                  disabled={closingReview}
                  onClick={() => void closeReview()}
                  className="rounded-lg border border-[#F3C1C1] bg-white px-3 py-2 text-sm font-medium text-[#9F1239] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7357e8] disabled:opacity-60"
                >
                  {closingReview ? labels.quality.removing : labels.quality.removeFromReviewConfirm}
                </button>
              </div>
            </div>
          </div>
        ) : null}
        {confirmReject ? (
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={`${titleId}-reject-spam`}
            className="absolute inset-0 z-30 flex items-end bg-white p-4 sm:items-center sm:justify-center"
          >
            <div className="w-full rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
              <h3 id={`${titleId}-reject-spam`} className="text-base font-semibold text-slate-900">
                {labels.quality.rejectSpamTitle}
              </h3>
              <p className="mt-2 text-sm text-slate-700">{labels.quality.rejectSpamBody}</p>
              <label className="mt-3 block text-sm">
                <span className="mb-1 block font-medium text-slate-900">{labels.quality.reviewReason}</span>
                <textarea
                  value={reviewReason}
                  onChange={(event) => setReviewReason(event.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7357e8]"
                />
              </label>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmReject(false)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7357e8]"
                >
                  {labels.quality.removeFromReviewCancel}
                </button>
                <button
                  type="button"
                  disabled={rejecting || !reviewReasonOk(reviewReason)}
                  onClick={() => void rejectSpam()}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7357e8] disabled:opacity-60"
                >
                  {labels.quality.rejectSpamConfirm}
                </button>
              </div>
            </div>
          </div>
        ) : null}
        {confirmDuplicate ? (
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={`${titleId}-duplicate`}
            className="absolute inset-0 z-30 flex items-end bg-white p-4 sm:items-center sm:justify-center"
          >
            <div className="w-full rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
              <h3 id={`${titleId}-duplicate`} className="text-base font-semibold text-slate-900">
                {labels.quality.markDuplicateTitle}
              </h3>
              <p className="mt-2 text-sm text-slate-700">{labels.quality.markDuplicateBody}</p>
              <label className="mt-3 block text-sm">
                <span className="mb-1 block font-medium text-slate-900">{labels.quality.reviewReason}</span>
                <textarea
                  value={reviewReason}
                  onChange={(event) => setReviewReason(event.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7357e8]"
                />
              </label>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmDuplicate(false)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7357e8]"
                >
                  {labels.quality.removeFromReviewCancel}
                </button>
                <button
                  type="button"
                  disabled={rejecting || !reviewReasonOk(reviewReason)}
                  onClick={() => void markDuplicate()}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7357e8] disabled:opacity-60"
                >
                  {labels.quality.markDuplicate}
                </button>
              </div>
            </div>
          </div>
        ) : null}
        {confirmClose ? (
          <div
            data-feedback-drawer-confirm
            className="absolute inset-0 z-20 flex items-end bg-white p-4 sm:items-center sm:justify-center"
          >
            <div className="w-full rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
              <p className="text-sm text-slate-900">{labels.quality.dirtyLeave}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmClose(false)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7357e8]"
                >
                  {labels.quality.stay}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7357e8]"
                >
                  {labels.quality.discard}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );

  return createPortal(drawer, document.body);
}
