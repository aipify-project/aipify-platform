"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseSalesExpertEngineDashboard,
  type SalesExpertCommission,
  type SalesExpertCustomer,
  type SalesExpertEmail,
  type SalesExpertEmailTemplate,
  type SalesExpertEngineDashboard,
  type ImplementationServicePricing,
  type SalesExpertFollowUp,
  type SalesExpertOpportunity,
  type ActivityRecommendation,
  type BellMoment,
  type CoachSuccessCriterion,
  type IntegrationLink,
  type Leaderboards,
  type MilestoneRecognition,
  type PerformanceObjective,
  type PerformanceSuccessCriterion,
  type RecognitionRoses,
} from "@/lib/aipify/sales-expert-operating-system";
import { SalesExpertFaqPanel } from "./SalesExpertFaqPanel";
import { MarketingCenterTab } from "./MarketingCenterTab";
import { SalesIntelligenceTab } from "./SalesIntelligenceTab";
import { EngagementBookingTab } from "./EngagementBookingTab";
import { SalesOperationsTab } from "./SalesOperationsTab";
import { SalesCommunityTab } from "./SalesCommunityTab";
import { SalesLegacyTab } from "./SalesLegacyTab";

type Props = { labels: Record<string, string>; locale: string };

type TabKey =
  | "dashboard"
  | "customers"
  | "opportunities"
  | "intelligence"
  | "commissions"
  | "operations"
  | "training"
  | "coach"
  | "engagement"
  | "demoExperience"
  | "certificationEnablement"
  | "performance"
  | "renewalExpansion"
  | "resources"
  | "marketing"
  | "community"
  | "legacy"
  | "email"
  | "services"
  | "principles"
  | "faq";

const TABS: TabKey[] = [
  "dashboard",
  "customers",
  "opportunities",
  "intelligence",
  "commissions",
  "operations",
  "training",
  "coach",
  "engagement",
  "demoExperience",
  "certificationEnablement",
  "performance",
  "renewalExpansion",
  "resources",
  "marketing",
  "community",
  "legacy",
  "email",
  "services",
  "principles",
  "faq",
];

function badgeClass(value?: string) {
  switch (value) {
    case "paid":
    case "won":
    case "active":
      return "bg-emerald-100 text-emerald-800";
    case "pending":
    case "prospect":
    case "scheduled":
      return "bg-amber-100 text-amber-800";
    case "forecasted":
    case "onboarding":
      return "bg-sky-100 text-sky-800";
    case "at_risk":
    case "failed":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export function SalesExpertEngineDashboardPanel({ labels, locale }: Props) {
  const [dashboard, setDashboard] = useState<SalesExpertEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");
  const [actionError, setActionError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [sending, setSending] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [emailCustomerId, setEmailCustomerId] = useState("");
  const [emailTemplateKey, setEmailTemplateKey] = useState("introduction");

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/sales-expert-engine/dashboard");
    if (res.ok) setDashboard(parseSalesExpertEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const createCustomer = async () => {
    if (!customerName.trim()) return;
    setCreating(true);
    setActionError(null);
    const res = await fetch("/api/aipify/sales-expert-engine/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ org_name: customerName.trim(), status: "prospect" }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.actionFailed);
    } else {
      setCustomerName("");
      await load();
    }
    setCreating(false);
  };

  const sendEmail = async () => {
    if (!emailCustomerId || !emailTemplateKey) return;
    setSending(true);
    setActionError(null);
    const res = await fetch("/api/aipify/sales-expert-engine/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_id: emailCustomerId,
        template_key: emailTemplateKey,
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.actionFailed);
    } else {
      await load();
    }
    setSending(false);
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const sections = dashboard.sections ?? {};
  const customers = sections.customers ?? [];
  const opportunities = sections.opportunities ?? [];
  const commissions = sections.commissions ?? [];
  const templates = sections.email_templates ?? [];
  const emails = sections.emails ?? [];
  const followUps = sections.follow_ups ?? [];
  const bookings = sections.bookings ?? [];
  const links = dashboard.integration_links ?? [];

  return (
    <div className="space-y-6">
      {links.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {links.map((link) =>
            link.route ? (
              <Link key={link.key ?? link.route} href={link.route} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
                {link.label ?? link.key}
              </Link>
            ) : null
          )}
        </div>
      ) : null}

      <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
        <h2 className="text-sm font-semibold text-teal-900">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm text-teal-900">{dashboard.philosophy}</p>
        {dashboard.distinction_note ? (
          <p className="mt-2 text-xs text-teal-700">{dashboard.distinction_note}</p>
        ) : null}
        {dashboard.mass_email_supported === false ? (
          <p className="mt-2 text-xs font-medium text-teal-800">{labels.noMassEmail}</p>
        ) : null}
      </section>

      {actionError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      ) : null}

      <div className="flex flex-wrap gap-1 border-b border-gray-200 pb-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`rounded-lg px-3 py-1.5 text-sm ${
              activeTab === tab ? "bg-teal-100 font-medium text-teal-900" : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {labels[`tab${tab.charAt(0).toUpperCase()}${tab.slice(1)}` as keyof typeof labels] ?? tab}
          </button>
        ))}
      </div>

      {activeTab === "dashboard" ? (
        <DashboardTab summary={summary} labels={labels} />
      ) : null}

      {activeTab === "customers" ? (
        <CustomersTab
          customers={customers}
          customerName={customerName}
          setCustomerName={setCustomerName}
          creating={creating}
          onCreate={() => void createCustomer()}
          labels={labels}
        />
      ) : null}

      {activeTab === "opportunities" ? (
        <OpportunitiesTab opportunities={opportunities} labels={labels} />
      ) : null}

      {activeTab === "intelligence" ? (
        <SalesIntelligenceTab dashboard={dashboard} labels={labels} />
      ) : null}

      {activeTab === "commissions" ? (
        <CommissionsTab
          commissions={commissions}
          commercial={dashboard.commercial_commission_summary}
          labels={labels}
        />
      ) : null}

      {activeTab === "operations" ? (
        <SalesOperationsTab dashboard={dashboard} labels={labels} />
      ) : null}

      {activeTab === "training" ? (
        <TrainingTab training={dashboard.training_center} labels={labels} />
      ) : null}

      {activeTab === "coach" ? (
        <CoachEnablementTab dashboard={dashboard} labels={labels} />
      ) : null}

      {activeTab === "engagement" ? (
        <EngagementBookingTab
          dashboard={dashboard}
          followUps={followUps}
          bookings={bookings}
          labels={labels}
          locale={locale}
        />
      ) : null}

      {activeTab === "demoExperience" ? (
        <DemoExperienceTab dashboard={dashboard} labels={labels} />
      ) : null}

      {activeTab === "certificationEnablement" ? (
        <CertificationFieldEnablementTab dashboard={dashboard} labels={labels} />
      ) : null}

      {activeTab === "performance" ? (
        <PerformanceRecognitionTab dashboard={dashboard} labels={labels} />
      ) : null}

      {activeTab === "renewalExpansion" ? (
        <RenewalExpansionTab dashboard={dashboard} labels={labels} />
      ) : null}

      {activeTab === "resources" ? (
        <ResourcesTab library={dashboard.resource_library} labels={labels} />
      ) : null}

      {activeTab === "marketing" ? (
        <MarketingCenterTab center={dashboard.sales_expert_marketing_center} labels={labels} />
      ) : null}

      {activeTab === "community" ? (
        <SalesCommunityTab center={dashboard.sales_expert_community_center} labels={labels} />
      ) : null}

      {activeTab === "legacy" ? (
        <SalesLegacyTab center={dashboard.sales_legacy_center} labels={labels} />
      ) : null}

      {activeTab === "email" ? (
        <EmailTab
          templates={templates}
          emails={emails}
          followUps={followUps}
          customers={customers}
          emailCustomerId={emailCustomerId}
          setEmailCustomerId={setEmailCustomerId}
          emailTemplateKey={emailTemplateKey}
          setEmailTemplateKey={setEmailTemplateKey}
          sending={sending}
          onSend={() => void sendEmail()}
          labels={labels}
        />
      ) : null}

      {activeTab === "services" ? (
        <ServicesTab services={dashboard.implementation_services} labels={labels} />
      ) : null}

      {activeTab === "principles" ? (
        <PrinciplesTab
          principles={dashboard.principles}
          subscription={dashboard.subscription_principles}
          terminology={dashboard.official_terminology}
          labels={labels}
        />
      ) : null}

      {activeTab === "faq" ? <SalesExpertFaqPanel labels={labels} /> : null}
    </div>
  );
}

