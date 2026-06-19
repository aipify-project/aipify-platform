"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import type {
  Audit,
  ComplianceItem,
  CorrectiveAction,
  Improvement,
  Incident,
  QualityOperationsCenter,
  QualityOperationsLabels,
  QualityOperationsTab,
  Standard,
} from "@/lib/quality-operations";
import { parseQualityOperationsCenter } from "@/lib/quality-operations/parse";

type Tab = QualityOperationsTab;

const STATUS_STYLE: Record<string, string> = {
  draft: "bg-aipify-surface-muted text-aipify-text-secondary ring-aipify-border",
  active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  review_required: "bg-amber-50 text-amber-900 ring-amber-200",
  retired: "bg-gray-100 text-gray-500 ring-gray-200",
  compliant: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  needs_review: "bg-amber-50 text-amber-900 ring-amber-200",
  non_compliant: "bg-red-50 text-red-900 ring-red-200",
  restricted: "bg-orange-50 text-orange-900 ring-orange-200",
  scheduled: "bg-sky-50 text-sky-900 ring-sky-200",
  in_progress: "bg-violet-50 text-violet-900 ring-violet-200",
  findings_recorded: "bg-orange-50 text-orange-900 ring-orange-200",
  closed: "bg-gray-100 text-gray-600 ring-gray-200",
  reported: "bg-amber-50 text-amber-900 ring-amber-200",
  investigating: "bg-sky-50 text-sky-900 ring-sky-200",
  resolved: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  submitted: "bg-sky-50 text-sky-900 ring-sky-200",
  approved: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  open: "bg-amber-50 text-amber-900 ring-amber-200",
  verified: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  implemented: "bg-violet-50 text-violet-900 ring-violet-200",
};

type Props = {
  labels: QualityOperationsLabels;
  initialTab?: Tab;
  titleOverride?: string;
  visibleTabs?: Tab[];
};

