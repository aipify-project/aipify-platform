"use client";

import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  BookOpen,
  ClipboardList,
  LayoutDashboard,
  ListChecks,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppErrorState, AppLoadingState, PriorityRecommendationCard } from "@/components/app/design";
import { ExecutiveMetricCard } from "@/components/app/design/ExecutiveMetricCard";
import { SemanticBadge } from "@/components/ui/semantic-badge";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import {
  getHealthPresentation,
  getSeverityPresentation,
  getWorkflowStatePresentation,
} from "@/lib/design/semantic-status-system";
import { formatDateTime } from "@/lib/i18n/format-date";
import type { FollowUpMilestoneTab } from "@/lib/app-portal/customer-success/config";
import {
  CUSTOMER_SUCCESS_STATUSES,
  CUSTOMER_SUCCESS_SUPPORT_HREF,
  RECOMMENDATION_PRIORITIES,
  type CustomerSuccessLabels,
  type CustomerSuccessOverview,
  parseCustomerSuccessOverview,
} from "@/lib/app-portal/customer-success";
import {
  isFollowUpOverdue,
  isValidSortOption,
  mapFollowUpStatusToWorkflow,
  mapPlanStatusToLifecycle,
  mapPlanStatusToSeverity,
  mapPlanStatusToWorkflow,
  mapRecommendationPriorityToSeverity,
  mapRiskImpactToSeverity,
  resolveOverviewHealthState,
  resolveRecommendationHref,
} from "@/lib/app-portal/customer-success/presentation";
import type { AppOrganizationContextState } from "@/lib/tenant/resolve-app-organization-context";

type Props = { labels: CustomerSuccessLabels; locale: string };

const SECTION_ICONS: Record<string, LucideIcon> = {
  overview: LayoutDashboard,
  nextAction: Target,
  plans: ClipboardList,
  followUps: ListChecks,
  outcomes: TrendingUp,
  risks: AlertTriangle,
  activity: Activity,
  understanding: BookOpen,
};

function SectionHeading({ id, title }: { id: string; title: string }) {
  const Icon = SECTION_ICONS[id] ?? LayoutDashboard;
  return (
    <div className="flex items-center gap-3">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-700 ring-1 ring-violet-100"
        aria-hidden="true"
      >
        <Icon className="h-[18px] w-[18px] stroke-[1.75]" />
      </span>
      <h2 className={AppPremiumShell.sectionTitle}>{title}</h2>
    </div>
  );
}

const ACCESS_MESSAGES: Record<
  AppOrganizationContextState,
  keyof Pick<
    CustomerSuccessLabels,
    | "accessDenied"
    | "organizationMissing"
    | "subscriptionRequired"
    | "permissionMissing"
    | "entitlementMissing"
  >
> = {
  ready: "accessDenied",
  unauthenticated: "accessDenied",
  user_not_provisioned: "organizationMissing",
  organization_missing: "organizationMissing",
  membership_missing: "organizationMissing",
  subscription_inactive: "subscriptionRequired",
  license_inactive: "subscriptionRequired",
  entitlement_missing: "entitlementMissing",
  permission_missing: "permissionMissing",
  access_denied: "permissionMissing",
  database_execution_error: "accessDenied",
};

