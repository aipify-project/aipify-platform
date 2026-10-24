"use client";

import type { WpkfStatus } from "@/lib/website-kompis-faq/constants";
import type { WebsiteKompisFaqLabels } from "@/lib/website-kompis-faq/labels";

export type FaqLocaleLinkChoice = {
  id: string;
  title: string;
  questionExcerpt: string;
  locale: string;
  status: WpkfStatus;
  domain: string | null;
};

type WebsiteKompisFaqLocaleLinkDialogProps = {
  labels: WebsiteKompisFaqLabels;
  query: string;
  candidates: FaqLocaleLinkChoice[];
  selectedId: string | null;
  error: string | null;
  searched: boolean;
  busy: boolean;
  onQuery: (value: string) => void;
  onSearch: () => void;
  onSelect: (id: string) => void;
  onClose: () => void;
  onConfirm: () => void;
};

export function WebsiteKompisFaqLocaleLinkDialog({
  labels,
  query,
  candidates,
  selectedId,
  error,
  searched,
  busy,
  onQuery,
  onSearch,
  onSelect,
  onClose,
  onConfirm,
}: WebsiteKompisFaqLocaleLinkDialogProps) {
  const selected = candidates.find((row) => row.id === selectedId) ?? null;
  return (
    <div className="mt-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800">
      <p className="font-medium">{labels.localeLinkAction}</p>
      <div className="mt-2 flex gap-2">
        <input
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder={labels.localeLinkSearch}
          aria-label={labels.localeLinkSearch}
          className="w-full rounded-md border border-slate-300 bg-white px-2 py-1"
        />
        <button type="button" className="rounded-md border border-slate-300 bg-white px-2 py-1" onClick={onSearch} disabled={busy}>
          {labels.localeLinkSearch}
        </button>
      </div>
      {searched && !error && candidates.length === 0 ? (
        <p className="mt-2 text-slate-600">{labels.localeLinkEmpty}</p>
      ) : null}
      <ul className="mt-2 space-y-1">
        {candidates.map((row) => (
          <li key={row.id}>
            <button
              type="button"
              onClick={() => onSelect(row.id)}
              className={`w-full rounded-md border px-2 py-1 text-left ${row.id === selectedId ? "border-violet-400 bg-white" : "border-slate-200 bg-white"}`}
            >
              <span className="block font-medium">{row.title}</span>
              {row.questionExcerpt ? <span className="block text-slate-600">{row.questionExcerpt}</span> : null}
              <span className="block text-slate-500">
                {row.locale} · {labels.statuses[row.status]} · {row.domain || labels.siteContext.siteScopedBadge}
              </span>
            </button>
          </li>
        ))}
      </ul>
      {selected ? (
        <div className="mt-2">
          <p className="font-medium">{labels.localeLinkConfirmTitle}</p>
          <p className="mt-1">{labels.localeLinkConfirmBody}</p>
        </div>
      ) : null}
      {error ? <p className="mt-2 text-amber-900">{error}</p> : null}
      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" className="rounded-md border border-slate-300 bg-white px-2 py-1" onClick={onClose} disabled={busy}>
          {labels.localeLinkCancel}
        </button>
        <button
          type="button"
          className="rounded-md border border-slate-300 bg-white px-2 py-1"
          onClick={onConfirm}
          disabled={busy || !selected}
        >
          {labels.localeLinkConfirm}
        </button>
      </div>
    </div>
  );
}
