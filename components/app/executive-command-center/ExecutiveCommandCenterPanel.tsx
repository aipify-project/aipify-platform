"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  AppEmptyState,
  AppErrorState,
  AppLoadingState,
  AppSectionHeader,
  CompanionInsightBanner,
  ExecutiveMetricCard,
  PriorityRecommendationCard,
} from "@/components/app/design";
import { AipifyStatusBadge } from "@/components/ui/aipify-status-badge";
import type { AipifyStatusKind } from "@/lib/design/status-system";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import {
  parseExecutiveCommandCenter,
  type ExecutiveCommandCenter,
} from "@/lib/executive-command-center-engine/parse";
import type { Ecc590Section } from "@/lib/executive-command-center-engine/config";
import { ecc590SectionToRpc } from "@/lib/executive-command-center-engine/config";
import type { buildExecutiveCommandCenterLabels } from "@/lib/executive-command-center-engine/labels";
import { EccTabIcons } from "./ecc-tab-icons";
import { useExecutiveCommandCenterRefresh } from "./ExecutiveCommandCenterRefreshContext";

type Labels = ReturnType<typeof buildExecutiveCommandCenterLabels>;

function priorityLabel(labels: Labels, priority: unknown): string {
  const key = String(priority ?? "information") as keyof Labels["priority"];
  return labels.priority[key] ?? String(priority);
}

function priorityToStatusKind(priority: unknown): AipifyStatusKind {
  const value = String(priority ?? "information");
  if (value === "critical") return "not_allowed";
  if (value === "urgent" || value === "attention") return "needs_attention";
  return "information";
}

function healthScoreStatus(score: number, labels: Labels): { statusKind: AipifyStatusKind; statusLabel: string } {
  if (score >= 80) return { statusKind: "completed", statusLabel: labels.premium.metrics.healthStatusGood };
  if (score >= 60) return { statusKind: "information", statusLabel: labels.premium.metrics.healthStatusModerate };
  return { statusKind: "needs_attention", statusLabel: labels.premium.metrics.healthStatusLow };
}

function countStatus(count: number, labels: Labels): { statusKind: AipifyStatusKind; statusLabel: string } {
  return count > 0
    ? { statusKind: "needs_attention", statusLabel: labels.premium.metrics.countActive }
    : { statusKind: "completed", statusLabel: labels.premium.metrics.countNone };
}

