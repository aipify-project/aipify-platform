"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { AppErrorState } from "@/components/app/design";
import type { AipifyStatusKind } from "@/lib/design/status-system";
import type { AppOrganizationContextState } from "@/lib/tenant/resolve-app-organization-context";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import type {
  ActivityEvent,
  ActivityHighlight,
  ActivityOperationsCenter,
  ActivityOperationsLabels,
  ActivityOperationsTab,
} from "@/lib/activity-operations";
import { SinceLastLoginPresentation } from "@/components/shared/since-last-login/SinceLastLoginPresentation";
import type { SinceLastLoginUxLabels } from "@/lib/command-center/since-last-login-labels";
import { parseActivityOperationsCenter } from "@/lib/activity-operations/parse";

type Tab = ActivityOperationsTab;

const PRIORITY_STYLE: Record<string, string> = {
  information: "bg-sky-50 text-sky-900 ring-sky-200",
  attention_required: "bg-amber-50 text-amber-900 ring-amber-200",
  critical: "bg-red-50 text-red-900 ring-red-200",
  security: "bg-violet-50 text-violet-900 ring-violet-200",
  completed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  pending: "bg-orange-50 text-orange-900 ring-orange-200",
};

const PRIORITY_ICON: Record<string, string> = {
  information: "ℹ️",
  attention_required: "⚠️",
  critical: "🚨",
  security: "🛡",
  completed: "✅",
  pending: "⏳",
};

type Props = {
  labels: ActivityOperationsLabels;
  sinceLastLoginUxLabels?: SinceLastLoginUxLabels;
  initialTab?: Tab;
  titleOverride?: string;
  subtitleOverride?: string;
  visibleTabs?: Tab[];
};

function resolveActivityAccessCopy(
  accessState: AppOrganizationContextState | null,
  labels: ActivityOperationsLabels
): { title: string; description: string; statusKind: AipifyStatusKind; statusLabel: string } {
  switch (accessState) {
    case "permission_missing":
    case "access_denied":
      return {
        title: labels.permissionMissing,
        description: labels.accessDenied,
        statusKind: "not_allowed",
        statusLabel: labels.permissionMissing,
      };
    case "entitlement_missing":
      return {
        title: labels.entitlementMissing,
        description: labels.accessDenied,
        statusKind: "restricted",
        statusLabel: labels.entitlementMissing,
      };
    case "subscription_inactive":
    case "license_inactive":
      return {
        title: labels.entitlementMissing,
        description: labels.accessDenied,
        statusKind: "restricted",
        statusLabel: labels.entitlementMissing,
      };
    case "organization_missing":
    case "membership_missing":
    case "user_not_provisioned":
      return {
        title: labels.organizationMissing,
        description: labels.accessDenied,
        statusKind: "needs_attention",
        statusLabel: labels.organizationMissing,
      };
    case "database_execution_error":
      return {
        title: labels.loadError,
        description: labels.accessDenied,
        statusKind: "needs_attention",
        statusLabel: labels.loadError,
      };
    default:
      return {
        title: labels.loadError,
        description: labels.accessDenied,
        statusKind: "needs_attention",
        statusLabel: labels.loadError,
      };
  }
}

