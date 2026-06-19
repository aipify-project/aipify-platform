"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import {
  parseFormsDataCollectionCenter,
  type FormRecord,
  type FormsDataCollectionCenter,
  type FormsDataCollectionLabels,
  type FormSubmission,
  type FormTemplate,
} from "@/lib/forms-data-collection";

type Tab = "overview" | "forms" | "submissions" | "templates" | "approvals" | "automation" | "reports";

const FORM_STATUS_STYLE: Record<string, string> = {
  draft: "bg-aipify-surface-muted text-aipify-text-secondary ring-aipify-border",
  active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  review_required: "bg-amber-50 text-amber-900 ring-amber-200",
  restricted: "bg-orange-50 text-orange-900 ring-orange-200",
  archived: "bg-red-50 text-red-900 ring-red-200",
};

const SUBMISSION_STATUS_STYLE: Record<string, string> = {
  draft: "bg-aipify-surface-muted text-aipify-text-secondary ring-aipify-border",
  submitted: "bg-sky-50 text-sky-900 ring-sky-200",
  in_review: "bg-amber-50 text-amber-900 ring-amber-200",
  approved: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  rejected: "bg-red-50 text-red-900 ring-red-200",
  completed: "bg-violet-50 text-violet-900 ring-violet-200",
};

type Props = {
  labels: FormsDataCollectionLabels;
  initialTab?: Tab;
};

