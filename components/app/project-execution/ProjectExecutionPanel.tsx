"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import {
  parseProjectExecutionCenter,
  type ProjectExecutionCenter,
  type ProjectExecutionLabels,
  type ProjectRecord,
} from "@/lib/project-execution";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";

type Tab =
  | "overview"
  | "active_projects"
  | "planning"
  | "milestones"
  | "deliverables"
  | "resources"
  | "budgets"
  | "risks"
  | "reports";

const STATUS_STYLE: Record<string, string> = {
  planning: "bg-aipify-surface-muted text-aipify-text-secondary ring-aipify-border",
  active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  at_risk: "bg-amber-50 text-amber-900 ring-amber-200",
  on_hold: "bg-violet-50 text-violet-900 ring-violet-200",
  completed: "bg-aipify-accent-soft text-aipify-accent ring-aipify-accent-muted",
  cancelled: "bg-gray-100 text-gray-600 ring-gray-200",
};

function ProjectRow({
  project,
  labels,
  busy,
  onClose,
  onAtRisk,
}: {
  project: ProjectRecord;
  labels: ProjectExecutionLabels;
  busy: boolean;
  onClose: (id: string) => void;
  onAtRisk: (id: string) => void;
}) {
  const open = !["completed", "cancelled"].includes(project.status);
  return (
    <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs text-aipify-text-muted">{project.project_number ?? project.id.slice(0, 8)}</p>
          <h3 className="font-semibold text-aipify-text">{project.name}</h3>
          <p className="text-aipify-text-secondary">
            {project.customer_name ?? project.project_type.replace(/_/g, " ")}
            {project.department_name ? ` · ${project.department_name}` : ""}
          </p>
          {project.project_manager_name ? (
            <p className="text-aipify-text-muted">{project.project_manager_name}</p>
          ) : null}
          <p className="text-xs text-aipify-text-muted">
            {labels.completionPercent}: {project.completion_percent}%
            {project.target_date ? ` · due ${project.target_date}` : ""}
          </p>
        </div>
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_STYLE[project.status] ?? STATUS_STYLE.planning}`}
        >
          {project.status.replace(/_/g, " ")}
        </span>
      </div>
      {open ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" disabled={busy} onClick={() => onAtRisk(project.id)} className={AipifyShellClasses.secondaryButton}>
            {labels.atRisk}
          </button>
          <button type="button" disabled={busy} onClick={() => onClose(project.id)} className={AipifyShellClasses.primaryButton}>
            {labels.closeProject}
          </button>
        </div>
      ) : null}
    </div>
  );
}

type Props = { labels: ProjectExecutionLabels };

export function ProjectExecutionPanel({ labels }: Props) {
  const [center, setCenter] = useState<ProjectExecutionCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("overview");
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [milestoneName, setMilestoneName] = useState("");
  const [riskTitle, setRiskTitle] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/project-execution");
    if (res.ok) setCenter(parseProjectExecutionCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function runAction(action_type: string, payload: Record<string, unknown> = {}) {
    setBusy(true);
    await fetch("/api/app/project-execution/action", {
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
  const reports = center.reports ?? {};
  const executive = (reports.executive as Record<string, unknown>) ?? {};
  const allProjects = [...(center.active_projects ?? []), ...(center.planning_projects ?? [])];

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: labels.overview },
    { key: "active_projects", label: labels.activeProjects },
    { key: "planning", label: labels.planning },
    { key: "milestones", label: labels.milestones },
    { key: "deliverables", label: labels.deliverables },
    { key: "resources", label: labels.resources },
    { key: "budgets", label: labels.budgets },
    { key: "risks", label: labels.risks },
    { key: "reports", label: labels.reports },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-aipify-text">{labels.title}</h1>
        <p className="mt-2 text-aipify-text-secondary">{labels.subtitle}</p>
        {center.principle ? (
          <p className="mt-2 text-sm font-medium text-aipify-companion">{center.principle}</p>
        ) : null}
      </div>

      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {(
          [
            [labels.totalProjects, overview.total_projects],
            [labels.activeCount, overview.active_projects],
            [labels.atRisk, overview.at_risk_projects],
            [labels.overdueMilestones, overview.overdue_milestones],
            [labels.openRisks, overview.open_risks],
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

      {(tab === "overview" || tab === "planning" || tab === "active_projects") && (
        <form
          className="flex flex-col gap-2 rounded-2xl border border-aipify-border bg-aipify-surface-muted p-4 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            void runAction("create_project", { name, description, project_type: "internal", status: "planning" });
            setName("");
            setDescription("");
          }}
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={labels.projectName}
            className={`flex-1 ${AipifyShellClasses.input} px-3 py-2 text-sm`}
            required
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={labels.projectDescription}
            className={`flex-1 ${AipifyShellClasses.input} px-3 py-2 text-sm`}
          />
          <button type="submit" disabled={busy} className={AipifyShellClasses.primaryButton}>
            {labels.createProject}
          </button>
        </form>
      )}

      {(center.templates ?? []).length > 0 && (tab === "planning" || tab === "overview") && (
        <div className="flex flex-wrap gap-2">
          {(center.templates ?? []).slice(0, 4).map((t, i) => (
            <button
              key={i}
              type="button"
              disabled={busy}
              onClick={() => void runAction("create_from_template", { template_key: t.template_key, name: String(t.name ?? "") })}
              className={AipifyShellClasses.secondaryButton}
            >
              {labels.fromTemplate}: {String(t.name ?? "")}
            </button>
          ))}
        </div>
      )}

      {(tab === "active_projects" || tab === "overview") && (
        <div className="grid gap-3 lg:grid-cols-2">
          {(center.active_projects ?? []).length === 0 && tab === "active_projects" ? (
            <PlatformEmptyState title={labels.noProjects} message={labels.noProjectsHint} />
          ) : (
            (center.active_projects ?? [])
              .slice(0, tab === "overview" ? 4 : 100)
              .map((p) => (
                <ProjectRow
                  key={p.id}
                  project={p}
                  labels={labels}
                  busy={busy}
                  onAtRisk={(id) => void runAction("update_project", { project_id: id, status: "at_risk" })}
                  onClose={(id) => void runAction("close_project", { project_id: id })}
                />
              ))
          )}
        </div>
      )}

      {tab === "planning" && (
        <div className="grid gap-3 lg:grid-cols-2">
          {(center.planning_projects ?? []).map((p) => (
            <ProjectRow
              key={p.id}
              project={p}
              labels={labels}
              busy={busy}
              onAtRisk={(id) => void runAction("update_project", { project_id: id, status: "active" })}
              onClose={(id) => void runAction("close_project", { project_id: id })}
            />
          ))}
        </div>
      )}

      {tab === "milestones" && (
        <div className="space-y-4">
          <form
            className="flex flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              if (!selectedProjectId) return;
              void runAction("create_milestone", { project_id: selectedProjectId, name: milestoneName });
              setMilestoneName("");
            }}
          >
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className={`flex-1 ${AipifyShellClasses.input} px-3 py-2 text-sm`}
              required
            >
              <option value="">Select project</option>
              {allProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <input
              value={milestoneName}
              onChange={(e) => setMilestoneName(e.target.value)}
              placeholder="Milestone name"
              className={`flex-1 ${AipifyShellClasses.input} px-3 py-2 text-sm`}
              required
            />
            <button type="submit" disabled={busy} className={AipifyShellClasses.primaryButton}>
              {labels.createMilestone}
            </button>
          </form>
          <div className="space-y-2">
            {(center.milestones ?? []).map((m, i) => (
              <div key={i} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <p className="font-medium text-aipify-text">{String(m.name ?? "")}</p>
                <p className="text-aipify-text-secondary">
                  {String(m.project_name ?? "")} · {String(m.status ?? "")} · {String(m.target_date ?? "—")}
                </p>
                {m.status !== "completed" ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void runAction("complete_milestone", { milestone_id: m.id, name: m.name })}
                    className={`mt-2 ${AipifyShellClasses.secondaryButton}`}
                  >
                    {labels.completeMilestone}
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "deliverables" && (
        <div className="space-y-2">
          {(center.deliverables ?? []).map((d, i) => (
            <div key={i} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="font-medium text-aipify-text">{String(d.name ?? "")}</p>
              <p className="text-aipify-text-secondary">
                {String(d.project_name ?? "")} · {String(d.status ?? "")} · due {String(d.due_date ?? "—")}
              </p>
              {d.status !== "approved" ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void runAction("approve_deliverable", { deliverable_id: d.id })}
                  className={`mt-2 ${AipifyShellClasses.primaryButton}`}
                >
                  {labels.approveDeliverable}
                </button>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {tab === "resources" && (
        <div className="space-y-2">
          {(center.resources ?? []).map((r, i) => (
            <div key={i} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="font-medium text-aipify-text">{String(r.resource_label ?? "")}</p>
              <p className="text-aipify-text-secondary">
                {String(r.project_name ?? "")} · {String(r.resource_type ?? "")}
              </p>
            </div>
          ))}
        </div>
      )}

      {tab === "budgets" && (
        <div className="grid gap-3 lg:grid-cols-2">
          {(center.budgets ?? []).map((b, i) => (
            <div key={i} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="font-medium text-aipify-text">{String(b.project_name ?? "")}</p>
              <p className="text-aipify-text-secondary">
                Spent {String(b.spent_amount ?? 0)} / {String(b.budget_amount ?? 0)} · {labels.budgetRemaining}{" "}
                {String(b.remaining ?? 0)}
              </p>
              <p className="text-aipify-text-muted">Risk: {String(b.risk_level ?? "low")}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "risks" && (
        <div className="space-y-4">
          <form
            className="flex flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              if (!selectedProjectId) return;
              void runAction("create_risk", { project_id: selectedProjectId, title: riskTitle, risk_type: "schedule" });
              setRiskTitle("");
            }}
          >
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className={`flex-1 ${AipifyShellClasses.input} px-3 py-2 text-sm`}
              required
            >
              <option value="">Select project</option>
              {allProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <input
              value={riskTitle}
              onChange={(e) => setRiskTitle(e.target.value)}
              placeholder="Risk title"
              className={`flex-1 ${AipifyShellClasses.input} px-3 py-2 text-sm`}
              required
            />
            <button type="submit" disabled={busy} className={AipifyShellClasses.primaryButton}>
              {labels.addRisk}
            </button>
          </form>
          <div className="space-y-2">
            {(center.risks ?? []).map((r, i) => (
              <div key={i} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <p className="font-medium text-aipify-text">{String(r.title ?? "")}</p>
                <p className="text-aipify-text-secondary">
                  {String(r.project_name ?? "")} · {String(r.risk_type ?? "")} · impact {String(r.impact ?? "")}
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
              ["Completion rate %", reports.completion_rate],
              ["Milestone on-time %", reports.milestone_on_time_percent],
              ["Budget variance", reports.budget_variance_total],
              ["Projects at risk", executive.projects_at_risk],
              ["Deadlines (14d)", executive.upcoming_deadlines_14d],
            ] as [string, unknown][]
          ).map(([label, value]) => (
            <div key={label} className={`${AipifyShellClasses.surfaceCard} p-4`}>
              <p className="text-xs font-medium uppercase text-aipify-text-muted">{label}</p>
              <p className="mt-1 text-xl font-semibold text-aipify-text">{String(value ?? "—")}</p>
            </div>
          ))}
        </div>
      )}

      {(center.timeline ?? []).length > 0 && tab === "overview" && (
        <div>
          <h2 className="mb-2 text-sm font-semibold text-aipify-text">Activity</h2>
          <div className="space-y-2">
            {(center.timeline ?? []).slice(0, 6).map((e, i) => (
              <div key={i} className="rounded-xl border border-aipify-border bg-aipify-surface-muted p-4 text-sm">
                <p className="font-medium text-aipify-text">{String(e.title ?? "")}</p>
                <p className="text-aipify-text-muted">
                  {String(e.project_name ?? "")} · {String(e.event_type ?? "")}
                </p>
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
