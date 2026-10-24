"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { WebsiteKompisFaqLabels } from "@/lib/website-kompis-faq/labels";
import { publishDialogInitialFocus } from "@/lib/website-kompis-faq/publish-dialog-placement";

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
  busyLabel?: string;
  acknowledgementLabel?: string;
  acknowledged?: boolean;
  onAcknowledge?: (checked: boolean) => void;
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
  busyLabel,
  acknowledgementLabel,
  acknowledged = false,
  onAcknowledge,
}: WebsiteKompisFaqPublishDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const acknowledgeRef = useRef<HTMLInputElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (!open) {
      if (wasOpenRef.current) {
        wasOpenRef.current = false;
        returnFocusRef.current?.focus({ preventScroll: true });
        returnFocusRef.current = null;
      }
      return;
    }

    if (!wasOpenRef.current) {
      wasOpenRef.current = true;
      const active = document.activeElement;
      returnFocusRef.current = active instanceof HTMLElement ? active : null;
    }

    const initial = publishDialogInitialFocus(Boolean(acknowledgementLabel));
    (initial === "acknowledge" ? acknowledgeRef.current : cancelRef.current)?.focus({
      preventScroll: true,
    });

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape" && !busy) {
        event.preventDefault();
        onCancel();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const nodes = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>("button:not(:disabled), input:not(:disabled)"),
      );
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [acknowledgementLabel, busy, onCancel, open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto overscroll-contain bg-slate-900/40 p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]"
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="website-kompis-faq-publish-title"
        aria-describedby="website-kompis-faq-publish-body"
        className="my-auto flex max-h-[min(32rem,calc(100dvh-2rem-env(safe-area-inset-top)-env(safe-area-inset-bottom)))] w-full max-w-md flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-xl outline-none"
      >
        <div className="min-h-0 flex-1 overflow-y-auto">
          <h2 id="website-kompis-faq-publish-title" className="break-words text-lg font-semibold text-slate-900">
            {title}
          </h2>
          <p id="website-kompis-faq-publish-body" className="mt-2 break-words text-sm text-slate-600">
            {body}
          </p>

          {riskyWords.length > 0 ? (
            <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              {labels.riskyWordsWarning}: {riskyWords.join(", ")}
            </p>
          ) : null}

          {acknowledgementLabel ? (
            <label className="mt-4 flex items-start gap-2 text-sm text-slate-800">
              <input
                ref={acknowledgeRef}
                type="checkbox"
                className="mt-1"
                checked={acknowledged}
                disabled={busy}
                onChange={(event) => onAcknowledge?.(event.target.checked)}
              />
              <span>{acknowledgementLabel}</span>
            </label>
          ) : null}

          {error ? (
            <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
              {error}
            </p>
          ) : null}
        </div>

        <div className="mt-6 flex shrink-0 flex-wrap justify-end gap-2">
          <button
            ref={cancelRef}
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
            disabled={busy || (Boolean(acknowledgementLabel) && !acknowledged)}
            className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
          >
            {busy ? (busyLabel ?? labels.publishing) : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
