"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaqPermanentExpiryFields } from "@/components/app/website-kompis/FaqPermanentExpiryFields";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { runFaqPublishFlow } from "@/lib/website-kompis-faq/publish-flow";
import { FaqContentLanguagePicker } from "@/components/app/website-kompis/FaqContentLanguagePicker";
import { planWebsiteKompisFaqPublish, resolveFaqExpiryForSave } from "@/lib/website-kompis-faq/safety";
import type { WebsiteKompisFeedbackLabels } from "@/lib/website-kompis-feedback/labels";
import type { FeedbackOpsRow } from "@/lib/website-kompis-feedback/operations-model";

type SiteOption = { installId: string; domain: string };

type SavedDraft = { id: string; status: string };

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function WebsiteKompisFeedbackEditor({
  row,
  labels,
  onClose,
  onPublished,
}: {
  row: FeedbackOpsRow;
  labels: WebsiteKompisFeedbackLabels;
  onClose: () => void;
  onPublished: (faqId: string) => void;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);
  const busy = useRef(false);
  const [question, setQuestion] = useState(row.questionPreview);
  const [answer, setAnswer] = useState(row.answerPreview);
  const [locale, setLocale] = useState(row.locale?.trim() || "");
  const [publicSafe, setPublicSafe] = useState(false);
  const [category, setCategory] = useState("");
  const [permanent, setPermanent] = useState(true);
  const [validFrom, setValidFrom] = useState<string | null>(null);
  const [validUntil, setValidUntil] = useState<string | null>(null);
  const [sites, setSites] = useState<SiteOption[]>([]);
  const [siteState, setSiteState] = useState<"loading" | "ready" | "empty">("loading");
  const [installId, setInstallId] = useState("");
  const [saved, setSaved] = useState<SavedDraft | null>(null);
  const [savedSnapshot, setSavedSnapshot] = useState("");
  const [matchingPublished, setMatchingPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmClose, setConfirmClose] = useState(false);
  const openedFields = useRef({
    question: row.questionPreview,
    answer: row.answerPreview,
    locale: row.locale?.trim() || "",
    publicSafe: false,
    category: "",
    permanent: true,
    validFrom: null as string | null,
    validUntil: null as string | null,
  });
  const fieldSnapshot = JSON.stringify({ question, answer, locale, publicSafe, category, permanent, validFrom, validUntil });
  const dirty = fieldSnapshot !== (savedSnapshot || JSON.stringify(openedFields.current));
  const requestCloseRef = useRef<() => void>(() => {});

  const requestClose = useCallback(() => {
    if (dirty) {
      setConfirmClose(true);
      return;
    }
    onClose();
  }, [dirty, onClose]);
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
      restoreFocus.current?.focus();
    };
  }, []);

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

  async function findExisting(): Promise<
    { kind: "published"; id: string } | { kind: "draft"; id: string } | { kind: "none" }
  > {
    const params = new URLSearchParams();
    params.set("query", question.trim().slice(0, 180));
    if (locale.trim()) params.set("locale", locale.trim());
    const response = await fetch(`/api/website-kompis/faq?${params.toString()}`);
    if (!response.ok) return { kind: "none" };
    const payload = (await response.json()) as {
      items?: Array<{ id?: string; title?: string; locale?: string; status?: string }>;
    };
    const match = (payload.items ?? []).find(
      (item) =>
        item.title?.trim() === question.trim() &&
        (item.locale ?? "").toLowerCase() === locale.trim().toLowerCase() &&
        Boolean(item.id),
    );
    if (!match?.id) return { kind: "none" };
    if (match.status === "published") return { kind: "published", id: match.id };
    if (match.status === "draft") return { kind: "draft", id: match.id };
    return { kind: "none" };
  }

  async function saveDraft(forcedId?: string | null): Promise<SavedDraft | null> {
    if (busy.current) return null;
    busy.current = true;
    setError(null);
    setMessage(null);
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
        if (existing.kind === "published") {
          setMatchingPublished(true);
          setError(labels.quality.matchingPublished);
          return null;
        }
        if (existing.kind === "draft") itemId = existing.id;
      }
      const response = await fetch("/api/website-kompis/faq", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          itemId,
          installId,
          locale: locale.trim(),
          title: question.trim(),
          question: question.trim(),
          answer: answer.trim(),
          contentType: "faq",
          category: category.trim(),
          publicSafe,
          priority: 100,
          tags: [],
          validFrom: expiry.validFrom,
          validUntil: expiry.validUntil,
        }),
      });
      const payload = (await response.json()) as { id?: string; status?: string; error?: string };
      if (!response.ok || !payload.id || !payload.status) {
        setError(labels.quality.saveError);
        return null;
      }
      const next = { id: payload.id, status: payload.status };
      setSaved(next);
      setSavedSnapshot(fieldSnapshot);
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

  async function publishFaq() {
    if (busy.current || saving || publishing) return;
    setPublishing(true);
    setError(null);
    setMessage(null);
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
    const existing = saved ? null : await findExisting();
    const knownId = saved?.id ?? (existing && existing.kind !== "none" ? existing.id : null);
    const status =
      saved?.status === "published" || existing?.kind === "published" ? "published" : "new";
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
      if (result.outcome !== "published" && result.outcome !== "revised") {
        setError(labels.quality.publishError);
        return;
      }
      setSaved({ id: result.id, status: "published" });
      setSavedSnapshot(fieldSnapshot);
      onPublished(result.id);
    } catch {
      setError(labels.quality.publishError);
    } finally {
      setPublishing(false);
      setSaving(false);
    }
  }

  const drawer = (
    <div className="fixed inset-0 z-[80] flex justify-end" role="presentation">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-slate-900/40"
        aria-label={labels.detailClose}
        onClick={requestClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
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
            {matchingPublished ? (
              <p className="text-sm text-slate-900">
                {labels.quality.matchingPublished}{" "}
                <Link href={FOUNDATION_NAV_BINDINGS.kompisWebFaq} className="font-medium text-[#7357e8] underline">
                  {labels.quality.openExistingFaq}
                </Link>
              </p>
            ) : null}
            {message ? <p className="text-sm text-[#1f7a4d]">{message}</p> : null}
            {error ? <p className="text-sm text-slate-900">{error}</p> : null}
            {confirmClose ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
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
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2 border-t border-slate-200 bg-white px-5 py-4 sm:px-6">
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
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(drawer, document.body);
}
