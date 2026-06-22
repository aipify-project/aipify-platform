"use client";

import Link from "next/link";
import { CompanionInsightBanner } from "@/components/app/design";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { SemanticBadge } from "@/components/ui/semantic-badge";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import {
  getSeverityPresentation,
  getWorkflowStatePresentation,
} from "@/lib/design/semantic-status-system";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import {
  buildSinceLastLoginDataset,
  groupSinceLastLoginEvents,
  type SinceLastLoginEvent,
} from "@/lib/command-center/since-last-login";
import {
  formatSinceLastLoginCount,
  type SinceLastLoginUxLabels,
} from "@/lib/command-center/since-last-login-labels";
import type { ActivityEvent } from "@/lib/activity-operations/types";
import type { WorkflowState } from "@/lib/design/semantic-status-system";

type SinceLastLoginPresentationProps = {
  labels: SinceLastLoginUxLabels;
  eccItems?: Record<string, unknown>[];
  activitySinceLogin?: Record<string, unknown>;
  timeline?: Record<string, unknown>[];
  activityEvents?: ActivityEvent[];
  activityHistoryHref?: string;
  showInsight?: boolean;
  activityHeading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
};

function workflowLabel(labels: SinceLastLoginUxLabels, state: WorkflowState): string {
  switch (state) {
    case "awaiting_approval":
      return labels.workflow.awaitingApproval;
    case "in_progress":
      return labels.workflow.inProgress;
    case "pending":
      return labels.workflow.pending;
    case "completed":
      return labels.workflow.completed;
    case "open":
      return labels.workflow.open;
    default:
      return labels.workflow.open;
  }
}

function formatTimestamp(value?: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function SinceLastLoginEventCard({
  event,
  labels,
}: {
  event: SinceLastLoginEvent;
  labels: SinceLastLoginUxLabels;
}) {
  const cardPresentation =
    event.category === "completed_by_aipify"
      ? getWorkflowStatePresentation("completed")
      : event.category === "information"
        ? getSeverityPresentation("info")
        : event.severity
          ? getSeverityPresentation(event.severity)
          : getSeverityPresentation("info");

  const countLabel = event.count > 1 ? formatSinceLastLoginCount(labels, event.count, event.eventType) : null;
  const timestamp = formatTimestamp(event.occurredAt);

  return (
    <Link
      href={event.href}
      className={`block rounded-xl border border-l-4 p-4 transition hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aipify-accent ${cardPresentation.borderClassName} ${cardPresentation.backgroundClassName}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-aipify-text-muted">
              {event.eventType || labels.unknownEventType}
            </span>
            {event.category === "completed_by_aipify" ? (
              <SemanticBadge type="workflow" value="completed" label={labels.completedByAipify} />
            ) : event.severity ? (
              <SemanticBadge
                type="severity"
                value={event.severity}
                label={labels.severity[event.severity]}
              />
            ) : (
              <SemanticBadge type="severity" value="info" label={labels.information} />
            )}
            {event.workflowState ? (
              <SemanticBadge
                type="workflow"
                value={event.workflowState}
                label={workflowLabel(labels, event.workflowState)}
              />
            ) : null}
          </div>
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <h3 className="text-base font-semibold text-aipify-text">{event.title}</h3>
            {countLabel ? <span className="text-sm text-aipify-text-muted">{countLabel}</span> : null}
          </div>
          {event.explanation ? <p className="text-sm leading-relaxed text-aipify-text-secondary">{event.explanation}</p> : null}
          {timestamp ? <p className="text-xs text-aipify-text-muted">{timestamp}</p> : null}
        </div>
        <span className={`shrink-0 text-sm font-medium text-aipify-accent ${AipifyShellClasses.secondaryButton} pointer-events-none px-3 py-1.5`}>
          {labels.openAction} →
        </span>
      </div>
    </Link>
  );
}

function SummaryCounts({
  labels,
  counts,
}: {
  labels: SinceLastLoginUxLabels;
  counts: { requiresAttention: number; completedByAipify: number; otherChanges: number };
}) {
  return (
    <div className="flex flex-wrap gap-3 text-sm text-aipify-text-secondary">
      <span>{labels.summaryRequiresAttention.replace("{{count}}", String(counts.requiresAttention))}</span>
      <span className="text-aipify-text-muted">|</span>
      <span>{labels.summaryCompleted.replace("{{count}}", String(counts.completedByAipify))}</span>
      <span className="text-aipify-text-muted">|</span>
      <span>{labels.summaryOtherChanges.replace("{{count}}", String(counts.otherChanges))}</span>
    </div>
  );
}

function EventGroup({
  title,
  events,
  labels,
  emptyMessage,
}: {
  title: string;
  events: SinceLastLoginEvent[];
  labels: SinceLastLoginUxLabels;
  emptyMessage?: string;
}) {
  if (events.length === 0 && !emptyMessage) return null;

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-aipify-text">{title}</h3>
      {events.length === 0 ? (
        <p className="text-sm text-aipify-text-secondary">{emptyMessage}</p>
      ) : (
        <div className="space-y-3">
          {events.map((event) => <SinceLastLoginEventCard key={event.id} event={event} labels={labels} />)}
        </div>
      )}
    </section>
  );
}

export function SinceLastLoginPresentation({
  labels,
  eccItems,
  activitySinceLogin,
  timeline,
  activityEvents,
  activityHistoryHref = "/app/activity",
  showInsight = true,
  activityHeading = true,
  error,
  onRefresh,
}: SinceLastLoginPresentationProps) {
  if (error) {
    return (
      <div className={`${AppPremiumShell.elevatedCard} space-y-4 p-6`}>
        <p className="text-sm font-semibold text-amber-900">⚠️ {labels.errorTitle}</p>
        <p className="text-sm text-aipify-text-secondary">{labels.errorDescription}</p>
        <div className="flex flex-wrap gap-2">
          {onRefresh ? (
            <button type="button" onClick={onRefresh} className={`${AipifyShellClasses.primaryButton} text-sm`}>
              {labels.refresh}
            </button>
          ) : null}
          <Link href={activityHistoryHref} className={`${AipifyShellClasses.secondaryButton} text-sm`}>
            {labels.viewActivityHistory}
          </Link>
        </div>
      </div>
    );
  }

  const events = buildSinceLastLoginDataset({
    eccItems,
    activitySinceLogin,
    timeline,
    activityEvents,
  });
  const grouped = groupSinceLastLoginEvents(events);
  const isEmpty = events.length === 0;

  return (
    <div className={AppPremiumShell.sectionGap}>
      {showInsight ? <CompanionInsightBanner principle={labels.insight} label={labels.insightLabel} /> : null}

      {activityHeading ? (
        <h2 className="text-sm font-semibold text-aipify-text">{labels.activityHeading}</h2>
      ) : null}

      {isEmpty ? (
        <PlatformEmptyState title={labels.emptyAll} message={labels.emptyAllDescription} />
      ) : (
        <>
          <SummaryCounts labels={labels} counts={grouped.counts} />
          <div className="space-y-8">
            <EventGroup
              title={labels.groupRequiresAttention}
              events={grouped.requiresAttention}
              labels={labels}
              emptyMessage={labels.emptyAttention}
            />
            {grouped.completedByAipify.length > 0 ? (
              <EventGroup title={labels.groupCompleted} events={grouped.completedByAipify} labels={labels} />
            ) : null}
            {grouped.otherChanges.length > 0 ? (
              <EventGroup title={labels.groupOtherChanges} events={grouped.otherChanges} labels={labels} />
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
