"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  CircleX,
  Download,
  FileUp,
  Sheet,
} from "lucide-react";
import type { WebsiteKompisFaqLabels } from "@/lib/website-kompis-faq/labels";

type ImportLabels = WebsiteKompisFaqLabels["importFaq"];

type PreviewRow = {
  rowNumber: number;
  status: "ready" | "invalid" | "duplicate";
  question: string;
  category: string;
  locale: string;
  issues: Array<{ field: string; code: string }>;
  warnings: Array<{ field: string; code: string }>;
};

type PreviewPayload = {
  headers: string[];
  mapping: Record<string, string>;
  missing: string[];
  fileError: string | null;
  sheets: string[];
  selectedSheet: string | null;
  scanTruncated: boolean;
  summary: { ready: number; duplicates: number; invalid: number };
  rows: PreviewRow[];
};

type CommitPayload = {
  outcome: "imported" | "partial" | "failed" | "blocked";
  imported: number;
};

const TARGETS = [
  "question",
  "title",
  "answer",
  "category",
  "locale",
  "tags",
  "permanent",
  "validFrom",
  "validUntil",
  "reference",
  "status",
  "ignore",
] as const;

export function WebsiteKompisFaqImportWorkspace({
  labels,
  fields,
  installId,
  onClose,
  onImported,
}: {
  labels: ImportLabels;
  fields: WebsiteKompisFaqLabels["fields"];
  installId: string;
  onClose: () => void;
  onImported: (message: string) => void;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [sheet, setSheet] = useState("");
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<PreviewPayload | null>(null);
  const [step, setStep] = useState(0);
  const [filter, setFilter] = useState<"all" | "ready" | "invalid" | "duplicate">("all");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    panelRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [busy, onClose]);

  async function send(path: string, nextMapping = mapping, nextSheet = sheet) {
    const file = fileRef.current;
    if (!file) return null;
    const form = new FormData();
    form.set("file", file);
    form.set("installId", installId);
    form.set("sheet", nextSheet);
    form.set("mapping", JSON.stringify(nextMapping));
    const response = await fetch(path, { method: "POST", body: form });
    const payload = (await response.json()) as PreviewPayload & CommitPayload & { error?: string; sheets?: string[] };
    if (payload.error === "sheet_required" && payload.sheets) {
      setPreview({
        headers: [],
        mapping: {},
        missing: [],
        fileError: "sheet_required",
        sheets: payload.sheets,
        selectedSheet: null,
        scanTruncated: false,
        summary: { ready: 0, duplicates: 0, invalid: 0 },
        rows: [],
      });
      setStep(1);
      return null;
    }
    if (!response.ok && !payload.summary) {
      setError(labels.failure);
      return null;
    }
    return payload;
  }

  async function readFile(file: File) {
    fileRef.current = file;
    setFileName(file.name);
    setBusy(true);
    setError(null);
    setMessage(labels.reading);
    const payload = await send("/api/website-kompis/faq/import/preview", {}, "");
    setBusy(false);
    setMessage(null);
    if (!payload) return;
    setMapping(payload.mapping ?? {});
    setSheet(payload.selectedSheet ?? "");
    setPreview(payload);
    setStep(1);
  }

  async function refreshPreview(nextMapping: Record<string, string>, nextSheet: string) {
    setBusy(true);
    setError(null);
    const payload = await send("/api/website-kompis/faq/import/preview", nextMapping, nextSheet);
    setBusy(false);
    if (!payload) return;
    setPreview(payload);
  }

  async function commit() {
    if (!preview || preview.summary.ready === 0 || busy) return;
    setBusy(true);
    setError(null);
    setMessage(labels.importing);
    const payload = await send("/api/website-kompis/faq/import");
    setBusy(false);
    setMessage(null);
    if (!payload) return;
    if (payload.outcome === "imported") {
      onImported(labels.success.replace("{n}", String(payload.imported)));
      return;
    }
    if (payload.outcome === "partial") {
      setError(labels.partial.replace("{n}", String(payload.imported)));
      onImported(labels.partial.replace("{n}", String(payload.imported)));
      return;
    }
    setError(labels.failure);
  }

  const visible = (preview?.rows ?? []).filter((row) => filter === "all" || row.status === filter);
  const steps = [labels.stepUpload, labels.stepMap, labels.stepReview, labels.stepImport];
  const fieldLabel = (target: string) => {
    if (target === "question") return fields.question;
    if (target === "title") return fields.title;
    if (target === "answer") return fields.answer;
    if (target === "category") return fields.category;
    if (target === "locale") return fields.locale;
    if (target === "tags") return fields.tags;
    if (target === "validFrom") return fields.validFrom;
    if (target === "validUntil") return fields.validUntil;
    if (target === "ignore") return labels.ignore;
    if (target === "status") return labels.statusSkipped;
    return target;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 sm:items-center" role="presentation">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="flex max-h-[100dvh] w-full flex-col overflow-hidden bg-[var(--app-card)] shadow-[var(--app-shadow-card-hover)] outline-none sm:max-h-[90dvh] sm:max-w-5xl sm:rounded-[var(--app-radius-lg)]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--app-border)] px-5 py-4">
          <div>
            <h2 id={titleId} className="text-xl font-semibold text-[var(--app-text)]">{labels.title}</h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[var(--app-text-muted)]">{labels.intro}</p>
          </div>
          <button type="button" onClick={onClose} className="min-h-11 rounded-xl px-3 text-sm text-[var(--app-text-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]">
            {labels.close}
          </button>
        </div>
        <ol className="grid grid-cols-2 gap-2 px-5 py-3 sm:grid-cols-4" aria-label={labels.title}>
          {steps.map((label, index) => (
            <li key={label} aria-current={index === step ? "step" : undefined} className={`rounded-xl px-3 py-2 text-xs font-medium ${index === step ? "bg-[var(--app-primary-soft)] text-[var(--app-primary)]" : "text-[var(--app-text-muted)]"}`}>
              {index + 1}. {label}
            </li>
          ))}
        </ol>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4" aria-live="polite">
          {step === 0 ? (
            <label className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-[var(--app-radius-lg)] border border-dashed border-[var(--app-border)] bg-[var(--app-soft-surface)] px-6 text-center">
              <FileUp aria-hidden className="mb-3 h-8 w-8 text-[var(--app-primary)]" />
              <span className="text-base font-medium text-[var(--app-text)]">{labels.dropzone}</span>
              <span className="mt-2 text-sm text-[var(--app-text-muted)]">{labels.secondary}</span>
              <input
                type="file"
                accept=".csv,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void readFile(file);
                }}
              />
            </label>
          ) : null}
          {fileName ? <p className="mt-3 text-sm text-[var(--app-text-muted)]">{fileName}</p> : null}
          {preview && preview.sheets.length > 1 ? (
            <label className="mt-4 block text-sm">
              <span className="mb-1 flex items-center gap-2 font-medium"><Sheet aria-hidden className="h-4 w-4" />{labels.sheet}</span>
              <select
                value={sheet}
                onChange={(event) => {
                  setSheet(event.target.value);
                  void refreshPreview(mapping, event.target.value);
                }}
                className="min-h-11 w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] px-3"
              >
                {preview.sheets.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </label>
          ) : null}
          {step === 1 && preview ? (
            <div className="mt-4 space-y-3">
              <p className="text-sm text-[var(--app-text-muted)]">{labels.questionIsTitle} {labels.categoryRequired} {labels.localeHelp}</p>
              {preview.headers.map((header) => (
                <label key={header} className="grid gap-1 text-sm sm:grid-cols-[1fr_16rem] sm:items-center">
                  <span className="font-medium text-[var(--app-text)]">{header}</span>
                  <select
                    value={mapping[header] ?? "ignore"}
                    onChange={(event) => {
                      const next = { ...mapping, [header]: event.target.value };
                      setMapping(next);
                      void refreshPreview(next, sheet);
                    }}
                    className="min-h-11 rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] px-3"
                  >
                    {TARGETS.map((target) => (
                      <option key={target} value={target}>{fieldLabel(target)}</option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          ) : null}
          {step >= 2 && preview ? (
            <div className="mt-4 space-y-3">
              <p className="text-sm font-medium text-[var(--app-text)]">
                {labels.summary
                  .replace("{ready}", String(preview.summary.ready))
                  .replace("{duplicates}", String(preview.summary.duplicates))
                  .replace("{invalid}", String(preview.summary.invalid))}
              </p>
              {preview.scanTruncated ? <p className="text-sm text-[var(--app-pending)]">{labels.scanLimit}</p> : null}
              <div className="flex flex-wrap gap-2">
                {(["all", "ready", "invalid", "duplicate"] as const).map((value) => (
                  <button key={value} type="button" onClick={() => setFilter(value)} className="min-h-11 rounded-full border border-[var(--app-border)] px-3 text-sm">
                    {value === "all" ? labels.filterAll : value === "ready" ? labels.statusReady : value === "invalid" ? labels.statusInvalid : labels.statusDuplicate}
                  </button>
                ))}
              </div>
              <div className="hidden overflow-hidden rounded-[var(--app-radius-lg)] border border-[var(--app-border)] md:block">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-[var(--app-soft-surface)]">
                    <tr>
                      <th className="px-3 py-2">#</th>
                      <th className="px-3 py-2">{fields.question}</th>
                      <th className="px-3 py-2">{fields.category}</th>
                      <th className="px-3 py-2">{fields.locale}</th>
                      <th className="px-3 py-2">{labels.stepReview}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.slice(0, 10).map((row) => (
                      <tr key={row.rowNumber} className="border-t border-[var(--app-border)]">
                        <td className="px-3 py-2">{row.rowNumber}</td>
                        <td className="px-3 py-2">{row.question}</td>
                        <td className="px-3 py-2">{row.category}</td>
                        <td className="px-3 py-2">{row.locale}</td>
                        <td className="px-3 py-2"><StatusChip row={row} labels={labels} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ul className="space-y-3 md:hidden">
                {visible.slice(0, 10).map((row) => (
                  <li key={row.rowNumber} className="rounded-[var(--app-radius-lg)] border border-[var(--app-border)] p-3">
                    <p className="text-sm font-medium">{row.question}</p>
                    <p className="mt-1 text-xs text-[var(--app-text-muted)]">{row.category} · {row.locale}</p>
                    <div className="mt-2"><StatusChip row={row} labels={labels} /></div>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-[var(--app-text-muted)]">{labels.confirmation}</p>
              <button
                type="button"
                className="inline-flex min-h-11 items-center gap-2 text-sm text-[var(--app-primary)]"
                onClick={() => {
                  const lines = ["row,field,code", ...(preview.rows.flatMap((row) => row.issues.map((issue) => `${row.rowNumber},${issue.field},${issue.code}`)))];
                  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = "faq-import-errors.csv";
                  link.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <Download aria-hidden className="h-4 w-4" />
                {labels.errorReport}
              </button>
            </div>
          ) : null}
          {error ? <p className="mt-3 text-sm text-[var(--app-negative)]" role="alert">{error}</p> : null}
          {message ? <p className="mt-3 text-sm text-[var(--app-text-muted)]">{message}</p> : null}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--app-border)] px-5 py-4">
          <button type="button" onClick={() => (step === 0 ? onClose() : setStep((current) => current - 1))} className="min-h-11 rounded-xl px-3 text-sm">
            {step === 0 ? labels.cancel : labels.back}
          </button>
          {step < 3 ? (
            <button type="button" disabled={!preview || busy} onClick={() => setStep((current) => Math.min(3, current + 1))} className="inline-flex min-h-11 items-center rounded-xl bg-[image:var(--app-primary-gradient)] px-4 text-sm font-medium text-white disabled:opacity-60">
              {labels.next}
            </button>
          ) : (
            <button type="button" disabled={!preview || preview.summary.ready === 0 || busy} onClick={() => void commit()} className="inline-flex min-h-11 items-center rounded-xl bg-[image:var(--app-primary-gradient)] px-4 text-sm font-medium text-white disabled:opacity-60">
              {labels.confirmAction.replace("{n}", String(preview?.summary.ready ?? 0))}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusChip({ row, labels }: { row: PreviewRow; labels: ImportLabels }) {
  const issue = row.issues[0] ?? row.warnings[0];
  const text = issue ? labels.issues[issue.code as keyof ImportLabels["issues"]] ?? issue.code : "";
  if (row.status === "ready" && row.warnings.length === 0) {
    return <span className="inline-flex items-center gap-1 rounded-full bg-[#F4FBF7] px-2 py-1 text-xs text-[var(--app-positive)]"><CheckCircle2 aria-hidden className="h-3.5 w-3.5" />{labels.statusReady}</span>;
  }
  if (row.status === "duplicate") {
    return <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs text-amber-800"><AlertTriangle aria-hidden className="h-3.5 w-3.5" />{labels.statusDuplicate}{text ? ` · ${text}` : ""}</span>;
  }
  if (row.status === "invalid") {
    return <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs text-red-800"><CircleX aria-hidden className="h-3.5 w-3.5" />{labels.statusInvalid}{text ? ` · ${text}` : ""}</span>;
  }
  return <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs text-amber-800"><AlertTriangle aria-hidden className="h-3.5 w-3.5" />{labels.statusReady}{text ? ` · ${text}` : ""}</span>;
}

export function WebsiteKompisFaqImportActions({
  labels,
  disabled,
  onOpen,
}: {
  labels: ImportLabels;
  disabled: boolean;
  onOpen: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        disabled={disabled}
        onClick={onOpen}
        className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] px-4 text-sm font-medium text-[var(--app-text)] shadow-[var(--app-shadow-card)] disabled:opacity-60"
      >
        <FileUp aria-hidden className="h-4 w-4 text-[var(--app-primary)]" />
        {labels.open}
      </button>
      <a href="/api/website-kompis/faq/import/template?format=csv" className="inline-flex min-h-11 items-center gap-2 text-sm text-[var(--app-text-muted)]">
        <Download aria-hidden className="h-4 w-4" />
        {labels.downloadCsv}
      </a>
      <a href="/api/website-kompis/faq/import/template?format=xlsx" className="inline-flex min-h-11 items-center gap-2 text-sm text-[var(--app-text-muted)]">
        <Download aria-hidden className="h-4 w-4" />
        {labels.downloadXlsx}
      </a>
    </div>
  );
}
