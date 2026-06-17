"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseWorkspaceCenter,
  parseWorkspaceInsights,
  parseWorkspaceProjects,
  parseWorkspaceRelationships,
  parseWorkspaceSearch,
  parseWorkspaceWorkflows,
  type WorkspaceCenter,
  type WorkspaceInsightsBundle,
  type WorkspaceProject,
  type WorkspaceProjectsBundle,
  type WorkspaceRelationshipsBundle,
  type WorkspaceWorkflow,
} from "@/lib/companion-workspace-intelligence";

type Props = {
  labels: Record<string, string>;
};

export function CompanionWorkspaceIntelligencePanel({ labels }: Props) {
  const [center, setCenter] = useState<WorkspaceCenter | null>(null);
  const [projects, setProjects] = useState<WorkspaceProjectsBundle | null>(null);
  const [insights, setInsights] = useState<WorkspaceInsightsBundle | null>(null);
  const [relationships, setRelationships] = useState<WorkspaceRelationshipsBundle | null>(null);
  const [workflows, setWorkflows] = useState<WorkspaceWorkflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{ type: string; title: string; id: string }>>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const params = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : "";
      const [centerRes, projectsRes, insightsRes, relRes] = await Promise.all([
        fetch(`/api/workspace${params}`),
        fetch("/api/workspace/projects"),
        fetch("/api/workspace/insights"),
        fetch("/api/workspace/relationships"),
      ]);

      if (!centerRes.ok) {
        setError(true);
        setLoading(false);
        return;
      }

      const centerJson = await centerRes.json();
      if (search.trim() && centerJson.results) {
        setSearchResults(parseWorkspaceSearch(centerJson));
        setLoading(false);
        return;
      }

      const parsedCenter = parseWorkspaceCenter(centerJson);
      setCenter(parsedCenter);
      setWorkflows(parsedCenter?.workflows ?? []);

      if (projectsRes.ok) setProjects(parseWorkspaceProjects(await projectsRes.json()));
      if (insightsRes.ok) setInsights(parseWorkspaceInsights(await insightsRes.json()));
      if (relRes.ok) setRelationships(parseWorkspaceRelationships(await relRes.json()));
      setSearchResults([]);
    } catch {
      setError(true);
    }
    setLoading(false);
  }, [search]);

  useEffect(() => {
    void load();
  }, [load]);

  const applications = useMemo(() => {
    const all = new Set<string>();
    const collect = (list: WorkspaceProject[]) => {
      for (const p of list) {
        for (const app of p.application_hints) all.add(app);
      }
    };
    if (projects) {
      collect(projects.currently_active);
      collect(projects.recently_active);
      collect(projects.needs_attention);
      collect(projects.archived);
    }
    return [...all].sort();
  }, [projects]);

  const enableWorkspace = async () => {
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/workspace", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "enable" }),
    });
    if (res.ok) {
      await load();
    } else {
      setMessage(labels.actionFailed);
    }
    setBusy(false);
  };

  const workflowAction = async (payload: Record<string, unknown>) => {
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/workspace/workflow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const json = await res.json();
      setWorkflows(parseWorkspaceWorkflows(json));
      setMessage(labels.saved);
    } else {
      setMessage(labels.actionFailed);
    }
    setBusy(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-3">
        <AipifyLoader centered />
        <p className="sr-only">{labels.loading}</p>
      </div>
    );
  }

  if (error || !center) {
    return (
      <PlatformEmptyState
        title={labels.errorTitle}
        message={labels.errorMessage}
        primaryAction={{ label: labels.retry, onClick: () => void load() }}
      />
    );
  }

  if (center.empty_state || !center.workspace_enabled) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 p-6">
        <Header labels={labels} />
        <PlatformEmptyState
          title={labels.emptyTitle}
          message={labels.emptyMessage}
          primaryAction={{ label: labels.enableWorkspace, onClick: () => void enableWorkspace() }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <Header labels={labels} memoryHref={center.cross_link_phase343} />

      <section className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-6">
        <p className="text-sm font-medium text-indigo-900">{center.briefing.greeting}</p>
        <ul className="mt-3 space-y-1 text-sm text-indigo-950">
          <li>✓ {center.briefing.active_projects} {labels.activeProjects}</li>
          <li>✓ {center.briefing.pending_tasks} {labels.pendingTasks}</li>
          <li>✓ {center.briefing.attention_projects} {labels.attentionProjects}</li>
        </ul>
        <p className="mt-4 text-sm text-indigo-900">
          {labels.recommendedFocus}: <strong>{center.briefing.recommended_focus}</strong>
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard label={labels.workspaceHealth} value={center.workspace_health.label} />
        <MetricCard label={labels.activeProjects} value={center.briefing.active_projects} />
        <MetricCard label={labels.pendingTasks} value={center.briefing.pending_tasks} />
      </div>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">{labels.searchPlaceholder}</h2>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
        {searchResults.length > 0 ? (
          <ul className="space-y-2">
            {searchResults.map((r) => (
              <li key={`${r.type}-${r.id}`} className="rounded-lg border border-slate-200 px-4 py-2 text-sm">
                <span className="text-xs uppercase text-slate-500">{r.type}</span> — {r.title}
              </li>
            ))}
          </ul>
        ) : search.trim() ? (
          <p className="text-sm text-slate-500">{labels.searchNoResults}</p>
        ) : null}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">{labels.workspaceMapTitle}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {(relationships?.workspace_map ?? []).map((root) => (
            <div key={root.project_key} className="rounded-xl border border-slate-200 bg-white p-4 font-mono text-sm">
              <p className="font-semibold text-slate-900">{root.project_label}</p>
              <ul className="mt-2 space-y-1 text-slate-600">
                {root.children.map((child, i) => (
                  <li key={child.project_key}>
                    {i === root.children.length - 1 ? "└─" : "├─"} {child.label}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <ProjectSection
        title={labels.currentlyActive}
        projects={projects?.currently_active ?? []}
        labels={labels}
      />
      <ProjectSection
        title={labels.recentlyActive}
        projects={projects?.recently_active ?? []}
        labels={labels}
      />
      <ProjectSection
        title={labels.needsAttention}
        projects={projects?.needs_attention ?? []}
        labels={labels}
      />
      <ProjectSection title={labels.archived} projects={projects?.archived ?? []} labels={labels} />

      {insights?.insights.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">{labels.insightsTitle}</h2>
          <ul className="space-y-2">
            {insights.insights.map((item) => (
              <li key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <p className="font-medium text-slate-900">{item.title}</p>
                <p className="mt-1">{item.message}</p>
                <span className="mt-2 inline-block text-xs text-slate-500">
                  {labels[`confidence_${item.confidence_level}`] ?? item.confidence_level}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {insights?.priorities.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">{labels.prioritiesTitle}</h2>
          <ul className="space-y-2">
            {insights.priorities.map((item, i) => (
              <li key={`${item.title}-${i}`} className="flex justify-between rounded-lg border border-slate-200 px-4 py-3 text-sm">
                <span className="font-medium text-slate-900">{item.title}</span>
                <span className="text-slate-500">
                  {labels[`priority_${item.level}`] ?? item.level} · {labels[`health_${item.reason}`] ?? item.reason}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">{labels.workflowsTitle}</h2>
        {workflows.length === 0 ? (
          <p className="text-sm text-slate-500">{labels.suggestRememberWorkflow}</p>
        ) : (
          <div className="space-y-3">
            {workflows.map((wf) => (
              <article key={wf.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">{wf.workflow_label}</h3>
                    <p className="mt-1 text-xs text-slate-500">{wf.application_chain.join(" → ")}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        void workflowAction({
                          action: "disable",
                          workflow_key: wf.workflow_key,
                        })
                      }
                      className="text-xs text-slate-600 hover:text-slate-800"
                    >
                      {labels.disableWorkflow}
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        void workflowAction({
                          action: "delete",
                          workflow_key: wf.workflow_key,
                        })
                      }
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      {labels.deleteWorkflow}
                    </button>
                  </div>
                </div>
                <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-slate-600">
                  {wf.steps.map((step, i) => (
                    <li key={i}>{step.step ?? JSON.stringify(step)}</li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        )}
      </section>

      {applications.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">{labels.applicationsTitle}</h2>
          <div className="flex flex-wrap gap-2">
            {applications.map((app) => (
              <span key={app} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                {app}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {insights?.timeline.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">{labels.timelineTitle}</h2>
          <ul className="space-y-3">
            {insights.timeline.map((entry, i) => (
              <li key={`${entry.period}-${i}`} className="rounded-lg border border-slate-200 px-4 py-3 text-sm">
                <p className="font-medium text-slate-900">{entry.period}</p>
                <p className="mt-1 text-slate-600">{entry.summary}</p>
                {entry.application_name ? (
                  <p className="mt-1 text-xs text-slate-500">{entry.application_name}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-lg font-semibold text-slate-900">{labels.permissionsTitle}</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          <PermissionRow label={labels.workspaceAnalysis} enabled={center.permissions.workspace_analysis_approved} />
          <PermissionRow label={labels.projectDiscovery} enabled={center.permissions.project_discovery_approved} />
          <PermissionRow label={labels.applicationAwareness} enabled={center.permissions.application_awareness_approved} />
          <PermissionRow label={labels.relationshipDiscovery} enabled={center.permissions.relationship_discovery_approved} />
          <PermissionRow label={labels.localFileAwareness} enabled={center.permissions.local_file_awareness_approved} />
        </ul>
        <p className="mt-4 text-xs text-slate-500">{center.privacy_note || labels.privacyNote}</p>
      </section>

      {center.audit_logs.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">{labels.auditTitle}</h2>
          <ul className="space-y-2 text-sm text-slate-600">
            {center.audit_logs.map((log) => (
              <li key={log.id} className="rounded-lg border border-slate-100 px-3 py-2">
                {log.summary}
                <span className="ml-2 text-xs text-slate-400">{log.event_type}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-lg font-semibold text-slate-900">{labels.faqTitle}</h2>
        <dl className="mt-4 space-y-4 text-sm text-slate-700">
          <div>
            <dt className="font-medium text-slate-900">{labels.faqWhatIs}</dt>
            <dd className="mt-1">{labels.faqWhatIsAnswer}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">{labels.faqMonitor}</dt>
            <dd className="mt-1">{labels.faqMonitorAnswer}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">{labels.faqDisable}</dt>
            <dd className="mt-1">{labels.faqDisableAnswer}</dd>
          </div>
        </dl>
      </section>

      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
    </div>
  );
}

function Header({ labels, memoryHref }: { labels: Record<string, string>; memoryHref?: string }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <Link href="/app/desktop" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          ← {labels.backToDesktop}
        </Link>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-slate-600">{labels.subtitle}</p>
      </div>
      {memoryHref ? (
        <Link
          href={memoryHref}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          {labels.memoryLink}
        </Link>
      ) : null}
    </div>
  );
}

function ProjectSection({
  title,
  projects,
  labels,
}: {
  title: string;
  projects: WorkspaceProject[];
  labels: Record<string, string>;
}) {
  if (projects.length === 0) return null;
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {projects.map((p) => (
          <article key={p.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex justify-between gap-2">
              <h3 className="font-semibold text-slate-900">{p.project_label}</h3>
              <span className="text-xs text-slate-500">
                {labels[`health_${p.health_status}`] ?? p.health_status}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {labels.openTasks}: {p.open_tasks_count} · {labels.relatedFiles}: {p.related_files_count}
            </p>
            {p.application_hints.length > 0 ? (
              <p className="mt-2 text-xs text-indigo-700">{p.application_hints.join(", ")}</p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-slate-900">{value}</dd>
    </div>
  );
}

function PermissionRow({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <li className="flex items-center justify-between">
      <span>{label}</span>
      <span className={enabled ? "text-emerald-700" : "text-slate-400"}>{enabled ? "✓" : "—"}</span>
    </li>
  );
}
