"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AipifyEmptyState } from "@/components/branding";
import AiInsightList from "@/components/platform/AiInsightList";
import CustomerActivityTimeline from "@/components/platform/CustomerActivityTimeline";
import CustomerQuickActions from "@/components/platform/CustomerQuickActions";
import CustomerRecommendationFeed from "@/components/platform/CustomerRecommendationFeed";
import CustomerHealthBadge from "@/components/platform/CustomerHealthBadge";
import SuccessScoreBadge from "@/components/platform/SuccessScoreBadge";
import SelfLearningInsightsPanel from "@/components/platform/SelfLearningInsightsPanel";
import CustomerLicensePanel from "@/components/platform/CustomerLicensePanel";
import CustomerInstallationEnginePanel from "@/components/platform/CustomerInstallationEnginePanel";
import { formatLimitUsage } from "@/lib/platform/license";
import { formatInstallationModuleKeys } from "@/lib/platform/installation-engine";
import { getInstallationHealthStatus } from "@/lib/platform/executive-intelligence";
import InviteTeamMemberModal from "@/components/platform/InviteTeamMemberModal";
import OpportunityBadge from "@/components/platform/OpportunityBadge";
import {
  buildCustomerAiInsightMessages,
  buildWorkspaceRecommendations,
  computeSuccessScore,
  detectOpportunities,
  getCustomerHealthFromDetail,
  getInstallationHealthScore,
  getRolePermissions,
  INTEGRATION_PROVIDERS,
  type QuickActionKey,
} from "@/lib/platform/customer-workspace";
import {
  aiRecommendationsToWorkspace,
  opportunityTypeToSignal,
  parseIntelligenceFoundation,
  type CustomerIntelligenceFoundation,
} from "@/lib/platform/intelligence-foundation";
import { deriveInstallationHealth } from "@/lib/platform/ai-dashboard";
import { formatDate, formatDateTime } from "@/lib/i18n/format-date";
import { createClient } from "@/lib/supabase/client";
import type { CustomerMasterDetail, InvoiceAction, PlatformAutomation } from "@/lib/platform/types";
import StatusBadge from "./StatusBadge";

type TabId =
  | "overview"
  | "users"
  | "support"
  | "automations"
  | "aiInsights"
  | "timeline"
  | "integrations"
  | "domains"
  | "settings";

