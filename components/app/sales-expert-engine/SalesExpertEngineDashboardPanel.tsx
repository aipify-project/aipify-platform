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

type Props = { labels: Record<string, string> };

type TabKey =
  | "dashboard"
  | "customers"
  | "opportunities"
  | "commissions"
  | "training"
  | "coach"
  | "performance"
  | "resources"
  | "email"
  | "services"
  | "principles"
  | "faq";

const TABS: TabKey[] = [
  "dashboard",
  "customers",
  "opportunities",
  "commissions",
  "training",
  "coach",
  "performance",
  "resources",
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

export function SalesExpertEngineDashboardPanel({ labels }: Props) {
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

      {activeTab === "commissions" ? (
        <CommissionsTab
          commissions={commissions}
          commercial={dashboard.commercial_commission_summary}
          labels={labels}
        />
      ) : null}

      {activeTab === "training" ? (
        <TrainingTab training={dashboard.training_center} labels={labels} />
      ) : null}

      {activeTab === "coach" ? (
        <CoachEnablementTab dashboard={dashboard} labels={labels} />
      ) : null}

      {activeTab === "performance" ? (
        <PerformanceRecognitionTab dashboard={dashboard} labels={labels} />
      ) : null}

      {activeTab === "resources" ? (
        <ResourcesTab library={dashboard.resource_library} labels={labels} />
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
