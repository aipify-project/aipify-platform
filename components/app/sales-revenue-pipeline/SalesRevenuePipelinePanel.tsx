"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import {
  parseSalesRevenuePipelineCenter,
  type SalesOpportunity,
  type SalesQuote,
  type SalesRevenuePipelineCenter,
  type SalesRevenuePipelineLabels,
} from "@/lib/sales-revenue-pipeline";

type Tab =
  | "overview"
  | "pipeline"
  | "opportunities"
  | "quotes"
  | "forecasting"
  | "activities"
  | "customers"
  | "reports"
  | "playbooks";

const STAGE_ORDER = [
  "new",
  "qualified",
  "discovery",
  "proposal",
  "negotiation",
  "verbal_agreement",
  "contract_sent",
];

const HEALTH_STYLE: Record<string, string> = {
  healthy: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  stable: "bg-aipify-accent-soft text-aipify-accent ring-aipify-accent-muted",
  attention: "bg-amber-50 text-amber-900 ring-amber-200",
  at_risk: "bg-red-50 text-red-900 ring-red-200",
};

const QUOTE_STATUS_STYLE: Record<string, string> = {
  draft: "bg-aipify-surface-muted text-aipify-text-secondary ring-aipify-border",
  pending_approval: "bg-amber-50 text-amber-900 ring-amber-200",
  approved: "bg-sky-50 text-sky-900 ring-sky-200",
  sent: "bg-aipify-accent-soft text-aipify-accent ring-aipify-accent-muted",
  accepted: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  rejected: "bg-red-50 text-red-900 ring-red-200",
  converted: "bg-violet-50 text-violet-900 ring-violet-200",
};

function formatAmount(amount: number, currency: string) {
  return `${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ${currency}`;
}

function healthLabel(labels: SalesRevenuePipelineLabels, status: string) {
  if (status === "healthy") return labels.healthy;
  if (status === "attention") return labels.attention;
  if (status === "at_risk") return labels.atRisk;
  return labels.stable;
}

