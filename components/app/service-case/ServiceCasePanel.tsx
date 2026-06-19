"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import {
  parseServiceCaseCenter,
  type ServiceCase,
  type ServiceCaseCenter,
  type ServiceCaseLabels,
} from "@/lib/service-case";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";

type Tab =
  | "overview"
  | "open_cases"
  | "assigned_cases"
  | "escalations"
  | "completed_cases"
  | "sla"
  | "reports";

const PRIORITY_STYLE: Record<string, string> = {
  emergency: "bg-red-50 text-red-900 ring-red-200",
  critical: "bg-orange-50 text-orange-900 ring-orange-200",
  high: "bg-amber-50 text-amber-900 ring-amber-200",
  normal: "bg-aipify-accent-soft text-aipify-accent ring-aipify-accent-muted",
  low: "bg-aipify-surface-muted text-aipify-text-secondary ring-aipify-border",
};

const STATUS_STYLE: Record<string, string> = {
  new: "bg-aipify-surface-muted text-aipify-text-secondary ring-aipify-border",
  in_progress: "bg-aipify-accent-soft text-aipify-accent ring-aipify-accent-muted",
  waiting_for_customer: "bg-amber-50 text-amber-900 ring-amber-200",
  escalated: "bg-violet-50 text-violet-900 ring-violet-200",
  resolved: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  closed: "bg-gray-100 text-gray-600 ring-gray-200",
};

function CaseRow({
  caseItem,
  labels,
  busy,
  onAssign,
  onEscalate,
  onResolve,
  onClose,
}: {
  caseItem: ServiceCase;
  labels: ServiceCaseLabels;
  busy: boolean;
  onAssign: (id: string) => void;
  onEscalate: (id: string) => void;
  onResolve: (id: string) => void;
  onClose: (id: string) => void;
}) {
  const open = !["resolved", "closed"].includes(caseItem.status);
  return (
    <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs text-aipify-text-muted">{caseItem.case_number ?? caseItem.id.slice(0, 8)}</p>
          <h3 className="font-semibold text-aipify-text">{caseItem.title}</h3>
          <p className="text-aipify-text-secondary">
            {caseItem.customer_name ?? "—"}
            {caseItem.department_name ? ` · ${caseItem.department_name}` : ""}
          </p>
          {caseItem.assigned_employee_name ? (
            <p className="text-aipify-text-muted">{caseItem.assigned_employee_name}</p>
          ) : null}
          {caseItem.domain_name ? (
            <p className="text-xs text-aipify-text-muted">{caseItem.domain_name}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-1">
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${PRIORITY_STYLE[caseItem.priority] ?? PRIORITY_STYLE.normal}`}
          >
            {caseItem.priority.replace(/_/g, " ")}
          </span>
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_STYLE[caseItem.status] ?? STATUS_STYLE.new}`}
          >
            {caseItem.status.replace(/_/g, " ")}
          </span>
        </div>
      </div>
      {open ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => onAssign(caseItem.id)}
            className={AipifyShellClasses.secondaryButton}
          >
            {labels.assignCase}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onEscalate(caseItem.id)}
            className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-900"
          >
            {labels.escalateCase}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onResolve(caseItem.id)}
            className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800"
          >
            {labels.resolveCase}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onClose(caseItem.id)}
            className="rounded-lg border border-aipify-border bg-aipify-surface-muted px-3 py-1 text-xs font-medium text-aipify-text-secondary"
          >
            {labels.closeCase}
          </button>
        </div>
      ) : null}
    </div>
  );
}

type Props = { labels: ServiceCaseLabels };

