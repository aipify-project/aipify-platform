"use client";

import { AlertCircle, Send, X } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import type { WebsiteKompisFaqLabels } from "@/lib/website-kompis-faq/labels";

type WebsiteKompisFaqPublishDialogProps = {
  labels: WebsiteKompisFaqLabels;
  open: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  error: string | null;
  riskyWords: string[];
  onConfirm: () => void;
  onCancel: () => void;
  busy: boolean;
};

export function WebsiteKompisFaqPublishDialog({
  labels,
  open,
  title,
  body,
  confirmLabel,
  error,
  riskyWords,
  onConfirm,
  onCancel,
  busy,
}: WebsiteKompisFaqPublishDialogProps) {
  const titleId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const onCancelRef = useRef(onCancel);
  onCancelRef.current = onCancel;

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !busy) onCancelRef.current();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [busy, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl"
      >
        <h2 id={titleId} className="text-lg font-semibold text-slate-900">
          {title}
        </h2>
        <p className="mt-2 text-sm text-slate-600">{body}</p>

        {riskyWords.length > 0 ? (
          <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            {labels.riskyWordsWarning}: {riskyWords.join(", ")}
          </p>
        ) : null}

        {error ? (
          <p className="mt-3 inline-flex items-start gap-2 text-sm text-amber-900" role="alert">
            <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="inline-flex min-h-11 items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          >
            <X aria-hidden className="size-4" strokeWidth={2} />
            {labels.cancel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="inline-flex min-h-11 items-center gap-2 rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          >
            <Send aria-hidden className="size-4" strokeWidth={2} />
            {busy ? labels.loading : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