function EventList({ events, labels, emptyTitle }: { events: ActivityEvent[]; labels: ActivityOperationsLabels; emptyTitle: string }) {
  if (events.length === 0) {
    return <PlatformEmptyState title={emptyTitle} message={labels.emptyHint} />;
  }
  return (
    <div className="space-y-3">
      {events.map((event) => (
        <div key={event.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-base">{PRIORITY_ICON[event.priority] ?? "ℹ️"}</span>
                <p className="font-medium text-aipify-text">{event.title}</p>
                <span className={`rounded-full px-2 py-0.5 text-xs ring-1 ${PRIORITY_STYLE[event.priority] ?? PRIORITY_STYLE.information}`}>
                  {event.priority.replace(/_/g, " ")}
                </span>
              </div>
              {event.summary ? <p className="mt-1 text-aipify-text-secondary">{event.summary}</p> : null}
              {event.impact_note ? <p className="mt-1 text-xs text-aipify-text-muted">{event.impact_note}</p> : null}
              {event.recommendation ? (
                <p className="mt-2 text-xs font-medium text-aipify-text-secondary">{event.recommendation}</p>
              ) : null}
              <p className="mt-2 text-xs uppercase text-aipify-text-muted">
                {event.category ? event.category.replace(/_/g, " ") : labels.unknownEventType}
                {event.occurred_at ? ` · ${new Date(event.occurred_at).toLocaleString()}` : ""}
              </p>
            </div>
            {event.record_href ? (
              <Link href={event.record_href} className={`${AipifyShellClasses.secondaryButton} shrink-0 text-xs`}>
                {labels.viewRecord}
              </Link>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function HighlightList({ highlights }: { highlights: ActivityHighlight[] }) {
  if (highlights.length === 0) return null;
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {highlights.map((h) => (
        <div key={h.id} className={`${AipifyShellClasses.surfaceCard} border-l-4 border-aipify-accent p-4 text-sm`}>
          <p className="text-xs uppercase text-aipify-text-muted">{h.highlight_type.replace(/_/g, " ")}</p>
          <p className="mt-1 font-medium text-aipify-text">{h.title}</p>
          {h.summary ? <p className="mt-1 text-aipify-text-secondary">{h.summary}</p> : null}
        </div>
      ))}
    </div>
  );
}

export function ActivityOperationsPanel({
  labels,
  sinceLastLoginUxLabels,
  initialTab = "overview",
  titleOverride,
  subtitleOverride,
  visibleTabs,
}: Props) {
  const [center, setCenter] = useState<ActivityOperationsCenter | null>(null);
  const [accessState, setAccessState] = useState<AppOrganizationContextState | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>(initialTab);
  const [busy, setBusy] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ActivityEvent[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/activity-operations");
    const body = (await res.json()) as Record<string, unknown>;
    if (res.ok && body.found !== false) {
      setCenter(parseActivityOperationsCenter(body));
      setAccessState(null);
    } else {
      setCenter(null);
      const access =
        (body.access_state as AppOrganizationContextState | undefined) ??
        (body.error === "load_error" ? "database_execution_error" : "access_denied");
      setAccessState(access);
    }
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
    await fetch("/api/app/activity-operations/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type, payload }),
    });
    setBusy(false);
    await load();
  }

  async function runSearch() {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setBusy(true);
    const res = await fetch(`/api/app/activity-operations/search?q=${encodeURIComponent(searchQuery.trim())}`);
    if (res.ok) {
      const data = await res.json();
      setSearchResults(Array.isArray(data.results) ? data.results : []);
    } else {
      setSearchResults([]);
    }
    setBusy(false);
  }

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
      </div>
    );
  }

  if (!center?.found) {
    const accessCopy = resolveActivityAccessCopy(accessState, labels);
    return (
      <div className="mx-auto max-w-3xl p-6">
        <AppErrorState
          title={accessCopy.title}
          description={accessCopy.description}
          statusKind={accessCopy.statusKind}
          statusLabel={accessCopy.statusLabel}
          onRetry={() => void load()}
          retryLabel={labels.retry}
          returnHref="/app"
          returnLabel={labels.returnToDashboard}
        />
      </div>
    );
  }

  const overview = center.overview ?? {};
  const since = center.since_last_login;
  const intelligence = center.activity_intelligence ?? {};
  const reports = center.reports ?? {};
  const routes = center.routes ?? {};
  const companion = center.companion_integration ?? {};
  const notifications = center.notifications_integration ?? {};

  const allTabs: { id: Tab; label: string }[] = [
    { id: "overview", label: labels.overview },
    { id: "since_last_login", label: labels.sinceLastLogin },
    { id: "organization", label: labels.organization },
    { id: "my_activity", label: labels.myActivity },
    { id: "team", label: labels.team },
    { id: "approvals", label: labels.approvals },
    { id: "business_packs", label: labels.businessPacks },
    { id: "domains", label: labels.domains },
    { id: "companion_insights", label: labels.companionInsights },
    { id: "reports", label: labels.reports },
  ];
  const tabs = visibleTabs ? allTabs.filter((t) => visibleTabs.includes(t.id)) : allTabs;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-semibold text-aipify-text">{titleOverride ?? labels.title}</h1>
        <p className="mt-1 text-sm text-aipify-text-secondary">{subtitleOverride ?? labels.subtitle}</p>
        {center.principle ? <p className="mt-2 text-xs text-aipify-text-muted">{center.principle}</p> : null}
      </header>

      <div className={`${AipifyShellClasses.surfaceCard} flex flex-wrap gap-2 p-3`}>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={labels.searchPlaceholder}
          className="min-w-[200px] flex-1 rounded-md border border-aipify-border bg-white px-3 py-2 text-sm"
        />
        <button type="button" disabled={busy} onClick={() => void runSearch()} className={`${AipifyShellClasses.primaryButton} text-sm`}>
          {labels.searchActivity}
        </button>
        {routes.search ? (
          <Link href={routes.search} className={`${AipifyShellClasses.secondaryButton} text-sm`}>
            {labels.searchIntegration}
          </Link>
        ) : null}
      </div>

      {searchResults.length > 0 ? (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-aipify-text">{labels.searchActivity}</h2>
          <EventList events={searchResults} labels={labels} emptyTitle={labels.noEvents} />
        </section>
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

      {tab === "overview" ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(
              [
                [labels.totalEvents, overview.total_events],
                [labels.eventsSinceLogin, overview.events_since_login],
                [labels.pendingApprovals, overview.pending_approvals],
                [labels.criticalItems, overview.critical_items],
              ] as const
            ).map(([label, value]) => (
              <div key={label} className={`${AipifyShellClasses.surfaceCard} p-4`}>
                <p className="text-xs uppercase text-aipify-text-muted">{label}</p>
                <p className="mt-1 text-2xl font-semibold text-aipify-text">{String(value ?? 0)}</p>
              </div>
            ))}
          </div>

          {since?.headline ? (
            <div className={`${AipifyShellClasses.surfaceCard} p-4`}>
              <h2 className="text-sm font-semibold text-aipify-text">{labels.sinceLastLogin}</h2>
              <p className="mt-2 text-sm text-aipify-text-secondary">{since.headline}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" disabled={busy} onClick={() => void runAction("mark_login")} className={`${AipifyShellClasses.primaryButton} text-sm`}>
                  {labels.markLogin}
                </button>
                <button type="button" disabled={busy} onClick={() => void runAction("generate_summary")} className={`${AipifyShellClasses.secondaryButton} text-sm`}>
                  {labels.generateSummary}
                </button>
                <Link href={routes.since_last_login ?? "/app/since-last-login"} className={`${AipifyShellClasses.secondaryButton} text-sm`}>
                  {labels.sinceLastLogin}
                </Link>
              </div>
            </div>
          ) : null}

          <HighlightList highlights={center.companion_highlights ?? []} />
        </>
      ) : null}

      {tab === "since_last_login" ? (
        sinceLastLoginUxLabels ? (
          <SinceLastLoginPresentation
            labels={sinceLastLoginUxLabels}
            activitySinceLogin={since as Record<string, unknown> | undefined}
            activityEvents={[
              ...(since?.top_changes ?? []),
              ...(since?.top_risks ?? []),
              ...(since?.top_opportunities ?? []),
            ]}
            activityHistoryHref={routes.activity ?? "/app/activity"}
            showInsight
            activityHeading={false}
            error={center.error}
            onRefresh={() => void load()}
          />
        ) : (
          <PlatformEmptyState title={labels.loadError} message={labels.emptyHint} />
        )
      ) : null}

      {tab === "organization" ? (
        <EventList events={center.organization_timeline ?? []} labels={labels} emptyTitle={labels.noEvents} />
      ) : null}

      {tab === "my_activity" ? (
        <EventList events={center.personal_timeline ?? []} labels={labels} emptyTitle={labels.noEvents} />
      ) : null}

      {tab === "team" ? (
        <EventList events={center.team_timeline ?? []} labels={labels} emptyTitle={labels.noEvents} />
      ) : null}

      {tab === "approvals" ? (
        <div className="space-y-4">
          <EventList events={center.approval_feed ?? []} labels={labels} emptyTitle={labels.noEvents} />
          {routes.approvals ? (
            <Link href={routes.approvals} className={`${AipifyShellClasses.primaryButton} inline-flex text-sm`}>
              {labels.approvals}
            </Link>
          ) : null}
        </div>
      ) : null}

      {tab === "business_packs" ? (
        <EventList events={center.business_pack_activity ?? []} labels={labels} emptyTitle={labels.noEvents} />
      ) : null}

      {tab === "domains" ? (
        <EventList events={center.domain_activity ?? []} labels={labels} emptyTitle={labels.noEvents} />
      ) : null}

      {tab === "companion_insights" ? (
        <div className="space-y-6">
          <HighlightList highlights={center.companion_highlights ?? []} />
          <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
            <h2 className="font-semibold text-aipify-text">{labels.companionIntegration}</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-aipify-text-secondary">
              {Array.isArray(companion.prompts)
                ? companion.prompts.map((prompt) => <li key={String(prompt)}>{String(prompt)}</li>)
                : null}
            </ul>
            <button type="button" disabled={busy} onClick={() => void runAction("companion_summary")} className={`${AipifyShellClasses.primaryButton} mt-4 text-sm`}>
              {labels.companionSummary}
            </button>
          </div>
          <section>
            <h2 className="mb-3 text-sm font-semibold text-aipify-text">{labels.activityIntelligence}</h2>
            <div className={`${AipifyShellClasses.surfaceCard} space-y-3 p-4 text-sm`}>
              {Array.isArray(intelligence.trends) ? (
                <div>
                  <p className="text-xs uppercase text-aipify-text-muted">{labels.trends}</p>
                  <ul className="mt-1 list-disc pl-5 text-aipify-text-secondary">
                    {intelligence.trends.map((t) => (
                      <li key={String(t)}>{String(t)}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {Array.isArray(intelligence.patterns) ? (
                <div>
                  <p className="text-xs uppercase text-aipify-text-muted">{labels.patterns}</p>
                  <ul className="mt-1 list-disc pl-5 text-aipify-text-secondary">
                    {intelligence.patterns.map((t) => (
                      <li key={String(t)}>{String(t)}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      ) : null}

      {tab === "reports" ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(reports).map(([key, value]) => (
              <div key={key} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <p className="text-xs uppercase text-aipify-text-muted">{key.replace(/_/g, " ")}</p>
                <p className="mt-1 font-medium text-aipify-text">
                  {typeof value === "object" ? JSON.stringify(value) : String(value ?? "—")}
                </p>
              </div>
            ))}
          </div>
          <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
            <h2 className="font-semibold text-aipify-text">{labels.executiveBriefing}</h2>
            <p className="mt-2 text-aipify-text-secondary">{since?.companion_summary ?? labels.emptyHint}</p>
            {routes.intelligence_briefing ? (
              <Link href={routes.intelligence_briefing} className={`${AipifyShellClasses.secondaryButton} mt-4 inline-flex text-sm`}>
                {labels.executiveBriefing}
              </Link>
            ) : null}
          </div>
          <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
            <h2 className="font-semibold text-aipify-text">{labels.notificationsIntegration}</h2>
            <p className="mt-2 text-aipify-text-secondary">
              {notifications.daily_digest ? "Daily digest enabled" : "Daily digest disabled"}
              {center.mobile_access?.mobile_ready ? ` · ${labels.mobileReady}` : ""}
            </p>
          </div>
        </div>
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
