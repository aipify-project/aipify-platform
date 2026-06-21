"use client";

import Link from "next/link";
import { SemanticBadge } from "@/components/ui/semantic-badge";
import { getSemanticPresentation } from "@/lib/design/semantic-status-system";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import type { CommandCenterItem } from "@/lib/command-center/ecc-tab-datasets";

type CommandCenterItemCardProps = {
  item: CommandCenterItem;
  resolveLabel: (key: string) => string;
  variant?: "default" | "health";
};

function formatTimestamp(value?: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export function CommandCenterItemCard({
  item,
  resolveLabel,
  variant = "default",
}: CommandCenterItemCardProps) {
  const primaryPresentation = getSemanticPresentation(item.primaryBadge.type, item.primaryBadge.value);
  const borderClasses = `${primaryPresentation.borderClassName} ${primaryPresentation.backgroundClassName}`;
  const timestamp = formatTimestamp(item.timestamp);
  const actionLabel = resolveLabel(item.actionLabelKey);

  return (
    <Link
      href={item.href}
      className={`block rounded-xl border border-l-4 p-5 transition hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aipify-accent ${AppPremiumShell.elevatedCardHover} ${borderClasses}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {item.source ? (
              <span className="text-xs font-medium uppercase tracking-wide text-aipify-text-muted">{item.source}</span>
            ) : null}
            <SemanticBadge
              type={item.primaryBadge.type}
              value={item.primaryBadge.value}
              label={resolveLabel(item.primaryBadge.labelKey)}
            />
            {item.secondaryBadge ? (
              <SemanticBadge
                type={item.secondaryBadge.type}
                value={item.secondaryBadge.value}
                label={resolveLabel(item.secondaryBadge.labelKey)}
              />
            ) : null}
          </div>

          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <h3 className="text-base font-semibold text-aipify-text">{item.title}</h3>
            {variant === "health" && typeof item.healthScore === "number" ? (
              <span className="text-sm font-medium text-aipify-text-secondary">{item.healthScore} / 100</span>
            ) : null}
            {item.count > 1 ? (
              <span className="text-sm text-aipify-text-muted">
                {item.count} {resolveLabel("customerApp.executiveCommandCenter.tabs.shared.items")}
              </span>
            ) : null}
          </div>

          {item.description ? (
            <p className="text-sm leading-relaxed text-aipify-text-secondary">{item.description}</p>
          ) : null}

          <dl className="grid gap-1 text-xs text-aipify-text-muted sm:grid-cols-2">
            {item.itemType ? (
              <div>
                <dt className="inline font-medium">{resolveLabel("customerApp.executiveCommandCenter.tabs.shared.type")}: </dt>
                <dd className="inline capitalize">{item.itemType.replace(/_/g, " ")}</dd>
              </div>
            ) : null}
            {item.requester ? (
              <div>
                <dt className="inline font-medium">
                  {resolveLabel("customerApp.executiveCommandCenter.tabs.approvals.requester")}:{" "}
                </dt>
                <dd className="inline">{item.requester}</dd>
              </div>
            ) : null}
            {item.blockedSummary ? (
              <div className="sm:col-span-2">
                <dt className="inline font-medium">
                  {resolveLabel("customerApp.executiveCommandCenter.tabs.approvals.blocked")}:{" "}
                </dt>
                <dd className="inline">{item.blockedSummary}</dd>
              </div>
            ) : null}
            {item.valueLabel ? (
              <div>
                <dt className="inline font-medium">
                  {resolveLabel("customerApp.executiveCommandCenter.tabs.opportunities.value")}:{" "}
                </dt>
                <dd className="inline">{item.valueLabel}</dd>
              </div>
            ) : null}
            {item.confidenceLabel ? (
              <div>
                <dt className="inline font-medium">
                  {resolveLabel("customerApp.executiveCommandCenter.tabs.opportunities.confidence")}:{" "}
                </dt>
                <dd className="inline capitalize">{item.confidenceLabel.replace(/_/g, " ")}</dd>
              </div>
            ) : null}
            {item.nextStep ? (
              <div className="sm:col-span-2">
                <dt className="inline font-medium">
                  {resolveLabel("customerApp.executiveCommandCenter.tabs.opportunities.nextStep")}:{" "}
                </dt>
                <dd className="inline">{item.nextStep}</dd>
              </div>
            ) : null}
            {timestamp ? (
              <div>
                <dt className="inline font-medium">
                  {resolveLabel("customerApp.executiveCommandCenter.tabs.shared.timestamp")}:{" "}
                </dt>
                <dd className="inline">{timestamp}</dd>
              </div>
            ) : null}
          </dl>
        </div>

        <span className="shrink-0 text-sm font-medium text-aipify-companion">{actionLabel} →</span>
      </div>
    </Link>
  );
}

type CommandCenterItemListProps = {
  items: CommandCenterItem[];
  resolveLabel: (key: string) => string;
  emptyTitle: string;
  emptyDescription: string;
  variant?: "default" | "health";
};

export function CommandCenterItemList({
  items,
  resolveLabel,
  variant = "default",
}: Omit<CommandCenterItemListProps, "emptyTitle" | "emptyDescription">) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <CommandCenterItemCard key={item.id} item={item} resolveLabel={resolveLabel} variant={variant} />
      ))}
    </div>
  );
}

export function CommandCenterSectionBlock({
  title,
  items,
  resolveLabel,
  emptyTitle,
  emptyDescription,
  variant = "default",
}: {
  title: string;
  items: CommandCenterItem[];
  resolveLabel: (key: string) => string;
  emptyTitle: string;
  emptyDescription: string;
  variant?: "default" | "health";
}) {
  return (
    <section className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-aipify-text">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-aipify-text-secondary">{emptyDescription || emptyTitle}</p>
      ) : (
        <CommandCenterItemList items={items} resolveLabel={resolveLabel} variant={variant} />
      )}
    </section>
  );
}