export function ServiceCasePanel({ labels }: Props) {
  const [center, setCenter] = useState<ServiceCaseCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("overview");
  const [busy, setBusy] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/service-case");
    if (res.ok) setCenter(parseServiceCaseCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function runAction(action_type: string, payload: Record<string, unknown> = {}) {
    setBusy(true);
    await fetch("/api/app/service-case/action", {
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
    return (
      <AipifyModuleAccessDenied message={labels.accessDenied} />
    );
  }

  const overview = center.overview ?? {};
  const sla = center.sla ?? {};
  const reports = center.reports ?? {};
  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: labels.overview },
    { key: "open_cases", label: labels.openCases },
    { key: "assigned_cases", label: labels.assignedCases },
    { key: "escalations", label: labels.escalations },
    { key: "completed_cases", label: labels.completedCases },
    { key: "sla", label: labels.sla },
    { key: "reports", label: labels.reports },
  ];

  const showOpen = tab === "open_cases" || tab === "overview";
  const showAssigned = tab === "assigned_cases";
  const showCompleted = tab === "completed_cases";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-aipify-text">{labels.title}</h1>
        <p className="mt-2 text-aipify-text-secondary">{labels.subtitle}</p>
        {center.principle ? (
          <p className="mt-2 text-sm font-medium text-aipify-companion">{center.principle}</p>
        ) : null}
        {center.routes?.customer_success ? (
          <Link href={center.routes.customer_success} className={`mt-2 inline-block text-sm ${AipifyShellClasses.link}`}>
            {labels.customerSuccessLink}
          </Link>
        ) : null}
      </div>

      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {(
          [
            [labels.totalCases, overview.total_cases],
            [labels.openCasesCount, overview.open_cases],
            [labels.escalated, overview.escalated],
            [labels.overdue, overview.overdue],
            [labels.slaAtRisk, overview.sla_at_risk],
          ] as [string, unknown][]
        ).map(([label, value]) => (
          <div key={label} className={`${AipifyShellClasses.surfaceCard} p-4`}>
            <p className="text-xs font-medium uppercase tracking-wide text-aipify-text-muted">{label}</p>
            <p className="mt-1 text-xl font-semibold text-aipify-text">{String(value ?? "—")}</p>
          </div>
        ))}
      </div>

      <div className="-mx-1 flex gap-1 overflow-x-auto border-b border-aipify-border pb-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium ${
              tab === t.key ? "bg-aipify-companion text-white shadow-sm" : "text-aipify-text-secondary hover:bg-aipify-surface-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {(tab === "overview" || tab === "open_cases") && (
        <form
          className={`flex flex-col gap-2 rounded-2xl border border-aipify-border bg-aipify-surface-muted p-4 sm:flex-row`}
          onSubmit={(e) => {
            e.preventDefault();
            void runAction("create_case", { title, description, priority: "normal" });
            setTitle("");
            setDescription("");
          }}
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={labels.caseTitle}
            className={`flex-1 ${AipifyShellClasses.input} px-3 py-2 text-sm`}
            required
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={labels.caseDescription}
            className={`flex-1 ${AipifyShellClasses.input} px-3 py-2 text-sm`}
          />
          <button type="submit" disabled={busy} className={AipifyShellClasses.primaryButton}>
            {labels.createCase}
          </button>
        </form>
      )}

      {showOpen && (
        <div className="grid gap-3 lg:grid-cols-2">
          {(center.open_cases ?? []).length === 0 ? (
            <PlatformEmptyState
              title={labels.noCases}
              message={labels.noCasesHint}
              primaryAction={{ label: labels.createCase, onClick: () => setTab("open_cases") }}
            />
          ) : (
            (center.open_cases ?? [])
              .slice(0, tab === "overview" ? 4 : 100)
              .map((c) => (
                <CaseRow
                  key={c.id}
                  caseItem={c}
                  labels={labels}
                  busy={busy}
                  onAssign={(id) => void runAction("assign_case", { case_id: id, status: "in_progress" })}
                  onEscalate={(id) =>
                    void runAction("escalate_case", { case_id: id, escalation_reason: "Escalated from Case Center" })
                  }
                  onResolve={(id) => void runAction("resolve_case", { case_id: id })}
                  onClose={(id) => void runAction("close_case", { case_id: id })}
                />
              ))
          )}
        </div>
      )}

      {showAssigned && (
        <div className="grid gap-3 lg:grid-cols-2">
          {(center.assigned_cases ?? []).map((c) => (
            <CaseRow
              key={c.id}
              caseItem={c}
              labels={labels}
              busy={busy}
              onAssign={(id) => void runAction("assign_case", { case_id: id })}
              onEscalate={(id) => void runAction("escalate_case", { case_id: id, escalation_reason: "Manager review" })}
              onResolve={(id) => void runAction("resolve_case", { case_id: id })}
              onClose={(id) => void runAction("close_case", { case_id: id })}
            />
          ))}
        </div>
      )}

      {tab === "escalations" && (
        <div className="space-y-2">
          {(center.escalations ?? []).length === 0 ? (
            <p className="text-sm text-aipify-text-muted">{labels.noCases}</p>
          ) : (
            (center.escalations ?? []).map((e, i) => (
              <div key={i} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <p className="font-medium text-aipify-text">{String(e.title ?? "")}</p>
                <p className="text-aipify-text-secondary">
                  {String(e.case_number ?? "")} · {String(e.escalation_reason ?? "")}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {showCompleted && (
        <div className="grid gap-3 lg:grid-cols-2">
          {(center.completed_cases ?? []).map((c) => (
            <CaseRow
              key={c.id}
              caseItem={c}
              labels={labels}
              busy={busy}
              onAssign={() => {}}
              onEscalate={() => {}}
              onResolve={() => {}}
              onClose={() => {}}
            />
          ))}
        </div>
      )}

      {tab === "sla" && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className={`${AipifyShellClasses.surfaceCard} p-4`}>
              <p className="text-xs font-medium uppercase text-aipify-text-muted">{labels.slaAtRisk}</p>
              <p className="mt-1 text-xl font-semibold text-aipify-text">{String(sla.at_risk ?? "—")}</p>
            </div>
            <div className={`${AipifyShellClasses.surfaceCard} p-4`}>
              <p className="text-xs font-medium uppercase text-aipify-text-muted">SLA breaches</p>
              <p className="mt-1 text-xl font-semibold text-aipify-text">{String(sla.breaches ?? "—")}</p>
            </div>
          </div>
          <div className="space-y-2">
            {((sla.policies as Record<string, unknown>[]) ?? []).map((p, i) => (
              <div key={i} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <p className="font-medium text-aipify-text">{String(p.name ?? "")}</p>
                <p className="text-aipify-text-secondary">
                  {String(p.priority ?? "")} · first response {String(p.first_response_minutes ?? "")} min · resolution{" "}
                  {String(p.resolution_minutes ?? "")} min
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "reports" && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              ["Avg resolution (hrs)", reports.avg_resolution_hours],
              ["SLA compliance %", reports.sla_compliance_percent],
              ["Escalations (30d)", reports.escalations_30d],
              ["Feedback avg", reports.feedback_avg],
            ] as [string, unknown][]
          ).map(([label, value]) => (
            <div key={label} className={`${AipifyShellClasses.surfaceCard} p-4`}>
              <p className="text-xs font-medium uppercase text-aipify-text-muted">{label}</p>
              <p className="mt-1 text-xl font-semibold text-aipify-text">{String(value ?? "—")}</p>
            </div>
          ))}
        </div>
      )}

      {(tab === "overview" || tab === "open_cases") && (center.timeline ?? []).length > 0 && (
        <div>
          <h2 className="mb-2 text-sm font-semibold text-aipify-text">Customer timeline</h2>
          <div className="space-y-2">
            {(center.timeline ?? []).slice(0, 8).map((e, i) => (
              <div key={i} className="rounded-xl border border-aipify-border bg-aipify-surface-muted p-4 text-sm">
                <p className="font-medium text-aipify-text">{String(e.title ?? "")}</p>
                <p className="text-aipify-text-muted">
                  {String(e.case_title ?? "")} · {String(e.event_type ?? "")} · {String(e.occurred_at ?? "")}
                </p>
                {e.summary ? <p className="mt-1 text-aipify-text-secondary">{String(e.summary)}</p> : null}
              </div>
            ))}
          </div>
        </div>
      )}

      {(center.audit_recent ?? []).length > 0 && (
        <div>
          <h2 className="mb-2 text-sm font-semibold text-aipify-text">{labels.auditLog}</h2>
          <div className="space-y-1">
            {(center.audit_recent ?? []).map((a, i) => (
              <p key={i} className="text-xs text-aipify-text-muted">
                {a.summary} · {a.created_at}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