type CustomerMasterDetailViewProps = {
  customerId: string;
  locale: string;
  labels: {
    back: string;
    commandCenterTitle: string;
    commandCenterSubtitle: string;
    loading: string;
    notFound: string;
    tabs: Record<TabId, string>;
    health: string;
    healthLabels: {
      healthy: string;
      attention: string;
      atRisk: string;
    };
    successScore: string;
    successScoreLabels: Record<string, string>;
    installationHealthLabels: Record<string, string>;
    opportunities: string;
    customerNumber: string;
    customerName: string;
    customerType: string;
    companyNumber: string;
    country: string;
    language: string;
    plan: string;
    subscriptionStatus: string;
    paymentProvider: string;
    ownerEmail: string;
    createdAt: string;
    currentPlan: string;
    trialRemaining: string;
    nextBillingDate: string;
    totalUsers: string;
    totalInstallations: string;
    outstandingInvoices: string;
    name: string;
    email: string;
    role: string;
    status: string;
    lastLogin: string;
    lastActive: string;
    permissions: string;
    inviteTeam: string;
    ownerBadge: string;
    installationId: string;
    installationName: string;
    domain: string;
    systemType: string;
    version: string;
    connectedModules: string;
    installedDate: string;
    lastHealthCheck: string;
    healthScore: string;
    recentErrors: string;
    lastSync: string;
    trialDates: string;
    startDate: string;
    price: string;
    currency: string;
    billingCycle: string;
    invoiceNumber: string;
    invoiceStatus: string;
    issueDate: string;
    dueDate: string;
    amount: string;
    paymentStatus: string;
    kid: string;
    view: string;
    download: string;
    resend: string;
    markPaid: string;
    supportRequests: string;
    automatedActions: string;
    aiRecommendations: string;
    avgResponseTime: string;
    mostUsedModules: string;
    openTickets: string;
    closedTickets: string;
    avgResolutionTime: string;
    lastContact: string;
    assignedAgent: string;
    subject: string;
    category: string;
    priority: string;
    noData: string;
    noErrors: string;
    actionPending: string;
    quickActionsTitle: string;
    quickActions: Record<QuickActionKey, string>;
    recommendationFeed: {
      title: string;
      priority: string;
      recommendedAction: string;
      confidence: string;
      dismiss: string;
      empty: string;
    };
    priorityLabels: Record<string, string>;
    opportunityLabels: Record<string, string>;
    timeline: {
      empty: string;
      filterAll: string;
      expandDetails: string;
      categories: Record<string, string>;
    };
    foundation: {
      emptyOpportunities: string;
    };
    integrations: {
      connectionStatus: string;
      lastSync: string;
      health: string;
      actions: string;
      connected: string;
      pending: string;
      error: string;
      webhooks: string;
      customApi: string;
    };
    automations: {
      empty: string;
      name: string;
      status: string;
      trigger: string;
      lastRun: string;
      nextRun: string;
      executedAt: string;
      duration: string;
      error: string;
      statusLabels: Record<string, string>;
      runStatusLabels: Record<string, string>;
    };
    settings: {
      billingTitle: string;
      subscriptionTitle: string;
      invoicesTitle: string;
    };
    inviteModal: {
      title: string;
      email: string;
      role: string;
      department: string;
      welcomeMessage: string;
      send: string;
      cancel: string;
      success: string;
    };
    invitationStatusLabels: Record<string, string>;
    aiInsightsTitle: string;
    license: {
      title: string;
      plan: string;
      maxDomains: string;
      usedDomains: string;
      maxInstallations: string;
      usedInstallations: string;
      subscriptionStatus: string;
      paymentStatus: string;
      lastLicenseCheck: string;
      failedChecks: string;
      unlimited: string;
      noChecks: string;
      checkResultLabels: Record<string, string>;
      checkTypeLabels: Record<string, string>;
    };
    domainsTab: {
      empty: string;
      domain: string;
      status: string;
      verification: string;
      installation: string;
      addedAt: string;
      lastCheck: string;
      statusLabels: Record<string, string>;
      verificationLabels: Record<string, string>;
    };
    installationEngine: {
      title: string;
      onboardingScore: string;
      installationHealth: string;
      verificationStatus: string;
      healthScans: string;
      moduleStatus: string;
      noData: string;
      healthLabels: Record<string, string>;
      onboardingItems: Record<string, string>;
      statusLabels: Record<string, string>;
      verificationLabels: Record<string, string>;
    };
    selfLearning: {
      title: string;
      environment: string;
      environmentLabels: Record<string, string>;
      stages: {
        detection: string;
        diagnosis: string;
        recommendation: string;
        healing: string;
      };
      learningEvents: {
        title: string;
        empty: string;
        eventType: string;
        category: string;
      };
      patterns: {
        title: string;
        empty: string;
        detections: string;
        successRate: string;
        action: string;
      };
      effectiveness: {
        title: string;
        empty: string;
        presented: string;
        accepted: string;
        acceptanceRate: string;
      };
      selfHealing: {
        title: string;
        empty: string;
        action: string;
        risk: string;
        result: string;
        duration: string;
        pendingApproval: string;
      };
      riskLabels: Record<string, string>;
      resultLabels: Record<string, string>;
      eventTypeLabels: Record<string, string>;
      categoryLabels: Record<string, string>;
    };
    statusLabels: Record<string, string>;
    typeLabels: Record<string, string>;
    planTypeLabels: Record<string, string>;
    providerLabels: Record<string, string>;
    invoiceStatusLabels: Record<string, string>;
    userRoleLabels: Record<string, string>;
    userStatusLabels: Record<string, string>;
    supportCategoryLabels: Record<string, string>;
    seconds: string;
    hours: string;
    days: string;
    pulseLabel: string;
  };
};

