"use client";

import { AipifySidebarTypography } from "@/lib/design";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  CUSTOMER_FEEDBACK_POLICY_ARTICLE_PATH,
  CUSTOMER_STATUS_BADGES,
  FEEDBACK_TYPES,
  parseCustomerFeedbackHistory,
  type FeedbackRow,
  type VocWidgetLabels,
} from "@/lib/voice-of-the-customer";

type ShareFeedbackWidgetProps = {
  labels: VocWidgetLabels;
};

function StatusPill({ label, className }: { label: string; className: string }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${className}`}>
      {label}
    </span>
  );
}

export function ShareFeedbackWidget({ labels }: ShareFeedbackWidgetProps) {
  const [open, setOpen] = useState(false);
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
    if (open && showHistory) void loadHistory();
  }, [open, showHistory, loadHistory]);

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

  const close = () => {
    setOpen(false);
    setSubmitted(false);
    setShowHistory(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`fixed bottom-20 left-4 z-40 flex min-h-10 items-center gap-2 rounded-full border border-aipify-border bg-aipify-surface/95 px-4 py-2 ${AipifySidebarTypography.feedbackButton} text-aipify-text-secondary shadow-sm transition hover:border-aipify-accent-muted hover:bg-aipify-surface-muted hover:text-aipify-companion focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus focus-visible:ring-offset-2 lg:bottom-6`}
        aria-label={labels.trigger}
      >
        <span aria-hidden className="text-base leading-none opacity-80">
          💡
        </span>
        {labels.triggerShort}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 sm:items-center">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="voc-dialog-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="voc-dialog-title" className="text-lg font-semibold text-gray-900">
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
                type="button"
                onClick={close}
                className="text-gray-400 hover:text-gray-600"
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
                  className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {busy ? labels.submitting : labels.submit}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
