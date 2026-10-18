"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { canPublishWebsiteKompisFaqDraft } from "@/lib/website-kompis-faq/safety";
import type { WebsiteKompisFeedbackLabels } from "@/lib/website-kompis-feedback/labels";
import type { FeedbackOpsRow } from "@/lib/website-kompis-feedback/operations-model";

type SiteOption = { installId: string; domain: string };

type SavedDraft = { id: string; status: string };

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function languageLabel(labels: WebsiteKompisFeedbackLabels, code: string): string {
  const known = labels.quality.languages as Record<string, string>;
  return known[code] ?? code;
}

export function WebsiteKompisFeedbackEditor({
  row,
  labels,
  onClose,
}: {
  row: FeedbackOpsRow;
  labels: WebsiteKompisFeedbackLabels;
  onClose: () => void;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);
  const busy = useRef(false);
  const [question, setQuestion] = useState(row.questionPreview);
  const [answer, setAnswer] = useState(row.answerPreview);
  const [locale, setLocale] = useState(row.locale?.trim() || "");
  const [publicSafe, setPublicSafe] = useState(false);
  const [sites, setSites] = useState<SiteOption[]>([]);
  const [siteState, setSiteState] = useState<"loading" | "ready" | "empty">("loading");
  const [installId, setInstallId] = useState("");
  const [saved, setSaved] = useState<SavedDraft | null>(null);
  const [savedSnapshot, setSavedSnapshot] = useState("");
  const [matchingPublished, setMatchingPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmClose, setConfirmClose] = useState(false);
  const openedFields = useRef({
    question: row.questionPreview,
    answer: row.answerPreview,
    locale: row.locale?.trim() || "",
    publicSafe: false,
  });
  const fieldSnapshot = JSON.stringify({ question, answer, locale, publicSafe });
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

  async function findExisting(): Promise<{ kind: "published" } | { kind: "draft"; id: string } | { kind: "none" }> {
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
        (item.locale ?? "").toLowerCase() === locale.trim().toLowerCase(),
    );
    if (!match?.id || !match.status) return { kind: "none" };
    if (match.status === "published") return { kind: "published" };
    if (match.status === "draft") return { kind: "draft", id: match.id };
    return { kind: "none" };
  }

  async function saveDraft(): Promise<SavedDraft | null> {
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
    setSaving(true);
    try {
      let itemId = saved?.status === "draft" ? saved.id : null;
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
          publicSafe,
          priority: 100,
          tags: [],
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
      setMessage(next.status === "draft" ? labels.quality.savedDraft : labels.quality.publishOnlyDraft);
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
    if (busy.current) return;
    setError(null);
    setMessage(null);
    const draft = saved && !dirty ? saved : await saveDraft();
    if (!draft) return;
    if (busy.current) return;
    busy.current = true;
    if (
      !canPublishWebsiteKompisFaqDraft({
        title: question,
        answer,
        locale,
        contentType: "faq",
        publicSafe,
        status: draft.status,
      })
    ) {
      setError(draft.status === "draft" ? labels.quality.privacy : labels.quality.publishOnlyDraft);
      busy.current = false;
      return;
    }
    setSaving(true);
    try {
      const response = await fetch(`/api/website-kompis/faq/${draft.id}/publish`, { method: "POST" });
      const payload = (await response.json()) as { id?: string; status?: string };
      if (!response.ok || payload.status !== "published" || !payload.id) {
        setError(labels.quality.publishError);
        return;
      }
      setSaved({ id: payload.id, status: "published" });
      setSavedSnapshot(fieldSnapshot);
      setMessage(labels.quality.publishedOk);
    } catch {
      setError(labels.quality.publishError);
    } finally {
      busy.current = false;
      setSaving(false);
    }
  }

  const languageCodes = Object.keys(labels.quality.languages);
  const localeChoices = locale && !languageCodes.includes(locale) ? [locale, ...languageCodes] : languageCodes;

  const drawer = (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40" role="presentation">
      <button type="button" className="absolute inset-0 cursor-default" aria-label={labels.detailClose} onClick={requestClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex h-full w-full flex-col overflow-y-auto border-[var(--app-border)] bg-[var(--app-card)] p-5 shadow-[var(--app-shadow-card-hover)] sm:max-w-xl sm:border-l sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id={titleId} className="text-lg font-semibold text-[var(--app-text)]">
              {labels.openDetail}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--app-text-muted)]">{labels.quality.immutable}</p>
          </div>
          <button
            type="button"
            onClick={requestClose}
            className="rounded-lg px-2 py-1 text-sm text-[var(--app-text-muted)] hover:bg-[var(--app-soft-surface)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
          >
            {labels.detailClose}
          </button>
        </div>

        <dl className="mt-5 space-y-4 text-sm">
          <div>
            <dt className="font-medium text-[var(--app-text-muted)]">{labels.quality.originalQuestion}</dt>
            <dd className="mt-1 whitespace-pre-wrap text-[var(--app-text)]">{row.questionPreview || "—"}</dd>
          </div>
          <div>
            <dt className="font-medium text-[var(--app-text-muted)]">{labels.quality.originalAnswer}</dt>
            <dd className="mt-1 whitespace-pre-wrap text-[var(--app-text)]">{row.answerPreview || "—"}</dd>
          </div>
          <div>
            <dt className="font-medium text-[var(--app-text-muted)]">{labels.quality.visitorFeedback}</dt>
            <dd className="mt-1 whitespace-pre-wrap text-[var(--app-text)]">{row.comment?.trim() || "—"}</dd>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <dt className="font-medium text-[var(--app-text-muted)]">{labels.columns.page}</dt>
              <dd className="mt-1 text-[var(--app-text)]">{row.pagePathname || "—"}</dd>
            </div>
            <div>
              <dt className="font-medium text-[var(--app-text-muted)]">{labels.quality.language}</dt>
              <dd className="mt-1 text-[var(--app-text)]">{row.locale ? languageLabel(labels, row.locale) : "—"}</dd>
            </div>
          </div>
        </dl>
        <p className="mt-3 text-sm text-[var(--app-text-muted)]">{labels.sourcesUnavailable}</p>

        <form
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            void saveDraft();
          }}
        >
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-[var(--app-text)]">{labels.quality.proposedQuestion}</span>
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              rows={3}
              className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] px-3 py-2 text-[var(--app-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-[var(--app-text)]">{labels.quality.proposedAnswer}</span>
            <textarea
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              rows={5}
              className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] px-3 py-2 text-[var(--app-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-[var(--app-text)]">{labels.quality.language}</span>
            <select
              value={locale}
              onChange={(event) => setLocale(event.target.value)}
              className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] px-3 py-2 text-[var(--app-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
            >
              <option value="">{labels.quality.chooseLanguage}</option>
              {localeChoices.map((code) => (
                <option key={code} value={code}>
                  {languageLabel(labels, code)}
                </option>
              ))}
            </select>
          </label>
          {siteState === "ready" && sites.length > 1 ? (
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-[var(--app-text)]">{labels.quality.site}</span>
              <select
                value={installId}
                onChange={(event) => setInstallId(event.target.value)}
                className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] px-3 py-2 text-[var(--app-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
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
            <p className="text-sm text-[var(--app-text-muted)]">
              {labels.quality.site}: {sites[0]?.domain}
            </p>
          ) : null}
          {siteState === "empty" ? <p className="text-sm text-[var(--app-text)]">{labels.quality.noSite}</p> : null}
          <label className="flex items-start gap-2 text-sm text-[var(--app-text)]">
            <input
              type="checkbox"
              checked={publicSafe}
              onChange={(event) => setPublicSafe(event.target.checked)}
              className="mt-1"
            />
            <span>{labels.quality.publicSafe}</span>
          </label>
          <p className="text-sm leading-relaxed text-[var(--app-text-muted)]">{labels.quality.privacy}</p>
          <p className="text-sm leading-relaxed text-[var(--app-text-muted)]">{labels.suggestFaqWarning}</p>
          {matchingPublished ? (
            <p className="text-sm text-[var(--app-text)]">
              {labels.quality.matchingPublished}{" "}
              <Link href={FOUNDATION_NAV_BINDINGS.kompisWebFaq} className="font-medium text-[var(--app-primary)] underline">
                {labels.quality.openExistingFaq}
              </Link>
            </p>
          ) : null}
          {message ? <p className="text-sm text-[var(--app-positive)]">{message}</p> : null}
          {error ? <p className="text-sm text-[var(--app-text)]">{error}</p> : null}
          {confirmClose ? (
            <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-soft-surface)] p-3">
              <p className="text-sm text-[var(--app-text)]">{labels.quality.dirtyLeave}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmClose(false)}
                  className="rounded-lg border border-[var(--app-border)] px-3 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
                >
                  {labels.quality.stay}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--app-text-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
                >
                  {labels.quality.discard}
                </button>
              </div>
            </div>
          ) : null}
          <div className="flex flex-wrap gap-2 pb-4">
            <button
              type="submit"
              disabled={saving || siteState === "empty"}
              className="inline-flex min-h-11 items-center rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] px-4 text-sm font-medium text-[var(--app-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)] disabled:opacity-60"
            >
              {saving ? labels.quality.saving : labels.quality.saveDraft}
            </button>
            <button
              type="button"
              disabled={saving || !publicSafe || siteState === "empty" || matchingPublished}
              onClick={() => void publishFaq()}
              className="inline-flex min-h-11 items-center rounded-xl bg-[image:var(--app-primary-gradient)] px-4 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)] disabled:opacity-60"
            >
              {labels.quality.publishFaq}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(drawer, document.body);
}