export function FormsDataCollectionPanel({ labels, initialTab = "overview" }: Props) {
  const [center, setCenter] = useState<FormsDataCollectionCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>(initialTab);
  const [busy, setBusy] = useState(false);
  const [formName, setFormName] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/forms-data-collection");
    if (res.ok) setCenter(parseFormsDataCollectionCenter(await res.json()));
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
    await fetch("/api/app/forms-data-collection/action", {
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
  const forms = center.forms ?? [];
  const submissions = center.submissions ?? [];
  const pendingApprovals = center.pending_approvals ?? [];
  const templates = center.templates ?? [];
  const automation = center.automation ?? [];

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: labels.overview },
    { id: "forms", label: labels.forms },
    { id: "submissions", label: labels.submissions },
    { id: "templates", label: labels.templates },
    { id: "approvals", label: labels.approvals },
    { id: "automation", label: labels.automation },
    { id: "reports", label: labels.reports },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-semibold text-aipify-text">{labels.title}</h1>
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              [labels.totalForms, overview.total_forms],
              [labels.activeForms, overview.active_forms],
              [labels.totalSubmissions, overview.total_submissions],
              [labels.pendingApprovals, overview.pending_approvals],
              [labels.incompleteSubmissions, overview.incomplete_submissions],
              [labels.submissionsToday, overview.submissions_today],
              [labels.templatesAvailable, overview.templates_available],
            ] as [string, string | number][]
          ).map(([label, value]) => (
            <div key={String(label)} className={`${AipifyShellClasses.surfaceCard} p-4`}>
              <p className="text-xs text-aipify-text-muted">{label}</p>
              <p className="mt-1 text-xl font-semibold text-aipify-text">{value ?? "—"}</p>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "forms" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} grid gap-3 p-4 sm:grid-cols-2`}>
            <input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder={labels.formName} className={AipifyShellClasses.input} />
            <button
              type="button"
              disabled={busy || !formName.trim()}
              onClick={() =>
                void runAction("create_form", { name: formName.trim(), form_type: "general" }).then(() => setFormName(""))
              }
              className={AipifyShellClasses.primaryButton}
            >
              {labels.createForm}
            </button>
          </div>
          {forms.length === 0 ? (
            <PlatformEmptyState title={labels.noForms} message={labels.noFormsHint} />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {forms.map((form: FormRecord) => (
                <div key={form.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-aipify-text-muted">{form.form_number ?? form.id.slice(0, 8)}</p>
                      <h3 className="font-semibold text-aipify-text">{form.name}</h3>
                      <p className="text-aipify-text-secondary">
                        {form.form_type.replace(/_/g, " ")} · v{form.version}
                      </p>
                      <p className="text-aipify-text-muted">
                        {labels.fieldCount}: {form.field_count ?? 0} · {form.submission_count ?? 0} submissions
                      </p>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${FORM_STATUS_STYLE[form.status] ?? FORM_STATUS_STYLE.draft}`}
                    >
                      {form.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {form.status === "draft" ? (
                      <button type="button" disabled={busy} onClick={() => void runAction("publish_form", { form_id: form.id })} className={AipifyShellClasses.primaryButton}>
                        {labels.publishForm}
                      </button>
                    ) : null}
                    {form.status === "active" ? (
                      <>
                        <button type="button" disabled={busy} onClick={() => void runAction("create_submission", { form_id: form.id })} className={AipifyShellClasses.secondaryButton}>
                          {labels.createSubmission}
                        </button>
                        <button type="button" disabled={busy} onClick={() => void runAction("archive_form", { form_id: form.id })} className={AipifyShellClasses.secondaryButton}>
                          {labels.archiveForm}
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {tab === "submissions" ? (
        <div className="grid gap-3">
          {submissions.length === 0 ? (
            <PlatformEmptyState title={labels.noSubmissions} message={labels.noFormsHint} />
          ) : (
            submissions.map((sub: FormSubmission) => (
              <div key={sub.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-aipify-text-muted">{sub.submission_number ?? sub.id.slice(0, 8)}</p>
                    <h3 className="font-semibold text-aipify-text">{sub.form_name ?? "—"}</h3>
                    <p className="text-aipify-text-secondary">{sub.submitter_name ?? "—"}</p>
                    {sub.scan_reference ? <p className="text-aipify-text-muted">Scan: {sub.scan_reference}</p> : null}
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${SUBMISSION_STATUS_STYLE[sub.status] ?? SUBMISSION_STATUS_STYLE.draft}`}
                  >
                    {sub.status.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {sub.status === "draft" ? (
                    <button type="button" disabled={busy} onClick={() => void runAction("submit_submission", { submission_id: sub.id })} className={AipifyShellClasses.primaryButton}>
                      {labels.submitForm}
                    </button>
                  ) : null}
                  {sub.status === "draft" || sub.status === "in_review" ? (
                    <button type="button" disabled={busy} onClick={() => void runAction("add_signature", { submission_id: sub.id })} className={AipifyShellClasses.secondaryButton}>
                      {labels.addSignature}
                    </button>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "templates" ? (
        <div className="grid gap-3 md:grid-cols-2">
          {templates.map((tpl: FormTemplate) => (
            <div key={tpl.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="text-xs text-aipify-text-muted">{tpl.template_key}</p>
              <h3 className="font-semibold text-aipify-text">{tpl.name}</h3>
              {tpl.description ? <p className="text-aipify-text-secondary">{tpl.description}</p> : null}
              <p className="text-aipify-text-muted">
                {tpl.template_type.replace(/_/g, " ")} · {tpl.field_count ?? 0} fields
              </p>
              <button
                type="button"
                disabled={busy}
                onClick={() => void runAction("create_from_template", { template_id: tpl.id })}
                className={`mt-3 ${AipifyShellClasses.primaryButton}`}
              >
                {labels.createFromTemplate}
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "approvals" ? (
        <div className="grid gap-3">
          {pendingApprovals.length === 0 ? (
            <PlatformEmptyState title={labels.pendingApprovals} message={labels.noFormsHint} />
          ) : (
            pendingApprovals.map((sub: FormSubmission) => (
              <div key={sub.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <h3 className="font-semibold text-aipify-text">{sub.form_name ?? "—"}</h3>
                <p className="text-aipify-text-secondary">{sub.submitter_name ?? "—"} · {sub.approval_status.replace(/_/g, " ")}</p>
                <div className="mt-3 flex gap-2">
                  <button type="button" disabled={busy} onClick={() => void runAction("approve_submission", { submission_id: sub.id })} className={AipifyShellClasses.primaryButton}>
                    {labels.approveSubmission}
                  </button>
                  <button type="button" disabled={busy} onClick={() => void runAction("reject_submission", { submission_id: sub.id })} className={AipifyShellClasses.secondaryButton}>
                    {labels.rejectSubmission}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "automation" ? (
        <div className="grid gap-3">
          {automation.map((w) => (
            <div key={String(w.id)} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="text-xs text-aipify-text-muted">{String(w.submission_number ?? "")}</p>
              <h3 className="font-semibold text-aipify-text">{String(w.trigger_type ?? "").replace(/_/g, " ")}</h3>
              <p className="text-aipify-text-secondary">{String(w.status ?? "")}</p>
              {w.status === "pending" ? (
                <button type="button" disabled={busy} onClick={() => void runAction("execute_workflow", { workflow_id: w.id })} className={`mt-2 ${AipifyShellClasses.primaryButton}`}>
                  {labels.executeWorkflow}
                </button>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {tab === "reports" ? (
        <div className={`${AipifyShellClasses.surfaceCard} space-y-3 p-4 text-sm`}>
          <p>
            {labels.submissionVolume}: {String(reports.submission_volume_month ?? 0)}
          </p>
          <p>
            {labels.completionRate}: {String(reports.completion_rate ?? 0)}%
          </p>
          <p>
            {labels.avgApprovalDays}: {String(reports.avg_approval_days ?? 0)}
          </p>
          {Array.isArray(reports.most_used_forms) && (reports.most_used_forms as Record<string, unknown>[]).length > 0 ? (
            <div>
              <p className="font-medium text-aipify-text">{labels.mostUsedForms}</p>
              <ul className="mt-2 space-y-1 text-aipify-text-secondary">
                {(reports.most_used_forms as Record<string, unknown>[]).map((row, i) => (
                  <li key={i}>
                    {String(row.form_name ?? "")} · {String(row.submission_count ?? 0)}
                  </li>
                ))}
              </ul>
            </div>
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