function PremiumItemCard({
  title,
  summary,
  badge,
  extra,
}: {
  title: string;
  summary?: string;
  badge?: string;
  extra?: React.ReactNode;
}) {
  return (
    <article className={`${AppPremiumShell.elevatedCard} ${AppPremiumShell.elevatedCardHover} p-5`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-aipify-text">{title}</h3>
        {badge ? (
          <span className="rounded-full bg-aipify-surface-muted px-2.5 py-0.5 text-xs font-medium capitalize text-aipify-text-secondary">
            {badge.replace(/_/g, " ")}
          </span>
        ) : null}
      </div>
      {summary ? <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{summary}</p> : null}
      {extra}
    </article>
  );
}

function resolveAccessStateContent(
  accessState: string | undefined,
  labels: Labels
): { title: string; description: string; statusKind: AipifyStatusKind; variant: "error" | "empty" } {
  switch (accessState) {
    case "permission_missing":
    case "access_denied":
      return { ...labels.premium.access.permissionMissing, statusKind: "not_allowed", variant: "error" };
    case "entitlement_missing":
      return { ...labels.premium.access.entitlementMissing, statusKind: "restricted", variant: "error" };
    case "subscription_inactive":
    case "license_inactive":
    case "plan_required":
      return { ...labels.premium.access.planRequired, statusKind: "restricted", variant: "error" };
    case "organization_missing":
    case "membership_missing":
    case "user_not_provisioned":
    case "organization_context_missing":
      return {
        ...labels.premium.access.organizationContextMissing,
        statusKind: "needs_attention",
        variant: "error",
      };
    case "activation_in_progress":
      return { ...labels.premium.access.activationInProgress, statusKind: "waiting", variant: "empty" };
    default:
      return { ...labels.premium.access.generic, statusKind: "needs_attention", variant: "error" };
  }
}

export function ExecutiveCommandCenterPanel({
  labels,
  activeSection,
}: {
  labels: Labels;
  activeSection: Ecc590Section;
}) {
  const [center, setCenter] = useState<ExecutiveCommandCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const { registerRefreshHandler } = useExecutiveCommandCenterRefresh();

  const load = useCallback(async () => {
    setLoading(true);
    const rpcSection = ecc590SectionToRpc(activeSection);
    const res = await fetch(`/api/executive-command-center/center?section=${rpcSection}`);
    const json = await res.json().catch(() => ({}));
    setCenter(parseExecutiveCommandCenter(json));
    setLoading(false);
  }, [activeSection]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    registerRefreshHandler(load);
    return () => registerRefreshHandler(null);
  }, [load, registerRefreshHandler]);

  if (loading && !center) {
    return <AppLoadingState message={labels.loading} />;
  }

  if (!center?.found) {
    const access = resolveAccessStateContent(center?.access_state, labels);
    if (access.variant === "empty") {
      return (
        <AppEmptyState
          title={access.title}
          description={access.description}
          actionHref="/app"
          actionLabel={labels.premium.returnToDashboard}
        />
      );
    }
    return (
      <AppErrorState
        title={access.title}
        description={center?.error ?? access.description}
        statusKind={access.statusKind}
        statusLabel={access.title}
        onRetry={() => void load()}
        retryLabel={labels.premium.retry}
        returnHref="/app"
        returnLabel={labels.premium.returnToDashboard}
      />
    );
  }

  const stats = center.stats ?? {};
  const riskAlerts = (center.alerts ?? []).filter((a) =>
    ["customer_risk", "revenue_decline", "security", "compliance"].includes(String(a.alert_type))
  );
  const approvalActions = (center.actions ?? []).filter((a) => String(a.action_type) === "approval");
  const allActions = center.actions ?? [];
  const healthScore = center.overall_health_score ?? 0;
  const healthStatus = healthScoreStatus(healthScore, labels);

  const overviewMetrics =
    activeSection === "overview" || activeSection === "performance" ? (
      <section
        aria-label={labels.overallHealthScore}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <ExecutiveMetricCard
          featured
          icon={EccTabIcons.health}
          label={labels.overallHealthScore}
          value={healthScore}
          description={labels.premium.metrics.healthDescription}
          statusKind={healthStatus.statusKind}
          statusLabel={healthStatus.statusLabel}
        />
        <ExecutiveMetricCard
          icon={EccTabIcons.history}
          label={labels.stats.sinceLastLoginItems}
          value={stats.since_last_login_items ?? 0}
          description={labels.premium.metrics.sinceLastLoginDescription}
          {...countStatus(Number(stats.since_last_login_items ?? 0), labels)}
        />
        <ExecutiveMetricCard
          icon={EccTabIcons.alerts}
          label={labels.stats.openAlerts}
          value={stats.open_alerts ?? 0}
          description={labels.premium.metrics.openAlertsDescription}
          {...countStatus(Number(stats.open_alerts ?? 0), labels)}
        />
        <ExecutiveMetricCard
          icon={EccTabIcons.action}
          label={labels.stats.pendingActions}
          value={stats.pending_actions ?? 0}
          description={labels.premium.metrics.pendingActionsDescription}
          {...countStatus(Number(stats.pending_actions ?? 0), labels)}
        />
        <ExecutiveMetricCard
          icon={EccTabIcons.critical}
          label={labels.stats.criticalItems}
          value={stats.critical_items ?? 0}
          description={labels.premium.metrics.criticalItemsDescription}
          {...countStatus(Number(stats.critical_items ?? 0), labels)}
        />
      </section>
    ) : null;

  const needsAttentionSection =
    activeSection === "overview" && (center.companion_recommendations?.length ?? 0) > 0 ? (
      <section aria-labelledby="ecc-needs-attention" className="space-y-4">
        <AppSectionHeader
          title={labels.premium.needsAttention}
          subtitle={labels.premium.needsAttentionSubtitle}
        />
        <div className="grid gap-4 lg:grid-cols-2">
          {(center.companion_recommendations ?? []).map((rec, i) => {
            const priority = rec.priority ?? "attention";
            return (
              <PriorityRecommendationCard
                key={i}
                category={labels.premium.recommendationCategory}
                title={String(rec.alert_title ?? labels.companionRecommendations)}
                description={String(rec.recommendation ?? "")}
                statusKind={priorityToStatusKind(priority)}
                statusLabel={priorityLabel(labels, priority)}
              />
            );
          })}
        </div>
      </section>
    ) : null;

  return (
    <div className={AppPremiumShell.sectionGap}>
      <AppSectionHeader
        title={activeSection === "overview" ? labels.premium.todaysOverview : labels.sections[activeSection]}
        subtitle={center.privacy_note ? labels.privacyNote : undefined}
        action={
          center.privacy_note ? (
            <p className="max-w-md text-xs leading-relaxed text-aipify-text-muted">{center.privacy_note}</p>
          ) : null
        }
      />

      {center.principle ? (
        <CompanionInsightBanner principle={center.principle} label={labels.premium.companionInsight} />
      ) : null}

      {activeSection === "overview" ? (
        <div className="flex flex-col-reverse gap-8 lg:flex-col">
          {needsAttentionSection}
          {overviewMetrics}
        </div>
      ) : (
        overviewMetrics
      )}

      {activeSection === "overview" && (center.business_packs?.length ?? 0) > 0 && (
        <section className="space-y-4">
          <AppSectionHeader title={labels.businessPackSignals} />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {(center.business_packs ?? []).map((pack) => (
              <PremiumItemCard
                key={String(pack.pack_key)}
                title={String(pack.pack_title)}
                summary={String(pack.summary ?? "")}
                badge={`${String(pack.events_count ?? 0)} events · ${String(pack.alerts_count ?? 0)} alerts`}
              />
            ))}
          </div>
        </section>
      )}

      {activeSection === "sinceLastLogin" && (
        <section className="space-y-4">
          <AppSectionHeader title={labels.sinceLastLogin} />
          {(center.since_last_login ?? []).length === 0 ? (
            <p className="text-sm text-aipify-text-secondary">{labels.noRecords}</p>
          ) : (
            <div className="grid gap-4">
              {(center.since_last_login ?? []).map((item) => (
                <PremiumItemCard
                  key={String(item.item_key)}
                  title={`${String(item.item_count ?? 1)} — ${String(item.item_title)}`}
                  summary={String(item.summary ?? "")}
                  badge={priorityLabel(labels, item.priority)}
                />
              ))}
            </div>
          )}
          {(center.timeline ?? []).length > 0 && (
            <>
              <AppSectionHeader title={labels.organizationalTimeline} />
              <div className="grid gap-4">
                {(center.timeline ?? []).map((evt) => (
                  <PremiumItemCard
                    key={String(evt.event_key)}
                    title={String(evt.event_title)}
                    summary={String(evt.summary ?? "")}
                    badge={String(evt.event_type ?? "")}
                    extra={
                      evt.occurred_at ? (
                        <p className="mt-2 text-xs text-aipify-text-muted">{String(evt.occurred_at)}</p>
                      ) : null
                    }
                  />
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {activeSection === "alerts" && (
        <section className="grid gap-4">
          {(center.alerts ?? []).length === 0 ? (
            <AppEmptyState title={labels.noRecords} description={labels.premium.emptySection} />
          ) : (
            (center.alerts ?? []).map((a) => (
              <PremiumItemCard
                key={String(a.alert_key)}
                title={String(a.alert_title)}
                summary={String(a.companion_recommendation || a.summary || "")}
                badge={priorityLabel(labels, a.priority)}
              />
            ))
          )}
        </section>
      )}

      {activeSection === "approvals" && (
        <section className="grid gap-4">
          {approvalActions.length === 0 && allActions.length === 0 ? (
            <AppEmptyState title={labels.noRecords} description={labels.premium.emptySection} />
          ) : (
            (approvalActions.length > 0 ? approvalActions : allActions).map((a) => (
              <PremiumItemCard
                key={String(a.action_key)}
                title={String(a.action_title)}
                summary={String(a.summary ?? "")}
                badge={priorityLabel(labels, a.priority)}
                extra={
                  a.record_href ? (
                    <Link
                      href={String(a.record_href)}
                      className={`mt-4 inline-flex min-h-10 items-center text-sm font-medium text-aipify-companion hover:text-aipify-companion-hover ${AppPremiumShell.focusRing}`}
                    >
                      {labels.premium.openRecord}
                    </Link>
                  ) : null
                }
              />
            ))
          )}
        </section>
      )}

      {activeSection === "risks" && (
        <section className="grid gap-4">
          {riskAlerts.length === 0 && (center.health ?? []).length === 0 ? (
            <AppEmptyState title={labels.noRecords} description={labels.premium.emptySection} />
          ) : (
            <>
              {riskAlerts.map((a) => (
                <PremiumItemCard
                  key={String(a.alert_key)}
                  title={String(a.alert_title)}
                  summary={String(a.companion_recommendation || a.summary || "")}
                  badge={priorityLabel(labels, a.priority)}
                />
              ))}
              {(center.health ?? [])
                .filter((h) => Number(h.health_score) < 80)
                .map((h) => (
                  <PremiumItemCard
                    key={String(h.health_key)}
                    title={String(h.health_title)}
                    summary={String(h.summary ?? "")}
                    badge={`${String(h.health_score ?? 0)} · ${String(h.health_status ?? "")}`}
                  />
                ))}
            </>
          )}
        </section>
      )}

      {activeSection === "opportunities" && (
        <section className="grid gap-4">
          {(center.opportunities ?? []).length === 0 ? (
            <AppEmptyState title={labels.noRecords} description={labels.premium.emptySection} />
          ) : (
            (center.opportunities ?? []).map((o) => (
              <PremiumItemCard
                key={String(o.opportunity_key)}
                title={String(o.opportunity_title)}
                summary={String(o.recommendation || o.summary || "")}
                badge={priorityLabel(labels, o.priority)}
              />
            ))
          )}
        </section>
      )}

      {activeSection === "performance" && (
        <section className="grid gap-4 sm:grid-cols-2">
          {(center.health ?? []).length === 0 ? (
            <AppEmptyState title={labels.noRecords} description={labels.premium.emptySection} />
          ) : (
            (center.health ?? []).map((h) => (
              <PremiumItemCard
                key={String(h.health_key)}
                title={String(h.health_title)}
                summary={String(h.summary ?? "")}
                badge={`${String(h.health_score ?? 0)} · ${String(h.health_status ?? "")}`}
              />
            ))
          )}
        </section>
      )}

      {activeSection === "companionBriefing" && (
        <section className="space-y-6">
          {(center.briefings ?? []).map((b) => (
            <article
              key={String(b.briefing_key)}
              className={`${AppPremiumShell.elevatedCard} border-violet-200/60 p-6`}
            >
              <h3 className="text-lg font-semibold text-aipify-text">{String(b.briefing_title)}</h3>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-aipify-text-muted">
                    {labels.briefing.revenue}
                  </dt>
                  <dd className="mt-1 text-sm text-aipify-text-secondary">{String(b.revenue_summary ?? "")}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-aipify-text-muted">
                    {labels.briefing.customer}
                  </dt>
                  <dd className="mt-1 text-sm text-aipify-text-secondary">{String(b.customer_summary ?? "")}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-aipify-text-muted">
                    {labels.briefing.risk}
                  </dt>
                  <dd className="mt-1 text-sm text-aipify-text-secondary">{String(b.risk_summary ?? "")}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-aipify-text-muted">
                    {labels.briefing.operational}
                  </dt>
                  <dd className="mt-1 text-sm text-aipify-text-secondary">{String(b.operational_summary ?? "")}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-aipify-text-muted">
                    {labels.briefing.growth}
                  </dt>
                  <dd className="mt-1 text-sm text-aipify-text-secondary">{String(b.growth_summary ?? "")}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-aipify-text-muted">
                    {labels.briefing.companion}
                  </dt>
                  <dd className="mt-1 text-sm text-aipify-text-secondary">
                    {String(b.companion_recommendations ?? "")}
                  </dd>
                </div>
              </dl>
            </article>
          ))}

          {(center.board_reports ?? []).length > 0 && (
            <div className="space-y-4">
              <AppSectionHeader title={labels.boardReadyReports} />
              <div className="grid gap-4">
                {(center.board_reports ?? []).map((r) => (
                  <PremiumItemCard
                    key={String(r.report_key)}
                    title={String(r.report_title)}
                    summary={String(r.summary ?? "")}
                    badge={String(r.report_type ?? "")}
                  />
                ))}
              </div>
            </div>
          )}

          {(center.command_prompts ?? []).length > 0 && (
            <div className="space-y-4">
              <AppSectionHeader title={labels.commandMode} />
              <ul className="flex flex-wrap gap-2">
                {(center.command_prompts ?? []).map((prompt) => (
                  <li key={prompt}>
                    <AipifyStatusBadge kind="information" label={prompt} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
