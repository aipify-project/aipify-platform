"use client";

import type { WebsiteKompisFaqLabels } from "@/lib/website-kompis-faq/labels";

type WebsiteKompisFaqPublishDialogProps = {
  labels: WebsiteKompisFaqLabels;
  open: boolean;
  riskyWords: string[];
  onConfirm: () => void;
  onCancel: () => void;
  busy: boolean;
};

export function WebsiteKompisFaqPublishDialog({
  labels,
  open,
  riskyWords,
  onConfirm,
  onCancel,
  busy,
}: WebsiteKompisFaqPublishDialogProps) {
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
          {labels.confirmPublishTitle}
        </h2>
        <p className="mt-2 text-sm text-slate-600">{labels.confirmPublishBody}</p>

        {riskyWords.length > 0 ? (
          <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            {labels.riskyWordsWarning}: {riskyWords.join(", ")}
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
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
          >
            {labels.confirmPublishAction}
          </button>
        </div>
      </div>
    </div>
  );
}
