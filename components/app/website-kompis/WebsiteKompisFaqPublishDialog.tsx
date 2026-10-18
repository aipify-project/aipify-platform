"use client";

import { useEffect, useRef } from "react";
import type { WebsiteKompisFaqLabels } from "@/lib/website-kompis-faq/labels";

type WebsiteKompisFaqPublishDialogProps = {
  labels: WebsiteKompisFaqLabels;
  open: boolean;
  riskyWords: string[];
  title: string;
  body: string;
  confirmLabel: string;
  error: string | null;
  onConfirm: () => void;
  onCancel: () => void;
  busy: boolean;
};

export function WebsiteKompisFaqPublishDialog({
  labels,
  open,
  riskyWords,
  title,
  body,
  confirmLabel,
  error,
  onConfirm,
  onCancel,
  busy,
}: WebsiteKompisFaqPublishDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    confirmRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape" && !busy) onCancel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [busy, onCancel, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="website-kompis-faq-publish-title"
        className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl"
      >
        <h2 id="website-kompis-faq-publish-title" className="text-lg font-semibold text-slate-900">
          {title}
        </h2>
        <p className="mt-2 text-sm text-slate-600">{body}</p>

        {riskyWords.length > 0 ? (
          <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            {labels.riskyWordsWarning}: {riskyWords.join(", ")}
          </p>
        ) : null}

        {error ? (
          <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {labels.cancel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
          >
            {busy ? labels.publishing : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