const TAB_IDS: TabId[] = [
  "overview",
  "users",
  "support",
  "automations",
  "aiInsights",
  "timeline",
  "integrations",
  "domains",
  "settings",
];

export default function CustomerMasterDetailView({
  customerId,
  locale,
  labels,
}: CustomerMasterDetailViewProps) {
  const [detail, setDetail] = useState<CustomerMasterDetail | null>(null);
  const [intelligence, setIntelligence] = useState<CustomerIntelligenceFoundation>({
    timeline: [],
    ai_recommendations: [],
    success_score: null,
    installation_health: null,
    automation_runs: [],
    opportunity_signals: [],
    self_learning: {
      environment_type: null,
      learning_events: [],
      self_healing_executions: [],
      patterns: [],
      recommendation_effectiveness: [],
    },
  });
  const [automations, setAutomations] = useState<PlatformAutomation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [actingInvoiceId, setActingInvoiceId] = useState<string | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);

  async function loadDetail() {
    const supabase = createClient();
    const [detailResult, autoResult, intelligenceResult] = await Promise.all([
      supabase.rpc("get_platform_customer_master_detail", { p_customer_id: customerId }),
      supabase.rpc("list_platform_automations"),
      supabase.rpc("get_customer_intelligence_foundation", { p_tenant_id: customerId }),
    ]);

    if (detailResult.error || !detailResult.data) {
      setDetail(null);
    } else {
      setDetail(detailResult.data as CustomerMasterDetail);
    }
    setAutomations(
      autoResult.error || !autoResult.data ? [] : (autoResult.data as PlatformAutomation[])
    );
    setIntelligence(
      intelligenceResult.error || !intelligenceResult.data
        ? {
            timeline: [],
            ai_recommendations: [],
            success_score: null,
            installation_health: null,
            automation_runs: [],
            opportunity_signals: [],
            self_learning: {
              environment_type: null,
              learning_events: [],
              self_healing_executions: [],
              patterns: [],
              recommendation_effectiveness: [],
            },
          }
        : parseIntelligenceFoundation(intelligenceResult.data)
    );
    setLoading(false);
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const [detailResult, autoResult, intelligenceResult] = await Promise.all([
        supabase.rpc("get_platform_customer_master_detail", { p_customer_id: customerId }),
        supabase.rpc("list_platform_automations"),
        supabase.rpc("get_customer_intelligence_foundation", { p_tenant_id: customerId }),
      ]);

      if (!cancelled) {
        if (detailResult.error || !detailResult.data) {
          setDetail(null);
        } else {
          setDetail(detailResult.data as CustomerMasterDetail);
        }
        setAutomations(
          autoResult.error || !autoResult.data ? [] : (autoResult.data as PlatformAutomation[])
        );
        setIntelligence(
          intelligenceResult.error || !intelligenceResult.data
            ? {
                timeline: [],
                ai_recommendations: [],
                success_score: null,
                installation_health: null,
                automation_runs: [],
                opportunity_signals: [],
                self_learning: {
                  environment_type: null,
                  learning_events: [],
                  self_healing_executions: [],
                  patterns: [],
                  recommendation_effectiveness: [],
                },
              }
            : parseIntelligenceFoundation(intelligenceResult.data)
        );
        setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [customerId]);

  const ownerEmail = useMemo(() => {
    if (!detail) return "—";
    const owner = detail.users.find((user) => user.is_owner);
    return owner?.email ?? detail.customer.email;
  }, [detail]);

  async function runInvoiceAction(invoiceId: string, action: InvoiceAction) {
    setActingInvoiceId(invoiceId);
    try {
      await fetch(`/api/platform/invoices/${invoiceId}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      await loadDetail();
    } finally {
      setActingInvoiceId(null);
    }
  }

  if (loading) {
    return <p className="text-sm text-gray-500">{labels.loading}</p>;
  }

  if (!detail?.customer) {
    return <p className="text-sm text-gray-500">{labels.notFound}</p>;
  }

  const { customer, payment_profile, subscription, overview, users, installations, invoices, usage, support, activity_log } =
    detail;
  const displayName = customer.company_name ?? customer.full_name ?? labels.customerName;
  const health = getCustomerHealthFromDetail(detail);
  const successScore = intelligence.success_score?.score ?? computeSuccessScore(detail);

  const activeSignals = intelligence.opportunity_signals.filter(
    (signal) => signal.status === "active"
  );
  const opportunities =
    activeSignals.length > 0
      ? activeSignals.map((signal) => {
          const signalKey = opportunityTypeToSignal(signal.type);
          return {
            signal: signalKey,
            label: labels.opportunityLabels[signalKey] ?? signal.type,
          };
        })
      : detectOpportunities(detail);

  const activeRecs = intelligence.ai_recommendations.filter((rec) => rec.status === "active");
  const recommendations =
    activeRecs.length > 0
      ? aiRecommendationsToWorkspace(activeRecs)
      : buildWorkspaceRecommendations(detail);

  async function dismissRecommendation(recommendationId: string) {
    await fetch(`/api/platform/customers/${customerId}/recommendations`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recommendationId }),
    });
    setIntelligence((prev) => ({
      ...prev,
      ai_recommendations: prev.ai_recommendations.map((rec) =>
        rec.id === recommendationId
          ? { ...rec, status: "dismissed" as const, dismissed_at: new Date().toISOString() }
          : rec
      ),
    }));
  }

  const openTickets = support.filter((ticket) => ticket.status === "open" || ticket.status === "escalated");
  const closedTickets = support.filter((ticket) => ticket.status === "closed");
  const avgResolution =
    closedTickets.length > 0
      ? closedTickets.reduce((sum, ticket) => sum + (ticket.resolution_time_hours ?? 0), 0) /
        closedTickets.length
      : null;
  const lastContact = support.reduce<string | null>((latest, ticket) => {
    if (!ticket.last_contact_at) return latest;
    if (!latest || ticket.last_contact_at > latest) return ticket.last_contact_at;
    return latest;
  }, null);
  const assignedAgent =
    openTickets.find((ticket) => ticket.assigned_agent)?.assigned_agent ?? "—";

  const roleOptions = Object.entries(labels.userRoleLabels).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        href="/platform/customers"
        className="text-sm font-semibold text-violet-600 hover:text-violet-700"
      >
        ← {labels.back}
      </Link>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">
              {labels.commandCenterTitle}
            </p>
            <p className="font-mono text-sm font-medium text-violet-600">
              {customer.customer_number}
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {displayName}
            </h1>
            <p className="mt-2 text-sm text-gray-600">{labels.commandCenterSubtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <CustomerHealthBadge health={health} labels={labels.healthLabels} />
            <SuccessScoreBadge score={successScore} labels={labels.successScoreLabels} />
            <StatusBadge
              status={customer.status}
              label={labels.statusLabels[customer.status] ?? customer.status}
            />
          </div>
        </div>

        {opportunities.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {labels.opportunities}:
            </span>
            {opportunities.map((badge) => (
              <OpportunityBadge
                key={badge.signal}
                signal={badge.signal}
                label={labels.opportunityLabels[badge.signal] ?? badge.label}
              />
            ))}
          </div>
        )}

        <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <HeaderField label={labels.customerType} value={labels.typeLabels[customer.customer_type] ?? customer.customer_type} />
          <HeaderField label={labels.companyNumber} value={customer.organization_number ?? "—"} mono />
          <HeaderField label={labels.country} value={customer.country} />
          <HeaderField label={labels.language} value={customer.language.toUpperCase()} />
          <HeaderField label={labels.plan} value={overview.plan_name ?? subscription?.plan_name ?? "—"} />
          <HeaderField
            label={labels.subscriptionStatus}
            value={
              overview.subscription_status
                ? labels.statusLabels[overview.subscription_status] ?? overview.subscription_status
                : "—"
            }
          />
          <HeaderField
            label={labels.paymentProvider}
            value={
              payment_profile
                ? labels.providerLabels[payment_profile.provider] ?? payment_profile.provider
                : "—"
            }
          />
          <HeaderField label={labels.ownerEmail} value={ownerEmail} />
          <HeaderField label={labels.createdAt} value={formatDate(customer.created_at, locale)} />
        </dl>
      </div>

      <div className="mt-8 border-b border-gray-200">
        <nav className="-mb-px flex gap-1 overflow-x-auto">
          {TAB_IDS.map((tabId) => (
            <button
              key={tabId}
              type="button"
              onClick={() => setActiveTab(tabId)}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                activeTab === tabId
                  ? "border-violet-600 text-violet-700"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {labels.tabs[tabId]}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <OverviewCard label={labels.currentPlan} value={overview.plan_name ?? "—"} />
              <OverviewCard
                label={labels.subscriptionStatus}
                value={
                  overview.subscription_status
                    ? labels.statusLabels[overview.subscription_status] ?? overview.subscription_status
                    : labels.statusLabels[overview.customer_status] ?? overview.customer_status
                }
              />
              <OverviewCard
                label={labels.trialRemaining}
                value={
                  overview.trial_days_remaining != null
                    ? `${overview.trial_days_remaining} ${labels.days}`
                    : "—"
                }
              />
              <OverviewCard label={labels.nextBillingDate} value={formatDate(overview.next_billing_date, locale)} />
              <OverviewCard label={labels.totalUsers} value={String(overview.total_users)} />
              <OverviewCard label={labels.totalInstallations} value={String(overview.total_installations)} />
              <OverviewCard label={labels.outstandingInvoices} value={`${overview.outstanding_invoices} NOK`} />
              <OverviewCard
                label={labels.successScore}
                value={`${successScore} / 100`}
              />
              {detail.license?.has_subscription && (
                <>
                  <OverviewCard
                    label={labels.license.usedDomains}
                    value={formatLimitUsage(
                      detail.license.used_domains ?? 0,
                      detail.license.max_domains,
                      labels.license.unlimited
                    )}
                  />
                  <OverviewCard
                    label={labels.license.usedInstallations}
                    value={formatLimitUsage(
                      detail.license.used_installations ?? 0,
                      detail.license.max_installations,
                      labels.license.unlimited
                    )}
                  />
                </>
              )}
            </div>
            {detail.license && (
              <CustomerLicensePanel
                license={detail.license}
                licenseChecks={detail.license_checks ?? []}
                locale={locale}
                labels={labels.license}
                paymentStatus={payment_profile?.payment_status ?? null}
              />
            )}
            <CustomerInstallationEnginePanel
              locale={locale}
              onboarding={detail.onboarding ?? null}
              installations={installations}
              domains={detail.domains ?? []}
              healthScans={detail.installation_health_scans ?? []}
              labels={labels.installationEngine}
            />
            <CustomerQuickActions title={labels.quickActionsTitle} labels={labels.quickActions} />
          </div>
        )}

        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setInviteOpen(true)}
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
              >
                {labels.inviteTeam}
              </button>
            </div>
            <DataTable
              empty={labels.noData}
              pulseLabel={labels.pulseLabel}
              headers={[
                labels.name,
                labels.email,
                labels.role,
                labels.status,
                labels.lastActive,
                labels.permissions,
                "",
              ]}
              rows={
                users.length === 0
                  ? []
                  : users.map((user) => [
                      user.full_name ?? "—",
                      user.email ?? "—",
                      labels.userRoleLabels[user.role] ?? user.role,
                      labels.userStatusLabels[user.status] ?? user.status,
                      formatDateTime(user.last_login_at, locale),
                      getRolePermissions(user.role).join(", "),
                      user.is_owner ? (
                        <span className="rounded-full bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-700 ring-1 ring-violet-100">
                          {labels.ownerBadge}
                        </span>
                      ) : (
                        ""
                      ),
                    ])
              }
            />
            {(detail.team_invitations?.length ?? 0) > 0 && (
              <DataTable
                empty={labels.noData}
                pulseLabel={labels.pulseLabel}
                headers={[labels.email, labels.role, labels.status, labels.inviteTeam]}
                rows={(detail.team_invitations ?? []).map((invite) => [
                  invite.email,
                  labels.userRoleLabels[invite.role] ?? invite.role,
                  labels.invitationStatusLabels[invite.status] ?? invite.status,
                  invite.department ?? "—",
                ])}
              />
            )}
          </div>
        )}

        {activeTab === "support" && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <OverviewCard label={labels.openTickets} value={String(openTickets.length)} />
              <OverviewCard label={labels.closedTickets} value={String(closedTickets.length)} />
              <OverviewCard
                label={labels.avgResolutionTime}
                value={avgResolution != null ? `${avgResolution.toFixed(1)} ${labels.hours}` : "—"}
              />
              <OverviewCard label={labels.lastContact} value={formatDate(lastContact, locale)} />
            </div>
            <DataTable
              empty={labels.noData}
              pulseLabel={labels.pulseLabel}
              headers={[
                labels.subject,
                labels.category,
                labels.priority,
                labels.status,
                labels.assignedAgent,
                labels.lastContact,
              ]}
              rows={
                support.length === 0
                  ? []
                  : support.map((ticket) => [
                      ticket.subject,
                      labels.supportCategoryLabels[ticket.category ?? "general"] ?? ticket.category ?? "—",
                      labels.priorityLabels[ticket.priority ?? "normal"] ?? ticket.priority ?? "—",
                      labels.statusLabels[ticket.status] ?? ticket.status,
                      ticket.assigned_agent ?? "—",
                      formatDate(ticket.last_contact_at, locale),
                    ])
              }
            />
          </div>
        )}

        {activeTab === "automations" &&
          (automations.length > 0 ? (
            <DataTable
              empty={labels.automations.empty}
              pulseLabel={labels.pulseLabel}
              headers={[
                labels.automations.name,
                labels.automations.status,
                labels.automations.trigger,
                labels.automations.lastRun,
                labels.automations.nextRun,
              ]}
              rows={automations.map((automation) => [
                automation.name,
                labels.automations.statusLabels[automation.status] ?? automation.status,
                automation.trigger_type,
                formatDateTime(automation.last_run_at, locale),
                formatDateTime(automation.next_run_at, locale),
              ])}
            />
          ) : intelligence.automation_runs.length > 0 ? (
            <DataTable
              empty={labels.automations.empty}
              pulseLabel={labels.pulseLabel}
              headers={[
                labels.automations.name,
                labels.automations.status,
                labels.automations.executedAt,
                labels.automations.duration,
                labels.automations.error,
              ]}
              rows={intelligence.automation_runs.map((run) => [
                run.automation_name,
                labels.automations.runStatusLabels[run.status] ?? run.status,
                formatDateTime(run.executed_at, locale),
                run.execution_time_ms != null
                  ? `${run.execution_time_ms} ${labels.seconds}`
                  : "—",
                run.error_message ?? "—",
              ])}
            />
          ) : (
            <BrandedEmptyState message={labels.automations.empty} pulseLabel={labels.pulseLabel} />
          ))}

        {activeTab === "aiInsights" && (
          <div className="space-y-6">
            <CustomerRecommendationFeed
              title={labels.recommendationFeed.title}
              recommendations={recommendations}
              labels={labels.recommendationFeed}
              priorityLabels={labels.priorityLabels}
              onDismiss={
                activeRecs.length > 0
                  ? (id) => {
                      void dismissRecommendation(id);
                    }
                  : undefined
              }
            />
            <SelfLearningInsightsPanel
              learning={intelligence.self_learning}
              locale={locale}
              labels={labels.selfLearning}
            />
            <AiInsightList
              title={labels.aiInsightsTitle}
              items={buildCustomerAiInsightMessages(detail)}
            />
          </div>
        )}

        {activeTab === "timeline" && (
          <CustomerActivityTimeline
            foundationEvents={intelligence.timeline}
            legacyEntries={activity_log}
            locale={locale}
            labels={labels.timeline}
          />
        )}

        {activeTab === "integrations" && (
          <div className="space-y-8">
            {installations.length === 0 ? (
              <BrandedEmptyState message={labels.noData} pulseLabel={labels.pulseLabel} />
            ) : (
              installations.map((installation) => {
                const healthMeta = deriveInstallationHealth({
                  id: installation.id,
                  customer_id: customer.id,
                  customer_number: customer.customer_number,
                  customer_name: displayName,
                  customer_email: customer.email,
                  site_url: installation.site_url,
                  system_type: installation.system_type,
                  status: installation.status,
                  modules: Array.isArray(installation.modules)
                    ? installation.modules.map((module) =>
                        typeof module === "string" ? module : module.module_key
                      )
                    : [],
                  integrations: installation.integrations ?? [],
                  last_synced_at: installation.last_synced_at,
                  created_at: installation.created_at ?? "",
                });
                const score =
                  intelligence.installation_health?.health_score ??
                  getInstallationHealthScore(installation);

                return (
                  <section
                    key={installation.id}
                    className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-mono text-xs text-gray-500">{labels.installationId}</p>
                        <h3 className="mt-1 text-lg font-semibold text-gray-900">
                          {installation.name ?? installation.site_url ?? labels.installationName}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">{installation.site_url ?? "—"}</p>
                      </div>
                      <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                        {labels.healthScore}: {score} ·{" "}
                        {labels.installationHealthLabels[getInstallationHealthStatus(score)]}
                      </span>
                    </div>
                    <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                      <HeaderField label={labels.domain} value={installation.site_url ?? "—"} />
                      <HeaderField label={labels.version} value={installation.version ?? "1.0.0"} />
                      <HeaderField
                        label={labels.connectedModules}
                        value={formatInstallationModuleKeys(installation.modules)}
                      />
                      <HeaderField
                        label={labels.installedDate}
                        value={formatDate(installation.installed_at ?? installation.created_at, locale)}
                      />
                      <HeaderField
                        label={labels.lastHealthCheck}
                        value={formatDateTime(installation.last_synced_at, locale)}
                      />
                      <HeaderField
                        label={labels.recentErrors}
                        value={healthMeta.issuesDetected === 0 ? labels.noErrors : String(healthMeta.issuesDetected)}
                      />
                    </dl>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {INTEGRATION_PROVIDERS.map((provider) => {
                        const connected = installation.integrations?.find(
                          (item) => item.integration_key === provider
                        );
                        const status = connected?.status ?? "disconnected";
                        return (
                          <div
                            key={provider}
                            className="rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3"
                          >
                            <p className="font-semibold capitalize text-gray-900">
                              {provider === "custom_api"
                                ? labels.integrations.customApi
                                : provider === "webhooks"
                                  ? labels.integrations.webhooks
                                  : provider}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {labels.integrations.connectionStatus}:{" "}
                              {labels.integrations[status as keyof typeof labels.integrations] ?? status}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {labels.integrations.lastSync}:{" "}
                              {formatDateTime(connected?.last_synced_at, locale)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })
            )}
          </div>
        )}

        {activeTab === "domains" && (
          (detail.domains?.length ?? 0) === 0 ? (
            <BrandedEmptyState message={labels.domainsTab.empty} pulseLabel={labels.pulseLabel} />
          ) : (
            <DataTable
              empty={labels.domainsTab.empty}
              pulseLabel={labels.pulseLabel}
              headers={[
                labels.domainsTab.domain,
                labels.domainsTab.status,
                labels.domainsTab.verification,
                labels.domainsTab.installation,
                labels.domainsTab.addedAt,
              ]}
              rows={(detail.domains ?? []).map((domain) => [
                domain.domain,
                labels.domainsTab.statusLabels[domain.status] ?? domain.status,
                labels.domainsTab.verificationLabels[domain.verification_status] ??
                  domain.verification_status,
                domain.installation_id
                  ? (installations.find((i) => i.id === domain.installation_id)?.site_url ??
                    domain.installation_id.slice(0, 8))
                  : "—",
                formatDate(domain.added_at, locale),
              ])}
            />
          )
        )}

        {activeTab === "settings" && (
          <div className="space-y-8">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">{labels.settings.subscriptionTitle}</h3>
              {subscription ? (
                <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                  <HeaderField label={labels.plan} value={subscription.plan_name} />
                  <HeaderField
                    label={labels.status}
                    value={labels.statusLabels[subscription.status] ?? subscription.status}
                  />
                  <HeaderField label={labels.price} value={`${subscription.price_amount} ${subscription.currency}`} />
                  <HeaderField label={labels.billingCycle} value={subscription.billing_cycle} />
                  <HeaderField label={labels.nextBillingDate} value={formatDate(subscription.next_billing_date, locale)} />
                </dl>
              ) : (
                <p className="mt-4 text-sm text-gray-500">{labels.noData}</p>
              )}
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">{labels.settings.billingTitle}</h3>
              {payment_profile ? (
                <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                  <HeaderField
                    label={labels.paymentProvider}
                    value={labels.providerLabels[payment_profile.provider] ?? payment_profile.provider}
                  />
                  <HeaderField label={labels.email} value={payment_profile.billing_email} />
                  <HeaderField label={labels.country} value={payment_profile.country} />
                  <HeaderField label={labels.kid} value={payment_profile.kid_number ?? "—"} mono />
                </dl>
              ) : (
                <p className="mt-4 text-sm text-gray-500">{labels.noData}</p>
              )}
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900">{labels.settings.invoicesTitle}</h3>
              {invoices.length === 0 ? (
                <p className="mt-4 text-sm text-gray-500">{labels.noData}</p>
              ) : (
                <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                      <thead className="bg-gray-50/80">
                        <tr>
                          {[labels.invoiceNumber, labels.invoiceStatus, labels.dueDate, labels.amount, labels.view].map(
                            (header) => (
                              <th
                                key={header}
                                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                              >
                                {header}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {invoices.map((invoice) => (
                          <tr key={invoice.id}>
                            <td className="px-4 py-3 font-mono text-sm">{invoice.invoice_number}</td>
                            <td className="px-4 py-3">
                              <StatusBadge
                                status={invoice.status}
                                label={labels.invoiceStatusLabels[invoice.status] ?? invoice.status}
                              />
                            </td>
                            <td className="px-4 py-3 text-sm">{formatDate(invoice.due_date, locale)}</td>
                            <td className="px-4 py-3 text-sm">
                              {invoice.amount} {invoice.currency}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                type="button"
                                className="text-xs font-semibold text-violet-600 hover:text-violet-700"
                                onClick={() => runInvoiceAction(invoice.id, "send")}
                                disabled={actingInvoiceId === invoice.id}
                              >
                                {actingInvoiceId === invoice.id ? labels.actionPending : labels.view}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>

            {usage && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <OverviewCard label={labels.supportRequests} value={String(usage.support_requests_handled)} />
                <OverviewCard label={labels.automatedActions} value={String(usage.automated_actions)} />
                <OverviewCard label={labels.aiRecommendations} value={String(usage.ai_recommendations)} />
              </div>
            )}
          </div>
        )}
      </div>

      <InviteTeamMemberModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        labels={labels.inviteModal}
        roleOptions={roleOptions}
      />
    </div>
  );
}

function HeaderField({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className={`mt-1 text-sm font-medium text-gray-900 ${mono ? "font-mono" : ""}`}>
        {value}
      </dd>
    </div>
  );
}

function OverviewCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-2 text-xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function BrandedEmptyState({
  message,
  pulseLabel,
}: {
  message: string;
  pulseLabel: string;
}) {
  return <AipifyEmptyState message={message} pulseLabel={pulseLabel} />;
}

function DataTable({
  headers,
  rows,
  empty,
  pulseLabel,
}: {
  headers: string[];
  rows: (string | ReactNode)[][];
  empty: string;
  pulseLabel: string;
}) {
  if (rows.length === 0) {
    return <BrandedEmptyState message={empty} pulseLabel={pulseLabel} />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/80">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row, index) => (
              <tr key={index}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3 text-sm text-gray-700">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
