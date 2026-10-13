"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import {
  CUSTOMER_FEEDBACK_POLICY_ARTICLE_PATH,
  CUSTOMER_STATUS_BADGES,
  FEEDBACK_TYPES,
  parseCustomerFeedbackHistory,
  type FeedbackRow,
  type VocWidgetLabels,
} from "@/lib/voice-of-the-customer";

type ShareFeedbackDialogProps = {
  labels: VocWidgetLabels;
  open: boolean;
  onClose: () => void;
  /** Element that opened the dialog — focus returns here on close. */
  returnFocusRef?: RefObject<HTMLElement | null>;
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function StatusPill({ label, className }: { label: string; className: string }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${className}`}>
      {label}
    </span>
  );
}

export function ShareFeedbackDialog({
  labels,
  open,
  onClose,
  returnFocusRef,
}: ShareFeedbackDialogProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [history, setHistory] = useState<FeedbackRow[]>([]);
  const [form, setForm] = useState({
    feedback_type: "general_feedback",
    title: "",
    description: "",
    priority: "medium",
    wants_response: false,
    include_context: true,
  });

  const loadHistory = useCallback(async () => {
    const res = await fetch("/api/voice-of-the-customer/history");
    if (res.ok) {
      const parsed = parseCustomerFeedbackHistory(await res.json());
      setHistory(parsed.items);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open && showHistory) void loadHistory();
  }, [open, showHistory, loadHistory]);

  useEffect(() => {
    if (!open) {
      setSubmitted(false);
      setShowHistory(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused =
      returnFocusRef?.current ?? (document.activeElement as HTMLElement | null);

    // Defer focus so portal content is painted (Safari).
    const focusTimer = window.setTimeout(() => {
      closeRef.current?.focus();
    }, 0);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusables = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);

      if (focusables.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (active === first || !dialogRef.current.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !dialogRef.current.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open, onClose, returnFocusRef]);

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    setBusy(true);
    try {
      const context =
        form.include_context && typeof window !== "undefined"
          ? {
              page_url: window.location.pathname,
              browser_info: navigator.userAgent.slice(0, 200),
              device_type: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop",
            }
          : {};

      const res = await fetch("/api/voice-of-the-customer/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ...context }),
      });
      if (res.ok) {
        setSubmitted(true);
        setForm({
          feedback_type: "general_feedback",
          title: "",
          description: "",
          priority: "medium",
          wants_response: false,
          include_context: true,
        });
      }
    } finally {
      setBusy(false);
    }
  };

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto overscroll-contain bg-black/40 p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="my-auto w-full max-w-lg max-h-[min(90vh,calc(100dvh-2rem))] overflow-y-auto rounded-2xl border border-[var(--app-border,#e5e7f0)] bg-[var(--app-card,#fff)] p-6 shadow-xl outline-none"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="text-lg font-semibold text-gray-900">
              {labels.title}
            </h2>
            <p className="mt-1 text-sm text-gray-600">{labels.subtitle}</p>
            <p className="mt-2 text-xs text-gray-500">{labels.transparencyNote}</p>
            <p className="mt-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-700">
              {labels.trustNote}{" "}
              <Link
                href={CUSTOMER_FEEDBACK_POLICY_ARTICLE_PATH}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={labels.trustStatementLinkAria}
                className="font-medium text-indigo-700 underline hover:text-indigo-900"
              >
                {labels.trustStatementLink}
              </Link>
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg px-2 py-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus,#7C3AED)]"
            aria-label={labels.close}
          >
            ×
          </button>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => {
              setShowHistory(false);
              setSubmitted(false);
            }}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              !showHistory ? "bg-indigo-100 text-indigo-800" : "bg-gray-100 text-gray-700"
            }`}
          >
            {labels.submit}
          </button>
          <button
            type="button"
            onClick={() => {
              setShowHistory(true);
              setSubmitted(false);
            }}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              showHistory ? "bg-indigo-100 text-indigo-800" : "bg-gray-100 text-gray-700"
            }`}
          >
            {labels.historyTitle}
          </button>
        </div>

        {submitted ? (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            <p className="font-medium">{labels.acknowledgementTitle}</p>
            <p className="mt-2">{labels.acknowledgementBody}</p>
          </div>
        ) : showHistory ? (
          <ul className="mt-4 space-y-3">
            {history.length === 0 ? (
              <li className="text-sm text-gray-500">{labels.historyEmpty}</li>
            ) : (
              history.map((item) => (
                <li key={item.id} className="rounded-lg bg-gray-50 px-4 py-3 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium text-gray-900">{item.title}</span>
                    <StatusPill
                      label={labels.customerStatuses[item.customer_status]}
                      className={CUSTOMER_STATUS_BADGES[item.customer_status]}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {labels.feedbackTypes[item.feedback_type]}
                  </p>
                </li>
              ))
            )}
          </ul>
        ) : (
          <div className="mt-4 space-y-4">
            <label className="block text-sm">
              <span className="text-xs text-gray-500">{labels.type}</span>
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                value={form.feedback_type}
                onChange={(e) => setForm((prev) => ({ ...prev, feedback_type: e.target.value }))}
              >
                {FEEDBACK_TYPES.map((key) => (
                  <option key={key} value={key}>
                    {labels.feedbackTypes[key]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-xs text-gray-500">{labels.feedbackTitle}</span>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              />
            </label>
            <label className="block text-sm">
              <span className="text-xs text-gray-500">{labels.description}</span>
              <textarea
                className="mt-1 min-h-24 w-full rounded-lg border border-gray-200 px-3 py-2"
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              />
            </label>
            <label className="block text-sm">
              <span className="text-xs text-gray-500">{labels.priority}</span>
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                value={form.priority}
                onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value }))}
              >
                {Object.entries(labels.priorities).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <fieldset className="text-sm">
              <legend className="text-xs text-gray-500">{labels.wantsResponse}</legend>
              <label className="mt-2 flex items-center gap-2">
                <input
                  type="radio"
                  checked={!form.wants_response}
                  onChange={() => setForm((prev) => ({ ...prev, wants_response: false }))}
                />
                {labels.noResponse}
              </label>
              <label className="mt-1 flex items-center gap-2">
                <input
                  type="radio"
                  checked={form.wants_response}
                  onChange={() => setForm((prev) => ({ ...prev, wants_response: true }))}
                />
                {labels.contactMe}
              </label>
            </fieldset>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.include_context}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, include_context: e.target.checked }))
                }
              />
              {labels.includeContext}
            </label>
            <button
              type="button"
              disabled={busy || !form.title.trim()}
              onClick={() => void handleSubmit()}
              className="w-full rounded-lg bg-[image:var(--app-primary-gradient,#6366f1)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-50"
            >
              {busy ? labels.submitting : labels.submit}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