function DashboardTab({
  summary,
  labels,
}: {
  summary: Record<string, unknown>;
  labels: Record<string, string>;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard label={labels.pendingCommissions} value={String(summary.monthly_commissions_pending ?? 0)} />
      <MetricCard label={labels.paidCommissions} value={String(summary.monthly_commissions_paid ?? 0)} />
      <MetricCard label={labels.lifetimeValue} value={String(summary.lifetime_subscription_value ?? 0)} />
      <MetricCard label={labels.activeOpportunities} value={String(summary.active_opportunities ?? 0)} />
      <MetricCard label={labels.upcomingFollowUps} value={String(summary.upcoming_follow_ups ?? 0)} />
      <MetricCard label={labels.activeCustomers} value={String(summary.active_customers ?? 0)} />
      <MetricCard label={labels.forecastedCommissions} value={String(summary.forecasted_commissions ?? 0)} />
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function CustomersTab({
  customers,
  customerName,
  setCustomerName,
  creating,
  onCreate,
  labels,
}: {
  customers: SalesExpertCustomer[];
  customerName: string;
  setCustomerName: (v: string) => void;
  creating: boolean;
  onCreate: () => void;
  labels: Record<string, string>;
}) {
  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.addCustomer}</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <input
            className="rounded border border-gray-300 px-2 py-1 text-sm"
            placeholder={labels.customerNamePlaceholder}
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          <button
            type="button"
            className="rounded bg-teal-700 px-3 py-1 text-sm text-white disabled:opacity-50"
            disabled={creating}
            onClick={onCreate}
          >
            {creating ? labels.creating : labels.addCustomerButton}
          </button>
        </div>
      </section>
      {customers.length === 0 ? (
        <p className="text-sm text-gray-500">{labels.noCustomers}</p>
      ) : (
        <ul className="divide-y rounded-lg border border-gray-200 bg-white">
          {customers.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 p-3 text-sm">
              <div>
                <p className="font-medium">{c.org_name}</p>
                <p className="text-xs text-gray-500">
                  {labels.onboardingProgress}: {c.onboarding_progress ?? 0}%
                </p>
              </div>
              <div className="flex gap-2">
                <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(c.status)}`}>{c.status}</span>
                <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(c.subscription_status)}`}>
                  {c.subscription_status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function OpportunitiesTab({
  opportunities,
  labels,
}: {
  opportunities: SalesExpertOpportunity[];
  labels: Record<string, string>;
}) {
  if (opportunities.length === 0) return <p className="text-sm text-gray-500">{labels.noOpportunities}</p>;
  return (
    <ul className="divide-y rounded-lg border border-gray-200 bg-white">
      {opportunities.map((o) => (
        <li key={o.id} className="space-y-1 p-4 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-medium">{o.title}</p>
            <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(o.pipeline_stage)}`}>{o.pipeline_stage}</span>
          </div>
          <p className="text-xs text-gray-600">
            {labels.estimatedValue}: {o.estimated_value ?? 0} {o.currency ?? "NOK"}
          </p>
          {o.recommended_action ? (
            <p className="text-xs text-teal-800">
              {labels.recommendedAction}: {o.recommended_action}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function CommissionsTab({
  commissions,
  commercial,
  labels,
}: {
  commissions: SalesExpertCommission[];
  commercial?: Record<string, unknown>;
  labels: Record<string, string>;
}) {
  return (
    <div className="space-y-4">
      {commercial?.available ? (
        <p className="text-xs text-gray-600">
          {labels.commercialIntegration}: {String(commercial.pending_total ?? 0)} pending ·{" "}
          {String(commercial.paid_total ?? 0)} paid
        </p>
      ) : null}
      {commissions.length === 0 ? (
        <p className="text-sm text-gray-500">{labels.noCommissions}</p>
      ) : (
        <ul className="divide-y rounded-lg border border-gray-200 bg-white">
          {commissions.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 p-3 text-sm">
              <div>
                <p className="font-medium">{c.commission_type?.replace(/_/g, " ")}</p>
                <p className="text-xs text-gray-500">{c.period_month}</p>
              </div>
              <div className="flex items-center gap-2">
                <span>
                  {c.amount ?? 0} {c.currency ?? "NOK"}
                </span>
                <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(c.status)}`}>{c.status}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TrainingTab({
  training,
  labels,
}: {
  training?: Record<string, unknown>;
  labels: Record<string, string>;
}) {
  return (
    <section className="rounded-lg border border-gray-200 p-4 text-sm">
      <h3 className="font-semibold">{labels.trainingCenter}</h3>
      <ul className="mt-3 space-y-2">
        <li>
          <Link href="/app/learning-training-engine" className="text-teal-700 underline">
            {labels.foundationsTraining}
          </Link>
        </li>
        <li>
          <Link href="/app/certification-achievement-engine" className="text-teal-700 underline">
            {labels.certificationPathways}
          </Link>
        </li>
      </ul>
      {typeof training?.demo_simulations_note === "string" ? (
        <p className="mt-3 text-xs text-gray-500">{training.demo_simulations_note}</p>
      ) : null}
    </section>
  );
}

function ResourcesTab({
  library,
  labels,
}: {
  library?: Record<string, unknown>;
  labels: Record<string, string>;
}) {
  const categories = Array.isArray(library?.categories) ? (library.categories as string[]) : [];
  return (
    <section className="rounded-lg border border-gray-200 p-4 text-sm">
      <h3 className="font-semibold">{labels.resourceLibrary}</h3>
      <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">{labels.metadataScaffold}</p>
      {categories.length > 0 ? (
        <ul className="mt-3 list-inside list-disc text-gray-600">
          {categories.map((cat) => (
            <li key={cat}>{cat}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function EmailTab({
  templates,
  emails,
  followUps,
  customers,
  emailCustomerId,
  setEmailCustomerId,
  emailTemplateKey,
  setEmailTemplateKey,
  sending,
  onSend,
  labels,
}: {
  templates: SalesExpertEmailTemplate[];
  emails: SalesExpertEmail[];
  followUps: SalesExpertFollowUp[];
  customers: SalesExpertCustomer[];
  emailCustomerId: string;
  setEmailCustomerId: (v: string) => void;
  emailTemplateKey: string;
  setEmailTemplateKey: (v: string) => void;
  sending: boolean;
  onSend: () => void;
  labels: Record<string, string>;
}) {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.sendOneToOne}</h3>
        <p className="mt-1 text-xs text-gray-500">{labels.noMassEmail}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <select
            className="rounded border border-gray-300 px-2 py-1 text-sm"
            value={emailCustomerId}
            onChange={(e) => setEmailCustomerId(e.target.value)}
          >
            <option value="">{labels.selectCustomer}</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.org_name}
              </option>
            ))}
          </select>
          <select
            className="rounded border border-gray-300 px-2 py-1 text-sm"
            value={emailTemplateKey}
            onChange={(e) => setEmailTemplateKey(e.target.value)}
          >
            {templates.map((t) => (
              <option key={t.template_key} value={t.template_key}>
                {t.title}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="rounded bg-teal-700 px-3 py-1 text-sm text-white disabled:opacity-50"
            disabled={sending || !emailCustomerId}
            onClick={onSend}
          >
            {sending ? labels.sending : labels.sendEmail}
          </button>
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold">{labels.emailTemplates}</h3>
        <ul className="mt-2 divide-y rounded-lg border border-gray-200 bg-white">
          {templates.map((t) => (
            <li key={t.template_key} className="p-3 text-sm">
              <p className="font-medium">{t.title}</p>
              <p className="text-xs text-gray-500">{t.subject_pattern}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-sm font-semibold">{labels.automatedFollowUps}</h3>
        <ul className="mt-2 divide-y rounded-lg border border-gray-200 bg-white">
          {followUps.map((f) => (
            <li key={f.id} className="flex justify-between p-3 text-sm">
              <span>
                {f.cadence_days} {labels.days} · {f.template_key}
              </span>
              <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(f.status)}`}>{f.status}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-sm font-semibold">{labels.emailHistory}</h3>
        <ul className="mt-2 divide-y rounded-lg border border-gray-200 bg-white">
          {emails.map((e) => (
            <li key={e.id} className="flex justify-between p-3 text-sm">
              <span>{e.subject_metadata}</span>
              <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(e.status)}`}>{e.status}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function PerformanceRecognitionTab({
  dashboard,
  labels,
}: {
  dashboard: SalesExpertEngineDashboard;
  labels: Record<string, string>;
}) {
  const summary = dashboard.performance_summary ?? {};
  const progress = dashboard.milestone_progress;
  const progressMap = new Map(
    (progress?.milestones ?? []).map((m) => [m.key, m] as const),
  );
  const perfLinks = dashboard.performance_integration_links ?? [];

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-amber-200 bg-amber-50/50 p-6">
        <h2 className="text-sm font-semibold text-amber-900">{labels.performanceMission}</h2>
        {dashboard.performance_recognition_mission ? (
          <p className="mt-2 text-sm text-amber-900">{dashboard.performance_recognition_mission}</p>
        ) : null}
        {dashboard.performance_recognition_philosophy ? (
          <p className="mt-2 text-sm text-amber-800">{dashboard.performance_recognition_philosophy}</p>
        ) : null}
        {dashboard.performance_recognition_abos_principle ? (
          <p className="mt-2 text-xs font-medium text-amber-700">
            {dashboard.performance_recognition_abos_principle}
          </p>
        ) : null}
        {dashboard.performance_distinction_note ? (
          <p className="mt-3 text-xs text-amber-700">{dashboard.performance_distinction_note}</p>
        ) : null}
      </section>

      {perfLinks.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {perfLinks.map((link) =>
            link.route ? (
              <Link
                key={link.key ?? link.route}
                href={link.route}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
              >
                {link.label ?? link.key}
              </Link>
            ) : null,
          )}
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label={labels.milestonesAchieved}
          value={String(summary.milestones_achieved ?? 0)}
        />
        <MetricCard
          label={labels.pendingCommissions}
          value={String(summary.monthly_commissions_pending ?? 0)}
        />
        <MetricCard
          label={labels.paidCommissions}
          value={String(summary.monthly_commissions_paid ?? 0)}
        />
        <MetricCard
          label={labels.forecastedCommissions}
          value={String(summary.forecasted_commissions ?? 0)}
        />
        <MetricCard
          label={labels.lifetimeValue}
          value={String(summary.lifetime_subscription_value ?? 0)}
        />
        <MetricCard
          label={labels.activeSubscriptions}
          value={String(summary.active_subscriptions ?? 0)}
        />
        <MetricCard
          label={labels.newCustomers30d}
          value={String(summary.new_customers_30d ?? 0)}
        />
        <MetricCard
          label={labels.retentionRate}
          value={
            summary.retention_rate_pct != null ? `${summary.retention_rate_pct}%` : "—"
          }
        />
      </section>

      {summary.performance_trends_note ? (
        <p className="text-xs text-gray-500">{summary.performance_trends_note}</p>
      ) : null}

      {dashboard.performance_objectives && dashboard.performance_objectives.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.performanceObjectives}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.performance_objectives.map((item: PerformanceObjective) => (
              <li key={item.key ?? item.label} className="text-sm text-gray-600">
                <span className="font-medium text-gray-800">{item.label}</span>
                {item.description ? <span className="text-gray-500"> — {item.description}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.performance_dashboard_fields &&
      dashboard.performance_dashboard_fields.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.performanceDashboardFields}</h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {dashboard.performance_dashboard_fields.map((field) => (
              <li
                key={field.key ?? field.label}
                className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-700"
              >
                {field.label}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.milestone_recognition && dashboard.milestone_recognition.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.milestoneRecognition}</h3>
          <ul className="mt-3 divide-y rounded-lg border border-gray-100 bg-white">
            {dashboard.milestone_recognition.map((m: MilestoneRecognition) => {
              const prog = progressMap.get(m.key);
              const met = Boolean(prog?.met);
              return (
                <li key={m.key ?? m.label} className="flex flex-wrap items-center justify-between gap-2 p-3 text-sm">
                  <div>
                    <p className="font-medium">
                      {m.emoji ? `${m.emoji} ` : ""}
                      {m.label}
                    </p>
                    {m.note ? <p className="text-xs text-gray-500">{m.note}</p> : null}
                    {prog ? (
                      <p className="text-xs text-gray-500">
                        {labels.milestoneProgressLabel}: {prog.current ?? 0}
                        {prog.threshold != null ? ` / ${prog.threshold}` : ""}
                      </p>
                    ) : null}
                  </div>
                  <span
                    className={`rounded px-2 py-0.5 text-xs ${
                      met ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {met ? labels.milestoneMet : labels.milestoneNotMet}
                  </span>
                </li>
              );
            })}
          </ul>
          {progress?.privacy_note ? (
            <p className="mt-2 text-xs text-gray-500">{progress.privacy_note}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.bell_moments && dashboard.bell_moments.length > 0 ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/40 p-4">
          <h3 className="text-sm font-semibold text-amber-900">{labels.bellMoments}</h3>
          <ul className="mt-3 space-y-3">
            {dashboard.bell_moments.map((item: BellMoment) => (
              <li key={item.key ?? item.example} className="text-sm text-amber-900">
                {item.emoji ? `${item.emoji} ` : ""}
                {item.example ? (
                  <span className="italic">{item.example}</span>
                ) : null}
                {item.trigger ? (
                  <p className="mt-1 text-xs text-amber-700">
                    {labels.bellMomentTrigger}: {item.trigger}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.recognition_roses?.principle ? (
        <RecognitionRosesSection roses={dashboard.recognition_roses} labels={labels} />
      ) : null}

      {dashboard.leaderboards?.principle ? (
        <LeaderboardsSection leaderboards={dashboard.leaderboards} labels={labels} />
      ) : null}

      {dashboard.performance_self_love_connection?.principle ? (
        <section className="rounded-lg border border-rose-100 bg-rose-50/40 p-4 text-sm text-rose-900">
          <h3 className="text-sm font-semibold">{labels.selfLoveConnection}</h3>
          <p className="mt-2">{dashboard.performance_self_love_connection.principle}</p>
          {Array.isArray(dashboard.performance_self_love_connection.examples) &&
          dashboard.performance_self_love_connection.examples.length > 0 ? (
            <ul className="mt-2 space-y-1">
              {dashboard.performance_self_love_connection.examples.map((ex) => (
                <li key={ex.example}>
                  {ex.emoji ? `${ex.emoji} ` : ""}
                  {ex.example}
                </li>
              ))}
            </ul>
          ) : null}
          {dashboard.performance_self_love_connection.boundary ? (
            <p className="mt-2 text-xs text-rose-700">
              {dashboard.performance_self_love_connection.boundary}
            </p>
          ) : null}
          {dashboard.performance_self_love_connection.route ? (
            <Link
              href={dashboard.performance_self_love_connection.route}
              className="mt-2 inline-block text-xs text-rose-800 underline"
            >
              {labels.selfLove}
            </Link>
          ) : null}
        </section>
      ) : null}

      {dashboard.performance_trust_connection?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.trustConnection}</h3>
          <p className="mt-2 text-gray-600">{dashboard.performance_trust_connection.principle}</p>
          {dashboard.performance_trust_connection.experts_should_understand &&
          dashboard.performance_trust_connection.experts_should_understand.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-gray-600">
              {dashboard.performance_trust_connection.experts_should_understand.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          {dashboard.performance_trust_connection.metadata_only ? (
            <p className="mt-2 text-xs text-gray-500">{labels.metadataOnly}</p>
          ) : null}
        </section>
      ) : null}

      {Array.isArray(dashboard.performance_vision_phrases) &&
      dashboard.performance_vision_phrases.length > 0 ? (
        <section className="rounded-lg border border-teal-100 bg-teal-50/40 p-4 text-sm">
          <h3 className="text-sm font-semibold text-teal-900">{labels.visionPhrases}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-teal-800">
            {dashboard.performance_vision_phrases.map((phrase) => (
              <li key={phrase}>{phrase}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {Array.isArray(dashboard.performance_blueprint_success_criteria) &&
      dashboard.performance_blueprint_success_criteria.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.blueprintSuccessCriteria}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {dashboard.performance_blueprint_success_criteria.map(
              (item: PerformanceSuccessCriterion) => {
                const label = typeof item.label === "string" ? item.label : String(item.key ?? "");
                const met = Boolean(item.met);
                const note = typeof item.note === "string" ? item.note : null;
                return (
                  <li key={item.key ?? label}>
                    <span className={met ? "text-green-800" : "text-gray-700"}>
                      {met ? "✓" : "○"} {label}
                    </span>
                    {note ? <p className="text-xs text-gray-500">{note}</p> : null}
                  </li>
                );
              },
            )}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function RecognitionRosesSection({
  roses,
  labels,
}: {
  roses: RecognitionRoses;
  labels: Record<string, string>;
}) {
  return (
    <section className="rounded-lg border border-rose-200 bg-rose-50/30 p-4">
      <h3 className="text-sm font-semibold text-rose-900">{labels.recognitionRoses}</h3>
      <p className="mt-2 text-sm text-rose-900">{roses.principle}</p>
      {Array.isArray(roses.examples) && roses.examples.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {roses.examples.map((ex) => (
            <li key={ex.example} className="text-sm italic text-rose-800">
              {ex.emoji ? `${ex.emoji} ` : ""}
              {ex.example}
            </li>
          ))}
        </ul>
      ) : null}
      {roses.boundary ? (
        <p className="mt-2 text-xs text-rose-700">{labels.recognitionRosesBoundary}: {roses.boundary}</p>
      ) : null}
      {roses.gratitude_engine_route ? (
        <Link
          href={roses.gratitude_engine_route}
          className="mt-2 inline-block text-xs text-rose-800 underline"
        >
          {labels.gratitudeRecognitionLink}
        </Link>
      ) : null}
    </section>
  );
}

function LeaderboardsSection({
  leaderboards,
  labels,
}: {
  leaderboards: Leaderboards;
  labels: Record<string, string>;
}) {
  return (
    <section className="rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold">{labels.leaderboards}</h3>
      <p className="mt-2 text-sm text-gray-600">{leaderboards.principle}</p>
      {leaderboards.encouraged_categories && leaderboards.encouraged_categories.length > 0 ? (
        <>
          <p className="mt-3 text-xs font-medium uppercase tracking-wide text-gray-500">
            {labels.leaderboardEncouragedCategories}
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {leaderboards.encouraged_categories.map((cat) => (
              <li
                key={cat.key ?? cat.label}
                className="rounded-full bg-teal-100 px-3 py-1 text-xs text-teal-800"
              >
                {cat.label}
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {leaderboards.avoid && leaderboards.avoid.length > 0 ? (
        <>
          <p className="mt-3 text-xs font-medium uppercase tracking-wide text-gray-500">
            {labels.leaderboardAvoid}
          </p>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-500">
            {leaderboards.avoid.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </>
      ) : null}
    </section>
  );
}

function ServicesTab({
  services,
  labels,
}: {
  services?: ImplementationServicePricing;
  labels: Record<string, string>;
}) {
  const items = services?.services ?? [];
  return (
    <section className="rounded-lg border border-gray-200 p-4 text-sm">
      <h3 className="font-semibold">{labels.implementationServices}</h3>
      {services?.principle ? <p className="mt-2 text-gray-600">{services.principle}</p> : null}
      <ul className="mt-4 space-y-2">
        {items.map((s) => (
          <li key={s.key} className="flex justify-between rounded border border-gray-100 p-3">
            <span>{s.label}</span>
            <span className="font-medium">
              {s.suggested_price ?? 0} {services?.currency ?? "NOK"}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function DemoExperienceTab({
  dashboard,
  labels,
}: {
  dashboard: SalesExpertEngineDashboard;
  labels: Record<string, string>;
}) {
  const environments = dashboard.demo_environments?.environments ?? [];
  const flowSteps = dashboard.demo_flow_structure?.steps ?? [];
  const discoveryCategories = dashboard.discovery_question_library?.categories ?? [];
  const industries = dashboard.industry_demonstrations?.industries ?? [];
  const demoLinks = dashboard.demo_links_scaffold;
  const linksSummary = dashboard.demo_links_summary;

  return (
    <div className="space-y-6">
      <BlueprintHeader
        mission={dashboard.sales_demo_mission}
        philosophy={dashboard.sales_demo_philosophy}
        abosPrinciple={dashboard.sales_demo_abos_principle}
        distinctionNote={dashboard.sales_demo_distinction_note}
        labels={labels}
        titleKey="demoTitle"
        missionKey="demoMission"
        philosophyKey="demoPhilosophy"
        abosKey="demoAbosPrinciple"
        distinctionKey="demoDistinctionNote"
      />

      {(dashboard.sales_demo_objectives ?? []).length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.demoObjectives}</h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.sales_demo_objectives!.map((obj) => (
              <li key={obj.key} className="rounded border border-teal-100 bg-teal-50/40 p-3 text-sm">
                <p className="font-medium">{obj.label}</p>
                {obj.description ? <p className="mt-1 text-xs text-gray-600">{obj.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {environments.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.demoEnvironments}</h3>
          {dashboard.demo_environments?.principle ? (
            <p className="mt-1 text-xs text-gray-500">{dashboard.demo_environments.principle}</p>
          ) : null}
          {dashboard.demo_environments?.boundary ? (
            <p className="mt-1 text-xs font-medium text-amber-800">{dashboard.demo_environments.boundary}</p>
          ) : null}
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {environments.map((env) => (
              <li key={env.key} className="rounded border border-gray-100 p-3 text-sm">
                <p className="font-medium">{env.label}</p>
                {env.description ? <p className="mt-1 text-xs text-gray-600">{env.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {flowSteps.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.demoFlowStructure}</h3>
          {dashboard.demo_flow_structure?.principle ? (
            <p className="mt-1 text-xs text-gray-500">{dashboard.demo_flow_structure.principle}</p>
          ) : null}
          <ol className="mt-3 space-y-2 text-sm">
            {flowSteps.map((step) => (
              <li key={step.key} className="rounded border border-gray-100 p-3">
                <span className="font-medium">
                  {step.order}. {step.label}
                </span>
                {step.guidance ? <p className="mt-1 text-xs text-gray-600">{step.guidance}</p> : null}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {discoveryCategories.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.demoDiscoveryLibrary}</h3>
          {dashboard.discovery_question_library?.principle ? (
            <p className="mt-1 text-xs text-gray-500">{dashboard.discovery_question_library.principle}</p>
          ) : null}
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {discoveryCategories.map((cat) => (
              <div key={cat.key}>
                <h4 className="text-xs font-semibold uppercase text-gray-600">{cat.label}</h4>
                <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
                  {(cat.questions ?? []).map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {industries.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.demoIndustryDemonstrations}</h3>
          {dashboard.industry_demonstrations?.principle ? (
            <p className="mt-1 text-xs text-gray-500">{dashboard.industry_demonstrations.principle}</p>
          ) : null}
          <ul className="mt-3 space-y-3 text-sm">
            {industries.map((ind) => (
              <li key={ind.key} className="rounded border border-gray-100 p-3">
                <p className="font-medium">{ind.label}</p>
                {(ind.use_cases ?? []).length > 0 ? (
                  <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
                    {ind.use_cases!.map((uc) => (
                      <li key={uc}>{uc}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(dashboard.demo_data_examples?.examples ?? []).length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.demoDataExamples}</h3>
          {dashboard.demo_data_examples?.principle ? (
            <p className="mt-1 text-xs text-gray-500">{dashboard.demo_data_examples.principle}</p>
          ) : null}
          <ul className="mt-3 space-y-2 text-sm">
            {dashboard.demo_data_examples!.examples!.map((ex) => (
              <li key={ex.key}>
                <span className="font-medium">{ex.label}</span>
                {ex.note ? <span className="text-gray-600"> — {ex.note}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(dashboard.custom_demo_experiences ?? []).length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.demoCustomExperiences}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {dashboard.custom_demo_experiences!.map((exp) => (
              <li key={exp.key} className="rounded border border-gray-100 p-3">
                <p className="font-medium">{exp.label}</p>
                {exp.description ? <p className="mt-1 text-xs text-gray-600">{exp.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.demo_guidance ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.demoGuidance}</h3>
          {dashboard.demo_guidance.principle ? (
            <p className="mt-1 text-xs text-gray-500">{dashboard.demo_guidance.principle}</p>
          ) : null}
          {dashboard.demo_guidance.coach_tab_cross_link ? (
            <p className="mt-1 text-xs text-teal-700">{dashboard.demo_guidance.coach_tab_cross_link}</p>
          ) : null}
          {(dashboard.demo_guidance.companion_examples ?? []).length > 0 ? (
            <ul className="mt-3 space-y-2 text-sm">
              {dashboard.demo_guidance.companion_examples!.map((ex) => (
                <li key={ex.key ?? ex.example}>
                  {ex.emoji} {ex.example}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.companion_demo_experience?.examples &&
      dashboard.companion_demo_experience.examples.length > 0 ? (
        <section className="rounded-lg border border-teal-100 bg-teal-50/30 p-4">
          <h3 className="text-sm font-semibold">{labels.demoCompanionExperience}</h3>
          {dashboard.companion_demo_experience.principle ? (
            <p className="mt-1 text-xs text-gray-600">{dashboard.companion_demo_experience.principle}</p>
          ) : null}
          <ul className="mt-3 space-y-2 text-sm">
            {dashboard.companion_demo_experience.examples.map((ex) => (
              <li key={ex.key ?? ex.example}>
                {ex.emoji} <span className="font-medium">{ex.label}</span>
                {ex.example ? <span className="text-gray-600"> — {ex.example}</span> : null}
              </li>
            ))}
          </ul>
          {dashboard.companion_demo_experience.self_love_note ? (
            <p className="mt-3 text-xs text-teal-800">{dashboard.companion_demo_experience.self_love_note}</p>
          ) : null}
        </section>
      ) : null}

      {demoLinks ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/40 p-4">
          <h3 className="text-sm font-semibold">{labels.demoLinksScaffold}</h3>
          {demoLinks.principle ? <p className="mt-1 text-sm text-amber-950">{demoLinks.principle}</p> : null}
          <p className="mt-1 text-xs uppercase tracking-wide text-amber-900">{labels.metadataScaffold}</p>
          {(demoLinks.access_modes ?? []).length > 0 ? (
            <ul className="mt-3 space-y-2 text-sm">
              {demoLinks.access_modes!.map((mode) => (
                <li key={mode.key}>
                  <span className="font-medium">{mode.label}</span>
                  {mode.description ? <span className="text-gray-600"> — {mode.description}</span> : null}
                </li>
              ))}
            </ul>
          ) : null}
          {demoLinks.default_expiry_hours != null ? (
            <p className="mt-2 text-xs text-amber-900">
              {labels.demoLinkExpiry}: {demoLinks.default_expiry_hours}h
            </p>
          ) : null}
          {demoLinks.honest_notice ? (
            <p className="mt-2 text-xs font-medium text-amber-900">{demoLinks.honest_notice}</p>
          ) : null}
          {demoLinks.boundary ? <p className="mt-1 text-xs text-amber-800">{demoLinks.boundary}</p> : null}
          {linksSummary ? (
            <p className="mt-3 text-xs text-gray-600">
              {labels.demoLinksActive}: {linksSummary.active_links_count ?? 0}
              {linksSummary.scaffold_note ? ` — ${linksSummary.scaffold_note}` : ""}
            </p>
          ) : null}
        </section>
      ) : null}

      {dashboard.sales_demo_self_love_connection ? (
        <SelfLoveBlock connection={dashboard.sales_demo_self_love_connection} labels={labels} />
      ) : null}

      {dashboard.sales_demo_trust_connection ? (
        <TrustBlock connection={dashboard.sales_demo_trust_connection} labels={labels} titleKey="demoTrust" />
      ) : null}

      <SuccessCriteriaList
        criteria={dashboard.sales_demo_success_criteria}
        labels={labels}
        title={labels.demoSuccessCriteria}
      />

      <IntegrationLinksList links={dashboard.sales_demo_integration_links} labels={labels} />

      <VisionPhrases phrases={dashboard.sales_demo_vision_phrases} labels={labels} />
    </div>
  );
}

function CertificationFieldEnablementTab({
  dashboard,
  labels,
}: {
  dashboard: SalesExpertEngineDashboard;
  labels: Record<string, string>;
}) {
  const summary = dashboard.sales_certification_summary;
  const pathway = dashboard.sales_training_pathway;
  const simulation = dashboard.sales_simulation_engine;
  const telephone = dashboard.telephone_sales_coaching;
  const assessment = dashboard.assessment_principles;
  const requirements = dashboard.certification_requirements;
  const reassessment = dashboard.reassessment_principles;
  const pricing = dashboard.implementation_pricing_guidance;

  return (
    <div className="space-y-6">
      <BlueprintHeader
        mission={dashboard.sales_certification_mission}
        philosophy={dashboard.sales_certification_philosophy}
        abosPrinciple={dashboard.sales_certification_abos_principle}
        distinctionNote={dashboard.sales_certification_distinction_note}
        labels={labels}
        titleKey="certTitle"
        missionKey="certMission"
        philosophyKey="certPhilosophy"
        abosKey="certAbosPrinciple"
        distinctionKey="certDistinctionNote"
      />

      {summary ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.certSummary}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard label={labels.certCurrentTier} value={summary.current_tier_label ?? "—"} />
            <MetricCard
              label={labels.certAttemptsRemaining}
              value={String(summary.attempts_remaining ?? summary.max_attempts_before_review ?? 3)}
            />
            <MetricCard label={labels.certNextModule} value={summary.next_recommended_module ?? "—"} />
          </div>
          {summary.privacy_note ? <p className="mt-2 text-xs text-gray-500">{summary.privacy_note}</p> : null}
        </section>
      ) : null}

      {pathway?.modules && pathway.modules.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.certTrainingPathway}</h3>
          {pathway.principle ? <p className="mt-1 text-xs text-gray-500">{pathway.principle}</p> : null}
          <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">{labels.metadataScaffold}</p>
          <ol className="mt-3 space-y-3">
            {pathway.modules.map((mod) => (
              <li key={mod.key} className="rounded border border-teal-100 bg-teal-50/40 p-3 text-sm">
                <p className="font-medium">
                  {mod.order}. {mod.label}
                </p>
                {(mod.topics ?? []).length > 0 ? (
                  <p className="mt-1 text-xs text-gray-600">{(mod.topics ?? []).join(" · ")}</p>
                ) : null}
              </li>
            ))}
          </ol>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            {pathway.foundations_route ? (
              <Link href={pathway.foundations_route} className="text-teal-700 underline">
                {labels.foundationsTraining}
              </Link>
            ) : null}
            {pathway.certification_route ? (
              <Link href={pathway.certification_route} className="text-teal-700 underline">
                {labels.certificationPathways}
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}

      {simulation?.scenarios && simulation.scenarios.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.certSimulationEngine}</h3>
          {simulation.principle ? <p className="mt-1 text-xs text-gray-500">{simulation.principle}</p> : null}
          <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">{labels.metadataScaffold}</p>
          <ul className="mt-3 space-y-2 text-sm">
            {simulation.scenarios.map((s) => (
              <li key={s.key}>
                <span className="font-medium">{s.label}</span>
                {s.note ? <span className="text-gray-600"> — {s.note}</span> : null}
              </li>
            ))}
          </ul>
          {simulation.simulation_lab_route ? (
            <Link href={simulation.simulation_lab_route} className="mt-3 inline-block text-sm text-teal-700 underline">
              {labels.certSimulationLab}
            </Link>
          ) : null}
        </section>
      ) : null}

      {telephone?.steps && telephone.steps.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.certTelephoneCoaching}</h3>
          {telephone.principle ? <p className="mt-1 text-xs text-gray-500">{telephone.principle}</p> : null}
          <ol className="mt-3 space-y-2 text-sm">
            {telephone.steps.map((step) => (
              <li key={step.key} className="rounded border border-gray-100 p-3">
                <span className="font-medium">
                  {step.order}. {step.label}
                </span>
                {step.guidance ? <p className="mt-1 text-xs text-gray-600">{step.guidance}</p> : null}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {assessment?.dimensions && assessment.dimensions.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.certAssessmentPrinciples}</h3>
          {assessment.principle ? <p className="mt-1 text-xs text-gray-500">{assessment.principle}</p> : null}
          <ul className="mt-3 space-y-2 text-sm">
            {assessment.dimensions.map((d) => (
              <li key={d.key}>
                <span className="font-medium">{d.label}</span>
                {d.description ? <span className="text-gray-600"> — {d.description}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {requirements?.tiers && requirements.tiers.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.certRequirements}</h3>
          {requirements.principle ? <p className="mt-1 text-xs text-gray-500">{requirements.principle}</p> : null}
          <ul className="mt-3 space-y-3">
            {requirements.tiers.map((tier) => (
              <li key={tier.key} className="rounded border border-emerald-100 bg-emerald-50/40 p-3 text-sm">
                <p className="font-medium">{tier.label}</p>
                {tier.public_label ? <p className="text-xs text-gray-600">{tier.public_label}</p> : null}
                {tier.minimum_score_pct != null ? (
                  <p className="mt-1 text-xs font-medium text-emerald-800">
                    {labels.certTierMinimum}: {tier.minimum_score_pct}%
                  </p>
                ) : null}
                {(tier.requirements ?? []).length > 0 ? (
                  <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
                    {tier.requirements!.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {reassessment ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/40 p-4">
          <h3 className="text-sm font-semibold">{labels.certReassessment}</h3>
          {reassessment.principle ? <p className="mt-1 text-sm text-amber-950">{reassessment.principle}</p> : null}
          {reassessment.max_attempts_before_review != null ? (
            <p className="mt-2 text-xs text-amber-900">
              {labels.certAttemptsRemaining}: {reassessment.max_attempts_before_review}
            </p>
          ) : null}
          {(reassessment.rules ?? []).length > 0 ? (
            <ul className="mt-2 list-inside list-disc text-sm text-amber-950">
              {reassessment.rules!.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.certification_display?.display_surfaces &&
      dashboard.certification_display.display_surfaces.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.certDisplay}</h3>
          {dashboard.certification_display.principle ? (
            <p className="mt-1 text-xs text-gray-500">{dashboard.certification_display.principle}</p>
          ) : null}
          <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">{labels.metadataScaffold}</p>
          <ul className="mt-3 space-y-2 text-sm">
            {dashboard.certification_display.display_surfaces.map((surface) => (
              <li key={surface.key}>
                {surface.route ? (
                  <Link href={surface.route} className="font-medium text-teal-700 underline">
                    {surface.label}
                  </Link>
                ) : (
                  <span className="font-medium">{surface.label}</span>
                )}
                {(surface.fields ?? []).length > 0 ? (
                  <span className="text-gray-600"> — {(surface.fields ?? []).join(", ")}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.email_enablement_center ? (
        <section className="rounded-lg border border-rose-100 bg-rose-50/40 p-4">
          <h3 className="text-sm font-semibold">{labels.certEmailEnablement}</h3>
          {dashboard.email_enablement_center.principle ? (
            <p className="mt-1 text-xs text-gray-600">{dashboard.email_enablement_center.principle}</p>
          ) : null}
          {dashboard.email_enablement_center.mass_unsolicited_outreach === false ? (
            <p className="mt-2 text-sm font-medium text-rose-900">{labels.certNoMassEmail}</p>
          ) : null}
          {dashboard.email_enablement_center.boundary ? (
            <p className="mt-1 text-xs text-rose-800">{dashboard.email_enablement_center.boundary}</p>
          ) : null}
        </section>
      ) : null}

      {pricing?.examples && pricing.examples.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="font-semibold">{labels.certPricingGuidance}</h3>
          {pricing.principle ? <p className="mt-2 text-gray-600">{pricing.principle}</p> : null}
          <p className="mt-1 text-xs font-medium text-gray-500">{labels.certPricingNonBinding}</p>
          <ul className="mt-4 space-y-2">
            {pricing.examples.map((ex) => (
              <li key={ex.key} className="flex justify-between rounded border border-gray-100 p-3">
                <span>
                  {ex.label}
                  {ex.note ? <span className="block text-xs text-gray-500">{ex.note}</span> : null}
                </span>
                <span className="font-medium">
                  {ex.illustrative_price ?? 0} {pricing.currency ?? "NOK"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.installation_experience_journey?.steps &&
      dashboard.installation_experience_journey.steps.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.certInstallationJourney}</h3>
          {dashboard.installation_experience_journey.principle ? (
            <p className="mt-1 text-xs text-gray-500">{dashboard.installation_experience_journey.principle}</p>
          ) : null}
          <ol className="mt-3 space-y-2 text-sm">
            {dashboard.installation_experience_journey.steps.map((step) => (
              <li key={step.key}>
                <span className="font-medium">
                  {step.order}. {step.label}
                </span>
                {step.description ? <span className="text-gray-600"> — {step.description}</span> : null}
              </li>
            ))}
          </ol>
          {dashboard.installation_experience_journey.install_route ? (
            <Link
              href={dashboard.installation_experience_journey.install_route}
              className="mt-3 inline-block text-sm text-teal-700 underline"
            >
              /app/install
            </Link>
          ) : null}
        </section>
      ) : null}

      {dashboard.field_sales_enablement?.nudges && dashboard.field_sales_enablement.nudges.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.certFieldEnablement}</h3>
          {dashboard.field_sales_enablement.principle ? (
            <p className="mt-1 text-xs text-gray-500">{dashboard.field_sales_enablement.principle}</p>
          ) : null}
          <ul className="mt-3 space-y-2 text-sm">
            {dashboard.field_sales_enablement.nudges.map((n) => (
              <li key={n.key}>
                <span className="font-medium">{n.label}</span>
                {n.example ? <span className="text-gray-600"> — {n.example}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.sales_performance_culture?.pillars && dashboard.sales_performance_culture.pillars.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.certPerformanceCulture}</h3>
          {dashboard.sales_performance_culture.principle ? (
            <p className="mt-1 text-xs text-gray-500">{dashboard.sales_performance_culture.principle}</p>
          ) : null}
          <ul className="mt-3 space-y-2 text-sm">
            {dashboard.sales_performance_culture.pillars.map((p) => (
              <li key={p.key}>
                <span className="font-medium">{p.label}</span>
                {p.description ? <span className="text-gray-600"> — {p.description}</span> : null}
              </li>
            ))}
          </ul>
          {(dashboard.sales_performance_culture.avoid ?? []).length > 0 ? (
            <p className="mt-2 text-xs text-gray-500">
              {(dashboard.sales_performance_culture.avoid ?? []).join(" · ")}
            </p>
          ) : null}
        </section>
      ) : null}

      {dashboard.sales_certification_self_love_connection ? (
        <SelfLoveBlock connection={dashboard.sales_certification_self_love_connection} labels={labels} />
      ) : null}

      {dashboard.sales_certification_trust_connection ? (
        <TrustBlock
          connection={dashboard.sales_certification_trust_connection}
          labels={labels}
          titleKey="certTrust"
        />
      ) : null}

      <SuccessCriteriaList
        criteria={dashboard.sales_certification_success_criteria}
        labels={labels}
        title={labels.certSuccessCriteria}
      />

      <IntegrationLinksList links={dashboard.sales_certification_integration_links} labels={labels} />

      <VisionPhrases phrases={dashboard.sales_certification_vision_phrases} labels={labels} />
    </div>
  );
}

function CoachEnablementTab({
  dashboard,
  labels,
}: {
  dashboard: SalesExpertEngineDashboard;
  labels: Record<string, string>;
}) {
  const summary = dashboard.sales_coach_summary;
  const briefing = dashboard.daily_sales_briefing;
  const activities = dashboard.sales_activity_recommendations;
  const insights = dashboard.personal_performance_insights;

  return (
    <div className="space-y-6">
      <BlueprintHeader
        mission={dashboard.sales_coach_mission}
        philosophy={dashboard.sales_coach_philosophy}
        abosPrinciple={dashboard.sales_coach_abos_principle}
        distinctionNote={dashboard.sales_coach_distinction_note}
        labels={labels}
        titleKey="coachTitle"
        missionKey="coachMission"
        philosophyKey="coachPhilosophy"
        abosKey="coachAbosPrinciple"
        distinctionKey="coachDistinctionNote"
      />

      {(dashboard.sales_companion_roles ?? []).length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.coachCompanionRoles}</h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.sales_companion_roles!.map((role) => (
              <li key={role.key} className="rounded border border-teal-100 bg-teal-50/40 p-3 text-sm">
                <p className="font-medium">
                  {role.emoji} {role.label}
                </p>
                {role.description ? <p className="mt-1 text-xs text-gray-600">{role.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {summary ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.coachSummary}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard label={labels.pendingCommissions} value={String(summary.monthly_commissions_pending ?? 0)} />
            <MetricCard label={labels.coachNewCustomers} value={String(summary.new_customers_this_month ?? 0)} />
            <MetricCard label={labels.coachRenewals} value={String(summary.renewal_count ?? 0)} />
            <MetricCard
              label={labels.coachConversionRate}
              value={summary.conversion_rate_pct != null ? `${summary.conversion_rate_pct}%` : "—"}
            />
            <MetricCard label={labels.upcomingFollowUps} value={String(summary.upcoming_follow_ups ?? 0)} />
            <MetricCard label={labels.coachScheduledDemos} value={String(summary.scheduled_demos ?? 0)} />
            <MetricCard label={labels.activeCustomers} value={String(summary.active_customers ?? 0)} />
            <MetricCard
              label={labels.coachSuggestedActions}
              value={String(summary.suggested_next_actions_count ?? 0)}
            />
          </div>
          {summary.privacy_note ? <p className="mt-2 text-xs text-gray-500">{summary.privacy_note}</p> : null}
        </section>
      ) : null}

      {briefing?.items && briefing.items.length > 0 ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/40 p-4">
          <h3 className="text-sm font-semibold">{labels.coachDailyBriefing}</h3>
          <ul className="mt-3 space-y-2 text-sm text-amber-950">
            {briefing.items.map((item) => (
              <li key={item.key ?? item.message}>{item.message}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {activities?.recommendations && activities.recommendations.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.coachActivityRecommendations}</h3>
          {activities.principle ? <p className="mt-1 text-xs text-gray-500">{activities.principle}</p> : null}
          <ul className="mt-3 space-y-2">
            {activities.recommendations.map((rec: ActivityRecommendation) => (
              <li key={rec.key} className="rounded border border-gray-100 p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium">{rec.label}</span>
                  {rec.priority ? (
                    <span className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-600">{rec.priority}</span>
                  ) : null}
                </div>
                {rec.reason ? <p className="mt-1 text-xs text-gray-600">{rec.reason}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.field_sales_coaching?.nudges && dashboard.field_sales_coaching.nudges.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.coachFieldSales}</h3>
          {dashboard.field_sales_coaching.principle ? (
            <p className="mt-1 text-xs text-gray-500">{dashboard.field_sales_coaching.principle}</p>
          ) : null}
          <ul className="mt-3 space-y-2 text-sm">
            {dashboard.field_sales_coaching.nudges.map((n) => (
              <li key={n.key}>
                <span className="font-medium">{n.label}</span>
                {n.example ? <span className="text-gray-600"> — {n.example}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.demonstration_guidance ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.coachDemonstration}</h3>
          <DemoGuidanceBlock guidance={dashboard.demonstration_guidance} labels={labels} />
        </section>
      ) : null}

      {(dashboard.objection_handling_library ?? []).length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.coachObjectionLibrary}</h3>
          <ul className="mt-3 space-y-3">
            {dashboard.objection_handling_library!.map((entry) => (
              <li key={entry.objection} className="rounded border border-gray-100 p-3 text-sm">
                <p className="font-medium text-gray-900">&ldquo;{entry.objection}&rdquo;</p>
                {entry.response ? <p className="mt-1 text-gray-600">{entry.response}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.communication_coaching?.areas && dashboard.communication_coaching.areas.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.coachCommunication}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {dashboard.communication_coaching.areas.map((area) => (
              <li key={area.key}>
                <span className="font-medium">{area.label}</span>
                {area.guidance ? <span className="text-gray-600"> — {area.guidance}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {insights ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.coachPerformanceInsights}</h3>
          {insights.principle ? <p className="mt-1 text-xs text-gray-500">{insights.principle}</p> : null}
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <h4 className="text-xs font-semibold uppercase text-emerald-800">{labels.coachStrengths}</h4>
              <ul className="mt-2 space-y-1 text-sm">
                {(insights.strengths ?? []).map((s) => (
                  <li key={s.key}>
                    {s.label}
                    {s.note ? <span className="block text-xs text-gray-500">{s.note}</span> : null}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase text-sky-800">{labels.coachOpportunities}</h4>
              <ul className="mt-2 space-y-1 text-sm">
                {(insights.opportunities ?? []).map((o) => (
                  <li key={o.key}>
                    {o.label}
                    {o.note ? <span className="block text-xs text-gray-500">{o.note}</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      {dashboard.sales_coach_self_love_connection ? (
        <SelfLoveBlock connection={dashboard.sales_coach_self_love_connection} labels={labels} />
      ) : null}

      {dashboard.sales_coach_bell_moments?.moments && dashboard.sales_coach_bell_moments.moments.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.coachBellMoments}</h3>
          {dashboard.sales_coach_bell_moments.principle ? (
            <p className="mt-1 text-xs text-gray-500">{dashboard.sales_coach_bell_moments.principle}</p>
          ) : null}
          <ul className="mt-3 space-y-2 text-sm">
            {dashboard.sales_coach_bell_moments.moments.map((m) => (
              <li key={m.key}>
                {m.emoji} <span className="font-medium">{m.label}</span>
                {m.example ? <span className="text-gray-600"> — {m.example}</span> : null}
              </li>
            ))}
          </ul>
          {dashboard.sales_coach_bell_moments.phase41_cross_link ? (
            <p className="mt-2 text-xs text-teal-700">{dashboard.sales_coach_bell_moments.phase41_cross_link}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.sales_training_integration ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="font-semibold">{labels.coachTrainingIntegration}</h3>
          {dashboard.sales_training_integration.principle ? (
            <p className="mt-1 text-xs text-gray-500">{dashboard.sales_training_integration.principle}</p>
          ) : null}
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/app/learning-training-engine" className="text-teal-700 underline">
                {dashboard.sales_training_integration.foundations_label ?? labels.foundationsTraining}
              </Link>
            </li>
            <li>
              <Link href="/app/certification-achievement-engine" className="text-teal-700 underline">
                {dashboard.sales_training_integration.certification_label ?? labels.certificationPathways}
              </Link>
            </li>
          </ul>
        </section>
      ) : null}

      {dashboard.roleplay_simulation?.scenarios && dashboard.roleplay_simulation.scenarios.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.coachRoleplay}</h3>
          <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">{labels.metadataScaffold}</p>
          <ul className="mt-3 space-y-2 text-sm">
            {dashboard.roleplay_simulation.scenarios.map((s) => (
              <li key={s.key}>
                <span className="font-medium">{s.label}</span>
                {s.note ? <span className="text-gray-600"> — {s.note}</span> : null}
              </li>
            ))}
          </ul>
          {dashboard.roleplay_simulation.simulation_lab_route ? (
            <Link href={dashboard.roleplay_simulation.simulation_lab_route} className="mt-3 inline-block text-sm text-teal-700 underline">
              {labels.coachSimulationLab}
            </Link>
          ) : null}
        </section>
      ) : null}

      {dashboard.sales_coach_trust_connection ? (
        <TrustBlock connection={dashboard.sales_coach_trust_connection} labels={labels} titleKey="coachTrust" />
      ) : null}

      <SuccessCriteriaList
        criteria={dashboard.sales_coach_success_criteria}
        labels={labels}
        title={labels.coachSuccessCriteria}
      />

      <IntegrationLinksList links={dashboard.sales_coach_integration_links} labels={labels} />

      <VisionPhrases phrases={dashboard.sales_coach_vision_phrases} labels={labels} />
    </div>
  );
}

function BlueprintHeader({
  mission,
  philosophy,
  abosPrinciple,
  distinctionNote,
  labels,
  titleKey,
  missionKey,
  philosophyKey,
  abosKey,
  distinctionKey,
}: {
  mission?: string;
  philosophy?: string;
  abosPrinciple?: string;
  distinctionNote?: string;
  labels: Record<string, string>;
  titleKey: string;
  missionKey: string;
  philosophyKey: string;
  abosKey: string;
  distinctionKey: string;
}) {
  return (
    <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
      <h2 className="text-sm font-semibold text-teal-900">{labels[titleKey]}</h2>
      {mission ? (
        <p className="mt-2 text-sm font-medium text-teal-900">
          {labels[missionKey]}: {mission}
        </p>
      ) : null}
      {philosophy ? (
        <p className="mt-2 text-sm text-teal-900">
          {labels[philosophyKey]}: {philosophy}
        </p>
      ) : null}
      {abosPrinciple ? <p className="mt-2 text-xs text-teal-800">{labels[abosKey]}: {abosPrinciple}</p> : null}
      {distinctionNote ? <p className="mt-2 text-xs text-teal-700">{labels[distinctionKey]}: {distinctionNote}</p> : null}
    </section>
  );
}

function DemoGuidanceBlock({
  guidance,
  labels,
}: {
  guidance: NonNullable<SalesExpertEngineDashboard["demonstration_guidance"]>;
  labels: Record<string, string>;
}) {
  return (
    <div className="mt-3 space-y-4 text-sm">
      {(guidance.checklists ?? []).length > 0 ? (
        <div>
          <h4 className="text-xs font-semibold uppercase text-gray-600">{labels.coachDemoChecklist}</h4>
          <ul className="mt-1 list-inside list-disc">
            {guidance.checklists!.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {(guidance.discovery_questions ?? []).length > 0 ? (
        <div>
          <h4 className="text-xs font-semibold uppercase text-gray-600">{labels.coachDiscoveryQuestions}</h4>
          <ul className="mt-1 list-inside list-disc">
            {guidance.discovery_questions!.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function SelfLoveBlock({
  connection,
  labels,
}: {
  connection: { principle?: string; examples?: Array<{ emoji?: string; example?: string }>; route?: string };
  labels: Record<string, string>;
}) {
  return (
    <section className="rounded-lg border border-rose-100 bg-rose-50/40 p-4 text-sm">
      <h3 className="font-semibold">{labels.selfLove}</h3>
      {connection.principle ? <p className="mt-2 text-gray-700">{connection.principle}</p> : null}
      {(connection.examples ?? []).map((ex) => (
        <p key={ex.example} className="mt-1 text-gray-600">
          {ex.emoji} {ex.example}
        </p>
      ))}
      {connection.route ? (
        <Link href={connection.route} className="mt-3 inline-block text-teal-700 underline">
          {labels.selfLove}
        </Link>
      ) : null}
    </section>
  );
}

function TrustBlock({
  connection,
  labels,
  titleKey,
}: {
  connection: { principle?: string; experts_should_understand?: string[] };
  labels: Record<string, string>;
  titleKey: string;
}) {
  return (
    <section className="rounded-lg border border-gray-200 p-4 text-sm">
      <h3 className="font-semibold">{labels[titleKey]}</h3>
      {connection.principle ? <p className="mt-2 text-gray-600">{connection.principle}</p> : null}
      {(connection.experts_should_understand ?? []).length > 0 ? (
        <ul className="mt-3 list-inside list-disc text-gray-600">
          {connection.experts_should_understand!.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function RenewalExpansionTab({
  dashboard,
  labels,
}: {
  dashboard: SalesExpertEngineDashboard;
  labels: Record<string, string>;
}) {
  const summary = dashboard.renewal_expansion_summary;
  const health = dashboard.customer_health_insights;
  const expansion = dashboard.expansion_opportunities;
  const playbooks = dashboard.renewal_playbooks;
  const celebrations = dashboard.customer_celebration_experiences;
  const churn = dashboard.churn_prevention_support;
  const insights = dashboard.renewal_sales_expert_insights;
  const review = dashboard.success_review_questions;

  return (
    <div className="space-y-6">
      <BlueprintHeader
        mission={dashboard.renewal_expansion_mission}
        philosophy={dashboard.renewal_expansion_philosophy}
        abosPrinciple={dashboard.renewal_expansion_abos_principle}
        distinctionNote={dashboard.renewal_expansion_distinction_note}
        labels={labels}
        titleKey="renewalTitle"
        missionKey="renewalMission"
        philosophyKey="renewalPhilosophy"
        abosKey="renewalAbosPrinciple"
        distinctionKey="renewalDistinctionNote"
      />

      {summary ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.renewalDashboardSummary}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label={labels.renewalUpcomingCount}
              value={String(summary.upcoming_renewals_count ?? 0)}
            />
            <MetricCard
              label={labels.renewalRecentlyRenewedCount}
              value={String(summary.recently_renewed_count ?? 0)}
            />
            <MetricCard
              label={labels.renewalAnniversariesCount}
              value={String(summary.anniversaries_count ?? 0)}
            />
            <MetricCard label={labels.renewalAtRiskCount} value={String(summary.at_risk_count ?? 0)} />
            <MetricCard
              label={labels.renewalReadinessPct}
              value={`${summary.average_readiness_pct ?? 0}%`}
            />
            <MetricCard
              label={labels.renewalRetentionSignal}
              value={summary.retention_signal ?? "—"}
            />
          </div>
          {summary.privacy_note ? <p className="mt-2 text-xs text-gray-500">{summary.privacy_note}</p> : null}
          {summary.commercial_route ? (
            <Link href={summary.commercial_route} className="mt-2 inline-block text-sm text-teal-700 underline">
              {labels.renewalCommercialLink}
            </Link>
          ) : null}
        </section>
      ) : null}

      {(summary?.upcoming_renewals ?? []).length > 0 ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/40 p-4">
          <h3 className="text-sm font-semibold text-amber-900">{labels.renewalUpcomingList}</h3>
          <ul className="mt-3 divide-y divide-amber-100">
            {summary!.upcoming_renewals!.map((item) => (
              <li key={item.customer_id ?? item.org_name} className="flex flex-wrap justify-between gap-2 py-2 text-sm">
                <span className="font-medium">{item.org_name}</span>
                <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(item.status)}`}>
                  {item.status}
                </span>
                <span className="text-xs text-gray-600">
                  {labels.renewalReadinessPct}: {item.readiness_pct ?? 0}%
                  {item.days_until_follow_up != null
                    ? ` · ${item.days_until_follow_up} ${labels.renewalDaysUntilFollowUp}`
                    : null}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.renewal_companion_examples && dashboard.renewal_companion_examples.length > 0 ? (
        <section className="rounded-lg border border-teal-100 bg-teal-50/40 p-4">
          <h3 className="text-sm font-semibold text-teal-900">{labels.renewalCompanionExamples}</h3>
          <ul className="mt-3 space-y-2 text-sm text-teal-900">
            {dashboard.renewal_companion_examples.map((ex) => (
              <li key={ex.example}>
                {ex.emoji ? `${ex.emoji} ` : ""}
                <span className="italic">{ex.example}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.renewal_expansion_objectives && dashboard.renewal_expansion_objectives.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.renewalObjectives}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.renewal_expansion_objectives.map((item) => (
              <li key={item.key ?? item.label} className="text-sm text-gray-600">
                <span className="font-medium text-gray-800">{item.label}</span>
                {item.description ? <span className="text-gray-500"> — {item.description}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {health?.signals && health.signals.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.renewalHealthInsights}</h3>
          {health.principle ? <p className="mt-1 text-xs text-gray-500">{health.principle}</p> : null}
          <ul className="mt-3 space-y-2 text-sm">
            {health.signals.map((s) => (
              <li key={s.key}>
                <span className="font-medium">{s.label}</span>
                {s.description ? <span className="text-gray-600"> — {s.description}</span> : null}
              </li>
            ))}
          </ul>
          {health.commercial_health_cross_link ? (
            <Link href={health.commercial_health_cross_link} className="mt-2 inline-block text-sm text-teal-700 underline">
              {labels.renewalCommercialLink}
            </Link>
          ) : null}
        </section>
      ) : null}

      {review?.categories && review.categories.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.renewalSuccessReview}</h3>
          {review.principle ? <p className="mt-1 text-xs text-gray-500">{review.principle}</p> : null}
          <div className="mt-3 space-y-4">
            {review.categories.map((cat) => (
              <div key={cat.key}>
                <p className="text-sm font-medium">{cat.label}</p>
                <ul className="mt-1 list-inside list-disc text-sm text-gray-600">
                  {(cat.questions ?? []).map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {expansion?.categories && expansion.categories.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.renewalExpansionOpportunities}</h3>
          {expansion.principle ? <p className="mt-1 text-xs text-gray-500">{expansion.principle}</p> : null}
          <ul className="mt-3 space-y-3 text-sm">
            {expansion.categories.map((cat) => (
              <li key={cat.key} className="rounded border border-gray-100 p-3">
                <p className="font-medium">{cat.label}</p>
                {cat.guidance ? <p className="mt-1 text-xs text-gray-600">{cat.guidance}</p> : null}
                {cat.route ? (
                  <Link href={cat.route} className="mt-1 inline-block text-xs text-teal-700 underline">
                    {labels.renewalOpenRoute}
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {playbooks?.milestones && playbooks.milestones.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.renewalPlaybooks}</h3>
          {playbooks.principle ? <p className="mt-1 text-xs text-gray-500">{playbooks.principle}</p> : null}
          <ol className="mt-3 space-y-2 text-sm">
            {playbooks.milestones.map((m) => (
              <li key={m.key} className="rounded border border-teal-100 bg-teal-50/40 p-3">
                <span className="font-medium">{m.label}</span>
                {m.guidance ? <p className="mt-1 text-xs text-gray-600">{m.guidance}</p> : null}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {celebrations?.examples && celebrations.examples.length > 0 ? (
        <section className="rounded-lg border border-rose-100 bg-rose-50/40 p-4">
          <h3 className="text-sm font-semibold text-rose-900">{labels.renewalCelebrations}</h3>
          {celebrations.principle ? <p className="mt-1 text-xs text-rose-700">{celebrations.principle}</p> : null}
          <ul className="mt-3 space-y-2 text-sm text-rose-900">
            {celebrations.examples.map((ex) => (
              <li key={ex.example}>
                {ex.emoji ? `${ex.emoji} ` : ""}
                {ex.example}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {churn ? (
        <section className="rounded-lg border border-sky-100 bg-sky-50/40 p-4">
          <h3 className="text-sm font-semibold text-sky-900">{labels.renewalChurnPrevention}</h3>
          {churn.principle ? <p className="mt-1 text-xs text-sky-800">{churn.principle}</p> : null}
          {(churn.signals ?? []).length > 0 ? (
            <ul className="mt-3 space-y-2 text-sm">
              {churn.signals!.map((s) => (
                <li key={s.key}>
                  <span className="font-medium">{s.label}</span>
                  {s.guidance ? <span className="text-gray-600"> — {s.guidance}</span> : null}
                </li>
              ))}
            </ul>
          ) : null}
          {(churn.companion_examples ?? []).map((ex) => (
            <p key={ex.example} className="mt-2 text-sm italic text-sky-900">
              {ex.emoji ? `${ex.emoji} ` : ""}
              {ex.example}
            </p>
          ))}
          {churn.customer_success_route ? (
            <Link href={churn.customer_success_route} className="mt-2 inline-block text-sm text-sky-800 underline">
              {labels.renewalCustomerSuccessLink}
            </Link>
          ) : null}
        </section>
      ) : null}

      {insights?.dimensions && insights.dimensions.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.renewalSalesExpertInsights}</h3>
          {insights.principle ? <p className="mt-1 text-xs text-gray-500">{insights.principle}</p> : null}
          <ul className="mt-3 space-y-2 text-sm">
            {insights.dimensions.map((d) => (
              <li key={d.key}>
                <span className="font-medium">{d.label}</span>
                {d.description ? <span className="text-gray-600"> — {d.description}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.renewal_expansion_self_love_connection?.principle ? (
        <section className="rounded-lg border border-rose-100 bg-rose-50/40 p-4 text-sm text-rose-900">
          <h3 className="text-sm font-semibold">{labels.selfLoveConnection}</h3>
          <p className="mt-2">{dashboard.renewal_expansion_self_love_connection.principle}</p>
          {dashboard.renewal_expansion_self_love_connection.route ? (
            <Link href={dashboard.renewal_expansion_self_love_connection.route} className="mt-2 inline-block text-teal-700 underline">
              {labels.selfLove}
            </Link>
          ) : null}
        </section>
      ) : null}

      {dashboard.renewal_expansion_trust_connection ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="font-semibold">{labels.trustConnection}</h3>
          <p className="mt-2 text-gray-600">{dashboard.renewal_expansion_trust_connection.principle}</p>
          {(dashboard.renewal_expansion_trust_connection.experts_should_understand ?? []).length > 0 ? (
            <ul className="mt-2 list-inside list-disc text-gray-600">
              {dashboard.renewal_expansion_trust_connection.experts_should_understand!.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      <IntegrationLinksList links={dashboard.renewal_expansion_integration_links} labels={labels} />
      <VisionPhrases phrases={dashboard.renewal_expansion_vision_phrases} labels={labels} />
      <SuccessCriteriaList
        criteria={dashboard.renewal_expansion_success_criteria}
        labels={labels}
        title={labels.renewalSuccessCriteria}
      />
    </div>
  );
}

function SuccessCriteriaList({
  criteria,
  labels,
  title,
}: {
  criteria?: Array<CoachSuccessCriterion | PerformanceSuccessCriterion>;
  labels: Record<string, string>;
  title: string;
}) {
  if (!criteria || criteria.length === 0) return null;
  return (
    <section className="rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-3 space-y-2">
        {criteria.map((c) => (
          <li key={c.key ?? c.label} className="flex items-start gap-2 rounded border border-gray-100 px-3 py-2 text-sm">
            <span className={c.met ? "text-emerald-600" : "text-gray-400"}>{c.met ? "✓" : "○"}</span>
            <div>
              <span className="font-medium">{c.label}</span>
              {c.note ? <p className="mt-0.5 text-xs text-gray-600">{c.note}</p> : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function IntegrationLinksList({
  links,
  labels,
}: {
  links?: IntegrationLink[];
  labels: Record<string, string>;
}) {
  if (!links || links.length === 0) return null;
  return (
    <section className="rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold">{labels.integrationLinks}</h3>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map((link) => (
          <li key={link.key ?? link.route}>
            {link.route ? (
              <Link href={link.route} className="font-medium text-teal-700 hover:underline">
                {link.label}
              </Link>
            ) : (
              <span className="font-medium">{link.label}</span>
            )}
            {link.note ? <p className="text-xs text-gray-500">{link.note}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

function VisionPhrases({
  phrases,
  labels,
}: {
  phrases?: string[];
  labels: Record<string, string>;
}) {
  if (!phrases || phrases.length === 0) return null;
  return (
    <section className="rounded-lg border border-teal-100 bg-teal-50/30 p-4">
      <h3 className="text-sm font-semibold">{labels.visionPhrases}</h3>
      <ul className="mt-3 list-inside list-disc text-sm text-teal-900">
        {phrases.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </section>
  );
}

function PrinciplesTab({
  principles,
  subscription,
  terminology,
  labels,
}: {
  principles?: string[];
  subscription?: SalesExpertEngineDashboard["subscription_principles"];
  terminology?: SalesExpertEngineDashboard["official_terminology"];
  labels: Record<string, string>;
}) {
  return (
    <div className="space-y-4">
      {principles && principles.length > 0 ? (
        <ul className="list-inside list-disc rounded-lg border border-gray-200 p-4 text-sm text-gray-700">
          {principles.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      ) : null}
      {subscription ? (
        <section className="rounded-lg border border-teal-100 bg-teal-50/40 p-4 text-sm">
          <h3 className="font-semibold">{labels.subscriptionPrinciples}</h3>
          <p className="mt-2">
            {subscription.aipify_subscription?.relationship}: {subscription.aipify_subscription?.description}
          </p>
          <p className="mt-2">
            {subscription.consulting_services?.relationship}: {subscription.consulting_services?.description}
          </p>
        </section>
      ) : null}
      {terminology?.tiers && terminology.tiers.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="font-semibold">{labels.officialTiers}</h3>
          <ul className="mt-2 space-y-1">
            {terminology.tiers.map((t) => (
              <li key={t.key}>
                {t.label}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