function OpportunityCard({
  opp,
  labels,
  busy,
  onAdvance,
  onWon,
  onLost,
}: {
  opp: SalesOpportunity;
  labels: SalesRevenuePipelineLabels;
  busy: boolean;
  onAdvance: (id: string, stage: string) => void;
  onWon: (id: string) => void;
  onLost: (id: string) => void;
}) {
  const stageIdx = STAGE_ORDER.indexOf(opp.stage);
  const nextStage = stageIdx >= 0 && stageIdx < STAGE_ORDER.length - 1 ? STAGE_ORDER[stageIdx + 1] : null;

  return (
    <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs text-aipify-text-muted">{opp.opportunity_number ?? opp.id.slice(0, 8)}</p>
          <h3 className="font-semibold text-aipify-text">{opp.name}</h3>
          <p className="text-aipify-text-secondary">
            {opp.customer_name || "—"} · {formatAmount(opp.value_amount, opp.currency)}
          </p>
          <p className="text-aipify-text-muted">
            {opp.stage.replace(/_/g, " ")} · {opp.probability}% · {formatAmount(opp.weighted_value ?? 0, opp.currency)} weighted
          </p>
          {opp.domain_name ? <p className="text-aipify-text-muted">{opp.domain_name}</p> : null}
          {opp.expected_close_date ? (
            <p className="text-aipify-text-muted">Close {opp.expected_close_date}</p>
          ) : null}
        </div>
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${HEALTH_STYLE[opp.health_status] ?? HEALTH_STYLE.stable}`}
        >
          {healthLabel(labels, opp.health_status)}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {nextStage ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => onAdvance(opp.id, nextStage)}
            className={AipifyShellClasses.secondaryButton}
          >
            {labels.advanceStage}
          </button>
        ) : null}
        <button type="button" disabled={busy} onClick={() => onWon(opp.id)} className={AipifyShellClasses.primaryButton}>
          {labels.markWon}
        </button>
        <button type="button" disabled={busy} onClick={() => onLost(opp.id)} className={AipifyShellClasses.secondaryButton}>
          {labels.markLost}
        </button>
      </div>
    </div>
  );
}

function QuoteCard({
  quote,
  labels,
  busy,
  onSubmit,
  onApprove,
  onAccept,
}: {
  quote: SalesQuote;
  labels: SalesRevenuePipelineLabels;
  busy: boolean;
  onSubmit: (id: string) => void;
  onApprove: (id: string) => void;
  onAccept: (id: string) => void;
}) {
  return (
    <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs text-aipify-text-muted">{quote.quote_number ?? quote.id.slice(0, 8)}</p>
          <h3 className="font-semibold text-aipify-text">{quote.title}</h3>
          <p className="text-aipify-text-secondary">
            {quote.customer_name} · {formatAmount(quote.total_amount, quote.currency)}
          </p>
        </div>
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${QUOTE_STATUS_STYLE[quote.status] ?? QUOTE_STATUS_STYLE.draft}`}
        >
          {quote.status.replace(/_/g, " ")}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {quote.status === "draft" ? (
          <button type="button" disabled={busy} onClick={() => onSubmit(quote.id)} className={AipifyShellClasses.secondaryButton}>
            {labels.submitQuote}
          </button>
        ) : null}
        {quote.status === "pending_approval" ? (
          <button type="button" disabled={busy} onClick={() => onApprove(quote.id)} className={AipifyShellClasses.primaryButton}>
            {labels.approveQuote}
          </button>
        ) : null}
        {["approved", "sent"].includes(quote.status) ? (
          <button type="button" disabled={busy} onClick={() => onAccept(quote.id)} className={AipifyShellClasses.primaryButton}>
            {labels.acceptQuote}
          </button>
        ) : null}
      </div>
    </div>
  );
}

type Props = {
  labels: SalesRevenuePipelineLabels;
  initialTab?: Tab;
};

