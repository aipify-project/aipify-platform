import Link from "next/link";
import type { ReactNode } from "react";
import {
  AppContentWidth,
  AppEmptyState,
  AppIconActionCard,
  AppIconStatusCard,
  AppWorkspaceHero,
} from "@/components/app/design";
import type { WorkspaceDashboardLabels } from "@/lib/app-workspace-dashboard/labels";
import type { WorkspaceDashboardBundle } from "@/lib/app-workspace-dashboard/types";
import {
  shouldShowPartnerSection,
  ticketCountsArePartial,
  workspaceModulesAreEmpty,
} from "@/lib/app-workspace-dashboard/presentation";
import { mapTicketStatusLabelKey } from "@/lib/app-workspace-dashboard/ticket-summary";
import { CUSTOMER_CATALOG_ROUTE } from "@/lib/app-portal/customer-catalog/model";
import { formatPlatformDateTimeClock } from "@/lib/platform-presentation-quality";
import { AppVisualClasses } from "@/lib/design/app-visual-system";

export type WorkspaceDashboardPanelProps = {
  labels: WorkspaceDashboardLabels;
  bundle: WorkspaceDashboardBundle;
  locale: string;
};

function MetricIcon({ path }: { path: string }) {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

function KpiTile({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className={AppVisualClasses.card}>
      <p className="text-sm text-[var(--app-text-muted)]">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-[var(--app-text)]">{value}</p>
    </div>
  );
}

function moduleTitle(labels: WorkspaceDashboardLabels, moduleKey: string): string {
  if (moduleKey === "website_kompis") return labels.moduleKompisWeb;
  if (moduleKey === "kompis_bedrift") return labels.moduleKompisBedrift;
  if (moduleKey === "sales_partner") return labels.moduleSalesPartner;
  return moduleKey;
}

function moduleState(
  labels: WorkspaceDashboardLabels,
  state: WorkspaceDashboardBundle["modules"][number]["state"]
): { label: string; tone: "emerald" | "amber" | "slate" | "purple" } {
  switch (state) {
    case "active":
      return { label: labels.stateActive, tone: "emerald" };
    case "setup_required":
      return { label: labels.stateSetup, tone: "amber" };
    case "pending_approval":
      return { label: labels.statePending, tone: "amber" };
    case "temporarily_unavailable":
    case "expired":
      return { label: labels.stateUnavailable, tone: "slate" };
    default:
      return { label: labels.stateUnknown, tone: "slate" };
  }
}

function displayCount(value: number | null, notAvailable: string): string {
  return value == null ? notAvailable : String(value);
}

function ticketStatusLabel(
  labels: WorkspaceDashboardLabels,
  status: WorkspaceDashboardBundle["tickets"]["recent"][number]["status"]
): string {
  const key = mapTicketStatusLabelKey(status);
  switch (key) {
    case "statusNew":
      return labels.statusNew;
    case "statusInProgress":
      return labels.statusInProgress;
    case "statusWaitingAipify":
      return labels.statusWaitingAipify;
    case "statusWaitingCustomer":
      return labels.statusWaitingCustomer;
    case "statusResolved":
      return labels.statusResolved;
    case "statusClosed":
      return labels.statusClosed;
    case "statusReopened":
      return labels.statusReopened;
    case "statusArchived":
      return labels.statusArchived;
    default:
      return labels.statusUnknown;
  }
}

const BTN_PRIMARY =
  "inline-flex rounded-[var(--app-radius-md)] bg-[image:var(--app-primary-gradient)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]";
const BTN_SECONDARY =
  "inline-flex rounded-[var(--app-radius-md)] border border-[var(--app-border)] bg-[var(--app-card)] px-4 py-2 text-sm font-medium text-[var(--app-text)] transition hover:bg-[var(--app-soft-surface)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]";

export function WorkspaceDashboardPanel({
  labels,
  bundle,
  locale,
}: WorkspaceDashboardPanelProps) {
  const contextBits = [bundle.organizationName, bundle.planLabel].filter(Boolean);
  const generatedLabel = formatPlatformDateTimeClock(bundle.generatedAt, {
    locale,
    emptyFallback: labels.notAvailable,
    invalidFallback: labels.notAvailable,
  });
  const modulesEmpty = workspaceModulesAreEmpty(bundle.modules);
  const showPartner = shouldShowPartnerSection(bundle.partner.availability);
  const ticketsPartial = ticketCountsArePartial(bundle.tickets);

  return (
    <AppContentWidth className="relative">
      <div className="relative z-[1] space-y-8">
        <AppWorkspaceHero
          eyebrow={labels.eyebrow}
          title={labels.title}
          description={labels.description}
          contextLabel={contextBits.join(" · ")}
          status={
            bundle.licenseStatusLabel
              ? { label: bundle.licenseStatusLabel, tone: "slate" }
              : undefined
          }
        />

        <p className="text-sm text-[var(--app-text-muted)]">
          {labels.lastUpdated}: {generatedLabel}
        </p>

        <section className="space-y-3" aria-labelledby="workspace-summary-heading">
          <h2 id="workspace-summary-heading" className="text-lg font-semibold text-[var(--app-text)]">
            {labels.summaryTitle}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiTile label={labels.activeModules} value={String(bundle.activeModuleCount)} />
            <KpiTile label={labels.setupModules} value={String(bundle.setupModuleCount)} />
            <KpiTile
              label={labels.openTickets}
              value={displayCount(bundle.tickets.counts.open, labels.notAvailable)}
            />
            <KpiTile
              label={labels.subscriptionStatus}
              value={bundle.licenseStatusLabel || labels.notAvailable}
            />
          </div>
          {ticketsPartial ? (
            <p className="text-xs leading-relaxed text-[var(--app-text-muted)]">
              {labels.ticketsCountsPartial}
            </p>
          ) : null}
        </section>

        <section className="space-y-3" aria-labelledby="workspace-attention-heading">
          <h2 id="workspace-attention-heading" className="text-lg font-semibold text-[var(--app-text)]">
            {labels.attentionTitle}
          </h2>
          {bundle.attention.length > 0 ? (
            <ul className="space-y-2">
              {bundle.attention.map((item) => {
                const title =
                  item.titleKey === "attentionModuleSetup"
                    ? labels.attentionModuleSetup
                    : labels.attentionTicketsWaitingCustomer;
                return (
                  <li key={item.id}>
                    {item.href ? (
                      <Link
                        href={item.href}
                        className={`${AppVisualClasses.card} flex items-center justify-between gap-3 transition hover:bg-[var(--app-soft-surface)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]`}
                      >
                        <span className="text-sm font-medium text-[var(--app-text)]">{title}</span>
                        <span className="text-sm text-[var(--app-primary)]" aria-hidden="true">
                          →
                        </span>
                      </Link>
                    ) : (
                      <div className={AppVisualClasses.card}>
                        <span className="text-sm font-medium text-[var(--app-text)]">{title}</span>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <AppEmptyState
              variant="compact"
              title={labels.attentionEmptyTitle}
              description={labels.attentionEmptyDescription}
              actionHref={CUSTOMER_CATALOG_ROUTE}
              actionLabel={labels.attentionEmptyCta}
            />
          )}
        </section>

        <section className="space-y-3" aria-labelledby="workspace-modules-heading">
          <div>
            <h2 id="workspace-modules-heading" className="text-lg font-semibold text-[var(--app-text)]">
              {labels.modulesTitle}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-[var(--app-text-muted)]">
              {labels.modulesDescription}
            </p>
          </div>
          {modulesEmpty ? (
            <AppEmptyState
              title={labels.modulesEmptyTitle}
              description={labels.modulesEmptyDescription}
              actionHref={CUSTOMER_CATALOG_ROUTE}
              actionLabel={labels.modulesEmptyCta}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {bundle.modules.map((mod) => {
                const state = moduleState(labels, mod.state);
                const icon: ReactNode = (
                  <MetricIcon path="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                );
                if (mod.openHref) {
                  return (
                    <AppIconActionCard
                      key={mod.moduleKey}
                      href={mod.openHref}
                      title={moduleTitle(labels, mod.moduleKey)}
                      description={labels.openModule}
                      icon={icon}
                      tone="purple"
                      statusLabel={state.label}
                      statusTone={state.tone}
                    />
                  );
                }
                return (
                  <AppIconStatusCard
                    key={mod.moduleKey}
                    title={moduleTitle(labels, mod.moduleKey)}
                    description={state.label}
                    icon={icon}
                    tone="slate"
                    statusLabel={state.label}
                    statusTone={state.tone}
                  />
                );
              })}
            </div>
          )}
        </section>

        <section className="space-y-3" aria-labelledby="workspace-tickets-heading">
          <div>
            <h2 id="workspace-tickets-heading" className="text-lg font-semibold text-[var(--app-text)]">
              {labels.ticketsTitle}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-[var(--app-text-muted)]">
              {labels.ticketsDescription}
            </p>
          </div>
          {bundle.tickets.availability !== "available" ? (
            <p className={`${AppVisualClasses.card} text-sm text-[var(--app-text-muted)]`}>
              {bundle.tickets.messageKey === "forbidden"
                ? labels.ticketsForbidden
                : bundle.tickets.messageKey === "error"
                  ? labels.ticketsError
                  : labels.ticketsUnavailable}
            </p>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <KpiTile
                  label={labels.ticketOpen}
                  value={displayCount(bundle.tickets.counts.open, labels.notAvailable)}
                />
                <KpiTile
                  label={labels.ticketWaitingAipify}
                  value={displayCount(bundle.tickets.counts.waitingAipify, labels.notAvailable)}
                />
                <KpiTile
                  label={labels.ticketWaitingCustomer}
                  value={displayCount(bundle.tickets.counts.waitingCustomer, labels.notAvailable)}
                />
                <KpiTile
                  label={labels.ticketResolved}
                  value={displayCount(bundle.tickets.counts.resolved, labels.notAvailable)}
                />
              </div>
              {ticketsPartial ? (
                <p className="text-xs leading-relaxed text-[var(--app-text-muted)]">
                  {labels.ticketsCountsPartial}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-2">
                <Link href={bundle.tickets.listHref} className={BTN_PRIMARY}>
                  {labels.viewAllTickets}
                </Link>
                {bundle.tickets.createEnabled && bundle.tickets.createHref ? (
                  <Link href={bundle.tickets.createHref} className={BTN_SECONDARY}>
                    {labels.createTicket}
                  </Link>
                ) : null}
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-[var(--app-text)]">{labels.recentTickets}</h3>
                {bundle.tickets.recent.length === 0 ? (
                  <p className="text-sm text-[var(--app-text-muted)]">{labels.noRecentTickets}</p>
                ) : (
                  <ul className="space-y-2">
                    {bundle.tickets.recent.map((ticket) => (
                      <li key={ticket.id}>
                        <Link
                          href={ticket.href}
                          className={`${AppVisualClasses.card} flex items-center justify-between gap-3 transition hover:bg-[var(--app-soft-surface)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]`}
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium text-[var(--app-text)]">
                              {ticket.reference} · {ticket.title}
                            </span>
                            <span className="text-xs text-[var(--app-text-muted)]">
                              {ticketStatusLabel(labels, ticket.status)}
                            </span>
                          </span>
                          <span className="shrink-0 text-xs text-[var(--app-text-muted)]">
                            {formatPlatformDateTimeClock(ticket.updatedAt, {
                              locale,
                              emptyFallback: labels.notAvailable,
                              invalidFallback: labels.notAvailable,
                            })}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </section>

        {showPartner ? (
          <section className="space-y-3" aria-labelledby="workspace-partner-heading">
            <div>
              <h2 id="workspace-partner-heading" className="text-lg font-semibold text-[var(--app-text)]">
                {labels.partnerTitle}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-[var(--app-text-muted)]">
                {labels.partnerDescription}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <KpiTile
                label={labels.partnerSales}
                value={displayCount(bundle.partner.kpis.registeredSales, labels.notAvailable)}
              />
              <KpiTile
                label={labels.partnerPending}
                value={displayCount(bundle.partner.kpis.pendingCommission, labels.notAvailable)}
              />
              <KpiTile
                label={labels.partnerEarned}
                value={displayCount(bundle.partner.kpis.earnedCommission, labels.notAvailable)}
              />
              <KpiTile
                label={labels.partnerPayable}
                value={displayCount(bundle.partner.kpis.payableCommission, labels.notAvailable)}
              />
            </div>
            {bundle.partner.partnerHref ? (
              <Link href={bundle.partner.partnerHref} className={BTN_PRIMARY}>
                {labels.openPartner}
              </Link>
            ) : null}
          </section>
        ) : null}
      </div>
    </AppContentWidth>
  );
}
