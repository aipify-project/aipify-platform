"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  documentStatusLabel,
  parseDocumentManagementCenter,
  parseGlobalSearchResult,
  type DocumentManagementCenter,
  type DocumentManagementLabels,
  type DocumentRecord,
} from "@/lib/document-knowledge";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";

type Tab = "recent" | "shared" | "departments" | "templates" | "policies" | "contracts" | "reports" | "archives" | "search";

function DocRow({
  doc,
  labels,
  onSubmitReview,
  onApprove,
  onReject,
  onArchive,
  showActions,
}: {
  doc: DocumentRecord;
  labels: DocumentManagementLabels;
  onSubmitReview?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onArchive?: (id: string) => void;
  showActions?: boolean;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {doc.document_number ? <span className="text-xs font-mono text-gray-500">{doc.document_number}</span> : null}
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">{documentStatusLabel(labels, doc.status)}</span>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">{doc.file_type.toUpperCase()}</span>
          </div>
          <h3 className="mt-1 font-semibold text-gray-900">{doc.title}</h3>
          {doc.description ? <p className="mt-1 text-sm text-gray-600 line-clamp-2">{doc.description}</p> : null}
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
            <span>{labels.category}: {doc.category}</span>
            {doc.business_pack_key ? <span>{labels.pack}: {doc.business_pack_key}</span> : null}
            <span>v{doc.version}</span>
          </div>
        </div>
        {showActions ? (
          <div className="flex flex-wrap gap-2">
            {onSubmitReview && doc.status === "draft" ? (
              <button type="button" onClick={() => onSubmitReview(doc.id)} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white">{labels.submitReview}</button>
            ) : null}
            {onApprove && doc.status === "under_review" ? (
              <button type="button" onClick={() => onApprove(doc.id)} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white">{labels.approve}</button>
            ) : null}
            {onReject && doc.status === "under_review" ? (
              <button type="button" onClick={() => onReject(doc.id)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700">{labels.reject}</button>
            ) : null}
            {onArchive && doc.status !== "archived" ? (
              <button type="button" onClick={() => onArchive(doc.id)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700">{labels.archive}</button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function DocList({ docs, labels, ...actions }: { docs: DocumentRecord[]; labels: DocumentManagementLabels; onSubmitReview?: (id: string) => void; onApprove?: (id: string) => void; onReject?: (id: string) => void; onArchive?: (id: string) => void }) {
  if (docs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <p className="font-medium text-gray-900">{labels.noDocuments}</p>
        <p className="mt-1 text-sm text-gray-600">{labels.noDocumentsHint}</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {docs.map((doc) => (
        <DocRow key={doc.id} doc={doc} labels={labels} showActions {...actions} />
      ))}
    </div>
  );
}

export function DocumentManagementPanel({ labels }: { labels: DocumentManagementLabels }) {
  const [center, setCenter] = useState<DocumentManagementCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("recent");
  const [busy, setBusy] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("operations");
  const [fileType, setFileType] = useState("pdf");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ReturnType<typeof parseGlobalSearchResult>>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/documents");
    if (res.ok) setCenter(parseDocumentManagementCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function runAction(action_type: string, payload: Record<string, unknown> = {}) {
    setBusy(true);
    await fetch("/api/app/documents/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type, payload }),
    });
    setBusy(false);
    await load();
  }

  async function runSearch() {
    if (!searchQuery.trim()) return;
    setBusy(true);
    const res = await fetch(`/api/app/knowledge/search?q=${encodeURIComponent(searchQuery.trim())}`);
    if (res.ok) setSearchResults(parseGlobalSearchResult(await res.json()));
    setBusy(false);
    setTab("search");
  }

  if (loading && !center) {
    return <div className="flex min-h-[320px] items-center justify-center"><AipifyLoader centered /></div>;
  }

  if (!center?.found) {
    return <AipifyModuleAccessDenied message={labels.accessDenied} />;
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "recent", label: labels.recent },
    { key: "shared", label: labels.shared },
    { key: "departments", label: labels.departments },
    { key: "templates", label: labels.templates },
    { key: "policies", label: labels.policies },
    { key: "contracts", label: labels.contracts },
    { key: "reports", label: labels.reports },
    { key: "archives", label: labels.archives },
    { key: "search", label: labels.search },
  ];

  const actions = {
    onSubmitReview: (id: string) => void runAction("submit_for_review", { document_id: id }),
    onApprove: (id: string) => void runAction("approve_document", { document_id: id }),
    onReject: (id: string) => void runAction("reject_document", { document_id: id }),
    onArchive: (id: string) => void runAction("archive_document", { document_id: id }),
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        {center.principle ? <p className="mt-2 text-sm font-medium text-violet-800">{center.principle}</p> : null}
        {center.knowledge_route ? (
          <Link href={center.knowledge_route} className="mt-3 inline-block text-sm text-indigo-700 hover:underline">{labels.knowledgeLink}</Link>
        ) : null}
      </div>

      {center.overview ? (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
          <StatCard label={labels.total} value={center.overview.total} />
          <StatCard label={labels.published} value={center.overview.published} />
          <StatCard label={labels.pendingReview} value={center.overview.pending_review} highlight="indigo" />
          <StatCard label={labels.requiresUpdate} value={center.overview.requires_update} highlight="amber" />
        </div>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row">
        <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={labels.searchPlaceholder} className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <button type="button" disabled={busy || !searchQuery.trim()} onClick={() => void runSearch()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{labels.search}</button>
      </div>

      <div className="-mx-1 flex gap-1 overflow-x-auto border-b border-gray-200 pb-2 sm:flex-wrap">
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => setTab(t.key)} className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium ${tab === t.key ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>{t.label}</button>
        ))}
      </div>

      {tab === "recent" ? (
        <div className="space-y-4">
          <CreateForm labels={labels} title={title} description={description} category={category} fileType={fileType} busy={busy}
            onTitleChange={setTitle} onDescriptionChange={setDescription} onCategoryChange={setCategory} onFileTypeChange={setFileType}
            onSubmit={() => void runAction("create_document", { title, description, category, file_type: fileType }).then(() => { setTitle(""); setDescription(""); })}
          />
          <DocList docs={center.recent_documents ?? []} labels={labels} {...actions} />
        </div>
      ) : null}

      {tab === "shared" ? <DocList docs={center.shared_documents ?? []} labels={labels} /> : null}
      {tab === "policies" ? <DocList docs={center.policies ?? []} labels={labels} {...actions} /> : null}
      {tab === "contracts" ? <DocList docs={center.contracts ?? []} labels={labels} {...actions} /> : null}
      {tab === "reports" ? <DocList docs={center.reports_section ?? []} labels={labels} /> : null}
      {tab === "archives" ? <DocList docs={center.archives ?? []} labels={labels} /> : null}

      {tab === "departments" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {(center.departments ?? []).map((d) => (
            <div key={d.department_id} className="rounded-xl border border-gray-200 bg-white p-4">
              <h3 className="font-semibold text-gray-900">{d.department_name}</h3>
              <p className="mt-1 text-sm text-gray-600">{d.document_count} documents</p>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "templates" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {(center.templates ?? []).map((tpl) => (
            <div key={tpl.id} className="rounded-xl border border-gray-200 bg-white p-4">
              <h3 className="font-semibold text-gray-900">{tpl.name}</h3>
              <p className="mt-1 text-sm text-gray-600">{tpl.description}</p>
              <button type="button" disabled={busy} onClick={() => void runAction("create_from_template", { template_key: tpl.template_key })} className="mt-3 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white">{labels.useTemplate}</button>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "search" && searchResults ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">{labels.searchResults}: &ldquo;{searchResults.query}&rdquo;</h2>
          <DocList docs={searchResults.documents} labels={labels} />
          {(searchResults.knowledge_articles ?? []).length > 0 ? (
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">{labels.knowledgeBase}</h3>
              {searchResults.knowledge_articles.map((a, i) => (
                <div key={i} className="rounded-lg border border-gray-200 bg-white p-3 text-sm">
                  <p className="font-medium">{String(a.title ?? a.question ?? "")}</p>
                  <p className="mt-1 text-gray-600 line-clamp-2">{String(a.summary ?? a.content ?? a.answer ?? "")}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {(center.pending_approvals?.length ?? 0) > 0 ? (
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-4">
          <h3 className="font-semibold text-gray-900">{labels.pendingReview}</h3>
          <div className="mt-3 space-y-2">
            {center.pending_approvals?.map((a) => (
              <div key={a.approval_id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white p-3">
                <span className="text-sm font-medium">{a.document_title}</span>
                <div className="flex gap-2">
                  <button type="button" onClick={() => void runAction("approve_document", { document_id: a.document_id })} className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-medium text-white">{labels.approve}</button>
                  <button type="button" onClick={() => void runAction("reject_document", { document_id: a.document_id })} className="rounded-lg border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700">{labels.reject}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StatCard({ label, value, highlight }: { label: string; value: string | number; highlight?: "amber" | "indigo" }) {
  const cls = highlight === "amber" ? "border-amber-100 bg-amber-50/40" : highlight === "indigo" ? "border-indigo-100 bg-indigo-50/40" : "border-gray-200 bg-white";
  return (
    <div className={`rounded-xl border p-4 ${cls}`}>
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function CreateForm({ labels, title, description, category, fileType, busy, onTitleChange, onDescriptionChange, onCategoryChange, onFileTypeChange, onSubmit }: {
  labels: DocumentManagementLabels; title: string; description: string; category: string; fileType: string; busy: boolean;
  onTitleChange: (v: string) => void; onDescriptionChange: (v: string) => void; onCategoryChange: (v: string) => void; onFileTypeChange: (v: string) => void; onSubmit: () => void;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <h2 className="text-lg font-semibold text-gray-900">{labels.createDocument}</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-gray-700">{labels.docTitle}</span>
          <input value={title} onChange={(e) => onTitleChange(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-gray-700">{labels.docDescription}</span>
          <textarea value={description} onChange={(e) => onDescriptionChange(e.target.value)} rows={2} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">{labels.category}</span>
          <select value={category} onChange={(e) => onCategoryChange(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
            {["policies", "procedures", "guides", "training", "legal", "hr", "finance", "operations", "support", "contracts", "reports"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">{labels.fileType}</span>
          <select value={fileType} onChange={(e) => onFileTypeChange(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
            {["pdf", "docx", "xlsx", "csv", "pptx", "txt"].map((f) => (
              <option key={f} value={f}>{f.toUpperCase()}</option>
            ))}
          </select>
        </label>
      </div>
      <button type="button" disabled={busy || !title.trim()} onClick={onSubmit} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{labels.save}</button>
    </div>
  );
}
