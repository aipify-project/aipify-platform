"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import type {
  CompanionCommandCenter,
  CompanionCommandCenterLabels,
  CompanionCommandCenterTab,
  CompanionCommandCenterViewMode,
  HubAction,
  HubAlert,
  HubRecommendation,
  PackIntel,
} from "@/lib/companion-command-center";
import { parseCompanionCommandCenter } from "@/lib/companion-command-center/parse";

type Tab = CompanionCommandCenterTab;
type ViewMode = CompanionCommandCenterViewMode;

const HEALTH_ICON: Record<string, string> = {
  excellent: "🟢",
  healthy: "🟢",
  needs_attention: "⚠️",
  critical: "🚨",
};

const SEVERITY_STYLE: Record<string, string> = {
  information: "bg-sky-50 text-sky-900 ring-sky-200",
  attention: "bg-amber-50 text-amber-900 ring-amber-200",
  critical: "bg-red-50 text-red-900 ring-red-200",
};

type Props = {
  labels: CompanionCommandCenterLabels;
  initialTab?: Tab;
  initialViewMode?: ViewMode;
  titleOverride?: string;
  subtitleOverride?: string;
  visibleTabs?: Tab[];
  actionsOnly?: boolean;
};

function RecommendationList({ items, labels }: { items: HubRecommendation[]; labels: CompanionCommandCenterLabels }) {
  if (items.length === 0) return <PlatformEmptyState title={labels.noItems} message={labels.emptyHint} />;
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
          <p className="font-medium text-aipify-text">{item.title}</p>
          {item.summary ? <p className="mt-1 text-aipify-text-secondary">{item.summary}</p> : null}
          {item.impact_note ? <p className="mt-1 text-xs text-aipify-text-muted">{item.impact_note}</p> : null}
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-aipify-text-muted">
            {item.effort_hint ? <span>{item.effort_hint}</span> : null}
            {item.value_hint ? <span>· {item.value_hint}</span> : null}
          </div>
          {item.record_href ? (
            <Link href={item.record_href} className={`${AipifyShellClasses.secondaryButton} mt-3 inline-flex text-xs`}>
              {labels.viewRecord}
            </Link>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function ActionList({
  items,
  labels,
  onComplete,
  busy,
}: {
  items: HubAction[];
  labels: CompanionCommandCenterLabels;
  onComplete?: (id: string) => void;
  busy?: boolean;
}) {
  if (items.length === 0) return <PlatformEmptyState title={labels.noItems} message={labels.emptyHint} />;
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-xs uppercase text-aipify-text-muted">{item.action_type.replace(/_/g, " ")}</p>
              <p className="font-medium text-aipify-text">{item.title}</p>
              {item.summary ? <p className="mt-1 text-aipify-text-secondary">{item.summary}</p> : null}
              {item.due_at ? <p className="mt-1 text-xs text-aipify-text-muted">{new Date(item.due_at).toLocaleString()}</p> : null}
            </div>
            <div className="flex flex-wrap gap-2">
              {onComplete && item.status !== "completed" ? (
                <button type="button" disabled={busy} onClick={() => onComplete(item.id)} className={`${AipifyShellClasses.primaryButton} text-xs`}>
                  {labels.completeAction}
                </button>
              ) : null}
              {item.record_href ? (
                <Link href={item.record_href} className={`${AipifyShellClasses.secondaryButton} text-xs`}>
                  {labels.viewRecord}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AlertList({
  items,
  labels,
  onAcknowledge,
  busy,
}: {
  items: HubAlert[];
  labels: CompanionCommandCenterLabels;
  onAcknowledge?: (id: string) => void;
  busy?: boolean;
}) {
  if (items.length === 0) return <PlatformEmptyState title={labels.noItems} message={labels.emptyHint} />;
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className={`${AipifyShellClasses.surfaceCard} border-l-4 p-4 text-sm ${item.severity === "critical" ? "border-red-500" : "border-amber-400"}`}>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-xs ring-1 ${SEVERITY_STYLE[item.severity] ?? SEVERITY_STYLE.information}`}>
              {item.alert_type.replace(/_/g, " ")}
            </span>
            <p className="font-medium text-aipify-text">{item.title}</p>
          </div>
          {item.summary ? <p className="mt-1 text-aipify-text-secondary">{item.summary}</p> : null}
          {item.recommendation ? <p className="mt-2 text-xs font-medium text-aipify-text-secondary">{item.recommendation}</p> : null}
          {onAcknowledge ? (
            <button type="button" disabled={busy} onClick={() => onAcknowledge(item.id)} className={`${AipifyShellClasses.secondaryButton} mt-3 text-xs`}>
              {labels.acknowledgeAlert}
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function PackIntelList({ items, labels }: { items: PackIntel[]; labels: CompanionCommandCenterLabels }) {
  if (items.length === 0) return null;
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
          <p className="text-xs uppercase text-aipify-text-muted">{item.business_pack_key} · {item.intel_type}</p>
          <p className="mt-1 font-medium text-aipify-text">{item.title}</p>
          {item.summary ? <p className="mt-1 text-aipify-text-secondary">{item.summary}</p> : null}
        </div>
      ))}
    </div>
  );
}

export function CompanionCommandCenterPanel({
  labels,
  initialTab = "overview",
  initialViewMode = "auto",
  titleOverride,
  subtitleOverride,
  visibleTabs,
  actionsOnly = false,
}: Props) {
  const [center, setCenter] = useState<CompanionCommandCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>(actionsOnly ? "actions" : initialTab);
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [busy, setBusy] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const load = useCallback(async (mode = viewMode) => {
    setLoading(true);
    const res = await fetch(`/api/app/companion-command-center?view_mode=${encodeURIComponent(mode === "auto" ? "" : mode)}`);
    if (res.ok) setCenter(parseCompanionCommandCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, [viewMode]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setTab(actionsOnly ? "actions" : initialTab);
  }, [initialTab, actionsOnly]);

  async function runAction(action_type: string, payload: Record<string, unknown> = {}) {
    setBusy(true);
    await fetch("/api/app/companion-command-center/action", {
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

  const health = center.organization_health;
  const briefing = center.executive_briefing ?? {};
  const since = center.since_last_login ?? {};
  const personal = center.personal_workspace;
  const routes = center.routes ?? {};
  const decision = center.decision_support ?? {};
  const meetings = center.meeting_intelligence ?? {};
  const companion = center.companion_conversation ?? {};

  const allTabs: { id: Tab; label: string }[] = actionsOnly
    ? [{ id: "actions", label: labels.actionCenter }]
    : [
        { id: "overview", label: labels.overview },
        { id: "health", label: labels.organizationHealth },
        { id: "briefing", label: labels.executiveBriefing },
        { id: "actions", label: labels.actionCenter },
        { id: "approvals", label: labels.approvals },
        { id: "alerts", label: labels.criticalAlerts },
        { id: "recommendations", label: labels.companionRecommendations },
        { id: "personal", label: labels.personalWorkspace },
        { id: "decisions", label: labels.decisionSupport },
        { id: "meetings", label: labels.meetingIntelligence },
        { id: "notifications", label: labels.notificationsHub },
      ];
  const tabs = visibleTabs ? allTabs.filter((t) => visibleTabs.includes(t.id)) : allTabs;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-aipify-text">{titleOverride ?? (actionsOnly ? labels.actionCenterTitle : labels.title)}</h1>
          <p className="mt-1 text-sm text-aipify-text-secondary">{subtitleOverride ?? (actionsOnly ? labels.actionCenterSubtitle : labels.subtitle)}</p>
          {center.principle && !actionsOnly ? <p className="mt-2 text-xs text-aipify-text-muted">{center.principle}</p> : null}
        </div>
        {!actionsOnly ? (
          <div className="flex flex-wrap gap-2">
            {(["executive", "manager", "employee"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => {
                  setViewMode(mode);
                  void load(mode);
                }}
                className={
                  center.view_mode === mode
                    ? `${AipifyShellClasses.primaryButton} text-sm`
                    : `${AipifyShellClasses.secondaryButton} text-sm`
                }
              >
                {mode === "executive" ? labels.executiveMode : mode === "manager" ? labels.managerMode : labels.employeeMode}
              </button>
            ))}
          </div>
        ) : null}
      </header>

      {!actionsOnly ? (
        <div className={`${AipifyShellClasses.surfaceCard} flex flex-wrap gap-2 p-3`}>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className="min-w-[200px] flex-1 rounded-md border border-aipify-border bg-white px-3 py-2 text-sm"
          />
          <Link
            href={searchQuery.trim() ? `/app/search?q=${encodeURIComponent(searchQuery.trim())}` : (routes.search ?? "/app/search")}
            className={`${AipifyShellClasses.primaryButton} text-sm`}
          >
            {labels.searchIntegration}
          </Link>
          {routes.desktop_connect ? (
            <Link href={routes.desktop_connect} className={`${AipifyShellClasses.secondaryButton} text-sm`}>
              {labels.desktopConnect}
            </Link>
          ) : null}
        </div>
      ) : null}

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

      {tab === "overview" && !actionsOnly ? (
        <div className="space-y-6">
          <section>
            <h2 className="mb-3 text-sm font-semibold text-aipify-text">{labels.organizationHealth}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className={`${AipifyShellClasses.surfaceCard} p-4`}>
                <p className="text-xs uppercase text-aipify-text-muted">{labels.overallHealth}</p>
                <p className="mt-1 text-2xl font-semibold text-aipify-text">
                  {HEALTH_ICON[health?.overall_status ?? "healthy"] ?? "🟢"} {health?.overall_score ?? "—"}
                </p>
              </div>
              {(health?.dimensions ?? []).slice(0, 3).map((d) => (
                <div key={d.key} className={`${AipifyShellClasses.surfaceCard} p-4`}>
                  <p className="text-xs uppercase text-aipify-text-muted">{d.label}</p>
                  <p className="mt-1 text-lg font-semibold text-aipify-text">{d.score}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold text-aipify-text">{labels.sinceLastLogin}</h2>
            <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="font-medium text-aipify-text">{String(since.headline ?? briefing.headline ?? labels.sinceLastLogin)}</p>
              <Link href={routes.activity ?? "/app/since-last-login"} className={`${AipifyShellClasses.secondaryButton} mt-3 inline-flex text-xs`}>
                {labels.sinceLastLogin}
              </Link>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold text-aipify-text">{labels.recommendedActions}</h2>
            <RecommendationList items={center.recommended_actions ?? []} labels={labels} />
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold text-aipify-text">{labels.approvals}</h2>
            <ActionList items={center.pending_approvals ?? []} labels={labels} />
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold text-aipify-text">{labels.criticalAlerts}</h2>
            <AlertList items={center.critical_alerts ?? []} labels={labels} onAcknowledge={(id) => void runAction("acknowledge_alert", { alert_id: id })} busy={busy} />
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold text-aipify-text">{labels.companionRecommendations}</h2>
            <RecommendationList items={center.companion_recommendations ?? []} labels={labels} />
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold text-aipify-text">{labels.businessPackHighlights}</h2>
            <PackIntelList items={center.business_pack_intelligence ?? []} labels={labels} />
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold text-aipify-text">{labels.personalPriorities}</h2>
            <ActionList items={personal?.my_priorities ?? []} labels={labels} />
          </section>
        </div>
      ) : null}

      {tab === "health" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(health?.dimensions ?? []).map((d) => (
            <div key={d.key} className={`${AipifyShellClasses.surfaceCard} p-4`}>
              <p className="text-xs uppercase text-aipify-text-muted">{d.label}</p>
              <p className="mt-1 text-2xl font-semibold text-aipify-text">
                {HEALTH_ICON[d.status] ?? "🟢"} {d.score}
              </p>
              <p className="mt-1 text-xs text-aipify-text-secondary">{d.status.replace(/_/g, " ")}</p>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "briefing" ? (
        <div className={`${AipifyShellClasses.surfaceCard} space-y-4 p-4 text-sm`}>
          <p className="text-lg font-semibold text-aipify-text">{String(briefing.greeting ?? labels.executiveBriefing)}</p>
          <p className="text-aipify-text-secondary">{String(since.headline ?? briefing.headline ?? "")}</p>
          <ul className="list-disc space-y-1 pl-5 text-aipify-text-secondary">
            {Array.isArray(since.summary_lines)
              ? since.summary_lines.map((line: { text?: string }) => (
                  <li key={String(line.text)}>{String(line.text)}</li>
                ))
              : null}
          </ul>
          <button type="button" disabled={busy} onClick={() => void runAction("generate_executive_summary")} className={`${AipifyShellClasses.primaryButton} text-sm`}>
            {labels.generateSummary}
          </button>
        </div>
      ) : null}

      {tab === "actions" ? (
        <ActionList
          items={center.action_center ?? []}
          labels={labels}
          onComplete={(id) => void runAction("complete_action", { action_id: id })}
          busy={busy}
        />
      ) : null}

      {tab === "approvals" ? (
        <div className="space-y-4">
          <ActionList items={center.pending_approvals ?? []} labels={labels} />
          {routes.approvals ? (
            <Link href={routes.approvals} className={`${AipifyShellClasses.primaryButton} inline-flex text-sm`}>
              {labels.approvals}
            </Link>
          ) : null}
        </div>
      ) : null}

      {tab === "alerts" ? (
        <AlertList items={center.critical_alerts ?? []} labels={labels} onAcknowledge={(id) => void runAction("acknowledge_alert", { alert_id: id })} busy={busy} />
      ) : null}

      {tab === "recommendations" ? (
        <RecommendationList items={center.companion_recommendations ?? []} labels={labels} />
      ) : null}

      {tab === "personal" ? (
        <div className="space-y-6">
          <section><h2 className="mb-3 text-sm font-semibold">{labels.myTasks}</h2><ActionList items={personal?.my_tasks ?? []} labels={labels} /></section>
          <section><h2 className="mb-3 text-sm font-semibold">{labels.myMeetings}</h2><ActionList items={personal?.my_meetings ?? []} labels={labels} /></section>
          <section><h2 className="mb-3 text-sm font-semibold">{labels.myApprovals}</h2><ActionList items={personal?.my_approvals ?? []} labels={labels} /></section>
        </div>
      ) : null}

      {tab === "decisions" ? (
        <div className="space-y-6">
          <section><h2 className="mb-3 text-sm font-semibold">{labels.opportunities}</h2><RecommendationList items={(decision.opportunities as HubRecommendation[] | undefined) ?? []} labels={labels} /></section>
          <section><h2 className="mb-3 text-sm font-semibold">{labels.risks}</h2><RecommendationList items={(decision.risks as HubRecommendation[] | undefined) ?? []} labels={labels} /></section>
        </div>
      ) : null}

      {tab === "meetings" ? (
        <ActionList items={(meetings.upcoming_meetings as HubAction[] | undefined) ?? []} labels={labels} />
      ) : null}

      {tab === "notifications" ? (
        <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
          <p className="text-aipify-text-secondary">{labels.notificationsHub}</p>
          {routes.notifications ? (
            <Link href={routes.notifications} className={`${AipifyShellClasses.primaryButton} mt-4 inline-flex text-sm`}>
              {labels.notificationsHub}
            </Link>
          ) : null}
        </div>
      ) : null}

      {!actionsOnly && Array.isArray(companion.prompts) ? (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-aipify-text">{labels.companionConversation}</h2>
          <div className={`${AipifyShellClasses.surfaceCard} p-4`}>
            <ul className="list-disc space-y-1 pl-5 text-sm text-aipify-text-secondary">
              {companion.prompts.map((prompt) => (
                <li key={String(prompt)}>{String(prompt)}</li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {(center.audit_recent ?? []).length > 0 ? (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-aipify-text">{labels.auditLog}</h2>
          <div className="space-y-2">
            {(center.audit_recent ?? []).map((entry) => (
              <div key={`${entry.action}-${entry.created_at}`} className={`${AipifyShellClasses.surfaceCard} p-3 text-xs text-aipify-text-secondary`}>
                <span className="font-medium text-aipify-text">{entry.action}</span> — {entry.summary}
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
