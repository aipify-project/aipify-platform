"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseAipifyHostsDocumentCenterActionResult,
  parseAipifyHostsDocumentCenterDashboard,
  type HostsDocumentCenterDashboard,
  type HostsDocumentCenterSectionKey,
  type HostsDocumentRow,
  type HostsDocumentTemplateRow,
  type HostsDocumentVersionRow,
  type HostsPropertyVaultRow,
} from "@/lib/aipify/aipify-hosts-document-center";

type Props = { labels: Record<string, string> };

const SECTION_DEFAULT_CATEGORY: Record<string, string> = {
  property_documents: "house_rules",
  safety_documents: "emergency_procedures",
  vendor_documents: "vendor_agreements",
  financial_documents: "insurance_documents",
};

function statusBadge(status: string): string {
  const map: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    expiring_soon: "bg-amber-50 text-amber-900 ring-amber-200",
    expired: "bg-red-50 text-red-800 ring-red-200",
    archived: "bg-gray-100 text-gray-600 ring-gray-200",
  };
  return map[status] ?? "bg-gray-100 text-gray-700 ring-gray-200";
}

function labelFor(labels: Record<string, string>, prefix: string, key: string): string {
  return labels[`${prefix}_${key}`] ?? key.replace(/_/g, " ");
}

function EmptyBoard({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 px-4 py-8 text-center">
      <p className="text-sm font-medium text-gray-800">{title}</p>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

function VaultGrid({ rows, labels }: { rows: HostsPropertyVaultRow[]; labels: Record<string, string> }) {
  if (rows.length === 0) return <EmptyBoard title={labels.emptyVaultsTitle} message={labels.emptyVaultsMessage} />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map((vault) => (
        <div key={vault.property_id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900">{vault.property_name}</h3>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div><dt className="text-gray-500">{labels.documentCount}</dt><dd className="font-medium">{vault.document_count}</dd></div>
            <div><dt className="text-gray-500">{labels.expiringCount}</dt><dd className="font-medium">{vault.expiring_documents}</dd></div>
          </dl>
          {vault.recently_updated.length > 0 && (
            <ul className="mt-3 space-y-1 border-t border-gray-100 pt-3 text-xs text-gray-600">
              {vault.recently_updated.map((doc) => (
                <li key={doc.id}>{doc.document_name} · {doc.updated_at}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

function DocumentTable({
  rows,
  labels,
  busy,
  versions,
  expandedId,
  onToggleVersions,
  onAction,
}: {
  rows: HostsDocumentRow[];
  labels: Record<string, string>;
  busy: boolean;
  versions: HostsDocumentVersionRow[];
  expandedId: string | null;
  onToggleVersions: (id: string) => void;
  onAction: (id: string, type: string) => void;
}) {
  if (rows.length === 0) {
    return <EmptyBoard title={labels.emptyDocumentsTitle} message={labels.emptyDocumentsMessage} />;
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">{labels.documentName}</th>
              <th className="px-4 py-3">{labels.category}</th>
              <th className="px-4 py-3">{labels.property}</th>
              <th className="px-4 py-3">{labels.uploadedBy}</th>
              <th className="px-4 py-3">{labels.uploadDate}</th>
              <th className="px-4 py-3">{labels.expirationDate}</th>
              <th className="px-4 py-3">{labels.status}</th>
              <th className="px-4 py-3">{labels.actions}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className={`border-b border-gray-100 ${row.status === "expiring_soon" ? "bg-amber-50/30" : row.status === "expired" ? "bg-red-50/20" : ""}`}>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{row.document_name}</div>
                  <div className="text-xs text-gray-500">v{row.current_version} · {row.file_label}</div>
                </td>
                <td className="px-4 py-3 text-gray-700">{labelFor(labels, "cat", row.category)}</td>
                <td className="px-4 py-3 text-gray-700">{row.property}</td>
                <td className="px-4 py-3 text-gray-700">{row.uploaded_by}</td>
                <td className="px-4 py-3 text-gray-700">{row.upload_date}</td>
                <td className="px-4 py-3 text-gray-700">{row.expiration_date ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.status)}`}>
                    {labelFor(labels, "dstatus", row.status)}
                  </span>
                </td>
                <td className="px-4 py-3 min-w-[220px]">
                  <div className="flex flex-wrap gap-2">
                    <button type="button" disabled={busy} onClick={() => onAction(row.id, "download")} className="text-xs font-medium text-sky-700 disabled:opacity-60">{labels.download}</button>
                    <button type="button" disabled={busy} onClick={() => onAction(row.id, "replace_version")} className="text-xs font-medium text-indigo-700 disabled:opacity-60">{labels.replaceVersion}</button>
                    <button type="button" disabled={busy} onClick={() => onAction(row.id, "share_internally")} className="text-xs font-medium text-teal-700 disabled:opacity-60">{labels.shareInternally}</button>
                    {row.status !== "archived" && (
                      <button type="button" disabled={busy} onClick={() => onAction(row.id, "archive")} className="text-xs font-medium text-gray-700 disabled:opacity-60">{labels.archive}</button>
                    )}
                    <button type="button" onClick={() => onToggleVersions(row.id)} className="text-xs font-medium text-violet-700">{labels.versions}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {expandedId && (
        <div className="rounded-xl border border-violet-100 bg-violet-50/40 p-4">
          <h4 className="text-sm font-semibold text-violet-950">{labels.versionHistory}</h4>
          <ul className="mt-2 space-y-2 text-sm">
            {versions.filter((v) => v.document_id === expandedId).map((v) => (
              <li key={v.id} className="rounded-lg border border-violet-100 bg-white px-3 py-2">
                <span className="font-medium">v{v.version_number}</span> · {v.updated_by} · {v.updated_date}
                <span className="block text-gray-600">{v.change_notes}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function TemplatesGrid({ rows, labels }: { rows: HostsDocumentTemplateRow[]; labels: Record<string, string> }) {
  if (rows.length === 0) return <EmptyBoard title={labels.emptyTemplatesTitle} message={labels.emptyTemplatesMessage} />;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {rows.map((t) => (
        <div key={t.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-900">{t.template_name}</h3>
            <span className="rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-800 ring-1 ring-sky-200">
              {labelFor(labels, "ttype", t.template_type)}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600">{t.description}</p>
        </div>
      ))}
    </div>
  );
}

export function AipifyHostsDocumentCenterDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<HostsDocumentCenterDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeSection, setActiveSection] = useState<HostsDocumentCenterSectionKey>("property_documents");
  const [busy, setBusy] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProperty, setFilterProperty] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);
  const [newDocName, setNewDocName] = useState("");
  const [newCategory, setNewCategory] = useState("house_rules");
  const [newPropertyId, setNewPropertyId] = useState("");
  const [newExpiration, setNewExpiration] = useState("");
  const [newFileLabel, setNewFileLabel] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const params = new URLSearchParams({ section: activeSection });
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (filterProperty) params.set("property_id", filterProperty);
    if (filterCategory) params.set("category", filterCategory);
    if (filterStatus) params.set("status", filterStatus);
    const res = await fetch(`/api/aipify/aipify-hosts/document-center/dashboard?${params}`);
    if (res.ok) {
      setDashboard(parseAipifyHostsDocumentCenterDashboard(await res.json()));
    } else {
      setError(true);
    }
    setLoading(false);
  }, [activeSection, searchQuery, filterProperty, filterCategory, filterStatus]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setNewCategory(SECTION_DEFAULT_CATEGORY[activeSection] ?? "house_rules");
  }, [activeSection]);

  const sectionCategories = useMemo(() => {
    if (!dashboard) return [];
    if (activeSection === "archive") return dashboard.document_categories;
    const map: Record<string, string[]> = {
      property_documents: ["house_rules", "property_manuals", "property_photos", "inventory_lists"],
      safety_documents: ["emergency_procedures", "inspection_reports"],
      vendor_documents: ["vendor_agreements", "maintenance_records"],
      financial_documents: ["insurance_documents", "compliance_documents"],
    };
    return map[activeSection] ?? dashboard.document_categories;
  }, [dashboard, activeSection]);

  const runAction = async (body: Record<string, unknown>) => {
    setBusy(true);
    setActionMessage(null);
    const res = await fetch("/api/aipify/aipify-hosts/document-center/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = parseAipifyHostsDocumentCenterActionResult(await res.json());
    setBusy(false);
    if (result.success) {
      setActionMessage(result.summary ?? labels.actionRecorded);
      setNewDocName("");
      setNewFileLabel("");
      setNewExpiration("");
      await load();
    } else {
      setActionMessage(labels.actionFailed);
    }
  };

  if (loading && !dashboard) return <AipifyLoader label={labels.loading} centered fullPage />;

  if (error || !dashboard) {
    return (
      <PlatformEmptyState
        title={labels.errorTitle}
        message={labels.errorMessage}
        primaryAction={{ label: labels.retry, onClick: () => void load() }}
      />
    );
  }

  const showDocuments = activeSection !== "templates";

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-sky-100 bg-sky-50/40 p-6">
        <p className="text-sm font-medium text-sky-950">{dashboard.positioning}</p>
        <p className="mt-2 text-xs text-sky-900">{labels.governanceNote}</p>
        <Link href="/app/aipify-hosts" className="mt-4 inline-flex rounded-lg border border-sky-200 bg-white px-4 py-2 text-sm font-medium text-sky-900 hover:bg-sky-50">
          {labels.backToHosts}
        </Link>
      </section>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard label={labels.totalDocuments} value={dashboard.stats.total_documents} />
        <MetricCard label={labels.expiringDocuments} value={dashboard.stats.expiring_documents} />
        <MetricCard label={labels.archivedDocuments} value={dashboard.stats.archived_documents} />
        <MetricCard label={labels.templateCount} value={dashboard.stats.template_count} />
        <MetricCard label={labels.propertyVaults} value={dashboard.stats.property_vaults} />
      </dl>

      <section>
        <h3 className="mb-3 text-lg font-semibold text-gray-900">{labels.propertyVaultsTitle}</h3>
        <VaultGrid rows={dashboard.property_vaults} labels={labels} />
      </section>

      <section className="flex flex-wrap gap-2">
        {dashboard.sections.map((section) => (
          <button
            key={section.key}
            type="button"
            onClick={() => setActiveSection(section.key as HostsDocumentCenterSectionKey)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              activeSection === section.key ? "bg-sky-700 text-white" : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {labelFor(labels, "section", section.key)}
          </button>
        ))}
      </section>

      {showDocuments && (
        <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
          <h3 className="font-semibold text-gray-900">{labels.searchAndFilter}</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={labels.searchPlaceholder} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            <select value={filterProperty} onChange={(e) => setFilterProperty(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="">{labels.allProperties}</option>
              {dashboard.properties.map((p) => (
                <option key={p.id} value={p.id}>{p.display_name}</option>
              ))}
            </select>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="">{labels.allCategories}</option>
              {dashboard.document_categories.map((c) => (
                <option key={c} value={c}>{labelFor(labels, "cat", c)}</option>
              ))}
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="">{labels.allStatuses}</option>
              {dashboard.document_statuses.map((s) => (
                <option key={s} value={s}>{labelFor(labels, "dstatus", s)}</option>
              ))}
            </select>
            <button type="button" onClick={() => void load()} className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-medium text-white hover:bg-sky-800">{labels.applyFilters}</button>
          </div>
        </section>
      )}

      {actionMessage && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">{actionMessage}</p>
      )}

      {showDocuments && activeSection !== "archive" && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
          <h3 className="font-semibold text-gray-900">{labels.uploadDocument}</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <input type="text" value={newDocName} onChange={(e) => setNewDocName(e.target.value)} placeholder={labels.documentNamePlaceholder} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
              {sectionCategories.map((c) => (
                <option key={c} value={c}>{labelFor(labels, "cat", c)}</option>
              ))}
            </select>
            <select value={newPropertyId} onChange={(e) => setNewPropertyId(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="">{labels.allProperties}</option>
              {dashboard.properties.map((p) => (
                <option key={p.id} value={p.id}>{p.display_name}</option>
              ))}
            </select>
            <input type="date" value={newExpiration} onChange={(e) => setNewExpiration(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            <input type="text" value={newFileLabel} onChange={(e) => setNewFileLabel(e.target.value)} placeholder={labels.fileLabelPlaceholder} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <button
            type="button"
            disabled={busy || !newDocName.trim()}
            onClick={() =>
              void runAction({
                action: "upload",
                document_name: newDocName,
                category: newCategory,
                property_id: newPropertyId || undefined,
                expiration_date: newExpiration || undefined,
                file_label: newFileLabel || undefined,
              })
            }
            className="inline-flex rounded-lg bg-sky-700 px-4 py-2 text-sm font-medium text-white hover:bg-sky-800 disabled:opacity-60"
          >
            {labels.uploadDocument}
          </button>
        </div>
      )}

      {activeSection === "templates" ? (
        <TemplatesGrid rows={dashboard.templates} labels={labels} />
      ) : (
        <DocumentTable
          rows={dashboard.documents}
          labels={labels}
          busy={busy}
          versions={dashboard.document_versions}
          expandedId={expandedDocId}
          onToggleVersions={(id) => setExpandedDocId(expandedDocId === id ? null : id)}
          onAction={(id, type) => void runAction({ action: "document_action", document_id: id, action_type: type })}
        />
      )}
    </div>
  );
}
