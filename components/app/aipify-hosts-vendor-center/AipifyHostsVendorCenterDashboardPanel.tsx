"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseAipifyHostsVendorCenterActionResult,
  parseAipifyHostsVendorCenterDashboard,
  type HostsCertificationRow,
  type HostsContractRow,
  type HostsPerformanceReviewRow,
  type HostsVendorCenterDashboard,
  type HostsVendorCenterSectionKey,
  type HostsVendorRow,
} from "@/lib/aipify/aipify-hosts-vendor-center";

type Props = { labels: Record<string, string> };

function statusBadge(status: string): string {
  const map: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    in_review: "bg-indigo-50 text-indigo-800 ring-indigo-200",
    suspended: "bg-red-50 text-red-800 ring-red-200",
    inactive: "bg-gray-100 text-gray-600 ring-gray-200",
    draft: "bg-gray-100 text-gray-700 ring-gray-200",
    expiring_soon: "bg-amber-50 text-amber-900 ring-amber-200",
    expired: "bg-red-50 text-red-800 ring-red-200",
    terminated: "bg-gray-100 text-gray-600 ring-gray-200",
    valid: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    missing: "bg-gray-100 text-gray-600 ring-gray-200",
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

function VendorTable({
  rows,
  labels,
  busy,
  onAction,
}: {
  rows: HostsVendorRow[];
  labels: Record<string, string>;
  busy: boolean;
  onAction: (vendorId: string, actionType: string, contractId?: string) => void;
}) {
  if (rows.length === 0) {
    return <EmptyBoard title={labels.emptyVendorsTitle} message={labels.emptyVendorsMessage} />;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">{labels.companyName}</th>
            <th className="px-4 py-3">{labels.contactPerson}</th>
            <th className="px-4 py-3">{labels.email}</th>
            <th className="px-4 py-3">{labels.phoneNumber}</th>
            <th className="px-4 py-3">{labels.serviceCategory}</th>
            <th className="px-4 py-3">{labels.coverageArea}</th>
            <th className="px-4 py-3">{labels.status}</th>
            <th className="px-4 py-3">{labels.actions}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className={`border-b border-gray-100 ${row.status === "suspended" ? "bg-red-50/20" : ""}`}>
              <td className="px-4 py-3 font-medium text-gray-900">{row.company_name}</td>
              <td className="px-4 py-3 text-gray-700">{row.contact_person}</td>
              <td className="px-4 py-3 text-gray-700">{row.email}</td>
              <td className="px-4 py-3 text-gray-700">{row.phone_number}</td>
              <td className="px-4 py-3 text-gray-700">{labelFor(labels, "cat", row.service_category)}</td>
              <td className="px-4 py-3 text-gray-700">{row.coverage_area}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.status)}`}>
                  {labelFor(labels, "vstatus", row.status)}
                </span>
              </td>
              <td className="px-4 py-3 min-w-[220px]">
                <div className="flex flex-wrap gap-2">
                  <button type="button" disabled={busy} onClick={() => onAction(row.id, "assign_vendor")} className="text-xs font-medium text-violet-700 disabled:opacity-60">{labels.assignVendor}</button>
                  <button type="button" disabled={busy} onClick={() => onAction(row.id, "request_service")} className="text-xs font-medium text-teal-700 disabled:opacity-60">{labels.requestService}</button>
                  <button type="button" disabled={busy} onClick={() => onAction(row.id, "review_performance")} className="text-xs font-medium text-indigo-700 disabled:opacity-60">{labels.reviewPerformance}</button>
                  {row.status !== "inactive" && (
                    <button type="button" disabled={busy} onClick={() => onAction(row.id, "archive_vendor")} className="text-xs font-medium text-gray-700 disabled:opacity-60">{labels.archiveVendor}</button>
                  )}
                  {row.status === "active" && (
                    <button type="button" disabled={busy} onClick={() => onAction(row.id, "suspend_vendor")} className="text-xs font-medium text-red-700 disabled:opacity-60">{labels.suspendVendor}</button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ContractTable({
  rows,
  labels,
  busy,
  showRenew,
  onRenew,
}: {
  rows: HostsContractRow[];
  labels: Record<string, string>;
  busy: boolean;
  showRenew?: boolean;
  onRenew: (vendorId: string, contractId: string) => void;
}) {
  if (rows.length === 0) {
    return <EmptyBoard title={labels.emptyContractsTitle} message={labels.emptyContractsMessage} />;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">{labels.vendor}</th>
            <th className="px-4 py-3">{labels.contractType}</th>
            <th className="px-4 py-3">{labels.startDate}</th>
            <th className="px-4 py-3">{labels.endDate}</th>
            <th className="px-4 py-3">{labels.renewalTerms}</th>
            <th className="px-4 py-3">{labels.status}</th>
            {showRenew && <th className="px-4 py-3">{labels.actions}</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className={`border-b border-gray-100 ${row.status === "expiring_soon" ? "bg-amber-50/30" : ""}`}>
              <td className="px-4 py-3 font-medium text-gray-900">{row.vendor}</td>
              <td className="px-4 py-3 text-gray-700">{labelFor(labels, "ctype", row.contract_type)}</td>
              <td className="px-4 py-3 text-gray-700">{row.start_date}</td>
              <td className="px-4 py-3 text-gray-700">{row.end_date}</td>
              <td className="px-4 py-3 text-gray-700">{row.renewal_terms}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.status)}`}>
                  {labelFor(labels, "cstatus", row.status)}
                </span>
              </td>
              {showRenew && (
                <td className="px-4 py-3">
                  {(row.status === "expiring_soon" || row.status === "active") && (
                    <button type="button" disabled={busy} onClick={() => onRenew(row.vendor_id, row.id)} className="text-xs font-medium text-violet-700 disabled:opacity-60">{labels.renewContract}</button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CertificationTable({ rows, labels }: { rows: HostsCertificationRow[]; labels: Record<string, string> }) {
  if (rows.length === 0) {
    return <EmptyBoard title={labels.emptyCertsTitle} message={labels.emptyCertsMessage} />;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">{labels.vendor}</th>
            <th className="px-4 py-3">{labels.certificationType}</th>
            <th className="px-4 py-3">{labels.documentName}</th>
            <th className="px-4 py-3">{labels.expiryDate}</th>
            <th className="px-4 py-3">{labels.verificationStatus}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className={`border-b border-gray-100 ${row.verification_status === "expired" ? "bg-red-50/20" : row.verification_status === "expiring_soon" ? "bg-amber-50/20" : ""}`}>
              <td className="px-4 py-3 font-medium text-gray-900">{row.vendor}</td>
              <td className="px-4 py-3 text-gray-700">{labelFor(labels, "certtype", row.certification_type)}</td>
              <td className="px-4 py-3 text-gray-700">{row.document_name}</td>
              <td className="px-4 py-3 text-gray-700">{row.expiry_date ?? "—"}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.verification_status)}`}>
                  {labelFor(labels, "certstatus", row.verification_status)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ReviewsTable({ rows, labels }: { rows: HostsPerformanceReviewRow[]; labels: Record<string, string> }) {
  if (rows.length === 0) {
    return <EmptyBoard title={labels.emptyReviewsTitle} message={labels.emptyReviewsMessage} />;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">{labels.vendor}</th>
            <th className="px-4 py-3">{labels.reviewFrequency}</th>
            <th className="px-4 py-3">{labels.reliabilityScore}</th>
            <th className="px-4 py-3">{labels.responseTime}</th>
            <th className="px-4 py-3">{labels.qualityRating}</th>
            <th className="px-4 py-3">{labels.costEffectiveness}</th>
            <th className="px-4 py-3">{labels.overallRating}</th>
            <th className="px-4 py-3">{labels.nextReviewDue}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-100">
              <td className="px-4 py-3 font-medium text-gray-900">{row.vendor}</td>
              <td className="px-4 py-3 text-gray-700">{labelFor(labels, "freq", row.review_frequency)}</td>
              <td className="px-4 py-3 text-gray-700">{row.reliability_score}</td>
              <td className="px-4 py-3 text-gray-700">{row.response_time_score}</td>
              <td className="px-4 py-3 text-gray-700">{row.quality_rating}</td>
              <td className="px-4 py-3 text-gray-700">{row.cost_effectiveness}</td>
              <td className="px-4 py-3 font-semibold text-gray-900">{row.overall_rating}</td>
              <td className="px-4 py-3 text-gray-700">{row.next_review_due ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AipifyHostsVendorCenterDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<HostsVendorCenterDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeSection, setActiveSection] = useState<HostsVendorCenterSectionKey>("vendors");
  const [busy, setBusy] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCategory, setNewCategory] = useState("cleaning");
  const [newContact, setNewContact] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newCoverage, setNewCoverage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const res = await fetch(`/api/aipify/aipify-hosts/vendor-center/dashboard?section=${activeSection}`);
    if (res.ok) {
      setDashboard(parseAipifyHostsVendorCenterDashboard(await res.json()));
    } else {
      setError(true);
    }
    setLoading(false);
  }, [activeSection]);

  useEffect(() => {
    void load();
  }, [load]);

  const runAction = async (body: Record<string, unknown>) => {
    setBusy(true);
    setActionMessage(null);
    const res = await fetch("/api/aipify/aipify-hosts/vendor-center/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = parseAipifyHostsVendorCenterActionResult(await res.json());
    setBusy(false);
    if (result.success) {
      setActionMessage(labels.actionRecorded);
      setNewCompanyName("");
      setNewContact("");
      setNewEmail("");
      setNewPhone("");
      setNewCoverage("");
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

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-violet-100 bg-violet-50/40 p-6">
        <p className="text-sm font-medium text-violet-950">{dashboard.positioning}</p>
        <p className="mt-2 text-xs text-violet-900">{labels.governanceNote}</p>
        <Link href="/app/aipify-hosts" className="mt-4 inline-flex rounded-lg border border-violet-200 bg-white px-4 py-2 text-sm font-medium text-violet-900 hover:bg-violet-50">
          {labels.backToHosts}
        </Link>
      </section>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard label={labels.activeVendors} value={dashboard.stats.active_vendors} />
        <MetricCard label={labels.contractsExpiring} value={dashboard.stats.contracts_expiring} />
        <MetricCard label={labels.certsExpiring} value={dashboard.stats.certs_expiring} />
        <MetricCard label={labels.reviewsDue} value={dashboard.stats.reviews_due} />
        <MetricCard label={labels.suspendedVendors} value={dashboard.stats.suspended_vendors} />
      </dl>

      <section className="flex flex-wrap gap-2">
        {dashboard.sections.map((section) => (
          <button
            key={section.key}
            type="button"
            onClick={() => setActiveSection(section.key as HostsVendorCenterSectionKey)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              activeSection === section.key ? "bg-violet-700 text-white" : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {labelFor(labels, "section", section.key)}
          </button>
        ))}
      </section>

      {actionMessage && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">{actionMessage}</p>
      )}

      {activeSection === "vendors" && (
        <>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
            <h3 className="font-semibold text-gray-900">{labels.addVendor}</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <input type="text" value={newCompanyName} onChange={(e) => setNewCompanyName(e.target.value)} placeholder={labels.companyNamePlaceholder} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
                {dashboard.vendor_categories.map((c) => (
                  <option key={c} value={c}>{labelFor(labels, "cat", c)}</option>
                ))}
              </select>
              <input type="text" value={newContact} onChange={(e) => setNewContact(e.target.value)} placeholder={labels.contactPersonPlaceholder} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder={labels.emailPlaceholder} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              <input type="tel" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder={labels.phonePlaceholder} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              <input type="text" value={newCoverage} onChange={(e) => setNewCoverage(e.target.value)} placeholder={labels.coveragePlaceholder} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <button
              type="button"
              disabled={busy || !newCompanyName.trim()}
              onClick={() =>
                void runAction({
                  action: "create_vendor",
                  company_name: newCompanyName,
                  service_category: newCategory,
                  contact_person: newContact || undefined,
                  email: newEmail || undefined,
                  phone_number: newPhone || undefined,
                  coverage_area: newCoverage || undefined,
                })
              }
              className="inline-flex rounded-lg bg-violet-700 px-4 py-2 text-sm font-medium text-white hover:bg-violet-800 disabled:opacity-60"
            >
              {labels.addVendor}
            </button>
          </div>
          <VendorTable
            rows={dashboard.vendors}
            labels={labels}
            busy={busy}
            onAction={(vendorId, actionType, contractId) =>
              void runAction({
                action: "vendor_action",
                vendor_id: vendorId,
                action_type: actionType,
                contract_id: contractId,
              })
            }
          />
        </>
      )}

      {activeSection === "contracts" && (
        <ContractTable
          rows={dashboard.contracts}
          labels={labels}
          busy={busy}
          showRenew
          onRenew={(vendorId, contractId) =>
            void runAction({ action: "vendor_action", vendor_id: vendorId, action_type: "renew_contract", contract_id: contractId })
          }
        />
      )}

      {activeSection === "service_agreements" && (
        <ContractTable rows={dashboard.service_agreements} labels={labels} busy={busy} onRenew={() => {}} />
      )}

      {activeSection === "certifications" && (
        <CertificationTable rows={dashboard.certifications} labels={labels} />
      )}

      {activeSection === "performance_reviews" && (
        <ReviewsTable rows={dashboard.performance_reviews} labels={labels} />
      )}
    </div>
  );
}