export function QualityOperationsPanel({ labels, initialTab = "overview", titleOverride, visibleTabs }: Props) {
  const [center, setCenter] = useState<QualityOperationsCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>(initialTab);
  const [busy, setBusy] = useState(false);
  const [standardTitle, setStandardTitle] = useState("");
  const [auditTitle, setAuditTitle] = useState("");
  const [incidentTitle, setIncidentTitle] = useState("");
  const [improvementTitle, setImprovementTitle] = useState("");
  const [complianceTitle, setComplianceTitle] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/quality-operations");
    if (res.ok) setCenter(parseQualityOperationsCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  async function runAction(action_type: string, payload: Record<string, unknown> = {}) {
    setBusy(true);
    await fetch("/api/app/quality-operations/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type, payload }),
    });
    setBusy(false);
    await load();
  }

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
      </div>
    );
  }

  if (!center?.found) {
    return <AipifyModuleAccessDenied message={labels.accessDenied} />;
  }

  const overview = center.overview ?? {};
  const reports = center.reports ?? {};
  const standards = center.standards ?? [];
  const complianceItems = center.compliance_items ?? [];
  const audits = center.audits ?? [];
  const incidents = center.incidents ?? [];
  const correctiveActions = center.corrective_actions ?? [];
  const improvements = center.improvements ?? [];
  const score = center.quality_score;

  const allTabs: { id: Tab; label: string }[] = [
    { id: "overview", label: labels.overview },
    { id: "standards", label: labels.standards },
    { id: "audits", label: labels.audits },
    { id: "compliance", label: labels.compliance },
    { id: "incidents", label: labels.incidents },
    { id: "corrective_actions", label: labels.correctiveActions },
    { id: "improvements", label: labels.improvements },
    { id: "reports", label: labels.reports },
  ];
  const tabs = visibleTabs ? allTabs.filter((t) => visibleTabs.includes(t.id)) : allTabs;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-semibold text-aipify-text">{titleOverride ?? labels.title}</h1>
        <p className="mt-1 text-sm text-aipify-text-secondary">{labels.subtitle}</p>
        {center.principle ? <p className="mt-2 text-xs text-aipify-text-muted">{center.principle}</p> : null}
      </header>

      <nav className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={
              tab === item.id
                ? `${AipifyShellClasses.primaryButton} text-sm`
                : `${AipifyShellClasses.secondaryButton} text-sm`
            }
          >
            {item.label}
          </button>
        ))}
      </nav>

      {tab === "overview" ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(
              [
                [labels.qualityScore, score?.quality_score ?? overview.quality_score],
                [labels.qualityStatus, score?.quality_status ?? overview.quality_status],
                [labels.activeStandards, overview.active_standards],
                [labels.openAudits, overview.open_audits],
                [labels.complianceRisks, overview.compliance_risks],
                [labels.openIncidents, overview.open_incidents],
                [labels.criticalFindings, overview.critical_findings],
                [labels.overdueCorrectiveActions, overview.overdue_corrective_actions],
              ] as [string, string | number | undefined][]
            ).map(([label, value]) => (
              <div key={String(label)} className={`${AipifyShellClasses.surfaceCard} p-4`}>
                <p className="text-xs text-aipify-text-muted">{label}</p>
                <p className="mt-1 text-xl font-semibold capitalize text-aipify-text">
                  {typeof value === "number" || typeof value === "string" ? String(value).replace(/_/g, " ") : "—"}
                </p>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => void runAction("refresh_quality_score")}
              className={AipifyShellClasses.secondaryButton}
            >
              {labels.refreshQualityScore}
            </button>
          </div>
          {center.companion_insights ? (
            <section className={`${AipifyShellClasses.surfaceCard} p-4`}>
              <h2 className="text-sm font-semibold text-aipify-text">{labels.companionInsights}</h2>
              <div className="mt-3 grid gap-4 sm:grid-cols-2 text-sm">
                {Array.isArray(center.companion_insights.open_audits) &&
                (center.companion_insights.open_audits as Record<string, unknown>[]).length > 0 ? (
                  <div>
                    <p className="font-medium text-aipify-text">{labels.openAudits}</p>
                    <ul className="mt-2 space-y-1 text-aipify-text-secondary">
                      {(center.companion_insights.open_audits as Record<string, unknown>[]).map((row, i) => (
                        <li key={i}>{String(row.title ?? "")}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {Array.isArray(center.companion_insights.compliance_risks) &&
                (center.companion_insights.compliance_risks as Record<string, unknown>[]).length > 0 ? (
                  <div>
                    <p className="font-medium text-aipify-text">{labels.complianceRisks}</p>
                    <ul className="mt-2 space-y-1 text-aipify-text-secondary">
                      {(center.companion_insights.compliance_risks as Record<string, unknown>[]).map((row, i) => (
                        <li key={i}>{String(row.title ?? "")}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}
          {center.integrations ? (
            <section className={`${AipifyShellClasses.surfaceMuted} p-4 text-sm`}>
              <p className="text-aipify-text-secondary">{labels.knowledgeIntegration}: {center.integrations.knowledge_center}</p>
              <p className="mt-1 text-aipify-text-secondary">{labels.peopleIntegration}: {center.integrations.people_engine}</p>
            </section>
          ) : null}
        </>
      ) : null}

      {tab === "standards" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} grid gap-3 p-4 sm:grid-cols-2`}>
            <input
              value={standardTitle}
              onChange={(e) => setStandardTitle(e.target.value)}
              placeholder={labels.standardTitle}
              className={AipifyShellClasses.input}
            />
            <button
              type="button"
              disabled={busy || !standardTitle.trim()}
              onClick={() =>
                void runAction("create_standard", { title: standardTitle.trim() }).then(() => setStandardTitle(""))
              }
              className={AipifyShellClasses.primaryButton}
            >
              {labels.createStandard}
            </button>
          </div>
          {standards.length === 0 ? (
            <PlatformEmptyState title={labels.noStandards} message={labels.emptyHint} />
          ) : (
            <div className="grid gap-3">
              {standards.map((s: Standard) => (
                <div key={s.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-aipify-text-muted">{s.standard_number ?? s.id.slice(0, 8)}</p>
                      <h3 className="font-semibold text-aipify-text">{s.title}</h3>
                      {s.review_date ? <p className="text-aipify-text-muted">Review {s.review_date}</p> : null}
                    </div>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset capitalize ${STATUS_STYLE[s.status] ?? STATUS_STYLE.draft}`}
                    >
                      {s.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  {s.status === "draft" ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void runAction("activate_standard", { standard_id: s.id })}
                      className={`mt-3 ${AipifyShellClasses.primaryButton}`}
                    >
                      {labels.activateStandard}
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {tab === "compliance" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} grid gap-3 p-4 sm:grid-cols-2`}>
            <input
              value={complianceTitle}
              onChange={(e) => setComplianceTitle(e.target.value)}
              placeholder={labels.complianceTitle}
              className={AipifyShellClasses.input}
            />
            <button
              type="button"
              disabled={busy || !complianceTitle.trim()}
              onClick={() =>
                void runAction("create_compliance_item", { title: complianceTitle.trim() }).then(() =>
                  setComplianceTitle(""),
                )
              }
              className={AipifyShellClasses.primaryButton}
            >
              {labels.createComplianceItem}
            </button>
          </div>
          {complianceItems.length === 0 ? (
            <PlatformEmptyState title={labels.noComplianceItems} message={labels.emptyHint} />
          ) : (
            <div className="grid gap-3">
              {complianceItems.map((c: ComplianceItem) => (
                <div key={c.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-aipify-text-muted">{c.item_number ?? c.id.slice(0, 8)}</p>
                      <h3 className="font-semibold text-aipify-text">{c.title}</h3>
                      <p className="capitalize text-aipify-text-secondary">{c.compliance_type.replace(/_/g, " ")}</p>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset capitalize ${STATUS_STYLE[c.status] ?? STATUS_STYLE.compliant}`}
                    >
                      {c.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {tab === "audits" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} grid gap-3 p-4 sm:grid-cols-2`}>
            <input
              value={auditTitle}
              onChange={(e) => setAuditTitle(e.target.value)}
              placeholder={labels.auditTitle}
              className={AipifyShellClasses.input}
            />
            <button
              type="button"
              disabled={busy || !auditTitle.trim()}
              onClick={() => void runAction("create_audit", { title: auditTitle.trim() }).then(() => setAuditTitle(""))}
              className={AipifyShellClasses.primaryButton}
            >
              {labels.createAudit}
            </button>
          </div>
          {audits.length === 0 ? (
            <PlatformEmptyState title={labels.noAudits} message={labels.emptyHint} />
          ) : (
            <div className="grid gap-3">
              {audits.map((a: Audit) => (
                <div key={a.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-aipify-text-muted">{a.audit_number ?? a.id.slice(0, 8)}</p>
                      <h3 className="font-semibold text-aipify-text">{a.title}</h3>
                      <p className="capitalize text-aipify-text-secondary">{a.audit_type.replace(/_/g, " ")}</p>
                      {a.findings_count != null ? (
                        <p className="text-aipify-text-muted">{a.findings_count} findings</p>
                      ) : null}
                    </div>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset capitalize ${STATUS_STYLE[a.status] ?? STATUS_STYLE.scheduled}`}
                    >
                      {a.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {a.status === "scheduled" ? (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void runAction("start_audit", { audit_id: a.id })}
                        className={AipifyShellClasses.primaryButton}
                      >
                        {labels.startAudit}
                      </button>
                    ) : null}
                    {!["closed", "cancelled"].includes(a.status) ? (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void runAction("close_audit", { audit_id: a.id })}
                        className={AipifyShellClasses.secondaryButton}
                      >
                        {labels.closeAudit}
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {tab === "incidents" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} grid gap-3 p-4 sm:grid-cols-2`}>
            <input
              value={incidentTitle}
              onChange={(e) => setIncidentTitle(e.target.value)}
              placeholder={labels.incidentTitle}
              className={AipifyShellClasses.input}
            />
            <button
              type="button"
              disabled={busy || !incidentTitle.trim()}
              onClick={() =>
                void runAction("report_incident", { title: incidentTitle.trim() }).then(() => setIncidentTitle(""))
              }
              className={AipifyShellClasses.primaryButton}
            >
              {labels.reportIncident}
            </button>
          </div>
          {incidents.length === 0 ? (
            <PlatformEmptyState title={labels.noIncidents} message={labels.emptyHint} />
          ) : (
            <div className="grid gap-3">
              {incidents.map((i: Incident) => (
                <div key={i.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-aipify-text-muted">{i.incident_number ?? i.id.slice(0, 8)}</p>
                      <h3 className="font-semibold text-aipify-text">{i.title}</h3>
                      <p className="capitalize text-aipify-text-secondary">{i.category.replace(/_/g, " ")}</p>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset capitalize ${STATUS_STYLE[i.status] ?? STATUS_STYLE.reported}`}
                    >
                      {i.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  {!["closed", "resolved"].includes(i.status) ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void runAction("resolve_incident", { incident_id: i.id })}
                      className={`mt-3 ${AipifyShellClasses.primaryButton}`}
                    >
                      {labels.resolveIncident}
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {tab === "corrective_actions" ? (
        <div className="grid gap-3">
          {correctiveActions.length === 0 ? (
            <PlatformEmptyState title={labels.noCorrectiveActions} message={labels.emptyHint} />
          ) : (
            correctiveActions.map((ca: CorrectiveAction) => (
              <div key={ca.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-aipify-text-muted">{ca.action_number ?? ca.id.slice(0, 8)}</p>
                    <h3 className="font-semibold text-aipify-text">{ca.title}</h3>
                    {ca.due_date ? <p className="text-aipify-text-muted">Due {ca.due_date}</p> : null}
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset capitalize ${STATUS_STYLE[ca.status] ?? STATUS_STYLE.open}`}
                  >
                    {ca.status.replace(/_/g, " ")}
                  </span>
                </div>
                {ca.status === "implemented" ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void runAction("verify_corrective_action", { action_id: ca.id })}
                    className={`mt-3 ${AipifyShellClasses.primaryButton}`}
                  >
                    {labels.verifyCorrectiveAction}
                  </button>
                ) : null}
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "improvements" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} grid gap-3 p-4 sm:grid-cols-2`}>
            <input
              value={improvementTitle}
              onChange={(e) => setImprovementTitle(e.target.value)}
              placeholder={labels.improvementTitle}
              className={AipifyShellClasses.input}
            />
            <button
              type="button"
              disabled={busy || !improvementTitle.trim()}
              onClick={() =>
                void runAction("submit_improvement", { title: improvementTitle.trim() }).then(() =>
                  setImprovementTitle(""),
                )
              }
              className={AipifyShellClasses.primaryButton}
            >
              {labels.submitImprovement}
            </button>
          </div>
          {improvements.length === 0 ? (
            <PlatformEmptyState title={labels.noImprovements} message={labels.emptyHint} />
          ) : (
            <div className="grid gap-3">
              {improvements.map((im: Improvement) => (
                <div key={im.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-aipify-text-muted">{im.improvement_number ?? im.id.slice(0, 8)}</p>
                      <h3 className="font-semibold text-aipify-text">{im.title}</h3>
                      <p className="capitalize text-aipify-text-secondary">{im.category.replace(/_/g, " ")}</p>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset capitalize ${STATUS_STYLE[im.status] ?? STATUS_STYLE.submitted}`}
                    >
                      {im.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  {["submitted", "review"].includes(im.status) ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void runAction("approve_improvement", { improvement_id: im.id })}
                      className={`mt-3 ${AipifyShellClasses.primaryButton}`}
                    >
                      {labels.approveImprovement}
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {tab === "reports" ? (
        <div className={`${AipifyShellClasses.surfaceCard} space-y-3 p-4 text-sm`}>
          <p>
            Audit completion rate: {String(reports.audit_completion_rate ?? 0)}%
          </p>
          <p>Open incidents: {String(reports.incident_trend_open ?? 0)}</p>
          <p>Improvements completed: {String(reports.improvements_completed ?? 0)}</p>
          {reports.department_risk_note ? (
            <p className="text-aipify-text-secondary">{String(reports.department_risk_note)}</p>
          ) : null}
        </div>
      ) : null}

      {center.audit_recent && center.audit_recent.length > 0 ? (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-aipify-text">{labels.auditLog}</h2>
          <ul className={`${AipifyShellClasses.surfaceCard} divide-y divide-aipify-border text-sm`}>
            {center.audit_recent.map((entry, i) => (
              <li key={`${entry.action}-${i}`} className="px-4 py-2 text-aipify-text-secondary">
                {entry.summary}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
