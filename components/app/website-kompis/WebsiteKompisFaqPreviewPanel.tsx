"use client";

import type { WebsiteKompisFaqLabels } from "@/lib/website-kompis-faq/labels";

type WebsiteKompisFaqPreviewPanelProps = {
  labels: WebsiteKompisFaqLabels;
  title: string;
  question: string;
  answer: string;
};

export function WebsiteKompisFaqPreviewPanel({
  labels,
  title,
  question,
  answer,
}: WebsiteKompisFaqPreviewPanelProps) {
  const previewTitle = title.trim() || question.trim() || labels.previewTitle;

  return (
    <section className="rounded-xl border border-violet-200 bg-violet-50/40 p-5">
      <h3 className="text-sm font-semibold text-violet-900">{labels.previewTitle}</h3>
      <p className="mt-1 text-xs text-violet-700">{labels.previewHint}</p>
      <p className="mt-2 text-xs text-slate-500">{labels.previewGroundingNote}</p>

      <div className="mt-4 rounded-lg border border-white bg-white p-4 shadow-sm">
        <p className="text-sm font-medium text-slate-900">{previewTitle}</p>
        {answer.trim() ? (
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
            {answer.trim()}
          </p>
        ) : (
          <p className="mt-3 text-sm text-slate-400">—</p>
        )}
      </div>
    </section>
  );
}