export function CustomerSuccessPanel({ labels, locale }: Props) {
  const [data, setData] = useState<CustomerSuccessOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [accessState, setAccessState] = useState<AppOrganizationContextState | null>(null);
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [successStatus, setSuccessStatus] = useState("");
  const [owner, setOwner] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [search, setSearch] = useState("");
  const [followTab, setFollowTab] = useState<FollowUpMilestoneTab>("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (priority) params.set("priority", priority);
    if (successStatus) params.set("success_status", successStatus);
    if (owner) params.set("owner", owner);
    if (dueDate) params.set("due_date", dueDate);
    if (sortBy && isValidSortOption(sortBy)) params.set("sort_by", sortBy);
    if (search.trim()) params.set("search", search.trim());
    const res = await fetch(`/api/aipify/customer-success?${params}`);
    if (res.ok) {
      setData(parseCustomerSuccessOverview(await res.json()));
      setAccessState(null);
    } else {
      const body = (await res.json()) as { error?: string; access_state?: AppOrganizationContextState };
      setAccessState(body.access_state ?? "access_denied");
      setError(body.error ?? labels.accessDenied);
      setData(null);
    }
    setLoading(false);
  }, [category, priority, successStatus, owner, dueDate, sortBy, search, labels.accessDenied]);

  useEffect(() => {
    void load();
  }, [load]);

  const healthState = resolveOverviewHealthState(
    data?.health_score ?? data?.adoption_score ?? 0,
    data?.health_state
  );

  const nextAction = data?.recommended_next_action;
  const nextActionCopy = nextAction
    ? labels.recommendations[nextAction.key as keyof typeof labels.recommendations]
    : null;

  const followUps = data?.follow_ups ?? [];
  const milestones = data?.milestones_achieved ?? [];

  const filteredFollowMilestone = useMemo(() => {
    if (followTab === "follow_ups") return { followUps, milestones: [] };
    if (followTab === "milestones") return { followUps: [], milestones };
    if (followTab === "overdue") {
      return {
        followUps: followUps.filter((f) => isFollowUpOverdue(f.due_at, f.status)),
        milestones: [],
      };
    }
    if (followTab === "completed") {
      return {
        followUps: followUps.filter((f) => f.status === "completed"),
        milestones,
      };
    }
    return { followUps, milestones };
  }, [followTab, followUps, milestones]);

  const sortedPlans = useMemo(() => {
    const plans = [...(data?.success_plans ?? [])];
    if (sortBy === "title") return plans.sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === "progress") return plans.sort((a, b) => b.progress_percent - a.progress_percent);
    if (sortBy === "priority") {
      const order: Record<string, number> = { high_impact: 0, important: 1, recommended: 2, opportunity: 3 };
      return plans.sort((a, b) => (order[a.priority] ?? 9) - (order[b.priority] ?? 9));
    }
    if (sortBy === "due_date") {
      return plans.sort((a, b) => {
        if (!a.target_date) return 1;
        if (!b.target_date) return -1;
        return a.target_date.localeCompare(b.target_date);
      });
    }
    return plans;
  }, [data?.success_plans, sortBy]);

  if (loading) {
    return (
      <div className={AppPremiumShell.page}>
        <AppLoadingState message={labels.loading} />
      </div>
    );
  }

  if (error && !data?.found) {
    const messageKey = accessState ? ACCESS_MESSAGES[accessState] : "accessDenied";
    return (
      <div className={`${AppPremiumShell.page} ${AppPremiumShell.sectionGap}`}>
        <AppErrorState
          title={labels.errorTitle}
          description={labels[messageKey]}
          onRetry={() => void load()}
          retryLabel={labels.retry}
          returnHref={CUSTOMER_SUCCESS_SUPPORT_HREF}
          returnLabel={labels.backToSupport}
        />
      </div>
    );
  }

  if (!data?.found) {
    return (
      <div className={`${AppPremiumShell.page} ${AppPremiumShell.sectionGap}`}>
        <AppErrorState
          title={labels.errorTitle}
          description={labels.errorBody}
          onRetry={() => void load()}
          retryLabel={labels.retry}
          returnHref={CUSTOMER_SUCCESS_SUPPORT_HREF}
          returnLabel={labels.backToSupport}
        />
      </div>
    );
  }

  const adoptionSignals = data.adoption_signals ?? [];
  const activeRisks = data.active_risks ?? [];
  const outcomes = data.outcomes ?? [];
  const timeline = data.timeline ?? [];
  const showFollowSection =
    filteredFollowMilestone.followUps.length > 0 || filteredFollowMilestone.milestones.length > 0;

  return (
    <div className={`${AppPremiumShell.page} ${AppPremiumShell.sectionGap}`}>
      <header className="space-y-4 border-b border-aipify-border pb-6">
        <nav className="text-sm text-aipify-text-muted" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li>{labels.breadcrumbSupport}</li>
            <li aria-hidden="true">→</li>
            <li className="font-medium text-aipify-text">{labels.breadcrumbCustomerSuccess}</li>
          </ol>
        </nav>
        <Link
          href={CUSTOMER_SUCCESS_SUPPORT_HREF}
          className={`inline-flex text-sm font-medium text-aipify-companion hover:text-aipify-companion-hover ${AppPremiumShell.focusRing}`}
        >
          ← {labels.backToSupport}
        </Link>
        <div className="space-y-2">
          <p className={AppPremiumShell.eyebrow}>{labels.eyebrow}</p>
          <h1 className={AppPremiumShell.pageTitle}>{labels.title}</h1>
          <p className={AppPremiumShell.pageDescription}>{labels.subtitle}</p>
        </div>
      </header>

      <section className="space-y-4">
        <SectionHeading id="overview" title={labels.sections.overview} />
        <p className={AppPremiumShell.sectionSubtitle}>{labels.overview.organizationOverview}</p>
        <div className="grid gap-4 lg:grid-cols-4">
          <ExecutiveMetricCard
            featured
            icon={<LayoutDashboard className="h-5 w-5" aria-hidden="true" />}
            label={labels.overview.healthScore}
            value={data.health_score ?? data.adoption_score ?? 0}
            description={labels.overview.advisory}
            semanticType="health"
            semanticValue={healthState}
            statusLabel={labels.healthStates[healthState]}
            a11yLabel={`${labels.overview.healthStatus}: ${labels.healthStates[healthState]}`}
          />
          <ExecutiveMetricCard
            icon={<TrendingUp className="h-5 w-5" aria-hidden="true" />}
            label={labels.overview.adoptionScore}
            value={data.adoption_score ?? 0}
            description={labels.scores.featureAdoption}
            semanticType="health"
            semanticValue={resolveOverviewHealthState(data.adoption_score ?? 0)}
            statusLabel={labels.healthStates[resolveOverviewHealthState(data.adoption_score ?? 0)]}
          />
          <ExecutiveMetricCard
            icon={<Target className="h-5 w-5" aria-hidden="true" />}
            label={labels.overview.utilizationScore}
            value={data.utilization_score ?? 0}
            description={labels.scores.operationalMaturity}
            semanticType="health"
            semanticValue={resolveOverviewHealthState(data.utilization_score ?? 0)}
            statusLabel={labels.healthStates[resolveOverviewHealthState(data.utilization_score ?? 0)]}
          />
          <ExecutiveMetricCard
            icon={<Activity className="h-5 w-5" aria-hidden="true" />}
            label={labels.overview.engagementScore}
            value={data.engagement_score ?? 0}
            description={labels.scores.userEngagement}
            semanticType="health"
            semanticValue={resolveOverviewHealthState(data.engagement_score ?? 0)}
            statusLabel={labels.healthStates[resolveOverviewHealthState(data.engagement_score ?? 0)]}
          />
        </div>
        {data.last_updated_at ? (
          <p className="text-xs text-aipify-text-muted">
            {labels.overview.lastUpdated}: {formatDateTime(data.last_updated_at, locale)}
          </p>
        ) : null}
      </section>

      {nextAction && nextActionCopy ? (
        <section className="space-y-3">
          <SectionHeading id="nextAction" title={labels.sections.nextAction} />
          <PriorityRecommendationCard
            category={labels.categories[nextAction.category as keyof typeof labels.categories] ?? nextAction.category}
            title={nextActionCopy.title}
            description={nextActionCopy.reason}
            severityValue={mapRecommendationPriorityToSeverity(nextAction.priority)}
            severityLabel={labels.priorities[nextAction.priority as keyof typeof labels.priorities] ?? nextAction.priority}
            workflowValue="open"
            workflowLabel={labels.followUpTabs.followUps}
            actionHref={resolveRecommendationHref(nextAction.key)}
            actionLabel={nextActionCopy.action}
          />
        </section>
      ) : null}

      <section className="space-y-3 rounded-2xl border border-aipify-border bg-aipify-surface p-4">
        <div className="flex flex-wrap gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={labels.filters.search}
            className="min-w-[12rem] flex-1 rounded-lg border border-aipify-border px-3 py-2 text-sm"
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-aipify-border px-3 py-2 text-sm">
            <option value="">{labels.filters.category}</option>
            {Object.entries(labels.categories).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="rounded-lg border border-aipify-border px-3 py-2 text-sm">
            <option value="">{labels.filters.priority}</option>
            {RECOMMENDATION_PRIORITIES.map((p) => (
              <option key={p} value={p}>{labels.priorities[p]}</option>
            ))}
          </select>
          <select value={successStatus} onChange={(e) => setSuccessStatus(e.target.value)} className="rounded-lg border border-aipify-border px-3 py-2 text-sm">
            <option value="">{labels.filters.successStatus}</option>
            {CUSTOMER_SUCCESS_STATUSES.map((s) => (
              <option key={s} value={s}>{labels.statuses[s]}</option>
            ))}
          </select>
          <select value={owner} onChange={(e) => setOwner(e.target.value)} className="rounded-lg border border-aipify-border px-3 py-2 text-sm">
            <option value="">{labels.filters.owner}</option>
            {(data.owners ?? []).map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            aria-label={labels.filters.dueDate}
            className="rounded-lg border border-aipify-border px-3 py-2 text-sm"
          />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded-lg border border-aipify-border px-3 py-2 text-sm">
            <option value="">{labels.filters.sortBy}</option>
            <option value="due_date">{labels.filters.sortDueDate}</option>
            <option value="priority">{labels.filters.sortPriority}</option>
            <option value="title">{labels.filters.sortTitle}</option>
            <option value="progress">{labels.filters.sortProgress}</option>
            <option value="updated">{labels.filters.sortUpdated}</option>
          </select>
        </div>
      </section>

      {sortedPlans.length > 0 ? (
        <section className="space-y-4">
          <SectionHeading id="plans" title={labels.sections.successPlans} />
          <div className="grid gap-4 lg:grid-cols-2">
            {sortedPlans.map((plan) => {
              const workflow = getWorkflowStatePresentation(mapPlanStatusToWorkflow(plan.status));
              const severity = mapPlanStatusToSeverity(plan.status);
              const lifecycle = mapPlanStatusToLifecycle(plan.status);
              return (
                <article
                  key={plan.id}
                  className={`${AppPremiumShell.elevatedCard} border-l-4 p-5 ${workflow.borderClassName} ${workflow.backgroundClassName}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="font-semibold text-aipify-text">{plan.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {severity ? (
                        <SemanticBadge type="severity" value={severity} label={labels.planStates[plan.status as keyof typeof labels.planStates] ?? plan.status} />
                      ) : null}
                      <SemanticBadge
                        type={lifecycle ? "lifecycle" : "workflow"}
                        value={lifecycle ?? mapPlanStatusToWorkflow(plan.status)}
                        label={labels.planStates[plan.status as keyof typeof labels.planStates] ?? plan.status}
                      />
                    </div>
                  </div>
                  {plan.goal_summary ? (
                    <p className="mt-2 text-sm text-aipify-text-secondary">{plan.goal_summary}</p>
                  ) : null}
                  <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-aipify-text-muted">{labels.card.owner}</dt>
                      <dd className="font-medium text-aipify-text">{plan.owner_label}</dd>
                    </div>
                    <div>
                      <dt className="text-aipify-text-muted">{labels.card.progress}</dt>
                      <dd className="font-medium text-aipify-text">{plan.progress_percent}%</dd>
                    </div>
                    {plan.target_date ? (
                      <div>
                        <dt className="text-aipify-text-muted">{labels.card.targetDate}</dt>
                        <dd className="font-medium text-aipify-text">{plan.target_date}</dd>
                      </div>
                    ) : null}
                  </dl>
                  <div className="mt-3 h-2 rounded-full bg-aipify-surface-muted">
                    <div
                      className="h-2 rounded-full bg-aipify-companion"
                      style={{ width: `${Math.min(100, plan.progress_percent)}%` }}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      {showFollowSection ? (
        <section className="space-y-4">
          <SectionHeading id="followUps" title={labels.sections.followUpsMilestones} />
          <div className="flex flex-wrap gap-2">
            {(["all", "follow_ups", "milestones", "overdue", "completed"] as FollowUpMilestoneTab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFollowTab(tab)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  followTab === tab
                    ? "bg-aipify-companion text-white"
                    : "bg-aipify-surface-muted text-aipify-text-secondary hover:bg-aipify-surface"
                }`}
              >
                {labels.followUpTabs[tab === "follow_ups" ? "followUps" : tab === "milestones" ? "milestones" : tab === "overdue" ? "overdue" : tab === "completed" ? "completed" : "all"]}
              </button>
            ))}
          </div>
          <ul className="space-y-3">
            {filteredFollowMilestone.followUps.map((item) => {
              const workflow = getWorkflowStatePresentation(mapFollowUpStatusToWorkflow(item.status));
              const overdue = isFollowUpOverdue(item.due_at, item.status);
              return (
                <li
                  key={item.id}
                  className={`${AppPremiumShell.elevatedCard} border-l-4 p-4 ${workflow.borderClassName}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-aipify-text">{item.title}</p>
                      {item.summary ? <p className="mt-1 text-sm text-aipify-text-secondary">{item.summary}</p> : null}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {overdue ? <SemanticBadge type="workflow" value="overdue" label={labels.followUpTabs.overdue} /> : null}
                      <SemanticBadge type="workflow" value={mapFollowUpStatusToWorkflow(item.status)} label={item.status} />
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-aipify-text-muted">
                    {labels.card.owner}: {item.owner_label}
                    {item.due_at ? ` · ${formatDateTime(item.due_at, locale)}` : ""}
                  </p>
                  {item.href ? (
                    <Link href={item.href} className="mt-2 inline-flex text-sm font-medium text-aipify-companion hover:underline">
                      {labels.sections.followUpsMilestones}
                    </Link>
                  ) : null}
                </li>
              );
            })}
            {filteredFollowMilestone.milestones.map((m) => (
              <li key={m.key} className={`${AppPremiumShell.elevatedCard} border-l-4 border-l-emerald-400 p-4 bg-emerald-50/20`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-aipify-text">{m.title}</p>
                  <SemanticBadge type="workflow" value="completed" label={labels.followUpTabs.completed} />
                </div>
                <time className="mt-1 text-xs text-aipify-text-muted" dateTime={m.achieved_at}>
                  {formatDateTime(m.achieved_at, locale)}
                </time>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {outcomes.length > 0 ? (
        <section className="space-y-4">
          <SectionHeading id="outcomes" title={labels.sections.outcomes} />
          <div className="grid gap-4 sm:grid-cols-2">
            {outcomes.map((o) => {
              const health = getHealthPresentation(resolveOverviewHealthState(o.progress_percent));
              return (
                <article key={o.id} className={`${AppPremiumShell.elevatedCard} border-l-4 p-4 ${health.borderClassName}`}>
                  <h3 className="font-semibold text-aipify-text">{o.title}</h3>
                  <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-aipify-text-muted">{labels.card.target}</dt>
                      <dd>{o.target_value}</dd>
                    </div>
                    <div>
                      <dt className="text-aipify-text-muted">{labels.card.current}</dt>
                      <dd>{o.current_value}</dd>
                    </div>
                  </dl>
                  <p className="mt-2 text-sm font-medium text-aipify-text">{labels.card.progress}: {o.progress_percent}%</p>
                  <div className="mt-2 h-2 rounded-full bg-aipify-surface-muted">
                    <div className="h-2 rounded-full bg-aipify-companion" style={{ width: `${o.progress_percent}%` }} />
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      {(activeRisks.length > 0 || adoptionSignals.length > 0) ? (
        <section className="space-y-6">
          <SectionHeading id="risks" title={labels.sections.risksAdoption} />
          {activeRisks.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-aipify-text-secondary">{labels.sections.activeRisks}</h3>
              <ul className="space-y-3">
                {activeRisks.map((risk) => {
                  const severity = mapRiskImpactToSeverity(risk.impact);
                  const presentation = getSeverityPresentation(severity);
                  return (
                    <li
                      key={risk.id}
                      className={`${AppPremiumShell.elevatedCard} border-l-4 p-4 ${presentation.borderClassName} ${presentation.backgroundClassName}`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <p className="font-medium text-aipify-text">{risk.title}</p>
                        <SemanticBadge type="severity" value={severity} label={risk.impact} />
                      </div>
                      {risk.description ? <p className="mt-2 text-sm text-aipify-text-secondary">{risk.description}</p> : null}
                      {risk.href ? (
                        <Link href={risk.href} className="mt-2 inline-flex text-sm font-medium text-aipify-companion hover:underline">
                          {labels.sections.activeRisks}
                        </Link>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
          {adoptionSignals.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-aipify-text-secondary">{labels.sections.adoptionSignals}</h3>
              <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {adoptionSignals.map((signal) => (
                  <div key={signal.key} className={`${AppPremiumShell.elevatedCard} p-4`}>
                    <dt className="text-xs font-medium text-aipify-text-muted">
                      {labels.adoptionSignals[signal.label_key as keyof typeof labels.adoptionSignals] ?? signal.label_key}
                    </dt>
                    <dd className="mt-1 text-2xl font-semibold text-aipify-text">
                      {signal.value}{signal.unit === "percent" ? "%" : ""}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </section>
      ) : null}

      {timeline.length > 0 ? (
        <section className="space-y-4">
          <SectionHeading id="activity" title={labels.sections.recentActivity} />
          <ul className="space-y-3">
            {timeline.slice(0, 12).map((event) => (
              <li key={event.id} className={`${AppPremiumShell.elevatedCard} p-4`}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="text-sm text-aipify-text">{event.description || event.title}</p>
                  <time className="text-xs text-aipify-text-muted" dateTime={event.created_at}>
                    {formatDateTime(event.created_at, locale)}
                  </time>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="space-y-4">
        <SectionHeading id="understanding" title={labels.sections.understanding} />
        <dl className="grid gap-4 lg:grid-cols-2">
          {(
            [
              ["q1", "a1"],
              ["q2", "a2"],
              ["q3", "a3"],
              ["q4", "a4"],
            ] as const
          ).map(([qk, ak]) => (
            <div key={qk} className={`${AppPremiumShell.elevatedCard} p-5`}>
              <dt className="font-semibold text-aipify-text">{labels.understanding[qk]}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{labels.understanding[ak]}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