export function SalesRevenuePipelinePanel({ labels, initialTab = "overview" }: Props) {
  const [center, setCenter] = useState<SalesRevenuePipelineCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>(initialTab);
  const [busy, setBusy] = useState(false);
  const [oppName, setOppName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [amount, setAmount] = useState("");
  const [quoteTitle, setQuoteTitle] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/sales-revenue-pipeline");
    if (res.ok) setCenter(parseSalesRevenuePipelineCenter(await res.json()));
    else setCenter(null);
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
    await fetch("/api/app/sales-revenue-pipeline/action", {
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

  const overview = center.overview ?? {};
  const reports = center.reports ?? {};
  const opportunities = center.opportunities ?? [];
  const quotes = center.quotes ?? [];
  const pipelines = center.pipelines ?? [];
  const forecasting = center.forecasting ?? [];
  const activities = center.activities ?? [];
  const playbooks = center.playbooks ?? [];
  const customers = center.customers ?? [];

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: labels.overview },
    { id: "pipeline", label: labels.pipeline },
    { id: "opportunities", label: labels.opportunities },
    { id: "quotes", label: labels.quotes },
    { id: "forecasting", label: labels.forecasting },
    { id: "activities", label: labels.activities },
    { id: "customers", label: labels.customers },
    { id: "reports", label: labels.reports },
    { id: "playbooks", label: labels.playbooks },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-semibold text-aipify-text">{labels.title}</h1>
        <p className="mt-1 text-sm text-aipify-text-secondary">{labels.subtitle}</p>
        {center.principle ? <p className="mt-2 text-xs text-aipify-text-muted">{center.principle}</p> : null}
      </header>

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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              [labels.openOpportunities, overview.open_opportunities],
              [labels.pipelineValue, formatAmount(Number(overview.pipeline_value ?? 0), "NOK")],
              [labels.weightedForecast, formatAmount(Number(overview.weighted_forecast ?? 0), "NOK")],
              [labels.closedRevenue, formatAmount(Number(overview.closed_revenue_quarter ?? 0), "NOK")],
              [labels.conversionRate, `${overview.conversion_rate ?? 0}%`],
              [labels.upcomingFollowUps, overview.upcoming_follow_ups],
              [labels.forecastAccuracy, `${overview.forecast_accuracy ?? 0}%`],
              [labels.atRiskDeals, overview.at_risk_count],
            ] as [string, string | number][]
          ).map(([label, value]) => (
            <div key={String(label)} className={`${AipifyShellClasses.surfaceCard} p-4`}>
              <p className="text-xs text-aipify-text-muted">{label}</p>
              <p className="mt-1 text-xl font-semibold text-aipify-text">
                {typeof value === "number" || typeof value === "string" ? value : "—"}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "pipeline" ? (
        <div className="grid gap-4 md:grid-cols-2">
          {pipelines.map((pipe) => (
            <div key={pipe.id} className={`${AipifyShellClasses.surfaceCard} p-4`}>
              <h3 className="font-semibold text-aipify-text">{pipe.name}</h3>
              <p className="text-sm text-aipify-text-secondary">{pipe.pipeline_type.replace(/_/g, " ")}</p>
              <p className="mt-2 text-aipify-text">
                {pipe.opportunity_count ?? 0} open · {formatAmount(Number(pipe.pipeline_value ?? 0), "NOK")}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "opportunities" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} grid gap-3 p-4 sm:grid-cols-4`}>
            <input
              value={oppName}
              onChange={(e) => setOppName(e.target.value)}
              placeholder={labels.opportunityName}
              className={AipifyShellClasses.input}
            />
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder={labels.customerName}
              className={AipifyShellClasses.input}
            />
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={labels.amount}
              className={AipifyShellClasses.input}
            />
            <button
              type="button"
              disabled={busy || !oppName.trim()}
              onClick={() =>
                void runAction("create_opportunity", {
                  name: oppName.trim(),
                  customer_name: customerName.trim(),
                  value_amount: Number(amount) || 0,
                }).then(() => {
                  setOppName("");
                  setCustomerName("");
                  setAmount("");
                })
              }
              className={AipifyShellClasses.primaryButton}
            >
              {labels.createOpportunity}
            </button>
          </div>
          {opportunities.length === 0 ? (
            <PlatformEmptyState title={labels.noOpportunities} message={labels.noOpportunitiesHint} />
          ) : (
            <div className="grid gap-3">
              {opportunities.map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  opp={opp}
                  labels={labels}
                  busy={busy}
                  onAdvance={(id, stage) => void runAction("update_opportunity_stage", { opportunity_id: id, stage })}
                  onWon={(id) => void runAction("mark_won", { opportunity_id: id })}
                  onLost={(id) => void runAction("mark_lost", { opportunity_id: id, lost_reason: "Closed lost" })}
                />
              ))}
            </div>
          )}
        </div>
      ) : null}

      {tab === "quotes" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} grid gap-3 p-4 sm:grid-cols-3`}>
            <input
              value={quoteTitle}
              onChange={(e) => setQuoteTitle(e.target.value)}
              placeholder={labels.createQuote}
              className={AipifyShellClasses.input}
            />
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder={labels.customerName}
              className={AipifyShellClasses.input}
            />
            <button
              type="button"
              disabled={busy || !quoteTitle.trim()}
              onClick={() =>
                void runAction("create_quote", {
                  title: quoteTitle.trim(),
                  customer_name: customerName.trim(),
                  total_amount: Number(amount) || 0,
                }).then(() => {
                  setQuoteTitle("");
                  setCustomerName("");
                })
              }
              className={AipifyShellClasses.primaryButton}
            >
              {labels.createQuote}
            </button>
          </div>
          {quotes.length === 0 ? (
            <PlatformEmptyState title={labels.noQuotes} message={labels.noOpportunitiesHint} />
          ) : (
            <div className="grid gap-3">
              {quotes.map((quote) => (
                <QuoteCard
                  key={quote.id}
                  quote={quote}
                  labels={labels}
                  busy={busy}
                  onSubmit={(id) => void runAction("submit_quote", { quote_id: id })}
                  onApprove={(id) => void runAction("approve_quote", { quote_id: id })}
                  onAccept={(id) => void runAction("accept_quote", { quote_id: id })}
                />
              ))}
            </div>
          )}
        </div>
      ) : null}

      {tab === "forecasting" ? (
        <div className="space-y-4">
          <button
            type="button"
            disabled={busy}
            onClick={() => void runAction("refresh_forecast")}
            className={AipifyShellClasses.primaryButton}
          >
            {labels.refreshForecast}
          </button>
          <div className="grid gap-3">
            {forecasting.map((f) => (
              <div key={String(f.id)} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <h3 className="font-semibold text-aipify-text">{String(f.period_label ?? "")}</h3>
                <p className="text-aipify-text-secondary">
                  Expected {formatAmount(Number(f.expected_revenue ?? 0), "NOK")} · Weighted{" "}
                  {formatAmount(Number(f.weighted_revenue ?? 0), "NOK")} · Closed{" "}
                  {formatAmount(Number(f.closed_revenue ?? 0), "NOK")}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {tab === "activities" ? (
        <div className="grid gap-3">
          {activities.map((a) => (
            <div key={String(a.id)} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="text-xs text-aipify-text-muted">{String(a.activity_type ?? "").replace(/_/g, " ")}</p>
              <h3 className="font-semibold text-aipify-text">{String(a.title ?? "")}</h3>
              <p className="text-aipify-text-secondary">{String(a.opportunity_name ?? "")}</p>
              {a.summary ? <p className="text-aipify-text-muted">{String(a.summary)}</p> : null}
            </div>
          ))}
        </div>
      ) : null}

      {tab === "customers" ? (
        <div className="grid gap-3">
          {customers.map((c) => (
            <div key={String(c.id)} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <h3 className="font-semibold text-aipify-text">{String(c.company_name ?? c.name ?? "")}</h3>
              <p className="text-aipify-text-secondary">
                {String(c.open_opportunities ?? 0)} open opportunities · {String(c.status ?? "")}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "reports" ? (
        <div className={`${AipifyShellClasses.surfaceCard} space-y-3 p-4 text-sm`}>
          <p>
            {labels.pipelineValue}: {formatAmount(Number(reports.pipeline_value ?? 0), "NOK")}
          </p>
          <p>
            {labels.weightedForecast}: {formatAmount(Number(reports.weighted_forecast ?? 0), "NOK")}
          </p>
          <p>
            Win rate: {String(reports.win_rate ?? 0)}%
          </p>
        </div>
      ) : null}

      {tab === "playbooks" ? (
        <div className="grid gap-3 md:grid-cols-2">
          {playbooks.map((pb) => (
            <div key={String(pb.id)} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <h3 className="font-semibold text-aipify-text">{String(pb.title ?? "")}</h3>
              <p className="text-aipify-text-secondary">{String(pb.playbook_type ?? "").replace(/_/g, " ")}</p>
              {pb.description ? <p className="mt-2 text-aipify-text-muted">{String(pb.description)}</p> : null}
            </div>
          ))}
        </div>
      ) : null}

      {center.audit_recent && center.audit_recent.length > 0 ? (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-aipify-text">{labels.auditLog}</h2>
          <ul className={`${AipifyShellClasses.surfaceCard} divide-y divide-aipify-border text-sm`}>
            {center.audit_recent.map((entry, i) => (
              <li key={`${entry.action}-${i}`} className="px-4 py-2 text-aipify-text-secondary">
                {entry.summary}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
